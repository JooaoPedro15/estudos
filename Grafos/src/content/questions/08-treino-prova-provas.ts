import type { Option, Question, Source } from '@/content/types';

// Provas formais e "projete um algoritmo" das provas antigas em formato
// FECHADO: ordenar os passos ou escolher a formulação correta. Na prova você
// escreve tudo; aqui treina a ESTRUTURA sem digitar. Complementa as versões
// abertas (PROOF_OR_JUSTIFICATION) que ficam para o simulado e a sessão.

const exam = (file: string, note: string): Source => ({ type: 'old_exam', file, note });

function options(id: string, correct: string, wrong: string[]): Option[] {
  const hash = (str: string) => {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
    return h;
  };
  const all = [{ id: 'correct', label: correct }, ...wrong.map((w, i) => ({ id: `w${i}`, label: w }))];
  return all.sort((a, b) => hash(`${id}|${a.id}`) - hash(`${id}|${b.id}`));
}

const proofOrder = (
  id: string,
  family: string,
  topic: string,
  prompt: string,
  steps: string[],
  source: Source,
  solution: string,
  generalRule?: string,
): Question => ({
  id,
  examFamily: family,
  topic,
  difficulty: 'medium',
  duration: 'normal',
  examLikelihood: 'high',
  sourceStyle: 'old_exam',
  type: 'ORDERING',
  prompt,
  items: steps.map((label, i) => ({ id: String.fromCharCode(97 + i), label })),
  correctOrder: steps.map((_, i) => String.fromCharCode(97 + i)),
  source,
  professorStyleSimilarity: 'high',
  hints: ['Comece pela definição ou hipótese; termine na conclusão pedida.'],
  solution,
  generalRule,
});

