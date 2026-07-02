import { codeDrillCatalog, getDrillsByGroup } from './codeDrills';
import { evaluateStep } from '../engine/evaluator';

test('cataloga treinos de codigo inspirados na lista da prova 3', () => {
  expect(codeDrillCatalog.length).toBeGreaterThanOrEqual(24);
  expect(new Set(codeDrillCatalog.map((drill) => drill.domainId))).toEqual(
    new Set(['arvore', 'avl', 'trie', 'doidona', 'hash', 'vetores', 'somatorio', 'ordenacao']),
  );
  expect(codeDrillCatalog.every((drill) => drill.scaffold.includes('class') || drill.scaffold.includes('void'))).toBe(
    true,
  );
  expect(codeDrillCatalog.every((drill) => drill.visual)).toBe(true);
  expect(codeDrillCatalog.filter((drill) => drill.step.kind === 'function').length).toBeGreaterThanOrEqual(18);
});

test('a solucao modelo de cada treino satisfaz seus proprios fragmentos', () => {
  for (const drill of codeDrillCatalog) {
    if (drill.step.kind !== 'function') {
      continue;
    }

    const result = evaluateStep(drill.step, { kind: 'text', text: drill.step.solution });
    expect(result.correct, `${drill.id}: ${result.feedback}`).toBe(true);
  }
});

test('inclui treinos novos vindos dos laboratorios do professor', () => {
  const ids = new Set(codeDrillCatalog.map((drill) => drill.id));

  expect(ids.has('code-hash-funcao-hash-string')).toBe(true);
  expect(ids.has('code-hash-inserir-reserva')).toBe(true);
  expect(ids.has('code-avl-set-nivel')).toBe(true);
  expect(ids.has('code-avl-fator-balanceamento')).toBe(true);
  expect(ids.has('code-ordenacao-quicksort-particionar')).toBe(true);
});

test('inclui o modulo de vetores com exercicios variados', () => {
  const vetores = codeDrillCatalog.filter((drill) => drill.domainId === 'vetores');

  expect(vetores.length).toBeGreaterThanOrEqual(6);
  expect(vetores.some((drill) => drill.id === 'code-vetores-pesquisar')).toBe(true);
  expect(vetores.some((drill) => drill.id === 'code-vetores-inserir-posicao')).toBe(true);
  expect(vetores.some((drill) => drill.id === 'code-vetores-remover-posicao')).toBe(true);
  // percurso, busca e deslocamento sao habilidades distintas
  expect(new Set(vetores.map((drill) => drill.repetitionGroup)).size).toBeGreaterThanOrEqual(4);
});

test('organiza cada estrutura como repeticao antes de modificacao logica', () => {
  const trieSearch = getDrillsByGroup('trie-palavra-exata');

  expect(trieSearch.map((drill) => drill.phase)).toEqual(['repeat', 'repeat', 'modify']);
  expect(trieSearch[0].title).toContain('TRIE');
  expect(trieSearch[2].title).toContain('prefixo');
});
