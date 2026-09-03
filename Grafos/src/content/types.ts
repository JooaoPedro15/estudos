// Modelo de conteúdo do GraphLab P1.
// Mantido separado da interface (ver seção 33 do briefing): nada de texto acadêmico em JSX.

export type SourceType =
  | 'professor_slide'
  | 'professor_board'
  | 'professor_support_material'
  | 'old_exam'
  | 'book';

export interface Source {
  type: SourceType;
  file?: string;
  author?: string;
  chapter?: string;
  page?: string | number;
  note?: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';
export type Duration = 'quick' | 'normal' | 'deep';
export type ExamLikelihood = 'low' | 'medium' | 'high';
export type SourceStyle = 'slide' | 'board' | 'old_exam' | 'book' | 'generated';

// ---------------------------------------------------------------------------
// Grafo (estrutura de dados compartilhada por todo o app: lições, exercícios,
// playground, simulados)
// ---------------------------------------------------------------------------

export interface VertexData {
  id: string;
  label: string;
  x?: number;
  y?: number;
}

export interface EdgeData {
  id: string;
  source: string;
  target: string;
  weight?: number;
  label?: string;
}

export interface GraphData {
  directed: boolean;
  vertices: VertexData[];
  edges: EdgeData[];
}

// ---------------------------------------------------------------------------
// Módulos e tópicos
// ---------------------------------------------------------------------------

export interface Module {
  id: string;
  order: number;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  topicIds: string[];
}

export interface AuthorDefinition {
  author: string;
  text: string;
  source?: Source;
}

export interface ConceptConflict {
  topic: string;
  hasRealDifference: boolean;
  professorDefinition: string;
  professorSource: Source;
  alternatives: AuthorDefinition[];
  differenceExplanation?: string;
  examGuidance: string;
}

export interface Topic {
  id: string;
  moduleId: string;
  order: number;
  slug: string;
  title: string;
  examLikelihood: ExamLikelihood;
  examEvidence?: string;
  whatYouNeedToKnow: string;
  understand: string[];
  commonPitfall?: string;
  conceptConflict?: ConceptConflict;
  /** Quando as fontes de escopo (cronograma vs. provas antigas) discordam sobre se isso cai na P1 ou só na P2 — explica o conflito para o aluno decidir quanto priorizar. */
  scopeNote?: string;
  sources: Source[];
}

// ---------------------------------------------------------------------------
// Exercícios
// ---------------------------------------------------------------------------

export type ExerciseType =
  | 'MULTIPLE_CHOICE'
  | 'TRUE_FALSE'
  | 'SHORT_ANSWER'
  | 'NUMBER_INPUT'
  | 'GRAPH_SELECT_VERTEX'
  | 'GRAPH_SELECT_EDGE'
  | 'MATRIX_FILL'
  | 'ADJACENCY_LIST_FILL'
  | 'ISOMORPHISM_MAPPING'
  | 'ORDERING'
  | 'DRAG_AND_DROP'
  | 'PROOF_OR_JUSTIFICATION';

export interface QuestionMeta {
  id: string;
  topic: string; // Topic.id
  subtopic?: string;
  difficulty: Difficulty;
  duration: Duration;
  examLikelihood: ExamLikelihood;
  sourceStyle: SourceStyle;
  source: Source;
  hints: string[];
  solution: string;
  professorStyleSimilarity?: 'high' | 'medium' | 'low';
  /** Grafo(s) mostrados como contexto acima da pergunta, para tipos que não têm campo `graph` próprio (ex.: TRUE_FALSE, MULTIPLE_CHOICE). */
  displayGraphs?: { a: GraphData; b?: GraphData };
}

export interface Option {
  id: string;
  label: string;
}

export type Question =
  | (QuestionMeta & {
      type: 'MULTIPLE_CHOICE';
      prompt: string;
      options: Option[];
      correctOptionId: string;
    })
  | (QuestionMeta & {
      type: 'TRUE_FALSE';
      prompt: string;
      correctValue: boolean;
    })
  | (QuestionMeta & {
      type: 'SHORT_ANSWER';
      prompt: string;
      acceptedAnswers: string[];
    })
  | (QuestionMeta & {
      type: 'NUMBER_INPUT';
      prompt: string;
      correctNumber: number;
      tolerance?: number;
      unit?: string;
    })
  | (QuestionMeta & {
      type: 'GRAPH_SELECT_VERTEX';
      prompt: string;
      graph: GraphData;
      correctVertexIds: string[];
      multi?: boolean;
    })
  | (QuestionMeta & {
      type: 'GRAPH_SELECT_EDGE';
      prompt: string;
      graph: GraphData;
      correctEdgeIds: string[];
      multi?: boolean;
    })
  | (QuestionMeta & {
      type: 'MATRIX_FILL';
      matrixKind: 'adjacency' | 'incidence';
      prompt: string;
      graph: GraphData;
      rowIds: string[];
      colIds: string[];
      correctCells: Record<string, number>; // key `${rowId}|${colId}`
    })
  | (QuestionMeta & {
      type: 'ADJACENCY_LIST_FILL';
      prompt: string;
      graph: GraphData;
      correctList: Record<string, string[]>;
    })
  | (QuestionMeta & {
      type: 'ISOMORPHISM_MAPPING';
      prompt: string;
      graphA: GraphData;
      graphB: GraphData;
      isIsomorphic: boolean;
      correctMapping?: Record<string, string>;
    })
  | (QuestionMeta & {
      type: 'ORDERING';
      prompt: string;
      items: Option[];
      correctOrder: string[];
    })
  | (QuestionMeta & {
      type: 'DRAG_AND_DROP';
      prompt: string;
      items: Option[];
      buckets: Option[];
      correctMap: Record<string, string>;
    })
  | (QuestionMeta & {
      type: 'PROOF_OR_JUSTIFICATION';
      prompt: string;
      graph?: GraphData;
      rubric: string[];
    });

// ---------------------------------------------------------------------------
// Simulado / provas
// ---------------------------------------------------------------------------

export interface ExamQuestionRef {
  questionId: string;
  weightPercent: number;
}

export interface Exam {
  id: string;
  title: string;
  basedOn: string; // ex.: "estilo 2024/2 + 2026/1"
  questions: ExamQuestionRef[];
  suggestedDurationMinutes: number;
}

// ---------------------------------------------------------------------------
// Progresso (persistido em IndexedDB via idb-keyval)
// ---------------------------------------------------------------------------

export interface QuestionAttempt {
  questionId: string;
  topic: string;
  correct: boolean;
  hintsUsed: number;
  timeMs: number;
  timestamp: number;
}

export interface TopicStat {
  topic: string;
  attempts: number;
  correct: number;
  lastSeen: number;
  lastCorrect: boolean;
}

export interface ProgressState {
  attempts: QuestionAttempt[];
  topicStats: Record<string, TopicStat>;
  lastModuleId?: string;
  lastTopicId?: string;
  totalStudySeconds: number;
}
