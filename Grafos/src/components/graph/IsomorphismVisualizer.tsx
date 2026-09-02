import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import type { GraphData } from '@/content/types';
import { validateIsomorphismMapping } from '@/lib/graph';
import { GraphVisualizer } from './GraphVisualizer';
import { Button, Card } from '@/components/ui';

export interface IsomorphismVisualizerProps {
  graphA: GraphData;
  graphB: GraphData;
  /** Gabarito do exercício — se os grafos são de fato isomorfos. Não é usado para colorir o resultado da verificação (isso seria revelar a resposta antes da hora); fica disponível para quem monta o exercício em volta deste componente. */
  expectedIsomorphic: boolean;
  onMappingChange?: (mapping: Record<string, string>) => void;
  className?: string;
}

interface Pair {
  a: string;
  b: string;
}

// Paleta cíclica para identificar visualmente cada par — usada apenas na
// legenda (o GraphVisualizer não expõe cor por vértice), enquanto os
// próprios vértices mapeados ganham um índice numérico no rótulo para que o
// aluno possa relacionar "A¹" em um grafo com "X¹" no outro.
const PAIR_COLORS = ['#6e7bff', '#35e0d0', '#3ddc84', '#c792ea', '#ff8fb1', '#f2c14e'];

type Verification = { valid: boolean; brokenEdges: string[] } | null;

/**
 * Visualizador de isomorfismo: dois grafos lado a lado, o aluno constrói um
 * mapeamento vértice-a-vértice clicando primeiro em A, depois no
 * correspondente em B. "Verificar" roda `validateIsomorphismMapping` sob
 * demanda — nada é conferido automaticamente enquanto o aluno monta o
 * mapeamento, então a solução não é entregue de graça.
 */
