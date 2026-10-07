import type { Exam } from './types';
import { provasReais } from './questions/09-provas-reais';
import { provaRealP2 } from './questions/10-p2';

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
  // --- P2 (formato da P2 2024/1: modelar + executar o algoritmo passo a passo)
  {
    id: 'simulado-p2-a',
    prova: 'P2',
    title: 'Simulado P2 — Estilo A',
    basedOn: 'Formato da P2 2024/1 (modelagem + execução) com os quatro algoritmos centrais do cronograma: AGM, Bellman-Ford, Dijkstra e Fleury.',
    suggestedDurationMinutes: 110,
    questions: [
      { questionId: 'p2-agm-05', weightPercent: 25 },
      { questionId: 'p2-bf-06', weightPercent: 25 },
      { questionId: 'p2-dij-04', weightPercent: 25 },
      { questionId: 'p2-euler-04', weightPercent: 25 },
    ],
  },
  {
    id: 'simulado-p2-b',
    prova: 'P2',
    title: 'Simulado P2 — Estilo B',
    basedOn: 'Demonstração por indução + euleriano em prova real do Prof. Silvio (2026/1-Q2) + AGM da P2 2024/1 + Floyd-Warshall (pelo livro).',
    suggestedDurationMinutes: 120,
    questions: [
      { questionId: 'p2-ind-03', weightPercent: 20 },
      { questionId: 'pr-2026-1-q2', weightPercent: 30 },
      { questionId: 'pr-p2-2024-1-q1', weightPercent: 25 },
      { questionId: 'p2-fw-03', weightPercent: 25 },
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

