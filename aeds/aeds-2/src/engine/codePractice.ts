import { evaluateStep } from './evaluator';
import type { CodeDrill, StepAnswer } from '../types/content';
import type { PracticeMode, PracticeSession, StepAttempt } from '../types/progress';

type PracticeSessionOptions = {
  mode: PracticeMode;
  targetCount?: number;
  drillOrder?: string[];
  random?: () => number;
};

export function createPracticeSession(drills: CodeDrill[], options: PracticeSessionOptions): PracticeSession {
  const drillOrder = options.drillOrder ?? shuffleDrillIds(drills, options.random ?? Math.random);
  const targetCount = options.mode === 'quick' ? (options.targetCount ?? 2) : undefined;

  return {
    mode: options.mode,
    targetCount,
    drillOrder,
    currentDrillIndex: 0,
    completedCount: 0,
    score: 0,
    attempts: [],
    // Sem drills, ou alvo <= 0, a sessao ja nasce concluida.
    completed: drills.length === 0 || (options.mode === 'quick' && (targetCount ?? 0) <= 0),
  };
}

export function getCurrentPracticeDrill(
  drills: CodeDrill[],
  session: PracticeSession,
): CodeDrill | undefined {
  if (session.completed || drills.length === 0) {
    return undefined;
  }

  const drillOrder = getSessionDrillOrder(drills, session);
  const drillId = drillOrder[session.currentDrillIndex % drillOrder.length];

  if (drillId) {
    return drills.find((drill) => drill.id === drillId) ?? drills[session.currentDrillIndex % drills.length];
  }

  return drills[session.currentDrillIndex % drills.length];
}

export function answerCurrentPracticeStep(
  drills: CodeDrill[],
  session: PracticeSession,
  answer: StepAnswer,
  random: () => number = Math.random,
): PracticeSession {
  const drill = getCurrentPracticeDrill(drills, session);

  if (!drill) {
    return session;
  }

  const result = evaluateStep(drill.step, answer);
  const completedCount = session.completedCount + 1;
  const completed = session.mode === 'quick' && completedCount >= (session.targetCount ?? 2);
  const currentDrillOrder = getSessionDrillOrder(drills, session);
  const nextDrillIndex = session.currentDrillIndex + 1;
  const shouldReshuffleDeck = !completed && session.mode === 'marathon' && nextDrillIndex >= currentDrillOrder.length;
  const attempt: StepAttempt = {
    questionId: drill.id,
    stepId: drill.step.id,
    domainId: drill.domainId,
    moduleId: drill.moduleId ?? drill.domainId,
    questionType: 'codigo',
    skillId: drill.step.skillId,
    format: drill.format,
    correct: result.correct,
    scoreDelta: result.scoreDelta,
    feedback: result.feedback,
    mistakeTag: result.mistakeTag,
    subjectTag: 'mistakeTag' in drill.step ? drill.step.mistakeTag : undefined,
  };

  return {
    ...session,
    drillOrder: shouldReshuffleDeck ? shuffleDrillIds(drills, random) : currentDrillOrder,
    currentDrillIndex: completed ? session.currentDrillIndex : shouldReshuffleDeck ? 0 : nextDrillIndex,
    completedCount,
    score: session.score + result.scoreDelta,
    attempts: [...session.attempts, attempt],
    completed,
  };
}

export function getPracticeProgressLabel(session: PracticeSession): string {
  if (session.mode === 'marathon') {
    return `${session.completedCount}`;
  }

  return `${session.completedCount}/${session.targetCount ?? 2}`;
}

function shuffleDrillIds(drills: CodeDrill[], random: () => number): string[] {
  const drillIds = drills.map((drill) => drill.id);

  for (let index = drillIds.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1));
    [drillIds[index], drillIds[swapIndex]] = [drillIds[swapIndex], drillIds[index]];
  }

  return drillIds;
}

function getSessionDrillOrder(drills: CodeDrill[], session: PracticeSession): string[] {
  return session.drillOrder?.length ? session.drillOrder : drills.map((drill) => drill.id);
}
