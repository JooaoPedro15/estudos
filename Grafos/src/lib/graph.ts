import type { GraphData, EdgeData } from '@/content/types';

export interface AlgorithmStep {
  description: string;
  highlightVertices?: string[];
  highlightEdges?: string[];
  currentVertex?: string;
  state?: Record<string, string | number>;
}

export function makeGraph(
  directed: boolean,
  vertices: string[],
  edges: Array<[string, string] | [string, string, number]>,
): GraphData {
  return {
    directed,
    vertices: vertices.map((id) => ({ id, label: id })),
    edges: edges.map(([source, target, weight], i) => ({
      id: `e${i}`,
      source,
      target,
      weight,
    })),
  };
}

export function vertexIds(g: GraphData): string[] {
  return g.vertices.map((v) => v.id);
}

function edgeConnects(e: EdgeData, a: string, b: string, directed: boolean): boolean {
  if (directed) return e.source === a && e.target === b;
  return (e.source === a && e.target === b) || (e.source === b && e.target === a);
}

export function neighbors(g: GraphData, id: string): string[] {
  const out = new Set<string>();
  for (const e of g.edges) {
    if (g.directed) {
      if (e.source === id) out.add(e.target);
    } else {
      if (e.source === id) out.add(e.target);
      if (e.target === id) out.add(e.source);
    }
  }
  return [...out];
}

export function successors(g: GraphData, id: string): string[] {
  return [...new Set(g.edges.filter((e) => e.source === id).map((e) => e.target))];
}

export function predecessors(g: GraphData, id: string): string[] {
  return [...new Set(g.edges.filter((e) => e.target === id).map((e) => e.source))];
}

export function incidentEdges(g: GraphData, id: string): EdgeData[] {
  return g.edges.filter((e) => e.source === id || e.target === id);
}

// ---------------------------------------------------------------------------
// Grau / teorema do aperto de mãos
// ---------------------------------------------------------------------------

export function degree(g: GraphData, id: string): number {
  if (!g.directed) {
    return g.edges.reduce((acc, e) => {
      if (e.source === id && e.target === id) return acc + 2; // laço soma 2
      if (e.source === id || e.target === id) return acc + 1;
      return acc;
    }, 0);
  }
  return successors(g, id).length + predecessors(g, id).length;
}

export function inDegree(g: GraphData, id: string): number {
  return predecessors(g, id).length;
}

export function outDegree(g: GraphData, id: string): number {
  return successors(g, id).length;
}

export function degreeSequence(g: GraphData): number[] {
  return g.vertices.map((v) => degree(g, v.id)).sort((a, b) => b - a);
}

export function sumOfDegrees(g: GraphData): number {
  return degreeSequence(g).reduce((a, b) => a + b, 0);
}

export function isRegular(g: GraphData): boolean {
  const seq = degreeSequence(g);
  return seq.every((d) => d === seq[0]);
}

/**
 * Sequência de graus é graficável (existe algum grafo simples com esses graus)?
 * Implementa o teorema de Erdős–Gallai completo (não é só checagem de soma par).
 * Para todo 1≤k≤n: Σ_{i=1}^{k} dᵢ ≤ k(k−1) + Σ_{i=k+1}^{n} min(dᵢ,k), com a sequência ordenada decrescente.
 */
export function isDegreeSequencePossible(seqInput: number[], n: number): { possible: boolean; reason: string } {
  const sum = seqInput.reduce((a, b) => a + b, 0);
  if (sum % 2 !== 0) return { possible: false, reason: 'Soma dos graus é ímpar — pelo teorema do aperto de mãos, soma dos graus = 2|E|, sempre par.' };
  if (seqInput.some((d) => d < 0 || d > n - 1)) return { possible: false, reason: `Grau deve estar entre 0 e ${n - 1} em grafo simples de ${n} vértices.` };
  if (seqInput.includes(0) && seqInput.includes(n - 1)) {
    return { possible: false, reason: `Grau 0 e grau ${n - 1} não podem coexistir na mesma sequência de um grafo simples.` };
  }
  const seq = [...seqInput].sort((a, b) => b - a);
  for (let k = 1; k <= n; k++) {
    const lhs = seq.slice(0, k).reduce((a, b) => a + b, 0);
    const rhs = k * (k - 1) + seq.slice(k).reduce((acc, d) => acc + Math.min(d, k), 0);
    if (lhs > rhs) {
      return { possible: false, reason: `Falha o critério de Erdős–Gallai em k=${k}: soma dos ${k} maiores graus (${lhs}) excede k(k−1) + soma dos min(dᵢ,k) restantes (${rhs}).` };
    }
  }
  return { possible: true, reason: 'Soma par, valores no intervalo válido e critério de Erdős–Gallai satisfeito para todo k — sequência graficável.' };
}

// ---------------------------------------------------------------------------
// Representações
// ---------------------------------------------------------------------------

export function adjacencyMatrix(g: GraphData): { rowIds: string[]; colIds: string[]; matrix: number[][] } {
  const ids = vertexIds(g);
  const idx = new Map(ids.map((id, i) => [id, i]));
  const matrix = ids.map(() => ids.map(() => 0));
  for (const e of g.edges) {
    const i = idx.get(e.source)!;
    const j = idx.get(e.target)!;
    matrix[i][j] += 1;
    if (!g.directed) matrix[j][i] += 1;
  }
  return { rowIds: ids, colIds: ids, matrix };
}

