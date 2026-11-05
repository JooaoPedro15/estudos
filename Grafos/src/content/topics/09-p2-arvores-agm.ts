import type { ConceptConflict, Topic } from '../types';

// Árvores, árvores geradoras, cortes e AGM (aulas de 21/09 a 28/09).
// Fonte principal: 11-graphs-trees-spanning-trees.pdf (quadros 3 a 29 de 29)
// e, para corte/conectividade, 09-graphs-connectivity.pdf (quadros 16 a 20).

const TR = '11-graphs-trees-spanning-trees.pdf';
const CN = '09-graphs-connectivity.pdf';

const nullityConflict: ConceptConflict = {
  topic: 'Nulidade de uma árvore/floresta geradora',
  hasRealDifference: true,
  professorDefinition:
    'O slide escreve: "A nullity is the number of chords related to the spanning trees (or spanning forest) which is given by μ = e − n − k".',
  professorSource: { type: 'professor_slide', file: TR, page: 35, note: 'Spanning trees — rank e nullity, quadro 11 de 29' },
  alternatives: [
    {
      author: 'O próprio exemplo do slide (mesmo quadro)',
      text: 'O grafo desenhado tem n = 8 vértices, e = 9 arestas, k = 1 e mostra 2 cordas em vermelho (f–e e a–g). e − n − k = 0, mas e − n + k = 2, que bate com o desenho.',
    },
    {
      author: 'As definições do próprio slide',
      text: 'Cordas são as arestas que não são ramos; ramos são r = n − k. Então cordas = e − r = e − (n − k) = e − n + k.',
    },
  ],
  differenceExplanation:
    'A fórmula impressa e o exemplo do mesmo slide não concordam. Pelas definições do slide (corda = aresta que não é ramo, r = n − k), o número de cordas é e − n + k. Isto é interpretação a partir do slide, não fala do professor: o sinal de k parece ter saído trocado.',
  examGuidance: 'Na prova, use μ = e − n + k e, se der, justifique por "cordas = e − ramos = e − (n − k)". Vale confirmar com o professor.',
};

