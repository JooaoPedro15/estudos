import type { GraphData } from '@/content/types';

// Grafos da P2 usados por lições e questões. Os que se chamam SLIDE_* são os
// desenhos dos slides do professor (posições aproximadas do desenho, canvas
// 560 × 320); P2_2024_* são da prova de 2024/1; FW_EXAMPLE é exemplo criado
// para explicar o Floyd-Warshall (que não tem slide).

/** Grafo com posições fixas. */
export function placed(coords: Record<string, [number, number]>, edges: Array<[string, string] | [string, string, number]>, directed = false): GraphData {
  return {
    directed,
    vertices: Object.entries(coords).map(([id, [x, y]]) => ({ id, label: id, x, y })),
    edges: edges.map(([source, target, weight], i) => ({ id: `e${i}`, source, target, weight })),
  };
}

/** "Example of Dijkstra's Algorithm" — 10-graphs-shortest-path.pdf, quadro 16 de 26. */
export const SLIDE_DIJKSTRA = placed(
  { a: [70, 165], b: [225, 105], c: [225, 225], d: [380, 40], e: [380, 165], f: [380, 290] },
  [['a', 'b', 1], ['a', 'e', 4], ['a', 'c', 1], ['b', 'd', 3], ['b', 'e', 1], ['c', 'e', 2], ['c', 'f', 3], ['e', 'd', 1], ['e', 'f', 2]],
  true,
);

/** "Eulerian graph" — 08-graphs-traversing.pdf, quadro 24 (caminho e-a-d-c-e-b-f-d). */
export const SLIDE_EULER = placed(
  { a: [110, 70], b: [360, 70], c: [110, 250], d: [235, 160], e: [235, 40], f: [450, 200] },
  [['e', 'a'], ['a', 'd'], ['d', 'c'], ['c', 'e'], ['e', 'b'], ['b', 'f'], ['f', 'd']],
);

/** Fleury — 08-graphs-traversing.pdf, quadro 33 (grafo desenhado abaixo do algoritmo). */
export const SLIDE_FLEURY = placed(
  { b: [150, 50], f: [300, 80], e: [230, 140], d: [400, 170], a: [140, 230], c: [270, 290] },
  [['b', 'f'], ['b', 'e'], ['e', 'f'], ['f', 'd'], ['d', 'a'], ['a', 'c'], ['c', 'd']],
);

/** "Example of Prim's / Kruskal's Algorithm" — 11-graphs-trees-spanning-trees.pdf, quadros 16-17. */
export const SLIDE_MST = placed(
  { a: [70, 40], b: [274, 130], c: [478, 130], d: [70, 200], e: [370, 210], f: [274, 296], g: [478, 296] },
  [['a', 'b', 7], ['a', 'd', 5], ['b', 'c', 8], ['b', 'd', 9], ['b', 'e', 7], ['c', 'e', 5], ['d', 'e', 15], ['d', 'f', 6], ['e', 'f', 8], ['e', 'g', 9], ['f', 'g', 11]],
);

/** Grafo dos quadros 7 e 11 (construção da árvore geradora; posto e nulidade). */
export const SLIDE_SPANNING = placed(
  { f: [70, 90], b: [190, 50], c: [320, 50], g: [400, 120], a: [210, 160], e: [70, 250], d: [340, 260], h: [480, 260] },
  [['f', 'a'], ['f', 'e'], ['e', 'a'], ['b', 'a'], ['c', 'a'], ['a', 'g'], ['c', 'g'], ['g', 'd'], ['d', 'h']],
);

/** P2 2024/1, Q1: custos de construção (milhões) entre 4 cidades. */
export const P2_2024_Q1 = placed(
  { C1: [120, 70], C2: [440, 70], C3: [120, 260], C4: [440, 260] },
  [['C1', 'C2', 30], ['C1', 'C3', 20], ['C1', 'C4', 50], ['C2', 'C3', 50], ['C2', 'C4', 10], ['C3', 'C4', 75]],
);

/** "Illustration: the map Lx" — 10-graphs-shortest-path.pdf, quadro 8. */
export const SLIDE_LX = placed(
  { x0: [60, 100], x1: [190, 100], x4: [330, 100], x6: [480, 100], x2: [120, 250], x3: [260, 250], x5: [400, 250] },
  [['x0', 'x1', 3], ['x1', 'x4', 2], ['x4', 'x6', 4], ['x2', 'x1', 2], ['x1', 'x3', 5], ['x4', 'x3', 2], ['x4', 'x5', 1], ['x2', 'x3', 3], ['x5', 'x3', 1], ['x5', 'x6', 2]],
  true,
);

/** "Shortest path — an example" — quadro 26 (calcular a partir de e). */
export const SLIDE_FINAL = placed(
  { e: [60, 110], f: [210, 40], c: [480, 40], g: [190, 160], h: [350, 150], a: [60, 290], b: [270, 250], d: [480, 290] },
  [['e', 'f', 5], ['e', 'g', 8], ['e', 'a', 9], ['f', 'c', 15], ['f', 'g', 4], ['f', 'h', 12], ['g', 'h', 7], ['g', 'b', 6], ['a', 'g', 5], ['a', 'b', 4], ['a', 'd', 20], ['b', 'h', 1], ['b', 'd', 13], ['h', 'c', 3], ['h', 'd', 11], ['c', 'd', 9]],
  true,
);

