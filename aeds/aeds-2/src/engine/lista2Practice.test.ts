import {
  advanceConceptualQuestion,
  answerCurrentConceptualQuestion,
  createConceptualPracticeSession,
  getCurrentConceptualQuestion,
  type ConceptualPracticeSession,
} from './lista2Practice';
import { getQuestionsForConceptualDrawingModule } from '../content/lista2Questions';

const questions = getQuestionsForConceptualDrawingModule('all', 'conceitual');

test('responder registra a tentativa sem avancar; proxima avanca e limpa a resposta marcada', () => {
  const session = createConceptualPracticeSession(questions, {
    mode: 'quick',
    targetCount: 2,
    random: () => 0.999,
  });
  const current = getCurrentConceptualQuestion(questions, session)!;

  const answered = answerCurrentConceptualQuestion(questions, session, current.correctOptionId);

  expect(answered.currentQuestionIndex).toBe(session.currentQuestionIndex);
  expect(answered.completedCount).toBe(1);
  expect(answered.score).toBe(10);
  expect(answered.answeredOptionId).toBe(current.correctOptionId);
  expect(getCurrentConceptualQuestion(questions, answered)?.id).toBe(current.id);

  const advanced = advanceConceptualQuestion(questions, answered, () => 0.999);

  expect(advanced.currentQuestionIndex).toBe(1);
  expect(advanced.completedCount).toBe(1);
  expect(advanced.score).toBe(10);
  expect(advanced.answeredOptionId).toBeNull();
  expect(getCurrentConceptualQuestion(questions, advanced)?.id).not.toBe(current.id);
});

test('sessao conceitual salva antes de answeredOptionId continua respondendo normalmente', () => {
  const session = createConceptualPracticeSession(questions, {
    mode: 'quick',
    targetCount: 2,
    random: () => 0.999,
  });
  const legacySession = { ...session };
  delete (legacySession as Partial<ConceptualPracticeSession>).answeredOptionId;
  const current = getCurrentConceptualQuestion(questions, legacySession as ConceptualPracticeSession)!;

  const answered = answerCurrentConceptualQuestion(
    questions,
    legacySession as ConceptualPracticeSession,
    current.correctOptionId,
  );

  expect(answered.completedCount).toBe(1);
  expect(answered.answeredOptionId).toBe(current.correctOptionId);
});
