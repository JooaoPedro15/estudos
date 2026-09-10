import type { GraphData } from '../types';
import type { AnimationStep, GraphConcept, LessonCatalog } from './types';
import { makeLessonGraph as graph, BLUE, GREEN, AMBER } from './builders';

type Pair = [string, string];
const blue = BLUE, orange = AMBER, green = GREEN;
const pairs = (vs: string[]): Pair[] => vs.flatMap((a, i) => vs.slice(i + 1).map((b): Pair => [a, b]));
const ring = (vs: string[]): Pair[] => vs.map((a, i) => [a, vs[(i + 1) % vs.length]]);
const ids = (g: GraphData) => g.edges.map((e) => e.id);
const incident = (g: GraphData, v: string) => g.edges.filter((e) => e.source === v || e.target === v).map((e) => e.id);
const step = (g: GraphData, message: string, extra: Omit<AnimationStep, 'graph' | 'message'> = {}): AnimationStep => ({ graph: g, message, ...extra });
const table = (headers: string[], rows: string[][]) => ({ headers, rows });
const concept = (id: string, title: string, technicalIndices: number[], intuitiveExplanation: string, steps: AnimationStep[]): GraphConcept => ({
  id, title, technicalIndices, intuitiveExplanation, examples: [{ id: `${id}-demonstracao`, title: `Observe: ${title}`, steps }],
});
const abc = ['A', 'B', 'C'], abcd = ['A', 'B', 'C', 'D'];
const path3 = graph(abc, [['A', 'B'], ['B', 'C']]);
const triangle = graph(abc, pairs(abc));
const square = graph(abcd, ring(abcd));
const complete4 = graph(abcd, pairs(abcd));
const path4 = graph(abcd, [['A', 'B'], ['B', 'C'], ['C', 'D']]);
const empty4 = graph(abcd, []);
const directed = graph(abc, [['A', 'B'], ['A', 'C'], ['C', 'B']], true);
const degreeSteps = (): AnimationStep[] => [
  step(graph(abcd, [['A', 'B'], ['A', 'C']]), 'D está sozinho: grau 0. Ninguém pode ter grau 3, pois teria de se ligar também a D.', {
    vertexNotes: { A: 'grau 2', B: 'grau 1', C: 'grau 1', D: 'grau 0' }, highlightVertexIds: ['D'],
    table: table(['Grau', 'Pode ocorrer?'], [['0', 'sim'], ['1', 'sim'], ['2', 'sim'], ['3', 'não, com D isolado']]),
  }),
  step(graph(abcd, [['A', 'B'], ['A', 'C'], ['A', 'D']]), 'Agora A conhece todos. O grau 3 apareceu, mas o grau 0 desapareceu. Quatro vértices disputam no máximo três valores de grau: algum se repete.', {
    vertexNotes: { A: 'grau 3', B: 'grau 1', C: 'grau 1', D: 'grau 1' }, highlightVertexIds: ['B', 'C', 'D'],
    table: table(['Grau', 'Pode ocorrer?'], [['0', 'não, A alcança todos'], ['1', 'sim: B, C, D'], ['2', 'sim em outro grafo'], ['3', 'sim: A']]),
  }),
];

const definitions: GraphConcept[] = [
  concept('simples', 'Pontos, ligações e grafo simples', [0], 'Pense em cidades e estradas: os pontos dizem quais cidades existem e as linhas dizem quais pares têm ligação. No modelo simples, não há estrada de uma cidade para ela mesma nem duas ligações para o mesmo par.', [
    step(graph(abc, []), 'Primeiro escolhemos V = {A, B, C}. Ainda não há estradas.'),
    step(path3, 'Acrescentamos AB e BC. A posição no desenho não importa: são os extremos de cada ligação que definem o grafo.', { highlightEdgeIds: ids(path3), formula: 'G = (V,E); E = {{A,B}, {B,C}}' }),
    step(graph(abc, [['B', 'A']], true), 'Se a estrada é de mão única, a seta B → A importa: o par ordenado (B,A) difere de (A,B).', { highlightVertexIds: ['B', 'A'] }),
  ]),
  concept('laco', 'Laço: duas pontas no mesmo ponto', [1, 3], 'Uma rua circular sai da cidade e retorna à mesma cidade. Ao contar as pontas de ruas incidentes ao ponto, essa rua contribui com duas.', [
    step(graph(['A', 'B'], [['A', 'B']]), 'A estrada AB oferece uma ponta a A: grau 1.', { highlightVertexIds: ['A'], vertexNotes: { A: 'grau 1' } }),
    step(graph(['A', 'B'], [['A', 'B'], ['A', 'A']]), 'O laço AA acrescenta duas incidências: o grau de A passa a 3, embora existam apenas duas arestas.', { highlightVertexIds: ['A'], vertexNotes: { A: '1 + 2 = 3' } }),
  ]),
  concept('paralelas', 'Duas ligações para o mesmo par', [2], 'Duas pontes diferentes podem conectar as mesmas margens. Elas continuam sendo duas arestas, mesmo com extremos iguais. Esse modelo já não é simples.', [
    step(graph(['A', 'B'], [['A', 'B']]), 'Uma ponte AB: uma aresta e grau 1 em cada extremo.', { vertexNotes: { A: 'grau 1', B: 'grau 1' } }),
    step(graph(['A', 'B'], [['A', 'B'], ['A', 'B']]), 'Construímos a segunda ponte. Cada ponte acrescenta 1 ao grau de cada margem.', { vertexNotes: { A: 'grau 2', B: 'grau 2' }, formula: '|E| = 2' }),
  ]),
  concept('graus-direcionados', 'Entradas e saídas de uma estação', [3], 'Em linhas de mão única, conte separadamente os trajetos que chegam e os que partem. O grau total reúne as duas contas; ele não é apenas a quantidade de vizinhos diferentes.', [
    step(directed, 'Em A, duas setas partem e nenhuma chega.', { currentVertex: 'A', highlightEdgeIds: directed.edges.filter((e) => e.source === 'A').map((e) => e.id), vertexNotes: { A: 'entrada 0 · saída 2 · total 2' } }),
    step(directed, 'B recebe setas de A e C. Em C, uma chega e uma sai.', { currentVertex: 'B', highlightEdgeIds: directed.edges.filter((e) => e.target === 'B').map((e) => e.id), vertexNotes: { B: 'entrada 2 · saída 0 · total 2', C: 'entrada 1 · saída 1 · total 2' } }),
  ]),
  concept('regular-nulo', 'Regularidade e ausência de arestas', [4], 'Regular significa que todos têm a mesma quantidade de ligações. Até todos terem zero é uma regularidade: o grafo nulo é 0-regular.', [
    step(empty4, 'N₄ contém quatro vértices e nenhuma aresta. Não é um conjunto sem vértices.', { vertexNotes: { A: '0', B: '0', C: '0', D: '0' } }),
    step(square, 'Ligamos os quatro em um anel. Cada vértice tem grau 2: C₄ é 2-regular.', { highlightEdgeIds: ids(square), vertexNotes: { A: '2', B: '2', C: '2', D: '2' } }),
  ]),
  concept('isolado-pendente', 'Sozinho ou na ponta', [5], 'O isolado não tem ligação alguma; o pendente tem exatamente uma e fica na ponta de um ramo. Conectar um isolado pode transformá-lo em pendente.', [
    step(graph(abcd, [['A', 'B'], ['B', 'C']]), 'D está isolado. A e C são pendentes; B tem duas ligações.', { highlightVertexIds: ['D'], vertexNotes: { D: 'isolado · 0', A: 'pendente · 1', C: 'pendente · 1' } }),
    step(path4, 'Ao acrescentar CD, D vira pendente e C deixa de ser: agora tem grau 2.', { highlightVertexIds: ['C', 'D'], vertexNotes: { D: 'pendente · 1', C: 'grau 2' } }),
  ]),
];

