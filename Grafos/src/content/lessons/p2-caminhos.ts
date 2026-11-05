import type { GraphData } from '../types';
import type { AnimationStep, GraphConcept, LessonCatalog } from './types';
import { GREEN, AMBER, RED } from './builders';
import { concept, dijkstraSetSteps, edgeIdsOf, placed, step } from './p2';
import { SLIDE_DIJKSTRA, FW_EXAMPLE, P2_2024_Q2, SLIDE_FINAL, SLIDE_LX, SLIDE_NEG, SLIDE_NEG_CYCLE, SLIDE_REWEIGHT } from '../questions/graphs-p2';
import { bellmanFord, bfs, dijkstra, floydWarshall } from '../../lib/graph';

const fmt = (n: number) => (n === Infinity ? '∞' : String(n));
const colorAll = (ids: string[], color: string) => Object.fromEntries(ids.map((id) => [id, color]));




const SLIDE_REWEIGHT_PLUS3: GraphData = { ...SLIDE_REWEIGHT, edges: SLIDE_REWEIGHT.edges.map((e) => ({ ...e, weight: (e.weight ?? 0) + 3 })) };




// ---------------------------------------------------------------------------
// Conceitos gerais
// ---------------------------------------------------------------------------

const UNDIRECTED = placed({ u: [140, 160], v: [420, 160] }, [['u', 'v', 4]]);
const AS_ARCS = placed({ u: [140, 160], v: [420, 160] }, [['u', 'v', 4], ['v', 'u', 4]], true);
const LX = dijkstra(SLIDE_LX, 'x0').distances;
const BFS_G = placed({ s: [70, 160], a: [200, 70], b: [200, 250], c: [340, 70], t: [480, 160] }, [['s', 'a'], ['s', 'b'], ['a', 'c'], ['b', 't'], ['c', 't']]);
const bfsResult = bfs(BFS_G, 's');

