import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { ExerciseRenderer, type ExerciseResult } from '@/engine/ExerciseRenderer';
import { isDefinitionFamily, isDefinitionQuestion, pickNextDefinition, questions, type DefinitionKind, type DefinitionScope } from '@/content/questions';
import type { Question, QuestionAttempt } from '@/content/types';
import { addStudySeconds, loadProgress, recordAttempt } from '@/store/progress';
import { Button, Card, IconChip, StatTile } from '@/components/ui';
import { ChipGroup, ModuleFilter } from './ModuleFilter';
import { topicIdsForModule, useModuleParam } from './moduleScope';
import { ExamRelevance } from './ExamRelevance';

const RECENT_LIMIT = 15;
const TOTAL_CONCEPTS = questions.filter(isDefinitionQuestion).length;
/** id de questão (aberta ou fechada) → id do conceito (definição aberta) que ela treina. */
const CONCEPT_BY_QUESTION_ID = new Map(
  questions.filter(isDefinitionFamily).map((q) => [q.id, q.type === 'DEFINITION' ? q.id : q.definitionId!] as const),
);
const SCOPE_OPTIONS: { id: DefinitionScope; label: string }[] = [
  { id: 'all', label: 'Todos os conceitos' },
  { id: 'exam', label: 'Que mais caem na prova' },
];
const KIND_OPTIONS: { id: DefinitionKind; label: string }[] = [
  { id: 'mixed', label: 'Misto' },
  { id: 'open', label: 'Abertas (escrevo)' },
  { id: 'closed', label: 'Fechadas (marco)' },
];

function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

/**
 * "Decorar conceitos" — só definições, uma atrás da outra, sem fim
 * pré-definido: abertas ("defina o conceito de X") e/ou fechadas geradas
 * delas. Prioriza o que você errou ou nunca viu (ver `pickNextDefinition`),
 * com filtro por módulo e por tipo. Serve para os "10 minutinhos" de decoreba
 * das definições do professor. Rota: /estudar/conceitos
 */
export function ConceptDrillSession() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [moduleId, setModuleId] = useModuleParam();
  const [kind, setKind] = useState<DefinitionKind>('mixed');
  const [scope, setScope] = useState<DefinitionScope>('all');
  const [answered, setAnswered] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const startedAtRef = useRef(Date.now());
  const lastSavedSecondsRef = useRef(0);

  // "Vistas" conta conceitos, não questões: responder a fechada de um conceito também conta como visto.
  const seenConcepts = new Set(attempts.map((a) => CONCEPT_BY_QUESTION_ID.get(a.questionId)).filter(Boolean)).size;
  const topicIdsFor = topicIdsForModule;

  useEffect(() => {
    let cancelled = false;
    loadProgress().then((state) => {
      if (cancelled) return;
      setAttempts(state.attempts);
      setQuestion(pickNextDefinition([], state.attempts, topicIdsFor(moduleId), kind, scope) ?? null);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setQuestion(pickNextDefinition(recentIds, attempts, topicIdsFor(id), kind, scope) ?? null);
  }

  function changeKind(next: DefinitionKind) {
    setKind(next);
    setQuestion(pickNextDefinition(recentIds, attempts, topicIdsFor(moduleId), next, scope) ?? null);
  }

  function changeScope(next: DefinitionScope) {
    setScope(next);
    setQuestion(pickNextDefinition(recentIds, attempts, topicIdsFor(moduleId), kind, next) ?? null);
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
    setQuestion(pickNextDefinition(nextRecent, nextAttempts, topicIdsFor(moduleId), kind, scope) ?? null);

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
        Só definições do professor, uma atrás da outra. Abertas: escreve de memória e compara com a definição literal. Fechadas: múltipla
        escolha e V/F sobre a mesma definição. Prioriza o que você errou ou ainda não viu.
      </p>

      <ChipGroup label="Escopo" tone="danger" value={scope} onChange={(id) => changeScope(id as DefinitionScope)} options={SCOPE_OPTIONS} />
      <ModuleFilter value={moduleId} onChange={changeModule} tone="cyan" />
      <ChipGroup label="Tipo de questão" tone="cyan" value={kind} onChange={(id) => changeKind(id as DefinitionKind)} options={KIND_OPTIONS} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Respondidas" value={answered} />
        <StatTile label="Acerto" value={`${accuracy}%`} />
        <StatTile label="Vistas" value={`${seenConcepts}/${TOTAL_CONCEPTS}`} />
        <StatTile label="Tempo" value={formatSeconds(Math.round((Date.now() - startedAtRef.current) / 1000))} />
      </div>

      {question && <ExamRelevance question={question} />}

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
