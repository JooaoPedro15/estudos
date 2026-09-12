import type { Source } from './types';

export interface FlashFact {
  id: string;
  text: string;
  tier: 'core' | 'extra';
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
];

export function flashFactsForMinutes(minutes: number): FlashFact[] {
  if (minutes >= 15) return flashFacts;
  return flashFacts.filter((f) => f.tier === 'core');
}
