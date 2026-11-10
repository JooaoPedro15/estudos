import { useMemo } from 'react';
import { realExams } from '@/content/exams';
import { getQuestion } from '@/content/questions';
import type { ExamQuestionItem } from '@/content/closedExamTasks';
import { ClosedExamSimulator } from './ClosedExamSimulator';

/** Todas as questões das provas reais, sem repetição (o professor reaproveita questões). */
export function reviewItems(): ExamQuestionItem[] {
  const byId = new Map<string, ExamQuestionItem>();
  for (const exam of realExams) for (const ref of exam.questions) {
    const question = getQuestion(ref.questionId);
    if (question && !byId.has(question.id)) byId.set(question.id, { question, weightPercent: ref.weightPercent });
  }
  return [...byId.values()];
}

export function MemoryReviewPage() {
  const items = useMemo(() => reviewItems(), []);
  return <ClosedExamSimulator examTitle="Revisão espaçada" items={items} elapsedSeconds={0} timerEnabled={false} onlyDue />;
}
