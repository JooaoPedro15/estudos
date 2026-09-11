import { useState } from 'react';
import { GraduationCap, Lightbulb, PenLine, TriangleAlert } from 'lucide-react';
import type { Question } from '@/content/types';
import { getTopic } from '@/content/topics';
import { getQuestion } from '@/content/questions';
import { IconChip } from '@/components/ui';
import { formatSource } from './formatSource';

/**
 * Botão "Me ensine" — abre um passo a passo pedagógico da questão: o
 * conceito por trás, o método geral (reaproveita `topic.understand`) e como
 * ele se aplica a este caso específico (`question.solution`). Não é só a
 * resposta — é o raciocínio para resolver o PRÓXIMO problema parecido.
 */
export function TeachMePanel({ question }: { question: Question }) {
  const [open, setOpen] = useState(false);
  const topic = getTopic(question.topic);
  // Fechada gerada de uma definição: ensina com a explicação da definição de origem.
  const sourceDefinition = question.definitionId ? getQuestion(question.definitionId) : undefined;
  const definition = question.type === 'DEFINITION' ? question : sourceDefinition?.type === 'DEFINITION' ? sourceDefinition : undefined;

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-accent-strong)] transition hover:brightness-110"
      >
        <GraduationCap size={14} />
        {open ? 'Ocultar explicação' : 'Me ensine'}
      </button>

      {open && definition && <DefinitionLesson question={definition} />}

      {open && !definition && (
        <div className="flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4">
          {topic ? (
            <>
              <div className="flex items-start gap-3">
                <IconChip icon={GraduationCap} tone="accent" size="sm" />
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Conceito por trás</p>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{topic.whatYouNeedToKnow}</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Método, passo a passo</p>
                <ol className="flex flex-col gap-2.5">
                  {topic.understand.map((step, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span className="mono flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[11px] font-semibold text-[var(--color-accent-strong)]">
                        {i + 1}
                      </span>
                      <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {topic.commonPitfall && (
                <div className="flex items-start gap-2.5 rounded-lg border border-[var(--color-amber)]/35 bg-[var(--color-amber-soft)] px-3 py-2.5">
                  <TriangleAlert size={15} className="mt-0.5 shrink-0 text-[var(--color-amber)]" />
                  <p className="text-xs leading-relaxed text-[var(--color-text-primary)]">{topic.commonPitfall}</p>
                </div>
              )}
            </>
          ) : null}

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Aplicando neste caso</p>
            <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">{question.solution}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * "Me ensine" de uma definição: primeiro a parte para ENTENDER (metáfora,
 * por que cada pedaço da definição está ali, exemplo), por último a parte
 * para DECORAR — a redação literal do professor, que é o que vale na prova.
 * Não usa `topic.understand`: aquilo é método de resolver problema, não serve aqui.
 */
function DefinitionLesson({ question }: { question: Extract<Question, { type: 'DEFINITION' }> }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4">
      <div className="flex items-start gap-3">
        <IconChip icon={Lightbulb} tone="amber" size="sm" />
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Entenda</p>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{question.intuition}</p>
        </div>
      </div>

      {question.breakdown && question.breakdown.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Por que a definição é assim</p>
          <ul className="flex flex-col gap-2">
            {question.breakdown.map((item, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="mono mt-0.5 shrink-0 text-[11px] text-[var(--color-accent-strong)]">▸</span>
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {question.example && (
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Exemplo</p>
          <p className="mono whitespace-pre-wrap rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-bg-raised)] px-3 py-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{question.example}</p>
        </div>
      )}

      <div className="flex items-start gap-3 rounded-xl border border-[var(--color-accent)]/45 bg-[var(--color-accent-soft)] p-4">
        <IconChip icon={PenLine} tone="accent" size="sm" />
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-strong)]">Como escrever na prova</p>
          <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">{question.solution}</p>
          <p className="mono pt-1 text-[11px] text-[var(--color-text-tertiary)]">Fonte: {formatSource(question.source)}</p>
        </div>
      </div>

      {question.note && (
        <div className="flex items-start gap-2.5 rounded-lg border border-[var(--color-amber)]/35 bg-[var(--color-amber-soft)] px-3 py-2.5">
          <TriangleAlert size={15} className="mt-0.5 shrink-0 text-[var(--color-amber)]" />
          <p className="text-xs leading-relaxed text-[var(--color-text-primary)]">{question.note}</p>
        </div>
      )}
    </div>
  );
}
