export type DomainId = 'doidona' | 'trie' | 'avl' | 'arvore' | 'hash' | 'vetores' | 'somatorio' | 'ordenacao';

export type ContentModuleId =
  | DomainId
  | 'complexidade'
  | 'recursividade'
  | 'lista'
  | 'fila'
  | 'pilha'
  | 'matriz'
  | 'arvore234'
  | 'alvinegra'
  | 'patricia'
  | 'ordenacao-bolha'
  | 'ordenacao-insercao'
  | 'ordenacao-selecao'
  | 'ordenacao-shell'
  | 'ordenacao-counting'
  | 'ordenacao-bucket'
  | 'ordenacao-radix'
  | 'busca-sequencial'
  | 'busca-binaria';

export type QuestionFormat =
  | 'summation-from-code'
  | 'structure-simulation'
  | 'prove-or-refute'
  | 'algorithm-adaptation'
  | 'case-analysis'
  | 'composite-structure-method'
  | 'code-repetition'
  | 'code-modification';

export type SkillId = 'recognize' | 'simulate' | 'program' | 'justify';

/** Tipo pedagogico do exercicio, casado com o modo de treino que o corrige. */
export type ErrorType = 'codigo' | 'conceitual' | 'desenho';

export type MistakeTag =
  | 'wrong-case-analysis'
  | 'missing-base-case'
  | 'wrong-rotation'
  | 'lost-pointer'
  | 'prefix-vs-word'
  | 'incomplete-layer-search'
  | 'wrong-summation-bound'
  | 'algorithm-confusion';

export type Domain = {
  id: DomainId;
  title: string;
  shortTitle: string;
  examRole: string;
  skills: SkillId[];
};

export type StepOption = {
  id: string;
  label: string;
  mistakeTag?: MistakeTag;
  /** Alternativa visual (usada por questoes de desenho reaproveitadas no simulado). */
  visual?: StructureVisual;
};

export type CodeBlock = {
  id: string;
  label: string;
};

export type ChoiceStep = {
  id: string;
  kind: 'choice';
  prompt: string;
  options: StepOption[];
  correctOptionId: string;
  score?: number;
  explanation?: string;
};

export type GapStep = {
  id: string;
  kind: 'gap';
  prompt: string;
  answers: string[];
  score?: number;
  explanation?: string;
  mistakeTag?: MistakeTag;
};

export type BlocksStep = {
  id: string;
  kind: 'blocks';
  prompt: string;
  blocks: CodeBlock[];
  correctOrder: string[];
  score?: number;
  explanation?: string;
  mistakeTag?: MistakeTag;
};

export type FixStep = {
  id: string;
  kind: 'fix';
  prompt: string;
  lines: string[];
  correctLineIndex: number;
  fixOptions: StepOption[];
  correctFixId: string;
  score?: number;
  explanation?: string;
};

export type CodeStep = {
  id: string;
  kind: 'code';
  prompt: string;
  acceptedAnswers: string[];
  score?: number;
  explanation?: string;
  mistakeTag?: MistakeTag;
};

export type FunctionRequirement = {
  id: string;
  label: string;
  code: string;
  mistakeTag?: MistakeTag;
};

export type FunctionLineExplanation = {
  code: string;
  note: string;
};

export type FunctionStep = {
  id: string;
  kind: 'function';
  prompt: string;
  signature: string;
  solution: string;
  requiredFragments: FunctionRequirement[];
  /**
   * Trechos que NAO podem aparecer na resposta. Usado quando um fragmento
   * obrigatorio (substring) tambem casaria com uma resposta errada mais longa
   * (ex.: aceitar `n * (n + 1)` mas rejeitar `n * (n + 1) / 2`).
   */
  forbiddenFragments?: FunctionRequirement[];
  lineExplanations: FunctionLineExplanation[];
  score?: number;
  explanation?: string;
  mistakeTag?: MistakeTag;
};

export type RubricStep = {
  id: string;
  kind: 'rubric';
  prompt: string;
  options: StepOption[];
  acceptableOptionIds: string[];
  score?: number;
  explanation?: string;
};

/** Uma opcao de algoritmo dentro de um FunctionChoiceStep. */
export type FunctionVariant = {
  id: string;
  label: string;
  signature: string;
  solution: string;
  requiredFragments: FunctionRequirement[];
  forbiddenFragments?: FunctionRequirement[];
  lineExplanations: FunctionLineExplanation[];
};

/**
 * Questao de codigo que aceita MAIS DE UM algoritmo correto (ex.: "ordene
 * este vetor, escolha o metodo"). O corretor testa a resposta contra cada
 * variante e aceita se bater com QUALQUER uma delas (nao exige que o aluno
 * declare antes qual escolheu).
 */
export type FunctionChoiceStep = {
  id: string;
  kind: 'function-choice';
  prompt: string;
  variants: FunctionVariant[];
  score?: number;
  explanation?: string;
  mistakeTag?: MistakeTag;
};

export type ChallengeStep = ChoiceStep | GapStep | BlocksStep | FixStep | CodeStep | FunctionStep | RubricStep | FunctionChoiceStep;

export type ExamStep = ChallengeStep & {
  skillId: SkillId;
};

