import type { Topic } from '../types';

export const representacoesTopics: Topic[] = [
  {
    id: 'matriz-adjacencia',
    moduleId: 'representacoes',
    order: 1,
    slug: 'matriz-adjacencia',
    title: 'Matriz de adjacência',
    examLikelihood: 'high',
    examEvidence: 'Grafo dado por matriz de adjacência é o ponto de partida de 2022/1-Q2, 2022/2-Q2 e do exercício 14 da lista oficial.',
    whatYouNeedToKnow:
      'Matriz A de dimensão n×n. A[i][j] = número de arestas de i para j (1 se existe aresta simples, 0 se não). Grafo não-dirigido ⇒ matriz simétrica. Grafo dirigido ⇒ pode ser assimétrica. Diagonal representa laços.',
    understand: [
      'Linha i, soma dos valores = grau de saída d⁺(i) em grafo dirigido, ou grau d(i) em não-dirigido.',
      'Coluna j, soma dos valores = grau de entrada d⁻(j) em grafo dirigido.',
      'Matriz simétrica com 0/1 e diagonal zero sempre representa um grafo simples não-dirigido válido — qualquer matriz assim é "legal".',
      'Custo: O(n²) de espaço, O(1) para checar se existe aresta entre dois vértices específicos — mas O(n) para listar vizinhos de um vértice.',
    ],
    commonPitfall: 'Esquecer de duplicar a entrada (A[i][j] e A[j][i]) ao montar a matriz de um grafo não-dirigido a partir de um desenho.',
    sources: [{ type: 'professor_slide', file: '04-graphs-data-structures.pdf' }],
  },
  {
    id: 'matriz-incidencia',
    moduleId: 'representacoes',
    order: 2,
    slug: 'matriz-incidencia',
    title: 'Matriz de incidência',
    examLikelihood: 'medium',
    examEvidence: 'Convenção +1/-1/0 é conteúdo de slide dedicado; usada em provas do Prof. Zenilton com frequência, e mencionada no exercício 14 da lista oficial.',
    whatYouNeedToKnow:
      'Matriz M de dimensão n×m (n vértices, m arestas). Convenção do professor para grafo dirigido: +1 na linha do vértice de origem, −1 na linha do vértice de destino, 0 nas demais linhas daquela coluna. Grafo não-dirigido: 1 nas duas linhas dos extremos, 0 nas demais.',
    understand: [
      'Cada coluna representa exatamente uma aresta — soma dos valores absolutos da coluna é sempre 2 (ou o valor especial de um laço).',
      'Laço: convenção do professor usa valor 2 na linha do vértice (única linha não-nula daquela coluna).',
      'Diferente da matriz de adjacência: aqui as colunas são arestas, não vértices — a matriz não é quadrada em geral (é n×m).',
    ],
    commonPitfall: 'Trocar o sinal — lembrar que é ORIGEM=+1, DESTINO=−1 (não o contrário) na convenção do professor.',
    conceptConflict: {
      topic: 'Matriz de incidência',
      hasRealDifference: false,
      professorDefinition: 'Convenção +1 (origem) / −1 (destino) / 0, para grafos dirigidos.',
      professorSource: { type: 'professor_slide', file: '04-graphs-data-structures.pdf' },
      alternatives: [
        { author: 'West (Introduction to Graph Theory)', text: 'Mesma convenção +1 (cauda) / −1 (cabeça) para digrafos.' },
        { author: 'Cormen', text: 'Matriz de incidência aparece só como exercício, sem detalhar convenção de sinal.' },
      ],
      examGuidance: 'Sem divergência real — a convenção do professor bate exatamente com West. Use +1 na origem, −1 no destino.',
    },
    sources: [{ type: 'professor_slide', file: '04-graphs-data-structures.pdf' }],
  },
  {
    id: 'lista-adjacencia',
    moduleId: 'representacoes',
    order: 3,
    slug: 'lista-adjacencia',
    title: 'Lista de adjacência (sucessores e predecessores)',
    examLikelihood: 'high',
    examEvidence: 'Grafo dado por lista de sucessores é o ponto de partida de 2022/1-Q5, 2022/2-Q3 (DFS) e 2023/1-Q5 (BFS).',
    whatYouNeedToKnow:
      'Para cada vértice v, guarda-se a lista de vértices adjacentes (sucessores, em grafo dirigido) e opcionalmente predecessores. Mais eficiente em espaço que matriz para grafos esparsos: O(V+E) em vez de O(V²).',
    understand: [
      'Sucessores de v (grafo dirigido): vértices u tais que existe aresta (v,u).',
      'Predecessores de v: vértices u tais que existe aresta (u,v). Em não-dirigido, sucessores = predecessores = vizinhos.',
      'Ordem alfabética/de inserção nos vizinhos importa para BFS/DFS — as provas do professor costumam pedir "prioridade alfabética" explicitamente ao simular a busca.',
    ],
    commonPitfall: 'Ao reconstruir o grafo a partir de uma lista de sucessores, esquecer que uma aresta (a→b) NÃO implica (b→a) — só reconstrua arestas na direção informada.',
    sources: [{ type: 'professor_slide', file: '04-graphs-data-structures.pdf' }],
  },
];
