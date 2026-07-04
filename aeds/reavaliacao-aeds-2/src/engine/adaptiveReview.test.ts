import {
  applyAttempt,
  createEmptyNotebook,
  getErrorTypeLabel,
  getPriorityErrors,
  getSubjectLabel,
  MASTERY_TARGET,
  recordReviewResult,
  recordStepAttempt,
  selectSimilarPractice,
} from './adaptiveReview';
import type { StepAttempt } from '../types/progress';

const codeError: StepAttempt = {
  questionId: 'code-somatorio-1',
  stepId: 'code-somatorio-1-step',
  domainId: 'somatorio',
  moduleId: 'somatorio',
  questionType: 'codigo',
  skillId: 'program',
  format: 'code-repetition',
  correct: false,
  scoreDelta: 0,
  feedback: 'Resposta incorreta.',
  mistakeTag: 'wrong-summation-bound',
  subjectTag: 'wrong-summation-bound',
};

test('agrupa erros por tipo + modulo + assunto sem duplicar', () => {
  let notebook = createEmptyNotebook();
  notebook = recordStepAttempt(notebook, codeError, '2026-07-01T10:00:00.000Z');
  notebook = recordStepAttempt(notebook, codeError, '2026-07-01T10:05:00.000Z');

  expect(notebook.records).toHaveLength(1);
  expect(notebook.records[0]).toMatchObject({
    id: 'codigo:somatorio:wrong-summation-bound',
    type: 'codigo',
    moduleId: 'somatorio',
    attempts: 2,
    correctCount: 0,
    masteryLevel: 0,
    resolved: false,
    lastSeenAt: '2026-07-01T10:05:00.000Z',
  });
});

test('registra erros conceituais e de desenho, mesmo sem mistakeTag', () => {
  let notebook = createEmptyNotebook();
  const drawError: StepAttempt = {
    ...codeError,
    questionId: 'lista2-desenho-q43',
    stepId: 'lista2-desenho-q43',
    domainId: 'hash',
    moduleId: 'hash',
    questionType: 'desenho',
    format: 'structure-simulation',
    mistakeTag: undefined,
    subjectTag: undefined,
  };

  notebook = recordStepAttempt(notebook, drawError, '2026-07-01T10:00:00.000Z');

  expect(notebook.records).toHaveLength(1);
  expect(notebook.records[0]).toMatchObject({ id: 'desenho:hash:geral', type: 'desenho', attempts: 1 });
  expect(getSubjectLabel(notebook.records[0])).toBe('Revisao geral');
});

test('prioriza erros com mais tentativas e dominio mais baixo', () => {
  let notebook = createEmptyNotebook();
  notebook = recordStepAttempt(notebook, codeError, '2026-07-01T10:00:00.000Z');
  notebook = recordStepAttempt(
    notebook,
    { ...codeError, moduleId: 'avl', domainId: 'avl', questionType: 'desenho', subjectTag: 'wrong-rotation', mistakeTag: 'wrong-rotation' },
    '2026-07-01T10:10:00.000Z',
  );
  notebook = recordStepAttempt(notebook, codeError, '2026-07-01T10:20:00.000Z');

  const priority = getPriorityErrors(notebook);
  expect(priority.map((record) => record.moduleId)).toEqual(['somatorio', 'avl']);
});

test('dominio exige varios acertos e nao some com acerto isolado', () => {
  let notebook = createEmptyNotebook();
  notebook = recordStepAttempt(notebook, codeError, '2026-07-01T10:00:00.000Z');
  const recordId = notebook.records[0].id;

  const correct = { ...codeError, correct: true, mistakeTag: undefined };
  notebook = applyAttempt(notebook, correct, recordId, '2026-07-01T10:05:00.000Z');

  // Um acerto so nao resolve.
  expect(notebook.records[0]).toMatchObject({ masteryLevel: 1, resolved: false });
  expect(getPriorityErrors(notebook)).toHaveLength(1);

  notebook = applyAttempt(notebook, correct, recordId, '2026-07-01T10:10:00.000Z');
  notebook = applyAttempt(notebook, correct, recordId, '2026-07-01T10:15:00.000Z');

  expect(notebook.records[0]).toMatchObject({ masteryLevel: MASTERY_TARGET, correctCount: 3, resolved: true });
  expect(getPriorityErrors(notebook)).toHaveLength(0);
});

