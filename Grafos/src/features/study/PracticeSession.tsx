import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { ExerciseRenderer, type ExerciseResult } from '@/engine/ExerciseRenderer';
import { pickNextPracticeQuestion } from '@/content/questions';
import { topics } from '@/content/topics';
import type { Question } from '@/content/types';
import { addStudySeconds, loadProgress, recordAttempt, topicWeight } from '@/store/progress';
import { Button, Card, IconChip, StatTile } from '@/components/ui';
import { ModuleFilter } from './ModuleFilter';
import { topicIdsForModule, useModuleParam } from './moduleScope';

const RECENT_LIMIT = 10;

function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

/**
 * "Prática livre" — sem simulado, sem tempo fixo, sem fim pré-definido:
 * pede uma questão da matéria toda de cada vez, ponderada por pontos
 * fracos e chance de prova, até o aluno decidir parar. Rota: /estudar/pratica-livre
 */
export function PracticeSession() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [answered, setAnswered] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [moduleId, setModuleId] = useModuleParam();
  const startedAtRef = useRef(Date.now());
  const lastSavedSecondsRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    loadProgress().then((state) => {
      if (cancelled) return;
      const w: Record<string, number> = {};
      for (const topic of topics) {
        const examBoost = topic.examLikelihood === 'high' ? 1.5 : topic.examLikelihood === 'medium' ? 1 : 0.7;
        w[topic.id] = topicWeight(state, topic.id, examBoost);
      }
      setWeights(w);
      setQuestion(pickNextPracticeQuestion([], w, topicIdsForModule(moduleId)) ?? null);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function changeModule(id: string) {
    setModuleId(id);
    setQuestion(pickNextPracticeQuestion(recentIds, weights, topicIdsForModule(id)) ?? null);
  }

  useEffect(() => {
    return () => {
      const elapsed = Math.round((Date.now() - startedAtRef.current) / 1000);
      const delta = elapsed - lastSavedSecondsRef.current;
      if (delta > 0) addStudySeconds(delta);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleComplete(result: ExerciseResult) {
    if (!question) return;
    recordAttempt({
      questionId: question.id,
      topic: question.topic,
      correct: result.correct,
      hintsUsed: result.hintsUsed,
      timeMs: result.timeMs,
      timestamp: Date.now(),
    });
    setAnswered((n) => n + 1);
    if (result.correct) setCorrect((n) => n + 1);

    const nextRecent = [...recentIds, question.id].slice(-RECENT_LIMIT);
    setRecentIds(nextRecent);
    setQuestion(pickNextPracticeQuestion(nextRecent, weights, topicIdsForModule(moduleId)) ?? null);

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
          <IconChip icon={Dumbbell} tone="accent" size="sm" /> Prática livre
        </h1>
        <Link to="/">
          <Button variant="ghost" size="sm">
            Parar e sair
          </Button>
        </Link>
      </div>
      <p className="-mt-2 text-xs text-[var(--color-text-tertiary)]">
        Sem simulado, sem tempo fixo — questões da matéria inteira ou de um módulo (ponderadas pelos seus pontos fracos e pela chance de
        cair na P1), uma atrás da outra. Saia quando quiser.
      </p>

      <ModuleFilter value={moduleId} onChange={changeModule} tone="success" />

      <div className="grid grid-cols-3 gap-3">
        <StatTile label="Respondidas" value={answered} />
        <StatTile label="Acerto" value={`${accuracy}%`} />
        <StatTile label="Tempo" value={formatSeconds(Math.round((Date.now() - startedAtRef.current) / 1000))} />
      </div>

      <Card>
        {question ? (
          <ExerciseRenderer key={`${question.id}-${answered}`} question={question} onComplete={handleComplete} />
        ) : (
          <p className="text-sm text-[var(--color-text-secondary)]">Carregando…</p>
        )}
      </Card>
    </div>
  );
}
