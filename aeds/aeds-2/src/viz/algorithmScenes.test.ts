import { buildBubbleSortScene, parseArrayInput } from './algorithmScenes';

describe('parseArrayInput', () => {
  it('accepts a comma-separated list of bounded integers', () => {
    expect(parseArrayInput('8, 4, 2, 9, 1')).toEqual({ ok: true, values: [8, 4, 2, 9, 1] });
  });

  it('rejects non-numeric and too-short input', () => {
    expect(parseArrayInput('8, dois, 1')).toMatchObject({ ok: false });
    expect(parseArrayInput('8')).toMatchObject({ ok: false });
  });
});

describe('buildBubbleSortScene', () => {
  it('emits comparison, decision, swap and completion frames in order', () => {
    const scene = buildBubbleSortScene([8, 3]);
    const captions = scene.frames.map((frame) => frame.caption);

    expect(captions).toEqual(
      expect.arrayContaining([
        'Comparando vetor[0] = 8 com vetor[1] = 3.',
        '8 > 3, portanto os elementos serão trocados.',
        'Troca concluída: vetor[0] = 3 e vetor[1] = 8.',
      ]),
    );
    expect(scene.frames[scene.frames.length - 1]?.nodes.map((node) => node.label)).toEqual(['3', '8']);
  });

  it('keeps the completed suffix marked while the next pass begins', () => {
    const scene = buildBubbleSortScene([3, 2, 1]);
    const nextPass = scene.frames.find((frame) => frame.caption === 'Comparando vetor[0] = 2 com vetor[1] = 1.');

    expect(nextPass?.nodes.find((node) => node.label === '3')?.state).toBe('sorted');
  });
});
