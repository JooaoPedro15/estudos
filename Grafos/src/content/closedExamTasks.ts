import type { Question } from './types';
import { codePuzzles } from './codePuzzles';
import { checksForQuestion, type CheckKind, type CheckSpec } from './closedExamChecks';

export interface ExamQuestionItem {
  question: Question;
  weightPercent: number;
}

export interface CodeTask {
  kind: 'code';
  id: string;
  question: Question;
  questionNumber: number;
  weightPercent: number;
  blockNumber: number;
  codeName?: string;
  partNumber: number;
  partCount: number;
  previousLine?: string;
  lines: string[];
}

export interface ChoiceTask {
  kind: 'choice';
  id: string;
  question: Question;
  questionNumber: number;
  weightPercent: number;
  dimension: CheckKind | 'prova';
  stem: string;
  options: { id: string; label: string }[];
  correctId: string;
  explanation: string;
}

export type ClosedExamTask = CodeTask | ChoiceTask;

/** Cada bloco da resposta-modelo vira um ou mais puzzles curtos, sem descartar linhas. */
export function codeBlocks(answer: string): string[][] {
  return [...answer.matchAll(/```[^\n]*\n([\s\S]*?)```/g)]
    .map((match) => match[1].split('\n').map((line) => line.trimEnd()).filter((line) => line.trim().length > 0))
    .filter((lines) => lines.length >= 2);
}

function answerOf(question: Question): string {
  return question.examAnswer ?? question.solution ?? '';
}

const puzzleLines = (id: string): string[] => codePuzzles.find((puzzle) => puzzle.id === id)!.lines;

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function choiceFromSpec(spec: CheckSpec, question: Question, questionNumber: number, weightPercent: number, index: number): ChoiceTask {
  return {
    kind: 'choice', id: `${question.id}:choice:${index}`, question, questionNumber, weightPercent,
    dimension: spec.kind, stem: spec.stem,
    options: shuffle([{ id: 'correct', label: spec.correct }, ...spec.wrong.map((label, i) => ({ id: `wrong-${i}`, label }))]),
    correctId: 'correct', explanation: spec.explanation,
  };
}

/** Respostas em prosa nas provas; os mesmos algoritmos estão em pseudocódigo no treino. */
const proseAlgorithms: Record<string, string[][]> = {
  'ps-2021-2-q3': [puzzleLines('kruskal'), puzzleLines('prim'), puzzleLines('dijkstra')],
  'ps-20xx7-q2': [puzzleLines('kruskal'), puzzleLines('prim'), puzzleLines('dijkstra')],
  'ps-2024-2-q3': [[
    'PRIM_COM_ARESTA(G, pesos, e = (u, v)):',
    '  S ← {u, v}; T ← {e}',
    '  enquanto |S| < |V|:',
    '    escolher a aresta (x, y) de menor peso com x ∈ S e y ∉ S',
    '    adicionar (x, y) a T',
    '    adicionar y a S',
    '  F ← T sem a aresta e',
    '  retornar T, F',
  ]],
};

export function buildClosedExamTasks(items: ExamQuestionItem[], chunkSize = 8): ClosedExamTask[] {
  return items.flatMap<ClosedExamTask>(({ question, weightPercent }, questionIndex) => {
    const checks = checksForQuestion(question.id);
    const modelChecks = checks.flatMap((spec, index) => spec.kind === 'modelagem' ? [choiceFromSpec(spec, question, questionIndex + 1, weightPercent, index)] : []);
    const otherChecks = checks.flatMap((spec, index) => spec.kind !== 'modelagem' ? [choiceFromSpec(spec, question, questionIndex + 1, weightPercent, index)] : []);
    const blocks = codeBlocks(answerOf(question));
    if (blocks.length === 0) blocks.push(...(proseAlgorithms[question.id] ?? []));

    const codeTasks = blocks.flatMap<ClosedExamTask>((block, blockIndex) => {
      const partCount = Math.ceil(block.length / chunkSize);
      const codeName = block[0].trim().match(/^([A-Za-zÀ-ÿ_][\wÀ-ÿ]*)\s*\(/)?.[1];
      return Array.from({ length: partCount }, (_, partIndex): CodeTask => {
        const start = partIndex * chunkSize;
        return {
          kind: 'code', id: `${question.id}:code:${blockIndex}:${partIndex}`, question,
          questionNumber: questionIndex + 1, weightPercent,
          blockNumber: blockIndex + 1, codeName, partNumber: partIndex + 1, partCount,
          previousLine: start > 0 ? block[start - 1] : undefined,
          lines: block.slice(start, start + chunkSize),
        };
      });
    });
    if (question.type === 'MULTIPLE_CHOICE' && checks.length === 0) {
      return [{
        kind: 'choice', id: `${question.id}:choice:original`, question,
        questionNumber: questionIndex + 1, weightPercent, dimension: 'prova', stem: question.prompt,
        options: question.options, correctId: question.correctOptionId,
        explanation: question.examAnswer ?? question.solution ?? '',
      }];
    }
    return [...modelChecks, ...codeTasks, ...otherChecks];
  });
}
