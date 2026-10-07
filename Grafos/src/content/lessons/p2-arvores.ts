import type { GraphData } from '../types';
import type { AnimationStep, GraphConcept, LessonCatalog } from './types';
import { BLUE, GREEN, AMBER, RED } from './builders';
import { concept, edgeIdsOf, placed, step } from './p2';
import { P2_2024_Q1, SLIDE_MST, SLIDE_SPANNING } from '../questions/graphs-p2';
import { connectedComponentCount, cutSet, kruskal, prim, rankAndNullity } from '../../lib/graph';

const gray = 'var(--color-text-tertiary)';
const colorAll = (ids: string[], color: string) => Object.fromEntries(ids.map((id) => [id, color]));
const pair = (g: GraphData, id: string) => {
  const e = g.edges.find((x) => x.id === id)!;
  return `${e.source}–${e.target}`;
};




const without = (g: GraphData, ids: string[]): GraphData => ({ ...g, edges: g.edges.filter((e) => !ids.includes(e.id)) });

// ---------------------------------------------------------------------------
// Animações geradas pelo motor
// ---------------------------------------------------------------------------

function primSteps(graph: GraphData, start: string): AnimationStep[] {
  const { steps, treeEdgeIds } = prim(graph, start);
  return steps.map((s, i) => {
    const inTree = s.highlightVertices ?? (i === 0 ? [start] : graph.vertices.map((v) => v.id));
    const tree = treeEdgeIds.slice(0, Math.max(0, i));
    const cut = i < steps.length - 1 ? cutSet(graph, inTree) : [];
    return step(graph, i === 0 ? `${s.description} As arestas em âmbar formam cut(S): é entre elas que se escolhe a mais barata.` : s.description, {
      currentVertex: s.currentVertex,
      visitedVertexIds: inTree,
      vertexColorMap: colorAll(inTree, GREEN),
      highlightEdgeIds: tree,
      edgeColorMap: { ...colorAll(cut, AMBER), ...colorAll(tree, GREEN) },
      sequence: tree.map((id) => pair(graph, id)),
      sequenceLabel: 'U (arestas da árvore)',
      formula: `custo = ${tree.reduce((acc, id) => acc + (graph.edges.find((e) => e.id === id)!.weight ?? 1), 0)}`,
      legend: [{ label: 'S / arestas em U', color: GREEN }, { label: 'cut(S)', color: AMBER }],
    });
  });
}

function kruskalSteps(graph: GraphData): AnimationStep[] {
  const { steps, treeEdgeIds, rejectedEdgeIds } = kruskal(graph);
  const order = [...graph.edges].map((e, i) => ({ e, i })).sort((x, y) => (x.e.weight ?? 1) - (y.e.weight ?? 1) || x.i - y.i).map((x) => x.e.id);
  return steps.map((s, i) => {
    const processed = order.slice(0, i);
    const accepted = processed.filter((id) => treeEdgeIds.includes(id));
    const rejected = processed.filter((id) => rejectedEdgeIds.includes(id));
    const current = i > 0 && i <= order.length ? order[i - 1] : undefined;
    return step(graph, s.description, {
      highlightEdgeIds: accepted,
      highlightVertexIds: s.highlightVertices,
      edgeColorMap: { ...colorAll(accepted, GREEN), ...colorAll(rejected, RED) },
      edgeLabels: current ? { [current]: rejectedEdgeIds.includes(current) ? 'ciclo' : 'aceita' } : {},
      table: {
        headers: ['Aresta', 'Custo', 'Situação'],
        rows: order.map((id) => [pair(graph, id), String(graph.edges.find((e) => e.id === id)!.weight), accepted.includes(id) ? 'em T' : rejected.includes(id) ? 'descartada' : '—']),
      },
      legend: [{ label: 'Em T', color: GREEN }, { label: 'Descartada (criaria ciclo)', color: RED }],
    });
  });
}

