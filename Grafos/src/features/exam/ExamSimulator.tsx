import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { Star } from 'lucide-react';
import { getExam } from '@/content/exams';
import { getQuestion } from '@/content/questions';
import type { ExerciseType, Question, QuestionAttempt } from '@/content/types';
import { validateAnswer } from '@/engine/validate';
import { scrambledOrder } from '@/engine/ordering';
import { ExamAnswerPanel } from '@/engine/ExamAnswerPanel';
import { TeachMePanel } from '@/engine/TeachMePanel';
import { GraphVisualizer } from '@/components/graph/GraphVisualizer';
import { recordAttempt } from '@/store/progress';
import { Badge, Button, Card } from '@/components/ui';

// ---------------------------------------------------------------------------
// Tipos internos
// ---------------------------------------------------------------------------

type Phase = 'intro' | 'running' | 'results';

interface ExamItem {
  question: Question;
  weightPercent: number;
}

interface GradedResult {
  question: Question;
  weightPercent: number;
  answer: unknown;
  autoGraded: boolean;
  correct?: boolean;
}

/** Tipos para os quais construímos uma entrada rica o suficiente para corrigir automaticamente com `validateAnswer`. */
const AUTO_GRADABLE_TYPES: ReadonlySet<ExerciseType> = new Set<ExerciseType>([
  'MULTIPLE_CHOICE',
  'TRUE_FALSE',
  'SHORT_ANSWER',
  'NUMBER_INPUT',
  'ORDERING',
]);

function isAnswered(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return Number.isFinite(value);
  if (typeof value === 'boolean') return true;
  if (Array.isArray(value)) return value.length > 0;
  return false;
}

