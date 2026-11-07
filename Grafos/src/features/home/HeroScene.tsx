import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import type { ExamScope } from '@/content/types';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';

/* Cena da página inicial: um grafo pequeno onde o algoritmo escolhido anda
   passo a passo, com legenda. Toca sozinho; o aluno pode pausar, avançar e
   clicar num vértice para começar dele. */

type VId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
interface Edge { id: string; u: VId; v: VId; w: number }

const POS: Record<VId, [number, number]> = {
  A: [56, 150], B: [168, 58], C: [168, 242], D: [292, 150], E: [414, 58], F: [414, 242], G: [520, 150],
};
const VERTS = Object.keys(POS) as VId[];
const EDGES: Edge[] = [
  { id: 'AB', u: 'A', v: 'B', w: 4 },
  { id: 'AC', u: 'A', v: 'C', w: 2 },
  { id: 'BC', u: 'B', v: 'C', w: 1 },
  { id: 'BD', u: 'B', v: 'D', w: 5 },
  { id: 'CD', u: 'C', v: 'D', w: 8 },
  { id: 'CF', u: 'C', v: 'F', w: 10 },
  { id: 'DE', u: 'D', v: 'E', w: 2 },
  { id: 'DF', u: 'D', v: 'F', w: 6 },
  { id: 'EG', u: 'E', v: 'G', w: 3 },
  { id: 'FG', u: 'F', v: 'G', w: 1 },
];

function neighbors(x: VId): { to: VId; e: Edge }[] {
  return EDGES.filter((e) => e.u === x || e.v === x)
    .map((e) => ({ to: (e.u === x ? e.v : e.u) as VId, e }))
    .sort((a, b) => a.to.localeCompare(b.to));
}

interface Step {
  current?: VId;
  done: VId[];
  frontier: VId[];
  tree: string[];
  probe?: string;
  labels: Partial<Record<VId, string>>;
  caption: string;
  aux: string;
}

type AlgoId = 'dfs' | 'bfs' | 'dijkstra' | 'prim';

const ALGOS: { id: AlgoId; label: string; auxName: string }[] = [
  { id: 'bfs', label: 'Busca em largura', auxName: 'Fila' },
  { id: 'dfs', label: 'Busca em profundidade', auxName: 'Pilha de chamadas' },
  { id: 'dijkstra', label: 'Dijkstra', auxName: 'Distâncias' },
  { id: 'prim', label: 'Prim (AGM)', auxName: 'Peso da árvore' },
];

function bfs(s: VId): Step[] {
  const steps: Step[] = [];
  const level: Partial<Record<VId, string>> = { [s]: '0' };
  const seen = new Set<VId>([s]);
  const done: VId[] = [];
  const tree: string[] = [];
  const queue: VId[] = [s];
  steps.push({ done: [], frontier: [s], tree: [], labels: { ...level }, caption: `Começa em ${s}: ele entra na fila com nível 0.`, aux: queue.join(' ') });
  while (queue.length) {
    const x = queue.shift()!;
    const found: VId[] = [];
    for (const { to, e } of neighbors(x)) {
      if (!seen.has(to)) {
        seen.add(to);
        queue.push(to);
        tree.push(e.id);
        level[to] = String(Number(level[x]) + 1);
        found.push(to);
      }
    }
    done.push(x);
    steps.push({
      current: x,
      done: [...done],
      frontier: [...queue],
      tree: [...tree],
      labels: { ...level },
      caption: found.length
        ? `Sai ${x} da fila. Vizinhos novos: ${found.join(', ')} — entram no fim da fila, um nível abaixo.`
        : `Sai ${x} da fila. Nenhum vizinho novo: todos já foram descobertos.`,
      aux: queue.length ? queue.join(' ') : 'vazia',
    });
  }
  steps.push({ done: [...done], frontier: [], tree: [...tree], labels: { ...level }, caption: 'Fila vazia. As arestas azuis formam a árvore de busca; o número é a distância em arestas.', aux: 'vazia' });
  return steps;
}

