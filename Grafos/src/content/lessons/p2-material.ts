import type { GraphData } from '../types';
import type { AnimationStep, GraphConcept, LessonCatalog } from './types';
import { AMBER, GREEN, RED } from './builders';
import { concept, edgeIdsOf, step } from './p2';
import { johnson, minMaxPath, stronglyConnectedComponents, topologicalLevels, widestPath } from '../../lib/graph';
import { AULAO_CRITICO, PASSEIO_CONEXO, RESUMO_MINMAX } from '../questions/graphs-p2';

const fmt = (n: number) => (n === Infinity ? '+∞' : n === -Infinity ? '−∞' : String(n));
const colorAll = (ids: string[], color: string) => Object.fromEntries(ids.map((id) => [id, color]));

function pathOf(pred: Record<string, string | null>, source: string, target: string): string[] {
  const out = [target];
  let v = target;
  while (v !== source && pred[v]) {
    v = pred[v]!;
    out.push(v);
  }
  return out.reverse();
}

// ---------------------------------------------------------------------------
// Execução de Max-Min e Min-Max, também usada pelo Laboratório
// ---------------------------------------------------------------------------

export function bottleneckSteps(graph: GraphData, source: string, mode: 'max-min' | 'min-max'): AnimationStep[] {
  const isMax = mode === 'max-min';
  const ids = graph.vertices.map((v) => v.id);
  const val: Record<string, number> = Object.fromEntries(ids.map((v) => [v, v === source ? (isMax ? Infinity : -Infinity) : isMax ? -Infinity : Infinity]));
  const done: string[] = [];
  const table = () => ({ headers: ['Vértice', 'Valor', 'Saiu da fila?'], rows: ids.map((v) => [v, fmt(val[v]), done.includes(v) ? 'sim' : 'não']) });
  const notes = () => Object.fromEntries(ids.map((v) => [v, fmt(val[v])]));
  const out: AnimationStep[] = [
    step(graph, `Origem ${source} com ${fmt(val[source])}; demais com ${isMax ? '−∞' : '+∞'}.`, { currentVertex: source, table: table(), vertexNotes: notes() }),
  ];
  while (done.length < ids.length) {
    const open = ids.filter((v) => !done.includes(v) && val[v] !== (isMax ? -Infinity : Infinity));
    if (open.length === 0) break;
    const u = open.reduce((a, b) => ((isMax ? val[b] > val[a] : val[b] < val[a]) ? b : a));
    done.push(u);
    const changed: string[] = [];
    const usedEdges: string[] = [];
    for (const e of graph.edges) {
      const to = e.source === u ? e.target : !graph.directed && e.target === u ? e.source : null;
      if (to === null || done.includes(to)) continue;
      const w = e.weight ?? 1;
      const candidate = isMax ? Math.min(val[u], w) : Math.max(val[u], w);
      if (isMax ? candidate > val[to] : candidate < val[to]) {
        val[to] = candidate;
        changed.push(`${to}: ${isMax ? 'min' : 'max'}(${fmt(val[u])}, ${w}) = ${candidate}`);
        usedEdges.push(e.id);
      }
    }
    out.push(
      step(graph, `Sai da fila ${u} (${isMax ? 'maior' : 'menor'} valor: ${fmt(val[u])}). ${changed.length ? `Atualiza ${changed.join('; ')}.` : 'Nenhum vizinho melhora.'}`, {
        currentVertex: u,
        visitedVertexIds: [...done],
        vertexColorMap: colorAll(done, GREEN),
        highlightEdgeIds: usedEdges,
        edgeColorMap: colorAll(usedEdges, AMBER),
        vertexNotes: notes(),
        table: table(),
        sequence: [...done],
        sequenceLabel: 'Ordem de saída da fila',
      }),
    );
  }
  return out;
}

// ---------------------------------------------------------------------------
// Caminho crítico
// ---------------------------------------------------------------------------