const wheel = graph([...abcd, 'O'], [...ring(abcd), ...abcd.map((v): Pair => ['O', v])]);
const cubeVertices = ['000', '001', '011', '010', '100', '101', '111', '110'];
const cube = graph(cubeVertices, pairs(cubeVertices).filter(([a, b]) => [...a].filter((digit, i) => digit !== b[i]).length === 1));
const bipartite = graph(['L1', 'L2', 'R1', 'R2', 'R3'], ['L1', 'L2'].flatMap((l) => ['R1', 'R2', 'R3'].map((r): Pair => [l, r])));
const tripVertices = ['A1', 'A2', 'B1', 'C1', 'C2'];
const tripartite = graph(tripVertices, pairs(tripVertices).filter(([a, b]) => a[0] !== b[0]));
const familyLessons: GraphConcept[] = [
  concept('aperto-maos', 'Cada ligação tem duas pontas', [0], 'Quando duas pessoas apertam as mãos, cada uma registra um cumprimento. A soma dos registros conta cada encontro duas vezes. Os registros ímpares precisam ocorrer em quantidade par para que a soma seja par.', [
    step(path3, 'AB e BC são dois encontros. Os registros de A, B e C são 1, 2 e 1.', { vertexNotes: { A: '1', B: '2', C: '1' }, formula: '1 + 2 + 1 = 4 = 2 × 2', highlightVertexIds: ['A', 'C'] }),
    step(triangle, 'Acrescentar AC aumenta dois graus em 1. Os dois graus ímpares desaparecem juntos.', { vertexNotes: { A: '2', B: '2', C: '2' }, highlightEdgeIds: ids(triangle), formula: '2 + 2 + 2 = 6 = 2 × 3' }),
  ]),
  concept('familia-completo', 'Kₙ: todo par se conhece', [0], 'Em uma reunião onde todos conversam com todos, escolhemos pares de pessoas. Listar cada pessoa com todos os outros conta a mesma conversa duas vezes.', [
    step(graph(abcd, [['A', 'B'], ['A', 'C'], ['A', 'D']]), 'A conversa com B, C e D. Faltam as conversas entre B, C e D.', { highlightVertexIds: ['A'], formula: 'A contribui com 3 pares novos' }),
    step(complete4, 'B acrescenta BC e BD; C acrescenta CD. Os seis pares estão presentes: K₄.', { highlightEdgeIds: ids(complete4), formula: '3 + 2 + 1 = 6 = 4 × 3 / 2', vertexNotes: { A: 'grau 3', B: 'grau 3', C: 'grau 3', D: 'grau 3' } }),
  ]),
  concept('familia-ciclo-nulo', 'Cₙ e Nₙ: anel ou pontos soltos', [0], 'No ciclo simples, cada ponto tem um vizinho antes e outro depois: uma linha fechada com pelo menos três vértices. No nulo, os pontos existem sem ligação alguma.', [
    step(empty4, 'N₄ guarda os quatro pontos, mas nenhuma aresta.', { formula: '|V| = 4; |E| = 0' }),
    step(square, 'C₄ fecha A–B–C–D–A: quatro pontos, quatro ligações e grau 2 em todos.', { highlightEdgeIds: ids(square), sequence: ['A', 'B', 'C', 'D', 'A'], formula: '|V| = 4; |E| = 4' }),
  ]),
  concept('familia-roda', 'Wₙ: aro e raios', [0], 'Imagine uma roda de bicicleta: primeiro o aro, depois um centro ligado a cada ponto do aro. Aqui o índice conta os raios, conforme a convenção da disciplina.', [
    step(graph([...abcd, 'O'], ring(abcd)), 'O aro tem quatro arestas; o centro O ainda está solto.', { highlightVertexIds: ['O'], formula: '4 pontos no aro + 1 centro' }),
    step(wheel, 'Acrescentamos quatro raios. W₄ tem cinco vértices e oito arestas.', { highlightEdgeIds: incident(wheel, 'O'), formula: '|V| = 4 + 1 = 5; |E| = 4 + 4 = 8' }),
  ]),
  concept('familia-bipartido', 'Kₘ,ₙ: encontros entre dois grupos', [1], 'Cada pessoa da esquerda encontra todas da direita; ninguém forma par dentro do próprio grupo. Para contar, multiplique o tamanho de um grupo pelo tamanho do outro.', [
    step(graph(['L1', 'L2', 'R1', 'R2', 'R3'], [['L1', 'R1'], ['L1', 'R2'], ['L1', 'R3']]), 'L1 possui três parceiros. L2 ainda precisa fazer seus três encontros.', { vertexColorMap: { L1: blue, L2: blue, R1: orange, R2: orange, R3: orange }, highlightVertexIds: ['L1'], formula: '1 × 3 = 3 encontros feitos' }),
    step(bipartite, 'Agora os dois membros da esquerda têm três vizinhos cada: K₂,₃ possui seis arestas.', { vertexColorMap: { L1: blue, L2: blue, R1: orange, R2: orange, R3: orange }, highlightEdgeIds: incident(bipartite, 'L2'), formula: '|E| = 2 × 3 = 6' }),
  ]),
  concept('familia-hipercubo', 'Qₙ: mudar um único bit', [1], 'Pense em interruptores: cada vértice é uma configuração de ligado e desligado. Uma aresta permite mudar exatamente um interruptor, mantendo os demais.', [
    step(graph(['00', '01', '11', '10'], ring(['00', '01', '11', '10'])), 'Dois interruptores geram quatro configurações. De 00 podemos ir a 01 ou 10.', { highlightVertexIds: ['00', '01', '10'], formula: 'Q₂: 2² = 4 vértices; grau 2' }),
    step(cube, 'Com três interruptores duplicamos o quadrado: prefixos 0 e 1. Ligamos configurações correspondentes, diferentes só no primeiro bit.', { vertexColorMap: Object.fromEntries(cubeVertices.map((v) => [v, v[0] === '0' ? blue : orange])), highlightEdgeIds: cube.edges.filter((e) => e.source[0] !== e.target[0]).map((e) => e.id), formula: 'Q₃: 2³ = 8 vértices; grau 3; |E| = 12' }),
    step(cube, 'De 000, as três escolhas são 001, 010 e 100. Trocar dois bits de uma vez não é uma aresta.', { currentVertex: '000', highlightEdgeIds: incident(cube, '000'), highlightVertexIds: ['001', '010', '100'] }),
  ]),
  concept('familia-tripartido', 'Kᵣ,ₛ,ₜ: contar pares de grupos', [2], 'Com três grupos, conte encontros entre o primeiro e o segundo, o primeiro e o terceiro, e o segundo e o terceiro. Esses blocos não se sobrepõem.', [
    step(graph(tripVertices, [['A1', 'B1'], ['A2', 'B1']]), 'A e B geram 2 × 1 = 2 arestas. C ainda aguarda.', { vertexColorMap: { A1: blue, A2: blue, B1: orange, C1: green, C2: green }, formula: 'r = 2; s = 1; t = 2' }),
    step(tripartite, 'A–C acrescenta quatro arestas; B–C acrescenta duas. Dentro de cada grupo não há ligações.', { vertexColorMap: { A1: blue, A2: blue, B1: orange, C1: green, C2: green }, highlightEdgeIds: tripartite.edges.filter((e) => e.target.startsWith('C')).map((e) => e.id), table: table(['Bloco', 'Arestas'], [['A–B', '2'], ['A–C', '4'], ['B–C', '2'], ['Total', '8 arestas; 5 vértices']]) }),
  ]),
  concept('familias-grau-repetido', 'Por que algum grau se repete', [3], 'Distribua os vértices em gavetas rotuladas pelos graus. “Ninguém me conhece” e “conheço todos” não podem estar ocupadas juntas. Faltam gavetas para dar um grau diferente a cada vértice.', degreeSteps()),
  concept('operacoes-uniao-soma', 'União e soma: reunir ou conectar tudo', [4], 'Reunir dois grafos disjuntos coloca os desenhos no mesmo conjunto sem inventar ligações. A soma, ou junção, acrescenta todas as ligações de um desenho para o outro.', [
    step(graph(abcd, [['A', 'B'], ['C', 'D']]), 'União de duas arestas disjuntas: {A,B} e {C,D} continuam separados.', { groups: [{ label: 'G', vertexIds: ['A', 'B'], color: blue }, { label: 'H', vertexIds: ['C', 'D'], color: orange }], formula: '1 + 1 = 2 arestas' }),
    step(complete4, 'A soma acrescenta AC, AD, BC e BD. Neste exemplo, resulta em K₄.', { groups: [{ label: 'G', vertexIds: ['A', 'B'], color: blue }, { label: 'H', vertexIds: ['C', 'D'], color: orange }], highlightEdgeIds: complete4.edges.filter((e) => ['A', 'B'].includes(e.source) && ['C', 'D'].includes(e.target)).map((e) => e.id), formula: '2 originais + 2 × 2 entre grupos = 6' }),
  ]),
  concept('operacoes-remocao', 'Remover uma aresta ou um vértice', [4], 'Fechar uma estrada mantém as cidades. Apagar uma cidade exige apagar também as estradas que terminavam nela.', [
    step(triangle, 'Começamos com o triângulo: três vértices, três arestas.', { highlightEdgeIds: ids(triangle) }),
    step(path3, 'Removemos AC: os três vértices continuam no grafo.', { highlightVertexIds: ['A', 'C'], formula: '|V| = 3; |E| = 2' }),
    step(graph(['A', 'C'], []), 'Removemos B e suas arestas AB e BC. Restam A e C isolados.', { highlightVertexIds: ['A', 'C'], formula: '|V| = 2; |E| = 0' }),
  ]),
  concept('contracao', 'Contrair: fundir dois extremos', [4], 'Encolha uma estrada até suas cidades virarem uma só. As vizinhanças se juntam. Se o resultado deve ser simples, removemos laços e mantemos só uma ligação por par.', [
    step(triangle, 'Vamos contrair AB. A e B compartilham o vizinho C.', { highlightVertexIds: ['A', 'B'], highlightEdgeIds: triangle.edges.filter((e) => e.source === 'A' && e.target === 'B').map((e) => e.id) }),
    step(graph(['AB', 'C'], [['AB', 'C'], ['AB', 'C']]), 'A e B viram AB; a aresta contraída desaparece. As antigas AC e BC agora são paralelas.', { highlightVertexIds: ['AB'], vertexNotes: { AB: 'fusão de A e B' } }),
    step(graph(['AB', 'C'], [['AB', 'C']]), 'Na convenção simples, mesclamos as duas ligações em uma. Se a questão permitir multigrafo, a etapa anterior pode ser mantida.', { highlightVertexIds: ['AB', 'C'], formula: '|V| = 2; |E| = 1' }),
  ]),
];

