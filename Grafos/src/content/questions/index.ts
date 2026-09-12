import type { Question, Duration, QuestionAttempt } from '@/content/types';
import { exams } from '@/content/exams';
import { fundamentosQuestions } from './01-fundamentos';
import { representacoesQuestions } from './02-representacoes';
import { isomorfismoQuestions } from './03-isomorfismo';
import { buscaQuestions } from './04-busca';
import { conectividadeQuestions } from './05-conectividade';
import { logicaConjuntosQuestions } from './06-logica-conjuntos';
import { treinoProvaQuestions } from './07-treino-prova';
import { closedDefinitionQuestions, definitionQuestions, isDefinitionFamily, isDefinitionQuestion } from '@/content/definitions';
import { conceptExamWeights, examFamilies, examFamilyWeight } from '@/content/examFamilies';

export const questions: Question[] = [
  ...fundamentosQuestions,
  ...representacoesQuestions,
  ...isomorfismoQuestions,
  ...buscaQuestions,
  ...conectividadeQuestions,
  ...logicaConjuntosQuestions,
  ...treinoProvaQuestions,
  ...definitionQuestions,
  ...closedDefinitionQuestions,
];

export { isDefinitionQuestion, isDefinitionFamily };

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

/** Restringe a lista aos tópicos dados (undefined/vazio = matéria inteira). */
function inTopics(list: Question[], topicIds?: string[]): Question[] {
  if (!topicIds || topicIds.length === 0) return list;
  const set = new Set(topicIds);
  return list.filter((q) => set.has(q.topic));
}

/** Fechada gerada de uma definição (múltipla escolha / V-F sobre a definição do professor). */
function isClosedDefinition(q: Question): boolean {
  return isDefinitionFamily(q) && !isDefinitionQuestion(q);
}

/**
 * Monta uma revisão rápida: 1 questão no estilo real de prova (ver
 * `isExamStyleQuestion`), 2 definições — 1 aberta "defina o conceito" e 1
 * fechada gerada dela (só 1, sorteada, se a revisão for de 3) — e o resto de
 * questões conceituais `quick`, tudo de tópicos variados. `topicIds`
 * restringe a um módulo. Assim até uma sessão curta treina formato de prova
 * E decoreba das definições do professor.
 */
export function pickQuickReview(count = 5, topicIds?: string[]): Question[] {
  const bank = inTopics(questions, topicIds);
  const examSlots = 1;
  const defSlots = count <= 3 ? 1 : 2;
  const examPool = shuffle(bank.filter((q) => isExamStyleQuestion(q) && !isDefinitionFamily(q))).sort((a, b) => examWeight(b) - examWeight(a));
  const openPool = shuffle(bank.filter(isDefinitionQuestion));
  const closedPool = shuffle(bank.filter(isClosedDefinition));
  // Com 2 vagas: uma aberta e uma fechada. Com 1: sorteia qual.
  const defPools = defSlots === 1 ? (Math.random() < 0.5 ? [openPool, closedPool] : [closedPool, openPool]) : [openPool, closedPool];
  const conceptPool = shuffle(bank.filter((q) => q.duration === 'quick' && !isExamStyleQuestion(q) && !isDefinitionFamily(q))).sort(
    (a, b) => examWeight(b) - examWeight(a),
  );

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
  let defTarget = examSlots;
  for (const pool of defPools.slice(0, defSlots)) {
    defTarget += 1;
    fillDiverse(pool, defTarget);
  }
  fillDiverse(conceptPool, count);

  // Completa (sem exigir tópico diverso) se algum pool ficou curto.
  for (const pool of [...defPools, examPool, conceptPool]) {
    if (picked.length >= count) break;
    for (const q of pool) {
      if (picked.length >= count) break;
      if (picked.some((p) => p.id === q.id)) continue;
      if (isDefinitionFamily(q) && picked.filter(isDefinitionFamily).length >= defSlots) break;
      picked.push(q);
    }
  }

  return shuffle(picked).slice(0, count);
}

function examWeight(q: Question): number {
  return q.examLikelihood === 'high' ? 3 : q.examLikelihood === 'medium' ? 2 : 1;
}

/** Peso "quanto cai na prova" de cada definição (ver content/examFamilies.ts). */
const CONCEPT_EXAM_WEIGHT = conceptExamWeights();

/** Id do conceito (definição aberta) que uma questão da família definição treina. */
function conceptIdOf(q: Question): string | undefined {
  if (q.type === 'DEFINITION') return q.id;
  return q.definitionId;
}

/** Multiplicador para questões de definição: conceitos usados em mais provas aparecem mais (1× para os que nunca caíram, até ~4× para os mais cobrados). */
function conceptBoost(q: Question): number {
  const id = conceptIdOf(q);
  if (!id) return 1;
  return 1 + (CONCEPT_EXAM_WEIGHT.get(id) ?? 0) / 6;
}

/**
 * Sessão de estudo: mistura durações conforme o tempo disponível (minutos),
 * priorizando tópicos de peso ponderado (ver store/progress). `topicIds`
 * restringe a um módulo.
 */
