import { Link, useParams } from 'react-router-dom';
import { ExerciseRenderer } from '@/engine/ExerciseRenderer';
import { getQuestion } from '@/content/questions';
import { recordAttempt } from '@/store/progress';
import { Button, Card } from '@/components/ui';
import { ExamRelevance } from './ExamRelevance';

/** Uma questão específica pelo id (link direto / depuração). Rota: /questao/:id */
export function QuestionPage() {
  const { id = '' } = useParams();
  const question = getQuestion(id);
  if (!question) {
    return (
      <Card padding="lg" className="mx-auto max-w-lg text-center">
        <p className="mb-4 text-sm text-[var(--color-text-secondary)]">Questão "{id}" não encontrada.</p>
        <Link to="/">
          <Button variant="secondary">Voltar ao início</Button>
        </Link>
      </Card>
    );
  }
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <p className="mono text-xs text-[var(--color-text-tertiary)]">{question.id}</p>
      <ExamRelevance question={question} />
      <Card padding="lg">
        <ExerciseRenderer
          key={question.id}
          question={question}
          onComplete={(r) =>
            recordAttempt({ questionId: question.id, topic: question.topic, correct: r.correct, hintsUsed: r.hintsUsed, timeMs: r.timeMs, timestamp: Date.now() })
          }
        />
      </Card>
    </div>
  );
}
