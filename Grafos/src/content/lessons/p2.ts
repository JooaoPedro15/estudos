import type { GraphData } from '../types';
import type { AnimationStep, GraphConcept, LessonCatalog } from './types';
import { BLUE, GREEN, AMBER, RED } from './builders';
import { bridges, fleury } from '../../lib/graph';

// Lições da P2. Sempre que possível o grafo é o do slide do professor, com as
// posições aproximadas do desenho, e os números saem do motor (src/lib/graph.ts),
// não de valores digitados à mão.

const gray = 'var(--color-text-tertiary)';

/** Grafo com posições fixas (canvas da lição: 560 × 320). */
export function placed(coords: Record<string, [number, number]>, edges: Array<[string, string] | [string, string, number]>, directed = false): GraphData {
  return {
    directed,
    vertices: Object.entries(coords).map(([id, [x, y]]) => ({ id, label: id, x, y })),
    edges: edges.map(([source, target, weight], i) => ({ id: `e${i}`, source, target, weight })),
  };
}

export function edgeIdsOf(graph: GraphData, pairs: string[][]): string[] {
  return pairs.flatMap(([from, to]) =>
    graph.edges.filter((e) => (e.source === from && e.target === to) || (!graph.directed && e.source === to && e.target === from)).map((e) => e.id),
  );
}

export function step(graph: GraphData, message: string, details: Omit<AnimationStep, 'graph' | 'message'> = {}): AnimationStep {
  return { graph, message, ...details };
}

export function concept(id: string, title: string, intuitiveExplanation: string, technicalIndices: number[], steps: AnimationStep[], exampleTitle: string): GraphConcept {
  return { id, title, intuitiveExplanation, technicalIndices, examples: [{ id: `${id}-exemplo`, title: exampleTitle, steps }] };
}

const fmt = (n: number) => (n === Infinity ? '∞' : String(n));

// ---------------------------------------------------------------------------
// Grafos dos slides
// ---------------------------------------------------------------------------

/** "Example of Dijkstra's Algorithm" — 10-graphs-shortest-path.pdf, quadro 16 de 26. */
export const SLIDE_DIJKSTRA = placed(
  { a: [70, 165], b: [225, 105], c: [225, 225], d: [380, 40], e: [380, 165], f: [380, 290] },
  [['a', 'b', 1], ['a', 'e', 4], ['a', 'c', 1], ['b', 'd', 3], ['b', 'e', 1], ['c', 'e', 2], ['c', 'f', 3], ['e', 'd', 1], ['e', 'f', 2]],
  true,
);

/** "Eulerian graph" — 08-graphs-traversing.pdf, quadro 24 (caminho e-a-d-c-e-b-f-d). */
const SLIDE_EULER = placed(
  { a: [110, 70], b: [360, 70], c: [110, 250], d: [235, 160], e: [235, 40], f: [450, 200] },
  [['e', 'a'], ['a', 'd'], ['d', 'c'], ['c', 'e'], ['e', 'b'], ['b', 'f'], ['f', 'd']],
);

/** Fleury — 08-graphs-traversing.pdf, quadro 33 (grafo desenhado abaixo do algoritmo). */
const SLIDE_FLEURY = placed(
  { b: [150, 50], f: [300, 80], e: [230, 140], d: [400, 170], a: [140, 230], c: [270, 290] },
  [['b', 'f'], ['b', 'e'], ['e', 'f'], ['f', 'd'], ['d', 'a'], ['a', 'c'], ['c', 'd']],
);

// ---------------------------------------------------------------------------
// Dijkstra passo a passo com o conjunto S (usado na indução e no Dijkstra)
// ---------------------------------------------------------------------------

/**
 * Dijkstra na forma do slide (quadro 15): S = explorados; a cada passo entra
 * em S o v ∉ S com menor d'(v) = min{d[u] + W(u,v) : u ∈ S}.
 */
