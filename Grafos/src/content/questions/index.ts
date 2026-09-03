import type { Question, Duration } from '@/content/types';
import { fundamentosQuestions } from './01-fundamentos';
import { representacoesQuestions } from './02-representacoes';
import { isomorfismoQuestions } from './03-isomorfismo';
import { buscaQuestions } from './04-busca';
import { conectividadeQuestions } from './05-conectividade';
import { logicaConjuntosQuestions } from './06-logica-conjuntos';

export const questions: Question[] = [
  ...fundamentosQuestions,
  ...representacoesQuestions,
  ...isomorfismoQuestions,
  ...buscaQuestions,
  ...conectividadeQuestions,
  ...logicaConjuntosQuestions,
];

export function getQuestion(id: string): Question | undefined {
  return questions.find((q) => q.id === id);
}

export function questionsForTopic(topicId: string): Question[] {
  return questions.filter((q) => q.topic === topicId);
}

export function questionsForModule(topicIds: string[]): Question[] {
  return questions.filter((q) => topicIds.includes(q.topic));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Monta uma revisão rápida: 3-7 questões `quick`, priorizando alta chance de prova e amostrando tópicos variados. */
export function pickQuickReview(count = 5): Question[] {
  const pool = shuffle(questions.filter((q) => q.duration === 'quick'));
  const byTopic = new Set<string>();
  const picked: Question[] = [];
  const sorted = [...pool].sort((a, b) => examWeight(b) - examWeight(a));
  for (const q of sorted) {
    if (picked.length >= count) break;
    if (byTopic.has(q.topic) && byTopic.size < sorted.length) continue;
    picked.push(q);
    byTopic.add(q.topic);
  }
  while (picked.length < count && picked.length < pool.length) {
    const next = pool.find((q) => !picked.includes(q));
    if (!next) break;
    picked.push(next);
  }
  return picked.slice(0, count);
}

function examWeight(q: Question): number {
  return q.examLikelihood === 'high' ? 3 : q.examLikelihood === 'medium' ? 2 : 1;
}

/** Sessão de estudo: mistura durações conforme o tempo disponível (minutos), priorizando tópicos de peso ponderado (ver store/progress). */
export function pickStudySession(minutes: number, topicWeights?: Record<string, number>): Question[] {
  const budgetMs = minutes * 60_000;
  const avgMsByDuration: Record<Duration, number> = { quick: 60_000, normal: 5 * 60_000, deep: 18 * 60_000 };
  const weighted = [...questions].sort((a, b) => {
    const wa = (topicWeights?.[a.topic] ?? 1) * examWeight(a);
    const wb = (topicWeights?.[b.topic] ?? 1) * examWeight(b);
    return wb - wa + (Math.random() - 0.5);
  });
  const picked: Question[] = [];
  let used = 0;
  for (const q of weighted) {
    const cost = avgMsByDuration[q.duration];
    if (used + cost > budgetMs && picked.length > 0) continue;
    picked.push(q);
    used += cost;
    if (used >= budgetMs) break;
  }
  return picked;
}

/** Prioriza tópicos com pior desempenho (para o modo "Meus pontos fracos"). */
export function pickWeakTopicSession(weakTopicIds: string[], count = 8): Question[] {
  const pool = shuffle(questions.filter((q) => weakTopicIds.includes(q.topic)));
  if (pool.length >= count) return pool.slice(0, count);
  const rest = shuffle(questions.filter((q) => !weakTopicIds.includes(q.topic)));
  return [...pool, ...rest].slice(0, count);
}
