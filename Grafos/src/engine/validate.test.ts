import { describe, expect, it } from 'vitest';
import { validateAnswer, type DefinitionAnswer } from './validate';
import { def } from '@/content/definitions/builder';

const q = (n: number) =>
  def({
    id: 'x',
    topic: 'definicao-terminologia',
    concept: 'x',
    definition: 'definição de teste com mais de vinte caracteres',
    keyPoints: Array.from({ length: n }, (_, i) => `ponto ${i + 1}`),
    intuition: 'intuição de teste suficientemente longa para passar na validação',
    source: { type: 'professor_slide', file: 'x.pdf' },
  });
const ans = (checked: string[]): DefinitionAnswer => ({ text: '', revealed: true, checked });

describe('validateAnswer DEFINITION', () => {
  it('exige todos os pontos quando há 1 ou 2', () => {
    expect(validateAnswer(q(2), ans(['ponto 1'])).correct).toBe(false);
    expect(validateAnswer(q(2), ans(['ponto 1', 'ponto 2'])).correct).toBe(true);
    expect(validateAnswer(q(1), ans([])).correct).toBe(false);
  });
  it('tolera faltar 1 ponto quando há 3 ou mais', () => {
    expect(validateAnswer(q(3), ans(['ponto 1', 'ponto 2'])).correct).toBe(true);
    expect(validateAnswer(q(3), ans(['ponto 1'])).correct).toBe(false);
    expect(validateAnswer(q(5), ans(['ponto 1', 'ponto 2', 'ponto 3', 'ponto 4'])).correct).toBe(true);
    expect(validateAnswer(q(5), ans(['ponto 1', 'ponto 2', 'ponto 3'])).correct).toBe(false);
  });
  it('lista o que faltou na mensagem', () => {
    const r = validateAnswer(q(3), ans(['ponto 1', 'ponto 2']));
    expect(r.message).toContain('ponto 3');
    expect(validateAnswer(q(3), ans(['ponto 1', 'ponto 2', 'ponto 3'])).message).toContain('todos os pontos');
  });
});
