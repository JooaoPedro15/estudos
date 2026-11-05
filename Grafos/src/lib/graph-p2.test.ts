import { describe, it, expect } from 'vitest';
import { makeGraph, prim, kruskal, bellmanFord, dijkstra, floydWarshall, fleury, bridges, cutSet, rankAndNullity, lineGraph, widestPath, minMaxPath, topologicalLevels, johnson, degree, eulerianClassification } from './graph';

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

describe('Floyd-Warshall', () => {
  it('D(0) é a matriz de pesos: 0 na diagonal, ∞ sem aresta', () => {
    const { matrices, ids } = floydWarshall(p2Q2);
    const d0 = matrices[0];
    const i1 = ids.indexOf('1');
    expect(d0[i1][i1]).toBe(0);
    expect(d0[i1][ids.indexOf('2')]).toBe(6);
    expect(d0[i1][ids.indexOf('7')]).toBe(Infinity);
  });

  it('gera n + 1 matrizes, D(0) a D(n)', () => {
    expect(floydWarshall(p2Q2).matrices).toHaveLength(8);
  });

  it('cada linha de D(n) bate com Bellman-Ford a partir daquele vértice', () => {
    const { matrices, ids } = floydWarshall(p2Q2);
    const dn = matrices[matrices.length - 1];
    for (const s of ids) {
      const { distances } = bellmanFord(p2Q2, s);
      ids.forEach((t, j) => expect(dn[ids.indexOf(s)][j]).toBe(distances[t]));
    }
  });

  it('reconstrói o caminho 1 -> 7 pela matriz de predecessores', () => {
    expect(floydWarshall(p2Q2).path('1', '7')).toEqual(['1', '4', '3', '2', '5', '7']);
  });

  it('diagonal negativa indica ciclo negativo', () => {
    const g = makeGraph(true, ['a', 'b', 'c', 'd'], [['a', 'b', 2], ['a', 'c', 1], ['b', 'd', 3], ['c', 'b', -5], ['d', 'c', -6]]);
    expect(floydWarshall(g).negativeCycle).toBe(true);
  });
});

// Grafo do slide "Eulerian graph" (08-graphs-traversing.pdf, p. 103): e-a-d-c-e-b-f-d.
const slideEuler = makeGraph(false, ['a', 'b', 'c', 'd', 'e', 'f'], [
  ['e', 'a'], ['a', 'd'], ['d', 'c'], ['c', 'e'], ['e', 'b'], ['b', 'f'], ['f', 'd'],
]);

describe('pontes e cortes', () => {
  it('em um caminho todas as arestas são pontes; em um ciclo, nenhuma', () => {
    const path = makeGraph(false, ['a', 'b', 'c'], [['a', 'b'], ['b', 'c']]);
    const cycle = makeGraph(false, ['a', 'b', 'c'], [['a', 'b'], ['b', 'c'], ['c', 'a']]);
    expect(bridges(path)).toEqual(['e0', 'e1']);
    expect(bridges(cycle)).toEqual([]);
  });

  it('cut(S) = arestas com uma ponta em S e outra em V - S', () => {
    expect(cutSet(slideMst, ['a', 'd']).sort()).toEqual(['e0', 'e3', 'e6', 'e7'].sort());
  });
});

describe('posto e nulidade (slide 11, p. 35)', () => {
  it('exemplo do slide: n = 8, e = 9, k = 1 dá posto 7 e 2 cordas', () => {
    const g = makeGraph(false, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], [
      ['f', 'a'], ['f', 'e'], ['e', 'a'], ['b', 'a'], ['c', 'a'], ['a', 'g'], ['c', 'g'], ['g', 'd'], ['d', 'h'],
    ]);
    expect(rankAndNullity(g)).toEqual({ n: 8, e: 9, k: 1, rank: 7, nullity: 2 });
  });
});