const adjacency = table(['origem ↓ / destino →', 'A', 'B', 'C'], [['A', '0', '1', '1'], ['B', '0', '0', '0'], ['C', '0', '1', '0']]);
const adjacencyLessons: GraphConcept[] = [
  concept('adjacencia-linhas', 'Ler uma linha: para onde posso ir?', [0], 'Imagine uma tabela de voos: a linha escolhe a partida e a coluna escolhe o destino. Somar a linha conta partidas. No caso não dirigido sem laços, a mesma soma conta as ligações do vértice.', [
    step(directed, 'Na linha A, há 1 em B e 1 em C: duas saídas.', { table: adjacency, currentVertex: 'A', highlightEdgeIds: directed.edges.filter((e) => e.source === 'A').map((e) => e.id), formula: 'linha A: 0 + 1 + 1 = 2' }),
    step(directed, 'Na linha C, apenas B vale 1: C tem uma saída.', { table: adjacency, currentVertex: 'C', highlightEdgeIds: directed.edges.filter((e) => e.source === 'C').map((e) => e.id), formula: 'linha C: 0 + 1 + 0 = 1' }),
    step(graph(['A', 'B'], [['A', 'A'], ['A', 'B']]), 'Ressalva ao trecho técnico: se cada laço não dirigido vale 1 na diagonal, a soma da linha de A é 2, mas seu grau é 3. Some a diagonal novamente; outra convenção pode registrar 2 na diagonal.', { currentVertex: 'A', table: table(['', 'A', 'B'], [['A', '1', '1'], ['B', '1', '0']]), formula: 'grau de A = soma da linha + A[A,A] = 3' }),
  ]),
  concept('adjacencia-colunas', 'Ler uma coluna: de onde chegam?', [1], 'Fixe o destino e percorra as origens. Cada valor na coluna informa quantas ligações chegam a esse destino.', [
    step(directed, 'A coluna A só contém zeros: ninguém chega a A.', { table: adjacency, currentVertex: 'A', formula: 'entrada de A = 0' }),
    step(directed, 'Na coluna B, as linhas A e C têm 1: B recebe duas ligações. Isso não cria saídas de B.', { table: adjacency, currentVertex: 'B', highlightEdgeIds: directed.edges.filter((e) => e.target === 'B').map((e) => e.id), formula: 'entrada de B = 1 + 0 + 1 = 2' }),
  ]),
  concept('adjacencia-simetria', 'Um espelho na diagonal', [2], 'Uma estrada de mão dupla aparece nas consultas A para B e B para A. Essas posições se espelham pela diagonal, que fica zerada quando não há laços.', [
    step(graph(abc, [['A', 'B']]), 'AB ocupa (A,B) e (B,A). A diagonal continua zero.', { table: table(['', 'A', 'B', 'C'], [['A', '0', '1', '0'], ['B', '1', '0', '0'], ['C', '0', '0', '0']]), highlightVertexIds: ['A', 'B'] }),
    step(path3, 'Acrescentar BC preenche (B,C) e (C,B). A tabela permanece simétrica, binária e sem laços.', { table: table(['', 'A', 'B', 'C'], [['A', '0', '1', '0'], ['B', '1', '0', '1'], ['C', '0', '1', '0']]), highlightEdgeIds: incident(path3, 'C') }),
  ]),
  concept('adjacencia-custos', 'Acesso direto ou procurar todos os vizinhos', [3], 'Uma tabela reserva uma casa para todo par, mesmo vazia. Saber se A liga a D exige uma casa; descobrir todos os vizinhos de A exige percorrer a linha inteira.', [
    step(path4, 'Quatro vértices reservam 16 células para apenas três arestas. A consulta (A,D) acessa diretamente uma célula: zero.', { highlightVertexIds: ['A', 'D'], table: table(['', 'A', 'B', 'C', 'D'], [['A', '0', '1', '0', '0'], ['B', '1', '0', '1', '0'], ['C', '0', '1', '0', '1'], ['D', '0', '0', '1', '0']]), formula: 'espaço: 4² = 16; consulta: 1 célula' }),
    step(path4, 'Para listar os vizinhos de B, examinamos as quatro posições de sua linha. Encontramos A e C.', { currentVertex: 'B', highlightEdgeIds: incident(path4, 'B'), table: table(['coluna examinada', 'valor', 'vizinho?'], [['A', '1', 'sim'], ['B', '0', 'não'], ['C', '1', 'sim'], ['D', '0', 'não']]), formula: 'espaço O(n²); consulta O(1); listar vizinhos O(n)' }),
  ]),
];

