import { useState } from 'react';
import { AlgorithmLab } from './AlgorithmLab';
import { AULAO_BF, AULAO_CRITICO, P2_2024_Q2, RESUMO_MINMAX, SILVIO_MATRIZ, SLIDE_DIJKSTRA, SLIDE_FINAL, SLIDE_FLEURY, SLIDE_LINE_G, SLIDE_MST } from '@/content/questions/graphs-p2';
import type { GraphData } from '@/content/types';
import { degree, inDegree, incidentEdges, neighbors, outDegree } from '@/lib/graph';
import { GraphVisualizer } from '@/components/graph/GraphVisualizer';
import { Badge, Button, Card, StatTile } from '@/components/ui';

const DEFAULT_GRAPH: GraphData = {
  directed: false,
  vertices: [
    { id: 'a', label: 'a', x: 180, y: 140 },
    { id: 'b', label: 'b', x: 380, y: 140 },
    { id: 'c', label: 'c', x: 380, y: 340 },
    { id: 'd', label: 'd', x: 180, y: 340 },
  ],
  edges: [],
};

/** Próximo rótulo livre para um novo vértice: letras a–z primeiro, depois v27, v28... */
function nextVertexLabel(existing: Set<string>): string {
  for (let i = 0; i < 26; i++) {
    const c = String.fromCharCode(97 + i);
    if (!existing.has(c)) return c;
  }
  let n = existing.size + 1;
  while (existing.has(`v${n}`)) n++;
  return `v${n}`;
}

/** Posição livre para um vértice novo: círculo ao redor do centro, sem cair em cima dos outros. */
function freePosition(count: number): { x: number; y: number } {
  const angle = -Math.PI / 2 + count * 2.4;
  const radius = 90 + (count % 3) * 45;
  return { x: 280 + radius * Math.cos(angle), y: 240 + radius * Math.sin(angle) };
}

const PRESETS: { id: string; label: string; graph: GraphData }[] = [
  { id: 'agm', label: 'AGM do slide 11', graph: SLIDE_MST },
  { id: 'matriz', label: 'Matriz das provas (2021/2-Q3)', graph: SILVIO_MATRIZ },
  { id: 'dijkstra', label: 'Dijkstra do slide 10', graph: SLIDE_DIJKSTRA },
  { id: 'final', label: 'Exercício final do slide 10', graph: SLIDE_FINAL },
  { id: 'bf', label: 'Bellman-Ford do aulão', graph: AULAO_BF },
  { id: 'q2', label: 'Pesos negativos (matriz da prova)', graph: P2_2024_Q2 },
  { id: 'minmax', label: 'Max-Min do resumo', graph: RESUMO_MINMAX },
  { id: 'fleury', label: 'Fleury do slide 08', graph: SLIDE_FLEURY },
  { id: 'linha', label: 'Grafo de linha do slide 13', graph: SLIDE_LINE_G },
  { id: 'critico', label: 'Caminho crítico do aulão', graph: AULAO_CRITICO },
];

function newEdgeId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? `e-${crypto.randomUUID()}` : `e-${Date.now()}-${Math.random()}`;
}

type Mode = 'select' | 'connect';

/**
 * Playground livre de grafos: adicionar/remover vértices (com renomeação),
 * conectar vértices permitindo laços e arestas paralelas, editar peso e
 * inverter direção de uma aresta, alternar dirigido/não-dirigido, e ver
 * propriedades (grau, vizinhos, arestas incidentes) do vértice selecionado.
 */
