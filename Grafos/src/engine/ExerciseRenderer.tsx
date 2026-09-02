import { useMemo, useRef, useState } from 'react';
import type { Question } from '@/content/types';
import { validateAnswer } from './validate';
import { HintPanel } from './HintPanel';
import { GraphVisualizer } from '@/components/graph/GraphVisualizer';
import { adjacencyMatrix, incidenceMatrix, validateIsomorphismMapping } from '@/lib/graph';

export interface ExerciseResult {
  correct: boolean;
  hintsUsed: number;
  timeMs: number;
}

interface ExerciseRendererProps {
  question: Question;
  onComplete: (result: ExerciseResult) => void;
}

const MAPPING_COLORS = ['#6e7bff', '#35e0d0', '#ffb454', '#ff5c7a', '#3ddc84', '#c792ea'];

export function ExerciseRenderer({ question, onComplete }: ExerciseRendererProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [answer, setAnswer] = useState<any>(initialAnswer(question));
  const [submitted, setSubmitted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const hintsUsed = useRef(0);
  const startedAt = useRef(performance.now());

  const result = submitted ? validateAnswer(question, answer) : null;

  function reset() {
    setAnswer(initialAnswer(question));
    setSubmitted(false);
  }

  function submit() {
    setSubmitted(true);
    setAttempts((a) => a + 1);
  }

  function finish(correct: boolean) {
    onComplete({ correct, hintsUsed: hintsUsed.current, timeMs: Math.round(performance.now() - startedAt.current) });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-base leading-relaxed text-[var(--color-text-primary)]">{question.prompt}</p>
      </div>

      <QuestionBody question={question} answer={answer} setAnswer={setAnswer} disabled={submitted} />

      {!submitted && (
        <button type="button" onClick={submit} className="self-start rounded-lg bg-[var(--color-accent)] px-5 py-2 text-sm font-medium text-white transition hover:bg-[var(--color-accent-strong)]">
          Verificar resposta
        </button>
      )}

      {submitted && result && (
        <div className="flex flex-col gap-3">
          <div
            className="rounded-lg border px-4 py-3 text-sm"
            style={
              result.correct
                ? { borderColor: 'var(--color-success)', background: 'var(--color-success-soft)', color: 'var(--color-text-primary)' }
                : { borderColor: 'var(--color-danger)', background: 'var(--color-danger-soft)', color: 'var(--color-text-primary)' }
            }
          >
            {result.correct ? '✅ ' : '❌ '}
            {result.message}
          </div>

          {!result.correct && (
            <HintPanel hints={question.hints} solution={question.solution} onReveal={(n) => (hintsUsed.current = n)} />
          )}

          <div className="flex gap-2">
            {!result.correct && attempts < 3 && (
              <button type="button" onClick={reset} className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]">
                Tentar novamente
              </button>
            )}
            <button
              type="button"
              onClick={() => finish(result.correct)}
              className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-strong)]"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function initialAnswer(q: Question): any {
  switch (q.type) {
    case 'GRAPH_SELECT_VERTEX':
    case 'GRAPH_SELECT_EDGE':
      return [];
    case 'MATRIX_FILL':
      return {};
    case 'ADJACENCY_LIST_FILL': {
      const init: Record<string, string> = {};
      for (const v of q.graph.vertices) init[v.id] = '';
      return init;
    }
    case 'ISOMORPHISM_MAPPING':
      return {};
    case 'ORDERING':
      return q.items.map((i) => i.id);
    case 'DRAG_AND_DROP':
      return {};
    case 'PROOF_OR_JUSTIFICATION':
      return [];
    default:
      return undefined;
  }
}

function QuestionBody({
  question: q,
  answer,
  setAnswer,
  disabled,
}: {
  question: Question;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answer: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setAnswer: (a: any) => void;
  disabled: boolean;
}) {
  switch (q.type) {
    case 'MULTIPLE_CHOICE':
      return (
        <div className="flex flex-col gap-2">
          {q.options.map((opt) => (
            <label
              key={opt.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-2.5 text-sm transition"
              style={{
                borderColor: answer === opt.id ? 'var(--color-accent)' : 'var(--color-border)',
                background: answer === opt.id ? 'var(--color-accent-soft)' : 'var(--color-bg-elevated)',
              }}
            >
              <input type="radio" className="accent-[var(--color-accent)]" checked={answer === opt.id} disabled={disabled} onChange={() => setAnswer(opt.id)} />
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
              disabled={disabled}
              onClick={() => setAnswer(v)}
              className="flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition"
              style={{
                borderColor: answer === v ? 'var(--color-accent)' : 'var(--color-border)',
                background: answer === v ? 'var(--color-accent-soft)' : 'var(--color-bg-elevated)',
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
          disabled={disabled}
          value={answer ?? ''}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Sua resposta"
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
        />
      );

    case 'NUMBER_INPUT':
      return (
        <input
          type="number"
          disabled={disabled}
          value={answer ?? ''}
          onChange={(e) => setAnswer(e.target.value === '' ? undefined : Number(e.target.value))}
          placeholder={q.unit ? `valor em ${q.unit}` : 'valor'}
          className="mono w-40 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
        />
      );

    case 'GRAPH_SELECT_VERTEX':
      return (
        <GraphVisualizer
          graph={q.graph}
          interactive={!disabled}
          selectedVertexIds={answer}
          onVertexClick={
            disabled
              ? undefined
              : (id) =>
                  setAnswer((prev: string[]) =>
                    q.multi ? (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]) : [id],
                  )
          }
        />
      );

    case 'GRAPH_SELECT_EDGE':
      return (
        <GraphVisualizer
          graph={q.graph}
          interactive={!disabled}
          selectedEdgeIds={answer}
          onEdgeClick={
            disabled
              ? undefined
              : (id) =>
                  setAnswer((prev: string[]) =>
                    q.multi ? (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]) : [id],
                  )
          }
        />
      );

    case 'MATRIX_FILL':
      return <MatrixFillInput question={q} answer={answer} setAnswer={setAnswer} disabled={disabled} />;

    case 'ADJACENCY_LIST_FILL':
      return (
        <div className="flex flex-col gap-2">
          {q.graph.vertices.map((v) => (
            <div key={v.id} className="flex items-center gap-3">
              <span className="mono w-8 text-sm text-[var(--color-text-secondary)]">{v.label}:</span>
              <input
                type="text"
                disabled={disabled}
                value={answer[v.id] ?? ''}
                onChange={(e) => setAnswer({ ...answer, [v.id]: e.target.value })}
                placeholder="ex.: b, c"
                className="mono flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
              />
            </div>
          ))}
        </div>
      );

    case 'ISOMORPHISM_MAPPING':
      return <IsomorphismMappingInput question={q} answer={answer} setAnswer={setAnswer} disabled={disabled} />;

    case 'ORDERING':
      return <OrderingInput question={q} answer={answer} setAnswer={setAnswer} disabled={disabled} />;

    case 'DRAG_AND_DROP':
      return <DragDropInput question={q} answer={answer} setAnswer={setAnswer} disabled={disabled} />;

    case 'PROOF_OR_JUSTIFICATION':
      return (
        <div className="flex flex-col gap-3">
          {q.graph && <GraphVisualizer graph={q.graph} interactive={false} height={280} />}
          <textarea
            rows={5}
            placeholder="Escreva sua resposta/justificativa (não é corrigida automaticamente — compare com a solução ao final)"
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
          />
          <p className="text-xs text-[var(--color-text-tertiary)]">Depois de escrever, marque abaixo quais pontos você abordou:</p>
          {q.rubric.map((item, i) => (
            <label key={i} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <input
                type="checkbox"
                disabled={disabled}
                checked={(answer as string[]).includes(item)}
                onChange={(e) =>
                  setAnswer(e.target.checked ? [...(answer as string[]), item] : (answer as string[]).filter((x) => x !== item))
                }
              />
              {item}
            </label>
          ))}
        </div>
      );

    default:
      return null;
  }
}

function MatrixFillInput({
  question: q,
  answer,
  setAnswer,
  disabled,
}: {
  question: Extract<Question, { type: 'MATRIX_FILL' }>;
  answer: Record<string, number>;
  setAnswer: (a: Record<string, number>) => void;
  disabled: boolean;
}) {
  const reference = q.matrixKind === 'adjacency' ? adjacencyMatrix(q.graph) : incidenceMatrix(q.graph);
  return (
    <div className="overflow-auto">
      <table className="mono border-collapse text-sm">
        <thead>
          <tr>
            <th className="p-1 text-[var(--color-text-tertiary)]" />
            {reference.colIds.map((c) => (
              <th key={c} className="p-1 text-center text-[var(--color-text-tertiary)]">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {q.rowIds.map((r) => (
            <tr key={r}>
              <th className="p-1 text-right text-[var(--color-text-tertiary)]">{r}</th>
              {q.colIds.map((c) => (
                <td key={c} className="p-1">
                  <input
                    type="number"
                    disabled={disabled}
                    value={answer[`${r}|${c}`] ?? ''}
                    onChange={(e) => setAnswer({ ...answer, [`${r}|${c}`]: e.target.value === '' ? 0 : Number(e.target.value) })}
                    className="h-8 w-12 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-center text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IsomorphismMappingInput({
  question: q,
  answer,
  setAnswer,
  disabled,
}: {
  question: Extract<Question, { type: 'ISOMORPHISM_MAPPING' }>;
  answer: Record<string, string>;
  setAnswer: (a: Record<string, string>) => void;
  disabled: boolean;
}) {
  const [pendingA, setPendingA] = useState<string | null>(null);
  const entries = Object.entries(answer);
  const colorsA: Record<string, string> = Object.fromEntries(entries.map(([a], i) => [a, MAPPING_COLORS[i % MAPPING_COLORS.length]]));
  const colorsB: Record<string, string> = Object.fromEntries(entries.map(([, b], i) => [b, MAPPING_COLORS[i % MAPPING_COLORS.length]]));

  const preview = useMemo(() => (Object.keys(answer).length ? validateIsomorphismMapping(q.graphA, q.graphB, answer) : null), [answer, q.graphA, q.graphB]);

  function pickB(bId: string) {
    if (disabled || !pendingA) return;
    const next = { ...answer };
    if (next[pendingA] === bId) delete next[pendingA];
    else next[pendingA] = bId;
    setAnswer(next);
    setPendingA(null);
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-[var(--color-text-tertiary)]">
        {q.isIsomorphic ? 'Clique num vértice de A e depois no correspondente em B para formar um par.' : 'Analise os dois grafos — eles NÃO são isomorfos. Escreva por que na justificativa da lição (esta questão não usa mapeamento).'}
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-[var(--color-border)] p-2">
          <p className="mono mb-1 text-xs text-[var(--color-text-tertiary)]">Grafo A</p>
          <GraphVisualizer
            graph={q.graphA}
            interactive={false}
            height={260}
            selectedVertexIds={pendingA ? [pendingA] : []}
            vertexColorMap={colorsA}
            onVertexClick={q.isIsomorphic && !disabled ? (id) => setPendingA(id) : undefined}
          />
        </div>
        <div className="rounded-lg border border-[var(--color-border)] p-2">
          <p className="mono mb-1 text-xs text-[var(--color-text-tertiary)]">Grafo B</p>
          <GraphVisualizer graph={q.graphB} interactive={false} height={260} vertexColorMap={colorsB} onVertexClick={q.isIsomorphic && !disabled ? pickB : undefined} />
        </div>
      </div>
      {entries.length > 0 && (
        <div className="flex flex-wrap gap-2 text-xs mono">
          {entries.map(([a, b], i) => (
            <span key={a} className="rounded-full px-2 py-1" style={{ background: `${MAPPING_COLORS[i % MAPPING_COLORS.length]}22`, color: MAPPING_COLORS[i % MAPPING_COLORS.length] }}>
              {a} → {b}
            </span>
          ))}
        </div>
      )}
      {preview && !preview.valid && <p className="text-xs text-[var(--color-danger)]">Dica visual: mapeamento atual quebra {preview.brokenEdges.length} aresta(s) — reveja antes de confirmar.</p>}
    </div>
  );
}

function OrderingInput({
  question: q,
  answer,
  setAnswer,
  disabled,
}: {
  question: Extract<Question, { type: 'ORDERING' }>;
  answer: string[];
  setAnswer: (a: string[]) => void;
  disabled: boolean;
}) {
  function move(i: number, dir: -1 | 1) {
    const next = [...answer];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setAnswer(next);
  }
  return (
    <ol className="flex flex-col gap-1.5">
      {answer.map((id, i) => {
        const item = q.items.find((it) => it.id === id)!;
        return (
          <li key={id} className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-[var(--color-text-primary)]">
            <span className="mono w-5 text-[var(--color-text-tertiary)]">{i + 1}.</span>
            <span className="flex-1">{item.label}</span>
            {!disabled && (
              <span className="flex gap-1">
                <button type="button" onClick={() => move(i, -1)} className="control-btn" style={{ width: '1.75rem', height: '1.75rem' }}>
                  ↑
                </button>
                <button type="button" onClick={() => move(i, 1)} className="control-btn" style={{ width: '1.75rem', height: '1.75rem' }}>
                  ↓
                </button>
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function DragDropInput({
  question: q,
  answer,
  setAnswer,
  disabled,
}: {
  question: Extract<Question, { type: 'DRAG_AND_DROP' }>;
  answer: Record<string, string>;
  setAnswer: (a: Record<string, string>) => void;
  disabled: boolean;
}) {
  const unassigned = q.items.filter((it) => !answer[it.id]);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {unassigned.map((it) => (
          <span key={it.id} className="mono cursor-default rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated-2)] px-3 py-1 text-xs text-[var(--color-text-primary)]">
            {it.label}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {q.buckets.map((bucket) => (
          <div key={bucket.id} className="rounded-lg border border-dashed border-[var(--color-border-strong)] p-3">
            <p className="mb-2 text-xs font-medium text-[var(--color-text-secondary)]">{bucket.label}</p>
            <div className="flex flex-wrap gap-1.5">
              {q.items
                .filter((it) => answer[it.id] === bucket.id)
                .map((it) => (
                  <button
                    key={it.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      const next = { ...answer };
                      delete next[it.id];
                      setAnswer(next);
                    }}
                    className="mono rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs text-[var(--color-accent-strong)]"
                  >
                    {it.label} ✕
                  </button>
                ))}
            </div>
            {!disabled && unassigned.length > 0 && (
              <select
                className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-2 py-1 text-xs text-[var(--color-text-secondary)]"
                value=""
                onChange={(e) => e.target.value && setAnswer({ ...answer, [e.target.value]: bucket.id })}
              >
                <option value="">+ adicionar item</option>
                {unassigned.map((it) => (
                  <option key={it.id} value={it.id}>
                    {it.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