/** Convenção do professor: +1 na origem, -1 no destino, 0 se não incidente (grafo dirigido). Não-dirigido usa 1/0. */
export function incidenceMatrix(g: GraphData): { rowIds: string[]; colIds: string[]; matrix: number[][] } {
  const ids = vertexIds(g);
  const idx = new Map(ids.map((id, i) => [id, i]));
  const matrix = ids.map(() => g.edges.map(() => 0));
  g.edges.forEach((e, col) => {
    if (g.directed) {
      if (e.source === e.target) {
        matrix[idx.get(e.source)!][col] = 2; // laço
      } else {
        matrix[idx.get(e.source)!][col] = 1;
        matrix[idx.get(e.target)!][col] = -1;
      }
    } else {
      matrix[idx.get(e.source)!][col] += e.source === e.target ? 2 : 1;
      if (e.target !== e.source) matrix[idx.get(e.target)!][col] += 1;
    }
  });
  return { rowIds: ids, colIds: g.edges.map((e) => e.id), matrix };
}

export function adjacencyList(g: GraphData): { successorsMap: Record<string, string[]>; predecessorsMap: Record<string, string[]> } {
  const successorsMap: Record<string, string[]> = {};
  const predecessorsMap: Record<string, string[]> = {};
  for (const v of g.vertices) {
    successorsMap[v.id] = g.directed ? successors(g, v.id) : neighbors(g, v.id);
    predecessorsMap[v.id] = g.directed ? predecessors(g, v.id) : neighbors(g, v.id);
  }
  return { successorsMap, predecessorsMap };
}

// ---------------------------------------------------------------------------
// Complemento, subgrafos, bipartição
// ---------------------------------------------------------------------------

export function complement(g: GraphData): GraphData {
  const ids = vertexIds(g);
  const existing = new Set(g.edges.map((e) => (g.directed ? `${e.source}>${e.target}` : [e.source, e.target].sort().join('-'))));
  const edges: EdgeData[] = [];
  let i = 0;
  for (const a of ids) {
    for (const b of ids) {
      if (a === b) continue;
      if (!g.directed && a > b) continue;
      const key = g.directed ? `${a}>${b}` : [a, b].sort().join('-');
      if (!existing.has(key)) edges.push({ id: `c${i++}`, source: a, target: b });
    }
  }
  return { directed: g.directed, vertices: g.vertices.map((v) => ({ ...v })), edges };
}

export function isSelfComplementary(g: GraphData): boolean {
  return g.edges.length === complement(g).edges.length && g.edges.length === (g.vertices.length * (g.vertices.length - 1)) / 4;
}

export function inducedSubgraph(g: GraphData, ids: string[]): GraphData {
  const set = new Set(ids);
  return {
    directed: g.directed,
    vertices: g.vertices.filter((v) => set.has(v.id)).map((v) => ({ ...v })),
    edges: g.edges.filter((e) => set.has(e.source) && set.has(e.target)).map((e) => ({ ...e })),
  };
}

/** Σ_{i=1}^{n} C(n,i) · 2^(i(i-1)/2) — fórmula usada pelo professor para nº de subgrafos (não-vazios, com vértices) de Kn. */
export function numberOfSubgraphsOfCompleteGraph(n: number): number {
  const choose = (a: number, b: number) => {
    let r = 1;
    for (let k = 0; k < b; k++) r = (r * (a - k)) / (k + 1);
    return Math.round(r);
  };
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += choose(n, i) * 2 ** ((i * (i - 1)) / 2);
  }
  return total;
}

export function isBipartite(g: GraphData): { bipartite: boolean; partition?: [string[], string[]] } {
  const color = new Map<string, 0 | 1>();
  for (const start of vertexIds(g)) {
    if (color.has(start)) continue;
    color.set(start, 0);
    const queue = [start];
    while (queue.length) {
      const v = queue.shift()!;
      for (const u of neighbors(g, v)) {
        if (!color.has(u)) {
          color.set(u, color.get(v) === 0 ? 1 : 0);
          queue.push(u);
        } else if (color.get(u) === color.get(v)) {
          return { bipartite: false };
        }
      }
    }
  }
  const a: string[] = [];
  const b: string[] = [];
  for (const [id, c] of color) (c === 0 ? a : b).push(id);
  return { bipartite: true, partition: [a, b] };
}

/** Condições NECESSÁRIAS (não suficientes) de isomorfismo: mesmo |V|, |E|, e mesma sequência de graus. */
export function isomorphismNecessaryConditions(a: GraphData, b: GraphData): { possiblyIsomorphic: boolean; reasons: string[] } {
  const reasons: string[] = [];
  let ok = true;
  if (a.vertices.length !== b.vertices.length) {
    ok = false;
    reasons.push(`|V(A)|=${a.vertices.length} ≠ |V(B)|=${b.vertices.length}`);
  }
  if (a.edges.length !== b.edges.length) {
    ok = false;
    reasons.push(`|E(A)|=${a.edges.length} ≠ |E(B)|=${b.edges.length}`);
  }
  const seqA = degreeSequence(a);
  const seqB = degreeSequence(b);
  if (JSON.stringify(seqA) !== JSON.stringify(seqB)) {
    ok = false;
    reasons.push(`Sequência de graus difere: [${seqA}] ≠ [${seqB}]`);
  }
  if (ok) reasons.push('Mesmo |V|, |E| e sequência de graus — condições necessárias satisfeitas (não garante isomorfismo).');
  return { possiblyIsomorphic: ok, reasons };
}