export type ExamQuestion = {
  id: string;
  number: number;
  domainId: DomainId;
  /** Modulo especifico do banco de origem (lista, hash, avl...). */
  moduleId?: ContentModuleId;
  /** Tipo do exercicio para o caderno de erros (codigo/conceitual/desenho). */
  questionType?: ErrorType;
  format: QuestionFormat;
  title: string;
  stem: string;
  /** Esqueleto de codigo exibido em questoes de codigo reaproveitadas do Treino. */
  scaffold?: string;
  visual?: StructureVisual;
  steps: ExamStep[];
};

export type ExamBlueprint = {
  id: string;
  title: string;
  questions: ExamQuestion[];
};

export type PracticeVariation = {
  id: string;
  domainId: DomainId;
  skillId: SkillId;
  questionFormat: QuestionFormat;
  targetMistakeTag: MistakeTag;
  title: string;
  prompt: string;
};

export type ChoiceAnswer = {
  kind: 'choice';
  optionId: string;
};

export type TextAnswer = {
  kind: 'text';
  text: string;
};

export type BlocksAnswer = {
  kind: 'blocks';
  order: string[];
};

export type FixAnswer = {
  kind: 'fix';
  lineIndex: number;
  fixId: string;
};

export type StepAnswer = ChoiceAnswer | TextAnswer | BlocksAnswer | FixAnswer;

export type StepResult = {
  correct: boolean;
  scoreDelta: number;
  feedback: string;
  mistakeTag?: MistakeTag;
};

export type StructureVisualKind =
  | 'binary-tree'
  | 'avl'
  | 'trie'
  | 'doidona'
  | 'array'
  | 'hash'
  | 'list'
  | 'queue'
  | 'stack'
  | 'matrix'
  | 'tree234'
  | 'red-black'
  | 'patricia';

export type StructureVisualStep = {
  caption: string;
  labels: string[];
  kind?: StructureVisualKind;
  code?: string;
  vars?: Array<{ name: string; value: string }>;
};

export type StructureVisual = {
  kind: StructureVisualKind;
  title: string;
  caption: string;
  labels: string[];
  steps?: StructureVisualStep[];
  operation?: string;
  complexity?: string;
};

export type CodeDrillPhase = 'repeat' | 'modify';

/**
 * Mesmos 4 valores de ExamId (src/content/examCatalog.ts), duplicados aqui
 * pra nao criar dependencia circular (examCatalog.ts ja importa tipos
 * deste arquivo). Mantenha os dois em sincronia.
 */
export type OldExamPaper = 'p1' | 'p2' | 'p3' | 'reav';

/**
 * Marca um CodeDrill como reproducao de uma questao REAL de prova
 * fotografada (nao um exercicio so inspirado nela). `studyScope` pode
 * divergir de `paperExam` quando uma questao da Reavaliacao cobra materia
 * de uma prova anterior (ex.: questao de somatorio na Reav conta pra
 * estudar Prova 1 tambem).
 */
export type OldExamRef = {
  paperExam: OldExamPaper;
  studyScope: OldExamPaper;
  /** Rotulo curto da questao original na prova fotografada (ex.: "Q1", "Q3b"). */
  questionLabel: string;
};

export type JudgeSite = 'beecrowd' | 'LeetCode' | 'Codewars';

/** Problema real de juiz online que um drill de prova pratica reproduz. */
export type JudgeProblemRef = {
  site: JudgeSite;
  /** Numero/slug do problema no site (ex.: "1068", "20", "josephus-permutation"). */
  problemId: string;
  /** Nome oficial do problema no site. */
  name: string;
  /** Pagina do problema no juiz (onde se submete; o beecrowd pede login). */
  url: string;
  /** Enunciado original aberto ao publico, sem login (so o beecrowd separa as duas paginas). */
  statementUrl?: string;
  /** Limite de tempo do juiz (so beecrowd publica), ex.: "1s". */
  timeLimit?: string;
};

/** Exemplo oficial de entrada/saida, copiado caractere a caractere do juiz. */
export type ProblemSample = {
  input: string;
  output: string;
};

export type CodeDrill = {
  id: string;
  domainId: DomainId;
  moduleId?: ContentModuleId;
  title: string;
  source: 'lista-prova3' | 'reav-style' | 'lista-2' | 'prova1' | 'prova1-pratica' | 'prova2-pratica' | 'prova3-pratica';
  difficulty?: 'basico' | 'intermediario' | 'avancado' | 'reavaliacao' | 'desafio';
  repetitionGroup: string;
  phase: CodeDrillPhase;
  format: Extract<QuestionFormat, 'code-repetition' | 'code-modification'>;
  skillId: SkillId;
  goal: string;
  stem: string;
  scaffold: string;
  visual: StructureVisual;
  step: ExamStep;
  /** Presente so quando o drill reproduz uma questao real de prova fotografada. */
  oldExam?: OldExamRef;
  /** Presente quando o drill reproduz um problema real de juiz online (prova pratica). */
  judge?: JudgeProblemRef;
  /** Exemplos oficiais do problema, exibidos como no juiz (entrada | saida). */
  samples?: ProblemSample[];
};