/** Reverse-Delete (quadro 25): ordem não crescente; apaga se continuar conexo. */
function reverseDeleteSteps(graph: GraphData): AnimationStep[] {
  const order = [...graph.edges].map((e, i) => ({ e, i })).sort((x, y) => (y.e.weight ?? 1) - (x.e.weight ?? 1) || x.i - y.i).map((x) => x.e);
  const k0 = connectedComponentCount(graph);
  let kept = graph.edges.map((e) => e.id);
  const deleted: string[] = [];
  const out: AnimationStep[] = [step(graph, `E′ = E. Ordem não crescente de custo: ${order.map((e) => `${e.source}–${e.target}=${e.weight}`).join(', ')}.`, {})];
  for (const e of order) {
    const trial = kept.filter((id) => id !== e.id);
    const stillConnected = connectedComponentCount({ ...graph, edges: graph.edges.filter((x) => trial.includes(x.id)) }) === k0;
    if (stillConnected) {
      kept = trial;
      deleted.push(e.id);
    }
    out.push(
      step(graph, `${e.source}–${e.target} (custo ${e.weight}): ${stillConnected ? 'sem ela o grafo continua conexo — apaga.' : 'sem ela o grafo desconecta — mantém.'}`, {
        highlightEdgeIds: kept,
        edgeColorMap: { ...colorAll(deleted, gray), [e.id]: stillConnected ? RED : GREEN },
        highlightVertexIds: [e.source, e.target],
        formula: `custo de E′ = ${graph.edges.filter((x) => kept.includes(x.id)).reduce((acc, x) => acc + (x.weight ?? 1), 0)}`,
      }),
    );
  }
  return out;
}

// ---------------------------------------------------------------------------
// Árvores
// ---------------------------------------------------------------------------

const TREE = placed({ a: [280, 40], b: [150, 140], c: [410, 140], d: [80, 260], e: [220, 260], f: [410, 260] }, [['a', 'b'], ['a', 'c'], ['b', 'd'], ['b', 'e'], ['c', 'f']]);
const WITH_CYCLE = { ...TREE, edges: [...TREE.edges, { id: 'e5', source: 'e', target: 'c' }] };
const FOREST = without(TREE, ['e1']);

const arvores: GraphConcept[] = [
  concept(
    'arvore-definicao',
    'Conexo e sem ciclo, ao mesmo tempo',
    'Árvore exige duas coisas juntas: estar tudo ligado (conexo) e não ter nenhum ciclo. Tire a conexidade e você tem uma floresta; acrescente uma aresta e aparece um ciclo. Como não há ciclo, entre dois vértices só existe um caminho — se houvesse dois, juntos eles fechariam um ciclo. Exemplos criados para explicação, no formato dos quadros 3 e 4.',
    [0],
    [
      step(TREE, 'Árvore: 6 vértices, conexa e sem ciclo.', { highlightEdgeIds: TREE.edges.map((e) => e.id), edgeColorMap: colorAll(TREE.edges.map((e) => e.id), GREEN) }),
      step(TREE, 'Entre d e f existe exatamente um caminho: d–b–a–c–f.', { sequence: ['d', 'b', 'a', 'c', 'f'], highlightEdgeIds: edgeIdsOf(TREE, [['d', 'b'], ['b', 'a'], ['a', 'c'], ['c', 'f']]) }),
      step(WITH_CYCLE, 'Com a aresta e–c aparece o ciclo a–b–e–c–a: não é mais árvore ("has cycle"). E agora há dois caminhos entre e e c.', { highlightEdgeIds: edgeIdsOf(WITH_CYCLE, [['a', 'b'], ['b', 'e'], ['e', 'c'], ['c', 'a']]), edgeColorMap: colorAll(edgeIdsOf(WITH_CYCLE, [['a', 'b'], ['b', 'e'], ['e', 'c'], ['c', 'a']]), RED) }),
      step(FOREST, 'Sem a aresta a–c, o grafo fica desconexo: duas árvores, {a,b,d,e} e {c,f}. É uma floresta.', { groups: [{ label: 'árvore 1', vertexIds: ['a', 'b', 'd', 'e'], color: BLUE }, { label: 'árvore 2', vertexIds: ['c', 'f'], color: AMBER }] }),
    ],
    'Árvore, ciclo e floresta',
  ),
  concept(
    'arvore-folhas',
    'Pelo menos duas pontas soltas',
    'Folha é a ponta de um galho: grau 1. Todo o resto, com grau maior que 1, é vértice interno. O slide afirma que toda árvore com pelo menos dois vértices tem pelo menos duas folhas — no exemplo, são três.',
    [1],
    [
      step(TREE, 'Graus: a = 2, b = 3, c = 2, d = 1, e = 1, f = 1.', { vertexNotes: { a: 'grau 2', b: 'grau 3', c: 'grau 2', d: 'grau 1', e: 'grau 1', f: 'grau 1' } }),
      step(TREE, 'Folhas (grau 1): d, e, f. Internos (grau > 1): a, b, c. Pelo menos duas folhas, como diz o teorema.', { vertexColorMap: { d: GREEN, e: GREEN, f: GREEN, a: BLUE, b: BLUE, c: BLUE }, legend: [{ label: 'Folha', color: GREEN }, { label: 'Interno', color: BLUE }] }),
    ],
    'Contando folhas',
  ),
  concept(
    'arvore-contagem',
    'n − 1 para árvore, n − k para floresta',
    'Uma árvore com n vértices tem n − 1 arestas: uma a menos que vértices. Se for floresta com k árvores, cada árvore "perde" uma, e o total é n − k. A recíproca do slide exige conexidade: conexo com n − 1 arestas é árvore.',
    [2],
    [
      step(TREE, 'Árvore: n = 6 vértices e 5 arestas.', { formula: '|E| = n − 1 = 6 − 1 = 5', highlightEdgeIds: TREE.edges.map((e) => e.id) }),
      step(FOREST, 'Floresta com k = 2 árvores: 6 vértices e 4 arestas.', { formula: '|E| = n − k = 6 − 2 = 4', groups: [{ label: 'árvore 1', vertexIds: ['a', 'b', 'd', 'e'], color: BLUE }, { label: 'árvore 2', vertexIds: ['c', 'f'], color: AMBER }] }),
      step(WITH_CYCLE, 'Lema do slide: remover uma aresta de um ciclo mantém a conexidade. Tirando e–c do ciclo, volta a ser a árvore e continua conexo.', { highlightEdgeIds: ['e5'], edgeColorMap: { e5: RED }, formula: 'conexo e n − 1 arestas ⇒ árvore' }),
    ],
    'Contagem de arestas',
  ),
];