export function validateIsomorphismMapping(a: GraphData, b: GraphData, mapping: Record<string, string>): { valid: boolean; brokenEdges: string[] } {
  const brokenEdges: string[] = [];
  for (const e of a.edges) {
    const ms = mapping[e.source];
    const mt = mapping[e.target];
    if (!ms || !mt) continue;
    const exists = b.edges.some((be) => edgeConnects(be, ms, mt, b.directed));
    if (!exists) brokenEdges.push(e.id);
  }
  return { valid: brokenEdges.length === 0, brokenEdges };
}

// ---------------------------------------------------------------------------
// Transposto
// ---------------------------------------------------------------------------

export function transpose(g: GraphData): GraphData {
  return {
    directed: g.directed,
    vertices: g.vertices.map((v) => ({ ...v })),
    edges: g.edges.map((e) => ({ ...e, id: e.id, source: e.target, target: e.source })),
  };
}

// ---------------------------------------------------------------------------
// BFS / DFS
// ---------------------------------------------------------------------------

export function bfs(g: GraphData, start: string): { order: string[]; distances: Record<string, number>; steps: AlgorithmStep[] } {
  const distances: Record<string, number> = { [start]: 0 };
  const order: string[] = [];
  const queue = [start];
  const steps: AlgorithmStep[] = [{ description: `Fila inicializada com ${start}. Distância(${start}) = 0.`, highlightVertices: [start], currentVertex: start }];
  while (queue.length) {
    const v = queue.shift()!;
    order.push(v);
    steps.push({ description: `Remove ${v} da fila e visita seus vizinhos.`, currentVertex: v, highlightVertices: [v] });
    for (const u of neighbors(g, v)) {
      if (!(u in distances)) {
        distances[u] = distances[v] + 1;
        queue.push(u);
        steps.push({
          description: `${u} não visitado — Distância(${u}) = Distância(${v}) + 1 = ${distances[u]}. Adiciona ${u} à fila.`,
          highlightVertices: [u],
          currentVertex: v,
        });
      }
    }
  }
  steps.push({ description: 'Fila vazia — BFS concluída.' });
  return { order, distances, steps };
}

export type EdgeClass = 'tree' | 'back' | 'forward' | 'cross';

/** Estados 0/1/2 exatamente como escritos no quadro pelo professor (não usa branco/cinza/preto). */
export function dfs(
  g: GraphData,
  start?: string,
): {
  order: string[];
  discovery: Record<string, number>;
  finish: Record<string, number>;
  edgeClass: Record<string, EdgeClass>;
  hasCycle: boolean;
  cycleBackEdge?: string;
  steps: AlgorithmStep[];
} {
  const state: Record<string, 0 | 1 | 2> = {};
  for (const v of vertexIds(g)) state[v] = 0;
  const discovery: Record<string, number> = {};
  const finish: Record<string, number> = {};
  const edgeClass: Record<string, EdgeClass> = {};
  const order: string[] = [];
  const steps: AlgorithmStep[] = [];
  let time = 0;
  let hasCycle = false;
  let cycleBackEdge: string | undefined;

  const visit = (v: string) => {
    state[v] = 1;
    discovery[v] = time++;
    order.push(v);
    steps.push({ description: `VISITAR_REC(${v}): estado 0→1 (começou, não terminou).`, currentVertex: v, highlightVertices: [v], state: { ...state } as Record<string, string | number> });
    for (const e of g.edges) {
      if (e.source !== v) continue;
      const u = e.target;
      if (state[u] === 0) {
        edgeClass[e.id] = 'tree';
        steps.push({ description: `Aresta ${v}→${u}: ${u} não começou (estado 0) — aresta de ÁRVORE.`, highlightEdges: [e.id] });
        visit(u);
      } else if (state[u] === 1) {
        edgeClass[e.id] = 'back';
        hasCycle = true;
        cycleBackEdge = cycleBackEdge ?? e.id;
        steps.push({ description: `Aresta ${v}→${u}: ${u} começou mas não terminou (estado 1) — aresta de RETORNO ⇒ HÁ CICLO.`, highlightEdges: [e.id] });
      } else {
        edgeClass[e.id] = discovery[u] > discovery[v] ? 'forward' : 'cross';
        steps.push({ description: `Aresta ${v}→${u}: ${u} já terminou (estado 2) — aresta de ${edgeClass[e.id] === 'forward' ? 'AVANÇO' : 'CRUZAMENTO'}.`, highlightEdges: [e.id] });
      }
    }
    state[v] = 2;
    finish[v] = time++;
    steps.push({ description: `VISITAR_REC(${v}) termina: estado 1→2.`, currentVertex: v, state: { ...state } as Record<string, string | number> });
  };

  if (start) visit(start);
  for (const v of vertexIds(g)) if (state[v] === 0) visit(v);

  return { order, discovery, finish, edgeClass, hasCycle, cycleBackEdge, steps };
}

