import type { Question, Source } from '@/content/types';
import { baseAndAntiBase, dijkstra, kruskal, prim, stronglyConnectedComponents, widestPath } from '@/lib/graph';
import { AULAO_CRITICO, K4_MENOS_E, SILVIO_MATRIZ, SLIDE_LINE_G, placed } from './graphs-p2';
import { MATRIX_ABCDEF, provasReais } from './09-provas-reais';
import { PC } from '@/content/pseudocode';

// As 9 provas de P2 do Prof. Silvio (Materiais/Provas/Prova2), com o enunciado
// transcrito. As respostas seguem o registro do material de aluna que o usuário
// pediu para tratar como o jeito do professor (Resumo Prova 2, Aulão II e
// provas2_antigas_treino.pdf): definição, "passo a passo" e resultado.
// Nenhuma resposta aqui é gabarito oficial, exceto os da 2024/1, marcados como tal.

const src = (file: string, note: string): Source => ({ type: 'old_exam', file, note });
const X = '20xx-x-exam.pdf';

type Proof = Extract<Question, { type: 'PROOF_OR_JUSTIFICATION' }>;

function q(id: string, file: string, label: string, weight: number, topic: string, family: string | undefined, prompt: string, examAnswer: string, extra: Partial<Proof> = {}): Proof {
  return {
    id,
    topic,
    difficulty: 'hard',
    duration: 'deep',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    type: 'PROOF_OR_JUSTIFICATION',
    prompt: `(${weight}%) ${prompt}`,
    rubric: ['Cita a definição ou o algoritmo usado', 'Mostra o passo a passo', 'Conclui e justifica cada item pedido'],
    source: src(file, label),
    professorStyleSimilarity: 'high',
    hints: ['Escreva a definição antes de calcular; a prova desconsidera resposta sem justificativa.'],
    solution: examAnswer,
    examAnswer,
    examFamily: family,
    ...extra,
  };
}

const old = (id: string): string => {
  const found = provasReais.flatMap((p) => p.questions).find((x) => x.question.id === id);
  if (!found?.question.examAnswer) throw new Error(`Resposta não encontrada: ${id}`);
  return found.question.examAnswer;
};
const oldPrompt = (id: string): string => {
  const found = provasReais.flatMap((p) => p.questions).find((x) => x.question.id === id);
  if (!found || found.question.type !== 'PROOF_OR_JUSTIFICATION') throw new Error(`Enunciado não encontrado: ${id}`);
  return found.question.prompt.replace(/^\(\d+%\) /, '');
};

// ---------------------------------------------------------------------------
// Blocos de resposta reutilizados (o professor repete questões)
// ---------------------------------------------------------------------------

const CONECTIVIDADE = `Um grafo direcionado e não ponderado pode ter 3 tipos de conectividade:

Fracamente conexo: existe caminho entre quaisquer dois vértices ao ignorar a direção das arestas. Para identificar:
1. crie o grafo S subjacente de G (todas as arestas de G, tratadas como não direcionadas);
2. faça uma busca em profundidade a partir de um vértice qualquer;
3. se todos os vértices forem visitados, G é fracamente conexo.

Semi-fortemente conexo: para qualquer par de vértices (u, v), existe caminho de u para v ou de v para u. Para identificar: para cada par, verifique com uma busca se um alcança o outro; se algum par não tiver caminho em nenhum sentido, não é semi-fortemente conexo.

Fortemente conexo: existe caminho em ambas as direções para qualquer par de vértices. Para identificar (Kosaraju):
1. faça uma DFS em G marcando os tempos de início e término;
2. gere o grafo transposto T de G;
3. faça uma DFS em T, na ordem não crescente dos tempos de término;
4. se todo o grafo for visitado em uma única DFS em T, G é fortemente conexo.`;

const KOSARAJU = `Componente fortemente conexo: conjunto maximal em que todo par tem caminhos nos dois sentidos.
${PC.KOSARAJU}
${PC.TRANSPOSTO}
${PC.VISIT}
Cada árvore da segunda DFS é uma componente. Tempo: O(|V| + |E|).`;

const CICLO_SCC = `${KOSARAJU}
Pseudocódigo da decisão:
\`\`\`
TEM_CICLO_POR_SCC(G)
  componentes = KOSARAJU(G)
  for X ∈ componentes
    if |X| > 1: return verdadeiro
  for (v, v) ∈ E: return verdadeiro
  return falso
\`\`\`
Justificativa: uma componente com mais de um vértice contém um ciclo; uma componente unitária só contém ciclo se houver laço. Logo, sem essas condições, G é acíclico.
Exemplo: A → B → C → A, C → D. Componentes: {A, B, C} e {D}. Há componente com 3 vértices: G possui ciclo.`;

const DIAMETRO_NAO_DIR = `Excentricidade de v = maior distância de v aos demais; diâmetro = maior excentricidade.
${PC.DISTANCIAS}
${PC.DIAMETRO}
Como a BFS descobre cada vértice por níveis, cada dist[u] é a distância mínima. Repete-se a BFS para cada origem. Tempo: O(|V|(|V| + |E|)).
Exemplo: estrela com centro c e folhas x, y, z. De x: c = 1, y = 2, z = 2, então ex = 2. De c: todos a 1, então ex = 1. De y e z: ex = 2. Diâmetro = 2.`;

const DIAMETRO_DIR = `Use o mesmo pseudocódigo DISTANCIAS e DIAMETRO do item a, mas N(w) contém apenas sucessores de w. Como G é fortemente conexo, cada BFS alcança todos os vértices.
Exemplo: ciclo A → B → C → A. De A: B = 1, C = 2, então ex = 2. O mesmo vale para B e C. Diâmetro = 2.
Se G não for fortemente conexo, existe par (u, v) sem caminho de u para v, a distância é ∞ e o diâmetro é ∞.`;

const PRIM_E = `Solução sem alterar o Prim, só a entrada: troque o peso de e por um valor menor que o de todas as outras arestas (por exemplo, menor peso do grafo − 1) e rode o Prim normalmente.
Pseudocódigo:
\`\`\`
PRIM_COM_ARESTA(G, W, e):
  se G é desconexo: retorne "não existe árvore geradora"
  se E = {e}: retorne ({e}, (V, ∅))
  M ← min{W(f) : f ∈ E, f ≠ e} − 1
  W' ← cópia de W; W'(e) ← M
  T ← PRIM(G, W')  // algoritmo original, sem alterações
  retorne (T, T − {e})
\`\`\`
Prim começa em um vértice, adiciona a menor aresta que cruza do conjunto visitado para os demais e para com |V| − 1 arestas.
Justificativa: e agora é a mais barata do grafo, logo é a mais barata de qualquer corte que atravessa; pela propriedade do corte, toda AGM contém e. Assim e está em T.
Floresta: T tem |V| − 1 arestas. Retirando e, sobram duas árvores que cobrem todos os vértices: F = (V, E′ \\ {e}). Como e está em toda solução e seu peso é fixo, minimizar T é minimizar a soma das demais arestas, então F é mínima dentre as que, junto com e, ligam todo o grafo. A expressão "floresta geradora mínima de G − e" no enunciado só faz sentido nessa classe restrita; se G − e for conexo, sua floresta geradora mínima usual teria |V| − 1 arestas, mas F tem |V| − 2. Também é preciso fornecer pesos a G para usar Prim.`;

const WIDEST = (() => {
  const g = placed({ s: [70, 160], a: [240, 60], b: [240, 270], t: [480, 160] }, [['s', 'a', 5], ['a', 't', 2], ['s', 'b', 3], ['b', 't', 4]]);
  const r = widestPath(g, 's');
  return `Capacidade de um caminho = menor peso entre suas arestas. Queremos o maior desses mínimos (Max-Min).

Pseudocódigo (fila de prioridade máxima):
\`\`\`
WIDEST_PATH(G, W, s, t):
    para cada v em V: cap[v] ← −∞; pred[v] ← NULO
    cap[s] ← +∞
    Q ← {(s, +∞)}
    enquanto Q não estiver vazia:
        (u, c) ← EXTRAI_MAIOR(Q)
        se c ≠ cap[u]: continue  // entrada antiga na fila
        se u = t: retorne (cap[t], RECONSTRÓI(pred, t))
        para cada aresta (u, v) em E:
            candidato ← min(cap[u], W(u, v))
            se candidato > cap[v]:
                cap[v] ← candidato
                pred[v] ← u
                INSERE(Q, (v, candidato))
    retorne "não há caminho de s a t"
\`\`\`

Justificativa: estender um caminho nunca aumenta sua capacidade. Assim, quando extraímos o maior valor da fila, ele já é definitivo. Cada atualização calcula o gargalo do caminho estendido. Tempo: O((|V| + |E|) log |V|) com fila de prioridade.
Instância: arestas s–a = 5, a–t = 2, s–b = 3, b–t = 4. Caminho s–a–t: min(5, 2) = 2. Caminho s–b–t: min(3, 4) = 3. Resposta: capacidade ${r.capacities.t}, pelo caminho s–b–t.`;
})();

