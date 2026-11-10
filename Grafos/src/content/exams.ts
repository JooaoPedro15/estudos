import type { Exam } from './types';
import { provasReais } from './questions/09-provas-reais';
import { provaRealP2 } from './questions/10-p2';
import { provasSilvioP2 } from './questions/12-p2-provas-silvio';

// Estrutura, contagem de questões e distribuição de peso baseadas no padrão
// real das 8 provas do Prof. Silvio Jamil analisadas (ver docs/exam-pattern.md):
// 4-5 questões dissertativas, nota em %, sempre somando 100%, sem múltipla
// escolha, exigindo justificativa explícita. O Simulado A troca uma questão
// de estilo antigo (euleriano, agora fora do escopo — ver docs/p1-scope.md)
// por uma de lógica de predicados, já que o cronograma 2026/2 confirma esse
// assunto como conteúdo real da P1 deste semestre (sem prova antiga como
// referência de formato, então o estilo é 'generated', não 'old_exam').

export const exams: Exam[] = [
  {
    id: 'simulado-p1-a',
    title: 'Simulado P1 — Estilo A',
    basedOn: 'Padrão observado em 2024/1, 2024/2 e 2026/1 (questões de projeto de algoritmo com alto peso)',
    suggestedDurationMinutes: 120,
    questions: [
      { questionId: 'fund-fam-05', weightPercent: 25 },
      { questionId: 'base-03', weightPercent: 25 },
      { questionId: 'ciclo-02', weightPercent: 25 },
      { questionId: 'pred-05', weightPercent: 25 },
    ],
  },
  {
    id: 'simulado-p1-b',
    title: 'Simulado P1 — Estilo B',
    basedOn: 'Padrão observado em 2022/1, 2022/2 e 2023/1 (abertura leve + provas formais de peso alto)',
    suggestedDurationMinutes: 120,
    questions: [
      { questionId: 'fund-fam-03', weightPercent: 15 },
      { questionId: 'iso-04', weightPercent: 30 },
      { questionId: 'comp-03', weightPercent: 30 },
      { questionId: 'exc-03', weightPercent: 25 },
    ],
  },
  {
    id: 'simulado-p1-c',
    title: 'Simulado P1 — Estilo C',
    basedOn: 'Padrão observado em 2022/1-Q5 e 2023/2 (SCC + base/anti-base + fecho transitivo)',
    suggestedDurationMinutes: 100,
    questions: [
      { questionId: 'scc-01', weightPercent: 30 },
      { questionId: 'fecho-01', weightPercent: 20 },
      { questionId: 'fecho-02', weightPercent: 20 },
      { questionId: 'base-01', weightPercent: 30 },
    ],
  },
  // --- P2: combinações de questões reais do Prof. Silvio, cada uma com seu peso original.
  {
    id: 'simulado-p2-a',
    prova: 'P2',
    title: 'Simulado P2 — execução e algoritmos',
    basedOn: 'Matriz com Kruskal, Prim e Dijkstra; caminho alternado; circuito euleriano; questão curta de grafo completo. Pesos originais do Prof. Silvio.',
    suggestedDurationMinutes: 110,
    questions: [
      { questionId: 'ps-2021-2-q3', weightPercent: 30 },
      { questionId: 'ps-2025-1-q2', weightPercent: 30 },
      { questionId: 'ps-20xx8-q3', weightPercent: 25 },
      { questionId: 'ps-20xx1-q1', weightPercent: 15 },
    ],
  },
  {
    id: 'simulado-p2-b',
    prova: 'P2',
    title: 'Simulado P2 — o que mais se repete',
    basedOn: 'Grafo de linha, Prim com aresta obrigatória e diâmetro: famílias recorrentes, com os pesos originais das questões.',
    suggestedDurationMinutes: 100,
    questions: [
      { questionId: 'ps-2026-1-q1', weightPercent: 45 },
      { questionId: 'ps-2025-1-q4', weightPercent: 20 },
      { questionId: 'ps-20xx1-q3', weightPercent: 35 },
    ],
  },
  {
    id: 'simulado-p2-c',
    prova: 'P2',
    title: 'Simulado P2 — perfil da prova recente',
    basedOn: 'AGM única e Prim com arestas obrigatórias da prova 2026/1, caminho alternado de 2025/1 e uma questão curta cumulativa. Pesos originais.',
    suggestedDurationMinutes: 100,
    questions: [
      { questionId: 'ps-2026-1-q2', weightPercent: 30 },
      { questionId: 'ps-2026-1-q3', weightPercent: 25 },
      { questionId: 'ps-2025-1-q2', weightPercent: 30 },
      { questionId: 'ps-20xx1-q1', weightPercent: 15 },
    ],
  },
  {
    id: 'simulado-p2-d',
    prova: 'P2',
    title: 'Simulado P2 — caminhos com restrição',
    basedOn: 'Caminho alternado, λ-crescimento e capacidade máxima de provas antigas, mais uma questão curta de SCC. Pesos originais.',
    suggestedDurationMinutes: 100,
    questions: [
      { questionId: 'ps-2025-1-q2', weightPercent: 30 },
      { questionId: 'ps-20xx8-q2', weightPercent: 30 },
      { questionId: 'ps-20xx6-q4', weightPercent: 30 },
      { questionId: 'ps-2024-2-q4', weightPercent: 10 },
    ],
  },
  {
    id: 'simulado-p2-e',
    prova: 'P2',
    title: 'Simulado P2 — execução e justificativa',
    basedOn: 'Execução de Kruskal, Prim e Dijkstra na matriz; circuito euleriano; grafo de linha. Pesos originais.',
    suggestedDurationMinutes: 110,
    questions: [
      { questionId: 'ps-20xx7-q2', weightPercent: 30 },
      { questionId: 'ps-20xx8-q3', weightPercent: 25 },
      { questionId: 'ps-2026-1-q1', weightPercent: 45 },
    ],
  },
  {
    id: 'simulado-p2-f',
    prova: 'P2',
    title: 'Simulado P2 — revisão cumulativa',
    basedOn: 'O conteúdo da P1 também aparece na P2: conectividade, excentricidade, AGM e circuito euleriano. Pesos originais.',
    suggestedDurationMinutes: 100,
    questions: [
      { questionId: 'ps-20xx6-q1', weightPercent: 20 },
      { questionId: 'ps-2025-1-q1', weightPercent: 25 },
      { questionId: 'ps-2021-2-q3', weightPercent: 30 },
      { questionId: 'ps-20xx8-q3', weightPercent: 25 },
    ],
  },
  {
    id: 'simulado-p2-g',
    prova: 'P2',
    title: 'Simulado P2 — modelagem e algoritmos',
    basedOn: 'Combina caminho crítico, Prim com aresta obrigatória, caminho alternado e conectividade. Pesos originais.',
    suggestedDurationMinutes: 100,
    questions: [
      { questionId: 'ps-20xx6-q3', weightPercent: 30 },
      { questionId: 'ps-2025-1-q4', weightPercent: 20 },
      { questionId: 'ps-2025-1-q2', weightPercent: 30 },
      { questionId: 'ps-20xx6-q1', weightPercent: 20 },
    ],
  },
];

/** As 8 provas reais (2022/1 … 2026/1), literais, todas abertas — ver questions/09-provas-reais.ts. */
export const realExams: Exam[] = [
  ...provasReais.map((p) => ({
    ...p.exam,
    kind: 'real' as const,
    questions: p.questions.map((x) => ({ questionId: x.question.id, weightPercent: x.weightPercent })),
  })),
  ...provasSilvioP2.map((p) => ({
    ...p.exam,
    kind: 'real' as const,
    prova: 'P2' as const,
    questions: p.questions.map((x) => ({ questionId: x.question.id, weightPercent: x.weightPercent })),
  })),
  {
    ...provaRealP2.exam,
    kind: 'real' as const,
    prova: 'P2' as const,
    questions: provaRealP2.questions.map((x) => ({ questionId: x.question.id, weightPercent: x.weightPercent })),
  },
];

export function getExam(id: string): Exam | undefined {
  return [...exams, ...realExams].find((e) => e.id === id);
}

