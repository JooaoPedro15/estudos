import type { Question, Source } from '@/content/types';
import { bellmanFord, bridges, cutSet, dijkstra, fleury, floydWarshall, kruskal, makeGraph, prim, rankAndNullity } from '@/lib/graph';
import { FW_EXAMPLE, P2_2024_Q1, P2_2024_Q2, SLIDE_FINAL, SLIDE_FLEURY, SLIDE_LX, SLIDE_MST, SLIDE_SPANNING, placed } from './graphs-p2';

// Banco da P2. Respostas numéricas e caminhos saem do motor (src/lib/graph.ts);
// nada de valor digitado à mão. Fontes: slides 08-11 e a P2 de 2024/1.

const TV = '08-graphs-traversing.pdf';
const CN = '09-graphs-connectivity.pdf';
const SP = '10-graphs-shortest-path.pdf';
const TR = '11-graphs-trees-spanning-trees.pdf';
const s = (file: string, page: number, note: string): Source => ({ type: 'professor_slide', file, page, note });
const prova = (note: string): Source => ({ type: 'old_exam', file: 'P2 - 1º 2024 - parte 1.jpeg', note });
const CORMEN: Source = { type: 'book', author: 'Cormen et al., Algoritmos: teoria e prática', chapter: '25.2 — Floyd-Warshall' };

const fmt = (n: number) => (n === Infinity ? '∞' : String(n));

function pathTo(pred: Record<string, string | null>, source: string, target: string): string[] {
  const out = [target];
  let v = target;
  while (v !== source) {
    const p = pred[v];
    if (!p) return [];
    out.push(p);
    v = p;
  }
  return out.reverse();
}

function edgeIdsBetween(g: ReturnType<typeof makeGraph>, pairs: string[][]): string[] {
  return pairs.flatMap(([a, b]) => g.edges.filter((e) => (e.source === a && e.target === b) || (!g.directed && e.source === b && e.target === a)).map((e) => e.id));
}

// ---------------------------------------------------------------------------
// Resultados calculados
// ---------------------------------------------------------------------------

const mstSlide = kruskal(SLIDE_MST);
const primSlide = prim(SLIDE_MST, 'a');
const q1 = kruskal(P2_2024_Q1);
const q1Prim = prim(P2_2024_Q1, 'C1');
const q2 = bellmanFord(P2_2024_Q2, '1');
const dijFinal = dijkstra(SLIDE_FINAL, 'e');
const dijOrder = Object.entries(dijFinal.distances).sort((a, b) => a[1] - b[1]).map(([v]) => v);
const lx = dijkstra(SLIDE_LX, 'x0').distances;
const fw = floydWarshall(FW_EXAMPLE);
const rn = rankAndNullity(SLIDE_SPANNING);
const fleurySlide = fleury(SLIDE_FLEURY, 'f')!;

/** Exercício "Which of the edges in this graph are bridges?" — 08, quadro 32. */
const SLIDE_BRIDGES = placed(
  { b: [150, 50], f: [300, 80], e: [230, 140], d: [400, 170], a: [140, 230], c: [270, 290] },
  [['b', 'f'], ['b', 'e'], ['e', 'f'], ['e', 'a'], ['f', 'd'], ['a', 'd'], ['d', 'c']],
);
const slideBridges = bridges(SLIDE_BRIDGES);

/** Variante da Q1 da P2 2024/1 com 5 cidades (exemplo criado). */
const RODOVIAS_5 = placed(
  { A: [80, 80], B: [280, 40], C: [480, 80], D: [380, 280], E: [180, 280] },
  [['A', 'B', 12], ['A', 'C', 30], ['A', 'D', 25], ['A', 'E', 8], ['B', 'C', 14], ['B', 'D', 18], ['B', 'E', 20], ['C', 'D', 9], ['C', 'E', 27], ['D', 'E', 16]],
);
const rod5 = kruskal(RODOVIAS_5);

/** Variante da Q2 da P2 2024/1 com outros números (exemplo criado). */
const NEG_VARIANT = placed(
  { '1': [60, 160], '2': [220, 60], '3': [220, 260], '4': [380, 60], '5': [380, 260], '6': [510, 160] },
  [['1', '2', 4], ['1', '3', 6], ['2', '4', 5], ['3', '2', -3], ['3', '5', 2], ['4', '6', 1], ['5', '4', -4], ['5', '6', 7]],
  true,
);
const negVar = bellmanFord(NEG_VARIANT, '1');

const pathText = (pred: Record<string, string | null>, src: string, ids: string[], dist: Record<string, number>) =>
  ids.filter((v) => v !== src).map((v) => `${v}: comprimento ${fmt(dist[v])}, caminho ${pathTo(pred, src, v).join(' → ') || '— (inalcançável)'}`).join('\n');

const bfTableText = (table: Record<string, number>[], ids: string[]) =>
  [`i | ${ids.join(' ')}`, ...table.map((row, i) => `${i} | ${ids.map((v) => fmt(row[v])).join(' ')}`)].join('\n');

const matrixText = (m: number[][], ids: string[]) => [`   ${ids.join('  ')}`, ...m.map((row, i) => `${ids[i]}  ${row.map(fmt).join('  ')}`)].join('\n');

// ---------------------------------------------------------------------------
// Questões
// ---------------------------------------------------------------------------

