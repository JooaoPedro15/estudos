export type ModuloId = 'intro' | 'preproc' | 'arvore' | 'ensemble' | 'assoc' | 'bayes' | 'codigos';

export type Prioridade = 'alta' | 'media' | 'baixa';

/** De onde saiu o conteudo: arquivo do material + slide/pagina/celula. */
export type Fonte = { arquivo: string; onde: string };

export type NoArvore = {
  /** linha de teste do sklearn, ex.: "outlook <= 0.5". Folhas nao tem. */
  teste?: string;
  /** criterio exibido: "entropy = 0.94" ou "gini = 0.5" */
  impureza: string;
  samples: number;
  value: number[];
  classe: string;
  /** filho do lado True (condicao verdadeira) */
  sim?: NoArvore;
  /** filho do lado False */
  nao?: NoArvore;
};

export type DiagramaId =
  | 'kdd'
  | 'ia-am-dl'
  | 'tipos-aprendizado'
  | 'holdout-kfold'
  | 'over-under'
  | 'vazamento'
  | 'entropia-gini'
  | 'bagging-rf'
  | 'bootstrap'
  | 'boosting'
  | 'apriori-poda'
  | 'matriz-leitura'
  | 'codificacoes';

/**
 * Blocos de conteudo. Textos aceitam marcacao curta:
 * **negrito**, `codigo` e $tex$ (formula em linha).
 */
export type Bloco =
  | { tipo: 'p'; texto: string }
  | { tipo: 'lista'; itens: string[]; ordenada?: boolean }
  | { tipo: 'formula'; tex: string; nome?: string }
  | { tipo: 'tabela'; cabecalho: string[]; linhas: string[][]; legenda?: string }
  | { tipo: 'codigo'; codigo: string; legenda?: string }
  | { tipo: 'diagrama'; id: DiagramaId; legenda?: string }
  | { tipo: 'arvore'; arvore: NoArvore; legenda?: string; nomesClasses?: string[] }
  | { tipo: 'nota'; variante: 'info' | 'alerta' | 'fora' | 'prova'; texto: string };

export type Secao = { id: string; titulo: string; blocos: Bloco[]; fontes: Fonte[] };

export type Formula = { nome: string; tex: string; nota?: string; fonte: Fonte };

export type Passo = { titulo: string; blocos: Bloco[] };

export type Pegadinha = { texto: string; fonte: Fonte };

export type Modulo = {
  id: ModuloId;
  ordem: number;
  titulo: string;
  curto: string;
  prioridade: Prioridade;
  /** uma frase: o que o modulo cobre */
  descricao: string;
  /** por que importa na prova (curto) */
  peso: string;
  resumo: Secao[];
  formulas: Formula[];
  exemplo: { titulo: string; enunciado: Bloco[]; passos: Passo[]; fontes: Fonte[] };
  pegadinhas: Pegadinha[];
  chefe: { nome: string; fala: string };
};

type QuestaoBase = {
  id: string;
  modulo: ModuloId;
  /** 1 = direta, 2 = media, 3 = dificil */
  nivel: 1 | 2 | 3;
  enunciado: Bloco[];
  fontes: Fonte[];
};

export type QuestaoMC = QuestaoBase & {
  tipo: 'mc';
  opcoes: string[];
  correta: number;
  explicacao: Bloco[];
};

export type Campo = {
  id: string;
  rotulo: string;
  resposta: number;
  /** padrao 0,01 */
  tolerancia?: number;
  /** como chegar no valor (aparece quando o aluno erra este campo) */
  porque: string;
};

export type CelulaTabela = string | { campo: string };

export type QuestaoNum = QuestaoBase & {
  tipo: 'num';
  campos: Campo[];
  /** se presente, os campos aparecem dentro desta tabela */
  tabela?: { cabecalho: string[]; linhas: CelulaTabela[][] };
  resolucao: Bloco[];
};

export type Questao = QuestaoMC | QuestaoNum;
