import type {
  CodeDrill,
  ContentModuleId,
  DomainId,
  ExamBlueprint,
  ExamQuestion,
  FunctionVariant,
  QuestionFormat,
  StructureVisual,
} from '../types/content';
import { codeDrillCatalog, getDrillsByGroup } from './codeDrills';
import { prova1Blueprint } from './prova1Blueprint';
import type { Rng } from './simuladoBuilder';
import { seededRng } from './simuladoBuilder';

/**
 * Gerador dinamico do simulado da Prova 1: 3 questoes, cada uma sorteada de
 * um banco proprio (posicao), imitando a variacao real da prova:
 *
 * 1) Complexidade de codigo OU somatorio por inducao;
 * 2) Ordenacao, com moldura variavel (livre, entre 3 opcoes, ou especifica) —
 *    o corretor aceita qualquer algoritmo que bata com uma das variantes
 *    permitidas naquela instancia, sem exigir escolha previa;
 * 3) Lista flexivel pra ordenar/inserir ordenado OU pilha/fila mais elaborada
 *    — questoes REAIS (fotografadas) entram com peso dobrado em relacao a
 *    uma questao inventada equivalente, priorizando o que ja caiu de fato.
 */

// ---------------------------------------------------------------------
// Utilitarios de conversao (CodeDrill / grupos de CodeDrill -> ExamQuestion)
// ---------------------------------------------------------------------

function getDrillById(id: string): CodeDrill {
  const drill = codeDrillCatalog.find((item) => item.id === id);
  if (!drill) {
    throw new Error(`prova1SimuladoBuilder: drill nao encontrado: ${id}`);
  }
  return drill;
}

function drillToVariant(id: string, label: string): FunctionVariant {
  const drill = getDrillById(id);
  if (drill.step.kind !== 'function') {
    throw new Error(`prova1SimuladoBuilder: drill ${id} nao e um passo 'function'`);
  }
  return {
    id: drill.id,
    label,
    signature: drill.step.signature,
    solution: drill.step.solution,
    requiredFragments: drill.step.requiredFragments,
    forbiddenFragments: drill.step.forbiddenFragments,
    lineExplanations: drill.step.lineExplanations,
  };
}

/** Junta os passos de todos os CodeDrill de um repetitionGroup numa unica ExamQuestion. */
function bundleDrillGroup(
  groupId: string,
  id: string,
  domainId: DomainId,
  moduleId: ContentModuleId | undefined,
  format: QuestionFormat,
  title: string,
  stem: string,
  scaffold: string,
  visual: StructureVisual,
): ExamQuestion {
  const drills = getDrillsByGroup(groupId);
  if (drills.length === 0) {
    throw new Error(`prova1SimuladoBuilder: repetitionGroup vazio: ${groupId}`);
  }
  return {
    id,
    number: 1,
    domainId,
    moduleId,
    questionType: 'codigo',
    format,
    title,
    stem,
    scaffold,
    visual,
    steps: drills.map((drill) => drill.step),
  };
}

function visual(kind: StructureVisual['kind'], title: string, caption: string, labels: string[]): StructureVisual {
  return { kind, title, caption, labels };
}

// ---------------------------------------------------------------------
// Candidato: sabe virar ExamQuestion recebendo o numero da posicao.
// ---------------------------------------------------------------------

type Candidate = {
  id: string;
  build: (number: number) => ExamQuestion;
};

function fromBlueprintQuestion(index: number): Candidate {
  const question = prova1Blueprint.questions[index];
  return {
    id: question.id,
    build: (number) => ({ ...question, number }),
  };
}

function fromBundle(
  groupId: string,
  id: string,
  domainId: DomainId,
  moduleId: ContentModuleId | undefined,
  format: QuestionFormat,
  title: string,
  stem: string,
  scaffold: string,
  bundleVisual: StructureVisual,
): Candidate {
  return {
    id,
    build: (number) => ({
      ...bundleDrillGroup(groupId, id, domainId, moduleId, format, title, stem, scaffold, bundleVisual),
      number,
    }),
  };
}

function fromSingleDrill(drillId: string): Candidate {
  const drill = getDrillById(drillId);
  return {
    id: drill.id,
    build: (number) => ({
      id: drill.id,
      number,
      domainId: drill.domainId,
      moduleId: drill.moduleId ?? drill.domainId,
      questionType: 'codigo',
      format: drill.format,
      title: drill.title,
      stem: drill.stem,
      scaffold: drill.scaffold,
      visual: drill.visual,
      steps: [drill.step],
    }),
  };
}

