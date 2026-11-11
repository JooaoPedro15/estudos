import { describe, expect, it } from 'vitest';
import { buildClosedExamTasks } from './closedExamTasks';
import { answerParts, buildCloze } from './answerParts';
import { drawP2Simulation } from './randomP2Exams';
import { exams, realExams } from './exams';
import { provasSilvioP2 } from './questions/12-p2-provas-silvio';
import { getQuestion } from './questions';

const squash = (text: string): string => text.replace(/\s+/g, '');
const allQuestions = [...new Set(realExams.flatMap((exam) => exam.questions.map((ref) => ref.questionId)))].map((id) => getQuestion(id)!);
const itemsOf = (id: string): (string | null)[] => [...new Set(answerParts(getQuestion(id)!).map((part) => part.itemLabel))];

describe('memorização da resposta-modelo', () => {
  it('as partes cobrem a resposta inteira de todas as provas reais, sem perder texto', () => {
    for (const question of allQuestions) {
      const answer = squash((question.examAnswer ?? question.solution ?? '').replace(/```[^\n]*/g, ''));
      const units = answerParts(question).flatMap((part) => part.units);
      let cursor = 0;
      for (const unit of units) {
        const found = answer.indexOf(squash(unit), cursor);
        expect(found, `${question.id}: ${unit}`).toBeGreaterThanOrEqual(0);
        cursor = found + squash(unit).length;
      }
      // O que sobra fora das partes são só os marcadores de item ("a)", "(ii)").
      expect(units.reduce((sum, unit) => sum + squash(unit).length, 0), question.id).toBeGreaterThan(answer.length * 0.97);
    }
  });

  it('identifica o item respondido e mantém a ordem do enunciado', () => {
    expect(itemsOf('ps-2021-2-q1')).toEqual(['a)', 'b)']);
    expect(itemsOf('ps-2024-2-q2')).toEqual(['(i)', '(ii)']);
    expect(itemsOf('ps-2026-1-q2')).toEqual([null, '1.', '2.']);
  });

  it('toda prova real tem modo de memorização e fecha cada questão com a resposta inteira', () => {
    for (const exam of realExams) {
      const tasks = buildClosedExamTasks(exam.questions.map((ref) => ({ question: getQuestion(ref.questionId)!, weightPercent: ref.weightPercent })));
      expect(tasks.length, exam.id).toBeGreaterThan(0);
      tasks.forEach((task, index) => {
        if (task.kind === 'full') expect(tasks[index + 1]?.question.id, task.id).not.toBe(task.question.id);
      });
    }
  });

  it('cada passo tem identificador único e estável, para o progresso salvo não trocar de parte', () => {
    for (const exam of realExams) {
      const items = exam.questions.map((ref) => ({ question: getQuestion(ref.questionId)!, weightPercent: ref.weightPercent }));
      const ids = buildClosedExamTasks(items).map((task) => task.id);
      expect(new Set(ids).size, exam.id).toBe(ids.length);
      expect(buildClosedExamTasks(items).map((task) => task.id), exam.id).toEqual(ids);
    }
  });

  it('as lacunas mudam a cada repetição e nunca ficam vazias', () => {
    for (const question of allQuestions) for (const part of answerParts(question)) {
      expect(buildCloze(part, 0).answers.length, `${question.id}: ${part.label}`).toBeGreaterThan(0);
    }
    const part = answerParts(getQuestion('ps-2026-1-q2')!).find((item) => item.units.length >= 3)!;
    expect(buildCloze(part, 0).answers).not.toEqual(buildCloze(part, 1).answers);
  });

  it('os simulados sorteados continuam com pelo menos um pseudocódigo', () => {
    for (const mode of ['equilibrado', 'foco-recorrente'] as const) {
      for (let i = 0; i < 30; i++) {
        const items = drawP2Simulation(mode).map((ref) => ({ question: getQuestion(ref.questionId)!, weightPercent: ref.weightPercent }));
        expect(buildClosedExamTasks(items).some((task) => task.kind === 'part' && task.part.mode === 'code')).toBe(true);
      }
    }
  });

  it('o simulado "o que mais cai" usa só questões de provas reais de P2', () => {
    const exam = [...exams, ...realExams].find((item) => item.id === 'simulado-p2-mais-cai')!;
    const real = new Set(provasSilvioP2.flatMap((prova) => prova.questions.map(({ question }) => question.id)));
    expect(exam.questions.length).toBe(9);
    for (const ref of exam.questions) expect(real.has(ref.questionId), ref.questionId).toBe(true);
  });

  it('a parte 2 de "o que mais cai" usa questões reais que não estão na parte 1', () => {
    const find = (id: string) => [...exams, ...realExams].find((item) => item.id === id)!;
    const first = new Set(find('simulado-p2-mais-cai').questions.map((ref) => ref.questionId));
    const real = new Set(provasSilvioP2.flatMap((prova) => prova.questions.map(({ question }) => question.id)));
    const second = find('simulado-p2-mais-cai-2');
    expect(second.questions.length).toBe(8);
    for (const ref of second.questions) {
      expect(real.has(ref.questionId), ref.questionId).toBe(true);
      expect(first.has(ref.questionId), ref.questionId).toBe(false);
    }
  });
});