export function dijkstraSetSteps(graph: GraphData, source: string, note: (s: string[], v: string, d: number) => string): AnimationStep[] {
  const ids = graph.vertices.map((v) => v.id);
  const d: Record<string, number> = Object.fromEntries(ids.map((v) => [v, v === source ? 0 : Infinity]));
  const pred: Record<string, string | null> = Object.fromEntries(ids.map((v) => [v, null]));
  const S: string[] = [];
  const treeEdges: string[] = [];
  const table = () => ({ headers: ['Vértice', 'd', 'Em S?', 'Predecessor'], rows: ids.map((v) => [v, fmt(d[v]), S.includes(v) ? 'sim' : 'não', pred[v] ?? '—']) });
  const colors = () => Object.fromEntries(S.map((v) => [v, GREEN]));
  const steps: AnimationStep[] = [
    step(graph, `d[${source}] = 0 e d = ∞ para os demais. S ainda está vazio.`, { currentVertex: source, table: table(), vertexNotes: Object.fromEntries(ids.map((v) => [v, `d=${fmt(d[v])}`])) }),
  ];
  while (S.length < ids.length) {
    const candidates = ids.filter((v) => !S.includes(v) && d[v] < Infinity);
    if (candidates.length === 0) break;
    const v = candidates.reduce((a, b) => (d[b] < d[a] ? b : a));
    S.push(v);
    if (pred[v]) treeEdges.push(...edgeIdsOf(graph, [[pred[v]!, v]]));
    const relaxed: string[] = [];
    for (const e of graph.edges) {
      const to = e.source === v ? e.target : !graph.directed && e.target === v ? e.source : null;
      if (to === null || S.includes(to)) continue;
      const w = e.weight ?? 1;
      if (d[v] + w < d[to]) {
        d[to] = d[v] + w;
        pred[to] = v;
        relaxed.push(`${to}: ${fmt(d[v])} + ${w} = ${d[to]}`);
      }
    }
    steps.push(
      step(graph, `${note([...S], v, d[v])}${relaxed.length ? ` Atualiza vizinhos fora de S — ${relaxed.join('; ')}.` : ''}`, {
        currentVertex: v,
        visitedVertexIds: [...S],
        vertexColorMap: colors(),
        highlightEdgeIds: [...treeEdges],
        edgeColorMap: Object.fromEntries(treeEdges.map((id) => [id, GREEN])),
        vertexNotes: Object.fromEntries(ids.map((u) => [u, `d=${fmt(d[u])}`])),
        sequence: [...S],
        sequenceLabel: 'Ordem de entrada em S',
        table: table(),
        legend: [{ label: 'Em S (distância definitiva)', color: GREEN }],
      }),
    );
  }
  return steps;
}

// ---------------------------------------------------------------------------
// Fleury a partir do motor
// ---------------------------------------------------------------------------

function fleurySteps(graph: GraphData, start: string): AnimationStep[] {
  const result = fleury(graph, start);
  if (!result) throw new Error('Grafo sem caminho euleriano');
  const { trail, edgeOrder } = result;
  return trail.map((v, i) => {
    const used = edgeOrder.slice(0, i);
    const remaining = { ...graph, edges: graph.edges.filter((e) => !used.includes(e.id)) };
    const bridgeIds = bridges(remaining);
    const why = result.steps[i]?.description ?? '';
    return step(graph, i === 0 ? `${why} As arestas em vermelho são pontes do grafo que ainda falta percorrer.` : why, {
      currentVertex: v,
      sequence: trail.slice(0, i + 1),
      sequenceLabel: 'Caminho até aqui',
      traversal: i ? { from: trail[i - 1], to: v } : undefined,
      highlightEdgeIds: used,
      edgeColorMap: { ...Object.fromEntries(used.map((id) => [id, GREEN])), ...Object.fromEntries(bridgeIds.map((id) => [id, RED])) },
      edgeLabels: Object.fromEntries(bridgeIds.map((id) => [id, 'ponte'])),
      legend: [{ label: 'Aresta já usada (E − {e})', color: GREEN }, { label: 'Ponte no que resta', color: RED }],
    });
  });
}

// ---------------------------------------------------------------------------
// Indução
// ---------------------------------------------------------------------------

const PATH5 = placed({ a: [70, 160], b: [175, 160], c: [280, 160], d: [385, 160], e: [490, 160] }, [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'e']]);
const prefix = (k: number): GraphData => ({ ...PATH5, vertices: PATH5.vertices.slice(0, k), edges: PATH5.edges.slice(0, k - 1) });

