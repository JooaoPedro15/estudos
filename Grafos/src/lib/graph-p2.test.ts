import { describe, it, expect } from 'vitest';
import { makeGraph, prim, kruskal, bellmanFord, dijkstra } from './graph';

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

// Matriz D da questão 2 da P2 de 2024/1 (Provas/Prova2/P2 - 1º 2024 - parte 1.jpeg):
// D[i][j] != 0 é o comprimento da aresta direcionada (i, j).
const p2Q2 = makeGraph(true, ['1', '2', '3', '4', '5', '6', '7'], [
  ['1', '2', 6],
  ['1', '3', 5],
  ['1', '4', 5],
  ['2', '5', -1],
  ['3', '2', -2],
  ['3', '5', 1],
  ['4', '3', -2],
  ['4', '6', -1],
  ['5', '7', 3],
  ['6', '7', 3],
]);

describe('Bellman-Ford', () => {
  it('resolve a questão 2 da P2 de 2024/1 (pesos negativos)', () => {
    const { distances } = bellmanFord(p2Q2, '1');
    expect(distances).toEqual({ '1': 0, '2': 1, '3': 3, '4': 5, '5': 0, '6': 4, '7': 3 });
  });

  it('reconstrói os caminhos pelos predecessores', () => {
    const { predecessors } = bellmanFord(p2Q2, '1');
    expect(predecessors).toMatchObject({ '2': '3', '3': '4', '4': '1', '5': '2', '6': '4', '7': '5' });
  });

  it('tabela d[i, v] tem n linhas (i = 0..n-1) e a linha i só usa a linha i-1', () => {
    const { table } = bellmanFord(p2Q2, '1');
    expect(table).toHaveLength(7);
    expect(table[0]['1']).toBe(0);
    expect(table[0]['2']).toBe(Infinity);
    // com no máximo 1 aresta, 2 só é alcançado pela aresta direta (1,2) = 6
    expect(table[1]['2']).toBe(6);
    // com no máximo 2 arestas: 1->3->2 = 5 - 2 = 3
    expect(table[2]['2']).toBe(3);
  });

  it('detecta ciclo negativo (exemplo do slide 10, quadro 23)', () => {
    const g = makeGraph(true, ['a', 'b', 'c', 'd'], [['a', 'b', 2], ['a', 'c', 1], ['b', 'd', 3], ['c', 'b', -5], ['d', 'c', -6]]);
    expect(bellmanFord(g, 'a').negativeCycle).toBe(true);
  });

  it('sem ciclo negativo, concorda com Dijkstra quando os pesos são positivos', () => {
    expect(bellmanFord(slideMst, 'a').distances).toEqual(dijkstra(slideMst, 'a').distances);
  });
});

describe('Dijkstra no exemplo do slide 10 (quadro 26)', () => {
  it('distâncias a partir de e', () => {
    const g = makeGraph(true, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], [
      ['e', 'f', 5], ['e', 'g', 8], ['e', 'a', 9], ['f', 'c', 15], ['f', 'g', 4], ['f', 'h', 12],
      ['g', 'h', 7], ['g', 'b', 6], ['a', 'g', 5], ['a', 'b', 4], ['a', 'd', 20], ['b', 'h', 1],
      ['b', 'd', 13], ['h', 'c', 3], ['h', 'd', 11], ['c', 'd', 9],
    ]);
    expect(dijkstra(g, 'e').distances).toEqual({ a: 9, b: 13, c: 17, d: 25, e: 0, f: 5, g: 8, h: 14 });
  });
});
