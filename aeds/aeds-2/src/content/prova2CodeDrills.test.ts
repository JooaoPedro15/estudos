import { prova2CodeDrillCatalog } from './prova2CodeDrills';
import { codeDrillCatalog } from './codeDrills';
import { evaluateStep } from '../engine/evaluator';

test('catalogo novo da Prova 2 cobre matriz e arvore', () => {
  expect(prova2CodeDrillCatalog.length).toBeGreaterThanOrEqual(14);
  const moduleIds = new Set(prova2CodeDrillCatalog.map((drill) => drill.moduleId ?? drill.domainId));
  for (const expected of ['matriz', 'arvore']) {
    expect(moduleIds.has(expected as never)).toBe(true);
  }
});

test('a solucao modelo de cada passo de funcao satisfaz seus proprios fragmentos obrigatorios', () => {
  for (const drill of prova2CodeDrillCatalog) {
    if (drill.step.kind !== 'function') {
      continue;
    }
    const result = evaluateStep(drill.step, { kind: 'text', text: drill.step.solution });
    expect(result.correct, `${drill.id}: ${result.feedback}`).toBe(true);
  }
});

test('a resposta modelo de cada pergunta de complexidade (gap) satisfaz seu proprio gabarito', () => {
  for (const drill of prova2CodeDrillCatalog) {
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