export const treinoProvaProofQuestions: Question[] = [
  proofOrder(
    'tp-ordem-autocomp-4k',
    'auto-complementar',
    'complemento-subgrafo',
    'Ordene os passos da prova de que um grafo auto-complementar tem 4k ou 4k + 1 vértices (2023/1-Q3b).',
    [
      'G ≅ Ḡ ⇒ |E(G)| = |E(Ḡ)| (grafos isomorfos têm o mesmo número de arestas).',
      'Toda aresta de Kn está em G ou em Ḡ, nunca nos dois: |E(G)| + |E(Ḡ)| = n(n−1)/2.',
      'Logo 2|E(G)| = n(n−1)/2, ou seja, |E(G)| = n(n−1)/4.',
      '|E(G)| é inteiro ⇒ 4 divide n(n−1).',
      'n e n−1 são consecutivos: só um deles é par, e o ímpar não tem fator 2 — então o par tem que ser múltiplo de 4.',
      'Se n é o múltiplo de 4, n = 4k; se n−1 é, n = 4k + 1.',
    ],
    exam('2023-1-exam.pdf', 'Q3b (14%)'),
    'Isomorfos ⇒ mesmo nº de arestas → G + Ḡ = Kn → |E| = n(n−1)/4 → 4 | n(n−1) → o par entre n, n−1 é múltiplo de 4 → n = 4k ou 4k + 1.',
    'Regra geral: toda prova sobre auto-complementar começa por |E(G)| = |E(Ḡ)| e |E(G)| + |E(Ḡ)| = n(n−1)/2.',
  ),
  proofOrder(
    'tp-ordem-subgrafos-formula',
    'subgrafos-kn',
    'complemento-subgrafo',
    'Ordene os passos da dedução do número de subgrafos de um grafo completo Kn (2024/2-Q2).',
    [
      'Um subgrafo de Kn é determinado por um subconjunto não vazio de vértices e um subconjunto qualquer das arestas entre eles.',
      'Fixe o número i de vértices: há C(n, i) maneiras de escolhê-los.',
      'Entre i vértices de Kn existem i(i−1)/2 arestas; cada uma entra ou não: 2^(i(i−1)/2) subgrafos com esses vértices.',
      'Subgrafos com exatamente i vértices: C(n, i) · 2^(i(i−1)/2).',
      'Somando para i de 1 até n: N = Σ_{i=1}^{n} C(n, i)·2^(i(i−1)/2).',
      'Verificação num caso pequeno: K3 → 3 + 6 + 8 = 17.',
    ],
    exam('2024-2-exam.pdf', 'Q2 (20%); também 2022/2-Q5b, 2024/1-Q2, 2026/1-Q1.2'),
    'Definição de subgrafo → escolhe i vértices (C(n,i)) → escolhe arestas entre eles (2^(i(i−1)/2)) → multiplica → soma em i → confere com K3 = 17.',
    'Regra geral: "quantos objetos?" = escolha em etapas (vértices, depois arestas), multiplica as etapas, soma os casos.',
  ),
  proofOrder(
    'tp-ordem-m-max',
    'limites-grau-arestas',
    'aperto-de-maos-familias',
    'Ordene os passos da prova de que um grafo simples com n vértices e m arestas tem m ≤ n(n−1)/2 (2023/1-Q1a).',
    [
      'Grafo simples: sem laços nem arestas paralelas.',
      'Então cada vértice é adjacente a no máximo os outros n − 1 vértices: d(v) ≤ n − 1 para todo v.',
      'Propriedade de grau: Σ d(v) = 2m.',
      'Somando a desigualdade sobre os n vértices: 2m = Σ d(v) ≤ n(n − 1).',
      'Logo m ≤ n(n−1)/2, com igualdade no grafo completo Kn.',
    ],
    exam('2023-1-exam.pdf', 'Q1a (4%)'),
    'Simples ⇒ d(v) ≤ n−1 ⇒ Σd(v) ≤ n(n−1) ⇒ 2m ≤ n(n−1) ⇒ m ≤ n(n−1)/2.',
  ),
  proofOrder(
    'tp-ordem-bipartido-n2-4',
    'bipartido-tripartido',
    'passeios-caminhos-ciclos',
    'Ordene os passos da prova de que, se G é bipartido com n vértices e m arestas, então m ≤ n²/4 (2023/1-Q1b).',
    [
      'Bipartido: V = V1 ∪ V2, com |V1| = a e |V2| = n − a, e toda aresta liga V1 a V2.',
      'Sem paralelas, entre V1 e V2 cabem no máximo a·(n − a) arestas: m ≤ a(n − a).',
      'f(a) = a(n − a) = an − a² é uma parábola com máximo em a = n/2.',
      'Nesse ponto f(n/2) = n²/4.',
      'Logo m ≤ n²/4 (igualdade no bipartido completo com lados iguais).',
    ],
    exam('2023-1-exam.pdf', 'Q1b (4%)'),
    'Bipartição a e n−a → m ≤ a(n−a) → máximo em a = n/2 → n²/4.',
  ),
  proofOrder(
    'tp-ordem-diametro-algoritmo',
    'excentricidade',
    'excentricidade-raio-diametro',
    'Ordene as etapas do algoritmo para encontrar o diâmetro de um grafo simples não-direcionado (2024/1-Q4, 2022/1-Q4).',
    [
      'Entrada: G = (V, E); inicialize diam ← 0.',
      'Para cada vértice v ∈ V, rode uma busca em largura a partir de v, obtendo dist(v, u) para todo u.',
      'Se algum u não foi alcançado, G é desconexo: diâmetro indefinido (pare).',
      'ε(v) ← maior dist(v, u) encontrado nesta BFS.',
      'diam ← max(diam, ε(v)).',
      'Saída: diam após percorrer todos os vértices. Custo O(|V|·(|V| + |E|)).',
    ],
    exam('2024-1-exam.pdf', 'Q4(iv) (10%); 2022/1-Q4 (20%)'),
    'BFS de cada vértice → excentricidade = maior distância → diâmetro = maior excentricidade.',
    'Regra geral: distância em nº de arestas = BFS; excentricidade = uma BFS; diâmetro/raio/centro = BFS a partir de todos.',
  ),
  proofOrder(
    'tp-ordem-bfs-distancias',
    'bfs-distancias',
    'bfs',
    'Ordene as etapas do algoritmo que dá a distância (nº de arestas) de v a todos os outros vértices (2023/1-Q5).',
    [
      'Para todo u: dist[u] ← −1; dist[v] ← 0; fila Q ← {v}.',
      'Enquanto Q não estiver vazia: w ← remove o início de Q.',
      'Para cada vizinho u de w com dist[u] = −1: dist[u] ← dist[w] + 1 e insere u no fim de Q.',
      'Correção: a fila processa todos os vértices a distância d antes de qualquer um a distância d + 1, então o primeiro caminho que descobre u é o mais curto.',
      'Saída: dist[u] para todo u (−1 = inalcançável). Custo O(|V| + |E|) com lista de adjacência.',
    ],
    exam('2023-1-exam.pdf', 'Q5 (25%)'),
    'Inicializa −1/0/fila → desenfileira → vizinhos não vistos ganham dist + 1 e entram na fila → justifica por níveis → saída.',
  ),
  proofOrder(
    'tp-ordem-base-algoritmo',
    'fecho-base-antibase',
    'base-antibase',
    'Ordene as etapas do algoritmo do professor para encontrar uma base de cardinalidade mínima em um grafo dirigido (2022/1-Q2c, 2023/2-Q2).',
    [
      'Calcule o grau de entrada d⁻(v) de todos os vértices.',
      'Vértices com d⁻(v) = 0 entram na base: ninguém os alcança, então só eles podem se representar.',
      'Se o grafo tem ciclos, contraia cada ciclo (componente fortemente conexo) em um hipervértice; o grafo condensado é acíclico.',
      'Hipervértices com d⁻ = 0 no grafo condensado contribuem com UM vértice qualquer do ciclo para a base.',
      'Justifique: todo vértice com d⁻ > 0 é alcançado, direta ou indiretamente, a partir dos escolhidos; a base é mínima porque nenhum escolhido alcança outro.',
      'Anti-base: transponha G e aplique o mesmo algoritmo.',
    ],
    exam('2023-2-exam.pdf', 'Q2 (30%); 2022/1-Q2c, 2022/2-Q2c-d, 2024/1-Q1'),
    'd⁻ = 0 entra → ciclos viram hipervértice → hipervértice com d⁻ = 0 dá um representante → justifica alcance e minimalidade → anti-base no transposto.',
    'Regra geral: base = fontes do grafo condensado (SCCs); anti-base = sumidouros = base do transposto.',
  ),
  proofOrder(
    'tp-ordem-kosaraju-scc',
    'ciclo-dfs-scc',
    'scc-kosaraju',
    'Ordene os passos para "determinar os componentes fortemente conexos de G, justificando" (2022/1-Q5), como o professor espera na resposta.',
    [
      'Desenhe o grafo a partir da lista de sucessores dada.',
      'DFS em G anotando tempo de início e de término de cada vértice.',
      'Liste os vértices em ordem decrescente de tempo de término (pilha).',
      'Construa o transposto Gᵀ (inverta todas as arestas).',
      'DFS em Gᵀ seguindo a ordem da pilha; cada árvore obtida é um componente fortemente conexo.',
      'Justifique: dois vértices no mesmo SCC se alcançam mutuamente; a ordem por término impede que a 2ª DFS "vaze" para outro componente.',
    ],
    exam('2022-1-exam.pdf', 'Q5 (20%)'),
    'Desenha → DFS com tempos → ordem decrescente de término → transposto → DFS na ordem → cada árvore = SCC → justifica.',
  ),
  {
    id: 'tp-mc-duas-estrategias-ciclo',
    examFamily: 'ciclo-dfs-scc',
    topic: 'deteccao-ciclo',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    type: 'MULTIPLE_CHOICE',
    prompt: '"Projete DUAS soluções distintas para definir se um grafo dirigido é acíclico" (2026/1-Q4). Qual par de estratégias responde corretamente?',
    options: options('tp-mc-duas-estrategias-ciclo', '(1) DFS com estados 0/1/2: aresta para vértice em estado 1 ⇒ ciclo. (2) Kosaraju: algum componente fortemente conexo com 2+ vértices (ou laço) ⇒ ciclo.', [
      '(1) BFS a partir de cada vértice contando arestas. (2) Verificar se a matriz de adjacência é simétrica.',
      '(1) Contar se |E| ≥ |V|. (2) Verificar se a soma dos graus é par.',
      '(1) DFS com estados 0/1/2. (2) A mesma DFS começando por outro vértice.',
    ]),
    correctOptionId: 'correct',
    source: exam('P1-TGC.pdf', '2026/1-Q4 (25%); também 2024/2-Q3, 2022/2-Q3b'),
    professorStyleSimilarity: 'high',
    hints: ['Uma via percorre (DFS); a outra olha a estrutura (componentes fortemente conexos).'],
    solution:
      'Estratégia 1: DFS marcando 0 (não começou), 1 (em andamento), 2 (terminou); encontrar vizinho em estado 1 = aresta de retorno = ciclo. Estratégia 2: rodar Kosaraju; um SCC com ≥ 2 vértices contém ida e volta entre dois vértices, logo um ciclo (laço também é ciclo). Um terceiro caminho aceito: remover repetidamente vértices com grau de entrada 0 (base); se sobrar vértice, há ciclo.',
    generalRule: 'Regra geral: "duas soluções distintas" = uma por busca (DFS 0/1/2) e uma por estrutura (SCC/Kosaraju ou remoção de fontes).',
  },
  {
    id: 'tp-mc-isomorfismo-dirigido',
    examFamily: 'isomorfismo-dirigido',
    topic: 'isomorfismo',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'medium',
    sourceStyle: 'old_exam',
    type: 'MULTIPLE_CHOICE',
    prompt: '"Transponha a definição de isomorfismo de grafos não-direcionados para grafos direcionados" (2022/1-Q3). Qual definição está correta?',
    options: options('tp-mc-isomorfismo-dirigido', 'G e H direcionados são isomorfos se existe uma bijeção f: V(G) → V(H) tal que (u, v) ∈ E(G) ⟺ (f(u), f(v)) ∈ E(H) — os pares ORDENADOS (sentido das setas) são preservados.', [
      'G e H são isomorfos se têm o mesmo número de vértices, de arestas e a mesma sequência de graus de entrada e de saída.',
      'G e H são isomorfos se existe uma bijeção f com {u, v} ∈ E(G) ⟺ {f(u), f(v)} ∈ E(H), ignorando o sentido das setas.',
      'G e H são isomorfos se os grafos não-direcionados associados forem isomorfos.',
    ]),
    correctOptionId: 'correct',
    source: exam('2022-1-exam.pdf', 'Q3 (30%)'),
    professorStyleSimilarity: 'high',
    hints: ['O que muda entre {u, v} e (u, v)?'],
    solution:
      'A única mudança é trocar pares não-ordenados por pares ordenados: a bijeção f entre vértices deve levar cada seta (u, v) numa seta (f(u), f(v)) com o MESMO sentido. Condições necessárias passam a incluir a sequência de graus de entrada E de saída, mas condições necessárias não são a definição.',
  },
  {
    id: 'tp-mc-pombos-prova-completa',
    examFamily: 'pombos',
    topic: 'aperto-de-maos-familias',
    difficulty: 'medium',
    duration: 'quick',
    examLikelihood: 'high',
    sourceStyle: 'old_exam',
    type: 'MULTIPLE_CHOICE',
    prompt: '"Prove que todo grafo simples com n ≥ 2 vértices tem dois vértices de mesmo grau." Qual resposta o professor aceita como prova completa?',
    options: options('tp-mc-pombos-prova-completa', 'Grau varia em {0, …, n−1}; grau n−1 (ligado a todos) impede grau 0, então há no máximo n−1 valores para n vértices; não tem como todos terem graus diferentes, logo dois vértices têm o mesmo grau.', [
      'Como a soma dos graus é par, dois vértices precisam ter o mesmo grau.',
      'Há n vértices e n valores possíveis de grau (0 a n−1), logo dois vértices coincidem.',
      'Todo grafo simples tem pelo menos um vértice pendente e um isolado, que têm graus 1 e 0.',
    ]),
    correctOptionId: 'correct',
    source: exam('2024-2-exam.pdf', 'Q1 (20%); 2024/1-Q3, 2025/1-Q4, 2026/1-Q1'),
    professorStyleSimilarity: 'high',
    hints: ['A resposta "n valores para n vértices" não fecha — falta o passo que tira um valor.'],
    solution:
      'A prova precisa dos três movimentos: (1) intervalo [0, n−1]; (2) 0 e n−1 não coexistem (quem tem grau n−1 é vizinho de todos); (3) sobram n−1 "casas" para n "pombos". A alternativa "n valores para n vértices" é o erro clássico: com n casas para n pombos NÃO há garantia de repetição. O nome "princípio da casa dos pombos" não aparece no material do professor (slides, lista, aulão, resoluções): escreva o argumento em palavras, como na resolução de 2024/1 — "não tem como todos os vértices terem graus diferentes, logo sempre sobra um grau repetido".',
  },
];
