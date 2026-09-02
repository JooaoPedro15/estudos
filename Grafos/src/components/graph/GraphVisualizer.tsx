import { useMemo, useRef, useState, useCallback, useEffect } from 'react';
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
  /** Sobrepõe a cor de borda de um vértice específico (ex.: pares de mapeamento de isomorfismo). Tem prioridade sobre selected/highlight/visited. */
  vertexColorMap?: Record<string, string>;
  onVertexClick?: (id: string) => void;
  onEdgeClick?: (id: string) => void;
  interactive?: boolean;
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
    const curvature = count === 0 ? 0 : (count % 2 === 1 ? 1 : -1) * Math.ceil(count / 2) * 0.35;
    return { ...e, loop, curvature };
  });
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
  onVertexClick,
  onEdgeClick,
  interactive = true,
  showWeights = false,
  className,
}: GraphVisualizerProps) {
  const hasFixedPositions = graph.vertices.every((v) => typeof v.x === 'number' && typeof v.y === 'number');

  const layout = useMemo<Record<string, LaidOutVertex>>(() => {
    if (hasFixedPositions) {
      const r: Record<string, LaidOutVertex> = {};
      for (const v of graph.vertices) r[v.id] = { id: v.id, label: v.label, x: v.x!, y: v.y! };
      return r;
    }
    return computeForceLayout(graph, width, height);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph, width, height, hasFixedPositions]);

  const [positions, setPositions] = useState(layout);
  useEffect(() => setPositions(layout), [layout]);

  const [view, setView] = useState({ scale: 1, tx: 0, ty: 0 });
  const dragState = useRef<{ kind: 'vertex' | 'pan'; id?: string; startX: number; startY: number; origin: { x: number; y: number } } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const toSvgPoint = useCallback(
    (clientX: number, clientY: number) => {
      const svg = svgRef.current;
      if (!svg) return { x: 0, y: 0 };
      const rect = svg.getBoundingClientRect();
      return { x: (clientX - rect.left - view.tx) / view.scale, y: (clientY - rect.top - view.ty) / view.scale };
    },
    [view],
  );

  const onVertexPointerDown = (id: string) => (e: React.PointerEvent) => {
    if (!interactive) return;
    e.stopPropagation();
    const p = positions[id];
    dragState.current = { kind: 'vertex', id, startX: e.clientX, startY: e.clientY, origin: { x: p.x, y: p.y } };
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const onBackgroundPointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    dragState.current = { kind: 'pan', startX: e.clientX, startY: e.clientY, origin: { x: view.tx, y: view.ty } };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const ds = dragState.current;
    if (!ds) return;
    if (ds.kind === 'vertex' && ds.id) {
      const dx = (e.clientX - ds.startX) / view.scale;
      const dy = (e.clientY - ds.startY) / view.scale;
      setPositions((prev) => ({ ...prev, [ds.id!]: { ...prev[ds.id!], x: ds.origin.x + dx, y: ds.origin.y + dy } }));
    } else if (ds.kind === 'pan') {
      const dx = e.clientX - ds.startX;
      const dy = e.clientY - ds.startY;
      setView((v) => ({ ...v, tx: ds.origin.x + dx, ty: ds.origin.y + dy }));
    }
  };

  const onPointerUp = () => {
    dragState.current = null;
  };

  const onWheel = (e: React.WheelEvent) => {
    if (!interactive) return;
    e.preventDefault();
    const point = toSvgPoint(e.clientX, e.clientY);
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    setView((v) => {
      const newScale = Math.min(3, Math.max(0.35, v.scale * factor));
      const tx = e.nativeEvent.offsetX - point.x * newScale;
      const ty = e.nativeEvent.offsetY - point.y * newScale;
      return { scale: newScale, tx, ty };
    });
  };

  const edges = useMemo(() => groupEdges(graph), [graph]);
  const selectedV = new Set(selectedVertexIds);
  const selectedE = new Set(selectedEdgeIds);
  const highlightV = new Set(highlightVertexIds);
  const highlightE = new Set(highlightEdgeIds);
  const visitedV = new Set(visitedVertexIds);

  const R = 20;

  function edgePath(e: EdgeGeom): { d: string; labelPos: { x: number; y: number } } {
    const s = positions[e.source];
    const t = positions[e.target];
    if (!s || !t) return { d: '', labelPos: { x: 0, y: 0 } };
    if (e.loop) {
      const d = `M ${s.x - R * 0.6} ${s.y - R * 0.8} C ${s.x - R * 2.4} ${s.y - R * 2.6}, ${s.x + R * 2.4} ${s.y - R * 2.6}, ${s.x + R * 0.6} ${s.y - R * 0.8}`;
      return { d, labelPos: { x: s.x, y: s.y - R * 2.6 } };
    }
    const dx = t.x - s.x;
    const dy = t.y - s.y;
    const dist = Math.hypot(dx, dy) || 1;
    const ux = dx / dist;
    const uy = dy / dist;
    const startX = s.x + ux * R;
    const startY = s.y + uy * R;
    const endX = t.x - ux * R;
    const endY = t.y - uy * R;
    if (e.curvature === 0) {
      return { d: `M ${startX} ${startY} L ${endX} ${endY}`, labelPos: { x: (startX + endX) / 2, y: (startY + endY) / 2 } };
    }
    const mx = (startX + endX) / 2 + -uy * e.curvature * 60;
    const my = (startY + endY) / 2 + ux * e.curvature * 60;
    return { d: `M ${startX} ${startY} Q ${mx} ${my} ${endX} ${endY}`, labelPos: { x: mx, y: my } };
  }

  return (
    <svg
      ref={svgRef}
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ touchAction: 'none', cursor: interactive ? 'grab' : 'default' }}
      onPointerDown={onBackgroundPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onWheel={onWheel}
    >
      <defs>
        <marker id="gv-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--color-edge)" />
        </marker>
        <marker id="gv-arrow-highlight" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--color-cyan)" />
        </marker>
        <radialGradient id="gv-vertex-fill" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#333a4d" />
          <stop offset="100%" stopColor="#1b1f29" />
        </radialGradient>
        <filter id="gv-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>

      <g transform={`translate(${view.tx} ${view.ty}) scale(${view.scale})`}>
        {edges.map((e) => {
          const { d, labelPos } = edgePath(e);
          if (!d) return null;
          const isSelected = selectedE.has(e.id);
          const isHighlight = highlightE.has(e.id);
          const stroke = isHighlight ? 'var(--color-cyan)' : isSelected ? 'var(--color-accent)' : 'var(--color-edge)';
          const strokeWidth = isHighlight || isSelected ? 2.5 : 1.5;
          const label = edgeLabels?.[e.id] ?? (showWeights && e.weight !== undefined ? String(e.weight) : undefined);
          return (
            <g key={e.id}>
              <path
                d={d}
                fill="none"
                stroke="transparent"
                strokeWidth={14}
                style={{ cursor: onEdgeClick ? 'pointer' : 'default' }}
                onClick={(ev) => {
                  ev.stopPropagation();
                  onEdgeClick?.(e.id);
                }}
              />
              <path
                d={d}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                markerEnd={graph.directed ? (isHighlight ? 'url(#gv-arrow-highlight)' : 'url(#gv-arrow)') : undefined}
                style={{ transition: 'stroke 0.25s, stroke-width 0.25s', pointerEvents: 'none' }}
              />
              {label && (
                <text x={labelPos.x} y={labelPos.y - 4} textAnchor="middle" fontSize={11} fill="var(--color-text-secondary)" className="mono" style={{ pointerEvents: 'none' }}>
                  {label}
                </text>
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
          const stroke = overrideColor
            ? overrideColor
            : isSelected
              ? 'var(--color-accent-strong)'
              : isHighlight
                ? 'var(--color-amber)'
                : isVisited
                  ? 'var(--color-cyan)'
                  : 'var(--color-vertex-border)';
          const label = vertexLabels?.[v.id] ?? v.label;
          return (
            <g
              key={v.id}
              transform={`translate(${p.x} ${p.y})`}
              onPointerDown={onVertexPointerDown(v.id)}
              onClick={(ev) => {
                ev.stopPropagation();
                onVertexClick?.(v.id);
              }}
              style={{ cursor: interactive ? (onVertexClick ? 'pointer' : 'grab') : onVertexClick ? 'pointer' : 'default' }}
            >
              <circle r={R} fill="url(#gv-vertex-fill)" stroke={stroke} strokeWidth={isSelected || isHighlight || overrideColor ? 3 : 1.5} filter="url(#gv-shadow)" style={{ transition: 'stroke 0.25s' }} />
              <text textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={600} fill="var(--color-text-primary)" style={{ pointerEvents: 'none', userSelect: 'none' }}>
                {label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
