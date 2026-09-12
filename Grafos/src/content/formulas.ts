import type { GraphData } from './types';

/**
 * Fórmulas da P1 explicadas para quem nunca viu a matéria: o que a fórmula
 * diz em português, o que é CADA símbolo, um exemplo com número pequeno e,
 * quando ajuda, o desenho do grafo do exemplo. O "Me ensine" mostra as
 * fórmulas cujo `topics` inclui o tópico da questão ou cujo `families`
 * inclui a família de prova dela.
 */
export interface FormulaExplanation {
  id: string;
  title: string;
  /** A fórmula como o professor escreve. */
  formula: string;
  /** A mesma coisa em português, sem símbolo. */
  plain: string;
  symbols: { symbol: string; meaning: string }[];
  /** Conta feita num caso pequeno. */
  example: string;
  /** Desenho do caso pequeno (posições fixas no espaço 560 × 320). */
  graph?: GraphData;
  graphCaption?: string;
  topics: string[];
  families?: string[];
}

const ug = (ids: string, coords: Record<string, [number, number]>, edges: [string, string][]): GraphData => ({
  directed: false,
  vertices: ids.split('').map((id) => ({ id, label: id, x: coords[id][0], y: coords[id][1] })),
  edges: edges.map(([s, t]) => ({ id: `${s}${t}`, source: s, target: t })),
});

