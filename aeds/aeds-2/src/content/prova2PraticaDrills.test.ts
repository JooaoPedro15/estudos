import { prova2PraticaDrillCatalog } from './prova2PraticaDrills';
import { codeDrillCatalog } from './codeDrills';
import { evaluateStep } from '../engine/evaluator';

test('catalogo de pratica da Prova 2 cobre matriz e arvore', () => {
  expect(prova2PraticaDrillCatalog.length).toBeGreaterThanOrEqual(3);
  expect(prova2PraticaDrillCatalog.every((drill) => drill.source === 'prova2-pratica')).toBe(true);
  const moduleIds = new Set(prova2PraticaDrillCatalog.map((drill) => drill.moduleId ?? drill.domainId));
  for (const expected of ['matriz', 'arvore']) {
    expect(moduleIds.has(expected as never)).toBe(true);
  }
});

test('a solucao modelo de cada passo de funcao satisfaz seus proprios fragmentos obrigatorios', () => {
  for (const drill of prova2PraticaDrillCatalog) {
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