export const p2Questions: Question[] = [
  // ================================================================ Indução
  {
    id: 'p2-ind-01',
    examFamily: 'p2-inducao',
    topic: 'inducao',
    difficulty: 'easy',
    duration: 'quick',
    examLikelihood: 'medium',
    sourceStyle: 'book',
    type: 'MULTIPLE_CHOICE',
    prompt: 'Numa prova por indução, o que é a hipótese indutiva?',
    options: [
      { id: 'a', label: 'Supor que a afirmação vale para um caso k (ou casos menores) e usar isso para provar o caso seguinte.' },
      { id: 'b', label: 'Verificar a afirmação no menor caso.' },
      { id: 'c', label: 'Testar a afirmação em vários exemplos até ter certeza.' },
      { id: 'd', label: 'Supor que a afirmação é falsa e chegar a uma contradição.' },
    ],
    correctOptionId: 'a',
    source: { type: 'book', author: 'Cormen et al., Algoritmos: teoria e prática', chapter: '4.3 (hipótese indutiva)' },
    hints: ['Base é uma coisa, hipótese é outra.'],
    solution: 'A hipótese indutiva é supor a afirmação para um caso (ou para os menores) e usá-la no passo para provar o próximo. Verificar o menor caso é a base. Testar exemplos não é prova; supor falso e chegar a contradição é outra técnica (absurdo).',
  },
  {
    id: 'p2-ind-02',
    examFamily: 'p2-inducao',
    topic: 'inducao',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'medium',
    sourceStyle: 'slide',
    type: 'MULTIPLE_CHOICE',
    prompt: 'No slide de caminhos mínimos, a correção do Dijkstra é provada "by induction on the size of S". O que é o caso base?',
    options: [
      { id: 'a', label: '|S| = 1: o único vértice em S é a origem s, com distância 0.' },
      { id: 'b', label: '|S| = n: todos os vértices já foram explorados.' },
      { id: 'c', label: 'O vértice v que acabou de entrar em S.' },
      { id: 'd', label: 'Um caminho alternativo P que sai de S por x e y.' },
    ],
    correctOptionId: 'a',
    source: s(SP, 46, 'Proof of Correctness — quadro 17 de 26'),
    hints: ['A indução é sobre o tamanho de S. Qual o menor S?'],
    solution: 'Slide, quadro 17: "Base case: |S| = 1. The only node in S is s." O passo indutivo é quando um novo v entra em S; o caminho alternativo por x e y aparece no passo, não na base.',
  },
  {
    id: 'p2-ind-03',
    examFamily: 'p2-inducao',
    topic: 'inducao',
    difficulty: 'hard',
    duration: 'deep',
    examLikelihood: 'medium',
    sourceStyle: 'generated',
    type: 'PROOF_OR_JUSTIFICATION',
    prompt: 'Prove, por indução no número de vértices, que toda árvore com n ≥ 1 vértices tem exatamente n − 1 arestas. Você pode usar o teorema do slide: "toda árvore com pelo menos dois vértices tem pelo menos duas folhas".',
    rubric: [
      'Base: n = 1, um vértice e 0 arestas = n − 1',
      'Hipótese: toda árvore com k vértices tem k − 1 arestas',
      'Passo: árvore com k + 1 ≥ 2 vértices tem uma folha v (teorema do slide)',
      'Remover v e sua única aresta deixa uma árvore com k vértices (continua conexo e sem ciclo)',
      'Pela hipótese, k − 1 arestas; com a aresta de v, k = (k + 1) − 1',
    ],
    source: s(TR, 9, 'All trees on n ≥ 1 vertices have exactly n − 1 edges — quadro 5 de 29'),
    hints: ['Base: uma árvore com 1 vértice.', 'No passo, tire uma folha. O que sobra ainda é árvore?'],
    solution: 'Indução em n. Base, n = 1: um vértice, nenhuma aresta, 0 = 1 − 1. Hipótese: toda árvore com k vértices tem k − 1 arestas. Passo: seja T árvore com k + 1 ≥ 2 vértices. Pelo teorema do slide, T tem uma folha v (grau 1). Remova v e sua única aresta: o que sobra é conexo (v não estava no meio de nenhum caminho entre outros dois vértices, pois tem grau 1) e não tem ciclo (remover não cria ciclo), logo é árvore com k vértices; pela hipótese tem k − 1 arestas. Devolvendo a aresta de v: k − 1 + 1 = k = (k + 1) − 1. ∎',
    examAnswer: `Prova por indução em n (número de vértices).

Base (n = 1): a árvore tem um único vértice e nenhuma aresta: 0 = 1 − 1. Vale.

Hipótese indutiva: toda árvore com k vértices (k ≥ 1) tem k − 1 arestas.

Passo: seja T uma árvore com k + 1 ≥ 2 vértices.
1. Pelo teorema (slide 11): toda árvore com pelo menos dois vértices tem pelo menos duas folhas. Seja v uma folha de T, d(v) = 1, ligada por uma única aresta e.
2. T′ = T − v (remove v e e). T′ é conexo: v tem grau 1, então nenhum caminho entre dois outros vértices passava por v. T′ não tem ciclo, pois remover vértice e aresta não cria ciclo. Logo T′ é árvore com k vértices.
3. Pela hipótese indutiva, T′ tem k − 1 arestas.
4. T tem as arestas de T′ mais e: (k − 1) + 1 = k = (k + 1) − 1.

Base e passo valem; portanto toda árvore com n ≥ 1 vértices tem n − 1 arestas. ∎`,
  },

  // ================================================================ Euler
  {
    id: 'p2-euler-01',
    examFamily: 'euleriano',
    topic: 'euleriano',
    difficulty: 'easy',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'slide',
    type: 'GRAPH_SELECT_EDGE',
    prompt: 'Exercício do slide (quadro 32): quais arestas deste grafo são pontes? Selecione todas.',
    graph: SLIDE_BRIDGES,
    multi: true,
    correctEdgeIds: slideBridges,
    source: s(TV, 133, 'Finding Eulerian tours — Bridges, quadro 32 de 33'),
    hints: ['Ponte: removida, desconecta o grafo.', 'Para cada aresta, pergunte: as duas pontas ainda se alcançam sem ela?'],
    solution: `Ponte é aresta cuja remoção desconecta G. Só (d, c) é ponte: sem ela, c fica isolado. As outras estão em ciclos (b–e–f, e–f–d–a, …), então sempre há outro caminho. No slide, é a opção 3: "(d,c)".`,
  },
  {
    id: 'p2-euler-02',
    examFamily: 'euleriano',
    topic: 'euleriano',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'slide',
    type: 'GRAPH_SELECT_EDGE',
    prompt: 'Fleury no grafo do slide (quadro 33), começando em f. Qual aresta incidente em f NÃO deve ser atravessada no primeiro passo?',
    graph: SLIDE_FLEURY,
    correctEdgeIds: edgeIdsBetween(SLIDE_FLEURY, [['f', 'd']]),
    source: s(TV, 137, "Fleury's Algorithm — quadro 33 de 33"),
    hints: ['Com mais de uma aresta disponível, Fleury evita a ponte.', 'Qual das três arestas de f desconecta o grafo?'],
    solution: `f tem três arestas: f–b, f–e e f–d. f–d é ponte: separa o triângulo b–e–f do resto. Como há outras opções, Fleury não a usa agora. Uma execução: ${fleurySlide.trail.join('-')}.`,
  },
  {
    id: 'p2-euler-03',
    examFamily: 'euleriano',
    topic: 'euleriano',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'slide',
    type: 'MULTIPLE_CHOICE',
    prompt: 'Pelo teorema do slide (quadro 31), se G tem caminho euleriano, então G tem…',
    options: [
      { id: 'a', label: 'no máximo dois vértices de grau ímpar.' },
      { id: 'b', label: 'todos os vértices de grau par.' },
      { id: 'c', label: 'exatamente um vértice de grau ímpar.' },
      { id: 'd', label: 'pelo menos dois vértices de grau ímpar.' },
    ],
    correctOptionId: 'a',
    source: s(TV, 130, 'Finding Eulerian tours — Theorem, quadro 31 de 33'),
    hints: ['O slide fala em "at most".'],
    solution: '"Theorem: If G has an Eulerian tour, G has at most two odd degree vertices." Todos pares é o caso do circuito (zero ímpares, que também é "no máximo dois"). Exatamente um é impossível: o número de vértices de grau ímpar é sempre par.',
  },
  {
    id: 'p2-euler-04',
    examFamily: 'euleriano',
    topic: 'euleriano',
    difficulty: 'hard',
    duration: 'deep',
    examLikelihood: 'high',
    sourceStyle: 'generated',
    type: 'PROOF_OR_JUSTIFICATION',
    prompt: 'Descreva o Algoritmo de Fleury e aplique-o ao grafo com arestas b–f, b–e, e–f, f–d, d–a, a–c, c–d (o grafo do slide 08, quadro 33). Justifique cada escolha.',
    graph: SLIDE_FLEURY,
    rubric: [
      'Verifica no máximo 2 vértices de grau ímpar (f e d, grau 3)',
      'Começa num vértice de grau ímpar',
      'A cada passo com mais de uma opção, escolhe aresta que não é ponte',
      'Remove a aresta usada (E = E − {e}) e para quando E = ∅',
      'Apresenta o caminho completo com as 7 arestas',
    ],
    source: s(TV, 137, "Fleury's Algorithm — quadro 33 de 33"),
    hints: ['Calcule os graus primeiro.', 'Em f, qual aresta é ponte?'],
    solution: `Graus: f = 3, d = 3, os demais 2. Dois ímpares: existe caminho euleriano, de f a d. Execução: ${fleurySlide.steps.slice(1, -1).map((x) => x.description).join(' ')} Caminho: ${fleurySlide.trail.join('-')}.`,
    examAnswer: `Fleury (slide 08, quadro 33). Entrada: G não direcionado e conexo.
1. Verificar que G tem no máximo 2 vértices de grau ímpar.
2. Começar num vértice v de grau ímpar, se houver.
3. Enquanto E ≠ ∅: se há mais de uma aresta incidente em v, atravessar uma que não seja ponte; senão, atravessar a única disponível. Fazer E = E − {e}.
(Ponte = aresta cuja remoção desconecta G.)

Aplicação. Graus: b = 2, e = 2, f = 3, d = 3, a = 2, c = 2. Dois ímpares (f e d): existe caminho euleriano começando em um e terminando no outro. Começo em f.
${fleurySlide.steps.slice(1, -1).map((x, i) => `${i + 1}. ${x.description}`).join('\n')}
E = ∅. Caminho euleriano: ${fleurySlide.trail.join('-')} (7 arestas, cada uma uma vez).`,
  },

  // ================================================================ Hamilton
  {
    id: 'p2-ham-01',
    examFamily: 'p2-hamilton',
    topic: 'hamiltoniano',
    difficulty: 'easy',
    duration: 'quick',
    examLikelihood: 'medium',
    sourceStyle: 'slide',
    type: 'MULTIPLE_CHOICE',
    prompt: 'Qual frase descreve corretamente a diferença entre caminho euleriano e hamiltoniano?',
    options: [
      { id: 'a', label: 'Euleriano passa por toda ARESTA exatamente uma vez; hamiltoniano passa por todo VÉRTICE exatamente uma vez.' },
      { id: 'b', label: 'Euleriano passa por todo vértice uma vez; hamiltoniano por toda aresta uma vez.' },
      { id: 'c', label: 'Os dois exigem passar por todas as arestas; só o hamiltoniano volta ao início.' },
      { id: 'd', label: 'São o mesmo conceito com nomes diferentes.' },
    ],
    correctOptionId: 'a',
    source: s(TV, 110, 'Hamiltonian tour — quadro 26 de 33'),
    hints: ['Euler: Königsberg, pontes (arestas).'],
    solution: 'Slide: Eulerian tour "passes through every edge exactly once"; Hamiltonian tour "each vertex occurs exactly once".',
  },
  {
    id: 'p2-ham-02',
    examFamily: 'p2-hamilton',
    topic: 'hamiltoniano',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'medium',
    sourceStyle: 'slide',
    type: 'MULTIPLE_CHOICE',
    prompt: 'Segundo os slides 25 e 26, como se comparam as questões algorítmicas "existe?" e "encontre" para Euler e Hamilton?',
    options: [
      { id: 'a', label: 'Euler: fácil de decidir e de calcular. Hamilton: não é fácil de decidir nem de calcular.' },
      { id: 'b', label: 'Os dois são fáceis: basta contar vértices de grau ímpar.' },
      { id: 'c', label: 'Euler é difícil; Hamilton é fácil.' },
      { id: 'd', label: 'Os dois são difíceis de decidir, mas fáceis de calcular.' },
    ],
    correctOptionId: 'a',
    source: s(TV, 106, 'Algorithmic issues — quadros 25-26 de 33'),
    hints: ['A contagem de graus ímpares serve para quem?'],
    solution: 'Quadro 25 (Euler): "Easy to decide", "Easy to compute". Quadro 26 (Hamilton): "Not easy to decide", "Not easy to compute".',
  },
  {
    id: 'p2-ham-03',
    examFamily: 'p2-hamilton',
    topic: 'hamiltoniano',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'medium',
    sourceStyle: 'generated',
    type: 'TRUE_FALSE',
    prompt: 'Se um grafo conexo tem exatamente dois vértices de grau ímpar, então ele tem caminho hamiltoniano.',
    correctValue: false,
    source: s(TV, 110, 'Hamiltonian tour — quadro 26 de 33'),
    hints: ['A regra dos graus ímpares é de Euler ou de Hamilton?'],
    solution: 'Falso. Dois vértices de grau ímpar (num grafo conexo) garantem caminho EULERIANO. Para hamiltoniano o slide não dá teste por graus: "not easy to decide".',
  },

  // ================================================================ Árvores e árvore geradora
  {
    id: 'p2-arv-01',
    examFamily: 'p2-arvores',
    topic: 'arvores',
    difficulty: 'easy',
    duration: 'quick',
    examLikelihood: 'medium',
    sourceStyle: 'slide',
    type: 'NUMBER_INPUT',
    prompt: 'Uma floresta tem 20 vértices e 4 árvores. Quantas arestas ela tem?',
    correctNumber: 16,
    source: s(TR, 26, 'A forest with n vertices and k trees has n − k edges — quadro 8 de 29'),
    hints: ['Cada árvore com n_i vértices tem n_i − 1 arestas.'],
    solution: 'Teorema do slide: floresta com n vértices e k árvores tem n − k arestas: 20 − 4 = 16.',
  },
  {
    id: 'p2-arv-02',
    examFamily: 'p2-arvores',
    topic: 'arvores',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'medium',
    sourceStyle: 'slide',
    type: 'MULTIPLE_CHOICE',
    prompt: 'Um grafo G tem 8 vértices e 7 arestas. O que é preciso saber para concluir que G é árvore?',
    options: [
      { id: 'a', label: 'Que G é conexo (recíproca do slide: conexo com n − 1 arestas é árvore).' },
      { id: 'b', label: 'Nada: n − 1 arestas já garante árvore.' },
      { id: 'c', label: 'Que G tem pelo menos duas folhas.' },
      { id: 'd', label: 'Que G é direcionado.' },
    ],
    correctOptionId: 'a',
    source: s(TR, 24, 'Converse theorem — quadro 8 de 29'),
    hints: ['Monte um contraexemplo: um ciclo com 4 vértices junto com um caminho de 4 vértices. Quantos vértices e arestas?'],
    solution: '"If a connected graph on n vertices has n − 1 edges, it is a tree." Sem conexidade não vale: um ciclo de 4 + um caminho de 4 vértices dá 4 + 3 = 7 arestas com 8 vértices e não é árvore.',
  },
  {
    id: 'p2-arv-03',
    examFamily: 'p2-arvores',
    topic: 'arvore-geradora',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'medium',
    sourceStyle: 'generated',
    type: 'NUMBER_INPUT',
    prompt: 'G é conexo, com 12 vértices e 17 arestas. Quantas cordas tem qualquer árvore geradora de G?',
    correctNumber: 17 - (12 - 1),
    source: s(TR, 35, 'Rank e nullity — quadro 11 de 29'),
    hints: ['Quantos ramos tem a árvore geradora?', 'Corda = aresta de G que não é ramo.'],
    solution: 'Árvore geradora tem n − 1 = 11 ramos (posto r = n − k = 12 − 1). Cordas = 17 − 11 = 6.',
  },
  {
    id: 'p2-arv-04',
    examFamily: 'p2-arvores',
    topic: 'arvore-geradora',
    difficulty: 'hard',
    duration: 'normal',
    examLikelihood: 'medium',
    sourceStyle: 'slide',
    type: 'MULTIPLE_CHOICE',
    prompt: `No exemplo do slide 11 (quadro 11): n = ${rn.n}, e = ${rn.e}, k = ${rn.k} e o desenho mostra 2 cordas. Qual fórmula de nulidade bate com o exemplo?`,
    displayGraphs: { a: SLIDE_SPANNING },
    options: [
      { id: 'a', label: `μ = e − n + k = ${rn.nullity}` },
      { id: 'b', label: `μ = e − n − k = ${rn.e - rn.n - rn.k}` },
      { id: 'c', label: `μ = n − k = ${rn.rank}` },
      { id: 'd', label: `μ = e − k = ${rn.e - rn.k}` },
    ],
    correctOptionId: 'a',
    source: s(TR, 35, 'Rank e nullity — quadro 11 de 29'),
    hints: ['Cordas = arestas que não são ramos.', 'Quantos ramos? r = n − k.'],
    solution: `Cordas = e − ramos = e − (n − k) = e − n + k = ${rn.e} − ${rn.n} + ${rn.k} = ${rn.nullity}, igual ao desenho. A fórmula impressa no slide (e − n − k) dá ${rn.e - rn.n - rn.k} e não bate com o próprio exemplo; parece erro de sinal. Vale confirmar com o professor.`,
  },

  // ================================================================ Cortes
  {
    id: 'p2-corte-01',
    examFamily: 'p2-cortes',
    topic: 'cortes',
    difficulty: 'easy',
    duration: 'quick',
    examLikelihood: 'medium',
    sourceStyle: 'slide',
    type: 'GRAPH_SELECT_EDGE',
    prompt: 'Seja S = {a, d}. Selecione todas as arestas de cut(S).',
    graph: SLIDE_MST,
    multi: true,
    correctEdgeIds: cutSet(SLIDE_MST, ['a', 'd']),
    source: s(TR, 56, 'cut(S) — quadro 18 de 29'),
    hints: ['Uma ponta em S, outra fora.', 'a–d tem as duas pontas em S: não entra.'],
    solution: 'cut(S) = arestas (v, w) com v ∈ S e w ∈ V − S: a–b, b–d, d–e, d–f. A aresta a–d fica fora, pois as duas pontas estão em S.',
  },
  {
    id: 'p2-corte-02',
    examFamily: 'p2-cortes',
    topic: 'cortes',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'medium',
    sourceStyle: 'slide',
    type: 'GRAPH_SELECT_EDGE',
    prompt: 'Pela propriedade do ciclo: no ciclo b–e–d–b, qual aresta NÃO pertence a nenhuma AGM?',
    graph: SLIDE_MST,
    correctEdgeIds: edgeIdsBetween(SLIDE_MST, [['d', 'e']]),
    source: s(TR, 80, 'Cycle Property — quadro 24 de 29'),
    hints: ['Compare os custos das três arestas do ciclo.'],
    solution: 'Ciclo b–e (7), e–d (15), d–b (9). A mais cara, d–e (15), não está em nenhuma AGM (propriedade do ciclo).',
  },
  {
    id: 'p2-corte-03',
    examFamily: 'p2-cortes',
    topic: 'cortes',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'medium',
    sourceStyle: 'slide',
    type: 'MULTIPLE_CHOICE',
    prompt: 'Sejam κ(G) a conectividade de vértices, λ(G) a de arestas e δ(G) o menor grau. Qual relação o slide afirma?',
    options: [
      { id: 'a', label: 'κ(G) ≤ λ(G) ≤ δ(G)' },
      { id: 'b', label: 'λ(G) ≤ κ(G) ≤ δ(G)' },
      { id: 'c', label: 'δ(G) ≤ κ(G) ≤ λ(G)' },
      { id: 'd', label: 'κ(G) = λ(G) = δ(G) sempre' },
    ],
    correctOptionId: 'a',
    source: s(CN, 88, 'Connectivity and separability — quadro 18 de 20'),
    hints: ['Tirando todas as arestas do vértice de menor grau, ele se isola.'],
    solution: 'Slide 09, quadro 18: a conectividade de arestas é ≤ ao menor grau, e a de vértices é ≤ à de arestas: κ(G) ≤ λ(G) ≤ δ(G).',
  },
  {
    id: 'p2-corte-04',
    examFamily: 'p2-cortes',
    topic: 'cortes',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'medium',
    sourceStyle: 'slide',
    type: 'GRAPH_SELECT_EDGE',
    prompt: 'Pela propriedade do corte, com S = {a, d}: qual aresta de cut(S) está em TODA AGM?',
    graph: SLIDE_MST,
    correctEdgeIds: edgeIdsBetween(SLIDE_MST, [['d', 'f']]),
    source: s(TR, 70, 'Cut Property — quadro 20 de 29'),
    hints: ['cut(S) = a–b (7), b–d (9), d–e (15), d–f (6).'],
    solution: 'A mais barata de cut({a, d}) é d–f, custo 6. Com custos distintos nesse corte, toda AGM contém d–f.',
  },

  // ================================================================ AGM
  {
    id: 'p2-agm-01',
    examFamily: 'p2-agm',
    topic: 'agm-prim-kruskal',
    difficulty: 'medium',
    duration: 'normal',
    examLikelihood: 'high',
    sourceStyle: 'slide',
    type: 'NUMBER_INPUT',
    prompt: '"What\'s the weight of the MST?" (slide 11, quadros 16-17). Qual o custo da AGM do grafo?',
    displayGraphs: { a: SLIDE_MST },
    correctNumber: mstSlide.totalWeight,
    source: s(TR, 51, "Example of Prim's Algorithm — quadro 16 de 29"),
    hints: ['Kruskal: ordene as arestas por custo.', 'Precisa de 6 arestas (7 vértices).'],
    solution: `Kruskal: aceita a–d (5), c–e (5), d–f (6), a–b (7), b–e (7), e–g (9); descarta b–c, e–f, b–d, f–g, d–e por criarem ciclo. Custo = 5 + 5 + 6 + 7 + 7 + 9 = ${mstSlide.totalWeight}.`,
  },
  {
    id: 'p2-agm-02',
    examFamily: 'p2-agm',
    topic: 'agm-prim-kruskal',
    difficulty: 'medium',
    duration: 'normal',
    examLikelihood: 'high',
    sourceStyle: 'slide',
    type: 'ORDERING',
    prompt: 'Prim a partir de a, no grafo do slide 11 (quadro 16). Coloque as arestas na ordem em que entram na árvore.',
    displayGraphs: { a: SLIDE_MST },
    items: primSlide.treeEdgeIds.map((id) => {
      const e = SLIDE_MST.edges.find((x) => x.id === id)!;
      return { id, label: `${e.source}–${e.target} (${e.weight})` };
    }).sort((x, y) => x.label.localeCompare(y.label)),
    correctOrder: primSlide.treeEdgeIds,
    source: s(TR, 51, "Example of Prim's Algorithm — quadro 16 de 29"),
    hints: ['A cada passo, só valem as arestas que ligam a árvore atual ao resto.', 'Primeiro passo: entre a–b (7) e a–d (5).'],
    solution: `Prim: S = {a}; escolhe sempre a mais barata de cut(S): ${primSlide.treeEdgeIds.map((id) => { const e = SLIDE_MST.edges.find((x) => x.id === id)!; return `${e.source}–${e.target} (${e.weight})`; }).join(', ')}. Custo ${primSlide.totalWeight}.`,
  },
  {
    id: 'p2-agm-03',
    examFamily: 'p2-agm',
    topic: 'agm-prim-kruskal',
    difficulty: 'medium',
    duration: 'normal',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    type: 'GRAPH_SELECT_EDGE',
    prompt: 'P2 2024/1, Q1(b): custos de construção entre 4 cidades. Selecione as rodovias da solução de menor custo que deixa todas as cidades alcançáveis.',
    graph: P2_2024_Q1,
    multi: true,
    correctEdgeIds: q1.treeEdgeIds,
    source: prova('Q1(b)'),
    hints: ['É uma AGM.', 'Comece pela mais barata: C2–C4 (10).'],
    solution: `Kruskal: C2–C4 (10), C1–C3 (20), C1–C2 (30). As demais criariam ciclo. Custo ${q1.totalWeight} milhões.`,
  },
  {
    id: 'p2-agm-04',
    examFamily: 'p2-agm',
    topic: 'agm-prim-kruskal',
    difficulty: 'easy',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'slide',
    type: 'DRAG_AND_DROP',
    prompt: 'Associe cada estratégia gulosa do slide 11 (quadro 14) ao nome do algoritmo.',
    items: [
      { id: 'inc', label: 'Processa arestas em ordem crescente de custo; descarta a que cria ciclo' },
      { id: 'dij', label: 'Começa num vértice s e cresce T adicionando o vértice mais barato de anexar' },
      { id: 'dec', label: 'Apaga arestas em ordem decrescente de custo enquanto o grafo continuar conexo' },
    ],
    buckets: [
      { id: 'kruskal', label: 'Kruskal' },
      { id: 'prim', label: 'Prim' },
      { id: 'rd', label: 'Reverse-Delete' },
    ],
    correctMap: { inc: 'kruskal', dij: 'prim', dec: 'rd' },
    source: s(TR, 44, 'Greedy Algorithm for the MST Problem — quadro 14 de 29'),
    hints: ['"Dijkstra-like" é o que cresce a partir de um vértice.'],
    solution: 'Increasing cost order → Kruskal. Dijkstra-like → Prim. Decreasing cost order → Reverse-Delete. "Which of these algorithms works? All of them!"',
  },
  {
    id: 'p2-agm-05',
    examFamily: 'p2-agm',
    topic: 'agm-prim-kruskal',
    difficulty: 'hard',
    duration: 'deep',
    examLikelihood: 'high',
    sourceStyle: 'generated',
    type: 'PROOF_OR_JUSTIFICATION',
    prompt: 'Variante da P2 2024/1-Q1: cinco cidades A…E serão ligadas por rodovias de modo que de cada cidade se chegue a qualquer outra. Os custos (milhões) são: A–B 12, A–C 30, A–D 25, A–E 8, B–C 14, B–D 18, B–E 20, C–D 9, C–E 27, D–E 16. (a) Modele com grafos (tipo de grafo, vértices, arestas, pesos) e diga o método. (b) Aplique e dê o custo.',
    graph: RODOVIAS_5,
    rubric: [
      'Grafo não direcionado: cidades = vértices, rodovias possíveis = arestas',
      'Peso de cada aresta = custo de construção',
      'Identifica o problema como árvore geradora mínima e cita Prim ou Kruskal',
      'Executa passo a passo, justificando aceitações e descartes',
      'Dá as rodovias escolhidas e o custo total',
    ],
    source: prova('Q1, variante com outros números'),
    hints: ['Mesmo raciocínio da Q1 da prova.', 'Kruskal: ordene os 10 custos.'],
    solution: `AGM por Kruskal: ${rod5.steps.slice(1, -1).map((x) => x.description).join(' ')} Custo ${rod5.totalWeight}.`,
    examAnswer: `(a) Modelagem: grafo NÃO direcionado e ponderado G = (V, E). Vértices: as cidades A, B, C, D, E. Arestas: cada rodovia que pode ser construída (ligar i a j serve nos dois sentidos). Peso da aresta (i, j): o custo de construção p_ij. Queremos T ⊆ E com (V, T) conexo e soma de custos mínima: é a árvore geradora mínima (AGM). Método: Kruskal (ou Prim).
(b) Kruskal — arestas em ordem não decrescente de custo; aceita se não cria ciclo:
${rod5.steps.slice(1, -1).map((x, i) => `${i + 1}. ${x.description}`).join('\n')}
Rodovias construídas: ${rod5.treeEdgeIds.map((id) => { const e = RODOVIAS_5.edges.find((x) => x.id === id)!; return `${e.source}–${e.target}`; }).join(', ')}. Custo total: ${rod5.totalWeight} milhões (4 arestas = n − 1).`,
  },

  // ================================================================ Caminho mínimo — conceitos
  {
    id: 'p2-cm-01',
    examFamily: 'p2-dijkstra',
    topic: 'caminho-minimo-conceitos',
    difficulty: 'easy',
    duration: 'quick',
    examLikelihood: 'medium',
    sourceStyle: 'slide',
    type: 'GRAPH_SELECT_VERTEX',
    prompt: 'No exemplo do mapa Lx (slide 10, quadro 8), quais vértices têm Lx0(y) = ∞?',
    graph: SLIDE_LX,
    multi: true,
    correctVertexIds: Object.entries(lx).filter(([, d]) => d === Infinity).map(([v]) => v),
    source: s(SP, 18, 'Illustration: the map Lx — quadro 8 de 26'),
    hints: ['Lx(y) = ∞ quando não existe caminho de x a y.', 'Olhe as setas que CHEGAM em cada vértice.'],
    solution: `Só x2: nenhuma aresta chega em x2 (ele só tem arestas saindo), então não há caminho de x0 até ele. Lx0 = (${['x0', 'x1', 'x2', 'x3', 'x4', 'x5', 'x6'].map((v) => fmt(lx[v])).join(', ')}).`,
  },
  {
    id: 'p2-cm-02',
    examFamily: 'p2-dijkstra',
    topic: 'caminho-minimo-conceitos',
    difficulty: 'easy',
    duration: 'quick',
    examLikelihood: 'medium',
    sourceStyle: 'slide',
    type: 'NUMBER_INPUT',
    prompt: 'No mesmo exemplo, quanto vale Lx0(x3)?',
    displayGraphs: { a: SLIDE_LX },
    correctNumber: lx.x3,
    source: s(SP, 18, 'Illustration: the map Lx — quadro 8 de 26'),
    hints: ['Compare x0→x1→x3, x0→x1→x4→x3 e x0→x1→x4→x5→x3.'],
    solution: `x0→x1→x3 = 3 + 5 = 8; x0→x1→x4→x3 = 3 + 2 + 2 = 7; x0→x1→x4→x5→x3 = 3 + 2 + 1 + 1 = 7. Menor: ${lx.x3}.`,
  },

  // ================================================================ Dijkstra
  {
    id: 'p2-dij-01',
    examFamily: 'p2-dijkstra',
    topic: 'dijkstra',
    difficulty: 'medium',
    duration: 'normal',
    examLikelihood: 'high',
    sourceStyle: 'slide',
    type: 'ORDERING',
    prompt: 'Exercício do slide 10 (quadro 26): Dijkstra a partir de e. Coloque os vértices na ordem em que entram em S.',
    displayGraphs: { a: SLIDE_FINAL },
    items: [...dijOrder].sort().map((v) => ({ id: v, label: v })),
    correctOrder: dijOrder,
    source: s(SP, 72, 'Shortest path — an example, quadro 26 de 26'),
    hints: ['Entra em S quem tem o menor d entre os de fora.', 'Depois de e: f (5), g (8) ou a (9)?'],
    solution: `Ordem: ${dijOrder.map((v) => `${v} (${dijFinal.distances[v]})`).join(', ')}.`,
  },
  {
    id: 'p2-dij-02',
    examFamily: 'p2-dijkstra',
    topic: 'dijkstra',
    difficulty: 'medium',
    duration: 'normal',
    examLikelihood: 'high',
    sourceStyle: 'slide',
    type: 'GRAPH_SELECT_EDGE',
    prompt: 'Ainda no quadro 26 (origem e): selecione as arestas do menor caminho de e até d.',
    graph: SLIDE_FINAL,
    multi: true,
    correctEdgeIds: (() => {
      const p = pathTo(dijFinal.predecessors, 'e', 'd');
      return edgeIdsBetween(SLIDE_FINAL, p.slice(1).map((v, i) => [p[i], v]));
    })(),
    source: s(SP, 72, 'Shortest path — an example, quadro 26 de 26'),
    hints: ['Calcule d de todos e guarde o predecessor de cada um.', `d(d) = ${dijFinal.distances.d}.`],
    solution: `Seguindo os predecessores a partir de d: ${pathTo(dijFinal.predecessors, 'e', 'd').join(' → ')}, comprimento ${dijFinal.distances.d}.`,
  },
  {
    id: 'p2-dij-03',
    examFamily: 'p2-dijkstra',
    topic: 'dijkstra',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'medium',
    sourceStyle: 'slide',
    type: 'MULTIPLE_CHOICE',
    prompt: 'Na implementação com fila de prioridade (slide 10, quadro 20), quantas vezes ExtractMin e ChangeKey são chamados?',
    options: [
      { id: 'a', label: 'ExtractMin n − 1 vezes; ChangeKey m vezes.' },
      { id: 'b', label: 'ExtractMin m vezes; ChangeKey n − 1 vezes.' },
      { id: 'c', label: 'Os dois n vezes.' },
      { id: 'd', label: 'Os dois m vezes.' },
    ],
    correctOptionId: 'a',
    source: s(SP, 56, 'A Faster implementation of Dijkstra — quadro 20 de 26'),
    hints: ['Uma retirada por iteração do laço. Uma atualização possível por aresta.'],
    solution: 'O laço roda n − 1 vezes (um ExtractMin cada). Cada aresta pode melhorar um vizinho uma vez (ChangeKey): m. Slide: "n − 1 and m times, respectively".',
  },
  {
    id: 'p2-dij-04',
    examFamily: 'p2-dijkstra',
    topic: 'dijkstra',
    difficulty: 'hard',
    duration: 'deep',
    examLikelihood: 'high',
    sourceStyle: 'slide',
    type: 'PROOF_OR_JUSTIFICATION',
    prompt: '"Compute the shortest path from e to all other nodes!" (slide 10, quadro 26). Execute o Dijkstra mostrando a ordem de entrada em S, as distâncias e os caminhos.',
    graph: SLIDE_FINAL,
    rubric: [
      'Inicializa d[e] = 0 e ∞ nos demais',
      'A cada passo, coloca em S o vértice de menor d fora de S',
      'Atualiza só os vizinhos do vértice que entrou',
      'Dá as distâncias finais de todos',
      'Dá os caminhos (pelos predecessores)',
    ],
    source: s(SP, 72, 'Shortest path — an example, quadro 26 de 26'),
    hints: ['Monte uma tabela vértice × d × em S? × predecessor.'],
    solution: pathText(dijFinal.predecessors, 'e', dijOrder, dijFinal.distances),
    examAnswer: `Dijkstra (slide 10, quadro 15): S = explorados; d[e] = 0, d = ∞ nos demais; a cada passo entra em S o v ∉ S com menor d′(v) = min{d[u] + W(u, v) : u ∈ S}, e guardamos o predecessor que deu o mínimo.

Ordem de entrada em S: ${dijOrder.map((v) => `${v} (d = ${dijFinal.distances[v]})`).join(', ')}.

Distâncias e caminhos a partir de e:
${pathText(dijFinal.predecessors, 'e', dijOrder, dijFinal.distances)}

Todos os pesos são não negativos, então o Dijkstra se aplica.`,
  },
  {
    id: 'p2-dij-05',
    examFamily: 'p2-dijkstra',
    topic: 'dijkstra',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'slide',
    type: 'NUMBER_INPUT',
    prompt: 'Quadro 26, origem e: qual o comprimento do menor caminho até c?',
    displayGraphs: { a: SLIDE_FINAL },
    correctNumber: dijFinal.distances.c,
    source: s(SP, 72, 'Shortest path — an example, quadro 26 de 26'),
    hints: ['f → c custa 15 direto; existe algo melhor passando por h?'],
    solution: `e → f → c = 5 + 15 = 20; e → a → b → h → c = 9 + 4 + 1 + 3 = 17. Menor: ${dijFinal.distances.c} (${pathTo(dijFinal.predecessors, 'e', 'c').join(' → ')}).`,
  },

  // ================================================================ Bellman-Ford
  {
    id: 'p2-bf-01',
    examFamily: 'p2-caminho-negativo',
    topic: 'bellman-ford',
    difficulty: 'medium',
    duration: 'normal',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    type: 'GRAPH_SELECT_EDGE',
    prompt: 'P2 2024/1, Q2: matriz D com comprimentos (alguns negativos), origem 1. Selecione as arestas da árvore de caminhos mínimos a partir de 1.',
    graph: P2_2024_Q2,
    multi: true,
    correctEdgeIds: ['2', '3', '4', '5', '6', '7'].flatMap((v) => edgeIdsBetween(P2_2024_Q2, [[q2.predecessors[v]!, v]])),
    source: prova('Q2'),
    hints: ['Há pesos negativos: use Bellman-Ford.', 'Cada vértice (menos 1) tem exatamente uma aresta chegando na árvore: a do seu predecessor.'],
    solution: `Predecessores: ${['2', '3', '4', '5', '6', '7'].map((v) => `${v} ← ${q2.predecessors[v]}`).join(', ')}.`,
  },
  {
    id: 'p2-bf-02',
    examFamily: 'p2-caminho-negativo',
    topic: 'bellman-ford',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'slide',
    type: 'MULTIPLE_CHOICE',
    prompt: 'Por que não dá para "consertar" pesos negativos somando uma constante a todas as arestas e rodando o Dijkstra? (slide 10, quadro 22)',
    options: [
      { id: 'a', label: 'Porque caminhos com mais arestas recebem mais acréscimo, e o menor caminho pode mudar.' },
      { id: 'b', label: 'Porque somar uma constante cria ciclos.' },
      { id: 'c', label: 'Porque o Dijkstra não aceita pesos maiores que 1.' },
      { id: 'd', label: 'Dá certo: é exatamente o que o Bellman-Ford faz.' },
    ],
    correctOptionId: 'a',
    source: s(SP, 61, 'Re-weighting — quadro 22 de 26'),
    hints: ['No exemplo do slide, a–b–d tem 2 arestas e a–c–e–d tem 3.'],
    solution: 'Somando c a cada aresta, um caminho com k arestas ganha k·c. No exemplo do slide, a–c–e–d (3 arestas, custo 3) era menor que a–b–d (2 arestas, custo 4); somando 3, vira 12 contra 10 e o vencedor muda.',
  },
  {
    id: 'p2-bf-03',
    examFamily: 'p2-caminho-negativo',
    topic: 'bellman-ford',
    difficulty: 'medium',
    duration: 'normal',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    type: 'NUMBER_INPUT',
    prompt: 'P2 2024/1, Q2: comprimento do caminho mínimo de 1 até 7.',
    displayGraphs: { a: P2_2024_Q2 },
    correctNumber: q2.distances['7'],
    source: prova('Q2'),
    hints: ['Os negativos estão em 3→2, 4→3, 2→5 e 4→6.'],
    solution: `${pathTo(q2.predecessors, '1', '7').join(' → ')} = 5 − 2 − 2 − 1 + 3 = ${q2.distances['7']}.`,
  },
  {
    id: 'p2-bf-04',
    examFamily: 'p2-caminho-negativo',
    topic: 'bellman-ford',
    difficulty: 'hard',
    duration: 'normal',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    type: 'MULTIPLE_CHOICE',
    prompt: 'Na tabela do Bellman-Ford para a Q2 da P2 2024/1 (origem 1), quanto vale d[2, 2] — o menor caminho de 1 a 2 com no máximo 2 arestas?',
    displayGraphs: { a: P2_2024_Q2 },
    options: [
      { id: 'a', label: String(q2.table[2]['2']) },
      { id: 'b', label: String(q2.table[1]['2']) },
      { id: 'c', label: String(q2.distances['2']) },
      { id: 'd', label: '∞' },
    ],
    correctOptionId: 'a',
    source: s(SP, 68, 'Bellman-Ford (d[i, v]) — quadro 25 de 26'),
    hints: ['Com 1 aresta: só 1→2 = 6.', 'Com 2 arestas: 1→3→2.'],
    solution: `d[1, 2] = ${q2.table[1]['2']} (só a aresta 1→2). d[2, 2] = min{6, d[1, 3] + (−2)} = min{6, 5 − 2} = ${q2.table[2]['2']}. O valor final ${q2.distances['2']} só aparece com 3 arestas (1→4→3→2).`,
  },
  {
    id: 'p2-bf-05',
    examFamily: 'p2-caminho-negativo',
    topic: 'bellman-ford',
    difficulty: 'easy',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'slide',
    type: 'MULTIPLE_CHOICE',
    prompt: 'Qual o custo computacional do Bellman-Ford no slide (quadro 25)?',
    options: [
      { id: 'a', label: 'O(mn)' },
      { id: 'b', label: 'O(n)' },
      { id: 'c', label: 'O(m + n)' },
      { id: 'd', label: 'O(n³)' },
    ],
    correctOptionId: 'a',
    source: s(SP, 69, 'Bellman-Ford — "Computational cost: O(mn)", quadro 25 de 26'),
    hints: ['n − 1 rodadas, cada uma olha todas as m arestas.'],
    solution: 'n − 1 rodadas × m arestas por rodada: O(mn).',
  },
  {
    id: 'p2-bf-06',
    examFamily: 'p2-caminho-negativo',
    topic: 'bellman-ford',
    difficulty: 'hard',
    duration: 'deep',
    examLikelihood: 'high',
    sourceStyle: 'generated',
    type: 'PROOF_OR_JUSTIFICATION',
    prompt: 'Variante da P2 2024/1-Q2. Arestas direcionadas e comprimentos: 1→2 = 4, 1→3 = 6, 2→4 = 5, 3→2 = −3, 3→5 = 2, 4→6 = 1, 5→4 = −4, 5→6 = 7. Determine os caminhos mínimos (tamanho e arestas) a partir do vértice 1 para todos os demais.',
    graph: NEG_VARIANT,
    rubric: [
      'Percebe os pesos negativos e escolhe Bellman-Ford (Dijkstra não se aplica)',
      'Monta a tabela d[i, v], i = 0..n − 1, cada linha usando a anterior',
      'Verifica que não há ciclo negativo',
      'Dá o comprimento de cada caminho',
      'Dá as arestas de cada caminho (predecessores)',
    ],
    source: prova('Q2, variante com outros números'),
    hints: ['Existe aresta negativa: Dijkstra pode errar.', 'n = 6: linhas i = 0 a 5.'],
    solution: pathText(negVar.predecessors, '1', ['1', '2', '3', '4', '5', '6'], negVar.distances),
    examAnswer: `Há comprimentos negativos (3→2 = −3, 5→4 = −4), então o Dijkstra não se aplica ("cannot handle negative edge lengths"). Uso o Bellman-Ford (slide 10, quadro 25): d[i, v] = menor caminho de 1 a v com no máximo i arestas; d[0, 1] = 0 e ∞ nos demais; para i = 1..n − 1, d[i, v] = min{d[i − 1, v], d[i − 1, w] + c_wv} para cada aresta (w, v).

Tabela (n = 6):
${bfTableText(negVar.table, ['1', '2', '3', '4', '5', '6'])}

Não há ciclo negativo (uma rodada extra não melhora nada), então os valores da última linha são os caminhos mínimos:
${pathText(negVar.predecessors, '1', ['1', '2', '3', '4', '5', '6'], negVar.distances)}`,
  },

  // ================================================================ Floyd-Warshall (livro)
  {
    id: 'p2-fw-01',
    examFamily: 'p2-floyd',
    topic: 'floyd-warshall',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'medium',
    sourceStyle: 'book',
    type: 'MULTIPLE_CHOICE',
    prompt: 'No Floyd-Warshall (Cormen 25.2), o que significa d(k)ij?',
    options: [
      { id: 'a', label: 'O peso do menor caminho de i a j cujos vértices intermediários estão todos em {1, …, k}.' },
      { id: 'b', label: 'O peso do menor caminho de i a j com no máximo k arestas.' },
      { id: 'c', label: 'A distância de i a j depois de k rodadas do Dijkstra.' },
      { id: 'd', label: 'O peso da aresta (i, j) somado a k.' },
    ],
    correctOptionId: 'a',
    source: CORMEN,
    hints: ['"No máximo k arestas" é a ideia do Bellman-Ford, não do Floyd.'],
    solution: 'd(k)ij = peso de um menor caminho de i a j cujos vértices intermediários estão em {1, 2, …, k} (Cormen 25.2). "No máximo i arestas" é o d[i, v] do Bellman-Ford.',
  },
  {
    id: 'p2-fw-02',
    examFamily: 'p2-floyd',
    topic: 'floyd-warshall',
    difficulty: 'medium',
    duration: 'normal',
    examLikelihood: 'medium',
    sourceStyle: 'book',
    type: 'NUMBER_INPUT',
    prompt: 'Grafo do exemplo (arestas 1→2 = 3, 2→3 = 2, 1→4 = 7, 4→3 = −2, 3→1 = 4, 2→4 = 1). Ao final do Floyd-Warshall, quanto vale d(4)₁₃?',
    displayGraphs: { a: FW_EXAMPLE },
    correctNumber: fw.matrices[4][0][2],
    source: CORMEN,
    hints: ['Compare 1→2→3, 1→4→3 e 1→2→4→3.'],
    solution: `1→2→3 = 5; 1→4→3 = 5; 1→2→4→3 = 3 + 1 − 2 = ${fw.matrices[4][0][2]}. Caminho: ${fw.path('1', '3')!.join(' → ')}.`,
  },
  {
    id: 'p2-fw-03',
    examFamily: 'p2-floyd',
    topic: 'floyd-warshall',
    difficulty: 'hard',
    duration: 'deep',
    examLikelihood: 'medium',
    sourceStyle: 'book',
    type: 'PROOF_OR_JUSTIFICATION',
    prompt: 'Execute o Floyd-Warshall no grafo com arestas 1→2 = 3, 2→3 = 2, 1→4 = 7, 4→3 = −2, 3→1 = 4, 2→4 = 1. Mostre D(0) e D(4) e diga se há ciclo negativo. (Questão de treino baseada no Cormen: não há slide do professor deste algoritmo.)',
    graph: FW_EXAMPLE,
    rubric: ['Monta D(0) com 0 na diagonal e ∞ sem aresta', 'Aplica d(k)ij = min(d(k−1)ij, d(k−1)ik + d(k−1)kj) para k = 1..4', 'Apresenta D(4)', 'Conclui sobre ciclo negativo pela diagonal'],
    source: CORMEN,
    hints: ['k é o laço de fora: libere um intermediário por vez.'],
    solution: `D(4):\n${matrixText(fw.matrices[4], fw.ids)}`,
    examAnswer: `Floyd-Warshall (Cormen 25.2): d(k)ij = peso do menor caminho de i a j com intermediários em {1..k}; D(0) = matriz de pesos; d(k)ij = min(d(k−1)ij, d(k−1)ik + d(k−1)kj).

D(0):
${matrixText(fw.matrices[0], fw.ids)}

${fw.steps.slice(1).map((x) => x.description).join('\n')}

D(4):
${matrixText(fw.matrices[4], fw.ids)}

Diagonal de D(4) toda ≥ 0: não há ciclo negativo.`,
  },
];