export function criticalSteps(graph: GraphData): AnimationStep[] {
  const levels = topologicalLevels(graph);
  if (!levels) return [step(graph, 'Em alguma rodada não sobra vértice com grau de entrada 0: há ciclo, não existe ordem topológica.', {})];
  const colors = [GREEN, AMBER, RED];
  const groups = (n: number) => levels.slice(0, n).map((vs, i) => ({ label: `Rodada ${i + 1}`, vertexIds: vs, color: colors[i % colors.length] }));
  const out: AnimationStep[] = [step(graph, 'Base = vértices com grau de entrada 0. Vamos remover a base até o grafo ficar vazio.', {})];
  levels.forEach((vs, i) => {
    const removed = levels.slice(0, i + 1).flat();
    const left = graph.vertices.filter((v) => !removed.includes(v.id)).map((v) => v.id);
    out.push(
      step(graph, `Rodada ${i + 1}: a base é {${vs.join(', ')}}. Remove esses vértices e suas arestas de saída.${left.length ? '' : ' O grafo ficou vazio.'}`, {
        highlightVertexIds: vs,
        visitedVertexIds: removed,
        groups: groups(i + 1),
        vertexColorMap: Object.fromEntries(levels.slice(0, i + 1).flatMap((l, k) => l.map((v) => [v, colors[k % colors.length]]))),
        sequence: removed,
        sequenceLabel: 'Ordem topológica até aqui',
        formula: `${i + 1} rodada${i ? 's' : ''}`,
      }),
    );
  });
  return out;
}

// ---------------------------------------------------------------------------
// Johnson
// ---------------------------------------------------------------------------

export function johnsonSteps(graph: GraphData): AnimationStep[] {
  const r = johnson(graph);
  if (!r) return [step(graph, 'O Bellman-Ford encontrou ciclo negativo: o algoritmo se encerra.', {})];
  const ids = graph.vertices.map((v) => v.id);
  const withWeights: GraphData = { ...graph, directed: true, edges: r.reweighted.edges.map((e) => ({ ...e })) };
  return [
    step(graph, 'Grafo original, com pesos negativos. O Dijkstra não pode rodar aqui.', {}),
    step(graph, `Vértice novo s com peso 0 para todos; Bellman-Ford a partir de s dá d = (${ids.map((v) => `${v}: ${fmt(r.h[v])}`).join(', ')}).`, { vertexNotes: Object.fromEntries(ids.map((v) => [v, `d=${fmt(r.h[v])}`])), formula: 's → v com peso 0' }),
    step(withWeights, 'Ajuste: peso′(u, v) = peso(u, v) + d[u] − d[v]. Agora nenhum peso é negativo.', { vertexNotes: Object.fromEntries(ids.map((v) => [v, `d=${fmt(r.h[v])}`])), formula: 'peso′(u, v) = peso(u, v) + d[u] − d[v]', highlightEdgeIds: withWeights.edges.map((e) => e.id) }),
    step(graph, 'Dijkstra de cada vértice no grafo ajustado, depois desfaz: d[u, v] = d′[u, v] − d[u] + d[v].', {
      formula: 'd[u, v] = d′[u, v] − d[u] + d[v]',
      table: { headers: ['', ...ids], rows: ids.map((u) => [u, ...ids.map((v) => fmt(r.distances[u][v]))]) },
    }),
  ];
}

// ---------------------------------------------------------------------------
// Lições
// ---------------------------------------------------------------------------

const scc = stronglyConnectedComponents(PASSEIO_CONEXO).components;
const widest = widestPath(RESUMO_MINMAX, 's');
const minmax = minMaxPath(RESUMO_MINMAX, 's');
const widestRoute = pathOf(widest.predecessors, 's', 't');
const minmaxRoute = pathOf(minmax.predecessors, 's', 't');
const routeEdges = (route: string[]) => edgeIdsOf(RESUMO_MINMAX, route.slice(1).map((v, i) => [route[i], v]));