// ---------------------------------------------------------------------------
// Árvore geradora
// ---------------------------------------------------------------------------

const ag1 = without(SLIDE_SPANNING, edgeIdsOf(SLIDE_SPANNING, [['a', 'g']]));
const ag2 = without(ag1, edgeIdsOf(SLIDE_SPANNING, [['e', 'a']]));
const slideChords = edgeIdsOf(SLIDE_SPANNING, [['f', 'e'], ['a', 'g']]);
const rn = rankAndNullity(SLIDE_SPANNING);

const arvoreGeradora: GraphConcept[] = [
  concept(
    'geradora-construcao',
    'Quebre ciclos até sobrar uma árvore',
    'Se G é conexo, sempre dá para tirar uma árvore geradora dele: ache um ciclo, apague qualquer aresta desse ciclo e repita. Como apagar uma aresta de ciclo não desconecta nada, no final sobra algo conexo e sem ciclo, passando por todos os vértices. É o roteiro do quadro 7, com as mesmas remoções do slide.',
    [0, 1],
    [
      step(SLIDE_SPANNING, 'G conexo, 8 vértices e 9 arestas. Existe ciclo? Sim: a–c–g–a.', { highlightEdgeIds: edgeIdsOf(SLIDE_SPANNING, [['a', 'c'], ['c', 'g'], ['g', 'a']]), edgeColorMap: colorAll(edgeIdsOf(SLIDE_SPANNING, [['a', 'c'], ['c', 'g'], ['g', 'a']]), AMBER) }),
      step(ag1, 'Remove a aresta a–g. Continua conexo. Existe ciclo? Sim: a–f–e–a.', { highlightEdgeIds: edgeIdsOf(ag1, [['a', 'f'], ['f', 'e'], ['e', 'a']]), edgeColorMap: colorAll(edgeIdsOf(ag1, [['a', 'f'], ['f', 'e'], ['e', 'a']]), AMBER) }),
      step(ag2, 'Remove a aresta a–e. T continua conexo e não tem ciclo: é árvore. Alcança todos os vértices: é árvore GERADORA.', { highlightEdgeIds: ag2.edges.map((e) => e.id), edgeColorMap: colorAll(ag2.edges.map((e) => e.id), GREEN), formula: '8 vértices, 7 arestas = n − 1' }),
    ],
    'Quadro 7 de 29',
  ),
  concept(
    'geradora-ramos-cordas',
    'Ramos ficam, cordas sobram',
    'Depois de escolher a árvore geradora T, cada aresta de G cai em um de dois grupos: ramo (está em T) ou corda (está em G, mas não em T). No quadro 11, as cordas aparecem em vermelho: f–e e a–g. Se G for desconexo, em vez de uma árvore você tem uma floresta geradora — uma árvore por componente.',
    [2],
    [
      step(SLIDE_SPANNING, 'Árvore geradora escolhida no quadro 11: todas as arestas menos f–e e a–g.', { highlightEdgeIds: SLIDE_SPANNING.edges.filter((e) => !slideChords.includes(e.id)).map((e) => e.id), edgeColorMap: colorAll(SLIDE_SPANNING.edges.filter((e) => !slideChords.includes(e.id)).map((e) => e.id), GREEN) }),
      step(SLIDE_SPANNING, 'Cordas (em vermelho): f–e e a–g. Ramos (em verde): as outras 7.', { edgeColorMap: { ...colorAll(SLIDE_SPANNING.edges.map((e) => e.id), GREEN), ...colorAll(slideChords, RED) }, edgeLabels: colorAll(slideChords, 'corda'), legend: [{ label: 'Ramo', color: GREEN }, { label: 'Corda', color: RED }] }),
    ],
    'Quadro 11 de 29',
  ),
  concept(
    'geradora-posto-nulidade',
    'Contando ramos e cordas',
    'Posto = quantos ramos: n − k. Nulidade = quantas cordas: o resto das arestas, e − (n − k). Aqui o slide tem um problema: a fórmula impressa é e − n − k, mas o exemplo do mesmo slide só fecha com e − n + k. Confira os números.',
    [3],
    [
      step(SLIDE_SPANNING, `n = ${rn.n}, e = ${rn.e}, k = ${rn.k}. Posto r = n − k = ${rn.rank} ramos.`, { formula: `r = ${rn.n} − ${rn.k} = ${rn.rank}` }),
      step(SLIDE_SPANNING, `Cordas no desenho: 2. Fórmula impressa: e − n − k = ${rn.e - rn.n - rn.k} (não bate). Pelas definições: e − (n − k) = e − n + k = ${rn.nullity} (bate).`, { edgeColorMap: colorAll(slideChords, RED), formula: `μ = ${rn.e} − ${rn.rank} = ${rn.nullity}` }),
    ],
    'O conflito do quadro 11',
  ),
];