const incidenceLessons: GraphConcept[] = [
  concept('incidencia-extremos', 'Uma coluna para cada ligação', [0, 2], 'Dê uma ficha a cada aresta e marque seus extremos. As linhas continuam sendo vértices, mas agora as colunas são arestas.', [
    step(graph(abc, [['A', 'B']]), 'A coluna e₁ descreve AB: 1 em A e 1 em B. A coluna soma 2.', { highlightVertexIds: ['A', 'B'], table: table(['vértice', 'e₁ = AB'], [['A', '1'], ['B', '1'], ['C', '0']]), formula: '3 linhas × 1 coluna' }),
    step(path3, 'BC ganha a coluna e₂. A matriz tem três linhas e duas colunas; não precisa ser quadrada.', { highlightEdgeIds: incident(path3, 'C'), table: table(['vértice', 'e₁ = AB', 'e₂ = BC'], [['A', '1', '0'], ['B', '1', '1'], ['C', '0', '1']]), formula: '3 linhas × 2 colunas; cada coluna soma 2' }),
  ]),
  concept('incidencia-sinais', 'Origem positiva, destino negativo', [0], 'Uma ficha de trajeto orientado distingue saída e chegada pelos sinais. Na convenção da disciplina, quem parte ganha +1 e quem recebe ganha −1.', [
    step(graph(abc, [['A', 'B']], true), 'A → B põe +1 em A e −1 em B. A soma assinada é zero; a soma dos módulos é 2.', { currentVertex: 'A', table: table(['vértice', 'e₁ = A→B'], [['A', '+1'], ['B', '−1'], ['C', '0']]), formula: '|+1| + |−1| = 2' }),
    step(graph(abc, [['B', 'A']], true), 'Inverter a direção troca os sinais: B recebe +1 e A recebe −1.', { currentVertex: 'B', table: table(['vértice', 'e₁ = B→A'], [['A', '−1'], ['B', '+1'], ['C', '0']]) }),
  ]),
  concept('incidencia-laco', 'Duas pontas na mesma linha', [1], 'Quando os extremos coincidem, a convenção de laços apresentada no material registra 2 naquela linha. Convenções orientadas podem tratar laços de outra forma: confira a definição usada na questão.', [
    step(graph(['A', 'B'], [['A', 'B']]), 'AB divide as incidências entre duas linhas.', { table: table(['vértice', 'e₁ = AB'], [['A', '1'], ['B', '1']]), highlightVertexIds: ['A', 'B'] }),
    step(graph(['A', 'B'], [['A', 'A']]), 'O laço AA concentra as duas incidências em A. B tem zero na coluna.', { table: table(['vértice', 'e₁ = AA'], [['A', '2'], ['B', '0']]), highlightVertexIds: ['A'], formula: 'convenção do material: M[A,e₁] = 2' }),
  ]),
];

