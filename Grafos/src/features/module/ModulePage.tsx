import { motion } from 'motion/react';
import { Link, useParams } from 'react-router-dom';
import { getModule } from '@/content/modules';
import { topicsForModule } from '@/content/topics';
import { Button, Card, ExamLikelihoodBadge } from '@/components/ui';

const ICON_GLYPH: Record<string, string> = {
  graph: '🕸️',
  matrix: '🔢',
  shuffle: '🔀',
  search: '🔍',
  route: '🧭',
};

function teaser(text: string, maxLength = 140): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

/** Lista os tópicos de um módulo. Rota: /modulos/:moduleId */
export function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const module = moduleId ? getModule(moduleId) : undefined;

  if (!module) {
    return (
      <Card padding="lg" className="mx-auto max-w-lg text-center">
        <h1 className="mb-2 text-xl font-semibold text-[var(--color-text-primary)]">Módulo não encontrado</h1>
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">Esse módulo não existe ou foi removido.</p>
        <Link to="/modulos">
          <Button variant="secondary">Ver todos os módulos</Button>
        </Link>
      </Card>
    );
  }

  const topics = topicsForModule(module.id);

  return (
    <div className="flex flex-col gap-8">
      <motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-3">
        <Link to="/modulos" className="w-fit text-xs font-medium text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]">
          ← Todos os módulos
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">
            {ICON_GLYPH[module.icon] ?? '📘'}
          </span>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">
              Módulo {module.order.toString().padStart(2, '0')}
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">{module.title}</h1>
          </div>
        </div>
        <p className="max-w-2xl text-[var(--color-text-secondary)]">{module.description}</p>
      </motion.header>

      <div className="flex flex-col gap-3">
        {topics.map((topic, i) => (
          <motion.div key={topic.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.06 * i }}>
            <Link
              to={`/modulos/${module.id}/${topic.id}`}
              className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
            >
              <Card interactive className="flex flex-col gap-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-[var(--color-text-primary)]">{topic.title}</h2>
                  <ExamLikelihoodBadge level={topic.examLikelihood} />
                </div>
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{teaser(topic.whatYouNeedToKnow)}</p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
