import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { modulesForExam } from '@/content/modules';
import { useActiveExam } from '@/store/activeExam';
import { topicsForModule } from '@/content/topics';
import { ExamLikelihoodBadge } from '@/components/ui';
import '@/features/home/home.css';
import { ModuleArt } from './ModuleArt';
import type { ExamLikelihood } from '@/content/types';

const LIKELIHOOD_RANK: Record<ExamLikelihood, number> = { low: 0, medium: 1, high: 2 };

/** Maior `examLikelihood` entre os tópicos do módulo — usado só para dar um sinal rápido no card, nunca inventado. */
function moduleLikelihood(moduleId: string): ExamLikelihood {
  const topics = topicsForModule(moduleId);
  return topics.reduce<ExamLikelihood>((best, t) => (LIKELIHOOD_RANK[t.examLikelihood] > LIKELIHOOD_RANK[best] ? t.examLikelihood : best), 'low');
}

/** Grade com os módulos da prova ativa — ponto de entrada para navegar até um módulo específico. Rota: /modulos */
export function ModuleListPage() {
  const exam = useActiveExam();
  const modules = modulesForExam(exam);
  return (
    <div className="flex flex-col gap-8">
      <motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">{exam === 'all' ? 'Todos os módulos' : `Módulos da ${exam}`}</h1>
        <p className="text-[var(--color-text-secondary)]">Escolha um módulo para ver os tópicos e começar a estudar.</p>
      </motion.header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module, i) => {
          const isReview = exam !== 'all' && module.exam !== exam;
          const topicCount = topicsForModule(module.id).length;
          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.06 * i }}
            >
              <Link to={`/modulos/${module.id}`} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] rounded-2xl">
                <div className="art-card">
                  <div className="cover relative">
                    <ModuleArt moduleId={module.id} />
                    <ExamLikelihoodBadge level={moduleLikelihood(module.id)} className="absolute right-3 top-3" />
                  </div>
                  <div className="body">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">
                      {isReview ? `Revisão da ${module.exam} (cai, a prova é cumulativa)` : `${module.exam} · Módulo ${module.order.toString().padStart(2, '0')}`}
                    </span>
                    <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{module.title}</h2>
                    <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{module.description}</p>
                  </div>
                  <span className="mt-auto text-xs text-[var(--color-text-tertiary)]">
                    {topicCount} tópico{topicCount !== 1 ? 's' : ''}
                  </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
