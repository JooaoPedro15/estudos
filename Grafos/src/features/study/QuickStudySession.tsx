import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { ExerciseRenderer, type ExerciseResult } from '@/engine/ExerciseRenderer';
import { pickQuickReview } from '@/content/questions';
import { getTopic } from '@/content/topics';
import type { Question } from '@/content/types';
import { recordAttempt } from '@/store/progress';
import { Button, Card, IconChip, ProgressBar } from '@/components/ui';

const REVIEW_COUNT = 5;

interface Answered {
  question: Question;
  correct: boolean;
}

function formatElapsed(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

/** Revisão rápida de 5 questões `quick`, amostrando tópicos variados. Rota: /estudar/rapido */
export function QuickStudySession() {
  const [batch, setBatch] = useState<Question[]>(() => pickQuickReview(REVIEW_COUNT));
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState<Answered[]>([]);
  const startedAt = useRef(Date.now());
  const [elapsedMs, setElapsedMs] = useState(0);

  function handleComplete(question: Question, result: ExerciseResult) {
    recordAttempt({
      questionId: question.id,
      topic: question.topic,
      correct: result.correct,
      hintsUsed: result.hintsUsed,
      timeMs: result.timeMs,
      timestamp: Date.now(),
    });
    setAnswered((prev) => [...prev, { question, correct: result.correct }]);
    setIndex((i) => i + 1);
    if (index + 1 >= batch.length) {
      setElapsedMs(Date.now() - startedAt.current);
    }
  }

  function restart() {
    setBatch(pickQuickReview(REVIEW_COUNT));
    setIndex(0);
    setAnswered([]);
    startedAt.current = Date.now();
    setElapsedMs(0);
  }

  const done = index >= batch.length && batch.length > 0;

  if (done) {
    const correctCount = answered.filter((a) => a.correct).length;
    const wrongTopicTitles = [...new Set(answered.filter((a) => !a.correct).map((a) => a.question.topic))].map(
      (topicId) => getTopic(topicId)?.title ?? topicId,
    );

    return (
      <div className="mx-auto flex max-w-xl flex-col gap-4">
        <Card padding="lg" className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Revisão concluída</span>
            <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
              {correctCount}/{batch.length} corretas
            </h1>
            <p className="mono text-sm text-[var(--color-text-secondary)]">Tempo: {formatElapsed(elapsedMs)}</p>
          </div>

          {wrongTopicTitles.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-[var(--color-text-secondary)]">Você precisa revisar:</p>
              <ul className="list-inside list-disc text-sm text-[var(--color-text-secondary)]">
                {wrongTopicTitles.map((title) => (
                  <li key={title}>{title}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button onClick={restart}>Outra revisão rápida</Button>
            <Link to="/">
              <Button variant="secondary">Voltar ao início</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const question = batch[index];

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-lg font-semibold text-[var(--color-text-primary)]">
          <IconChip icon={Zap} tone="amber" size="sm" /> Revisão rápida
        </h1>
        <span className="mono text-xs text-[var(--color-text-tertiary)]">
          Questão {index + 1} de {batch.length}
        </span>
      </div>
      <ProgressBar value={(index / batch.length) * 100} />
      <Card padding="lg">
        <ExerciseRenderer key={question.id} question={question} onComplete={(r) => handleComplete(question, r)} />
      </Card>
    </div>
  );
}
