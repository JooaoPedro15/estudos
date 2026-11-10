import { describe, expect, it } from 'vitest';
import { definitionQuestions } from './index';
import { closedDefinitionQuestions, descriptionWithoutName, generateClosedQuestions } from './closed';

describe('questões fechadas geradas das definições', () => {
  it('gera 1 por definição, com ids estáveis e definitionId apontando para a origem', () => {
    expect(closedDefinitionQuestions.length).toBe(definitionQuestions.length);
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

  it('múltipla escolha tem 4 descrições distintas sem o nome do conceito na correta', () => {
    for (const d of definitionQuestions) {
      const q = closedDefinitionQuestions.find((c) => c.id === `defmc-${d.id.slice(4)}`);
      expect(q?.type).toBe('MULTIPLE_CHOICE');
      if (q?.type !== 'MULTIPLE_CHOICE') continue;
      expect(q.options.length).toBe(4);
      expect(new Set(q.options.map((o) => o.label)).size).toBe(4);
      const correct = q.options.find((o) => o.id === q.correctOptionId)?.label;
      expect(correct).toBeTruthy();
      expect(correct).toBe(descriptionWithoutName(d));
      expect(correct?.toLocaleLowerCase()).not.toContain(d.concept.replace(/\s*\([^)]*\)/g, '').toLocaleLowerCase());
      expect(q.topic).toBe(d.topic);
    }
  });

  it('não mostra a definição literal no enunciado da pergunta', () => {
    for (const d of definitionQuestions) {
      const q = closedDefinitionQuestions.find((c) => c.id === `defmc-${d.id.slice(4)}`);
      expect(q?.prompt).not.toContain(d.solution);
    }
    expect(closedDefinitionQuestions.some((q) => q.id.startsWith('defwho-'))).toBe(false);
  });

  it('prefere distratores do mesmo tópico', () => {
    const d = definitionQuestions.find((x) => x.id === 'def-trail')!;
    const q = closedDefinitionQuestions.find((c) => c.id === 'defmc-trail');
    if (q?.type !== 'MULTIPLE_CHOICE') throw new Error('tipo');
    const sameTopic = definitionQuestions.filter((x) => x.topic === d.topic && x.id !== d.id).map(descriptionWithoutName);
    const distractors = q.options.filter((o) => o.id !== q.correctOptionId).map((o) => o.label);
    for (const label of distractors) expect(sameTopic).toContain(label);
  });
});
