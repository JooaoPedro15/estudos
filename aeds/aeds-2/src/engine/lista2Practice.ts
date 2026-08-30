import type { ConceptualDrawingQuestion } from '../content/lista2Questions';
import type { PracticeMode } from '../types/progress';

export type ConceptualAttempt = {
  questionId: string;
  selectedOptionId: string;
  correct: boolean;
  scoreDelta: number;
  feedback: string;
};

export type ConceptualPracticeSession = {
  mode: PracticeMode;
  targetCount?: number;
  questionOrder: string[];
  currentQuestionIndex: number;
  completedCount: number;
  score: number;
  attempts: ConceptualAttempt[];
  completed: boolean;
  /** Opcao respondida na questao atual; null enquanto nao respondeu. */
  answeredOptionId: string | null;
};

type ConceptualSessionOptions = {
  mode: PracticeMode;
  targetCount?: number;
  questionOrder?: string[];
  random?: () => number;
};

export function createConceptualPracticeSession(
  questions: ConceptualDrawingQuestion[],
  options: ConceptualSessionOptions,
): ConceptualPracticeSession {
  const questionOrder = options.questionOrder ?? shuffleQuestionIds(questions, options.random ?? Math.random);
  const targetCount = options.mode === 'quick' ? (options.targetCount ?? 2) : undefined;

  return {
    mode: options.mode,
    targetCount,
    questionOrder,
    currentQuestionIndex: 0,
    completedCount: 0,
    score: 0,
    attempts: [],
    completed: questions.length === 0 || (options.mode === 'quick' && (targetCount ?? 0) <= 0),
    answeredOptionId: null,
  };
}

export function getCurrentConceptualQuestion(
  questions: ConceptualDrawingQuestion[],
  session: ConceptualPracticeSession,
): ConceptualDrawingQuestion | undefined {
  if (session.completed || questions.length === 0) {
    return undefined;
  }

  const order = getSessionQuestionOrder(questions, session);
  const questionId = order[session.currentQuestionIndex % order.length];

  return questions.find((question) => question.id === questionId) ?? questions[session.currentQuestionIndex % questions.length];
}

function hasAnsweredCurrentQuestion(session: ConceptualPracticeSession): boolean {
  return session.answeredOptionId != null;
}

/**
 * Registra a resposta da questao atual (pontua e guarda a tentativa) SEM
 * avancar. A questao continua visivel com o feedback ate o usuario pedir a
 * proxima com `advanceConceptualQuestion`. Ja respondida, ignora nova resposta.
 */
export function answerCurrentConceptualQuestion(
  questions: ConceptualDrawingQuestion[],
  session: ConceptualPracticeSession,
  selectedOptionId: string,
): ConceptualPracticeSession {
  const question = getCurrentConceptualQuestion(questions, session);

  if (!question || hasAnsweredCurrentQuestion(session)) {
    return session;
  }

  const selectedOption = question.options.find((option) => option.id === selectedOptionId);
  const correct = selectedOptionId === question.correctOptionId;
  const feedback = correct
    ? `Resposta correta. ${question.explanation}`
    : `Resposta incorreta. ${selectedOption?.explanation ? `${selectedOption.explanation} ` : ''}${question.explanation}`;
  const attempt: ConceptualAttempt = {
    questionId: question.id,
    selectedOptionId,
    correct,
    scoreDelta: correct ? 10 : 0,
    feedback,
  };

  return {
    ...session,
    completedCount: session.completedCount + 1,
    score: session.score + attempt.scoreDelta,
    attempts: [...session.attempts, attempt],
    answeredOptionId: selectedOptionId,
  };
}

/**
 * Avanca para a proxima questao apos o feedback. So age se a atual ja foi
 * respondida. Encerra a sessao rapida ao atingir o alvo; na maratona
 * reembaralha ao terminar o baralho.
 */
export function advanceConceptualQuestion(
  questions: ConceptualDrawingQuestion[],
  session: ConceptualPracticeSession,
  random: () => number = Math.random,
): ConceptualPracticeSession {
  if (!hasAnsweredCurrentQuestion(session)) {
    return session;
  }

  const completed = session.mode === 'quick' && session.completedCount >= (session.targetCount ?? 2);
  const currentOrder = getSessionQuestionOrder(questions, session);
  const nextQuestionIndex = session.currentQuestionIndex + 1;
  const shouldReshuffleDeck = !completed && session.mode === 'marathon' && nextQuestionIndex >= currentOrder.length;

  return {
    ...session,
    questionOrder: shouldReshuffleDeck ? shuffleQuestionIds(questions, random) : currentOrder,
    currentQuestionIndex: completed ? session.currentQuestionIndex : shouldReshuffleDeck ? 0 : nextQuestionIndex,
    completed,
    answeredOptionId: null,
  };
}

export function getConceptualProgressLabel(session: ConceptualPracticeSession): string {
  if (session.mode === 'marathon') {
    return `${session.completedCount}`;
  }

  return `${session.completedCount}/${session.targetCount ?? 2}`;
}

function shuffleQuestionIds(questions: ConceptualDrawingQuestion[], random: () => number): string[] {
  const ids = questions.map((question) => question.id);

  for (let index = ids.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1));
    [ids[index], ids[swapIndex]] = [ids[swapIndex], ids[index]];
  }

  return ids;
}

function getSessionQuestionOrder(
  questions: ConceptualDrawingQuestion[],
  session: ConceptualPracticeSession,
): string[] {
  return session.questionOrder?.length ? session.questionOrder : questions.map((question) => question.id);
}
