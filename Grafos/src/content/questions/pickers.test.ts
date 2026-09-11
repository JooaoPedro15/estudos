import { describe, expect, it } from 'vitest';
import type { QuestionAttempt } from '@/content/types';
import { isDefinitionQuestion, isExamStyleQuestion, pickNextDefinition, pickNextPracticeQuestion, pickQuickReview, pickStudySession, questions } from './index';

const defs = questions.filter(isDefinitionQuestion);

describe('pickQuickReview', () => {
  it('reserva 2 vagas para definições e 1 para estilo prova numa revisão de 5', () => {
    for (let i = 0; i < 30; i++) {
      const batch = pickQuickReview(5);
      expect(batch.length).toBe(5);
      expect(new Set(batch.map((q) => q.id)).size).toBe(5);
      expect(batch.filter(isDefinitionQuestion).length).toBe(2);
      expect(batch.filter(isExamStyleQuestion).length).toBeGreaterThanOrEqual(1);
    }
  });
  it('numa revisão de 3 traz 1 definição', () => {
    for (let i = 0; i < 10; i++) expect(pickQuickReview(3).filter(isDefinitionQuestion).length).toBe(1);
  });
});

describe('pickStudySession', () => {
  it('inclui definições sem passar de ~40% da sessão', () => {
    for (let i = 0; i < 20; i++) {
      const batch = pickStudySession(60);
      const d = batch.filter(isDefinitionQuestion).length;
      expect(d).toBeGreaterThan(0);
      expect(d).toBeLessThanOrEqual(Math.ceil(batch.length * 0.4));
    }
  });
});

describe('pickNextPracticeQuestion', () => {
  it('sorteia definição em cerca de 35% das vezes', () => {
    let d = 0;
    const N = 2000;
    for (let i = 0; i < N; i++) if (isDefinitionQuestion(pickNextPracticeQuestion([])!)) d++;
    expect(d / N).toBeGreaterThan(0.27);
    expect(d / N).toBeLessThan(0.43);
  });
  it('respeita a lista de exclusão', () => {
    const exclude = questions.slice(0, questions.length - 1).map((q) => q.id);
    expect(pickNextPracticeQuestion(exclude)!.id).toBe(questions[questions.length - 1].id);
  });
});

describe('pickNextDefinition', () => {
  const attempt = (questionId: string, correct: boolean, daysAgo: number): QuestionAttempt => ({
    questionId,
    topic: 'x',
    correct,
    hintsUsed: 0,
    timeMs: 1000,
    timestamp: Date.now() - daysAgo * 86_400_000,
  });

  it('só devolve definições e nunca repete ids excluídos', () => {
    const q = pickNextDefinition([], []);
    expect(q && isDefinitionQuestion(q)).toBe(true);
    const exclude = defs.slice(1).map((d) => d.id);
    expect(pickNextDefinition(exclude, [])!.id).toBe(defs[0].id);
  });

  it('prioriza erradas e nunca vistas sobre acertadas hoje', () => {
    // Tudo acertado hoje, exceto uma errada e uma nunca vista.
    const wrong = defs[3].id;
    const unseen = defs[7].id;
    const attempts = defs.filter((d) => d.id !== unseen).map((d) => attempt(d.id, d.id !== wrong, 0));
    const counts: Record<string, number> = {};
    for (let i = 0; i < 3000; i++) {
      const id = pickNextDefinition([], attempts)!.id;
      counts[id] = (counts[id] ?? 0) + 1;
    }
    const others = Object.entries(counts).filter(([id]) => id !== wrong && id !== unseen).map(([, c]) => c);
    const avgOther = others.reduce((a, b) => a + b, 0) / Math.max(1, others.length);
    expect(counts[wrong]).toBeGreaterThan(avgOther * 4);
    expect(counts[unseen]).toBeGreaterThan(avgOther * 3);
  });

  it('filtra por tópicos quando pedido', () => {
    for (let i = 0; i < 50; i++) expect(pickNextDefinition([], [], ['teoria-de-conjuntos'])!.topic).toBe('teoria-de-conjuntos');
  });
});
