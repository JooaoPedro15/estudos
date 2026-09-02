import clsx from 'clsx';

export type ProgressBarSize = 'sm' | 'md';
export type ProgressBarTone = 'accent' | 'cyan' | 'success';

export interface ProgressBarProps {
  /** Valor atual (0..max). */
  value: number;
  /** Valor máximo. @default 100 */
  max?: number;
  /** Altura da barra. @default 'md' */
  size?: ProgressBarSize;
  /** Rótulo acessível (lido por leitor de tela via aria-label). */
  label?: string;
  /** Exibe o percentual numérico ao lado da barra. @default false */
  showValue?: boolean;
  /** Cor de preenchimento. @default 'accent' */
  tone?: ProgressBarTone;
  className?: string;
}

const TRACK_HEIGHT: Record<ProgressBarSize, string> = { sm: 'h-1.5', md: 'h-2.5' };
const FILL_TONE: Record<ProgressBarTone, string> = {
  accent: 'bg-[var(--color-accent)]',
  cyan: 'bg-[var(--color-cyan)]',
  success: 'bg-[var(--color-success)]',
};

/** Barra de progresso horizontal 0–100, com trilho em baixo-relevo e preenchimento animado. */
export function ProgressBar({ value, max = 100, size = 'md', label, showValue = false, tone = 'accent', className }: ProgressBarProps) {
  const pct = max <= 0 ? 0 : Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={clsx('flex items-center gap-2.5', className)}>
      <div
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className={clsx(
          'relative w-full min-w-0 overflow-hidden rounded-full bg-[var(--color-bg-elevated-2)] shadow-[inset_0_1px_2px_#00000066]',
          TRACK_HEIGHT[size],
        )}
      >
        <div className={clsx('h-full rounded-full transition-[width] duration-500 ease-out', FILL_TONE[tone])} style={{ width: `${pct}%` }} />
      </div>
      {showValue && <span className="mono shrink-0 text-xs text-[var(--color-text-tertiary)]">{Math.round(pct)}%</span>}
    </div>
  );
}
