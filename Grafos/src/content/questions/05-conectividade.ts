import type { Question } from '@/content/types';
import { radiusDiameterCenter, stronglyConnectedComponents } from '@/lib/graph';
import { UG_SIX, UG_SIX_LAID_OUT, PROFESSOR_SCC_EXAMPLE } from './graphs';

// Euleriano, Dijkstra e ordenação topológica saíram do banco de questões
// nesta revisão — cronograma 2026/2 confirma que são ensinados depois da P1
// (14/09). Ver docs/p1-scope.md "O que mudou". Os grafos EULER_*/WEIGHTED_GRAPH/
// DAG_SEVEN continuam em ./graphs.ts para reaproveitar quando isso virar P2.

const rdc = radiusDiameterCenter(UG_SIX);
const sccResult = stronglyConnectedComponents(PROFESSOR_SCC_EXAMPLE);

export const conectividadeQuestions: Question[] = [
  {
    id: 'exc-01',
    topic: 'excentricidade-raio-diametro',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'medium',
    sourceStyle: 'generated',
    type: 'NUMBER_INPUT',
    prompt: 'Qual a excentricidade do vértice "d" no grafo abaixo?',
    displayGraphs: { a: UG_SIX_LAID_OUT },
    correctNumber: rdc.eccentricities.d,
    source: { type: 'professor_support_material', file: 'Resumo Prova 1 Grafos.pdf' },
    hints: ['Calcule a distância de d até TODOS os outros vértices via BFS — a excentricidade é a maior delas.'],
    solution: `ε(d) = ${rdc.eccentricities.d} — maior distância de d a qualquer outro vértice.`,
  },
  {
    id: 'exc-02',
    topic: 'excentricidade-raio-diametro',
    difficulty: 'hard',
    duration: 'normal',
    examLikelihood: 'medium',
    sourceStyle: 'old_exam',
    type: 'GRAPH_SELECT_VERTEX',
    prompt: 'Selecione o(s) vértice(s) que formam o CENTRO do grafo abaixo (menor excentricidade).',
    graph: UG_SIX_LAID_OUT,
    multi: true,
    correctVertexIds: rdc.center,
    source: { type: 'old_exam', file: '2023-2-exam.pdf' },
    professorStyleSimilarity: 'high',
    hints: [`Excentricidades: ${JSON.stringify(rdc.eccentricities)}.`, `Raio = ${rdc.radius} (a menor excentricidade).`],
    solution: `Raio=${rdc.radius}, Diâmetro=${rdc.diameter}. Centro = {${rdc.center.join(', ')}} (vértice(s) com excentricidade igual ao raio).`,
  },
  {
    id: 'exc-03',
    topic: 'excentricidade-raio-diametro',
    difficulty: 'medium',
    duration: 'deep',
    examLikelihood: 'medium',
    sourceStyle: 'old_exam',
    type: 'PROOF_OR_JUSTIFICATION',
    prompt: 'Forneça um algoritmo (passo a passo) para calcular o diâmetro de um grafo não-direcionado. Ilustre com um exemplo.',
    rubric: [
      'Executa BFS a partir de CADA vértice do grafo',
      'Para cada BFS, identifica a maior distância obtida (excentricidade daquele vértice)',
      'Toma o máximo entre todas as excentricidades como o diâmetro',
      'Discute a complexidade: O(V·(V+E))',
      'Ilustra com um exemplo concreto passo a passo',
    ],
    source: { type: 'old_exam', file: '2022-1-exam.pdf' },
    professorStyleSimilarity: 'high',
    hints: ['O diâmetro é a MAIOR excentricidade do grafo — como se calcula excentricidade de um único vértice?', 'Vai precisar rodar BFS mais de uma vez.'],
    solution:
      'Para cada vértice v do grafo, rode uma BFS a partir de v e anote a maior distância alcançada (essa é a excentricidade de v). O diâmetro é o máximo dessas excentricidades sobre todos os vértices. Complexidade: O(V) execuções de BFS, cada uma O(V+E), total O(V·(V+E)).',
  },
  {
    id: 'scc-01',
    topic: 'scc-kosaraju',
    difficulty: 'hard',
    duration: 'deep',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    type: 'PROOF_OR_JUSTIFICATION',
    prompt: 'Determine os componentes fortemente conexos do grafo dirigido abaixo (A→B→C, D↔E), justificando com os passos do algoritmo de Kosaraju.',
    displayGraphs: { a: PROFESSOR_SCC_EXAMPLE },
    rubric: [
      'Passo 1: DFS em G, calculando ordem decrescente de tempo de término',
      'Passo 2: transpõe G (inverte todas as arestas)',
      'Passo 3: DFS no transposto, visitando na ordem decrescente de término do passo 1',
      'Identifica corretamente os 4 componentes: {A}, {B}, {C}, {D,E}',
    ],
    source: { type: 'professor_support_material', file: 'Resumo Prova 1 Grafos.pdf' },
    professorStyleSimilarity: 'high',
    hints: ['D e E se alcançam mutuamente (D→E e E→D) — eles formam um SCC juntos.', 'A, B e C só têm arestas em uma direção (A→B→C) — nenhum alcança de volta o anterior.'],
    solution: `Componentes fortemente conexos: ${sccResult.components.map((c) => `{${c.join(',')}}`).join(', ')}. D e E se alcançam mutuamente (ciclo de tamanho 2), formando um único SCC. A, B e C são cadeias de mão única (A→B→C) sem volta — cada um é seu próprio SCC (trivial, de 1 vértice).`,
  },
  {
    id: 'scc-02',
    topic: 'scc-kosaraju',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'generated',
    type: 'TRUE_FALSE',
    prompt: 'Em um grafo fortemente conexo, existe apenas 1 componente fortemente conexo (o grafo inteiro).',
    correctValue: true,
    source: { type: 'professor_support_material' },
    hints: ['"Fortemente conexo" já significa que todo par de vértices se alcança mutuamente.'],
    solution: 'Correto — por definição, se o grafo TODO é fortemente conexo, ele forma um único SCC contendo todos os vértices.',
  },
];
