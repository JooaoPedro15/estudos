import type {
  CodeDrill,
  DomainId,
  ExamBlueprint,
  ExamQuestion,
  QuestionFormat,
  SkillId,
} from '../types/content';
import { codeDrillCatalog } from './codeDrills';
import { conceptualDrawingCatalog, type ConceptualDrawingQuestion } from './lista2Questions';
import { reavaliacaoBlueprint } from './reavaliacaoBlueprint';

/**
 * Gerador de simulados que reproduz o MODELO da Reavaliacao 1 (REAV1).
 *
 * A prova tem 6 posicoes fixas; cada posicao cobra sempre o mesmo tipo de
 * conteudo e raciocinio. O simulado nao sorteia 6 questoes aleatorias: para
 * cada posicao existe um banco proprio (pool) e sorteamos UMA questao
 * compativel daquele banco. Os bancos sao disjuntos, entao nunca ha repeticao
 * interna nem questao em posicao incompativel.
 *
 * Bancos reutilizados (sem alterar os originais):
 * - Treino de Codigo   -> codeDrillCatalog (somatorio, ordenacao, doidona);
 * - Conceituais/Desenho -> conceptualDrawingCatalog (Lista 2);
 * - Simulado de referencia -> reavaliacaoBlueprint (1 questao guia por posicao).
 */

export type Rng = () => number;

export type SimuladoPosition = {
  number: 1 | 2 | 3 | 4 | 5 | 6;
  domainId: DomainId;
  format: QuestionFormat;
  title: string;
  description: string;
};

/** Modelo das 6 posicoes, extraido da REAV1 (ver docs/reavaliacao-format.md). */
export const SIMULADO_MODEL: SimuladoPosition[] = [
  {
    number: 1,
    domainId: 'somatorio',
    format: 'summation-from-code',
    title: 'Somatorio a partir de codigo',
    description: 'Contar multiplicacoes em lacos, montar o somatorio e fechar a formula.',
  },
  {
    number: 2,
    domainId: 'avl',
    format: 'structure-simulation',
    title: 'Insercao passo a passo em arvores',
    description: 'Simular insercao em 2-3-4, AVL ou alvinegra e escolher o estado final.',
  },
  {
    number: 3,
    domainId: 'arvore',
    format: 'prove-or-refute',
    title: 'Provar ou refutar afirmacoes',
    description: 'Analisar afirmacoes de estruturas e complexidade e marcar o que segue o gabarito.',
  },
  {
    number: 4,
    domainId: 'ordenacao',
    format: 'algorithm-adaptation',
    title: 'Reimplementar ou adaptar ordenacao',
    description: 'Adaptar um algoritmo de ordenacao a uma nova restricao.',
  },
  {
    number: 5,
    domainId: 'somatorio',
    format: 'case-analysis',
    title: 'Melhor e pior caso de codigo',
    description: 'Classificar blocos, contar repeticoes e explicar melhor e pior caso.',
  },
  {
    number: 6,
    domainId: 'doidona',
    format: 'composite-structure-method',
    title: 'Metodo em estrutura composta',
    description: 'Implementar ou corrigir um metodo em estrutura composta (Doidona / T1-T2-T3).',
  },
];

/** Um candidato conhece a posicao a que pertence e sabe virar ExamQuestion. */
type SimuladoCandidate = {
  id: string;
  position: number;
  toQuestion: (position: SimuladoPosition) => ExamQuestion;
};

// -- Adaptadores: convertem itens dos bancos em ExamQuestion sem muta-los. --

function codeDrillCandidate(drill: CodeDrill): SimuladoCandidate {
  return {
    id: drill.id,
    position: 0,
    toQuestion: (position) => ({
      id: drill.id,
      number: position.number,
      domainId: drill.domainId,
      moduleId: drill.moduleId ?? drill.domainId,
      questionType: 'codigo',
      format: position.format,
      title: drill.title,
      stem: drill.stem,
      scaffold: drill.scaffold,
      visual: drill.visual,
      steps: [drill.step],
    }),
  };
}

