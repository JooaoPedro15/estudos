import type { Topic } from '../types';

// Módulo novo (Revisão 2 do escopo): o cronograma oficial 2026/2 mostra que
// teoria de conjuntos e lógica são dadas nos dias 02, 03 e 09/09 — imediatamente
// antes da aula de revisão (10/09) e da Prova 1 (14/09), sem nenhum outro
// assunto entre elas. Ver docs/p1-scope.md "O que mudou". Como não existe
// prova antiga que teste este conteúdo NESSA posição do curso (é um
// reordenamento novo), a chance de prova é 'medium' com evidência baseada no
// cronograma, não em estatística de provas — nunca infira "cai muito" sem
// amostra real.

export const logicaConjuntosTopics: Topic[] = [
  {
    id: 'teoria-de-conjuntos',
    moduleId: 'logica-conjuntos',
    order: 1,
    slug: 'teoria-de-conjuntos',
    title: 'Teoria de conjuntos e funções',
    examLikelihood: 'medium',
    examEvidence:
      'Dada em 02/09, imediatamente antes da revisão (10/09) e da Prova 1 (14/09) pelo cronograma oficial 2026/2 — sem assunto intercalado. Não há prova antiga que teste isso nesta posição do curso (o reordenamento é novo neste semestre).',
    whatYouNeedToKnow:
      'Conjunto: coleção de elementos, notação A={...}, pertinência x∈A, subconjunto A⊆B. Conjunto das partes P(A) tem 2^|A| elementos. Operações: união ∪, interseção ∩, diferença A\\B, complemento Aᶜ (relativo a um universo U). Leis de De Morgan para conjuntos. Produto cartesiano A×B. Função f:A→B — classificação em injetora, sobrejetora, bijetora — e composição.',
    understand: [
      'Não confunda ∈ (elemento pertence ao conjunto) com ⊆ (um conjunto é subconjunto de outro). Ex.: 2∈{1,2,3} mas {2}⊆{1,2,3}.',
      'Conjunto das partes P(A): todos os subconjuntos possíveis de A, incluindo ∅ e o próprio A. |P(A)| = 2^|A|.',
      'Leis de De Morgan (conjuntos): (A∪B)ᶜ = Aᶜ∩Bᶜ e (A∩B)ᶜ = Aᶜ∪Bᶜ — "o complemento da união é a interseção dos complementos", e vice-versa.',
      'Produto cartesiano A×B = conjunto de pares ordenados (a,b) com a∈A, b∈B. |A×B| = |A|·|B|. É a base da definição formal de grafo dirigido: E ⊆ V×V.',
      'Função f:A→B é injetora se elementos distintos de A sempre têm imagens distintas em B; sobrejetora se todo elemento de B é imagem de algum elemento de A; bijetora se as duas coisas ao mesmo tempo. Só função bijetora tem inversa f⁻¹.',
      'Composição (g∘f)(x) = g(f(x)) — aplica f primeiro, depois g, apesar da ordem de escrita.',
    ],
    commonPitfall:
      'Trocar a direção das leis de De Morgan (complemento da UNIÃO vira INTERSEÇÃO dos complementos, não união) — e confundir "função injetora" (não repete imagem) com "sobrejetora" (cobre todo o contradomínio); são propriedades independentes.',
    sources: [{ type: 'professor_slide', file: '03-graphs-set-theory.pdf' }],
  },
  {
    id: 'logica-proposicional',
    moduleId: 'logica-conjuntos',
    order: 2,
    slug: 'logica-proposicional',
    title: 'Lógica proposicional',
    examLikelihood: 'medium',
    examEvidence:
      'Dada em 03/09 (com "Introdução à Lógica" em 31/08 como motivação), logo antes da revisão e da Prova 1 pelo cronograma 2026/2. Mesma ressalva: sem amostra de provas antigas nesta posição do curso.',
    whatYouNeedToKnow:
      'Proposição: sentença declarativa com valor-verdade (V ou F) bem definido — não pode ser pergunta, comando, ou opinião sem critério objetivo. Conectivos: ¬ (negação), ∧ (e), ∨ (ou), ⊕ (ou exclusivo), → (implicação), ↔ (bicondicional) — cada um com sua tabela-verdade. Dado p→q: recíproca (q→p), inversa (¬p→¬q), contrapositiva (¬q→¬p, a única logicamente equivalente ao original). Tautologia (sempre V), contradição (sempre F), contingência (depende).',
    understand: [
      'Para ser proposição, a sentença precisa ter valor V/F objetivo. "Machado de Assis escreveu Dom Casmurro" é proposição (V). "Está frio hoje" não é (subjetivo, sem critério fixo).',
      'Tabela-verdade: ¬p inverte o valor. p∧q é V só se AMBOS são V. p∨q é V se PELO MENOS UM é V. p⊕q é V se EXATAMENTE UM é V (ou exclusivo — diferente de ∨).',
      'p→q (implicação) só é FALSA no caso p=V e q=F. Em todos os outros casos (incluindo p=F) é VERDADEIRA — "vacuamente verdadeira" quando a premissa é falsa.',
      'Dado p→q: recíproca troca a ordem (q→p); inversa nega os dois termos mantendo a ordem (¬p→¬q); contrapositiva troca E nega (¬q→¬p) — só a contrapositiva tem exatamente a mesma tabela-verdade do original.',
      'Precedência de operadores (do mais forte ao mais fraco): ¬, depois ∧, depois ∨, depois →, depois ↔. Use parênteses quando a ordem não for óbvia.',
      'Equivalências úteis para simplificar expressões: De Morgan (¬(p∧q)≡¬p∨¬q; ¬(p∨q)≡¬p∧¬q), dupla negação (¬¬p≡p), distributiva, comutativa, associativa.',
    ],
    commonPitfall:
      'Achar que p→q é falsa sempre que p é falsa — na verdade só é falsa no único caso p=V e q=F. "Se 2+2=5, então a Terra é plana" é uma implicação VERDADEIRA (premissa falsa).',
    sources: [
      { type: 'professor_slide', file: '06-graphs-propositional-logic.pdf' },
      { type: 'professor_slide', file: '02-graphs-logic.pdf', note: 'Introdução/motivação, aula de 31/08' },
    ],
  },
  {
    id: 'logica-de-predicados',
    moduleId: 'logica-conjuntos',
    order: 3,
    slug: 'logica-de-predicados',
    title: 'Lógica de predicados',
    examLikelihood: 'medium',
    examEvidence: 'Dada em 09/09, um dia antes da aula de revisão (10/09) e cinco dias antes da Prova 1 (14/09) pelo cronograma 2026/2 — é literalmente o último assunto novo antes da prova.',
    whatYouNeedToKnow:
      'Predicado P(x): não é proposição sozinho (o valor-verdade depende de x). Vira proposição ao quantificar: ∀x P(x) ("para todo x, P(x)") ou ∃x P(x) ("existe x tal que P(x)"). Negação de quantificadores: ¬∀xP(x) ≡ ∃x¬P(x); ¬∃xP(x) ≡ ∀x¬P(x). Variável ligada (sob escopo de quantificador) vs livre.',
    understand: [
      'P(x) por si só não tem valor-verdade fixo — "x é par" depende de qual x. Só vira proposição com quantificador ou substituição concreta (ex.: P(4) = "4 é par" = V).',
      '∀xP(x) é verdadeiro se P(x) vale para TODO elemento do domínio — basta UM contraexemplo para provar que é falso.',
      '∃xP(x) é verdadeiro se P(x) vale para PELO MENOS UM elemento do domínio — só é falso se NENHUM elemento satisfizer.',
      'Negação de quantificador (padrão tipo De Morgan): "não é verdade que todo x tem a propriedade" equivale a "existe x sem a propriedade" — ¬∀xP(x) ≡ ∃x¬P(x). Simetricamente, ¬∃xP(x) ≡ ∀x¬P(x).',
      'Ao combinar quantificador com uma restrição de domínio, o conectivo importa: use → com ∀ ("∀x, se x é par então x é...") e use ∧ com ∃ ("∃x tal que x é par E x é..."). Trocar → por ∧ dentro de um ∀ muda completamente o significado.',
      'Variável ligada: está sob o escopo de um quantificador (∀x... ou ∃x...). Variável livre: não está ligada a nenhum quantificador — a "proposição" ainda depende dela.',
    ],
    commonPitfall:
      'Usar ∧ em vez de → dentro de um ∀ ao restringir domínio: "∀x (x é par ∧ x é primo)" afirma que TODO número é par E primo (quase sempre falso) — o correto é "∀x (x é par → x é primo)" (só faz uma afirmação sobre os pares) ou já restringir o domínio de x.',
    sources: [{ type: 'professor_slide', file: '07-graphs-predicate-logic.pdf' }],
  },
];