test('reincidir zera o dominio conquistado', () => {
  let notebook = createEmptyNotebook();
  notebook = recordStepAttempt(notebook, codeError, '2026-07-01T10:00:00.000Z');
  const recordId = notebook.records[0].id;
  const correct = { ...codeError, correct: true, mistakeTag: undefined };

  notebook = applyAttempt(notebook, correct, recordId, '2026-07-01T10:05:00.000Z');
  notebook = recordStepAttempt(notebook, codeError, '2026-07-01T10:10:00.000Z');

  expect(notebook.records[0]).toMatchObject({ masteryLevel: 0, attempts: 2, resolved: false });
});

test('acerto sem alvo avanca o erro compativel de mesmo tipo e modulo', () => {
  let notebook = createEmptyNotebook();
  notebook = recordStepAttempt(notebook, codeError, '2026-07-01T10:00:00.000Z');

  const correct = { ...codeError, correct: true, mistakeTag: undefined };
  notebook = applyAttempt(notebook, correct, null, '2026-07-01T10:05:00.000Z');

  expect(notebook.records[0]).toMatchObject({ masteryLevel: 1, correctCount: 1 });
});

test('recordReviewResult errado tambem derruba o dominio', () => {
  let notebook = createEmptyNotebook();
  notebook = recordStepAttempt(notebook, codeError, '2026-07-01T10:00:00.000Z');
  const recordId = notebook.records[0].id;

  notebook = recordReviewResult(notebook, recordId, true, '2026-07-01T10:05:00.000Z');
  notebook = recordReviewResult(notebook, recordId, false, '2026-07-01T10:10:00.000Z');

  expect(notebook.records[0]).toMatchObject({ masteryLevel: 0, attempts: 2 });
});

test('acertos rapidos contam progresso mas nao dominam sem espacamento', () => {
  let notebook = createEmptyNotebook();
  notebook = recordStepAttempt(notebook, codeError, '2026-07-01T10:00:00.000Z');
  const recordId = notebook.records[0].id;
  const correct = { ...codeError, correct: true, mistakeTag: undefined };

  notebook = applyAttempt(notebook, correct, recordId, '2026-07-01T10:00:10.000Z');
  notebook = applyAttempt(notebook, correct, recordId, '2026-07-01T10:00:12.000Z');

  expect(notebook.records[0]).toMatchObject({ masteryLevel: 1, correctCount: 2 });
});

test('acerto de codigo nao credita um assunto diferente', () => {
  let notebook = createEmptyNotebook();
  notebook = recordStepAttempt(
    notebook,
    { ...codeError, moduleId: 'avl', domainId: 'avl', subjectTag: 'wrong-rotation', mistakeTag: 'wrong-rotation' },
    '2026-07-01T10:00:00.000Z',
  );

  const correct: StepAttempt = {
    ...codeError,
    moduleId: 'avl',
    domainId: 'avl',
    correct: true,
    mistakeTag: undefined,
    subjectTag: 'missing-base-case',
  };
  notebook = applyAttempt(notebook, correct, null, '2026-07-01T10:05:00.000Z');

  expect(notebook.records[0].masteryLevel).toBe(0);
});

test('seleciona treino parecido e rotula tipo/assunto', () => {
  let notebook = createEmptyNotebook();
  notebook = recordStepAttempt(notebook, codeError, '2026-07-01T10:00:00.000Z');

  expect(selectSimilarPractice(notebook.records[0])).toMatchObject({
    domainId: 'somatorio',
    targetMistakeTag: 'wrong-summation-bound',
  });
  expect(getErrorTypeLabel('codigo')).toBe('Codigo');
  expect(getSubjectLabel(notebook.records[0])).toBe('Somatorio');
});
