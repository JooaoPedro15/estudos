import { useState } from 'react';

export function HintPanel({
  hints,
  solution,
  onReveal,
}: {
  hints: string[];
  solution: string;
  onReveal?: (count: number) => void;
}) {
  const [revealed, setRevealed] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

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
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1 text-xs text-[var(--color-text-secondary)] transition hover:border-[var(--color-border-strong)] disabled:opacity-40"
          >
            💡 Dica {i + 1}
          </button>
        ))}
        {!showSolution && (
          <button
            type="button"
            onClick={() => setShowSolution(true)}
            className="rounded-full border border-[var(--color-amber-soft)] bg-[var(--color-amber-soft)] px-3 py-1 text-xs text-[var(--color-amber)] transition hover:brightness-110"
          >
            Ver explicação
          </button>
        )}
      </div>
      {hints.slice(0, revealed).map((h, i) => (
        <p key={i} className="rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-[var(--color-text-secondary)]">
          <span className="mono text-[var(--color-accent-strong)]">Dica {i + 1}:</span> {h}
        </p>
      ))}
      {showSolution && (
        <p className="rounded-lg border border-[var(--color-amber-soft)] bg-[var(--color-amber-soft)] px-3 py-2 text-sm text-[var(--color-text-primary)]">
          {solution}
        </p>
      )}
    </div>
  );
}