const conectividade: GraphConcept[] = [
  concept('conn-tipos', 'Ignorar a seta, uma seta ou as duas', 'Pense em ruas de mão única. Fraco: olhando só o mapa, sem respeitar a mão, tudo está ligado. Semi-forte: de qualquer par, pelo menos um consegue chegar ao outro dirigindo direito. Forte: os dois conseguem chegar um no outro.', [0], [
    step(PASSEIO_CONEXO, 'Grafo de exemplo criado para explicação. Ignorando as setas, tudo está ligado: é fracamente conexo.', { highlightEdgeIds: PASSEIO_CONEXO.edges.map((e) => e.id), formula: 'Fraco: ✓' }),
    step(PASSEIO_CONEXO, 'Para todo par há caminho em pelo menos um sentido (a chega em todos; b, c e d chegam em e): é semi-fortemente conexo.', { sequence: ['a', 'b', 'c', 'd', 'e'], formula: 'Semi-forte: ✓' }),
    step(PASSEIO_CONEXO, 'Mas e não chega em a. Para forte, teria que chegar: não é fortemente conexo.', { highlightVertexIds: ['a', 'e'], vertexColorMap: { e: RED, a: RED }, formula: 'Forte: ✗' }),
  ], 'Os três tipos no mesmo grafo'),
  concept('conn-fraco', 'Fraco: tire as setas e faça uma busca', 'Para testar o tipo fraco, troque cada seta por uma aresta sem direção e faça uma busca a partir de qualquer vértice. Se visitou todos, é fracamente conexo.', [1], [
    step({ ...PASSEIO_CONEXO, directed: false }, 'Grafo subjacente S: as mesmas arestas, sem direção.', {}),
    step({ ...PASSEIO_CONEXO, directed: false }, 'Busca a partir de a visita todos os vértices: G é fracamente conexo.', { visitedVertexIds: PASSEIO_CONEXO.vertices.map((v) => v.id), vertexColorMap: colorAll(PASSEIO_CONEXO.vertices.map((v) => v.id), GREEN) }),
  ], 'Resumo, p. 3'),
  concept('conn-semi', 'Semi-forte: olhe os pares', 'Uma busca só não basta: pode ser que o vértice inicial alcance todos, e mesmo assim dois outros não se alcancem. Por isso a resolução da aluna lista par por par.', [2], [
    step(PASSEIO_CONEXO, 'Par (c, d): existe caminho de c para d, então o par passa. Basta um dos dois sentidos.', { highlightVertexIds: ['c', 'd'], highlightEdgeIds: edgeIdsOf(PASSEIO_CONEXO, [['c', 'd']]) }),
    step(PASSEIO_CONEXO, 'Repita para todos os pares. Basta um par sem caminho em nenhum dos dois sentidos para não ser semi-forte.', { table: { headers: ['Par', 'Caminho'], rows: [['a, b', 'a → b'], ['a, e', 'a → … → e'], ['b, c', 'b → c'], ['c, d', 'c → d'], ['d, e', 'd → e']] } }),
  ], 'Par a par'),
  concept('conn-forte', 'Forte: uma DFS só no transposto', 'É o Kosaraju: DFS em G com tempos, transposto, DFS em ordem não crescente de término. Se uma única DFS no transposto visita tudo, só há um componente: é fortemente conexo.', [3], [
    step(PASSEIO_CONEXO, `Componentes fortemente conexos deste grafo: ${scc.map((c) => `{${c.join(', ')}}`).join(', ')}. Mais de um: não é fortemente conexo.`, { groups: scc.slice(0, 5).map((c, i) => ({ label: `SCC ${i + 1}`, vertexIds: c, color: [GREEN, AMBER, RED][i % 3] })) }),
    step(PASSEIO_CONEXO, 'Sem ciclo, cada vértice é seu próprio componente. Com um único componente, o grafo seria fortemente conexo.', { formula: `${scc.length} componentes` }),
  ], 'Kosaraju como teste'),
];

