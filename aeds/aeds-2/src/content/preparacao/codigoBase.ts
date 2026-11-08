import { assuntoQuestao,type QuestaoPreparacao } from './catalogo';

export function codigoBaseQuestao(question:QuestaoPreparacao):string | null {
  if(question.base) return question.base;
  if(question.id.startsWith('pratica-')) return null;
  const topic=assuntoQuestao(question);
  if(question.sources.includes('autoral/Fundamentos.java')) {
    if(topic==='analise') return 'static long contar(int n) {\n  long resp = 0;\n  for (int i = 1; i <= n; i++)\n    for (int j = 0; j < i; j++) resp++;\n  return resp;\n}';
    if(topic==='fila') return 'class Fila {\n  int[] array; int primeiro, ultimo;\n  Fila(int capacidade) { array = new int[capacidade + 1]; }\n  // primeiro aponta para o primeiro elemento; ultimo para a próxima posição livre.\n  int desfazer() { /* implemente */ }\n  int[] inverso() { /* implemente */ }\n}';
    return 'class Ordenacao {\n  // Implemente inserção por paridade e valor, sem ordenação pronta.\n  static void ordenar(int[] array) { /* implemente */ }\n}';
  }
  if(question.sources.includes('autoral/Estruturas.java')) return topic==='trie' ? 'class Letra { Letra[] prox = new Letra[26]; boolean fimPalavra; }\nclass Estruturas {\n  Letra inicio = new Letra();\n  void inserir(String s) { /* já implementado */ }\n  int contarPrefixo(String s) { /* implemente */ }\n  Estruturas invertida() { /* implemente */ }\n}' : 'class No { int elemento, nivel; No esq, dir; }\nclass Estruturas {\n  No raiz;\n  int contarBalanceados() { /* implemente */ }\n  static int altura(No i) { /* implemente */ }\n  static No direita(No i) { /* implemente */ }\n}';
  if(question.sources.includes('autoral/Hibrida.java')) return 'class No { int elemento; No esq, dir; }\nclass Celula { int elemento; Celula prox; }\nclass Posicao { int elemento; boolean ocupado; No raiz; Celula primeiro; }\nclass Hibrida {\n  Posicao[] tabela; // cinco posições inicializadas; listas com cabeça\n  int hash(int x) { /* índice de 0 a 4, inclusive para negativos */ }\n  boolean pesquisar(int x) { /* implemente */ }\n}';
  return null;
}
