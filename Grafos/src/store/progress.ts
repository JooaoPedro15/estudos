import { get, set } from 'idb-keyval';
import type { ProgressState, QuestionAttempt, TopicStat } from '@/content/types';

const KEY = 'graphlab-p1:progress:v1';

function emptyState(): ProgressState {
  return { attempts: [], topicStats: {}, totalStudySeconds: 0 };
}

let cache: ProgressState | null = null;
let loading: Promise<ProgressState> | null = null;

export async function loadProgress(): Promise<ProgressState> {
  if (cache) return cache;
  if (!loading) {
    loading = get<ProgressState>(KEY).then((v) => {
      cache = v ?? emptyState();
      return cache;
    });
  }
  return loading;
}

async function persist(state: ProgressState) {
  cache = state;
  await set(KEY, state);
}

export async function recordAttempt(attempt: QuestionAttempt): Promise<ProgressState> {
  const state = await loadProgress();
  const attempts = [...state.attempts, attempt].slice(-2000);

  const prevStat: TopicStat = state.topicStats[attempt.topic] ?? {
    topic: attempt.topic,
    attempts: 0,
    correct: 0,
    lastSeen: 0,
    lastCorrect: false,
  };
  const topicStats: ProgressState['topicStats'] = {
    ...state.topicStats,
    [attempt.topic]: {
      topic: attempt.topic,
      attempts: prevStat.attempts + 1,
      correct: prevStat.correct + (attempt.correct ? 1 : 0),
      lastSeen: attempt.timestamp,
      lastCorrect: attempt.correct,
    },
  };

  const next: ProgressState = { ...state, attempts, topicStats };
  await persist(next);
  return next;
}

export async function addStudySeconds(seconds: number): Promise<void> {
  const state = await loadProgress();
  await persist({ ...state, totalStudySeconds: state.totalStudySeconds + seconds });
}

export async function setLastPosition(moduleId: string, topicId: string): Promise<void> {
  const state = await loadProgress();
  await persist({ ...state, lastModuleId: moduleId, lastTopicId: topicId });
}

export function topicMasteryPercent(stat: TopicStat | undefined): number {
  if (!stat || stat.attempts === 0) return 0;
  return Math.round((stat.correct / stat.attempts) * 100);
}

export function weakestTopics(state: ProgressState, minAttempts = 2, limit = 5): TopicStat[] {
  return Object.values(state.topicStats)
    .filter((s) => s.attempts >= minAttempts)
    .sort((a, b) => a.correct / a.attempts - b.correct / b.attempts)
    .slice(0, limit);
}

/**
 * Peso de repetição espaçada para um tópico: cresce quando o desempenho é
 * baixo ou a última tentativa foi errada/há muito tempo, decresce com
 * domínio comprovado. Usado para ponderar sorteio de questões, não para
 * repetir a mesma questão imediatamente (isso é responsabilidade de quem
 * monta a sessão, que deve evitar repetir o mesmo `questionId` em sequência).
 */
export function topicWeight(state: ProgressState, topic: string, examLikelihoodBoost = 1): number {
  const stat = state.topicStats[topic];
  if (!stat || stat.attempts === 0) return 3 * examLikelihoodBoost;
  const mastery = stat.correct / stat.attempts;
  const daysSince = (Date.now() - stat.lastSeen) / 86_400_000;
  let weight = (1 - mastery) * 2.5 + 0.5;
  if (!stat.lastCorrect) weight += 1.5;
  weight += Math.min(1.5, daysSince * 0.15);
  return weight * examLikelihoodBoost;
}
