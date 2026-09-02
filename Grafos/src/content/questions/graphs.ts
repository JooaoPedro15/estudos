import { makeGraph } from '@/lib/graph';
import type { GraphData } from '@/content/types';

// Grafos de referência reutilizados pelo banco de questões. Mantidos em um só
// lugar para permitir variações consistentes (mesma família de exemplos).

/** Grafo não-dirigido simples, 6 vértices, conexo, não-regular. */
export const UG_SIX: GraphData = makeGraph(
  false,
  ['a', 'b', 'c', 'd', 'e', 'f'],
  [
    ['a', 'b'],
    ['a', 'c'],
    ['b', 'c'],
    ['b', 'd'],
    ['c', 'd'],
    ['d', 'e'],
    ['e', 'f'],
  ],
);

/** Mesmo grafo de UG_SIX, com layout fixo (para questões de leitura de desenho). */
export const UG_SIX_LAID_OUT: GraphData = {
  ...UG_SIX,
  vertices: [
    { id: 'a', label: 'a', x: 80, y: 80 },
    { id: 'b', label: 'b', x: 220, y: 60 },
    { id: 'c', label: 'c', x: 200, y: 200 },
    { id: 'd', label: 'd', x: 340, y: 180 },
    { id: 'e', label: 'e', x: 420, y: 60 },
    { id: 'f', label: 'f', x: 500, y: 160 },
  ],
};

/** Grafo isomorfo a UG_SIX_ISO_A por rotulação diferente — usado no exercício de mapeamento. */
export const UG_SIX_ISO_A: GraphData = makeGraph(
  false,
  ['1', '2', '3', '4'],
  [
    ['1', '2'],
    ['2', '3'],
    ['3', '4'],
    ['4', '1'],
  ],
);
export const UG_SIX_ISO_B: GraphData = makeGraph(
  false,
  ['w', 'x', 'y', 'z'],
  [
    ['w', 'x'],
    ['x', 'y'],
    ['y', 'z'],
    ['z', 'w'],
  ],
);

/**
 * Par NÃO isomorfo clássico: mesmo |V|=6, |E|=7, mesma sequência de graus
 * [3,3,2,2,2,2] — satisfaz TODAS as condições necessárias — mas A tem 2
 * triângulos e B não tem nenhum (invariante de isomorfismo que os distingue).
 */
export const NON_ISO_A: GraphData = makeGraph(
  false,
  ['a', 'b', 'c', 'd', 'e', 'f'],
  [
    ['a', 'b'],
    ['b', 'c'],
    ['c', 'a'],
    ['d', 'e'],
    ['e', 'f'],
    ['f', 'd'],
    ['c', 'd'],
  ],
);
export const NON_ISO_B: GraphData = makeGraph(
  false,
  ['p', 'q', 'r', 's', 't', 'u'],
  [
    ['p', 'q'],
    ['q', 'r'],
    ['r', 's'],
    ['s', 't'],
    ['t', 'u'],
    ['u', 'p'],
    ['p', 's'],
  ],
);

/** Exemplo do próprio professor (aulão/Resumo) para Kosaraju: A→B→C, D↔E. */
export const PROFESSOR_SCC_EXAMPLE: GraphData = makeGraph(
  true,
  ['A', 'B', 'C', 'D', 'E'],
  [
    ['A', 'B'],
    ['B', 'C'],
    ['D', 'E'],
    ['E', 'D'],
  ],
);

/** Grafo dirigido com ciclo, usado para detecção de ciclo / classificação de arestas / base-antibase. */
export const DG_CYCLE: GraphData = makeGraph(
  true,
  ['a', 'b', 'c', 'd', 'e'],
  [
    ['a', 'b'],
    ['b', 'c'],
    ['c', 'a'],
    ['c', 'd'],
    ['d', 'e'],
  ],
);

/** DAG (sem ciclo) para ordenação topológica / maior caminho / fecho transitivo. */
export const DAG_SEVEN: GraphData = makeGraph(
  true,
  ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  [
    ['a', 'b'],
    ['a', 'c'],
    ['b', 'd'],
    ['c', 'd'],
    ['d', 'e'],
    ['c', 'f'],
    ['f', 'g'],
    ['e', 'g'],
  ],
);

/** Grafo "gravata" (duas triangulações compartilhando um vértice) — todos os graus pares, tem circuito euleriano. */
export const EULER_CIRCUIT_GRAPH: GraphData = makeGraph(
  false,
  ['a', 'b', 'c', 'd', 'e'],
  [
    ['a', 'b'],
    ['b', 'c'],
    ['c', 'a'],
    ['c', 'd'],
    ['d', 'e'],
    ['e', 'c'],
  ],
);

/** Mesmo grafo "gravata" + uma aresta pendente em 'a' — exatamente 2 vértices de grau ímpar (a, f), tem caminho euleriano. */
export const EULER_PATH_GRAPH: GraphData = makeGraph(
  false,
  ['a', 'b', 'c', 'd', 'e', 'f'],
  [
    ['a', 'b'],
    ['b', 'c'],
    ['c', 'a'],
    ['c', 'd'],
    ['d', 'e'],
    ['e', 'c'],
    ['a', 'f'],
  ],
);

/** Grafo sem trilha euleriana (4 vértices de grau ímpar). */
export const EULER_NONE_GRAPH: GraphData = makeGraph(
  false,
  ['a', 'b', 'c', 'd', 'e'],
  [
    ['a', 'b'],
    ['a', 'c'],
    ['a', 'd'],
    ['b', 'c'],
    ['b', 'e'],
  ],
);

/** Grafo não-dirigido ponderado para Dijkstra. */
export const WEIGHTED_GRAPH: GraphData = makeGraph(
  false,
  ['s', 'a', 'b', 'c', 't'],
  [
    ['s', 'a', 2],
    ['s', 'b', 5],
    ['a', 'b', 1],
    ['a', 'c', 6],
    ['b', 't', 3],
    ['c', 't', 1],
  ],
);
