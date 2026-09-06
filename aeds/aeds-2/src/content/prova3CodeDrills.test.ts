import { prova3CodeDrillCatalog } from './prova3CodeDrills';
import { codeDrillCatalog } from './codeDrills';
import { evaluateStep } from '../engine/evaluator';

test('catalogo novo da Prova 3 cobre alvinegra, arvore 2.3.4 e patricia', () => {
  expect(prova3CodeDrillCatalog.length).toBeGreaterThanOrEqual(11);
  const moduleIds = new Set(prova3CodeDrillCatalog.map((drill) => drill.moduleId ?? drill.domainId));
  for (const expected of ['alvinegra', 'arvore234', 'patricia']) {
    expect(moduleIds.has(expected as never)).toBe(true);
  }
});

test('o passo de escolha (pro-ativo vs reativo) tem um correctOptionId valido', () => {
  const choiceSteps = prova3CodeDrillCatalog.map((drill) => drill.step).filter((step) => step.kind === 'choice');
  expect(choiceSteps.length).toBeGreaterThan(0);
  for (const step of choiceSteps) {
    const result = evaluateStep(step, { kind: 'choice', optionId: step.correctOptionId });
    expect(result.correct, `${step.id}: ${result.feedback}`).toBe(true);
  }
});

test('a solucao modelo de cada passo de funcao satisfaz seus proprios fragmentos obrigatorios', () => {
  for (const drill of prova3CodeDrillCatalog) {
    if (drill.step.kind !== 'function') {
      continue;
    }
    const result = evaluateStep(drill.step, { kind: 'text', text: drill.step.solution });
    expect(result.correct, `${drill.id}: ${result.feedback}`).toBe(true);
  }
});

test('a resposta modelo de cada pergunta de complexidade (gap) satisfaz seu proprio gabarito', () => {
  for (const drill of prova3CodeDrillCatalog) {
    if (drill.step.kind !== 'gap') {
      continue;
    }
    const result = evaluateStep(drill.step, { kind: 'text', text: drill.step.answers[0] });
    expect(result.correct, `${drill.id}: ${result.feedback}`).toBe(true);
  }
});

test('todo drill novo tem ids unicos dentro do catalogo completo', () => {
  const ids = codeDrillCatalog.map((drill) => drill.id);
  expect(new Set(ids).size).toBe(ids.length);
});