// ---------------------------------------------------------------------
// Posicao 2: ordenacao com moldura variavel (Opcao A — corretor tolerante)
// ---------------------------------------------------------------------

const TODOS_ALGORITMOS: FunctionVariant[] = [
  drillToVariant('code-prova1-ordenacao-mergesort', 'Merge Sort'),
  drillToVariant('code-prova1-ordenacao-shellsort', 'Shell Sort'),
  drillToVariant('code-prova1-ordenacao-countingsort', 'Counting Sort'),
  drillToVariant('code-prova1-ordenacao-bucketsort', 'Bucket Sort'),
  drillToVariant('code-prova1-ordenacao-radixsort', 'Radix Sort'),
  drillToVariant('code-prova1-ordenacao-bolha-completo', 'Bubble Sort'),
  drillToVariant('code-ordenacao-insertion-sort', 'Insertion Sort'),
  drillToVariant('code-ordenacao-selection-sort', 'Selection Sort'),
];

function variantsByLabel(labels: string[]): FunctionVariant[] {
  return labels.map((label) => {
    const variant = TODOS_ALGORITMOS.find((item) => item.label === label);
    if (!variant) {
      throw new Error(`prova1SimuladoBuilder: variante nao encontrada: ${label}`);
    }
    return variant;
  });
}

const ORDENACAO_VETOR = '8, 3, 15, 1, 9, 4, 12, 6';

const ORDENACAO_SCAFFOLD = `class Ordenacao {
  int[] array; // ja recebe: { 8, 3, 15, 1, 9, 4, 12, 6 }

  void ordenar() {
    // implementar
  }
}`;

function ordenacaoQuestion(
  id: string,
  stem: string,
  variants: FunctionVariant[],
  visualLabels: string[],
): Candidate {
  return {
    id,
    build: (number) => ({
      id,
      number,
      domainId: 'ordenacao',
      format: 'algorithm-adaptation',
      title: 'Ordenacao de um vetor',
      stem,
      scaffold: ORDENACAO_SCAFFOLD,
      visual: visual('array', 'Algoritmos aceitos', 'O corretor reconhece qualquer um dos algoritmos permitidos, sem precisar avisar qual foi escolhido.', visualLabels),
      steps: [
        {
          id: `${id}-step`,
          kind: 'function-choice',
          skillId: 'program',
          prompt: `Ordene o vetor { ${ORDENACAO_VETOR} } em ordem crescente, implementando void ordenar().`,
          variants,
          explanation: 'Qualquer implementacao correta de um dos algoritmos aceitos vale.',
        },
      ],
    }),
  };
}

const ORDENACAO_LIVRE = ordenacaoQuestion(
  'prova1-simulado-ordenacao-livre',
  'Ordene o vetor abaixo em ordem crescente. Voce pode escolher LIVREMENTE qual algoritmo de ordenacao usar.',
  TODOS_ALGORITMOS,
  TODOS_ALGORITMOS.map((variant) => variant.label),
);

const ORDENACAO_TRES_OPCOES = ordenacaoQuestion(
  'prova1-simulado-ordenacao-tres-opcoes',
  'Ordene o vetor abaixo em ordem crescente, escolhendo UM dos tres algoritmos a seguir: Bubble Sort, Insertion Sort ou Merge Sort.',
  variantsByLabel(['Bubble Sort', 'Insertion Sort', 'Merge Sort']),
  ['Bubble Sort', 'Insertion Sort', 'Merge Sort'],
);

const ORDENACAO_ESPECIFICA_RADIX = ordenacaoQuestion(
  'prova1-simulado-ordenacao-especifica-radix',
  'Ordene o vetor abaixo em ordem crescente, usando OBRIGATORIAMENTE o Radix Sort.',
  variantsByLabel(['Radix Sort']),
  ['Radix Sort (obrigatorio)'],
);

const ORDENACAO_ESPECIFICA_SELECAO = ordenacaoQuestion(
  'prova1-simulado-ordenacao-especifica-selecao',
  'Ordene o vetor abaixo em ordem crescente, usando OBRIGATORIAMENTE o Selection Sort.',
  variantsByLabel(['Selection Sort']),
  ['Selection Sort (obrigatorio)'],
);

// ---------------------------------------------------------------------
// Bancos por posicao
// ---------------------------------------------------------------------

