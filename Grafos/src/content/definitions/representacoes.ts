import { def, slide } from './builder';

// Definições literais de 04-graphs-data-structures.pdf ("N de 9").
const S = (page: number, title: string) => slide('04-graphs-data-structures.pdf', page, title);

export const representacoesDefinitions = [
  def({
    id: 'matriz-de-incidencia',
    topic: 'matriz-incidencia',
    concept: 'matriz de incidência nó-arco',
    definition:
      'Seja um grafo G = (V, A) em que |V| = n e |A| = m. Uma matriz de incidência A(n × m) nó-arco é representada por: uma linha para cada nó; uma coluna para cada aresta. Para uma aresta a = (i, j) ∈ A, a coluna de a recebe +1 na linha do nó i (origem), −1 na linha do nó j (destino) e 0 nas demais.',
    keyPoints: ['Dimensão n × m (n nós, m arestas)', 'Uma LINHA para cada nó', 'Uma COLUNA para cada aresta', 'Coluna de (i, j): +1 na origem i, −1 no destino j, 0 no resto'],
    intuition:
      'Tabela "quem toca quem": cada coluna é uma aresta contando de onde sai (+1) e onde chega (−1). Cada coluna soma zero. Grande (n × m) e cheia de zeros — por isso quase ninguém usa na prática, mas cai na prova como exercício de reconstrução.',
    breakdown: [
      '"nó-arco" — o nome do professor para a matriz vértice × aresta.',
      '+1 / −1 — só faz sentido em grafo direcionado; em não-direcionado usa-se 1 nas duas pontas.',
    ],
    example: 'Slide 3: a1 = (1, 2) → coluna a1 = [+1, −1, 0, 0]ᵀ.',
    source: S(3, 'Matriz de incidência nó-arco'),
  }),
  def({
    id: 'matriz-de-adjacencia',
    topic: 'matriz-adjacencia',
    concept: 'matriz de adjacência',
    definition:
      'Seja um grafo G = (V, A) em que |V| = n e |A| = m. Uma matriz de adjacência A(n × n) é representada por: uma linha para cada nó; uma coluna para cada nó; aij = 1 se (i, j) ∈ A, e aij = 0 se (i, j) ∉ A.',
    keyPoints: ['Dimensão n × n (nó × nó)', 'Uma linha E uma coluna para cada nó', 'aij = 1 se existe aresta (i, j); 0 caso contrário'],
    intuition:
      'Tabela de "quem é vizinho de quem": linha i, coluna j marcada com 1 se i liga em j. Em grafo não direcionado a tabela é espelhada (simétrica); em direcionado, não. Somar uma linha dá o grau de saída; somar uma coluna, o grau de entrada.',
    example: 'Slide 5: 4 nós, arestas 1→2, 1→3, 2→3, 2→4, 3→4 → linha 1 = [0 1 1 0].',
    note: 'Pergunta de prova (2023/1-Q4): "matriz simétrica só de 0/1 com diagonal 0 pode representar grafo simples?" — sim: simétrica = não direcionado, diagonal 0 = sem laço, 0/1 = sem paralelas.',
    source: S(5, 'Matriz de adjacência'),
  }),
  def({
    id: 'lista-de-adjacencia',
    topic: 'lista-adjacencia',
    concept: 'lista de adjacência',
    definition:
      'Seja um grafo G = (V, A) em que |V| = n e |A| = m. Uma lista de adjacência é representada por uma lista de nós (ou vértices) em que cada nó aponta para a lista de seus sucessores (ou nós adjacentes). n vértices + m arestas = m + n elementos na lista.',
    keyPoints: ['Lista de nós (vértices)', 'Cada nó aponta para a lista de seus SUCESSORES (adjacentes)', 'Tamanho total: n + m elementos'],
    intuition:
      'Agenda de contatos: cada pessoa tem sua própria listinha de quem ela liga. Ocupa só o que existe (n + m), diferente da matriz que reserva n² casas mesmo vazias. É a representação que BFS e DFS percorrem.',
    example: 'Slide 7: 1 → [2, 3]; 2 → [3, 4]; 3 → [4]; 4 → [ ].',
    source: S(7, 'Lista de adjacência'),
  }),
  def({
    id: 'lista-de-predecessores',
    topic: 'lista-adjacencia',
    concept: 'lista de predecessores',
    prompt: 'O que diferencia a lista de PREDECESSORES da lista de sucessores (slide 7)?',
    definition:
      'O slide 7 mostra as duas variantes lado a lado: SUCESSORES — cada nó aponta para os nós que ele alcança por uma aresta (i → j); PREDECESSORES — cada nó aponta para os nós que chegam nele (j ← i). A lista de predecessores é a lista de sucessores do grafo transposto.',
    keyPoints: ['Sucessores: quem o nó ALCANÇA (arestas saindo)', 'Predecessores: quem CHEGA no nó (arestas entrando)', 'Predecessores de G = sucessores do transposto'],
    intuition:
      'Sucessores = "quem eu sigo"; predecessores = "quem me segue". Mesmo grafo, duas agendas diferentes. Útil para fecho transitivo inverso e anti-base sem precisar transpor o grafo na mão.',
    example: 'Slide 7: sucessores 1 → [2, 3]; predecessores 3 → [1, 2].',
    note: 'O slide traz a tabela PREDECESSORES como figura, sem frase de definição — a redação acima é leitura da figura.',
    sourceStyle: 'generated',
    source: S(7, 'Lista de adjacência'),
  }),
];
