import { domainCatalog } from './domains';

test('lista os dominios da reavaliacao na ordem da campanha', () => {
  expect(domainCatalog.map((domain) => domain.id)).toEqual([
    'doidona',
    'trie',
    'avl',
    'hash',
    'arvore',
    'vetores',
    'somatorio',
    'ordenacao',
  ]);
});

test('cada dominio cobre os quatro marcos de dominio', () => {
  for (const domain of domainCatalog) {
    expect(domain.skills).toEqual(['recognize', 'simulate', 'program', 'justify']);
  }
});
