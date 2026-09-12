import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Flame } from 'lucide-react';
import { ExerciseRenderer, type ExerciseResult } from '@/engine/ExerciseRenderer';
import { pickNextExamDrill, questions } from '@/content/questions';
import { TOTAL_EXAMS, examFamilies, examFamilyWeight } from '@/content/examFamilies';
import type { Question, QuestionAttempt } from '@/content/types';
import { addStudySeconds, loadProgress, recordAttempt } from '@/store/progress';
import { Button, Card, IconChip, StatTile } from '@/components/ui';
import { ExamRelevance } from './ExamRelevance';

const RECENT_LIMIT = 12;
const FAMILIES_BY_WEIGHT = [...examFamilies].sort((a, b) => examFamilyWeight(b) - examFamilyWeight(a));
const TOTAL_WEIGHT = examFamilies.reduce((acc, f) => acc + examFamilyWeight(f), 0);
const QUESTIONS_PER_FAMILY = new Map(examFamilies.map((f) => [f.id, questions.filter((q) => q.examFamily === f.id).length]));

function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

/**
 * "Treino de prova" — só questões que caíram nas provas antigas (ou variantes
 * com números trocados), uma atrás da outra, sem fim. A família que caiu em
 * mais provas aparece mais vezes (ver `pickNextExamDrill`). Rota: /estudar/prova
 */
export function ExamDrillSession() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [answered, setAnswered] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [showTable, setShowTable] = useState(false);
  const startedAtRef = useRef(Date.now());
  const lastSavedSecondsRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    loadProgress().then((state) => {
      if (cancelled) return;
      setAttempts(state.attempts);
      setQuestion(pickNextExamDrill([], state.attempts) ?? null);
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
    setQuestion(pickNextExamDrill(nextRecent, nextAttempts) ?? null);

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
          <IconChip icon={Flame} tone="danger" size="sm" /> Treino de prova
        </h1>
        <Link to="/">
          <Button variant="ghost" size="sm">
            Parar e sair
          </Button>
        </Link>
      </div>
      <p className="-mt-2 text-xs text-[var(--color-text-tertiary)]">
        Só o que caiu nas {TOTAL_EXAMS} provas antigas do professor — a pergunta da prova e variantes com números trocados. O que caiu em mais
        provas aparece mais vezes. Sem fim: saia quando quiser.
      </p>

      <button
        type="button"
        onClick={() => setShowTable((v) => !v)}
        className="flex w-fit items-center gap-1.5 text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
      >
        {showTable ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {showTable ? 'Ocultar' : 'Ver'} o que mais cai ({examFamilies.length} famílias)
      </button>
      {showTable && (
        <Card padding="md" className="flex flex-col gap-1.5">
          {FAMILIES_BY_WEIGHT.map((f) => (
            <div key={f.id} className="flex items-start gap-3 text-xs">
              <span className="mono w-14 shrink-0 text-[var(--color-danger)]">
                {f.appearances.length}/{TOTAL_EXAMS}
                {f.scopeUncertain ? '*' : ''}
              </span>
              <span className="mono w-10 shrink-0 text-[var(--color-text-tertiary)]">{Math.round((examFamilyWeight(f) / TOTAL_WEIGHT) * 100)}%</span>
              <span className="flex-1 leading-relaxed text-[var(--color-text-secondary)]">
                {f.title} <span className="text-[var(--color-text-tertiary)]">({QUESTIONS_PER_FAMILY.get(f.id) ?? 0} questões)</span>
              </span>
            </div>
          ))}
          <p className="pt-1 text-[11px] text-[var(--color-text-tertiary)]">
            % = frequência no sorteio. * = cronograma 2026/2 põe depois da P1; peso pela metade.
          </p>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-3">
        <StatTile label="Respondidas" value={answered} />
        <StatTile label="Acerto" value={`${accuracy}%`} />
        <StatTile label="Tempo" value={formatSeconds(Math.round((Date.now() - startedAtRef.current) / 1000))} />
      </div>

      {question && <ExamRelevance question={question} />}

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