// ---------------------------------------------------------------------------
// Cortes
// ---------------------------------------------------------------------------

const S1 = ['a', 'd'];
const cut1 = cutSet(SLIDE_MST, S1);
const KAPPA = placed({ a: [90, 80], b: [90, 240], c: [250, 160], d: [410, 80], e: [410, 240] }, [['a', 'b'], ['a', 'c'], ['b', 'c'], ['c', 'd'], ['c', 'e'], ['d', 'e']]);
const cycleEdges = edgeIdsOf(SLIDE_MST, [['b', 'e'], ['e', 'd'], ['d', 'b']]);

const cortes: GraphConcept[] = [
  concept(
    'corte-cutS',
    'Separe o grafo em dois lados',
    'Escolha um conjunto S de vértices. cut(S) são as arestas que têm uma ponta dentro de S e a outra fora. Apagando essas arestas, S fica separado do resto — por isso cut(S) é um corte. Exemplo no grafo da AGM do slide.',
    [0],
    [
      step(SLIDE_MST, `S = {${S1.join(', ')}}. Arestas com uma ponta em S e outra em V − S: ${cut1.map((id) => pair(SLIDE_MST, id)).join(', ')}.`, { groups: [{ label: 'S', vertexIds: S1, color: BLUE }], edgeColorMap: colorAll(cut1, AMBER), highlightEdgeIds: cut1 }),
      step(without(SLIDE_MST, cut1), 'Apagando cut(S), a e d ficam isolados do resto: dois componentes. É um corte.', { groups: [{ label: 'S', vertexIds: S1, color: BLUE }, { label: 'V − S', vertexIds: ['b', 'c', 'e', 'f', 'g'], color: AMBER }] }),
    ],
    'cut(S) no grafo do quadro 16',
  ),
  concept(
    'corte-conectividade',
    'Quantas peças é preciso tirar',
    'Conectividade mede a resistência do grafo: λ(G) é o menor número de arestas que, removidas, desconectam; κ(G) é o menor número de vértices. Um vértice cuja remoção desconecta é ponto de articulação, e o grafo com κ = 1 é separável. O slide afirma κ ≤ λ ≤ δ. Exemplo criado para explicação: dois triângulos presos no vértice c.',
    [1],
    [
      step(KAPPA, 'Menor grau: δ = 2 (a, b, d, e). Removendo as 2 arestas de a, ele se separa: λ ≤ 2. Uma aresta só não desconecta, então λ = 2.', { vertexNotes: { a: 'grau 2', b: 'grau 2', c: 'grau 4', d: 'grau 2', e: 'grau 2' }, highlightEdgeIds: edgeIdsOf(KAPPA, [['a', 'b'], ['a', 'c']]), edgeColorMap: colorAll(edgeIdsOf(KAPPA, [['a', 'b'], ['a', 'c']]), AMBER) }),
      step(KAPPA, 'Removendo só o vértice c, os dois triângulos se separam: κ = 1. c é ponto de articulação e o grafo é separável.', { vertexColorMap: { c: RED }, groups: [{ label: 'lado 1', vertexIds: ['a', 'b'], color: BLUE }, { label: 'lado 2', vertexIds: ['d', 'e'], color: AMBER }], formula: 'κ = 1 ≤ λ = 2 ≤ δ = 2' }),
    ],
    'Articulação e κ ≤ λ ≤ δ',
  ),
  concept(
    'corte-propriedade',
    'A mais barata do corte é segura',
    'Propriedade do corte: com custos distintos, a aresta mais barata que atravessa um corte está em TODA AGM. É ela que o Prim escolhe a cada passo: o corte é entre a árvore construída e o resto.',
    [2],
    [
      step(SLIDE_MST, `cut({a,d}) = ${cut1.map((id) => `${pair(SLIDE_MST, id)} (${SLIDE_MST.edges.find((e) => e.id === id)!.weight})`).join(', ')}.`, { groups: [{ label: 'S', vertexIds: S1, color: BLUE }], edgeColorMap: colorAll(cut1, AMBER), edgeLabels: Object.fromEntries(cut1.map((id) => [id, String(SLIDE_MST.edges.find((e) => e.id === id)!.weight)])) }),
      step(SLIDE_MST, 'A mais barata do corte é d–f, custo 6: pela propriedade, ela está na AGM. (A AGM calculada, de custo 39, de fato contém d–f.)', { groups: [{ label: 'S', vertexIds: S1, color: BLUE }], highlightEdgeIds: edgeIdsOf(SLIDE_MST, [['d', 'f']]), edgeColorMap: { ...colorAll(cut1, AMBER), ...colorAll(edgeIdsOf(SLIDE_MST, [['d', 'f']]), GREEN) } }),
    ],
    'Quadros 20-21',
  ),
  concept(
    'ciclo-propriedade',
    'A mais cara do ciclo nunca entra',
    'Propriedade do ciclo: num ciclo qualquer, a aresta mais cara não pertence a nenhuma AGM. Os comentários do slide juntam as duas: incluir pela propriedade do corte e excluir pela do ciclo sempre dá AGM. Se houver pesos iguais, o slide manda perturbar cada peso por um valor infinitesimal.',
    [3],
    [
      step(SLIDE_MST, 'Ciclo b–e–d–b: custos 7, 15 e 9.', { highlightEdgeIds: cycleEdges, edgeColorMap: colorAll(cycleEdges, AMBER) }),
      step(SLIDE_MST, 'A mais cara do ciclo é d–e (15): não está em nenhuma AGM. No Kruskal ela é descartada; no Reverse-Delete, apagada.', { edgeColorMap: { ...colorAll(cycleEdges, AMBER), ...colorAll(edgeIdsOf(SLIDE_MST, [['d', 'e']]), RED) }, edgeLabels: colorAll(edgeIdsOf(SLIDE_MST, [['d', 'e']]), 'fora') }),
    ],
    'Quadro 24',
  ),
];