const listLessons: GraphConcept[] = [
  concept('lista-sucessores', 'A agenda de destinos de cada ponto', [0], 'Cada ponto guarda somente os destinos que alcança diretamente. Numa rede esparsa isso economiza posições: uma lista por vértice e as entradas das arestas.', [
    step(directed, 'A lista de A contém B e C: A → B e A → C.', { currentVertex: 'A', highlightEdgeIds: directed.edges.filter((e) => e.source === 'A').map((e) => e.id), table: table(['origem', 'sucessores'], [['A', 'B, C'], ['B', '∅'], ['C', 'B']]) }),
    step(directed, 'A lista de B está vazia, embora duas setas cheguem a ele. Não inventamos B → A nem B → C.', { currentVertex: 'B', table: table(['estrutura', 'quantidade'], [['cabeçalhos', '3 vértices'], ['entradas', '3 arestas'], ['espaço total', 'O(V + E)']]), formula: 'sucessores(B) = ∅' }),
  ]),
  concept('lista-predecessores', 'Quem chega e quem sai', [1], 'A lista de destinos pode diferir da lista de quem chega até você. Em estradas de mão dupla, as duas coincidem.', [
    step(directed, 'A chega a C, e C vai para B. Logo C tem predecessor A e sucessor B.', { currentVertex: 'C', table: table(['vértice', 'predecessores', 'sucessores'], [['A', '∅', 'B, C'], ['B', 'A, C', '∅'], ['C', 'A', 'B']]), highlightEdgeIds: incident(directed, 'C') }),
    step(path3, 'Sem setas, B alcança A e C, que também alcançam B. Cada aresta aparece nas listas de seus dois extremos.', { currentVertex: 'B', highlightEdgeIds: ids(path3), table: table(['vértice', 'vizinhos'], [['A', 'B'], ['B', 'A, C'], ['C', 'B']]), formula: '2 arestas → 4 entradas nas listas' }),
  ]),
  concept('lista-ordem', 'A mesma rede, outra ordem de busca', [2], 'A busca precisa escolher qual vizinho examinar primeiro. A ordem da lista não altera as estradas, mas pode alterar a sequência de visita e a árvore da busca.', [
    step(graph(['A', 'B', 'C', 'D', 'E'], [['A', 'C'], ['A', 'B'], ['B', 'D'], ['C', 'E']]), 'Com a lista A: C, B, uma BFS iniciada em A enfileira C antes de B.', { currentVertex: 'A', queue: ['C', 'B'], visitedVertexIds: ['A'], table: table(['critério', 'BFS completa', 'DFS completa'], [['C antes de B', 'A, C, B, E, D', 'A, C, E, B, D']]) }),
    step(graph(['A', 'B', 'C', 'D', 'E'], [['A', 'C'], ['A', 'B'], ['B', 'D'], ['C', 'E']]), 'Com prioridade alfabética, B vem primeiro. A BFS visita por distância; a DFS termina o ramo de B até D antes de seguir para C.', { currentVertex: 'B', queue: ['C', 'D'], visitedVertexIds: ['A', 'B'], traversal: { from: 'A', to: 'B' }, table: table(['critério', 'BFS completa', 'DFS completa'], [['alfabético', 'A, B, C, D, E', 'A, B, D, C, E']]) }),
  ]),
];

