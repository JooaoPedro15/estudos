import { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import type { GraphConcept } from '@/content/lessons/types';
import { GraphVisualizer } from '@/components/graph/GraphVisualizer';

/**
 * "Explicação simples": reaproveita os conceitos das lições do módulo — a
 * explicação intuitiva e o DESENHO do último passo do primeiro exemplo (o
 * mesmo que aparece animado na página do tópico). Um item expansível por
 * conceito; o primeiro já aberto.
 */
export function SimpleExplanation({ concepts }: { concepts: GraphConcept[] }) {
  const [openId, setOpenId] = useState<string | null>(concepts[0]?.id ?? null);
  if (concepts.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
        <Lightbulb size={13} /> Explicação simples (das lições do módulo)
      </p>
      {concepts.map((c) => {
        const open = openId === c.id;
        const example = c.examples[0];
        const step = example?.steps[example.steps.length - 1];
        return (
          <div key={c.id} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-raised)]">
            <button type="button" onClick={() => setOpenId(open ? null : c.id)} aria-expanded={open} className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left">
              <span className="text-sm font-medium text-[var(--color-text-primary)]">{c.title}</span>
              {open ? <ChevronUp size={16} className="shrink-0 text-[var(--color-text-tertiary)]" /> : <ChevronDown size={16} className="shrink-0 text-[var(--color-text-tertiary)]" />}
            </button>
            {open && (
              <div className="flex flex-col gap-3 border-t border-[var(--color-border-soft)] px-3.5 py-3">
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{c.intuitiveExplanation}</p>
                {step && (
                  <div className="overflow-hidden rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-bg-elevated)]">
                    {step.groups && (
                      <div className="flex flex-wrap gap-2 px-3 pt-2 text-xs">
                        {step.groups.map((g) => (
                          <span key={g.label} className="rounded-full border px-2 py-0.5" style={{ borderColor: g.color, color: g.color }}>
                            {g.label}: {g.vertexIds.join(', ')}
                          </span>
                        ))}
                      </div>
                    )}
                    <GraphVisualizer
                      graph={step.graph}
                      interactive={false}
                      height={240}
                      showWeights
                      highlightVertexIds={[...(step.highlightVertexIds ?? []), ...(step.currentVertex ? [step.currentVertex] : [])]}
                      highlightEdgeIds={step.highlightEdgeIds}
                      visitedVertexIds={step.visitedVertexIds}
                      vertexColorMap={step.vertexColorMap}
                      edgeColorMap={step.edgeColorMap}
                      vertexLabels={step.vertexLabels}
                      edgeLabels={step.edgeLabels}
                      vertexNotes={step.vertexNotes}
                      accessibleLabel={step.message}
                    />
                    <p className="px-3 py-1.5 text-xs text-[var(--color-text-tertiary)]">
                      {example.title}: {step.message}
                    </p>
                    {step.legend && (
                      <div className="flex flex-wrap gap-3 px-3 pb-2 text-[11px] text-[var(--color-text-tertiary)]">
                        {step.legend.map((l) => (
                          <span key={l.label} className="inline-flex items-center gap-1">
                            <i className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: l.color }} /> {l.label}
                          </span>
                        ))}
                      </div>
                    )}
                    {step.formula && <p className="mono px-3 pb-2 text-xs text-[var(--color-accent-strong)]">{step.formula}</p>}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
