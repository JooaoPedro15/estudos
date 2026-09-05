import { prova1PraticaDrillCatalog } from './prova1PraticaDrills';
import { evaluateStep } from '../engine/evaluator';

test('catalogo pratico da Prova 1 cobre ordenacao, fila, pilha e lista', () => {
  expect(prova1PraticaDrillCatalog.length).toBeGreaterThanOrEqual(4);
  const moduleIds = new Set(prova1PraticaDrillCatalog.map((drill) => drill.moduleId ?? drill.domainId));
  for (const expected of ['ordenacao', 'fila', 'pilha', 'lista']) {
    expect(moduleIds.has(expected as never)).toBe(true);
  }
});

test('todo drill pratico declara source prova1-pratica e tem enunciado com entrada e saida', () => {
  for (const drill of prova1PraticaDrillCatalog) {
    expect(drill.source).toBe('prova1-pratica');
    expect(drill.stem.toLowerCase()).toContain('entrada');
    expect(drill.stem.toLowerCase()).toContain('saida');
  }
});

test('a solucao modelo de cada exercicio pratico satisfaz seus proprios fragmentos obrigatorios', () => {
  for (const drill of prova1PraticaDrillCatalog) {
    if (drill.step.kind !== 'function') {
      continue;
    }
    const result = evaluateStep(drill.step, { kind: 'text', text: drill.step.solution });
    expect(result.correct, `${drill.id}: ${result.feedback}`).toBe(true);
  }
});
