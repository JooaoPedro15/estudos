/**
 * Calculos da materia, do jeito que a professora faz nos slides:
 * entropia/ganho (ID3), razao de ganho (C4.5), Gini (CART), metricas da
 * matriz de confusao, suporte/confianca/lift e Naive Bayes com normalizacao.
 *
 * Tudo aqui e puro (sem estado) e e usado tanto pelas ferramentas quanto
 * pelas respostas das questoes numericas — assim o gabarito sai do mesmo
 * codigo que os testes conferem.
 */

export function log2(x: number): number {
  return Math.log(x) / Math.LN2;
}

const soma = (valores: number[]): number => valores.reduce((acc, v) => acc + v, 0);

/** Entropia(S) = -Σ p_i log2 p_i, com 0·log 0 = 0. */
export function entropia(contagens: number[]): number {
  const n = soma(contagens);
  if (n === 0) return 0;
  let h = 0;
  for (const c of contagens) {
    if (c > 0) {
      const p = c / n;
      h -= p * log2(p);
    }
  }
  return h === 0 ? 0 : h;
}

/** Σ |S_v|/|S| · Entropia(S_v): a "entropia do atributo" dos slides. */
export function entropiaPonderada(grupos: number[][]): number {
  const n = soma(grupos.map(soma));
  if (n === 0) return 0;
  return soma(grupos.map((g) => (soma(g) / n) * entropia(g)));
}

/** Contagem de cada classe somando todos os grupos. */
export function totalPorClasse(grupos: number[][]): number[] {
  const k = Math.max(0, ...grupos.map((g) => g.length));
  return Array.from({ length: k }, (_, i) => soma(grupos.map((g) => g[i] ?? 0)));
}

/** ganho(atributo) = Entropia(classe) - Entropia(atributo). */
export function ganhoInformacao(grupos: number[][]): number {
  return entropia(totalPorClasse(grupos)) - entropiaPonderada(grupos);
}

/** split-info = -Σ |T_i|/|T| log2 |T_i|/|T| (C4.5). */
export function splitInfo(grupos: number[][]): number {
  return entropia(grupos.map(soma));
}

/** gain-ratio = ganho / split-info (C4.5). */
export function razaoGanho(grupos: number[][]): number {
  const si = splitInfo(grupos);
  return si === 0 ? 0 : ganhoInformacao(grupos) / si;
}

/** Gini(S) = 1 - Σ p_i² (CART). */
export function gini(contagens: number[]): number {
  const n = soma(contagens);
  if (n === 0) return 0;
  return 1 - soma(contagens.map((c) => (c / n) ** 2));
}

/** Gini_pond = Σ |S_v|/|S| · Gini(S_v). */
export function giniPonderado(grupos: number[][]): number {
  const n = soma(grupos.map(soma));
  if (n === 0) return 0;
  return soma(grupos.map((g) => (soma(g) / n) * gini(g)));
}

/** Ganho Gini = Gini(S) - Gini_pond. */
export function ganhoGini(grupos: number[][]): number {
  return gini(totalPorClasse(grupos)) - giniPonderado(grupos);
}

export type Particao = {
  valores: string[];
  classes: string[];
  /** grupos[v][c] = quantas instancias tem valor v e classe c. */
  grupos: number[][];
};

/** Monta a tabela de contagem (valor do atributo x classe) a partir das linhas. */
export function particionar(linhas: string[][], atributo: number, classe = -1): Particao {
  const idxClasse = (linha: string[]) => (classe < 0 ? linha.length + classe : classe);
  const valores: string[] = [];
  const classes: string[] = [];
  for (const linha of linhas) {
    if (!valores.includes(linha[atributo])) valores.push(linha[atributo]);
    const c = linha[idxClasse(linha)];
    if (!classes.includes(c)) classes.push(c);
  }
  const grupos = valores.map((v) =>
    classes.map((c) => linhas.filter((l) => l[atributo] === v && l[idxClasse(l)] === c).length),
  );
  return { valores, classes, grupos };
}

/* ------------------------------------------------------------------ */
/* Matriz de confusao (linhas = classe real, colunas = classe predita) */
/* ------------------------------------------------------------------ */

export type MetricasClasse = {
  vp: number;
  fn: number;
  fp: number;
  vn: number;
  /** quantas sao realmente da classe (soma da linha) */
  reais: number;
  /** quantas NAO sao da classe (soma das outras linhas) */
  outras: number;
  tvp: number;
  tfn: number;
  tfp: number;
  tvn: number;
  precisao: number;
  recall: number;
  f1: number;
};

