import type { Question, Duration, QuestionAttempt } from '@/content/types';
import { exams } from '@/content/exams';
import { fundamentosQuestions } from './01-fundamentos';
import { representacoesQuestions } from './02-representacoes';
import { isomorfismoQuestions } from './03-isomorfismo';
import { buscaQuestions } from './04-busca';
import { conectividadeQuestions } from './05-conectividade';
import { logicaConjuntosQuestions } from './06-logica-conjuntos';
import { definitionQuestions, isDefinitionQuestion } from '@/content/definitions';

export const questions: Question[] = [
  ...fundamentosQuestions,
  ...representacoesQuestions,
  ...isomorfismoQuestions,
  ...buscaQuestions,
  ...conectividadeQuestions,
  ...logicaConjuntosQuestions,
  ...definitionQuestions,
];

export { isDefinitionQuestion };

/** IDs das questões que compõem algum dos simulados de prova (ver content/exams.ts). */
const examQuestionIds = new Set(exams.flatMap((exam) => exam.questions.map((q) => q.questionId)));

/** Questão "estilo prova": veio de prova antiga real ou foi usada em algum simulado — o que o aluno de fato vai ver na P1. */
export function isExamStyleQuestion(q: Question): boolean {
  return q.sourceStyle === 'old_exam' || examQuestionIds.has(q.id);
}

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

/**
 * Monta uma revisão rápida: 1 questão no estilo real de prova (ver
 * `isExamStyleQuestion`), 2 definições "defina o conceito" (1 se a revisão
 * for de 3) e o resto de questões conceituais `quick` — tudo de tópicos
 * variados. Assim até uma sessão curta treina formato de prova E decoreba
 * das definições do professor.
 */
export function pickQuickReview(count = 5): Question[] {
  const examSlots = 1;
  const defSlots = count <= 3 ? 1 : 2;
  const examPool = shuffle(questions.filter((q) => isExamStyleQuestion(q) && !isDefinitionQuestion(q))).sort((a, b) => examWeight(b) - examWeight(a));
  const defPool = shuffle(questions.filter(isDefinitionQuestion));
  const conceptPool = shuffle(
    questions.filter((q) => q.duration === 'quick' && !isExamStyleQuestion(q) && !isDefinitionQuestion(q)),
  ).sort((a, b) => examWeight(b) - examWeight(a));

  const picked: Question[] = [];
  const byTopic = new Set<string>();

  function fillDiverse(pool: Question[], limit: number) {
    for (const q of pool) {
      if (picked.length >= limit) break;
      if (picked.some((p) => p.id === q.id) || byTopic.has(q.topic)) continue;
      picked.push(q);
      byTopic.add(q.topic);
    }
  }

  fillDiverse(examPool, examSlots);
  fillDiverse(defPool, examSlots + defSlots);
  fillDiverse(conceptPool, count);

  // Completa (sem exigir tópico diverso) se algum pool ficou curto.
  for (const pool of [defPool, examPool, conceptPool]) {
    if (picked.length >= count) break;
    for (const q of pool) {
      if (picked.length >= count) break;
      if (picked.some((p) => p.id === q.id)) continue;
      if (pool === defPool && picked.filter(isDefinitionQuestion).length >= defSlots) break;
      picked.push(q);
    }
  }

  return shuffle(picked).slice(0, count);
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
  let defCount = 0;
  for (const q of weighted) {
    const cost = avgMsByDuration[q.duration];
    if (used + cost > budgetMs && picked.length > 0) continue;
    // Definições entram no sorteio, mas no máximo ~40% da sessão — o resto é resolução de problema.
    if (isDefinitionQuestion(q)) {
      if (defCount + 1 > Math.ceil(DEFINITION_SHARE_SESSION * (picked.length + 1))) continue;
      defCount++;
    }
    picked.push(q);
    used += cost;
    if (used >= budgetMs) break;
  }
  return picked;
}

/** Fração máxima de definições numa sessão de estudo. */
const DEFINITION_SHARE_SESSION = 0.4;
/** Probabilidade de a próxima questão da prática livre ser uma definição. */
const DEFINITION_CHANCE_PRACTICE = 0.35;

/** Prioriza tópicos com pior desempenho (para o modo "Meus pontos fracos"). */
export function pickWeakTopicSession(weakTopicIds: string[], count = 8): Question[] {
  const pool = shuffle(questions.filter((q) => weakTopicIds.includes(q.topic)));
  if (pool.length >= count) return pool.slice(0, count);
  const rest = shuffle(questions.filter((q) => !weakTopicIds.includes(q.topic)));
  return [...pool, ...rest].slice(0, count);
}

/**
 * Escolhe UMA próxima questão para o modo "Prática livre" (sem fim
 * pré-definido — a sessão pede uma questão de cada vez até o aluno parar).
 * Em ~35% das vezes puxa uma definição ("defina o conceito"), no resto uma
 * questão de resolução. Evita repetir qualquer id em `excludeIds` (últimas N
 * mostradas), pondera por `topicWeights` (ver store/progress topicWeight) e
 * por examLikelihood. Retorna undefined só se TODAS as questões estiverem em
 * excludeIds.
 */
export function pickNextPracticeQuestion(excludeIds: string[], topicWeights?: Record<string, number>): Question | undefined {
  const excluded = new Set(excludeIds);
  const available = questions.filter((q) => !excluded.has(q.id));
  const wantDefinition = Math.random() < DEFINITION_CHANCE_PRACTICE;
  let pool = available.filter((q) => isDefinitionQuestion(q) === wantDefinition);
  if (pool.length === 0) pool = available;
  if (pool.length === 0) pool = questions; // esgotou tudo — permite repetir
  return weightedPick(pool, (q) => (topicWeights?.[q.topic] ?? 1) * examWeight(q));
}

/**
 * Próxima definição para o modo "Decorar conceitos". Prioridade por
 * QUESTÃO (não por tópico), a partir do histórico de tentativas: nunca vista
 * (3) < errou na última (4); acertou há mais de um dia (2); acertou hoje
 * (0.5). `topicIds` restringe a um módulo. Nunca repete `excludeIds` a menos
 * que não sobre nada.
 */
export function pickNextDefinition(excludeIds: string[], attempts: QuestionAttempt[], topicIds?: string[]): Question | undefined {
  const excluded = new Set(excludeIds);
  const topicSet = topicIds && topicIds.length > 0 ? new Set(topicIds) : null;
  const all = questions.filter((q) => isDefinitionQuestion(q) && (!topicSet || topicSet.has(q.topic)));
  let pool = all.filter((q) => !excluded.has(q.id));
  if (pool.length === 0) pool = all;
  if (pool.length === 0) return undefined;

  const last = new Map<string, QuestionAttempt>();
  for (const a of attempts) {
    const prev = last.get(a.questionId);
    if (!prev || a.timestamp > prev.timestamp) last.set(a.questionId, a);
  }
  const now = Date.now();
  return weightedPick(pool, (q) => {
    const a = last.get(q.id);
    if (!a) return 3;
    if (!a.correct) return 4;
    return now - a.timestamp > 86_400_000 ? 2 : 0.5;
  });
}

function weightedPick<T>(pool: T[], weightOf: (item: T) => number): T | undefined {
  if (pool.length === 0) return undefined;
  const weights = pool.map(weightOf);
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}
