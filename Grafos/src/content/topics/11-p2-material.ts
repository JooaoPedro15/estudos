import type { Source, Topic } from '../types';

// Tópicos cobrados no material de aluna que o usuário pediu para tratar como
// "o jeito que o professor gosta": Resumo Prova 2 Grafos.pdf (lista de matéria,
// p. 2), Aulão II De Grafos .pdf e as resoluções em provas2_antigas_treino.pdf.

const RESUMO = (page: number, note: string): Source => ({ type: 'professor_support_material', file: 'Resumo Prova 2 Grafos.pdf', page, note });
const AULAO = (page: number, note: string): Source => ({ type: 'professor_support_material', file: 'Aulão II De Grafos .pdf', page, note });
const TREINO = (page: number, note: string): Source => ({ type: 'professor_support_material', file: 'provas2_antigas_treino.pdf', page, note });

export const materialTopics: Topic[] = [
  {
    id: 'conectividade-direcionada',
    moduleId: 'p2-conectividade',
    order: 1,
    slug: 'conectividade-direcionada',
    title: 'Conectividade em grafos direcionados',
    examLikelihood: 'high',
    examEvidence: 'Caiu como "discorra sobre conectividade em grafos direcionados, apresente todos os tipos e como identificá-los" em 2021/2-Q2 e nas provas sem data das p. 6 e 7. É o primeiro item da lista de matéria do resumo.',
    whatYouNeedToKnow:
      'Três tipos. Fracamente conexo: existe caminho entre quaisquer dois vértices ignorando a direção das arestas. Semi-fortemente conexo: para qualquer par (u, v), existe caminho de u para v OU de v para u. Fortemente conexo: existe caminho nos dois sentidos para qualquer par.',
    understand: [
      'Os três tipos, do mais fraco ao mais forte: todo fortemente conexo é semi-fortemente conexo, e todo semi-fortemente conexo é fracamente conexo.',
      'Identificar fracamente conexo (resumo, p. 3): crie o grafo subjacente S, com as arestas de G tratadas como não direcionadas; faça uma busca em profundidade a partir de um vértice qualquer; se todos forem visitados, G é fracamente conexo.',
      'Identificar semi-fortemente conexo: para cada par de vértices, verifique se um alcança o outro. Na resolução da aluna, ela lista os pares um a um; o trecho "busca a partir de um vértice" está riscado, porque uma busca só não basta.',
      'Identificar fortemente conexo (resumo, p. 3): (1) DFS em G marcando início e término; (2) gere o transposto T; (3) DFS em T na ordem não crescente dos tempos de término; (4) se todo o grafo for visitado em uma única DFS em T, G é fortemente conexo. É o Kosaraju; cada DFS em T dá um componente fortemente conexo.',
    ],
    commonPitfall: 'No semi-fortemente conexo, testar só as arestas diretas: vale caminho, não só aresta. Outro erro: confundir com o caso forte, que exige os DOIS sentidos.',
    conceptConflict: {
      topic: 'Nome do tipo mais fraco',
      hasRealDifference: false,
      professorDefinition: 'O slide do professor usa: desconexo, simplesmente conexo (s-conexo), semi-fortemente conexo (sf-conexo) e fortemente conexo (f-conexo).',
      professorSource: { type: 'professor_slide', file: '09-graphs-connectivity.pdf', page: 22, note: 'Conectividade em grafos direcionados — quadros 5-7 de 20' },
      alternatives: [{ author: 'Resumo e resolução da aluna', text: 'Chamam o mesmo tipo de "fracamente conexo": caminho entre quaisquer dois vértices ignorando a direção.' }],
      differenceExplanation: 'É o mesmo conceito com dois nomes: o slide fala em "cadeia", que ignora a direção; o resumo fala em ignorar a direção das arestas.',
      examGuidance: 'Na prova, escreva "fracamente conexo (s-conexo)" para deixar claro que conhece os dois nomes.',
    },
    sources: [RESUMO(3, 'Conectividade em Grafos Direcionados'), TREINO(10, 'Resolução da Q1(a) da prova da p. 9'), { type: 'professor_slide', file: '09-graphs-connectivity.pdf', page: 19 }],
  },
  {
    id: 'max-min',
    moduleId: 'p2-caminhos-minimos',
    order: 5,
    slug: 'max-min',
    title: 'Max-Min e Min-Max (caminho de capacidade máxima)',
    examLikelihood: 'high',
    examEvidence: 'Capacidade máxima caiu nas provas sem data das p. 6 e 7 (Q4, 30%). No resumo, aparece como "Algoritmos de Fluxo" com pseudocódigo próprio e o "Algoritmo Widest Path".',
    whatYouNeedToKnow:
      'Max-Min é o maior dos menores: o caminho que maximiza a aresta de menor peso (a capacidade). Min-Max é o menor dos maiores: o caminho que minimiza a aresta de maior peso. Os dois são adaptações do Dijkstra: muda a conta da atualização e qual vértice sai da fila.',
    understand: [
      'Caso do cano (aulão, p. 5): um cano de vazão 3 ligado a um de vazão 10 só deixa passar 3. A capacidade de um caminho é sua MENOR aresta. Max-Min quer o caminho em que esse gargalo é o maior possível.',
      'Max-Min / Widest Path (resumo, p. 8 e 10): valores = +∞ na origem e −∞ nos demais. Enquanto houver vértice na fila, extraia o de MAIOR valor; para cada vizinho v: menor_custo = min(valores[u], W(u, v)); se menor_custo > valores[v], atualize. Em uma linha: W[u] = max(min(W[w], l(w, u)), W[u]).',
      'Min-Max (resumo, p. 8): o contrário. Origem com −∞ e demais com +∞; extraia o de MENOR valor; atualize com max(valores[u], W(u, v)) quando for menor. No exemplo do resumo, a resposta é 7.',
      'Atenção à definição: o texto digitado do resumo troca as frases ("Min-Max maximiza o fluxo"). As anotações à mão e os pseudocódigos dizem Max-Min = "maior dos menores" e Min-Max = "menor dos maiores", e é isso que os exemplos calculam.',
    ],
    commonPitfall: 'Somar os pesos como no Dijkstra normal. Aqui a capacidade de um caminho é um mínimo (ou um máximo), nunca uma soma.',
    sources: [RESUMO(8, 'Algoritmos de Fluxo: Min-Max e Max-Min'), RESUMO(10, 'Algoritmo Widest Path'), AULAO(5, 'Caso do cano'), TREINO(16, 'Resolução da Q4 da prova da p. 9')],
  },
  {
    id: 'johnson',
    moduleId: 'p2-caminhos-minimos',
    order: 6,
    slug: 'johnson',
    title: 'Algoritmo de Johnson (todos os pares)',
    examLikelihood: 'medium',
    examEvidence: 'Está na lista de matéria do resumo (com Floyd-Warshall riscado) e no aulão ("n para n → Johnson"). Nenhuma das 9 provas cobra diretamente.',
    whatYouNeedToKnow:
      'Técnica para o menor caminho de n para n vértices, mesmo com pesos negativos: usa o Bellman-Ford para ajustar os pesos até nenhum ser negativo e depois roda o Dijkstra a partir de cada vértice.',
    understand: [
      'Passos 1 a 3 (resumo, p. 13): adicione um vértice novo s com aresta de peso 0 para todo v; rode o Bellman-Ford a partir de s para obter d[v]; se ele encontrar ciclo negativo, o algoritmo se encerra.',
      'Passo 4: ajuste cada aresta com peso′(u, v) = peso(u, v) + d[u] − d[v]. Essa troca garante pesos não negativos, e aí o Dijkstra pode ser usado.',
      'Passos 5 e 6: rode o Dijkstra a partir de cada v do novo grafo e desfaça o ajuste com d[u, v] = d′[u, v] − d[u] + d[v].',
    ],
    commonPitfall: 'Esquecer de desfazer o ajuste no fim: os valores do Dijkstra são do grafo com pesos trocados, não do original.',
    sources: [RESUMO(13, 'Algoritmo de Johnson'), AULAO(3, 'n p/ n → Johnson')],
  },
  {
    id: 'caminho-critico',
    moduleId: 'p2-caminhos-minimos',
    order: 7,
    slug: 'caminho-critico',
    title: 'Caminho crítico, ordem topológica por largura e maior caminho',
    examLikelihood: 'high',
    examEvidence: 'Caminho crítico caiu na prova sem data da p. 6 (Q3, 30%); serialização em 2024/2-Q2 e na prova da p. 8. O resumo escreve "+ caminho crítico" à mão na lista de matéria. Confirme com o professor se já foi dado neste semestre.',
    whatYouNeedToKnow:
      'Caminho crítico: alcançar o vértice mais distante no menor tempo possível. Método: identifique a base (vértices com grau de entrada 0), remova a base e repita até o grafo ficar vazio. Isso garante a ordem topológica; cada rodada é um conjunto de tarefas que podem ser feitas em paralelo.',
    understand: [
      'Por largura (aulão, p. 4): a cada rodada, retire todos os vértices com grau de entrada 0. No exemplo: {A, B}, depois {C, D, E}, depois {F, G}. Enquanto houver conjuntos de bases diferentes, adicione-os ao caminho. Há várias formas de escrever a ordem, como B A D C E G F.',
      'O número de rodadas é o tempo mínimo quando tudo que não depende entre si pode correr em paralelo. É o "número mínimo de períodos para se formar" da prova: disciplinas sem pré-requisito entre si são feitas juntas.',
      'Maior caminho em número de arestas (resumo, p. 13): com W = 1, faça W′ = −W, aplique o Dijkstra seguindo uma ordem (ache a base e comece no vértice com maior fecho transitivo) e inverta o sinal da resposta.',
    ],
    commonPitfall: 'Remover um vértice só por rodada e perder os níveis: a contagem de rodadas depende de tirar TODA a base de uma vez.',
    sources: [AULAO(4, 'Caminho Crítico'), RESUMO(14, 'Caminho Crítico'), RESUMO(13, 'Maior caminho')],
  },
];