export type MetricasMatriz = { classes: MetricasClasse[]; acuracia: number; total: number };

export function metricasConfusao(matriz: number[][]): MetricasMatriz {
  const n = matriz.length;
  const total = soma(matriz.map(soma));
  const classes = matriz.map((linha, i) => {
    const vp = linha[i];
    const reais = soma(linha);
    const fn = reais - vp;
    const predita = soma(matriz.map((l) => l[i]));
    const fp = predita - vp;
    const outras = total - reais;
    const vn = outras - fp;
    const precisao = predita === 0 ? 0 : vp / predita;
    const recall = reais === 0 ? 0 : vp / reais;
    const f1 = precisao + recall === 0 ? 0 : (2 * precisao * recall) / (precisao + recall);
    return {
      vp,
      fn,
      fp,
      vn,
      reais,
      outras,
      tvp: reais === 0 ? 0 : vp / reais,
      tfn: reais === 0 ? 0 : fn / reais,
      tfp: outras === 0 ? 0 : fp / outras,
      tvn: outras === 0 ? 0 : vn / outras,
      precisao,
      recall,
      f1,
    };
  });
  const acertos = soma(Array.from({ length: n }, (_, i) => matriz[i][i]));
  return { classes, acuracia: total === 0 ? 0 : acertos / total, total };
}

/** F1 com pesos diferentes, como no slide: (w+1)·R·P / (R + w·P). */
export function f1Ponderado(precisao: number, recall: number, w: number): number {
  const den = recall + w * precisao;
  return den === 0 ? 0 : ((w + 1) * recall * precisao) / den;
}

/* ------------------------------------------------------------------ */
/* Regras de associacao                                               */
/* ------------------------------------------------------------------ */

export type Transacao = ReadonlySet<string>;

export function contarSuporte(transacoes: Transacao[], itens: readonly string[]): number {
  return transacoes.filter((t) => itens.every((i) => t.has(i))).length;
}

export function suporte(transacoes: Transacao[], itens: readonly string[]): number {
  return transacoes.length === 0 ? 0 : contarSuporte(transacoes, itens) / transacoes.length;
}

/** confianca(A → B) = suporte(A ∪ B) / suporte(A). */
export function confianca(transacoes: Transacao[], a: readonly string[], b: readonly string[]): number {
  const sa = contarSuporte(transacoes, a);
  return sa === 0 ? 0 : contarSuporte(transacoes, [...a, ...b]) / sa;
}

/** lift(A → B) = confianca(A → B) / suporte(B). */
export function lift(transacoes: Transacao[], a: readonly string[], b: readonly string[]): number {
  const sb = suporte(transacoes, b);
  return sb === 0 ? 0 : confianca(transacoes, a, b) / sb;
}

export type ItemsetFrequente = { itens: string[]; contagem: number; suporte: number };

/**
 * Fase 1 do Apriori: gera os itemsets nivel a nivel. Candidatos do nivel k
 * so sao montados a partir de itemsets frequentes do nivel k-1 (todo
 * subconjunto de um itemset frequente e frequente).
 */
