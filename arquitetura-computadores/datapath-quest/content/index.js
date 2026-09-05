/* ===========================================================================
   CONTEUDO — index.js
   Junta os bancos de Prova 1, Prova 2 e Prova 3 em REVIEW_BANK e
   OPEN_QUESTIONS, os arrays que o motor do jogo consome. Precisa carregar
   por ULTIMO entre os arquivos de content/, depois de factories.js,
   prova1.js, prova2.js e prova3.js.
   =========================================================================== */

const REVIEW_BANK = [
  ...DATAPATH_TIME_REVIEW,
  ...PARALLEL_REVIEW,
  ...SLT_REVIEW,
  ...CONTROL_REVIEW,
  ...FUNCTION_REG_REVIEW,
  ...CALL_STACK_REVIEW,
  ...LOOP_REVIEW,
  ...CPI_REVIEW,
  ...CLA_SOMADOR_REVIEW,
  ...IEEE754_CUSTOM_REVIEW,
  ...AMDAHL_SPEEDUP_REVIEW,
  ...CPI_DESEMPENHO_P1_REVIEW,
  ...ENDERECAMENTO_VETOR_REVIEW,
  ...DESLOCAMENTO_SHIFT_REVIEW,
  ...CPI_DESEMPENHO_P2_REVIEW,
  ...PILHA_FUNCOES_P2_REVIEW
];

// Questoes abertas removidas do banco: as provas reais sao 100% fechadas
// (multipla escolha), entao o motor nao usa mais formato aberto na pratica.
const OPEN_QUESTIONS = [];
