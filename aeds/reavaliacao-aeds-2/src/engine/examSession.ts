import { evaluateStep, getStepMaxScore } from './evaluator';
import type { ErrorType, ExamBlueprint, ExamQuestion, ExamStep, QuestionFormat, StepAnswer } from '../types/content';
import type { ExamSession, StepAttempt } from '../types/progress';

export function createExamSession(blueprint: ExamBlueprint): ExamSession {
  return {
    blueprintId: blueprint.id,
    currentQuestionIndex: 0,
    currentStepIndex: 0,
    score: 0,
    maxScore: blueprint.questions.reduce(
      (total, question) => total + question.steps.reduce((sum, step) => sum + getStepMaxScore(step), 0),
      0,
    ),
    attempts: [],
    completed: blueprint.questions.length === 0,
  };
}

export function getCurrentStep(blueprint: ExamBlueprint, session: ExamSession): ExamStep | undefined {
  return blueprint.questions[session.currentQuestionIndex]?.steps[session.currentStepIndex];
}

const CODE_FORMATS: QuestionFormat[] = [
  'summation-from-code',
  'algorithm-adaptation',
  'composite-structure-method',
  'code-repetition',
  'code-modification',
];

/**
 * Deriva o tipo da QUESTAO (nao da etapa) quando ela nao o informa, evitando
 * registros divididos numa questao multi-etapa: formatos de codigo -> codigo;
 * escolha com desenho -> desenho; demais -> conceitual.
 */
function inferQuestionType(question: ExamQuestion): ErrorType {
  if (CODE_FORMATS.includes(question.format)) {
    return 'codigo';
  }

  const hasVisualOptions = question.steps.some(
    (step) => (step.kind === 'choice' || step.kind === 'rubric') && step.options.some((option) => option.visual),
  );

  return hasVisualOptions ? 'desenho' : 'conceitual';
}

export function answerCurrentStep(
  blueprint: ExamBlueprint,
  session: ExamSession,
  answer: StepAnswer,
): ExamSession {
  if (session.completed) {
    return session;
  }

  const question = blueprint.questions[session.currentQuestionIndex];
  const step = question?.steps[session.currentStepIndex];

  if (!question || !step) {
    return { ...session, completed: true };
  }

  const result = evaluateStep(step, answer);
  const attempt: StepAttempt = {
    questionId: question.id,
    stepId: step.id,
    domainId: question.domainId,
    moduleId: question.moduleId ?? question.domainId,
    questionType: question.questionType ?? inferQuestionType(question),
    skillId: step.skillId,
    format: question.format,
    correct: result.correct,
    scoreDelta: result.scoreDelta,
    feedback: result.feedback,
    mistakeTag: result.mistakeTag,
    subjectTag: 'mistakeTag' in step ? step.mistakeTag : undefined,
  };
  const nextPosition = getNextPosition(blueprint, session.currentQuestionIndex, session.currentStepIndex);

  return {
    ...session,
    currentQuestionIndex: nextPosition.questionIndex,
    currentStepIndex: nextPosition.stepIndex,
    score: session.score + result.scoreDelta,
    attempts: [...session.attempts, attempt],
    completed: nextPosition.completed,
  };
}

function getNextPosition(
  blueprint: ExamBlueprint,
  questionIndex: number,
  stepIndex: number,
): { questionIndex: number; stepIndex: number; completed: boolean } {
  const question = blueprint.questions[questionIndex];
  const nextStepIndex = stepIndex + 1;

  if (question && nextStepIndex < question.steps.length) {
    return { questionIndex, stepIndex: nextStepIndex, completed: false };
  }

  // Avanca para a proxima questao que realmente tenha etapas (uma questao
  // com steps vazio nao pode encerrar o simulado silenciosamente).
  let nextQuestionIndex = questionIndex + 1;
  while (
    nextQuestionIndex < blueprint.questions.length &&
    blueprint.questions[nextQuestionIndex].steps.length === 0
  ) {
    nextQuestionIndex += 1;
  }

  if (nextQuestionIndex < blueprint.questions.length) {
    return { questionIndex: nextQuestionIndex, stepIndex: 0, completed: false };
  }

  return {
    questionIndex: Math.max(0, blueprint.questions.length - 1),
    stepIndex,
    completed: true,
  };
}
