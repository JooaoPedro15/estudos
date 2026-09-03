import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

export type IconChipTone = 'neutral' | 'accent' | 'cyan' | 'amber' | 'success' | 'danger';
export type IconChipSize = 'sm' | 'md' | 'lg';

export interface IconChipProps {
  icon: LucideIcon;
  tone?: IconChipTone;
  size?: IconChipSize;
  className?: string;
}

const TONE_CLASSES: Record<IconChipTone, string> = {
  neutral: 'bg-[var(--color-bg-elevated-2)] text-[var(--color-text-secondary)] border-[var(--color-border-strong)]',
  accent: 'bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)] border-[var(--color-accent)]/35',
  cyan: 'bg-[var(--color-cyan-soft)] text-[var(--color-cyan)] border-[var(--color-cyan)]/35',
  amber: 'bg-[var(--color-amber-soft)] text-[var(--color-amber)] border-[var(--color-amber)]/35',
  success: 'bg-[var(--color-success-soft)] text-[var(--color-success)] border-[var(--color-success)]/35',
  danger: 'bg-[var(--color-danger-soft)] text-[var(--color-danger)] border-[var(--color-danger)]/35',
};

const SIZE_CLASSES: Record<IconChipSize, { box: string; icon: number }> = {
  sm: { box: 'h-7 w-7 rounded-lg', icon: 14 },
  md: { box: 'h-10 w-10 rounded-xl', icon: 18 },
  lg: { box: 'h-12 w-12 rounded-2xl', icon: 22 },
};

/** Ícone dentro de um "chip" com fundo tintado — substitui emoji por um ícone de traço (lucide) consistente com o design system. */
export function IconChip({ icon: Icon, tone = 'neutral', size = 'md', className }: IconChipProps) {
  const s = SIZE_CLASSES[size];
  return (
    <span className={clsx('inline-flex shrink-0 items-center justify-center border', TONE_CLASSES[tone], s.box, className)} aria-hidden="true">
      <Icon size={s.icon} strokeWidth={2} />
    </span>
  );
}