// ---------------------------------------------------------------------------
// Fecho transitivo / Base / anti-base (notação Γ⁺ do professor)
// ---------------------------------------------------------------------------

export function reachableFrom(g: GraphData, start: string): string[] {
  const visited = new Set<string>([start]);
  const stack = [start];
  while (stack.length) {
    const v = stack.pop()!;
    for (const u of successors(g, v)) {
      if (!visited.has(u)) {
        visited.add(u);
        stack.push(u);
      }
    }
  }
  visited.delete(start);
  return [...visited];
}

/** Fecho transitivo direto de v: Γ⁺(v), todos os vértices alcançáveis a partir de v. */
export function transitiveClosureDirect(g: GraphData, start: string): string[] {
  return reachableFrom(g, start);
}

/** Fecho transitivo inverso de v: vértices que alcançam v — calculado via Γ⁺ no grafo transposto. */
export function transitiveClosureInverse(g: GraphData, start: string): string[] {
  return reachableFrom(transpose(g), start);
}

export function stronglyConnectedComponents(g: GraphData): { components: string[][]; steps: AlgorithmStep[] } {
  const steps: AlgorithmStep[] = [];
  const { finish } = dfs(g);
  const finishOrder = Object.entries(finish).sort((a, b) => b[1] - a[1]).map(([id]) => id);
  steps.push({ description: `Passo 1 — DFS em G, ordem decrescente de tempo de término: ${finishOrder.join(', ')}.` });

  const gt = transpose(g);
  steps.push({ description: 'Passo 2 — Transpõe G (inverte todas as arestas).' });

  const visited = new Set<string>();
  const components: string[][] = [];
  for (const v of finishOrder) {
    if (visited.has(v)) continue;
    const comp: string[] = [];
    const stack = [v];
    visited.add(v);
    while (stack.length) {
      const cur = stack.pop()!;
      comp.push(cur);
      for (const u of successors(gt, cur)) {
        if (!visited.has(u)) {
          visited.add(u);
          stack.push(u);
        }
      }
    }
    components.push(comp);
    steps.push({ description: `DFS em Gᵀ a partir de ${v} (próximo não visitado na ordem do passo 1) — componente: {${comp.join(', ')}}.`, highlightVertices: comp });
  }
  return { components, steps };
}

/** Base: subconjunto B⊆V minimal tal que Γ⁺(B) = V. Calculado via condensação em SCCs
 * (cada SCC vira um hipervértice) — base = SCCs com grau de entrada 0 na condensação. */
export function baseAndAntiBase(g: GraphData): { base: string[]; antiBase: string[]; components: string[][] } {
  const { components } = stronglyConnectedComponents(g);
  const compOf = new Map<string, number>();
  components.forEach((comp, i) => comp.forEach((v) => compOf.set(v, i)));

  const condensedInDegree = components.map(() => 0);
  const condensedOutDegree = components.map(() => 0);
  const seenPairs = new Set<string>();
  for (const e of g.edges) {
    const ci = compOf.get(e.source)!;
    const cj = compOf.get(e.target)!;
    if (ci === cj) continue;
    const key = `${ci}>${cj}`;
    if (seenPairs.has(key)) continue;
    seenPairs.add(key);
    condensedOutDegree[ci]++;
    condensedInDegree[cj]++;
  }

  const base = components.filter((_, i) => condensedInDegree[i] === 0).map((comp) => comp[0]);
  const antiBase = components.filter((_, i) => condensedOutDegree[i] === 0).map((comp) => comp[0]);
  return { base, antiBase, components };
}

// ---------------------------------------------------------------------------
// Excentricidade / raio / diâmetro / centro
// ---------------------------------------------------------------------------

export function distancesFrom(g: GraphData, start: string): Record<string, number> {
  return bfs(g, start).distances;
}

export function eccentricity(g: GraphData, id: string): number {
  const dist = distancesFrom(g, id);
  const values = vertexIds(g)
    .filter((v) => v !== id)
    .map((v) => dist[v] ?? Infinity);
  return values.length ? Math.max(...values) : 0;
}

export function radiusDiameterCenter(g: GraphData): { radius: number; diameter: number; center: string[]; eccentricities: Record<string, number> } {
  const eccentricities: Record<string, number> = {};
  for (const v of vertexIds(g)) eccentricities[v] = eccentricity(g, v);
  const values = Object.values(eccentricities);
  const radius = Math.min(...values);
  const diameter = Math.max(...values);
  const center = Object.entries(eccentricities).filter(([, e]) => e === radius).map(([v]) => v);
  return { radius, diameter, center, eccentricities };
}

// ---------------------------------------------------------------------------
// Euleriano
// ---------------------------------------------------------------------------

export function eulerianClassification(g: GraphData): { kind: 'circuit' | 'path' | 'none'; oddVertices: string[] } {
  const odd = vertexIds(g).filter((v) => degree(g, v) % 2 !== 0);
  if (odd.length === 0) return { kind: 'circuit', oddVertices: [] };
  if (odd.length === 2) return { kind: 'path', oddVertices: odd };
  return { kind: 'none', oddVertices: odd };
}

