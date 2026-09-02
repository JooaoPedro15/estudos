import { useMemo, useState } from 'react';
import clsx from 'clsx';
import type { GraphData } from '@/content/types';
import { adjacencyList } from '@/lib/graph';

export interface AdjacencyListVisualizerProps {
  graph: GraphData;
  /** Vértice cuja linha deve ficar destacada (id de vértice). */
  highlightVertexId?: string;
  /** Vizinho a destacar dentro da linha de `highlightVertexId` (id de vértice). */
  highlightNeighborId?: string;
  /** Disparado ao passar o mouse sobre o rótulo de um vértice. */
  onVertexHover?: (vertexId: string) => void;
  /** Disparado ao clicar em um chip de vizinho — recebe o vértice "dono" da linha e o vizinho clicado. */
  onNeighborClick?: (vertexId: string, neighborId: string) => void;
  className?: string;
}

function Chip({
  label,
  active,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  label: string;
  active: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={clsx(
        'mono rounded-lg border px-2 py-0.5 text-xs font-medium transition-colors',
        active
          ? 'border-[var(--color-cyan)] bg-[var(--color-cyan-soft)] text-[var(--color-cyan)]'
          : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]',
      )}
    >
      {label}
    </button>
  );
}

/**
 * Lista de adjacência (sucessores, e predecessores quando o grafo é
 * dirigido) por vértice, em chips horizontais.
 *
 * Nota de implementação: para grafos não dirigidos, `adjacencyList()`
 * calcula a lista simétrica completa de vizinhos em `predecessorsMap`
 * (internamente via `neighbors()`), enquanto `successorsMap` só considera
 * arestas em que o vértice é a origem — por isso, aqui usamos
 * `predecessorsMap` como "vizinhos" no caso não dirigido, garantindo que a
 * lista exibida esteja matematicamente completa.
 */
export function AdjacencyListVisualizer({
  graph,
  highlightVertexId,
  highlightNeighborId,
  onVertexHover,
  onNeighborClick,
  className,
}: AdjacencyListVisualizerProps) {
  const { successorsMap, predecessorsMap } = useMemo(() => adjacencyList(graph), [graph]);
  const labelOf = useMemo(() => new Map(graph.vertices.map((v) => [v.id, v.label])), [graph]);
  const [localHoverVertex, setLocalHoverVertex] = useState<string | null>(null);

  return (
    <div className={clsx('flex flex-col gap-1.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-raised)] p-3', className)}>
      {graph.vertices.map((v) => {
        const isRowActive = highlightVertexId === v.id || localHoverVertex === v.id;
        const neighbors = graph.directed ? successorsMap[v.id] : predecessorsMap[v.id];
        return (
          <div
            key={v.id}
            onMouseEnter={() => {
              setLocalHoverVertex(v.id);
              onVertexHover?.(v.id);
            }}
            onMouseLeave={() => setLocalHoverVertex(null)}
            className={clsx(
              'flex flex-wrap items-center gap-x-2 gap-y-1.5 rounded-xl px-2.5 py-2 transition-colors',
              isRowActive ? 'bg-[var(--color-accent-soft)]' : 'hover:bg-[var(--color-bg-elevated)]',
            )}
          >
            <span
              className={clsx(
                'mono min-w-[1.75rem] rounded-md px-1.5 py-0.5 text-center text-xs font-semibold',
                isRowActive ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-bg-elevated-2)] text-[var(--color-text-primary)]',
              )}
            >
              {v.label}
            </span>
            <span className="text-xs text-[var(--color-text-tertiary)]" aria-hidden="true">
              {graph.directed ? 'sucessores →' : 'vizinhos ↔'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {neighbors.length === 0 ? (
                <span className="text-xs text-[var(--color-text-tertiary)]">— nenhum —</span>
              ) : (
                neighbors.map((n) => (
                  <Chip
                    key={n}
                    label={labelOf.get(n) ?? n}
                    active={isRowActive && highlightNeighborId === n}
                    onClick={() => onNeighborClick?.(v.id, n)}
                  />
                ))
              )}
            </div>
            {graph.directed && (
              <>
                <span className="ml-1 text-xs text-[var(--color-text-tertiary)]" aria-hidden="true">
                  predecessores →
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {predecessorsMap[v.id].length === 0 ? (
                    <span className="text-xs text-[var(--color-text-tertiary)]">— nenhum —</span>
                  ) : (
                    predecessorsMap[v.id].map((n) => (
                      <Chip
                        key={n}
                        label={labelOf.get(n) ?? n}
                        active={isRowActive && highlightNeighborId === n}
                        onClick={() => onNeighborClick?.(v.id, n)}
                      />
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