// ---------------------------------------------------------------------------
// AGM: Prim, Kruskal, Reverse-Delete
// ---------------------------------------------------------------------------

const agm: GraphConcept[] = [
  concept(
    'agm-problema',
    'Ligar todos gastando o mínimo',
    'O problema da AGM: escolher arestas que deixem tudo conectado com a menor soma de custos. A melhor escolha nunca tem ciclo — se tivesse, daria para tirar uma aresta do ciclo, continuar conectado e gastar menos. Por isso a resposta é uma árvore geradora.',
    [0],
    [
      step(SLIDE_MST, 'Grafo do slide: 7 vértices, 11 arestas com custo. Queremos T com (V, T) conexo e Σ c_e mínima.', { formula: `custo de todas as arestas = ${SLIDE_MST.edges.reduce((a, e) => a + (e.weight ?? 0), 0)}` }),
      step(SLIDE_MST, `Resposta (calculada): árvore com 6 arestas e custo ${kruskal(SLIDE_MST).totalWeight}.`, { highlightEdgeIds: kruskal(SLIDE_MST).treeEdgeIds, edgeColorMap: colorAll(kruskal(SLIDE_MST).treeEdgeIds, GREEN), formula: `custo da AGM = ${kruskal(SLIDE_MST).totalWeight}` }),
    ],
    'Quadro 13 e o exemplo dos quadros 16-17',
  ),
  concept('agm-prim', 'Prim: cresça a árvore pela aresta mais barata que sai dela', 'Prim começa num vértice e vai anexando, a cada passo, o vértice mais barato de ligar à árvore atual. As candidatas são sempre as arestas do corte entre a árvore e o resto.', [1], primSteps(SLIDE_MST, 'a'), 'Prim no grafo do slide, a partir de a'),
  concept('agm-kruskal', 'Kruskal: da mais barata para a mais cara, sem fechar ciclo', 'Kruskal ordena todas as arestas por custo e vai aceitando, da mais barata para a mais cara. Só descarta a aresta que fecharia ciclo com as já aceitas. Ao contrário do Prim, as arestas aceitas podem ficar espalhadas, formando vários pedaços que se juntam no fim.', [2], kruskalSteps(SLIDE_MST), 'Kruskal no grafo do slide'),
  concept('agm-reverse-delete', 'Reverse-Delete: da mais cara para a mais barata, apagando', 'O caminho inverso do Kruskal: comece com todas as arestas e tente apagar da mais cara para a mais barata. Só apague se o grafo continuar conexo. O que sobrar é a AGM — o slide diz que os três algoritmos funcionam.', [3], reverseDeleteSteps(SLIDE_MST), 'Reverse-Delete no grafo do slide'),
  concept(
    'agm-modelagem-prova',
    'A questão de rodovias da P2 2024/1',
    'A questão pedia: cidades que precisam ficar todas alcançáveis com o menor custo de construção. Modelagem: cada cidade é um vértice, cada rodovia possível é uma aresta NÃO direcionada, e o peso é o custo de construção (p_ij). O método é AGM — aqui, Kruskal.',
    [4],
    kruskalSteps(P2_2024_Q1),
    'P2 2024/1, Q1 (b): 4 cidades',
  ),
];

