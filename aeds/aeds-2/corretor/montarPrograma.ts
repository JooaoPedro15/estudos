/**
 * Monta o arquivo .java que vai ser compilado a partir do esqueleto do
 * exercicio e do que o aluno escreveu. Aceita dois jeitos de responder:
 *
 *  1. So os metodos (o formato do treino): cada metodo do aluno substitui o
 *     "stub" de mesmo nome do esqueleto (metodo cujo corpo so tem
 *     comentario, tipo "// implementar"); metodos extras sao acrescentados
 *     no fim da classe.
 *  2. O programa/classe inteira (como se submete no Verde/beecrowd): se o
 *     texto declara uma classe no nivel de cima, ele e usado no lugar do
 *     esqueleto.
 *
 * Exercicios do LeetCode/Codewars nao tem main: o corretor junta um
 * "driver" (public class Main) que le a entrada no formato do site, chama
 * o metodo e imprime o retorno.
 */

export type ProgramaMontado = {
  /** Nome do arquivo (tem que bater com a classe public). */
  arquivo: string;
  /** Classe com o main que o `java` executa. */
  classePrincipal: string;
  codigo: string;
};

const PALAVRAS_DE_CONTROLE = new Set(['if', 'for', 'while', 'switch', 'catch', 'synchronized', 'return', 'new', 'else', 'do', 'try']);

const CABECALHO_METODO = /(\w+)\s*\([^;{}()]*(?:\([^()]*\)[^;{}()]*)*\)\s*(?:throws\s+[\w.,\s]+)?\{\s*$/;

const IMPORT = /^\s*import\s+(?:static\s+)?[\w.]+(?:\.\*)?\s*;\s*$/;

/** Remove comentarios de linha e de bloco (para detectar declaracoes sem falso positivo). */
function semComentarios(codigo: string): string {
  return codigo.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
}

/** Nomes de metodos/construtores declarados no texto do aluno. */
export function metodosDeclarados(codigo: string): Set<string> {
  const nomes = new Set<string>();
  for (const linha of semComentarios(codigo).split('\n')) {
    const achou = CABECALHO_METODO.exec(linha.trim());
    if (achou && !PALAVRAS_DE_CONTROLE.has(achou[1])) {
      nomes.add(achou[1]);
    }
  }
  // Cabecalho quebrado em duas linhas ("... foo(int a)\n{") tambem conta.
  const multilinha = /(\w+)\s*\([^;{}]*\)\s*(?:throws\s+[\w.,\s]+)?\n\s*\{/g;
  let m: RegExpExecArray | null;
  const limpo = semComentarios(codigo);
  while ((m = multilinha.exec(limpo)) !== null) {
    if (!PALAVRAS_DE_CONTROLE.has(m[1])) {
      nomes.add(m[1]);
    }
  }
  return nomes;
}

/** O aluno mandou uma classe inteira (declaracao de classe no comeco de linha, fora de comentario)? */
export function declaraClasse(codigo: string): boolean {
  return /^\s*(?:public\s+|final\s+|abstract\s+)*class\s+\w+/m.test(semComentarios(codigo));
}

type Stub = { nome: string; inicio: number; fim: number };

/** Metodos do esqueleto cujo corpo e so comentario/linha em branco. */
export function stubsDoEsqueleto(esqueleto: string): Stub[] {
  const linhas = esqueleto.split('\n');
  const stubs: Stub[] = [];
  for (let i = 0; i < linhas.length; i++) {
    const cabecalho = CABECALHO_METODO.exec(linhas[i].trim());
    if (!cabecalho || PALAVRAS_DE_CONTROLE.has(cabecalho[1])) {
      continue;
    }
    let j = i + 1;
    let soComentario = true;
    while (j < linhas.length && linhas[j].trim() !== '}') {
      const t = linhas[j].trim();
      if (t !== '' && !t.startsWith('//') && !t.startsWith('/*') && !t.startsWith('*')) {
        soComentario = false;
        break;
      }
      j++;
    }
    if (soComentario && j < linhas.length) {
      stubs.push({ nome: cabecalho[1], inicio: i, fim: j });
      i = j;
    }
  }
  return stubs;
}

function separarImports(codigo: string): { imports: string[]; corpo: string } {
  const imports: string[] = [];
  const corpo: string[] = [];
  for (const linha of codigo.split('\n')) {
    if (IMPORT.test(linha)) {
      imports.push(linha.trim());
    } else {
      corpo.push(linha);
    }
  }
  return { imports, corpo: corpo.join('\n') };
}

/** Encaixa os metodos do aluno no esqueleto (formato "so os metodos"). */
function encaixarMetodos(esqueleto: string, codigoAluno: string): string {
  const declarados = metodosDeclarados(codigoAluno);
  const linhas = esqueleto.split('\n');
  const remover = new Set<number>();
  for (const stub of stubsDoEsqueleto(esqueleto)) {
    if (declarados.has(stub.nome)) {
      for (let k = stub.inicio; k <= stub.fim; k++) {
        remover.add(k);
      }
    }
  }
  const restantes = linhas.filter((_, indice) => !remover.has(indice));
  const texto = restantes.join('\n');
  const fechaClasse = texto.lastIndexOf('}');
  if (fechaClasse === -1) {
    return `${texto}\n${codigoAluno}\n`;
  }
  return `${texto.slice(0, fechaClasse)}\n  // ---- codigo do aluno ----\n${codigoAluno}\n}\n`;
}

function nomeDaClassePublica(codigo: string): string | null {
  const publica = /^\s*public\s+(?:final\s+|abstract\s+)*class\s+(\w+)/m.exec(semComentarios(codigo));
  return publica ? publica[1] : null;
}

function nomeDaClasseComMain(codigo: string): string | null {
  const limpo = semComentarios(codigo);
  const regex = /class\s+(\w+)/g;
  let achou: RegExpExecArray | null;
  let resp: string | null = null;
  while ((achou = regex.exec(limpo)) !== null && resp === null) {
    const resto = limpo.slice(achou.index);
    const proximaClasse = resto.slice(1).search(/\bclass\s+\w+/);
    const trecho = proximaClasse === -1 ? resto : resto.slice(0, proximaClasse + 1);
    if (/static\s+void\s+main\s*\(/.test(trecho)) {
      resp = achou[1];
    }
  }
  return resp;
}

export function montarPrograma(esqueleto: string, codigoAluno: string, driver?: string): ProgramaMontado {
  const base = declaraClasse(codigoAluno) ? codigoAluno : encaixarMetodos(esqueleto, codigoAluno);
  const { imports, corpo } = separarImports(base);

  if (driver) {
    // Varias classes no mesmo arquivo: so a Main (do driver) pode ser public.
    const semPublic = corpo.replace(/^(\s*)public\s+((?:final\s+|abstract\s+)*class\s)/gm, '$1$2');
    const todosImports = new Set(['import java.util.*;', 'import java.io.*;', ...imports]);
    const codigo = `${[...todosImports].join('\n')}\n\n${driver.trim()}\n\n${semPublic.trim()}\n`;
    return { arquivo: 'Main.java', classePrincipal: 'Main', codigo };
  }

  const codigo = `${[...new Set(imports)].join('\n')}\n\n${corpo.trim()}\n`;
  const publica = nomeDaClassePublica(codigo);
  const classe = publica ?? nomeDaClasseComMain(codigo) ?? 'Principal';
  return { arquivo: `${classe}.java`, classePrincipal: classe, codigo };
}
