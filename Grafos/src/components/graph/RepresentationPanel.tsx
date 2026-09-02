import { useMemo, useState } from 'react';
import clsx from 'clsx';
import type { GraphData } from '@/content/types';
import { GraphVisualizer } from './GraphVisualizer';
import { MatrixVisualizer } from './MatrixVisualizer';
import { AdjacencyListVisualizer } from './AdjacencyListVisualizer';

export interface RepresentationPanelProps {
  graph: GraphData;
  className?: string;
}

type Active = { kind: 'vertex'; id: string } | { kind: 'edge'; id: string } | null;

function findEdgeBetween(graph: GraphData, a: string, b: string) {
  return graph.edges.find((e) => (e.source === a && e.target === b) || (!graph.directed && e.source === b && e.target === a));
}

/**
 * Tela dividida GRAFO ↔ MATRIZ ↔ LISTA (seção 13 do briefing).
 *
 * O estado de destaque "ativo" (vértice ou aresta) é local a este
 * componente e derivado em duas camadas:
 *  - `hovered`: passageiro, vem do mouse sobre qualquer uma das quatro
 *    representações; some ao tirar o mouse.
 *  - `selected`: "fixado" por clique, sobrevive até outro clique.
 * `active = hovered ?? selected` é então traduzido para as props de
 * destaque específicas de cada representação (grafo, matriz de
 * adjacência, matriz de incidência, lista de adjacência), garantindo que
 * clicar/passar o mouse em qualquer uma ilumine a mesma informação nas
 * outras três.
 */
export function RepresentationPanel({ graph, className }: RepresentationPanelProps) {
  const [selected, setSelected] = useState<Active>(null);
  const [hovered, setHovered] = useState<Active>(null);
  const active = hovered ?? selected;

  const edgeById = useMemo(() => new Map(graph.edges.map((e) => [e.id, e])), [graph]);

  const selectVertex = (id: string) => setSelected({ kind: 'vertex', id });
  const selectEdge = (id: string) => setSelected({ kind: 'edge', id });
  const hoverVertex = (id: string) => setHovered({ kind: 'vertex', id });
  const hoverEdge = (id: string) => setHovered({ kind: 'edge', id });
  const clearHover = () => setHovered(null);

  // ---- Grafo -------------------------------------------------------------
  const graphHighlightVertexIds = active?.kind === 'vertex' ? [active.id] : [];
  const graphHighlightEdgeIds = active?.kind === 'edge' ? [active.id] : [];

  // ---- Matriz de adjacência ------------------------------------------------
  let adjRowId: string | undefined;
  let adjColId: string | undefined;
  let adjCellKeys: string[] = [];
  if (active?.kind === 'vertex') {
    adjRowId = active.id;
    adjColId = active.id;
  } else if (active?.kind === 'edge') {
    const e = edgeById.get(active.id);
    if (e) {
      adjCellKeys = graph.directed ? [`${e.source}|${e.target}`] : [`${e.source}|${e.target}`, `${e.target}|${e.source}`];
    }
  }

  function handleAdjacencyInteract(rowId: string, colId: string, mode: 'hover' | 'click') {
    const emit = mode === 'hover' ? { vertex: hoverVertex, edge: hoverEdge } : { vertex: selectVertex, edge: selectEdge };
    if (rowId === colId) {
      emit.vertex(rowId);
      return;
    }
    const e = findEdgeBetween(graph, rowId, colId);
    if (e) emit.edge(e.id);
  }

  // ---- Matriz de incidência ------------------------------------------------
  let incRowId: string | undefined;
  let incColId: string | undefined;
  let incCellKeys: string[] = [];
  if (active?.kind === 'vertex') {
    incRowId = active.id;
  } else if (active?.kind === 'edge') {
    incColId = active.id;
    const e = edgeById.get(active.id);
    if (e) {
      incCellKeys = e.source === e.target ? [`${e.source}|${e.id}`] : [`${e.source}|${e.id}`, `${e.target}|${e.id}`];
    }
  }

  function handleIncidenceInteract(rowId: string, colId: string, mode: 'hover' | 'click') {
    const emit = mode === 'hover' ? { vertex: hoverVertex, edge: hoverEdge } : { vertex: selectVertex, edge: selectEdge };
    if (rowId === colId) {
      // Cabeçalho: rowId===colId por construção. Pode ser um id de vértice
      // (cabeçalho de linha) ou de aresta (cabeçalho de coluna).
      if (graph.vertices.some((v) => v.id === rowId)) emit.vertex(rowId);
      else if (edgeById.has(rowId)) emit.edge(rowId);
      return;
    }
    // Célula normal: a coluna JÁ é o id da aresta na matriz de incidência.
    emit.edge(colId);
  }

  // ---- Lista de adjacência -------------------------------------------------
  let listVertexId: string | undefined;
  let listNeighborId: string | undefined;
  if (active?.kind === 'vertex') {
    listVertexId = active.id;
  } else if (active?.kind === 'edge') {
    const e = edgeById.get(active.id);
    if (e) {
      listVertexId = e.source;
      listNeighborId = e.target;
    }
  }

  function handleNeighborClick(vertexId: string, neighborId: string) {
    const e = findEdgeBetween(graph, vertexId, neighborId);
    if (e) selectEdge(e.id);
  }

  return (
    <div className={clsx('flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start lg:gap-6', className)}>
      <div onMouseLeave={clearHover} className="flex flex-col gap-2">
        <SectionLabel>Grafo</SectionLabel>
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-raised)] shadow-[var(--shadow-card)]">
          <GraphVisualizer
            graph={graph}
            height={380}
            highlightVertexIds={graphHighlightVertexIds}
            highlightEdgeIds={graphHighlightEdgeIds}
            onVertexClick={selectVertex}
            onEdgeClick={selectEdge}
          />
        </div>
        <p className="text-xs leading-relaxed text-[var(--color-text-tertiary)]">
          Clique em um vértice ou aresta — ou passe o mouse sobre a matriz e a lista abaixo — para ver a correspondência nas quatro
          representações.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <div onMouseLeave={clearHover} className="flex flex-col gap-2">
          <SectionLabel>Matriz de adjacência</SectionLabel>
          <MatrixVisualizer
            graph={graph}
            kind="adjacency"
            highlightRowId={adjRowId}
            highlightColId={adjColId}
            highlightCellKeys={adjCellKeys}
            onCellHover={(r, c) => handleAdjacencyInteract(r, c, 'hover')}
            onCellClick={(r, c) => handleAdjacencyInteract(r, c, 'click')}
          />
        </div>

        <div onMouseLeave={clearHover} className="flex flex-col gap-2">
          <SectionLabel>Matriz de incidência</SectionLabel>
          <MatrixVisualizer
            graph={graph}
            kind="incidence"
            highlightRowId={incRowId}
            highlightColId={incColId}
            highlightCellKeys={incCellKeys}
            onCellHover={(r, c) => handleIncidenceInteract(r, c, 'hover')}
            onCellClick={(r, c) => handleIncidenceInteract(r, c, 'click')}
          />
        </div>

        <div onMouseLeave={clearHover} className="flex flex-col gap-2">
          <SectionLabel>Lista de adjacência</SectionLabel>
          <AdjacencyListVisualizer
            graph={graph}
            highlightVertexId={listVertexId}
            highlightNeighborId={listNeighborId}
            onVertexHover={hoverVertex}
            onNeighborClick={handleNeighborClick}
          />
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">{children}</h3>;
}
