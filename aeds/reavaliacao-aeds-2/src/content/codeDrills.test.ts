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

test('integra questoes novas de codigo da Lista 2 nos modulos corretos', () => {
  const ids = new Set(codeDrillCatalog.map((drill) => drill.id));

  expect(ids.has('code-lista2-recursividade-contar-maiusculas')).toBe(true);
  expect(ids.has('code-lista2-lista-sequencial-inserir-ordenado')).toBe(true);
  expect(ids.has('code-lista2-fila-circular-soma-recursiva')).toBe(true);
  expect(ids.has('code-lista2-pilha-parenteses-balanceados')).toBe(true);
  expect(ids.has('code-lista2-matriz-diagonal-unificada')).toBe(true);
  expect(ids.has('code-lista2-hash-rehash-removido')).toBe(true);
  expect(ids.has('code-lista2-trie-prefixo-sufixo')).toBe(true);
  expect(ids.has('code-lista2-alvinegra-invariantes')).toBe(true);

  const lista2 = codeDrillCatalog.filter((drill) => drill.source === 'lista-2');

  expect(lista2.length).toBeGreaterThanOrEqual(25);
  expect(lista2.every((drill) => drill.step.kind === 'function')).toBe(true);
  expect(new Set(lista2.map((drill) => drill.id)).size).toBe(lista2.length);
  expect(lista2.find((drill) => drill.id === 'code-lista2-fila-circular-soma-recursiva')?.moduleId).toBe('fila');
  expect(lista2.find((drill) => drill.id === 'code-lista2-alvinegra-invariantes')?.moduleId).toBe('alvinegra');
  expect(lista2.find((drill) => drill.id === 'code-lista2-trie-prefixo-sufixo')?.moduleId).toBe('trie');
});

test('nao duplica questoes da Lista 2 que ja existem no treino de codigo', () => {
  const duplicateGroups = [
    'lista2-q46-somatorio-triangular',
    'lista2-q66-validar-abb',
    'lista2-q70-avl-nivel-fator',
    'lista2-q84-doidona-pesquisa-simples',
  ];

  for (const group of duplicateGroups) {
    expect(codeDrillCatalog.some((drill) => drill.repetitionGroup === group)).toBe(false);
  }
});

test('rejeita respostas erradas de somatorio que antes passavam por substring', () => {
  const pares = codeDrillCatalog.find((drill) => drill.id === 'code-somatorio-pares');
  const misto = codeDrillCatalog.find((drill) => drill.id === 'code-somatorio-custo-misto');

  expect(pares?.step.kind).toBe('function');
  expect(misto?.step.kind).toBe('function');

  // Gauss (com / 2) nao vale para a soma dos pares 2+4+...+2n.
  const paresErrado = evaluateStep(pares!.step, { kind: 'text', text: 'return n * (n + 1) / 2;' });
  expect(paresErrado.correct).toBe(false);

  // So a parte triangular, esquecendo a parte linear, nao vale para custo misto.
  const mistoErrado = evaluateStep(misto!.step, { kind: 'text', text: 'return n * (n + 1) / 2;' });
  expect(mistoErrado.correct).toBe(false);
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
