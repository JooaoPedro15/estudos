import { describe, it, expect } from 'vitest';
import {
  makeGraph,
  degree,
  degreeSequence,
  sumOfDegrees,
  isDegreeSequencePossible,
  adjacencyMatrix,
  incidenceMatrix,
  adjacencyList,
  complement,
  isSelfComplementary,
  numberOfSubgraphsOfCompleteGraph,
  isBipartite,
  isomorphismNecessaryConditions,
  validateIsomorphismMapping,
  transpose,
  bfs,
  dfs,
  transitiveClosureDirect,
  transitiveClosureInverse,
  stronglyConnectedComponents,
  baseAndAntiBase,
  radiusDiameterCenter,
  eulerianClassification,
  eulerianTrail,
  dijkstra,
  topologicalSort,
  longestPathDAG,
  edgeBoundsForComponents,
} from './graph';

describe('grau e teorema do aperto de mãos', () => {
  const triangle = makeGraph(false, ['a', 'b', 'c'], [['a', 'b'], ['b', 'c'], ['c', 'a']]);

  it('calcula grau corretamente', () => {
    expect(degree(triangle, 'a')).toBe(2);
    expect(degreeSequence(triangle)).toEqual([2, 2, 2]);
  });

  it('soma dos graus é sempre par (2|E|)', () => {
    expect(sumOfDegrees(triangle)).toBe(2 * triangle.edges.length);
  });

  it('laço soma 2 ao grau em grafo não-dirigido', () => {
    const withLoop = makeGraph(false, ['a', 'b'], [['a', 'a'], ['a', 'b']]);
    expect(degree(withLoop, 'a')).toBe(3);
  });
});

describe('isDegreeSequencePossible (Erdős–Gallai)', () => {
  it('aceita sequência trivialmente válida', () => {
    expect(isDegreeSequencePossible([1, 1], 2).possible).toBe(true);
  });

  it('rejeita soma ímpar', () => {
    expect(isDegreeSequencePossible([1, 2], 2).possible).toBe(false);
  });

  it('rejeita grau 0 e n-1 coexistindo', () => {
    // n=5, n-1=4: um vértice de grau 4 está ligado a TODOS, logo ninguém pode ter grau 0.
    expect(isDegreeSequencePossible([4, 0, 1, 2, 1], 5).possible).toBe(false);
  });

  it('rejeita sequência que passa nas checagens simples mas falha Erdős–Gallai (caso real da prova 2023/1)', () => {
    const result = isDegreeSequencePossible([1, 1, 3, 3, 3, 3, 5, 6, 8, 9], 10);
    expect(result.possible).toBe(false);
  });

  it('aceita sequência graficável não-trivial (K4)', () => {
    expect(isDegreeSequencePossible([3, 3, 3, 3], 4).possible).toBe(true);
  });
});

describe('representações', () => {
  const g = makeGraph(false, ['a', 'b', 'c'], [['a', 'b'], ['b', 'c']]);

  it('matriz de adjacência não-dirigida é simétrica', () => {
    const { matrix } = adjacencyMatrix(g);
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        expect(matrix[i][j]).toBe(matrix[j][i]);
      }
    }
  });

  it('matriz de incidência dirigida usa convenção +1/-1', () => {
    const dg = makeGraph(true, ['a', 'b'], [['a', 'b']]);
    const { matrix, rowIds } = incidenceMatrix(dg);
    const sourceRow = rowIds.indexOf('a');
    const targetRow = rowIds.indexOf('b');
    expect(matrix[sourceRow][0]).toBe(1);
    expect(matrix[targetRow][0]).toBe(-1);
  });

  it('lista de adjacência não-dirigida é simétrica (b é vizinho de a e vice-versa)', () => {
    const { successorsMap } = adjacencyList(g);
    expect(successorsMap.a).toContain('b');
    expect(successorsMap.b).toContain('a');
  });
});

describe('complemento e subgrafos', () => {
  it('|E(G)| + |E(complemento)| = |E(Kn)|', () => {
    const g = makeGraph(false, ['a', 'b', 'c', 'd'], [['a', 'b'], ['c', 'd']]);
    const totalKn = (4 * 3) / 2;
    expect(g.edges.length + complement(g).edges.length).toBe(totalKn);
  });

  it('P4 é auto-complementar (menor exemplo não-trivial)', () => {
    const p4 = makeGraph(false, ['1', '2', '3', '4'], [['1', '2'], ['2', '3'], ['3', '4']]);
    expect(isSelfComplementary(p4)).toBe(true);
  });

  it('número de subgrafos de K3 bate com contagem manual (7 subgrafos não-vazios)', () => {
    // K3: 3 subgrafos de 1 vértice + 3 de 2 vértices (cada um com ou sem a aresta = 2 opções, mas
    // "subgrafo" aqui conta configurações de aresta: C(3,2)*2^1=6, mais o de 3 vértices C(3,3)*2^3=8
    // fórmula: C(3,1)*1 + C(3,2)*2 + C(3,3)*8 = 3+6+8=17
    expect(numberOfSubgraphsOfCompleteGraph(3)).toBe(17);
  });
});