/** Algoritmo de Hierholzer — constrói o circuito/caminho euleriano de fato. */
export function eulerianTrail(g: GraphData): { trail: string[]; steps: AlgorithmStep[] } | null {
  const { kind, oddVertices } = eulerianClassification(g);
  if (kind === 'none') return null;

  const remaining = new Map<string, EdgeData[]>();
  for (const v of vertexIds(g)) remaining.set(v, incidentEdges(g, v).slice());

  const used = new Set<string>();
  const start = kind === 'path' ? oddVertices[0] : g.vertices[0].id;
  const steps: AlgorithmStep[] = [{ description: `Início em ${start} (${kind === 'path' ? 'vértice de grau ímpar' : 'vértice arbitrário, todos os graus são pares'}).` }];

  const stack = [start];
  const trail: string[] = [];
  while (stack.length) {
    const v = stack[stack.length - 1];
    const edges = (remaining.get(v) ?? []).filter((e) => !used.has(e.id));
    if (edges.length === 0) {
      trail.push(stack.pop()!);
    } else {
      const e = edges[0];
      used.add(e.id);
      const next = e.source === v ? e.target : e.source;
      steps.push({ description: `Segue aresta ${e.id} de ${v} para ${next}.`, highlightEdges: [e.id], currentVertex: next });
      stack.push(next);
    }
  }
  trail.reverse();
  steps.push({ description: `Trilha construída: ${trail.join(' → ')}.` });
  return { trail, steps };
}

// ---------------------------------------------------------------------------
// Pontes, cortes e Fleury (slides 08, 09 e 11)
// ---------------------------------------------------------------------------

/** Vértices alcançáveis de `start` usando só as arestas dadas (sem direção). */
function reachableVia(edges: EdgeData[], start: string): Set<string> {
  const seen = new Set([start]);
  const stack = [start];
  while (stack.length) {
    const v = stack.pop()!;
    for (const e of edges) {
      if (e.source !== v && e.target !== v) continue;
      const u = otherEnd(e, v);
      if (!seen.has(u)) {
        seen.add(u);
        stack.push(u);
      }
    }
  }
  return seen;
}

function isBridgeAmong(edges: EdgeData[], e: EdgeData): boolean {
  return !reachableVia(edges.filter((x) => x.id !== e.id), e.source).has(e.target);
}

/** Ponte: aresta cuja remoção desconecta o grafo (slide 08, "Finding Eulerian tours — Bridges"). */
export function bridges(g: GraphData): string[] {
  return g.edges.filter((e) => isBridgeAmong(g.edges, e)).map((e) => e.id);
}

/** cut(S): arestas (v, w) com v ∈ S e w ∈ V − S (slide 11, "Graph Cuts"). */
export function cutSet(g: GraphData, s: string[]): string[] {
  const inS = new Set(s);
  return g.edges.filter((e) => inS.has(e.source) !== inS.has(e.target)).map((e) => e.id);
}

export function connectedComponentCount(g: GraphData): number {
  const seen = new Set<string>();
  let k = 0;
  for (const v of vertexIds(g)) {
    if (seen.has(v)) continue;
    k++;
    for (const u of reachableVia(g.edges, v)) seen.add(u);
  }
  return k;
}

/**
 * Posto r = n − k (ramos) e nulidade = e − r (cordas). O slide 11, p. 35
 * imprime "μ = e − n − k", mas o próprio exemplo do slide (n=8, e=9, k=1,
 * 2 cordas) só fecha com e − n + k — ver o conflito registrado no tópico.
 */
export function rankAndNullity(g: GraphData): { n: number; e: number; k: number; rank: number; nullity: number } {
  const n = g.vertices.length;
  const e = g.edges.length;
  const k = connectedComponentCount(g);
  return { n, e, k, rank: n - k, nullity: e - n + k };
}

/**
 * Algoritmo de Fleury exatamente como no slide 08 (quadro 33): começa em
 * vértice de grau ímpar se houver; se há mais de uma aresta incidente,
 * atravessa uma que não seja ponte; senão, atravessa a única disponível.
 * Desempate: ordem de declaração das arestas.
 */
export function fleury(g: GraphData): { trail: string[]; edgeOrder: string[]; steps: AlgorithmStep[] } | null {
  const { kind, oddVertices } = eulerianClassification(g);
  if (kind === 'none' || g.edges.length === 0) return null;
  let v = kind === 'path' ? oddVertices[0] : g.edges[0].source;
  let remaining = [...g.edges];
  const trail = [v];
  const edgeOrder: string[] = [];
  const steps: AlgorithmStep[] = [
    {
      description: kind === 'path' ? `Vértices de grau ímpar: ${oddVertices.join(', ')}. Começa em ${v}.` : `Todos os graus são pares. Começa em ${v}.`,
      currentVertex: v,
    },
  ];

  while (remaining.length) {
    const incident = remaining.filter((e) => e.source === v || e.target === v);
    if (incident.length === 0) return null; // desconexo: sobraram arestas inalcançáveis
    let e: EdgeData;
    let why: string;
    if (incident.length > 1) {
      e = incident.find((x) => !isBridgeAmong(remaining, x)) ?? incident[0];
      const skipped = incident.filter((x) => x.id !== e.id && isBridgeAmong(remaining, x));
      why = skipped.length ? `evita a ponte ${skipped.map((x) => `(${x.source},${x.target})`).join(', ')}` : 'não é ponte';
    } else {
      e = incident[0];
      why = 'é a única aresta disponível';
    }
    remaining = remaining.filter((x) => x.id !== e.id);
    const next = otherEnd(e, v);
    edgeOrder.push(e.id);
    trail.push(next);
    steps.push({ description: `Atravessa (${v},${next}): ${why}. E = E − {(${v},${next})}.`, currentVertex: next, highlightEdges: [...edgeOrder], highlightVertices: [next] });
    v = next;
  }
  steps.push({ description: `Trilha: ${trail.join('-')}.`, highlightEdges: [...edgeOrder] });
  return { trail, edgeOrder, steps };
}