const six = ['A', 'B', 'C', 'D', 'E', 'F'];
const cycle6 = graph(six, ring(six));
const twoTriangles = graph(six, [...pairs(['A','B','C']), ...pairs(['D','E','F'])]);
const rename = { A: 'x', B: 'z', C: 'w', D: 'y' };
const renamedPath: GraphData = { ...path4,
  vertices: path4.vertices.map(v => ({...v, id: rename[v.id as keyof typeof rename], label: rename[v.id as keyof typeof rename]})),
  edges: path4.edges.map(e => ({...e, source: rename[e.source as keyof typeof rename], target: rename[e.target as keyof typeof rename]})),
};
const isoLessons: GraphConcept[] = [
  concept('invariantes', 'Compare antes de tentar nomes', [0], 'O desenho pode mudar, mas a quantidade de pontos, ligações e graus não muda quando só trocamos os nomes. Uma diferença já elimina o isomorfismo. Igualdade nessas contas é só uma triagem: um anel de seis pontos e dois triângulos separados têm as mesmas contas, mas conexões diferentes.', [
    step(path4, 'O caminho tem 4 vértices, 3 arestas e graus 1,1,2,2.', {table:table(['Grafo','|V|','|E|','Graus'], [['caminho','4','3','1,1,2,2']]),vertexNotes:{A:'grau 1',B:'grau 2',C:'grau 2',D:'grau 1'}}),
    step(square, 'O ciclo tem 4 arestas: já difere do caminho, então não podem ser isomorfos.', {highlightEdgeIds:ids(square),table:table(['Grafo','|V|','|E|','Graus'], [['caminho','4','3','1,1,2,2'],['ciclo','4','4','2,2,2,2']])}),
    step(cycle6, 'Agora compare C₆ com dois triângulos. C₆ tem seis pontos, seis arestas e todos os graus iguais a 2; existe um único componente.', {highlightEdgeIds:ids(cycle6),formula:'6 vértices · 6 arestas · graus 2,2,2,2,2,2 · 1 componente'}),
    step(twoTriangles, 'Os dois triângulos têm as mesmas contagens e graus, mas dois componentes. Nenhuma troca de nomes transforma dois grupos separados em um único anel.', {groups:[{label:'Componente 1',vertexIds:['A','B','C'],color:blue},{label:'Componente 2',vertexIds:['D','E','F'],color:orange}],vertexColorMap:{A:blue,B:blue,C:blue,D:orange,E:orange,F:orange},formula:'Contagens iguais ≠ garantia de isomorfismo'}),
  ]),
  concept('bijecao', 'Troque os nomes, preserve as ligações', [1], 'É como reconhecer o mesmo mapa de metrô com estações renomeadas e reposicionadas. Cada estação deve ganhar um nome distinto e toda ligação deve continuar existindo. Conferir também as ausências evita inventar conexões extras.', [
    step(path4, 'Escolha A↦x, B↦z, C↦w, D↦y. Cada vértice ganha um nome diferente.', {vertexNotes:{A:'↦ x',B:'↦ z',C:'↦ w',D:'↦ y'},table:table(['G','H'],[['A','x'],['B','z'],['C','w'],['D','y']])}),
    ...renamedPath.edges.map((edge,i) => step(renamedPath, `A aresta ${path4.edges[i].source}—${path4.edges[i].target} vira ${edge.source}—${edge.target}. Ela está presente no grafo renomeado.`, {highlightEdgeIds:[edge.id],highlightVertexIds:[edge.source,edge.target]})),
    step(renamedPath, 'Todas as três arestas foram preservadas e não há arestas extras. A bijeção prova que os grafos são isomorfos.', {highlightEdgeIds:ids(renamedPath),formula:'G ≅ H'}),
  ]),
  concept('iso-direcao', 'As setas também precisam combinar', [2], 'Se o mapa tem ruas de mão única, renomear cidades não permite inverter a direção das ruas. Até o mesmo desenho sem setas pode esconder grafos dirigidos diferentes.', [
    step(graph(abc,[['A','B'],['A','C']],true), 'A é origem de duas setas. Os pares (entrada,saída) são (0,2),(1,0),(1,0).', {currentVertex:'A',vertexNotes:{A:'entrada 0 · saída 2'},highlightEdgeIds:['e0','e1']}),
    step(graph(abc,[['B','A'],['C','A']],true), 'Agora A recebe as duas setas. Ninguém tem saída 2, então não existe imagem possível para a antiga origem A.', {currentVertex:'A',vertexNotes:{A:'entrada 2 · saída 0'},highlightEdgeIds:['e0','e1'],formula:'Mesma adjacência sem direção, mas digrafos não isomorfos'}),
  ]),
  concept('iso-busca', 'Testar candidatos de forma organizada', [3], 'Em um exemplo pequeno, tente correspondências compatíveis com os graus e descarte uma tentativa assim que alguma aresta falhar. Cada tentativa é uma possibilidade de renomear o grafo inteiro; uma tabela de correspondências dá uma justificativa verificável.', [
    step(path4, 'A tem grau 1. Tentar mapeá-lo ao vértice z de grau 2 do exemplo anterior falha antes mesmo de checar todas as arestas.', {highlightVertexIds:['A'],vertexNotes:{A:'grau 1 ≠ grau(z)=2'},table:table(['Tentativa','Resultado'],[['A↦z','descartada pelo grau']])}),
    step(renamedPath, 'A↦x, B↦z, C↦w, D↦y respeita graus e arestas. Para esse caso concreto, a bijeção completa resolve a questão.', {highlightEdgeIds:ids(renamedPath),table:table(['Tentativa','Resultado'],[['A↦z','descartada'],['A↦x, B↦z, C↦w, D↦y','todas as arestas conferidas']])}),
  ]),
];