function formatElapsed(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

// ---------------------------------------------------------------------------
// Página principal
// ---------------------------------------------------------------------------

/** Simulador de prova completa: ao contrário do `ExerciseRenderer`, NUNCA revela correção antes da entrega — corrige tudo de uma vez no final, como uma prova real. */
export function ExamSimulator() {
  const { examId } = useParams<{ examId: string }>();
  const exam = examId ? getExam(examId) : undefined;

  const items = useMemo<ExamItem[]>(() => {
    if (!exam) return [];
    return exam.questions
      .map((ref) => {
        const question = getQuestion(ref.questionId);
        return question ? { question, weightPercent: ref.weightPercent } : null;
      })
      .filter((x): x is ExamItem => x !== null);
  }, [exam]);

  const [phase, setPhase] = useState<Phase>('intro');
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const [showConfirm, setShowConfirm] = useState(false);
  const [results, setResults] = useState<GradedResult[] | null>(null);

  useEffect(() => {
    if (phase !== 'running' || !timerEnabled || startTime === null) return;
    const id = window.setInterval(() => setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => window.clearInterval(id);
  }, [phase, timerEnabled, startTime]);

  if (!exam) {
    return (
      <Card padding="lg" className="mx-auto max-w-lg text-center">
        <h1 className="mb-2 text-xl font-semibold text-[var(--color-text-primary)]">Simulado não encontrado</h1>
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">Este simulado não existe ou foi removido.</p>
        <Link to="/simulado">
          <Button>Voltar aos simulados</Button>
        </Link>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card padding="lg" className="mx-auto max-w-lg text-center">
        <h1 className="mb-2 text-xl font-semibold text-[var(--color-text-primary)]">Não foi possível carregar as questões</h1>
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">Nenhuma questão deste simulado foi encontrada no banco de questões.</p>
        <Link to="/simulado">
          <Button>Voltar aos simulados</Button>
        </Link>
      </Card>
    );
  }

  function setAnswer(questionId: string, value: unknown) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function toggleMarked(questionId: string) {
    setMarked((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  }

  function startExam() {
    setAnswers({});
    setMarked(new Set());
    setCurrentIndex(0);
    setResults(null);
    setElapsedSeconds(0);
    setStartTime(Date.now());
    setPhase('running');
  }

  async function submitExam() {
    setShowConfirm(false);
    const totalTimeMs = startTime ? Date.now() - startTime : 0;
    const gradedResults: GradedResult[] = [];
    const attemptsToRecord: QuestionAttempt[] = [];

    for (const { question, weightPercent } of items) {
      const answer = answers[question.id];

      if (question.type === 'PROOF_OR_JUSTIFICATION') {
        // Coletamos texto livre aqui (não o checklist de rubrica que o ExerciseRenderer usa),
        // então nunca chamamos validateAnswer para este tipo — é sempre autocorreção.
        gradedResults.push({ question, weightPercent, answer, autoGraded: false });
        continue;
      }

      if (AUTO_GRADABLE_TYPES.has(question.type)) {
        const { correct } = validateAnswer(question, answer);
        gradedResults.push({ question, weightPercent, answer, autoGraded: true, correct });
        attemptsToRecord.push({
          questionId: question.id,
          topic: question.topic,
          correct,
          hintsUsed: 0,
          timeMs: totalTimeMs,
          timestamp: Date.now(),
        });
      } else {
        // Tipos com fallback de textarea (GRAPH_SELECT_*, MATRIX_FILL, ADJACENCY_LIST_FILL,
        // ISOMORPHISM_MAPPING, DRAG_AND_DROP): sem forma confiável de autocorrigir texto livre.
        gradedResults.push({ question, weightPercent, answer, autoGraded: false });
      }
    }

    await Promise.all(attemptsToRecord.map((a) => recordAttempt(a)));
    setResults(gradedResults);
    setPhase('results');
  }

  const answeredCount = items.filter((it) => isAnswered(answers[it.question.id])).length;

  return (
    <div className="flex flex-col gap-6">
      {phase === 'intro' && (
        <IntroScreen
          title={exam.title}
          basedOn={exam.basedOn}
          questionCount={items.length}
          durationMinutes={exam.suggestedDurationMinutes}
          timerEnabled={timerEnabled}
          onToggleTimer={setTimerEnabled}
          onStart={startExam}
        />
      )}

      {phase === 'running' && (
        <RunningScreen
          examTitle={exam.title}
          items={items}
          currentIndex={currentIndex}
          onNavigate={setCurrentIndex}
          answers={answers}
          onAnswer={setAnswer}
          marked={marked}
          onToggleMarked={toggleMarked}
          timerEnabled={timerEnabled}
          elapsedSeconds={elapsedSeconds}
          onRequestSubmit={() => setShowConfirm(true)}
        />
      )}

      {phase === 'results' && results && <ResultsScreen examTitle={exam.title} results={results} />}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <Card padding="lg" className="w-full max-w-sm">
            <p className="mb-5 text-sm leading-relaxed text-[var(--color-text-primary)]">
              Tem certeza que deseja entregar a prova?
              <br />
              <span className="mono text-[var(--color-text-secondary)]">
                {answeredCount} de {items.length} questões respondidas.
              </span>
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowConfirm(false)}>
                Cancelar
              </Button>
              <Button onClick={submitExam}>Entregar prova</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tela de introdução
// ---------------------------------------------------------------------------

function IntroScreen({
  title,
  basedOn,
  questionCount,
  durationMinutes,
  timerEnabled,
  onToggleTimer,
  onStart,
}: {
  title: string;
  basedOn: string;
  questionCount: number;
  durationMinutes: number;
  timerEnabled: boolean;
  onToggleTimer: (v: boolean) => void;
  onStart: () => void;
}) {
  return (
    <Card padding="lg" className="mx-auto flex w-full max-w-xl flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">{title}</h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{basedOn}</p>
      </div>
      <dl className="mono grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3">
          <dt className="text-[10px] uppercase tracking-wide text-[var(--color-text-tertiary)]">Questões</dt>
          <dd className="mt-1 text-lg text-[var(--color-text-primary)]">{questionCount}</dd>
        </div>
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3">
          <dt className="text-[10px] uppercase tracking-wide text-[var(--color-text-tertiary)]">Duração sugerida</dt>
          <dd className="mt-1 text-lg text-[var(--color-text-primary)]">{durationMinutes} min</dd>
        </div>
      </dl>
      <label className="flex items-center gap-2.5 text-sm text-[var(--color-text-secondary)]">
        <input
          type="checkbox"
          checked={timerEnabled}
          onChange={(e) => onToggleTimer(e.target.checked)}
          className="accent-[var(--color-accent)]"
        />
        Cronômetro opcional (conta o tempo decorrido — este professor não impõe um limite rígido)
      </label>
      <p className="text-xs leading-relaxed text-[var(--color-text-tertiary)]">
        Este simulado é dissertativo, como as provas reais do professor: suas respostas só são reveladas e corrigidas depois que você
        entregar a prova.
      </p>
      <Button size="lg" onClick={onStart}>
        Iniciar simulado
      </Button>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Tela de execução da prova
// ---------------------------------------------------------------------------

function RunningScreen({
  examTitle,
  items,
  currentIndex,
  onNavigate,
  answers,
  onAnswer,
  marked,
  onToggleMarked,
  timerEnabled,
  elapsedSeconds,
  onRequestSubmit,
}: {
  examTitle: string;
  items: ExamItem[];
  currentIndex: number;
  onNavigate: (i: number) => void;
  answers: Record<string, unknown>;
  onAnswer: (questionId: string, value: unknown) => void;
  marked: Set<string>;
  onToggleMarked: (questionId: string) => void;
  timerEnabled: boolean;
  elapsedSeconds: number;
  onRequestSubmit: () => void;
}) {
  const current = items[currentIndex];
  const isMarked = marked.has(current.question.id);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">{examTitle}</h1>
        <div className="flex items-center gap-3">
          {timerEnabled && (
            <span className="mono flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]" aria-live="polite">
              <span aria-hidden="true">⏱</span>
              {formatElapsed(elapsedSeconds)}
            </span>
          )}
          <Button variant="secondary" onClick={onRequestSubmit}>
            Entregar prova
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Navegação entre questões">
        {items.map((it, i) => {
          const answered = isAnswered(answers[it.question.id]);
          const questionMarked = marked.has(it.question.id);
          const isCurrent = i === currentIndex;
          return (
            <button
              key={it.question.id}
              type="button"
              role="tab"
              aria-selected={isCurrent}
              onClick={() => onNavigate(i)}
              aria-label={`Questão ${i + 1}${answered ? ', respondida' : ', não respondida'}${questionMarked ? ', marcada para revisão' : ''}`}
              className={clsx(
                'mono relative flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition',
                isCurrent
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]'
                  : answered
                    ? 'border-[var(--color-success)]/50 bg-[var(--color-success-soft)] text-[var(--color-text-primary)]'
                    : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]',
              )}
            >
              {i + 1}
              {questionMarked && (
                <span
                  className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-[var(--color-bg)] bg-[var(--color-amber)]"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      <Card padding="lg" className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <span className="mono text-xs text-[var(--color-text-tertiary)]">
            Questão {currentIndex + 1} de {items.length} · peso {current.weightPercent}%
          </span>
          <button
            type="button"
            onClick={() => onToggleMarked(current.question.id)}
            className={clsx(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition',
              isMarked
                ? 'border-[var(--color-amber)]/50 bg-[var(--color-amber-soft)] text-[var(--color-amber)]'
                : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]',
            )}
          >
            <Star size={12} className={isMarked ? 'fill-current' : ''} />
            {isMarked ? 'Marcada para revisar' : 'Marcar para revisar'}
          </button>
        </div>

        <p className="text-base leading-relaxed text-[var(--color-text-primary)]">{current.question.prompt}</p>

        {current.question.displayGraphs && (
          <div className={current.question.displayGraphs.b ? 'grid grid-cols-1 gap-4 md:grid-cols-2' : ''}>
            <GraphVisualizer graph={current.question.displayGraphs.a} interactive={false} height={current.question.displayGraphs.b ? 240 : 300} />
            {current.question.displayGraphs.b && <GraphVisualizer graph={current.question.displayGraphs.b} interactive={false} height={240} />}
          </div>
        )}

        <ExamAnswerInput
          question={current.question}
          value={answers[current.question.id]}
          onChange={(v) => onAnswer(current.question.id, v)}
        />

        <ExamAnswerPanel key={current.question.id} question={current.question} />
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="secondary" disabled={currentIndex === 0} onClick={() => onNavigate(currentIndex - 1)}>
          ← Anterior
        </Button>
        <Button variant="secondary" disabled={currentIndex === items.length - 1} onClick={() => onNavigate(currentIndex + 1)}>
          Próxima →
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Entrada de resposta genérica (leve — não é o ExerciseRenderer completo)
// ---------------------------------------------------------------------------

function ExamAnswerInput({ question, value, onChange }: { question: Question; value: unknown; onChange: (v: unknown) => void }) {
  switch (question.type) {
    case 'MULTIPLE_CHOICE':
      return (
        <div className="flex flex-col gap-2">
          {question.options.map((opt) => (
            <label
              key={opt.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-2.5 text-sm transition"
              style={{
                borderColor: value === opt.id ? 'var(--color-accent)' : 'var(--color-border)',
                background: value === opt.id ? 'var(--color-accent-soft)' : 'var(--color-bg-elevated)',
              }}
            >
              <input type="radio" className="accent-[var(--color-accent)]" checked={value === opt.id} onChange={() => onChange(opt.id)} />
              <span className="text-[var(--color-text-primary)]">{opt.label}</span>
            </label>
          ))}
        </div>
      );

    case 'TRUE_FALSE':
      return (
        <div className="flex gap-3">
          {[true, false].map((v) => (
            <button
              key={String(v)}
              type="button"
              onClick={() => onChange(v)}
              className="flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition"
              style={{
                borderColor: value === v ? 'var(--color-accent)' : 'var(--color-border)',
                background: value === v ? 'var(--color-accent-soft)' : 'var(--color-bg-elevated)',
                color: 'var(--color-text-primary)',
              }}
            >
              {v ? 'Verdadeiro' : 'Falso'}
            </button>
          ))}
        </div>
      );

    case 'SHORT_ANSWER':
      return (
        <input
          type="text"
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Sua resposta"
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
        />
      );

    case 'NUMBER_INPUT':
      return (
        <input
          type="number"
          value={value === undefined ? '' : (value as number)}
          onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
          placeholder={question.unit ? `valor em ${question.unit}` : 'valor'}
          className="mono w-40 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
        />
      );

    case 'ORDERING': {
      const order = (value as string[] | undefined) ?? scrambledOrder(question);
      return <ExamOrderingInput question={question} value={order} onChange={onChange} />;
    }

    case 'PROOF_OR_JUSTIFICATION':
      return (
        <div className="flex flex-col gap-3">
          {question.graph && <GraphVisualizer graph={question.graph} interactive={false} height={280} />}
          <textarea
            rows={8}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Escreva sua demonstração/justificativa completa. Ela não é corrigida automaticamente — você vai comparar com a solução depois de entregar a prova."
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
          />
        </div>
      );

    default:
      return (
        <div className="flex flex-col gap-3">
          <FallbackGraphs question={question} />
          <textarea
            rows={6}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Este tipo de questão não tem uma entrada interativa no simulado — descreva sua resposta em palavras (o raciocínio e o resultado final). Ela será corrigida manualmente por você, comparando com a solução."
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
          />
        </div>
      );
  }
}

function FallbackGraphs({ question }: { question: Question }) {
  if ('graphA' in question && 'graphB' in question) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-[var(--color-border)] p-2">
          <p className="mono mb-1 text-xs text-[var(--color-text-tertiary)]">Grafo A</p>
          <GraphVisualizer graph={question.graphA} interactive={false} height={240} />
        </div>
        <div className="rounded-lg border border-[var(--color-border)] p-2">
          <p className="mono mb-1 text-xs text-[var(--color-text-tertiary)]">Grafo B</p>
          <GraphVisualizer graph={question.graphB} interactive={false} height={240} />
        </div>
      </div>
    );
  }
  if ('graph' in question && question.graph) {
    return <GraphVisualizer graph={question.graph} interactive={false} height={280} />;
  }
  return null;
}

function ExamOrderingInput({
  question,
  value,
  onChange,
}: {
  question: Extract<Question, { type: 'ORDERING' }>;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }
  return (
    <ol className="flex flex-col gap-1.5">
      {value.map((id, i) => {
        const item = question.items.find((it) => it.id === id);
        if (!item) return null;
        return (
          <li
            key={id}
            className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-[var(--color-text-primary)]"
          >
            <span className="mono w-5 text-[var(--color-text-tertiary)]">{i + 1}.</span>
            <span className="flex-1">{item.label}</span>
            <span className="flex gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                className="control-btn"
                style={{ width: '1.75rem', height: '1.75rem' }}
                aria-label={`Mover "${item.label}" para cima`}
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                className="control-btn"
                style={{ width: '1.75rem', height: '1.75rem' }}
                aria-label={`Mover "${item.label}" para baixo`}
              >
                ↓
              </button>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

// ---------------------------------------------------------------------------
// Tela de resultado / correção
// ---------------------------------------------------------------------------

function ResultsScreen({ examTitle, results }: { examTitle: string; results: GradedResult[] }) {
  const autoGraded = results.filter((r) => r.autoGraded);
  const totalAutoWeight = autoGraded.reduce((s, r) => s + r.weightPercent, 0);
  const correctWeight = autoGraded.filter((r) => r.correct).reduce((s, r) => s + r.weightPercent, 0);
  const manualCount = results.length - autoGraded.length;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Resultado — {examTitle}</h1>
        <div className="flex flex-col gap-1">
          <p className="text-2xl font-semibold text-[var(--color-text-primary)]">
            {totalAutoWeight > 0 ? `${correctWeight}/${totalAutoWeight}%` : '—'}
            <span className="ml-2 text-sm font-normal text-[var(--color-text-tertiary)]">nas questões corrigidas automaticamente</span>
          </p>
          {manualCount > 0 && (
            <p className="text-xs text-[var(--color-text-tertiary)]">
              {manualCount} questão(ões) dissertativa(s) / sem correção automática não entram nesse número — compare manualmente com a
              solução de cada uma abaixo.
            </p>
          )}
        </div>
      </header>

      <div className="flex flex-col gap-4">
        {results.map((r, i) => (
          <Card key={r.question.id} padding="lg" className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="mono text-xs text-[var(--color-text-tertiary)]">
                Questão {i + 1} · peso {r.weightPercent}%
              </span>
              {r.autoGraded ? (
                <Badge tone={r.correct ? 'success' : 'danger'}>{r.correct ? 'Correta' : 'Incorreta'}</Badge>
              ) : (
                <Badge tone="amber">Requer autocorreção</Badge>
              )}
            </div>

            <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">{r.question.prompt}</p>

            {r.question.displayGraphs && (
              <div className={r.question.displayGraphs.b ? 'grid grid-cols-1 gap-4 md:grid-cols-2' : ''}>
                <GraphVisualizer graph={r.question.displayGraphs.a} interactive={false} height={r.question.displayGraphs.b ? 200 : 260} />
                {r.question.displayGraphs.b && <GraphVisualizer graph={r.question.displayGraphs.b} interactive={false} height={200} />}
              </div>
            )}

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3">
              <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">Sua resposta</p>
              <AnswerDisplay question={r.question} answer={r.answer} />
            </div>

            <ExamAnswerPanel question={r.question} defaultOpen={!r.autoGraded} />

            <TeachMePanel question={r.question} />
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <Link to="/simulado">
          <Button variant="secondary">Voltar aos simulados</Button>
        </Link>
        <Link to="/progresso">
          <Button>Ver progresso</Button>
        </Link>
      </div>
    </div>
  );
}

function AnswerDisplay({ question, answer }: { question: Question; answer: unknown }) {
  if (!isAnswered(answer)) {
    return <p className="text-sm italic text-[var(--color-text-tertiary)]">Sem resposta.</p>;
  }
  switch (question.type) {
    case 'MULTIPLE_CHOICE': {
      const opt = question.options.find((o) => o.id === answer);
      return <p className="text-sm text-[var(--color-text-primary)]">{opt?.label ?? String(answer)}</p>;
    }
    case 'TRUE_FALSE':
      return <p className="text-sm text-[var(--color-text-primary)]">{answer ? 'Verdadeiro' : 'Falso'}</p>;
    case 'NUMBER_INPUT':
      return (
        <p className="mono text-sm text-[var(--color-text-primary)]">
          {String(answer)}
          {question.unit ? ` ${question.unit}` : ''}
        </p>
      );
    case 'ORDERING': {
      const order = answer as string[];
      return (
        <ol className="list-inside list-decimal text-sm text-[var(--color-text-primary)]">
          {order.map((id) => (
            <li key={id}>{question.items.find((i) => i.id === id)?.label ?? id}</li>
          ))}
        </ol>
      );
    }
    default:
      return <p className="whitespace-pre-wrap text-sm text-[var(--color-text-primary)]">{String(answer)}</p>;
  }
}
