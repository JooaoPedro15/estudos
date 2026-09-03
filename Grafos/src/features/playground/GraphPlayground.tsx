import { useState } from 'react';
import type { GraphData } from '@/content/types';
import { degree, inDegree, incidentEdges, neighbors, outDegree } from '@/lib/graph';
import { GraphVisualizer } from '@/components/graph/GraphVisualizer';
import { Badge, Button, Card, StatTile } from '@/components/ui';

const DEFAULT_GRAPH: GraphData = {
  directed: false,
  vertices: [
    { id: 'a', label: 'a' },
    { id: 'b', label: 'b' },
    { id: 'c', label: 'c' },
    { id: 'd', label: 'd' },
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

  function addVertex() {
    setGraph((g) => {
      const existingIds = new Set(g.vertices.map((v) => v.id));
      const label = nextVertexLabel(existingIds);
      return { ...g, vertices: [...g.vertices, { id: label, label }] };
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
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">Playground de grafos</h1>
        <p className="max-w-2xl text-[var(--color-text-secondary)]">
          Monte qualquer grafo — com laços, arestas paralelas e pesos — e veja suas propriedades em tempo real.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
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
    </div>
  );
}