function dfs(s: VId): Step[] {
  const steps: Step[] = [];
  const seen = new Set<VId>();
  const done: VId[] = [];
  const stack: VId[] = [];
  const tree: string[] = [];
  const labels: Partial<Record<VId, string>> = {};
  const visit = (v: VId) => {
    seen.add(v);
    stack.push(v);
    labels[v] = String(seen.size);
    steps.push({ current: v, done: [...done], frontier: [...stack], tree: [...tree], labels: { ...labels }, caption: `Visita ${v}. A busca aprofunda por um vizinho ainda não descoberto.`, aux: stack.join(' → ') });
    for (const { to, e } of neighbors(v)) {
      if (seen.has(to)) continue;
      tree.push(e.id);
      visit(to);
    }
    stack.pop();
    done.push(v);
    steps.push({ current: stack.at(-1), done: [...done], frontier: [...stack], tree: [...tree], labels: { ...labels }, caption: `Termina ${v}: todos os vizinhos foram descobertos.${stack.length ? ` Retorna a ${stack.at(-1)}.` : ' A busca terminou.'}`, aux: stack.join(' → ') || 'vazia' });
  };
  visit(s);
  return steps;
}

function dijkstra(s: VId): Step[] {
  const steps: Step[] = [];
  const dist: Partial<Record<VId, number>> = { [s]: 0 };
  const parent: Partial<Record<VId, string>> = {};
  const done = new Set<VId>();
  const lbl = () => Object.fromEntries(VERTS.map((v) => [v, dist[v] === undefined ? '∞' : String(dist[v])])) as Record<VId, string>;
  const auxText = () => VERTS.filter((v) => !done.has(v) && dist[v] !== undefined).map((v) => `${v}=${dist[v]}`).join('  ') || '—';
  steps.push({ done: [], frontier: [s], tree: [], labels: lbl(), caption: `Distância de ${s} até ele mesmo é 0; o resto começa em ∞.`, aux: auxText() });
  while (done.size < VERTS.length) {
    const open = VERTS.filter((v) => !done.has(v) && dist[v] !== undefined);
    if (!open.length) break;
    const x = open.reduce((a, b) => (dist[b]! < dist[a]! ? b : a));
    done.add(x);
    const improved: string[] = [];
    for (const { to, e } of neighbors(x)) {
      if (done.has(to)) continue;
      const nd = dist[x]! + e.w;
      if (dist[to] === undefined || nd < dist[to]!) {
        dist[to] = nd;
        parent[to] = e.id;
        improved.push(`${to}=${nd}`);
      }
    }
    const tree = Object.entries(parent).filter(([v]) => done.has(v as VId)).map(([, id]) => id!);
    steps.push({
      current: x,
      done: [...done],
      frontier: VERTS.filter((v) => !done.has(v) && dist[v] !== undefined),
      tree,
      labels: lbl(),
      caption: `Fecha ${x} (menor distância aberta: ${dist[x]}).` + (improved.length ? ` Relaxa as arestas e melhora ${improved.join(', ')}.` : ' Nenhuma distância melhora.'),
      aux: auxText(),
    });
  }
  steps.push({ done: [...done], frontier: [], tree: Object.values(parent) as string[], labels: lbl(), caption: `Pronto: cada número é o menor custo saindo de ${s}. As arestas azuis formam a árvore de caminhos mínimos.`, aux: '—' });
  return steps;
}

function prim(s: VId): Step[] {
  const steps: Step[] = [];
  const inTree = new Set<VId>([s]);
  const tree: string[] = [];
  let total = 0;
  steps.push({ done: [s], frontier: [], tree: [], labels: {}, caption: `A árvore começa só com ${s}.`, aux: '0' });
  while (inTree.size < VERTS.length) {
    const cut = EDGES.filter((e) => inTree.has(e.u) !== inTree.has(e.v));
    const best = cut.reduce((a, b) => (b.w < a.w ? b : a));
    const nv = (inTree.has(best.u) ? best.v : best.u) as VId;
    inTree.add(nv);
    tree.push(best.id);
    total += best.w;
    steps.push({
      current: nv,
      done: [...inTree],
      frontier: [],
      tree: [...tree],
      probe: best.id,
      labels: {},
      caption: `Entre as arestas que saem da árvore, a mais leve é ${best.u}–${best.v} (peso ${best.w}). ${nv} entra.`,
      aux: String(total),
    });
  }
  steps.push({ done: [...inTree], frontier: [], tree: [...tree], labels: {}, caption: `Todos os vértices conectados com ${tree.length} arestas e peso total ${total}: essa é a árvore geradora mínima.`, aux: String(total) });
  return steps;
}

const RUN: Record<AlgoId, (s: VId) => Step[]> = { bfs, dfs, dijkstra, prim };

