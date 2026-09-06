import { prova3PraticaDrillCatalog } from './prova3PraticaDrills';
import { codeDrillCatalog } from './codeDrills';
import { evaluateStep } from '../engine/evaluator';

test('catalogo de pratica da Prova 3 cobre trie, hash e avl', () => {
  expect(prova3PraticaDrillCatalog.length).toBeGreaterThanOrEqual(3);
  expect(prova3PraticaDrillCatalog.every((drill) => drill.source === 'prova3-pratica')).toBe(true);
  const moduleIds = new Set(prova3PraticaDrillCatalog.map((drill) => drill.moduleId ?? drill.domainId));
  for (const expected of ['trie', 'hash', 'avl']) {
    expect(moduleIds.has(expected as never)).toBe(true);
  }
});

test('a solucao modelo de cada passo de funcao satisfaz seus proprios fragmentos obrigatorios', () => {
  for (const drill of prova3PraticaDrillCatalog) {
    if (drill.step.kind !== 'function') {
      continue;
    }
    const result = evaluateStep(drill.step, { kind: 'text', text: drill.step.solution });
    expect(result.correct, `${drill.id}: ${result.feedback}`).toBe(true);
  }
});

test('todo drill novo tem ids unicos dentro do catalogo completo', () => {
  const ids = codeDrillCatalog.map((drill) => drill.id);
  expect(new Set(ids).size).toBe(ids.length);
});
