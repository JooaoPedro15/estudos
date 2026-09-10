import { makeGraph, neighbors } from '../../lib/graph';
import type { GraphData } from '../types';
import type { AnimationStep } from './types';

export const BLUE = 'var(--color-accent-strong)';
export const GREEN = 'var(--color-cyan)';
export const AMBER = 'var(--color-amber)';
export const RED = 'var(--color-danger)';

export function makeLessonGraph(vertices: string[], edges: Array<[string, string] | [string, string, number]>, directed = false): GraphData {
  const graph = makeGraph(directed, vertices, edges);
  return { ...graph, vertices: graph.vertices.map((v, i) => ({ ...v,
    x: vertices.length === 1 ? 280 : 280 + 170 * Math.cos(-Math.PI / 2 + i * 2 * Math.PI / vertices.length),
    y: vertices.length === 1 ? 150 : 155 + 100 * Math.sin(-Math.PI / 2 + i * 2 * Math.PI / vertices.length),
  })) };
}

export function traversalSteps(graph: GraphData, route: string[]): AnimationStep[] {
  const vertexCounts: Record<string, number> = {};
  const edgeCounts: Record<string, number> = {};
  return route.map((v, i) => {
    if (!graph.vertices.some(vertex => vertex.id === v)) throw new Error(`Vértice inexistente: ${v}`);
    vertexCounts[v] = (vertexCounts[v] ?? 0) + 1;
    let edgeId: string | undefined;
    if (i) {
      const from = route[i - 1];
      edgeId = graph.edges.find(e => e.source === from && e.target === v || !graph.directed && e.target === from && e.source === v)?.id;
      if (!edgeId) throw new Error(`Aresta inexistente: ${from} → ${v}`);
      edgeCounts[edgeId] = (edgeCounts[edgeId] ?? 0) + 1;
    }
    const repeatedEdge = edgeId && edgeCounts[edgeId] > 1;
    const repeatedVertex = vertexCounts[v] > 1;
    return {
      graph, currentVertex: v, sequence: route.slice(0, i + 1), sequenceLabel: 'Percurso até esta etapa',
      visitedVertexIds: Object.keys(vertexCounts), highlightEdgeIds: Object.keys(edgeCounts),
      legend: [{ label: 'Visitado / aresta usada', color: GREEN }, { label: 'Repetição: veja a contagem', color: AMBER }],
      edgeLabels: Object.fromEntries(Object.entries(edgeCounts).map(([id, count]) => [id, `${count}×`])),
      edgeColorMap: Object.fromEntries(Object.entries(edgeCounts).map(([id, count]) => [id, count > 1 ? AMBER : GREEN])),
      vertexNotes: Object.fromEntries(Object.entries(vertexCounts).map(([id, count]) => [id, `${count} visita${count > 1 ? 's' : ''}`])),
      vertexColorMap: Object.fromEntries(Object.entries(vertexCounts).filter(([,count]) => count > 1).map(([id]) => [id, AMBER])),
      traversal: i ? { from: route[i - 1], to: v } : undefined,
      message: i === 0 ? `Começamos em ${v}. Nenhuma aresta foi percorrida.` :
        `${route[i - 1]} → ${v}. ${repeatedEdge ? 'A mesma aresta foi reutilizada, agora no sentido inverso.' : 'Esta aresta é usada pela primeira vez.'} ${repeatedVertex ? `${v} já foi visitado: repetição de vértice.` : `${v} é um novo vértice visitado.`}`,
    };
  });
}

export function constructionSteps(graph: GraphData): AnimationStep[] {
  return Array.from({ length: graph.edges.length + 1 }, (_, i) => ({
    graph: { ...graph, edges: graph.edges.slice(0, i) },
    highlightEdgeIds: i ? [graph.edges[i - 1].id] : [],
    highlightVertexIds: i ? [graph.edges[i - 1].source, graph.edges[i - 1].target] : [],
    message: i ? `Adicionamos ${graph.edges[i - 1].source} — ${graph.edges[i - 1].target}. Agora há ${i} aresta${i > 1 ? 's' : ''}.` : 'Começamos apenas com os vértices, sem nenhuma aresta.',
    formula: `|V| = ${graph.vertices.length} · |E| = ${i}`,
  }));
}

/** A full BFS forest also checks disconnected graphs; colors assigned on enqueue. */
export function bipartiteSteps(graph: GraphData): AnimationStep[] {
  if (graph.directed) throw new Error('Esta demonstração de bipartição usa grafos não-dirigidos.');
  const colors: Record<string, string> = {};
  const queue: string[] = [];
  const steps: AnimationStep[] = [];
  const push = (message: string, extra: Partial<AnimationStep> = {}) => steps.push({
    graph, message, vertexColorMap: { ...colors },
    vertexNotes: Object.fromEntries(Object.entries(colors).map(([id, c]) => [id, c === BLUE ? 'cor 1' : 'cor 2'])),
    queue: [...queue], queueLabel: 'Fila BFS',
    legend: [{ label: 'Cor 1', color: BLUE }, { label: 'Cor 2', color: GREEN }], ...extra,
  });
  push('Nenhum vértice tem cor. Vamos testar se duas cores bastam.');
  for (const root of graph.vertices.map(v => v.id)) {
    if (colors[root]) continue;
    colors[root] = BLUE;
    queue.push(root);
    push(`Colorimos ${root} com a cor 1 e o colocamos na fila.`, { currentVertex: root });
    while (queue.length) {
      const current = queue.shift()!;
      push(`Retiramos ${current} do início da fila. Agora examinamos seus vizinhos em ordem alfabética.`, { currentVertex: current });
      for (const neighbor of neighbors(graph, current).sort()) {
        const edge = graph.edges.find(e => e.source === current && e.target === neighbor || e.target === current && e.source === neighbor)!;
        if (!colors[neighbor]) {
          colors[neighbor] = colors[current] === BLUE ? GREEN : BLUE;
          queue.push(neighbor);
          push(`${current} — ${neighbor}: ${neighbor} recebe a cor oposta e entra no fim da fila.`, { currentVertex: current, highlightEdgeIds: [edge.id], highlightVertexIds: [neighbor] });
        } else if (colors[neighbor] === colors[current]) {
          push(`Conflito de coloração → grafo não bipartido. ${current} e ${neighbor} são vizinhos e receberam a mesma cor.`, {
            currentVertex: current, highlightEdgeIds: [edge.id], edgeColorMap: { [edge.id]: RED }, highlightVertexIds: [current, neighbor],
            legend: [{ label: 'Cor 1', color: BLUE }, { label: 'Cor 2', color: GREEN }, { label: 'Aresta em conflito', color: RED }],
            vertexNotes: { [current]: 'conflito · mesma cor', [neighbor]: 'conflito · mesma cor' },
          });
          return steps;
        } else {
          push(`${current} — ${neighbor}: cores diferentes, aresta válida. ${neighbor} já foi descoberto e não entra novamente na fila.`, { currentVertex: current, highlightEdgeIds: [edge.id] });
        }
      }
    }
  }
  push('Fila vazia e todos os componentes verificados: cada aresta liga cores diferentes. O grafo é bipartido.', { highlightEdgeIds: graph.edges.map(e => e.id) });
  return steps;
}
