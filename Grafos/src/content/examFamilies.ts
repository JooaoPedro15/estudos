/**
 * Famílias de questão que se repetem nas provas antigas do Prof. Silvio
 * (8 provas: 2022/1 … 2026/1 — ver docs/exam-pattern.md). Cada questão do
 * banco pode apontar para uma família via `examFamily`; o "Treino de prova"
 * sorteia a FAMÍLIA proporcionalmente ao nº de provas em que caiu e só
 * depois uma questão dentro dela — assim uma família com muitas variantes
 * não domina o sorteio por ter mais questões.
 */
export interface ExamFamily {
  id: string;
  title: string;
  /** Provas em que caiu, no formato "semestre-Questão" (ex.: "2022/1-Q1"). */
  appearances: string[];
  /** Cronograma 2026/2 põe o assunto DEPOIS da P1 — peso reduzido pela metade (ver docs/p1-scope.md). */
  scopeUncertain?: boolean;
  /** Definições (ids `def-*`) que a resposta correta usa — lidas das provas e das resoluções anexadas. Alimentam "conceitos que mais caem". */
  concepts: string[];
}

export const TOTAL_EXAMS = 8;

export const examFamilies: ExamFamily[] = [
  {
    id: 'possibilidade-n-k',
    concepts: ['def-teorema-minimo-arestas', 'def-teorema-maximo-arestas', 'def-propriedade-de-grau', 'def-grafo-conexo', 'def-grafo-regular', 'def-grafo-simples', 'def-grafo-completo', 'def-teorema-grau-impar', 'def-vertice-isolado', 'def-grafo-nulo'],
    title: 'n vértices, k componentes: é possível X arestas / soma de graus Y / ser regular / virar conexo?',
    appearances: ['2022/1-Q1', '2022/2-Q1', '2023/1-Q2', '2023/2-Q1', '2025/1-Q1'],
  },
  {
    id: 'pombos',
    concepts: ['def-grafo-simples', 'def-grau', 'def-vertice-isolado', 'def-grafo-completo', 'def-vertices-adjacentes', 'def-sequencia-de-graus'],
    title: 'Prove que todo grafo simples com ≥ 2 vértices tem dois vértices de mesmo grau',
    appearances: ['2024/1-Q3', '2024/2-Q1', '2025/1-Q4', '2026/1-Q1'],
  },
  {
    id: 'subgrafos-kn',
    concepts: ['def-subgrafo', 'def-propriedades-de-subgrafo', 'def-grafo-completo', 'def-conjunto-potencia'],
    title: 'Número de subgrafos de um grafo completo Kn',
    appearances: ['2022/2-Q5', '2024/1-Q2', '2024/2-Q2', '2026/1-Q1'],
  },
  {
    id: 'fecho-base-antibase',
    concepts: ['def-fecho-transitivo-direto', 'def-fecho-transitivo-inverso', 'def-grafo-transposto', 'def-base', 'def-anti-base', 'def-identificacao-de-base', 'def-grau-entrada-saida', 'def-busca-em-profundidade', 'def-matriz-de-adjacencia', 'def-contracao-de-aresta', 'def-kosaraju-scc'],
    title: 'Fecho transitivo direto/inverso; algoritmo para base e anti-base',
    appearances: ['2022/1-Q2', '2022/2-Q2', '2023/2-Q2', '2024/1-Q1'],
  },
  {
    id: 'ciclo-dfs-scc',
    concepts: ['def-busca-em-profundidade', 'def-estados-dfs-ciclo', 'def-aresta-de-retorno', 'def-aresta-de-arvore', 'def-aresta-de-avanco', 'def-aresta-de-cruzamento', 'def-kosaraju-scc', 'def-grafo-transposto', 'def-cycle', 'def-lista-de-adjacencia', 'def-base'],
    title: 'Detectar ciclo em grafo dirigido (DFS 0/1/2), ordem de visita, componentes fortemente conexos',
    appearances: ['2022/1-Q5', '2022/2-Q3', '2024/2-Q3', '2026/1-Q4'],
  },
  {
    id: 'auto-complementar',
    concepts: ['def-grafo-complementar', 'def-auto-complementar', 'def-isomorfismo', 'def-grafo-completo', 'def-cycle', 'def-path'],
    title: 'Complemento e grafo auto-complementar (exemplos, |E| = n(n−1)/4, n = 4k ou 4k+1)',
    appearances: ['2022/2-Q4', '2023/1-Q3', '2023/2-Q1', '2025/1-Q2'],
  },
  {
    id: 'excentricidade',
    concepts: ['def-excentricidade', 'def-raio', 'def-diametro', 'def-centro', 'def-busca-em-largura', 'def-path', 'def-grafo-conexo'],
    title: 'Excentricidade, raio, diâmetro e centro (grafo V = {a…i}) e algoritmo do diâmetro',
    appearances: ['2022/1-Q4', '2023/2-Q3', '2024/1-Q4'],
  },
  {
    id: 'bipartido-tripartido',
    concepts: ['def-grafo-bipartido', 'def-bipartido-completo', 'def-tripartido-completo', 'def-propriedade-de-grau', 'def-grafo-completo'],
    title: 'Bipartido: m ≤ n²/4; tripartido completo Kr,s,t (desenho, |V|, |E|)',
    appearances: ['2023/1-Q1', '2025/1-Q3'],
  },
  {
    id: 'limites-grau-arestas',
    concepts: ['def-grafo-completo', 'def-grafo-regular', 'def-sequencia-de-graus', 'def-propriedade-de-grau', 'def-teorema-grau-impar', 'def-grafo-simples'],
    title: 'm ≤ n(n−1)/2; grafo regular com n = 15 e grau 3?; sequência de graus é gráfica?',
    appearances: ['2023/1-Q1'],
  },
  {
    id: 'matriz-adjacencia',
    concepts: ['def-matriz-de-adjacencia', 'def-grafo-simples', 'def-laco', 'def-arestas-paralelas', 'def-grau', 'def-grau-entrada-saida', 'def-grafo-nao-direcionado'],
    title: 'Matriz simétrica 0/1 é de grafo simples?; o que é a soma de uma coluna?',
    appearances: ['2023/1-Q4'],
  },
  {
    id: 'bfs-distancias',
    concepts: ['def-busca-em-largura', 'def-path', 'def-grafo-conexo', 'def-lista-de-adjacencia'],
    title: 'Algoritmo para a distância (nº de arestas) de v a todos os outros vértices (BFS)',
    appearances: ['2023/1-Q5'],
  },
  {
    id: 'isomorfismo-dirigido',
    concepts: ['def-isomorfismo', 'def-condicoes-necessarias-isomorfismo', 'def-grafo-direcionado', 'def-grafo-nao-direcionado', 'def-funcao-bijetora'],
    title: 'Transpor a definição de isomorfismo para grafos direcionados + exemplo',
    appearances: ['2022/1-Q3'],
  },
  {
    id: 'topologica-dag',
    concepts: ['def-cycle', 'def-grafo-direcionado', 'def-estados-dfs-ciclo', 'def-busca-em-profundidade', 'def-grau-entrada-saida'],
    title: 'DAG: maior caminho, ordenação topológica, agendamento (serialização, casa)',
    appearances: ['2024/2-Q4', '2025/1-Q5', '2026/1-Q3'],
    scopeUncertain: true,
  },
  {
    id: 'euleriano',
    concepts: ['def-trail', 'def-grau', 'def-teorema-grau-impar', 'def-grafo-conexo', 'def-caminho-aberto-fechado'],
    title: 'Caminho/circuito euleriano (detetive, "projete uma solução para encontrar um circuito euleriano")',
    appearances: ['2023/2-Q4', '2026/1-Q2'],
    scopeUncertain: true,
  },
];

export function getExamFamily(id: string): ExamFamily | undefined {
  return examFamilies.find((f) => f.id === id);
}

/** Peso de sorteio: nº de provas em que caiu; metade se o cronograma põe o assunto depois da P1. */
export function examFamilyWeight(f: ExamFamily): number {
  return f.appearances.length * (f.scopeUncertain ? 0.5 : 1);
}

/** Peso de "quanto cai" de cada definição: soma dos pesos das famílias que a usam. Só definições usadas em alguma prova aparecem. */
export function conceptExamWeights(): Map<string, number> {
  const m = new Map<string, number>();
  for (const f of examFamilies) {
    const w = examFamilyWeight(f);
    for (const c of f.concepts) m.set(c, (m.get(c) ?? 0) + w);
  }
  return m;
}

/** Famílias de prova em que uma definição é usada, da mais frequente para a menos. */
export function familiesUsingConcept(definitionId: string): ExamFamily[] {
  return examFamilies.filter((f) => f.concepts.includes(definitionId)).sort((a, b) => examFamilyWeight(b) - examFamilyWeight(a));
}
