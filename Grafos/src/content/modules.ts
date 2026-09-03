import type { Module } from './types';

export const modules: Module[] = [
  {
    id: 'fundamentos',
    order: 1,
    title: 'Fundamentos de Grafos',
    shortTitle: 'Fundamentos',
    description: 'Definições, terminologia, grau, teorema do aperto de mãos e famílias especiais de grafos.',
    icon: 'graph',
    topicIds: ['definicao-terminologia', 'passeios-caminhos-ciclos', 'aperto-de-maos-familias'],
  },
  {
    id: 'representacoes',
    order: 2,
    title: 'Representações de Grafos',
    shortTitle: 'Representações',
    description: 'Matriz de adjacência, matriz de incidência e lista de adjacência — e como elas se relacionam.',
    icon: 'matrix',
    topicIds: ['matriz-adjacencia', 'matriz-incidencia', 'lista-adjacencia'],
  },
  {
    id: 'isomorfismo-propriedades',
    order: 3,
    title: 'Isomorfismo & Propriedades',
    shortTitle: 'Isomorfismo',
    description: 'Isomorfismo, complemento, subgrafos e os teoremas de contagem mais cobrados na P1.',
    icon: 'shuffle',
    topicIds: ['isomorfismo', 'complemento-subgrafo', 'teoremas-contagem'],
  },
  {
    id: 'busca-alcancabilidade',
    order: 4,
    title: 'Busca e Alcançabilidade',
    shortTitle: 'Busca',
    description: 'BFS, DFS, classificação de arestas, fecho transitivo, base/anti-base e detecção de ciclo.',
    icon: 'search',
    topicIds: ['bfs', 'dfs-classificacao', 'fecho-transitivo', 'base-antibase', 'deteccao-ciclo'],
  },
  {
    id: 'conectividade-caminhos',
    order: 5,
    title: 'Conectividade e Caminhos Especiais',
    shortTitle: 'Conectividade',
    description: 'Excentricidade/raio/diâmetro/centro, SCC (Kosaraju), e — com ressalva de escopo (ver cada tópico) — euleriano, Dijkstra e ordenação topológica.',
    icon: 'route',
    topicIds: ['excentricidade-raio-diametro', 'scc-kosaraju', 'euleriano', 'dijkstra', 'topologica-maior-caminho'],
  },
  {
    id: 'logica-conjuntos',
    order: 6,
    title: 'Lógica e Teoria dos Conjuntos',
    shortTitle: 'Lógica & Conjuntos',
    description: 'Conjuntos e funções, lógica proposicional e lógica de predicados — dadas nos dias imediatamente antes da P1, conforme o cronograma.',
    icon: 'logic',
    topicIds: ['teoria-de-conjuntos', 'logica-proposicional', 'logica-de-predicados'],
  },
];

export function getModule(id: string): Module | undefined {
  return modules.find((m) => m.id === id);
}