const complement4 = graph(abcd,[['A','C'],['A','D'],['B','D']]);
const complementLessons: GraphConcept[] = [
  concept('complementar', 'Acenda as ligações que faltavam', [0], 'O complemento mantém os pontos e troca presença por ausência para cada par de pontos diferentes. Em grafos simples não dirigidos, o original e seu complemento repartem todas as ligações do completo.', [
    step(path4, 'G tem AB, BC e CD. Entre os seis pares possíveis, faltam AC, AD e BD.', {highlightEdgeIds:ids(path4),formula:'|E(G)| = 3'}),
    step(complement4, 'No complemento aparecem exatamente AC, AD e BD. As antigas AB, BC e CD desaparecem.', {highlightEdgeIds:ids(complement4),formula:'|E(G)| + |E(Ḡ)| = 3 + 3 = 6 = 4·3/2'}),
  ]),
  concept('autocomplementar', 'O complemento pode ser o mesmo grafo renomeado', [0,1], 'O caminho de quatro pontos é um exemplo: seu complemento também é um caminho de quatro pontos. Os dois dividem as seis ligações do completo em duas metades. Ressalva sobre o texto técnico preservado abaixo: é n(n−1) que precisa ser divisível por 4; o número de arestas de um grafo autocomplementar NÃO precisa ser divisível por 4. Este exemplo tem 3 arestas.', [
    step(path4, 'G é A—B—C—D e tem 3 arestas. Vamos usar A↦C, B↦A, C↦D, D↦B.', {vertexNotes:{A:'↦ C',B:'↦ A',C:'↦ D',D:'↦ B'},formula:'2|E(G)| = n(n−1)/2'}),
    step(complement4, 'No complemento, o caminho C—A—D—B preserva todas as ligações. Portanto G≅Ḡ; cada um tem 3 arestas.', {highlightEdgeIds:ids(complement4),sequence:['C','A','D','B'],formula:'|E(G)| = 4·3/4 = 3 (não divisível por 4)'}),
    step(complement4, 'Para a metade ser inteira, o produto n(n−1) deve ser múltiplo de 4. Só n≡0 ou 1 (mod 4) atende. Essa condição numérica é necessária; a bijeção prova o caso particular.', {table:table(['n mod 4','n(n−1) mod 4'],[['0','0'],['1','0'],['2','2'],['3','2']]),formula:'n ≡ 0 ou 1 (mod 4)'}),
  ]),
  concept('contar-subgrafos', 'Escolha pontos; depois, escolha ligações', [2], 'Para formar um subgrafo do completo, primeiro escolha quais pontos ficam. Depois decida, para cada ligação entre esses pontos, se ela entra ou sai. A soma reúne todos os tamanhos de conjuntos de vértices. Aqui “não vazio” significa ter pelo menos um vértice; não identificamos subgrafos apenas por terem desenhos isomorfos.', [
    step(triangle, 'K₃: há 3 escolhas de um único vértice. Cada escolha permite só um conjunto de arestas: vazio.', {highlightVertexIds:['A'],table:table(['i vértices','Escolhas','Arestas por escolha','Subtotal'],[['1','3','1','3']])}),
    step(graph(['A','B'],[]), 'Escolhendo dois vértices, há 3 pares possíveis. Cada par permite dois subgrafos: com ou sem sua aresta.', {table:table(['i vértices','Escolhas','Arestas por escolha','Subtotal'],[['1','3','1','3'],['2','3','2','6']])}),
    step(triangle, 'Com os três vértices, cada uma das três arestas pode entrar ou sair independentemente: 2³=8. Total: 3+6+8=17.', {highlightEdgeIds:ids(triangle),table:table(['i vértices','Escolhas','Arestas por escolha','Subtotal'],[['1','3','1','3'],['2','3','2','6'],['3','1','8','8']]),formula:'Σ C(3,i)·2^(i(i−1)/2) = 17'}),
  ]),
  concept('induzido', 'Escolher só pontos ou escolher também arestas', [3], 'Num subgrafo qualquer, você escolhe os pontos e pode retirar ligações. No induzido, depois de escolher os pontos, as ligações são obrigatórias: ficam todas as que existiam entre os pontos escolhidos.', [
    step(complete4, 'Partimos de K₄. Escolhemos os vértices A, B e C.', {highlightVertexIds:abc,vertexColorMap:{A:blue,B:blue,C:blue}}),
    step(triangle, 'O induzido por {A,B,C} contém AB, AC e BC, pois todas estavam em K₄.', {highlightEdgeIds:ids(triangle),formula:'G[{A,B,C}] = K₃'}),
    step(path3, 'Retirando AC, continuamos com um subgrafo de K₄, mas ele não é induzido por {A,B,C}.', {highlightVertexIds:['A','C'],formula:'Subgrafo: pode omitir AC · Induzido: deve conter AC'}),
  ]),
];