const conceitos: GraphConcept[] = [
  concept(
    'cm-comprimento',
    'Comprimento é a soma dos pesos',
    'O comprimento de um caminho é a soma dos comprimentos das suas arestas — não o número de arestas, a menos que todas valham 1. Num grafo não direcionado, o slide troca cada aresta por duas setas, uma em cada sentido, e trabalha só com grafo direcionado.',
    [0],
    [
      step(SLIDE_LX, 'Caminho x0 → x1 → x4 → x3: 3 + 2 + 2 = 7. O outro, x0 → x1 → x3, tem menos arestas e custa 3 + 5 = 8.', { sequence: ['x0', 'x1', 'x4', 'x3'], highlightEdgeIds: edgeIdsOf(SLIDE_LX, [['x0', 'x1'], ['x1', 'x4'], ['x4', 'x3']]), edgeColorMap: colorAll(edgeIdsOf(SLIDE_LX, [['x0', 'x1'], ['x1', 'x4'], ['x4', 'x3']]), GREEN), formula: '3 + 2 + 2 = 7 < 3 + 5 = 8' }),
      step(UNDIRECTED, 'Aresta não direcionada u–v de comprimento 4…', { formula: '{u, v} com ℓ = 4' }),
      step(AS_ARCS, '…vira duas arestas direcionadas, (u, v) e (v, u), ambas com comprimento 4 (quadro 6, "Aside").', { highlightEdgeIds: AS_ARCS.edges.map((e) => e.id), formula: '(u, v) e (v, u), ℓ = 4' }),
    ],
    'Quadro 6',
  ),
  concept(
    'cm-mapa-lx',
    'Uma tabela com a distância até cada vértice',
    'Lx guarda, para cada vértice y, o comprimento do menor caminho que sai de x e chega em y. Se não há caminho, o valor é ∞. No exemplo do slide, x2 só tem arestas saindo — ninguém chega nele, então Lx0(x2) = ∞.',
    [1],
    [
      step(SLIDE_LX, 'Lx0(x0) = 0: o caminho vazio.', { currentVertex: 'x0', table: { headers: ['y', 'x0', 'x1', 'x2', 'x3', 'x4', 'x5', 'x6'], rows: [['Lx0(y)', '0', '', '', '', '', '', '']] } }),
      step(SLIDE_LX, 'x1 = 3, x4 = 3 + 2 = 5, x5 = 5 + 1 = 6. x2 é inalcançável: ∞.', { highlightEdgeIds: edgeIdsOf(SLIDE_LX, [['x0', 'x1'], ['x1', 'x4'], ['x4', 'x5']]), vertexColorMap: { x2: RED }, table: { headers: ['y', 'x0', 'x1', 'x2', 'x3', 'x4', 'x5', 'x6'], rows: [['Lx0(y)', '0', '3', '∞', '', '5', '6', '']] } }),
      step(SLIDE_LX, `x3: o melhor é via x4 ou via x5, valor ${LX.x3}. x6: via x5, valor ${LX.x6}.`, {
        vertexNotes: Object.fromEntries(Object.entries(LX).map(([v, d]) => [v, fmt(d)])),
        table: { headers: ['y', 'x0', 'x1', 'x2', 'x3', 'x4', 'x5', 'x6'], rows: [['Lx0(y)', ...['x0', 'x1', 'x2', 'x3', 'x4', 'x5', 'x6'].map((v) => fmt(LX[v]))]] },
        formula: 'Lx0 = (0, 3, ∞, 7, 5, 6, 8) — igual ao slide',
      }),
    ],
    'Quadro 8',
  ),
  concept(
    'cm-problemas',
    'Um par, uma origem ou todos os pares',
    'O slide separa quatro perguntas. As duas que importam para os algoritmos: "de uma origem para todos" (Dijkstra, Bellman-Ford) e "de todos para todos". Quem resolve a de uma origem já resolve a de um par: é só olhar o destino na tabela.',
    [2],
    [
      step(SLIDE_LX, '(1) Um par: o menor caminho de x0 a x6 e seu comprimento.', { highlightVertexIds: ['x0', 'x6'], table: { headers: ['Problema', 'Pergunta'], rows: [['1', 'x → y'], ['2', 'x → todos'], ['3', 'todos os pares'], ['4', 'resolveu 2 ⇒ resolve 1']] } }),
      step(SLIDE_LX, `(2) Uma origem: Lx0(y) para todo y. Com isso, (4): Lx0(x6) = ${LX.x6} responde o problema 1.`, { currentVertex: 'x0', vertexNotes: Object.fromEntries(Object.entries(LX).map(([v, d]) => [v, fmt(d)])) }),
      step(SLIDE_LX, '(3) Todos os pares: uma tabela n × n. É o problema do Floyd-Warshall (que não tem slide — ver o tópico).', { formula: 'n × n distâncias' }),
    ],
    'Quadro 10',
  ),
  concept(
    'cm-bfs',
    'Sem pesos, a busca em largura basta',
    'Quando todas as arestas valem o mesmo, menor caminho é o de menos arestas, e a busca em largura encontra isso. O caminho fica guardado no vetor antecessor: cada vértice lembra de quem o descobriu.',
    [3],
    [
      step(BFS_G, 'BFS a partir de s. Distância = número de arestas do menor caminho.', { currentVertex: 's', vertexNotes: Object.fromEntries(Object.entries(bfsResult.distances).map(([v, d]) => [v, `d=${d}`])) }),
      step(BFS_G, `t está a distância ${bfsResult.distances.t}: antecessor(t) = b, antecessor(b) = s. Caminho: s–b–t.`, { sequence: ['s', 'b', 't'], highlightEdgeIds: edgeIdsOf(BFS_G, [['s', 'b'], ['b', 't']]), edgeColorMap: colorAll(edgeIdsOf(BFS_G, [['s', 'b'], ['b', 't']]), GREEN) }),
    ],
    'Slide 08, quadro 15 (exemplo criado para explicação)',
  ),
];

// ---------------------------------------------------------------------------
// Dijkstra: exemplos do slide (somados às lições que já existiam)
// ---------------------------------------------------------------------------

const dijkstraSlide: GraphConcept[] = [
  concept(
    'dijkstra-slide-16',
    'O exemplo do slide, passo a passo',
    'O exemplo do quadro 16 mostra o número de cada vértice no momento em que ele entra em S. Siga a tabela: em cada passo entra quem tem o menor d fora de S, e só os vizinhos dele podem mudar.',
    [4],
    dijkstraSetSteps(SLIDE_DIJKSTRA, 'a', (S, v, d) => (S.length === 1 ? `Começa em ${v}: S = {${v}}, d = 0.` : `Menor d fora de S: ${v} (${d}). Entra em S.`)),
    'Quadro 16, origem a',
  ),
  concept(
    'dijkstra-slide-26',
    'O exercício final do slide',
    'O quadro 26 pede: "Compute the shortest path from e to all other nodes!". É exatamente o formato de questão de prova: tabela de d, ordem de entrada em S e predecessores para montar os caminhos.',
    [5],
    dijkstraSetSteps(SLIDE_FINAL, 'e', (S, v, d) => (S.length === 1 ? `Origem ${v}: d = 0.` : `Entra ${v} com d = ${d}.`)),
    'Quadro 26, origem e',
  ),
];

