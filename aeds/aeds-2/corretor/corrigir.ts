import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { compararSaidas, porcentagem, type ModoComparacao } from './comparar';
import { driversPorDrill } from './drivers';
import { compilar, executar, javaDisponivel } from './executarJava';
import { montarPrograma } from './montarPrograma';
import { gerarEntradasPrivadas, VERSAO_GERADORES } from './testesPrivados';
import type { CasoResultado, CasoTeste, DrillCorrigivel, GrupoResultado, ResultadoCorrecao } from './tipos';

/**
 * Corretor estilo Verde: compila o codigo do aluno e roda contra
 *  - a saida PUBLICA: os exemplos oficiais do problema (o aluno ve tudo);
 *  - a saida PRIVADA: casos gerados em testesPrivados.ts, com a resposta
 *    esperada calculada rodando a solucao modelo (o aluno so ve a nota).
 * A nota de cada grupo e a porcentagem de linhas certas.
 */

const PASTA_BASE = join(tmpdir(), 'aeds2-corretor');
const PARALELO = 4;

/** Limite de tempo local: o do juiz com folga para a partida da JVM (que o juiz nao conta). */
export function limiteLocalMs(drill: DrillCorrigivel): number {
  const segundos = Number.parseFloat(drill.judge?.timeLimit ?? '1') || 1;
  return Math.max(3000, Math.round(segundos * 1000 * 2 + 1500));
}

export function solucaoModelo(drill: DrillCorrigivel): string {
  const solucao = drill.step.solution ?? drill.step.variants?.[0]?.solution;
  if (!solucao) {
    throw new Error(`Drill ${drill.id} nao tem solucao modelo.`);
  }
  return solucao;
}

function modoDe(drill: DrillCorrigivel): ModoComparacao {
  return drill.judge?.site === 'beecrowd' ? 'estrito' : 'valores';
}

async function emParalelo<T, R>(itens: T[], limite: number, fn: (item: T, indice: number) => Promise<R>): Promise<R[]> {
  const resp: R[] = new Array(itens.length);
  let proximo = 0;
  const trabalhador = async () => {
    while (proximo < itens.length) {
      const indice = proximo;
      proximo++;
      resp[indice] = await fn(itens[indice], indice);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limite, itens.length) }, trabalhador));
  return resp;
}

type Compilado = { ok: true; dir: string; classe: string } | { ok: false; mensagem: string };

async function compilarEm(drill: DrillCorrigivel, codigo: string): Promise<Compilado> {
  await mkdir(PASTA_BASE, { recursive: true });
  const dir = await mkdtemp(join(PASTA_BASE, 'exec-'));
  const programa = montarPrograma(drill.scaffold, codigo, driversPorDrill[drill.id]);
  await writeFile(join(dir, programa.arquivo), programa.codigo, 'utf8');
  const compilacao = await compilar(dir, programa.arquivo);
  if (!compilacao.ok) {
    await rm(dir, { recursive: true, force: true });
    return { ok: false, mensagem: compilacao.mensagem };
  }
  return { ok: true, dir, classe: programa.classePrincipal };
}

// ---------- casos privados (com cache da saida esperada) ----------

const cacheMemoria = new Map<string, Promise<CasoTeste[]>>();

function chaveCache(drill: DrillCorrigivel, entradas: string[]): string {
  const h = createHash('sha256');
  h.update(String(VERSAO_GERADORES));
  h.update(drill.scaffold);
  h.update(solucaoModelo(drill));
  h.update(driversPorDrill[drill.id] ?? '');
  for (const entrada of entradas) {
    h.update('\u0000');
    h.update(entrada);
  }
  return `${drill.id}-${h.digest('hex').slice(0, 16)}`;
}

async function calcularCasosPrivados(drill: DrillCorrigivel, entradas: string[], chave: string): Promise<CasoTeste[]> {
  const arquivoCache = join(PASTA_BASE, 'cache', `${chave}.json`);
  try {
    const esperados = JSON.parse(await readFile(arquivoCache, 'utf8')) as string[];
    if (esperados.length === entradas.length) {
      return entradas.map((entrada, i) => ({ entrada, esperado: esperados[i] }));
    }
  } catch {
    // sem cache: calcula abaixo
  }
  const compilado = await compilarEm(drill, solucaoModelo(drill));
  if (!compilado.ok) {
    throw new Error(`A solucao modelo de ${drill.id} nao compila:\n${compilado.mensagem}`);
  }
  try {
    const esperados = await emParalelo(entradas, PARALELO, async (entrada, i) => {
      const execucao = await executar(compilado.dir, compilado.classe, entrada, 60000);
      if (execucao.estourouTempo || execucao.codigo !== 0) {
        throw new Error(`A solucao modelo de ${drill.id} falhou no caso privado ${i + 1}: ${execucao.erro || 'tempo esgotado'}`);
      }
      return execucao.saida;
    });
    await mkdir(join(PASTA_BASE, 'cache'), { recursive: true });
    await writeFile(arquivoCache, JSON.stringify(esperados), 'utf8');
    return entradas.map((entrada, i) => ({ entrada, esperado: esperados[i] }));
  } finally {
    await rm(compilado.dir, { recursive: true, force: true });
  }
}

