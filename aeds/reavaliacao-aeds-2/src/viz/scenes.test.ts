import { structureCatalog } from './scenes';
import { staticSceneForVisual } from './staticScenes';

test('expoe catalogo de cenas para a aba Estruturas', () => {
  expect(structureCatalog.length).toBeGreaterThanOrEqual(6);
  expect(structureCatalog.map((entry) => entry.id)).toEqual(
    expect.arrayContaining(['hash', 'arvore-binaria', 'avl', 'trie', 'somatorio', 'ordenacao', 'doidona']),
  );

  const scene = structureCatalog[0].build();
  expect(scene.frames.length).toBeGreaterThan(0);
  expect(scene.operation).not.toBe('');
});

test('desenha palavra completa de TRIE como caminho de letras', () => {
  const scene = staticSceneForVisual({
    kind: 'trie',
    title: 'TRIE',
    caption: 'Uma palavra',
    labels: ['BRASIL'],
  });
  const labels = scene.frames[0].nodes.map((node) => node.label);

  expect(labels).toEqual(expect.arrayContaining(['B', 'R', 'A', 'S', 'I', 'L']));
  expect(labels).not.toContain('BRASIL');
});