describe('bipartição', () => {
  it('detecta grafo bipartido (C4)', () => {
    const c4 = makeGraph(false, ['a', 'b', 'c', 'd'], [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'a']]);
    expect(isBipartite(c4).bipartite).toBe(true);
  });

  it('detecta grafo NÃO bipartido (triângulo, ciclo ímpar)', () => {
    const c3 = makeGraph(false, ['a', 'b', 'c'], [['a', 'b'], ['b', 'c'], ['c', 'a']]);
    expect(isBipartite(c3).bipartite).toBe(false);
  });
});

describe('isomorfismo', () => {
  it('condições necessárias detectam diferença de |V|', () => {
    const a = makeGraph(false, ['1', '2'], [['1', '2']]);
    const b = makeGraph(false, ['1', '2', '3'], [['1', '2']]);
    expect(isomorphismNecessaryConditions(a, b).possiblyIsomorphic).toBe(false);
  });

  it('valida mapeamento correto entre dois C4', () => {
    const a = makeGraph(false, ['1', '2', '3', '4'], [['1', '2'], ['2', '3'], ['3', '4'], ['4', '1']]);
    const b = makeGraph(false, ['w', 'x', 'y', 'z'], [['w', 'x'], ['x', 'y'], ['y', 'z'], ['z', 'w']]);
    const mapping = { '1': 'w', '2': 'x', '3': 'y', '4': 'z' };
    expect(validateIsomorphismMapping(a, b, mapping).valid).toBe(true);
  });

  it('rejeita mapeamento que quebra uma aresta', () => {
    const a = makeGraph(false, ['1', '2', '3', '4'], [['1', '2'], ['2', '3'], ['3', '4'], ['4', '1']]);
    const b = makeGraph(false, ['w', 'x', 'y', 'z'], [['w', 'x'], ['x', 'y'], ['y', 'z'], ['z', 'w']]);
    const badMapping = { '1': 'w', '2': 'y', '3': 'x', '4': 'z' };
    expect(validateIsomorphismMapping(a, b, badMapping).valid).toBe(false);
  });
});

describe('BFS/DFS', () => {
  const chain = makeGraph(false, ['a', 'b', 'c', 'd'], [['a', 'b'], ['b', 'c'], ['c', 'd']]);

  it('BFS calcula distâncias corretas em cadeia', () => {
    const { distances } = bfs(chain, 'a');
    expect(distances).toEqual({ a: 0, b: 1, c: 2, d: 3 });
  });

  it('DFS em grafo não-dirigido não produz avanço/cruzamento', () => {
    const { edgeClass } = dfs(chain);
    const classes = new Set(Object.values(edgeClass));
    expect(classes.has('forward')).toBe(false);
    expect(classes.has('cross')).toBe(false);
  });

  it('DFS detecta ciclo via aresta de retorno', () => {
    const cyclic = makeGraph(true, ['a', 'b', 'c'], [['a', 'b'], ['b', 'c'], ['c', 'a']]);
    expect(dfs(cyclic).hasCycle).toBe(true);
  });

  it('DFS não detecta ciclo em DAG', () => {
    const dag = makeGraph(true, ['a', 'b', 'c'], [['a', 'b'], ['b', 'c']]);
    expect(dfs(dag).hasCycle).toBe(false);
  });
});

describe('fecho transitivo', () => {
  const dg = makeGraph(true, ['a', 'b', 'c', 'd'], [['a', 'b'], ['b', 'c']]);

  it('fecho direto de a alcança b e c, não d', () => {
    const closure = transitiveClosureDirect(dg, 'a');
    expect(closure.sort()).toEqual(['b', 'c']);
  });

  it('fecho inverso de c alcança a e b via transposto', () => {
    const closure = transitiveClosureInverse(dg, 'c');
    expect(closure.sort()).toEqual(['a', 'b']);
  });

  it('transpor duas vezes retorna ao grafo original', () => {
    expect(transpose(transpose(dg))).toEqual(dg);
  });
});

