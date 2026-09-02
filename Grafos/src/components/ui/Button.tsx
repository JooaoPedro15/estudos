import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Estilo visual do botão. @default 'primary' */
  variant?: ButtonVariant;
  /** Tamanho do botão. @default 'md' */
  size?: ButtonSize;
  /** Ícone (ou spinner) exibido antes do texto. */
  icon?: ReactNode;
  /** Faz o botão ocupar 100% da largura do container. */
  fullWidth?: boolean;
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-[15px] gap-2.5 rounded-xl',
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-accent)] text-white border border-[var(--color-accent)] shadow-[var(--shadow-glow-accent)] hover:bg-[var(--color-accent-strong)] hover:border-[var(--color-accent-strong)]',
  secondary:
    'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-elevated-2)]',
  ghost:
    'bg-transparent text-[var(--color-text-secondary)] border border-transparent hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]',
};

/**
 * Botão base do design system do GraphLab P1.
 *
 * Acessibilidade: mantém o `<button>` nativo (foco e ativação por teclado
 * funcionam sem esforço extra) e expõe um anel de foco visível via
 * `focus-visible`, sem interferir no clique de mouse.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', icon, fullWidth = false, className, children, disabled, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={clsx(
        'inline-flex select-none items-center justify-center whitespace-nowrap font-medium',
        'transition-[background-color,border-color,color,transform,box-shadow] duration-150 ease-out',
        'active:scale-[0.97]',
        'disabled:pointer-events-none disabled:opacity-40',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]',
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
});
