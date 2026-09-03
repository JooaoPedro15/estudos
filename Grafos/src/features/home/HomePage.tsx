import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import clsx from 'clsx';
import { Zap, BookOpen, FileText, Target, Dumbbell, type LucideIcon } from 'lucide-react';
import type { ExamLikelihood, ProgressState } from '@/content/types';
import { Button, Card, ExamLikelihoodBadge, IconChip, type IconChipTone, ProgressBar } from '@/components/ui';
import { modules } from '@/content/modules';
import { topicsForModule, getTopic } from '@/content/topics';
import { loadProgress, topicMasteryPercent } from '@/store/progress';

interface QuickAction {
  icon: LucideIcon;
  tone: IconChipTone;
  title: string;
  description: string;
  href: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { icon: Zap, tone: 'amber', title: 'Revisão de 5 min', description: 'Sessão curta com 3-7 atividades rápidas.', href: '/estudar/rapido' },
  { icon: BookOpen, tone: 'accent', title: 'Sessão de estudo', description: 'Aprofunde tópicos, do zero, com teoria e exemplos.', href: '/estudar/sessao' },
  { icon: FileText, tone: 'cyan', title: 'Simulado P1', description: 'Prova completa, no estilo real do professor.', href: '/simulado' },
  { icon: Target, tone: 'danger', title: 'Meus pontos fracos', description: 'Questões priorizadas onde seu desempenho é mais baixo.', href: '/estudar/pontos-fracos' },
  { icon: Dumbbell, tone: 'success', title: 'Prática livre', description: 'Questão atrás de questão, matéria toda, sem simulado nem tempo fixo — até você cansar.', href: '/estudar/pratica-livre' },
];

const EXAM_LIKELIHOOD_RANK: Record<ExamLikelihood, number> = { low: 0, medium: 1, high: 2 };
const RANK_TO_LIKELIHOOD: ExamLikelihood[] = ['low', 'medium', 'high'];

function moduleExamLikelihood(moduleId: string): ExamLikelihood {
  const topics = topicsForModule(moduleId);
  const maxRank = Math.max(0, ...topics.map((t) => EXAM_LIKELIHOOD_RANK[t.examLikelihood]));
  return RANK_TO_LIKELIHOOD[maxRank];
}

function moduleProgressPercent(moduleId: string, state: ProgressState | null): number {
  if (!state) return 0;
  const topics = topicsForModule(moduleId);
  if (topics.length === 0) return 0;
  const total = topics.reduce((acc, t) => acc + topicMasteryPercent(state.topicStats[t.id]), 0);
  return Math.round(total / topics.length);
}

function QuickActionCard({ action, index }: { action: QuickAction; index: number }) {
  return (
    <Link to={action.href} className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.06 * index }}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.98 }}
        className={clsx(
          'flex h-full flex-col items-start gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-raised)] p-5 text-left shadow-[var(--shadow-card)]',
          'transition-[border-color,box-shadow] duration-200 ease-out hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-glow-accent)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]',
        )}
      >
        <IconChip icon={action.icon} tone={action.tone} size="lg" />
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{action.title}</h3>
          <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">{action.description}</p>
        </div>
      </motion.div>
    </Link>
  );
}

function ModuleRow({ moduleId, title, percent, examLikelihood, index }: { moduleId: string; title: string; percent: number; examLikelihood: ExamLikelihood; index: number }) {
  return (
    <Link to={`/modulos/${moduleId}`} className="block">
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.05 * index }}
        className={clsx(
          'flex w-full flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-raised)] p-4 text-left shadow-[var(--shadow-card)]',
          'transition-[border-color,transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-raised)]',
          'sm:flex-row sm:items-center sm:justify-between',
        )}
      >
        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-sm font-medium text-[var(--color-text-primary)]">{title}</p>
          <div className="w-56 max-w-full">
            <ProgressBar value={percent} size="sm" label={`Progresso de ${title}`} />
          </div>
        </div>
        <ExamLikelihoodBadge level={examLikelihood} className="shrink-0" />
      </motion.div>
    </Link>
  );
}

/** Página inicial do GraphLab P1 — visão geral de progresso, ações rápidas e módulos. */
export function HomePage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<ProgressState | null>(null);

  useEffect(() => {
    loadProgress().then(setProgress);
  }, []);

  const lastTopic = progress?.lastTopicId ? getTopic(progress.lastTopicId) : undefined;
  const lastModule = progress?.lastModuleId ? modules.find((m) => m.id === progress.lastModuleId) : undefined;
  const continuePercent = lastTopic ? topicMasteryPercent(progress?.topicStats[lastTopic.id]) : 0;

  return (
    <div className="flex flex-col gap-10">
      <motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">GraphLab</h1>
        <p className="text-[var(--color-text-secondary)]">Preparação para P1 — Teoria dos Grafos, Prof. Silvio Jamil.</p>
      </motion.header>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
        <Card padding="lg" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">Continuar estudando</span>
            <p className="text-lg font-medium text-[var(--color-text-primary)]">{lastTopic ? lastTopic.title : 'Comece pelo primeiro módulo'}</p>
            <p className="text-xs text-[var(--color-text-tertiary)]">{lastModule ? `${String(lastModule.order).padStart(2, '0')} — ${lastModule.shortTitle}` : modules[0].description}</p>
            {lastTopic && (
              <div className="max-w-xs pt-1">
                <ProgressBar value={continuePercent} showValue label="Progresso do tópico atual" />
              </div>
            )}
          </div>
          <Button
            size="lg"
            className="shrink-0"
            onClick={() => navigate(lastTopic && lastModule ? `/modulos/${lastModule.id}/${lastTopic.id}` : `/modulos/${modules[0].id}`)}
          >
            Continuar
          </Button>
        </Card>
      </motion.div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" aria-label="Ações rápidas">
        {QUICK_ACTIONS.map((action, i) => (
          <QuickActionCard key={action.title} action={action} index={i} />
        ))}
      </section>

      <section id="modulos" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Módulos da P1</h2>
          <Link to="/modulos" className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]">
            ver todos
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {modules.map((m, i) => (
            <ModuleRow
              key={m.id}
              moduleId={m.id}
              title={`${String(m.order).padStart(2, '0')} — ${m.title}`}
              percent={moduleProgressPercent(m.id, progress)}
              examLikelihood={moduleExamLikelihood(m.id)}
              index={i}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