export const arvoresAgmTopics: Topic[] = [
  {
    id: 'arvores',
    moduleId: 'p2-arvores-agm',
    order: 1,
    slug: 'arvores',
    title: 'Árvores e florestas',
    examLikelihood: 'medium',
    examEvidence: 'Aula de 23/09 (Árvores / Árvores geradoras / AGM). Teoremas de contagem costumam ser usados em justificativas.',
    whatYouNeedToKnow:
      'Árvore: grafo não direcionado, conexo e sem ciclos. Floresta: grafo sem ciclos em que cada componente conexo é uma árvore. Toda árvore com n ≥ 1 vértices tem exatamente n − 1 arestas; uma floresta com n vértices e k árvores tem n − k arestas.',
    understand: [
      'Árvore = conexo + sem ciclos (quadro 3). Se falta conexidade, é floresta. Teorema (quadro 4): numa árvore existe exatamente um caminho entre qualquer par de vértices.',
      'Folha = vértice de grau 1 (às vezes os de grau 0 também contam); vértice interno = grau maior que 1. Teorema: toda árvore com pelo menos dois vértices tem pelo menos duas folhas.',
      'Contagem (quadros 5 e 8): toda árvore com n ≥ 1 vértices tem n − 1 arestas; recíproca: um grafo conexo com n vértices e n − 1 arestas é árvore; floresta com n vértices e k árvores tem n − k arestas. Lema: remover uma aresta de um ciclo mantém a conexidade.',
    ],
    commonPitfall: 'Achar que n − 1 arestas basta para ser árvore. A recíproca do slide exige CONEXO com n − 1 arestas.',
    sources: [
      { type: 'professor_slide', file: TR, page: 3, note: 'Trees — quadro 3 de 29' },
      { type: 'professor_slide', file: TR, page: 9, note: 'All trees on n ≥ 1 vertices have exactly n − 1 edges — quadro 5 de 29' },
      { type: 'professor_slide', file: TR, page: 24, note: 'Converse theorem / forest — quadro 8 de 29' },
    ],
  },
  {
    id: 'arvore-geradora',
    moduleId: 'p2-arvores-agm',
    order: 2,
    slug: 'arvore-geradora',
    title: 'Árvore geradora, ramos, cordas, posto e nulidade',
    examLikelihood: 'medium',
    examEvidence: 'Aula de 23/09. Base da AGM.',
    whatYouNeedToKnow:
      'Árvore geradora de um grafo não direcionado: subgrafo que é árvore e contém TODOS os vértices. G tem árvore geradora se e somente se é conexo. Ramo = aresta da árvore geradora; corda = aresta de G que não é ramo. Posto r = n − k (número de ramos).',
    understand: [
      'Definição e teorema (quadros 6–7): G tem árvore geradora ⟺ G é conexo. Ida: os caminhos da árvore geradora também estão em G. Volta: construímos a árvore.',
      'Construção do slide (quadro 7): enquanto houver ciclo, escolha um e remova qualquer aresta dele; repita até não sobrar ciclo. O resultado continua conexo (lema) e não tem ciclo, logo é árvore e alcança todos os vértices. No exemplo: remove a–g do ciclo a–c–g–a e a–e do ciclo a–f–e–a.',
      'Ramo (branch) = aresta de T; corda (chord) = aresta de G fora de T. Floresta geradora: coleção de árvores geradoras, uma por componente, quando G é desconexo (quadro 10).',
      'Posto r = n − k (ramos) e nulidade = número de cordas (quadro 11). O slide imprime μ = e − n − k, mas o exemplo do próprio slide só fecha com e − n + k — ver o conflito abaixo.',
    ],
    commonPitfall: 'Confundir "árvore geradora" (todos os vértices) com qualquer subárvore. Sem todos os vértices, não é geradora.',
    conceptConflict: nullityConflict,
    sources: [
      { type: 'professor_slide', file: TR, page: 13, note: 'Spanning trees — quadros 6-7 de 29' },
      { type: 'professor_slide', file: TR, page: 27, note: 'Branch e chord — quadro 9 de 29' },
      { type: 'professor_slide', file: TR, page: 35, note: 'Rank e nullity — quadro 11 de 29' },
    ],
  },
  {
    id: 'cortes',
    moduleId: 'p2-arvores-agm',
    order: 3,
    slug: 'cortes',
    title: 'Cortes, conectividade e as propriedades do corte e do ciclo',
    examLikelihood: 'medium',
    examEvidence: 'Aula de 21/09 ("Corte / Caminhos mínimos"). É a base da justificativa de por que Prim e Kruskal estão certos.',
    whatYouNeedToKnow:
      'Corte: conjunto de arestas cuja remoção desconecta o grafo. Para S ⊂ V (não vazio, diferente de V), cut(S) = arestas (v, w) com v ∈ S e w ∈ V − S. Propriedade do corte: com custos distintos, a aresta mais barata de cut(S) está em toda AGM. Propriedade do ciclo: a aresta mais cara de um ciclo não está em nenhuma AGM.',
    understand: [
      'Corte (09, quadro 16; 11, quadro 18): conjunto de arestas cuja remoção desconecta o grafo em dois ou mais componentes. Todo S ⊂ V tem um corte associado, cut(S); apagar cut(S) separa S de V − S.',
      'Conectividade (09, quadros 17–18): conectividade de arestas λ(G) = menor nº de arestas cuja remoção desconecta; conectividade de vértices κ(G) = menor nº de vértices. Grafo K-conexo: κ = K. Grafo separável: κ = 1, e o vértice que desconecta é o ponto de articulação. Vale κ(G) ≤ λ(G) ≤ δ(G), onde δ é o menor grau.',
      'Propriedade do corte (quadros 20–21): supondo custos distintos, seja e a aresta mais barata de cut(S); toda AGM contém e (prova por troca). O conjunto F das arestas que satisfazem essa propriedade é conexo, sem ciclo, com n − 1 arestas: F é a AGM única, e Prim e Kruskal calculam F.',
      'Propriedade do ciclo (quadro 24): seja e a aresta mais cara de um ciclo C; e não pertence a nenhuma AGM (prova por troca). Comentário do quadro 26: qualquer algoritmo que inclua arestas pela propriedade do corte e exclua pela do ciclo dá uma AGM; com pesos repetidos, perturbe cada peso por um valor infinitesimal.',
    ],
    commonPitfall: 'Achar que a aresta mais barata do GRAFO inteiro decide tudo. A propriedade vale para a mais barata de um CORTE cut(S) — a cada S muda o conjunto que se compara.',
    sources: [
      { type: 'professor_slide', file: CN, page: 72, note: 'Graph Cuts — quadro 16 de 20' },
      { type: 'professor_slide', file: CN, page: 80, note: 'Connectivity and separability — quadros 17-18 de 20' },
      { type: 'professor_slide', file: TR, page: 69, note: 'Cut Property — quadros 20-21 de 29' },
      { type: 'professor_slide', file: TR, page: 79, note: 'Cycle Property — quadro 24 de 29' },
    ],
  },
  {
    id: 'agm-prim-kruskal',
    moduleId: 'p2-arvores-agm',
    order: 4,
    slug: 'agm-prim-kruskal',
    title: 'Árvore geradora mínima — Prim, Kruskal e Reverse-Delete',
    examLikelihood: 'high',
    examEvidence:
      'Nas provas de P2 do Prof. Silvio: Kruskal, Prim e Dijkstra numa matriz (2021/2-Q3 e 20xx p.7-Q2), unicidade da AGM (2026/1-Q2, 2024/1) e Prim com aresta obrigatória nas 3 provas mais recentes com data (2024/2-Q3, 2025/1-Q4, 2026/1-Q3). A do Prof. Zenilton (2024/1-Q1) pediu modelar rodovias.',
    whatYouNeedToKnow:
      'AGM: dado G não direcionado com custo c_e > 0 em cada aresta, achar T ⊆ E tal que (V, T) seja conexo e a soma dos custos seja a menor possível — a solução é uma árvore. Três algoritmos gulosos funcionam: Kruskal (arestas em ordem crescente, descarta a que cria ciclo), Prim (cresce a partir de um vértice pela aresta mais barata do corte) e Reverse-Delete (ordem decrescente, apaga a aresta se o grafo continuar conexo).',
    understand: [
      'Problema (quadro 13): INSTANCE grafo não direcionado e c: E → R+; SOLUTION T ⊆ E com (V, T) conexo e Σ c_e mínima. Afirmação: a solução de custo mínimo é uma árvore.',
      'Prim (quadros 14 e 23), "Dijkstra-like": comece num vértice s, S = {s}, U = ∅. A cada passo, adicione a S o vértice v e a U a aresta e de menor custo entre as que ligam S a V − S (min c_e, e ∈ cut(S)). Pare quando S = V.',
      'Kruskal (quadros 14 e 22): comece com T vazio; processe as arestas em ordem não decrescente de custo; adicione e a T só se não criar ciclo, senão descarte.',
      'Reverse-Delete (quadros 14 e 25): comece com E′ = E; processe as arestas em ordem não crescente de custo; apague e de E′ só se (V, E′) continuar conexo. "Which of these algorithms works? All of them!"',
      'Exemplo dos quadros 16–17 (mesmo grafo para Prim e Kruskal, a pergunta é o peso da AGM): calculando com o algoritmo, o peso é 39. Modelagem como na P2 2024/1-Q1: cidades = vértices, rodovia possível = aresta não direcionada, custo de construção = peso; aplicar Prim ou Kruskal.',
    ],
    commonPitfall: 'Em Kruskal, esquecer de descartar a aresta que fecha ciclo. Em Prim, escolher a aresta mais barata do grafo em vez da mais barata que sai da árvore atual.',
    sources: [
      { type: 'professor_slide', file: TR, page: 38, note: 'Minimum Spanning Tree — quadro 13 de 29' },
      { type: 'professor_slide', file: TR, page: 41, note: 'Greedy Algorithm for the MST Problem — quadro 14 de 29' },
      { type: 'professor_slide', file: TR, page: 51, note: "Example of Prim's / Kruskal's Algorithm — quadros 16-17 de 29" },
      { type: 'professor_slide', file: TR, page: 75, note: 'Optimality of Kruskal / Prim / Reverse-Delete — quadros 22, 23 e 25 de 29' },
      { type: 'old_exam', file: 'P2 - 1º 2024 - parte 1.jpeg', note: 'Q1 — rodovias entre cidades (Prof. Zenilton)' },
    ],
  },
  {
    id: 'steiner',
    moduleId: 'p2-arvores-agm',
    order: 5,
    slug: 'steiner',
    title: 'Árvore de Steiner',
    examLikelihood: 'low',
    examEvidence: 'Está no fim do slide 11 (quadros 28–29), mas o cronograma não cita Steiner pelo nome. Prioridade baixa.',
    whatYouNeedToKnow:
      'Dado G = (V, E) conexo e não direcionado e um conjunto T ⊆ V, a árvore de Steiner é a árvore H = (V′, E′) de tamanho mínimo, subgrafo de G, com T ⊆ V′. Os vértices de T são terminais; os de V′ \\ T são pontos de Steiner.',
    understand: [
      'Definição (quadro 28): árvore mínima que contém todos os terminais T, podendo usar outros vértices (pontos de Steiner). Pergunta do slide: uma árvore geradora T′ de G é uma árvore de Steiner?',
      '"Tamanho mínimo" pode ser medido de vários jeitos (quadro 29): cardinalidade de vértices (|S| = |V′ \\ T|, o padrão), cardinalidade de arestas (|E′| = |V′| − 1), peso nos vértices (minimizar w(S)) ou peso nas arestas (minimizar w(E′)).',
    ],
    commonPitfall: 'Achar que precisa cobrir todos os vértices como a árvore geradora — Steiner só precisa cobrir os terminais.',
    sources: [{ type: 'professor_slide', file: TR, page: 86, note: 'Steiner Tree — quadros 28-29 de 29' }],
  },
];
