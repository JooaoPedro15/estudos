import { prova2Blueprint } from './prova2Blueprint';
import { evaluateStep } from '../engine/evaluator';

test('prova 2 tem exatamente 3 questoes reais (lista de pilhas, arvore de arvore, vetor ordenado)', () => {
  expect(prova2Blueprint.questions).toHaveLength(3);
  expect(prova2Blueprint.questions.map((q) => q.domainId)).toEqual(['vetores', 'arvore', 'ordenacao']);
});

test('todas as questoes tem visual de apoio e pelo menos 2 passos', () => {
  prova2Blueprint.questions.forEach((question) => {
    expect(question.visual?.kind).toBeTruthy();
    expect(question.steps.length).toBeGreaterThanOrEqual(2);
  });
});

test('a solucao modelo de cada passo de funcao satisfaz seus proprios fragmentos obrigatorios', () => {
  const functionSteps = prova2Blueprint.questions
    .flatMap((question) => question.steps)
    .filter((step) => step.kind === 'function');

  expect(functionSteps.length).toBeGreaterThan(0);

  for (const step of functionSteps) {
    const result = evaluateStep(step, { kind: 'text', text: step.solution });
    expect(result.correct, `${step.id}: ${result.feedback}`).toBe(true);
  }
});

test('a resposta modelo de cada pergunta de complexidade (gap) satisfaz seu proprio gabarito', () => {
  const gapSteps = prova2Blueprint.questions.flatMap((question) => question.steps).filter((step) => step.kind === 'gap');

  expect(gapSteps.length).toBeGreaterThan(0);

  for (const step of gapSteps) {
    const result = evaluateStep(step, { kind: 'text', text: step.answers[0] });
    expect(result.correct, `${step.id}: ${result.feedback}`).toBe(true);
  }
});