const forest = graph(six,[['A','B'],['C','D'],['E','F']]);
const concentratedTree = graph(six,[['A','B'],['B','C'],['C','D']]);
const concentratedComplete = graph(six,pairs(abcd));
const countingLessons: GraphConcept[] = [
  concept('graus-repetidos','Por que dois graus precisam empatar', [0], 'Os graus parecem oferecer n valores para n vértices. Mas o grau máximo exige conhecer todo mundo, o que impede alguém de ficar isolado. Sem poder usar 0 e n−1 ao mesmo tempo, faltam opções de grau distintas: pelo menos dois vértices empatam.', degreeSteps()),
  concept('arestas-minimas','Uma árvore em cada componente', [1], 'Para manter três grupos conectados internamente, conecte cada grupo com uma árvore. Um grupo de tamanho s precisa de s−1 ligações. Somando os tamanhos dos grupos você tem n; subtraindo uma vez por grupo você tem n−k.', [
    step(graph(six,[]), 'Seis pontos isolados formam seis componentes. Queremos terminar com três.', {formula:'n = 6 · k desejado = 3'}),
    ...forest.edges.map((_,i) => step({...forest,edges:forest.edges.slice(0,i+1)}, `A ligação ${i+1} une dois componentes. Restam ${5-i} componentes.`, {highlightEdgeIds:[forest.edges[i].id],formula:`|E| = ${i+1} · componentes = ${5-i}`})),
    step(forest, 'Há três árvores, de dois vértices cada: 1+1+1=3 arestas. Esse é o mínimo para n=6 e k=3.', {highlightEdgeIds:ids(forest),formula:'m_min = n − k = 6 − 3 = 3'}),
  ]),
  concept('arestas-maximas','Concentre as conexões sem unir os grupos', [1], 'Para o máximo em um grafo simples, concentre os vértices que podem se conectar num grupo completo e deixe os outros grupos como pontos isolados. Cada grupo precisa de pelo menos um ponto. Sobram n−k+1 para o grupo maior.', [
    step(concentratedTree, 'A,B,C,D formam um grupo e E,F ficam isolados. Há três componentes e apenas três arestas.', {vertexNotes:{E:'isolado',F:'isolado'},formula:'Grupo maior: n−k+1 = 4'}),
    step(graph(six,[['A','B'],['B','C'],['C','D'],['A','C']]), 'Acrescentamos AC dentro do grupo. A contagem de componentes continua 3.', {highlightEdgeIds:['e3'],formula:'|E| = 4'}),
    step(graph(six,[['A','B'],['B','C'],['C','D'],['A','C'],['A','D']]), 'Acrescentamos AD dentro do mesmo grupo: ainda três componentes.', {highlightEdgeIds:['e4'],formula:'|E| = 5'}),
    step(concentratedComplete, 'Agora o grupo maior é K₄ e tem seis arestas. Qualquer nova aresta simples ligaria um isolado a outro grupo, reduzindo o número de componentes.', {highlightEdgeIds:ids(concentratedComplete),formula:'m_max = (n−k)(n−k+1)/2 = 3·4/2 = 6'}),
  ]),
  concept('justificar-contagem','Use os limites para justificar a resposta', [2], 'Uma fórmula sem explicar de onde veio esconde o raciocínio. Mostre as árvores que atingem o mínimo e o grupo completo que atinge o máximo. Então compare o número pedido com esse intervalo.', [
    step(forest, 'A construção com três árvores comprova que 3 arestas são suficientes e mínimas para seis vértices em três componentes.', {highlightEdgeIds:ids(forest),table:table(['n','k','mínimo','máximo'],[['6','3','3','6']])}),
    step(concentratedComplete, 'K₄ com dois isolados atinge o máximo 6. Pedir 7 arestas mantendo seis vértices e três componentes é impossível em grafo simples.', {highlightEdgeIds:ids(concentratedComplete),formula:'3 ≤ m ≤ 6; m = 7 fica fora do intervalo'}),
  ]),
];

export const foundationsLessons: LessonCatalog = {
  'definicao-terminologia': definitions,
  'aperto-de-maos-familias': familyLessons,
  'matriz-adjacencia': adjacencyLessons,
  'matriz-incidencia': incidenceLessons,
  'lista-adjacencia': listLessons,
  'isomorfismo': isoLessons,
  'complemento-subgrafo': complementLessons,
  'teoremas-contagem': countingLessons,
};
