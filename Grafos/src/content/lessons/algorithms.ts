import type { GraphData } from '../types';
import type { AnimationStep, GraphConcept, LessonCatalog } from './types';
import { BLUE, GREEN, AMBER, RED, makeLessonGraph } from './builders';

const blue = BLUE;
const green = GREEN;
const orange = AMBER;
const red = RED;
const purple = 'var(--color-accent)';
const gray = 'var(--color-text-tertiary)';

function edgeIds(graph: GraphData, pairs: string[][]): string[] {
  return pairs.flatMap(([from, to]) => graph.edges.filter((e) =>
    (e.source === from && e.target === to) || (!graph.directed && e.source === to && e.target === from),
  ).map((e) => e.id));
}

function step(graph: GraphData, message: string, details: Omit<AnimationStep, 'graph' | 'message'> = {}): AnimationStep {
  return { graph, message, ...details };
}

function concept(id: string, title: string, intuitiveExplanation: string, technicalIndices: number[], steps: AnimationStep[], exampleTitle: string): GraphConcept {
  return { id, title, intuitiveExplanation, technicalIndices, examples: [{ id: `${id}-exemplo`, title: exampleTitle, steps }] };
}

function transpose(graph: GraphData): GraphData {
  return { ...graph, edges: graph.edges.map((e) => ({ ...e, source: e.target, target: e.source })) };
}

function bfs(graph: GraphData, start: string): AnimationStep[] {
  const distances: Record<string, number> = Object.fromEntries(graph.vertices.map((v) => [v.id, -1]));
  const queue = [start];
  const sequence: string[] = [];
  distances[start] = 0;
  const snapshot = (message: string, currentVertex?: string, pair?: string[]) => step(graph, message, {
    currentVertex, queue: [...queue], queueLabel: 'Fila BFS', sequence: [...sequence], sequenceLabel: 'Ordem de retirada',
    visitedVertexIds: Object.keys(distances).filter((v) => distances[v] >= 0),
    vertexNotes: Object.fromEntries(Object.entries(distances).map(([v, d]) => [v, `d=${d}`])),
    highlightEdgeIds: pair ? edgeIds(graph, [pair]) : [],
    table: { headers: ['Vértice', 'Distância'], rows: Object.entries(distances).map(([v, d]) => [v, String(d)]) },
  });
  const result = [snapshot(`Só ${start} foi descoberto: distância 0. −1 significa ainda não alcançado. A frente da fila está à esquerda.`)];
  while (queue.length) {
    const current = queue.shift()!;
    sequence.push(current);
    result.push(snapshot(`Retire ${current} do INÍCIO da fila. Agora examine seus vizinhos em ordem alfabética.`, current));
    const neighbors = graph.edges.flatMap((e) => e.source === current ? [e.target] : !graph.directed && e.target === current ? [e.source] : []).sort();
    for (const neighbor of neighbors) {
      if (distances[neighbor] !== -1) continue;
      distances[neighbor] = distances[current] + 1;
      queue.push(neighbor);
      result.push(snapshot(`Descubra ${neighbor} por ${current}: d(${neighbor})=${distances[current]}+1=${distances[neighbor]}. Acrescente ${neighbor} ao FIM da fila.`, current, [current, neighbor]));
    }
  }
  result.push(snapshot('Fila vazia: a busca terminou. A sequência registra as retiradas; suas distâncias nunca diminuem.'));
  return result;
}

/** Classification uses discovery ancestry, not merely the destination's state. */
function dfs(graph: GraphData): AnimationStep[] {
  const states: Record<string, number> = Object.fromEntries(graph.vertices.map((v) => [v.id, 0]));
  const discovered: Record<string, number> = {};
  const finished: Record<string, number> = {};
  const labels: Record<string, string> = {};
  const colors: Record<string, string> = {};
  const stack: string[] = [];
  const examined = new Set<string>();
  let time = 0;
  const snapshot = (message: string, currentVertex?: string, edge?: string) => step(graph, message, {
    currentVertex, sequence: [...stack], sequenceLabel: 'Pilha de chamadas', vertexNotes: Object.fromEntries(Object.entries(states).map(([v, state]) => [v, `estado ${state}`])),
    vertexColorMap: Object.fromEntries(Object.entries(states).map(([v, state]) => [v, state === 1 ? orange : state === 2 ? green : gray])),
    edgeLabels: { ...labels }, edgeColorMap: { ...colors }, highlightEdgeIds: edge ? [edge] : [],
    table: { headers: ['Vértice', 'Estado', 'Descoberta', 'Término'], rows: graph.vertices.map(({ id }) => [id, String(states[id]), String(discovered[id] ?? '—'), String(finished[id] ?? '—')]) },
  });
  const result = [snapshot('Todos começam no estado 0. A sequência mostrará a pilha de chamadas, da raiz até o vértice atual.')];
  function visit(v: string) {
    states[v] = 1; discovered[v] = ++time; stack.push(v);
    result.push(snapshot(`Entre em ${v}: estado 0 → 1. A chamada permanece aberta enquanto seus vizinhos são examinados.`, v));
    const neighbors = graph.edges.flatMap((e) => e.source === v ? [{ edge: e, to: e.target }] : !graph.directed && e.target === v ? [{ edge: e, to: e.source }] : []).sort((a, b) => a.to.localeCompare(b.to));
    for (const { edge, to } of neighbors) {
      if (!graph.directed && examined.has(edge.id)) continue;
      examined.add(edge.id);
      if (states[to] === 0) {
        labels[edge.id] = 'árvore'; colors[edge.id] = blue;
        result.push(snapshot(`${v} → ${to}: destino em estado 0. É aresta de ÁRVORE; avance e só depois retome ${v}.`, v, edge.id));
        visit(to);
      } else if (states[to] === 1) {
        labels[edge.id] = 'retorno'; colors[edge.id] = red;
        result.push(snapshot(`${v} → ${to}: destino em estado 1, ainda na pilha. É RETORNO e fecha um ciclo.`, v, edge.id));
      } else {
        const kind = discovered[v] < discovered[to] ? 'avanço' : 'cruzamento';
        labels[edge.id] = kind; colors[edge.id] = kind === 'avanço' ? purple : orange;
        result.push(snapshot(`${v} → ${to}: destino em estado 2. ${kind === 'avanço' ? 'É AVANÇO: o destino é descendente de ' + v + '.' : 'É CRUZAMENTO: chega a outro ramo já terminado.'} Estado 2 sozinho não distingue os dois tipos.`, v, edge.id));
      }
    }
    states[v] = 2; finished[v] = ++time; stack.pop();
    result.push(snapshot(`Todos os vizinhos de ${v} foram examinados: estado 1 → 2. Registre término ${finished[v]} e retorne à chamada anterior.`, v));
  }
  for (const { id } of graph.vertices) if (states[id] === 0) visit(id);
  return result;
}