export function aprioriItemsets(transacoes: Transacao[], suporteMinimo: number): ItemsetFrequente[][] {
  const itens = [...new Set(transacoes.flatMap((t) => [...t]))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const n = transacoes.length;
  const niveis: ItemsetFrequente[][] = [];
  let candidatos: string[][] = itens.map((i) => [i]);
  while (candidatos.length > 0) {
    const frequentes = candidatos
      .map((c) => ({ itens: c, contagem: contarSuporte(transacoes, c) }))
      .map((c) => ({ ...c, suporte: n === 0 ? 0 : c.contagem / n }))
      .filter((c) => c.suporte >= suporteMinimo - 1e-12);
    if (frequentes.length === 0) break;
    niveis.push(frequentes);
    const chaves = new Set(frequentes.map((f) => f.itens.join('|')));
    const proximos: string[][] = [];
    for (let i = 0; i < frequentes.length; i++) {
      for (let j = i + 1; j < frequentes.length; j++) {
        const a = frequentes[i].itens;
        const b = frequentes[j].itens;
        if (a.slice(0, -1).join('|') !== b.slice(0, -1).join('|')) continue;
        const novo = [...a, b[b.length - 1]].sort((x, y) => x.localeCompare(y, 'pt-BR'));
        const todosSubFrequentes = novo.every((_, k) => chaves.has(novo.filter((__, m) => m !== k).join('|')));
        if (todosSubFrequentes) proximos.push(novo);
      }
    }
    candidatos = proximos;
  }
  return niveis;
}

export type Regra = { antecedente: string[]; consequente: string[]; suporte: number; confianca: number; lift: number };

/** Fase 2 do Apriori: todas as regras de cada itemset (tamanho >= 2) com confianca minima. */
export function aprioriRegras(transacoes: Transacao[], niveis: ItemsetFrequente[][], confiancaMinima: number): Regra[] {
  const regras: Regra[] = [];
  for (const nivel of niveis.slice(1)) {
    for (const { itens, suporte: sup } of nivel) {
      const k = itens.length;
      for (let mascara = 1; mascara < (1 << k) - 1; mascara++) {
        const antecedente = itens.filter((_, i) => mascara & (1 << i));
        const consequente = itens.filter((_, i) => !(mascara & (1 << i)));
        const conf = confianca(transacoes, antecedente, consequente);
        if (conf >= confiancaMinima - 1e-12) {
          regras.push({ antecedente, consequente, suporte: sup, confianca: conf, lift: lift(transacoes, antecedente, consequente) });
        }
      }
    }
  }
  return regras;
}

/* ------------------------------------------------------------------ */
/* Naive Bayes (atributos categoricos, contagem simples, sem suavizacao) */
/* ------------------------------------------------------------------ */

export type TermoBayes = { atributo: number; valor: string; contagem: number; total: number };
export type ResultadoBayesClasse = {
  classe: string;
  contagemClasse: number;
  total: number;
  termos: TermoBayes[];
  produto: number;
  probabilidade: number;
};

/**
 * P(classe) · Π P(valor | classe), e depois NORMALIZA dividindo cada produto
 * pela soma dos produtos (passo que a prova cobra).
 * `registro[i] = null` ignora o atributo i.
 */
export function naiveBayes(linhas: string[][], registro: (string | null)[], classe = -1): ResultadoBayesClasse[] {
  const idx = (l: string[]) => (classe < 0 ? l.length + classe : classe);
  const classes: string[] = [];
  for (const l of linhas) if (!classes.includes(l[idx(l)])) classes.push(l[idx(l)]);
  const total = linhas.length;
  const parciais = classes.map((c) => {
    const daClasse = linhas.filter((l) => l[idx(l)] === c);
    const termos: TermoBayes[] = [];
    registro.forEach((valor, atributo) => {
      if (valor === null) return;
      termos.push({ atributo, valor, contagem: daClasse.filter((l) => l[atributo] === valor).length, total: daClasse.length });
    });
    const produto = (daClasse.length / total) * termos.reduce((acc, t) => acc * (t.contagem / t.total), 1);
    return { classe: c, contagemClasse: daClasse.length, total, termos, produto };
  });
  const somaProdutos = soma(parciais.map((p) => p.produto));
  return parciais.map((p) => ({ ...p, probabilidade: somaProdutos === 0 ? 0 : p.produto / somaProdutos }));
}

/* ------------------------------------------------------------------ */
/* Entrada e formatacao                                               */
/* ------------------------------------------------------------------ */

/**
 * Le o que o aluno digitou: aceita "0,17", "0.17", "10/60", "17%" (vira 0,17)
 * e "1,5e-2". Devolve null se nao for numero.
 */
export function lerNumero(entrada: string): number | null {
  let texto = entrada.trim().replace(/\s+/g, '');
  if (texto === '') return null;
  let fator = 1;
  if (texto.endsWith('%')) {
    fator = 0.01;
    texto = texto.slice(0, -1);
  }
  // "1.234,56" -> "1234.56"; "0,17" -> "0.17"
  if (texto.includes(',') && texto.includes('.')) texto = texto.replace(/\./g, '');
  texto = texto.replace(/,/g, '.');
  const fracao = texto.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
  if (fracao) {
    const den = Number(fracao[2]);
    if (den === 0) return null;
    return (Number(fracao[1]) / den) * fator;
  }
  if (!/^-?(\d+\.?\d*|\.\d+)(e-?\d+)?$/i.test(texto)) return null;
  const valor = Number(texto);
  return Number.isFinite(valor) ? valor * fator : null;
}

/** Numero no formato brasileiro com `casas` casas decimais. */
export function fmt(valor: number, casas = 4): string {
  if (!Number.isFinite(valor)) return '—';
  const arred = Number(valor.toFixed(casas));
  return (Object.is(arred, -0) ? 0 : arred).toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: casas,
  });
}

export function fmtPct(valor: number, casas = 2): string {
  return `${fmt(valor * 100, casas)}%`;
}

export function dentroDaTolerancia(valor: number, esperado: number, tolerancia = 0.01): boolean {
  return Math.abs(valor - esperado) <= tolerancia + 1e-9;
}
