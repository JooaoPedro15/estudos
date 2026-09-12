import { describe, expect, it } from 'vitest';
import type { QuestionAttempt } from '@/content/types';
import { modules } from '@/content/modules';
import {
  isDefinitionFamily,
  isDefinitionQuestion,
  isExamStyleQuestion,
  pickNextDefinition,
  pickNextPracticeQuestion,
  pickQuickReview,
  pickStudySession,
  questions,
} from './index';

const openDefs = questions.filter(isDefinitionQuestion);
const isClosedDef = (q: { type: string; definitionId?: string }) => q.type !== 'DEFINITION' && Boolean(q.definitionId);
const FUND = modules.find((m) => m.id === 'fundamentos')!.topicIds;

describe('pickQuickReview', () => {
  it('reserva 2 vagas para definições (1 aberta + 1 fechada) e 1 para estilo prova numa revisão de 5', () => {
    for (let i = 0; i < 30; i++) {
      const batch = pickQuickReview(5);
      expect(batch.length).toBe(5);
      expect(new Set(batch.map((q) => q.id)).size).toBe(5);
      expect(batch.filter(isDefinitionFamily).length).toBe(2);
      expect(batch.filter(isDefinitionQuestion).length).toBe(1);
      expect(batch.filter(isClosedDef).length).toBe(1);
      expect(batch.filter(isExamStyleQuestion).length).toBeGreaterThanOrEqual(1);
    }
  });
  it('numa revisão de 3 traz 1 definição', () => {
    for (let i = 0; i < 10; i++) expect(pickQuickReview(3).filter(isDefinitionFamily).length).toBe(1);
  });
  it('respeita o filtro de módulo', () => {
    for (let i = 0; i < 20; i++) for (const q of pickQuickReview(5, FUND)) expect(FUND).toContain(q.topic);
  });
});

describe('pickStudySession', () => {
  it('inclui definições (abertas e fechadas) sem passar de ~40% da sessão', () => {
    let open = 0;
    let closed = 0;
    for (let i = 0; i < 20; i++) {
      const batch = pickStudySession(60);
      const d = batch.filter(isDefinitionFamily).length;
      expect(d).toBeGreaterThan(0);
      expect(d).toBeLessThanOrEqual(Math.ceil(batch.length * 0.4));
      open += batch.filter(isDefinitionQuestion).length;
      closed += batch.filter(isClosedDef).length;
    }
    expect(open).toBeGreaterThan(0);
    expect(closed).toBeGreaterThan(0);
  });
  it('respeita o filtro de módulo', () => {
    for (let i = 0; i < 10; i++) {
      const batch = pickStudySession(60, undefined, FUND);
      expect(batch.length).toBeGreaterThan(0);
      for (const q of batch) expect(FUND).toContain(q.topic);
    }
  });
});

