import type { GraphData, Question, Source } from '@/content/types';
import { edgeBoundsForComponents, numberOfSubgraphsOfCompleteGraph, radiusDiameterCenter } from '@/lib/graph';

// Questões do "Treino de prova": só o que caiu nas 8 provas antigas do Prof.
// Silvio (docs/exam-pattern.md), em duas formas — a pergunta como está na
// prova, e VARIANTES com os números trocados, para repetir a família sem
// decorar a resposta. Toda solução traz a justificativa que o professor exige
// ("respostas sem justificativa serão desconsideradas").

const exam = (file: string, note: string): Source => ({ type: 'old_exam', file, note });

// ---------------------------------------------------------------------------
// Família 1 — n vértices, k componentes (caiu em 5 de 8 provas, sempre Q1)
// ---------------------------------------------------------------------------

interface NkCase {
  n: number;
  k: number;
  /** Prova em que este par (n, k) apareceu; undefined = variante nova. */
  from?: { file: string; q: string };
}

const NK_CASES: NkCase[] = [
  { n: 10, k: 5, from: { file: '2022-1-exam.pdf', q: '2022/1-Q1' } },
  { n: 11, k: 6, from: { file: '2022-2-exam.pdf', q: '2022/2-Q1' } },
  { n: 13, k: 6, from: { file: '2023-1-exam.pdf', q: '2023/1-Q2' } },
  { n: 13, k: 7, from: { file: '2025-1-exam.pdf', q: '2025/1-Q1' } },
  { n: 12, k: 4 },
  { n: 9, k: 3 },
  { n: 15, k: 5 },
  { n: 8, k: 2 },
  { n: 14, k: 8 },
  { n: 20, k: 10 },
];

/**
 * Um grafo com k componentes pode ser regular? Cada componente de um grafo
 * d-regular tem pelo menos d + 1 vértices (e, se d é ímpar, um número par de
 * vértices, pois a soma dos graus do componente é d·|Vi|). Com d = 0 o grafo é
 * nulo (k = n). Basta testar d = 1 e d = 2: se d = 2 falha (n < 3k), todo d
 * maior falha também.
 */
function regularVerdict(n: number, k: number): { possible: boolean; reason: string } {
  if (k === n) return { possible: true, reason: `Sim — grafo nulo: ${n} vértices isolados, todos de grau 0, ${k} componentes.` };
  if (n % 2 === 0 && n >= 2 * k) {
    return {
      possible: true,
      reason: `Sim — por exemplo, 1-regular: ${k} componentes, cada um com pelo menos 2 vértices e número PAR de vértices (soma de graus do componente = 1·|Vi| tem que ser par), totalizando ${n}. Ex.: ${k - 1} arestas K2 isoladas e um emparelhamento perfeito nos ${n - 2 * (k - 1)} vértices restantes.`,
    };
  }
  if (n >= 3 * k) {
    return {
      possible: true,
      reason: `Sim — por exemplo, 2-regular: ${k} ciclos disjuntos, cada um com pelo menos 3 vértices, totalizando ${n} (ex.: ${k - 1} triângulos e um ciclo com ${n - 3 * (k - 1)} vértices).`,
    };
  }
  return {
    possible: false,
    reason: `Não. Se todos os vértices têm grau d ≥ 1, cada componente precisa de pelo menos d + 1 vértices, logo n ≥ k(d + 1). Com d = 2 seria n ≥ ${3 * k} > ${n}; d maior exige ainda mais. Sobra d = 1: cada componente é um K2 com 2 vértices, o que exige n par e n ≥ ${2 * k}${n % 2 !== 0 ? ` — mas n = ${n} é ímpar` : ` — mas n = ${n} < ${2 * k}`}. Com d = 0 o grafo seria nulo, com ${n} componentes, não ${k}. Logo, impossível.`,
  };
}

