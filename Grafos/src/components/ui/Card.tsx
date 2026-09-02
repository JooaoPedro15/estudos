import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Espaçamento interno. @default 'md' */
  padding?: CardPadding;
  /** Adiciona leve elevação/realce ao passar o mouse — use em cards que fazem parte de um fluxo clicável (ex.: envolvidos por um `<button>` ou `<Link>`). */
  interactive?: boolean;
  children?: ReactNode;
}

const PADDING_CLASSES: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

/** Card elevado base do design system — superfície com sombra suave, como um pequeno objeto físico sobre o fundo. */
export function Card({ padding = 'md', interactive = false, className, children, ...rest }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-raised)] shadow-[var(--shadow-card)]',
        interactive &&
          'transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-raised)]',
        PADDING_CLASSES[padding],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