describe('Fleury', () => {
  it('constrói caminho euleriano no exemplo do slide, começando em vértice de grau ímpar', () => {
    const result = fleury(slideEuler)!;
    expect(result.trail).toHaveLength(slideEuler.edges.length + 1);
    expect(['d', 'e']).toContain(result.trail[0]);
    expect(['d', 'e']).toContain(result.trail[result.trail.length - 1]);
  });

  it('usa cada aresta exatamente uma vez', () => {
    const { edgeOrder } = fleury(slideEuler)!;
    expect(new Set(edgeOrder).size).toBe(slideEuler.edges.length);
  });

  it('não atravessa ponte enquanto houver outra opção', () => {
    // dois triângulos ligados pela ponte c-d; começando em c, ir para d cedo deixaria arestas para trás
    const g = makeGraph(false, ['a', 'b', 'c', 'd', 'e', 'f'], [
      ['c', 'd'], ['a', 'b'], ['b', 'c'], ['c', 'a'], ['d', 'e'], ['e', 'f'], ['f', 'd'],
    ]);
    const { edgeOrder } = fleury(g)!;
    expect(edgeOrder).toHaveLength(7);
  });

  it('exemplo do Fleury no slide 08 (quadro 33): começa em f e evita a ponte f-d', () => {
    const g = makeGraph(false, ['a', 'b', 'c', 'd', 'e', 'f'], [['b', 'f'], ['b', 'e'], ['e', 'f'], ['f', 'd'], ['d', 'a'], ['a', 'c'], ['c', 'd']]);
    const { trail } = fleury(g, 'f')!;
    expect(trail[0]).toBe('f');
    expect(trail.slice(0, 4)).toEqual(['f', 'b', 'e', 'f']);
    expect(trail).toHaveLength(8);
  });

  it('devolve null com mais de 2 vértices de grau ímpar', () => {
    const star = makeGraph(false, ['a', 'b', 'c', 'd'], [['a', 'b'], ['a', 'c'], ['a', 'd']]);
    expect(fleury(star)).toBeNull();
  });
});

describe('grafo de linha', () => {
  const k4 = makeGraph(false, ['1', '2', '3', '4'], [['1', '2'], ['1', '3'], ['1', '4'], ['2', '3'], ['2', '4'], ['3', '4']]);

  it('L(K4), lista Exercício 20: 6 vértices e 12 arestas', () => {
    const l = lineGraph(k4);
    expect(l.vertices).toHaveLength(6);
    expect(l.edges).toHaveLength(12);
  });

  it('grau em L(G) da aresta uv é d(u) + d(v) − 2', () => {
    const g = makeGraph(false, ['x', 'y', 'u', 'v'], [['x', 'y'], ['x', 'u'], ['x', 'v'], ['y', 'u'], ['y', 'v']]);
    const l = lineGraph(g);
    for (const e of g.edges) expect(degree(l, e.id)).toBe(degree(g, e.source) + degree(g, e.target) - 2);
  });

  it('2026/1-Q1.1: G euleriano ⇒ L(G) euleriano', () => {
    const c5 = makeGraph(false, ['a', 'b', 'c', 'd', 'e'], [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'e'], ['e', 'a'], ['a', 'c'], ['c', 'e'], ['e', 'b'], ['b', 'd'], ['d', 'a']]);
    expect(eulerianClassification(c5).kind).toBe('circuit');
    expect(eulerianClassification(lineGraph(c5)).kind).toBe('circuit');
  });

  it('2026/1-Q1.3: contraexemplo K4 − e, semi-euleriano com L(G) de 4 ímpares', () => {
    const g = makeGraph(false, ['x', 'y', 'u', 'v'], [['x', 'y'], ['x', 'u'], ['x', 'v'], ['y', 'u'], ['y', 'v']]);
    expect(eulerianClassification(g).kind).toBe('path');
    expect(eulerianClassification(lineGraph(g)).kind).toBe('none');
  });
});

describe('Prim com arestas obrigatórias (2024/2-Q3, 2025/1-Q4, 2026/1-Q3)', () => {
  it('peso menor que todos força a aresta na árvore, sem mudar o algoritmo', () => {
    const forced = slideMst.edges.find((e) => e.source === 'd' && e.target === 'e')!;
    const min = Math.min(...slideMst.edges.map((e) => e.weight!));
    const g = { ...slideMst, edges: slideMst.edges.map((e) => (e.id === forced.id ? { ...e, weight: min - 1 } : e)) };
    const { treeEdgeIds } = prim(g, 'a');
    expect(treeEdgeIds).toContain(forced.id);
    expect(treeEdgeIds).toHaveLength(6);
  });
});