// ---------------------------------------------------------------------------
// Bellman-Ford
// ---------------------------------------------------------------------------

export function bellmanSteps(graph: GraphData, source: string): AnimationStep[] {
  const { table, steps, predecessors } = bellmanFord(graph, source);
  const ids = graph.vertices.map((v) => v.id);
  return steps.slice(0, table.length).map((s, i) => {
    const treeEdges = i === table.length - 1 ? ids.flatMap((v) => (predecessors[v] ? edgeIdsOf(graph, [[predecessors[v]!, v]]) : [])) : [];
    return step(graph, i === table.length - 1 ? `${s.description} Predecessores formam os caminhos (em verde).` : s.description, {
      currentVertex: i === 0 ? source : undefined,
      highlightEdgeIds: [...(s.highlightEdges ?? []), ...treeEdges],
      edgeColorMap: { ...colorAll(s.highlightEdges ?? [], AMBER), ...colorAll(treeEdges, GREEN) },
      highlightVertexIds: s.highlightVertices,
      vertexNotes: Object.fromEntries(ids.map((v) => [v, fmt(table[i][v])])),
      table: { headers: ['i', ...ids], rows: table.slice(0, i + 1).map((row, r) => [String(r), ...ids.map((v) => fmt(row[v]))]) },
      formula: `d[${i}, v] = min{d[${Math.max(0, i - 1)}, v], d[${Math.max(0, i - 1)}, w] + c_wv}`,
    });
  });
}

const negDijkstra = dijkstra(SLIDE_NEG, 'a').distances;
const negBF = bellmanFord(SLIDE_NEG, 'a').distances;

