import { describe, expect, it } from 'vitest';
import { definitionQuestions } from './index';
import { closedDefinitionQuestions, generateClosedQuestions } from './closed';

describe('questões fechadas geradas das definições', () => {
  it('gera 3 por definição, com ids estáveis e definitionId apontando para a origem', () => {
    expect(closedDefinitionQuestions.length).toBe(definitionQuestions.length * 3);
    const ids = closedDefinitionQuestions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    const defIds = new Set(definitionQuestions.map((d) => d.id));
    for (const q of closedDefinitionQuestions) {
      expect(q.definitionId && defIds.has(q.definitionId), q.id).toBe(true);
      expect(q.duration).toBe('quick');
      expect(q.sourceStyle).toBe('generated');
    }
    // Determinístico: gerar de novo dá exatamente o mesmo.
    expect(generateClosedQuestions(definitionQuestions).map((q) => q.id + JSON.stringify(q))).toEqual(
      closedDefinitionQuestions.map((q) => q.id + JSON.stringify(q)),
    );
  });

  it('múltipla escolha "qual é a definição" tem 4 opções distintas, a correta é a literal do professor', () => {
    for (const d of definitionQuestions) {
      const q = closedDefinitionQuestions.find((c) => c.id === `defmc-${d.id.slice(4)}`);
      expect(q?.type).toBe('MULTIPLE_CHOICE');
      if (q?.type !== 'MULTIPLE_CHOICE') continue;
      expect(q.options.length).toBe(4);
      expect(new Set(q.options.map((o) => o.label)).size).toBe(4);
      expect(q.options.find((o) => o.id === q.correctOptionId)?.label).toBe(d.solution);
      expect(q.topic).toBe(d.topic);
    }
  });

  it('múltipla escolha invertida oferece nomes de conceito e acerta o de origem', () => {
    for (const d of definitionQuestions) {
      const q = closedDefinitionQuestions.find((c) => c.id === `defwho-${d.id.slice(4)}`);
      expect(q?.type).toBe('MULTIPLE_CHOICE');
      if (q?.type !== 'MULTIPLE_CHOICE') continue;
      expect(q.options.length).toBe(4);
      expect(q.options.find((o) => o.id === q.correctOptionId)?.label).toBe(d.concept);
      expect(q.prompt).toContain(d.solution);
    }
  });

  it('verdadeiro/falso: metade aproximada de cada, falsas usam definição de outro conceito', () => {
    let t = 0;
    let f = 0;
    for (const d of definitionQuestions) {
      const q = closedDefinitionQuestions.find((c) => c.id === `deftf-${d.id.slice(4)}`);
      expect(q?.type).toBe('TRUE_FALSE');
      if (q?.type !== 'TRUE_FALSE') continue;
      if (q.correctValue) {
        t++;
        expect(q.prompt).toContain(d.solution);
      } else {
        f++;
        expect(q.prompt).not.toContain(d.solution);
      }
    }
    expect(t).toBeGreaterThan(definitionQuestions.length * 0.35);
    expect(f).toBeGreaterThan(definitionQuestions.length * 0.35);
  });

  it('prefere distratores do mesmo tópico', () => {
    const d = definitionQuestions.find((x) => x.id === 'def-trail')!;
    const q = closedDefinitionQuestions.find((c) => c.id === 'defmc-trail');
    if (q?.type !== 'MULTIPLE_CHOICE') throw new Error('tipo');
    const sameTopic = definitionQuestions.filter((x) => x.topic === d.topic && x.id !== d.id).map((x) => x.solution);
    const distractors = q.options.filter((o) => o.id !== q.correctOptionId).map((o) => o.label);
    for (const label of distractors) expect(sameTopic).toContain(label);
  });
});
