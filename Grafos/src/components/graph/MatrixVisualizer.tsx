import { useMemo, useState } from 'react';
import clsx from 'clsx';
import type { GraphData } from '@/content/types';
import { adjacencyMatrix, incidenceMatrix } from '@/lib/graph';

export type MatrixKind = 'adjacency' | 'incidence';

export interface MatrixVisualizerProps {
  graph: GraphData;
  kind: MatrixKind;
  /** Vértice cuja linha deve receber a faixa de destaque (id de vértice). */
  highlightRowId?: string;
  /** Coluna a destacar — id de vértice (adjacência) ou id de aresta (incidência). */
  highlightColId?: string;
  /** Células a destacar com anel de contorno, no formato `${rowId}|${colId}`. */
  highlightCellKeys?: string[];
  /** Disparado ao passar o mouse sobre uma célula OU cabeçalho (nesse caso rowId === colId). */
  onCellHover?: (rowId: string, colId: string) => void;
  /** Disparado ao clicar em uma célula OU cabeçalho (nesse caso rowId === colId). */
  onCellClick?: (rowId: string, colId: string) => void;
  className?: string;
}

function cellTone(kind: MatrixKind, value: number): string {
  if (value === 0) return 'text-[var(--color-text-tertiary)]';
  if (kind === 'adjacency') return 'text-[var(--color-accent-strong)] font-semibold';
  // incidência: convenção do professor — +1 origem, -1 destino, 2 laço
  if (value === -1) return 'text-[var(--color-danger)] font-semibold';
  if (value === 2) return 'text-[var(--color-amber)] font-semibold';
  return 'text-[var(--color-cyan)] font-semibold';
}

/**
 * Renderiza a matriz de adjacência ou de incidência de um grafo como tabela
 * HTML estilizada. Suporta destaque cruzado (linha/coluna/célula) controlado
 * externamente — ver `RepresentationPanel` para o uso sincronizado com o
 * grafo e a lista de adjacência.
 */
export function MatrixVisualizer({
  graph,
  kind,
  highlightRowId,
  highlightColId,
  highlightCellKeys,
  onCellHover,
  onCellClick,
  className,
}: MatrixVisualizerProps) {
  const { rowIds, colIds, matrix } = useMemo(
    () => (kind === 'adjacency' ? adjacencyMatrix(graph) : incidenceMatrix(graph)),
    [graph, kind],
  );
  const vertexLabel = useMemo(() => new Map(graph.vertices.map((v) => [v.id, v.label])), [graph]);
  const cellKeySet = useMemo(() => new Set(highlightCellKeys ?? []), [highlightCellKeys]);

  // Hover local — realce puramente visual, mouse-following, independente do
  // estado de destaque controlado externamente (que representa a "seleção
  // fixada" vinda de outra representação).
  const [localHover, setLocalHover] = useState<{ row: string; col: string } | null>(null);

  const colHeaderLabel = (colId: string) => (kind === 'adjacency' ? (vertexLabel.get(colId) ?? colId) : colId);
  const rowHeaderLabel = (rowId: string) => vertexLabel.get(rowId) ?? rowId;

  return (
    <div className={clsx('overflow-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-raised)]', className)}>
      <table className="w-full min-w-max border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-20 border-b border-r border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]"
            >
              {kind === 'adjacency' ? 'V' : 'V \\ E'}
            </th>
            {colIds.map((colId) => {
              const isHighlight = highlightColId === colId || localHover?.col === colId;
              return (
                <th
                  key={colId}
                  scope="col"
                  onMouseEnter={() => {
                    setLocalHover({ row: colId, col: colId });
                    onCellHover?.(colId, colId);
                  }}
                  onMouseLeave={() => setLocalHover(null)}
                  onClick={() => onCellClick?.(colId, colId)}
                  className={clsx(
                    'mono cursor-pointer select-none whitespace-nowrap border-b border-[var(--color-border)] px-3 py-2 text-center text-xs font-semibold transition-colors',
                    isHighlight ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)]',
                  )}
                >
                  {colHeaderLabel(colId)}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rowIds.map((rowId, ri) => {
            const isRowHighlight = highlightRowId === rowId || localHover?.row === rowId;
            return (
              <tr key={rowId}>
                <th
                  scope="row"
                  onMouseEnter={() => {
                    setLocalHover({ row: rowId, col: rowId });
                    onCellHover?.(rowId, rowId);
                  }}
                  onMouseLeave={() => setLocalHover(null)}
                  onClick={() => onCellClick?.(rowId, rowId)}
                  className={clsx(
                    'mono sticky left-0 z-10 cursor-pointer select-none whitespace-nowrap border-r border-[var(--color-border)] px-3 py-2 text-left text-xs font-semibold transition-colors',
                    isRowHighlight
                      ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]'
                      : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated-2)]',
                  )}
                >
                  {rowHeaderLabel(rowId)}
                </th>
                {colIds.map((colId, ci) => {
                  const value = matrix[ri][ci];
                  const key = `${rowId}|${colId}`;
                  const isColHighlight = highlightColId === colId || localHover?.col === colId;
                  const isPinned = cellKeySet.has(key);
                  const isCellLocalHover = localHover?.row === rowId && localHover?.col === colId;
                  return (
                    <td
                      key={colId}
                      onMouseEnter={() => {
                        setLocalHover({ row: rowId, col: colId });
                        onCellHover?.(rowId, colId);
                      }}
                      onMouseLeave={() => setLocalHover(null)}
                      onClick={() => onCellClick?.(rowId, colId)}
                      className={clsx(
                        'mono relative cursor-pointer select-none border-b border-r border-[var(--color-border-soft)] px-3 py-2 text-center text-xs transition-colors',
                        (isRowHighlight || isColHighlight) && 'bg-[var(--color-accent-soft)]',
                        isCellLocalHover && !isPinned && 'bg-[var(--color-bg-elevated-2)]',
                        isPinned && 'bg-[var(--color-cyan-soft)] ring-2 ring-inset ring-[var(--color-cyan)]',
                        cellTone(kind, value),
                      )}
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
