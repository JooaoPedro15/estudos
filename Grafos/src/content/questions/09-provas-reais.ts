import type { GraphData, Question, Source } from '@/content/types';
import { makeGraph } from '@/lib/graph';
import { EXAM_GRAPH_AI } from './07-treino-prova';
import { PC } from '@/content/pseudocode';

// As 8 provas reais do Prof. Silvio Jamil (2022/1 … 2026/1), questão por
// questão, com o ENUNCIADO LITERAL (transcrito dos PDFs/fotos em
// Materiais/Provas/Prova 1) e a resposta-modelo no registro da prova. Todas
// abertas: é o que se escreve na folha. Montam a aba "Provas reais".

const src = (file: string, q: string): Source => ({ type: 'old_exam', file, note: q });

/** Matriz de adjacência de 2022/1-Q2 e 2022/2-Q2 (a mesma nas duas provas). */
export const MATRIX_ABCDEF: GraphData = makeGraph(
  true,
  ['A', 'B', 'C', 'D', 'E', 'F'],
  [
    ['A', 'B'], ['A', 'D'],
    ['C', 'A'],
    ['D', 'C'], ['D', 'F'],
    ['E', 'B'], ['E', 'D'],
    ['F', 'C'],
  ],
);

/** Lista de sucessores de 2022/1-Q5 e 2022/2-Q3 (a mesma nas duas provas). */
export const LIST_A_TO_M: GraphData = makeGraph(
  true,
  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'],
  [
    ['A', 'B'], ['A', 'F'],
    ['C', 'A'], ['C', 'D'],
    ['D', 'C'], ['D', 'F'],
    ['E', 'C'], ['E', 'D'],
    ['F', 'E'],
    ['G', 'A'], ['G', 'E'], ['G', 'J'],
    ['H', 'G'], ['H', 'I'],
    ['I', 'H'], ['I', 'J'],
    ['J', 'K'], ['J', 'L'],
    ['K', 'M'],
    ['L', 'E'], ['L', 'M'],
    ['M', 'J'],
  ],
);

const MATRIX_TEXT = `      A  B  C  D  E  F
  A   0  1  0  1  0  0
  B   0  0  0  0  0  0
  C   1  0  0  0  0  0
  D   0  0  1  0  0  1
  E   0  1  0  1  0  0
  F   0  0  1  0  0  0`;

const LIST_TEXT = `  A | B – F        H | G – I
  B | –            I | H – J
  C | A – D        J | K – L
  D | C – F        K | M
  E | C – D        L | E – M
  F | E            M | J
  G | A – E – J`;

// ---------------------------------------------------------------------------
// Blocos de resposta reutilizados entre provas (o professor repete as questões)
// ---------------------------------------------------------------------------

const POMBOS = `Seja G = (V, E) simples com n = |V| ≥ 2.
1. G é simples (sem laços e sem arestas paralelas), então cada vértice é adjacente a no máximo os outros n − 1 vértices: 0 ≤ d(v) ≤ n − 1 para todo v.
2. Se algum vértice u tem d(u) = n − 1, u é adjacente a todos os outros; cada um deles tem pelo menos a aresta até u, logo d(v) ≥ 1 para todo v ≠ u. Portanto grau 0 e grau n − 1 não ocorrem ao mesmo tempo.
3. Os n graus estão, então, em um conjunto com no máximo n − 1 valores ({0, …, n − 2} ou {1, …, n − 1}).
4. São n vértices para no máximo n − 1 valores de grau: não tem como todos terem graus diferentes. Logo pelo menos dois vértices têm o mesmo grau. ∎`;

const SUBGRAFOS_KN = `Seja G = Kn.
1. Um subgrafo G1 = (V1, A1) de G tem V1 ⊂ V e A1 ⊂ A. Como em Kn todas as arestas existem, um subgrafo fica determinado por um subconjunto não vazio de vértices e um subconjunto qualquer das arestas entre eles.
2. Fixado o número i de vértices (1 ≤ i ≤ n), há C(n, i) maneiras de escolhê-los.
3. Entre i vértices de Kn há i(i − 1)/2 arestas; cada uma entra ou não no subgrafo: 2^(i(i−1)/2) possibilidades.
4. Subgrafos com exatamente i vértices: C(n, i) · 2^(i(i−1)/2).
5. Total: N = Σ_{i=1}^{n} C(n, i) · 2^(i(i−1)/2).
Verificação: n = 3 → 3·1 + 3·2 + 1·8 = 17.`;

const BASE_ALG = `Base de G = (V, E) dirigido: subconjunto B ⊆ V tal que não há caminho entre vértices de B e todo vértice fora de B é atingido por algum vértice de B.
${PC.BASE}
Justificativa: um vértice com d⁻(v) = 0 não é alcançado por ninguém, então só ele pode se representar — entra em B. Num grafo sem ciclos, todo vértice com d⁻ > 0 é alcançado, direta ou indiretamente, a partir de algum vértice com d⁻ = 0, e nenhum vértice de B alcança outro (nenhum tem aresta chegando): B é base e é mínima, pois nenhum de seus vértices pode ser retirado. Com ciclos, os vértices de um ciclo têm todos d⁻ ≥ 1 e podem não ser alcançados de fora; por isso BASE contrai cada ciclo (componente fortemente conexo, obtido por KOSARAJU) em um hipervértice — o grafo contraído não tem ciclos — e, para cada hipervértice sem aresta chegando de fora, escolhe UM vértice do ciclo (qualquer um alcança os demais do ciclo).
Funciona: BASE_SEM_CICLO apenas para grafos direcionados sem ciclo; BASE para qualquer grafo direcionado.`;

const ANTIBASE_ALG = `Anti-base: subconjunto A ⊆ V tal que não há caminho entre vértices de A e todo vértice fora de A atinge A por um caminho.
${PC.TRANSPOSTO}
${PC.ANTIBASE}
Justificativa: "u atinge a em G" ⟺ "a atinge u em Gᵀ" (mesmas arestas, sentidos invertidos). Então "todo vértice fora de A atinge A em G" é o mesmo que "A atinge todo vértice em Gᵀ", que é a definição de base. Logo a anti-base de G é a base do transposto, e vale a mesma ressalva dos ciclos (contraídos por KOSARAJU dentro de BASE). Funciona para qualquer grafo direcionado.`;

const DIAMETRO_ALG = `Definições: distância entre v e u = menor número de arestas de um caminho de v a u; excentricidade ε(v) = maior das menores distâncias de v aos demais; diâmetro = maior excentricidade; raio = menor excentricidade; centro = vértices com excentricidade igual ao raio.
${PC.DISTANCIAS}
${PC.DIAMETRO}
Justificativa: DISTANCIAS é a busca em largura — a fila processa todos os vértices a distância d antes de qualquer um a distância d + 1, então o primeiro caminho que descobre u é o mais curto (dist[w] + 1). O maior dist[·] de uma busca é a excentricidade de v; o maior ε(v) entre todos os vértices é o diâmetro. Custo: |V| buscas em largura, cada uma O(|V| + |E|).
Exemplo: caminho a–b–c–d. DISTANCIAS(G, a) = (a 0, b 1, c 2, d 3) ⇒ ε(a) = 3; de b: (1, 0, 1, 2) ⇒ ε(b) = 2; de c: 2; de d: 3. DIAMETRO = 3 (raio = 2; centro = {b, c}).`;

const CICLO_DUAS = `Estratégia 1 — busca em profundidade com três estados (0 – não começou; 1 – começou mas não terminou; 2 – terminou):
${PC.VISIT}
Justificativa: um vizinho u com estado 1 está no caminho que a busca percorreu até v; a aresta (v, u) fecha esse caminho em um ciclo (aresta de retorno). Se a busca termina sem encontrar estado 1, toda aresta vai a vértice novo (0) ou já terminado (2) e não existe ciclo. Custo O(|V| + |E|).
Estratégia 2 — componentes fortemente conexos:
${PC.TRANSPOSTO}
${PC.KOSARAJU}
Se algum componente X tem 2 ou mais vértices, há caminho de ida e de volta entre eles, e ida + volta formam um ciclo; se todos os componentes são unitários (e não há laço), G é acíclico.
Estratégia 3 (alternativa) — remoção repetida de vértices com grau de entrada 0:
${PC.ORDEM_TOPOLOGICA}
Se ao final algum vértice ficou fora de ordem, os que sobraram têm todos d⁻ ≥ 1 entre si e contêm um ciclo; se todos entraram na ordem, G é acíclico.`;

