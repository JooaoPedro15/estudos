import type { ExamId, Source } from './types';

export interface FlashFact {
  id: string;
  text: string;
  tier: 'core' | 'extra';
  /** Prova a que o fato pertence; ausente = P1. */
  exam?: ExamId;
  source?: Source;
}

// Curadoria compacta para o modo "Revisão Final" (seção 28) — convenções do
// professor, fórmulas fechadas e armadilhas mais recorrentes nas provas
// antigas. "core" aparece em qualquer duração; "extra" só a partir de 15min.

export const flashFacts: FlashFact[] = [
  {
    id: 'ff-01',
    text: 'Teorema do aperto de mãos: Σd(v) = 2|E| — sempre par. Nº de vértices de grau ímpar é sempre par.',
    tier: 'core',
    source: { type: 'professor_slide', file: '01-graphs-concepts.pdf' },
  },
  {
    id: 'ff-02',
    text: 'Possibilidade de grafo com n vértices e k componentes: m_min = n−k, m_max = (n−k)(n−k+1)/2.',
    tier: 'core',
    source: { type: 'professor_support_material', file: 'Resumo Prova 1 Grafos.pdf' },
  },
  {
    id: 'ff-03',
    text: 'Todo grafo simples com n≥2 vértices tem 2 vértices de mesmo grau (grau 0 e n−1 não coexistem, sobram no máx. n−1 valores para n vértices).',
    tier: 'core',
    source: { type: 'old_exam', note: 'Recorrente em 2024/1, 2024/2, 2026/1' },
  },
  {
    id: 'ff-04',
    text: 'Auto-complementar: |E(G)| = n(n−1)/4, exige n≡0 ou 1 (mod 4). Sempre deduza a conta, não escreva só a fórmula.',
    tier: 'core',
    source: { type: 'old_exam', note: '2022/2, 2023/1, 2025/1' },
  },
  {
    id: 'ff-05',
    text: 'Isomorfismo: mesmo |V|, |E| e sequência de graus são NECESSÁRIOS, nunca SUFICIENTES — sempre exiba a bijeção e confira aresta a aresta.',
    tier: 'core',
    source: { type: 'professor_slide', file: '05-graphs-isomorphism-and-concepts.pdf' },
  },
  {
    id: 'ff-06',
    text: 'DFS: use os estados do professor — 0 (não começou) / 1 (em progresso) / 2 (terminou). Aresta para vértice em estado 1 = aresta de RETORNO = HÁ CICLO.',
    tier: 'core',
    source: { type: 'professor_board' },
  },
  {
    id: 'ff-07',
    text: 'Fecho transitivo: direto = Γ⁺(v) via DFS/BFS a partir de v; inverso = Γ⁺(v) no grafo TRANSPOSTO. Não é preciso montar a matriz de Warshall inteira.',
    tier: 'core',
    source: { type: 'professor_support_material', file: 'Resumo Prova 1 Grafos.pdf' },
  },
  {
    id: 'ff-08',
    text: 'Base/anti-base: calcule grau de entrada; se houver ciclo, contraia em SCC primeiro. Base = SCCs-fonte (grau de entrada 0 na condensação). Anti-base = SCCs-sumidouro (use o transposto).',
    tier: 'core',
    source: { type: 'professor_support_material', file: 'Flash Cards Grafos-1.pdf' },
  },
  {
    id: 'ff-09',
    text: 'Kosaraju: DFS em G (tempos de término) → transpõe → DFS no transposto do MAIOR para o MENOR tempo de término. Essa é a ordem do professor (Cormen), não a de Sedgewick.',
    tier: 'extra',
    source: { type: 'professor_support_material', file: 'Resumo Prova 1 Grafos.pdf' },
  },
  {
    id: 'ff-10',
    text: 'De Morgan (lógica e conjuntos): ¬(p∧q)≡¬p∨¬q, ¬(p∨q)≡¬p∧¬q; (A∪B)ᶜ=Aᶜ∩Bᶜ, (A∩B)ᶜ=Aᶜ∪Bᶜ. Negação de quantificador: ¬∀xP(x)≡∃x¬P(x); ¬∃xP(x)≡∀x¬P(x).',
    tier: 'extra',
    source: { type: 'professor_slide', file: '06-graphs-propositional-logic.pdf' },
  },
  {
    id: 'ff-11',
    text: 'Matriz de incidência (dirigido): +1 na ORIGEM, −1 no DESTINO, 0 nas demais linhas daquela coluna.',
    tier: 'extra',
    source: { type: 'professor_slide', file: '04-graphs-data-structures.pdf' },
  },
  {
    id: 'ff-12',
    text: 'Nº de subgrafos não-vazios de Kn: Σ_{i=1}^{n} C(n,i)·2^(i(i−1)/2).',
    tier: 'extra',
    source: { type: 'old_exam', note: '2022/2, 2024/1, 2024/2' },
  },
  {
    id: 'ff-13',
    text: 'Excentricidade ε(v) = maior distância de v aos demais (via BFS). Raio = menor ε. Diâmetro = maior ε. Centro = vértices com ε = raio.',
    tier: 'extra',
    source: { type: 'professor_support_material', file: 'Resumo Prova 1 Grafos.pdf' },
  },
  {
    id: 'ff-14',
    text: 'Toda questão de "prove que..." ou "projete um algoritmo..." exige justificativa/dedução por escrito — respostas só com a fórmula final perdem nota (visto em correções reais).',
    tier: 'core',
    source: { type: 'old_exam', note: 'Instrução explícita em 2023/1 e 2026/1' },
  },
  {
    id: 'ff-15',
    text: 'p→q só é FALSA no caso p=V,q=F — se p é falsa, a implicação já é verdadeira (vacuamente). Contrapositiva ¬q→¬p é a única equivalente logicamente ao original (recíproca e inversa não são).',
    tier: 'extra',
    source: { type: 'professor_slide', file: '06-graphs-propositional-logic.pdf' },
  },
  {
    id: 'ff-16',
    text: 'Restrição de domínio dentro de quantificador: use → com ∀ ("∀x, se x é par então...") e ∧ com ∃ ("∃x tal que x é par e..."). Trocar um pelo outro muda o significado.',
    tier: 'extra',
    source: { type: 'professor_slide', file: '07-graphs-predicate-logic.pdf' },
  },

  // ------------------------------------------------------------------ P2
  {
    id: 'p2-ff-01',
    exam: 'P2',
    text: 'Euleriano: toda ARESTA uma vez. Hamiltoniano: todo VÉRTICE uma vez. Euler é "easy to decide/compute"; Hamilton é "not easy".',
    tier: 'core',
    source: { type: 'professor_slide', file: '08-graphs-traversing.pdf', page: 106 },
  },
  {
    id: 'p2-ff-02',
    exam: 'P2',
    text: 'Caminho euleriano ⇒ no máximo 2 vértices de grau ímpar (slide). Circuito: todos pares; caminho aberto: exatamente 2 ímpares, começa num e termina no outro.',
    tier: 'core',
    source: { type: 'professor_slide', file: '08-graphs-traversing.pdf', page: 130 },
  },
  {
    id: 'p2-ff-03',
    exam: 'P2',
    text: 'Fleury: começa em vértice ímpar; com mais de uma opção, NÃO atravessa ponte; apaga a aresta usada; para quando E = ∅ (não quando volta ao início).',
    tier: 'core',
    source: { type: 'professor_slide', file: '08-graphs-traversing.pdf', page: 137 },
  },
  {
    id: 'p2-ff-04',
    exam: 'P2',
    text: 'Árvore = conexo + sem ciclo: n − 1 arestas, caminho único entre pares, ≥ 2 folhas. Floresta com k árvores: n − k arestas. Conexo com n − 1 arestas ⇒ árvore.',
    tier: 'core',
    source: { type: 'professor_slide', file: '11-graphs-trees-spanning-trees.pdf', page: 9 },
  },
  {
    id: 'p2-ff-05',
    exam: 'P2',
    text: 'Posto r = n − k (ramos). Nulidade = cordas = e − n + k. Atenção: o slide imprime "e − n − k", mas o próprio exemplo só fecha com + k.',
    tier: 'extra',
    source: { type: 'professor_slide', file: '11-graphs-trees-spanning-trees.pdf', page: 35 },
  },
  {
    id: 'p2-ff-06',
    exam: 'P2',
    text: 'Propriedade do corte: a mais barata de cut(S) está em TODA AGM. Propriedade do ciclo: a mais cara de um ciclo não está em NENHUMA AGM.',
    tier: 'core',
    source: { type: 'professor_slide', file: '11-graphs-trees-spanning-trees.pdf', page: 70 },
  },
  {
    id: 'p2-ff-07',
    exam: 'P2',
    text: 'Kruskal: crescente, descarta ciclo. Prim: cresce de um vértice pela aresta mais barata de cut(S). Reverse-Delete: decrescente, apaga se continuar conexo. Os três dão AGM.',
    tier: 'core',
    source: { type: 'professor_slide', file: '11-graphs-trees-spanning-trees.pdf', page: 44 },
  },
  {
    id: 'p2-ff-08',
    exam: 'P2',
    text: 'Modelar AGM (P2 2024/1-Q1): grafo NÃO direcionado, vértice = cidade, aresta = rodovia possível, peso = custo. Responda as arestas escolhidas E o custo total.',
    tier: 'core',
    source: { type: 'old_exam', file: 'P2 - 1º 2024 - parte 1.jpeg' },
  },
  {
    id: 'p2-ff-09',
    exam: 'P2',
    text: 'Dijkstra: só pesos ≥ 0. Entra em S o v ∉ S de menor d; só os vizinhos de v mudam. n − 1 iterações; ExtractMin n − 1 vezes, ChangeKey m vezes. Guarde o predecessor para dar o caminho.',
    tier: 'core',
    source: { type: 'professor_slide', file: '10-graphs-shortest-path.pdf', page: 33 },
  },
  {
    id: 'p2-ff-10',
    exam: 'P2',
    text: 'Peso negativo ⇒ Bellman-Ford. d[i, v] = menor caminho com até i arestas; linha i usa só a linha i − 1; i = 1..n − 1; O(mn). Somar constante aos pesos NÃO resolve.',
    tier: 'core',
    source: { type: 'professor_slide', file: '10-graphs-shortest-path.pdf', page: 68 },
  },
  {
    id: 'p2-ff-11',
    exam: 'P2',
    text: 'Ciclo negativo alcançável ⇒ não existe menor caminho. Sem ele, existe um menor caminho simples (≤ n − 1 arestas).',
    tier: 'extra',
    source: { type: 'professor_slide', file: '10-graphs-shortest-path.pdf', page: 62 },
  },
  {
    id: 'p2-ff-12',
    exam: 'P2',
    text: 'Floyd-Warshall (livro, sem slide): todos os pares; D(0) = pesos; d(k)ij = min(d(k−1)ij, d(k−1)ik + d(k−1)kj); k é o laço de fora; Θ(n³).',
    tier: 'extra',
    source: { type: 'book', author: 'Cormen et al.', chapter: '25.2' },
  },
  {
    id: 'p2-ff-13',
    exam: 'P2',
    text: 'κ(G) ≤ λ(G) ≤ δ(G). Separável: κ = 1; o vértice que desconecta é ponto de articulação.',
    tier: 'extra',
    source: { type: 'professor_slide', file: '09-graphs-connectivity.pdf', page: 88 },
  },
];

export function flashFactsForMinutes(minutes: number, exam: ExamId = 'P1'): FlashFact[] {
  const ofExam = flashFacts.filter((f) => (f.exam ?? 'P1') === exam);
  if (minutes >= 15) return ofExam;
  return ofExam.filter((f) => f.tier === 'core');
}
