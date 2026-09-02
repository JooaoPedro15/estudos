import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3-force';
import type { GraphData } from '@/content/types';

export interface LaidOutVertex {
  id: string;
  label: string;
  x: number;
  y: number;
}

/** Roda a simulação de forças de forma síncrona (sem animação contínua) até
 * estabilizar, e devolve posições fixas. Mantém a leitura do grafo estável —
 * sem "vibração" perpétua, que atrapalharia a leitura matemática. */
export function computeForceLayout(graph: GraphData, width: number, height: number): Record<string, LaidOutVertex> {
  const nodes = graph.vertices.map((v) => ({ ...v }));
  const links = graph.edges.map((e) => ({ ...e, source: e.source, target: e.target }));

  const sim = forceSimulation(nodes as unknown as { id: string; x?: number; y?: number }[])
    .force('charge', forceManyBody().strength(-320))
    .force('link', forceLink(links as unknown as { source: string; target: string }[]).id((d: unknown) => (d as { id: string }).id).distance(110))
    .force('center', forceCenter(width / 2, height / 2))
    .force('collide', forceCollide(42))
    .stop();

  const ticks = Math.min(400, Math.max(120, nodes.length * 20));
  for (let i = 0; i < ticks; i++) sim.tick();

  const result: Record<string, LaidOutVertex> = {};
  for (const n of nodes as unknown as { id: string; label: string; x: number; y: number }[]) {
    result[n.id] = { id: n.id, label: n.label, x: n.x, y: n.y };
  }
  return result;
}