// ---------------------------------------------------------------------------
// Prova real: P2 de 2024/1 (Prof. Zenilton), só as questões do escopo 2026/2
// ---------------------------------------------------------------------------

const realQ1 = (): Question => ({
  id: 'pr-p2-2024-1-q1',
  examFamily: 'p2-agm',
  topic: 'agm-prim-kruskal',
  difficulty: 'hard',
  duration: 'deep',
  examLikelihood: 'high',
  sourceStyle: 'old_exam',
  professorStyleSimilarity: 'medium',
  type: 'PROOF_OR_JUSTIFICATION',
  prompt: `(02 pts + 02 pts = 04 pts) Considere um problema de construção de rodovias entre n cidades: C1, ..., Cn. As rodovias serão construídas de tal forma que a partir de cada cidade é possível chegar a outra diretamente. O custo de construção da rodovia entre o par de cidades (i, j) é dado por p_ij. De forma a garantir viabilidade econômica ao projeto de construção de rodovias, deseja-se encontrar o conjunto de rodovias que garanta que todas as cidades sejam alcançáveis ao menor custo possível.
Pede-se:
a) Descreva como esse problema pode ser modelado utilizando grafos, detalhando tipo de grafo (direcionado ou não), o que os vértices e arestas representam e se eles são valorados/ponderados ou não e com que informação. Forneça também uma descrição de método a ser utilizado para obtenção da solução para o problema com base na modelagem descrita.
b) Aplique a modelagem e método descritos no item (a) para o caso em que existem 4 cidades, cujos custos de construção (em milhões de reais) são apresentados na tabela abaixo:

      C1  C2  C3  C4
  C1   0  30  20  50
  C2  30   0  50  10
  C3  20  50   0  75
  C4  50  10  75   0`,
  graph: P2_2024_Q1,
  rubric: [
    'Grafo não direcionado: cidades = vértices, rodovias possíveis = arestas',
    'Arestas ponderadas pelo custo de construção p_ij',
    'Identifica árvore geradora mínima e descreve Prim ou Kruskal',
    'Executa o método na tabela, justificando cada aresta',
    'Conclui com as rodovias escolhidas e o custo total',
  ],
  source: prova('Q1 (4 de 20 pontos)'),
  hints: ['"Todas as cidades alcançáveis ao menor custo" = conexo com custo mínimo.'],
  solution: `AGM: ${q1.treeEdgeIds.map((id) => { const e = P2_2024_Q1.edges.find((x) => x.id === id)!; return `${e.source}–${e.target} (${e.weight})`; }).join(', ')}; custo ${q1.totalWeight}.`,
  examAnswer: `a) Modelagem: grafo NÃO direcionado e ponderado G = (V, E). Cada vértice é uma cidade Ci. Cada aresta {Ci, Cj} é uma rodovia que pode ser construída (serve nos dois sentidos), com peso p_ij = custo de construção. Queremos T ⊆ E tal que (V, T) seja conexo (todas as cidades alcançáveis) e Σ p_e seja mínima: é o problema da árvore geradora mínima (AGM) — a solução de custo mínimo não tem ciclo, então é uma árvore.
Método — Kruskal (slide 11): começar com T vazio; processar as arestas em ordem não decrescente de custo; adicionar a aresta a T se ela não criar ciclo, senão descartar. (Prim também resolve: começar numa cidade e adicionar sempre a aresta mais barata que liga a árvore a uma cidade fora dela.)

b) Arestas em ordem de custo: C2–C4 (10), C1–C3 (20), C1–C2 (30), C1–C4 (50), C2–C3 (50), C3–C4 (75).
${q1.steps.slice(1, -1).map((x, i) => `${i + 1}. ${x.description}`).join('\n')}
Rodovias construídas: C2–C4, C1–C3, C1–C2 (3 = n − 1 arestas). Custo total: ${q1.totalWeight} milhões de reais.
Conferência por Prim a partir de C1: ${q1Prim.steps.slice(1, -1).map((x) => x.description).join(' ')} Mesmo custo, ${q1Prim.totalWeight}.`,
});

