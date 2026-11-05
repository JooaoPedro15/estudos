import { useMemo, useRef, useState, useEffect } from 'react';
import type { GraphData } from '@/content/types';
import { computeForceLayout, type LaidOutVertex } from './layout';

export interface GraphVisualizerProps {
  graph: GraphData;
  width?: number;
  height?: number;
  selectedVertexIds?: string[];
  selectedEdgeIds?: string[];
  highlightVertexIds?: string[];
  highlightEdgeIds?: string[];
  visitedVertexIds?: string[];
  vertexLabels?: Record<string, string>;
  edgeLabels?: Record<string, string>;
  /** Sobrepõe a cor de um vértice específico (ex.: pares de mapeamento de isomorfismo). Tem prioridade sobre selected/highlight/visited. */
  vertexColorMap?: Record<string, string>;
  edgeColorMap?: Record<string, string>;
  /** Supplemental labels keep the vertex's name readable. */
  vertexNotes?: Record<string, string>;
  traversal?: { from: string; to: string; progress: number };
  accessibleLabel?: string;
  onVertexClick?: (id: string) => void;
  onEdgeClick?: (id: string) => void;
  /** Avisa onde o vértice foi solto depois de arrastado (quem guarda o grafo pode persistir a posição). */
  onVertexMoved?: (id: string, x: number, y: number) => void;
  /** Arrastar vértices, arrastar o fundo e zoom. */
  interactive?: boolean;
  /** Só arrastar vértices: o fundo continua rolando a página (usado nas lições). */
  draggable?: boolean;
  showWeights?: boolean;
  className?: string;
}

interface EdgeGeom {
  id: string;
  source: string;
  target: string;
  weight?: number;
  label?: string;
  loop: boolean;
  curvature: number; // 0 = reta, != 0 = arco (arestas paralelas)
}

function groupEdges(graph: GraphData): EdgeGeom[] {
  const seenPairs = new Map<string, number>();
  return graph.edges.map((e) => {
    const loop = e.source === e.target;
    if (loop) return { ...e, loop, curvature: 0 };
    const key = graph.directed ? `${e.source}>${e.target}` : [e.source, e.target].sort().join('|');
    const count = seenPairs.get(key) ?? 0;
    seenPairs.set(key, count + 1);
    // Par de mão dupla (u→v e v→u): arcos para os dois lados, para as setas não se sobreporem.
    const opposite = graph.directed && graph.edges.some((o) => o.source === e.target && o.target === e.source);
    const curvature = count === 0 ? (opposite ? 0.28 : 0) : (count % 2 === 1 ? 1 : -1) * Math.ceil(count / 2) * 0.35;
    return { ...e, loop, curvature };
  });
}

const R = 20;

/** Preenchimento derivado da cor do estado: mantém o rótulo legível sobre o fundo escuro. */
const tint = (color: string, percent: number) => `color-mix(in srgb, ${color} ${percent}%, var(--color-vertex-base))`;

function ViewButton({ x, label, title, onClick }: { x: number; label: string; title: string; onClick: () => void }) {
  return (
    <g
      className="gv-view-button"
      transform={`translate(${x} 10)`}
      role="button"
      aria-label={title}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <title>{title}</title>
      <rect width={26} height={26} rx={7} />
      <text x={13} y={14} textAnchor="middle" dominantBaseline="central" fontSize={14}>
        {label}
      </text>
    </g>
  );
}