const maxMin: GraphConcept[] = [
  concept('mm-cano', 'O cano mais fino manda', 'Água passando por um cano de vazão 3 e depois por um de 10: só passam 3. Em cada caminho do grafo, o valor que importa é o da aresta mais fina. Max-Min procura o caminho em que essa aresta mais fina é a maior possível.', [0], [
    step(RESUMO_MINMAX, 'Caminho de cima: 2, 1, 8. Gargalo = 1.', { highlightEdgeIds: routeEdges(['s', 'a', 'b', 't']), edgeColorMap: colorAll(routeEdges(['s', 'a', 'b', 't']), AMBER), formula: 'min(2, 1, 8) = 1' }),
    step(RESUMO_MINMAX, 'Caminho do meio: 6, 9, 3. Gargalo = 3.', { highlightEdgeIds: routeEdges(['s', 'c', 'd', 't']), edgeColorMap: colorAll(routeEdges(['s', 'c', 'd', 't']), AMBER), formula: 'min(6, 9, 3) = 3' }),
    step(RESUMO_MINMAX, 'Caminho de baixo: 7, 4, 5. Gargalo = 4, o maior dos menores.', { highlightEdgeIds: routeEdges(['s', 'e', 'f', 't']), edgeColorMap: colorAll(routeEdges(['s', 'e', 'f', 't']), GREEN), formula: 'Max-Min = max(1, 3, 4) = 4' }),
  ], 'Caso do cano no grafo do resumo'),
  concept('mm-max-min', 'Max-Min é um Dijkstra de cabeça para baixo', 'Mesma estrutura do Dijkstra, com três trocas: começa em +∞ e −∞, tira da fila o MAIOR valor, e a conta vira min(valor do vértice, peso da aresta).', [1], bottleneckSteps(RESUMO_MINMAX, 's', 'max-min'), `Max-Min: resposta ${fmt(widest.capacities.t)}, por ${widestRoute.join(' → ')}`),
  concept('mm-min-max', 'Min-Max é o espelho', 'Agora o objetivo é fugir da aresta mais grossa: menor dos maiores. Tira da fila o MENOR valor e a conta vira max(valor do vértice, peso da aresta). No resumo, a resposta deste grafo é 7.', [2], bottleneckSteps(RESUMO_MINMAX, 's', 'min-max'), `Min-Max: resposta ${fmt(minmax.values.t)}, por ${minmaxRoute.join(' → ')}`),
  concept('mm-nomes', 'Não confunda os nomes', 'Decore pelo português: o primeiro nome é o que você faz no fim, o segundo é o que escolhe em cada caminho. MAX-min: dos menores de cada caminho, pegue o maior. MIN-max: dos maiores de cada caminho, pegue o menor.', [3], [
    step(RESUMO_MINMAX, 'Max-Min: menor de cada caminho = 1, 3, 4. O maior deles: 4.', { table: { headers: ['Caminho', 'Menor', 'Maior'], rows: [['cima', '1', '8'], ['meio', '3', '9'], ['baixo', '4', '7']] }, formula: 'Max-Min = 4' }),
    step(RESUMO_MINMAX, 'Min-Max: maior de cada caminho = 8, 9, 7. O menor deles: 7.', { table: { headers: ['Caminho', 'Menor', 'Maior'], rows: [['cima', '1', '8'], ['meio', '3', '9'], ['baixo', '4', '7']] }, formula: 'Min-Max = 7' }),
  ], 'A mesma tabela, duas perguntas'),
];

const JOHNSON_G: GraphData = {
  directed: true,
  vertices: [{ id: 'a', label: 'a', x: 90, y: 160 }, { id: 'b', label: 'b', x: 280, y: 50 }, { id: 'c', label: 'c', x: 470, y: 160 }, { id: 'd', label: 'd', x: 280, y: 280 }],
  edges: [{ id: 'e0', source: 'a', target: 'b', weight: 3 }, { id: 'e1', source: 'b', target: 'c', weight: -2 }, { id: 'e2', source: 'a', target: 'd', weight: 4 }, { id: 'e3', source: 'd', target: 'c', weight: 1 }, { id: 'e4', source: 'c', target: 'a', weight: 2 }],
};
const js = johnsonSteps(JOHNSON_G);