const AUTOCOMP_DIV4 = `Seja G auto-complementar com n vértices.
1. G ≅ Ḡ ⇒ |E(G)| = |E(Ḡ)| (grafos isomorfos têm o mesmo número de arestas).
2. Toda aresta de Kn está em G ou em Ḡ, nunca em ambos: |E(G)| + |E(Ḡ)| = n(n − 1)/2.
3. Logo 2|E(G)| = n(n − 1)/2 ⇒ |E(G)| = n(n − 1)/4.
4. Como |E(G)| é inteiro, 4 divide n(n − 1). Entre n e n − 1 (consecutivos) só um é par; ele tem que ser múltiplo de 4 ⇒ n = 4k ou n = 4k + 1.
Observação necessária: o que fica divisível por 4 é n(n − 1), e |E(G)| = n(n − 1)/4. O próprio |E(G)| não é sempre múltiplo de 4: C5 é auto-complementar com 5·4/4 = 5 arestas. Escreva isso na prova — é o que a questão de 2025/1 cobra explicitamente.`;

const EULER_ALG = `Condições (grafo não-direcionado e conexo): existe circuito euleriano se, e somente se, todo vértice tem grau par; existe caminho euleriano se, e somente se, exatamente dois vértices têm grau ímpar (início e fim do caminho).
${PC.EULER}
Justificativa das escolhas: (1) o teste de graus pares e de conexidade é a condição de existência — sem ela não adianta procurar. (2) Como todo grau é par, sempre que a busca entra num vértice por uma aresta sobra outra aresta não usada para sair (as arestas incidentes se emparelham em entrada/saída), então o percurso só pode terminar no vértice inicial. (3) Dar prioridade a arestas que não desconectam as arestas ainda não usadas garante que nenhuma aresta fica inacessível; usar uma aresta que desconecta quando há outra opção deixaria parte do grafo sem como ser percorrida. Ao terminar, todas as arestas foram usadas exatamente uma vez e o percurso voltou ao início: circuito euleriano.`;

const NK = (n: number, k: number) => {
  const min = n - k;
  const max = ((n - k) * (n - k + 1)) / 2;
  return {
    min,
    max,
    intro: `n = ${n} vértices, k = ${k} componentes. Mínimo de arestas: cada componente com nᵢ vértices precisa de pelo menos nᵢ − 1 arestas para ser conexo; somando, n − k = ${n} − ${k} = ${min}. Máximo: ${k - 1} componentes com um vértice só e um componente completo com os outros ${n - k + 1} vértices: (n − k)(n − k + 1)/2 = ${n - k}·${n - k + 1}/2 = ${max}.`,
  };
};

// ---------------------------------------------------------------------------

const q = (
  id: string,
  file: string,
  label: string,
  weight: number,
  topic: string,
  prompt: string,
  examAnswer: string,
  extra: Partial<Extract<Question, { type: 'PROOF_OR_JUSTIFICATION' }>> = {},
): Extract<Question, { type: 'PROOF_OR_JUSTIFICATION' }> => ({
  id,
  topic,
  difficulty: 'hard',
  duration: 'deep',
  examLikelihood: 'high',
  sourceStyle: 'old_exam',
  type: 'PROOF_OR_JUSTIFICATION',
  prompt: `(${weight}%) ${prompt}`,
  rubric: extra.rubric ?? ['Cita a definição ou propriedade usada', 'Desenvolve a conta ou o algoritmo passo a passo', 'Conclui explicitamente cada item pedido'],
  source: src(file, label),
  professorStyleSimilarity: 'high',
  hints: extra.hints ?? ['Escreva a definição envolvida antes de calcular; o professor desconsidera resposta sem justificativa.'],
  solution: examAnswer,
  examAnswer,
  ...extra,
});

