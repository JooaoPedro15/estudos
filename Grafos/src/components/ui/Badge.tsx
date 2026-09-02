import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import type { Difficulty, ExamLikelihood } from '@/content/types';

export type BadgeTone = 'neutral' | 'accent' | 'cyan' | 'success' | 'amber' | 'danger';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Tom de cor semântico. @default 'neutral' */
  tone?: BadgeTone;
  children: ReactNode;
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: 'bg-[var(--color-bg-elevated-2)] text-[var(--color-text-secondary)] border-[var(--color-border-strong)]',
  accent: 'bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)] border-[var(--color-accent)]/45',
  cyan: 'bg-[var(--color-cyan-soft)] text-[var(--color-cyan)] border-[var(--color-cyan)]/45',
  success: 'bg-[var(--color-success-soft)] text-[var(--color-success)] border-[var(--color-success)]/45',
  amber: 'bg-[var(--color-amber-soft)] text-[var(--color-amber)] border-[var(--color-amber)]/45',
  danger: 'bg-[var(--color-danger-soft)] text-[var(--color-danger)] border-[var(--color-danger)]/45',
};

/** Pílula pequena para status/metadados (dificuldade, chance de cair na prova, tags). */
export function Badge({ tone = 'neutral', className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide leading-relaxed',
        TONE_CLASSES[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}

const DIFFICULTY_LABEL: Record<Difficulty, string> = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil' };
const DIFFICULTY_TONE: Record<Difficulty, BadgeTone> = { easy: 'success', medium: 'amber', hard: 'danger' };

export interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

/** Badge pronto para o campo `Difficulty` do modelo de conteúdo (easy/medium/hard). */
export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  return (
    <Badge tone={DIFFICULTY_TONE[difficulty]} className={className}>
      {DIFFICULTY_LABEL[difficulty]}
    </Badge>
  );
}

const EXAM_LIKELIHOOD_LABEL: Record<ExamLikelihood, string> = {
  low: 'Baixa chance',
  medium: 'Chance média',
  high: 'Alta chance',
};
const EXAM_LIKELIHOOD_TONE: Record<ExamLikelihood, BadgeTone> = { low: 'neutral', medium: 'amber', high: 'danger' };

export interface ExamLikelihoodBadgeProps {
  level: ExamLikelihood;
  className?: string;
}

/** Badge pronto para o campo `ExamLikelihood` (chance de cair na P1). */
export function ExamLikelihoodBadge({ level, className }: ExamLikelihoodBadgeProps) {
  return (
    <Badge tone={EXAM_LIKELIHOOD_TONE[level]} className={className}>
      {EXAM_LIKELIHOOD_LABEL[level]}
    </Badge>
  );
}
