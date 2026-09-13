import { symbolsIn } from '@/content/symbols';

/**
 * Legenda compacta: só os símbolos do dicionário (content/symbols.ts) que
 * aparecem nos textos dados — uma linha por símbolo. Usada no "Me ensine" e
 * embaixo da resposta-modelo, para quem ainda não decorou a notação.
 */
export function SymbolLegend({ texts, title = 'Símbolos usados aqui' }: { texts: (string | undefined)[]; title?: string }) {
  const found = symbolsIn(...texts.filter((t): t is string => Boolean(t)));
  if (found.length === 0) return null;
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">{title}</p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        {found.map((s) => (
          <div key={s.symbol} className="contents">
            <dt className="mono self-start whitespace-nowrap rounded-md bg-[var(--color-bg-raised)] px-2 py-0.5 text-xs text-[var(--color-accent-strong)]">{s.symbol}</dt>
            <dd className="text-xs leading-relaxed text-[var(--color-text-secondary)]">{s.meaning}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
