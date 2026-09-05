import { prova3CodeDrillCatalog } from './prova3CodeDrills';
import { codeDrillCatalog } from './codeDrills';
import { evaluateStep } from '../engine/evaluator';

test('catalogo novo da Prova 3 cobre alvinegra', () => {
  expect(prova3CodeDrillCatalog.length).toBeGreaterThanOrEqual(4);
  const moduleIds = new Set(prova3CodeDrillCatalog.map((drill) => drill.moduleId ?? drill.domainId));
  expect(moduleIds.has('alvinegra')).toBe(true);
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