export function GraphPlayground() {
  const [graph, setGraph] = useState<GraphData>(DEFAULT_GRAPH);
  const [mode, setMode] = useState<Mode>('select');
  const [selectedVertexId, setSelectedVertexId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState('');
  const [presetId, setPresetId] = useState('');

  function loadPreset(id: string) {
    setPresetId(id);
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setGraph(preset.graph);
    setSelectedVertexId(null);
    setSelectedEdgeId(null);
  }

  function moveVertex(id: string, x: number, y: number) {
    setGraph((g) => ({ ...g, vertices: g.vertices.map((v) => (v.id === id ? { ...v, x, y } : v)) }));
  }

  function addVertex() {
    setGraph((g) => {
      const existingIds = new Set(g.vertices.map((v) => v.id));
      const label = nextVertexLabel(existingIds);
      return { ...g, vertices: [...g.vertices, { id: label, label, ...freePosition(g.vertices.length) }] };
    });
  }

  function removeVertex(id: string) {
    setGraph((g) => ({
      directed: g.directed,
      vertices: g.vertices.filter((v) => v.id !== id),
      edges: g.edges.filter((e) => e.source !== id && e.target !== id),
    }));
    setSelectedVertexId(null);
  }

  function renameVertex(id: string, label: string) {
    const trimmed = label.trim();
    if (!trimmed) return;
    setGraph((g) => ({ ...g, vertices: g.vertices.map((v) => (v.id === id ? { ...v, label: trimmed } : v)) }));
  }

  function toggleDirected() {
    setGraph((g) => ({ ...g, directed: !g.directed }));
  }

  function clear() {
    setGraph((g) => ({ directed: g.directed, vertices: [], edges: [] }));
    setSelectedVertexId(null);
    setSelectedEdgeId(null);
  }

  /** Sempre adiciona uma NOVA aresta — permite laço (a===b) e arestas paralelas (repetir o mesmo par). */
  function addEdge(a: string, b: string) {
    setGraph((g) => ({ ...g, edges: [...g.edges, { id: newEdgeId(), source: a, target: b }] }));
  }

  function removeEdge(id: string) {
    setGraph((g) => ({ ...g, edges: g.edges.filter((e) => e.id !== id) }));
    setSelectedEdgeId(null);
  }

  function reverseEdge(id: string) {
    setGraph((g) => ({ ...g, edges: g.edges.map((e) => (e.id === id ? { ...e, source: e.target, target: e.source } : e)) }));
  }

  function setEdgeWeight(id: string, weight: number | undefined) {
    setGraph((g) => ({ ...g, edges: g.edges.map((e) => (e.id === id ? { ...e, weight } : e)) }));
  }

  function setModeAndReset(next: Mode) {
    setMode(next);
    setSelectedVertexId(null);
    setSelectedEdgeId(null);
  }

  function handleVertexClick(id: string) {
    setSelectedEdgeId(null);
    if (mode === 'connect') {
      if (selectedVertexId === null) {
        setSelectedVertexId(id);
      } else {
        addEdge(selectedVertexId, id); // id igual a selectedVertexId => laço; repetir o mesmo alvo => aresta paralela
      }
      return;
    }
    setSelectedVertexId((prev) => (prev === id ? null : id));
  }

  function handleEdgeClick(edgeId: string) {
    if (mode === 'connect') {
      removeEdge(edgeId); // correção rápida sem sair do modo conectar
      return;
    }
    setSelectedVertexId(null);
    setSelectedEdgeId((prev) => (prev === edgeId ? null : edgeId));
  }

  const selectedVertex = selectedVertexId ? graph.vertices.find((v) => v.id === selectedVertexId) : undefined;
  const selectedEdge = selectedEdgeId ? graph.edges.find((e) => e.id === selectedEdgeId) : undefined;
  const neighborIds = selectedVertexId ? neighbors(graph, selectedVertexId) : [];
  const incident = selectedVertexId ? incidentEdges(graph, selectedVertexId) : [];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">Laboratório de grafos</h1>
        <p className="max-w-2xl text-[var(--color-text-secondary)]">
          Carregue um grafo dos slides ou monte o seu. Arraste os vértices, edite os pesos e rode os algoritmos passo a passo.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
          Carregar
          <select
            value={presetId}
            onChange={(e) => loadPreset(e.target.value)}
            className="max-w-[220px] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
          >
            <option value="">Escolha um grafo…</option>
            {PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label}
              </option>
            ))}
          </select>
        </label>
        <Button onClick={addVertex}>+ Vértice</Button>
        <Button variant={graph.directed ? 'primary' : 'secondary'} onClick={toggleDirected}>
          {graph.directed ? 'Direcionado: sim' : 'Direcionado: não'}
        </Button>
        <div className="flex overflow-hidden rounded-xl border border-[var(--color-border)]">
          <button
            type="button"
            onClick={() => setModeAndReset('select')}
            className="px-3 py-2 text-xs font-medium transition"
            style={{
              background: mode === 'select' ? 'var(--color-accent)' : 'var(--color-bg-elevated)',
              color: mode === 'select' ? 'white' : 'var(--color-text-secondary)',
            }}
          >
            Selecionar
          </button>
          <button
            type="button"
            onClick={() => setModeAndReset('connect')}
            className="px-3 py-2 text-xs font-medium transition"
            style={{
              background: mode === 'connect' ? 'var(--color-accent)' : 'var(--color-bg-elevated)',
              color: mode === 'connect' ? 'white' : 'var(--color-text-secondary)',
            }}
          >
            Conectar
          </button>
        </div>
        <Button variant="ghost" onClick={clear}>
          Limpar
        </Button>
      </div>
      <p className="-mt-3 text-xs text-[var(--color-text-tertiary)]">
        {mode === 'connect'
          ? selectedVertexId
            ? `Origem: ${selectedVertex?.label ?? selectedVertexId}. Clique num vértice para conectar (clique nele de novo para laço; repita o mesmo alvo para aresta paralela). Clique numa aresta para removê-la.`
            : 'Clique num vértice para começar uma conexão.'
          : 'Clique num vértice para ver/editar suas propriedades. Clique numa aresta para editar peso, inverter direção ou remover.'}
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <Card padding="md">
          {graph.vertices.length === 0 ? (
            <div className="flex h-[420px] flex-col items-center justify-center gap-3 text-center">
              <p className="text-sm text-[var(--color-text-secondary)]">O grafo está vazio.</p>
              <Button onClick={addVertex}>+ Vértice</Button>
            </div>
          ) : (
            <GraphVisualizer
              graph={graph}
              interactive
              height={480}
              showWeights
              selectedVertexIds={selectedVertexId ? [selectedVertexId] : []}
              selectedEdgeIds={selectedEdgeId ? [selectedEdgeId] : []}
              onVertexClick={handleVertexClick}
              onEdgeClick={handleEdgeClick}
              onVertexMoved={moveVertex}
            />
          )}
        </Card>

        <Card padding="lg" className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Estatísticas</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Vértices" value={graph.vertices.length} />
            <StatTile label="Arestas" value={graph.edges.length} />
          </div>

          {selectedEdge ? (
            <div className="flex flex-col gap-3 border-t border-[var(--color-border)] pt-4">
              <p className="mono text-sm text-[var(--color-text-primary)]">
                Aresta selecionada: <strong>{selectedEdge.source}</strong> {graph.directed ? '→' : '–'} <strong>{selectedEdge.target}</strong>
                {selectedEdge.source === selectedEdge.target && <span className="ml-1 text-[var(--color-text-tertiary)]">(laço)</span>}
              </p>

              <label className="flex flex-col gap-1 text-xs text-[var(--color-text-tertiary)]">
                Peso (opcional)
                <input
                  type="number"
                  value={selectedEdge.weight ?? ''}
                  onChange={(e) => setEdgeWeight(selectedEdge.id, e.target.value === '' ? undefined : Number(e.target.value))}
                  placeholder="sem peso"
                  className="mono rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                />
              </label>

              <div className="flex flex-wrap gap-2">
                {graph.directed && selectedEdge.source !== selectedEdge.target && (
                  <Button variant="secondary" size="sm" onClick={() => reverseEdge(selectedEdge.id)}>
                    Inverter direção
                  </Button>
                )}
                <Button variant="secondary" size="sm" onClick={() => removeEdge(selectedEdge.id)}>
                  Remover aresta
                </Button>
              </div>
            </div>
          ) : selectedVertexId ? (
            <div className="flex flex-col gap-3 border-t border-[var(--color-border)] pt-4">
              <label className="flex flex-col gap-1 text-xs text-[var(--color-text-tertiary)]">
                Rótulo do vértice
                <input
                  type="text"
                  value={renameDraft || selectedVertex?.label || selectedVertexId}
                  onFocus={() => setRenameDraft(selectedVertex?.label ?? selectedVertexId)}
                  onChange={(e) => setRenameDraft(e.target.value)}
                  onBlur={() => {
                    if (renameDraft) renameVertex(selectedVertexId, renameDraft);
                    setRenameDraft('');
                  }}
                  className="mono rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                />
              </label>

              {graph.directed ? (
                <div className="grid grid-cols-2 gap-3">
                  <StatTile label="Grau de entrada" value={inDegree(graph, selectedVertexId)} />
                  <StatTile label="Grau de saída" value={outDegree(graph, selectedVertexId)} />
                </div>
              ) : (
                <StatTile label="Grau" value={degree(graph, selectedVertexId)} />
              )}

              <div>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">Vértices adjacentes</p>
                {neighborIds.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {neighborIds.map((n) => (
                      <Badge key={n} tone="accent">
                        {n}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[var(--color-text-tertiary)]">Nenhum</p>
                )}
              </div>

              <div>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">Arestas incidentes</p>
                {incident.length > 0 ? (
                  <ul className="mono flex flex-col gap-1 text-xs text-[var(--color-text-secondary)]">
                    {incident.map((e) => (
                      <li key={e.id}>
                        {e.source} {graph.directed ? '→' : '–'} {e.target}
                        {e.source === e.target && ' (laço)'}
                        {e.weight !== undefined && ` · peso ${e.weight}`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[var(--color-text-tertiary)]">Nenhuma</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={() => addEdge(selectedVertexId, selectedVertexId)}>
                  + Laço
                </Button>
                <Button variant="secondary" size="sm" onClick={() => removeVertex(selectedVertexId)}>
                  Remover vértice
                </Button>
              </div>
            </div>
          ) : (
            <p className="border-t border-[var(--color-border)] pt-4 text-xs text-[var(--color-text-tertiary)]">
              Selecione um vértice ou aresta para ver/editar suas propriedades.
            </p>
          )}
        </Card>
      </div>

      <AlgorithmLab graph={graph} />
    </div>
  );
}
