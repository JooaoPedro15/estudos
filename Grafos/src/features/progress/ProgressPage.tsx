import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Target } from 'lucide-react';
import { topics } from '@/content/topics';
import type { ProgressState, TopicStat } from '@/content/types';
import { loadProgress, topicMasteryPercent } from '@/store/progress';
import { Button, Card, IconChip, ProgressBar, StatTile } from '@/components/ui';

function formatStudyTime(totalSeconds: number): string {
  const totalMinutes = Math.round(totalSeconds / 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

/** Painel de progresso do estudante — estatísticas gerais + domínio por tópico, com atalho para reforçar pontos fracos. */
export function ProgressPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<ProgressState | null>(null);

  useEffect(() => {
    let active = true;
    loadProgress().then((s) => {
      if (active) {
        setState(s);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  if (loading || !state) {
    return <p className="text-[var(--color-text-secondary)]">Carregando seu progresso…</p>;
  }

  const totalAnswered = state.attempts.length;

  if (totalAnswered === 0) {
    return (
      <Card padding="lg" className="mx-auto max-w-lg text-center">
        <h1 className="mb-2 text-xl font-semibold text-[var(--color-text-primary)]">Você ainda não tem histórico por aqui</h1>
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
          Responda algumas questões (numa revisão rápida, sessão de estudo ou simulado) para o GraphLab montar seu painel de progresso e
          identificar seus pontos fracos automaticamente.
        </p>
        <Link to="/">
          <Button>Começar a estudar</Button>
        </Link>
      </Card>
    );
  }

  const totalCorrect = state.attempts.filter((a) => a.correct).length;
  const accuracyPercent = Math.round((totalCorrect / totalAnswered) * 100);
  const topicsPracticed = Object.keys(state.topicStats).length;

  const practicedRows = topics
    .map((t) => ({ topic: t, stat: state.topicStats[t.id] }))
    .filter((r): r is { topic: (typeof topics)[number]; stat: TopicStat } => !!r.stat)
    .sort((a, b) => topicMasteryPercent(a.stat) - topicMasteryPercent(b.stat));

  const notYetStudied = topics.filter((t) => !state.topicStats[t.id]);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">Seu progresso</h1>
        <p className="text-[var(--color-text-secondary)]">Acompanhe seu desempenho por tópico na preparação para a P1.</p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Estatísticas gerais">
        <StatTile label="Questões respondidas" value={totalAnswered} />
        <StatTile label="Acerto geral" value={`${accuracyPercent}%`} />
        <StatTile label="Tempo de estudo" value={formatStudyTime(state.totalStudySeconds)} />
        <StatTile label="Tópicos praticados" value={topicsPracticed} />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--color-text-primary)]">
            <IconChip icon={Target} tone="danger" size="sm" /> Pontos fracos
          </h2>
          <Button onClick={() => navigate('/estudar/pontos-fracos')}>Estudar meus pontos fracos</Button>
        </div>

        {practicedRows.length === 0 ? (
          <Card>
            <p className="text-sm text-[var(--color-text-secondary)]">Nenhum tópico com tentativas suficientes registradas ainda.</p>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {practicedRows.map(({ topic, stat }) => {
              const mastery = topicMasteryPercent(stat);
              return (
                <Card key={topic.id} padding="md" className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="mb-2 truncate text-sm font-medium text-[var(--color-text-primary)]">{topic.title}</p>
                    <ProgressBar
                      value={mastery}
                      label={`Domínio de ${topic.title}`}
                      tone={mastery >= 70 ? 'success' : 'accent'}
                    />
                  </div>
                  <span className="mono shrink-0 text-xs text-[var(--color-text-tertiary)] sm:pl-4">
                    {stat.correct}/{stat.attempts}
                  </span>
                </Card>
              );
            })}
          </div>
        )}

        {notYetStudied.length > 0 && (
          <div className="pt-2">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">Ainda não estudado</p>
            <div className="flex flex-wrap gap-2">
              {notYetStudied.map((t) => (
                <span
                  key={t.id}
                  className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1 text-xs text-[var(--color-text-tertiary)]"
                >
                  {t.title}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
