import { useState } from 'react';
import { Lightbulb } from 'lucide-react';

/** Dicas progressivas — a explicação completa da questão vive em `TeachMePanel` ("Me ensine"), não aqui. */
export function HintPanel({ hints, onReveal }: { hints: string[]; onReveal?: (count: number) => void }) {
  const [revealed, setRevealed] = useState(0);

  const reveal = (n: number) => {
    setRevealed(n);
    onReveal?.(n);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {hints.map((_, i) => (
          <button
            key={i}
            type="button"
            disabled={i < revealed}
            onClick={() => reveal(i + 1)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1 text-xs text-[var(--color-text-secondary)] transition hover:border-[var(--color-border-strong)] disabled:opacity-40"
          >
            <Lightbulb size={12} />
            Dica {i + 1}
          </button>
        ))}
      </div>
      {hints.slice(0, revealed).map((h, i) => (
        <p key={i} className="rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-[var(--color-text-secondary)]">
          <span className="mono text-[var(--color-accent-strong)]">Dica {i + 1}:</span> {h}
        </p>
      ))}
    </div>
  );
}