const realQ2 = (): Question => ({
  id: 'pr-p2-2024-1-q2',
  examFamily: 'p2-caminho-negativo',
  topic: 'bellman-ford',
  difficulty: 'hard',
  duration: 'deep',
  examLikelihood: 'high',
  sourceStyle: 'old_exam',
  professorStyleSimilarity: 'medium',
  type: 'PROOF_OR_JUSTIFICATION',
  prompt: `(04 pts) Considere a matriz D abaixo, em que um valor na posição D[i, j] ≠ 0 representa o comprimento da aresta direcionada (i, j). Determine os caminhos mínimos (tamanho e suas arestas) a partir do vértice 1 para todos os demais.

       1   2   3   4   5   6   7
  1    0   6   5   5   ∞   ∞   ∞
  2    ∞   0   ∞   ∞  −1   ∞   ∞
  3    ∞  −2   0   ∞   1   ∞   ∞
  4    ∞   ∞  −2   0   ∞  −1   ∞
  5    ∞   ∞   ∞   ∞   0   ∞   3
  6    ∞   ∞   ∞   ∞   ∞   0   3
  7    ∞   ∞   ∞   ∞   ∞   ∞   0`,
  graph: P2_2024_Q2,
  rubric: [
    'Nota os comprimentos negativos e escolhe Bellman-Ford (justifica por que não Dijkstra)',
    'Monta a tabela d[i, v] com a linha i usando só a linha i − 1',
    'Verifica ausência de ciclo negativo',
    'Dá o tamanho de cada caminho mínimo',
    'Dá as arestas de cada caminho (predecessores)',
  ],
  source: prova('Q2 (4 de 20 pontos)'),
  hints: ['Há −1 e −2 na matriz.', 'Bellman-Ford: n − 1 = 6 rodadas.'],
  solution: pathText(q2.predecessors, '1', ['1', '2', '3', '4', '5', '6', '7'], q2.distances),
  examAnswer: `A matriz tem comprimentos negativos (2→5 = −1, 3→2 = −2, 4→3 = −2, 4→6 = −1), então o Dijkstra não se aplica ("Algorithm cannot handle negative edge lengths", slide 10). Uso o Bellman-Ford (slide 10, quadro 25): d[i, v] = comprimento do menor caminho de 1 a v com no máximo i arestas. d[0, 1] = 0, d[0, v] = ∞; para i = 1..6: d[i, v] = min{d[i − 1, v], d[i − 1, w] + c_wv} para toda aresta (w, v).

Tabela:
${bfTableText(q2.table, ['1', '2', '3', '4', '5', '6', '7'])}

Uma rodada extra não melhora nenhum valor: não há ciclo negativo. Caminhos mínimos a partir de 1 (pelos predecessores):
${pathText(q2.predecessors, '1', ['1', '2', '3', '4', '5', '6', '7'], q2.distances)}`,
});

/** P2 2024/1 transcrita (Q1 e Q2). Q3 (atribuição), Q4 (fluxo) e Q5 (topológica) são P3 em 2026/2. */
export const provaRealP2 = {
  exam: {
    id: 'prova-p2-2024-1',
    title: 'Prova 2 — Prof. Zenilton (outro professor)',
    basedOn:
      'P2 - 1º 2024 (fotos), Prof. Zenilton — transcrição literal das questões 1 e 2 (4 + 4 de 20 pontos). As questões 3 (atribuição de almoços), 4 (fluxo máximo e corte mínimo) e 5 (ordenação topológica por Kahn) ficaram de fora: no cronograma 2026/2 esses assuntos são da P3.',
    suggestedDurationMinutes: 60,
  },
  questions: [
    { question: realQ1(), weightPercent: 50 },
    { question: realQ2(), weightPercent: 50 },
  ],
};