const bellman: GraphConcept[] = [
  concept(
    'bf-por-que',
    'Peso negativo engana o Dijkstra',
    'O Dijkstra fixa um vértice assim que ele é o mais próximo, apostando que nada depois vai melhorá-lo. Com aresta negativa essa aposta quebra: um caminho que parecia longo pode terminar numa aresta −6 e ficar menor. E não adianta somar uma constante a todos os pesos: caminhos com mais arestas são punidos mais e o vencedor muda.',
    [0],
    [
      step(SLIDE_NEG, `Dijkstra a partir de a: c entra em S primeiro com d = ${negDijkstra.c} e fica fixado.`, { currentVertex: 'c', visitedVertexIds: ['a', 'c'], vertexNotes: { a: '0', b: '2', c: '1 (fixado)', d: '∞' } }),
      step(SLIDE_NEG, `Mas a → b → d → c custa 2 + 3 − 6 = ${negBF.c}, menor que 1. O Dijkstra erra; o Bellman-Ford acha ${negBF.c}.`, { sequence: ['a', 'b', 'd', 'c'], highlightEdgeIds: edgeIdsOf(SLIDE_NEG, [['a', 'b'], ['b', 'd'], ['d', 'c']]), edgeColorMap: colorAll(edgeIdsOf(SLIDE_NEG, [['d', 'c']]), RED), formula: '2 + 3 − 6 = −1 < 1' }),
      step(SLIDE_REWEIGHT, 'Re-weighting: aqui o menor a → d é a–c–e–d = 3 − 3 + 3 = 3 (o outro, a–b–d, custa 4).', { sequence: ['a', 'c', 'e', 'd'], highlightEdgeIds: edgeIdsOf(SLIDE_REWEIGHT, [['a', 'c'], ['c', 'e'], ['e', 'd']]), edgeColorMap: colorAll(edgeIdsOf(SLIDE_REWEIGHT, [['a', 'c'], ['c', 'e'], ['e', 'd']]), GREEN) }),
      step(SLIDE_REWEIGHT_PLUS3, 'Somando 3 em tudo para sumir o negativo: a–b–d vira 5 + 5 = 10 e a–c–e–d vira 6 + 0 + 6 = 12. O menor caminho mudou — a correção falha.', { sequence: ['a', 'b', 'd'], highlightEdgeIds: edgeIdsOf(SLIDE_REWEIGHT_PLUS3, [['a', 'b'], ['b', 'd']]), edgeColorMap: colorAll(edgeIdsOf(SLIDE_REWEIGHT_PLUS3, [['a', 'b'], ['b', 'd']]), AMBER), formula: '+3 por aresta: 2 arestas ganham 6, 3 arestas ganham 9' }),
    ],
    'Quadro 22',
  ),
  concept(
    'bf-ciclo-negativo',
    'Com ciclo negativo, não existe "menor"',
    'Se dá para dar uma volta que diminui o custo, dá para dar duas, três… e o custo cai sem parar. Aí não existe menor caminho. Sem ciclo negativo, sempre existe um menor caminho simples.',
    [1],
    [
      step(SLIDE_NEG_CYCLE, 'Ciclo b → d → c → b: 3 − 6 − 5 = −8.', { highlightEdgeIds: edgeIdsOf(SLIDE_NEG_CYCLE, [['b', 'd'], ['d', 'c'], ['c', 'b']]), edgeColorMap: colorAll(edgeIdsOf(SLIDE_NEG_CYCLE, [['b', 'd'], ['d', 'c'], ['c', 'b']]), RED), formula: '3 + (−6) + (−5) = −8' }),
      step(SLIDE_NEG_CYCLE, `Cada volta tira 8 do custo até d: não existe menor caminho a → d. O Bellman-Ford acusa ciclo negativo: ${bellmanFord(SLIDE_NEG_CYCLE, 'a').negativeCycle ? 'sim' : 'não'}.`, { highlightVertexIds: ['b', 'c', 'd'], formula: '"there does not exist a shortest s-t path"' }),
    ],
    'Quadro 23',
  ),
  concept(
    'bf-tabela',
    'Linha i = caminhos com até i arestas',
    'A ideia do Bellman-Ford é limitar o número de arestas. Na linha 0, só a origem tem caminho (com 0 arestas). Na linha 1, valem caminhos de até 1 aresta; na linha 2, até 2; e assim até n − 1, que é o máximo de arestas de um caminho simples. Cada linha só usa a anterior.',
    [2, 3],
    bellmanSteps(P2_2024_Q2, '1'),
    'Questão 2 da P2 2024/1, origem 1',
  ),
  concept(
    'bf-caminhos',
    'Do valor ao caminho',
    'A tabela dá o tamanho; para as arestas, guarde de onde veio cada melhoria e volte do destino até a origem. Na questão da prova, o caminho até 7 tem 5 arestas e passa por três pesos negativos.',
    [4],
    [
      step(P2_2024_Q2, 'Predecessores no fim: pred(7) = 5, pred(5) = 2, pred(2) = 3, pred(3) = 4, pred(4) = 1.', { sequence: ['7', '5', '2', '3', '4', '1'], sequenceLabel: 'Do destino à origem' }),
      step(P2_2024_Q2, 'Invertendo: 1 → 4 → 3 → 2 → 5 → 7, comprimento 5 − 2 − 2 − 1 + 3 = 3.', { sequence: ['1', '4', '3', '2', '5', '7'], highlightEdgeIds: edgeIdsOf(P2_2024_Q2, [['1', '4'], ['4', '3'], ['3', '2'], ['2', '5'], ['5', '7']]), edgeColorMap: colorAll(edgeIdsOf(P2_2024_Q2, [['1', '4'], ['4', '3'], ['3', '2'], ['2', '5'], ['5', '7']]), GREEN), formula: '5 − 2 − 2 − 1 + 3 = 3' }),
      step(SLIDE_NEG_CYCLE, 'Detecção de ciclo negativo (livro, o slide só faz a pergunta): rode mais uma rodada; se algum valor ainda melhorar, há ciclo negativo alcançável.', { highlightEdgeIds: edgeIdsOf(SLIDE_NEG_CYCLE, [['b', 'd'], ['d', 'c'], ['c', 'b']]), edgeColorMap: colorAll(edgeIdsOf(SLIDE_NEG_CYCLE, [['b', 'd'], ['d', 'c'], ['c', 'b']]), RED) }),
    ],
    'Montando a resposta da questão',
  ),
];

