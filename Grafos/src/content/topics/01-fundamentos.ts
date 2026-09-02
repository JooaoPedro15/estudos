import type { Topic } from '../types';

export const fundamentosTopics: Topic[] = [
  {
    id: 'definicao-terminologia',
    moduleId: 'fundamentos',
    order: 1,
    slug: 'definicao-terminologia',
    title: 'Definição de grafo e terminologia básica',
    examLikelihood: 'high',
    examEvidence: 'Base de quase toda questão da P1 — vocabulário usado em todas as 8 provas analisadas.',
    whatYouNeedToKnow:
      'Um grafo é G=(V,E). Em grafo não-dirigido, cada aresta é um par não-ordenado {u,v}; em grafo dirigido, um par ordenado (u,v). Você precisa reconhecer de cabeça: laço, arestas paralelas, grafo simples, vértice isolado, vértice pendente, grafo nulo, grafo regular, e a diferença entre grau d(v), grau de entrada d⁻(v) e grau de saída d⁺(v).',
    understand: [
      'Grafo simples = sem laços e sem arestas paralelas. É o padrão assumido salvo indicação contrária.',
      'Laço (loop) é uma aresta que liga um vértice a ele mesmo — conta 2 no grau desse vértice (não-dirigido).',
      'Arestas paralelas (multi-arestas) ligam o mesmo par de vértices mais de uma vez.',
      'Grau de um vértice não-dirigido: número de arestas incidentes (laço conta 2). Dirigido: d(v) = d⁻(v) + d⁺(v).',
      'Grafo regular: todos os vértices têm o mesmo grau. Grafo nulo: nenhuma aresta (só vértices isolados).',
      'Vértice pendente: grau exatamente 1. Vértice isolado: grau 0.',
    ],
    commonPitfall:
      'Confundir "grafo nulo" (Nn, sem nenhuma aresta) com "grafo vazio" (sem vértices) — na P1, "nulo" sempre significa sem arestas. Também é comum esquecer que um laço soma 2 ao grau, não 1.',
    sources: [
      { type: 'professor_slide', file: '01-graphs-concepts.pdf' },
    ],
  },
  {
    id: 'passeios-caminhos-ciclos',
    moduleId: 'fundamentos',
    order: 2,
    slug: 'passeios-caminhos-ciclos',
    title: 'Walk, Trail, Path, Cycle — conectividade e bipartição',
    examLikelihood: 'medium',
    examEvidence: 'Base conceitual de questões sobre bipartição (2023/1, 2025/1) e de qualquer questão que peça "caminho" com rigor.',
    whatYouNeedToKnow:
      'O professor usa os termos em inglês mesmo em slide majoritariamente em português: Walk (passeio, sem restrição — pode repetir vértice e aresta), Trail (trilha, não repete aresta), Path (caminho, não repete vértice), Cycle (ciclo, caminho fechado). Um grafo é conexo se existe caminho entre qualquer par de vértices. Bipartido: V se particiona em dois conjuntos sem arestas dentro do mesmo conjunto.',
    understand: [
      'Walk ⊃ Trail ⊃ Path — todo caminho é uma trilha, toda trilha é um passeio, mas não o contrário.',
      'Ciclo (Cycle): passeio fechado (começa e termina no mesmo vértice) sem repetir vértice (exceto o inicial/final) nem aresta.',
      'Grafo conexo: nº mínimo de arestas para conectar n vértices é n−1 (uma árvore geradora).',
      'Grafo bipartido: pode ser testado por 2-coloração via BFS — se em algum momento dois vizinhos recebem a mesma cor, não é bipartido.',
      'Bipartido completo Km,n: todas as arestas possíveis entre as duas partes, |E| = m·n. Máximo de arestas de um bipartido com n vértices (partes iguais) = n²/4.',
    ],
    commonPitfall:
      'Achar que "caminho" (Path) permite repetir vértices — na convenção do professor (slides em inglês), Path é estritamente sem repetição. Se a questão disser "passeio", repetição é permitida.',
    sources: [{ type: 'professor_slide', file: '01-graphs-concepts.pdf' }, { type: 'professor_support_material', file: 'Resumo Prova 1 Grafos.pdf' }],
  },
  {
    id: 'aperto-de-maos-familias',
    moduleId: 'fundamentos',
    order: 3,
    slug: 'aperto-de-maos-familias',
    title: 'Teorema do aperto de mãos, famílias especiais e operações',
    examLikelihood: 'high',
    examEvidence: 'Teorema do aperto de mãos é a base de 4 das 8 provas (possibilidade de grafo dado n vértices/soma de graus). Famílias especiais caíram em 2025/1-Q3 (Kr,s,t).',
    whatYouNeedToKnow:
      'Σ d(v) = 2|E| — sempre par. Consequência direta: nº de vértices de grau ímpar é sempre par. Você precisa saber de cor as fórmulas de |V| e |E| das famílias: Kn (completo), Cn (ciclo), Nn (nulo), Km,n (bipartido completo), Qn (hipercubo), Wn (roda), Kr,s,t (tripartido completo). E as operações: união, soma, remoção de aresta/vértice, contração de aresta.',
    understand: [
      'Kn: |E| = n(n−1)/2. Cn: |E| = n. Nn: |E| = 0. Wn (roda com n raios): |V|=n+1, |E|=2n.',
      'Km,n: |E| = m·n. Qn (hipercubo, vértices = strings binárias de tamanho n): |V|=2ⁿ, cada vértice tem grau n.',
      'Kr,s,t (tripartido completo): |V|=r+s+t, |E| = rs+rt+st.',
      'Prova clássica (princípio da casa dos pombos): todo grafo simples com ≥2 vértices tem pelo menos 2 vértices de mesmo grau — porque grau varia de 0 a n−1 (n valores possíveis), mas 0 e n−1 não podem coexistir no mesmo grafo, sobrando no máximo n−1 valores para n vértices.',
      'Contração de aresta e/(u,v): funde u e v em um único vértice, removendo laços resultantes e mesclando arestas paralelas (ou não, dependendo da convenção pedida na questão).',
    ],
    commonPitfall:
      'Na prova de "possibilidade de grafo com n vértices e k componentes", esquecer os limites m_min = n−k (mínimo de arestas para k componentes conexos) e m_max = (n−k)(n−k+1)/2 (máximo, quando um componente concentra todos os vértices "livres" como grafo completo). Esse é o "truque" mais repetido nas provas antigas.',
    sources: [
      { type: 'professor_slide', file: '01-graphs-concepts.pdf' },
      { type: 'old_exam', file: '2022-1-exam.pdf' },
      { type: 'old_exam', file: '2025-1-exam.pdf' },
    ],
  },
];
