import type { GraphData } from '../types';
import type { GraphConcept, LessonCatalog } from './types';
import { AMBER, GREEN, RED } from './builders';
import { concept, step } from './p2';
import { degree, eulerianClassification, lineGraph } from '../../lib/graph';
import { K4, K4_MENOS_E, SLIDE_LINE_G, placed } from '../questions/graphs-p2';

/** L(G) com posições fixas; o rótulo de cada vértice é dado por `labels`. */
function lineWithCoords(g: GraphData, coords: [number, number][], labels?: string[]): GraphData {
  const l = lineGraph(g);
  return { ...l, vertices: l.vertices.map((v, i) => ({ ...v, label: labels?.[i] ?? v.label, x: coords[i][0], y: coords[i][1] })) };
}

// Mesmas posições do desenho do slide: 6 no topo, 3 e 4 à esquerda, 5 e 2 à direita, 1 embaixo.
const L_SLIDE = lineWithCoords(SLIDE_LINE_G, [[260, 285], [400, 190], [130, 130], [205, 190], [440, 120], [290, 50]], ['1', '2', '3', '4', '5', '6']);
const L_K4 = lineWithCoords(K4, [[280, 40], [120, 110], [120, 230], [440, 110], [440, 230], [280, 295]]);
const L_MENOS_E = lineWithCoords(K4_MENOS_E, [[280, 160], [120, 60], [120, 270], [440, 60], [440, 270]]);
const C4 = placed({ a: [130, 60], b: [430, 60], c: [430, 270], d: [130, 270] }, [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'a']]);
const L_C4 = lineWithCoords(C4, [[280, 50], [450, 165], [280, 280], [110, 165]]);

const notesOf = (g: GraphData) => Object.fromEntries(g.vertices.map((v) => [v.id, `grau ${degree(g, v.id)}`]));
const oddIds = (g: GraphData) => eulerianClassification(g).oddVertices;
const triangleEdges = (g: GraphData, ids: string[]) => g.edges.filter((e) => ids.includes(e.source) && ids.includes(e.target)).map((e) => e.id);

