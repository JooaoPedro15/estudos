// Roteiro da Prova 2 (página "Estudo P2"). A ordem vem da frequência nas 9 provas
// de P2 do Prof. Silvio; é prioridade de estudo, não previsão do que vai cair.

export const P2_DATE = '2026-11-11';

export interface PlanLink {
  label: string;
  href: string;
}

export interface PlanDay {
  date: string; // aaaa-mm-dd
  weekday: string;
  title: string;
  why: string;
  /** [id do módulo, id do tópico] */
  topics: [string, string][];
  practice: PlanLink[];
}

export const P2_PLAN: PlanDay[] = [
  {
    date: '2026-11-05',
    weekday: 'Qui',
    title: 'Árvores, AGM, Kruskal e Prim',
    why: 'Caem em 4 provas, inclusive executando na matriz. É a base do resto da semana.',
    topics: [['p2-arvores-agm', 'arvores'], ['p2-arvores-agm', 'agm-prim-kruskal'], ['p2-arvores-agm', 'cortes']],
    practice: [{ label: 'Treinar AGM', href: '/estudar/prova?familia=p2-agm' }, { label: 'Prova 2021/2', href: '/simulado/prova-silvio-2021-2' }],
  },
  {
    date: '2026-11-06',
    weekday: 'Sex',
    title: 'Prim com aresta obrigatória e AGM única',
    why: 'Caiu nas 3 provas mais recentes com data. Em 2026/1, valeu 55% junto com a unicidade.',
    topics: [['p2-arvores-agm', 'agm-prim-kruskal'], ['p2-arvores-agm', 'arvore-geradora']],
    practice: [{ label: 'Treinar Prim obrigatório', href: '/estudar/prova?familia=p2-prim-forcado' }, { label: 'Prova 2025/1', href: '/simulado/prova-silvio-2025-1' }],
  },
  {
    date: '2026-11-07',
    weekday: 'Sáb',
    title: 'Euler, Hamilton e grafo de linha',
    why: 'A última matéria dada. A questão de grafo de linha valeu 45% da prova mais recente.',
    topics: [['p2-euler-hamilton', 'euleriano'], ['p2-euler-hamilton', 'hamiltoniano'], ['p2-euler-hamilton', 'grafo-de-linha']],
    practice: [{ label: 'Treinar grafo de linha', href: '/estudar/prova?familia=p2-linha' }, { label: 'Prova 2026/1', href: '/simulado/prova-silvio-2026-1' }],
  },
  {
    date: '2026-11-08',
    weekday: 'Dom',
    title: 'Dijkstra, Max-Min e caminhos com restrição',
    why: 'Caminho com restrição caiu em 4 provas, sempre pedindo para adaptar o Dijkstra. Bellman-Ford e Johnson por último: nenhuma prova do Silvio cobra.',
    topics: [['p2-caminhos-minimos', 'dijkstra'], ['p2-caminhos-minimos', 'max-min'], ['p2-caminhos-minimos', 'bellman-ford'], ['p2-caminhos-minimos', 'johnson']],
    practice: [{ label: 'Treinar caminho com restrição', href: '/estudar/prova?familia=p2-caminho-restrito' }, { label: 'Prova sem data (B)', href: '/simulado/prova-silvio-20xx-p6' }],
  },
  {
    date: '2026-11-09',
    weekday: 'Seg',
    title: 'Revisão da P1: conectividade, SCC, diâmetro',
    why: 'A prova é cumulativa. SCC e ciclo caíram em 7 das 9 provas.',
    topics: [['p2-conectividade', 'conectividade-direcionada'], ['conectividade-caminhos', 'scc-kosaraju'], ['conectividade-caminhos', 'excentricidade-raio-diametro'], ['p2-caminhos-minimos', 'caminho-critico']],
    practice: [{ label: 'Treinar SCC e ciclo', href: '/estudar/prova?familia=ciclo-dfs-scc' }, { label: 'Prova sem data (A)', href: '/simulado/prova-silvio-20xx-p1' }],
  },
  {
    date: '2026-11-10',
    weekday: 'Ter',
    title: 'Prova cronometrada e só o que errou',
    why: 'Treina escrever e justificar no tempo: em 2026/1, responder só V ou F anula a questão.',
    topics: [],
    practice: [
      { label: 'Simulado: o que mais se repete', href: '/simulado/simulado-p2-b' },
      { label: 'Prova 2024/2', href: '/simulado/prova-silvio-2024-2' },
      { label: 'Meus pontos fracos', href: '/estudar/pontos-fracos' },
    ],
  },
];

/** Dias inteiros até a prova, na data local (0 = é hoje). */
export function daysUntilP2(now: Date = new Date()): number {
  const [y, m, d] = P2_DATE.split('-').map(Number);
  const target = new Date(y, m - 1, d).getTime();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.round((target - today) / 86_400_000);
}

export function localIsoDate(now: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