const inducao: GraphConcept[] = [
  concept(
    'inducao-estrutura',
    'Base, hipótese e passo',
    'Indução é uma fila de dominós: mostre que o primeiro cai (base) e que, se um qualquer cai, o seguinte também cai (passo). A hipótese indutiva é justamente "supor que o dominó k caiu". Exemplo criado para explicação, usando só o que já foi visto: um caminho com n vértices tem n − 1 arestas.',
    [0],
    [
      step(prefix(1), 'Base (n = 1): um único vértice, nenhuma aresta. 1 − 1 = 0. A afirmação vale.', { formula: 'n = 1 ⇒ |E| = 0 = n − 1' }),
      step(prefix(3), 'Hipótese indutiva: suponha que todo caminho com k vértices tem k − 1 arestas. Aqui k = 3: 2 arestas.', { highlightEdgeIds: ['e0', 'e1'], formula: 'Hipótese: |E| = k − 1' }),
      step(prefix(4), 'Passo: um caminho com k + 1 vértices é um caminho com k vértices mais um vértice novo, ligado ao último por UMA aresta.', { highlightVertexIds: ['d'], highlightEdgeIds: ['e2'], edgeColorMap: { e2: AMBER } }),
      step(prefix(4), 'Pela hipótese, a parte antiga tem k − 1 arestas; somando a nova, (k − 1) + 1 = k = (k + 1) − 1. Vale para k + 1.', { highlightEdgeIds: ['e0', 'e1', 'e2'], formula: '(k − 1) + 1 = (k + 1) − 1  ✓' }),
      step(PATH5, 'Base + passo valem ⇒ a afirmação vale para todo n ≥ 1. Exemplos soltos não provariam isso; o passo genérico prova.', { highlightEdgeIds: PATH5.edges.map((e) => e.id), formula: '∀ n ≥ 1: |E| = n − 1' }),
    ],
    'Um caminho com n vértices tem n − 1 arestas',
  ),
  concept(
    'inducao-dijkstra',
    'A prova do Dijkstra cresce junto com S',
    'Nos slides, a indução aparece para provar que o Dijkstra acerta. A afirmação é sobre o conjunto S dos explorados: todo vértice em S já tem a distância certa. Base: S = {s}. Passo: quando um vértice v entra em S, qualquer caminho alternativo até v teria que sair de S por algum ponto, e já seria longo demais nesse momento. O mesmo raciocínio aparece como invariante de laço: S continua "λ-separador" a cada entrada.',
    [1, 2],
    dijkstraSetSteps(SLIDE_DIJKSTRA, 'a', (S, v, d) =>
      S.length === 1
        ? `Base da indução: |S| = 1, só ${v} está em S, com d = 0 — certo por definição.`
        : `Passo indutivo: entra ${v}, com d = ${d}, o menor valor fora de S. Pela hipótese, os ${S.length - 1} anteriores estavam certos; um caminho alternativo até ${v} teria que sair de S por outro vértice e "already too long by the time it had left the set S". S agora é λ-separador com λ = ${d}.`,
    ),
    'Exemplo do slide 10, quadro 16, com x = a',
  ),
];

// ---------------------------------------------------------------------------
// Euleriano (exemplo do slide) e hamiltoniano
// ---------------------------------------------------------------------------

const eulerSlide: GraphConcept[] = [
  concept(
    'euler-fleury-slide',
    'Fleury no grafo do slide',
    'O slide executa Fleury num grafo com dois vértices de grau ímpar, f e d. Começando em f, a aresta f–d é ponte: atravessá-la cedo deixaria o triângulo b–e–f para trás, sem volta. Por isso Fleury dá a volta no triângulo primeiro e só depois atravessa a ponte.',
    [0],
    fleurySteps(SLIDE_FLEURY, 'f'),
    'Exemplo do slide 08, quadro 33',
  ),
];

