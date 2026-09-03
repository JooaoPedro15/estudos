import { useState } from 'react';
import type { EdgeData, GraphData } from '@/content/types';
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

function findEdgeBetween(g: GraphData, a: string, b: string): EdgeData | undefined {
  return g.edges.find((e) => {
    if (g.directed) return e.source === a && e.target === b;
    return (e.source === a && e.target === b) || (e.source === b && e.target === a);
  });
}

function newEdgeId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? `e-${crypto.randomUUID()}` : `e-${Date.now()}-${Math.random()}`;
}

/** Playground livre de grafos: adicionar/remover vértices, conectar/desconectar arestas clicando, alternar dirigido, e ver propriedades (grau, vizinhos, arestas incidentes) do vértice selecionado. */
export function GraphPlayground() {
  const [graph, setGraph] = useState<GraphData>(DEFAULT_GRAPH);
  const [selectedVertexId, setSelectedVertexId] = useState<string | null>(null);

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

  function toggleDirected() {
    setGraph((g) => ({ ...g, directed: !g.directed }));
  }

  function clear() {
    setGraph((g) => ({ directed: g.directed, vertices: [], edges: [] }));
    setSelectedVertexId(null);
  }

  function toggleEdge(a: string, b: string) {
    setGraph((g) => {
      const existing = findEdgeBetween(g, a, b);
      if (existing) {
        return { ...g, edges: g.edges.filter((e) => e.id !== existing.id) };
      }
      return { ...g, edges: [...g.edges, { id: newEdgeId(), source: a, target: b }] };
    });
  }

  function handleVertexClick(id: string) {
    if (selectedVertexId === null) {
      setSelectedVertexId(id);
      return;
    }
    if (selectedVertexId === id) {
      setSelectedVertexId(null);
      return;
    }
    toggleEdge(selectedVertexId, id);
  }

  function handleEdgeClick(edgeId: string) {
    setGraph((g) => ({ ...g, edges: g.edges.filter((e) => e.id !== edgeId) }));
  }

  const neighborIds = selectedVertexId ? neighbors(graph, selectedVertexId) : [];
  const incident = selectedVertexId ? incidentEdges(graph, selectedVertexId) : [];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">Playground de grafos</h1>
        <p className="max-w-2xl text-[var(--color-text-secondary)]">
          Monte seu próprio grafo e veja suas propriedades em tempo real — grau, vértices adjacentes e arestas incidentes.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={addVertex}>+ Vértice</Button>
        <Button variant={graph.directed ? 'primary' : 'secondary'} onClick={toggleDirected}>
          {graph.directed ? 'Direcionado: sim' : 'Direcionado: não'}
        </Button>
        <Button variant="ghost" onClick={clear}>
          Limpar
        </Button>
      </div>
      <p className="-mt-3 text-xs text-[var(--color-text-tertiary)]">
        Clique em dois vértices para conectar/desconectar. Clique no vértice já selecionado para cancelar a seleção. Clique numa aresta
        para removê-la diretamente.
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
              selectedVertexIds={selectedVertexId ? [selectedVertexId] : []}
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

          {selectedVertexId ? (
            <div className="flex flex-col gap-3 border-t border-[var(--color-border)] pt-4">
              <p className="mono text-sm text-[var(--color-text-primary)]">
                Vértice selecionado: <strong>{selectedVertexId}</strong>
              </p>

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
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[var(--color-text-tertiary)]">Nenhuma</p>
                )}
              </div>

              <Button variant="secondary" size="sm" onClick={() => removeVertex(selectedVertexId)}>
                Remover selecionado
              </Button>
            </div>
          ) : (
            <p className="border-t border-[var(--color-border)] pt-4 text-xs text-[var(--color-text-tertiary)]">
              Selecione um vértice para ver suas propriedades.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
