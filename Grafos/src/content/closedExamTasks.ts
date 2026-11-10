import type { Question } from './types';
import { codePuzzles } from './codePuzzles';
import { answerParts, keyTerms, type AnswerPart } from './answerParts';

export interface ExamQuestionItem {
  question: Question;
  weightPercent: number;
}

/** Uma parte da resposta-modelo para reconstruir de memória. */
export interface PartTask {
  kind: 'part';
  id: string;
  question: Question;
  questionNumber: number;
  weightPercent: number;
  part: AnswerPart;
  partNumber: number;
  /** Todas as partes da resposta desta questão, na ordem da prova (o "esqueleto"). */
  outline: { id: string; itemLabel: string | null; label: string }[];
  /** Termos de outras partes da mesma questão, usados como distratores nas lacunas. */
  distractors: string[];
}

export interface ChoiceTask {
  kind: 'choice';
  id: string;
  question: Question;
  questionNumber: number;
  weightPercent: number;
  stem: string;
  options: { id: string; label: string }[];
  correctId: string;
  explanation: string;
}

/** Fecha a questão: recitar a resposta inteira, só com o esqueleto como pista. */
export interface FullTask {
  kind: 'full';
  id: string;
  question: Question;
  questionNumber: number;
  weightPercent: number;
  outline: PartTask['outline'];
  terms: string[];
}

export type ClosedExamTask = PartTask | ChoiceTask | FullTask;

const puzzle = (id: string, label: string): AnswerPart[] => {
  const lines = codePuzzles.find((item) => item.id === id)!.lines;
  return [{ mode: 'code', itemLabel: null, itemPrompt: null, label: `Pseudocódigo ${label}`, units: lines }];
};

/** Respostas em prosa nas provas; os mesmos algoritmos estão em pseudocódigo no treino. */
const extraCode: Record<string, AnswerPart[]> = {
  'ps-2021-2-q3': [...puzzle('kruskal', 'KRUSKAL'), ...puzzle('prim', 'PRIM'), ...puzzle('dijkstra', 'DIJKSTRA')],
  'ps-20xx7-q2': [...puzzle('kruskal', 'KRUSKAL'), ...puzzle('prim', 'PRIM'), ...puzzle('dijkstra', 'DIJKSTRA')],
};

export function buildClosedExamTasks(items: ExamQuestionItem[]): ClosedExamTask[] {
  return items.flatMap<ClosedExamTask>(({ question, weightPercent }, questionIndex) => {
    const questionNumber = questionIndex + 1;
    if (question.type === 'MULTIPLE_CHOICE') {
      return [{
        kind: 'choice', id: `${question.id}:choice`, question, questionNumber, weightPercent,
        stem: question.prompt, options: question.options, correctId: question.correctOptionId,
        explanation: question.examAnswer ?? question.solution ?? '',
      }];
    }
    const parts = answerParts(question);
    if (!parts.some((part) => part.mode === 'code')) parts.push(...(extraCode[question.id] ?? []));
    const outline = parts.map((part, index) => ({ id: `${question.id}:p${index}`, itemLabel: part.itemLabel, label: part.label }));
    const terms = parts.map(keyTerms);
    const partTasks = parts.map((part, index): PartTask => ({
      kind: 'part', id: outline[index].id, question, questionNumber, weightPercent, part,
      partNumber: index + 1, outline,
      distractors: [...new Set(terms.flatMap((list, other) => other === index ? [] : list))].filter((term) => !terms[index].includes(term)),
    }));
    if (partTasks.length < 2) return partTasks;
    return [...partTasks, { kind: 'full', id: `${question.id}:full`, question, questionNumber, weightPercent, outline, terms: [...new Set(terms.flat())] }];
  });
}
