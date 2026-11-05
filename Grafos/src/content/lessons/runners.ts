import type { GraphData } from '../types';
import type { AnimationStep } from './types';
import { GREEN, RED } from './builders';
import { dijkstraSetSteps, fleurySteps, step } from './p2';
import { kruskalSteps, primSteps, reverseDeleteSteps } from './p2-arvores';
import { bellmanSteps } from './p2-caminhos';
import { bottleneckSteps, criticalSteps, johnsonSteps } from './p2-material';
import { eulerianClassification, lineGraph, radiusDiameterCenter, stronglyConnectedComponents } from '../../lib/graph';

// Algoritmos que o Laboratório consegue rodar em qualquer grafo que o aluno
// desenhar. Cada `check` devolve um aviso quando o grafo não serve (ou serve,
// mas vale chamar atenção), para o aluno ver o motivo em vez de um resultado errado.

export interface LabAlgorithm {
  id: string;
  label: string;
  group: 'AGM' | 'Caminhos' | 'Euler e linha' | 'Conectividade';
  needsSource: boolean;
  /** `block: true` impede a execução. */
  check?: (g: GraphData) => { message: string; block?: boolean } | undefined;
  run: (g: GraphData, source: string) => AnimationStep[];
}

const hasNegative = (g: GraphData) => g.edges.some((e) => (e.weight ?? 1) < 0);
const undirectedOnly = (g: GraphData) => (g.directed ? { message: 'Este algoritmo é para grafo não direcionado. Desmarque "direcionado".', block: true } : undefined);
const directedOnly = (g: GraphData) => (g.directed ? undefined : { message: 'Este algoritmo é para grafo direcionado. Marque "direcionado".', block: true });

function lineGraphSteps(g: GraphData): AnimationStep[] {
  const l = lineGraph(g);
  const n = g.edges.length;
  const coords = l.vertices.map((v, i) => ({ ...v, x: 280 + 190 * Math.cos(-Math.PI / 2 + (i * 2 * Math.PI) / Math.max(n, 1)), y: 160 + 120 * Math.sin(-Math.PI / 2 + (i * 2 * Math.PI) / Math.max(n, 1)) }));
  return [
    step(g, `G tem ${n} arestas: L(G) terá ${n} vértices, um por aresta.`, { formula: `|V(L)| = ${n}` }),
    step({ ...l, vertices: coords }, `L(G): ligamos duas arestas de G quando elas compartilham um vértice. Resultado: ${l.edges.length} arestas.`, { formula: `|E(L)| = ${l.edges.length}`, highlightEdgeIds: l.edges.map((e) => e.id) }),
  ];
}

function sccSteps(g: GraphData): AnimationStep[] {
  const { components } = stronglyConnectedComponents(g);
  const palette = [GREEN, 'var(--color-amber)', RED, 'var(--color-accent-strong)'];
  return [
    step(g, 'Kosaraju: DFS em G marcando término, transposto e DFS em ordem não crescente de término.', {}),
    step(g, `${components.length} componente${components.length > 1 ? 's' : ''} fortemente conexo${components.length > 1 ? 's' : ''}. ${components.length === g.vertices.length ? 'Todos unitários: sem ciclo (se não houver laço).' : 'Componente com 2 ou mais vértices: há ciclo.'}`, {
      vertexColorMap: Object.fromEntries(components.flatMap((c, i) => c.map((v) => [v, palette[i % palette.length]]))),
      table: { headers: ['Componente', 'Vértices'], rows: components.map((c, i) => [String(i + 1), c.join(', ')]) },
    }),
  ];
}

function diameterSteps(g: GraphData): AnimationStep[] {
  const r = radiusDiameterCenter(g);
  return [
    step(g, 'Busca em largura a partir de cada vértice: a maior distância é a excentricidade dele.', { vertexNotes: Object.fromEntries(Object.entries(r.eccentricities).map(([v, e]) => [v, `ex=${e}`])) }),
    step(g, `Raio = ${r.radius}, diâmetro = ${r.diameter}, centro = {${r.center.join(', ')}}.`, {
      vertexNotes: Object.fromEntries(Object.entries(r.eccentricities).map(([v, e]) => [v, `ex=${e}`])),
      highlightVertexIds: r.center,
      formula: `raio = ${r.radius}  ·  diâmetro = ${r.diameter}`,
    }),
  ];
}

export const LAB_ALGORITHMS: LabAlgorithm[] = [
  { id: 'kruskal', label: 'Kruskal', group: 'AGM', needsSource: false, check: undirectedOnly, run: (g) => kruskalSteps(g) },
  { id: 'prim', label: 'Prim', group: 'AGM', needsSource: true, check: undirectedOnly, run: (g, s) => primSteps(g, s) },
  { id: 'reverse', label: 'Reverse-Delete', group: 'AGM', needsSource: false, check: undirectedOnly, run: (g) => reverseDeleteSteps(g) },
  {
    id: 'dijkstra',
    label: 'Dijkstra',
    group: 'Caminhos',
    needsSource: true,
    check: (g) => (hasNegative(g) ? { message: 'Há peso negativo: o Dijkstra pode errar. Compare com o Bellman-Ford no mesmo grafo.' } : undefined),
    run: (g, s) => dijkstraSetSteps(g, s, (S, v, d) => (S.length === 1 ? `Começa em ${v}, com d = 0.` : `Entra em S: ${v}, com d = ${d}.`)),
  },
  { id: 'bellman', label: 'Bellman-Ford', group: 'Caminhos', needsSource: true, run: (g, s) => bellmanSteps(g, s) },
  { id: 'maxmin', label: 'Max-Min', group: 'Caminhos', needsSource: true, run: (g, s) => bottleneckSteps(g, s, 'max-min') },
  { id: 'minmax', label: 'Min-Max', group: 'Caminhos', needsSource: true, run: (g, s) => bottleneckSteps(g, s, 'min-max') },
  { id: 'johnson', label: 'Johnson', group: 'Caminhos', needsSource: false, run: (g) => johnsonSteps(g) },
  { id: 'critico', label: 'Caminho crítico', group: 'Caminhos', needsSource: false, check: directedOnly, run: (g) => criticalSteps(g) },
  {
    id: 'fleury',
    label: 'Fleury',
    group: 'Euler e linha',
    needsSource: false,
    check: (g) => (g.directed ? undirectedOnly(g) : eulerianClassification(g).kind === 'none' ? { message: `${eulerianClassification(g).oddVertices.length} vértices de grau ímpar: não há caminho euleriano.`, block: true } : undefined),
    run: (g) => fleurySteps(g),
  },
  { id: 'linha', label: 'Grafo de linha', group: 'Euler e linha', needsSource: false, check: undirectedOnly, run: (g) => lineGraphSteps(g) },
  { id: 'scc', label: 'Kosaraju (SCC)', group: 'Conectividade', needsSource: false, check: directedOnly, run: (g) => sccSteps(g) },
  { id: 'diametro', label: 'Excentricidade e diâmetro', group: 'Conectividade', needsSource: false, check: undirectedOnly, run: (g) => diameterSteps(g) },
];