const bfsGraph = makeLessonGraph(['A', 'B', 'C', 'D', 'E', 'F'], [['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D'], ['C', 'E'], ['E', 'F']]);
const dfsGraph = makeLessonGraph(['A', 'B', 'C', 'D'], [['A', 'B'], ['B', 'C'], ['C', 'A'], ['A', 'C'], ['A', 'D'], ['D', 'C']], true);
const undirectedDfs = makeLessonGraph(['P', 'Q', 'R'], [['P', 'Q'], ['Q', 'R'], ['R', 'P']]);
const reachGraph = makeLessonGraph(['A', 'B', 'C', 'D', 'E'], [['A', 'B'], ['B', 'C'], ['D', 'B'], ['C', 'E']], true);
const reverseReach = transpose(reachGraph);
const baseGraph = makeLessonGraph(['A', 'B', 'C', 'D', 'E'], [['A', 'B'], ['B', 'A'], ['B', 'D'], ['C', 'D'], ['D', 'E']], true);
const condensedBase = makeLessonGraph(['AB', 'C', 'D', 'E'], [['AB', 'D'], ['C', 'D'], ['D', 'E']], true);
const oneSource = makeLessonGraph(['A', 'B', 'C'], [['A', 'B'], ['B', 'A'], ['B', 'C']], true);
const cycleGraph = makeLessonGraph(['S', 'A', 'B', 'C'], [['S', 'A'], ['A', 'B'], ['B', 'C'], ['C', 'A']], true);
const pathGraph = makeLessonGraph(['A', 'B', 'C', 'D'], [['A', 'B'], ['B', 'C'], ['C', 'D']]);
const sccGraph = makeLessonGraph(['A', 'B', 'C', 'D'], [['A', 'B'], ['B', 'A'], ['B', 'C'], ['C', 'D'], ['D', 'C']], true);
const reversedScc = transpose(sccGraph);
const sccCondensation = makeLessonGraph(['AB', 'CD'], [['AB', 'CD']], true);
const fleuryGraph = makeLessonGraph(['A', 'B', 'C', 'D'], [['A', 'B'], ['B', 'C'], ['C', 'A'], ['A', 'D']]);
const evenGraph = makeLessonGraph(['A', 'B', 'C', 'I'], [['A', 'B'], ['B', 'C'], ['C', 'A']]);
const oddGraph = makeLessonGraph(['O', 'A', 'B', 'C'], [['O', 'A'], ['O', 'B'], ['O', 'C']]);
const weightedGraph = makeLessonGraph(['S', 'A', 'B', 'T'], [['S', 'A', 5], ['S', 'B', 1], ['B', 'A', 2], ['A', 'T', 1], ['B', 'T', 8]], true);
const negativeGraph = makeLessonGraph(['S', 'A', 'B'], [['S', 'A', 2], ['S', 'B', 5], ['B', 'A', -4]], true);
const dag = makeLessonGraph(['S', 'A', 'B', 'T'], [['S', 'A', 3], ['S', 'B', 2], ['A', 'T', 4], ['B', 'T', 1]], true);

function dijkstraStep(message: string, distances: string[], predecessors: string[], settled: string[], currentVertex?: string, pairs: string[][] = []): AnimationStep {
  return step(weightedGraph, message, {
    currentVertex, visitedVertexIds: [...settled], highlightEdgeIds: edgeIds(weightedGraph, pairs),
    vertexNotes: Object.fromEntries(['S', 'A', 'B', 'T'].map((v, i) => [v, `D=${distances[i]}`])),
    table: { headers: ['Vértice', 'D', 'Predecessor', 'Definitivo?'], rows: ['S', 'A', 'B', 'T'].map((v, i) => [v, distances[i], predecessors[i], settled.includes(v) ? 'sim' : 'não']) },
  });
}

const dijkstraSteps = [
  dijkstraStep('Inicialize S com distância 0; os demais ficam em ∞, sem predecessor.', ['0', '∞', '∞', '∞'], ['—', '—', '—', '—'], []),
  dijkstraStep('S é o menor candidato. Relaxe S→A e S→B: A recebe 5 e B recebe 1; ambos têm predecessor S.', ['0', '5', '1', '∞'], ['—', 'S', 'S', '—'], ['S'], 'S', [['S', 'A'], ['S', 'B']]),
  dijkstraStep('Escolha B (1). B→A melhora 5 para 1+2=3; o predecessor de A muda para B. B→T propõe 1+8=9.', ['0', '3', '1', '9'], ['—', 'B', 'S', 'B'], ['S', 'B'], 'B', [['B', 'A'], ['B', 'T']]),
  dijkstraStep('Escolha A (3). A→T melhora 9 para 3+1=4; o predecessor de T muda para A.', ['0', '3', '1', '4'], ['—', 'B', 'S', 'A'], ['S', 'B', 'A'], 'A', [['A', 'T']]),
  dijkstraStep('Escolha T (4). Todas as distâncias são definitivas: S=0, B=1, A=3, T=4.', ['0', '3', '1', '4'], ['—', 'B', 'S', 'A'], ['S', 'B', 'A', 'T'], 'T'),
];

