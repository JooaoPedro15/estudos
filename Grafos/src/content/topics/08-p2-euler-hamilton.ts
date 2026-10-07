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
];
