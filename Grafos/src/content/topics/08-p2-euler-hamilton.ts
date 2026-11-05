import type { Topic } from '../types';

// Grafos eulerianos e hamiltonianos (aula de 17/09). Fonte principal:
// 08-graphs-traversing.pdf, p. 98-155 (quadros 22 a 33 de 33). O tópico
// "euleriano" veio da P1, onde estava como "P1 ou P2?"; o cronograma 2026/2
// confirmou que é P2 e agora há slide do professor para ele.

const T = '08-graphs-traversing.pdf';

export const eulerHamiltonTopics: Topic[] = [
  {
    id: 'euleriano',
    moduleId: 'p2-euler-hamilton',
    order: 1,
    slug: 'euleriano',
    title: 'Caminho e circuito euleriano — Algoritmo de Fleury',
    examLikelihood: 'high',
    examEvidence:
      'Caiu em 2 provas antigas do Prof. Silvio (P1 2023/2-Q4, o detetive; P1 2026/1-Q2, 25%, "projete uma solução"), quando o assunto ainda vinha antes da P1. Neste semestre o cronograma põe em 17/09, na P2. A lista 2026/2 (Exercício 12, assassinato com portas) também cobra.',
    whatYouNeedToKnow:
      'Eulerian tour (caminho euleriano): passa por toda ARESTA exatamente uma vez. Eulerian cycle (circuito euleriano): idem, começando e terminando no mesmo vértice. Teorema do slide: se G tem caminho euleriano, G tem no máximo dois vértices de grau ímpar. Para encontrar o caminho, o slide usa o Algoritmo de Fleury, que nunca atravessa uma ponte se houver outra opção.',
    understand: [
      'Fleury (slide, quadro 33): (1) confira que G tem no máximo 2 vértices de grau ímpar; (2) comece num vértice v de grau ímpar, se houver; (3) enquanto E ≠ ∅: se há mais de uma aresta incidente em v, atravesse uma que NÃO seja ponte; senão, atravesse a única disponível; remova a aresta usada (E = E − {e}). Ponte (quadro 32) = aresta cuja remoção desconecta G: "temos que visitar todas as arestas de um lado da ponte antes de atravessá-la, porque não há volta".',
      'Paridade (Flash Cards do aulão): circuito euleriano ⟺ conexo e TODOS os graus pares; caminho euleriano aberto ⟺ conexo e EXATAMENTE 2 vértices de grau ímpar — o caminho começa num e termina no outro. O slide (quadro 31) enuncia a parte "no máximo dois ímpares".',
      'Mais de 2 vértices de grau ímpar: nem caminho nem circuito euleriano. Decidir se existe e encontrar o caminho são "easy" (slide, quadro 25) — ao contrário do hamiltoniano.',
    ],
    commonPitfall:
      'Confundir euleriano (toda ARESTA uma vez; vértices podem repetir) com hamiltoniano (todo VÉRTICE uma vez). Outro erro: em Fleury, parar quando volta ao início — só termina quando E = ∅.',
    conceptConflict: {
      topic: 'Construção do caminho euleriano',
      hasRealDifference: true,
      professorDefinition: 'Algoritmo de Fleury: a cada passo, atravessar uma aresta que não seja ponte, a menos que seja a única disponível.',
      professorSource: { type: 'professor_slide', file: T, page: 137, note: "Finding Eulerian tours — Fleury's Algorithm, quadro 33 de 33" },
      alternatives: [
        { author: 'Hierholzer (livros e implementações)', text: 'Constrói o circuito com pilha/backtracking, sem testar pontes a cada passo.' },
        { author: 'West', text: 'Prova a condição de existência por indução; não detalha um algoritmo.' },
      ],
      differenceExplanation: 'Mesma condição de existência; o MÉTODO do professor é Fleury. Hierholzer chega ao mesmo tipo de resultado por outro caminho.',
      examGuidance: 'Na prova, descreva Fleury como no slide: começa em vértice ímpar, evita ponte enquanto houver alternativa, remove a aresta usada até E ficar vazio.',
    },
    sources: [
      { type: 'professor_slide', file: T, page: 102, note: 'Eulerian graph — quadro 24 de 33' },
      { type: 'professor_slide', file: T, page: 128, note: 'Finding Eulerian tours — quadro 31 de 33' },
      { type: 'professor_slide', file: T, page: 137, note: "Fleury's Algorithm — quadro 33 de 33" },
      { type: 'professor_support_material', file: 'Flash Cards Grafos-1.pdf' },
      { type: 'old_exam', file: '2023-2-exam.pdf' },
    ],
  },
  {
    id: 'hamiltoniano',
    moduleId: 'p2-euler-hamilton',
    order: 2,
    slug: 'hamiltoniano',
    title: 'Caminho hamiltoniano e o contraste com Euler',
    examLikelihood: 'medium',
    examEvidence: 'Slide próprio (quadro 26) e dois exercícios de modelagem no slide (interruptores, DNA). Sem prova antiga que cobre hamiltoniano.',
    whatYouNeedToKnow:
      'Hamiltonian tour: caminho em que cada VÉRTICE aparece exatamente uma vez. Para o hamiltoniano, o slide diz que decidir se existe é "not easy to decide" e encontrar é "not easy to compute" — o oposto do euleriano, que é "easy" nos dois casos.',
    understand: [
      'Euler olha ARESTAS (cada uma exatamente uma vez); Hamilton olha VÉRTICES (cada um exatamente uma vez). Um caminho pode ser euleriano sem ser hamiltoniano e vice-versa.',
      'Questões algorítmicas (quadros 25–26): para o euleriano, "Does G contain an Euler tour? Easy to decide" e "Find an Euler tour: Easy to compute". Para o hamiltoniano, as mesmas perguntas são "Not easy to decide" e "Not easy to compute". O slide não dá um teorema de existência para hamiltoniano como dá para o euleriano.',
      'Exercícios do slide: Light Switches (quadro 27) — lâmpada ligada a 3 interruptores, acende só na posição certa, que você não conhece; pergunta o número mínimo de trocas para garantir que acenda (opções 4, 8, 16, 64). DNA Reconstruction (quadros 28–30) — achar a cadeia mais longa que contém todos os pedaços S = {ATG, AGG, TGC, TCC, GTC, GGT, GCA, CAG}, modelada "as a Hamiltonian tour" e "as an Eulerian tour". As páginas da modelagem estão em branco no PDF: a resolução foi feita em aula e não está no material.',
    ],
    commonPitfall: 'Achar que dá para decidir hamiltoniano pela paridade dos graus, como no euleriano. A regra dos graus ímpares vale só para Euler.',
    sources: [
      { type: 'professor_slide', file: T, page: 110, note: 'Algorithmic issues — Hamiltonian tour, quadro 26 de 33' },
      { type: 'professor_slide', file: T, page: 106, note: 'Algorithmic issues — Eulerian tour, quadro 25 de 33' },
      { type: 'professor_slide', file: T, page: 115, note: 'Light Switches — quadro 27 de 33' },
      { type: 'professor_slide', file: T, page: 119, note: 'DNA Reconstruction — quadros 28-30 de 33' },
    ],
  },
  {
    id: 'grafo-de-linha',
    moduleId: 'p2-euler-hamilton',
    order: 3,
    slug: 'grafo-de-linha',
    title: 'Grafo de linha L(G)',
    examLikelihood: 'high',
    examEvidence:
      'A P2 mais recente do Prof. Silvio (2026/1-Q1, 45%) é inteira sobre grafo de linha + euleriano/hamiltoniano. Segundo o aluno, foi a última matéria dada em 2026/2.',
    whatYouNeedToKnow:
      'Seja G não direcionado e conexo. Os vértices de L(G) são as ARESTAS de G; dois vértices de L(G) são adjacentes se as arestas correspondentes são adjacentes em G (compartilham um vértice).',
    understand: [
      'Definição (slide 13, quadro 34; lista, Exercício 20): cada aresta de G vira um vértice de L(G); liga-se dois deles quando as arestas compartilham uma ponta. No exemplo do slide, 6 arestas viram 6 vértices.',
      'Contagem (consequência da definição, não está escrita no slide): a aresta uv encosta em d(u) − 1 arestas por u e d(v) − 1 por v, logo seu grau em L(G) é d(u) + d(v) − 2. Cada vértice v gera C(d(v), 2) pares de arestas adjacentes, logo |E(L(G))| = Σ C(d(v), 2). L(K4) tem 6 vértices e 12 arestas (Exercício 20 da lista).',
      'Com Euler e Hamilton (2026/1-Q1; a justificativa é raciocínio sobre a prova, não resposta oficial): G euleriano ⇒ L(G) euleriano, pois d(u) + d(v) − 2 é par. G euleriano ⇒ L(G) hamiltoniano, pois o circuito passa por cada aresta uma vez e arestas seguidas são adjacentes: vira um ciclo por todos os vértices de L(G). G semi-euleriano NÃO garante L(G) semi-euleriano: K4 menos uma aresta dá 4 vértices de grau ímpar em L(G).',
      'O slide fecha com χ′(G) = χ(L(G)): o índice cromático de G é o número cromático de L(G). Colorir as arestas de G é colorir os vértices de L(G), porque arestas adjacentes viram vértices adjacentes.',
    ],
    commonPitfall: 'Trocar quem vira o quê: vértice de L(G) é ARESTA de G. Outro erro: responder V/F sem justificar — a prova avisa que "apenas indicar verdadeiro ou falso irá anular sua resposta".',
    sources: [
      { type: 'professor_slide', file: '13-graphs-planarity.pdf', page: 106, note: 'Line graph — quadro 34 de 37' },
      { type: 'professor_support_material', file: 'Lista-de-exercicios-1.pdf', note: 'Exercício 20' },
      { type: 'old_exam', file: 'P2-TGC.pdf', note: '2026/1 (Prova 2), Questão 1' },
    ],
  },
];