// ---------------------------------------------------------------------------
// Dijkstra
// ---------------------------------------------------------------------------

export function dijkstra(g: GraphData, start: string): { distances: Record<string, number>; predecessors: Record<string, string | null>; steps: AlgorithmStep[] } {
  const distances: Record<string, number> = {};
  const predecessors: Record<string, string | null> = {};
  for (const v of vertexIds(g)) {
    distances[v] = v === start ? 0 : Infinity;
    predecessors[v] = null;
  }
  const visited = new Set<string>();
  const steps: AlgorithmStep[] = [{ description: `D[${start}] = 0, D[demais] = ∞.` }];

  while (visited.size < g.vertices.length) {
    let u: string | null = null;
    let best = Infinity;
    for (const v of vertexIds(g)) {
      if (!visited.has(v) && distances[v] < best) {
        best = distances[v];
        u = v;
      }
    }
    if (u === null) break;
    visited.add(u);
    steps.push({ description: `Seleciona ${u} (menor D atual = ${distances[u]}) e remove da fila.`, currentVertex: u, highlightVertices: [u] });
    for (const e of g.edges) {
      if (e.source !== u && (g.directed || e.target !== u)) continue;
      const v = e.source === u ? e.target : e.source;
      const w = e.weight ?? 1;
      if (distances[u] + w < distances[v]) {
        distances[v] = distances[u] + w;
        predecessors[v] = u;
        steps.push({ description: `Relaxa (${u},${v}): D[${v}] = D[${u}] + ${w} = ${distances[v]}.`, highlightEdges: [e.id], highlightVertices: [v] });
      }
    }
  }
  return { distances, predecessors, steps };
}

// ---------------------------------------------------------------------------
// Bellman-Ford
// ---------------------------------------------------------------------------

/** Arestas como pares ordenados; grafo não direcionado vira duas arestas direcionadas (slide 10, "Aside"). */
function directedArcs(g: GraphData): { id: string; from: string; to: string; w: number }[] {
  return g.edges.flatMap((e) => {
    const w = e.weight ?? 1;
    const arc = { id: e.id, from: e.source, to: e.target, w };
    return g.directed ? [arc] : [arc, { id: e.id, from: e.target, to: e.source, w }];
  });
}

/**
 * Bellman-Ford na forma do slide 10 (quadro 25): d[i, v] = comprimento do
 * menor caminho de s a v com no máximo i arestas. Linha 0: d[0, s] = 0, resto ∞.
 * Para i = 1..n-1: d[i, v] = d[i-1, v] e, para cada aresta (w, v),
 * d[i, v] = min{d[i, v], d[i-1, w] + c_wv}.
 *
 * A detecção de ciclo negativo (uma rodada extra que ainda melhora algum
 * valor) NÃO está no slide — o slide só pergunta "How to detect negative
 * cycles?". Fica aqui para o app conseguir avisar.
 */
export function bellmanFord(g: GraphData, start: string): {
  table: Record<string, number>[];
  distances: Record<string, number>;
  predecessors: Record<string, string | null>;
  negativeCycle: boolean;
  steps: AlgorithmStep[];
} {
  const ids = vertexIds(g);
  const arcs = directedArcs(g);
  const first: Record<string, number> = Object.fromEntries(ids.map((v) => [v, v === start ? 0 : Infinity]));
  const table = [first];
  const predecessors: Record<string, string | null> = Object.fromEntries(ids.map((v) => [v, null]));
  const fmt = (row: Record<string, number>) => ids.map((v) => `${v}=${row[v] === Infinity ? '∞' : row[v]}`).join(', ');
  const steps: AlgorithmStep[] = [{ description: `i = 0: d[0, ${start}] = 0, demais = ∞.`, currentVertex: start, state: { ...first } }];

  for (let i = 1; i < ids.length; i++) {
    const prev = table[i - 1];
    const row = { ...prev };
    const changedEdges: string[] = [];
    const changedVertices: string[] = [];
    for (const a of arcs) {
      if (prev[a.from] === Infinity) continue;
      const candidate = prev[a.from] + a.w;
      if (candidate < row[a.to]) {
        row[a.to] = candidate;
        predecessors[a.to] = a.from;
        changedEdges.push(a.id);
        changedVertices.push(a.to);
      }
    }
    table.push(row);
    steps.push({
      description: changedVertices.length
        ? `i = ${i} (caminhos com até ${i} arestas): melhora ${[...new Set(changedVertices)].join(', ')}. Linha: ${fmt(row)}.`
        : `i = ${i}: nenhum valor mudou em relação à linha ${i - 1}. Linha: ${fmt(row)}.`,
      highlightEdges: changedEdges,
      highlightVertices: changedVertices,
      state: { ...row },
    });
  }

  const last = table[table.length - 1];
  const negativeCycle = arcs.some((a) => last[a.from] !== Infinity && last[a.from] + a.w < last[a.to]);
  if (negativeCycle) steps.push({ description: 'Uma rodada extra ainda melhoraria algum valor: há ciclo de custo negativo alcançável a partir da origem.' });
  return { table, distances: { ...last }, predecessors, negativeCycle, steps };
}