describe('pickNextPracticeQuestion', () => {
  it('sorteia definição em cerca de 35% das vezes, metade aberta e metade fechada', () => {
    let fam = 0;
    let open = 0;
    const N = 3000;
    for (let i = 0; i < N; i++) {
      const q = pickNextPracticeQuestion([])!;
      if (isDefinitionFamily(q)) fam++;
      if (isDefinitionQuestion(q)) open++;
    }
    expect(fam / N).toBeGreaterThan(0.27);
    expect(fam / N).toBeLessThan(0.43);
    expect(open / fam).toBeGreaterThan(0.38);
    expect(open / fam).toBeLessThan(0.62);
  });
  it('respeita a lista de exclusão e o filtro de módulo', () => {
    const exclude = questions.slice(0, questions.length - 1).map((q) => q.id);
    expect(pickNextPracticeQuestion(exclude)!.id).toBe(questions[questions.length - 1].id);
    for (let i = 0; i < 100; i++) expect(FUND).toContain(pickNextPracticeQuestion([], undefined, FUND)!.topic);
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

  it('modo aberto só devolve DEFINITION; fechado só geradas; misto alterna', () => {
    for (let i = 0; i < 40; i++) {
      expect(isDefinitionQuestion(pickNextDefinition([], [], undefined, 'open')!)).toBe(true);
      expect(isClosedDef(pickNextDefinition([], [], undefined, 'closed')!)).toBe(true);
      expect(isDefinitionFamily(pickNextDefinition([], [], undefined, 'mixed')!)).toBe(true);
    }
    let open = 0;
    for (let i = 0; i < 1000; i++) if (isDefinitionQuestion(pickNextDefinition([], [])!)) open++;
    expect(open / 1000).toBeGreaterThan(0.38);
    expect(open / 1000).toBeLessThan(0.62);
  });

  it('nunca repete ids excluídos', () => {
    const exclude = openDefs.slice(1).map((d) => d.id);
    expect(pickNextDefinition(exclude, [], undefined, 'open')!.id).toBe(openDefs[0].id);
  });

  it('prioriza erradas e nunca vistas sobre acertadas hoje', () => {
    const wrong = openDefs[3].id;
    const unseen = openDefs[7].id;
    const attempts = openDefs.filter((d) => d.id !== unseen).map((d) => attempt(d.id, d.id !== wrong, 0));
    const counts: Record<string, number> = {};
    for (let i = 0; i < 3000; i++) {
      const id = pickNextDefinition([], attempts, undefined, 'open')!.id;
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

describe('treino de prova', () => {
  it('toda questão de treino aponta para uma família registrada e toda família tem questão', async () => {
    const { examFamilies } = await import('@/content/examFamilies');
    const ids = new Set(examFamilies.map((f) => f.id));
    const withFamily = questions.filter((q) => q.examFamily);
    expect(withFamily.length).toBeGreaterThan(100);
    for (const q of withFamily) expect(ids.has(q.examFamily!), `${q.id}: ${q.examFamily}`).toBe(true);
    for (const f of examFamilies) expect(withFamily.some((q) => q.examFamily === f.id), f.id).toBe(true);
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length);
  });

  it('pickNextExamDrill sorteia famílias proporcionalmente ao nº de provas', async () => {
    const { pickNextExamDrill } = await import('./index');
    const { examFamilies, examFamilyWeight } = await import('@/content/examFamilies');
    const counts: Record<string, number> = {};
    const N = 4000;
    for (let i = 0; i < N; i++) {
      const q = pickNextExamDrill([], [])!;
      expect(q.examFamily).toBeTruthy();
      counts[q.examFamily!] = (counts[q.examFamily!] ?? 0) + 1;
    }
    const total = examFamilies.reduce((a, f) => a + examFamilyWeight(f), 0);
    for (const f of examFamilies) {
      const expected = examFamilyWeight(f) / total;
      const got = (counts[f.id] ?? 0) / N;
      expect(Math.abs(got - expected), `${f.id}: esperado ${expected.toFixed(3)}, obtido ${got.toFixed(3)}`).toBeLessThan(0.035);
    }
  });

  it('pickNextExamDrill evita os ids recentes', async () => {
    const { pickNextExamDrill } = await import('./index');
    const recent = questions.filter((q) => q.examFamily === 'pombos').map((q) => q.id).slice(1);
    for (let i = 0; i < 200; i++) {
      const q = pickNextExamDrill(recent, [])!;
      if (q.examFamily === 'pombos') expect(recent).not.toContain(q.id);
    }
  });
});

describe('conceitos que mais caem', () => {
  it('conceptExamWeights só tem ids existentes e grafo completo está entre os mais pesados', async () => {
    const { conceptExamWeights } = await import('@/content/examFamilies');
    const w = conceptExamWeights();
    const ids = new Set(openDefs.map((d) => d.id));
    for (const id of w.keys()) expect(ids.has(id), id).toBe(true);
    const top = [...w.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id]) => id);
    expect(top).toContain('def-grafo-completo');
  });

  it("pickNextDefinition com escopo 'exam' só devolve conceitos usados em prova", async () => {
    const { conceptExamWeights } = await import('@/content/examFamilies');
    const w = conceptExamWeights();
    for (let i = 0; i < 200; i++) {
      const q = pickNextDefinition([], [], undefined, 'mixed', 'exam')!;
      const concept = q.type === 'DEFINITION' ? q.id : q.definitionId!;
      expect(w.has(concept), concept).toBe(true);
    }
  });
});