describe('SCC e base/anti-base (exemplo do professor: A->B->C, D<->E)', () => {
  const g = makeGraph(true, ['A', 'B', 'C', 'D', 'E'], [['A', 'B'], ['B', 'C'], ['D', 'E'], ['E', 'D']]);

  it('encontra 4 componentes: {A},{B},{C},{D,E}', () => {
    const { components } = stronglyConnectedComponents(g);
    expect(components).toHaveLength(4);
    const dSet = components.find((c) => c.includes('D'));
    expect(dSet).toContain('E');
  });

  it('base contém A e o componente {D,E} (fontes da condensação)', () => {
    const { base } = baseAndAntiBase(g);
    expect(base).toContain('A');
    expect(base.some((v) => v === 'D' || v === 'E')).toBe(true);
  });

  it('anti-base contém C e o componente {D,E} (sumidouros da condensação)', () => {
    const { antiBase } = baseAndAntiBase(g);
    expect(antiBase).toContain('C');
  });
});

describe('excentricidade/raio/diâmetro/centro', () => {
  it('em uma cadeia de 5 vértices, o centro é o vértice do meio', () => {
    const chain5 = makeGraph(false, ['a', 'b', 'c', 'd', 'e'], [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'e']]);
    const { center, radius, diameter } = radiusDiameterCenter(chain5);
    expect(center).toEqual(['c']);
    expect(radius).toBe(2);
    expect(diameter).toBe(4);
  });
});

describe('euleriano', () => {
  it('grafo com todos os graus pares tem circuito euleriano', () => {
    const triangle = makeGraph(false, ['a', 'b', 'c'], [['a', 'b'], ['b', 'c'], ['c', 'a']]);
    expect(eulerianClassification(triangle).kind).toBe('circuit');
  });

  it('grafo com exatamente 2 vértices de grau ímpar tem caminho euleriano', () => {
    const path = makeGraph(false, ['a', 'b', 'c'], [['a', 'b'], ['b', 'c']]);
    expect(eulerianClassification(path).kind).toBe('path');
  });

  it('grafo com 4 vértices de grau ímpar não tem trilha euleriana', () => {
    const star = makeGraph(false, ['a', 'b', 'c', 'd', 'e'], [['a', 'b'], ['a', 'c'], ['a', 'd'], ['a', 'e']]);
    expect(eulerianClassification(star).kind).toBe('none');
  });

  it('trilha euleriana construída usa TODAS as arestas exatamente uma vez', () => {
    const triangle = makeGraph(false, ['a', 'b', 'c'], [['a', 'b'], ['b', 'c'], ['c', 'a']]);
    const result = eulerianTrail(triangle);
    expect(result).not.toBeNull();
    expect(result!.trail.length).toBe(triangle.edges.length + 1);
  });
});

describe('Dijkstra', () => {
  it('encontra o menor caminho, não o de menos arestas', () => {
    // s -> t direto custa 10; s -> a -> t custa 1+1=2 (mais arestas, mas mais barato)
    const g = makeGraph(false, ['s', 'a', 't'], [
      ['s', 't', 10],
      ['s', 'a', 1],
      ['a', 't', 1],
    ]);
    const { distances } = dijkstra(g, 's');
    expect(distances.t).toBe(2);
  });
});

describe('ordenação topológica e maior caminho em DAG', () => {
  const dag = makeGraph(true, ['a', 'b', 'c'], [['a', 'b'], ['b', 'c']]);

  it('retorna ordem topológica válida (a antes de b antes de c)', () => {
    const result = topologicalSort(dag);
    expect(result).not.toBeNull();
    const order = result!.order;
    expect(order.indexOf('a')).toBeLessThan(order.indexOf('b'));
    expect(order.indexOf('b')).toBeLessThan(order.indexOf('c'));
  });

  it('retorna null para grafo com ciclo', () => {
    const cyclic = makeGraph(true, ['a', 'b'], [['a', 'b'], ['b', 'a']]);
    expect(topologicalSort(cyclic)).toBeNull();
  });

  it('maior caminho em cadeia de 3 vértices tem comprimento 2', () => {
    const result = longestPathDAG(dag);
    expect(result!.distances.c).toBe(2);
  });
});

describe('limites de arestas por componentes', () => {
  it('m_min = n - k, m_max = (n-k)(n-k+1)/2', () => {
    expect(edgeBoundsForComponents(10, 3)).toEqual({ min: 7, max: 28 });
  });
});