function nkVariants({ n, k, from }: NkCase, idx: number): Question[] {
  const { min, max } = edgeBoundsForComponents(n, k);
  const src: Source = from ? exam(from.file, `${from.q} — mesmos números da prova`) : { type: 'old_exam', file: '2023-1-exam.pdf', note: `variante com números novos da família 2022/1-Q1, 2022/2-Q1, 2023/1-Q2, 2025/1-Q1` };
  const head = `Considerando um grafo não-direcionado simples G = (V, E) com ${n} vértices e ${k} componentes conexos,`;
  const minWhy = `mínimo de arestas = n − k = ${n} − ${k} = ${min} (cada componente com ni vértices precisa de pelo menos ni − 1 arestas para ser conexo; somando, Σ(ni − 1) = n − k)`;
  const maxWhy = `máximo de arestas = (n − k)(n − k + 1)/2 = ${n - k}·${n - k + 1}/2 = ${max} (${k - 1} componentes viram vértices isolados e os ${n - k + 1} restantes formam um K${n - k + 1})`;
  const base = {
    topic: 'aperto-de-maos-familias',
    difficulty: 'medium' as const,
    duration: 'quick' as const,
    examLikelihood: 'high' as const,
    sourceStyle: 'old_exam' as const,
    source: src,
    examFamily: 'possibilidade-n-k',
    professorStyleSimilarity: 'high' as const,
  };
  const tag = `nk${n}-${k}`;
  const reg = regularVerdict(n, k);
  const alt = idx % 2 === 0;
  const edgesAsk = alt ? min - 1 : max + 1;
  const degreeAsk = alt ? 2 * min : 2 * min - 2;
  const connectAsk = alt ? k - 1 : k - 2;

  return [
    {
      ...base,
      id: `tp-${tag}-arestas-impossivel`,
      type: 'TRUE_FALSE',
      prompt: `${head} é possível que esse grafo possua ${edgesAsk} arestas?`,
      correctValue: false,
      hints: ['Compare com o mínimo n − k e o máximo (n − k)(n − k + 1)/2.'],
      solution: alt
        ? `Não. O ${minWhy}. ${edgesAsk} < ${min}, então com ${edgesAsk} arestas haveria mais de ${k} componentes.`
        : `Não. O ${maxWhy}. ${edgesAsk} > ${max}, então seria preciso ligar vértices de componentes diferentes, reduzindo o número de componentes.`,
    },
    {
      ...base,
      id: `tp-${tag}-arestas-possivel`,
      type: 'TRUE_FALSE',
      prompt: `${head} é possível que esse grafo possua ${alt ? max : min} arestas?`,
      correctValue: true,
      hints: ['Compare com o mínimo n − k e o máximo (n − k)(n − k + 1)/2.'],
      solution: alt ? `Sim — é exatamente o máximo: ${maxWhy}.` : `Sim — é exatamente o mínimo: ${minWhy}. Ex.: ${k} árvores (uma por componente).`,
    },
    {
      ...base,
      id: `tp-${tag}-soma-graus`,
      type: 'TRUE_FALSE',
      prompt: `${head} é possível que a soma dos graus de todos os vértices seja igual a ${degreeAsk}?`,
      correctValue: alt,
      hints: ['Σ d(v) = 2|E|. Converta a soma em número de arestas e compare com o mínimo n − k.'],
      solution: alt
        ? `Sim. Σ d(v) = 2|E| ⇒ |E| = ${degreeAsk}/2 = ${degreeAsk / 2}, que é exatamente o mínimo n − k = ${min}. Ex.: ${k} árvores.`
        : `Não. Σ d(v) = 2|E| ⇒ |E| = ${degreeAsk}/2 = ${degreeAsk / 2} < ${min} = n − k, o mínimo de arestas para ${k} componentes. Com menos arestas, o grafo teria mais de ${k} componentes.`,
    },
    {
      ...base,
      id: `tp-${tag}-soma-impar`,
      type: 'TRUE_FALSE',
      prompt: `${head} é possível que a soma dos graus de todos os vértices seja igual a ${2 * min + 1}?`,
      correctValue: false,
      hints: ['Antes de comparar com mínimos e máximos, olhe a paridade.'],
      solution: `Não. Pela propriedade de grau, Σ d(v) = 2|E| é sempre PAR (cada aresta contribui com 2). ${2 * min + 1} é ímpar — impossível em qualquer grafo, independentemente de n e k.`,
    },
    {
      ...base,
      id: `tp-${tag}-soma-maior`,
      type: 'TRUE_FALSE',
      prompt: `${head} é possível que a soma dos graus de todos os vértices seja maior que ${2 * max}?`,
      correctValue: false,
      hints: ['Soma > X significa |E| > X/2. Compare com o máximo de arestas.'],
      solution: `Não. Σ d(v) > ${2 * max} ⇒ |E| > ${max}. Mas o ${maxWhy}. Logo Σ d(v) ≤ 2·${max} = ${2 * max}.`,
    },
    {
      ...base,
      id: `tp-${tag}-conexo`,
      type: 'TRUE_FALSE',
      prompt: `${head} é possível transformá-lo em um grafo conexo com a inclusão de ${connectAsk} arestas?`,
      correctValue: alt,
      hints: ['Cada aresta nova une no máximo dois componentes em um.'],
      solution: alt
        ? `Sim. Cada aresta entre dois componentes distintos reduz o número de componentes em exatamente 1; de ${k} para 1 são necessárias e suficientes ${k - 1} arestas.`
        : `Não. Cada aresta nova reduz o número de componentes em NO MÁXIMO 1 (une dois componentes). De ${k} componentes para 1 são necessárias pelo menos ${k - 1} arestas; com ${connectAsk} sobram pelo menos 2 componentes.`,
    },
    {
      ...base,
      id: `tp-${tag}-regular`,
      type: 'TRUE_FALSE',
      prompt: `${head} é possível que esse grafo seja regular?`,
      correctValue: reg.possible,
      hints: ['Se todos têm grau d, cada componente tem pelo menos d + 1 vértices. E lembre: soma de graus é par.'],
      solution: reg.reason,
    },
    {
      ...base,
      id: `tp-${tag}-min`,
      type: 'NUMBER_INPUT',
      duration: 'quick',
      prompt: `${head} qual o número MÍNIMO de arestas que ele pode ter?`,
      correctNumber: min,
      unit: 'arestas',
      hints: ['Cada componente com ni vértices precisa de ni − 1 arestas (árvore). Some.'],
      solution: `O ${minWhy}.`,
    },
    {
      ...base,
      id: `tp-${tag}-max`,
      type: 'NUMBER_INPUT',
      duration: 'quick',
      prompt: `${head} qual o número MÁXIMO de arestas que ele pode ter?`,
      correctNumber: max,
      unit: 'arestas',
      hints: ['Concentre tudo em um componente completo e deixe os outros k − 1 como vértices isolados.'],
      solution: `O ${maxWhy}.`,
    },
  ];
}

const nkQuestions: Question[] = NK_CASES.flatMap((c, i) => nkVariants(c, i));

// ---------------------------------------------------------------------------
// Família 2 — dois vértices de mesmo grau (pombos)
// ---------------------------------------------------------------------------

const pombosQuestions: Question[] = [
  {
    id: 'tp-pombos-ordem',
    topic: 'aperto-de-maos-familias',
    difficulty: 'medium',
    duration: 'normal',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'pombos',
    type: 'ORDERING',
    prompt: 'Coloque em ordem os passos da prova de que todo grafo simples com n ≥ 2 vértices tem dois vértices de mesmo grau (é a redação que o professor espera).',
    items: [
      { id: 'a', label: 'Em um grafo simples com n vértices, o grau de qualquer vértice está entre 0 e n − 1.' },
      { id: 'b', label: 'Se algum vértice tem grau n − 1, ele é adjacente a todos os outros — logo nenhum vértice pode ter grau 0.' },
      { id: 'c', label: 'Portanto 0 e n − 1 nunca ocorrem juntos: há no máximo n − 1 valores de grau possíveis.' },
      { id: 'd', label: 'São n vértices para no máximo n − 1 valores: pelo princípio da casa dos pombos, dois vértices têm o mesmo grau.' },
    ],
    correctOrder: ['a', 'b', 'c', 'd'],
    source: exam('2024-2-exam.pdf', 'Q1; também 2024/1-Q3, 2025/1-Q4, 2026/1-Q1'),
    professorStyleSimilarity: 'high',
    hints: ['Comece pelo intervalo de valores possíveis para o grau.', 'O passo-chave é mostrar que 0 e n − 1 não coexistem.'],
    solution: 'Intervalo [0, n−1] → grau n−1 impede grau 0 → no máximo n−1 valores → n vértices em n−1 "casas" ⇒ dois vértices com o mesmo grau. Na prova, escreva as quatro frases nessa ordem.',
  },
  {
    id: 'tp-pombos-coexistem',
    topic: 'aperto-de-maos-familias',
    difficulty: 'easy',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'pombos',
    type: 'TRUE_FALSE',
    prompt: 'Em um grafo simples com n vértices, pode existir ao mesmo tempo um vértice de grau 0 e um vértice de grau n − 1.',
    correctValue: false,
    source: exam('2024-2-exam.pdf', 'Q1 — passo central da prova'),
    hints: ['O que significa ter grau n − 1 num grafo simples?'],
    solution: 'Falso. Grau n − 1 significa ser adjacente a TODOS os outros n − 1 vértices (sem laços nem paralelas, cada aresta vai a um vértice distinto). Então todo outro vértice tem pelo menos essa aresta — grau ≥ 1. Isso é o que reduz os valores possíveis de n para n − 1 e faz a casa dos pombos funcionar.',
  },
  {
    id: 'tp-pombos-por-que-simples',
    topic: 'aperto-de-maos-familias',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'pombos',
    type: 'MULTIPLE_CHOICE',
    prompt: 'Por que a prova dos "dois vértices de mesmo grau" exige que o grafo seja SIMPLES?',
    options: [
      { id: 'a', label: 'Porque só em grafo simples o grau fica limitado a n − 1 — com laços ou arestas paralelas o grau pode crescer sem limite e a casa dos pombos não se aplica.' },
      { id: 'b', label: 'Porque grafos não simples não têm vértices de grau 0.' },
      { id: 'c', label: 'Porque a soma dos graus só é par em grafo simples.' },
      { id: 'd', label: 'Não exige — a prova vale para qualquer grafo.' },
    ],
    correctOptionId: 'a',
    source: exam('2025-1-exam.pdf', 'Q4 enuncia "simples e conexo"'),
    hints: ['Pense num vértice com 5 laços num grafo de 3 vértices.'],
    solution: 'Em grafo simples cada aresta incidente a v vai a um vértice DIFERENTE, logo d(v) ≤ n − 1. Com laços (contam 2) ou paralelas, d(v) pode ser qualquer número — os graus não ficam presos em n − 1 "casas". Contra-exemplo: 2 vértices, um com 1 laço (grau 2) e outro isolado (grau 0): graus diferentes.',
  },
  {
    id: 'tp-pombos-conexo',
    topic: 'aperto-de-maos-familias',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'pombos',
    type: 'MULTIPLE_CHOICE',
    prompt: 'A prova 2025/1-Q4 pede a prova para G simples e CONEXO com pelo menos dois vértices. O que muda em relação à versão "simples" (2024/2, 2026/1)?',
    options: [
      { id: 'a', label: 'Fica mais fácil: conexo com n ≥ 2 já garante que nenhum vértice tem grau 0, então os graus estão em {1, …, n − 1} — n − 1 valores para n vértices, pombos direto.' },
      { id: 'b', label: 'Fica mais difícil: precisa usar componentes conexos.' },
      { id: 'c', label: 'Nada muda; a prova é idêntica palavra por palavra.' },
      { id: 'd', label: 'A afirmação passa a ser falsa.' },
    ],
    correctOptionId: 'a',
    source: exam('2025-1-exam.pdf', 'Q4'),
    hints: ['Num grafo conexo com ≥ 2 vértices, qual o menor grau possível?'],
    solution: 'Conexo com n ≥ 2 ⇒ todo vértice tem pelo menos uma aresta ⇒ grau ≥ 1. Então os graus ficam em {1, …, n − 1}: n − 1 valores para n vértices, casa dos pombos direto — não precisa nem do argumento "0 e n − 1 não coexistem". Vale mencionar os dois caminhos na prova.',
  },
];