export function GraphVisualizer({
  graph,
  width = 560,
  height = 420,
  selectedVertexIds = [],
  selectedEdgeIds = [],
  highlightVertexIds = [],
  highlightEdgeIds = [],
  visitedVertexIds = [],
  vertexLabels,
  edgeLabels,
  vertexColorMap,
  edgeColorMap,
  vertexNotes,
  traversal,
  accessibleLabel,
  onVertexClick,
  onEdgeClick,
  onVertexMoved,
  interactive = true,
  draggable = false,
  showWeights = false,
  className,
}: GraphVisualizerProps) {
  const hasFixedPositions = graph.vertices.every((v) => typeof v.x === 'number' && typeof v.y === 'number');
  const canDrag = interactive || draggable;

  const layout = useMemo<Record<string, LaidOutVertex>>(() => {
    if (hasFixedPositions) {
      const r: Record<string, LaidOutVertex> = {};
      for (const v of graph.vertices) r[v.id] = { id: v.id, label: v.label, x: v.x!, y: v.y! };
      return r;
    }
    return computeForceLayout(graph, width, height);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph, width, height, hasFixedPositions]);

  // O que o aluno arrastou fica guardado por id: sobrevive à troca de passo da animação.
  const [dragged, setDragged] = useState<Record<string, { x: number; y: number }>>({});
  const vertexKey = graph.vertices.map((v) => v.id).join('|');
  useEffect(() => setDragged({}), [vertexKey]);

  const positions = useMemo(() => {
    const out: Record<string, LaidOutVertex> = {};
    for (const [id, p] of Object.entries(layout)) out[id] = dragged[id] ? { ...p, ...dragged[id] } : p;
    return out;
  }, [layout, dragged]);

  const [view, setView] = useState({ scale: 1, tx: 0, ty: 0 });
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragState = useRef<{ kind: 'vertex' | 'pan'; id?: string; startX: number; startY: number; origin: { x: number; y: number }; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const svgRef = useRef<SVGSVGElement>(null);

  /** Pixels de tela por unidade do viewBox: o SVG é esticado para a largura do cartão. */
  const screenScale = () => {
    const rect = svgRef.current?.getBoundingClientRect();
    return rect && rect.width ? Math.min(rect.width / width, rect.height / height) : 1;
  };

  const onVertexPointerDown = (id: string) => (e: React.PointerEvent) => {
    if (!canDrag) return;
    e.stopPropagation();
    const p = positions[id];
    dragState.current = { kind: 'vertex', id, startX: e.clientX, startY: e.clientY, origin: { x: p.x, y: p.y }, moved: false };
    setDraggingId(id);
    svgRef.current?.setPointerCapture(e.pointerId);
  };

  const onBackgroundPointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    dragState.current = { kind: 'pan', startX: e.clientX, startY: e.clientY, origin: { x: view.tx, y: view.ty }, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const ds = dragState.current;
    if (!ds) return;
    const k = screenScale();
    const dx = (e.clientX - ds.startX) / k;
    const dy = (e.clientY - ds.startY) / k;
    if (Math.hypot(e.clientX - ds.startX, e.clientY - ds.startY) > 4) ds.moved = true;
    if (ds.kind === 'vertex' && ds.id) {
      // Sem zoom, o vértice fica dentro da área visível para não sumir ao ser solto na borda.
      const limit = (value: number, max: number) => (view.scale === 1 ? Math.min(max - R - 3, Math.max(R + 3, value)) : value);
      if (ds.moved) setDragged((prev) => ({ ...prev, [ds.id!]: { x: limit(ds.origin.x + dx / view.scale, width), y: limit(ds.origin.y + dy / view.scale, height) } }));
    } else if (ds.kind === 'pan') {
      setView((v) => ({ ...v, tx: ds.origin.x + dx, ty: ds.origin.y + dy }));
    }
  };

  const onPointerUp = () => {
    const ds = dragState.current;
    if (ds?.kind === 'vertex' && ds.id && ds.moved) {
      suppressClick.current = true;
      const p = positions[ds.id];
      if (p) onVertexMoved?.(ds.id, p.x, p.y);
    }
    dragState.current = null;
    setDraggingId(null);
  };

  const zoom = (factor: number) =>
    setView((v) => {
      const scale = Math.min(3, Math.max(0.4, v.scale * factor));
      const cx = width / 2;
      const cy = height / 2;
      return { scale, tx: cx - ((cx - v.tx) / v.scale) * scale, ty: cy - ((cy - v.ty) / v.scale) * scale };
    });

  // A roda do mouse só dá zoom com Ctrl: sem isso, passar o mouse sobre o grafo prendia o scroll da página.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !interactive) return;
    const handler = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      zoom(e.deltaY > 0 ? 0.9 : 1.1);
    };
    svg.addEventListener('wheel', handler, { passive: false });
    return () => svg.removeEventListener('wheel', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive, width, height]);

  const edges = useMemo(() => groupEdges(graph), [graph]);
  const selectedV = new Set(selectedVertexIds);
  const selectedE = new Set(selectedEdgeIds);
  const highlightV = new Set(highlightVertexIds);
  const highlightE = new Set(highlightEdgeIds);
  const visitedV = new Set(visitedVertexIds);
  const moved = Object.keys(dragged).length > 0 || view.scale !== 1 || view.tx !== 0 || view.ty !== 0;

  function edgePath(e: EdgeGeom): { d: string; labelPos: { x: number; y: number }; arrow?: string } {
    const s = positions[e.source];
    const t = positions[e.target];
    if (!s || !t) return { d: '', labelPos: { x: 0, y: 0 } };
    if (e.loop) {
      const d = `M ${s.x - R * 0.6} ${s.y - R * 0.8} C ${s.x - R * 2.4} ${s.y - R * 2.6}, ${s.x + R * 2.4} ${s.y - R * 2.6}, ${s.x + R * 0.6} ${s.y - R * 0.8}`;
      return { d, labelPos: { x: s.x, y: s.y - R * 2.2 } };
    }
    const dx = t.x - s.x;
    const dy = t.y - s.y;
    const dist = Math.hypot(dx, dy) || 1;
    const ux = dx / dist;
    const uy = dy / dist;
    const gap = graph.directed ? R + 9 : R;
    const startX = s.x + ux * R;
    const startY = s.y + uy * R;
    const mx = (s.x + t.x) / 2 - uy * e.curvature * 60;
    const my = (s.y + t.y) / 2 + ux * e.curvature * 60;
    // Direção de chegada: a da reta, ou a tangente do arco no fim.
    const ax = e.curvature === 0 ? ux : (t.x - mx) / (Math.hypot(t.x - mx, t.y - my) || 1);
    const ay = e.curvature === 0 ? uy : (t.y - my) / (Math.hypot(t.x - mx, t.y - my) || 1);
    const endX = t.x - ax * gap;
    const endY = t.y - ay * gap;
    const tipX = t.x - ax * (R + 2);
    const tipY = t.y - ay * (R + 2);
    const arrow = graph.directed ? `${tipX},${tipY} ${tipX - ax * 10 - ay * 5},${tipY - ay * 10 + ax * 5} ${tipX - ax * 10 + ay * 5},${tipY - ay * 10 - ax * 5}` : undefined;
    if (e.curvature === 0) return { d: `M ${startX} ${startY} L ${endX} ${endY}`, labelPos: { x: (startX + endX) / 2, y: (startY + endY) / 2 }, arrow };
    return {
      d: `M ${startX} ${startY} Q ${mx} ${my} ${endX} ${endY}`,
      labelPos: { x: 0.25 * startX + 0.5 * mx + 0.25 * endX, y: 0.25 * startY + 0.5 * my + 0.25 * endY },
      arrow,
    };
  }

  return (
    <svg
      ref={svgRef}
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`gv-root ${className ?? ''}`}
      role={accessibleLabel ? 'img' : undefined}
      aria-label={accessibleLabel}
      style={{ touchAction: interactive ? 'none' : 'auto', cursor: interactive ? 'grab' : 'default' }}
      onPointerDown={onBackgroundPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <defs>
        <pattern id="gv-dots" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1" fill="var(--color-border-soft)" />
        </pattern>
      </defs>
      <rect width={width} height={height} fill="url(#gv-dots)" />

      <g transform={`translate(${view.tx} ${view.ty}) scale(${view.scale})`}>
        {edges.map((e) => {
          const { d, labelPos, arrow } = edgePath(e);
          if (!d) return null;
          const isSelected = selectedE.has(e.id);
          const isHighlight = highlightE.has(e.id);
          const custom = edgeColorMap?.[e.id];
          const active = isSelected || isHighlight || Boolean(custom);
          const stroke = custom ?? (isHighlight ? 'var(--color-cyan)' : isSelected ? 'var(--color-accent)' : 'var(--color-edge)');
          const label = edgeLabels?.[e.id] ?? (showWeights && e.weight !== undefined ? String(e.weight) : undefined);
          const negative = !edgeLabels?.[e.id] && e.weight !== undefined && e.weight < 0;
          const pillWidth = Math.max(20, (label?.length ?? 0) * 7.2 + 10);
          return (
            <g key={e.id} className={onEdgeClick ? 'gv-edge-clickable' : undefined}>
              {active && <path d={d} fill="none" stroke={stroke} strokeWidth={9} strokeOpacity={0.16} strokeLinecap="round" style={{ pointerEvents: 'none' }} />}
              <path d={d} fill="none" stroke={stroke} strokeWidth={active ? 2.75 : 1.6} strokeLinecap="round" style={{ transition: 'stroke 0.3s, stroke-width 0.3s', pointerEvents: 'none' }} />
              {arrow && <polygon points={arrow} fill={stroke} style={{ transition: 'fill 0.3s', pointerEvents: 'none' }} />}
              <path
                d={d}
                fill="none"
                stroke="transparent"
                strokeWidth={16}
                style={{ cursor: onEdgeClick ? 'pointer' : 'inherit' }}
                onClick={(ev) => {
                  ev.stopPropagation();
                  onEdgeClick?.(e.id);
                }}
              />
              {label && (
                <g transform={`translate(${labelPos.x} ${labelPos.y})`} style={{ pointerEvents: 'none' }}>
                  <rect x={-pillWidth / 2} y={-9.5} width={pillWidth} height={19} rx={9.5} fill="var(--color-bg-elevated-2)" stroke={active ? stroke : 'var(--color-border)'} strokeWidth={1} />
                  <text className="mono gv-edge-label" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600} fill={negative ? 'var(--color-danger)' : active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'}>
                    {label}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {graph.vertices.map((v) => {
          const p = positions[v.id];
          if (!p) return null;
          const isSelected = selectedV.has(v.id);
          const isHighlight = highlightV.has(v.id);
          const isVisited = visitedV.has(v.id);
          const overrideColor = vertexColorMap?.[v.id];
          const stateColor = overrideColor ?? (isSelected ? 'var(--color-accent-strong)' : isHighlight ? 'var(--color-amber)' : isVisited ? 'var(--color-cyan)' : undefined);
          const label = vertexLabels?.[v.id] ?? v.label;
          const note = vertexNotes?.[v.id];
          const noteWidth = (note?.length ?? 0) * 6.2 + 12;
          return (
            <g
              key={v.id}
              className={`gv-vertex ${draggingId === v.id ? 'is-dragging' : ''}`}
              transform={`translate(${p.x} ${p.y})`}
              onPointerDown={onVertexPointerDown(v.id)}
              onClick={(ev) => {
                ev.stopPropagation();
                if (suppressClick.current) {
                  suppressClick.current = false;
                  return;
                }
                onVertexClick?.(v.id);
              }}
              style={{ cursor: canDrag ? (draggingId === v.id ? 'grabbing' : 'grab') : onVertexClick ? 'pointer' : 'default', touchAction: canDrag ? 'none' : 'auto' }}
            >
              {isHighlight && <circle className="gv-pulse" r={R + 5} fill="none" stroke={stateColor ?? 'var(--color-amber)'} strokeWidth={2} />}
              <circle className="gv-disc" r={R} fill={stateColor ? tint(stateColor, 34) : 'var(--color-vertex-base)'} stroke={stateColor ?? 'var(--color-vertex-border)'} strokeWidth={stateColor ? 2.5 : 1.5} />
              <text className="gv-vertex-label" textAnchor="middle" dominantBaseline="central" fontSize={label.length > 3 ? 10 : 13} fontWeight={600} fill="var(--color-text-primary)" style={{ pointerEvents: 'none', userSelect: 'none' }}>
                {label}
              </text>
              {note && (
                <g className="gv-vertex-note" style={{ pointerEvents: 'none' }}>
                  <rect x={-noteWidth / 2} y={R + 5} width={noteWidth} height={17} rx={8.5} fill="var(--color-bg-elevated-2)" stroke="var(--color-border)" />
                  <text y={R + 14} textAnchor="middle" dominantBaseline="central" fontSize={10.5} fill="var(--color-text-secondary)">
                    {note}
                  </text>
                </g>
              )}
            </g>
          );
        })}
        {traversal && positions[traversal.from] && positions[traversal.to] && (
          <circle
            cx={positions[traversal.from].x + (positions[traversal.to].x - positions[traversal.from].x) * traversal.progress}
            cy={positions[traversal.from].y + (positions[traversal.to].y - positions[traversal.from].y) * traversal.progress}
            r={traversal.progress >= 1 ? 26 : 7}
            fill={traversal.progress >= 1 ? 'none' : 'var(--color-amber)'}
            stroke={traversal.progress >= 1 ? 'var(--color-amber)' : 'var(--color-bg)'}
            strokeWidth={2}
            style={{ pointerEvents: 'none' }}
          />
        )}
      </g>

      {interactive && (
        <>
          <ViewButton x={width - 68} label="−" title="Diminuir zoom" onClick={() => zoom(0.85)} />
          <ViewButton x={width - 38} label="+" title="Aumentar zoom" onClick={() => zoom(1.18)} />
        </>
      )}
      {canDrag && moved && (
        <ViewButton
          x={interactive ? width - 98 : width - 38}
          label="↺"
          title="Voltar à posição original"
          onClick={() => {
            setDragged({});
            setView({ scale: 1, tx: 0, ty: 0 });
          }}
        />
      )}
    </svg>
  );
}
