import type { ExamId } from './types';

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
  /** Prova a que a família pertence; ausente = P1. */
  exam?: ExamId;
  /** Família da P1 que também caiu em provas de P2 (a P2 é cumulativa): onde caiu. */
  alsoP2?: string[];
  /** Cronograma 2026/2 põe o assunto DEPOIS da P1 — peso reduzido pela metade (ver docs/p1-scope.md). */
  scopeUncertain?: boolean;
  /** Definições (ids `def-*`) que a resposta correta usa — lidas das provas e das resoluções anexadas. Alimentam "conceitos que mais caem". */
  concepts: string[];
}

export const TOTAL_EXAMS = 8;

/** Provas antigas do Prof. Silvio analisadas: 8 da P1 e 9 da P2. */
export function totalExamsFor(exam: ExamId): number {
  return exam === 'P2' ? 9 : TOTAL_EXAMS;
}

export const examFamilies: ExamFamily[] = [
  {
    id: 'possibilidade-n-k',
    alsoP2: ['20xx(p.1)-Q1', '20xx(p.8)-Q1', '2024/1-Q7'],
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
    alsoP2: ['20xx(p.1)-Q2'],
    concepts: ['def-fecho-transitivo-direto', 'def-fecho-transitivo-inverso', 'def-grafo-transposto', 'def-base', 'def-anti-base', 'def-identificacao-de-base', 'def-grau-entrada-saida', 'def-busca-em-profundidade', 'def-matriz-de-adjacencia', 'def-contracao-de-aresta', 'def-kosaraju-scc'],
    title: 'Fecho transitivo direto/inverso; algoritmo para base e anti-base',
    appearances: ['2022/1-Q2', '2022/2-Q2', '2023/2-Q2', '2024/1-Q1'],
  },
  {
    id: 'ciclo-dfs-scc',
    alsoP2: ['2021/2-Q2', '20xx(p.1)-Q2', '20xx(p.6)-Q1', '20xx(p.7)-Q1', '2024/1-Q3', '2024/2-Q4', '2025/1-Q3'],
    concepts: ['def-busca-em-profundidade', 'def-estados-dfs-ciclo', 'def-aresta-de-retorno', 'def-aresta-de-arvore', 'def-aresta-de-avanco', 'def-aresta-de-cruzamento', 'def-kosaraju-scc', 'def-grafo-transposto', 'def-cycle', 'def-lista-de-adjacencia', 'def-base'],
    title: 'Detectar ciclo em grafo dirigido (DFS 0/1/2), ordem de visita, componentes fortemente conexos',
    appearances: ['2022/1-Q5', '2022/2-Q3', '2024/2-Q3', '2026/1-Q4'],
  },
  {
    id: 'auto-complementar',
    alsoP2: ['2021/2-Q1', '20xx(p.8)-Q1'],
    concepts: ['def-grafo-complementar', 'def-auto-complementar', 'def-isomorfismo', 'def-grafo-completo', 'def-cycle', 'def-path'],
    title: 'Complemento e grafo auto-complementar (exemplos, |E| = n(n−1)/4, n = 4k ou 4k+1)',
    appearances: ['2022/2-Q4', '2023/1-Q3', '2023/2-Q1', '2025/1-Q2'],
  },
  {
    id: 'excentricidade',
    alsoP2: ['20xx(p.1)-Q3', '2024/2-Q1', '2025/1-Q1'],
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
    alsoP2: ['2024/1-Q1'],
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
    alsoP2: ['20xx(p.6)-Q3', '20xx(p.8)-Q4', '2024/2-Q2'],
    concepts: ['def-cycle', 'def-grafo-direcionado', 'def-estados-dfs-ciclo', 'def-busca-em-profundidade', 'def-grau-entrada-saida'],
    title: 'DAG: maior caminho, ordenação topológica, agendamento (serialização, casa)',
    appearances: ['2024/2-Q4', '2025/1-Q5', '2026/1-Q3'],
    scopeUncertain: true,
  },
  {
    id: 'euleriano',
    concepts: ['def-trail', 'def-grau', 'def-teorema-grau-impar', 'def-grafo-conexo', 'def-caminho-aberto-fechado'],
    title: 'Caminho/circuito euleriano (detetive, "projete uma solução para encontrar um circuito euleriano")',
    // Caiu em provas de P1 do Prof. Silvio quando vinha antes da P1; em 2026/2 é P2.
    exam: 'P2',
    appearances: ['P1 2023/2-Q4', 'P1 2026/1-Q2', '20xx(p.8)-Q3', '2024/1-Q5'],
  },

  // --- P2: 9 provas do Prof. Silvio em Materiais/Provas/Prova2 (mais 1 do Prof.
  // Zenilton). "20xx(p.N)" = prova sem data na página N de 20xx-x-exam.pdf.
  {
    id: 'p2-prim-forcado',
    exam: 'P2',
    concepts: ['def-prim', 'def-propriedade-corte', 'def-agm'],
    title: 'Prim com aresta(s) obrigatória(s) e floresta geradora mínima',
    appearances: ['2024/2-Q3', '2025/1-Q4', '2026/1-Q3'],
  },
  {
    id: 'p2-caminho-restrito',
    exam: 'P2',
    concepts: ['def-dijkstra', 'def-comprimento-caminho'],
    title: 'Projetar caminho com restrição: alternado, λ-crescimento, capacidade máxima',
    appearances: ['2025/1-Q2', '20xx(p.6)-Q4', '20xx(p.7)-Q4', '20xx(p.8)-Q2'],
  },
  {
    id: 'p2-linha',
    exam: 'P2',
    concepts: ['def-grafo-de-linha', 'def-caminho-euleriano', 'def-circuito-euleriano', 'def-caminho-hamiltoniano'],
    title: 'Grafo de linha com euleriano e hamiltoniano',
    appearances: ['2026/1-Q1'],
  },
  {
    id: 'p2-agm',
    exam: 'P2',
    concepts: ['def-agm', 'def-prim', 'def-kruskal', 'def-arvore-geradora'],
    title: 'Modelar com AGM (rodovias, redes) e executar Prim/Kruskal',
    appearances: ['2021/2-Q3', '20xx(p.7)-Q2', '2024/1-Q4', '2024/1-Q6', '2024/1-Q8', '2024/1-Q10', '2024/1-Q12', '2024/1-Q13', '2026/1-Q2'],
  },
  {
    id: 'p2-caminho-negativo',
    exam: 'P2',
    concepts: ['def-bellman-ford', 'def-ciclo-negativo', 'def-comprimento-caminho'],
    title: 'Caminhos mínimos com pesos negativos a partir de uma origem (tamanho e arestas)',
    appearances: ['Zenilton 2024/1-Q2'],
  },
  {
    id: 'p2-dijkstra',
    exam: 'P2',
    concepts: ['def-dijkstra', 'def-mapa-lx', 'def-comprimento-caminho'],
    title: 'Dijkstra à mão: ordem de S, distâncias e caminhos (exercícios do slide 10)',
    appearances: ['2021/2-Q3', '20xx(p.7)-Q2', '2024/1-Q15'],
  },
  {
    id: 'p2-floyd',
    exam: 'P2',
    concepts: [],
    title: 'Todos os pares: matrizes D(k) do Floyd-Warshall (pelo livro)',
    appearances: [],
  },
  {
    id: 'p2-hamilton',
    exam: 'P2',
    concepts: ['def-caminho-hamiltoniano', 'def-caminho-euleriano'],
    title: 'Euler × Hamilton: definição e dificuldade algorítmica',
    appearances: ['2024/1-Q5'],
  },
  {
    id: 'p2-arvores',
    exam: 'P2',
    concepts: ['def-arvore', 'def-floresta', 'def-arvore-geradora', 'def-ramo-corda', 'def-posto-nulidade'],
    title: 'Árvores, florestas, árvore geradora: contagens, posto e nulidade',
    appearances: ['2024/1-Q9'],
  },
  {
    id: 'p2-cortes',
    exam: 'P2',
    concepts: ['def-cut-s', 'def-propriedade-corte', 'def-propriedade-ciclo', 'def-conectividade-arestas-vertices'],
    title: 'Cortes, conectividade e propriedades do corte e do ciclo',
    appearances: ['2024/1-Q10', '2024/1-Q14'],
  },
  {
    id: 'p2-inducao',
    exam: 'P2',
    concepts: [],
    title: 'Demonstração por indução',
    appearances: [],
  },
];

export function getExamFamily(id: string): ExamFamily | undefined {
  return examFamilies.find((f) => f.id === id);
}

/** Peso de sorteio: nº de provas em que caiu; metade se o cronograma põe o assunto depois da P1. */
/** Provas distintas numa lista como "2024/1-Q4" (várias questões da mesma prova contam uma vez). */
function examsOf(appearances: string[]): Set<string> {
  return new Set(appearances.map((a) => a.split('-Q')[0]));
}

/** Onde a família caiu nas provas de `exam`. */
export function appearancesFor(f: ExamFamily, exam: ExamId): string[] {
  return exam === 'P2' && f.exam !== 'P2' ? (f.alsoP2 ?? []) : f.appearances;
}

export function examFamilyWeight(f: ExamFamily, exam: ExamId = f.exam ?? 'P1'): number {
  // P2: toda família entra no sorteio (peso 1) e ganha +1 por prova em que caiu.
  if (exam === 'P2') return 1 + examsOf(appearancesFor(f, 'P2')).size;
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

export function examFamiliesFor(exam: ExamId): ExamFamily[] {
  return examFamilies.filter((f) => (f.exam ?? 'P1') === exam || (exam === 'P2' && (f.alsoP2?.length ?? 0) > 0));
}
