import { Flame, CircleHelp } from 'lucide-react';
import type { Question } from '@/content/types';
import { TOTAL_EXAMS, familiesUsingConcept, getExamFamily, examFamilyWeight } from '@/content/examFamilies';

/**
 * Selo "quanto isso cai na prova", acima de uma questão:
 * - questão de família de prova: "Caiu em 5 de 8 provas · 2022/1-Q1, …";
 * - definição (aberta ou fechada): "Usado na resposta de N provas", com as famílias.
 * Sem nada a dizer, não renderiza.
 */
export function ExamRelevance({ question }: { question: Question }) {
  const family = question.examFamily ? getExamFamily(question.examFamily) : undefined;
  if (family) {
    const n = family.appearances.length;
    return (
      <div className="flex flex-col gap-1 rounded-xl border border-[var(--color-danger)]/35 bg-[var(--color-danger-soft)] px-3.5 py-2.5">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-danger)]">
          <Flame size={13} /> Caiu em {n} de {TOTAL_EXAMS} provas
          {family.scopeUncertain && (
            <span className="ml-1 inline-flex items-center gap-1 rounded-full border border-[var(--color-cyan)]/45 bg-[var(--color-cyan-soft)] px-2 py-0.5 text-[10px] normal-case tracking-normal text-[var(--color-cyan)]" title="Cronograma 2026/2 põe este assunto depois da P1">
              <CircleHelp size={10} /> P1 ou P2?
            </span>
          )}
        </p>
        <p className="text-xs leading-relaxed text-[var(--color-text-primary)]">{family.title}</p>
        <p className="mono text-[11px] text-[var(--color-text-tertiary)]">{family.appearances.join(' · ')}</p>
      </div>
    );
  }

  const conceptId = question.type === 'DEFINITION' ? question.id : question.definitionId;
  if (!conceptId) return null;
  const families = familiesUsingConcept(conceptId);
  if (families.length === 0) return null;
  const exams = new Set(families.flatMap((f) => f.appearances.map((a) => a.split('-')[0])));
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-[var(--color-amber)]/35 bg-[var(--color-amber-soft)] px-3.5 py-2.5">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-amber)]">
        <Flame size={13} /> Conceito usado na resposta de {exams.size} de {TOTAL_EXAMS} provas
      </p>
      <ul className="flex flex-col gap-0.5">
        {families.map((f) => (
          <li key={f.id} className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
            <span className="mono text-[var(--color-text-tertiary)]">{examFamilyWeight(f)}×</span> {f.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