const K4 = ug('abcd', { a: [180, 80], b: [380, 80], c: [380, 240], d: [180, 240] }, [
  ['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'a'], ['a', 'c'], ['b', 'd'],
]);
const K3 = ug('abc', { a: [280, 70], b: [180, 240], c: [380, 240] }, [['a', 'b'], ['b', 'c'], ['a', 'c']]);
const C5 = ug('abcde', { a: [280, 50], b: [420, 150], c: [370, 290], d: [190, 290], e: [140, 150] }, [
  ['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'e'], ['e', 'a'],
]);
const PATH4 = ug('abcd', { a: [80, 160], b: [220, 160], c: [360, 160], d: [500, 160] }, [['a', 'b'], ['b', 'c'], ['c', 'd']]);
const SIX_TWO_MAX = ug('abcdef', { a: [120, 80], b: [280, 60], c: [400, 150], d: [280, 260], e: [120, 240], f: [500, 60] }, [
  ['a', 'b'], ['a', 'c'], ['a', 'd'], ['a', 'e'], ['b', 'c'], ['b', 'd'], ['b', 'e'], ['c', 'd'], ['c', 'e'], ['d', 'e'],
]);
const SIX_TWO_MIN = ug('abcdef', { a: [80, 100], b: [200, 100], c: [320, 100], d: [200, 240], e: [440, 100], f: [520, 240] }, [
  ['a', 'b'], ['b', 'c'], ['b', 'd'], ['e', 'f'],
]);
const K23 = ug('abxyz', { a: [200, 70], b: [360, 70], x: [120, 250], y: [280, 250], z: [440, 250] }, [
  ['a', 'x'], ['a', 'y'], ['a', 'z'], ['b', 'x'], ['b', 'y'], ['b', 'z'],
]);
const DEG_EX = ug('abcd', { a: [120, 160], b: [280, 80], c: [440, 160], d: [280, 260] }, [['a', 'b'], ['b', 'c'], ['b', 'd'], ['c', 'd']]);

export const formulas: FormulaExplanation[] = [
  {
    id: 'soma-dos-graus',
    title: 'Propriedade de grau (aperto de mãos)',
    formula: 'Σ d(v) = 2·|E|      (somando sobre todos os v ∈ V)',
    plain:
      'Some o grau de todos os vértices; o resultado é sempre o dobro do número de arestas. Motivo: cada aresta tem duas pontas e cada ponta soma 1 ao grau de um vértice — então cada aresta é contada duas vezes.',
    symbols: [
      { symbol: 'Σ', meaning: 'letra grega sigma = "some tudo o que vem depois", um termo para cada vértice' },
      { symbol: 'v', meaning: 'um vértice qualquer (a "bolinha")' },
      { symbol: 'V', meaning: 'o conjunto de TODOS os vértices; v ∈ V = "v é um dos vértices"' },
      { symbol: 'd(v)', meaning: 'grau de v = quantas arestas tocam v' },
      { symbol: 'E', meaning: 'o conjunto de todas as arestas ("edges", os "risquinhos")' },
      { symbol: '|E|', meaning: 'quantas arestas existem (as barras | | significam "quantidade")' },
    ],
    example: 'No desenho: d(a) = 1, d(b) = 3, d(c) = 2, d(d) = 2. Soma = 1 + 3 + 2 + 2 = 8. Arestas: 4. E 2·4 = 8. ✓ Consequência: a soma dos graus é sempre PAR — se uma questão der soma ímpar, é impossível.',
    graph: DEG_EX,
    graphCaption: '4 vértices, 4 arestas: soma dos graus 8 = 2 × 4.',
    topics: ['aperto-de-maos-familias', 'definicao-terminologia'],
    families: ['possibilidade-n-k', 'limites-grau-arestas', 'bipartido-tripartido'],
  },
  {
    id: 'arestas-kn',
    title: 'Arestas do grafo completo Kn',
    formula: '|E(Kn)| = n(n − 1)/2',
    plain:
      'Num grafo completo todo mundo está ligado a todo mundo. Cada um dos n vértices tem n − 1 arestas (uma para cada outro vértice). Multiplicando, n(n − 1) — mas assim cada aresta foi contada duas vezes (uma de cada ponta), então divide por 2.',
    symbols: [
      { symbol: 'Kn', meaning: 'grafo completo com n vértices (K de "komplett"; n é quantos vértices)' },
      { symbol: 'n', meaning: 'número de vértices' },
      { symbol: 'n − 1', meaning: 'quantos outros vértices existem além de um dado (grau de cada vértice em Kn)' },
      { symbol: '/2', meaning: 'corrige a contagem dupla: a aresta {a, b} foi contada em a e em b' },
    ],
    example: 'K4 (desenho): 4·3/2 = 6 arestas — confira contando. K5: 5·4/2 = 10. K10: 45. Também é o MÁXIMO de arestas de qualquer grafo simples com n vértices.',
    graph: K4,
    graphCaption: 'K4: cada vértice ligado aos outros 3; 6 arestas.',
    topics: ['definicao-terminologia', 'aperto-de-maos-familias', 'teoremas-contagem'],
    families: ['possibilidade-n-k', 'limites-grau-arestas', 'subgrafos-kn', 'auto-complementar'],
  },
  {
    id: 'min-max-componentes',
    title: 'Mínimo e máximo de arestas com n vértices e k componentes',
    formula: 'mínimo = n − k          máximo = (n − k)(n − k + 1)/2',
    plain:
      'MÍNIMO: para um pedaço (componente) com ni vértices ficar ligado precisa de pelo menos ni − 1 arestas (uma "árvore"). Somando os k pedaços: Σ(ni − 1) = n − k. MÁXIMO: junte o máximo de vértices num pedaço só e deixe os outros k − 1 pedaços como vértices isolados; o pedaço grande tem n − k + 1 vértices e, sendo completo, tem (n − k + 1)(n − k)/2 arestas.',
    symbols: [
      { symbol: 'n', meaning: 'número total de vértices' },
      { symbol: 'k', meaning: 'número de componentes conexos = quantos "pedaços soltos" o grafo tem' },
      { symbol: 'n − k', meaning: 'no mínimo: uma aresta a menos que vértices, em cada pedaço, somado' },
      { symbol: 'n − k + 1', meaning: 'quantos vértices sobram para o pedaço grande depois de separar k − 1 vértices isolados' },
      { symbol: '(n − k)(n − k + 1)/2', meaning: 'é a fórmula de Kn aplicada ao pedaço grande, com n − k + 1 no lugar de n' },
    ],
    example: 'n = 6, k = 2. Mínimo: 6 − 2 = 4 arestas (desenho de cima: dois pedaços, cada um é árvore). Máximo: 4·5/2 = 10 (desenho de baixo: K5 + 1 vértice isolado). Então "é possível 3 arestas?" NÃO (< 4); "é possível 11?" NÃO (> 10); "7?" SIM.',
    graph: SIX_TWO_MIN,
    graphCaption: 'Mínimo: n = 6, k = 2 ⇒ 4 arestas (pedaços {a,b,c,d} e {e,f}, ambos árvores).',
    topics: ['teoremas-contagem', 'aperto-de-maos-familias'],
    families: ['possibilidade-n-k'],
  },
  {
    id: 'max-componentes-desenho',
    title: 'O grafo que atinge o máximo de arestas',
    formula: 'K(n − k + 1)  ∪  (k − 1) vértices isolados',
    plain:
      'Para ter MAIS arestas possível com k pedaços, não adianta espalhar vértices: aresta só existe dentro de um pedaço, e um pedaço completo com muitos vértices rende muito mais que vários pedaços pequenos. Então k − 1 pedaços viram um vértice só cada (zero arestas) e todo o resto vai para um único pedaço completo.',
    symbols: [
      { symbol: 'K(n − k + 1)', meaning: 'grafo completo com n − k + 1 vértices (o "pedaço grande")' },
      { symbol: '∪', meaning: 'união: junta os dois desenhos lado a lado, sem ligar um ao outro' },
      { symbol: 'k − 1 isolados', meaning: 'os outros pedaços, cada um com 1 vértice e 0 arestas' },
    ],
    example: 'n = 6, k = 2 (desenho): K5 com 10 arestas + o vértice f sozinho. Total 10 = (6 − 2)(6 − 2 + 1)/2. Qualquer outra divisão (ex.: 3 + 3 vértices) dá menos: 3 + 3 = 6 arestas.',
    graph: SIX_TWO_MAX,
    graphCaption: 'Máximo: n = 6, k = 2 ⇒ K5 (10 arestas) + f isolado.',
    topics: ['teoremas-contagem'],
    families: ['possibilidade-n-k'],
  },
  {
    id: 'subgrafos-kn',
    title: 'Número de subgrafos de Kn',
    formula: 'N = Σ_{i=1}^{n} C(n, i) · 2^{ i(i−1)/2 }',
    plain:
      'Um subgrafo é "um pedaço" do grafo: você escolhe alguns vértices e, entre eles, algumas (ou todas, ou nenhuma) das arestas. Para contar todos: primeiro decide QUANTOS vértices (i), depois QUAIS (C(n, i) jeitos), depois, entre esses i vértices, quais arestas ficam — cada uma das i(i−1)/2 arestas possíveis pode ficar ou sair (2 opções cada, logo 2 elevado a esse número). Soma para i = 1 até n.',
    symbols: [
      { symbol: 'N', meaning: 'a resposta: número total de subgrafos' },
      { symbol: 'Σ_{i=1}^{n}', meaning: '"some, com i valendo 1, depois 2, depois 3… até n" — um termo para cada tamanho de subgrafo' },
      { symbol: 'i', meaning: 'quantos vértices o subgrafo tem nesta parcela da soma' },
      { symbol: 'C(n, i)', meaning: '"combinação de n, i a i": de quantos jeitos dá para escolher i vértices entre n. C(4,2) = 6, C(4,3) = 4, C(n,1) = n, C(n,n) = 1' },
      { symbol: 'i(i−1)/2', meaning: 'quantas arestas existem entre i vértices no grafo completo (é a fórmula de Ki)' },
      { symbol: '2^{…}', meaning: '"2 elevado a": cada aresta possível tem 2 escolhas (entra / não entra); com m arestas são 2·2·…·2 = 2^m combinações' },
      { symbol: '·', meaning: 'vezes (multiplica escolha de vértices por escolha de arestas)' },
    ],
    example:
      'K3 (desenho): i = 1 → C(3,1)·2^0 = 3·1 = 3 (só um vértice, sem aresta). i = 2 → C(3,2)·2^1 = 3·2 = 6 (dois vértices, com ou sem a aresta entre eles). i = 3 → C(3,3)·2^3 = 1·8 = 8 (os três vértices, cada uma das 3 arestas entra ou não). Total 3 + 6 + 8 = 17. Para K4: 4 + 12 + 32 + 64 = 112.',
    graph: K3,
    graphCaption: 'K3: 3 vértices, 3 arestas ⇒ 17 subgrafos.',
    topics: ['complemento-subgrafo', 'teoremas-contagem'],
    families: ['subgrafos-kn'],
  },
  {
    id: 'combinacao',
    title: 'C(n, i) — "escolher i entre n"',
    formula: 'C(n, i) = n! / ( i! · (n − i)! )',
    plain:
      'Quantos grupos de i coisas dá para formar a partir de n coisas, sem importar a ordem. Na prática, para números pequenos, conte na mão: C(4, 2) = 6 porque os pares de {a,b,c,d} são ab, ac, ad, bc, bd, cd.',
    symbols: [
      { symbol: 'n!', meaning: '"n fatorial" = n·(n−1)·(n−2)·…·1. Ex.: 4! = 24, 3! = 6, 1! = 1, 0! = 1' },
      { symbol: 'i', meaning: 'tamanho do grupo que você escolhe' },
      { symbol: 'C(n, 1)', meaning: 'sempre n (escolher 1 entre n)' },
      { symbol: 'C(n, n)', meaning: 'sempre 1 (escolher todos)' },
    ],
    example: 'C(5, 2) = 5!/(2!·3!) = 120/(2·6) = 10. C(5, 3) = 10 também (escolher 3 para ficar = escolher 2 para sair). Tabela útil: C(4,·) = 1, 4, 6, 4, 1; C(5,·) = 1, 5, 10, 10, 5, 1.',
    topics: ['complemento-subgrafo', 'teoremas-contagem'],
    families: ['subgrafos-kn'],
  },
  {
    id: 'auto-complementar',
    title: 'Arestas de um grafo auto-complementar',
    formula: '|E(G)| = |E(Ḡ)|   e   |E(G)| + |E(Ḡ)| = n(n−1)/2   ⇒   |E(G)| = n(n−1)/4',
    plain:
      'O complemento Ḡ é o "negativo": tem aresta exatamente onde G não tem. Juntos, G e Ḡ formam o completo Kn. Se G é auto-complementar (G e Ḡ são o mesmo desenho, só renomeado), os dois têm o mesmo número de arestas — então cada um fica com METADE das n(n−1)/2 arestas de Kn.',
    symbols: [
      { symbol: 'Ḡ', meaning: 'complemento de G (barra em cima = "o contrário"); também escrito C(G)' },
      { symbol: '|E(G)|', meaning: 'número de arestas de G' },
      { symbol: 'n(n−1)/2', meaning: 'arestas de Kn = todas as arestas possíveis com n vértices' },
      { symbol: 'n(n−1)/4', meaning: 'metade disso: arestas de G quando G é auto-complementar' },
      { symbol: '⇒', meaning: '"portanto", "logo"' },
    ],
    example: 'C5 (desenho): 5·4/4 = 5 arestas — e o complemento de C5 é a "estrela de 5 pontas", que é outro ciclo de 5: isomorfos. Para n = 6: 6·5/4 = 7,5 — não é inteiro, logo NÃO existe auto-complementar com 6 vértices. n(n−1) precisa ser múltiplo de 4 ⇒ n = 4, 5, 8, 9, 12, 13… (n = 4k ou 4k + 1).',
    graph: C5,
    graphCaption: 'C5: auto-complementar, 5 arestas = 5·4/4.',
    topics: ['complemento-subgrafo'],
    families: ['auto-complementar'],
  },
  {
    id: 'pombos',
    title: 'Dois vértices de mesmo grau ("casa dos pombos" — nome que não está no material; escreva o argumento)',
    formula: 'graus possíveis ∈ {0, 1, …, n − 1}, mas 0 e n − 1 não coexistem ⇒ n vértices para ≤ n − 1 valores',
    plain:
      '"Casa dos pombos": se você tem mais pombos que casas, alguma casa recebe dois pombos. Aqui os pombos são os n vértices e as casas são os valores de grau possíveis. Num grafo simples o grau vai de 0 a n − 1 (n casas). Mas se alguém tem grau n − 1 está ligado a todos, e aí ninguém pode ter grau 0 — as casas 0 e n − 1 nunca são usadas juntas. Sobram n − 1 casas para n pombos: dois vértices caem na mesma casa = mesmo grau.',
    symbols: [
      { symbol: 'n − 1', meaning: 'maior grau possível num grafo simples: ligado a todos os outros' },
      { symbol: '0', meaning: 'menor grau: vértice isolado' },
      { symbol: '∈ {0, …, n−1}', meaning: '"pertence ao conjunto" — o grau é um desses valores' },
      { symbol: '≤ n − 1 valores', meaning: 'no máximo n − 1 "casas" diferentes' },
    ],
    example: 'n = 4 (desenho): graus 1, 3, 2, 2 — os valores possíveis eram {0,1,2,3}, mas como b tem grau 3 ninguém pode ter 0; sobram {1,2,3} para 4 vértices ⇒ repetição obrigatória (c e d têm grau 2).',
    graph: DEG_EX,
    graphCaption: 'b tem grau 3 = n − 1 ⇒ ninguém tem grau 0 ⇒ c e d empatam.',
    topics: ['aperto-de-maos-familias'],
    families: ['pombos'],
  },
  {
    id: 'bipartido-completo',
    title: 'Arestas de Km,n, máximo de um bipartido e Kr,s,t',
    formula: '|E(Km,n)| = m·n        bipartido: |E| ≤ n²/4        |E(Kr,s,t)| = rs + rt + st',
    plain:
      'Bipartido = dois times; aresta só entre times. Se cada um dos m do time 1 se liga a cada um dos n do time 2, são m·n arestas. Com n vértices no total, o produto é maior quando os times são iguais (n/2 cada): (n/2)·(n/2) = n²/4. Com três times (tripartido completo), cada par de times forma um bipartido completo: r·s + r·t + s·t.',
    symbols: [
      { symbol: 'Km,n', meaning: 'bipartido completo: m vértices de um lado, n do outro, todas as ligações cruzadas' },
      { symbol: 'm, n', meaning: 'tamanhos dos dois lados' },
      { symbol: 'n²/4', meaning: '(n/2)·(n/2): lados iguais maximizam o produto' },
      { symbol: 'Kr,s,t', meaning: 'tripartido completo: três lados de tamanhos r, s, t' },
      { symbol: 'rs + rt + st', meaning: 'arestas entre lado 1 e 2, entre 1 e 3, entre 2 e 3' },
    ],
    example: 'K2,3 (desenho): 2·3 = 6 arestas. Bipartido com 10 vértices: no máximo 5·5 = 25. K2,2,2: 4 + 4 + 4 = 12 (é o octaedro). K2,3,3: 6 + 6 + 9 = 21.',
    graph: K23,
    graphCaption: 'K2,3: lado {a, b} × lado {x, y, z} = 6 arestas.',
    topics: ['passeios-caminhos-ciclos', 'aperto-de-maos-familias'],
    families: ['bipartido-tripartido'],
  },
  {
    id: 'regular',
    title: 'Grafo regular: n·d = 2|E|',
    formula: 'n · d = Σ d(v) = 2|E|   ⇒   n·d tem que ser PAR',
    plain:
      'Regular = todo vértice com o mesmo grau d. A soma dos graus vira n vezes d. Como a soma dos graus é sempre 2|E| (par), n·d precisa ser par. Se n e d forem os dois ímpares, impossível.',
    symbols: [
      { symbol: 'd', meaning: 'o grau comum a todos os vértices' },
      { symbol: 'n·d', meaning: 'soma dos graus quando todos valem d' },
      { symbol: 'PAR', meaning: 'divisível por 2 — porque é 2 vezes o número de arestas' },
    ],
    example: 'n = 15, d = 3: 15·3 = 45, ímpar ⇒ não existe (é a questão 2023/1-Q1c). n = 10, d = 3: 30 ⇒ |E| = 15, possível. Regra extra: d ≤ n − 1.',
    topics: ['definicao-terminologia', 'aperto-de-maos-familias'],
    families: ['limites-grau-arestas', 'possibilidade-n-k'],
  },
  {
    id: 'excentricidade',
    title: 'Excentricidade, raio, diâmetro, centro',
    formula: 'ε(v) = max_u dist(v, u)      raio = min_v ε(v)      diâmetro = max_v ε(v)      centro = { v : ε(v) = raio }',
    plain:
      'dist(v, u) é o menor número de arestas para ir de v até u. A excentricidade de v é a pior dessas distâncias (o vértice mais longe de v). Raio é a menor excentricidade do grafo (o vértice mais "central"); diâmetro é a maior (a maior distância que existe no grafo); centro é o conjunto dos vértices que empatam no raio.',
    symbols: [
      { symbol: 'ε(v)', meaning: 'épsilon de v = excentricidade de v' },
      { symbol: 'dist(v, u)', meaning: 'distância = nº de arestas do caminho mais curto de v até u (calculada com BFS)' },
      { symbol: 'max_u', meaning: '"o maior valor, variando u por todos os vértices"' },
      { symbol: 'min_v', meaning: '"o menor valor, variando v por todos os vértices"' },
      { symbol: '{ v : … }', meaning: '"o conjunto dos v tais que …"' },
    ],
    example: 'Caminho a–b–c–d (desenho): ε(a) = 3 (até d), ε(b) = 2 (até d), ε(c) = 2 (até a), ε(d) = 3. Raio = 2, diâmetro = 3, centro = {b, c}.',
    graph: PATH4,
    graphCaption: 'a–b–c–d: raio 2, diâmetro 3, centro {b, c}.',
    topics: ['excentricidade-raio-diametro', 'bfs'],
    families: ['excentricidade', 'bfs-distancias'],
  },
  {
    id: 'matriz-adjacencia',
    title: 'Matriz de adjacência: aij',
    formula: 'aij = 1 se (i, j) ∈ A;  aij = 0 se (i, j) ∉ A        Σ_i aij = d⁻(j)   (coluna)        Σ_j aij = d⁺(i)   (linha)',
    plain:
      'Tabela n × n: linha i, coluna j guarda 1 se existe aresta de i para j, senão 0. Somar a LINHA i conta quantas setas SAEM de i (grau de saída). Somar a COLUNA j conta quantas CHEGAM em j (grau de entrada). Em grafo não-direcionado a tabela é simétrica (aij = aji) e as duas somas dão o grau d(v).',
    symbols: [
      { symbol: 'aij', meaning: 'a entrada na linha i, coluna j da matriz' },
      { symbol: '(i, j) ∈ A', meaning: 'existe a aresta de i para j (A = conjunto de arestas, ∈ = "pertence")' },
      { symbol: '∉', meaning: '"não pertence" — não existe a aresta' },
      { symbol: 'd⁻(j)', meaning: 'grau de entrada de j (setas chegando); d⁺(i) = grau de saída de i (setas saindo)' },
      { symbol: 'simétrica', meaning: 'aij = aji para todo par — espelhada na diagonal' },
    ],
    example: 'Grafo não-direcionado com arestas ab, bc, bd, cd (desenho): linha b = [1 0 1 1] soma 3 = d(b). Diagonal toda 0 = sem laço; só 0/1 = sem arestas paralelas ⇒ grafo simples.',
    graph: DEG_EX,
    graphCaption: 'Linha de b: a=1, b=0, c=1, d=1 ⇒ d(b) = 3.',
    topics: ['matriz-adjacencia', 'matriz-incidencia'],
    families: ['matriz-adjacencia'],
  },
  {
    id: 'fecho-base',
    title: 'Fecho transitivo Γ⁺(v) e base',
    formula: 'Γ⁺(v) = { u : existe caminho de v até u }        B é base ⇔ Γ⁺(B) = V  e  nenhum b ∈ B alcança outro b′ ∈ B',
    plain:
      'Γ⁺(v) ("gama mais de v") é tudo que v consegue alcançar seguindo as setas (o fecho transitivo direto). Γ⁺(B) de um conjunto é a união dos fechos dos seus vértices. Uma base é um conjunto B que alcança o grafo inteiro (Γ⁺(B) = V) sem ninguém de B alcançar outro de B (senão seria redundante). Anti-base é a mesma coisa com as setas invertidas.',
    symbols: [
      { symbol: 'Γ⁺(v)', meaning: 'gama maiúsculo com sinal de mais: conjunto dos vértices alcançáveis a partir de v' },
      { symbol: '{ u : … }', meaning: '"o conjunto dos u tais que …"' },
      { symbol: 'Γ⁺(B) = ∪_{u∈B} Γ⁺(u)', meaning: 'fecho de um conjunto = união dos fechos de cada elemento' },
      { symbol: '⇔', meaning: '"se e somente se" — vale nos dois sentidos' },
      { symbol: 'd⁻(v) = 0', meaning: 'grau de entrada zero: ninguém alcança v ⇒ v obrigatoriamente está na base' },
    ],
    example: 'Setas a → b → c e d → c: Γ⁺(a) = {a, b, c}, Γ⁺(d) = {d, c}. Base = {a, d} (juntos alcançam tudo; a não alcança d nem vice-versa). Anti-base = {c} (todo mundo chega em c).',
    topics: ['fecho-transitivo', 'base-antibase'],
    families: ['fecho-base-antibase'],
  },
];

/** Fórmulas relevantes para uma questão: pelo tópico ou pela família de prova. */
export function formulasFor(topic: string, examFamily?: string): FormulaExplanation[] {
  return formulas.filter((f) => f.topics.includes(topic) || (examFamily !== undefined && f.families?.includes(examFamily)));
}