// ---------------------------------------------------------------------------
// Floyd-Warshall
// ---------------------------------------------------------------------------

/**
 * Floyd-Warshall. NÃO há slide do professor sobre este algoritmo: segue
 * Cormen (ed. PT), seção 25.2. d(k)ij = peso do menor caminho de i a j cujos
 * vértices intermediários estão em {1..k}; D(0) é a matriz de pesos e
 * d(k)ij = min(d(k-1)ij, d(k-1)ik + d(k-1)kj). Vértices numerados na ordem
 * em que foram declarados.
 */
export function floydWarshall(g: GraphData): {
  ids: string[];
  matrices: number[][][];
  predecessors: (string | null)[][];
  negativeCycle: boolean;
  path: (from: string, to: string) => string[] | null;
  steps: AlgorithmStep[];
} {
  const ids = vertexIds(g);
  const n = ids.length;
  const idx = new Map(ids.map((v, i) => [v, i]));
  const d0 = ids.map((_, i) => ids.map((__, j) => (i === j ? 0 : Infinity)));
  const pred: (string | null)[][] = ids.map(() => ids.map(() => null));
  for (const a of directedArcs(g)) {
    const i = idx.get(a.from)!;
    const j = idx.get(a.to)!;
    if (i !== j && a.w < d0[i][j]) {
      d0[i][j] = a.w;
      pred[i][j] = a.from;
    }
  }
  const matrices = [d0];
  const steps: AlgorithmStep[] = [{ description: 'D(0): matriz de pesos (0 na diagonal, ∞ onde não há aresta).' }];

  for (let k = 0; k < n; k++) {
    const prev = matrices[k];
    const next = prev.map((row) => [...row]);
    const changed: string[] = [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const viaK = prev[i][k] + prev[k][j];
        if (viaK < next[i][j]) {
          next[i][j] = viaK;
          pred[i][j] = pred[k][j];
          changed.push(`d(${ids[i]},${ids[j]})=${viaK}`);
        }
      }
    }
    matrices.push(next);
    steps.push({
      description: `D(${k + 1}): permite ${ids[k]} como intermediário. ${changed.length ? `Melhoram: ${changed.join(', ')}.` : 'Nada melhora.'}`,
      currentVertex: ids[k],
      highlightVertices: [ids[k]],
    });
  }

  const last = matrices[n];
  const negativeCycle = ids.some((_, i) => last[i][i] < 0);
  const path = (from: string, to: string): string[] | null => {
    const i = idx.get(from)!;
    let j = idx.get(to)!;
    if (last[i][j] === Infinity) return null;
    const out = [to];
    while (j !== i) {
      const p = pred[i][j];
      if (p === null || out.length > n) return null; // ciclo negativo: caminho mínimo não existe
      out.push(p);
      j = idx.get(p)!;
    }
    return out.reverse();
  };
  return { ids, matrices, predecessors: pred, negativeCycle, path, steps };
}

// ---------------------------------------------------------------------------
// Árvore geradora mínima (AGM)
// ---------------------------------------------------------------------------

export interface MstResult {
  treeEdgeIds: string[];
  totalWeight: number;
  /** false quando o grafo é desconexo e a árvore não alcança todos os vértices. */
  spanning: boolean;
  steps: AlgorithmStep[];
}

function otherEnd(e: EdgeData, v: string): string {
  return e.source === v ? e.target : e.source;
}

/**
 * Prim (slide 11, "Optimality of Prim's Algorithm"): mantém a árvore (S, U) e
 * a cada passo adiciona a aresta mais barata de cut(S). Empate: a primeira
 * aresta na ordem em que o grafo foi declarado.
 */
export function prim(g: GraphData, start: string): MstResult {
  const inTree = new Set([start]);
  const treeEdgeIds: string[] = [];
  let totalWeight = 0;
  const steps: AlgorithmStep[] = [{ description: `S = {${start}}, U = ∅.`, currentVertex: start, highlightVertices: [start] }];

  while (inTree.size < g.vertices.length) {
    const cut = g.edges.filter((e) => inTree.has(e.source) !== inTree.has(e.target));
    if (cut.length === 0) break;
    const best = cut.reduce((a, b) => ((b.weight ?? 1) < (a.weight ?? 1) ? b : a));
    const v = inTree.has(best.source) ? best.target : best.source;
    inTree.add(v);
    treeEdgeIds.push(best.id);
    totalWeight += best.weight ?? 1;
    steps.push({
      description: `Aresta mais barata de cut(S): (${otherEnd(best, v)},${v}) com custo ${best.weight ?? 1}. Adiciona ${v} a S.`,
      currentVertex: v,
      highlightVertices: [...inTree],
      highlightEdges: [...treeEdgeIds],
      state: { custo: totalWeight },
    });
  }
  const spanning = inTree.size === g.vertices.length;
  steps.push({ description: spanning ? `S = V. Custo da AGM = ${totalWeight}.` : `cut(S) vazio: o grafo é desconexo.`, highlightEdges: [...treeEdgeIds] });
  return { treeEdgeIds, totalWeight, spanning, steps };
}