const POSITION_1_POOL: Candidate[] = [
  fromBlueprintQuestion(0), // Q1 real: complexidade de 3 blocos de codigo
  fromBlueprintQuestion(1), // Q2 real: somatorio por perturbacao + inducao
  fromBundle(
    'reav-q1-calcula',
    'prova1-simulado-reav-calcula',
    'somatorio',
    'complexidade',
    'summation-from-code',
    'Complexidade e inducao de um metodo real',
    'Questao real da Reavaliacao (materia de Prova 1). Conte as multiplicacoes, feche a formula e prove por inducao.',
    `public void calcula(int n) {
  for (int i = 1; i <= n; i++) {
    a *= 2;
    for (int j = 1; j <= i; j++) {
      b *= 2;
      c *= 2;
    }
  }
}`,
    visual('array', 'Complexidade + inducao', 'Um laco aninhado onde o interno depende do externo.', ['Theta(n^2)', 'forma fechada', 'inducao']),
  ),
  fromSingleDrill('code-prova1-inducao-soma-natural'), // inducao: soma dos n primeiros naturais
  fromSingleDrill('code-prova1-inducao-soma-geometrica'), // inducao: soma de potencias de 2
  fromSingleDrill('code-prova1-complexidade-laco-aninhado'), // complexidade: laco aninhado dependente
];

const POSITION_2_POOL: Candidate[] = [ORDENACAO_LIVRE, ORDENACAO_TRES_OPCOES, ORDENACAO_ESPECIFICA_RADIX, ORDENACAO_ESPECIFICA_SELECAO];

const POSITION_3_POOL: Candidate[] = [
  fromBlueprintQuestion(2), // Q3 real: fila circular, desfazer + mostrarInverso
  fromBlueprintQuestion(2),
  fromBundle(
    'reav-q5-prove-refute',
    'prova1-simulado-reav-pilha-fila',
    'vetores',
    'pilha',
    'prove-or-refute',
    'Pilha e fila: prove ou refute',
    'Duas afirmacoes reais da Reavaliacao sobre pilha e fila. Prove ou refute cada uma.',
    `// FIFO = First In, First Out (fila)
// LIFO = Last In, First Out (pilha)
// parenteses balanceados: empilha abertos, desempilha nos fechados`,
    visual('stack', 'Pilha e fila na pratica', 'FIFO -> Fila, LIFO -> Pilha; parenteses balanceados usa pilha.', ['FIFO/LIFO', 'parenteses balanceados']),
  ),
  fromBundle(
    'reav-q5-prove-refute',
    'prova1-simulado-reav-pilha-fila-2',
    'vetores',
    'pilha',
    'prove-or-refute',
    'Pilha e fila: prove ou refute',
    'Duas afirmacoes reais da Reavaliacao sobre pilha e fila. Prove ou refute cada uma.',
    `// FIFO = First In, First Out (fila)
// LIFO = Last In, First Out (pilha)
// parenteses balanceados: empilha abertos, desempilha nos fechados`,
    visual('stack', 'Pilha e fila na pratica', 'FIFO -> Fila, LIFO -> Pilha; parenteses balanceados usa pilha.', ['FIFO/LIFO', 'parenteses balanceados']),
  ),
  fromSingleDrill('code-prova1-lista-flexivel-inserir-ordenado'),
  fromSingleDrill('code-prova1-pilha-avaliar-posfixa'), // pilha complexa (inventada, classica): avaliar expressao pos-fixa
];

const POSITION_POOLS: Candidate[][] = [POSITION_1_POOL, POSITION_2_POOL, POSITION_3_POOL];

// ---------------------------------------------------------------------
// Montagem
// ---------------------------------------------------------------------

function pickCandidate(pool: Candidate[], rng: Rng, avoidId?: string): Candidate {
  const filtered = avoidId && pool.length > 1 ? pool.filter((candidate) => candidate.id !== avoidId) : pool;
  const index = Math.floor(rng() * filtered.length) % filtered.length;
  return filtered[index] ?? pool[0];
}

export type BuildProva1SimuladoOptions = {
  rng?: Rng;
  /** Simulado anterior; evita repetir a mesma questao na mesma posicao. */
  previous?: ExamBlueprint;
};

/** Monta um simulado com 3 questoes (complexidade/inducao, ordenacao, lista/pilha/fila). */
export function buildProva1Simulado(options: BuildProva1SimuladoOptions = {}): ExamBlueprint {
  const rng = options.rng ?? Math.random;
  const previousQuestions = options.previous?.questions ?? [];

  const questions: ExamQuestion[] = POSITION_POOLS.map((pool, index) => {
    const avoidId = previousQuestions[index]?.id;
    const candidate = pickCandidate(pool, rng, avoidId);
    return candidate.build(index + 1);
  });

  const signature = questions.map((question) => question.id).join('_');

  return {
    id: `prova1-simulado-${signature}`,
    title: 'Simulado de Prova 1 AEDS II',
    questions,
  };
}

export { seededRng };
