import type { ExamQuestionRef } from './types';
import { provasSilvioP2 } from './questions/12-p2-provas-silvio';
import { buildClosedExamTasks } from './closedExamTasks';

type Bucket = 'recorrente' | 'geral';
export type P2SimulationMode = 'equilibrado' | 'foco-recorrente';

// Cada entrada é uma questão aberta de prova real do Prof. Silvio. "Grupo" evita
// duas questões quase iguais na mesma prova; os pesos vêm da prova original.
export const P2_SIMULATION_POOL: readonly { id: string; group: string; bucket: Bucket }[] = [
  { id: 'ps-2026-1-q1', group: 'linha', bucket: 'recorrente' },
  { id: 'ps-2026-1-q2', group: 'agm', bucket: 'recorrente' },
  { id: 'ps-2026-1-q3', group: 'prim-forcado', bucket: 'recorrente' },
  { id: 'ps-2025-1-q2', group: 'caminho-restrito', bucket: 'recorrente' },
  { id: 'ps-2025-1-q3', group: 'scc', bucket: 'recorrente' },
  { id: 'ps-2025-1-q4', group: 'prim-forcado', bucket: 'recorrente' },
  { id: 'ps-2021-2-q3', group: 'agm', bucket: 'recorrente' },
  { id: 'ps-20xx6-q4', group: 'caminho-restrito', bucket: 'recorrente' },
  { id: 'ps-20xx8-q2', group: 'caminho-restrito', bucket: 'recorrente' },
  { id: 'ps-2024-2-q4', group: 'scc', bucket: 'recorrente' },
  { id: 'ps-2025-1-q1', group: 'diametro', bucket: 'geral' },
  { id: 'ps-2024-2-q1', group: 'diametro', bucket: 'geral' },
  { id: 'ps-20xx1-q1', group: 'contagem', bucket: 'geral' },
  { id: 'ps-20xx8-q1', group: 'contagem', bucket: 'geral' },
  { id: 'ps-20xx8-q3', group: 'euleriano', bucket: 'geral' },
  { id: 'ps-20xx6-q3', group: 'caminho-critico', bucket: 'geral' },
  { id: 'ps-2024-2-q2', group: 'caminho-critico', bucket: 'geral' },
  { id: 'ps-20xx6-q1', group: 'conectividade', bucket: 'geral' },
  { id: 'ps-2021-2-q4', group: 'subgrafo', bucket: 'geral' },
  { id: 'ps-2021-2-q1', group: 'complemento', bucket: 'geral' },
];

const originalWeights = new Map(provasSilvioP2.flatMap((prova) =>
  prova.questions.map(({ question, weightPercent }) => [question.id, weightPercent] as const),
));
const originalQuestions = new Map(provasSilvioP2.flatMap((prova) =>
  prova.questions.map(({ question }) => [question.id, question] as const),
));

const candidates = P2_SIMULATION_POOL.map((entry) => {
  const weight = originalWeights.get(entry.id);
  if (weight === undefined) throw new Error(`Peso original não encontrado: ${entry.id}`);
  const question = originalQuestions.get(entry.id)!;
  return { ...entry, weight, hasCode: buildClosedExamTasks([{ question, weightPercent: weight }]).some((task) => task.kind === 'code') };
});

type Candidate = (typeof candidates)[number];

function combinations(mode: P2SimulationMode): Candidate[][] {
  const result: Candidate[][] = [];
  function visit(start: number, chosen: Candidate[], total: number, groups: Set<string>) {
    if (total === 100) {
      const recurring = chosen.filter((q) => q.bucket === 'recorrente').length;
      const general = chosen.length - recurring;
      if (chosen.length >= 3 && recurring >= 1 && general >= 1 && chosen.some((q) => q.hasCode) &&
          (mode === 'equilibrado' ? general >= 2 : recurring >= 2)) result.push([...chosen]);
      return;
    }
    if (total > 100 || chosen.length === 5) return;
    for (let i = start; i < candidates.length; i++) {
      const q = candidates[i];
      if (groups.has(q.group) || total + q.weight > 100) continue;
      groups.add(q.group);
      chosen.push(q);
      visit(i + 1, chosen, total + q.weight, groups);
      chosen.pop();
      groups.delete(q.group);
    }
  }
  visit(0, [], 0, new Set());
  return result;
}

const pools: Record<P2SimulationMode, Candidate[][]> = {
  equilibrado: combinations('equilibrado'),
  'foco-recorrente': combinations('foco-recorrente'),
};
const lastPick: Partial<Record<P2SimulationMode, number>> = {};

/** Sorteia uma combinação nova, sem repetir imediatamente a anterior. */
export function drawP2Simulation(mode: P2SimulationMode, random = Math.random): ExamQuestionRef[] {
  const pool = pools[mode];
  if (pool.length === 0) throw new Error(`Não há combinações para ${mode}`);
  const previous = lastPick[mode];
  const choices = pool.length > 1 && previous !== undefined ? pool.length - 1 : pool.length;
  const slot = Math.min(choices - 1, Math.floor(random() * choices));
  const index = previous !== undefined && pool.length > 1 && slot >= previous ? slot + 1 : slot;
  lastPick[mode] = index;
  const refs = pool[index].map(({ id, weight }) => ({ questionId: id, weightPercent: weight }));
  for (let i = refs.length - 1; i > 0; i--) {
    const j = Math.min(i, Math.floor(random() * (i + 1)));
    [refs[i], refs[j]] = [refs[j], refs[i]];
  }
  return refs;
}