function conceptualCandidate(question: ConceptualDrawingQuestion): SimuladoCandidate {
  const drawing = question.type === 'desenho';
  const skillId: SkillId = drawing ? 'simulate' : 'justify';
  const prompt = drawing
    ? 'Escolha o desenho que corresponde ao gabarito.'
    : 'Escolha a alternativa que segue o gabarito.';

  return {
    id: question.id,
    position: 0,
    toQuestion: (position) => ({
      id: question.id,
      number: position.number,
      domainId: question.domainId,
      moduleId: question.moduleId,
      questionType: drawing ? 'desenho' : 'conceitual',
      format: position.format,
      title: question.title,
      stem: question.stem,
      steps: [
        {
          id: `${question.id}-choice`,
          kind: 'choice',
          skillId,
          prompt,
          options: question.options.map((option) => ({
            id: option.id,
            label: option.label,
            visual: option.visual,
          })),
          correctOptionId: question.correctOptionId,
          explanation: question.explanation,
        },
      ],
    }),
  };
}

// -- Selecao dos bancos de cada posicao (ids disjuntos). --

function conceptualByNumbers(type: 'conceitual' | 'desenho', numbers: number[]): SimuladoCandidate[] {
  const ids = new Set(numbers.map((n) => `lista2-${type}-q${String(n).padStart(2, '0')}`));
  return conceptualDrawingCatalog
    .filter((question) => ids.has(question.id))
    .map((question) => conceptualCandidate(question));
}

function codeDrillsByDomain(domainId: DomainId): SimuladoCandidate[] {
  return codeDrillCatalog
    .filter((drill) => drill.domainId === domainId)
    .map((drill) => codeDrillCandidate(drill));
}

function staticQuestionCandidate(index: number): SimuladoCandidate {
  const question = reavaliacaoBlueprint.questions[index];
  return {
    id: question.id,
    position: 0,
    toQuestion: (position) => ({ ...question, number: position.number, format: position.format }),
  };
}

/**
 * Bancos por posicao. Cada questao aparece em UM unico banco, garantindo que
 * um mesmo item nunca caia em duas posicoes do mesmo simulado.
 */
function poolForPosition(number: number): SimuladoCandidate[] {
  switch (number) {
    case 1:
      return [staticQuestionCandidate(0), ...conceptualByNumbers('conceitual', [1]), ...codeDrillsByDomain('somatorio')];
    case 2:
      return [
        staticQuestionCandidate(1),
        ...conceptualByNumbers('conceitual', [18, 19, 20]),
        ...conceptualByNumbers('desenho', [35, 36, 37, 38, 39, 40, 41, 42]),
      ];
    case 3:
      return [
        staticQuestionCandidate(2),
        ...conceptualByNumbers('conceitual', [3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17, 21, 22, 23, 24]),
      ];
    case 4:
      return [
        staticQuestionCandidate(3),
        ...codeDrillsByDomain('ordenacao'),
        ...conceptualByNumbers('desenho', [31, 32, 33, 34]),
      ];
    case 5:
      return [staticQuestionCandidate(4), ...conceptualByNumbers('conceitual', [2, 11, 12, 13, 14])];
    case 6:
      return [staticQuestionCandidate(5), ...codeDrillsByDomain('doidona')];
    default:
      return [];
  }
}

function pickCandidate(pool: SimuladoCandidate[], rng: Rng, avoidId?: string): SimuladoCandidate {
  const filtered = avoidId && pool.length > 1 ? pool.filter((candidate) => candidate.id !== avoidId) : pool;
  const index = Math.floor(rng() * filtered.length) % filtered.length;
  return filtered[index] ?? pool[0];
}

export type BuildSimuladoOptions = {
  rng?: Rng;
  /** Simulado anterior; evita repetir a mesma questao na mesma posicao. */
  previous?: ExamBlueprint;
};

/**
 * Monta um simulado com 6 questoes, uma por posicao do modelo REAV1.
 * A cada chamada as questoes variam (sorteio por posicao).
 */
export function buildSimulado(options: BuildSimuladoOptions = {}): ExamBlueprint {
  const rng = options.rng ?? Math.random;
  const previousQuestions = options.previous?.questions ?? [];

  const questions: ExamQuestion[] = SIMULADO_MODEL.map((position, index) => {
    const pool = poolForPosition(position.number);
    const avoidId = previousQuestions[index]?.id;
    const candidate = pickCandidate(pool, rng, avoidId);
    return candidate.toQuestion(position);
  });

  const signature = questions.map((question) => question.id).join('_');

  return {
    id: `reavaliacao-simulado-${signature}`,
    title: 'Simulado de Reavaliacao AEDS II',
    questions,
  };
}

/** RNG deterministico (mulberry32) para testes e reproducibilidade. */
export function seededRng(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
