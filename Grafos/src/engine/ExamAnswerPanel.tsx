import { useState } from 'react';
import { Eye, EyeOff, PenLine } from 'lucide-react';
import type { Question } from '@/content/types';

/**
 * "Mostrar resposta": a resposta-modelo (`examAnswer`) — o texto que se
 * escreve na folha da prova, no registro das resoluções corrigidas. Sem
 * `examAnswer`, cai em `solution`. `defaultOpen` para telas de resultado.
 */
export function ExamAnswerPanel({ question, defaultOpen = false }: { question: Question; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const text = question.examAnswer ?? question.solution;
  if (!text) return null;
  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--color-success)]/45 bg-[var(--color-success-soft)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-success)] transition hover:brightness-110"
      >
        {open ? <EyeOff size={14} /> : <Eye size={14} />}
        {open ? 'Ocultar resposta' : 'Mostrar resposta'}
      </button>
      {open && (
        <div className="flex flex-col gap-2 rounded-xl border border-[var(--color-success)]/40 bg-[var(--color-success-soft)] p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-success)]">
            <PenLine size={13} /> Resposta esperada — como escrever na prova
          </p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text-primary)]">{text}</p>
          {!question.examAnswer && (
            <p className="text-[11px] text-[var(--color-text-tertiary)]">Esta questão ainda não tem resposta-modelo no registro de prova; acima está a solução comentada.</p>
          )}
        </div>
      )}
    </div>
  );
}
