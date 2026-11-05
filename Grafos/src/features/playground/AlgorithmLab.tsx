import { useMemo, useState } from 'react';
import { Play } from 'lucide-react';
import type { GraphData } from '@/content/types';
import type { GraphAnimation } from '@/content/lessons/types';
import { LAB_ALGORITHMS } from '@/content/lessons/runners';
import { AnimationPlayer } from '@/features/module/GraphLesson';
import { Button, Card } from '@/components/ui';
import { ChipGroup } from '@/features/study/ModuleFilter';

/** Roda, passo a passo, qualquer algoritmo da P2 no grafo que está na tela. */
export function AlgorithmLab({ graph }: { graph: GraphData }) {
  const [algorithmId, setAlgorithmId] = useState('kruskal');
  const [source, setSource] = useState('');
  const [run, setRun] = useState<{ animation: GraphAnimation; key: number } | null>(null);
  const [error, setError] = useState('');

  const algorithm = LAB_ALGORITHMS.find((a) => a.id === algorithmId)!;
  const warning = useMemo(() => algorithm.check?.(graph), [algorithm, graph]);
  const validSource = graph.vertices.some((v) => v.id === source) ? source : (graph.vertices[0]?.id ?? '');
  const groups = [...new Set(LAB_ALGORITHMS.map((a) => a.group))];

  function start() {
    setError('');
    try {
      const steps = algorithm.run(graph, validSource);
      setRun((prev) => ({ animation: { id: algorithm.id, title: algorithm.label, steps }, key: (prev?.key ?? 0) + 1 }));
    } catch {
      setRun(null);
      setError('Esse algoritmo não consegue rodar neste grafo. Confira se ele é conexo e tem as arestas necessárias.');
    }
  }

  return (
    <Card padding="lg" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Rodar algoritmo neste grafo</h2>
        <p className="text-xs text-[var(--color-text-tertiary)]">Mude um peso, apague uma aresta e rode de novo para ver o que muda.</p>
      </div>

      <div className="flex flex-col gap-3">
        {groups.map((group) => (
          <div key={group} className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">{group}</span>
            <ChipGroup
              label={group}
              value={algorithmId}
              onChange={(id) => {
                setAlgorithmId(id);
                setRun(null);
                setError('');
              }}
              options={LAB_ALGORITHMS.filter((a) => a.group === group).map((a) => ({ id: a.id, label: a.label }))}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        {algorithm.needsSource && (
          <label className="flex flex-col gap-1 text-xs text-[var(--color-text-tertiary)]">
            Vértice inicial
            <select
              value={validSource}
              onChange={(e) => setSource(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
            >
              {graph.vertices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
        )}
        <Button onClick={start} disabled={graph.vertices.length === 0 || Boolean(warning?.block)} icon={<Play size={14} />}>
          Rodar {algorithm.label}
        </Button>
      </div>

      {warning && <p className="rounded-lg border border-[var(--color-amber)]/40 bg-[var(--color-amber-soft)] px-3 py-2 text-xs text-[var(--color-text-primary)]">{warning.message}</p>}
      {error && <p className="rounded-lg border border-[var(--color-danger)]/40 bg-[var(--color-danger-soft)] px-3 py-2 text-xs text-[var(--color-text-primary)]">{error}</p>}

      {run && <AnimationPlayer key={run.key} animation={run.animation} />}
    </Card>
  );
}
