import type { ReactNode } from 'react';
import clsx from 'clsx';

export type StatTrendDirection = 'up' | 'down' | 'flat';

export interface StatTileTrend {
  direction: StatTrendDirection;
  /** Texto curto, ex.: "12% essa semana". */
  label: string;
}

export interface StatTileProps {
  label: string;
  value: ReactNode;
  trend?: StatTileTrend;
  icon?: ReactNode;
  className?: string;
}

const TREND_COLOR: Record<StatTrendDirection, string> = {
  up: 'text-[var(--color-success)]',
  down: 'text-[var(--color-danger)]',
  flat: 'text-[var(--color-text-tertiary)]',
};
const TREND_GLYPH: Record<StatTrendDirection, string> = { up: '↑', down: '↓', flat: '→' };

/** Tile de estatística — label + número grande + tendência opcional. Usado no dashboard de progresso. */
export function StatTile({ label, value, trend, icon, className }: StatTileProps) {
  return (
    <div
      className={clsx(
        'flex flex-col gap-2.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-raised)] p-4 shadow-[var(--shadow-card)]',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">{label}</span>
        {icon && (
          <span className="text-[var(--color-text-secondary)]" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="mono text-2xl font-semibold text-[var(--color-text-primary)]">{value}</span>
        {trend && (
          <span className={clsx('flex items-center gap-0.5 text-xs font-medium', TREND_COLOR[trend.direction])}>
            <span aria-hidden="true">{TREND_GLYPH[trend.direction]}</span>
            {trend.label}
          </span>
        )}
      </div>
    </div>
  );
}
