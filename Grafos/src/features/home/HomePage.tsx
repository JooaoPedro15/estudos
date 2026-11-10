import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import clsx from 'clsx';
import { Zap, BookOpen, FileText, Target, Dumbbell, Brain, Flame, type LucideIcon } from 'lucide-react';
import type { ExamScope, ExamLikelihood, ProgressState } from '@/content/types';
import { Button, Card, ExamLikelihoodBadge, IconChip, type IconChipTone, ProgressBar } from '@/components/ui';
import { modulesForExam } from '@/content/modules';
import { useActiveExam } from '@/store/activeExam';
import { topicsForModule, getTopic } from '@/content/topics';
import { loadProgress, topicMasteryPercent } from '@/store/progress';
import { ModuleArt } from '@/features/module/ModuleArt';
import { HeroScene } from './HeroScene';
import './home.css';

interface QuickAction {
  icon: LucideIcon;
  tone: IconChipTone;
  title: string;
  /** Texto fixo ou um por prova, quando a ação muda de sentido entre P1 e P2. */
  description: string | Record<ExamScope, string>;
  href: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { icon: Zap, tone: 'amber', title: 'Revisão de 5 min', description: 'Sessão curta com 3-7 atividades rápidas.', href: '/estudar/rapido' },
  { icon: BookOpen, tone: 'accent', title: 'Sessão de estudo', description: 'Aprofunde tópicos, do zero, com teoria e exemplos.', href: '/estudar/sessao' },
  { icon: FileText, tone: 'cyan', title: 'Provas reais e simulados', description: { all: 'Provas e questões da P1 e da P2 para estudar todo o conteúdo.', P1: 'As 8 provas antigas literais (2022/1–2026/1) + simulados montados. Abertas, com resposta-modelo.', P2: 'Simulados da P2 no formato da prova antiga: modelar o problema e executar o algoritmo passo a passo.' }, href: '/simulado' },
  { icon: Flame, tone: 'danger', title: 'Treino de prova', description: { all: 'Provas e questões da P1 e da P2 para estudar todo o conteúdo.', P1: 'Só o que caiu nas 8 provas antigas (e variantes com números trocados). O que caiu mais, aparece mais.', P2: 'Questões no formato de prova: AGM, caminhos mínimos e euleriano, com resposta-modelo.' }, href: '/estudar/prova' },
  { icon: Target, tone: 'danger', title: 'Meus pontos fracos', description: 'Questões priorizadas onde seu desempenho é mais baixo.', href: '/estudar/pontos-fracos' },
  { icon: Dumbbell, tone: 'success', title: 'Prática livre', description: 'Questão atrás de questão, matéria toda, sem simulado nem tempo fixo — até você cansar.', href: '/estudar/pratica-livre' },
  { icon: Brain, tone: 'cyan', title: 'Decorar conceitos', description: 'Escreva definições de memória ou reconheça a correta entre alternativas. Por módulo ou matéria inteira.', href: '/estudar/conceitos' },
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

function QuickActionCard({ action, index, exam }: { action: QuickAction; index: number; exam: ExamScope }) {
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
          'transition-[border-color,box-shadow] duration-200 ease-out hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-raised)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]',
        )}
      >
        <IconChip icon={action.icon} tone={action.tone} size="lg" />
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{action.title}</h3>
          <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">{typeof action.description === 'string' ? action.description : action.description[exam]}</p>
        </div>
      </motion.div>
    </Link>
  );
}

function ModuleCard({ moduleId, order, title, percent, examLikelihood, index }: { moduleId: string; order: number; title: string; percent: number; examLikelihood: ExamLikelihood; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 * index }} className="h-full">
      <Link to={`/modulos/${moduleId}`} className="art-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]">
        <div className="cover"><ModuleArt moduleId={moduleId} /></div>
        <div className="body">
          <div className="flex items-center justify-between gap-2">
            <span className="mono text-xs text-[var(--color-amber)]">{String(order).padStart(2, '0')}</span>
            <ExamLikelihoodBadge level={examLikelihood} className="shrink-0" />
          </div>
          <p className="font-semibold leading-snug text-[var(--color-text-primary)]">{title}</p>
          <div className="mt-auto pt-2">
            <ProgressBar value={percent} size="sm" label={`Progresso de ${title}`} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/** Página inicial — visão geral de progresso, ações rápidas e módulos da prova ativa. */
export function HomePage() {
  const navigate = useNavigate();
  const exam = useActiveExam();
  const modules = modulesForExam(exam);
  const [progress, setProgress] = useState<ProgressState | null>(null);

  useEffect(() => {
    loadProgress().then(setProgress);
  }, []);

  // "Continuar" só aponta para um tópico da prova ativa.
  const lastModule = progress?.lastModuleId ? modules.find((m) => m.id === progress.lastModuleId) : undefined;
  const lastTopic = lastModule && progress?.lastTopicId ? getTopic(progress.lastTopicId) : undefined;
  const continuePercent = lastTopic ? topicMasteryPercent(progress?.topicStats[lastTopic.id]) : 0;

  return (
    <div className="flex flex-col gap-12">
      <section className="home-hero">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="eyebrow">Teoria dos Grafos · {exam === 'all' ? 'Todo o conteúdo' : exam} · Prof. Silvio Jamil</p>
          <h1>
            Veja o <em>algoritmo</em> andar no grafo. Depois, <span>resolva a prova.</span>
          </h1>
          <p className="lead">Aulas com animação passo a passo, laboratório para desenhar seus grafos e questões no formato das provas antigas.</p>
          <div className="cta">
            <Button size="lg" onClick={() => navigate('/prioridades')}>Ver prioridades de estudo</Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/playground')}>Desenhar um grafo</Button>
          </div>
          <div className="hs-legend" aria-hidden="true">
            <span><i style={{ background: 'var(--color-amber)' }} />vértice atual</span>
            <span><i style={{ background: 'var(--color-cyan)' }} />já fechado</span>
            <span><i style={{ background: 'var(--color-accent)' }} />aresta escolhida</span>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.08 }}>
          <HeroScene key={exam} exam={exam} />
        </motion.div>
      </section>

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

      <section className="flex flex-col gap-4" aria-label="Formas de estudar">
        <h2 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">Formas de estudar</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_ACTIONS.map((action, i) => (
          <QuickActionCard key={action.title} action={action} index={i} exam={exam} />
        ))}
        </div>
      </section>

      <section id="modulos" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">{exam === 'all' ? 'Todos os módulos' : `Módulos da ${exam}`}</h2>
          <Link to="/modulos" className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]">
            ver todos
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m, i) => (
            <ModuleCard
              key={m.id}
              moduleId={m.id}
              order={m.order}
              title={m.title}
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
