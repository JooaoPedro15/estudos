import {
  conceptualDrawingCatalog,
  getConceptualDrawingModules,
  getQuestionsForConceptualDrawingModule,
} from './lista2Questions';

test('cataloga as questoes conceituais e de desenho da Lista 2 separadas do treino de codigo', () => {
  expect(conceptualDrawingCatalog.filter((question) => question.type === 'conceitual')).toHaveLength(24);
  expect(conceptualDrawingCatalog.filter((question) => question.type === 'desenho')).toHaveLength(20);
  expect(conceptualDrawingCatalog.every((question) => question.source === 'lista-2')).toBe(true);
  expect(new Set(conceptualDrawingCatalog.map((question) => question.id)).size).toBe(conceptualDrawingCatalog.length);
});

test('oferece filtros independentes para conceituais e desenho', () => {
  const conceptualModules = getConceptualDrawingModules('conceitual');
  const drawingModules = getConceptualDrawingModules('desenho');
  const conceptualIds = conceptualModules.map((module) => module.id);
  const drawingIds = drawingModules.map((module) => module.id);

  expect(conceptualIds[0]).toBe('all');
  expect(drawingIds[0]).toBe('all');
  expect(conceptualIds).not.toContain('desenho');
  expect(drawingIds).not.toContain('conceitual');
  expect(conceptualIds).toContain('complexidade');
  expect(conceptualIds).toContain('lista');
  expect(drawingIds).toContain('hash');
  expect(drawingIds).toContain('trie');
  expect(drawingIds).toContain('avl');
  expect(conceptualModules.every((module) => module.count > 0)).toBe(true);
  expect(drawingModules.every((module) => module.count > 0)).toBe(true);
  expect(getQuestionsForConceptualDrawingModule('all', 'conceitual')).toHaveLength(24);
  expect(getQuestionsForConceptualDrawingModule('all', 'desenho')).toHaveLength(20);
  expect(getQuestionsForConceptualDrawingModule('all', 'desenho').every((question) => question.type === 'desenho')).toBe(true);
  expect(getQuestionsForConceptualDrawingModule('all', 'conceitual').every((question) => question.type === 'conceitual')).toBe(true);
});

test('questoes de desenho possuem alternativas visuais reais sem revelar o gabarito no catalogo', () => {
  const drawingQuestions = conceptualDrawingCatalog.filter((question) => question.type === 'desenho');

  for (const question of drawingQuestions) {
    expect(question.options.length).toBeGreaterThanOrEqual(4);
    expect(question.options.every((option) => option.visual?.kind && option.visual.labels.length > 0)).toBe(true);
    expect(question.options.some((option) => option.id === question.correctOptionId)).toBe(true);
    expect(question.explanation).toContain('Lista 2');
  }
});
