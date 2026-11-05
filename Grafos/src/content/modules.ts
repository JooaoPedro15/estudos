import type { ExamId, Module } from './types';

export const modules: Module[] = [
  {
    id: 'fundamentos',
    exam: 'P1',
    alsoIn: ['P2'],
    order: 1,
    title: 'Fundamentos de Grafos',
    shortTitle: 'Fundamentos',
    description: 'Definições, terminologia, grau, teorema do aperto de mãos e famílias especiais de grafos.',
    icon: 'graph',
    topicIds: ['definicao-terminologia', 'passeios-caminhos-ciclos', 'aperto-de-maos-familias'],
  },
  {
    id: 'representacoes',
    exam: 'P1',
    alsoIn: ['P2'],
    order: 2,
    title: 'Representações de Grafos',
    shortTitle: 'Representações',
    description: 'Matriz de adjacência, matriz de incidência e lista de adjacência — e como elas se relacionam.',
    icon: 'matrix',
    topicIds: ['matriz-adjacencia', 'matriz-incidencia', 'lista-adjacencia'],
  },
  {
    id: 'isomorfismo-propriedades',
    exam: 'P1',
    alsoIn: ['P2'],
    order: 3,
    title: 'Isomorfismo & Propriedades',
    shortTitle: 'Isomorfismo',
    description: 'Isomorfismo, complemento, subgrafos e os teoremas de contagem mais cobrados na P1.',
    icon: 'shuffle',
    topicIds: ['isomorfismo', 'complemento-subgrafo', 'teoremas-contagem'],
  },
  {
    id: 'busca-alcancabilidade',
    exam: 'P1',
    alsoIn: ['P2'],
    order: 4,
    title: 'Busca e Alcançabilidade',
    shortTitle: 'Busca',
    description: 'BFS, DFS, classificação de arestas, fecho transitivo, base/anti-base e detecção de ciclo.',
    icon: 'search',
    topicIds: ['bfs', 'dfs-classificacao', 'fecho-transitivo', 'base-antibase', 'deteccao-ciclo'],
  },
  {
    id: 'conectividade-caminhos',
    exam: 'P1',
    alsoIn: ['P2'],
    order: 5,
    title: 'Conectividade e Caminhos Especiais',
    shortTitle: 'Conectividade',
    description: 'Excentricidade/raio/diâmetro/centro, SCC (Kosaraju) e — com ressalva de escopo — ordenação topológica.',
    icon: 'route',
    topicIds: ['excentricidade-raio-diametro', 'scc-kosaraju', 'topologica-maior-caminho'],
  },
  {
    id: 'logica-conjuntos',
    exam: 'P1',
    order: 6,
    title: 'Lógica e Teoria dos Conjuntos',
    shortTitle: 'Lógica & Conjuntos',
    description: 'Conjuntos e funções, lógica proposicional e lógica de predicados — dadas nos dias imediatamente antes da P1, conforme o cronograma.',
    icon: 'logic',
    topicIds: ['teoria-de-conjuntos', 'logica-proposicional', 'logica-de-predicados'],
  },
  // --- P2 (cronograma 2026/2: aulas de 16/09 a 19/10, prova em 22/10) ---
  {
    id: 'p2-inducao',
    exam: 'P2',
    order: 5,
    title: 'Indução',
    shortTitle: 'Indução',
    description: 'Prova por indução: base, hipótese e passo — e como os slides a usam para provar o Dijkstra.',
    icon: 'logic',
    topicIds: ['inducao'],
  },
  {
    id: 'p2-euler-hamilton',
    exam: 'P2',
    order: 2,
    title: 'Euler, Hamilton e Grafo de Linha',
    shortTitle: 'Euler & Hamilton',
    description: 'Caminho e circuito euleriano, pontes, Fleury, caminho hamiltoniano e grafo de linha L(G).',
    icon: 'route',
    topicIds: ['euleriano', 'hamiltoniano', 'grafo-de-linha'],
  },
  {
    id: 'p2-arvores-agm',
    exam: 'P2',
    order: 1,
    title: 'Árvores, Cortes e AGM',
    shortTitle: 'Árvores & AGM',
    description: 'Árvores e florestas, árvore geradora (ramos, cordas, posto), cortes e conectividade, Prim, Kruskal e Reverse-Delete.',
    icon: 'graph',
    topicIds: ['arvores', 'arvore-geradora', 'cortes', 'agm-prim-kruskal', 'steiner'],
  },
  {
    id: 'p2-caminhos-minimos',
    exam: 'P2',
    order: 3,
    title: 'Caminhos Mínimos',
    shortTitle: 'Caminhos mínimos',
    description: 'Dijkstra, Bellman-Ford, Max-Min/Min-Max, caminho crítico, Johnson e, pelo livro, Floyd-Warshall.',
    icon: 'route',
    topicIds: ['caminho-minimo-conceitos', 'dijkstra', 'bellman-ford', 'max-min', 'caminho-critico', 'johnson', 'floyd-warshall'],
  },
  {
    id: 'p2-conectividade',
    exam: 'P2',
    order: 4,
    title: 'Conectividade em Grafos Direcionados',
    shortTitle: 'Conectividade',
    description: 'Fracamente, semi-fortemente e fortemente conexo: o que é cada um e como identificar.',
    icon: 'search',
    topicIds: ['conectividade-direcionada'],
  },
];

export function modulesForExam(exam: ExamId): Module[] {
  // Matéria nova da prova primeiro; depois a revisão que vem de outras provas.
  return [...modules.filter((m) => m.exam === exam).sort((a, b) => a.order - b.order), ...modules.filter((m) => m.alsoIn?.includes(exam))];
}

export function topicIdsForExam(exam: ExamId): string[] {
  return modulesForExam(exam).flatMap((m) => m.topicIds);
}

export function getModule(id: string): Module | undefined {
  return modules.find((m) => m.id === id);
}