describe('widest path (capacidade máxima)', () => {
  it('maximiza a menor aresta do caminho', () => {
    const g = makeGraph(false, ['s', 'a', 'b', 't'], [['s', 'a', 5], ['a', 't', 2], ['s', 'b', 3], ['b', 't', 4]]);
    const { capacities, predecessors } = widestPath(g, 's');
    expect(capacities.t).toBe(3);
    expect(predecessors.t).toBe('b');
  });
});

// Exemplos do material de aluna (Materiais/Outros: Aulão II e Resumo Prova 2).
describe('material da P2', () => {
  it('Bellman-Ford do aulão II: 0, −3, 1, −4, ∞', () => {
    const g = makeGraph(true, ['A', 'B', 'C', 'D', 'E'], [['A', 'B', 4], ['A', 'C', 1], ['C', 'D', -5], ['D', 'B', 1], ['E', 'B', 7], ['E', 'D', -2]]);
    expect(bellmanFord(g, 'A').distances).toEqual({ A: 0, B: -3, C: 1, D: -4, E: Infinity });
  });

  it('Dijkstra falha no exemplo do aulão II: D fica 0,5 sem contar C → D = −5', () => {
    const g = makeGraph(true, ['A', 'B', 'C', 'D'], [['A', 'B', 4], ['A', 'C', 1], ['A', 'D', 0.5], ['D', 'B', 1], ['C', 'D', -5]]);
    expect(dijkstra(g, 'A').distances.D).toBe(0.5);
    expect(bellmanFord(g, 'A').distances.D).toBe(-4);
  });

  it('Min-Max do resumo (p. 8): menor dos maiores = 7', () => {
    const g = makeGraph(false, ['s', 'a', 'b', 'c', 'd', 'e', 'f', 't'], [
      ['s', 'a', 2], ['a', 'b', 1], ['b', 't', 8],
      ['s', 'c', 6], ['c', 'd', 9], ['d', 't', 3],
      ['s', 'e', 7], ['e', 'f', 4], ['f', 't', 5],
    ]);
    expect(minMaxPath(g, 's').values.t).toBe(7);
    expect(widestPath(g, 's').capacities.t).toBe(4);
  });

  it('níveis de caminho crítico do aulão II', () => {
    const g = makeGraph(true, ['A', 'B', 'C', 'D', 'E', 'F', 'G'], [['A', 'C'], ['B', 'D'], ['B', 'E'], ['C', 'F'], ['D', 'F'], ['D', 'G'], ['E', 'G']]);
    expect(topologicalLevels(g)).toEqual([['A', 'B'], ['C', 'D', 'E'], ['F', 'G']]);
    expect(topologicalLevels(makeGraph(true, ['a', 'b'], [['a', 'b'], ['b', 'a']]))).toBeNull();
  });

  it('Johnson concorda com Floyd-Warshall e deixa os pesos não negativos', () => {
    const r = johnson(p2Q2)!;
    expect(r.reweighted.edges.every((e) => e.weight! >= 0)).toBe(true);
    const fw = floydWarshall(p2Q2);
    fw.ids.forEach((u, i) => fw.ids.forEach((v, j) => expect(r.distances[u][v]).toBe(fw.matrices[7][i][j])));
  });

  it('Johnson para em ciclo negativo', () => {
    const g = makeGraph(true, ['a', 'b', 'c'], [['a', 'b', 1], ['b', 'c', -3], ['c', 'a', 1]]);
    expect(johnson(g)).toBeNull();
  });

  it('matriz de 2021/2-Q3: AGM = 16 e Dijkstra de F = 8, 2, 4, 5, 2, 0', () => {
    const g = makeGraph(false, ['A', 'B', 'C', 'D', 'E', 'F'], [
      ['A', 'B', 6], ['A', 'C', 9], ['A', 'D', 11], ['A', 'E', 15], ['A', 'F', 9], ['B', 'C', 13], ['B', 'D', 3], ['B', 'E', 1], ['B', 'F', 2],
      ['C', 'D', 10], ['C', 'E', 4], ['C', 'F', 4], ['D', 'E', 5], ['D', 'F', 6], ['E', 'F', 2],
    ]);
    expect(kruskal(g).totalWeight).toBe(16);
    expect(prim(g, 'F').totalWeight).toBe(16);
    expect(dijkstra(g, 'F').distances).toEqual({ A: 8, B: 2, C: 4, D: 5, E: 2, F: 0 });
  });
});
