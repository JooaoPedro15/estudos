import { useMemo } from 'react';
import { provasSilvioP2 } from '@/content/questions/12-p2-provas-silvio';
import { ClosedExamSimulator } from './ClosedExamSimulator';

export function CodeMemoryReviewPage() {
  const items = useMemo(() => [...new Map(provasSilvioP2.flatMap((prova) => prova.questions).map((item) => [item.question.id, item])).values()], []);
  return <ClosedExamSimulator examTitle="Revisão de códigos" items={items} elapsedSeconds={0} timerEnabled={false} onlyDue />;
}