export function HeroScene({ exam }: { exam: ExamScope }) {
  const algorithms = ALGOS.filter((a) => exam === 'all' || (exam === 'P1' ? a.id === 'bfs' || a.id === 'dfs' : a.id === 'dijkstra' || a.id === 'prim'));
  const [algo, setAlgo] = useState<AlgoId>(exam === 'P1' ? 'bfs' : 'dijkstra');
  const [source, setSource] = useState<VId>('A');
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(() => !(typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches));
  const steps = useMemo(() => RUN[algo](source), [algo, source]);
  const step = steps[Math.min(i, steps.length - 1)];

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => setI((n) => (n + 1 >= steps.length ? 0 : n + 1)), i + 1 >= steps.length ? 3200 : 1900);
    return () => window.clearTimeout(t);
  }, [playing, i, steps.length]);

  const choose = (a: AlgoId) => { setAlgo(a); setI(0); };
  const pick = (v: VId) => { setSource(v); setI(0); };
  const auxName = ALGOS.find((a) => a.id === algo)!.auxName;

  return (
    <div className="hero-scene">
      <div className="hs-tabs" role="tablist" aria-label="Algoritmo">
        {algorithms.map((a) => (
          <button key={a.id} role="tab" aria-selected={algo === a.id} className={clsx(algo === a.id && 'on')} onClick={() => choose(a.id)}>
            {a.label}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 576 300" className="hs-svg" role="img" aria-label={`${ALGOS.find((a) => a.id === algo)!.label} a partir de ${source}. ${step.caption}`}>
        {EDGES.map((e) => {
          const [x1, y1] = POS[e.u];
          const [x2, y2] = POS[e.v];
          const inTree = step.tree.includes(e.id);
          const probe = step.probe === e.id;
          const showW = algo === 'dijkstra' || algo === 'prim';
          return (
            <g key={e.id}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} className={clsx('hs-edge', inTree && 'tree', probe && 'probe')} />
              {showW && (
                <g transform={`translate(${(x1 + x2) / 2} ${(y1 + y2) / 2})`}>
                  <rect x={-11} y={-10} width={22} height={20} rx={10} className={clsx('hs-wbox', inTree && 'tree')} />
                  <text className="hs-w" textAnchor="middle" dominantBaseline="central">{e.w}</text>
                </g>
              )}
            </g>
          );
        })}
        {VERTS.map((v) => {
          const [x, y] = POS[v];
          const state = step.current === v ? 'current' : step.done.includes(v) ? 'done' : step.frontier.includes(v) ? 'frontier' : 'idle';
          const lab = step.labels[v];
          return (
            <g key={v} transform={`translate(${x} ${y})`} className={clsx('hs-v', state)} onClick={() => pick(v)} role="button" aria-label={`Começar de ${v}`} tabIndex={0} onKeyDown={(ev) => (ev.key === 'Enter' || ev.key === ' ') && pick(v)}>
              {state === 'current' && <circle r={27} className="hs-ring" />}
              <circle r={19} className="hs-disc" />
              <text textAnchor="middle" dominantBaseline="central" className="hs-name">{v}</text>
              {v === source && <text y={y > 200 ? 40 : -30} textAnchor="middle" className="hs-src">origem</text>}
              {lab !== undefined && (
                <g transform={`translate(0 ${y > 200 ? -34 : 34})`}>
                  <rect x={-15} y={-10} width={30} height={20} rx={4} className="hs-lab" />
                  <text textAnchor="middle" dominantBaseline="central" className="hs-labt">{lab}</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
      <div className="hs-foot">
        <p className="hs-cap" aria-live="polite">{step.caption}</p>
        <div className="hs-row">
          <span className="hs-aux"><b>{auxName}:</b> <code>{step.aux}</code></span>
          <div className="hs-ctl">
            <button aria-label="Passo anterior" onClick={() => { setPlaying(false); setI((n) => Math.max(0, n - 1)); }}><SkipBack size={15} /></button>
            <button aria-label={playing ? 'Pausar' : 'Tocar'} className="main" onClick={() => setPlaying((p) => !p)}>{playing ? <Pause size={15} /> : <Play size={15} />}</button>
            <button aria-label="Próximo passo" onClick={() => { setPlaying(false); setI((n) => Math.min(steps.length - 1, n + 1)); }}><SkipForward size={15} /></button>
            <span className="hs-count">{Math.min(i, steps.length - 1) + 1}/{steps.length}</span>
          </div>
        </div>
        <p className="hs-hint">Clique num vértice para o algoritmo começar dele.</p>
      </div>
    </div>
  );
}