// ---------------------------------------------------------------------------
// Família 3 — número de subgrafos de Kn
// ---------------------------------------------------------------------------

function subgraphsTerms(n: number): string {
  const choose = (a: number, b: number) => {
    let r = 1;
    for (let k = 0; k < b; k++) r = (r * (a - k)) / (k + 1);
    return Math.round(r);
  };
  return Array.from({ length: n }, (_, i0) => {
    const i = i0 + 1;
    return `C(${n},${i})·2^${(i * (i - 1)) / 2} = ${choose(n, i)}·${2 ** ((i * (i - 1)) / 2)} = ${choose(n, i) * 2 ** ((i * (i - 1)) / 2)}`;
  }).join(' + ');
}

const subgrafosQuestions: Question[] = [
  ...[3, 5].map<Question>((n) => ({
    id: `tp-subgrafos-k${n}`,
    topic: 'complemento-subgrafo',
    difficulty: 'medium',
    duration: 'normal',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'subgrafos-kn',
    type: 'NUMBER_INPUT',
    prompt: `Quantos subgrafos (com pelo menos um vértice) possui o grafo completo K${n}? Use a fórmula do professor e mostre os termos.`,
    correctNumber: numberOfSubgraphsOfCompleteGraph(n),
    unit: 'subgrafos',
    source: exam('2022-2-exam.pdf', n === 3 ? 'Q5a: "mostre todos os subgrafos de um grafo completo de 3 vértices"' : 'variante de Q5b com n = 5'),
    hints: ['Escolha i vértices (C(n, i) jeitos); entre eles há i(i−1)/2 arestas possíveis, cada uma dentro ou fora: 2^(i(i−1)/2).', 'Some para i de 1 até n.'],
    solution: `Σ_{i=1}^{${n}} C(${n}, i)·2^{i(i−1)/2} = ${subgraphsTerms(n)} = ${numberOfSubgraphsOfCompleteGraph(n)}.`,
  })),
  {
    id: 'tp-subgrafos-formula',
    topic: 'complemento-subgrafo',
    difficulty: 'hard',
    duration: 'deep',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'subgrafos-kn',
    type: 'PROOF_OR_JUSTIFICATION',
    prompt: 'Seja G um grafo não-direcionado completo com n vértices. Determine o número de subgrafos de G. Justifique.',
    rubric: [
      'Define subgrafo: subconjunto de vértices + subconjunto das arestas entre eles (nenhuma aresta com ponta fora)',
      'Escolhe i vértices: C(n, i) maneiras, para i = 1, …, n',
      'Entre i vértices de Kn existem i(i−1)/2 arestas; cada uma pode estar ou não: 2^(i(i−1)/2) subgrafos com exatamente esses vértices',
      'Soma sobre i: Σ_{i=1}^{n} C(n, i)·2^(i(i−1)/2)',
      'Confere num caso pequeno (K3 → 17 ou K4 → 112)',
    ],
    source: exam('2024-2-exam.pdf', 'Q2; também 2022/2-Q5b, 2024/1-Q2, 2026/1-Q1.2'),
    professorStyleSimilarity: 'high',
    hints: ['Um subgrafo é determinado por: quais vértices + quais arestas entre eles.', 'Fixe o número i de vértices e conte; depois some em i.'],
    solution:
      'Um subgrafo de Kn fica determinado por um subconjunto não vazio de vértices e um subconjunto qualquer das arestas entre eles (em Kn todas existem). Fixando i vértices (C(n, i) escolhas), há i(i−1)/2 arestas entre eles e cada uma entra ou não: 2^(i(i−1)/2) subgrafos. Somando para i de 1 a n: N(n) = Σ_{i=1}^{n} C(n, i)·2^(i(i−1)/2). Verificação: K3 → 3·1 + 3·2 + 1·8 = 17; K4 → 4·1 + 6·2 + 4·8 + 1·64 = 112. (Na resolução anexada de 2022/2 o professor riscou a fórmula "só final" e exigiu essa dedução.)',
  },
  {
    id: 'tp-subgrafos-por-que',
    topic: 'complemento-subgrafo',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'subgrafos-kn',
    type: 'MULTIPLE_CHOICE',
    prompt: 'Na fórmula Σ C(n, i)·2^(i(i−1)/2) do número de subgrafos de Kn, o fator 2^(i(i−1)/2) conta o quê?',
    options: [
      { id: 'a', label: 'Todos os subconjuntos das i(i−1)/2 arestas que existem entre os i vértices escolhidos — cada aresta entra ou não.' },
      { id: 'b', label: 'O número de maneiras de escolher i vértices.' },
      { id: 'c', label: 'O número de grafos isomorfos a Ki.' },
      { id: 'd', label: 'O número de arestas de Ki.' },
    ],
    correctOptionId: 'a',
    source: exam('2024-1-exam.pdf', 'Q2'),
    hints: ['i(i−1)/2 é o número de arestas de Ki. O que 2 elevado a isso representa?'],
    solution: 'Entre i vértices de Kn há i(i−1)/2 arestas. Um subgrafo com exatamente esses vértices escolhe qualquer subconjunto dessas arestas: 2 opções por aresta ⇒ 2^(i(i−1)/2). C(n, i) conta a escolha dos vértices; o produto conta os subgrafos com i vértices.',
  },
];

