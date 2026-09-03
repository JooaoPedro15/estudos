import { useState } from 'react';
import { GraduationCap, TriangleAlert } from 'lucide-react';
import type { Question } from '@/content/types';
import { getTopic } from '@/content/topics';
import { IconChip } from '@/components/ui';

/**
 * Botão "Me ensine" — abre um passo a passo pedagógico da questão: o
 * conceito por trás, o método geral (reaproveita `topic.understand`) e como
 * ele se aplica a este caso específico (`question.solution`). Não é só a
 * resposta — é o raciocínio para resolver o PRÓXIMO problema parecido.
 */
export function TeachMePanel({ question }: { question: Question }) {
  const [open, setOpen] = useState(false);
  const topic = getTopic(question.topic);

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-accent-strong)] transition hover:brightness-110"
      >
        <GraduationCap size={14} />
        {open ? 'Ocultar explicação' : 'Me ensine'}
      </button>

      {open && (
        <div className="flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4">
          {topic ? (
            <>
              <div className="flex items-start gap-3">
                <IconChip icon={GraduationCap} tone="accent" size="sm" />
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Conceito por trás</p>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{topic.whatYouNeedToKnow}</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Método, passo a passo</p>
                <ol className="flex flex-col gap-2.5">
                  {topic.understand.map((step, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span className="mono flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[11px] font-semibold text-[var(--color-accent-strong)]">
                        {i + 1}
                      </span>
                      <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {topic.commonPitfall && (
                <div className="flex items-start gap-2.5 rounded-lg border border-[var(--color-amber)]/35 bg-[var(--color-amber-soft)] px-3 py-2.5">
                  <TriangleAlert size={15} className="mt-0.5 shrink-0 text-[var(--color-amber)]" />
                  <p className="text-xs leading-relaxed text-[var(--color-text-primary)]">{topic.commonPitfall}</p>
                </div>
              )}
            </>
          ) : null}

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Aplicando neste caso</p>
            <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">{question.solution}</p>
          </div>
        </div>
      )}
    </div>
  );
}
