import { beforeAll, describe, expect, it } from 'vitest';
import { setActiveExam } from '@/store/activeExam';
import { topicIdsForExam } from '@/content/modules';
import { examFamiliesFor } from '@/content/examFamilies';
import { exams, realExams } from '@/content/exams';
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
    for (const exam of [...exams, ...realExams].filter((e) => e.prova === 'P2')) {
      expect(exam.questions.reduce((a, x) => a + x.weightPercent, 0), exam.id).toBe(100);
      for (const { questionId } of exam.questions) {
        expect(byId.get(questionId), questionId).toBeTruthy();
        expect(byId.get(questionId)!.examAnswer, questionId).toBeTruthy();
      }
    }
  });
});
