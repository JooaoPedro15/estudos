import { Fragment } from 'react';

/**
 * Texto de resposta com blocos de pseudocódigo: trechos entre linhas ``` são
 * renderizados em fonte mono, preservando a indentação (estilo do quadro do
 * professor); o resto vira parágrafos com quebras de linha preservadas.
 */
export function AnswerText({ text, className = 'text-sm leading-relaxed text-[var(--color-text-primary)]' }: { text: string; className?: string }) {
  const parts = text.split(/^```[^\n]*\n?/m);
  return (
    <div className="flex flex-col gap-2">
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <pre key={i} className="mono whitespace-pre-wrap rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-bg-raised)] px-3 py-2 text-xs leading-relaxed text-[var(--color-text-primary)]">
            {part.replace(/\n$/, '')}
          </pre>
        ) : part.trim() ? (
          <p key={i} className={`whitespace-pre-wrap ${className}`}>
            {part.trim()}
          </p>
        ) : (
          <Fragment key={i} />
        ),
      )}
    </div>
  );
}
