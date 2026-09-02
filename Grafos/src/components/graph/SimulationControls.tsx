import { useEffect, useRef, useState } from 'react';
import type { AlgorithmStep } from '@/lib/graph';

export interface SimulationControlsProps {
  steps: AlgorithmStep[];
  index: number;
  onIndexChange: (i: number) => void;
}

const SPEEDS = [0.5, 1, 1.5, 2] as const;

export function SimulationControls({ steps, index, onIndexChange }: SimulationControlsProps) {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!playing) return;
    if (index >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    timer.current = setTimeout(() => onIndexChange(index + 1), 1100 / speed);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index, speed, steps.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.code === 'ArrowRight') {
        onIndexChange(Math.min(steps.length - 1, index + 1));
      } else if (e.code === 'ArrowLeft') {
        onIndexChange(Math.max(0, index - 1));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [index, steps.length, onIndexChange]);

  const step = steps[index];

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-raised)] p-4">
      <p className="min-h-10 text-sm leading-relaxed text-[var(--color-text-secondary)]">{step?.description ?? '—'}</p>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="control-btn"
            disabled={index <= 0}
            onClick={() => {
              setPlaying(false);
              onIndexChange(0);
            }}
            aria-label="Reiniciar"
          >
            ⏮
          </button>
          <button
            type="button"
            className="control-btn"
            disabled={index <= 0}
            onClick={() => {
              setPlaying(false);
              onIndexChange(index - 1);
            }}
            aria-label="Passo anterior"
          >
            ◀
          </button>
          <button
            type="button"
            className="control-btn control-btn-primary"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pausar' : 'Reproduzir'}
          >
            {playing ? '⏸' : '▶'}
          </button>
          <button
            type="button"
            className="control-btn"
            disabled={index >= steps.length - 1}
            onClick={() => {
              setPlaying(false);
              onIndexChange(index + 1);
            }}
            aria-label="Próximo passo"
          >
            ▶|
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
          <span className="mono">
            Etapa {Math.min(index + 1, steps.length)} / {steps.length}
          </span>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value) as (typeof SPEEDS)[number])}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-1.5 py-1 text-xs text-[var(--color-text-secondary)]"
          >
            {SPEEDS.map((s) => (
              <option key={s} value={s}>
                {s}x
              </option>
            ))}
          </select>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={Math.max(0, steps.length - 1)}
        value={index}
        onChange={(e) => {
          setPlaying(false);
          onIndexChange(Number(e.target.value));
        }}
        className="w-full accent-[var(--color-accent)]"
      />
    </div>
  );
}
