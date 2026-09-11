import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';
import clsx from 'clsx';
import { ExerciseRenderer, type ExerciseResult } from '@/engine/ExerciseRenderer';
import { isDefinitionQuestion, pickNextDefinition, questions } from '@/content/questions';
import { modules } from '@/content/modules';
import type { Question, QuestionAttempt } from '@/content/types';
import { addStudySeconds, loadProgress, recordAttempt } from '@/store/progress';
import { Button, Card, IconChip, StatTile } from '@/components/ui';

const RECENT_LIMIT = 15;
const ALL_MODULES = 'todos';

function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

/**
 * "Decorar conceitos" — só questões "defina o conceito de X", uma atrás da
 * outra, sem fim pré-definido. Prioriza o que você errou ou nunca viu (ver
 * `pickNextDefinition`), com filtro por módulo. Serve para os "10 minutinhos"
 * de decoreba das definições do professor. Rota: /estudar/conceitos
 */
export function ConceptDrillSession() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [moduleId, setModuleId] = useState<string>(ALL_MODULES);
  const [answered, setAnswered] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const startedAtRef = useRef(Date.now());
  const lastSavedSecondsRef = useRef(0);

  const totalDefinitions = questions.filter(isDefinitionQuestion).length;
  const seenDefinitions = new Set(attempts.filter((a) => a.questionId.startsWith('def-')).map((a) => a.questionId)).size;

  const topicIdsFor = (id: string) => (id === ALL_MODULES ? undefined : modules.find((m) => m.id === id)?.topicIds);

  useEffect(() => {
    let cancelled = false;
    loadProgress().then((state) => {
      if (cancelled) return;
      setAttempts(state.attempts);
      setQuestion(pickNextDefinition([], state.attempts, topicIdsFor(ALL_MODULES)) ?? null);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      const elapsed = Math.round((Date.now() - startedAtRef.current) / 1000);
      const delta = elapsed - lastSavedSecondsRef.current;
      if (delta > 0) addStudySeconds(delta);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function changeModule(id: string) {
    setModuleId(id);
    setQuestion(pickNextDefinition(recentIds, attempts, topicIdsFor(id)) ?? null);
  }

  function handleComplete(result: ExerciseResult) {
    if (!question) return;
    const attempt: QuestionAttempt = {
      questionId: question.id,
      topic: question.topic,
      correct: result.correct,
      hintsUsed: result.hintsUsed,
      timeMs: result.timeMs,
      timestamp: Date.now(),
    };
    recordAttempt(attempt);
    const nextAttempts = [...attempts, attempt];
    setAttempts(nextAttempts);
    setAnswered((n) => n + 1);
    if (result.correct) setCorrect((n) => n + 1);

    const nextRecent = [...recentIds, question.id].slice(-RECENT_LIMIT);
    setRecentIds(nextRecent);
    setQuestion(pickNextDefinition(nextRecent, nextAttempts, topicIdsFor(moduleId)) ?? null);

    const elapsed = Math.round((Date.now() - startedAtRef.current) / 1000);
    if (elapsed - lastSavedSecondsRef.current >= 60) {
      addStudySeconds(elapsed - lastSavedSecondsRef.current);
      lastSavedSecondsRef.current = elapsed;
    }
  }

  const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 text-lg font-semibold text-[var(--color-text-primary)]">
          <IconChip icon={Brain} tone="cyan" size="sm" /> Decorar conceitos
        </h1>
        <Link to="/">
          <Button variant="ghost" size="sm">
            Parar e sair
          </Button>
        </Link>
      </div>
      <p className="-mt-2 text-xs text-[var(--color-text-tertiary)]">
        Só "defina o conceito de…", uma atrás da outra. Escreva de memória, compare com a definição literal do professor e marque o que
        cobriu. Prioriza o que você errou ou ainda não viu.
      </p>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por módulo">
        {[{ id: ALL_MODULES, shortTitle: 'Todos' }, ...modules].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => changeModule(m.id)}
            aria-pressed={moduleId === m.id}
            className={clsx(
              'rounded-full border px-3 py-1 text-xs font-medium transition',
              moduleId === m.id
                ? 'border-[var(--color-cyan)]/45 bg-[var(--color-cyan-soft)] text-[var(--color-cyan)]'
                : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]',
            )}
          >
            {m.shortTitle}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Respondidas" value={answered} />
        <StatTile label="Acerto" value={`${accuracy}%`} />
        <StatTile label="Vistas" value={`${seenDefinitions}/${totalDefinitions}`} />
        <StatTile label="Tempo" value={formatSeconds(Math.round((Date.now() - startedAtRef.current) / 1000))} />
      </div>

      <Card>
        {question ? (
          <ExerciseRenderer key={`${question.id}-${answered}`} question={question} onComplete={handleComplete} />
        ) : (
          <p className="text-sm text-[var(--color-text-secondary)]">{loaded ? 'Nenhuma definição neste módulo.' : 'Carregando…'}</p>
        )}
      </Card>
    </div>
  );
}
