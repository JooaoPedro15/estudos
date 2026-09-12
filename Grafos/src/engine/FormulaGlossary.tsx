import { useState } from 'react';
import { ChevronDown, ChevronUp, Sigma } from 'lucide-react';
import type { FormulaExplanation } from '@/content/formulas';
import { GraphVisualizer } from '@/components/graph/GraphVisualizer';

/**
 * Fórmulas explicadas símbolo por símbolo, para quem nunca viu a matéria:
 * a fórmula como o professor escreve, o que ela diz em português, tabela
 * "símbolo → significado", exemplo com número pequeno e o desenho do grafo.
 * Cada fórmula é um item expansível (a primeira já aberta).
 */
export function FormulaGlossary({ formulas }: { formulas: FormulaExplanation[] }) {
  const [openId, setOpenId] = useState<string | null>(formulas[0]?.id ?? null);
  if (formulas.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
        <Sigma size={13} /> Fórmulas, símbolo por símbolo
      </p>
      {formulas.map((f) => {
        const open = openId === f.id;
        return (
          <div key={f.id} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-raised)]">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : f.id)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left"
            >
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-[var(--color-text-primary)]">{f.title}</span>
                <span className="mono text-xs text-[var(--color-accent-strong)]">{f.formula}</span>
              </span>
              {open ? <ChevronUp size={16} className="shrink-0 text-[var(--color-text-tertiary)]" /> : <ChevronDown size={16} className="shrink-0 text-[var(--color-text-tertiary)]" />}
            </button>

            {open && (
              <div className="flex flex-col gap-3 border-t border-[var(--color-border-soft)] px-3.5 py-3">
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Em português</p>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{f.plain}</p>
                </div>

                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">O que é cada símbolo</p>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5">
                    {f.symbols.map((s) => (
                      <div key={s.symbol} className="contents">
                        <dt className="mono whitespace-nowrap rounded-md bg-[var(--color-accent-soft)] px-2 py-0.5 text-xs text-[var(--color-accent-strong)]">{s.symbol}</dt>
                        <dd className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{s.meaning}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {f.graph && (
                  <div className="overflow-hidden rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-bg-elevated)]">
                    <GraphVisualizer graph={f.graph} interactive={false} height={220} accessibleLabel={f.graphCaption} />
                    {f.graphCaption && <p className="px-3 py-1.5 text-xs text-[var(--color-text-tertiary)]">{f.graphCaption}</p>}
                  </div>
                )}

                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Exemplo com número pequeno</p>
                  <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">{f.example}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
