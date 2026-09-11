import type { ExamLikelihood, Question, Source, SourceStyle } from '@/content/types';

export type DefinitionQuestion = Extract<Question, { type: 'DEFINITION' }>;

/**
 * Entrada compacta para uma questão "Defina o conceito de X". O helper `def`
 * preenche o que é igual em todas (tipo, dificuldade, duração, dicas) para o
 * arquivo de conteúdo ficar só com o que importa: a definição literal do
 * professor, os pontos-chave e a explicação para entender.
 */
export interface DefinitionSpec {
  /** Sufixo do id; vira `def-<id>`. */
  id: string;
  topic: string;
  concept: string;
  /** Default: "Defina o conceito de <concept>." */
  prompt?: string;
  /** Definição LITERAL do professor — é o que se escreve na prova. Vira `solution`. */
  definition: string;
  keyPoints: string[];
  intuition: string;
  breakdown?: string[];
  example?: string;
  note?: string;
  source: Source;
  /** Default: 'slide'. */
  sourceStyle?: SourceStyle;
  /** Default: 'high' — definição é a base de toda justificativa cobrada na P1. */
  examLikelihood?: ExamLikelihood;
}

export function def(spec: DefinitionSpec): DefinitionQuestion {
  return {
    id: `def-${spec.id}`,
    type: 'DEFINITION',
    topic: spec.topic,
    concept: spec.concept,
    prompt: spec.prompt ?? `Defina o conceito de ${spec.concept}.`,
    difficulty: 'easy',
    duration: 'quick',
    examLikelihood: spec.examLikelihood ?? 'high',
    sourceStyle: spec.sourceStyle ?? 'slide',
    source: spec.source,
    // Dicas progressivas: cada dica revela um ponto-chave, do mais geral ao mais específico.
    hints: spec.keyPoints.map((kp, i) => (i === 0 ? `A definição do professor começa por: ${kp}` : `Ela também precisa dizer: ${kp}`)),
    solution: spec.definition,
    keyPoints: spec.keyPoints,
    intuition: spec.intuition,
    breakdown: spec.breakdown,
    example: spec.example,
    note: spec.note,
  };
}

/** Fonte apontando para um slide específico de um deck do professor. */
export function slide(file: string, page: number, title: string): Source {
  return { type: 'professor_slide', file, page, note: title };
}