/** Quadro 22: "Dijkstra — Can fail if negative edge costs". */
export const SLIDE_NEG = placed({ a: [80, 160], b: [280, 60], d: [480, 160], c: [280, 260] }, [['a', 'b', 2], ['a', 'c', 1], ['b', 'd', 3], ['d', 'c', -6]], true);

/** Quadro 22: "Re-weighting — Adding a constant to every edge weight can fail" (pesos antes de somar 3). */
export const SLIDE_REWEIGHT = placed({ a: [70, 160], b: [270, 60], d: [480, 160], c: [200, 270], e: [370, 270] }, [['a', 'b', 2], ['b', 'd', 2], ['a', 'c', 3], ['c', 'e', -3], ['e', 'd', 3]], true);

/** Quadro 23: ciclo negativo b → d → c → b. */
export const SLIDE_NEG_CYCLE = placed({ a: [80, 160], b: [280, 60], d: [480, 160], c: [280, 260] }, [['a', 'b', 2], ['a', 'c', 1], ['b', 'd', 3], ['c', 'b', -5], ['d', 'c', -6]], true);

/** P2 2024/1, Q2: matriz D com pesos negativos, origem no vértice 1. */
export const P2_2024_Q2 = placed(
  { '1': [60, 160], '2': [210, 50], '3': [210, 160], '4': [210, 280], '5': [360, 90], '6': [360, 260], '7': [500, 170] },
  [['1', '2', 6], ['1', '3', 5], ['1', '4', 5], ['2', '5', -1], ['3', '2', -2], ['3', '5', 1], ['4', '3', -2], ['4', '6', -1], ['5', '7', 3], ['6', '7', 3]],
  true,
);

/** Exemplo criado para explicação do Floyd-Warshall (livro): 4 vértices, com uma aresta negativa. */
export const FW_EXAMPLE = placed({ '1': [100, 80], '2': [460, 80], '3': [460, 260], '4': [100, 260] }, [['1', '2', 3], ['2', '3', 2], ['1', '4', 7], ['4', '3', -2], ['3', '1', 4], ['2', '4', 1]], true);

/** "Line graph" — 13-graphs-planarity.pdf, quadro 34. Arestas na ordem dos rótulos 1 a 6 do slide. */
export const SLIDE_LINE_G = placed(
  { d: [150, 50], c: [330, 50], e: [60, 170], b: [440, 170], f: [150, 280], a: [330, 280] },
  [['e', 'a'], ['c', 'a'], ['d', 'e'], ['d', 'f'], ['c', 'b'], ['d', 'c']],
);

/** Contraexemplo de 2026/1-Q1.3: K4 menos uma aresta (semi-euleriano; L(G) tem 4 vértices ímpares). */
export const K4_MENOS_E = placed({ x: [150, 160], y: [410, 160], u: [280, 50], v: [280, 280] }, [['x', 'y'], ['x', 'u'], ['x', 'v'], ['y', 'u'], ['y', 'v']]);

/** K4 da lista, Exercício 20. */
export const K4 = placed({ '1': [120, 60], '2': [440, 60], '3': [440, 270], '4': [120, 270] }, [['1', '2'], ['1', '3'], ['1', '4'], ['2', '3'], ['2', '4'], ['3', '4']]);

/** Min-Max do Resumo Prova 2, p. 8: três caminhos de s a t (cima 2-1-8, meio 6-9-3, baixo 7-4-5). */
export const RESUMO_MINMAX = placed(
  { s: [50, 160], a: [190, 50], b: [350, 50], c: [190, 160], d: [350, 160], e: [190, 275], f: [350, 275], t: [500, 160] },
  [['s', 'a', 2], ['a', 'b', 1], ['b', 't', 8], ['s', 'c', 6], ['c', 'd', 9], ['d', 't', 3], ['s', 'e', 7], ['e', 'f', 4], ['f', 't', 5]],
);

/** Caminho crítico do aulão II, p. 4. */
export const AULAO_CRITICO = placed(
  { A: [90, 70], B: [90, 250], C: [280, 40], D: [280, 160], E: [280, 280], F: [470, 90], G: [470, 240] },
  [['A', 'C'], ['B', 'D'], ['B', 'E'], ['C', 'F'], ['D', 'F'], ['D', 'G'], ['E', 'G']],
  true,
);

/** Bellman-Ford do aulão II, p. 3. */
export const AULAO_BF = placed(
  { A: [90, 60], B: [430, 60], C: [90, 270], D: [300, 270], E: [490, 270] },
  [['A', 'B', 4], ['A', 'C', 1], ['C', 'D', -5], ['D', 'B', 1], ['E', 'B', 7], ['E', 'D', -2]],
  true,
);

/** Exemplo criado: fracamente e semi-fortemente conexo, sem ser fortemente conexo. */
export const PASSEIO_CONEXO = placed(
  { a: [70, 160], b: [190, 60], c: [320, 60], d: [320, 260], e: [490, 160] },
  [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'e']],
  true,
);

/** Matriz de 2021/2-Q3 e da prova sem data da p. 7. */
export const SILVIO_MATRIZ = placed(
  { A: [60, 150], B: [210, 50], C: [390, 50], D: [120, 280], E: [290, 180], F: [480, 200] },
  [['A', 'B', 6], ['A', 'C', 9], ['A', 'D', 11], ['A', 'E', 15], ['A', 'F', 9], ['B', 'C', 13], ['B', 'D', 3], ['B', 'E', 1], ['B', 'F', 2], ['C', 'D', 10], ['C', 'E', 4], ['C', 'F', 4], ['D', 'E', 5], ['D', 'F', 6], ['E', 'F', 2]],
);
