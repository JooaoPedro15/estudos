import type { Topic } from '../types';

// Indução (aula de 16/09 no cronograma 2026/2). NÃO há slide dedicado: o
// método aparece DENTRO dos slides, como ferramenta de demonstração (prova de
// correção do Dijkstra e invariante de laço — 10-graphs-shortest-path.pdf).
// A estrutura geral (base / hipótese / passo; inicialização / manutenção /
// término) vem do Cormen, etiquetada como livro.

export const inducaoTopics: Topic[] = [
  {
    id: 'inducao',
    moduleId: 'p2-inducao',
    order: 1,
    slug: 'inducao',
    title: 'Prova por indução',
    examLikelihood: 'medium',
    examEvidence:
      'Aula própria no cronograma 2026/2 (16/09), mas sem slide. Nos slides, indução aparece na prova de correção do Dijkstra ("Prove by induction on the size of S"). As provas antigas da P1 cobravam demonstrações ("prove que…"), então o formato "demonstre" é plausível.',
    scopeNote:
      'Sem slide desta aula. O que está aqui vem de dois lugares: (1) os trechos dos slides de caminho mínimo que USAM indução; (2) o Cormen, para a estrutura geral — marcado como livro. Se tiver foto do quadro da aula de 16/09, ela passa a valer acima do livro.',
    whatYouNeedToKnow:
      'Uma prova por indução tem uma base (a afirmação vale no menor caso) e um passo indutivo (supondo que vale para um caso, a hipótese indutiva, mostra-se que vale para o seguinte). Nos slides, é assim que se prova que o Dijkstra está certo: indução no tamanho do conjunto S de vértices já explorados.',
    understand: [
      'Estrutura (Cormen, cap. 4.3, "método de substituição" — livro, não slide): base da indução no menor caso; hipótese indutiva: supor a afirmação para valores menores; passo: usar a hipótese para provar o caso atual. Errar a forma exata da hipótese faz a prova não fechar.',
      'Uso nos slides (10-graphs-shortest-path.pdf, quadro 17): "Claim: Pu is the shortest path from s to u. Prove by induction on the size of S. Base case: |S| = 1, the only node in S is s. Inductive step: we add the node v to S" — e um caminho alternativo P que sai de S por x e y "already too long by the time it had left the set S".',
      'Invariante de laço nos slides (quadros 12–13): S é λ-separador para x quando contém todo y com Lx(y) < λ e S̄ = V \\ S contém todo y com Lx(y) > λ. Ao extrair y de S̄ com menor L^S_x(y), vale L^S_x(y) = Lx(y) e S ∪ {y} continua λ-separador. No Cormen (seção 2.1, livro) essa ideia tem três partes: inicialização, manutenção e término.',
    ],
    commonPitfall:
      'Provar só a base e "ver que funciona" em dois ou três exemplos. Exemplo não é prova: o passo indutivo precisa valer para um caso genérico, usando a hipótese.',
    sources: [
      { type: 'professor_slide', file: '10-graphs-shortest-path.pdf', page: 46, note: 'Proof of Correctness — quadro 17 de 26' },
      { type: 'professor_slide', file: '10-graphs-shortest-path.pdf', page: 24, note: 'Loop invariant of Dijkstra algorithm — quadros 12-13 de 26' },
      { type: 'book', author: 'Cormen et al., Algoritmos: teoria e prática', chapter: '2.1 (invariantes de laço) e 4.3 (método de substituição)' },
    ],
  },
];