export function pickStudySession(minutes: number, topicWeights?: Record<string, number>, topicIds?: string[]): Question[] {
  const budgetMs = minutes * 60_000;
  const avgMsByDuration: Record<Duration, number> = { quick: 60_000, normal: 5 * 60_000, deep: 18 * 60_000 };
  const weighted = shuffle(inTopics(questions, topicIds)).sort((a, b) => {
    const wa = (topicWeights?.[a.topic] ?? 1) * examWeight(a) * conceptBoost(a);
    const wb = (topicWeights?.[b.topic] ?? 1) * examWeight(b) * conceptBoost(b);
    return wb - wa + (Math.random() - 0.5);
  });
  const picked: Question[] = [];
  let used = 0;
  let defCount = 0;
  for (const q of weighted) {
    const cost = avgMsByDuration[q.duration];
    if (used + cost > budgetMs && picked.length > 0) continue;
    // Definições (abertas e fechadas) entram no sorteio, mas no máximo ~40% da sessão — o resto é resolução de problema.
    if (isDefinitionFamily(q)) {
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
 * Em ~35% das vezes puxa uma definição (metade aberta, metade fechada), no
 * resto uma questão de resolução. Evita repetir qualquer id em `excludeIds`
 * (últimas N mostradas), pondera por `topicWeights` (ver store/progress
 * topicWeight) e por examLikelihood; `topicIds` restringe a um módulo.
 * Retorna undefined só se não houver questão nenhuma nos tópicos pedidos.
 */
export function pickNextPracticeQuestion(excludeIds: string[], topicWeights?: Record<string, number>, topicIds?: string[]): Question | undefined {
  const excluded = new Set(excludeIds);
  const bank = inTopics(questions, topicIds);
  const available = bank.filter((q) => !excluded.has(q.id));
  const wantDefinition = Math.random() < DEFINITION_CHANCE_PRACTICE;
  const wantOpen = Math.random() < 0.5;
  let pool = available.filter((q) => (wantDefinition ? isDefinitionFamily(q) && isDefinitionQuestion(q) === wantOpen : !isDefinitionFamily(q)));
  if (pool.length === 0) pool = available.filter((q) => isDefinitionFamily(q) === wantDefinition);
  if (pool.length === 0) pool = available;
  if (pool.length === 0) pool = bank; // esgotou tudo — permite repetir
  return weightedPick(pool, (q) => (topicWeights?.[q.topic] ?? 1) * examWeight(q) * conceptBoost(q));
}

export type DefinitionKind = 'open' | 'closed' | 'mixed';
/** 'all' = todos os conceitos; 'exam' = só os usados em alguma prova antiga, ponderados por quantas. */
export type DefinitionScope = 'all' | 'exam';

/**
 * Próxima definição para o modo "Decorar conceitos". Prioridade por
 * QUESTÃO (não por tópico), a partir do histórico de tentativas: nunca vista
 * (3) < errou na última (4); acertou há mais de um dia (2); acertou hoje
 * (0.5). `topicIds` restringe a um módulo; `kind` escolhe abertas, fechadas
 * ou misto (50/50). Nunca repete `excludeIds` a menos que não sobre nada.
 */
export function pickNextDefinition(
  excludeIds: string[],
  attempts: QuestionAttempt[],
  topicIds?: string[],
  kind: DefinitionKind = 'mixed',
  scope: DefinitionScope = 'all',
): Question | undefined {
  const excluded = new Set(excludeIds);
  const wantOpen = kind === 'open' ? true : kind === 'closed' ? false : Math.random() < 0.5;
  let family = inTopics(questions, topicIds).filter(isDefinitionFamily);
  if (scope === 'exam') family = family.filter((q) => CONCEPT_EXAM_WEIGHT.has(conceptIdOf(q)!));
  let all = family.filter((q) => isDefinitionQuestion(q) === wantOpen);
  if (all.length === 0) all = family;
  let pool = all.filter((q) => !excluded.has(q.id));
  if (pool.length === 0) pool = all;
  if (pool.length === 0) return undefined;

  const last = lastAttemptByQuestion(attempts);
  const now = Date.now();
  return weightedPick(pool, (q) => historyWeight(last.get(q.id), now) * (scope === 'exam' ? conceptBoost(q) : 1));
}

/** Prioridade por questão a partir do histórico: errou na última (4) > nunca vista (3) > acertou há mais de um dia (2) > acertou hoje (0.5). */
function historyWeight(a: QuestionAttempt | undefined, now: number): number {
  if (!a) return 3;
  if (!a.correct) return 4;
  return now - a.timestamp > 86_400_000 ? 2 : 0.5;
}

function lastAttemptByQuestion(attempts: QuestionAttempt[]): Map<string, QuestionAttempt> {
  const last = new Map<string, QuestionAttempt>();
  for (const a of attempts) {
    const prev = last.get(a.questionId);
    if (!prev || a.timestamp > prev.timestamp) last.set(a.questionId, a);
  }
  return last;
}

/**
 * Próxima questão do "Treino de prova": só questões com `examFamily`.
 * Sorteia primeiro a FAMÍLIA, com peso = nº de provas em que caiu (metade
 * se o cronograma põe o assunto depois da P1), depois uma questão dentro
 * dela pelo histórico (erradas e nunca vistas primeiro), evitando
 * `excludeIds`. Assim "n vértices, k componentes" (5 provas) aparece ~5×
 * mais que "matriz de adjacência" (1 prova), independentemente de quantas
 * variantes cada família tem.
 */
export function pickNextExamDrill(excludeIds: string[], attempts: QuestionAttempt[]): Question | undefined {
  const excluded = new Set(excludeIds);
  const byFamily = new Map<string, Question[]>();
  for (const q of questions) {
    if (!q.examFamily) continue;
    const list = byFamily.get(q.examFamily) ?? [];
    list.push(q);
    byFamily.set(q.examFamily, list);
  }
  const families = examFamilies.filter((f) => (byFamily.get(f.id)?.length ?? 0) > 0);
  const family = weightedPick(families, examFamilyWeight);
  if (!family) return undefined;
  const all = byFamily.get(family.id)!;
  let pool = all.filter((q) => !excluded.has(q.id));
  if (pool.length === 0) pool = all;
  const last = lastAttemptByQuestion(attempts);
  const now = Date.now();
  return weightedPick(pool, (q) => historyWeight(last.get(q.id), now));
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
