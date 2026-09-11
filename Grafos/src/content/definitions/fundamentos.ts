import { def, slide } from './builder';

// Definições literais de 01-graphs-concepts.pdf (Prof. Silvio Jamil), na
// ordem dos slides. Numeração "N de 28" impressa no rodapé de cada slide.
const S = (page: number, title: string) => slide('01-graphs-concepts.pdf', page, title);

export const fundamentosDefinitions = [
  def({
    id: 'grafo',
    topic: 'definicao-terminologia',
    concept: 'grafo (G = (V, E))',
    definition:
      'Grafo: coleção de vértices e arestas. Um grafo G = (V, E) em que V é o conjunto de vértices e E o conjunto de arestas, de forma que E = {(u, v) | u, v ∈ V} — grafo direcionado; E = {{u, v} | u, v ∈ V} — grafo não-direcionado.',
    keyPoints: [
      'G = (V, E): V é o conjunto de vértices, E o conjunto de arestas',
      'Direcionado: E é formado por pares ORDENADOS (u, v) — parênteses',
      'Não-direcionado: E é formado por pares NÃO-ORDENADOS {u, v} — chaves',
    ],
    intuition:
      'Pense num mapa de amizades: cada pessoa é um vértice, cada amizade é uma aresta. O grafo é só a lista de quem existe (V) e de quem se liga a quem (E). Se a ligação tem sentido único ("A segue B" no Instagram) o par é ordenado (A, B); se é mútua ("A e B são amigos no Facebook") o par é sem ordem {A, B}.',
    breakdown: [
      '"Coleção de vértices e arestas" — o grafo é só isso: coisas e ligações entre coisas.',
      '"G = (V, E)" — a notação formal que o professor usa em TODA prova. Sempre comece por ela.',
      '(u, v) vs {u, v} — a única diferença entre direcionado e não-direcionado é se a ordem do par importa.',
    ],
    example: 'V = {a, b, c}, E = {{a, b}, {b, c}} — grafo não-direcionado com 3 vértices e 2 arestas.',
    source: S(10, 'Conceitos'),
  }),
  def({
    id: 'vertice-aresta',
    topic: 'definicao-terminologia',
    concept: 'vértice e aresta',
    prompt: 'Defina vértice e aresta, conforme os slides.',
    definition: 'Vértices: objeto simples que pode ter nomes e outros atributos. Arestas: conexão entre dois vértices.',
    keyPoints: ['Vértice: objeto simples, pode ter nome e outros atributos', 'Aresta: conexão entre DOIS vértices'],
    intuition:
      'Vértice é a "bolinha", aresta é o "risquinho". A bolinha pode carregar etiqueta (nome, peso, cor); o risquinho existe só para ligar duas bolinhas.',
    example: 'No problema das casas: vértices são casas e serviços; arestas são as tubulações entre eles (slide 11).',
    source: S(10, 'Conceitos'),
  }),
  def({
    id: 'grafo-direcionado',
    topic: 'definicao-terminologia',
    concept: 'grafo direcionado',
    definition: 'Um grafo direcionado é um par G = (V, E), em que V é um conjunto finito e E é uma relação binária em V.',
    keyPoints: ['É um par G = (V, E)', 'V é um conjunto FINITO', 'E é uma RELAÇÃO BINÁRIA em V (conjunto de pares ordenados)'],
    intuition:
      'Ruas de mão única: você pode ir de A para B sem poder voltar de B para A. "Relação binária em V" é só o jeito matemático de dizer "um conjunto de pares ordenados de vértices".',
    breakdown: [
      '"V finito" — o professor deixa explícito: não trabalhamos com infinitos vértices.',
      '"Relação binária em V" — subconjunto de V × V; cada par (u, v) é uma seta de u para v.',
    ],
    example: 'V = {A, B, C}, E = {(A, B), (B, C), (C, A)} — três setas formando um ciclo direcionado.',
    source: S(13, 'Conceitos'),
  }),
  def({
    id: 'grafo-nao-direcionado',
    topic: 'definicao-terminologia',
    concept: 'grafo não direcionado',
    definition:
      'Um grafo não direcionado é um par G = (V, E) em que o conjunto de arestas E consiste em pares de vértices não orientados. As arestas (vi, vj) e (vj, vi) são consideradas a mesma aresta.',
    keyPoints: ['Par G = (V, E)', 'E consiste em pares de vértices NÃO orientados', '(vi, vj) e (vj, vi) são a MESMA aresta'],
    intuition:
      'Rua de mão dupla: a ligação A–B é a mesma coisa que B–A. Por isso, no não-direcionado, contar (A, B) e (B, A) como duas arestas é erro — é uma só.',
    example: '{a, b} e {b, a} são a mesma aresta; a matriz de adjacência de um grafo não direcionado é simétrica.',
    source: S(13, 'Conceitos'),
  }),
  def({
    id: 'laco',
    topic: 'definicao-terminologia',
    concept: 'laço (loop)',
    definition: 'Loop (laço): uma aresta associada ao par de vértices (vi, vi).',
    keyPoints: ['É uma ARESTA', 'Os dois extremos são o MESMO vértice: par (vi, vi)'],
    intuition:
      'Uma estrada que sai da cidade e volta para a mesma cidade sem passar por nenhuma outra. O vértice "aperta a própria mão" — e por isso, no grau, o laço conta duas vezes (as duas pontas tocam o mesmo vértice).',
    example: 'Aresta (A, A): parte de A e chega em A.',
    source: S(15, 'Terminologia'),
  }),
  def({
    id: 'arestas-paralelas',
    topic: 'definicao-terminologia',
    concept: 'arestas paralelas',
    definition: 'Arestas paralelas: quando mais de uma aresta está associada ao mesmo par de vértices.',
    keyPoints: ['Mais de UMA aresta', 'Associadas ao MESMO par de vértices'],
    intuition:
      'Duas pontes diferentes ligando as mesmas duas ilhas (como em Königsberg). Cada ponte é uma aresta; como as duas ligam o mesmo par, são paralelas.',
    example: 'E = {e1, e2} com e1 = {A, B} e e2 = {A, B}: e1 e e2 são arestas paralelas.',
    source: S(15, 'Terminologia'),
  }),
  def({
    id: 'grafo-simples',
    topic: 'definicao-terminologia',
    concept: 'grafo simples',
    definition: 'Grafo simples: um grafo que não possui loops e nem arestas paralelas.',
    keyPoints: ['NÃO possui loops (laços)', 'NÃO possui arestas paralelas'],
    intuition:
      '"Simples" = sem as duas esquisitices: nada de estrada que volta para a própria cidade (laço) e nada de duas estradas iguais entre as mesmas cidades (paralelas). Quase toda questão de prova assume grafo simples — é o "padrão de fábrica".',
    note: 'Quando a prova diz "grafo simples", você já ganha de graça: d(v) ≤ n − 1 e |E| ≤ n(n − 1)/2. Use isso nas justificativas.',
    source: S(15, 'Terminologia'),
  }),
  def({
    id: 'vertices-adjacentes',
    topic: 'definicao-terminologia',
    concept: 'vértices adjacentes',
    definition: 'Vértices adjacentes: dois vértices são ditos adjacentes se eles são pontos finais de uma mesma aresta.',
    keyPoints: ['DOIS vértices', 'São os pontos finais (extremos) de uma MESMA aresta'],
    intuition: 'Vizinhos de porta: existe uma aresta cujas duas pontas são exatamente esses dois vértices. Adjacente = "ligado diretamente".',
    example: 'Se {a, b} ∈ E, então a e b são adjacentes.',
    source: S(15, 'Terminologia'),
  }),
  def({
    id: 'grau',
    topic: 'definicao-terminologia',
    concept: 'grau de um vértice d(v)',
    definition:
      'Grafo não direcionado — grau d(v): número de arestas que incidem em v. (Slide 24: o número de arestas incidentes a um vértice vi é chamado de grau, d(vi), do vértice i.)',
    keyPoints: ['Notação d(v)', 'Número de ARESTAS que INCIDEM em v'],
    intuition: 'Quantos "fios" saem da bolinha. Conte as arestas que tocam o vértice — isso é o grau. Cuidado: laço toca duas vezes, então conta 2.',
    example: 'Vértice ligado a três outros: d(v) = 3.',
    source: S(16, 'Terminologia'),
  }),
  def({
    id: 'grau-entrada-saida',
    topic: 'definicao-terminologia',
    concept: 'grau de entrada d⁻(v) e grau de saída d⁺(v)',
    definition:
      'Grafo direcionado — grau de entrada d⁻(v): número de arestas que chegam em v. Grau de saída d⁺(v): número de arestas que saem em v.',
    keyPoints: ['Só faz sentido em grafo DIRECIONADO', 'd⁻(v): arestas que CHEGAM em v', 'd⁺(v): arestas que SAEM de v'],
    intuition:
      'Instagram: d⁻(v) é quantos seguem você (setas chegando), d⁺(v) é quantos você segue (setas saindo). O sinal ajuda: menos = entra, mais = sai.',
    example: 'Setas (a, v), (b, v), (v, c): d⁻(v) = 2, d⁺(v) = 1.',
    source: S(16, 'Terminologia'),
  }),
  def({
    id: 'laco-conta-duas-vezes',
    topic: 'definicao-terminologia',
    concept: 'contagem do laço no grau',
    prompt: 'Como um laço é contado no grau de um vértice, segundo o slide?',
    definition: 'Um laço conta duas vezes para o grau de um vértice.',
    keyPoints: ['Laço conta DUAS vezes', 'Motivo: as duas pontas da aresta incidem no mesmo vértice'],
    intuition:
      'O grau conta PONTAS de aresta tocando o vértice, não arestas. Um laço tem duas pontas e as duas tocam o mesmo vértice — logo +2. É isso que mantém válida a regra "soma dos graus = 2|E|".',
    example: 'Vértice com um laço e mais uma aresta comum: d(v) = 2 + 1 = 3.',
    source: S(16, 'Terminologia'),
  }),
  def({
    id: 'sequencia-de-graus',
    topic: 'definicao-terminologia',
    concept: 'sequência de graus',
    definition: 'Sequência de graus: escrever o grau de todos os vértices em ordem não-decrescente.',
    keyPoints: ['Grau de TODOS os vértices', 'Em ordem NÃO-DECRESCENTE (do menor para o maior)'],
    intuition:
      'É o "raio-X" do grafo em uma linha de números. Ordenar do menor para o maior é o que permite comparar dois grafos rapidamente (isomorfismo) e checar se uma sequência pode existir (soma par? maior valor ≤ n − 1?).',
    example: 'Graus 2, 3, 1, 2 → sequência de graus: 1, 2, 2, 3.',
    source: S(16, 'Terminologia'),
  }),
  def({
    id: 'arestas-adjacentes',
    topic: 'definicao-terminologia',
    concept: 'arestas adjacentes',
    definition: 'Duas arestas não paralelas são adjacentes se elas são incidentes a um vértice comum.',
    keyPoints: ['Duas arestas NÃO PARALELAS', 'Incidentes a um vértice COMUM'],
    intuition: 'Duas ruas que se encontram na mesma esquina. A ressalva "não paralelas" existe porque paralelas compartilham as DUAS esquinas — o professor separa os dois casos.',
    example: 'a = {1, 2} e b = {2, 3} compartilham o vértice 2 → adjacentes.',
    source: S(17, 'Terminologia'),
  }),
  def({
    id: 'aresta-incidente',
    topic: 'definicao-terminologia',
    concept: 'aresta incidente',
    definition: 'Quando um vértice v é o vértice final de alguma aresta e = uv, é dito que e é incidente em v a partir de u.',
    keyPoints: ['v é vértice FINAL da aresta e = uv', 'e é incidente EM v A PARTIR DE u'],
    intuition: '"Incidir" = tocar/chegar. A aresta uv "toca" v vindo de u. É a relação básica entre uma aresta e seus extremos — grau é só contar quantas arestas incidem.',
    source: S(17, 'Terminologia'),
  }),
  def({
    id: 'grafo-regular',
    topic: 'definicao-terminologia',
    concept: 'grafo regular',
    definition: 'Um grafo no qual todos os vértices possuem o mesmo grau é chamado de grafo regular.',
    keyPoints: ['TODOS os vértices', 'Possuem o MESMO grau'],
    intuition:
      'Roda de amigos onde cada um conhece exatamente o mesmo número de pessoas. Se todo mundo tem grau k, o grafo é "k-regular". Kn é (n−1)-regular; um ciclo é 2-regular.',
    note: 'Pergunta clássica de prova: "pode existir grafo regular com n = 15 e grau 3?" — use Σd(v) = 2|E|: 15 × 3 = 45 é ímpar, logo impossível.',
    example: 'Ciclo com 4 vértices: todos têm grau 2 → regular.',
    source: S(17, 'Terminologia'),
  }),
  def({
    id: 'vertice-isolado',
    topic: 'definicao-terminologia',
    concept: 'vértice isolado',
    definition: 'Um vértice com nenhuma aresta incidente é chamado de vértice isolado.',
    keyPoints: ['NENHUMA aresta incidente', 'Equivale a grau 0'],
    intuition: 'Ilha sem ponte. Ninguém chega, ninguém sai. Um grafo nulo é só um monte de ilhas.',
    source: S(18, 'Terminologia'),
  }),
  def({
    id: 'vertice-pendente',
    topic: 'definicao-terminologia',
    concept: 'vértice pendente',
    definition: 'Um vértice com grau 1 é chamado de vértice pendente.',
    keyPoints: ['Grau exatamente 1'],
    intuition: 'Está "pendurado" por um único fio. Se cortar aquela aresta, ele vira isolado. Em árvores, esses são as folhas.',
    example: 'a — b — c: a e c são pendentes (grau 1); b não (grau 2).',
    source: S(18, 'Terminologia'),
  }),
  def({
    id: 'grafo-nulo',
    topic: 'definicao-terminologia',
    concept: 'grafo nulo',
    definition: 'Um grafo sem nenhuma aresta é chamado de grafo nulo. Todos os vértices em um grafo nulo são vértices isolados.',
    keyPoints: ['SEM nenhuma aresta', 'Todos os vértices são isolados'],
    intuition: 'Tem vértices, mas zero ligações — só bolinhas soltas. Não confunda com "grafo vazio" (sem vértices): nulo TEM vértices, só não tem arestas.',
    example: 'Nn: n vértices, |E| = 0.',
    source: S(18, 'Terminologia'),
  }),
  def({
    id: 'grafo-rotulado',
    topic: 'definicao-terminologia',
    concept: 'grafo rotulado',
    definition: 'Um grafo G = (V, A) é dito ser rotulado em vértices (ou arestas) quando a cada vértice (ou aresta) estiver associado um rótulo.',
    keyPoints: ['Rotulado em vértices OU em arestas', 'A cada vértice (ou aresta) está associado um RÓTULO'],
    intuition: 'Etiqueta com nome. "AED", "PAA", "GRAFOS" nos vértices do slide são rótulos. Rótulo é identificação, não número — número é o caso "valorado".',
    source: S(19, 'Grafos valorado e rotulado'),
  }),
  def({
    id: 'grafo-valorado',
    topic: 'definicao-terminologia',
    concept: 'grafo valorado',
    definition: 'Um grafo G = (V, A) é dito ser valorado quando existe uma ou mais funções relacionando V e/ou A com um conjunto de números.',
    keyPoints: ['Existe uma ou mais FUNÇÕES', 'Relacionando V e/ou A com um conjunto de NÚMEROS'],
    intuition:
      'Mapa com distâncias nas estradas: cada aresta (ou vértice) recebe um número via uma função peso. É a base de "caminho mínimo". A palavra do professor é "valorado", não "ponderado" — use a dele.',
    example: 'Slide 19: arestas com valores 20, 5, 30, 50.',
    source: S(19, 'Grafos valorado e rotulado'),
  }),
  def({
    id: 'grafo-completo',
    topic: 'definicao-terminologia',
    concept: 'grafo completo Kn',
    prompt: 'Defina grafo completo Kn e dê o número de arestas em função de n.',
    definition:
      'Um grafo G = (V, E) é completo se para cada par de vértices vi e vj existe uma aresta entre vi e vj. Em um grafo completo quaisquer dois vértices distintos são adjacentes (Kn). Seja Kn um grafo completo com n vértices: |E| = (n − 1) × n / 2.',
    keyPoints: ['Para CADA par de vértices existe uma aresta', 'Quaisquer dois vértices distintos são adjacentes', 'Notação Kn', '|E| = n(n − 1)/2'],
    intuition:
      'Festa onde todo mundo cumprimentou todo mundo. Cada um dos n aperta n − 1 mãos; cada aperto envolve duas pessoas, então divide por 2: n(n−1)/2. Kn é o "máximo de arestas" de um grafo simples — aparece em toda questão de "número máximo".',
    example: 'K4: 4 × 3 / 2 = 6 arestas. K5: 10 arestas.',
    source: S(20, 'Terminologia'),
  }),

  // ---- Walk / Trail / Path / Cycle — o professor define em inglês (slide 21) ----
  def({
    id: 'walk',
    topic: 'passeios-caminhos-ciclos',
    concept: 'walk (passeio)',
    definition:
      'Walk: a walk in G = (V, E) is a finite non-null sequence W = v0 e1 v1 e2 … ek vk whose terms are alternately vertices and edges, such that, for 1 ≤ i ≤ k, the ends of ei are vi−1 and vi. We say that W is a walk from v0 (origin) to vk (terminus).',
    keyPoints: [
      'Sequência FINITA e não-nula',
      'Termos ALTERNADOS: vértice, aresta, vértice, aresta…',
      'Cada aresta ei tem extremos vi−1 e vi (liga o anterior ao próximo)',
      'v0 é a origem, vk o término — NENHUMA restrição de repetição',
    ],
    intuition:
      'Um passeio de domingo sem regras: você pode passar pela mesma rua duas vezes, voltar na mesma praça, dar voltas. É a definição mais permissiva — Trail e Path são walks com restrições em cima.',
    breakdown: [
      '"alternately vertices and edges" — a sequência lista por onde você passou E por qual aresta.',
      '"ends of ei are vi−1 and vi" — garante que cada aresta realmente liga os vértices vizinhos na sequência (não pode "teleportar").',
    ],
    example: 'Slide 21: walk 5 a 2 f 3 f 2 g 3 h 4 b 2 — repete aresta f e vértices 2 e 3.',
    note: 'Os slides usam as palavras em inglês (Walk/Trail/Path/Cycle). Na prova, pode escrever passeio/trilha/caminho/ciclo, mas se citar o termo do slide, use o inglês.',
    source: S(21, 'Terminology'),
  }),
  def({
    id: 'trail',
    topic: 'passeios-caminhos-ciclos',
    concept: 'trail (trilha)',
    definition: 'Trail: a trail is a walk in G = (V, E) if the edges of W are distinct.',
    keyPoints: ['É um WALK', 'As ARESTAS são distintas (nenhuma aresta repetida)', 'Vértices PODEM repetir'],
    intuition:
      'Trilha de carimbos: cada ponte só pode ser atravessada uma vez (Königsberg!), mas você pode voltar à mesma ilha várias vezes. Restringe arestas, libera vértices.',
    example: 'Slide 21: trail 4 c 1 d 3 h 4 b 2 g 3 — vértice 3 e 4 repetem, nenhuma aresta repete.',
    source: S(21, 'Terminology'),
  }),
  def({
    id: 'path',
    topic: 'passeios-caminhos-ciclos',
    concept: 'path (caminho)',
    definition: 'Path: a path is a trail in G = (V, E) if the vertices of W are distinct.',
    keyPoints: ['É um TRAIL (logo, arestas distintas)', 'Os VÉRTICES são distintos (nenhum vértice repetido)'],
    intuition:
      'Viagem sem voltar a nenhuma cidade: se não repete vértice, automaticamente não repete aresta. Path ⊂ Trail ⊂ Walk — cada nível adiciona uma proibição.',
    example: 'Slide 21: path 1 c 4 h 3 e 5 a 2 — tudo distinto.',
    note: 'ATENÇÃO — conflito interno dos slides: o slide 14 do deck 05 ("Caminhos e circuitos") define "Caminho" como sequência de arestas SEM ARESTA repetida (= Trail daqui). Se a questão der a definição, use a dela; se não, diga qual você está usando.',
    source: S(21, 'Terminology'),
  }),
  def({
    id: 'cycle',
    topic: 'passeios-caminhos-ciclos',
    concept: 'cycle (ciclo)',
    definition: 'Cycle: a cycle is a closed path — origin and terminus are the same.',
    keyPoints: ['É um PATH (vértices e arestas distintos)', 'FECHADO: origem = término'],
    intuition:
      'Passeio de volta ao ponto de partida sem repetir nada no meio. A única "repetição" permitida é o vértice inicial = final. Ciclo é o que uma árvore NÃO tem.',
    example: 'Slide 21: cycle 1 c 4 b 2 a 5 e 3 d 1 — começa e termina em 1.',
    source: S(21, 'Terminology'),
  }),
  def({
    id: 'grafo-conexo',
    topic: 'passeios-caminhos-ciclos',
    concept: 'grafo conexo',
    definition: 'Grafo conexo: existe pelo menos um caminho entre todos os pares de vértices.',
    keyPoints: ['Pelo menos UM caminho', 'Entre TODOS os pares de vértices'],
    intuition:
      'Dá para chegar de qualquer cidade a qualquer outra por estrada (mesmo que indireta). Um pedaço solto = não conexo, e cada pedaço solto é um "componente". Mínimo de arestas para conectar n vértices: n − 1.',
    example: 'a — b — c é conexo; a — b   c (c solto) não é.',
    source: S(22, 'Terminologia'),
  }),
  def({
    id: 'grafo-bipartido',
    topic: 'passeios-caminhos-ciclos',
    concept: 'grafo bipartido',
    definition:
      'Um grafo é dito ser bipartido quando seu conjunto de vértices V puder ser particionado em dois subconjuntos V1 e V2, tais que toda aresta de G une um vértice de V1 a outro de V2.',
    keyPoints: ['V PARTICIONADO em dois subconjuntos V1 e V2', 'TODA aresta une um vértice de V1 a outro de V2', '(logo, nenhuma aresta dentro do mesmo lado)'],
    intuition:
      'Dois times: só existe ligação entre jogadores de times diferentes, nunca dentro do mesmo time. "Particionar" = separar todo mundo em exatamente um dos dois lados, sem sobra. Ciclos ímpares quebram isso — é o jeito de reconhecer um não-bipartido.',
    example: 'V1 = {1, 2}, V2 = {3, 4, 5}, arestas só cruzando os lados.',
    source: S(22, 'Terminologia'),
  }),
  def({
    id: 'bipartido-completo',
    topic: 'passeios-caminhos-ciclos',
    concept: 'grafo bipartido completo Km,n',
    prompt: 'Defina grafo bipartido completo e dê o número de arestas de Km,n.',
    definition:
      'Um grafo é dito ser bipartido completo quando seu conjunto de vértices V puder ser particionado em dois subconjuntos V1 e V2, tais que toda aresta de G une um vértice de V1 a outro de V2, e que todo vértice de V1 é adjacente a todo vértice de V2. Seja Kmn um grafo bipartido completo com n vértices em V1 e m vértices em V2: |E| = n × m.',
    keyPoints: ['É bipartido (partição V1, V2; arestas só entre lados)', 'TODO vértice de V1 é adjacente a TODO vértice de V2', 'Notação Km,n', '|E| = m × n'],
    intuition:
      'Todo jogador do time A cumprimenta todo jogador do time B. Cada um dos m de um lado liga-se aos n do outro: m × n arestas. É a base da pergunta "máximo de arestas de um bipartido com n vértices" (n²/4, lados iguais).',
    example: 'K(4,5): |E| = 20. Problema das 3 casas = K(3,3), 9 arestas.',
    source: S(23, 'Grafo bipartido completo'),
  }),

  def({
    id: 'tripartido-completo',
    topic: 'aperto-de-maos-familias',
    concept: 'grafo tripartido completo Kr,s,t',
    prompt: 'Defina grafo tripartido completo Kr,s,t e dê |V| e |E| em função de r, s e t.',
    definition:
      'O grafo tripartido completo Kr,s,t consiste de três conjuntos de vértices de tamanhos r, s e t, com arestas unindo dois vértices se e somente se eles pertencem a conjuntos distintos. |V| = r + s + t e |E| = rs + rt + st.',
    keyPoints: ['TRÊS conjuntos de vértices, de tamanhos r, s e t', 'Aresta entre dois vértices SE E SOMENTE SE estão em conjuntos distintos', '|V| = r + s + t', '|E| = rs + rt + st'],
    intuition:
      'Três times: todo mundo cumprimenta todo mundo dos OUTROS dois times, ninguém do próprio. Cada par de times gera um Km,n: r·s + r·t + s·t arestas. Generaliza o bipartido completo para três lados.',
    example: 'K2,2,2: 6 vértices, 4 + 4 + 4 = 12 arestas (é o octaedro). K2,3,3: 8 vértices, 6 + 6 + 9 = 21 arestas.',
    note: 'Definição dada no enunciado da prova 2025/1-Q3 (não está nos slides); a Lista de Exercícios 1, ex. 11, também usa Kr,s,t.',
    sourceStyle: 'old_exam',
    source: { type: 'old_exam', file: '2025-1-exam.pdf', note: 'Questão 3 — definição no próprio enunciado' },
  }),

  // ---- Propriedade de grau e operações (slides 24–28) ----
  def({
    id: 'propriedade-de-grau',
    topic: 'aperto-de-maos-familias',
    concept: 'propriedade de grau (teorema do aperto de mãos)',
    prompt: 'Enuncie a propriedade de grau (soma dos graus) conforme o slide.',
    definition:
      'A soma dos graus de todos os vértices de um grafo G é duas vezes o número de arestas de G, e portanto é par: Σ(i=1..n) d(vi) = 2e.',
    keyPoints: ['Soma dos graus de TODOS os vértices', '= 2 × número de arestas (2|E|)', 'Portanto a soma é sempre PAR'],
    intuition:
      'Cada aresta tem duas pontas, e cada ponta soma 1 ao grau de um vértice. Somar todos os graus = contar todas as pontas = 2 por aresta. É a ferramenta nº 1 das questões "é possível um grafo com…?": se a soma de graus der ímpar, impossível.',
    example: '7 vértices de grau 4: Σd = 28 = 2|E| ⇒ |E| = 14.',
    source: S(24, 'Propriedade de grau'),
  }),
  def({
    id: 'teorema-grau-impar',
    topic: 'aperto-de-maos-familias',
    concept: 'teorema do número de vértices de grau ímpar',
    prompt: 'Enuncie e justifique o teorema sobre vértices de grau ímpar (slide 24).',
    definition:
      'Teorema: o número de vértices de grau ímpar em um grafo é par. Justificativa: Σ d(vi) = Σ_{d par} d(vj) + Σ_{d ímpar} d(vk); como o total é 2e (par) e a soma dos graus pares é par, a soma dos graus ímpares também é par — o que só acontece se a quantidade de parcelas ímpares for par.',
    keyPoints: [
      'Enunciado: nº de vértices de grau ímpar é PAR',
      'Separa a soma dos graus em parcela dos pares + parcela dos ímpares',
      'Total é 2e (par) e soma de pares é par ⇒ soma dos ímpares é par',
      'Soma de ímpares só é par se houver quantidade PAR deles',
    ],
    intuition:
      'Some números ímpares: 3 + 5 = 8 (par), 3 + 5 + 7 = 15 (ímpar). Só dá par com quantidade par de parcelas. Como a soma total é forçada a ser par (2|E|), o "pedaço ímpar" precisa ter um número par de vértices.',
    source: S(24, 'Propriedade de grau'),
  }),
  def({
    id: 'uniao-de-grafos',
    topic: 'aperto-de-maos-familias',
    concept: 'união de grafos G1 ∪ G2',
    definition:
      'Sejam G1 = (V1, A1) e G2 = (V2, A2) dois grafos. O grafo G = G1 ∪ G2, que representa a união de dois grafos, é formado pelo grafo com conjunto de vértices V1 ∪ V2 e conjunto de arestas E1 ∪ E2.',
    keyPoints: ['Vértices: V1 ∪ V2', 'Arestas: E1 ∪ E2', 'Nenhuma aresta nova é criada'],
    intuition: 'Junta os dois desenhos no mesmo papel e pronto — nada a mais. Se não compartilham vértices, o resultado é desconexo (dois pedaços lado a lado).',
    note: 'Slide 27: união e soma podem ser aplicadas a qualquer número finito de grafos, são associativas e comutativas.',
    source: S(25, 'Operações sobre grafos'),
  }),
  def({
    id: 'soma-de-grafos',
    topic: 'aperto-de-maos-familias',
    concept: 'soma de grafos G1 + G2',
    definition:
      'Sejam G1 = (V1, A1) e G2 = (V2, A2) dois grafos. O grafo G = G1 + G2, que representa a soma de dois grafos, é formado por G1 ∪ G2 e de arestas ligando cada vértice de V1 a V2.',
    keyPoints: ['Começa pela UNIÃO G1 ∪ G2', 'ACRESCENTA arestas ligando cada vértice de V1 a cada vértice de V2'],
    intuition:
      'União + "todo mundo de um lado cumprimenta todo mundo do outro". A soma de dois grafos nulos vira um bipartido completo; a soma cria |V1| × |V2| arestas novas.',
    example: 'Slide 26: (1 – 2) + (1 – 2 – 3) = 5 vértices com as arestas originais mais 2 × 3 = 6 arestas cruzadas.',
    source: S(26, 'Operações sobre grafos'),
  }),
  def({
    id: 'remocao-de-aresta',
    topic: 'aperto-de-maos-familias',
    concept: 'remoção de aresta G − e',
    definition:
      'Se e é uma aresta de um grafo G, denota-se G − e o grafo obtido de G pela remoção da aresta e. Se E é um conjunto de arestas em G, denota-se G − E o grafo obtido pela remoção das arestas em E.',
    keyPoints: ['Notação G − e (uma aresta) / G − E (conjunto de arestas)', 'Remove só a(s) aresta(s); os vértices FICAM'],
    intuition: 'Apagar um risquinho sem apagar as bolinhas. Os extremos continuam existindo (talvez virando pendentes ou isolados).',
    source: S(28, 'Remoção de aresta e de vértice'),
  }),
  def({
    id: 'remocao-de-vertice',
    topic: 'aperto-de-maos-familias',
    concept: 'remoção de vértice G − v',
    definition:
      'Se v é um vértice de um grafo G, denota-se por G − v o grafo obtido de G pela remoção do vértice v conjuntamente com as arestas incidentes a v. Denota-se G − S o grafo obtido pela remoção dos vértices em S, sendo S um conjunto qualquer de vértices de G.',
    keyPoints: ['Notação G − v / G − S', 'Remove o vértice E TODAS as arestas incidentes a ele'],
    intuition: 'Apagar a bolinha leva junto todos os fios ligados nela — não pode sobrar aresta "solta" com uma ponta no nada.',
    source: S(28, 'Remoção de aresta e de vértice'),
  }),
  def({
    id: 'contracao-de-aresta',
    topic: 'aperto-de-maos-familias',
    concept: 'contração de aresta G/e',
    definition:
      'Denota-se por G/e o grafo obtido pela contração da aresta e. Remova e = (v, w) de G e una suas extremidades v e w de tal forma que o vértice resultante seja incidente às arestas originalmente incidentes a v e w.',
    keyPoints: ['Notação G/e', 'Remove a aresta e = (v, w)', 'UNE v e w em um único vértice', 'O novo vértice herda TODAS as arestas que incidiam em v ou em w'],
    intuition:
      'Encurtar a estrada até as duas cidades virarem uma só: a nova cidade fica com todas as estradas que as duas tinham. É a operação usada para "esmagar" um ciclo num hipervértice ao achar base de grafo dirigido.',
    source: S(28, 'Remoção de aresta e de vértice'),
  }),
];