// ---------------------------------------------------------------------------
// Família 6 — auto-complementar
// ---------------------------------------------------------------------------

const autoComplementarQuestions: Question[] = [
  {
    id: 'tp-autocomp-divisivel-4',
    topic: 'complemento-subgrafo',
    difficulty: 'hard',
    duration: 'normal',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'auto-complementar',
    type: 'TRUE_FALSE',
    prompt: 'Seja G = (V, E) um grafo simples não-direcionado. É correto afirmar que o número de arestas de um grafo auto-complementar é divisível por 4? (Justifique na sua cabeça antes de marcar.)',
    correctValue: false,
    source: exam('2025-1-exam.pdf', 'Q2 (20%) — pergunta textual da prova'),
    professorStyleSimilarity: 'high',
    hints: ['Calcule |E| de um auto-complementar com 5 vértices.', '|E(G)| + |E(Ḡ)| = n(n−1)/2 e |E(G)| = |E(Ḡ)|.'],
    solution:
      'Não. Como G ≅ Ḡ, |E(G)| = |E(Ḡ)|, e juntos formam Kn: |E(G)| + |E(Ḡ)| = n(n−1)/2 ⇒ |E(G)| = n(n−1)/4. O que precisa ser divisível por 4 é n(n−1), não |E|. Contra-exemplo: C5 é auto-complementar com 5·4/4 = 5 arestas, e 5 não é divisível por 4. (Também P4: 3 arestas.) O que se pode afirmar é que n ≡ 0 ou 1 (mod 4).',
  },
  {
    id: 'tp-autocomp-4k',
    topic: 'complemento-subgrafo',
    difficulty: 'hard',
    duration: 'deep',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'auto-complementar',
    type: 'PROOF_OR_JUSTIFICATION',
    prompt: 'Prove que um grafo auto-complementar tem 4k ou 4k + 1 vértices, para k um inteiro não negativo.',
    rubric: [
      'G ≅ Ḡ ⇒ |E(G)| = |E(Ḡ)|',
      'E(G) e E(Ḡ) particionam E(Kn): |E(G)| + |E(Ḡ)| = n(n−1)/2',
      'Logo |E(G)| = n(n−1)/4, que precisa ser inteiro ⇒ 4 | n(n−1)',
      'n e n−1 são consecutivos: um é par e o outro ímpar; o par tem que ser múltiplo de 4',
      'Se n é o múltiplo de 4: n = 4k. Se n−1 é: n = 4k + 1',
    ],
    source: exam('2023-1-exam.pdf', 'Q3b (14%)'),
    professorStyleSimilarity: 'high',
    hints: ['Comece igualando as arestas de G e de Ḡ.', 'n(n−1)/4 inteiro — quem tem que ser múltiplo de 4?', 'Entre dois inteiros consecutivos, só um é par.'],
    solution:
      'Seja G auto-complementar com n vértices. Como G ≅ Ḡ, |E(G)| = |E(Ḡ)|. Toda aresta de Kn está em exatamente um dos dois, então |E(G)| + |E(Ḡ)| = n(n−1)/2, logo |E(G)| = n(n−1)/4. Como |E(G)| é inteiro, 4 divide n(n−1). Entre n e n−1 (consecutivos) exatamente um é par, e o ímpar não contribui com fator 2 — então o par precisa ser múltiplo de 4. Se for n, n = 4k; se for n−1, n = 4k + 1. Verificação: n = 4 (P4, 3 arestas), n = 5 (C5, 5 arestas); n = 6 daria 7,5 arestas — impossível.',
  },
  {
    id: 'tp-autocomp-exemplos',
    topic: 'complemento-subgrafo',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'auto-complementar',
    type: 'MULTIPLE_CHOICE',
    prompt: 'Dê dois exemplos de grafos auto-complementares com mais de 4 vértices (2023/1-Q3a). Qual par abaixo serve?',
    options: [
      { id: 'a', label: 'C5 (ciclo com 5 vértices) e o grafo "casinha com cauda" de 5 vértices (P5 com a aresta {2,4}): ambos com 5 arestas = 5·4/4.' },
      { id: 'b', label: 'C6 e K6.' },
      { id: 'c', label: 'K5 e N5.' },
      { id: 'd', label: 'P5 e C5.' },
    ],
    correctOptionId: 'a',
    source: exam('2023-1-exam.pdf', 'Q3a (6%)'),
    hints: ['Auto-complementar precisa de n = 4k ou 4k+1 e exatamente n(n−1)/4 arestas.', 'C5 é o exemplo clássico. P5 tem 4 arestas — não é 5.'],
    solution: 'n = 5 exige 5 arestas. C5: complemento de C5 é outro ciclo de 5 (o "pentagrama"), isomorfo. Segundo exemplo com 5 vértices: caminho 1-2-3-4-5 mais a aresta {2,4} ("A" ou casinha com cauda). K5/N5 são complementos um do outro, mas não isomorfos; C6 tem 6 vértices (6·5/4 não é inteiro); P5 tem 4 arestas.',
  },
  ...[5, 8, 9].map<Question>((n) => ({
    id: `tp-autocomp-arestas-${n}`,
    topic: 'complemento-subgrafo',
    difficulty: 'easy',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'auto-complementar',
    type: 'NUMBER_INPUT',
    prompt: `Quantas arestas tem um grafo auto-complementar com ${n} vértices?`,
    correctNumber: (n * (n - 1)) / 4,
    unit: 'arestas',
    source: exam('2023-2-exam.pdf', 'Q1(iii): "três exemplos de grafos com mais de 4 vértices em que |E(G)| = |E(Ḡ)|"'),
    hints: ['|E(G)| = |E(Ḡ)| e |E(G)| + |E(Ḡ)| = n(n−1)/2.'],
    solution: `|E| = n(n−1)/4 = ${n}·${n - 1}/4 = ${(n * (n - 1)) / 4}.`,
  })),
  ...[6, 7].map<Question>((n) => ({
    id: `tp-autocomp-existe-${n}`,
    topic: 'complemento-subgrafo',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'auto-complementar',
    type: 'TRUE_FALSE',
    prompt: `Existe grafo com ${n} vértices cujo número de arestas é igual ao do seu complemento?`,
    correctValue: false,
    source: exam('2023-2-exam.pdf', 'Q1(iv): "para quais valores de |V| é possível que G tenha o mesmo número de arestas do seu complemento?"'),
    hints: ['|E(G)| = |E(Ḡ)| ⇒ |E| = n(n−1)/4. É inteiro?'],
    solution: `Não. |E(G)| = |E(Ḡ)| exige |E| = n(n−1)/4 = ${n}·${n - 1}/4 = ${(n * (n - 1)) / 4}, que não é inteiro. Só é possível quando 4 | n(n−1), ou seja, n = 4k ou 4k + 1 (4, 5, 8, 9, 12, 13, …).`,
  })),
  {
    id: 'tp-autocomp-quais-n',
    topic: 'complemento-subgrafo',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'auto-complementar',
    type: 'MULTIPLE_CHOICE',
    prompt: 'Para quais valores de |V| = n é possível que um grafo G tenha o mesmo número de arestas do seu complemento?',
    options: [
      { id: 'a', label: 'n ≡ 0 ou 1 (mod 4): n = 4k ou 4k + 1 — pois |E| = n(n−1)/4 precisa ser inteiro.' },
      { id: 'b', label: 'Qualquer n par.' },
      { id: 'c', label: 'Qualquer n ≥ 4.' },
      { id: 'd', label: 'Só n ímpar.' },
    ],
    correctOptionId: 'a',
    source: exam('2023-2-exam.pdf', 'Q1(iv)'),
    hints: ['n(n−1) precisa ser múltiplo de 4; entre n e n−1 só um é par.'],
    solution: '|E(G)| = |E(Ḡ)| ⇒ 2|E| = n(n−1)/2 ⇒ |E| = n(n−1)/4. Inteiro sse 4 | n(n−1). Como só um de n, n−1 é par, esse par tem que ser múltiplo de 4: n = 4k ou n − 1 = 4k. Ex.: 4, 5, 8, 9, 12, 13.',
  },
];

