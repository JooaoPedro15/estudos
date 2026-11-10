import { describe, expect, it } from 'vitest';
import { codeBlocks, buildClosedExamTasks } from './closedExamTasks';
import { P2_SIMULATION_POOL, drawP2Simulation } from './randomP2Exams';
import { getQuestion } from './questions';
import { provasSilvioP2 } from './questions/12-p2-provas-silvio';
import { checksForQuestion } from './closedExamChecks';

describe('quebra-código dos simulados P2', () => {
  it('mantém todas as linhas dos pseudocódigos das questões sorteáveis', () => {
    const items = P2_SIMULATION_POOL.map(({ id }) => ({ question: getQuestion(id)!, weightPercent: 20 }));
    const tasks = buildClosedExamTasks(items, 8);

    for (const { question } of items) {
      const expected = codeBlocks(question.examAnswer ?? question.solution ?? '').flat();
      const actual = tasks
        .filter((task) => task.kind === 'code' && task.question.id === question.id)
        .flatMap((task) => task.kind === 'code' ? task.lines : []);
      if (expected.length > 0) expect(actual, question.id).toEqual(expected);
    }
  });

  it('inclui códigos escritos em prosa e alternativas específicas para definições', () => {
    const withCode = getQuestion('ps-2025-1-q2')!;
    const withoutCode = getQuestion('ps-2025-1-q1')!;
    const proseCode = getQuestion('ps-2021-2-q3')!;
    const tasks = buildClosedExamTasks([
      { question: withCode, weightPercent: 30 },
      { question: withoutCode, weightPercent: 25 },
      { question: proseCode, weightPercent: 30 },
    ]);
    expect(tasks.some((task) => task.kind === 'code' && task.question.id === withCode.id)).toBe(true);
    expect(tasks.some((task) => task.kind === 'choice' && task.question.id === withoutCode.id)).toBe(true);
    expect(tasks.filter((task) => task.kind === 'code' && task.question.id === proseCode.id).length).toBeGreaterThanOrEqual(3);
  });

  it('preserva os blocos de código de todas as provas P2 cadastradas', () => {
    const items = provasSilvioP2.flatMap((prova) => prova.questions);
    const tasks = buildClosedExamTasks(items);
    for (const { question } of items) {
      const expected = codeBlocks(question.examAnswer ?? question.solution ?? '').flat();
      const actual = tasks.filter((task) => task.kind === 'code' && task.question.id === question.id).flatMap((task) => task.kind === 'code' ? task.lines : []);
      if (expected.length > 0) expect(actual, question.id).toEqual(expected);
    }
  });

  it('ambos os tipos de simulado sorteiam pelo menos um desafio de código', () => {
    for (const mode of ['equilibrado', 'foco-recorrente'] as const) {
      for (let i = 0; i < 30; i++) {
        const items = drawP2Simulation(mode).map((ref) => ({ question: getQuestion(ref.questionId)!, weightPercent: ref.weightPercent }));
        expect(buildClosedExamTasks(items).some((task) => task.kind === 'code')).toBe(true);
      }
    }
  });

  it('treina modelagem, justificativa e exemplo no caminho crítico', () => {
    const question = getQuestion('ps-20xx6-q3')!;
    const tasks = buildClosedExamTasks([{ question, weightPercent: 30 }]);
    expect(tasks[0].kind).toBe('choice');
    expect(tasks.filter((task) => task.kind === 'code').length).toBeGreaterThanOrEqual(2);
    expect([...new Set(tasks.filter((task) => task.kind === 'code').map((task) => task.kind === 'code' ? task.codeName : ''))]).toEqual(['ORDEM_TOPOLOGICA', 'TEMPO_MINIMO']);
    expect(tasks.filter((task) => task.kind === 'choice').map((task) => task.kind === 'choice' ? task.dimension : '')).toEqual(['modelagem', 'justificativa', 'exemplo']);
  });

  it('tem alternativas curtas para cada questão do pool sorteado', () => {
    for (const { id } of P2_SIMULATION_POOL) {
      expect(checksForQuestion(id).length, id).toBeGreaterThan(0);
      const tasks = buildClosedExamTasks([{ question: getQuestion(id)!, weightPercent: 20 }]);
      expect(tasks.some((task) => task.kind === 'choice'), id).toBe(true);
    }
  });
});
