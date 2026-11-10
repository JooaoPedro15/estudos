import { beforeAll, describe, expect, it } from 'vitest';
import { setActiveExam } from '@/store/activeExam';
import { topicIdsForExam } from '@/content/modules';
import { examFamiliesFor } from '@/content/examFamilies';
import { exams, getExam, realExams } from '@/content/exams';
import { P2_SIMULATION_POOL } from '@/content/randomP2Exams';
import { provasSilvioP2 } from './12-p2-provas-silvio';
import { isExamDrillQuestion, isOpenExamQuestion, pickNextExamDrill, pickQuickReview, questions } from './index';

beforeAll(() => setActiveExam('P2'));

describe('P2', () => {
  it('treino de prova só sorteia famílias da P2', () => {
    const p2 = new Set(examFamiliesFor('P2').map((f) => f.id));
    for (let i = 0; i < 300; i++) expect(p2.has(pickNextExamDrill([], [])!.examFamily!)).toBe(true);
  });

  it('toda família da P2 tem questão fechada e o modo aberto devolve resposta-modelo', () => {
    for (const f of examFamiliesFor('P2')) expect(questions.some((q) => q.examFamily === f.id && isExamDrillQuestion(q)), f.id).toBe(true);
    for (let i = 0; i < 200; i++) {
      const q = pickNextExamDrill([], [], 'open')!;
      expect(isOpenExamQuestion(q)).toBe(true);
      if (q.type === 'PROOF_OR_JUSTIFICATION') expect(q.examAnswer, q.id).toBeTruthy();
    }
  });

  it('revisão rápida da P2 só usa tópicos da P2', () => {
    const topics = new Set(topicIdsForExam('P2'));
    for (let i = 0; i < 50; i++) for (const q of pickQuickReview(5, [...topics])) expect(topics.has(q.topic), q.id).toBe(true);
  });

  it('todo tópico da P2 tem questão', () => {
    for (const t of topicIdsForExam('P2')) expect(questions.some((q) => q.topic === t), t).toBe(true);
  });

  it('simulados e prova real da P2: pesos somam 100 e as questões existem no banco', () => {
    const byId = new Map(questions.map((q) => [q.id, q]));
    const originalWeights = new Map(provasSilvioP2.flatMap((prova) =>
      prova.questions.map(({ question, weightPercent }) => [question.id, weightPercent] as const),
    ));
    for (const exam of [...exams, ...realExams].filter((e) => e.prova === 'P2' && !e.randomized)) {
      const printed: Record<string, number> = { 'prova-silvio-20xx-p7': 105, 'prova-silvio-20xx-p8': 110 };
      expect(exam.questions.reduce((a, x) => a + x.weightPercent, 0), exam.id).toBe(printed[exam.id] ?? 100);
      for (const { questionId, weightPercent } of exam.questions) {
        expect(byId.get(questionId), questionId).toBeTruthy();
        expect(byId.get(questionId)!.examAnswer, questionId).toBeTruthy();
        if (exam.kind !== 'real') expect(weightPercent, `${exam.id}: ${questionId}`).toBe(originalWeights.get(questionId));
      }
    }
  });

  it('simulados sorteados misturam temas e preservam os pesos do professor', () => {
    const byId = new Map(questions.map((q) => [q.id, q]));
    const bucket = new Map(P2_SIMULATION_POOL.map((q) => [q.id, q.bucket] as const));
    const originalWeights = new Map(provasSilvioP2.flatMap((prova) =>
      prova.questions.map(({ question, weightPercent }) => [question.id, weightPercent] as const),
    ));
    for (const card of exams.filter((e) => e.prova === 'P2' && e.randomized)) {
      const seen = new Set<string>();
      let previous = '';
      for (let i = 0; i < 50; i++) {
        const drawn = getExam(card.id)!;
        const refs = drawn.questions;
        expect(refs.length).toBeGreaterThanOrEqual(3);
        expect(refs.length).toBeLessThanOrEqual(5);
        expect(refs.reduce((sum, q) => sum + q.weightPercent, 0)).toBe(100);
        expect(new Set(refs.map((q) => q.questionId)).size).toBe(refs.length);
        const buckets = refs.map((q) => bucket.get(q.questionId));
        expect(buckets).toContain('recorrente');
        expect(buckets).toContain('geral');
        expect(buckets.filter((b) => b === (card.randomized === 'equilibrado' ? 'geral' : 'recorrente')).length).toBeGreaterThanOrEqual(2);
        for (const { questionId, weightPercent } of refs) {
          expect(weightPercent, questionId).toBe(originalWeights.get(questionId));
          expect(byId.get(questionId)?.examAnswer, questionId).toBeTruthy();
        }
        const signature = refs.map((q) => q.questionId).sort().join(',');
        expect(signature).not.toBe(previous);
        seen.add(signature);
        previous = signature;
      }
      expect(seen.size).toBeGreaterThan(1);
    }
  });
});