export function IsomorphismVisualizer({ graphA, graphB, expectedIsomorphic, onMappingChange, className }: IsomorphismVisualizerProps) {
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [pendingA, setPendingA] = useState<string | null>(null);
  const [verification, setVerification] = useState<Verification>(null);

  const mapping = useMemo(() => Object.fromEntries(pairs.map((p) => [p.a, p.b])), [pairs]);

  useEffect(() => {
    onMappingChange?.(mapping);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapping]);

  const pairIndexOfA = useMemo(() => new Map(pairs.map((p, i) => [p.a, i])), [pairs]);
  const pairIndexOfB = useMemo(() => new Map(pairs.map((p, i) => [p.b, i])), [pairs]);

  const brokenAIds = useMemo(() => {
    if (!verification) return new Set<string>();
    const set = new Set<string>();
    for (const eid of verification.brokenEdges) {
      const edge = graphA.edges.find((e) => e.id === eid);
      if (edge) {
        set.add(edge.source);
        set.add(edge.target);
      }
    }
    return set;
  }, [verification, graphA]);

  const brokenBIds = useMemo(() => {
    const set = new Set<string>();
    for (const aId of brokenAIds) {
      const bId = mapping[aId];
      if (bId) set.add(bId);
    }
    return set;
  }, [brokenAIds, mapping]);

  function labelFor(v: { id: string; label: string }, side: 'a' | 'b'): string {
    const idx = side === 'a' ? pairIndexOfA.get(v.id) : pairIndexOfB.get(v.id);
    const broken = side === 'a' ? brokenAIds.has(v.id) : brokenBIds.has(v.id);
    let text = v.label;
    if (idx !== undefined) text += ` · ${idx + 1}`;
    if (broken) text += ' ⚠';
    return text;
  }

  const vertexLabelsA = useMemo(
    () => Object.fromEntries(graphA.vertices.map((v) => [v.id, labelFor(v, 'a')])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [graphA, pairIndexOfA, brokenAIds],
  );
  const vertexLabelsB = useMemo(
    () => Object.fromEntries(graphB.vertices.map((v) => [v.id, labelFor(v, 'b')])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [graphB, pairIndexOfB, brokenBIds],
  );

  function clearVerification() {
    if (verification) setVerification(null);
  }

  function handleClickA(id: string) {
    const existing = pairs.find((p) => p.a === id);
    if (existing) {
      setPairs((prev) => prev.filter((p) => p.a !== id));
      clearVerification();
      return;
    }
    setPendingA((prev) => (prev === id ? null : id));
  }

  function handleClickB(id: string) {
    const existing = pairs.find((p) => p.b === id);
    if (existing) {
      setPairs((prev) => prev.filter((p) => p.b !== id));
      clearVerification();
      return;
    }
    if (!pendingA) return;
    setPairs((prev) => [...prev, { a: pendingA, b: id }]);
    setPendingA(null);
    clearVerification();
  }

  function removePair(index: number) {
    setPairs((prev) => prev.filter((_, i) => i !== index));
    clearVerification();
  }

  function handleVerify() {
    setVerification(validateIsomorphismMapping(graphA, graphB, mapping));
  }

  function handleReset() {
    setPairs([]);
    setPendingA(null);
    setVerification(null);
  }

  const mappedAIds = pairs.map((p) => p.a);
  const highlightAIds = pendingA ? [pendingA] : [];
  const complete = pairs.length === graphA.vertices.length && pairs.length === graphB.vertices.length;

  return (
    <div className={clsx('flex flex-col gap-4', className)} data-expected-isomorphic={expectedIsomorphic}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-lg text-sm leading-relaxed text-[var(--color-text-secondary)]">
          Clique em um vértice de <strong className="text-[var(--color-text-primary)]">A</strong>, depois no vértice correspondente de{' '}
          <strong className="text-[var(--color-text-primary)]">B</strong> para formar um par. Clique em um vértice já pareado para
          desfazer o par.
        </p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleReset} disabled={pairs.length === 0 && !pendingA}>
            Limpar
          </Button>
          <Button variant="primary" size="sm" onClick={handleVerify} disabled={pairs.length === 0}>
            Verificar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Grafo A</h3>
          <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-raised)] shadow-[var(--shadow-card)]">
            <GraphVisualizer
              graph={graphA}
              height={340}
              selectedVertexIds={mappedAIds}
              highlightVertexIds={highlightAIds}
              vertexLabels={vertexLabelsA}
              onVertexClick={handleClickA}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Grafo B</h3>
          <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-raised)] shadow-[var(--shadow-card)]">
            <GraphVisualizer
              graph={graphB}
              height={340}
              selectedVertexIds={pairs.map((p) => p.b)}
              vertexLabels={vertexLabelsB}
              onVertexClick={handleClickB}
            />
          </div>
        </div>
      </div>

      {pairs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {pairs.map((p, i) => {
            const color = PAIR_COLORS[i % PAIR_COLORS.length];
            const brokenPair = brokenAIds.has(p.a);
            return (
              <div
                key={`${p.a}-${p.b}`}
                className={clsx(
                  'mono flex items-center gap-2 rounded-lg border px-2.5 py-1 text-xs',
                  brokenPair ? 'border-[var(--color-danger)]/50 bg-[var(--color-danger-soft)]' : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)]',
                )}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} aria-hidden="true" />
                <span className="text-[var(--color-text-primary)]">
                  {graphA.vertices.find((v) => v.id === p.a)?.label ?? p.a} ↔ {graphB.vertices.find((v) => v.id === p.b)?.label ?? p.b}
                </span>
                <button
                  type="button"
                  onClick={() => removePair(i)}
                  aria-label={`Remover par ${p.a}-${p.b}`}
                  className="text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)]"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {verification && (
        <Card
          padding="sm"
          className={clsx(
            'flex items-center gap-2.5 border',
            verification.valid
              ? complete
                ? 'border-[var(--color-success)]/50 bg-[var(--color-success-soft)]'
                : 'border-[var(--color-amber)]/50 bg-[var(--color-amber-soft)]'
              : 'border-[var(--color-danger)]/50 bg-[var(--color-danger-soft)]',
          )}
        >
          {verification.valid ? (
            complete ? (
              <p className="text-sm text-[var(--color-success)]">
                Mapeamento completo e consistente: todas as arestas mapeadas correspondem em B.
              </p>
            ) : (
              <p className="text-sm text-[var(--color-amber)]">
                Sem quebras até agora, mas o mapeamento ainda está incompleto ({pairs.length}/{graphA.vertices.length} vértices) —
                continue pareando.
              </p>
            )
          ) : (
            <p className="text-sm text-[var(--color-danger)]">
              {verification.brokenEdges.length} correspondência(s) quebrada(s) — os vértices marcados com ⚠ têm uma aresta em A que
              não existe entre os pares mapeados em B.
            </p>
          )}
        </Card>
      )}
    </div>
  );
}
