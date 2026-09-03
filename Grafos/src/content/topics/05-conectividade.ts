import type { Topic } from '../types';

export const conectividadeTopics: Topic[] = [
  {
    id: 'excentricidade-raio-diametro',
    moduleId: 'conectividade-caminhos',
    order: 1,
    slug: 'excentricidade-raio-diametro',
    title: 'Excentricidade, raio, diâmetro e centro',
    examLikelihood: 'medium',
    examEvidence: '2023/2-Q3 e 2024/1-Q4 usam o mesmo grafo explícito V={a..i} para pedir excentricidade/raio/diâmetro/centro; 2022/1-Q4 pede o algoritmo do diâmetro.',
    whatYouNeedToKnow:
      'Excentricidade ε(v) = maior distância (menor caminho) de v até qualquer outro vértice. Raio = menor excentricidade do grafo. Diâmetro = maior excentricidade do grafo. Centro = conjunto de vértices com excentricidade igual ao raio.',
    understand: [
      'Calcule via BFS a partir de CADA vértice: a maior distância obtida naquela BFS é a excentricidade daquele vértice.',
      'Raio ≤ Diâmetro ≤ 2·Raio (desigualdade útil para checar resultado).',
      'Algoritmo para o diâmetro: rode BFS a partir de todo vértice, tome a maior distância entre todas as BFS — O(V·(V+E)).',
      'Centro pode ter mais de um vértice — é o conjunto (não necessariamente único).',
    ],
    commonPitfall: 'Calcular a excentricidade olhando só os vizinhos diretos (confundir com grau) — excentricidade é sobre o grafo TODO, via caminho mínimo, não só adjacência direta.',
    sources: [{ type: 'professor_support_material', file: 'Resumo Prova 1 Grafos.pdf' }, { type: 'old_exam', file: '2023-2-exam.pdf' }],
  },
  {
    id: 'scc-kosaraju',
    moduleId: 'conectividade-caminhos',
    order: 2,
    slug: 'scc-kosaraju',
    title: 'Componentes fortemente conexos — Algoritmo de Kosaraju',
    examLikelihood: 'high',
    examEvidence: '2022/1-Q5 (20%) pede SCC diretamente sobre grafo de 13 vértices; tópico também na origem do conceito de base/anti-base.',
    whatYouNeedToKnow:
      'Um componente fortemente conexo (SCC) é um subconjunto maximal de vértices onde todo par é mutuamente alcançável. Algoritmo de Kosaraju: (1) DFS em G, registrando ordem decrescente de tempo de término; (2) transpõe G; (3) DFS no transposto, visitando vértices não visitados na ordem decrescente de término do passo 1 — cada árvore resultante é um SCC.',
    understand: [
      'A ordem de execução importa para bater com o professor: DFS em G PRIMEIRO (tempos de término), DEPOIS transpõe e faz DFS no transposto — essa é a ordem de Cormen, seguida pelo professor.',
      'Um grafo fortemente conexo tem exatamente 1 SCC (o grafo inteiro). Um DAG tem cada vértice como seu próprio SCC (nenhum ciclo).',
      'A condensação de um grafo (cada SCC virando um único vértice) é sempre um DAG — é a estrutura usada internamente para calcular base/anti-base.',
    ],
    commonPitfall: 'Fazer DFS no transposto na ordem "natural" dos vértices em vez da ordem decrescente de tempo de término calculada no passo 1 — sem essa ordem específica, o algoritmo não garante componentes corretos.',
    conceptConflict: {
      topic: 'Algoritmo de Kosaraju',
      hasRealDifference: true,
      professorDefinition: 'DFS em G (tempos de término) → transpõe → DFS no transposto na ordem decrescente de término.',
      professorSource: { type: 'professor_support_material', file: 'Resumo Prova 1 Grafos.pdf', note: 'Cita Sedgewick & Wayne, mas segue a ordem de Cormen' },
      alternatives: [
        { author: 'Cormen', text: 'Exatamente a mesma ordem: DFS em G primeiro, depois transposto.' },
        { author: 'Sedgewick', text: 'Ordem invertida: primeiro DFS no grafo REVERSO (pós-ordem), depois DFS no grafo ORIGINAL nessa ordem — mesmo resultado, passos trocados.' },
      ],
      differenceExplanation: 'Resultado final idêntico, mas a ordem dos passos (qual grafo recebe a primeira DFS) difere entre Cormen e Sedgewick — mesmo o aulão citando Sedgewick como fonte do nome do algoritmo, ele segue a ordem de Cormen na prática.',
      examGuidance: 'Siga a ordem do professor: DFS em G → transpõe → DFS no transposto, do maior para o menor tempo de término.',
    },
    sources: [{ type: 'professor_support_material', file: 'Resumo Prova 1 Grafos.pdf' }, { type: 'old_exam', file: '2022-1-exam.pdf' }],
  },
];

// Euleriano, Dijkstra e ordenação topológica/maior caminho em DAG apareciam
// aqui na Revisão 1 do escopo (inferida só por provas antigas). O cronograma
// oficial 2026/2 (Materiais/Cronograma) mostra que esses temas são dados
// DEPOIS da P1 (17/09 em diante — Prova 1 é 14/09), então saíram do escopo
// visível do app. Ver docs/p1-scope.md "O que mudou". As funções de
// algoritmo (eulerianClassification, dijkstra, topologicalSort...) continuam
// em src/lib/graph.ts para reaproveitar quando isso virar conteúdo de P2.