// ---------------------------------------------------------------------------
// Matriz de 2021/2-Q3 e da prova da p. 7
// ---------------------------------------------------------------------------

const MATRIZ = `      A   B   C   D   E   F
  A   0   6   9  11  15   9
  B   6   0  13   3   1   2
  C   9  13   0  10   4   4
  D  11   3  10   0   5   6
  E  15   1   4   5   0   2
  F   9   2   4   6   2   0`;

const edgeName = (id: string) => {
  const e = SILVIO_MATRIZ.edges.find((x) => x.id === id)!;
  return `${e.source}–${e.target} (${e.weight})`;
};
const kr = kruskal(SILVIO_MATRIZ);
const pr = prim(SILVIO_MATRIZ, 'F');
const dj = dijkstra(SILVIO_MATRIZ, 'F');
const pathFromF = (t: string): string => {
  const out = [t];
  let v = t;
  while (dj.predecessors[v]) {
    v = dj.predecessors[v]!;
    out.push(v);
  }
  return out.reverse().join(' → ');
};

const KRUSKAL_ANS = `Kruskal: análise global do grafo.
Passo a passo:
- ordenamos todas as arestas por peso em ordem não decrescente;
- criamos um grafo nulo T com todos os vértices de G;
- adicionamos as arestas de G em T na ordem citada somente se, com sua adição, o grafo continuar acíclico; se ele se tornar cíclico, descartamos essa aresta;
- o algoritmo termina quando o número de arestas em T for |V| − 1.
Execução:
${kr.steps.slice(1, -1).filter((_, i) => i < 8).map((x, i) => `${i + 1}. ${x.description}`).join('\n')}
Com 5 = |V| − 1 arestas, já chegamos na resposta. AGM: ${kr.treeEdgeIds.map(edgeName).join(', ')}. Custo: ${kr.totalWeight}.
Empate: B–F e E–F valem 2, e C–E e C–F valem 4; a outra escolha dá outra AGM com o mesmo custo.`;

const PRIM_ANS = `Prim: análise local (olha as arestas dos visitados para os não visitados).
Passo a passo:
- começamos criando um conjunto S de vértices que inicialmente contém um vértice de V (neste caso, F);
- verificamos as arestas que saem de S e chegam a V \\ S, ou seja, para uma aresta {u, v}, u pertence a S e v a V \\ S; escolhemos a de menor peso e adicionamos {u, v} ao conjunto solução e v a S;
- o algoritmo se encerra quando |S| = |V|.
Execução a partir de F:
${pr.steps.slice(1, -1).map((x, i) => `${i + 1}. ${x.description}`).join('\n')}
AGM: ${pr.treeEdgeIds.map(edgeName).join(', ')}. Custo: ${pr.totalWeight}, igual ao do Kruskal.`;

const DIJKSTRA_ANS = `Dijkstra: encontra o caminho mínimo de um vértice para todos os outros em grafo conexo, ponderado e sem pesos negativos. É um algoritmo guloso, pois toma decisões locais e irreversíveis em busca de uma solução ótima.
Passo a passo:
1. inicializamos todas as distâncias como ∞ e a do vértice inicial como 0; criamos o conjunto de nós visitados vazio;
2. entre os nós não visitados, escolhemos o de menor distância acumulada (v*) e o adicionamos aos visitados;
3. para cada vizinho de v*, calculamos a nova distância passando por v*; se ela for menor que a registrada, atualizamos: d[v] = min(d[v*] + W(v*, v), d[v]);
4. repetimos o passo 2 até não existirem mais nós não visitados.
Distâncias a partir de F: ${['A', 'B', 'C', 'D', 'E', 'F'].map((v) => `${v} = ${dj.distances[v]}`).join(', ')}.
Caminhos: ${['A', 'B', 'C', 'D', 'E'].map(pathFromF).join('; ')}.
B e E empatam com 2 logo depois de F; qualquer um pode sair primeiro.`;

const CAMINHO_CRITICO = `Modelagem: grafo direcionado e acíclico. Vértices: as disciplinas (atividades). Aresta (u, v): u é pré-requisito de v.
Cada disciplina dura um período; independentes podem ocorrer em paralelo. O caminho crítico é a cadeia de pré-requisitos com mais disciplinas.
${PC.ORDEM_TOPOLOGICA}
${PC.TEMPO_CASA}
Se a ordem contiver menos de |V| vértices, há ciclo de pré-requisitos e não há planejamento válido. Justificativa: na ordem topológica todos os pré-requisitos de v já foram processados; t[v] é o primeiro período em que v pode terminar. O máximo de t é o prazo mínimo. Tempo O(|V| + |E|).
Exemplo: A → C, B → D, B → E, C → F, D → F, D → G, E → G. Rodada 1: {A, B}. Rodada 2: {C, D, E}. Rodada 3: {F, G}. Mínimo de 3 períodos. Uma ordem topológica: B A D C E G F (há várias formas de encontrá-la). Um caminho crítico: B → D → F.`;

const SUBGRAFO = `Um subgrafo T de um grafo G consiste em um conjunto de nós e arestas que são subconjuntos do conjunto original de G: V′ ⊆ V e E′ ⊆ E.
Exemplo: G com V = {a, b, c} e E = {a–b, a–c, b–c}. T com V′ = {a, b} e E′ = {a–b}.

Um subgrafo induzido é um caso especial de subgrafo, em que T contém todas as arestas presentes entre os vértices que compõem T e estão em G.
Exemplo: G com V = {a, b, c, d} e E = {a–b, a–c, b–c, c–d}. O subgrafo induzido por {a, b, c} tem exatamente as arestas a–b, a–c e b–c.`;

const FLUXO_FORA = 'Fluxo máximo: fora do que foi dado até agora. Na resolução da aluna: "Silvio ainda não passou (mas talvez seja Max-Min)". Pelo cronograma, fica para a P3. Não há resposta-modelo: pergunte ao professor se cai. O app não tem esse conteúdo na P2.';

const anti = baseAndAntiBase(MATRIX_ABCDEF);
const sccM = stronglyConnectedComponents(MATRIX_ABCDEF).components;

// ---------------------------------------------------------------------------
// 2024/1: 17 questões de múltipla escolha, numeração da versão "CORRIGIDO"
// ---------------------------------------------------------------------------

const GAB = 'Gabarito da versão CORRIGIDO da prova: ';

function mc(n: number, topic: string, family: string | undefined, prompt: string, options: string[], correct: number, why: string): Extract<Question, { type: 'MULTIPLE_CHOICE' }> {
  const ids = ['a', 'b', 'c', 'd'];
  const answer = `${GAB}${options[correct]}\n${why}`;
  return {
    id: `ps-2024-1-q${n}`,
    topic,
    difficulty: 'medium',
    duration: 'normal',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    type: 'MULTIPLE_CHOICE',
    prompt,
    options: options.map((label, i) => ({ id: ids[i], label })),
    correctOptionId: ids[correct],
    source: src('2024-1-exam.pdf', `2024/1 (Prova 2), Q${n}, versão CORRIGIDO`),
    hints: ['Analise cada afirmativa separadamente antes de olhar as opções.'],
    solution: answer,
    examAnswer: answer,
    examFamily: family,
  };
}

