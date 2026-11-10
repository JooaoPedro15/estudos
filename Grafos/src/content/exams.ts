import type { Exam } from './types';
import { provasReais } from './questions/09-provas-reais';
import { provaRealP2 } from './questions/10-p2';
import { provasSilvioP2 } from './questions/12-p2-provas-silvio';
import { drawP2Simulation } from './randomP2Exams';

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
  // --- P2: sorteio de questões reais, preservando os pesos originais.
  {
    id: 'simulado-p2-equilibrado',
    prova: 'P2',
    title: 'Simulado P2 — misto aleatório',
    basedOn: 'Sorteia combinações que somam 100%, com recorrentes e outros temas da P2. A chance de cada assunto não segue a frequência real nas provas; para isso use "P2 — o que mais cai".',
    suggestedDurationMinutes: 100,
    randomized: 'equilibrado',
    questions: [],
  },
  {
    id: 'simulado-p2-recorrente',
    prova: 'P2',
    title: 'Simulado P2 — foco recorrente',
    basedOn: 'Sorteia combinações que somam 100% com pelo menos duas questões de assuntos marcados como recorrentes. A chance de cada assunto não segue a frequência real nas provas; para isso use "P2 — o que mais cai".',
    suggestedDurationMinutes: 100,
    randomized: 'foco-recorrente',
    questions: [],
  },
  // --- P2: o que mais cai. Uma questão por assunto, do mais frequente ao menos, com o peso original.
  {
    id: 'simulado-p2-mais-cai',
    prova: 'P2',
    title: 'P2 — o que mais cai',
    basedOn: 'Um representante de cada assunto que se repete nas provas de P2 do Prof. Silvio, do mais frequente (Prim/AGM, conectividade e componentes, caminho com restrição) ao menos. Fixo, sem sorteio, pesos originais (a soma passa de 100%).',
    suggestedDurationMinutes: 120,
    questions: [
      { questionId: 'ps-2026-1-q3', weightPercent: 25 }, // Prim com aresta(s) obrigatória(s): 2024/2, 2025/1, 2026/1
      { questionId: 'ps-2021-2-q3', weightPercent: 30 }, // Kruskal, Prim e Dijkstra na matriz: 2021/2, 20xx(p.7)
      { questionId: 'ps-2021-2-q2', weightPercent: 30 }, // tipos de conectividade e Kosaraju: 2021/2, 20xx(p.6), 20xx(p.7)
      { questionId: 'ps-2025-1-q3', weightPercent: 25 }, // acíclico via componentes fortemente conexos: 2024/2, 2025/1
      { questionId: 'ps-20xx6-q4', weightPercent: 30 }, // caminho de maior capacidade (Max-Min): 20xx(p.6), 20xx(p.7)
      { questionId: 'ps-2025-1-q2', weightPercent: 30 }, // caminho alternado (e λ-crescimento, 20xx(p.8)): 2025/1
      { questionId: 'ps-2024-2-q1', weightPercent: 35 }, // diâmetro: 2024/2, 2025/1, 20xx(p.1)
      { questionId: 'ps-2024-2-q2', weightPercent: 35 }, // serialização / ordem topológica: 2024/2, 20xx(p.8), + caminho crítico 20xx(p.6)
      { questionId: 'ps-20xx8-q1', weightPercent: 20 }, // n vértices e k componentes: 20xx(p.1), 20xx(p.8)
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
  const exam = [...exams, ...realExams].find((e) => e.id === id);
  return exam?.randomized ? { ...exam, questions: drawP2Simulation(exam.randomized) } : exam;
}

