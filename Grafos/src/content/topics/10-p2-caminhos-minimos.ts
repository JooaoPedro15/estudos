import type { Topic } from '../types';

// Caminhos mínimos (aulas de 21/09 e 30/09 a 19/10). Fonte principal:
// 10-graphs-shortest-path.pdf (quadros 6 a 26 de 26) e, para caminho sem peso,
// 08-graphs-traversing.pdf (quadros 15 a 20). Floyd-Warshall NÃO tem slide:
// vem do Cormen, etiquetado como livro em cada afirmação.

const SP = '10-graphs-shortest-path.pdf';
const TV = '08-graphs-traversing.pdf';
const CORMEN = 'Cormen et al., Algoritmos: teoria e prática (ed. PT)';

export const caminhosMinimosTopics: Topic[] = [
  {
    id: 'caminho-minimo-conceitos',
    moduleId: 'p2-caminhos-minimos',
    order: 1,
    slug: 'caminho-minimo-conceitos',
    title: 'O problema do caminho mínimo',
    examLikelihood: 'medium',
    examEvidence: 'Base de todas as questões de caminho mínimo. A P2 2024/1 (Q2) pede "os caminhos mínimos (tamanho e suas arestas) a partir do vértice 1 para todos os demais".',
    whatYouNeedToKnow:
      'Dado um grafo direcionado com comprimento ℓ_e em cada aresta, o comprimento de um caminho é a soma dos comprimentos das suas arestas. O objetivo é achar o caminho mais curto de uma origem s até cada vértice. Grafo não direcionado: troque cada aresta por duas arestas direcionadas. Lx(y) = comprimento do menor caminho de x a y, ou ∞ se não existe caminho.',
    understand: [
      'Problema (10, quadro 6): G = (V, E) direcionado e conexo, cada aresta com comprimento ℓ_e ≥ 0; n vértices, m arestas. Comprimento de um caminho = soma dos comprimentos das arestas. Não direcionado → cada aresta vira duas direcionadas. O comprimento pode significar custo, distância, combustível, pedágio (08, quadros 16–18).',
      'Mapa Lx (quadros 7–8): Lx(y) = comprimento do menor caminho de x a y, se existir; ∞ caso contrário. No exemplo do slide, Lx0 = (0, 3, ∞, 7, 5, 6, 8) para x0…x6 — x2 não é alcançável a partir de x0.',
      'Os quatro problemas do quadro 10: (1) menor caminho e seu comprimento entre x e y; (2) Lx(y) para todo y, a partir de uma origem x; (3) o comprimento do menor caminho para TODO par x, y; (4) resolvido o problema 2, resolve-se o 1. Dijkstra e Bellman-Ford resolvem o 2; o 3 é o de todos os pares.',
      'Sem pesos (08, quadros 15 e 20): a busca em largura encontra o caminho mais curto entre u e v, e o caminho fica guardado no vetor antecessor. Distância entre dois vértices = número de arestas do menor caminho.',
    ],
    commonPitfall: 'Esquecer o ∞ para vértice inalcançável, ou responder só o comprimento quando a questão pede o caminho (as arestas).',
    sources: [
      { type: 'professor_slide', file: SP, page: 8, note: 'Shortest Path Problem — quadro 6 de 26' },
      { type: 'professor_slide', file: SP, page: 10, note: 'Shortest paths / the map Lx — quadros 7-8 de 26' },
      { type: 'professor_slide', file: SP, page: 20, note: 'Problems — quadro 10 de 26' },
      { type: 'professor_slide', file: TV, page: 75, note: 'Caminho mais curto (BFS) — quadro 15 de 33' },
    ],
  },
  {
    id: 'dijkstra',
    moduleId: 'p2-caminhos-minimos',
    order: 2,
    slug: 'dijkstra',
    title: 'Menor caminho — Algoritmo de Dijkstra',
    examLikelihood: 'high',
    examEvidence: 'Três aulas no cronograma (30/09, 01/10, 05/10). O slide propõe exercícios "execute by hand" (quadros 11 e 26).',
    whatYouNeedToKnow:
      'Para comprimentos não negativos. Mantém o conjunto S dos vértices explorados, cuja distância d(u) já é definitiva. Começa com d[s] = 0 e S = {s}. A cada passo, escolhe o v fora de S que minimiza d′(v) = min{d[u] + W(u, v) : u ∈ S}, coloca v em S e fixa d[v] = d′(v). Para ter o caminho, guarde o predecessor u que deu o mínimo.',
    understand: [
      'Atualização (quadro 11): depois de extrair y* (o de menor Lx fora de S), para cada vizinho y de y* fora de S faça Lx[y] := min{Lx[y], Lx[y*] + ℓ(y*, y)}. É a mesma conta de d′(v) = min{d[u] + W(e) : e = (u, v), u ∈ S} do quadro 15.',
      'Pesos negativos (quadro 18): "Algorithm cannot handle negative edge lengths". O quadro 22 mostra o Dijkstra falhando com uma aresta −6, e somar uma constante a todos os pesos também falha. Para isso existe o Bellman-Ford.',
      'Custo (quadros 19–20): o laço roda n − 1 vezes. Ao colocar v em S, só os vizinhos de v podem mudar de d. Com fila de prioridade: ExtractMin escolhe o próximo, ChangeKey atualiza um vizinho — ExtractMin é chamado n − 1 vezes e ChangeKey m vezes.',
      'Caminhos (quadros 15 e 18): para obter os caminhos, registre o predecessor u que minimiza d(v); reconstrua do destino até s pelos predecessores e inverta. "Union of shortest paths output form a tree".',
      'Duas versões no slide, mesma ideia: com Lx e o conjunto S̄ dos não explorados (quadro 11: enquanto k < n e λ ≠ ∞, extrai y* de S̄ com menor Lx) e com S explorados e d[·] (quadro 15). Exemplo do quadro 16, a partir de a: d(b) = 1, d(c) = 1, d(e) = 2, d(d) = 3, d(f) = 4.',
      'Exercício do quadro 26: "Compute the shortest path from e to all other nodes!" — a partir de e: f = 5, g = 8, a = 9, b = 13, h = 14, c = 17, d = 25 (calculado com o algoritmo).',
    ],
    commonPitfall: 'Entregar só as distâncias quando a questão pede o caminho. Outro: aplicar Dijkstra com peso negativo.',
    sources: [
      { type: 'professor_slide', file: SP, page: 21, note: 'Dijkstra algorithm (versão Lx) — quadro 11 de 26' },
      { type: 'professor_slide', file: SP, page: 33, note: "Dijkstra's Algorithm (versão S, d) — quadro 15 de 26" },
      { type: 'professor_slide', file: SP, page: 39, note: "Example of Dijkstra's Algorithm — quadro 16 de 26" },
      { type: 'professor_slide', file: SP, page: 48, note: 'Comments / Implementing — quadros 18-20 de 26' },
      { type: 'professor_slide', file: SP, page: 72, note: 'Shortest path — an example, quadro 26 de 26' },
    ],
  },
  {
    id: 'bellman-ford',
    moduleId: 'p2-caminhos-minimos',
    order: 3,
    slug: 'bellman-ford',
    title: 'Pesos negativos — Algoritmo de Bellman-Ford',
    examLikelihood: 'high',
    examEvidence: 'Duas aulas no cronograma (07 e 08/10). A P2 2024/1 (Q2, 20%) deu uma matriz com pesos negativos e pediu os caminhos mínimos a partir do vértice 1.',
    whatYouNeedToKnow:
      'Resolve o caminho mínimo de origem única quando há pesos negativos, desde que não haja ciclo de custo negativo. Tabela d[i, v] = comprimento do menor caminho de s a v usando no máximo i arestas. d[0, s] = 0, demais ∞. Para i = 1 até n − 1: d[i, v] = d[i − 1, v] e, para cada aresta (w, v), d[i, v] = min{d[i, v], d[i − 1, w] + c_wv}. Custo O(mn).',
    understand: [
      'Por que outro algoritmo (quadros 21–22): agora os pesos podem ser negativos. O Dijkstra pode falhar com aresta negativa, e somar uma constante a todos os pesos para eliminá-los também falha (muda qual caminho é o menor).',
      'Ciclo negativo (quadro 23): se algum caminho de s a t passa por um ciclo de custo negativo, não existe menor caminho s–t; caso contrário, existe um que é simples. Bellman-Ford serve para pesos negativos "but no negative cycles".',
      'Recorrência (quadro 24): OPT(i, v) = menor caminho usando no máximo i arestas. Caso 1: usa no máximo i − 1 arestas → OPT(i − 1, v). Caso 2: usa exatamente i arestas → a última escolha é uma aresta e o resto usa i − 1. OPT(i, v) = 0 se i = 0 (na origem); senão min{OPT(i − 1, v), min[OPT(i − 1, w) + c_wv]}. Atenção: o slide escreve "v–t path", mas o algoritmo do quadro 25 calcula a partir da origem s.',
      'Algoritmo (quadro 25): linha 0 com d[0, s] = 0 e ∞ no resto; para i = 1..n − 1, copie a linha anterior e relaxe cada aresta (w, v) usando os valores da linha i − 1. Custo computacional O(mn).',
      'Caminhos e ciclo negativo: "for finding the shortest paths, it is necessary to maintain a successor for each table entry" (quadro 25). O slide termina com "How to detect negative cycles?" sem responder. Uma resposta do livro (não do slide): rodar mais uma rodada; se ainda melhorar algum valor, há ciclo negativo alcançável.',
    ],
    commonPitfall: 'Na tabela, usar um valor da MESMA linha i em vez da linha i − 1. Pela forma do slide, cada linha só olha a anterior.',
    sources: [
      { type: 'professor_slide', file: SP, page: 57, note: 'Single Source Shortest Path Problem (pesos negativos) — quadro 21 de 26' },
      { type: 'professor_slide', file: SP, page: 59, note: 'Bellman-Ford Algorithm — quadros 22-24 de 26' },
      { type: 'professor_slide', file: SP, page: 68, note: 'Bellman-Ford (algoritmo, O(mn)) — quadro 25 de 26' },
      { type: 'old_exam', file: 'P2 - 1º 2024 - parte 1.jpeg', note: 'Q2 — matriz D com pesos negativos (Prof. Zenilton)' },
      { type: 'book', author: CORMEN, chapter: '24.1 (detecção de ciclo negativo)' },
    ],
  },
  {
    id: 'floyd-warshall',
    moduleId: 'p2-caminhos-minimos',
    order: 4,
    slug: 'floyd-warshall',
    title: 'Todos os pares — Algoritmo de Floyd-Warshall',
    examLikelihood: 'medium',
    examEvidence: 'Duas aulas no cronograma (15 e 19/10), mas NENHUM slide sobre o algoritmo foi fornecido. Todo o conteúdo abaixo é do Cormen, exceto a menção ao problema 3 do slide 10.',
    scopeNote:
      'Sem slide do professor. A única base de Nível 1 é o problema 3 do slide 10 ("para cada par x, y, o menor caminho"). O algoritmo, a notação d(k)ij e a complexidade vêm do Cormen, seção 25.2. Se o professor soltar slide ou se tiver foto do quadro dessas aulas, ela passa a valer acima do livro, inclusive a notação.',
    whatYouNeedToKnow:
      'Livro (Cormen 25.2): calcula o menor caminho entre TODOS os pares. d(k)ij = peso do menor caminho de i a j cujos vértices intermediários estão todos em {1, …, k}. D(0) é a matriz de pesos (0 na diagonal, ∞ sem aresta) e d(k)ij = min(d(k−1)ij, d(k−1)ik + d(k−1)kj). Aceita arestas negativas, desde que não haja ciclo negativo. Tempo Θ(n³).',
    understand: [
      'Problema (slide 10, quadro 10, problema 3): para cada par x, y de vértices, o comprimento do menor caminho de x a y. É o que o Floyd-Warshall resolve de uma vez, em vez de rodar Dijkstra ou Bellman-Ford a partir de cada origem.',
      'Ideia (Cormen 25.2, livro): olhar os vértices intermediários. Para o par (i, j) e o vértice k: ou o melhor caminho não passa por k — fica d(k−1)ij — ou passa por k uma vez e se divide em i → k e k → j, cada parte só com intermediários em {1, …, k − 1}.',
      'Execução (Cormen 25.2, livro): monte D(0) com os pesos; para k = 1, …, n, calcule D(k) a partir de D(k−1) testando "passar por k" em cada célula. D(n) tem todas as distâncias. Três laços aninhados sobre n: Θ(n³).',
      'Caminho e casos especiais (Cormen 25.2, livro): guarde a matriz de predecessores Π e reconstrua o caminho de trás para frente. Pesos negativos são permitidos sem ciclo negativo. Como detectar ciclo negativo pela saída fica como pergunta no exercício 25.2-6, sem resposta no texto; o app avisa quando a diagonal de D(n) fica negativa (o caminho de um vértice até ele mesmo ficaria abaixo de 0).',
    ],
    commonPitfall: 'Trocar a ordem dos laços e colocar k por dentro — k (o vértice intermediário liberado) tem que ser o laço de FORA.',
    sources: [
      { type: 'professor_slide', file: SP, page: 20, note: 'Problems — problema 3 (todos os pares), quadro 10 de 26' },
      { type: 'book', author: CORMEN, chapter: '25.2 — O algoritmo de Floyd-Warshall' },
    ],
  },
];
