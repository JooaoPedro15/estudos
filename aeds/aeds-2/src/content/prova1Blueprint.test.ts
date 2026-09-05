import { prova1Blueprint } from './prova1Blueprint';
import { evaluateStep } from '../engine/evaluator';

test('prova 1 tem exatamente 3 questoes, uma por macroformato real (complexidade, somatorio, fila)', () => {
  expect(prova1Blueprint.questions).toHaveLength(3);
  expect(prova1Blueprint.questions.map((q) => q.domainId)).toEqual(['somatorio', 'somatorio', 'vetores']);
});

test('todas as questoes tem visual de apoio e pelo menos 2 passos', () => {
  prova1Blueprint.questions.forEach((question) => {
    expect(question.visual?.kind).toBeTruthy();
    expect(question.steps.length).toBeGreaterThanOrEqual(2);
  });
});

test('a questao de fila tem scaffold da classe oficial (array circular, primeiro/ultimo)', () => {
  const filaQuestion = prova1Blueprint.questions.find((q) => q.moduleId === 'fila');
  expect(filaQuestion?.scaffold).toContain('class Fila');
  expect(filaQuestion?.scaffold).toContain('primeiro');
  expect(filaQuestion?.scaffold).toContain('ultimo');
});

test('a solucao modelo de cada passo de funcao satisfaz seus proprios fragmentos obrigatorios', () => {
  const functionSteps = prova1Blueprint.questions
    .flatMap((question) => question.steps)
    .filter((step) => step.kind === 'function');

  expect(functionSteps.length).toBeGreaterThan(0);

  for (const step of functionSteps) {
    const result = evaluateStep(step, { kind: 'text', text: step.solution });
    expect(result.correct, `${step.id}: ${result.feedback}`).toBe(true);
  }
});