export function casosPrivados(drill: DrillCorrigivel): Promise<CasoTeste[]> {
  const entradas = gerarEntradasPrivadas(drill.id);
  if (entradas.length === 0) {
    return Promise.resolve([]);
  }
  const chave = chaveCache(drill, entradas);
  let promessa = cacheMemoria.get(chave);
  if (!promessa) {
    promessa = calcularCasosPrivados(drill, entradas, chave);
    promessa.catch(() => cacheMemoria.delete(chave));
    cacheMemoria.set(chave, promessa);
  }
  return promessa;
}

export function casosPublicos(drill: DrillCorrigivel): CasoTeste[] {
  return (drill.samples ?? []).map((sample) => ({ entrada: sample.input, esperado: sample.output }));
}

// ---------- correcao ----------

async function rodarCaso(
  dir: string,
  classe: string,
  caso: CasoTeste,
  limiteMs: number,
  modo: ModoComparacao,
  publico: boolean,
): Promise<CasoResultado> {
  const execucao = await executar(dir, classe, caso.entrada, limiteMs);
  const comparacao = compararSaidas(caso.esperado, execucao.saida, modo);
  const pct = porcentagem(comparacao.linhasCertas, comparacao.totalLinhas);
  let status: CasoResultado['status'] = pct === 100 ? 'correto' : 'errado';
  let erro: string | undefined;
  if (execucao.estourouTempo) {
    status = 'tempo-excedido';
    erro = `Passou do limite de ${(limiteMs / 1000).toFixed(1)}s (inclui a partida da JVM).`;
  } else if (execucao.codigo !== 0) {
    status = 'erro-execucao';
    erro = execucao.erro.split('\n').slice(0, 8).join('\n') || `O programa terminou com codigo ${execucao.codigo}.`;
  }
  const resultado: CasoResultado = {
    status,
    porcentagem: status === 'tempo-excedido' ? 0 : pct,
    tempoMs: execucao.tempoMs,
    erro,
  };
  if (comparacao.soEspacos && status === 'errado') {
    resultado.dica = 'A diferenca e so de espacos ou linhas em branco (no beecrowd isso e "Presentation Error").';
  }
  if (publico) {
    resultado.entrada = caso.entrada;
    resultado.esperado = caso.esperado;
    resultado.obtido = execucao.saida.length > 20000 ? `${execucao.saida.slice(0, 20000)}\n...` : execucao.saida;
  }
  return resultado;
}

function agrupar(casos: CasoResultado[], pesos: number[]): GrupoResultado {
  // Nota do grupo: media das porcentagens ponderada pelo numero de linhas esperadas de cada caso.
  let soma = 0;
  let totalPeso = 0;
  casos.forEach((caso, i) => {
    soma += caso.porcentagem * pesos[i];
    totalPeso += pesos[i];
  });
  const media = totalPeso === 0 ? 0 : soma / totalPeso;
  const todosCertos = casos.every((caso) => caso.status === 'correto');
  return {
    porcentagem: casos.length === 0 ? 100 : todosCertos ? 100 : Math.min(99, Math.floor(media)),
    casosCorretos: casos.filter((caso) => caso.status === 'correto').length,
    totalCasos: casos.length,
    casos,
  };
}

function pesoDe(caso: CasoTeste): number {
  return Math.max(1, caso.esperado.replace(/\r\n?/g, '\n').replace(/\n+$/, '').split('\n').length);
}

export async function corrigir(drill: DrillCorrigivel, codigoAluno: string): Promise<ResultadoCorrecao> {
  if (!drill.samples || drill.samples.length === 0) {
    return { status: 'indisponivel', mensagem: 'Este exercicio ainda nao tem casos de teste para o corretor.' };
  }
  if (drill.judge?.site !== 'beecrowd' && !driversPorDrill[drill.id]) {
    return { status: 'indisponivel', mensagem: 'Este exercicio ainda nao tem driver de execucao no corretor.' };
  }
  if (codigoAluno.trim() === '') {
    return { status: 'indisponivel', mensagem: 'Escreva o codigo antes de rodar.' };
  }
  if (!(await javaDisponivel())) {
    return {
      status: 'indisponivel',
      mensagem: 'JDK nao encontrado: o corretor precisa de "javac" e "java" no PATH da maquina que roda o "npm run dev".',
    };
  }

  let privados: CasoTeste[];
  try {
    privados = await casosPrivados(drill);
  } catch (erro) {
    return { status: 'indisponivel', mensagem: `Erro ao preparar os casos privados: ${String(erro)}` };
  }
  const publicos = casosPublicos(drill);

  const compilado = await compilarEm(drill, codigoAluno);
  if (!compilado.ok) {
    return { status: 'erro-compilacao', mensagem: compilado.mensagem };
  }
  try {
    const limiteMs = limiteLocalMs(drill);
    const modo = modoDe(drill);
    const todos = [...publicos.map((caso) => ({ caso, publico: true })), ...privados.map((caso) => ({ caso, publico: false }))];
    const resultados = await emParalelo(todos, PARALELO, (item) =>
      rodarCaso(compilado.dir, compilado.classe, item.caso, limiteMs, modo, item.publico),
    );
    return {
      status: 'executado',
      publica: agrupar(resultados.slice(0, publicos.length), publicos.map(pesoDe)),
      privada: agrupar(resultados.slice(publicos.length), privados.map(pesoDe)),
      limiteMs,
    };
  } finally {
    await rm(compilado.dir, { recursive: true, force: true });
  }
}