const johnsonLesson: GraphConcept[] = [
  concept('jo-preparo', 'Um vértice extra para descobrir o ajuste', 'O Dijkstra não aceita peso negativo, mas é rápido. A ideia é trocar os pesos para nenhum ser negativo sem mudar qual caminho é o menor. O vértice extra s, ligado a todos com peso 0, dá ao Bellman-Ford de onde começar. Exemplo criado para explicação.', [0], js.slice(0, 2), 'Passos 1 a 3'),
  concept('jo-ajuste', 'A troca que zera os negativos', 'O novo peso soma d[u] e subtrai d[v]. Em qualquer caminho de u a v os termos do meio se cancelam, então todos os caminhos entre o mesmo par mudam pelo mesmo valor, e o menor continua sendo o menor.', [1], js.slice(1, 3), 'Passo 4'),
  concept('jo-final', 'Dijkstra de cada um e desfaz', 'Rode o Dijkstra a partir de cada vértice no grafo ajustado. Os valores saem no grafo trocado, então desfaça a conta para voltar aos pesos originais.', [2], js.slice(2), 'Passos 5 e 6'),
];

const levels = topologicalLevels(AULAO_CRITICO)!;
const critico: GraphConcept[] = [
  concept('cc-base', 'Tire a base, repita', 'Base é quem não depende de ninguém: grau de entrada 0. Tire todos eles juntos; agora outros ficam sem dependência. Repita até acabar. Se em alguma rodada ninguém tiver grau de entrada 0, há ciclo.', [0], criticalSteps(AULAO_CRITICO), 'Exemplo do aulão II'),
  concept('cc-periodos', 'Rodadas = períodos', `Disciplinas sem pré-requisito entre si podem ser feitas no mesmo período. Por isso cada rodada é um período, e o número de rodadas (${levels.length} no exemplo) é o mínimo para terminar tudo.`, [1], [
    step(AULAO_CRITICO, `Período 1: ${levels[0].join(', ')}. Período 2: ${levels[1].join(', ')}. Período 3: ${levels[2].join(', ')}.`, { groups: levels.map((l, i) => ({ label: `Período ${i + 1}`, vertexIds: l, color: [GREEN, AMBER, RED][i] })) }),
    step(AULAO_CRITICO, `Mínimo de ${levels.length} períodos, porque existe uma cadeia de ${levels.length} disciplinas dependentes: B → D → F.`, { sequence: ['B', 'D', 'F'], highlightEdgeIds: edgeIdsOf(AULAO_CRITICO, [['B', 'D'], ['D', 'F']]), edgeColorMap: colorAll(edgeIdsOf(AULAO_CRITICO, [['B', 'D'], ['D', 'F']]), RED) }),
  ], 'Modelando pré-requisitos'),
  concept('cc-maior', 'Maior caminho com o sinal trocado', 'Para maior caminho em número de arestas, o resumo dá peso 1 a tudo, troca para −1 e aplica o Dijkstra em ordem, começando na base com maior fecho transitivo. No fim, inverte o sinal. A ordem é o que faz isso funcionar aqui, já que o Dijkstra comum não aceita negativos.', [2], [
    step(AULAO_CRITICO, 'W = 1 em toda aresta; W′ = −W. A cadeia B → D → F tem comprimento −2.', { sequence: ['B', 'D', 'F'], highlightEdgeIds: edgeIdsOf(AULAO_CRITICO, [['B', 'D'], ['D', 'F']]), formula: 'W′ = −W' }),
    step(AULAO_CRITICO, 'Invertendo o sinal da resposta: maior caminho com 2 arestas.', { sequence: ['B', 'D', 'F'], edgeColorMap: colorAll(edgeIdsOf(AULAO_CRITICO, [['B', 'D'], ['D', 'F']]), GREEN), formula: 'resposta = 2' }),
  ], 'Resumo, p. 13'),
];

export const p2MaterialLessons: LessonCatalog = {
  'conectividade-direcionada': conectividade,
  'max-min': maxMin,
  johnson: johnsonLesson,
  'caminho-critico': critico,
};
