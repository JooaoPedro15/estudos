import type { Exam } from './types';

// Estrutura, contagem de questões e distribuição de peso baseadas no padrão
// real das 8 provas do Prof. Silvio Jamil analisadas (ver docs/exam-pattern.md):
// 4-5 questões dissertativas, nota em %, sempre somando 100%, sem múltipla
// escolha, exigindo justificativa explícita.

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
      { questionId: 'euler-03', weightPercent: 25 },
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
];

export function getExam(id: string): Exam | undefined {
  return exams.find((e) => e.id === id);
}
