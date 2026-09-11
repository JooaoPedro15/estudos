import { def, slide } from './builder';

// Definições literais de 05-graphs-isomorphism-and-concepts.pdf ("N de 16").
const S = (page: number, title: string) => slide('05-graphs-isomorphism-and-concepts.pdf', page, title);

export const isomorfismoDefinitions = [
  def({
    id: 'isomorfismo',
    topic: 'isomorfismo',
    concept: 'isomorfismo de grafos',
    definition:
      'Dois grafos G e H são ditos isomorfos se existir uma correspondência um-para-um entre seus vértices e entre suas arestas, de maneira que as relações de incidência são preservadas.',
    keyPoints: ['Correspondência UM-PARA-UM entre os vértices', 'Correspondência um-para-um entre as arestas', 'As relações de INCIDÊNCIA são preservadas'],
    intuition:
      'Mesmo grafo, desenhado diferente. Se você consegue renomear os vértices de um para virar exatamente o outro (quem era vizinho continua vizinho), são isomorfos. "Um-para-um" = bijeção: cada vértice de G vira exatamente um de H e vice-versa.',
    breakdown: [
      '"correspondência um-para-um" — uma função bijetora f: V(G) → V(H).',
      '"relações de incidência preservadas" — {u, v} é aresta em G ⟺ {f(u), f(v)} é aresta em H.',
    ],
    note: 'Prova 2022/1-Q3 (30%): "transponha a definição de isomorfismo para grafos direcionados" — a diferença é preservar pares ORDENADOS: (u, v) ∈ E(G) ⟺ (f(u), f(v)) ∈ E(H).',
    source: S(3, 'Isomorfismo'),
  }),
  def({
    id: 'condicoes-necessarias-isomorfismo',
    topic: 'isomorfismo',
    concept: 'condições necessárias (mas não suficientes) para isomorfismo',
    prompt: 'Quais são as condições necessárias, mas não suficientes, para que G e H sejam isomorfos?',
    definition:
      'Condições necessárias mas não suficientes para que G e H sejam isomorfos: mesmo número de vértices; mesmo número de arestas; mesmo número de componentes; mesmo número de vértices com o mesmo grau. Não existe um algoritmo eficiente para determinar se dois grafos são isomorfos.',
    keyPoints: ['Mesmo nº de vértices', 'Mesmo nº de arestas', 'Mesmo nº de componentes', 'Mesma sequência de graus (mesmo nº de vértices com cada grau)', 'São NECESSÁRIAS, não suficientes'],
    intuition:
      'Check-list de eliminação rápida: se qualquer item falha, NÃO são isomorfos (fim). Se todos passam, ainda não prova nada — o slide 7/8 mostra dois grafos com tudo igual que não são isomorfos porque a VIZINHANÇA difere. "Necessário" = precisa ter; "suficiente" = garantiria.',
    example: 'Slide 5: graus 2 2 2 3 4 vs 1 2 3 3 3 → sequências diferentes → não isomorfos.',
    source: S(4, 'Isomorfismo'),
  }),
  def({
    id: 'grafo-complementar',
    topic: 'complemento-subgrafo',
    concept: 'grafo complementar C(G) ou Ḡ',
    definition:
      'Seja G = (V, E) um grafo simples dirigido ou não-dirigido. O grafo complementar de G, denotado por C(G) ou Ḡ, é um grafo formado da seguinte maneira: os vértices de C(G) são todos os vértices de G; as arestas de C(G) são exatamente as arestas que faltam em G para formarmos um grafo completo.',
    keyPoints: ['G precisa ser SIMPLES (dirigido ou não)', 'Notação C(G) ou Ḡ', 'Mesmos vértices de G', 'Arestas: exatamente as que FALTAM em G para virar completo'],
    intuition:
      '"Negativo da foto": onde tinha aresta, tira; onde não tinha, põe. Por isso |E(G)| + |E(Ḡ)| = n(n−1)/2 — os dois juntos formam Kn. É a base das questões de auto-complementar.',
    example: 'G = caminho a–b–c: Ḡ tem só a aresta {a, c}.',
    source: S(10, 'Grafo complementar'),
  }),
  def({
    id: 'auto-complementar',
    topic: 'complemento-subgrafo',
    concept: 'grafo auto-complementar',
    definition:
      'Um grafo é auto-complementar quando é isomorfo ao seu complemento (slide 10, Exemplo 1: "encontre um grafo com 5 vértices que seja isomorfo a seu complemento"). Consequência cobrada nas provas: como |E(G)| = |E(Ḡ)| e |E(G)| + |E(Ḡ)| = n(n−1)/2, tem-se |E(G)| = n(n−1)/4 — logo n(n−1) precisa ser divisível por 4, o que só ocorre para n = 4k ou n = 4k + 1.',
    keyPoints: ['Isomorfo ao próprio complemento', '|E(G)| = |E(Ḡ)| ⇒ |E| = n(n − 1)/4', 'n(n − 1) divisível por 4 ⇒ n = 4k ou 4k + 1'],
    intuition:
      'O negativo da foto é a própria foto (a menos de renomear). Como G e Ḡ dividem Kn meio a meio, cada um leva metade das n(n−1)/2 arestas. Metade de metade precisa ser inteiro — daí o "divisível por 4".',
    example: 'C5 (ciclo de 5) é auto-complementar: 5 × 4 / 4 = 5 arestas. P4 (caminho de 4) também: 4 × 3 / 4 = 3.',
    note: 'O termo "auto-complementar" vem das provas; o slide 10 só diz "isomorfo a seu complemento". A prova 2023/1-Q3 define: "o complemento de G, denotado por Ḡ = (V′, E′), é definido por V′ = V e E′ = {{u, v} | {u, v} ∉ E}; um grafo é dito auto-complementar se é isomorfo ao seu complemento" e pede para provar que tem 4k ou 4k + 1 vértices. A 2025/1-Q2 pergunta "é correto afirmar que o número de arestas de um grafo auto-complementar é divisível por 4?" — NÃO: |E| = n(n − 1)/4, e C5 tem 5 arestas; o que é divisível por 4 é n(n − 1).',
    sourceStyle: 'old_exam',
    source: { type: 'old_exam', file: '2023-1-exam.pdf', note: 'Q3; também 2022/2-Q4 e 2025/1-Q2 — definição no slide 10 do deck 05 (Exemplo 1)' },
  }),
  def({
    id: 'subgrafo',
    topic: 'complemento-subgrafo',
    concept: 'subgrafo',
    definition:
      'Um grafo G1 = (V1, A1) é dito ser subgrafo de um grafo G = (V, A) quando V1 ⊂ V e A1 ⊂ A. (Slide 12: um grafo H é dito ser um subgrafo de um grafo G, H ⊆ G, se todos os vértices e todas as arestas de H estão em G.)',
    keyPoints: ['Notação H ⊆ G', 'V1 ⊂ V (vértices do subgrafo estão em G)', 'A1 ⊂ A (arestas do subgrafo estão em G)'],
    intuition:
      'Pedaço recortado do desenho original: pode tirar vértices e arestas à vontade, desde que não INVENTE nada e não deixe aresta com ponta solta. Todo subconjunto de vértices + qualquer subconjunto das arestas entre eles é um subgrafo.',
    example: 'Slide 12: H = {1, 2, 3, 4} com algumas arestas ⊆ G = {1, …, 5}.',
    note: 'Questão recorrente (2022/2, 2024/1, 2024/2, 2026/1): número de subgrafos de Kn = Σ(i=1..n) C(n, i) · 2^(i(i−1)/2) — escolhe i vértices, depois qualquer subconjunto das i(i−1)/2 arestas entre eles.',
    source: S(11, 'Subgrafo'),
  }),
  def({
    id: 'subgrafo-induzido',
    topic: 'complemento-subgrafo',
    concept: 'subgrafo induzido',
    definition:
      'Se G2 = (V2, A2) é um subgrafo de G1 = (V1, A1) e possui toda aresta (v, w) de G1 tal que ambos, v e w, estejam em V2, então G2 é o subgrafo induzido pelo subconjunto de vértices V2.',
    keyPoints: ['É um subgrafo', 'Contém TODA aresta de G1 cujos dois extremos estão em V2', 'Induzido PELO subconjunto de vértices V2'],
    intuition:
      'Você escolhe só os vértices; as arestas vêm "de brinde", obrigatoriamente todas as que ligam vértices escolhidos. Não pode deixar nenhuma de fora — diferente do subgrafo comum, que pode.',
    example: 'Slide 11: subgrafo induzido por {1, 2, 3, 4} — todas as arestas entre esses quatro, nenhuma a menos.',
    source: S(11, 'Subgrafo'),
  }),
  def({
    id: 'propriedades-de-subgrafo',
    topic: 'complemento-subgrafo',
    concept: 'propriedades de subgrafo (slide 12)',
    prompt: 'Liste as quatro propriedades de subgrafo apresentadas no slide 12.',
    definition:
      'Todo grafo é subgrafo de si próprio; o subgrafo de um subgrafo de G é subgrafo de G; um vértice simples de G é um subgrafo de G; uma aresta simples de G (juntamente com suas extremidades) é subgrafo de G.',
    keyPoints: ['Todo grafo é subgrafo de si próprio', 'Subgrafo de subgrafo de G é subgrafo de G (transitividade)', 'Um vértice sozinho é subgrafo', 'Uma aresta com suas duas extremidades é subgrafo'],
    intuition:
      'Subgrafo funciona como ⊆ de conjuntos: reflexivo (A ⊆ A), transitivo, e os "átomos" (um vértice; uma aresta com pontas) são os menores subgrafos possíveis. As duas últimas são o que garante que a contagem de subgrafos de Kn inclui os casos i = 1 e i = 2.',
    source: S(12, 'Subgrafo'),
  }),
  def({
    id: 'subgrafos-disjuntos-de-arestas',
    topic: 'complemento-subgrafo',
    concept: 'subgrafos disjuntos de arestas',
    definition:
      'Subgrafos disjuntos de arestas: dois (ou mais) subgrafos G1 e G2 de um grafo G são disjuntos de arestas se G1 e G2 não tiverem nenhuma aresta em comum. (Eles PODEM ter vértices em comum.)',
    keyPoints: ['Dois ou mais subgrafos do mesmo G', 'NENHUMA aresta em comum', 'Podem compartilhar vértices'],
    intuition: 'Duas rotas de ônibus que passam pelas mesmas paradas mas nunca pelo mesmo trecho de rua. Paradas (vértices) podem coincidir; trechos (arestas) não.',
    source: S(13, 'Subgrafo'),
  }),
  def({
    id: 'subgrafos-disjuntos-de-vertices',
    topic: 'complemento-subgrafo',
    concept: 'subgrafos disjuntos de vértices',
    definition:
      'Subgrafos disjuntos de vértices: dois (ou mais) subgrafos G1 e G2 de um grafo G são disjuntos de vértices se G1 e G2 não tiverem nenhum vértice em comum. (Consequentemente não têm arestas em comum.)',
    keyPoints: ['Dois ou mais subgrafos do mesmo G', 'NENHUM vértice em comum', 'Logo, também nenhuma aresta em comum'],
    intuition: 'Bairros separados: se não dividem nenhuma esquina, não podem dividir nenhuma rua. Disjunto de vértices é mais forte que disjunto de arestas.',
    source: S(13, 'Subgrafo'),
  }),

  // ---- Caminhos e circuitos (slide 14–15) — vocabulário alternativo do professor ----
  def({
    id: 'sequencia-de-arestas',
    topic: 'passeios-caminhos-ciclos',
    concept: 'sequência de arestas',
    definition:
      'Sequência de arestas: sequência alternada de vértices e arestas começando e terminando com vértice. Cada aresta é incidente ao vértice que a precede e ao que a antecede. Ex.: v1 a v2 a v1 g v3.',
    keyPoints: ['Sequência ALTERNADA de vértices e arestas', 'Começa e termina com VÉRTICE', 'Cada aresta é incidente aos vértices vizinhos na sequência'],
    intuition:
      'É o "Walk" do slide 21 do deck 01 dito em português: um trajeto anotado passo a passo (vértice, aresta, vértice…), sem nenhuma proibição — o exemplo do slide repete a aresta "a".',
    source: S(14, 'Caminhos e circuitos'),
  }),
  def({
    id: 'caminho-slide-05',
    topic: 'passeios-caminhos-ciclos',
    concept: 'caminho (definição do deck 05, "Caminhos e circuitos")',
    definition:
      'Caminho: sequência de arestas na qual nenhuma aresta aparece mais de uma vez. Ex.: v1 a v2 b v3 c v3 d v4 e v2 f v5.',
    keyPoints: ['É uma sequência de arestas', 'NENHUMA aresta aparece mais de uma vez', 'Vértices PODEM repetir (o exemplo repete v3 e v2)'],
    intuition:
      'Aqui "caminho" proíbe só repetir aresta — é exatamente o Trail do deck 01. O exemplo do slide passa por v3 duas vezes (laço c) e volta em v2, o que um Path (vértices distintos) não permitiria.',
    note: 'CONFLITO ENTRE SLIDES: deck 01 (slide 21) — Path = trail com vértices distintos; deck 05 (slide 14) — Caminho = sem aresta repetida. Na prova, se o enunciado não definir, declare qual definição está usando ("caminho no sentido de trilha, sem repetir aresta" ou "caminho simples, sem repetir vértice").',
    source: S(14, 'Caminhos e circuitos'),
  }),
  def({
    id: 'caminho-aberto-fechado',
    topic: 'passeios-caminhos-ciclos',
    concept: 'caminho aberto e caminho fechado',
    definition:
      'Caminho aberto: o vértice inicial é diferente do vértice final. Ex.: v1 a v2 b v3 c v3. Caminho fechado: caminhos que começam e terminam no mesmo vértice. Ex.: v1 a v2 b v3 c v3 g v1.',
    keyPoints: ['Aberto: vértice inicial ≠ vértice final', 'Fechado: começa e termina no MESMO vértice'],
    intuition: 'Aberto = viagem só de ida; fechado = ida e volta ao ponto de partida. "Circuito" e "ciclo" são caminhos fechados com restrições extras.',
    source: S(14, 'Caminhos e circuitos'),
  }),
  def({
    id: 'cadeia',
    topic: 'passeios-caminhos-ciclos',
    concept: 'cadeia',
    definition: 'Seja G um grafo dirigido e G′ o seu grafo não-dirigido associado. Uma cadeia em G é um caminho em G′.',
    keyPoints: ['G é DIRIGIDO; G′ é o não-dirigido associado (mesmas arestas, sem setas)', 'Cadeia em G = caminho em G′', 'Ou seja: ignora o sentido das setas'],
    intuition:
      'Andar pelas ruas ignorando as placas de mão única. Uma cadeia liga vértices "fisicamente", mesmo que as setas não permitam percorrer. Serve para falar de conectividade fraca em grafo dirigido.',
    example: 'Slide 15: g-a-f é um caminho de G′ e uma cadeia em G.',
    source: S(15, 'Cadeias'),
  }),

  // ---- Teoremas de contagem (slide 16) ----
  def({
    id: 'teorema-maximo-arestas',
    topic: 'teoremas-contagem',
    concept: 'teorema do número máximo de arestas com n vértices e k componentes',
    prompt: 'Enuncie o teorema do número MÁXIMO de arestas de um grafo simples com n vértices e k componentes.',
    definition: 'Teorema: um grafo simples com n vértices e k componentes possui no máximo (n − k)(n − k + 1)/2 arestas.',
    keyPoints: ['Grafo SIMPLES', 'n vértices e k componentes', 'Máximo = (n − k)(n − k + 1)/2'],
    intuition:
      'Para maximizar arestas, deixe k − 1 componentes como vértices isolados e concentre os n − k + 1 vértices restantes em um único grafo completo: K(n−k+1) tem (n−k+1)(n−k)/2 arestas. Espalhar vértices entre componentes só perde arestas.',
    example: 'Slide 16: n = 6, k = 2 ⇒ 4 × 5 / 2 = 10 (K5 + um vértice isolado).',
    note: 'Aparece em 4 das 8 provas como "é possível um grafo com n vértices, k componentes e X arestas?" — compare X com o máximo e o mínimo.',
    source: S(16, 'Caminhos e circuitos'),
  }),
  def({
    id: 'teorema-minimo-arestas',
    topic: 'teoremas-contagem',
    concept: 'teorema do número mínimo de arestas com n vértices e k componentes',
    prompt: 'Enuncie o teorema do número MÍNIMO de arestas de um grafo simples com n vértices e k componentes.',
    definition: 'Teorema: o número mínimo de arestas de um grafo simples com n vértices e k componentes é n − k.',
    keyPoints: ['Grafo simples, n vértices, k componentes', 'Mínimo = n − k'],
    intuition:
      'Cada componente conexo com ni vértices precisa de pelo menos ni − 1 arestas (uma árvore). Somando sobre os k componentes: Σ(ni − 1) = n − k. Menos que isso, algum componente se parte em dois.',
    example: 'Slide 16: n = 6, k = 2 ⇒ 4 arestas; k = 6 ⇒ 0 arestas; k = 1 ⇒ 5 arestas.',
    source: S(16, 'Caminhos e circuitos'),
  }),
];
