import { motion } from 'motion/react';
import clsx from 'clsx';
import type { ExamLikelihood } from '@/content/types';
import { Button, Card, ExamLikelihoodBadge, ProgressBar } from '@/components/ui';

// TODO: substituir por dados reais de src/store/progress.ts
const MOCK = {
  continueStudying: {
    topicTitle: 'Representações — Matriz de Incidência',
    moduleTitle: '02 — Representações',
    percent: 68,
  },
  modules: [
    { id: 'm1', order: 1, title: '01 — Fundamentos de Grafos', percent: 82, examLikelihood: 'medium' as ExamLikelihood },
    { id: 'm2', order: 2, title: '02 — Representações', percent: 55, examLikelihood: 'high' as ExamLikelihood },
    { id: 'm3', order: 3, title: '03 — Isomorfismo & Propriedades', percent: 20, examLikelihood: 'high' as ExamLikelihood },
    { id: 'm4', order: 4, title: '04 — Busca e Alcançabilidade', percent: 40, examLikelihood: 'medium' as ExamLikelihood },
    { id: 'm5', order: 5, title: '05 — Conectividade e Caminhos Especiais', percent: 5, examLikelihood: 'low' as ExamLikelihood },
  ],
};

interface QuickAction {
  icon: string;
  title: string;
  description: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { icon: '⚡', title: 'Revisão de 5 min', description: 'Reforço rápido dos pontos que você mais erra.' },
  { icon: '📚', title: 'Sessão de estudo', description: 'Aprofunde um tópico do zero, com teoria e exemplos.' },
  { icon: '📝', title: 'Simulado P1', description: 'Prova completa, cronometrada, no estilo do professor.' },
  { icon: '🎯', title: 'Meus pontos fracos', description: 'Questões priorizadas onde seu desempenho é mais baixo.' },
];

/** Card de ação grande — ainda sem navegação real (ver TODO acima); usa `<button>` nativo para já nascer acessível por teclado. */
function QuickActionCard({ action, index }: { action: QuickAction; index: number }) {
  return (
    <motion.button
      type="button"
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
      <span className="text-2xl" aria-hidden="true">
        {action.icon}
      </span>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{action.title}</h3>
        <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">{action.description}</p>
      </div>
    </motion.button>
  );
}

function ModuleRow({ module, index }: { module: (typeof MOCK.modules)[number]; index: number }) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.05 * index }}
      className={clsx(
        'flex w-full flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-raised)] p-4 text-left shadow-[var(--shadow-card)]',
        'transition-[border-color,transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-raised)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]',
        'sm:flex-row sm:items-center sm:justify-between',
      )}
    >
      <div className="flex min-w-0 flex-col gap-2">
        <p className="text-sm font-medium text-[var(--color-text-primary)]">{module.title}</p>
        <div className="w-56 max-w-full">
          <ProgressBar value={module.percent} size="sm" label={`Progresso de ${module.title}`} />
        </div>
      </div>
      <ExamLikelihoodBadge level={module.examLikelihood} className="shrink-0" />
    </motion.button>
  );
}

/** Página inicial do GraphLab P1 — visão geral de progresso, ações rápidas e módulos. */
export function HomePage() {
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
            <p className="text-lg font-medium text-[var(--color-text-primary)]">{MOCK.continueStudying.topicTitle}</p>
            <p className="text-xs text-[var(--color-text-tertiary)]">{MOCK.continueStudying.moduleTitle}</p>
            <div className="max-w-xs pt-1">
              <ProgressBar value={MOCK.continueStudying.percent} showValue label="Progresso do tópico atual" />
            </div>
          </div>
          <Button size="lg" className="shrink-0">
            Continuar
          </Button>
        </Card>
      </motion.div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Ações rápidas">
        {QUICK_ACTIONS.map((action, i) => (
          <QuickActionCard key={action.title} action={action} index={i} />
        ))}
      </section>

      <section id="modulos" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Módulos da P1</h2>
        <div className="flex flex-col gap-3">
          {MOCK.modules.map((module, i) => (
            <ModuleRow key={module.id} module={module} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
