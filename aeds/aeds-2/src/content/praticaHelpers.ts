import type {
  FunctionChoiceStep,
  FunctionRequirement,
  FunctionStep,
  JudgeProblemRef,
  StructureVisual,
} from '../types/content';

/**
 * Construtores curtos usados pelos catalogos de prova pratica
 * (prova1Pratica*.ts). Ficam num arquivo so pra que os catalogos por tema
 * nao repitam a mesma fabrica de objetos.
 */

export function req(id: string, label: string, code: string): FunctionRequirement {
  return { id, label, code };
}

export function visual(kind: StructureVisual['kind'], title: string, caption: string, labels: string[]): StructureVisual {
  return { kind, title, caption, labels };
}

export type FunctionExamStep = FunctionStep & { skillId: 'program' };

export function functionStep(step: Omit<FunctionExamStep, 'kind' | 'skillId'>): FunctionExamStep {
  return { kind: 'function', skillId: 'program', ...step };
}

export type FunctionChoiceExamStep = FunctionChoiceStep & { skillId: 'program' };

export function functionChoiceStep(step: Omit<FunctionChoiceExamStep, 'kind' | 'skillId'>): FunctionChoiceExamStep {
  return { kind: 'function-choice', skillId: 'program', ...step };
}

/**
 * Problema do beecrowd (antigo URI Online Judge). `url` e a pagina de
 * submissao (pede login); `statementUrl` e o enunciado original publico.
 */
export function beecrowd(problemId: string, name: string, timeLimitSeconds: number): JudgeProblemRef {
  return {
    site: 'beecrowd',
    problemId,
    name,
    url: `https://judge.beecrowd.com/pt/problems/view/${problemId}`,
    statementUrl: `https://resources.beecrowd.com/repository/UOJ_${problemId}.html`,
    timeLimit: `${timeLimitSeconds}s`,
  };
}

export function leetcode(problemId: string, slug: string, name: string): JudgeProblemRef {
  return { site: 'LeetCode', problemId, name, url: `https://leetcode.com/problems/${slug}/` };
}

export function codewars(kataId: string, name: string): JudgeProblemRef {
  return { site: 'Codewars', problemId: kataId, name, url: `https://www.codewars.com/kata/${kataId}` };
}
