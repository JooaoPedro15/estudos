import { useState } from 'react';
import { ArrowUpLeft, Sprout } from 'lucide-react';
import { getQuestion } from '@/content/questions';
import { ROOT_CONCEPTS } from '@/content/definitions/prerequisites';
import type { Question } from '@/content/types';

type DefinitionQuestion = Extract<Question, { type: 'DEFINITION' }>;

function getDefinition(id: string): DefinitionQuestion | undefined {
  const q = getQuestion(id);
  return q?.type === 'DEFINITION' ? q : undefined;
}

/**
 * "Antes disso, saiba…": os pré-requisitos de uma definição como chips; ao
 * clicar, mostra a definição do professor e a intuição do pré-requisito ali
 * mesmo (e os pré-requisitos dele, um nível abaixo). Sem pré-requisitos:
 * avisa que dá para aprender do zero.
 */
export function PrerequisitesPanel({ definitionId, compact = false }: { definitionId: string; compact?: boolean }) {
  const def = getDefinition(definitionId);
  const [openId, setOpenId] = useState<string | null>(null);
  if (!def) return null;
  const prereqs = (def.prerequisites ?? []).map(getDefinition).filter((d): d is DefinitionQuestion => Boolean(d));
  const key = def.id.slice('def-'.length);

  if (prereqs.length === 0) {
    return (
      <p className="flex items-center gap-1.5 text-xs text-[var(--color-success)]">
        <Sprout size={13} />
        {ROOT_CONCEPTS.has(key) ? 'Ponto de partida da matéria — não precisa de nada antes.' : 'Dá para aprender do zero: só precisa saber o que é grafo, vértice e aresta.'}
      </p>
    );
  }

  const open = openId ? prereqs.find((p) => p.id === openId) : undefined;
  const openPrereqs = open ? (open.prerequisites ?? []).map(getDefinition).filter((d): d is DefinitionQuestion => Boolean(d)) : [];

  return (
    <div className={compact ? 'flex flex-col gap-1.5' : 'flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-raised)] p-3.5'}>
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
        <ArrowUpLeft size={13} /> Antes disso, saiba
      </p>
      <div className="flex flex-wrap gap-1.5">
        {prereqs.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setOpenId(openId === p.id ? null : p.id)}
            aria-pressed={openId === p.id}
            className={
              openId === p.id
                ? 'rounded-full border border-[var(--color-amber)]/45 bg-[var(--color-amber-soft)] px-3 py-1 text-xs font-medium text-[var(--color-amber)]'
                : 'rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]'
            }
          >
            {p.concept}
          </button>
        ))}
      </div>
      {open && (
        <div className="flex flex-col gap-2 rounded-lg border border-[var(--color-amber)]/35 bg-[var(--color-amber-soft)] px-3.5 py-3">
          <p className="text-sm font-medium text-[var(--color-text-primary)]">{open.concept}</p>
          <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">{open.solution}</p>
          <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">{open.intuition}</p>
          {openPrereqs.length > 0 && (
            <p className="text-[11px] text-[var(--color-text-tertiary)]">…que por sua vez precisa de: {openPrereqs.map((p) => p.concept).join(' · ')}</p>
          )}
        </div>
      )}
    </div>
  );
}