const hamiltoniano: GraphConcept[] = [
  concept(
    'ham-vs-euler',
    'Arestas uma vez × vértices uma vez',
    'No mesmo grafo do slide, compare os dois percursos. O euleriano gasta todas as 7 arestas e por isso repete os vértices e e d. O hamiltoniano passa uma única vez por cada um dos 6 vértices, usa só 5 arestas e deixa arestas sem usar — e está tudo certo, porque o hamiltoniano não se importa com arestas.',
    [0],
    [
      step(SLIDE_EULER, 'Caminho euleriano do slide (quadro 24): e-a-d-c-e-b-f-d. Usa as 7 arestas, uma vez cada. Os vértices e e d aparecem duas vezes.', {
        sequence: ['e', 'a', 'd', 'c', 'e', 'b', 'f', 'd'],
        highlightEdgeIds: SLIDE_EULER.edges.map((x) => x.id),
        edgeColorMap: Object.fromEntries(SLIDE_EULER.edges.map((x) => [x.id, GREEN])),
        vertexNotes: { e: '2 visitas', d: '2 visitas' },
        vertexColorMap: { e: AMBER, d: AMBER },
      }),
      step(SLIDE_EULER, 'Um caminho hamiltoniano no mesmo grafo (exemplo criado para explicação): c-e-a-d-f-b. Cada vértice aparece exatamente uma vez.', {
        sequence: ['c', 'e', 'a', 'd', 'f', 'b'],
        highlightEdgeIds: edgeIdsOf(SLIDE_EULER, [['c', 'e'], ['e', 'a'], ['a', 'd'], ['d', 'f'], ['f', 'b']]),
        edgeColorMap: Object.fromEntries(edgeIdsOf(SLIDE_EULER, [['c', 'e'], ['e', 'a'], ['a', 'd'], ['d', 'f'], ['f', 'b']]).map((id) => [id, BLUE])),
        visitedVertexIds: ['a', 'b', 'c', 'd', 'e', 'f'],
      }),
      step(SLIDE_EULER, 'As arestas d–c e e–b ficaram de fora do hamiltoniano. Para Hamilton isso não importa: a exigência é só sobre os vértices.', {
        highlightEdgeIds: edgeIdsOf(SLIDE_EULER, [['d', 'c'], ['e', 'b']]),
        edgeColorMap: Object.fromEntries(edgeIdsOf(SLIDE_EULER, [['d', 'c'], ['e', 'b']]).map((id) => [id, gray])),
        formula: 'Euler: toda ARESTA 1×  ·  Hamilton: todo VÉRTICE 1×',
      }),
    ],
    'O grafo do slide 08, quadro 24',
  ),
  concept(
    'ham-dificuldade',
    'Fácil para Euler, difícil para Hamilton',
    'Para Euler existe um teste rápido: contar os graus ímpares. Para Hamilton o slide não dá teste nenhum: diz apenas que decidir e encontrar "não é fácil". Na prática, sem uma regra, você precisa tentar caminhos.',
    [1],
    [
      step(SLIDE_EULER, 'Euler, quadro 25: "Does G contain an Euler tour? Easy to decide" — contar os vértices de grau ímpar. Aqui só e e d têm grau ímpar (3).', {
        vertexNotes: { a: 'grau 2', b: 'grau 2', c: 'grau 2', d: 'grau 3', e: 'grau 3', f: 'grau 2' },
        vertexColorMap: { d: AMBER, e: AMBER },
        table: { headers: ['Pergunta', 'Euler', 'Hamilton'], rows: [['Existe? (decide)', 'Easy', '?'], ['Encontrar (compute)', 'Easy', '?']] },
      }),
      step(SLIDE_EULER, 'Hamilton, quadro 26: as mesmas perguntas são "Not easy to decide" e "Not easy to compute". Não há uma contagem de graus que resolva.', {
        table: { headers: ['Pergunta', 'Euler', 'Hamilton'], rows: [['Existe? (decide)', 'Easy', 'Not easy'], ['Encontrar (compute)', 'Easy', 'Not easy']] },
        formula: 'Paridade dos graus decide Euler, não Hamilton',
      }),
    ],
    'A tabela dos quadros 25 e 26',
  ),
  concept(
    'ham-exercicios',
    'Os exercícios do slide',
    'O slide propõe dois problemas para modelar: os interruptores e a reconstrução de DNA. Ele dá os enunciados; a modelagem foi feita em aula e as páginas estão em branco no PDF. A ligação dos interruptores com o cubo Q3 da lista é uma interpretação, não algo que o slide mostra.',
    [2],
    [
      step(
        placed({ '000': [80, 240], '001': [80, 90], '010': [230, 240], '011': [230, 90], '100': [330, 290], '101': [330, 140], '110': [480, 290], '111': [480, 140] }, [
          ['000', '001'], ['000', '010'], ['000', '100'], ['001', '011'], ['001', '101'], ['010', '011'], ['010', '110'], ['011', '111'], ['100', '101'], ['100', '110'], ['101', '111'], ['110', '111'],
        ]),
        'Light Switches (quadro 27): 3 interruptores, posição certa desconhecida. Interpretação: cada configuração é uma cadeia de 3 bits; trocar UM interruptor muda um bit — é o cubo Q3 da lista (Exercícios 2.4 e 11).',
        { formula: 'Configurações: 2³ = 8' },
      ),
      step(
        placed({ '000': [80, 240], '001': [80, 90], '010': [230, 240], '011': [230, 90], '100': [330, 290], '101': [330, 140], '110': [480, 290], '111': [480, 140] }, [
          ['000', '001'], ['000', '010'], ['000', '100'], ['001', '011'], ['001', '101'], ['010', '011'], ['010', '110'], ['011', '111'], ['100', '101'], ['100', '110'], ['101', '111'], ['110', '111'],
        ]),
        'Testar todas as configurações trocando um interruptor por vez = passar por cada vértice uma vez = caminho hamiltoniano. O slide pergunta o mínimo de trocas (4, 8, 16 ou 64) e não traz a resposta.',
        { formula: 'Visitar cada configuração 1× ⇒ Hamilton' },
      ),
    ],
    'Interruptores como vértices (interpretação)',
  ),
];

export const p2Lessons: LessonCatalog = {
  inducao,
  hamiltoniano,
};

/** Conceitos extras para tópicos que já tinham lição na P1 (somados, não substituídos). */
export const p2ExtraLessons: LessonCatalog = {
  euleriano: eulerSlide,
};
