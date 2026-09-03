import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { ExerciseRenderer, type ExerciseResult } from '@/engine/ExerciseRenderer';
import { pickStudySession } from '@/content/questions';
import { topics, getTopic } from '@/content/topics';
import type { Question } from '@/content/types';
import { addStudySeconds, loadProgress, recordAttempt, topicWeight } from '@/store/progress';
import { Button, Card, IconChip, ProgressBar } from '@/components/ui';

type Phase = 'picker' | 'loading' | 'running' | 'done';

interface Answered {
  question: Question;
  correct: boolean;
}

interface TopicBreakdown {
  topicId: string;
  title: string;
  total: number;
  correct: number;
}

const DURATION_OPTIONS = [30, 60, 90, 120];
const LIVRE_MINUTES = 180;

function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

/** Sessão de estudo com duração escolhida (ou livre), questões ponderadas por tópicos fracos/alta chance de prova. Rota: /estudar/sessao */
export function DeepStudySession() {
  const [phase, setPhase] = useState<Phase>('picker');
  const [batch, setBatch] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState<Answered[]>([]);
  const [budgetSeconds, setBudgetSeconds] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startedAtRef = useRef(Date.now());

  useEffect(() => {
    if (phase !== 'running') return;
    const id = window.setInterval(() => {
      setElapsedSeconds(Math.round((Date.now() - startedAtRef.current) / 1000));
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  async function start(minutes: number, livre: boolean) {
    setPhase('loading');
    const state = await loadProgress();
    const weights: Record<string, number> = {};
    for (const topic of topics) {
      const examBoost = topic.examLikelihood === 'high' ? 1.5 : 1;
      weights[topic.id] = topicWeight(state, topic.id, examBoost);
    }
    const picked = pickStudySession(livre ? LIVRE_MINUTES : minutes, weights);
    setBatch(picked);
    setIndex(0);
    setAnswered([]);
    setBudgetSeconds(livre ? null : minutes * 60);
    setElapsedSeconds(0);
    startedAtRef.current = Date.now();
    if (picked.length === 0) {
      setPhase('done');
    } else {
      setPhase('running');
    }
  }

  function handleComplete(question: Question, result: ExerciseResult) {
    recordAttempt({
      questionId: question.id,
      topic: question.topic,
      correct: result.correct,
      hintsUsed: result.hintsUsed,
      timeMs: result.timeMs,
      timestamp: Date.now(),
    });
    const nextAnswered = [...answered, { question, correct: result.correct }];
    setAnswered(nextAnswered);
    const nextIndex = index + 1;
    setIndex(nextIndex);
    if (nextIndex >= batch.length) {
      const finalElapsed = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));
      setElapsedSeconds(finalElapsed);
      addStudySeconds(finalElapsed);
      setPhase('done');
    }
  }

  if (phase === 'picker' || phase === 'loading') {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="flex items-center justify-center gap-2 text-2xl font-semibold text-[var(--color-text-primary)]"><IconChip icon={BookOpen} tone="accent" /> Sessão de estudo</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">Escolha quanto tempo você tem — as questões são priorizadas pelos seus pontos fracos e pela chance de cair na P1.</p>
        </div>
        <Card padding="lg" className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {DURATION_OPTIONS.map((minutes) => (
              <Button key={minutes} variant="secondary" size="lg" disabled={phase === 'loading'} onClick={() => start(minutes, false)}>
                {minutes} min
              </Button>
            ))}
          </div>
          <Button variant="ghost" disabled={phase === 'loading'} onClick={() => start(LIVRE_MINUTES, true)}>
            Sessão livre — sem tempo definido
          </Button>
        </Card>
      </div>
    );
  }

  if (phase === 'done') {
    const correctCount = answered.filter((a) => a.correct).length;

    const breakdownMap = new Map<string, TopicBreakdown>();
    for (const a of answered) {
      const cur = breakdownMap.get(a.question.topic) ?? {
        topicId: a.question.topic,
        title: getTopic(a.question.topic)?.title ?? a.question.topic,
        total: 0,
        correct: 0,
      };
      cur.total += 1;
      if (a.correct) cur.correct += 1;
      breakdownMap.set(a.question.topic, cur);
    }
    const breakdown = [...breakdownMap.values()];

    return (
      <div className="mx-auto flex max-w-xl flex-col gap-4">
        <Card padding="lg" className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Sessão concluída</span>
            <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
              {correctCount}/{answered.length || batch.length} corretas
            </h1>
            <p className="mono text-sm text-[var(--color-text-secondary)]">Tempo estudado: {formatSeconds(elapsedSeconds)}</p>
          </div>

          {breakdown.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-[var(--color-text-secondary)]">Desempenho por tópico</p>
              <ul className="flex flex-col gap-1.5">
                {breakdown.map((b) => (
                  <li key={b.topicId} className="flex items-center justify-between gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 py-2 text-sm">
                    <span className="text-[var(--color-text-primary)]">{b.title}</span>
                    <span className="mono text-[var(--color-text-secondary)]">
                      {b.correct}/{b.total}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link to="/">
            <Button variant="secondary" fullWidth>
              Voltar ao início
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const question = batch[index];
  const remainingSeconds = budgetSeconds !== null ? Math.max(0, budgetSeconds - elapsedSeconds) : null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="flex items-center gap-2 text-lg font-semibold text-[var(--color-text-primary)]"><IconChip icon={BookOpen} tone="accent" size="sm" /> Sessão de estudo</h1>
        <div className="mono flex items-center gap-3 text-xs text-[var(--color-text-tertiary)]">
          <span>
            Questão {index + 1} de {batch.length}
          </span>
          <span>
            {remainingSeconds !== null ? `restam ${formatSeconds(remainingSeconds)}` : `decorridos ${formatSeconds(elapsedSeconds)}`}
          </span>
        </div>
      </div>
      <ProgressBar value={index} max={batch.length} tone="cyan" showValue label="Progresso da sessão" />
      <Card padding="lg">
        <ExerciseRenderer key={question.id} question={question} onComplete={(r) => handleComplete(question, r)} />
      </Card>
    </div>
  );
}
