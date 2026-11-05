import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import clsx from 'clsx';
import { ArrowRight, Brain, CalendarDays, FileText, Flame, FlaskConical, TriangleAlert } from 'lucide-react';
import type { ProgressState } from '@/content/types';
import { P2_PLAN, daysUntilP2, localIsoDate, type PlanDay } from '@/content/p2Plan';
import { getTopic } from '@/content/topics';
import { appearancesFor, examFamiliesFor, examFamilyWeight } from '@/content/examFamilies';
import { realExams } from '@/content/exams';
import { loadProgress, topicMasteryPercent } from '@/store/progress';
import { setActiveExam } from '@/store/activeExam';
import { Card, ProgressBar } from '@/components/ui';

const TOOLS = [
  { icon: Flame, title: 'Treino de prova', text: 'Dissertativas e fechadas, pesadas pelo que mais cai.', href: '/estudar/prova' },
  { icon: FlaskConical, title: 'Laboratório', text: 'Desenhe ou carregue um grafo e rode os algoritmos.', href: '/playground' },
  { icon: Brain, title: 'Decorar conceitos', text: 'Definições para escrever de memória.', href: '/estudar/conceitos' },
];

function DayCard({ day, state, progress }: { day: PlanDay; state: 'past' | 'today' | 'future'; progress: ProgressState | null }) {
  const [, dayNumber] = day.date.slice(5).split('-');
  return (
    <div
      className={clsx(
        'relative flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:gap-5 sm:p-5',
        state === 'today' ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]' : 'border-[var(--color-border)] bg-[var(--color-bg-raised)]',
        state === 'past' && 'opacity-60',
      )}
    >
      <div className="flex shrink-0 items-baseline gap-2 sm:w-14 sm:flex-col sm:items-center sm:gap-0">
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">{day.weekday}</span>
        <span className="text-2xl font-semibold text-[var(--color-text-primary)]">{dayNumber}</span>
        {state === 'today' && <span className="rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-[10px] font-semibold text-white sm:mt-1">HOJE</span>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{day.title}</h3>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{day.why}</p>
        </div>
        {day.topics.length > 0 && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {day.topics.map(([moduleId, topicId]) => {
              const percent = topicMasteryPercent(progress?.topicStats[topicId]);
              return (
                <Link
                  key={topicId}
                  to={`/modulos/${moduleId}/${topicId}`}
                  className="flex flex-col gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 transition-colors hover:border-[var(--color-accent)]"
                >
                  <span className="text-xs font-medium text-[var(--color-text-primary)]">{getTopic(topicId)?.title ?? topicId}</span>
                  <ProgressBar value={percent} size="sm" label={`Acerto em ${getTopic(topicId)?.title}`} />
                </Link>
              );
            })}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {day.practice.map((link) => (
            <Link key={link.href} to={link.href} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)]">
              {link.label} <ArrowRight size={12} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Ponto de entrada da Prova 2: o roteiro até a prova, as provas antigas e o que mais cai. Rota: /prova2 */
export function Prova2Page() {
  const [progress, setProgress] = useState<ProgressState | null>(null);
  useEffect(() => {
    // Quem entra aqui está estudando a P2: o resto do app acompanha.
    setActiveExam('P2');
    loadProgress().then(setProgress);
  }, []);

  const days = daysUntilP2();
  const today = localIsoDate();
  const families = examFamiliesFor('P2')
    .map((f) => ({ f, count: new Set(appearancesFor(f, 'P2').map((a) => a.split('-Q')[0])).size, weight: examFamilyWeight(f, 'P2') }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count);
  const maxCount = Math.max(1, ...families.map((x) => x.count));
  const exams = realExams.filter((e) => e.prova === 'P2');

  return (
    <div className="flex flex-col gap-10">
      <motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">Estudo P2</h1>
          <p className="max-w-2xl text-[var(--color-text-secondary)]">Tudo para a Prova 2 de Grafos em um lugar: o que estudar em cada dia, as provas antigas e o que mais cai. A prova é cumulativa.</p>
        </div>
        <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-4 py-3">
          <CalendarDays size={20} className="text-[var(--color-accent-strong)]" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">{days > 1 ? `Faltam ${days} dias` : days === 1 ? 'É amanhã' : days === 0 ? 'É hoje' : 'Prova realizada'}</span>
            <span className="text-xs text-[var(--color-text-tertiary)]">Quarta, 11/11/2026</span>
          </div>
        </div>
      </motion.header>

      <section aria-labelledby="roteiro" className="flex flex-col gap-3">
        <h2 id="roteiro" className="text-lg font-semibold text-[var(--color-text-primary)]">
          Roteiro até a prova
        </h2>
        <p className="-mt-2 text-xs text-[var(--color-text-tertiary)]">Ordem pela frequência nas 9 provas do Prof. Silvio. Mostra prioridade, não garante o que vai cair. A barra de cada tópico é o seu acerto nas questões.</p>
        {P2_PLAN.map((day) => (
          <DayCard key={day.date} day={day} progress={progress} state={day.date === today ? 'today' : day.date < today ? 'past' : 'future'} />
        ))}
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {TOOLS.map((tool) => (
          <Link key={tool.href} to={tool.href} className="block">
            <Card interactive padding="md" className="flex h-full flex-col gap-2">
              <tool.icon size={18} className="text-[var(--color-accent-strong)]" />
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{tool.title}</h3>
              <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">{tool.text}</p>
            </Card>
          </Link>
        ))}
      </div>

      <section aria-labelledby="mais-cai" className="flex flex-col gap-3">
        <h2 id="mais-cai" className="text-lg font-semibold text-[var(--color-text-primary)]">
          O que mais cai
        </h2>
        <Card padding="md" className="flex flex-col gap-1">
          {families.map(({ f, count }) => (
            <Link key={f.id} to={`/estudar/prova?familia=${f.id}`} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 rounded-lg px-2 py-2 transition-colors hover:bg-[var(--color-bg-elevated)] sm:grid-cols-[minmax(0,1fr)_160px_auto]">
              <span className="text-sm text-[var(--color-text-primary)]">{f.title}</span>
              <span className="order-3 col-span-2 h-1.5 overflow-hidden rounded-full bg-[var(--color-bg-elevated-2)] sm:order-none sm:col-span-1">
                <span className="block h-full rounded-full bg-[var(--color-accent)]" style={{ width: `${(count / maxCount) * 100}%` }} />
              </span>
              <span className="mono text-xs text-[var(--color-text-tertiary)]">{count} prova{count > 1 ? 's' : ''}</span>
            </Link>
          ))}
        </Card>
      </section>

      <section aria-labelledby="provas" className="flex flex-col gap-3">
        <h2 id="provas" className="text-lg font-semibold text-[var(--color-text-primary)]">
          Provas antigas
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {exams.map((exam) => (
            <Link key={exam.id} to={`/simulado/${exam.id}`} className="block">
              <Card interactive padding="md" className="flex h-full flex-col gap-1.5">
                <span className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
                  <FileText size={15} className="shrink-0 text-[var(--color-cyan)]" /> {exam.title}
                </span>
                <span className="text-xs text-[var(--color-text-tertiary)]">
                  {exam.questions.length} questões · {exam.suggestedDurationMinutes} min
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="confirmar" className="flex flex-col gap-3">
        <h2 id="confirmar" className="flex items-center gap-2 text-lg font-semibold text-[var(--color-text-primary)]">
          <TriangleAlert size={18} className="text-[var(--color-amber)]" /> Vale confirmar com o professor
        </h2>
        <ul className="flex flex-col gap-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          <li>Floyd-Warshall cai? Está riscado no resumo e nenhuma prova cobra.</li>
          <li>Serialização e caminho crítico entram, mesmo com ordenação topológica depois no cronograma?</li>
          <li>Gabarito de 2024/1: Q3 item 3 parece verdadeiro e Q7 item 4 parece falso.</li>
          <li>Nulidade no slide 11: o slide imprime e − n − k, mas o exemplo só fecha com e − n + k.</li>
        </ul>
      </section>
    </div>
  );
}