const q2024: Question[] = [
  mc(1, 'bfs', 'bfs-distancias', 'Seja um grafo não-direcionado e não-ponderado G. Seja uma busca em largura de G a partir de um vértice r. Sejam d(r, u) e d(r, v) os comprimentos dos caminhos mais curtos de r para u e v, respectivamente, em G. Se u for visitado antes de v durante a busca em largura, qual das seguintes afirmações está correta?', ['d(r, u) > d(r, v)', 'd(r, u) ≤ d(r, v)', 'd(r, u) ≥ d(r, v)', 'd(r, u) < d(r, v)'], 1, 'A busca em largura visita por níveis. Pode ser menor ou igual, porque u e v podem estar no mesmo nível.'),
  mc(2, 'aperto-de-maos-familias', undefined, 'Seja o grafo não-direcionado G = (V, E). Analise as assertivas, assinalando V ou F:\n( ) Kn (grafo completo): é regular para todos os valores de n ≥ 1, já que o grau de cada vértice é n − 1.\n( ) Cn (grafo ciclo): é regular para todos os valores de n ≥ 3, já que o grau de cada vértice é sempre 2.\n( ) Wn (grafo roda): é regular apenas para n = 3.\n( ) Wn (grafo roda): W3 é isomorfo ao K4.', ['V – V – V – V', 'V – F – F – F', 'F – F – V – F', 'F – F – F – V'], 0, 'W3 tem um centro ligado a um ciclo de 3: todos os vértices têm grau 3, e é o próprio K4.'),
  mc(3, 'scc-kosaraju', 'ciclo-dfs-scc', 'Seja G = (V, E) um grafo direcionado.\n( ) Se G′ = (V, E′) em que E′ = {(u, v) | (u, v) ∉ E} então G e G′ possuem os mesmos componentes conexos.\n( ) Se G′ = (V, E′) em que E′ = {(u, v) | (v, u) ∈ E} então G e G′ possuem os mesmos componentes conexos.\n( ) Se G′ = (V, E′) em que E′ = {(u, v) | existe um caminho de tamanho menor ou igual a 2 de u para v em E} então G e G′ possuem os mesmos componentes conexos.\n( ) Se G′ = (V′, E) em que V′ é o conjunto de vértices em G que não são isolados então G e G′ possuem os mesmos componentes conexos.', ['Há duas afirmativas corretas.', 'Todas as afirmativas estão corretas.', 'Há três afirmativas corretas.', 'Há somente uma afirmativa correta.'], 3, 'O transposto (item 2) tem os mesmos componentes.\nATENÇÃO, gabarito a confirmar com o professor: o item 3 também parece verdadeiro. E′ contém E (caminho de tamanho 1) e só liga quem já se alcança, então a alcançabilidade não muda; isso daria duas corretas, não uma.'),
  mc(4, 'agm-prim-kruskal', 'p2-agm', 'Seja G = (V, E) um grafo não direcionado, e (G, W) um grafo ponderado nas arestas. Considere que os pesos das arestas são inteiros positivos e todos os valores são distintos.\n1. A árvore geradora mínima é única.\n2. O menor caminho entre quaisquer dois vértices é único pois todos os pesos das arestas são distintos.', ['Somente o item (1) está correto.', 'Nenhum dos itens está correto.', 'Somente o item (2) está correto.', 'Os dois itens estão corretos.'], 0, '1: sim; com pesos distintos, nunca haverá mais de 1 opção de arestas visitados → não visitados (propriedade de corte). 2: não; dois caminhos podem ter a mesma soma: 3 + 2 = 5 e 4 + 1 = 5.'),
  mc(5, 'hamiltoniano', 'p2-hamilton', 'Seja o grafo não-direcionado G = (V, E).\n( ) Um grafo direcionado é fortemente conexo se há um caminho de um vértice u para outro vértice v ou de v para u.\n( ) Um grafo não direcionado é conexo se houver caminho entre quaisquer par de vértices.\n( ) Em um grafo completo com 10 vértices (nomeado de A a J), o número total de circuitos hamiltonianos que iniciam em A é 10!.\n( ) Se um grafo possui um caminho (aberto) hamiltoniano então é possui um caminho (aberto) euleriano.\n( ) Se um grafo possui um caminho (aberto) euleriano então ele possui um caminho (aberto) hamiltoniano.\n( ) Existe um algoritmo para identificar se um grafo possui um ciclo hamiltoniano.\n( ) Existe um algoritmo para identificar se um grafo possui um ciclo euleriano.', ['F – V – F – F – F – F – V', 'F – V – F – F – F – V – V', 'V – F – V – V – V – F – F', 'V – F – V – V – V – F – F'], 1, 'Item 1: "ou" descreve semi-forte; forte exige os dois sentidos. Item 3: fixado o início em A, são 9!, não 10!. Itens 4 e 5: um não implica o outro. Itens 6 e 7: existem algoritmos para os dois; o de Hamilton só não é fácil. (As opções C e D aparecem iguais na foto.)'),
  mc(6, 'cortes', 'p2-agm', 'Considere um grafo não direcionado G com vértices {a, b, c, d, e}. No grafo G, cada aresta tem peso distinto. A aresta {c, d} é a aresta com peso mínimo e a aresta {a, b} é a aresta com peso máximo. Então, qual das afirmações a seguir é falsa?', ['Toda árvore geradora mínima de G deve conter {c, d}.', 'Nenhuma árvore geradora mínima contém {a, b}.', 'G tem uma árvore geradora mínima única.', 'Se {a, b} estiver em uma árvore geradora mínima, então sua remoção deve desconectar G.'], 1, 'Se {a, b} for ponte, ela está na AGM mesmo sendo a maior. "Se for ponte, você não pode removê-la, mesmo se for a maior" (aulão II).'),
  mc(7, 'arvores', 'possibilidade-n-k', 'Considere as seguintes afirmações.\n( ) Não existe grafo simples, conexo e não direcionados com 80 vértices e 77 arestas.\n( ) Todos os vértices de um grafo de Euler (possui ciclo euleriano) possuem grau par.\n( ) Todo grafo simples, acíclico, conexo e não direcionado com 50 vértices tem, no mínimo, dois vértices de grau 1.\n( ) Existe um grafo bipartido com mais que 10 vértices com conjunto independente de tamanho máximo igual a 2.', ['Há três afirmativas corretas.', 'Há somente uma afirmativa correta.', 'Há duas afirmativas corretas.', 'Todas as afirmativas estão corretas.'], 3, '1: conexo com 80 vértices precisa de pelo menos 79 arestas. 2: o ciclo entra e sai de cada vértice, então os graus são pares. 3: árvore com pelo menos 2 vértices tem pelo menos 2 folhas.\nATENÇÃO, gabarito a confirmar com o professor: o item 4 parece falso. Num bipartido com mais de 10 vértices, um dos lados tem pelo menos 6 vértices, e cada lado já é um conjunto independente; o máximo não pode ser 2. Isso daria três corretas.'),
  mc(8, 'steiner', undefined, 'Seja G = (V, E) um grafo não-direcionado, e (G, W) um grafo ponderado nas arestas.\n1. Supondo que todos os pesos das arestas são diferentes, a árvore geradora mínima de G e a árvore geradora com bottleneck mínimo são iguais.\n2. Achar uma árvore geradora mínima em G pode ser resolvido por meio da solução de um problema de árvore de Steiner quando o critério de otimização é a minimização da soma dos pesos das arestas e os terminais são iguais a V.\n3. Seja T ⊆ G uma árvore geradora mínima de G. Sejam dois vértices u e v. Achar o menor caminho entre u e v em G é equivalente a encontrar o menor caminho entre u e v em T.', ['Somente o item (2) está correto.', 'Somente o item (3) está correto.', 'Há somente dois itens corretos.', 'Nenhum dos itens está correto.'], 0, '2: com todos os vértices como terminais, a árvore de Steiner de soma mínima é a AGM. 3: o menor caminho pode usar aresta que não está na AGM.'),
  mc(9, 'definicao-terminologia', undefined, 'Analise as assertivas:\n( ) Um grafo não direcionado e sem ciclos não possui vértices com grau de entrada zero.\n( ) Seja G = (V, E), se e = {u, v} é uma aresta pertencente a E, pode-se afirmar que: (i) u e v são vértices e pertencem a V; (ii) u e v são chamados de vértices adjacentes.\n( ) Seja G = (V, E), se e = {u, v} é uma aresta pertencente a E, pode-se afirmar que: (i) u e v são vértices e pertencem a V; (ii) u e v são chamados de vértices vizinhos.\n( ) Seja G = (V, E), se e = (u, v) é uma aresta pertencente a E, pode-se afirmar que: (i) u é predecessor de v; e (ii) v é sucessor de u.\n( ) Seja G = (V, E), se todo vértice u ∈ V é vizinho a todo vértice v ∈ V, então G é chamado de grafo completo.\n( ) O número de arestas de uma árvore geradora mínima de 10 vértices é igual a 10.\n( ) Um grafo G = (V, E) é chamado grafo nulo se E = ∅.', ['V – F – V – F – V – V – F', 'F – V – F – F – F – V – V', 'V – F – F – V – V – F – F', 'F – V – V – V – F – F – V'], 3, 'Item 1: pode ter vértices isolados. Item 5: "todo vértice vizinho a todo vértice" incluiria ele mesmo. Item 6: AGM de 10 vértices tem 9 arestas.'),
  mc(10, 'cortes', 'p2-cortes', 'Seja G um grafo não-direcionado ponderado e e uma aresta com peso máximo em G. Suponha que haja uma árvore geradora de peso mínimo em G contendo a aresta e. Qual das seguintes afirmações é sempre VERDADEIRA?', ['A aresta e não pode estar contida em um ciclo.', 'Existe um ciclo em G com todas as arestas de peso máximo.', 'Existe um cut-set em G com todas as arestas de peso máximo.', 'Todas as arestas em G têm o mesmo peso.'], 2, 'Cut-set = conjunto de arestas cuja remoção desconecta o grafo (propriedade de corte). A e pode estar em ciclo se houver empate de pesos, por isso a opção A não é sempre verdadeira.'),
  mc(11, 'definicao-terminologia', undefined, 'Seja o grafo não-direcionado G = (V, E) em que V = {a, b, c, d, e} e E = {{a, b}, {b, c}, {b, d}, {a, d}, {c, e}}.\n( ) O vértice "e" é um vértice pendente\n( ) O vértice "d" é um vértice pendente\n( ) O vértice "a" é um vértice de corte\n( ) O vértice "c" é um vértice de corte\n( ) Há um caminho entre os vértices "a" e "e"\n( ) G é um grafo regular', ['F – F – V – V – F – F', 'V – V – V – F – V – V', 'F – V – F – F – F – V', 'V – F – F – V – V – F'], 3, 'Pendente: conectado a somente 1 outro vértice (grau 1): e sim, d não. Vértice de corte: sua remoção aumenta o número de componentes: c sim (isola e), a não.'),
  mc(12, 'arvore-geradora', 'p2-arvores', 'Seja G = (V, E) em que V = {a, b, c, d} e E = {{a, b}, {a, d}, {b, c}, {c, d}, {b, d}}. Quantas árvores geradoras mínimas existem no grafo G?', ['3', '16', '7', '8'], 3, 'Sem pesos, toda árvore geradora é mínima. Conte as árvores: das 5 arestas escolha 3 sem ciclo. C(5, 3) = 10, menos os 2 triângulos (a–b–d e b–c–d) = 8.'),
  mc(13, 'agm-prim-kruskal', 'p2-agm', 'Seja G = (V, E) um grafo não-direcionado e (G, W) um grafo ponderado nas arestas.\n1. G tem uma única árvore geradora mínima se não houver duas arestas em G com o mesmo peso.\n2. G tem uma única árvore geradora mínima se, para cada corte de G, existe uma aresta de peso-mínimo cruzando o corte.', ['Somente o item (2) está correto.', 'Os dois itens estão corretos.', 'Somente o item (1) está correto.', 'Nenhum dos itens está correto.'], 1, 'O item 2 precisa ser lido como "uma única aresta de peso mínimo cruzando o corte". Na anotação, a aluna questiona "e se tiver 3 iguais?" sobre o item 1: aí o enunciado já não vale, porque ele supõe pesos distintos.'),
  mc(14, 'euleriano', 'euleriano', 'Em um grafo não-direcionado e conexo, uma ponte é uma aresta cuja remoção desconecta grafo. Qual afirmação é verdadeira?', ['Toda aresta de um clique de tamanho maior ou igual a 3 é um ponte.', 'Uma árvore não tem pontes.', 'Um grafo com pontes não pode ter um ciclo.', 'Uma ponte não pode ser parte de um ciclo simples.'], 3, 'Se a aresta está em um ciclo, removê-la não desconecta nada, pois o resto do ciclo liga as pontas. Em árvore, TODA aresta é ponte.'),
  mc(15, 'dijkstra', 'p2-dijkstra', 'Seja G = (V, E) um grafo direcionado e (G, W) um grafo ponderado sendo W: V → Z⁺. Como alterar o algoritmo de Dijkstra para encontrar o menor caminho de um vértice s para todos os vértices do grafo? As menores distâncias serão armazenadas em um vetor d.\n( ) Alterar a função de atualização da distância em um vértice dado v, quando há uma aresta de u para v, para d[v] = min{d[v], d[u] + w(v)}.\n( ) Não alterar a distância inicial atribuída para s.\n( ) Alterar a função de atualização da distância em um vértice dado v, quando há uma aresta de u para v, para d[v] = min{d[v], d[v] + w(u)}.\n( ) Os valores iniciais das distâncias para todos os vértices, exceto o primeiro, será igual à ∞.', ['F – V – V – V', 'V – F – F – V', 'V – V – F – F', 'F – F – V – F'], 1, 'Aqui o peso está no VÉRTICE: ao chegar em v, soma w(v). Por isso a distância inicial de s muda: d[s] = w(s), não 0.'),
  mc(16, 'complemento-subgrafo', undefined, 'Considere um grafo não direcionado G com vértices {a, b, c, d, e, f, g}.\n( ) Caso o conjunto de vértices C = {a, c, d} for um conjunto independente máximo, então o subgrafo de G induzido pelos vértices {b, e, f, g} é completo.\n( ) Caso o conjunto de vértices C = {a, c, d} for uma cobertura de vértices mínima, então o subgrafo de G induzido pelos vértices {b, e, f, g} é completo.\n( ) Caso o conjunto de vértices C = {a, c, d} for uma cobertura de vértices, então o subgrafo de G induzido pelos vértices {b, e, f, g} é nulo.', ['V – V – V', 'V – F – V', 'F – F – V', 'F – V – F'], 2, 'Conjuntos de vértices (slide 14). Pelo cronograma, ainda não dado em 2026/2: confirme se cai. Se C é cobertura, toda aresta toca C, então entre os demais não há aresta: o induzido é nulo.'),
  mc(17, 'complemento-subgrafo', undefined, 'Considere um grafo não-direcionado G com vértices {a, b, c, d, e, f, g}.\n( ) O algoritmo para encontrar um conjunto independente máximo é baseado na escolha dos vértices de menor grau.\n( ) Seja o algoritmo para encontrar um conjunto independente máximo baseado na escolha dos vértices de menor grau. Pode-se afirmar que este algoritmo sempre terá a resposta ótima quando todos os graus forem diferentes.\n( ) Considere que G seja um grafo bipartido em que há 2 vértices em um conjunto e 4 vértices no outro conjunto. Podemos afirmar que o conjunto independente máximo de G será igual a 4.', ['Todas as assertivas são falsas.', 'Há somente duas assertivas verdadeiras.', 'Há somente uma assertiva verdadeira.', 'Todas as assertivas são verdadeiras.'], 0, 'Conjuntos de vértices (slide 14). Pelo cronograma, ainda não dado em 2026/2: confirme se cai. Item 3: G tem vértices {a..g} = 7, não 6.'),
];