/**
 * Kruskal (slide 11, "Optimality of Kruskal's Algorithm"): processa as arestas
 * em ordem não decrescente de custo e descarta a que criaria ciclo. Empate:
 * ordem de declaração. Cada vértice guarda o rótulo do seu componente.
 */
export function kruskal(g: GraphData): MstResult & { rejectedEdgeIds: string[] } {
  const comp = new Map(vertexIds(g).map((v) => [v, v]));
  const sorted = g.edges.map((e, i) => ({ e, i })).sort((x, y) => (x.e.weight ?? 1) - (y.e.weight ?? 1) || x.i - y.i).map((x) => x.e);
  const treeEdgeIds: string[] = [];
  const rejectedEdgeIds: string[] = [];
  let totalWeight = 0;
  const steps: AlgorithmStep[] = [
    { description: `Ordem não decrescente de custo: ${sorted.map((e) => `(${e.source},${e.target})=${e.weight ?? 1}`).join(', ')}. T = ∅.` },
  ];

  for (const e of sorted) {
    const a = comp.get(e.source)!;
    const b = comp.get(e.target)!;
    const label = `(${e.source},${e.target}) custo ${e.weight ?? 1}`;
    if (a === b) {
      rejectedEdgeIds.push(e.id);
      steps.push({ description: `${label}: ${e.source} e ${e.target} já estão ligados em T, criaria ciclo. Descarta.`, highlightEdges: [...treeEdgeIds], highlightVertices: [e.source, e.target], state: { custo: totalWeight } });
      continue;
    }
    for (const [v, c] of comp) if (c === b) comp.set(v, a);
    treeEdgeIds.push(e.id);
    totalWeight += e.weight ?? 1;
    steps.push({ description: `${label}: não cria ciclo. Adiciona a T.`, highlightEdges: [...treeEdgeIds], highlightVertices: [e.source, e.target], state: { custo: totalWeight } });
  }
  const spanning = treeEdgeIds.length === g.vertices.length - 1;
  steps.push({ description: spanning ? `Todas as arestas processadas. Custo da AGM = ${totalWeight}.` : `Grafo desconexo: T é uma floresta geradora com ${treeEdgeIds.length} arestas.`, highlightEdges: [...treeEdgeIds] });
  return { treeEdgeIds, rejectedEdgeIds, totalWeight, spanning, steps };
}

// ---------------------------------------------------------------------------
// Ordenação topológica / maior caminho em DAG
// ---------------------------------------------------------------------------

export function topologicalSort(g: GraphData): { order: string[]; steps: AlgorithmStep[] } | null {
  const inDeg = new Map(vertexIds(g).map((v) => [v, inDegree(g, v)]));
  const queue = vertexIds(g).filter((v) => inDeg.get(v) === 0);
  const order: string[] = [];
  const steps: AlgorithmStep[] = [{ description: `Vértices com grau de entrada 0: ${queue.join(', ') || '(nenhum)'}.` }];
  while (queue.length) {
    const v = queue.shift()!;
    order.push(v);
    steps.push({ description: `Remove ${v} (grau de entrada 0) e suas arestas de saída.`, currentVertex: v, highlightVertices: [v] });
    for (const u of successors(g, v)) {
      inDeg.set(u, inDeg.get(u)! - 1);
      if (inDeg.get(u) === 0) queue.push(u);
    }
  }
  if (order.length !== g.vertices.length) return null; // há ciclo
  return { order, steps };
}

export function longestPathDAG(g: GraphData): { distances: Record<string, number>; predecessors: Record<string, string | null>; order: string[] } | null {
  const topo = topologicalSort(g);
  if (!topo) return null;
  const distances: Record<string, number> = {};
  const predecessors: Record<string, string | null> = {};
  for (const v of vertexIds(g)) {
    distances[v] = 0;
    predecessors[v] = null;
  }
  for (const v of topo.order) {
    for (const e of g.edges.filter((e) => e.source === v)) {
      const w = e.weight ?? 1;
      if (distances[v] + w > distances[e.target]) {
        distances[e.target] = distances[v] + w;
        predecessors[e.target] = v;
      }
    }
  }
  return { distances, predecessors, order: topo.order };
}

// ---------------------------------------------------------------------------
// Possibilidade de grafo dado n vértices e k componentes (padrão recorrente nas provas)
// ---------------------------------------------------------------------------

export function edgeBoundsForComponents(n: number, k: number): { min: number; max: number } {
  return { min: n - k, max: ((n - k) * (n - k + 1)) / 2 };
}