const linha: GraphConcept[] = [
  concept(
    'linha-definicao',
    'Cada aresta vira um vértice',
    'Troque o ponto de vista: as arestas de G passam a ser os pontos de L(G). Duas delas ficam ligadas em L(G) quando se encontram em G. No exemplo do slide, as arestas têm números de 1 a 6.',
    [0],
    [
      step(SLIDE_LINE_G, 'G do slide 13 (quadro 34). As arestas são: 1 = e–a, 2 = c–a, 3 = d–e, 4 = d–f, 5 = c–b, 6 = d–c.', { edgeLabels: { e0: '1', e1: '2', e2: '3', e3: '4', e4: '5', e5: '6' } }),
      step(SLIDE_LINE_G, 'As arestas 3, 4 e 6 se encontram em d: em L(G), os vértices 3, 4 e 6 ficam todos ligados entre si.', { highlightVertexIds: ['d'], highlightEdgeIds: ['e2', 'e3', 'e5'], edgeColorMap: { e2: AMBER, e3: AMBER, e5: AMBER }, edgeLabels: { e2: '3', e3: '4', e5: '6' } }),
      step(L_SLIDE, 'L(G): 6 vértices, um por aresta de G. 3, 4 e 6 formam o triângulo que veio de d.', { highlightVertexIds: ['e2', 'e3', 'e5'], edgeColorMap: Object.fromEntries(triangleEdges(L_SLIDE, ['e2', 'e3', 'e5']).map((id) => [id, AMBER])) }),
      step(L_SLIDE, 'L(G) completo, igual ao desenho do slide. A aresta 1 (e–a) só encosta em 3 (por e) e em 2 (por a).', { highlightVertexIds: ['e0'], vertexNotes: notesOf(L_SLIDE) }),
    ],
    'O exemplo do slide 13',
  ),
  concept(
    'linha-contagem',
    'Dá para contar sem desenhar',
    'A aresta uv encosta nas outras d(u) − 1 arestas de u e nas outras d(v) − 1 de v. Esse é o grau dela em L(G). E cada vértice v de G com d(v) arestas gera um par para cada duas delas. Isso é consequência da definição; o slide não escreve a fórmula. Exemplo: o K4 da lista.',
    [1],
    [
      step(K4, 'K4: 4 vértices de grau 3 e 6 arestas. L(K4) terá 6 vértices.', { vertexNotes: notesOf(K4), formula: '|V(L)| = |E(G)| = 6' }),
      step(K4, 'Grau de cada aresta em L(G): 3 + 3 − 2 = 4. Pares por vértice: C(3, 2) = 3, vezes 4 vértices.', { highlightEdgeIds: ['e0'], edgeColorMap: { e0: AMBER }, formula: 'grau = d(u) + d(v) − 2  ·  |E(L)| = Σ C(d(v), 2) = 4 · 3 = 12' }),
      step(L_K4, `L(K4): 6 vértices, todos de grau 4, ${L_K4.edges.length} arestas. Exercício 20 da lista.`, { vertexNotes: notesOf(L_K4), formula: `|V| = 6  ·  |E| = ${L_K4.edges.length}` }),
    ],
    'L(K4), Exercício 20 da lista',
  ),
  concept(
    'linha-euler-hamilton',
    'O que passa de G para L(G)',
    'É a questão de 45% da prova 2026/1. Como o grau em L(G) é d(u) + d(v) − 2, a paridade dos graus de G decide. Se todos são pares, tudo continua par. Mas com dois ímpares em G, cada aresta que toca só um deles fica ímpar em L(G), e podem ser mais de dois. A justificativa é raciocínio sobre a prova, não resposta oficial.',
    [2],
    [
      step(C4, 'G euleriano (exemplo criado): todos os graus pares. Circuito a–b–c–d–a.', { vertexNotes: notesOf(C4), sequence: ['a', 'b', 'c', 'd', 'a'], highlightEdgeIds: C4.edges.map((e) => e.id), edgeColorMap: Object.fromEntries(C4.edges.map((e) => [e.id, GREEN])) }),
      step(L_C4, 'L(G): d(u) + d(v) − 2 = par + par − 2 = par. Conexo e com todos os graus pares: L(G) é euleriano.', { vertexNotes: notesOf(L_C4), formula: 'G euleriano ⇒ L(G) euleriano: V' }),
      step(L_C4, 'O circuito usa cada aresta uma vez, e arestas seguidas são adjacentes. Em L(G), isso é um ciclo que passa por todos os vértices uma vez: hamiltoniano.', { sequence: [...L_C4.vertices.map((v) => v.label), L_C4.vertices[0].label], highlightEdgeIds: L_C4.edges.map((e) => e.id), edgeColorMap: Object.fromEntries(L_C4.edges.map((e) => [e.id, GREEN])), formula: 'G euleriano ⇒ L(G) hamiltoniano: V' }),
      step(K4_MENOS_E, 'K4 menos uma aresta: x e y têm grau 3, u e v têm grau 2. Dois ímpares: G é semi-euleriano.', { vertexNotes: notesOf(K4_MENOS_E), vertexColorMap: { x: AMBER, y: AMBER } }),
      step(L_MENOS_E, `Em L(G): ${oddIds(L_MENOS_E).length} vértices de grau ímpar. Mais de 2: L(G) NÃO é semi-euleriano. Basta esse contraexemplo.`, { vertexNotes: notesOf(L_MENOS_E), vertexColorMap: Object.fromEntries(oddIds(L_MENOS_E).map((v) => [v, RED])), formula: 'G semi-euleriano ⇒ L(G) semi-euleriano: F' }),
    ],
    'As três assertivas de 2026/1-Q1',
  ),
  concept(
    'linha-coloracao',
    'Colorir arestas é colorir L(G)',
    'O slide termina dizendo χ′(G) = χ(L(G)). Duas arestas adjacentes não podem ter a mesma cor; em L(G), elas são vértices adjacentes. As duas colorações são o mesmo problema.',
    [3],
    [
      step(SLIDE_LINE_G, 'Arestas 3, 4 e 6 se encontram em d: precisam de 3 cores diferentes.', { highlightEdgeIds: ['e2', 'e3', 'e5'], edgeColorMap: { e2: AMBER, e3: GREEN, e5: RED } }),
      step(L_SLIDE, 'Em L(G), 3, 4 e 6 são vértices mutuamente adjacentes: o mesmo triângulo exige as mesmas 3 cores.', { vertexColorMap: { e2: AMBER, e3: GREEN, e5: RED }, formula: 'χ′(G) = χ(L(G))' }),
    ],
    'Quadro 34',
  ),
];

export const p2LinhaLessons: LessonCatalog = { 'grafo-de-linha': linha };