// ---------------------------------------------------------------------------
// Família 7 — excentricidade / raio / diâmetro / centro no grafo da prova
// ---------------------------------------------------------------------------

/** Grafo literal de 2023/2-Q3 e 2024/1-Q4: V = {a, …, i}, E = {ab, bc, bd, cg, de, dg, dh, cf, hi, ai}. */
export const EXAM_GRAPH_AI: GraphData = {
  directed: false,
  vertices: [
    { id: 'a', label: 'a', x: 70, y: 130 },
    { id: 'b', label: 'b', x: 190, y: 60 },
    { id: 'c', label: 'c', x: 330, y: 60 },
    { id: 'f', label: 'f', x: 470, y: 60 },
    { id: 'g', label: 'g', x: 330, y: 170 },
    { id: 'd', label: 'd', x: 190, y: 200 },
    { id: 'e', label: 'e', x: 330, y: 280 },
    { id: 'h', label: 'h', x: 190, y: 300 },
    { id: 'i', label: 'i', x: 70, y: 260 },
  ],
  edges: [
    ['a', 'b'], ['b', 'c'], ['b', 'd'], ['c', 'g'], ['d', 'e'], ['d', 'g'], ['d', 'h'], ['c', 'f'], ['h', 'i'], ['a', 'i'],
  ].map(([s, t]) => ({ id: `${s}${t}`, source: s, target: t })),
};

const AI = radiusDiameterCenter(EXAM_GRAPH_AI);
const eccList = Object.entries(AI.eccentricities).sort(([a], [b]) => a.localeCompare(b)).map(([v, e]) => `ε(${v}) = ${e}`).join(', ');

const excentricidadeQuestions: Question[] = [
  ...(['a', 'd', 'f', 'i', 'g'] as const).map<Question>((v) => ({
    id: `tp-exc-${v}`,
    topic: 'excentricidade-raio-diametro',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'excentricidade',
    type: 'NUMBER_INPUT',
    prompt: `No grafo da prova (V = {a, …, i}, E = {ab, bc, bd, cg, de, dg, dh, cf, hi, ai}), qual a excentricidade do vértice "${v}"?`,
    displayGraphs: { a: EXAM_GRAPH_AI },
    correctNumber: AI.eccentricities[v],
    source: exam('2023-2-exam.pdf', 'Q3(i) (10%): "encontre a excentricidade de cada vértice" — mesmo grafo em 2024/1-Q4'),
    hints: [`BFS a partir de ${v}: anote a distância a cada vértice; a maior é ε(${v}).`],
    solution: `ε(${v}) = ${AI.eccentricities[v]} (maior distância mínima de ${v} a outro vértice). Todas: ${eccList}.`,
  })),
  {
    id: 'tp-exc-raio',
    topic: 'excentricidade-raio-diametro',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'excentricidade',
    type: 'NUMBER_INPUT',
    prompt: 'No grafo da prova (V = {a, …, i}), qual é o RAIO de G?',
    displayGraphs: { a: EXAM_GRAPH_AI },
    correctNumber: AI.radius,
    source: exam('2023-2-exam.pdf', 'Q3(ii) (8%): "qual o raio e o diâmetro de G?"'),
    hints: ['Raio = menor excentricidade.'],
    solution: `Excentricidades: ${eccList}. Raio = menor = ${AI.radius}.`,
  },
  {
    id: 'tp-exc-diametro',
    topic: 'excentricidade-raio-diametro',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'excentricidade',
    type: 'NUMBER_INPUT',
    prompt: 'No grafo da prova (V = {a, …, i}), qual é o DIÂMETRO de G?',
    displayGraphs: { a: EXAM_GRAPH_AI },
    correctNumber: AI.diameter,
    source: exam('2023-2-exam.pdf', 'Q3(ii)'),
    hints: ['Diâmetro = maior excentricidade.'],
    solution: `Excentricidades: ${eccList}. Diâmetro = maior = ${AI.diameter}.`,
  },
  {
    id: 'tp-exc-centro',
    topic: 'excentricidade-raio-diametro',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'excentricidade',
    type: 'GRAPH_SELECT_VERTEX',
    prompt: 'No grafo da prova, selecione o(s) vértice(s) que formam o CENTRO de G.',
    graph: EXAM_GRAPH_AI,
    multi: true,
    correctVertexIds: AI.center,
    source: exam('2023-2-exam.pdf', 'Q3(iii) (7%): "defina o(s) centro(s) de G"'),
    hints: ['Centro = conjunto dos vértices com excentricidade igual ao raio.'],
    solution: `Raio = ${AI.radius}. Centro = {${AI.center.join(', ')}}. Todas as excentricidades: ${eccList}.`,
  },
  {
    id: 'tp-exc-algoritmo-diametro',
    topic: 'excentricidade-raio-diametro',
    difficulty: 'hard',
    duration: 'deep',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'excentricidade',
    type: 'PROOF_OR_JUSTIFICATION',
    prompt: 'Projete um algoritmo para encontrar o diâmetro de um grafo simples não-direcionado. Deixe claros todos os elementos e etapas, e ilustre com um exemplo.',
    rubric: [
      'Define diâmetro = maior excentricidade = maior distância mínima entre dois vértices',
      'Para cada vértice v: BFS a partir de v, obtendo dist(v, u) para todo u',
      'ε(v) = máximo de dist(v, u); guarda o maior ε(v) visto',
      'Diâmetro = max_v ε(v); se alguma distância ficar indefinida, o grafo é desconexo (diâmetro infinito)',
      'Exemplo pequeno com a tabela de distâncias e a resposta',
    ],
    source: exam('2024-1-exam.pdf', 'Q4(iv) (10%); também 2022/1-Q4 (20%)'),
    professorStyleSimilarity: 'high',
    hints: ['Distância em nº de arestas = BFS.', 'Excentricidade de v sai de uma BFS; diâmetro precisa de todas.'],
    solution:
      'Entrada: G = (V, E) não-direcionado simples. (1) diam ← 0. (2) Para cada v ∈ V: rode BFS a partir de v (fila iniciada com v, dist[v] = 0, dist[u] = dist[w] + 1 ao descobrir u pelo vizinho w); ε(v) ← max_u dist[u]; se algum u não foi alcançado, G é desconexo — pare (diâmetro indefinido). (3) diam ← max(diam, ε(v)). (4) Saída: diam. Custo O(|V|·(|V| + |E|)). Exemplo: caminho a–b–c–d: BFS de a dá 0,1,2,3 (ε = 3); de b dá 1,0,1,2 (ε = 2); de c: ε = 2; de d: ε = 3 ⇒ diâmetro 3.',
  },
];

