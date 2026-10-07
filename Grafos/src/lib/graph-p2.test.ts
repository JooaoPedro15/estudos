import { describe, it, expect } from 'vitest';
import { makeGraph, prim, kruskal } from './graph';

// Grafo dos slides "Example of Prim's/Kruskal's Algorithm"
// (11-graphs-trees-spanning-trees.pdf, p. 51-52 — quadros 16 e 17 de 29).
const slideMst = makeGraph(false, ['a', 'b', 'c', 'd', 'e', 'f', 'g'], [
  ['a', 'b', 7],
  ['a', 'd', 5],
  ['b', 'c', 8],
  ['b', 'd', 9],
  ['b', 'e', 7],
  ['c', 'e', 5],
  ['d', 'e', 15],
  ['d', 'f', 6],
  ['e', 'f', 8],
  ['e', 'g', 9],
  ['f', 'g', 11],
]);

function edgePair(g: ReturnType<typeof makeGraph>, id: string): string {
  const e = g.edges.find((x) => x.id === id)!;
  return [e.source, e.target].sort().join('-');
}

describe('Prim', () => {
  it('AGM do exemplo do slide pesa 39', () => {
    expect(prim(slideMst, 'a').totalWeight).toBe(39);
  });

  it('a partir de a, adiciona as arestas na ordem do corte mais barato', () => {
    const { treeEdgeIds } = prim(slideMst, 'a');
    expect(treeEdgeIds.map((id) => edgePair(slideMst, id))).toEqual(['a-d', 'd-f', 'a-b', 'b-e', 'c-e', 'e-g']);
  });

  it('árvore geradora tem n - 1 arestas', () => {
    expect(prim(slideMst, 'a').treeEdgeIds).toHaveLength(6);
  });

  it('em grafo desconexo para quando o corte fica vazio', () => {
    const g = makeGraph(false, ['a', 'b', 'c'], [['a', 'b', 1]]);
    const result = prim(g, 'a');
    expect(result.treeEdgeIds).toHaveLength(1);
    expect(result.spanning).toBe(false);
  });
});

describe('Kruskal', () => {
  it('AGM do exemplo do slide pesa 39, igual à de Prim', () => {
    expect(kruskal(slideMst).totalWeight).toBe(39);
  });

  it('aceita arestas em ordem não decrescente de custo', () => {
    const { treeEdgeIds } = kruskal(slideMst);
    expect(treeEdgeIds.map((id) => edgePair(slideMst, id))).toEqual(['a-d', 'c-e', 'd-f', 'a-b', 'b-e', 'e-g']);
  });

  it('descarta as arestas que formariam ciclo', () => {
    const { rejectedEdgeIds } = kruskal(slideMst);
    expect(rejectedEdgeIds.map((id) => edgePair(slideMst, id))).toEqual(['b-c', 'e-f', 'b-d', 'f-g', 'd-e']);
  });

  it('em grafo desconexo devolve floresta geradora (n - k arestas)', () => {
    const g = makeGraph(false, ['a', 'b', 'c', 'd'], [['a', 'b', 1], ['c', 'd', 2]]);
    const result = kruskal(g);
    expect(result.treeEdgeIds).toHaveLength(2);
    expect(result.spanning).toBe(false);
  });
});
