import { prova1PraticaDrillCatalog } from './prova1PraticaDrills';
import { beecrowdSamples } from './beecrowdSamples';
import { evaluateStep } from '../engine/evaluator';

test('catalogo pratico da Prova 1 cobre ordenacao, busca, fila, pilha, lista, matriz e recursividade', () => {
  expect(prova1PraticaDrillCatalog.length).toBeGreaterThanOrEqual(40);
  const moduleIds = new Set(prova1PraticaDrillCatalog.map((drill) => drill.moduleId ?? drill.domainId));
  for (const expected of ['ordenacao', 'busca-binaria', 'busca-sequencial', 'fila', 'pilha', 'lista', 'matriz', 'recursividade']) {
    expect(moduleIds.has(expected as never), expected).toBe(true);
  }
});

test('todo drill pratico tem id e repetitionGroup unicos dentro do catalogo', () => {
  const ids = prova1PraticaDrillCatalog.map((drill) => drill.id);
  expect(new Set(ids).size).toBe(ids.length);
  const groups = prova1PraticaDrillCatalog.map((drill) => drill.repetitionGroup);
  expect(new Set(groups).size).toBe(groups.length);
});

test('todo drill pratico declara source prova1-pratica e tem enunciado com entrada e saida', () => {
  for (const drill of prova1PraticaDrillCatalog) {
    expect(drill.source).toBe('prova1-pratica');
    expect(drill.stem.toLowerCase()).toContain('entrada');
    expect(drill.stem.toLowerCase()).toContain('saida');
  }
});

test('todo drill pratico e um problema real de juiz, com link e exemplos oficiais', () => {
  for (const drill of prova1PraticaDrillCatalog) {
    expect(drill.judge, drill.id).toBeDefined();
    expect(drill.judge?.url.startsWith('https://'), drill.id).toBe(true);
    expect(drill.samples?.length ?? 0, drill.id).toBeGreaterThan(0);
    expect(drill.title, drill.id).toContain(drill.judge?.site === 'Codewars' ? 'Codewars' : `${drill.judge?.site} ${drill.judge?.problemId}`);
    if (drill.judge?.site === 'beecrowd') {
      // Exemplos do beecrowd vem do arquivo gerado a partir do site, nunca digitados a mao.
      expect(drill.samples).toBe(beecrowdSamples[drill.judge.problemId]);
      expect(drill.judge.timeLimit).toMatch(/^\d+s$/);
      // A pagina do juiz pede login; o enunciado original publico abre direto.
      expect(drill.judge.statementUrl).toBe(`https://resources.beecrowd.com/repository/UOJ_${drill.judge.problemId}.html`);
    }
  }
});

test('a solucao modelo (e cada variante aceita) satisfaz seus proprios fragmentos obrigatorios', () => {
  for (const drill of prova1PraticaDrillCatalog) {
    if (drill.step.kind === 'function') {
      const result = evaluateStep(drill.step, { kind: 'text', text: drill.step.solution });
      expect(result.correct, `${drill.id}: ${result.feedback}`).toBe(true);
    } else if (drill.step.kind === 'function-choice') {
      for (const variant of drill.step.variants) {
        const result = evaluateStep(drill.step, { kind: 'text', text: variant.solution });
        expect(result.correct, `${drill.id}/${variant.id}: ${result.feedback}`).toBe(true);
      }
    }
  }
});