// ---------------------------------------------------------------------------
// Famílias 8–10 — bipartido/tripartido, limites, matriz de adjacência
// ---------------------------------------------------------------------------

const krst = (r: number, s: number, t: number) => ({ v: r + s + t, e: r * s + r * t + s * t });

const bipartidoQuestions: Question[] = [
  ...([
    [2, 2, 2],
    [2, 3, 3],
    [3, 3, 3],
    [1, 2, 4],
  ] as const).map<Question>(([r, s, t]) => ({
    id: `tp-krst-${r}${s}${t}`,
    topic: 'aperto-de-maos-familias',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'bipartido-tripartido',
    type: 'NUMBER_INPUT',
    prompt: `Quantas arestas possui o grafo tripartido completo K${r},${s},${t}? (três conjuntos de tamanhos ${r}, ${s} e ${t}; aresta entre dois vértices sse estão em conjuntos distintos)`,
    correctNumber: krst(r, s, t).e,
    unit: 'arestas',
    source: exam('2025-1-exam.pdf', 'Q3 (15%): desenhe K2,2,2 e K2,3,3; quantos vértices e arestas tem Kr,s,t?'),
    hints: ['Cada par de conjuntos forma um bipartido completo: r·s + r·t + s·t.'],
    solution: `|V| = ${r} + ${s} + ${t} = ${krst(r, s, t).v}; |E| = rs + rt + st = ${r * s} + ${r * t} + ${s * t} = ${krst(r, s, t).e}.`,
  })),
  {
    id: 'tp-bipartido-n2-4',
    topic: 'passeios-caminhos-ciclos',
    difficulty: 'hard',
    duration: 'deep',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'bipartido-tripartido',
    type: 'PROOF_OR_JUSTIFICATION',
    prompt: 'Seja G = (V, E) um grafo não-direcionado com |V| = n e |E| = m. Mostre que, se G é bipartido, então m ≤ n²/4.',
    rubric: [
      'Bipartido: V particionado em V1 e V2 com |V1| = a, |V2| = n − a; toda aresta liga V1 a V2',
      'Logo m ≤ a·(n − a) (máximo quando é bipartido completo Ka,n−a)',
      'a(n − a) é máximo em a = n/2: vale n²/4',
      'Conclui m ≤ n²/4',
    ],
    source: exam('2023-1-exam.pdf', 'Q1b (4%)'),
    professorStyleSimilarity: 'high',
    hints: ['Quantas arestas cabem entre um lado com a vértices e outro com n − a?', 'Maximize a(n − a).'],
    solution: 'Seja V = V1 ∪ V2 a bipartição, |V1| = a, |V2| = n − a. Como toda aresta une V1 a V2 e não há paralelas, m ≤ a(n − a) (igualdade no bipartido completo). A função f(a) = a(n − a) = an − a² é uma parábola com máximo em a = n/2, onde vale n²/4. Logo m ≤ n²/4. (Se n é ímpar o máximo inteiro é ⌊n/2⌋·⌈n/2⌉ ≤ n²/4.)',
  },
  {
    id: 'tp-tripartido-max',
    topic: 'aperto-de-maos-familias',
    difficulty: 'hard',
    duration: 'normal',
    examLikelihood: 'medium',
    sourceStyle: 'old_exam',
    examFamily: 'bipartido-tripartido',
    type: 'MULTIPLE_CHOICE',
    prompt: 'Se G é um grafo tripartido com n vértices, qual o maior número de arestas de G? (Faça as considerações que julgar necessárias.)',
    options: [
      { id: 'a', label: 'Com as três partes o mais iguais possível (n/3 cada, se 3 | n): 3·(n/3)² = n²/3 arestas — é o tripartido completo Kn/3,n/3,n/3.' },
      { id: 'b', label: 'n²/4, como no bipartido.' },
      { id: 'c', label: 'n(n−1)/2.' },
      { id: 'd', label: 'n²/2.' },
    ],
    correctOptionId: 'a',
    source: exam('2023-1-exam.pdf', 'Q1e (4%)'),
    hints: ['Tripartido completo Kr,s,t tem rs + rt + st arestas com r + s + t = n. Quando isso é máximo?'],
    solution: 'O máximo é o tripartido completo Kr,s,t com r + s + t = n, que tem rs + rt + st arestas. Essa soma é máxima quando as partes são o mais iguais possível (r = s = t = n/3 se 3 | n): 3·(n/3)² = n²/3. Consideração: se 3 ∤ n, use partes ⌊n/3⌋ e ⌈n/3⌉. Compare: bipartido dá n²/4 < n²/3 < n(n−1)/2 (completo).',
  },
  {
    id: 'tp-regular-15-3',
    topic: 'aperto-de-maos-familias',
    difficulty: 'easy',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'limites-grau-arestas',
    type: 'TRUE_FALSE',
    prompt: 'G pode ser regular se n = 15 e o grau de cada vértice for 3?',
    correctValue: false,
    source: exam('2023-1-exam.pdf', 'Q1c (4%)'),
    hints: ['Σ d(v) = 2|E|. Faça a conta.'],
    solution: 'Não. Σ d(v) = 15 · 3 = 45 = 2|E| ⇒ |E| = 22,5 — não é inteiro. Equivalente: o número de vértices de grau ímpar (15) teria que ser par. Regra geral: n·d precisa ser par.',
  },
  ...([
    [9, 3, false],
    [10, 3, true],
    [7, 5, false],
  ] as const).map<Question>(([n, d, ok]) => ({
    id: `tp-regular-${n}-${d}`,
    topic: 'aperto-de-maos-familias',
    difficulty: 'easy',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'limites-grau-arestas',
    type: 'TRUE_FALSE',
    prompt: `Existe grafo simples regular com n = ${n} vértices em que cada vértice tem grau ${d}?`,
    correctValue: ok,
    source: exam('2023-1-exam.pdf', 'variante de Q1c com números novos'),
    hints: ['n·d = 2|E| tem que ser par, e d ≤ n − 1.'],
    solution: ok
      ? `Sim. Σ d(v) = ${n}·${d} = ${n * d} = 2|E| ⇒ |E| = ${(n * d) / 2}, inteiro; e ${d} ≤ n − 1 = ${n - 1}. Ex.: prisma/ciclo com cordas — existe grafo ${d}-regular com ${n} vértices.`
      : `Não. Σ d(v) = ${n}·${d} = ${n * d} é ímpar, mas a soma dos graus é sempre 2|E| (par). Equivalente: haveria ${n} vértices de grau ímpar — quantidade ímpar, impossível.`,
  })),
  {
    id: 'tp-m-max',
    topic: 'aperto-de-maos-familias',
    difficulty: 'medium',
    duration: 'normal',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'limites-grau-arestas',
    type: 'PROOF_OR_JUSTIFICATION',
    prompt: 'Seja G = (V, E) um grafo não-direcionado simples, |V| = n e |E| = m. Mostre que m ≤ n(n − 1)/2.',
    rubric: [
      'Simples: sem laços nem paralelas ⇒ cada vértice tem grau ≤ n − 1',
      'Σ d(v) = 2m (propriedade de grau)',
      '2m = Σ d(v) ≤ n(n − 1) ⇒ m ≤ n(n − 1)/2',
      '(ou) cada aresta é um par não ordenado de vértices distintos: no máximo C(n, 2) = n(n − 1)/2 pares',
    ],
    source: exam('2023-1-exam.pdf', 'Q1a (4%)'),
    professorStyleSimilarity: 'high',
    hints: ['Qual o maior grau possível num grafo simples?', 'Some os graus.'],
    solution: 'Em grafo simples, cada vértice é adjacente a no máximo os outros n − 1 vértices: d(v) ≤ n − 1. Pela propriedade de grau, 2m = Σ d(v) ≤ n(n − 1), logo m ≤ n(n − 1)/2. Igualdade em Kn. (Alternativa: cada aresta é um par {u, v} de vértices distintos; há C(n, 2) = n(n−1)/2 pares.)',
  },
  {
    id: 'tp-matriz-simetrica',
    topic: 'matriz-adjacencia',
    difficulty: 'easy',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'matriz-adjacencia',
    type: 'TRUE_FALSE',
    prompt: 'Seja uma matriz quadrada simétrica formada apenas por 0s e 1s, com apenas 0s na diagonal principal. Essa matriz pode representar a matriz de adjacência de um grafo simples?',
    correctValue: true,
    source: exam('2023-1-exam.pdf', 'Q4a (7%)'),
    hints: ['Simétrica ⇒ ? Diagonal 0 ⇒ ? Só 0/1 ⇒ ?'],
    solution: 'Sim. Simétrica ⇒ aij = aji, arestas sem direção (grafo não-direcionado). Diagonal 0 ⇒ nenhum vértice ligado a si mesmo (sem laços). Entradas só 0/1 ⇒ no máximo uma aresta por par (sem paralelas). Sem laços e sem paralelas = grafo simples. Basta ler cada 1 acima da diagonal como uma aresta {i, j}.',
  },
  {
    id: 'tp-matriz-coluna-nd',
    topic: 'matriz-adjacencia',
    difficulty: 'easy',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'matriz-adjacencia',
    type: 'MULTIPLE_CHOICE',
    prompt: 'O que representa a soma das entradas de uma coluna j da matriz de adjacência de um grafo NÃO-direcionado? E de um grafo DIRECIONADO?',
    options: [
      { id: 'a', label: 'Não-direcionado: o grau d(j). Direcionado: o grau de entrada d⁻(j) (nº de arestas que chegam em j).' },
      { id: 'b', label: 'Não-direcionado: o grau d(j). Direcionado: o grau de saída d⁺(j).' },
      { id: 'c', label: 'Nos dois casos, o número de arestas do grafo.' },
      { id: 'd', label: 'Não-direcionado: o número de componentes. Direcionado: o grau de entrada.' },
    ],
    correctOptionId: 'a',
    source: exam('2023-1-exam.pdf', 'Q4b (8%)'),
    hints: ['aij = 1 significa aresta (i, j): de i PARA j. A coluna j coleta todos os i com seta chegando em j.'],
    solution: 'aij = 1 ⟺ (i, j) ∈ A. Somar a coluna j conta os i tais que (i, j) é aresta — as arestas que CHEGAM em j: grau de entrada d⁻(j). No não-direcionado a matriz é simétrica, chegar = sair, e a soma é o grau d(j) (laço, se houver, aparece 1 vez na diagonal — por isso o professor pede grafo simples). A soma da LINHA i, no direcionado, é d⁺(i).',
  },
];

