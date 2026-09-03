import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, ProgressBar } from '@/components/ui';
import { ExerciseRenderer, type ExerciseResult } from '@/engine/ExerciseRenderer';
import { flashFactsForMinutes } from '@/content/finalReview';
import { pickQuickReview } from '@/content/questions';
import { getTopic } from '@/content/topics';
import type { Question } from '@/content/types';
import { loadProgress, recordAttempt, weakestTopics } from '@/store/progress';

const DURATIONS = [5, 15, 30, 60] as const;
const QUESTIONS_BY_MINUTES: Record<(typeof DURATIONS)[number], number> = { 5: 3, 15: 6, 30: 10, 60: 15 };

export function FinalReviewPage() {
  const [minutes, setMinutes] = useState<(typeof DURATIONS)[number] | null>(null);
  const [weakTopicTitles, setWeakTopicTitles] = useState<string[]>([]);
  const [batch, setBatch] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    loadProgress().then((state) => {
      const weak = weakestTopics(state, 2, 4);
      setWeakTopicTitles(weak.map((s) => getTopic(s.topic)?.title ?? s.topic));
    });
  }, []);

  function start(m: (typeof DURATIONS)[number]) {
    setMinutes(m);
    setBatch(pickQuickReview(QUESTIONS_BY_MINUTES[m]));
    setIndex(0);
    setStarted(true);
  }

  function handleComplete(question: Question, result: ExerciseResult) {
    recordAttempt({ questionId: question.id, topic: question.topic, correct: result.correct, hintsUsed: result.hintsUsed, timeMs: result.timeMs, timestamp: Date.now() });
    setIndex((i) => i + 1);
  }

  if (!minutes) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">🚨 Revisão Final</h1>
          <p className="mt-1 text-[var(--color-text-secondary)]">Quanto tempo você tem antes da prova?</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {DURATIONS.map((m) => (
            <button
              key={m}
              onClick={() => start(m)}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-4 py-6 text-center shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-glow-accent)]"
            >
              <span className="block text-2xl font-bold text-[var(--color-text-primary)]">{m}</span>
              <span className="block text-xs text-[var(--color-text-tertiary)]">minutos</span>
            </button>
          ))}
        </div>

        {weakTopicTitles.length > 0 && (
          <Card padding="md">
            <p className="mb-2 text-sm font-medium text-[var(--color-danger)]">Erros que você mais comete:</p>
            <ul className="list-inside list-disc text-sm text-[var(--color-text-secondary)]">
              {weakTopicTitles.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    );
  }

  const facts = flashFactsForMinutes(minutes);
  const showQuestions = started && index < batch.length;
  const doneQuestions = started && index >= batch.length && batch.length > 0;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">🚨 Revisão Final — {minutes} min</h1>
        <button onClick={() => setMinutes(null)} className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]">
          trocar duração
        </button>
      </div>

      <Card padding="md">
        <p className="mb-3 text-sm font-medium text-[var(--color-text-secondary)]">Definições, convenções e fórmulas mais importantes</p>
        <ul className="flex flex-col gap-2">
          {facts.map((f) => (
            <li key={f.id} className="rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-[var(--color-text-primary)]">
              {f.text}
            </li>
          ))}
        </ul>
      </Card>

      {weakTopicTitles.length > 0 && (
        <Card padding="md">
          <p className="mb-2 text-sm font-medium text-[var(--color-danger)]">Seus pontos fracos:</p>
          <ul className="list-inside list-disc text-sm text-[var(--color-text-secondary)]">
            {weakTopicTitles.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Card>
      )}

      {!started && (
        <Button onClick={() => setStarted(true)} size="lg">
          Começar questões rápidas ({QUESTIONS_BY_MINUTES[minutes]})
        </Button>
      )}

      {showQuestions && (
        <>
          <ProgressBar value={(index / batch.length) * 100} label="progresso da revisão" />
          <Card>
            <ExerciseRenderer key={batch[index].id} question={batch[index]} onComplete={(r) => handleComplete(batch[index], r)} />
          </Card>
        </>
      )}

      {doneQuestions && (
        <Card padding="lg" className="text-center">
          <p className="mb-4 text-lg font-medium text-[var(--color-text-primary)]">Boa sorte na prova! 🍀</p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => start(minutes)}>Repetir revisão</Button>
            <Link to="/">
              <Button variant="secondary">Voltar ao início</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