export const provasReais: { exam: { id: string; title: string; basedOn: string; suggestedDurationMinutes: number }; questions: { question: Question; weightPercent: number }[] }[] = [
  // ======================================================================= 2022/1
  {
    exam: { id: 'prova-2022-1', title: 'Prova 1 — 2022/1 (real)', basedOn: '2022-1-exam.pdf, transcrição literal. 5 questões (os pesos impressos somam 105%: 10 + 25 + 30 + 20 + 20).', suggestedDurationMinutes: 120 },
    questions: [
      {
        weightPercent: 10,
        question: q('pr-2022-1-q1', '2022-1-exam.pdf', '2022/1-Q1', 10, 'aperto-de-maos-familias',
          `Considerando um grafo não-direcionado simples G = (V, E) com 10 vértices e 5 componentes, responda e justifique as seguintes questões:
a) (3%) É possível que esse grafo possua 04 arestas?
b) (3%) É possível que a soma de graus de todos os vértices seja igual a 10?
c) (4%) É possível que a soma de graus de todos os vértices seja maior que 100?`,
          `${NK(10, 5).intro}
a) Não. 4 < 5 = n − k: com 4 arestas o grafo teria mais de 5 componentes (cada aresta reduz o número de componentes em no máximo 1, partindo de 10 vértices isolados).
b) Sim. Pela propriedade de grau, Σ d(v) = 2|E| ⇒ |E| = 10/2 = 5, exatamente o mínimo: ex.: cinco componentes, cada um com 2 vértices ligados por uma aresta (5 arestas, 5 componentes).
c) Não. Σ d(v) > 100 ⇒ |E| > 50, mas o máximo com 5 componentes é 15 arestas (soma máxima 30).`,
          { examFamily: 'possibilidade-n-k' }),
      },
      {
        weightPercent: 25,
        question: q('pr-2022-1-q2', '2022-1-exam.pdf', '2022/1-Q2', 25, 'base-antibase',
          `Seja um grafo G com o seguinte conjunto de vértices {A, B, C, D, E, F} e representado pela seguinte matriz de adjacência

${MATRIX_TEXT}

Responda e justifique as seguintes questões:
a) (6%) Qual o fecho transitivo direto do vértice A;
b) (6%) Qual o fecho transitivo inverso do conjunto de vértices {B, F};
c) (13%) Como seria um algoritmo para identificar uma base em um grafo? Sua solução funciona para quais tipos de grafos?`,
          `Arestas (linha → coluna com 1): A → B, A → D; C → A; D → C, D → F; E → B, E → D; F → C.
a) Fecho transitivo direto de A = vértices alcançáveis a partir de A, por busca em profundidade a partir de A: A → B; A → D → C → (A) ; D → F → (C). Fecho direto de A = {A, B, C, D, F} (E não é alcançado: nenhuma aresta chega em E).
b) Fecho transitivo inverso de {B, F} = vértices que alcançam B ou F. Quem alcança B: A e E diretamente; C (C → A → B); D (D → C → A → B); F (F → C → A → B). Quem alcança F: D diretamente; A (A → D → F); E (E → D → F); C e F (C → A → D → F). União: {A, C, D, E, F}. (B não alcança ninguém: sua linha é toda 0.)
c) ${BASE_ALG}
No grafo dado: d⁻(E) = 0 ⇒ E entra na base; E alcança B e D; D alcança C e F; C alcança A. Logo base = {E} (o ciclo A → D → C → A é alcançado a partir de E, então não precisa de representante próprio).`,
          { examFamily: 'fecho-base-antibase', displayGraphs: { a: MATRIX_ABCDEF } }),
      },
      {
        weightPercent: 30,
        question: q('pr-2022-1-q3', '2022-1-exam.pdf', '2022/1-Q3', 30, 'isomorfismo',
          `Isomorfismo em grafos é usualmente feito a partir de grafos não-direcionados. Transponha a definição de isomorfismo de grafos não-direcionados para grafos direcionados discorrendo sobre todas as definições necessárias para tal transposição. Apresente um exemplo de dois grafos direcionados com mais de 5 vértices e 6 arestas. Justifique suas respostas.`,
          `Definições necessárias. Grafo não-direcionado: G = (V, E) com E = {{u, v} | u, v ∈ V} (pares não ordenados; {u, v} e {v, u} são a mesma aresta). Grafo direcionado: G = (V, E) com E = {(u, v) | u, v ∈ V}, uma relação binária em V (pares ORDENADOS; (u, v) ≠ (v, u)). Grau em grafo direcionado: grau de entrada d⁻(v) (arestas que chegam) e grau de saída d⁺(v) (arestas que saem). Isomorfismo (não-direcionado): G e H são isomorfos se existe uma correspondência um-para-um entre seus vértices e entre suas arestas que preserva as relações de incidência — bijeção f: V(G) → V(H) com {u, v} ∈ E(G) ⟺ {f(u), f(v)} ∈ E(H).
Transposição: em grafos direcionados a incidência tem sentido (origem e destino). G e H direcionados são isomorfos se existe uma bijeção f: V(G) → V(H) tal que (u, v) ∈ E(G) ⟺ (f(u), f(v)) ∈ E(H): f leva a origem de cada aresta na origem da correspondente e o destino no destino. As condições necessárias passam a incluir a mesma sequência de graus de entrada e a mesma sequência de graus de saída (além de |V|, |E| e nº de componentes).
Exemplo (6 vértices, 6 arestas):
G: V = {a, b, c, d, e, f}, E = {(a,b), (b,c), (c,d), (d,e), (e,f), (f,a)}.
H: V = {1, 2, 3, 4, 5, 6}, E = {(1,3), (3,5), (5,2), (2,4), (4,6), (6,1)}.
Bijeção f: a→1, b→3, c→5, d→2, e→4, f→6. Verificação aresta a aresta: (a,b)→(1,3) ✓, (b,c)→(3,5) ✓, (c,d)→(5,2) ✓, (d,e)→(2,4) ✓, (e,f)→(4,6) ✓, (f,a)→(6,1) ✓ — e H não tem outras arestas. Cada aresta de G corresponde a uma de H com o mesmo sentido; em ambos d⁻(v) = d⁺(v) = 1 para todo v. Logo G ≅ H.`,
          { examFamily: 'isomorfismo-dirigido' }),
      },
      {
        weightPercent: 20,
        question: q('pr-2022-1-q4', '2022-1-exam.pdf', '2022/1-Q4', 20, 'excentricidade-raio-diametro',
          `Forneça um algoritmo (passo a passo) para calcular o diâmetro de um grafo não-direcionado. Apresente um exemplo que ilustre cada uma das etapas do método descrito.`,
          DIAMETRO_ALG,
          { examFamily: 'excentricidade' }),
      },
      {
        weightPercent: 20,
        question: q('pr-2022-1-q5', '2022-1-exam.pdf', '2022/1-Q5', 20, 'scc-kosaraju',
          `Seja um grafo G com o seguinte conjunto de vértices {A, B, C, D, E, F, G, H, I, J, K, L, M} e representado pela seguinte lista de adjacência de sucessores

${LIST_TEXT}

Determine os componentes fortemente conexos do grafo G, justificando suas respostas.`,
          `Componente fortemente conexo: conjunto de vértices em que todo par tem caminho de ida e de volta. Algoritmo usado:
${PC.KOSARAJU}
Passo 1 — busca em profundidade em G (ordem alfabética), gravando tempos de início/término:
A(1) → B(2, 3) → F(4) → E(5) → C(6) → D(7, 8) ; C(9); E(10); F(11); A(12).
G(13) → J(14) → K(15) → M(16, 17); K(18); L(19, 20); J(21); G(22).
H(23) → I(24, 25); H(26).
Ordem decrescente de término: H, I, G, J, L, K, M, A, F, E, C, D, B.
Passo 2 — transposto Gᵀ: B → A, F → A, A → C, D → C, C → D, F → D, C → E, D → E, E → F, A → G, E → G, J → G, G → H, I → H, H → I, J → I, K → J, L → J, M → K, M → L, E → L, J → M.
Passo 3 — busca em profundidade em Gᵀ na ordem acima:
• de H: H → I → (H) ⇒ {H, I};
• de G: G → (H já visitado) ⇒ {G};
• de J: J → (G), (I), M → K → (J), M → L → (J) ⇒ {J, K, L, M};
• de A: A → C → D → (C), (E) → E → F → (A), (D); E → (G), (L) ⇒ {A, C, D, E, F};
• de B: B → (A) ⇒ {B}.
Componentes fortemente conexos: {A, C, D, E, F}, {B}, {G}, {H, I}, {J, K, L, M}.
Justificativa: A → F → E → C → A e C ↔ D formam ida e volta entre A, C, D, E, F; H ↔ I; J → K → M → J e J → L → M → J; B não tem sucessores; G alcança A, E e J, mas ninguém em {A, E, J, …} volta a G (só H chega em G, e G não alcança H).`,
          { examFamily: 'ciclo-dfs-scc', displayGraphs: { a: LIST_A_TO_M } }),
      },
    ],
  },

  // ======================================================================= 2022/2
  {
    exam: { id: 'prova-2022-2', title: 'Prova 1 — 2022/2 (real)', basedOn: '2022-2-exam.pdf, transcrição literal. 5 questões, 100%.', suggestedDurationMinutes: 120 },
    questions: [
      {
        weightPercent: 10,
        question: q('pr-2022-2-q1', '2022-2-exam.pdf', '2022/2-Q1', 10, 'aperto-de-maos-familias',
          `Considerando um grafo não-direcionado simples G = (V, E) com 11 vértices e 6 componentes, responda e justifique as seguintes questões:
a) (3%) É possível que esse grafo possua 05 arestas?
b) (3%) É possível que a soma de graus de todos os vértices seja igual a 12?
c) (4%) É possível que a soma de graus de todos os vértices seja maior que 100?`,
          `${NK(11, 6).intro}
a) Sim. 5 = n − k é exatamente o mínimo: ex.: cinco vértices isolados e um componente com 6 vértices ligados em sequência (5 arestas) — 6 componentes.
b) Sim. Σ d(v) = 2|E| ⇒ |E| = 6, e 5 ≤ 6 ≤ 15: ex.: quatro vértices isolados, um componente com 2 vértices ligados (1 aresta) e um componente com 5 vértices e 5 arestas (um ciclo).
c) Não. Σ d(v) > 100 ⇒ |E| > 50, mas o máximo com 6 componentes é 15 arestas (soma máxima 2·15 = 30).`,
          { examFamily: 'possibilidade-n-k' }),
      },
      {
        weightPercent: 30,
        question: q('pr-2022-2-q2', '2022-2-exam.pdf', '2022/2-Q2', 30, 'base-antibase',
          `Seja um grafo G com o seguinte conjunto de vértices {A, B, C, D, E, F} e representado pela seguinte matriz de adjacência

${MATRIX_TEXT}

Responda e justifique as seguintes questões:
a) (4%) Qual o fecho transitivo direto do vértice A?
b) (6%) Qual o fecho transitivo inverso do conjunto de vértices {B, F}?
c) (10%) Como seria um algoritmo para identificar uma base em um grafo? Sua solução funciona para quais tipos de grafos?
d) (10%) Como seria um algoritmo para identificar uma anti-base em um grafo? Sua solução funciona para quais tipos de grafos?`,
          `Arestas: A → B, A → D; C → A; D → C, D → F; E → B, E → D; F → C.
a) Busca em profundidade a partir de A: A → B; A → D → C → (A); D → F → (C). Fecho transitivo direto de A = {A, B, C, D, F}.
b) Vértices que alcançam B: A, E (direto), C, D, F (via C → A → B). Vértices que alcançam F: D (direto), A e E (via D), C e F (C → A → D → F). Fecho transitivo inverso de {B, F} = {A, C, D, E, F}.
c) ${BASE_ALG}
No grafo: d⁻(E) = 0 ⇒ base = {E} (E alcança B, D; D alcança C, F; C alcança A).
d) ${ANTIBASE_ALG}
No grafo: em Gᵀ, o único vértice com grau de entrada 0 é B (B não tem saída em G). B é alcançado por todos? A → B, E → B, C → A → B, D → C → A → B, F → C → A → B: sim. Anti-base = {B}.`,
          { examFamily: 'fecho-base-antibase', displayGraphs: { a: MATRIX_ABCDEF } }),
      },
      {
        weightPercent: 20,
        question: q('pr-2022-2-q3', '2022-2-exam.pdf', '2022/2-Q3', 20, 'deteccao-ciclo',
          `Seja um grafo G com o seguinte conjunto de vértices {A, B, C, D, E, F, G, H, I, J, K, L, M} e representado pela seguinte lista de adjacência de sucessores

${LIST_TEXT}

a) (6%) Qual seria a ordem de visita dos vértices na busca em profundidade, iniciando no vértice A, considerando a ordem alfabética para a prioridade na visita dos vizinhos?
b) (14%) O grafo é acíclico? Justifique sua resposta mostrando um algoritmo para detectar ciclos.`,
          `a) Busca em profundidade a partir de A, vizinhos em ordem alfabética:
A → B (B não tem sucessores; volta) → F → E → C → (A já visitado) → D → (C já visitado), (F já visitado). Ordem de visita a partir de A: A, B, F, E, C, D.
Os demais vértices não são alcançáveis a partir de A. Continuando a busca pelos não visitados em ordem alfabética: G → (A, E já visitados) → J → K → M → (J) ; J → L → (E), (M); depois H → (G) → I → (H), (J). Ordem completa: A, B, F, E, C, D, G, J, K, M, L, H, I.
b) Não é acíclico. Exemplos de ciclo: A → F → E → C → A; C → D → C; J → K → M → J.
Algoritmo para detectar ciclos — busca em profundidade com três estados (0 – não começou; 1 – começou mas não terminou; 2 – terminou):
${PC.VISIT}
Um vizinho u com estado 1 está no caminho percorrido até v, e a aresta v → u fecha um ciclo (aresta de retorno). Aplicando: em A(1) → F(1) → E(1) → C(1), a aresta C → A encontra A com estado 1 ⇒ há ciclo.`,
          { examFamily: 'ciclo-dfs-scc', displayGraphs: { a: LIST_A_TO_M } }),
      },
      {
        weightPercent: 20,
        question: q('pr-2022-2-q4', '2022-2-exam.pdf', '2022/2-Q4', 20, 'complemento-subgrafo',
          `Seja G = (V, E) um grafo simples não-direcionado. O complemento de um grafo G, denotado por Ḡ = (V′, E′), é definido por V′ = V e E′ = {{u, v} | {u, v} ∉ E}. Um grafo é dito auto-complementar se é isomorfo ao seu complemento.
a) (6%) Dê um exemplo de um grafo auto-complementar com mais de 3 vértices.
b) (14%) Mostre o que o número de arestas de um grafo auto-complementar é divisível por 4.`,
          `a) Caminho com 4 vértices 1–2–3–4 (arestas 12, 23, 34). Complemento: arestas 13, 14, 24, que formam o caminho 2–4–1–3 — também um caminho com 4 vértices, isomorfo ao original (bijeção 1→2, 2→4, 3→1, 4→3). Outro exemplo: o ciclo C5 (5 vértices, 5 arestas), cujo complemento é outro ciclo de 5 vértices.
b) ${AUTOCOMP_DIV4}`,
          { examFamily: 'auto-complementar' }),
      },
      {
        weightPercent: 20,
        question: q('pr-2022-2-q5', '2022-2-exam.pdf', '2022/2-Q5', 20, 'complemento-subgrafo',
          `Seja G = (V, E) um grafo simples não-direcionado.
a) (6%) Mostre todos os subgrafos de um grafo completo com 3 vértices.
b) (14%) Quantos subgrafos existem em um grafo completo com n vértices em que n = |V|?`,
          `a) K3 com vértices a, b, c e arestas ab, bc, ac. Subgrafos (subconjunto de vértices + subconjunto das arestas entre eles):
• 1 vértice (3): {a}, {b}, {c}.
• 2 vértices (6): {a,b} sem aresta; {a,b} com ab; {a,c} sem aresta; {a,c} com ac; {b,c} sem aresta; {b,c} com bc.
• 3 vértices (8): {a,b,c} com nenhuma aresta; com só ab; só bc; só ac; com ab e bc; ab e ac; bc e ac; com as três (o próprio K3).
Total: 3 + 6 + 8 = 17 subgrafos.
b) ${SUBGRAFOS_KN}`,
          { examFamily: 'subgrafos-kn' }),
      },
    ],
  },

  // ======================================================================= 2023/1
  {
    exam: { id: 'prova-2023-1', title: 'Prova 1 — 2023/1 (real)', basedOn: '2023-1-exam.pdf, transcrição literal. 5 questões, 100%. Nota impressa: "respostas sem justificativas serão desconsideradas".', suggestedDurationMinutes: 120 },
    questions: [
      {
        weightPercent: 20,
        question: q('pr-2023-1-q1', '2023-1-exam.pdf', '2023/1-Q1', 20, 'aperto-de-maos-familias',
          `Seja G = (V, E) um grafo não-direcionado, |V| = n e |E| = m.
a) (4%) Mostre que m ≤ n(n−1)/2.
b) (4%) Mostre que se G é um grafo bipartido então m ≤ n²/4.
c) (4%) G pode ser regular se n = 15 e o grau de cada vértice for 3?
d) (4%) A seguinte sequência de graus 1, 1, 3, 3, 3, 3, 5, 6, 8, 9 pode representar um grafo G?
e) (4%) Se G é um grafo tripartido, qual o maior número de arestas de G. Faça as considerações que julgar necessárias.`,
          `a) Considerando G simples: cada vértice é adjacente a no máximo os outros n − 1 vértices, então d(v) ≤ n − 1. Pela propriedade de grau, 2m = Σ d(v) ≤ n(n − 1), logo m ≤ n(n − 1)/2 (igualdade no grafo completo Kn).
b) Bipartido: V = V1 ∪ V2, toda aresta une V1 a V2. Com |V1| = a e |V2| = n − a, há no máximo a(n − a) arestas (sem paralelas): m ≤ a(n − a). A função a(n − a) = an − a² tem máximo em a = n/2, onde vale n²/4. Logo m ≤ n²/4.
c) Não. Regular com grau 3 e n = 15: Σ d(v) = 15·3 = 45 = 2m ⇒ m = 22,5, não inteiro. (Equivalente: 15 vértices de grau ímpar — o número de vértices de grau ímpar tem que ser par.)
d) Não. Soma = 42 (par) e todos os graus ≤ 9 = n − 1, mas ao construir o grafo trava: o vértice de grau 9 é adjacente a todos os outros 9; então cada um dos dois vértices de grau 1 tem sua única aresta ligada a ele e não aceita mais nenhuma. O vértice de grau 8 precisa de 8 vizinhos entre os outros 9 vértices, mas os dois de grau 1 estão esgotados — sobram no máximo 7 < 8. Logo a sequência não representa grafo simples.
e) Tripartido: V particionado em três conjuntos V1, V2, V3 com arestas só entre conjuntos distintos. O máximo é o tripartido completo, com |V1|·|V2| + |V1|·|V3| + |V2|·|V3| arestas. Essa soma, com |V1| + |V2| + |V3| = n, é máxima quando os três conjuntos são o mais iguais possível: para 3 | n, n/3 cada, dando 3·(n/3)² = n²/3 arestas (consideração: se 3 ∤ n, use ⌊n/3⌋ e ⌈n/3⌉).`,
          { examFamily: 'limites-grau-arestas' }),
      },
      {
        weightPercent: 20,
        question: q('pr-2023-1-q2', '2023-1-exam.pdf', '2023/1-Q2', 20, 'aperto-de-maos-familias',
          `Considerando um grafo não-direcionado simples G = (V, E) com 13 vértices e 6 componentes, responda e justifique as seguintes questões (respostas sem justificativas serão desconsideradas):
a) (3%) É possível que esse grafo possua 06 arestas?
b) (4%) É possível que a soma de graus de todos os vértices seja igual a 14?
c) (4%) É possível que a soma de graus de todos os vértices seja maior que 56?
d) (4%) É possível transformar este grafo em um grafo conexo com a inclusão de 5 arestas?
e) (5%) É possível que esse grafo seja regular?`,
          `${NK(13, 6).intro}
a) Não. 6 < 7 = n − k: com 6 arestas sobrariam mais de 6 componentes.
b) Sim. Σ d(v) = 2|E| ⇒ |E| = 7, exatamente o mínimo: ex.: cinco vértices isolados e um componente com 8 vértices ligados em sequência (7 arestas).
c) Não. Σ d(v) > 56 ⇒ |E| > 28, mas o máximo com 6 componentes é 28 (cinco isolados + K8 com 8·7/2 = 28). Soma máxima = 56.
d) Sim. Cada aresta entre dois componentes distintos reduz o número de componentes em exatamente 1; de 6 para 1 são necessárias e suficientes 5 arestas.
e) Não. Se todos têm grau d ≥ 1, cada componente precisa de pelo menos d + 1 vértices, logo 13 ≥ 6(d + 1) ⇒ d = 1. Com d = 1, cada componente é um par de vértices ligados, o que exige 13 par — contradição. Com d = 0 o grafo é nulo, com 13 componentes, não 6. Logo não pode ser regular.`,
          { examFamily: 'possibilidade-n-k' }),
      },
      {
        weightPercent: 20,
        question: q('pr-2023-1-q3', '2023-1-exam.pdf', '2023/1-Q3', 20, 'complemento-subgrafo',
          `Seja G = (V, E) um grafo simples não-direcionado. O complemento de um grafo G, denotado por Ḡ = (V′, E′), é definido por V′ = V e E′ = {{u, v} | {u, v} ∉ E}. Um grafo é dito auto-complementar se é isomorfo ao seu complemento.
a) (6%) Dê dois exemplos de grafos auto-complementar com mais de 4 vértices.
b) (14%) Prove que um grafo auto-complementar tem 4k ou 4k + 1 vértices, para k um inteiro não negativo.`,
          `a) Com 5 vértices são necessárias 5·4/4 = 5 arestas.
Exemplo 1: o ciclo C5 = a–b–c–d–e–a. Complemento: ac, ad, bd, be, ce, que formam o ciclo a–c–e–b–d–a — isomorfo a C5.
Exemplo 2: vértices 1, 2, 3, 4, 5 com arestas 12, 23, 34, 45, 24 (caminho 1–2–3–4–5 mais {2, 4}). Complemento: 13, 14, 15, 25, 35. Nos dois grafos há dois vértices de grau 3 adjacentes entre si, com um vizinho comum de grau 2 e um vértice pendente em cada um; a bijeção 2→1, 4→5, 3→3, 1→4, 5→2 leva 12→14, 23→13, 34→35, 45→25, 24→15 — todas as arestas do complemento. Logo é auto-complementar.
b) Seja G auto-complementar com n vértices. (1) G ≅ Ḡ ⇒ |E(G)| = |E(Ḡ)|. (2) Toda aresta de Kn está em G ou em Ḡ, nunca em ambos: |E(G)| + |E(Ḡ)| = n(n − 1)/2. (3) Logo |E(G)| = n(n − 1)/4. (4) Como |E(G)| é inteiro, 4 divide n(n − 1). (5) n e n − 1 são consecutivos: só um deles é par, e o ímpar não contribui com fator 2, então o par é múltiplo de 4. (6) Se n é o múltiplo de 4, n = 4k; se n − 1 é, n = 4k + 1. ∎`,
          { examFamily: 'auto-complementar' }),
      },
      {
        weightPercent: 15,
        question: q('pr-2023-1-q4', '2023-1-exam.pdf', '2023/1-Q4', 15, 'matriz-adjacencia',
          `a) (7%) Seja uma matriz simétrica quadrada formada apenas por 0's e 1's que tem apenas 0's na diagonal principal. Essa matriz pode representar a matriz de adjacência de um grafo simples?
b) (8%) O que representa a soma das entradas de uma coluna de uma matriz de adjacência de um grafo não-direcionado? E de um grafo direcionado?`,
          `a) Sim. Matriz de adjacência: aij = 1 se (i, j) ∈ A e 0 caso contrário. Simétrica (aij = aji) ⇒ a aresta (i, j) existe junto com (j, i), isto é, grafo não-direcionado. Diagonal só com 0 ⇒ nenhuma aresta (i, i): sem laços. Entradas só 0 ou 1 ⇒ no máximo uma aresta por par: sem arestas paralelas. Sem laços e sem arestas paralelas é a definição de grafo simples; basta ler cada 1 acima da diagonal como a aresta {i, j}.
b) Não-direcionado: a soma da coluna j conta os vértices i com aij = 1, isto é, as arestas incidentes em j: é o grau d(j). Direcionado: aij = 1 significa aresta de i PARA j; a soma da coluna j conta as arestas que chegam em j: é o grau de entrada d⁻(j). (A soma da linha i é o grau de saída d⁺(i).)`,
          { examFamily: 'matriz-adjacencia' }),
      },
      {
        weightPercent: 25,
        question: q('pr-2023-1-q5', '2023-1-exam.pdf', '2023/1-Q5', 25, 'bfs',
          `Seja G = (V, E) um grafo não-direcionado e um vértice v ∈ V. Projete um algoritmo para encontrar o número de arestas entre v e todos os outros vértices do grafo G. Portanto, a saída do algoritmo deverá ser, para cada vértice u ∈ V a distância, em número de arestas, entre v e u. Deixe claro todos os elementos e etapas de seu algoritmo.`,
          `Distância em número de arestas é obtida por busca em largura, que explora todos os vértices de um mesmo nível de proximidade antes de passar ao próximo.
Elementos: vetor dist com uma posição por vértice; fila.
${PC.DISTANCIAS}
Saída: dist[u] para todo u ∈ V (dist[u] = −1 significa que u não é alcançável a partir de v — está em outro componente).
Justificativa: a fila processa todos os vértices a distância d antes de qualquer vértice a distância d + 1; quando u é descoberto por w, o caminho v … w u tem dist[w] + 1 arestas e é o mais curto possível.
Custo: cada vértice entra na fila uma vez e cada aresta é examinada uma vez em cada ponta: O(|V| + |E|) com lista de adjacência.`,
          { examFamily: 'bfs-distancias' }),
      },
    ],
  },

  // ======================================================================= 2023/2
  {
    exam: { id: 'prova-2023-2', title: 'Prova 1 — 2023/2 (real)', basedOn: '2023-2-exam.pdf, transcrição literal. 4 questões, 100%.', suggestedDurationMinutes: 120 },
    questions: [
      {
        weightPercent: 20,
        question: q('pr-2023-2-q1', '2023-2-exam.pdf', '2023/2-Q1', 20, 'complemento-subgrafo',
          `Seja G = (V, E) um grafo simples e não-direcionado.
(i) (05%) Considerando que ainda não foi definido o conjunto de arestas, qual será o maior e o menor número de arestas de G?
(ii) (05%) Considerando que ainda não foi definido o conjunto de arestas, qual será o maior e o menor número de componentes conexos que pode haver em G?
(iii) (05%) Encontre três exemplos de grafos com mais de 4 vértices em que o número de arestas de G seja igual ao número de arestas do complemento de G.
(iv) (05%) Para quais valores de |V| é possível que um grafo G tenha o mesmo número de arestas de seu complemento?`,
          `Seja n = |V|.
(i) Menor: 0 arestas (grafo nulo). Maior: n(n − 1)/2 (grafo completo Kn: cada vértice adjacente aos outros n − 1, cada aresta contada em duas pontas).
(ii) Maior: n componentes (grafo nulo: todo vértice isolado). Menor: 1 componente (grafo conexo).
(iii) |E(G)| = |E(Ḡ)| com |E(G)| + |E(Ḡ)| = n(n − 1)/2 ⇒ |E(G)| = n(n − 1)/4. Exemplos: n = 5 com 5 arestas: o ciclo C5; n = 5 com 5 arestas: o caminho 1–2–3–4–5 mais a aresta {2, 4}; n = 9 com 18 arestas: o bipartido completo K3,6 (3·6 = 18). (Qualquer grafo com 5 vértices e 5 arestas, ou 8 vértices e 14 arestas, ou 9 vértices e 18 arestas, serve.)
(iv) É preciso que n(n − 1)/4 seja inteiro, isto é, 4 | n(n − 1). Como só um entre n e n − 1 é par, esse par tem que ser múltiplo de 4: n = 4k ou n = 4k + 1 (n = 4, 5, 8, 9, 12, 13, …).`,
          { examFamily: 'auto-complementar' }),
      },
      {
        weightPercent: 30,
        question: q('pr-2023-2-q2', '2023-2-exam.pdf', '2023/2-Q2', 30, 'base-antibase',
          `Seja G = (V, E) um grafo simples e direcionado. Projete uma solução para encontrar (i) (15%) uma base e (ii) (15%) uma anti-base em G. Cumpre reforçar que a cardinalidade de ambos os conjuntos deva ser a menor possível.`,
          `(i) ${BASE_ALG}
(ii) ${ANTIBASE_ALG}
Cardinalidade mínima: em ambos os casos, cada vértice (ou ciclo contraído) sem aresta chegando precisa obrigatoriamente de um representante, e um representante basta; nenhum outro vértice é necessário porque todos os demais são alcançados a partir desses.`,
          { examFamily: 'fecho-base-antibase' }),
      },
      {
        weightPercent: 25,
        question: q('pr-2023-2-q3', '2023-2-exam.pdf', '2023/2-Q3', 25, 'excentricidade-raio-diametro',
          `Seja o grafo G = (V, E) em que V = {a, b, c, d, e, f, g, h, i} e
E = {{a,b}, {b,c}, {b,d}, {c,g}, {d,e}, {d,g}, {d,h}, {c,f}, {h,i}, {a,i}}.
Responda e justifique suas respostas:
(i) (10%) Encontre a excentricidade de cada vértice.
(ii) (08%) Qual o raio e o diâmetro de G?
(iii) (07%) Defina o(s) centro(s) de G.`,
          `Excentricidade de v = maior das menores distâncias (em nº de arestas) entre v e os demais vértices; calcula-se por busca em largura a partir de cada vértice.
(i) ε(a) = 3; ε(b) = 2; ε(c) = 3; ε(d) = 3; ε(e) = 4; ε(f) = 4; ε(g) = 3; ε(h) = 4; ε(i) = 4.
Justificativa (busca em largura): de b, todos os vértices estão a distância ≤ 2 (a, c, d a 1; i, f, g, e, h a 2). De a: b, i a 1; c, d, h a 2; f, g, e a 3. De e: d a 1; b, g, h a 2; a, c, i a 3; f a 4 (e–d–b–c–f). De f: c a 1; b, g a 2; a, d a 3; i, e, h a 4. De h: d, i a 1; b, e, g, a a 2; c a 3; f a 4. De i: a, h a 1; b, d a 2; c, e, g a 3; f a 4. De c, d, g: máximo 3.
(ii) Raio = menor excentricidade = 2. Diâmetro = maior excentricidade = 4.
(iii) Centro = conjunto dos vértices com excentricidade igual ao raio = {b}.`,
          { examFamily: 'excentricidade', displayGraphs: { a: EXAM_GRAPH_AI } }),
      },
      {
        weightPercent: 25,
        question: q('pr-2023-2-q4', '2023-2-exam.pdf', '2023/2-Q4', 25, 'euleriano',
          `O bilionário Count Mui Dinheiro acaba de ser assassinado. Um conhecido detetive, que é especializado em teoria dos grafos foi chamado para investigar o caso. O assassinato ocorreu na sala em que está a piscina, infelizmente, mesmo sendo muito rico, Count Mui Dinheiro não havia colocado câmeras em sua residência. A residência possui muito funcionários, dentre eles uma governanta e um piscineiro. A governanta afirma ter visto o piscineiro entrando e saindo pelo cômodo em que o bilionário foi assassinado vindo da parte externa. O piscineiro, entretanto, declara que a governanta mentiu pois ele não poderia ter sido a pessoa vista por ela uma vez que entrou na casa por uma porta, e passou por todas as outras portas uma única vez, antes de deixar a casa. O detetive, muito esperto, avaliou a planta da casa e rapidamente declarou quem mentiu. Quem poderia ser o suspeito indicado pelo detetive? Qual a linha de raciocínio que foi usada para apontar o suspeito?

Planta (cômodos e portas): bar, quarto 1, quarto 2, quarto 3, adega, cozinha, jogos, piscina, despensa e o exterior. Portas: bar–quarto 2; bar–quarto 1; quarto 2–quarto 3 (duas portas); adega–cozinha (duas portas); quarto 1–piscina; quarto 1–jogos (duas portas); piscina–cozinha; cozinha–despensa; piscina–despensa; piscina–exterior (duas portas).`,
          `Modelagem: cada cômodo (e o exterior) é um vértice; cada porta é uma aresta entre os dois cômodos que ela liga. O trajeto que o piscineiro descreve — entrar por uma porta, passar por todas as outras uma única vez e sair — é um percurso que usa cada aresta exatamente uma vez, começando e terminando no exterior: um circuito euleriano (fechado no vértice "exterior").
Condição: um grafo conexo tem circuito euleriano se, e somente se, todo vértice tem grau par; tem caminho euleriano (aberto) se, e somente se, exatamente dois vértices têm grau ímpar, e ele começa em um deles e termina no outro.
Graus (número de portas de cada cômodo): piscina = 5 (quarto 1, cozinha, despensa e duas para o exterior) — ímpar; quarto 2 = 3 (bar e duas para o quarto 3) — ímpar; exterior = 2; bar = 2; quarto 1 = 4; quarto 3 = 2; adega = 2; cozinha = 4; jogos = 2; despensa = 2.
Conclusão: há vértices de grau ímpar (a piscina, com 5 portas, e o quarto 2), então não existe circuito euleriano; um percurso por todas as portas só pode ser um caminho euleriano, começando na piscina e terminando no quarto 2 (ou vice-versa) — nunca começando e terminando no exterior. Logo o trajeto descrito pelo piscineiro é impossível: o piscineiro mentiu, e é ele o suspeito. A declaração da governanta (entrou e saiu pela piscina, que tem duas portas para fora) é consistente com a planta.`,
          { examFamily: 'euleriano' }),
      },
    ],
  },

  // ======================================================================= 2024/1
  {
    exam: { id: 'prova-2024-1', title: 'Prova 1 — 2024/1 (real)', basedOn: 'Provas 1 Grafos.pdf, pp. 19–23, transcrição literal. 4 questões, 100%.', suggestedDurationMinutes: 120 },
    questions: [
      {
        weightPercent: 30,
        question: q('pr-2024-1-q1', 'Provas 1 Grafos.pdf', '2024/1-Q1', 30, 'base-antibase',
          `Seja G = (V, E) um grafo simples e direcionado. Projete uma solução para encontrar (i) (15%) uma base e (ii) (15%) uma anti-base em G. Cumpre reforçar que a cardinalidade de ambos os conjuntos deva ser a menor possível.`,
          `(i) ${BASE_ALG}
(ii) ${ANTIBASE_ALG}
Cardinalidade mínima: cada vértice (ou ciclo contraído) sem aresta chegando precisa obrigatoriamente de um representante, e um só basta; os demais vértices são todos alcançados a partir deles.`,
          { examFamily: 'fecho-base-antibase' }),
      },
      {
        weightPercent: 20,
        question: q('pr-2024-1-q2', 'Provas 1 Grafos.pdf', '2024/1-Q2', 20, 'complemento-subgrafo',
          `Seja G = (V, E) um grafo não-direcionado completo com n vértices. Determine o número de subgrafos de G. Justifique sua resposta.`,
          SUBGRAFOS_KN,
          { examFamily: 'subgrafos-kn' }),
      },
      {
        weightPercent: 22,
        question: q('pr-2024-1-q3', 'Provas 1 Grafos.pdf', '2024/1-Q3', 22, 'aperto-de-maos-familias',
          `Seja G = (V, E) um grafo simples com pelo menos dois vértices. Prove que G conterá pelo menos dois vértices de mesmo grau.`,
          POMBOS,
          { examFamily: 'pombos' }),
      },
      {
        weightPercent: 28,
        question: q('pr-2024-1-q4', 'Provas 1 Grafos.pdf', '2024/1-Q4', 28, 'excentricidade-raio-diametro',
          `Seja o grafo G = (V, E) em que V = {a, b, c, d, e, f, g, h, i} e
E = {{a,b}, {b,c}, {b,d}, {c,g}, {d,e}, {d,g}, {d,h}, {c,f}, {h,i}, {a,i}}.
Responda e justifique suas respostas:
(i) (08%) Encontre a excentricidade de cada vértice.
(ii) (05%) Qual o raio e o diâmetro de G?
(iii) (05%) Defina o(s) centro(s) de G.
(iv) (10%) Projete um algoritmo para encontrar o diâmetro de um grafo simples não-direcionado.`,
          `(i) ε(a) = 3; ε(b) = 2; ε(c) = 3; ε(d) = 3; ε(e) = 4; ε(f) = 4; ε(g) = 3; ε(h) = 4; ε(i) = 4 (busca em largura a partir de cada vértice; ex.: de e, o mais longe é f: e–d–b–c–f, 4 arestas; de b, todos a distância ≤ 2).
(ii) Raio = 2 (menor excentricidade); diâmetro = 4 (maior).
(iii) Centro = {b}: único vértice com excentricidade igual ao raio.
(iv) ${DIAMETRO_ALG}`,
          { examFamily: 'excentricidade', displayGraphs: { a: EXAM_GRAPH_AI } }),
      },
    ],
  },

  // ======================================================================= 2024/2
  {
    exam: { id: 'prova-2024-2', title: 'Prova 1 — 2024/2 (real)', basedOn: '2024-2-exam.pdf, transcrição literal. 4 questões, 100%.', suggestedDurationMinutes: 120 },
    questions: [
      {
        weightPercent: 20,
        question: q('pr-2024-2-q1', '2024-2-exam.pdf', '2024/2-Q1', 20, 'aperto-de-maos-familias',
          `Seja G = (V, E) um grafo simples com pelo menos dois vértices. Prove que G conterá pelo menos dois vértices de mesmo grau.`,
          POMBOS,
          { examFamily: 'pombos' }),
      },
      {
        weightPercent: 20,
        question: q('pr-2024-2-q2', '2024-2-exam.pdf', '2024/2-Q2', 20, 'complemento-subgrafo',
          `Seja G = (V, E) um grafo não-direcionado completo com n vértices. Determine o número de subgrafos de G. Justifique sua resposta.`,
          SUBGRAFOS_KN,
          { examFamily: 'subgrafos-kn' }),
      },
      {
        weightPercent: 30,
        question: q('pr-2024-2-q3', '2024-2-exam.pdf', '2024/2-Q3', 30, 'deteccao-ciclo',
          `Seja G = (V, E) um grafo simples e direcionado. Projete, explicando todos os detalhes, (i) uma solução para determinar se o grafo possui algum ciclo; e (ii) caso haja algum ciclo, encontre os vértices que compõem este ciclo.`,
          `(i) Busca em profundidade com três estados (0 – não começou; 1 – começou mas não terminou; 2 – terminou), guardando também o pai de cada vértice na busca:
${PC.VISIT_COM_PAI}
Justificativa: um vizinho u em estado 1 começou e não terminou, ou seja, está no caminho que a busca percorreu de u até v (u é ancestral de v); a aresta (v, u) fecha esse caminho em um ciclo — aresta de retorno. Vizinhos em estado 2 (terminados) ou 0 (novos) não fecham ciclo. Se a busca termina sem encontrar estado 1, G é acíclico. Custo O(|V| + |E|).
(ii) Ao encontrar a aresta de retorno (v, u), os vértices do ciclo são u e todos os vértices no caminho da busca de u até v: VERTICES_DO_CICLO(v, u) começa em v e segue pai[v], pai[pai[v]], … até chegar em u. Exemplo: busca a(1) → b(1) → c(1) com aresta (c, a): a tem estado 1; pai[c] = b, pai[b] = a ⇒ ciclo a → b → c → a.`,
          { examFamily: 'ciclo-dfs-scc' }),
      },
      {
        weightPercent: 30,
        question: q('pr-2024-2-q4', '2024-2-exam.pdf', '2024/2-Q4', 30, 'topologica-maior-caminho',
          `Seja G = (V, E) um grafo acíclico e direcionado. Projete uma solução, explicando todos os detalhes, como encontrar o número de arestas do maior caminho do grafo.`,
          `Ideia: em um grafo direcionado sem ciclos é possível ordenar os vértices de modo que toda aresta vá de um vértice anterior para um posterior (ordem topológica). Processando os vértices nessa ordem, ao chegar em um vértice já conhecemos o maior caminho que termina em cada um de seus predecessores.
${PC.ORDEM_TOPOLOGICA}
${PC.MAIOR_CAMINHO}
Justificativa: ORDEM_TOPOLOGICA retira sempre um vértice sem aresta chegando dos que restam; como G é acíclico, sempre existe um, e todos acabam na ordem. Em MAIOR_CAMINHO, quando v é processado todos os seus predecessores já foram (vêm antes na ordem), então dist[v] já é o maior número de arestas de um caminho que termina em v; cada aresta é examinada uma vez. Custo O(|V| + |E|).
Exemplo: a → b, a → c, b → d, c → d, d → e. Ordem: a, b, c, d, e. dist: a 0, b 1, c 1, d 2, e 3 ⇒ maior caminho com 3 arestas (a → b → d → e).`,
          { examFamily: 'topologica-dag' }),
      },
    ],
  },

  // ======================================================================= 2025/1
  {
    exam: { id: 'prova-2025-1', title: 'Prova 1 — 2025/1 (real)', basedOn: '2025-1-exam.pdf, transcrição literal. 5 questões, 100%.', suggestedDurationMinutes: 120 },
    questions: [
      {
        weightPercent: 15,
        question: q('pr-2025-1-q1', '2025-1-exam.pdf', '2025/1-Q1', 15, 'aperto-de-maos-familias',
          `Considerando um grafo não-direcionado simples G = (V, E) com 13 vértices e 7 componentes, responda e justifique as seguintes questões:
a) (4%) É possível que esse grafo possua 06 arestas?
b) (5%) É possível que haja um grafo em que a soma de graus de todos os vértices seja igual a 12?
c) (6%) É possível que haja um grafo em que a soma de graus de todos os vértices seja maior que 100?`,
          `${NK(13, 7).intro}
a) Sim. 6 = n − k é exatamente o mínimo: ex.: seis vértices isolados e um componente com 7 vértices ligados em sequência (6 arestas).
b) Sim. Σ d(v) = 2|E| ⇒ |E| = 6 = mínimo; mesmo exemplo do item a.
c) Não. Σ d(v) > 100 ⇒ |E| > 50, mas o máximo com 7 componentes é 21 arestas (seis isolados + K7 com 7·6/2 = 21); soma máxima 42.`,
          { examFamily: 'possibilidade-n-k' }),
      },
      {
        weightPercent: 20,
        question: q('pr-2025-1-q2', '2025-1-exam.pdf', '2025/1-Q2', 20, 'complemento-subgrafo',
          `Seja G = (V, E) um grafo simples não-direcionado. O complemento de um grafo G, denotado por Ḡ = (V′, E′), é definido por V′ = V e E′ = {{u, v} | {u, v} ∉ E}. Um grafo é dito auto-complementar se é isomorfo ao seu complemento. É correto afirmar que o número de arestas de um grafo auto-complementar é divisível por 4? Justifique sua resposta.`,
          `Não.
1. G ≅ Ḡ ⇒ |E(G)| = |E(Ḡ)| (grafos isomorfos têm o mesmo número de arestas).
2. Pela definição de complemento, todo par {u, v} é aresta de G ou de Ḡ, nunca de ambos: |E(G)| + |E(Ḡ)| = n(n − 1)/2.
3. Logo |E(G)| = n(n − 1)/4. Isso obriga n(n − 1) a ser divisível por 4 (⇒ n = 4k ou 4k + 1), mas não obriga |E(G)| a ser divisível por 4.
Contra-exemplo: C5 (ciclo com 5 vértices) é auto-complementar — seu complemento tem as arestas ac, ad, bd, be, ce, que formam o ciclo a–c–e–b–d–a — e tem 5·4/4 = 5 arestas; 5 não é divisível por 4. Logo a afirmação é falsa.`,
          { examFamily: 'auto-complementar' }),
      },
      {
        weightPercent: 15,
        question: q('pr-2025-1-q3', '2025-1-exam.pdf', '2025/1-Q3', 15, 'aperto-de-maos-familias',
          `O grafo tripartite completo Kr,s,t consiste de três conjuntos de vértices de tamanhos r, s e t, com arestas unindo dois vértices se e somente se eles pertencem a conjuntos distintos. (a) (7%) Desenhe os grafos K2,2,2 e K2,3,3; e (b) (8%) Quantos vértices e arestas o grafo Kr,s,t possui (exprima sua resposta em função de r, s e t)?`,
          `(a) K2,2,2: conjuntos {a1, a2}, {b1, b2}, {c1, c2}; desenhe os três pares em três "lados" e ligue cada vértice a TODOS os vértices dos outros dois lados (nenhuma aresta dentro do mesmo lado): 6 vértices, 4 + 4 + 4 = 12 arestas (a1 e a2 ligados a b1, b2, c1, c2; b1 e b2 ligados a c1, c2). K2,3,3: conjuntos {a1, a2}, {b1, b2, b3}, {c1, c2, c3}: 8 vértices, 2·3 + 2·3 + 3·3 = 21 arestas.
(b) Vértices: |V| = r + s + t. Arestas: cada par de conjuntos forma um bipartido completo, com r·s, r·t e s·t arestas; como dentro de um conjunto não há aresta, |E| = rs + rt + st.`,
          { examFamily: 'bipartido-tripartido' }),
      },
      {
        weightPercent: 15,
        question: q('pr-2025-1-q4', '2025-1-exam.pdf', '2025/1-Q4', 15, 'aperto-de-maos-familias',
          `Seja G = (V, E) um grafo não-direcionado, simples e conexo. Prove que há, pelo menos, dois vértices em G que possuem o mesmo grau.`,
          `Seja n = |V| ≥ 2 (um grafo conexo com um único vértice não tem dois vértices).
1. G é simples: cada vértice é adjacente a no máximo os outros n − 1, logo d(v) ≤ n − 1.
2. G é conexo com n ≥ 2: todo vértice tem pelo menos uma aresta incidente (senão estaria isolado, e o grafo não seria conexo), logo d(v) ≥ 1.
3. Assim d(v) ∈ {1, 2, …, n − 1}: n − 1 valores possíveis para n vértices.
4. Não tem como n vértices terem n − 1 graus todos diferentes: pelo menos dois vértices têm o mesmo grau. ∎
(Sem a hipótese "conexo" a prova ainda vale: grau 0 e grau n − 1 não coexistem, o que também deixa no máximo n − 1 valores.)`,
          { examFamily: 'pombos' }),
      },
      {
        weightPercent: 35,
        question: q('pr-2025-1-q5', '2025-1-exam.pdf', '2025/1-Q5', 35, 'topologica-maior-caminho',
          `No contexto de armazenamento e transmissão de dados, serialização é o processo de transformação de estruturas de dados ou objetos em um formato que possa ser armazenado (por exemplo, em um arquivo ou buffer de memória, ou transmitido por meio de uma conexão de rede) e reconstruído posteriormente no mesmo ou em outro ambiente computacional. Quando a série de bytes resultante é lida, ela pode ser usada para criar um clone semanticamente idêntico à estrutura de dados ou ao objeto original. Para estruturas/objetos complexos, como aqueles que fazem uso extensivo de referências, este processo não é direto, uma vez que estruturas/objetos referenciados também devem ser serializados. Dessa forma, para se implementar um mecanismo adequado de serialização de dados é importante ser capaz de usar tais relações de dependência entre as estruturas/objetos, de forma a garantir que ele seja serializado juntamente com as demais estruturas/objetos que ele faz referência. Descreva (i) – 15% – como esse problema pode ser modelado utilizando grafos e forneça uma descrição de um método que garanta que cada estrutura/objeto seja serializada uma única vez e apareça antes das estruturas/objetos referenciadas por ela; e (ii) – 20% – caso todas as estruturas/objetos tenham o mesmo tamanho e considerando que seu recurso seja extremamente limitado e caro, como identificar o tamanho mínimo (sem que haja desperdício de espaço) que um buffer deva ter para armazenar qualquer objeto estrutura/objeto juntamente com as/os demais estruturas/objetos que ele/ela faz referência.`,
          `(i) Modelagem: grafo direcionado G = (V, E) em que cada estrutura/objeto é um vértice e há uma aresta (A, B) quando A referencia B. "Serializar cada objeto uma única vez e antes dos que ele referencia" é percorrer os vértices numa ordem em que todo vértice vem antes de seus sucessores.
${PC.SERIALIZA}
Justificativa: na busca em profundidade um vértice só termina depois que todos os seus sucessores (os objetos que ele referencia) terminaram; escrever em ordem DECRESCENTE de fim[u] põe cada objeto antes dos referenciados. Cada vértice é visitado uma única vez (estado ≠ 0 não é revisitado), o que garante serialização única. Se VISIT encontrar um vizinho em estado 1, há ciclo de referências (A referencia B que referencia A) e não existe ordem que respeite todas as dependências — contrai-se o ciclo (componente fortemente conexo) e serializa-se o grupo junto, marcando as referências internas.
(ii) O buffer precisa conter o objeto e todos os objetos que ele referencia, direta ou indiretamente — o fecho transitivo direto do vértice (conjunto dos vértices alcançáveis a partir dele), obtido por VISITAR_REC a partir de v. Como todos têm o mesmo tamanho, TAMANHO_BUFFER(G, v) = |fecho transitivo direto de v| × tamanho de um objeto; para "qualquer objeto", tome o maior valor entre todos os vértices. Não há desperdício porque só entram no buffer objetos realmente referenciados.`,
          { examFamily: 'topologica-dag' }),
      },
    ],
  },

  // ======================================================================= 2026/1
  {
    exam: { id: 'prova-2026-1', title: 'Prova 1 — 2026/1 (real)', basedOn: 'P1-TGC.pdf, transcrição literal. 4 questões, 100%. Instrução: "Justifique todas as respostas. Simplesmente colocar fórmulas sem explicação ou usar teoremas sem explicações não serão considerados."', suggestedDurationMinutes: 120 },
    questions: [
      {
        weightPercent: 25,
        question: q('pr-2026-1-q1', 'P1-TGC.pdf', '2026/1-Q1', 25, 'aperto-de-maos-familias',
          `Seja G = (V, E) um grafo simples e não direcionado com pelo menos dois vértices. Justifique todas as respostas. Simplesmente colocar fórmulas sem explicação ou usar teoremas sem explicações não serão considerados.
1. Prove que G conterá pelo menos dois vértices de mesmo grau.
2. Determine o número de subgrafos de G, caso G seja completo.`,
          `1. ${POMBOS}

2. ${SUBGRAFOS_KN}`,
          { examFamily: 'pombos' }),
      },
      {
        weightPercent: 25,
        question: q('pr-2026-1-q2', 'P1-TGC.pdf', '2026/1-Q2', 25, 'euleriano',
          `Um grafo não direcionado é dito euleriano se houver um circuito simples que passe por todas as arestas do grafo, e semi-euleriano se houver um caminho simples que passe por todas as arestas do grafo. Este circuito e este caminho são chamados de circuito euleriano e caminho euleriano, respectivamente. Projete uma solução para encontrar um circuito euleriano em um Grafo Euleriano, caso exista. Todas as suas decisões/escolhas devem ser bem justificadas.`,
          EULER_ALG,
          { examFamily: 'euleriano' }),
      },
      {
        weightPercent: 25,
        question: q('pr-2026-1-q3', 'P1-TGC.pdf', '2026/1-Q3', 25, 'topologica-maior-caminho',
          `Seja o processo de construção de uma casa, que envolve inúmeras tarefas interdependentes. O engenheiro civil contratado e responsável pela obra identifica todas as subtarefas necessárias na construção e suas dependências. As subtarefas poderiam ser, por exemplo, as seguintes: fazer a fundação, levantar as paredes, fazer o telhado, realizar o trabalho interno, paisagismo. É óbvio que a construção do telhado depende da construção das paredes que dependem da fundação, mas a construção de banheiros podem ser feitos em paralelo. Considere que todas as tarefas serão executadas em uma semana. Caso você seja o engenheiro, (i) crie um grafo que represente o processo de construção de uma casa (lembre-se que há tarefas dependentes mas pode haver tarefas que podem ser executadas em paralelo). Além disso, (ii) projete uma solução baseada em grafos para encontrar o tempo mínimo, em semanas, que a casa ficará pronta.`,
          `(i) Grafo direcionado G = (V, E): cada tarefa é um vértice; há uma aresta (A, B) quando B só pode começar depois de A terminar. Exemplo: fundação → paredes → telhado → trabalho interno; paredes → banheiros (em paralelo com telhado); fundação → paisagismo (em paralelo com tudo depois da fundação); telhado → trabalho interno; banheiros → trabalho interno. O grafo não tem ciclos (uma tarefa não pode depender de si mesma, direta ou indiretamente). Tarefas sem aresta entre elas, e que não dependem uma da outra por caminho, podem ser executadas em paralelo.
(ii) Como toda tarefa dura uma semana e as tarefas independentes rodam em paralelo, o tempo mínimo é o número de tarefas do caminho mais longo do grafo (contando vértices): as tarefas desse caminho têm que ser feitas uma após a outra.
${PC.ORDEM_TOPOLOGICA}
${PC.TEMPO_CASA}
Justificativa: quando v é processado, todos os seus predecessores já têm t definitivo (vêm antes na ordem topológica), então t[v] é a menor semana em que v pode terminar; o máximo sobre todos os vértices é a semana em que a última tarefa termina. No exemplo: fundação 1, paredes 2, paisagismo 2, telhado 3, banheiros 3, trabalho interno 4 ⇒ 4 semanas.`,
          { examFamily: 'topologica-dag' }),
      },
      {
        weightPercent: 25,
        question: q('pr-2026-1-q4', 'P1-TGC.pdf', '2026/1-Q4', 25, 'deteccao-ciclo',
          `Seja G = (V, E) um grafo direcionado. Projete duas soluções distintas para definir se o grafo é acíclico ou se possui ciclos. Justifique todas as suas decisões, e explique suas soluções.`,
          CICLO_DUAS,
          { examFamily: 'ciclo-dfs-scc' }),
      },
    ],
  },
];

export const provasReaisQuestions: Question[] = provasReais.flatMap((p) => p.questions.map((x) => x.question));