// ---------------------------------------------------------------------------
// Famílias 4–5 — fecho/base e ciclo/DFS/SCC (complementos fechados às abertas já existentes)
// ---------------------------------------------------------------------------

const buscaQuestions: Question[] = [
  {
    id: 'tp-base-grau-zero',
    topic: 'base-antibase',
    difficulty: 'easy',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'fecho-base-antibase',
    type: 'MULTIPLE_CHOICE',
    prompt: 'No algoritmo do professor para encontrar uma base de um grafo dirigido, quais vértices entram na base obrigatoriamente, antes de tratar ciclos?',
    options: [
      { id: 'a', label: 'Os de grau de entrada zero — ninguém os alcança, então só eles podem se representar.' },
      { id: 'b', label: 'Os de grau de saída zero.' },
      { id: 'c', label: 'Os de maior grau de saída.' },
      { id: 'd', label: 'Um vértice de cada componente conexo do grafo subjacente.' },
    ],
    correctOptionId: 'a',
    source: exam('2022-2-exam.pdf', 'Q2c (10%): "como seria um algoritmo para identificar uma base?"'),
    hints: ['Base: todo vértice fora dela é atingido por alguém dela. Quem NÃO pode ser atingido por ninguém?'],
    solution: 'Vértices com d⁻(v) = 0 não são alcançados por nenhum outro; como a base precisa alcançar todo mundo, eles têm que estar nela. Os demais (d⁻ > 0) são alcançados, direta ou indiretamente, a partir desses — exceto quando estão em ciclos sem entrada externa: aí contrai-se o ciclo num hipervértice e, se ele ficar com d⁻ = 0, escolhe-se UM vértice do ciclo.',
  },
  {
    id: 'tp-antibase-transposto',
    topic: 'base-antibase',
    difficulty: 'easy',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'fecho-base-antibase',
    type: 'TRUE_FALSE',
    prompt: 'A anti-base de um grafo dirigido G é exatamente a base do grafo transposto Gᵀ.',
    correctValue: true,
    source: exam('2022-2-exam.pdf', 'Q2d (10%): algoritmo para anti-base'),
    hints: ['Anti-base: todo vértice fora dela ALCANÇA alguém dela. Inverta as setas.'],
    solution: 'Verdadeiro. "u alcança a em G" ⟺ "a alcança u em Gᵀ". Então "todo vértice fora de A alcança A" em G vira "A alcança todo vértice" em Gᵀ — a definição de base. Por isso o algoritmo do professor para anti-base é: transponha G e aplique o algoritmo de base.',
  },
  {
    id: 'tp-base-ciclo',
    topic: 'base-antibase',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'fecho-base-antibase',
    type: 'MULTIPLE_CHOICE',
    prompt: '"Sua solução para encontrar a base funciona para quais tipos de grafo?" — o que muda quando o grafo dirigido tem ciclos?',
    options: [
      { id: 'a', label: 'Só olhar d⁻ = 0 funciona apenas em grafos ACÍCLICOS. Com ciclos, um ciclo sem aresta chegando de fora não tem nenhum vértice com d⁻ = 0: é preciso contrair cada ciclo (ou SCC) num hipervértice e escolher um representante dos hipervértices com d⁻ = 0.' },
      { id: 'b', label: 'Nada muda — d⁻ = 0 sempre basta.' },
      { id: 'c', label: 'Com ciclos não existe base.' },
      { id: 'd', label: 'Com ciclos a base é o conjunto de todos os vértices dos ciclos.' },
    ],
    correctOptionId: 'a',
    source: exam('2022-1-exam.pdf', 'Q2c (13%): "sua solução funciona para quais tipos de grafos?"'),
    hints: ['Num ciclo a → b → c → a isolado, qual é o grau de entrada de cada vértice?'],
    solution: 'Em um ciclo isolado todo vértice tem d⁻ ≥ 1, mas ninguém de fora alcança o ciclo — algum vértice dele precisa estar na base. O algoritmo por grau de entrada só está completo depois de contrair ciclos (na prática, os componentes fortemente conexos) em hipervértices; o grafo condensado é acíclico e aí d⁻ = 0 funciona. Escreva isso na prova: é exatamente a qualificação que o professor cobra (correção "e funciona para quais grafos?").',
  },
  {
    id: 'tp-ciclo-estado',
    topic: 'deteccao-ciclo',
    difficulty: 'easy',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'ciclo-dfs-scc',
    type: 'MULTIPLE_CHOICE',
    prompt: 'Na DFS com estados 0/1/2 do professor, encontrar um vizinho u em qual estado indica que há ciclo no grafo dirigido?',
    options: [
      { id: 'a', label: 'Estado 1 (começou mas não terminou) — u é ancestral ainda "aberto": a aresta é de retorno.' },
      { id: 'b', label: 'Estado 0 (não começou).' },
      { id: 'c', label: 'Estado 2 (terminou).' },
      { id: 'd', label: 'Qualquer estado diferente de 0.' },
    ],
    correctOptionId: 'a',
    source: exam('2024-2-exam.pdf', 'Q3 (30%): determinar se há ciclo e encontrar seus vértices'),
    hints: ['Quadro de 19/08: "if visitado[u] == 1: HÁ CICLO".'],
    solution: 'Estado 1 = u está na pilha de recursão (é ancestral do vértice atual). Uma aresta para um ancestral fecha um ciclo (aresta de retorno). Estado 2 = já terminou: aresta de avanço ou cruzamento, sem ciclo. Para listar os vértices do ciclo, siga os pais de v até u.',
  },
  {
    id: 'tp-kosaraju-ordem',
    topic: 'scc-kosaraju',
    difficulty: 'medium',
    duration: 'normal',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'ciclo-dfs-scc',
    type: 'ORDERING',
    prompt: 'Coloque em ordem os passos do algoritmo de Kosaraju como o professor apresenta.',
    items: [
      { id: 'a', label: 'DFS em G, gravando os tempos de início e fim de cada vértice.' },
      { id: 'b', label: 'Construir o grafo transposto Gᵀ (mesmas arestas, sentido invertido).' },
      { id: 'c', label: 'DFS em Gᵀ visitando os vértices em ordem DECRESCENTE de tempo de término.' },
      { id: 'd', label: 'Cada árvore da segunda DFS é um componente fortemente conexo.' },
    ],
    correctOrder: ['a', 'b', 'c', 'd'],
    source: exam('2022-1-exam.pdf', 'Q5 (20%): "determine os componentes fortemente conexos, justificando"'),
    hints: ['A ordem "DFS em G primeiro, depois no transposto" é a do professor (Cormen), não a de Sedgewick.'],
    solution: 'DFS em G (tempos) → transpõe → DFS no transposto do maior para o menor tempo de término → cada árvore = um SCC. Na prova, mostre os tempos de término, a ordem de desempilhamento e o conjunto de cada chamada da 2ª DFS.',
  },
  {
    id: 'tp-scc-ciclo',
    topic: 'scc-kosaraju',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'ciclo-dfs-scc',
    type: 'TRUE_FALSE',
    prompt: 'Um grafo dirigido possui ciclo se, e somente se, algum componente fortemente conexo tem dois ou mais vértices (ou existe laço).',
    correctValue: true,
    source: exam('P1-TGC.pdf', '2026/1-Q4 (25%): "projete DUAS soluções distintas para definir se o grafo é acíclico" — esta é a segunda'),
    hints: ['Dois vértices no mesmo SCC se alcançam mutuamente. O que isso forma?'],
    solution: 'Verdadeiro. Se u ≠ v estão no mesmo SCC, há caminho u → v e v → u: juntos formam um ciclo. Reciprocamente, todo ciclo tem seus vértices mutuamente alcançáveis, logo num mesmo SCC de tamanho ≥ 2. Assim, "rodar Kosaraju e verificar se todo SCC é unitário (e não há laço)" é uma segunda estratégia de detecção de ciclo, além da DFS 0/1/2 — é o par que 2026/1-Q4 pede.',
  },
  {
    id: 'tp-bfs-distancias',
    topic: 'bfs',
    difficulty: 'hard',
    duration: 'deep',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    examFamily: 'bfs-distancias',
    type: 'PROOF_OR_JUSTIFICATION',
    prompt: 'Seja G = (V, E) um grafo não-direcionado e um vértice v ∈ V. Projete um algoritmo para encontrar o número de arestas entre v e todos os outros vértices de G (para cada u ∈ V, a distância em nº de arestas entre v e u). Deixe claros todos os elementos e etapas.',
    rubric: [
      'Identifica que distância em nº de arestas = busca em largura a partir de v',
      'Elementos: vetor dist (−1 ou ∞ para todos, 0 para v), fila Q iniciada com v',
      'Laço: enquanto Q não vazia, remove w; para cada vizinho u com dist[u] indefinida: dist[u] = dist[w] + 1 e enfileira u',
      'Justifica: a fila processa por níveis, então cada vértice é descoberto pelo caminho mais curto',
      'Saída: dist[u] para todo u (−1/∞ = inalcançável); custo O(|V| + |E|)',
    ],
    source: exam('2023-1-exam.pdf', 'Q5 (25%)'),
    professorStyleSimilarity: 'high',
    hints: ['Qual busca explora "por camadas de distância"?', 'Resumo, p.3: distâncias iniciam em −1, dist[v] = 0, fila = {v}.'],
    solution:
      'Busca em largura. (1) Para todo u: dist[u] ← −1; dist[v] ← 0; fila Q ← {v}. (2) Enquanto Q ≠ ∅: w ← remove o início de Q; para cada vizinho u de w com dist[u] = −1: dist[u] ← dist[w] + 1; insere u no fim de Q. (3) Saída: dist. Correção: a fila garante que todos os vértices a distância d são processados antes de qualquer um a distância d + 1, então o primeiro caminho que descobre u é o mais curto. Vértices com dist = −1 estão em outro componente. Custo O(|V| + |E|) com lista de adjacência.',
  },
];

export const treinoProvaQuestions: Question[] = [
  ...nkQuestions,
  ...pombosQuestions,
  ...subgrafosQuestions,
  ...autoComplementarQuestions,
  ...excentricidadeQuestions,
  ...bipartidoQuestions,
  ...buscaQuestions,
];