// ---------------------------------------------------------------------------
// As provas
// ---------------------------------------------------------------------------

type Prova = { exam: { id: string; title: string; basedOn: string; suggestedDurationMinutes: number }; questions: { question: Question; weightPercent: number }[] };

export const provasSilvioP2: Prova[] = [
  {
    exam: { id: 'prova-silvio-2026-1', title: 'Prova 2 — 2026/1 (a mais recente)', basedOn: 'P2-TGC.pdf, transcrição literal. Grafo de linha, AGM e Prim com arestas obrigatórias.', suggestedDurationMinutes: 100 },
    questions: [
      {
        weightPercent: 45,
        question: q('ps-2026-1-q1', 'P2-TGC.pdf', '2026/1-Q1', 45, 'grafo-de-linha', 'p2-linha',
          `Seja G = (V, E) um grafo não-direcionado e simples. Um grafo G é dito euleriano se houver um circuito simples que passe por todas as arestas do grafo, e semi-euleriano se houver um caminho simples que passe por todas as arestas do grafo. Esse circuito e esse caminho são chamados de circuito euleriano e caminho euleriano, respectivamente. Analise as assertivas a seguir, respondendo se são verdadeiras ou falsas justificando suas respostas.
1. (15%) Caso G seja euleriano, então o grafo de linha de G será euleriano?
2. (15%) Caso G seja euleriano, então o grafo de linha de G será hamiltoniano?
3. (15%) Caso G seja semi-euleriano, então o grafo de linha de G será semi-euleriano?
Todas as suas decisões/escolhas devem ser justificadas, apenas indicar verdadeiro ou falso irá anular sua resposta.`,
          `Grafo de linha L(G): os vértices de L(G) são as arestas de G; dois vértices são adjacentes em L(G) se as arestas correspondentes são adjacentes em G. A aresta uv encosta em d(u) − 1 arestas por u e em d(v) − 1 por v, logo seu grau em L(G) é d(u) + d(v) − 2.

1. Verdadeiro. G euleriano tem todos os graus pares, então d(u) + d(v) − 2 é par para toda aresta uv: L(G) tem todos os graus pares. L(G) é conexo, pois todas as arestas de G estão em um mesmo circuito. Logo L(G) é euleriano.

2. Verdadeiro. Seja e1, e2, …, em o circuito euleriano de G. Ele usa cada aresta uma única vez, e arestas seguidas (inclusive em e e1) compartilham um vértice, ou seja, são adjacentes em L(G). Então e1, e2, …, em, e1 é um ciclo em L(G) que passa por cada vértice uma única vez: L(G) é hamiltoniano.

3. Falso. Contraexemplo: K4 sem uma aresta, com vértices x, y (grau 3) e u, v (grau 2) e arestas xy, xu, xv, yu, yv. G é semi-euleriano, pois tem exatamente 2 vértices de grau ímpar. Em L(G), os graus são: xy = 3 + 3 − 2 = 4; xu, xv, yu, yv = 3 + 2 − 2 = 3. São 4 vértices de grau ímpar, então L(G) não tem caminho euleriano.`,
          { displayGraphs: { a: SLIDE_LINE_G, b: K4_MENOS_E } }),
      },
      {
        weightPercent: 30,
        question: q('ps-2026-1-q2', 'P2-TGC.pdf', '2026/1-Q2', 30, 'agm-prim-kruskal', 'p2-agm',
          `Seja G = (V, E) um grafo não-direcionado, e (G, W) um grafo ponderado nas arestas. Considere que os pesos das arestas são inteiros positivos e todos os valores são distintos.
1. (10%) Mostre que a aresta de menor peso sempre estará na árvore geradora mínima.
2. (20%) Mostre que há somente uma árvore geradora mínima.`,
          `Propriedade de corte: com todos os pesos distintos, seja S um subconjunto de vértices (nem vazio, nem igual a V) e e a aresta de menor peso com uma ponta em S e outra em V − S. Então toda árvore geradora mínima contém e.

1. Seja e = (u, v) a aresta de menor peso de G. Tome S = {u}. Como e é a menor de todo o grafo, é a menor do corte de S; pela propriedade de corte, toda AGM contém e.
Direto: se uma AGM T não contivesse e, T + e formaria um ciclo; trocando e por outra aresta f desse ciclo, com W(f) > W(e), obteríamos uma árvore de custo menor, contradição.

2. Suponha duas AGMs diferentes, T1 e T2. Seja e a aresta de menor peso que está em apenas uma delas; digamos, em T1. T2 + e forma um ciclo, e esse ciclo tem uma aresta f que não está em T1, porque T1 não tem ciclo. f está só em T2, e como e é a menor dessas e os pesos são distintos, W(f) > W(e). Então T2 + e − f é uma árvore geradora de custo menor que T2, contradição. Logo a AGM é única. (Nunca há mais de uma opção de aresta de menor peso nos cortes.)`),
      },
      {
        weightPercent: 25,
        question: q('ps-2026-1-q3', 'P2-TGC.pdf', '2026/1-Q3', 25, 'agm-prim-kruskal', 'p2-prim-forcado',
          `Seja um G = (V, E) um grafo não-direcionado. Crie uma solução que use o algoritmo do Prim (sem alterá-lo) para encontrar uma árvore T = (V, E′) que seja um subgrafo de G de forma a garantir que um conjunto de arestas específico E1 ⊂ E (informado pelo usuário) sempre esteja presente em T e que F = (V, E′ \\ E1) seja uma floresta geradora mínima de G = (V, E \\ E1). Descreva em detalhes a sua solução justificando suas decisões.`,
          `Para usar Prim, o grafo precisa ter pesos W; o enunciado não os explicita. Suponho G conexo e ponderado. Se E1 contém ciclo, nenhuma árvore pode conter todas essas arestas.

Pseudocódigo (altera apenas os pesos de entrada; Prim fica intacto):
\`\`\`
PRIM_COM_ARESTAS(G, W, E1):
  se G é desconexo: retorne "não existe árvore geradora"
  se DFS em (V, E1) encontrar ciclo: retorne "impossível"
  se E1 = ∅:
    T ← PRIM(G, W); retorne (T, T)
  se E − E1 = ∅: retorne (E1, (V, ∅))
  M ← min{W(f) : f ∈ E − E1} − 1
  W' ← cópia de W
  para cada e ∈ E1: W'(e) ← M
  T ← PRIM(G, W')
  F ← (V, E(T) − E1)
  retorne (T, F)
\`\`\`
Se E − E1 for vazio, E1 já é uma árvore geradora. Justificativa: como E1 é acíclico, se uma aresta forçada e faltar em T, o ciclo formado por T + e contém alguma f fora de E1; trocar f por e diminuiria o custo W', contradição. Logo T contém E1. Entre árvores que contêm E1, as arestas forçadas têm peso fixo, e Prim minimiza a soma das demais.

Ressalva: F é mínima entre as florestas que, unidas a E1, formam uma árvore. Ela não é, em geral, a floresta geradora mínima usual de G − E1 (que poderia ter mais arestas).`),
      },
    ],
  },
  {
    exam: { id: 'prova-silvio-2025-1', title: 'Prova 2 — 2025/1', basedOn: '2025-1-exam.pdf, transcrição literal. O aluno da foto tirou 73.', suggestedDurationMinutes: 100 },
    questions: [
      {
        weightPercent: 25,
        question: q('ps-2025-1-q1', '2025-1-exam.pdf', '2025/1-Q1', 25, 'excentricidade-raio-diametro', 'excentricidade',
          `Seja G = (V, E) um grafo não-direcionado. Responda:
1. (5%) Defina excentricidade.
2. (8%) Defina raio e diâmetro.
3. (5%) Defina centro.
4. (7%) Indique o raio e diâmetro de um grafo completo com 6 vértices, justificando sua resposta.`,
          `1. Excentricidade de v: a maior distância de v a qualquer outro vértice.
2. Raio: a menor excentricidade do grafo. Diâmetro: a maior excentricidade do grafo.
3. Centro: conjunto dos vértices com excentricidade igual ao raio.
4. Em K6, todo vértice é adjacente a todos os outros, então toda distância é 1 e todo vértice tem excentricidade 1. Logo raio = 1 e diâmetro = 1.`),
      },
      {
        weightPercent: 30,
        question: q('ps-2025-1-q2', '2025-1-exam.pdf', '2025/1-Q2', 30, 'dijkstra', 'p2-caminho-restrito',
          `Seja G = (V, E) um grafo simples direcionado. Seja (G, W) um grafo ponderado em que W: E ↦ Z⁺. Um caminho é dito alternado se os seus pesos possuem valores alternados de forma que o peso da aresta i do caminho é menor que o peso da aresta i − 1 e i + 1, ou o peso da aresta i do caminho é maior que o peso da aresta i − 1 e i + 1. Por exemplo, a sequência [1, 3, 5] não é altenada, mas a sequência [1, 3, 2] é uma sequência alternada. Projete uma solução para encontrar em (G, W) o menor caminho alternado. Justifique todas as suas decisões.`,
          `Para origem s e destino t, interpreto "menor caminho" como menor soma de pesos. O próximo peso permitido depende da última aresta e do sentido da alternância. Por isso cada estado é (e, próximo), onde próximo ∈ {SOBE, DESCE}; não basta guardar só o vértice.

Pseudocódigo (Dijkstra no grafo de estados, construído implicitamente):
\`\`\`
MENOR_ALTERNADO(G, W, s, t):
  para cada e ∈ E e modo ∈ {SOBE, DESCE}:
    dist[e, modo] ← +∞; pred[e, modo] ← NULO
  Q ← fila de prioridade mínima vazia
  para cada e = (s, v) ∈ E:
    para modo ∈ {SOBE, DESCE}:
      dist[e, modo] ← W(e); INSERE(Q, (W(e), e, modo))
  enquanto Q ≠ ∅:
    (d, e = (u, v), modo) ← EXTRAI_MENOR(Q)
    se d ≠ dist[e, modo]: continue
    para cada f = (v, x) ∈ E:
      se modo = SOBE e W(f) > W(e): novo ← DESCE
      senão se modo = DESCE e W(f) < W(e): novo ← SOBE
      senão: continue
      candidato ← d + W(f)
      se candidato < dist[f, novo]:
        dist[f, novo] ← candidato
        pred[f, novo] ← (e, modo)
        INSERE(Q, (candidato, f, novo))
  escolha (e, modo) de menor dist com e terminando em t
  se não existir valor finito: retorne "não há caminho alternado"
  retorne (dist[e, modo], RECONSTRÓI(pred, e, modo))
\`\`\`

Justificativa: duas chegadas ao mesmo vértice podem permitir continuações diferentes. Os estados registram toda a informação necessária; cada transição preserva a alternância e soma o peso da nova aresta. Como W(e) > 0, Dijkstra é válido. Para s = t, o caminho vazio tem custo 0. Tempo O((|E| + T) log |E|), onde T é o número de pares de arestas consecutivas.`),
      },
      {
        weightPercent: 25,
        question: q('ps-2025-1-q3', '2025-1-exam.pdf', '2025/1-Q3', 25, 'scc-kosaraju', 'ciclo-dfs-scc',
          'Seja G = (V, E) um grafo direcionado. Projete uma solução para definir se o grafo é acíclico ou se possui ciclos com base no algoritmo de detecção de componentes fortemente conexos. Justifique todas as suas decisões.',
          CICLO_SCC),
      },
      {
        weightPercent: 20,
        question: q('ps-2025-1-q4', '2025-1-exam.pdf', '2025/1-Q4', 20, 'agm-prim-kruskal', 'p2-prim-forcado',
          'Seja um G = (V, E) um grafo não-direcionado. Crie uma solução que use o algoritmo do Prim (sem alterá-lo) para encontrar uma árvore T = (V, E′) que seja um subgrafo de G de forma a garantir que uma aresta específica e ∈ E (informada pelo usuário) sempre esteja presente em T e que F = (V, E′ \\ {e}) seja uma floresta geradora mínima de G = (V, E \\ {e}). Descreva em detalhes todas as soluções.',
          PRIM_E),
      },
    ],
  },
  {
    exam: { id: 'prova-silvio-2024-2', title: 'Prova 2 — 2024/2', basedOn: '2024-2-exam.pdf, transcrição literal. Há uma foto de prova nota 100, sem as respostas.', suggestedDurationMinutes: 100 },
    questions: [
      {
        weightPercent: 35,
        question: q('ps-2024-2-q1', '2024-2-exam.pdf', '2024/2-Q1', 35, 'excentricidade-raio-diametro', 'excentricidade',
          `Diâmetro em grafos (descreva em detalhes todas as soluções):
a) (15%) Forneça um algoritmo (passo a passo) para calcular o diâmetro de um grafo não-direcionado. Apresente um exemplo que ilustre cada uma das etapas do método descrito.
b) (20%) Seja G um grafo direcionado e fortemente conexo, forneça um algoritmo (passo a passo) para calcular o diâmetro em G. Apresente um exemplo que ilustre cada uma das etapas do método descrito. Discorra sobre o que ocorre se G não for fortemente conexo.`,
          `a) ${DIAMETRO_NAO_DIR}\n\nb) ${DIAMETRO_DIR}`),
      },
      {
        weightPercent: 35,
        question: q('ps-2024-2-q2', '2024-2-exam.pdf', '2024/2-Q2', 35, 'caminho-critico', 'topologica-dag', oldPrompt('pr-2025-1-q5'), old('pr-2025-1-q5')),
      },
      {
        weightPercent: 20,
        question: q('ps-2024-2-q3', '2024-2-exam.pdf', '2024/2-Q3', 20, 'agm-prim-kruskal', 'p2-prim-forcado',
          'Seja um G = (V, E) um grafo não-direcionado. Modifique o algoritmo do Prim para encontrar uma árvore T = (V, E′) que seja um subgrafo de G de forma a garantir que uma aresta específica e ∈ E (informada pelo usuário) sempre esteja presente em T e que F = (V, E′ \\ {e}) seja uma floresta geradora mínima de G = (V, E \\ {e}). Descreva em detalhes todas as soluções.',
          `Aqui o enunciado permite modificar o Prim. Seja e = (u, v).
Modificação: comece com S = {u, v} e o conjunto solução U = {e}, em vez de um único vértice. O resto é igual: escolha a aresta de menor peso de S para V \\ S, adicione-a a U e a outra ponta a S, até |S| = |V|.
Justificativa: e está em T por construção. Depois, cada aresta escolhida é a mais barata do corte, então o custo das demais é o mínimo entre as árvores que contêm e. Retirando e, sobram duas árvores que cobrem todos os vértices: F = (V, E′ \\ {e}).
Alternativa sem modificar: ${PRIM_E.split('\n')[0]}`),
      },
      {
        weightPercent: 10,
        question: q('ps-2024-2-q4', '2024-2-exam.pdf', '2024/2-Q4', 10, 'scc-kosaraju', 'ciclo-dfs-scc',
          'É possível identificar se um grafo é acíclico usando o algoritmo para encontrar componentes fortemente conexos? Justifique sua resposta. Descreva em detalhes todas as soluções.',
          `Sim: se houver n componentes fortemente conexos, sendo n = |V|, o grafo é acíclico.\n${CICLO_SCC}`),
      },
    ],
  },
  {
    exam: { id: 'prova-silvio-2024-1', title: 'Prova 2 — 2024/1 (múltipla escolha)', basedOn: '2024-1-exam.pdf, versão CORRIGIDO: 17 questões de mesmo valor, 100 minutos, sem consulta. Duas respostas do gabarito estão marcadas para confirmar com o professor (Q3 e Q7). Os pesos no app são aproximados para somar 100.', suggestedDurationMinutes: 100 },
    questions: q2024.map((question, i) => ({ question, weightPercent: i < 15 ? 6 : 5 })),
  },
  {
    exam: { id: 'prova-silvio-2021-2', title: 'Prova 2 — 2021/2', basedOn: '2021-2-exam.pdf, transcrição literal. Respostas no registro da resolução em provas2_antigas_treino.pdf.', suggestedDurationMinutes: 100 },
    questions: [
      {
        weightPercent: 20,
        question: q('ps-2021-2-q1', '2021-2-exam.pdf', '2021/2-Q1', 20, 'aperto-de-maos-familias', 'auto-complementar',
          `Seja G = (V, E) um grafo e N seu nome. Considere que os vértices do grafo sejam as letras do seu nome (caso haja letras iguais, mantenha a primeira ocorrência da letra e substitua as restantes pela letra seguida de um número). Por exemplo, V = {{s}, {i}, {l}, {v}, {i1}, {o}}
a) (10%) Defina grafo completo, e mostre como ficaria o conjunto de arestas de G caso ele seja completo. Qual seria o número de arestas de um grafo completo de n vértices (apresente a fórmula)?
b) (10%) Se G um grafo não-direcionado e completo. Defina grafo complementar, e mostre como ficaria o conjunto de arestas do grafo complementar de G. Qual seria o número de arestas de um grafo complementar G contendo n vértices?`,
          `a) Grafo completo: grafo simples em que todo par de vértices distintos é adjacente. Com o exemplo V = {s, i, l, v, i1, o}, E tem todos os pares: {s,i}, {s,l}, {s,v}, {s,i1}, {s,o}, {i,l}, {i,v}, {i,i1}, {i,o}, {l,v}, {l,i1}, {l,o}, {v,i1}, {v,o}, {i1,o}. Número de arestas de Kn: n(n − 1)/2 (no exemplo, 6 · 5/2 = 15).
b) Grafo complementar de G: é o grafo completo tirando as arestas que têm em G. Como G já é completo, não sobra nenhuma: E = ∅. O complementar de Kn é o grafo nulo, com os mesmos n vértices e 0 arestas.`),
      },
      {
        weightPercent: 30,
        question: q('ps-2021-2-q2', '2021-2-exam.pdf', '2021/2-Q2', 30, 'conectividade-direcionada', 'ciclo-dfs-scc',
          `Seja G = (V, E) um grafo direcionado e não ponderado.
a) (15%) Discorra sobre conectividade em grafos direcionados. Apresente todos os tipos de grafos além de indicar sobre identificá-los.
b) (15%) Caso G não seja desconexo, projete um algoritmo para identificar os componentes fortemente conexos de G`,
          `a) ${CONECTIVIDADE}\n\nb) ${KOSARAJU}`),
      },
      {
        weightPercent: 30,
        question: q('ps-2021-2-q3', '2021-2-exam.pdf', '2021/2-Q3', 30, 'agm-prim-kruskal', 'p2-agm',
          `Seja um grafo G com o seguinte conjunto de vértices {A, B, C, D, E, F} e com a seguinte ponderação nas arestas.

${MATRIZ}

a) (10%) Discorra sobre o algoritmo de Kruskal, além disto, encontre a árvore geradora mínima de G usando o algoritmo de Kruskal (mostre o passo-a-passo de sua solução)
b) (10%) Discorra sobre o algoritmo de Prim, além disto, encontre a árvore geradora mínima de G usando o algoritmo de Prim iniciando em F (mostre o passo-a-passo de sua solução)
c) (10%) Discorra sobre o algoritmo de Dijkstra, além disto, encontre o menor caminho de F para todos os vértices em G usando o algoritmo de Dijkstra.`,
          `a) ${KRUSKAL_ANS}\n\nb) ${PRIM_ANS}\n\nc) ${DIJKSTRA_ANS}`,
          { graph: SILVIO_MATRIZ }),
      },
      {
        weightPercent: 20,
        question: q('ps-2021-2-q4', '2021-2-exam.pdf', '2021/2-Q4', 20, 'complemento-subgrafo', undefined, 'Discorra sobre subgrafo e subgrafo induzido. Apresente exemplos de ambos os conceitos.', SUBGRAFO),
      },
    ],
  },
  {
    exam: { id: 'prova-silvio-20xx-p1', title: 'Prova 2 — sem data (A)', basedOn: '20xx-x-exam.pdf, p. 1, transcrição literal. Tudo vem da P1: mostra como a prova é cumulativa.', suggestedDurationMinutes: 100 },
    questions: [
      {
        weightPercent: 15,
        question: q('ps-20xx1-q1', X, '20xx(p.1)-Q1', 15, 'aperto-de-maos-familias', 'possibilidade-n-k',
          `Considerando um grafo não-direcionado simples G = (V, E) com 11 vértices e 6 componentes, responda e justifique as seguintes questões:
a) (4%) É possível que esse grafo possua 05 arestas?
b) (5%) É possível que a soma de graus de todos os vértices seja igual a 12?
c) (6%) É possível que a soma de graus de todos os vértices seja maior que 100?`,
          old('pr-2022-2-q1')),
      },
      {
        weightPercent: 50,
        question: q('ps-20xx1-q2', X, '20xx(p.1)-Q2', 50, 'base-antibase', 'fecho-base-antibase',
          `Seja um grafo G com o seguinte conjunto de vértices {A, B, C, D, E, F} e representado pela seguinte matriz de adjacência

      A  B  C  D  E  F
  A   0  1  0  1  0  0
  B   0  0  0  0  0  0
  C   1  0  0  0  0  0
  D   0  0  1  0  0  1
  E   0  1  0  1  0  0
  F   0  0  1  0  0  0

Responda e justifique as seguintes questões:
a) (4%) Ilustre visualmente o grafo G.
b) (5%) Qual o fecho transitivo direto do vértice A?
c) (6%) Qual o fecho transitivo inverso do conjunto de vértices {B, F}?
d) (20%) Encontre os componentes fortemente conexos de G explicando as etapas do algoritmo que você utilizou. Por que seu algoritmo funciona?
e) (15%) Encontre a anti-base no grafo G. Como seria um algoritmo para identificar uma anti-base em um grafo qualquer? Sua solução funciona para quais tipos de grafos?`,
          `a) Arestas: A → B, A → D, C → A, D → C, D → F, E → B, E → D, F → C.
b) Fecho transitivo direto de A = {A, B, C, D, F}: E não é alcançado, nenhuma aresta chega em E.
c) Fecho transitivo inverso de {B, F} = {A, C, D, E, F}: quem alcança B ou F. B não alcança ninguém.
d) ${KOSARAJU}
Componentes de G: ${sccM.map((c) => `{${[...c].sort().join(', ')}}`).join(', ')}.
Funciona porque o transposto mantém os mesmos componentes, e a ordem de término faz cada DFS em T ficar presa dentro de um único componente.
e) Anti-base de G: {${anti.antiBase.join(', ')}}. B não tem aresta saindo, e todo vértice fora dela alcança B.
Algoritmo: a anti-base de G é a base do transposto. Sendo G agora um grafo transposto, todos os vértices com grau de entrada 0 formam a anti-base. Esse algoritmo funciona apenas para DAGs. Para um grafo qualquer, contraia cada componente fortemente conexo em um vértice (o resultado é um DAG), aplique o mesmo e escolha um vértice de cada componente selecionado.`,
          { graph: MATRIX_ABCDEF }),
      },
      {
        weightPercent: 35,
        question: q('ps-20xx1-q3', X, '20xx(p.1)-Q3', 35, 'excentricidade-raio-diametro', 'excentricidade',
          `Diâmetro em grafos:
a) (15%) Forneça um algoritmo (passo a passo) para calcular o diâmetro de um grafo não-direcionado. Apresente um exemplo que ilustre cada uma das etapas do método descrito.
b) (20%) Seja G um grafo direcionado e fortemente conexo, forneça um algoritmo (passo a passo) para calcular o diâmetro em G. Apresente um exemplo que ilustre cada uma das etapas do método descrito. Discorra sobre o que ocorre se G não for fortemente conexo.`,
          `a) ${DIAMETRO_NAO_DIR}\n\nb) ${DIAMETRO_DIR}`),
      },
    ],
  },
  {
    exam: { id: 'prova-silvio-20xx-p6', title: 'Prova 2 — sem data (B)', basedOn: '20xx-x-exam.pdf, p. 6, transcrição literal. O início da página está cortado e o peso da Q1 foi lido como 20%.', suggestedDurationMinutes: 100 },
    questions: [
      {
        weightPercent: 20,
        question: q('ps-20xx6-q1', X, '20xx(p.6)-Q1', 20, 'conectividade-direcionada', 'ciclo-dfs-scc',
          `Seja G = (V, E) um grafo direcionado e não ponderado.
a) (10%) Discorra sobre conectividade em grafos direcionados. Apresente todos os tipos de grafos além de indicar sobre identificá-los.
b) (10%) Caso G não seja desconexo, projete um algoritmo para identificar os componentes fortemente conexos de G`,
          `a) ${CONECTIVIDADE}\n\nb) ${KOSARAJU}`),
      },
      {
        weightPercent: 20,
        question: q('ps-20xx6-q2', X, '20xx(p.6)-Q2', 20, 'complemento-subgrafo', undefined, 'Discorra sobre subgrafo e subgrafo induzido. Apresente exemplos de ambos os conceitos.', SUBGRAFO),
      },
      {
        weightPercent: 30,
        question: q('ps-20xx6-q3', X, '20xx(p.6)-Q3', 30, 'caminho-critico', 'topologica-dag',
          'Um caminho crítico é determinado pela identificação do maior período de atividades dependentes, além da consideração do tempo mínimo necessário para a realização de todas as tarefas (ou atividades). Uma aplicação interessante deste problema é a identificação do número mínimo de períodos para que um aluno possa se formar considerando todas as disciplinas de seu curso. Cumpre ressaltar que disciplinas que não estão na linha de pré-requisitos podem ser feitas em paralelo. Modele o problema do caminho crítico em grafos e projete um algoritmo para identificá-lo. Além disto, ilustre um exemplo da sua modelagem.',
          CAMINHO_CRITICO,
          { graph: AULAO_CRITICO }),
      },
      {
        weightPercent: 30,
        question: q('ps-20xx6-q4', X, '20xx(p.6)-Q4', 30, 'max-min', 'p2-caminho-restrito',
          'A capacidade mínima de um caminho em um grafo ponderado é definida como o peso da aresta de menor peso do caminho. O problema de Widest path é um definido como um problema de encontrar, entre dois vértices especificados em um grafo ponderado, um caminho que maximize o peso dentre todas as capacidades mínimas (dos caminhos) do grafo. Este problema também é conhecido como problema de caminho de capacidade máxima. Projete uma solução para resolver o problema de caminho entre dois vértices que maximize o peso da aresta de peso-mínimo no caminho. Apresente uma instância do problema com uma solução.',
          WIDEST),
      },
    ],
  },
  {
    exam: { id: 'prova-silvio-20xx-p7', title: 'Prova 2 — sem data (C)', basedOn: '20xx-x-exam.pdf, p. 7, transcrição literal (lateral cortada na foto). Os pesos impressos somam 105%. Atenção: na resolução da aluna, o Kruskal e o Prim têm um erro (c–e com peso 2; na matriz vale 4). O app usa os valores da matriz: AGM = 16.', suggestedDurationMinutes: 100 },
    questions: [
      {
        weightPercent: 20,
        question: q('ps-20xx7-q1', X, '20xx(p.7)-Q1', 20, 'conectividade-direcionada', 'ciclo-dfs-scc',
          `Seja G = (V, E) um grafo direcionado e não ponderado.
a) (10%) Discorra sobre conectividade em grafos direcionados. Apresente todos os tipos de grafos além de indicar sobre identificá-los.
b) (10%) Caso G não seja desconexo, projete um algoritmo para identificar os componentes fortemente conexos de G`,
          `a) ${CONECTIVIDADE}\n\nb) ${KOSARAJU}`),
      },
      {
        weightPercent: 30,
        question: q('ps-20xx7-q2', X, '20xx(p.7)-Q2', 30, 'agm-prim-kruskal', 'p2-agm',
          `Seja um grafo G com o seguinte conjunto de vértices {A, B, C, D, E, F} e com a seguinte ponderação nas arestas.

${MATRIZ}

a) (10%) Discorra sobre o algoritmo de Kruskal, além disto, encontre a árvore geradora mínima de G usando o algoritmo de Kruskal (mostre o passo-a-passo de sua solução)
b) (10%) Discorra sobre o algoritmo de Prim, além disto, encontre a árvore geradora mínima de G usando o algoritmo de Prim iniciando em F (mostre o passo-a-passo de sua solução)
c) (10%) Discorra sobre o algoritmo de Dijkstra, além disto, encontre o menor caminho de F para todos os vértices em G usando o algoritmo de Dijkstra.`,
          `a) ${KRUSKAL_ANS}\n\nb) ${PRIM_ANS}\n\nc) ${DIJKSTRA_ANS}`,
          { graph: SILVIO_MATRIZ }),
      },
      {
        weightPercent: 25,
        question: q('ps-20xx7-q3', X, '20xx(p.7)-Q3', 25, 'max-min', undefined, 'Explique, em detalhes, como calcular o fluxo máximo de uma rede. Apresente um exemplo que ilustre cada uma das etapas do algoritmo descrito.', FLUXO_FORA),
      },
      {
        weightPercent: 30,
        question: q('ps-20xx7-q4', X, '20xx(p.7)-Q4', 30, 'max-min', 'p2-caminho-restrito',
          'A capacidade mínima de um caminho em um grafo ponderado é definida como o peso da aresta de menor peso do caminho. Sejam dois vértices quaisquer do grafo, projete uma solução para resolver o problema de caminho de capacidade máxima entre estes vértices. Apresente uma instância do problema com uma solução.',
          WIDEST),
      },
    ],
  },
  {
    exam: { id: 'prova-silvio-20xx-p8', title: 'Prova 2 — sem data (D)', basedOn: '20xx-x-exam.pdf, p. 8, transcrição literal (lateral cortada na foto). Os pesos impressos somam 110%. Na Q2, "menor" está corrigido à mão para "MAIOR": é o que faz os exemplos do enunciado funcionarem.', suggestedDurationMinutes: 100 },
    questions: [
      {
        weightPercent: 20,
        question: q('ps-20xx8-q1', X, '20xx(p.8)-Q1', 20, 'aperto-de-maos-familias', 'possibilidade-n-k',
          `Considerando um grafo não-direcionado simples G = (V, E) com 14 vértices e 7 componentes, responda e justifique as seguintes questões:
a) (4%) É possível que esse grafo possua 05 arestas?
b) (5%) É possível que a soma de graus de todos os vértices seja igual a 14?
c) (6%) É possível que a soma de graus de todos os vértices seja maior que 56?
d) (5%) É possível que a G seja auto-complementar?`,
          `Com n vértices e k componentes: mínimo de arestas = n − k = 14 − 7 = 7; máximo = (n − k)(n − k + 1)/2 = 7 · 8/2 = 28.
a) Não. 5 < 7: com 5 arestas haveria mais de 7 componentes.
b) Sim. Soma dos graus = 2|E|, então |E| = 7, exatamente o mínimo. Exemplo: 6 vértices isolados e um componente com 8 vértices em sequência (7 arestas).
c) Não, se for "maior que 56": soma > 56 exige |E| > 28, acima do máximo. O limite 56 é exatamente a soma com 28 arestas.
d) Não. Auto-complementar tem |E| = n(n − 1)/4 = 14 · 13/4 = 45,5, que não é inteiro. (Também: precisaria de n = 4k ou 4k + 1, e 14 não é; além disso, auto-complementar é sempre conexo.)`),
      },
      {
        weightPercent: 30,
        question: q('ps-20xx8-q2', X, '20xx(p.8)-Q2', 30, 'dijkstra', 'p2-caminho-restrito',
          'Seja G = (V, E) um grafo simples direcionado. Seja (G, W) um grafo ponderado em que W: E ↦ Z⁺ e um parâmetro λ > 1. Um caminho é dito monotônico de λ-crescimento se ele é estritamente crescente em que o peso de um elemento é menor [corrigido à mão: MAIOR] que o elemento seguinte dividido por λ. Por exemplo, a sequência [2, 3, 7] não é monotônica de 2-crescimento mas a sequência [2, 3, 5] é uma sequência monotônica de 2-crescimento. Projete uma solução baseada em grafos para encontrar em (G, W) o menor caminho monotônico de λ-crescimento. Todas as suas decisões/escolhas devem ser bem justificadas.',
          `Para origem s e destino t, interpreto "menor caminho" como menor soma de pesos. Pela correção manuscrita, duas arestas consecutivas e, f devem satisfazer W(e) < W(f) < λ·W(e). Em [2, 3, 5] com λ = 2 isso vale; em [2, 3, 7], 7 < 2·3 é falso. A continuação depende do peso da última aresta, então cada aresta de G vira um estado.

Pseudocódigo (Dijkstra nos estados/arestas):
\`\`\`
MENOR_LAMBDA_CRESCENTE(G, W, λ, s, t):
  para cada e ∈ E: dist[e] ← +∞; pred[e] ← NULO
  Q ← fila de prioridade mínima vazia
  para cada e = (s, v) ∈ E:
    dist[e] ← W(e); INSERE(Q, (W(e), e))
  enquanto Q ≠ ∅:
    (d, e = (u, v)) ← EXTRAI_MENOR(Q)
    se d ≠ dist[e]: continue
    para cada f = (v, x) ∈ E:
      se W(e) < W(f) e W(f) < λ·W(e):
        candidato ← d + W(f)
        se candidato < dist[f]:
          dist[f] ← candidato
          pred[f] ← e
          INSERE(Q, (candidato, f))
  escolha e de menor dist[e] entre as arestas que terminam em t
  se não existir valor finito: retorne "não há caminho válido"
  retorne (dist[e], RECONSTRÓI(pred, e))
\`\`\`

Justificativa: toda sequência de arestas aceita pelo algoritmo satisfaz a condição, e toda sequência válida aparece como caminho entre estados. O custo acumulado é a soma dos pesos originais. Como todos são positivos, Dijkstra encontra o menor custo. Para s = t, o caminho vazio custa 0. Tempo O((|E| + T) log |E|), com T pares de arestas consecutivas.`),
      },
      {
        weightPercent: 25,
        question: q('ps-20xx8-q3', X, '20xx(p.8)-Q3', 25, 'euleriano', 'euleriano',
          'Um grafo não direcionado é dito euleriano se houver um circuito simples que passe por todas as arestas do grafo, e semi-euleriano se houver um caminho simples que passe por todas as arestas do grafo. Este circuito e este caminho são chamados de circuito euleriano e caminho euleriano, respectivamente. Projete uma solução para encontrar um circuito euleriano em um Grafo Euleriano, caso exista. Todas as suas decisões/escolhas devem ser bem justificadas.',
          old('pr-2026-1-q2')),
      },
      {
        weightPercent: 35,
        question: q('ps-20xx8-q4', X, '20xx(p.8)-Q4', 35, 'caminho-critico', 'topologica-dag', oldPrompt('pr-2025-1-q5'), old('pr-2025-1-q5')),
      },
    ],
  },
];

export const provasSilvioQuestions: Question[] = provasSilvioP2.flatMap((p) => p.questions.map((x) => x.question));