export const algorithmLessons: LessonCatalog = {
  bfs: [
    concept('bfs-fila', 'A fila organiza as camadas', 'Imagine avisar primeiro os vizinhos, depois os vizinhos deles. A fila FIFO retira quem entrou primeiro: novos descobertos entram no fim, e cada vértice entra uma única vez. Marque a distância no momento da descoberta. Se a prova pede prioridade alfabética, ordene os vizinhos de cada vértice antes de inseri-los; não reordene toda a fila.', [0, 1, 2], bfs(bfsGraph, 'A'), 'A fila completa, descoberta por descoberta'),
    concept('bfs-distancias', 'Distância conta arestas', 'A primeira descoberta já usa o menor número de arestas: para chegar antes, o vértice teria aparecido numa camada anterior. Essa garantia vale para contagem de arestas; pesos diferentes exigem outro algoritmo. A maior distância encontrada a partir de uma origem é sua excentricidade, quando todos os vértices são alcançáveis.', [3], [
      step(bfsGraph, 'Partindo de A, B e C estão a uma aresta. D e E exigem duas.', { highlightVertexIds: ['B', 'C'], vertexNotes: { A: '0', B: '1', C: '1', D: '2', E: '2', F: '3' }, formula: 'd(A,D)=2: A→B→D ou A→C→D' }),
      step(bfsGraph, 'F é o mais distante: A→C→E→F usa três arestas. Portanto ε(A)=3.', { highlightVertexIds: ['F'], highlightEdgeIds: edgeIds(bfsGraph, [['A', 'C'], ['C', 'E'], ['E', 'F']]), vertexNotes: { A: '0', B: '1', C: '1', D: '2', E: '2', F: '3' }, formula: 'ε(A)=max{0,1,1,2,2,3}=3' }),
    ], 'Da camada mais distante à excentricidade'),
  ],
  'dfs-classificacao': [
    concept('dfs-estados', 'Descer, terminar e voltar', 'DFS segue um ramo até não poder avançar, então retorna. O estado 0 significa que a visita não começou; 1 significa chamada ainda aberta; 2 significa que terminou. No exemplo dirigido, A→B e B→C descobrem vértices; C→A volta a um ancestral aberto. Mais tarde A→C pula até seu descendente já terminado, enquanto D→C cruza para outro ramo. Ambos chegam ao estado 2, mas são tipos diferentes.', [0, 1], dfs(dfsGraph), 'Árvore, retorno, avanço e cruzamento reais'),
    concept('dfs-nao-dirigido', 'Sem direção, a mesma aresta aparece dos dois lados', 'Num grafo não dirigido, a aresta usada para chegar ao filho também aparece na lista do filho. Ignore essa mesma aresta ao voltar para o pai: ela não forma um ciclo sozinha. Uma outra aresta para um ancestral fecha um ciclo. As arestas se dividem em árvore e retorno; não há avanço nem cruzamento nessa classificação.', [2], dfs(undirectedDfs), 'O triângulo e a aresta de retorno'),
    concept('dfs-alcancados', 'A busca também responde quem é alcançável', 'A coleção descoberta por uma DFS iniciada em v é a alcançabilidade a partir de v. Para essa pergunta, pare depois dessa busca: iniciar novas raízes incluiria vértices que v não alcança. Aqui contamos o próprio v pelo caminho de comprimento zero; se o enunciado exigir caminho positivo, explicite essa convenção.', [3], [
      step(reachGraph, 'Inicie apenas em B. A seta A→B não permite ir de B até A.', { currentVertex: 'B', visitedVertexIds: ['B'] }),
      step(reachGraph, 'De B chegue a C e depois a E. A e D permanecem fora do conjunto alcançado.', { visitedVertexIds: ['B', 'C', 'E'], highlightEdgeIds: edgeIds(reachGraph, [['B', 'C'], ['C', 'E']]), formula: 'Γ⁺(B)={B,C,E} (incluindo caminho de comprimento 0)' }),
    ], 'Uma origem, um conjunto alcançado'),
  ],
  'fecho-transitivo': [
    concept('fecho-transpor', 'Inverter as setas troca a pergunta', 'No grafo original, sair de B revela onde B consegue chegar. Para saber quem consegue chegar a B, inverta todas as setas e saia de B novamente. Isso transforma um caminho A→B do original no caminho B→A do transposto. Os vértices e suas posições permanecem iguais: somente as direções mudam.', [0, 1], [
      step(reachGraph, 'Em G, B alcança C e E. Use a direção das setas.', { highlightEdgeIds: edgeIds(reachGraph, [['B', 'C'], ['C', 'E']]), visitedVertexIds: ['B', 'C', 'E'], formula: 'Γ⁺(B)={B,C,E}' }),
      step(reverseReach, 'Agora todas as setas foram invertidas: este é Gᵀ. Reinicie a busca em B.', { currentVertex: 'B', visitedVertexIds: ['B'] }),
      step(reverseReach, 'Em Gᵀ, B alcança A e D. Logo, no original, A e D chegam a B.', { visitedVertexIds: ['A', 'B', 'D'], highlightEdgeIds: edgeIds(reverseReach, [['B', 'A'], ['B', 'D']]), formula: 'Γ⁻(B) em G = Γ⁺(B) em Gᵀ = {A,B,D}' }),
    ], 'Fecho direto e inverso no mesmo desenho'),
    concept('fecho-uma-origem', 'Uma busca não é a matriz de todos os pares', 'Se a pergunta pede o fecho de B, basta uma busca a partir de B: cada vértice e aresta é examinado um número constante de vezes, O(V+E). Uma matriz completa guarda a resposta para todas as origens; Warshall resolve esse problema maior em O(V³). Primeiro identifique qual dessas saídas o enunciado pede.', [2], [
      step(reachGraph, 'A consulta é somente para B. Preencha uma linha de alcançabilidade; as demais não são necessárias.', { currentVertex: 'B', table: { headers: ['Origem', 'A', 'B', 'C', 'D', 'E'], rows: [['B', '?', '1', '?', '?', '?']] } }),
      step(reachGraph, 'A busca responde a linha inteira de B. Nenhuma busca adicional é necessária para essa pergunta.', { visitedVertexIds: ['B', 'C', 'E'], table: { headers: ['Origem', 'A', 'B', 'C', 'D', 'E'], rows: [['B', '0', '1', '1', '0', '1']] }, formula: 'Uma origem: O(V+E). Todos os pares por Warshall: O(V³).' }),
    ], 'Uma linha da relação de alcançabilidade'),
  ],
  'base-antibase': [
    concept('base-fontes', 'Escolha um representante de cada fonte', 'Uma base fornece pontos de partida que, juntos, alcançam o grafo inteiro. No DAG, toda fonte precisa ser escolhida, pois ninguém chega a ela. Com ciclos, olhe componentes fortemente conexos inteiros: seus membros chegam uns aos outros, portanto um representante basta. Contraia SCCs maximais, não ciclos isolados que podem se sobrepor.', [0, 1, 3], [
      step(baseGraph, 'A e B se alcançam mutuamente. Ambos recebem uma aresta, mas ninguém de fora chega ao componente {A,B}. C também é uma fonte.', { groups: [{ label: 'SCC {A,B}', vertexIds: ['A', 'B'], color: blue }], table: { headers: ['Vértice', 'Grau de entrada'], rows: [['A', '1'], ['B', '1'], ['C', '0'], ['D', '2'], ['E', '1']] } }),
      step(condensedBase, 'Condense {A,B} em AB. Agora as fontes AB e C ficam explícitas; nenhuma recebe seta.', { highlightVertexIds: ['AB', 'C'], table: { headers: ['SCC', 'Entrada'], rows: [['AB', '0'], ['C', '0'], ['D', '2'], ['E', '1']] } }),
      step(baseGraph, 'Escolha A de {A,B} e escolha C. A alcança B,D,E; C alcança D,E. Nenhum dos dois representantes pode faltar.', { highlightVertexIds: ['A', 'C'], visitedVertexIds: ['B', 'D', 'E'], formula: 'Uma base mínima: {A,C}. Outra: {B,C}.' }),
    ], 'Por que contar entradas antes de condensar falha'),
    concept('antibase-sumidouros', 'A anti-base recebe todos os caminhos', 'A anti-base escolhe destinos: todo vértice deve conseguir chegar a pelo menos um deles. Um representante de cada SCC sem saída resolve isso. Transpor a condensação transforma esses sumidouros em fontes, permitindo reaproveitar exatamente o método da base.', [2], [
      step(condensedBase, 'Na condensação original, E é o único sumidouro. AB, C e D conseguem chegar a E.', { highlightVertexIds: ['E'], highlightEdgeIds: edgeIds(condensedBase, [['AB', 'D'], ['C', 'D'], ['D', 'E']]) }),
      step(transpose(condensedBase), 'No transposto, E vira a única fonte e alcança todos. A base do transposto corresponde à anti-base {E} do original.', { currentVertex: 'E', visitedVertexIds: ['E', 'D', 'AB', 'C'], formula: 'Anti-base(G) = base(Gᵀ) = {E}' }),
    ], 'O sumidouro vira fonte ao transpor'),
    concept('base-uma-raiz', 'Uma base de tamanho um pode ter várias escolhas', 'Se a base mínima tem tamanho 1, basta um ponto de partida para alcançar tudo. Isso não significa que exista apenas um vértice possível: todos os membros da única SCC-fonte podem servir de raiz. A frase técnica abaixo usa “único” para o representante escolhido; interpretá-la como unicidade de candidato seria incorreto.', [4], [
      step(oneSource, 'Escolha A: A→B→C alcança todo o grafo. {A} é uma base de tamanho 1.', { currentVertex: 'A', visitedVertexIds: ['A', 'B', 'C'], highlightEdgeIds: edgeIds(oneSource, [['A', 'B'], ['B', 'C']]), formula: 'B₁={A}' }),
      step(oneSource, 'Escolha B: B alcança A e C diretamente. {B} também é uma base mínima. O tamanho é único; a escolha da raiz não.', { currentVertex: 'B', visitedVertexIds: ['A', 'B', 'C'], highlightEdgeIds: edgeIds(oneSource, [['B', 'A'], ['B', 'C']]), formula: 'B₂={B}; |B₁|=|B₂|=1' }),
    ], 'Duas bases mínimas diferentes'),
  ],
  'deteccao-ciclo': [
    concept('ciclo-dfs', 'A seta de volta fecha a pilha', 'Durante DFS, estado 1 significa que o vértice ainda está no caminho ativo de chamadas. Uma seta do vértice atual para esse ancestral fecha um ciclo: pegue o trecho da pilha entre eles e acrescente a seta de retorno. Para provar ausência de ciclos, a DFS precisa cobrir todos os vértices, inclusive componentes não alcançados pela primeira raiz.', [0], [
      step(cycleGraph, 'A pilha ativa é S,A,B,C. Todos estão em estado 1. O caminho A→B→C já existe na árvore de busca.', { currentVertex: 'C', sequence: ['S', 'A', 'B', 'C'], vertexNotes: { S: '1', A: '1', B: '1', C: '1' }, highlightEdgeIds: edgeIds(cycleGraph, [['A', 'B'], ['B', 'C']]) }),
      step(cycleGraph, 'Examine C→A. A ainda está em estado 1: o trecho A,B,C da pilha mais C→A forma o ciclo A→B→C→A.', { currentVertex: 'C', sequence: ['A', 'B', 'C', 'A'], vertexNotes: { S: '1', A: '1', B: '1', C: '1' }, highlightVertexIds: ['A', 'B', 'C'], edgeColorMap: Object.fromEntries(edgeIds(cycleGraph, [['A', 'B'], ['B', 'C'], ['C', 'A']]).map((id) => [id, red])), formula: 'Destino em estado 1 ⇒ ciclo' }),
    ], 'Reconstruindo o ciclo pela pilha'),
    concept('ciclo-kahn', 'A fila de fontes pode travar', 'Outra estratégia remove vértices com grau de entrada zero e atualiza seus sucessores. Num DAG, sempre existe uma nova fonte enquanto restam vértices. Se a fila esvazia antes de remover todos, há um ciclo entre os restantes; alguns vértices restantes também podem ser apenas descendentes de um ciclo. Sem ciclos, a ordem de remoção permite ordenar dependências e calcular maiores caminhos.', [1, 2], [
      step(cycleGraph, 'Somente S tem entrada zero. Coloque S na fila.', { queue: ['S'], table: { headers: ['Vértice', 'Entrada'], rows: [['S', '0'], ['A', '2'], ['B', '1'], ['C', '1']] } }),
      step({ ...cycleGraph, vertices: cycleGraph.vertices.filter((v) => v.id !== 'S'), edges: cycleGraph.edges.filter((e) => e.source !== 'S') }, 'Remova S e S→A. A cai de entrada 2 para 1; ninguém chega a zero. A fila fica vazia com três vértices restantes: há ciclo.', { queue: [], table: { headers: ['Vértice', 'Entrada restante'], rows: [['A', '1'], ['B', '1'], ['C', '1']] }, highlightVertexIds: ['A', 'B', 'C'], formula: 'Processados=1 < |V|=4 ⇒ não é DAG' }),
    ], 'Kahn detecta o ciclo sem recursão'),
  ],
  'excentricidade-raio-diametro': [
    concept('excentricidade-bfs', 'O mais distante depois de cada BFS', 'Excentricidade não conta vizinhos: mede a distância até o vértice mais longe, usando os menores caminhos. Rode BFS de cada origem em grafo não ponderado. O máximo de cada linha é a excentricidade; o máximo de todas as linhas é o diâmetro. Repetir V buscas custa O(V·(V+E)). Aqui o grafo é não dirigido e conexo; em desconexos, distâncias entre componentes são infinitas ou a medida exige uma convenção por componente.', [0, 2], [
      step(pathGraph, 'BFS a partir de A: as distâncias são 0,1,2,3. A maior é 3, portanto ε(A)=3.', { currentVertex: 'A', vertexNotes: { A: '0', B: '1', C: '2', D: '3' }, table: { headers: ['Origem', 'A', 'B', 'C', 'D', 'ε'], rows: [['A', '0', '1', '2', '3', '3']] } }),
      step(pathGraph, 'BFS a partir de B: D fica a duas arestas. ε(B)=2, embora B tenha o mesmo grau de C.', { currentVertex: 'B', vertexNotes: { A: '1', B: '0', C: '1', D: '2' }, table: { headers: ['Origem', 'A', 'B', 'C', 'D', 'ε'], rows: [['A', '0', '1', '2', '3', '3'], ['B', '1', '0', '1', '2', '2']] } }),
      step(pathGraph, 'Complete as buscas de C e D. O maior valor de toda a tabela é 3: esse é o diâmetro.', { currentVertex: 'D', vertexNotes: { A: '3', B: '2', C: '1', D: '0' }, table: { headers: ['Origem', 'A', 'B', 'C', 'D', 'ε'], rows: [['A', '0', '1', '2', '3', '3'], ['B', '1', '0', '1', '2', '2'], ['C', '2', '1', '0', '1', '2'], ['D', '3', '2', '1', '0', '3']] }, formula: 'Diâmetro = max ε(v) = 3' }),
    ], 'Preenchendo as distâncias por origem'),
    concept('raio-centro', 'A melhor posição pode empatar', 'O raio é a menor excentricidade: a menor distância máxima que alguém consegue garantir. Todos os vértices que atingem esse valor formam o centro. Em grafo não dirigido e conexo, qualquer par pode se ligar passando por um centro, usando no máximo duas vezes o raio; por isso raio ≤ diâmetro ≤ 2·raio.', [1, 3], [
      step(pathGraph, 'Compare excentricidades: B e C empatam com o menor valor, 2. Ambos pertencem ao centro.', { vertexNotes: { A: 'ε=3', B: 'ε=2', C: 'ε=2', D: 'ε=3' }, highlightVertexIds: ['B', 'C'], formula: 'Raio=2; Centro={B,C}' }),
      step(pathGraph, 'O par A,D realiza o diâmetro 3. A verificação dá 2 ≤ 3 ≤ 4, consistente com raio 2.', { vertexNotes: { A: 'ε=3', B: 'ε=2', C: 'ε=2', D: 'ε=3' }, highlightVertexIds: ['A', 'D'], highlightEdgeIds: edgeIds(pathGraph, [['A', 'B'], ['B', 'C'], ['C', 'D']]), formula: '2 ≤ 3 ≤ 2·2' }),
    ], 'Dois centros, um raio e um diâmetro'),
  ],
  'scc-kosaraju': [
    concept('kosaraju-ordem', 'O término da primeira busca guia a segunda', 'Uma SCC é um grupo maximal em que qualquer membro alcança qualquer outro. Kosaraju faz uma DFS completa em G e registra términos; depois inverte as setas e reinicia os estados. No transposto, use a ordem decrescente desses términos, pulando os já visitados. Cada nova árvore da segunda DFS é uma SCC. A ordem impede que a busca misture componentes.', [0], [
      ...dfs(sccGraph),
      step(sccGraph, 'A primeira DFS terminou: f(A)=8, f(B)=7, f(C)=6, f(D)=5. Guarde a ordem A,B,C,D, do maior término ao menor.', { sequence: ['A', 'B', 'C', 'D'], vertexNotes: { A: 'f=8', B: 'f=7', C: 'f=6', D: 'f=5' } }),
      step(reversedScc, 'Transponha G e zere as marcas. A é a primeira raiz pela ordem salva; no transposto ela alcança B, mas não C.', { sequence: ['A', 'B', 'C', 'D'], currentVertex: 'A', vertexNotes: { A: '0', B: '0', C: '0', D: '0' } }),
      step(reversedScc, 'A busca de A terminou e revelou {A,B}. Pule B na lista, pois já foi visitado.', { visitedVertexIds: ['A', 'B'], groups: [{ label: 'SCC 1', vertexIds: ['A', 'B'], color: blue }], sequence: ['C', 'D'] }),
      step(reversedScc, 'C é a próxima raiz não visitada. Ela descobre D; a seta C→B encontra um vértice já visitado. A nova SCC é {C,D}.', { visitedVertexIds: ['A', 'B', 'C', 'D'], currentVertex: 'C', groups: [{ label: 'SCC 1', vertexIds: ['A', 'B'], color: blue }, { label: 'SCC 2', vertexIds: ['C', 'D'], color: orange }], sequence: [] }),
    ], 'DFS em G → términos → Gᵀ → componentes'),
    concept('scc-condensacao', 'Ao juntar cada grupo, os ciclos desaparecem', 'Condensar significa substituir cada SCC inteira por um vértice e manter somente as ligações entre grupos. Se a condensação tivesse um ciclo, os grupos desse ciclo seriam mutuamente alcançáveis e deveriam formar uma única SCC. Por isso ela é sempre DAG. Num grafo fortemente conexo tudo vira um vértice; num DAG, cada vértice original já é uma SCC.', [1, 2], [
      step(sccGraph, 'Há dois grupos de alcançabilidade mútua: {A,B} e {C,D}. B→C conecta os grupos apenas em uma direção.', { groups: [{ label: 'AB', vertexIds: ['A', 'B'], color: blue }, { label: 'CD', vertexIds: ['C', 'D'], color: orange }], highlightEdgeIds: edgeIds(sccGraph, [['B', 'C']]) }),
      step(sccCondensation, 'Cada grupo virou um vértice: AB→CD. AB é fonte, CD é sumidouro; cada vértice deste DAG é sua própria SCC.', { vertexColorMap: { AB: blue, CD: orange }, formula: 'Base: representante de AB. Anti-base: representante de CD.' }),
    ], 'Dois ciclos internos viram um DAG'),
  ],
  euleriano: [
    concept('euler-fleury', 'Gaste cada aresta sem se prender cedo demais', 'Um percurso euleriano usa todas as arestas exatamente uma vez; vértices podem reaparecer. No caso não dirigido, comece num vértice ímpar quando houver dois. Fleury evita uma ponte do grafo de arestas ainda não usadas se houver alternativa, pois atravessá-la cedo pode abandonar arestas do outro lado. Reavalie as pontes a cada passo e termine apenas quando todas as arestas forem usadas: voltar ao início sozinho não garante conclusão.', [0], [
      step(fleuryGraph, 'A e D têm graus ímpares (3 e 1). Comece em A. A–D é ponte: se usá-la agora, ficará preso em D e abandonará o triângulo.', { currentVertex: 'A', vertexNotes: { A: 'grau 3', B: 'grau 2', C: 'grau 2', D: 'grau 1' }, edgeColorMap: Object.fromEntries(edgeIds(fleuryGraph, [['A', 'D']]).map((id) => [id, red])) }),
      step(fleuryGraph, 'Use A–B, que não é ponte no grafo inicial. As arestas destacadas já foram usadas; não podem ser repetidas.', { currentVertex: 'B', sequence: ['A', 'B'], highlightEdgeIds: edgeIds(fleuryGraph, [['A', 'B']]), traversal: { from: 'A', to: 'B' } }),
      step(fleuryGraph, 'Em B, B–C é a única aresta restante incidente: use-a, mesmo sendo agora uma ponte do restante.', { currentVertex: 'C', sequence: ['A', 'B', 'C'], highlightEdgeIds: edgeIds(fleuryGraph, [['A', 'B'], ['B', 'C']]), traversal: { from: 'B', to: 'C' } }),
      step(fleuryGraph, 'Use C–A. Voltamos a A, mas ainda falta A–D: não pare só por reencontrar o início.', { currentVertex: 'A', sequence: ['A', 'B', 'C', 'A'], highlightEdgeIds: edgeIds(fleuryGraph, [['A', 'B'], ['B', 'C'], ['C', 'A']]), traversal: { from: 'C', to: 'A' } }),
      step(fleuryGraph, 'Agora A–D é a única opção. Use-a e termine em D: todas as quatro arestas foram usadas uma vez.', { currentVertex: 'D', sequence: ['A', 'B', 'C', 'A', 'D'], highlightEdgeIds: fleuryGraph.edges.map((e) => e.id), traversal: { from: 'A', to: 'D' }, formula: 'Caminho aberto: A→B→C→A→D' }),
    ], 'Uma ponte que deve esperar'),
    concept('euler-paridade', 'Entradas e saídas formam pares', 'Ao passar por um vértice intermediário, gastamos uma aresta para entrar e outra para sair. Um circuito exige grau par em todo vértice com arestas; um caminho aberto permite exatamente dois ímpares, os extremos. Os vértices de grau positivo devem estar no mesmo componente. Um isolado não impede usar todas as arestas do componente não trivial. Mais de dois ímpares não cabem nos dois extremos de um único percurso.', [1, 2], [
      step(evenGraph, 'O triângulo tem todos os graus pares. I é isolado e não possui arestas que precisem ser percorridas.', { vertexNotes: { A: '2', B: '2', C: '2', I: '0' }, highlightVertexIds: ['I'] }),
      step(evenGraph, 'A→B→C→A usa todas as arestas e fecha um circuito. O isolado I continua sem participar.', { sequence: ['A', 'B', 'C', 'A'], highlightEdgeIds: evenGraph.edges.map((e) => e.id), highlightVertexIds: ['A', 'B', 'C'] }),
      step(oddGraph, 'Compare com esta estrela: O tem grau 3; A,B,C têm grau 1. São quatro ímpares: não existe caminho euleriano.', { vertexNotes: { O: '3: ímpar', A: '1: ímpar', B: '1: ímpar', C: '1: ímpar' }, vertexColorMap: { O: red, A: red, B: red, C: red }, formula: '4 vértices ímpares > 2 extremos' }),
    ], 'Isolado permitido, quatro ímpares impossíveis'),
  ],
  dijkstra: [
    concept('dijkstra-relaxar', 'Uma estimativa pode melhorar antes de ficar definitiva', 'Dijkstra mantém a melhor distância conhecida e escolhe o candidato de menor valor para torná-lo definitivo. Relaxar u→v é comparar a estimativa de v com D[u]+peso: se o caminho via u for melhor, atualize distância e predecessor. Com pesos não negativos, caminhos passando por candidatos mais distantes não poderão melhorar o vértice recém-finalizado.', [0], dijkstraSteps, 'A distância de A muda de 5 para 3'),
    concept('dijkstra-negativos', 'O peso não negativo sustenta a escolha do mínimo', 'Uma aresta negativa pode criar um atalho vindo de um vértice que parecia mais distante: assim uma distância considerada definitiva pode estar errada. O Dijkstra padrão não se aplica nesse caso; Bellman–Ford é uma alternativa, com tratamento de ciclos negativos.', [1], [
      step(negativeGraph, 'Depois de S, as estimativas são A=2 e B=5. O Dijkstra padrão finalizaria A primeiro.', { currentVertex: 'A', visitedVertexIds: ['S', 'A'], vertexNotes: { S: '0', A: '2: definitivo?', B: '5' }, highlightEdgeIds: edgeIds(negativeGraph, [['S', 'A']]), table: { headers: ['Candidato', 'D'], rows: [['A', '2'], ['B', '5']] } }),
      step(negativeGraph, 'Mas S→B→A custa 5−4=1, menor que 2. A aresta negativa invalida a decisão de finalizar A cedo.', { currentVertex: 'B', vertexNotes: { S: '0', A: 'melhor: 1', B: '5' }, highlightEdgeIds: edgeIds(negativeGraph, [['S', 'B'], ['B', 'A']]), formula: '5+(−4)=1 < 2' }),
    ], 'Um contraexemplo com peso negativo'),
    concept('dijkstra-custo', 'Como encontrar o próximo mínimo', 'A escolha do próximo vértice pode usar uma varredura dos candidatos: até V comparações em cada uma de V retiradas, dando O(V²) na implementação usual para grafo simples. Uma fila de prioridade com heap mantém o mínimo disponível; retirar o mínimo e atualizar prioridades custa O(log V) por operação. Com listas de adjacência, o total é O((V+E)log V). As distâncias finais são as mesmas: muda o trabalho para escolher e atualizar candidatos.', [2], [
      step(weightedGraph, 'Após processar S, a busca linear examina A primeiro: distância 5 é o menor valor visto até aqui.', { visitedVertexIds: ['S'], currentVertex: 'A', vertexNotes: { S: '0: definitivo', A: '5: candidato', B: '1', T: '∞' }, table: { headers: ['Vértice', 'Examinado?', 'D'], rows: [['A', 'sim', '5'], ['B', 'não', '1'], ['T', 'não', '∞']] } }),
      step(weightedGraph, 'Examine B e T: B=1 vence A=5; T=∞ não melhora. Só depois de verificar os candidatos a varredura escolhe B.', { visitedVertexIds: ['S'], currentVertex: 'B', vertexNotes: { S: '0: definitivo', A: '5', B: '1: mínimo', T: '∞' }, table: { headers: ['Vértice', 'Examinado?', 'D'], rows: [['A', 'sim', '5'], ['B', 'sim', '1'], ['T', 'sim', '∞']] }, formula: 'Varredura: até V candidatos × V retiradas → O(V²)' }),
      step(weightedGraph, 'Com heap, B já está na raiz da fila de prioridade. Retire B e atualize as prioridades dos destinos relaxados: A passa a 3 e T a 9.', { visitedVertexIds: ['S', 'B'], currentVertex: 'B', queue: ['A', 'T'], queueLabel: 'Fila de prioridade', vertexNotes: { S: '0: definitivo', A: '3', B: '1: definitivo', T: '9' }, highlightEdgeIds: edgeIds(weightedGraph, [['B', 'A'], ['B', 'T']]), table: { headers: ['Fila de prioridade após B', 'Prioridade'], rows: [['A', '3'], ['T', '9']] }, formula: 'Heap: O((V+E)log V)' }),
    ], 'Varredura de candidatos e fila de prioridade'),
    concept('dijkstra-predecessores', 'Leia os predecessores de trás para frente', 'A distância informa quanto custa; os predecessores dizem por onde ir. Parta do destino e siga seu predecessor até a origem, então inverta a lista. Cada melhoria de distância precisa atualizar também o predecessor. Se o destino continua em infinito, não há caminho a reconstruir a partir dessa origem.', [3], [
      step(weightedGraph, 'Resultado final: pred(T)=A, pred(A)=B e pred(B)=S. Comece pelo destino T.', { currentVertex: 'T', sequence: ['T'], table: { headers: ['Vértice', 'D', 'Predecessor'], rows: [['S', '0', '—'], ['A', '3', 'B'], ['B', '1', 'S'], ['T', '4', 'A']] } }),
      step(weightedGraph, 'Siga os predecessores: T,A,B,S. As arestas continuam apontando no sentido do caminho original.', { sequence: ['T', 'A', 'B', 'S'], highlightEdgeIds: edgeIds(weightedGraph, [['A', 'T'], ['B', 'A'], ['S', 'B']]), currentVertex: 'S' }),
      step(weightedGraph, 'Inverta a lista: S→B→A→T. Seu custo é 1+2+1=4, igual à distância calculada.', { sequence: ['S', 'B', 'A', 'T'], highlightEdgeIds: edgeIds(weightedGraph, [['S', 'B'], ['B', 'A'], ['A', 'T']]), currentVertex: 'T', formula: 'Caminho S→B→A→T; custo 4' }),
    ], 'Da tabela ao caminho completo'),
  ],
  'topologica-maior-caminho': [
    concept('topologica-kahn', 'Libere tarefas cujas dependências terminaram', 'Uma ordem topológica põe a origem de cada seta antes do destino. Kahn escolhe um vértice com entrada zero, registra-o e remove suas arestas; isso pode liberar novos vértices. Mais de uma escolha pode estar disponível e gerar ordens válidas diferentes. Se restam vértices, mas nenhum tem entrada zero, existe ciclo e nenhuma ordenação topológica é possível.', [0], [
      step(dag, 'S é a única fonte. A e B dependem de S; T depende de A e B.', { queue: ['S'], table: { headers: ['Vértice', 'Entrada restante'], rows: [['S', '0'], ['A', '1'], ['B', '1'], ['T', '2']] } }),
      step(dag, 'Registre S e desconte suas arestas: A e B chegam a entrada zero. Ambos entram na fila; escolha A antes de B.', { visitedVertexIds: ['S'], queue: ['A', 'B'], sequence: ['S'], table: { headers: ['Vértice', 'Entrada restante'], rows: [['S', 'removido'], ['A', '0'], ['B', '0'], ['T', '2']] } }),
      step(dag, 'Registre A: a entrada restante de T cai de 2 para 1. T ainda precisa esperar B.', { visitedVertexIds: ['S', 'A'], queue: ['B'], sequence: ['S', 'A'], highlightEdgeIds: edgeIds(dag, [['A', 'T']]), table: { headers: ['Vértice', 'Entrada restante'], rows: [['S', 'removido'], ['A', 'removido'], ['B', '0'], ['T', '1']] } }),
      step(dag, 'Registre B: agora T chega a zero e entra na fila.', { visitedVertexIds: ['S', 'A', 'B'], queue: ['T'], sequence: ['S', 'A', 'B'], highlightEdgeIds: edgeIds(dag, [['B', 'T']]), table: { headers: ['Vértice', 'Entrada restante'], rows: [['S', 'removido'], ['A', 'removido'], ['B', 'removido'], ['T', '0']] } }),
      step(dag, 'Registre T. Todos foram processados: S,A,B,T é uma ordem válida. S,B,A,T também respeita todas as setas.', { visitedVertexIds: ['S', 'A', 'B', 'T'], queue: [], sequence: ['S', 'A', 'B', 'T'], formula: 'Para toda u→v, u aparece antes de v.' }),
    ], 'A fila de tarefas disponíveis'),
    concept('topologica-dfs', 'Inverta a ordem em que a DFS termina', 'Uma DFS completa num DAG termina os destinos de uma aresta antes de terminar sua origem. Assim, ordenar pelos términos decrescentes coloca cada origem antes dos destinos. Primeiro confirme a ausência de arestas de retorno: usar os mesmos números num grafo cíclico não produz uma ordem topológica válida.', [1], [
      ...dfs(dag),
      step(dag, 'A DFS termina T,A,B,S, nessa ordem. Os tempos são T=4, A=5, B=7, S=8.', { sequence: ['T', 'A', 'B', 'S'], vertexNotes: { T: 'f=4', A: 'f=5', B: 'f=7', S: 'f=8' } }),
      step(dag, 'Leia os términos em ordem decrescente: S,B,A,T. Esta é outra ordem topológica válida para o mesmo DAG.', { sequence: ['S', 'B', 'A', 'T'], highlightVertexIds: ['S'], vertexNotes: { S: '1º', B: '2º', A: '3º', T: '4º' } }),
    ], 'Término crescente e ordem topológica decrescente'),
    concept('dag-maior-caminho', 'A dependência mais longa determina a espera', 'Percorra o DAG na ordem topológica, de modo que todos os predecessores de um vértice já tenham sido resolvidos. Para maior caminho a partir de S, inicie dist(S)=0 e os demais em −∞; em cada aresta, maximize dist(v) com dist(u)+peso. No agendamento, use pesos que representem durações e uma origem comum; com recursos ilimitados, o maior caminho determina o tempo mínimo de conclusão porque todas as dependências precisam ser satisfeitas.', [2, 3], [
      step(dag, 'Os pesos representam durações de etapas entre marcos. Inicialize S=0 e os demais em −∞: ainda não existe caminho conhecido.', { sequence: ['S', 'A', 'B', 'T'], vertexNotes: { S: '0', A: '−∞', B: '−∞', T: '−∞' }, table: { headers: ['Processado', 'S', 'A', 'B', 'T'], rows: [['Inicial', '0', '−∞', '−∞', '−∞']] } }),
      step(dag, 'Processe S: A recebe 0+3=3 e B recebe 0+2=2.', { currentVertex: 'S', highlightEdgeIds: edgeIds(dag, [['S', 'A'], ['S', 'B']]), vertexNotes: { S: '0', A: '3', B: '2', T: '−∞' }, table: { headers: ['Processado', 'S', 'A', 'B', 'T'], rows: [['S', '0', '3', '2', '−∞']] } }),
      step(dag, 'Processe A: o caminho até T passando por A vale 3+4=7. T recebe 7.', { currentVertex: 'A', highlightEdgeIds: edgeIds(dag, [['A', 'T']]), vertexNotes: { S: '0', A: '3', B: '2', T: '7' }, table: { headers: ['Processado', 'S', 'A', 'B', 'T'], rows: [['S', '0', '3', '2', '−∞'], ['A', '0', '3', '2', '7']] } }),
      step(dag, 'Processe B: a proposta 2+1=3 não supera 7. Preserve T=7; depois processe T, que não tem saídas.', { currentVertex: 'B', highlightEdgeIds: edgeIds(dag, [['B', 'T']]), vertexNotes: { S: '0', A: '3', B: '2', T: '7' }, formula: 'dist(T)=max(3+4,2+1)=7', table: { headers: ['Processado', 'S', 'A', 'B', 'T'], rows: [['S', '0', '3', '2', '−∞'], ['A', '0', '3', '2', '7'], ['B', '0', '3', '2', '7'], ['T', '0', '3', '2', '7']] } }),
      step(dag, 'O caminho crítico é S→A→T, com duração 7. O ramo via B termina em 3, mas T precisa esperar a dependência de duração 7.', { sequence: ['S', 'A', 'T'], highlightEdgeIds: edgeIds(dag, [['S', 'A'], ['A', 'T']]), highlightVertexIds: ['S', 'A', 'T'], formula: 'Tempo mínimo de conclusão = 7' }),
    ], 'Maximização progressiva e caminho crítico'),
  ],
};
