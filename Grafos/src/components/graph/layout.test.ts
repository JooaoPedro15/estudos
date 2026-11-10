import { describe, expect, it } from 'vitest';
import { graphViewport } from './layout';

describe('graphViewport', () => {
  it('inclui o grafo inteiro quando o cartão é mais baixo que o desenho original', () => {
    const viewport = graphViewport({
      a: { id: 'a', label: 'a', x: 70, y: 40 },
      g: { id: 'g', label: 'g', x: 478, y: 296 },
    }, 560, 240);
    expect(viewport.x).toBe(0);
    expect(viewport.y).toBe(-20);
    expect(viewport.width).toBe(560);
    expect(viewport.height).toBe(376);
  });

  it('expande também à esquerda e à direita para posições fora do quadro', () => {
    const viewport = graphViewport({
      a: { id: 'a', label: 'a', x: -10, y: 100 },
      b: { id: 'b', label: 'b', x: 580, y: 100 },
    }, 560, 240);
    expect(viewport.x).toBe(-70);
    expect(viewport.width).toBe(710);
  });
});
