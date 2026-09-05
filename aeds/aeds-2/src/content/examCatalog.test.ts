import { examCatalog, getExam, type ExamId } from './examCatalog';

test('tem exatamente as 4 provas esperadas, na ordem P1, P2, P3, Reav', () => {
  expect(examCatalog.map((exam) => exam.id)).toEqual(['p1', 'p2', 'p3', 'reav']);
});

test('reavaliacao nao tem filtro de modulos (cai tudo)', () => {
  expect(getExam('reav').moduleIds).toBeUndefined();
});

test('lista/fila/pilha/matriz aparecem em P1 e P2 (sobreposicao proposital)', () => {
  const p1 = new Set(getExam('p1').moduleIds);
  const p2 = new Set(getExam('p2').moduleIds);
  for (const moduleId of ['lista', 'fila', 'pilha', 'matriz'] as const) {
    expect(p1.has(moduleId)).toBe(true);
    expect(p2.has(moduleId)).toBe(true);
  }
});

test('P3 nao repete nenhum modulo de P1 ou P2', () => {
  const p1 = new Set(getExam('p1').moduleIds);
  const p2 = new Set(getExam('p2').moduleIds);
  const p3 = getExam('p3').moduleIds ?? [];
  p3.forEach((moduleId) => {
    expect(p1.has(moduleId)).toBe(false);
    expect(p2.has(moduleId)).toBe(false);
  });
});

test('getExam lanca erro para id desconhecido', () => {
  expect(() => getExam('p4' as ExamId)).toThrow();
});
