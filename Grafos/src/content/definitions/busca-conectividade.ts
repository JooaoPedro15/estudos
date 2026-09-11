import type { Source } from '@/content/types';
import { def } from './builder';

// Estes tópicos NÃO têm slide dedicado nos decks 00–07: foram ensinados em
// aula (fotos do quadro), no aulão de monitoria ("Flash Cards Grafos-1.pdf",
// que cita "Fonte: Jamil, Silvio" para base/anti-base) e no resumo de aluna
// rotulado "prova 1". Cada definição diz de onde veio; quando é paráfrase do
// resumo (manuscrito), a redação foi normalizada sem acrescentar conteúdo.
const AULAO = (page: number, title: string): Source => ({
  type: 'professor_support_material',
  file: 'Flash Cards Grafos-1.pdf',
  page,
  note: `Aulão TGC: Primeira Prova (monitor Fernando Dal'Maria) — ${title}`,
});
const RESUMO = (page: number, title: string): Source => ({
  type: 'professor_support_material',
  file: 'Resumo Prova 1 Grafos.pdf',
  page,
  note: `Resumo de Grafos (prova 1), aluna Sophia Carrazza — ${title}`,
});
const QUADRO = (file: string, title: string): Source => ({ type: 'professor_board', file, note: title });

export const buscaConectividadeDefinitions = [
  def({
    id: 'busca-em-largura',
    topic: 'bfs',
    concept: 'busca em largura (BFS)',
    prompt: 'Descreva a busca em largura (ideia central e passos), conforme o aulão.',
    definition:
      'Considere G = (V, E) um grafo conexo. A ideia central do algoritmo de busca em largura é explorar todos os vértices de um mesmo nível de proximidade antes de passar para os vértices do próximo nível. A busca começa em um vértice s pertencente a V e segue para todos os vértices adjacentes antes de mover-se para os vértices do próximo nível. Considere S um conjunto e Q uma fila que inicialmente contêm apenas s. Enquanto S for diferente de V: (1) desenfileire o próximo vértice da fila, v; (2) para cada vizinho u de v, caso u não esteja contido em S, adicione-o em S e enfileire-o em Q.',
    keyPoints: [
      'Explora todos os vértices de um MESMO NÍVEL antes do próximo nível',
      'Começa em s; usa conjunto S (visitados) e FILA Q, ambos iniciando com s',
      'Repete enquanto S ≠ V: desenfileira v',
      'Para cada vizinho u de v fora de S: adiciona u em S e enfileira u',
    ],
    intuition:
      'Onda na água: a partir da pedra (s) o círculo cresce camada por camada — primeiro todos a distância 1, depois todos a distância 2… A FILA garante isso: quem foi descoberto antes é atendido antes. Por isso BFS dá o menor número de arestas até cada vértice (base de excentricidade/diâmetro).',
    example: 'Resumo, p.3: fila começa com v; distância de v = 0; cada vizinho não visitado entra no fim da fila com distância +1.',
    sourceStyle: 'board',
    source: AULAO(3, 'Busca em Largura (cita Kleinberg & Tardos, p. 79)'),
  }),
  def({
    id: 'busca-em-profundidade',
    topic: 'dfs-classificacao',
    concept: 'busca em profundidade (DFS)',
    prompt: 'Descreva a busca em profundidade (ideia central e passos), conforme o aulão.',
    definition:
      'Considere G = (V, E) um grafo conexo. A ideia central do algoritmo é explorar o máximo possível ao longo de cada ramificação antes de retroceder. A busca começa em um vértice s pertencente a V e se aprofunda no grafo até que todos os vértices de V tenham sido atingidos. Considere S um conjunto que se inicia com s; enquanto S for diferente de V: (1) a partir de s, siga para um vértice vizinho u que não esteja em S, adicione u em S e repita o processo até alcançar um vértice sem vizinhos não visitados; (2) neste ponto, retroceda (backtracking) até o último vértice que ainda possui vizinhos não contidos em S e continue.',
    keyPoints: [
      'Explora o MÁXIMO possível ao longo de cada ramificação antes de retroceder',
      'Começa em s; conjunto S de visitados inicia com s',
      'Segue para vizinho não visitado, adiciona em S, repete até não haver vizinho novo',
      'BACKTRACKING: volta ao último vértice com vizinhos ainda não visitados',
    ],
    intuition:
      'Labirinto com a mão na parede: você vai fundo por um corredor até bater num beco, aí volta ao último cruzamento com saída inexplorada. A PILHA (ou recursão) lembra o caminho de volta. É a base de fecho transitivo, detecção de ciclo, classificação de arestas e Kosaraju.',
    example: 'Resumo, p.4: dfs(v, grafo, visitados) — adiciona v aos visitados; para cada vizinho não visitado, chama dfs recursivamente. "Usa pilha".',
    sourceStyle: 'board',
    source: AULAO(2, 'Busca em Profundidade (cita Kleinberg & Tardos, p. 83)'),
  }),
  def({
    id: 'fecho-transitivo-direto',
    topic: 'fecho-transitivo',
    concept: 'fecho transitivo direto',
    definition:
      'Fecho transitivo direto de um vértice v: o conjunto dos vértices alcançáveis a partir de v — notação do quadro: Γ⁺(v), com "u ∈ Γ⁺(v)" significando que existe caminho de v até u. Obtém-se com uma busca em profundidade a partir de v: fecho-transitivo(v, grafo) { visitado = nova lista; dfs(v, grafo, visitado); return visitado }.',
    keyPoints: ['Conjunto dos vértices ALCANÇÁVEIS a partir de v', 'Notação Γ⁺(v) (quadro)', 'Calcula-se com uma DFS a partir de v: o resultado é a lista de visitados'],
    intuition:
      'Tudo que v consegue "influenciar" seguindo as setas, direta ou indiretamente. Rode uma busca a partir de v e anote todo mundo que apareceu — isso é o fecho. Nas provas, aparece como "fecho transitivo direto de A" dado por matriz de adjacência.',
    example: 'Grafo a → b → c, d: Γ⁺(a) = {a, b, c}. (Se o vértice conta ou não a si mesmo, siga o que a questão fizer.)',
    note: 'A frase "fecho transitivo direto" não tem slide próprio: vem do resumo (p. 4) e das fotos do quadro (notação Γ⁺). As provas 2022/1-Q2, 2022/2-Q2 usam o termo sem defini-lo.',
    sourceStyle: 'board',
    source: RESUMO(4, 'DFS → fecho transitivo direto'),
  }),
  def({
    id: 'fecho-transitivo-inverso',
    topic: 'fecho-transitivo',
    concept: 'fecho transitivo inverso',
    definition:
      'Fecho transitivo inverso de v: o conjunto dos vértices a partir dos quais v é alcançável. Para achar o fecho transitivo inverso, encontre o grafo transposto e faça a busca em profundidade nele (a partir de v).',
    keyPoints: ['Conjunto dos vértices que ALCANÇAM v', 'Calcula-se no grafo TRANSPOSTO', 'DFS a partir de v no transposto = fecho inverso em G'],
    intuition:
      'Quem consegue chegar em v? Em vez de andar contra as setas (chato), inverta todas as setas (transposto) e ande a favor — a mesma DFS resolve. Simetria bonita: direto = DFS em G; inverso = DFS em Gᵀ.',
    example: 'Grafo a → b → c: fecho inverso de c = {a, b, c}.',
    sourceStyle: 'board',
    source: RESUMO(5, 'fecho transitivo inverso'),
  }),
  def({
    id: 'grafo-transposto',
    topic: 'fecho-transitivo',
    concept: 'grafo transposto',
    definition: 'Grafo transposto: o grafo com os mesmos vértices e arestas de G, mas com a ordem das direções invertida (sentidos opostos).',
    keyPoints: ['Mesmos vértices', 'Mesmas arestas', 'Sentido de cada aresta INVERTIDO'],
    intuition:
      'Vire todas as placas de mão única ao contrário. Nada é criado nem destruído — só o sentido muda. É a ferramenta para fecho inverso, anti-base e o 2º passo de Kosaraju.',
    example: '(a, b) ∈ E ⟺ (b, a) ∈ Eᵀ.',
    sourceStyle: 'board',
    source: RESUMO(3, 'grafo transposto — também anotado no aulão, p. 7: "mesmos vértices e arestas, mas com sentidos opostos"'),
  }),
  def({
    id: 'base',
    topic: 'base-antibase',
    concept: 'base de um grafo dirigido',
    definition:
      'Base de um grafo dirigido G = (V, E): é um subconjunto B de V tal que não há caminho entre vértices de B, e todo vértice não pertencente a B pode ser atingido por algum vértice de B.',
    keyPoints: ['Subconjunto B ⊆ V', 'NÃO há caminho entre vértices de B (entre si)', 'TODO vértice fora de B é ATINGIDO por algum vértice de B'],
    intuition:
      '"Sementes" mínimas: um time de vértices que, juntos, alcançam o grafo inteiro — e nenhum deles alcança outro do time (senão seria redundante). No quadro: Γ⁺(B) = V, com Γ⁺(B) = ∪_{u∈B} Γ⁺(u).',
    example: 'Grafo a → b → c, d → c: base = {a, d} — a e d não se alcançam e, juntos, atingem b e c.',
    note: 'Fonte do aulão é o próprio professor ("Fonte: Jamil, Silvio"). Questão de prova recorrente (4 de 8): "projete uma solução para encontrar uma base com a menor cardinalidade possível".',
    sourceStyle: 'board',
    source: AULAO(6, 'Conceitos sobre Base — "Fonte: Jamil, Silvio"'),
  }),
  def({
    id: 'anti-base',
    topic: 'base-antibase',
    concept: 'anti-base de um grafo dirigido',
    definition:
      'Anti-base de um grafo dirigido G = (V, E): é um subconjunto A de V tal que não há caminho entre os vértices de A, e todo vértice não pertencente a A pode atingir A por um caminho.',
    keyPoints: ['Subconjunto A ⊆ V', 'NÃO há caminho entre vértices de A', 'TODO vértice fora de A ATINGE A por um caminho'],
    intuition:
      'O espelho da base: "sumidouros" que todo mundo consegue alcançar. Base = de onde tudo sai; anti-base = onde tudo chega. Por isso a anti-base de G é a base do transposto.',
    example: 'Grafo a → b → c, d → c: anti-base = {c}.',
    sourceStyle: 'board',
    source: AULAO(6, 'Conceitos sobre Base — "Fonte: Jamil, Silvio"'),
  }),
  def({
    id: 'identificacao-de-base',
    topic: 'base-antibase',
    concept: 'identificação de base (algoritmo)',
    prompt: 'Descreva o algoritmo de identificação de base (e de anti-base) apresentado no aulão.',
    definition:
      'Considere G = (V, E) um grafo dirigido. Após calcular o grau de entrada de todos os vértices, identifique os vértices com grau de entrada igual a zero: esses vértices não são alcançados por nenhum outro; consequentemente, os vértices com grau de entrada maior que zero serão alcançados, direta ou indiretamente, a partir deles. (1) Caso o grafo seja cíclico, os vértices que compõem o ciclo devem ser contraídos para um hipervértice; quando o novo vértice tiver grau de entrada zero, um dos vértices daquele ciclo deve ser selecionado. (2) Cálculo de anti-base: obtenha o grafo transposto de G e aplique o algoritmo a ele.',
    keyPoints: [
      'Calcula grau de entrada de todos os vértices',
      'Vértices com d⁻ = 0 entram na base (ninguém os alcança)',
      'Se há ciclo: contrai o ciclo em um hipervértice; se ele fica com d⁻ = 0, escolhe UM vértice do ciclo',
      'Anti-base: aplica o mesmo algoritmo no grafo TRANSPOSTO',
    ],
    intuition:
      'Quem não tem seta chegando precisa estar na base (ninguém pode "cobri-lo"). Ciclos são o problema: num ciclo todo mundo tem seta chegando, mas alguém do ciclo precisa representá-lo — daí "esmagar" o ciclo (contração) e tratá-lo como um vértice só. Nas provas, a resposta esperada cita explicitamente o passo dos ciclos (SCC/contração).',
    sourceStyle: 'board',
    source: AULAO(7, 'Identificação de Base — "Fonte: Jamil, Silvio"'),
  }),
  def({
    id: 'excentricidade',
    topic: 'excentricidade-raio-diametro',
    concept: 'excentricidade de um vértice',
    definition: 'Excentricidade: a maior distância dentre as menores distâncias entre o vértice v e os outros vértices.',
    keyPoints: ['Toma as MENORES distâncias de v a cada outro vértice (caminho mínimo)', 'Excentricidade = a MAIOR dessas'],
    intuition:
      '"Até onde v tem que ir, no pior caso?" Rode BFS a partir de v, veja a distância mais longa que apareceu — é a excentricidade. Vértice central tem excentricidade pequena; vértice na ponta tem grande.',
    example: 'Caminho a–b–c–d–e: ε(a) = 4, ε(c) = 2.',
    note: 'Sem slide próprio; definição do resumo (p. 5). Cobrado em 2023/2-Q3 e 2024/1-Q4 sobre o grafo V = {a, …, i}.',
    sourceStyle: 'board',
    source: RESUMO(5, 'Excentricidade'),
  }),
  def({
    id: 'raio',
    topic: 'excentricidade-raio-diametro',
    concept: 'raio de um grafo',
    definition: 'Raio: a menor das excentricidades do grafo.',
    keyPoints: ['MENOR excentricidade entre todos os vértices'],
    intuition: 'O "melhor pior caso": o vértice mais bem posicionado ainda precisa ir até raio de distância para alcançar todo mundo.',
    example: 'Caminho a–b–c–d–e: raio = ε(c) = 2.',
    sourceStyle: 'board',
    source: RESUMO(5, 'Raio'),
  }),
  def({
    id: 'diametro',
    topic: 'excentricidade-raio-diametro',
    concept: 'diâmetro de um grafo',
    definition: 'Diâmetro: a maior das excentricidades do grafo.',
    keyPoints: ['MAIOR excentricidade entre todos os vértices', '(= maior distância mínima entre qualquer par de vértices)'],
    intuition: 'A "largura" do grafo: a maior distância que existe entre dois vértices andando pelo caminho mais curto. Algoritmo (prova 2022/1-Q4, 2024/1-Q4): BFS a partir de cada vértice, guarda a maior distância vista.',
    example: 'Caminho a–b–c–d–e: diâmetro = 4.',
    sourceStyle: 'board',
    source: RESUMO(5, 'Diâmetro'),
  }),
  def({
    id: 'centro',
    topic: 'excentricidade-raio-diametro',
    concept: 'centro de um grafo',
    definition: 'Centro: o conjunto de vértices com a menor excentricidade (isto é, com excentricidade igual ao raio).',
    keyPoints: ['É um CONJUNTO (pode ter mais de um vértice)', 'Vértices cuja excentricidade é a MENOR (= raio)'],
    intuition: 'Onde você colocaria o hospital para minimizar a pior distância até qualquer bairro. Pode haver empate — por isso é conjunto, não vértice.',
    example: 'Caminho a–b–c–d: centro = {b, c} (ambos com ε = 2).',
    sourceStyle: 'board',
    source: RESUMO(5, 'Centro'),
  }),
  def({
    id: 'aresta-de-arvore',
    topic: 'dfs-classificacao',
    concept: 'aresta de árvore (classificação na DFS)',
    definition: 'Aresta de árvore: vai para um vértice que ainda não foi visitado (estado 0) — é a aresta pela qual a busca descobre o vértice.',
    keyPoints: ['Destino ainda NÃO visitado no momento em que a aresta é explorada', 'É a aresta que DESCOBRE o vértice (forma a árvore da busca)'],
    intuition: 'O caminho que o explorador realmente andou pela primeira vez. Junte todas as arestas de árvore e você tem a "árvore de busca".',
    sourceStyle: 'board',
    source: RESUMO(5, 'Arestas de: árvore'),
  }),
  def({
    id: 'aresta-de-retorno',
    topic: 'dfs-classificacao',
    concept: 'aresta de retorno (classificação na DFS)',
    definition: 'Aresta de retorno: aponta de um vértice para um ANCESTRAL dele na árvore da busca (um vértice que começou e ainda não terminou — estado 1). Presença de aresta de retorno indica ciclo.',
    keyPoints: ['Destino é um ANCESTRAL do vértice atual', 'Destino está "em progresso" (estado 1: começou mas não terminou)', 'Aresta de retorno ⇒ há CICLO'],
    intuition:
      'Você chega numa sala que ainda está "aberta" — está no seu próprio caminho de volta. Fechou um ciclo. No quadro: a → b → c com c → a, rotulado "RETORNO".',
    example: 'Quadro 19/08: a → b → c e c → a.',
    sourceStyle: 'board',
    source: QUADRO('WhatsApp Image 2026-08-19 at 12.01.27.jpeg', 'diagramas "avanço / RETORNO / CRUZ" com estados 0/1/2 — definição textual no resumo, p. 5'),
  }),
  def({
    id: 'aresta-de-avanco',
    topic: 'dfs-classificacao',
    concept: 'aresta de avanço (classificação na DFS)',
    definition: 'Aresta de avanço: vai para um vértice DESCENDENTE (já visitado), pulando outros que estão no meio do caminho na árvore.',
    keyPoints: ['Destino é DESCENDENTE do vértice atual na árvore da busca', 'Destino já foi visitado (não é aresta de árvore)', '"Pula níveis" — atalho para baixo'],
    intuition: 'Atalho para um lugar que você já explorou descendo por outro caminho da mesma ramificação. No quadro: a → b → c com aresta extra a → c.',
    example: 'Quadro 19/08: a → b → c e a → c.',
    sourceStyle: 'board',
    source: QUADRO('WhatsApp Image 2026-08-19 at 12.01.27.jpeg', 'diagrama "avanço" — definição textual no resumo, p. 5'),
  }),
  def({
    id: 'aresta-de-cruzamento',
    topic: 'dfs-classificacao',
    concept: 'aresta de cruzamento (classificação na DFS)',
    definition: 'Aresta de cruzamento: vai para um vértice que já foi visitado por OUTRO ramo (outro ancestral) — nem ancestral nem descendente do vértice atual.',
    keyPoints: ['Destino já visitado (terminado, estado 2)', 'Destino NÃO é ancestral nem descendente — está em outro ramo/outra árvore'],
    intuition: 'Ponte entre dois galhos diferentes da árvore (ou entre duas árvores da floresta). No quadro, rótulo "CRUZ".',
    sourceStyle: 'board',
    source: QUADRO('WhatsApp Image 2026-08-19 at 12.01.27.jpeg', 'diagrama "CRUZ" — definição textual no resumo, p. 5'),
  }),
  def({
    id: 'estados-dfs-ciclo',
    topic: 'deteccao-ciclo',
    concept: 'estados da DFS (0/1/2) e detecção de ciclo',
    prompt: 'Explique os três estados usados pelo professor na DFS e como eles detectam ciclo em grafo direcionado (quadro de 19/08).',
    definition:
      'Estados: 0 – não começou; 1 – começou mas não terminou; 2 – terminou. VISIT(G): para u ∈ V, visitado[u] = 0; para u ∈ V, VISITAR(G, u). VISITAR_REC(G, v): visitado[v] = 1; para u ∈ N(v): se visitado[u] == 1 → há ciclo; se visitado[u] == 0 → VISITAR_REC(G, u); ao final, visitado[v] = 2.',
    keyPoints: [
      '0 = não começou, 1 = começou mas não terminou, 2 = terminou',
      'Ao entrar em v: visitado[v] = 1; ao sair: visitado[v] = 2',
      'Encontrar vizinho com estado 1 ⇒ CICLO (aresta de retorno)',
      'Vizinho com estado 0 ⇒ recursão VISITAR_REC(G, u)',
    ],
    intuition:
      'Estado 1 = "estou dentro dessa sala agora, ainda não saí". Se de dentro de uma sala você vê uma porta para outra sala que também está "em uso", você deu a volta — ciclo. O professor usa números 0/1/2, não cores branco/cinza/preto: escreva como ele.',
    note: 'Questão de prova 2024/2-Q3 e 2026/1-Q4 ("projete duas soluções para dizer se há ciclo"): esta é a primeira; a segunda pode ser via base/Kosaraju (SCC com mais de um vértice ⇒ ciclo).',
    sourceStyle: 'board',
    source: QUADRO('WhatsApp Image 2026-08-19 at 12.01.28.jpeg', 'pseudocódigo VISIT / VISITAR_REC com legenda 0/1/2'),
  }),
  def({
    id: 'kosaraju-scc',
    topic: 'scc-kosaraju',
    concept: 'componente fortemente conexo e algoritmo de Kosaraju',
    prompt: 'Descreva o algoritmo de Kosaraju para componentes fortemente conexos (3 passos do aulão).',
    definition:
      'Algoritmo de Kosaraju (SCC): (1) realizar uma busca em profundidade em G = (V, E), gravando os tempos de início e fim da visitação; (2) na ordem inversa dos tempos de término, realizar uma busca em profundidade no grafo transposto T de G; (3) para cada conjunto de vértices visitados em uma mesma chamada em T, marque esse conjunto como um componente fortemente conexo (SCC) em G.',
    keyPoints: [
      'Passo 1: DFS em G gravando tempos de início/fim',
      'Passo 2: DFS no grafo TRANSPOSTO, na ordem DECRESCENTE de tempo de término',
      'Passo 3: cada árvore da 2ª DFS é um SCC',
    ],
    intuition:
      'SCC = grupo de vértices onde todo mundo alcança todo mundo (ida E volta). A 1ª DFS descobre "quem termina por último" (tende a ser fonte); invertendo as setas e partindo desses, a 2ª DFS não consegue "vazar" para fora do grupo — cada busca fica presa exatamente num SCC.',
    example: 'Resumo, p.7: A → B → C, D ↔ E, C → ...: pilha por tempo de término; DFS no transposto desempilhando; {D, E} vira um SCC.',
    note: 'O material não traz frase-definição de "componente fortemente conexo"; a formulação "todo par mutuamente alcançável" é do app. Ordem dos passos segue o resumo/aulão (DFS em G primeiro, depois no transposto).',
    sourceStyle: 'board',
    source: AULAO(8, 'SCC – Kosaraju (cita Sedgewick & Wayne, p. 584)'),
  }),
];
