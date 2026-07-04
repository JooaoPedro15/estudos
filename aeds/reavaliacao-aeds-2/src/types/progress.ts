import type { ContentModuleId, DomainId, ErrorType, MistakeTag, QuestionFormat, SkillId } from './content';

export type { ErrorType };

export type SkillProgress = Partial<Record<SkillId, boolean>>;

export type DomainProgress = Partial<Record<DomainId, SkillProgress>>;

export type GameProgress = {
  domains: DomainProgress;
};

export type StepAttempt = {
  questionId: string;
  stepId: string;
  domainId: DomainId;
  /** Modulo especifico (lista, fila, hash, arvore...). */
  moduleId: ContentModuleId;
  /** Tipo do exercicio: codigo, conceitual ou desenho. */
  questionType: ErrorType;
  skillId: SkillId;
  format: QuestionFormat;
  correct: boolean;
  scoreDelta: number;
  feedback: string;
  /** Erro cometido (so em respostas erradas). */
  mistakeTag?: MistakeTag;
  /** Assunto/operacao intrinseco da questao (presente mesmo no acerto). */
  subjectTag?: MistakeTag;
};

export type ExamSession = {
  blueprintId: string;
  currentQuestionIndex: number;
  currentStepIndex: number;
  score: number;
  maxScore: number;
  attempts: StepAttempt[];
  completed: boolean;
};

export type ErrorRecord = {
  id: string;
  /** Tipo do erro: define para qual modo de treino o "Praticar" envia. */
  type: ErrorType;
  /** Modulo do conteudo (lista, fila, hash, arvore...). */
  moduleId: ContentModuleId;
  domainId: DomainId;
  skillId: SkillId;
  questionFormat: QuestionFormat;
  /** Assunto/operacao (rotacao, colisao, somatorio...); ausente quando generico. */
  subjectTag?: MistakeTag;
  /** Ultimo erro cometido, usado para escolher treino parecido. */
  mistakeTag?: MistakeTag;
  /** Ultima questao/etapa errada, para abrir uma questao parecida. */
  challengeId: string;
  questionId?: string;
  /** Quantidade de erros acumulados. */
  attempts: number;
  /** Acertos posteriores em treino de recuperacao. */
  correctCount: number;
  /** Nivel de dominio (caixa de Leitner); resolvido ao atingir a meta. */
  masteryLevel: number;
  /** Momento do ultimo ganho de dominio, para exigir acertos espacados. */
  lastMasteryAt?: string;
  firstSeenAt: string;
  lastSeenAt: string;
  resolved: boolean;
};

export type ErrorNotebook = {
  records: ErrorRecord[];
};

export type PracticeMode = 'quick' | 'marathon';

export type PracticeSession = {
  mode: PracticeMode;
  targetCount?: number;
  drillOrder: string[];
  currentDrillIndex: number;
  completedCount: number;
  score: number;
  attempts: StepAttempt[];
  completed: boolean;
};