// ---------------------------------------------------------------------------
// Steiner
// ---------------------------------------------------------------------------

const STEINER = placed({ t1: [80, 60], t2: [480, 60], t3: [280, 290], s: [280, 150], x: [80, 260] }, [['t1', 's'], ['t2', 's'], ['t3', 's'], ['t1', 'x'], ['x', 't3'], ['t1', 't2']]);

const steiner: GraphConcept[] = [
  concept(
    'steiner-definicao',
    'Só os terminais precisam estar ligados',
    'Na árvore de Steiner você não precisa passar por todos os vértices — só pelos terminais T. Outros vértices podem entrar se ajudarem; esses são os pontos de Steiner. Exemplo criado para explicação, medindo tamanho por número de arestas.',
    [0, 1],
    [
      step(STEINER, 'Terminais T = {t1, t2, t3}. Os vértices s e x são opcionais.', { vertexColorMap: { t1: BLUE, t2: BLUE, t3: BLUE }, legend: [{ label: 'Terminal', color: BLUE }] }),
      step(STEINER, 'Usando o ponto de Steiner s: t1–s, t2–s, t3–s ligam os três terminais com 3 arestas.', { vertexColorMap: { t1: BLUE, t2: BLUE, t3: BLUE, s: AMBER }, highlightEdgeIds: edgeIdsOf(STEINER, [['t1', 's'], ['t2', 's'], ['t3', 's']]), edgeColorMap: colorAll(edgeIdsOf(STEINER, [['t1', 's'], ['t2', 's'], ['t3', 's']]), GREEN), legend: [{ label: 'Terminal', color: BLUE }, { label: 'Ponto de Steiner', color: AMBER }] }),
      step(STEINER, 'x não foi usado: Steiner não precisa cobrir todos os vértices. Uma árvore geradora teria que incluir x também.', { vertexColorMap: { t1: BLUE, t2: BLUE, t3: BLUE, s: AMBER, x: gray } }),
    ],
    'Terminais e pontos de Steiner',
  ),
];

export const p2ArvoresLessons: LessonCatalog = {
  arvores,
  'arvore-geradora': arvoreGeradora,
  cortes,
  'agm-prim-kruskal': agm,
  steiner,
};
