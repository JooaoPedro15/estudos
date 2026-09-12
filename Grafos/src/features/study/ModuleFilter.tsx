import clsx from 'clsx';
import { modules } from '@/content/modules';
import { ALL_MODULES } from './moduleScope';

export type ChipTone = 'accent' | 'cyan' | 'amber' | 'success' | 'danger';

const ACTIVE_CLASSES: Record<ChipTone, string> = {
  accent: 'border-[var(--color-accent)]/45 bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]',
  cyan: 'border-[var(--color-cyan)]/45 bg-[var(--color-cyan-soft)] text-[var(--color-cyan)]',
  amber: 'border-[var(--color-amber)]/45 bg-[var(--color-amber-soft)] text-[var(--color-amber)]',
  success: 'border-[var(--color-success)]/45 bg-[var(--color-success-soft)] text-[var(--color-success)]',
  danger: 'border-[var(--color-danger)]/45 bg-[var(--color-danger-soft)] text-[var(--color-danger)]',
};

export interface ChipOption {
  id: string;
  label: string;
}

/** Linha de chips exclusivos (um selecionado por vez). */
export function ChipGroup({
  options,
  value,
  onChange,
  label,
  tone = 'accent',
  disabled,
}: {
  options: ChipOption[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  tone?: ChipTone;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          disabled={disabled}
          onClick={() => onChange(o.id)}
          aria-pressed={value === o.id}
          className={clsx(
            'rounded-full border px-3 py-1 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
            value === o.id
              ? ACTIVE_CLASSES[tone]
              : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Chips "Todos + um por módulo" para escolher se a sessão cobre a matéria inteira ou um módulo só. */
export function ModuleFilter({ value, onChange, tone, disabled }: { value: string; onChange: (id: string) => void; tone?: ChipTone; disabled?: boolean }) {
  return (
    <ChipGroup
      label="Escolher módulo"
      tone={tone}
      disabled={disabled}
      value={value}
      onChange={onChange}
      options={[{ id: ALL_MODULES, label: 'Matéria inteira' }, ...modules.map((m) => ({ id: m.id, label: m.shortTitle }))]}
    />
  );
}
