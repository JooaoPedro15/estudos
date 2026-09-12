import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp, GraduationCap, Lightbulb, PenLine, Sigma, TriangleAlert } from 'lucide-react';
import type { Question, WalkthroughStep } from '@/content/types';
import { getTopic } from '@/content/topics';
import { getQuestion } from '@/content/questions';
import { lessons } from '@/content/lessons';
import { formulasFor } from '@/content/formulas';
import { symbolsIn } from '@/content/symbols';
import { IconChip } from '@/components/ui';
import { formatSource } from './formatSource';
import { FormulaGlossary } from './FormulaGlossary';
import { GraphVisualizer } from '@/components/graph/GraphVisualizer';
import { SimpleExplanation } from './SimpleExplanation';
import { PrerequisitesPanel } from './PrerequisitesPanel';

/**
 * Botão "Me ensine". Ordem pensada para quem não sabe nada da matéria:
 * (1) como resolver ESTE caso, (2) o que significa cada símbolo que apareceu,
 * (3) seções fechadas para aprofundar — explicação simples com desenho,
 * fórmulas símbolo por símbolo, definição do professor + método geral.
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
          {/* 1. A resposta deste caso, primeiro — é o que se lê na hora. Com desenho passo a passo quando a questão traz. */}
          <div className="flex flex-col gap-3 rounded-xl border border-[var(--color-accent)]/45 bg-[var(--color-accent-soft)] p-4">
            <div className="flex items-center gap-3">
              <IconChip icon={PenLine} tone="accent" size="sm" />
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-strong)]">Como resolver este caso</p>
            </div>
            {question.walkthrough && question.walkthrough.length > 0 ? (
              <Walkthrough steps={question.walkthrough} />
            ) : (
              <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">{question.solution}</p>
            )}
            {question.generalRule && (
              <p className="rounded-lg border border-[var(--color-success)]/40 bg-[var(--color-success-soft)] px-3 py-2 text-sm leading-relaxed text-[var(--color-text-primary)]">
                <span className="font-semibold text-[var(--color-success)]">Em outros casos: </span>
                {question.generalRule.replace(/^Regra geral:\s*/i, '')}
              </p>
            )}
          </div>

          {/* 2. Só os símbolos que aparecem nesta questão, uma linha cada. */}
          <SymbolLegend texts={[question.prompt, question.solution]} />

          {/* 3. O resto, fechado: abre o que precisar. */}
          {topic && (
            <>
              <Collapsible title="Explicação simples, com desenho" icon={<Lightbulb size={14} />}>
                <SimpleExplanation concepts={lessons[topic.id] ?? []} />
              </Collapsible>

              {formulasFor(question.topic, question.examFamily).length > 0 && (
                <Collapsible title="Fórmulas, símbolo por símbolo" icon={<Sigma size={14} />}>
                  <FormulaGlossary formulas={formulasFor(question.topic, question.examFamily)} />
                </Collapsible>
              )}

              <Collapsible title="Como o professor define + método geral" icon={<GraduationCap size={14} />}>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Conceito por trás</p>
                    <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{topic.whatYouNeedToKnow}</p>
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
                </div>
              </Collapsible>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/** Passos numerados, cada um com o grafo e o que está destacado naquele passo — "de onde saiu esse número". */
function Walkthrough({ steps }: { steps: WalkthroughStep[] }) {
  return (
    <ol className="flex flex-col gap-3">
      {steps.map((step, i) => (
        <li key={i} className="flex flex-col gap-2">
          <div className="flex gap-2.5">
            <span className="mono flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-raised)] text-[11px] font-semibold text-[var(--color-accent-strong)]">{i + 1}</span>
            <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">{step.text}</p>
          </div>
          {step.graph && (
            <div className="ml-7 overflow-hidden rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-bg-elevated)]">
              <GraphVisualizer
                graph={step.graph}
                interactive={false}
                height={230}
                highlightVertexIds={step.highlightVertexIds}
                highlightEdgeIds={step.highlightEdgeIds}
                vertexColorMap={step.vertexColorMap}
                edgeColorMap={step.edgeColorMap}
                vertexNotes={step.vertexNotes}
                accessibleLabel={step.caption ?? step.text}
              />
              {step.caption && <p className="px-3 py-1.5 text-xs text-[var(--color-text-tertiary)]">{step.caption}</p>}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

/** Legenda compacta: só os símbolos do dicionário (content/symbols.ts) que aparecem nos textos dados. */
function SymbolLegend({ texts }: { texts: string[] }) {
  const found = symbolsIn(...texts);
  if (found.length === 0) return null;
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Símbolos usados aqui</p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        {found.map((s) => (
          <div key={s.symbol} className="contents">
            <dt className="mono whitespace-nowrap rounded-md bg-[var(--color-bg-raised)] px-2 py-0.5 text-xs text-[var(--color-accent-strong)]">{s.symbol}</dt>
            <dd className="text-xs leading-relaxed text-[var(--color-text-secondary)]">{s.meaning}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Seção fechada por padrão — o aluno abre só o que quer ler. */
function Collapsible({ title, icon, children, defaultOpen = false }: { title: string; icon?: ReactNode; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-raised)]">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left">
        <span className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)]">
          {icon}
          {title}
        </span>
        {open ? <ChevronUp size={16} className="shrink-0 text-[var(--color-text-tertiary)]" /> : <ChevronDown size={16} className="shrink-0 text-[var(--color-text-tertiary)]" />}
      </button>
      {open && <div className="border-t border-[var(--color-border-soft)] px-3.5 py-3">{children}</div>}
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
  const formulas = formulasFor(question.topic);
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4">
      <PrerequisitesPanel definitionId={question.id} />

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

      <SymbolLegend texts={[question.solution]} />

      {formulas.length > 0 && (
        <Collapsible title="Fórmulas, símbolo por símbolo" icon={<Sigma size={14} />}>
          <FormulaGlossary formulas={formulas} />
        </Collapsible>
      )}
    </div>
  );
}