// ---------------------------------------------------------------------------
// Floyd-Warshall (livro)
// ---------------------------------------------------------------------------

const fw = floydWarshall(FW_EXAMPLE);
const matrixTable = (m: number[][]) => ({ headers: ['', ...fw.ids], rows: m.map((row, i) => [fw.ids[i], ...row.map(fmt)]) });

const floyd: GraphConcept[] = [
  concept(
    'fw-problema',
    'Todos para todos de uma vez',
    'O problema 3 do slide pede a distância entre TODO par. Daria para rodar Dijkstra (ou Bellman-Ford, se houver negativo) a partir de cada vértice. O Floyd-Warshall, do Cormen, resolve tudo numa tabela n × n só. Exemplo criado para explicação.',
    [0],
    [
      step(FW_EXAMPLE, 'Grafo com 4 vértices e uma aresta negativa (4 → 3 = −2), sem ciclo negativo.', { formula: 'resposta: matriz 4 × 4' }),
      step(FW_EXAMPLE, 'D(0): só as arestas diretas. 0 na diagonal, ∞ onde não há aresta.', { table: matrixTable(fw.matrices[0]) }),
    ],
    'Problema 3 do slide 10',
  ),
  concept(
    'fw-ideia',
    'Liberar um intermediário por vez',
    'Em D(k), os caminhos só podem passar por dentro de 1, …, k. Ao liberar o vértice k, cada par (i, j) pergunta: "passar por k melhora?". Se sim, d(k)ij = d(k−1)ik + d(k−1)kj. Fonte: Cormen 25.2.',
    [1],
    fw.matrices.slice(1, 3).map((m, i) =>
      step(FW_EXAMPLE, fw.steps[i + 1].description, { currentVertex: fw.ids[i], highlightVertexIds: [fw.ids[i]], table: matrixTable(m), formula: `d(${i + 1})ij = min(d(${i})ij, d(${i})i${fw.ids[i]} + d(${i})${fw.ids[i]}j)` }),
    ),
    'D(1) e D(2)',
  ),
  concept(
    'fw-execucao',
    'De D(0) até D(n)',
    'São n rodadas, uma por vértice liberado, e cada rodada revisa as n × n células: três laços sobre n, Θ(n³) no Cormen. A última matriz, D(n), tem todas as distâncias.',
    [2],
    fw.matrices.map((m, k) =>
      step(FW_EXAMPLE, k === 0 ? 'D(0): pesos diretos.' : fw.steps[k].description, { currentVertex: k ? fw.ids[k - 1] : undefined, table: matrixTable(m), formula: k === fw.matrices.length - 1 ? 'D(n): todas as distâncias' : `D(${k})` }),
    ),
    'Todas as matrizes do exemplo',
  ),
  concept(
    'fw-caminho',
    'Reconstruindo o caminho',
    'Além das distâncias, guarde quem é o predecessor de j no melhor caminho saindo de i. Voltando de j até i e invertendo, sai o caminho. Fonte: Cormen 25.2 (matriz Π).',
    [3],
    [
      step(FW_EXAMPLE, `Distância de 1 a 3: ${fmt(fw.matrices[4][0][2])}. Caminho pelos predecessores: ${fw.path('1', '3')!.join(' → ')}.`, { sequence: fw.path('1', '3')!, highlightEdgeIds: edgeIdsOf(FW_EXAMPLE, fw.path('1', '3')!.slice(1).map((v, i) => [fw.path('1', '3')![i], v])), edgeColorMap: colorAll(edgeIdsOf(FW_EXAMPLE, fw.path('1', '3')!.slice(1).map((v, i) => [fw.path('1', '3')![i], v])), GREEN) }),
      step(FW_EXAMPLE, `A diagonal de D(n) ficou toda ≥ 0 (${fw.ids.map((_, i) => fmt(fw.matrices[4][i][i])).join(', ')}): não há ciclo negativo. A aresta −2 foi aproveitada sem problema.`, { table: matrixTable(fw.matrices[4]) }),
    ],
    'Caminho de 1 a 3',
  ),
];

export const p2CaminhosLessons: LessonCatalog = {
  'caminho-minimo-conceitos': conceitos,
  'bellman-ford': bellman,
  'floyd-warshall': floyd,
};

export const p2CaminhosExtraLessons: LessonCatalog = {
  dijkstra: dijkstraSlide,
};

