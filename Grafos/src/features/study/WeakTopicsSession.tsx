import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, Zap } from 'lucide-react';
import { ExerciseRenderer, type ExerciseResult } from '@/engine/ExerciseRenderer';
import { pickWeakTopicSession } from '@/content/questions';
import { getTopic } from '@/content/topics';
import type { Question } from '@/content/types';
import { loadProgress, recordAttempt, weakestTopics } from '@/store/progress';
import { Button, Card, IconChip, ProgressBar } from '@/components/ui';

interface Answered {
  question: Question;
  correct: boolean;
}

export function WeakTopicsSession() {
  const [loading, setLoading] = useState(true);
  const [batch, setBatch] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState<Answered[]>([]);
  const startedAt = useRef(Date.now());

  async function startBatch() {
    setLoading(true);
    const state = await loadProgress();
    const weak = weakestTopics(state, 2, 6).map((s) => s.topic);
    const pool = weak.length > 0 ? weak : Array.from(new Set(state.attempts.map((a) => a.topic)));
    setBatch(pickWeakTopicSession(pool, 8));
    setIndex(0);
    setAnswered([]);
    startedAt.current = Date.now();
    setLoading(false);
  }

  useEffect(() => {
    startBatch();
  }, []);

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
  }

  if (loading) {
    return <p className="text-[var(--color-text-secondary)]">Carregando seus pontos fracos…</p>;
  }

  if (batch.length === 0) {
    return (
      <Card padding="lg" className="mx-auto max-w-lg text-center">
        <h1 className="mb-2 text-xl font-semibold text-[var(--color-text-primary)]">Ainda não há dados suficientes</h1>
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
          Responda algumas questões primeiro (numa revisão rápida ou sessão de estudo) para o GraphLab identificar seus pontos fracos.
        </p>
        <Link to="/estudar/rapido">
          <Button icon={<Zap size={15} />}>Fazer uma revisão rápida</Button>
        </Link>
      </Card>
    );
  }

  const done = index >= batch.length;

  if (done) {
    const correctCount = answered.filter((a) => a.correct).length;
    const wrongTopics = [...new Set(answered.filter((a) => !a.correct).map((a) => a.question.topic))];
    return (
      <Card padding="lg" className="mx-auto max-w-xl">
        <h1 className="mb-1 flex items-center gap-2 text-2xl font-semibold text-[var(--color-text-primary)]">
          <IconChip icon={Target} tone="danger" /> Pontos fracos — sessão concluída
        </h1>
        <p className="mb-6 text-[var(--color-text-secondary)]">
          {correctCount}/{batch.length} corretas
        </p>
        {wrongTopics.length > 0 && (
          <div className="mb-6">
            <p className="mb-2 text-sm font-medium text-[var(--color-text-secondary)]">Continue revisando:</p>
            <ul className="list-inside list-disc text-sm text-[var(--color-text-secondary)]">
              {wrongTopics.map((t) => (
                <li key={t}>{getTopic(t)?.title ?? t}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex gap-3">
          <Button onClick={startBatch}>Outra sessão de pontos fracos</Button>
          <Link to="/progresso">
            <Button variant="secondary">Ver progresso</Button>
          </Link>
        </div>
      </Card>
    );
  }

  const question = batch[index];

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-lg font-semibold text-[var(--color-text-primary)]">
          <IconChip icon={Target} tone="danger" size="sm" /> Meus pontos fracos
        </h1>
        <span className="mono text-xs text-[var(--color-text-tertiary)]">
          Questão {index + 1} de {batch.length}
        </span>
      </div>
      <ProgressBar value={(index / batch.length) * 100} />
      <Card>
        <ExerciseRenderer key={question.id} question={question} onComplete={(r) => handleComplete(question, r)} />
      </Card>
    </div>
  );
}
