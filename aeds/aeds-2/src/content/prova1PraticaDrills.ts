import type { CodeDrill } from '../types/content';
import { prova1PraticaListaMatrizRecursaoCatalog } from './prova1PraticaListaMatrizRecursao';
import { prova1PraticaOrdenacaoBuscaCatalog } from './prova1PraticaOrdenacaoBusca';
import { prova1PraticaPilhaFilaCatalog } from './prova1PraticaPilhaFila';

/**
 * Exercicios de prova pratica (estilo beecrowd/Verde) da Prova 1: mesmo
 * escopo da prova teorica (u00-u04: complexidade, recursividade, lista,
 * fila, pilha, matriz, ordenacao e busca), so que como programa completo
 * com entrada/saida.
 *
 * TODOS sao problemas reais de juiz online — beecrowd (o banco da prova
 * pratica e parecido com o dele), LeetCode e Codewars:
 *  - mesmo problema e mesmas restricoes; o texto e uma reescrita fiel em
 *    portugues, e o original fica no link de `judge`;
 *  - `samples` com os exemplos oficiais caractere a caractere (os do
 *    beecrowd sao extraidos automaticamente, ver beecrowdSamples.ts);
 *  - solucao modelo que passaria no juiz de verdade, inclusive no limite
 *    de tempo (por isso ha quicksort/mergesort/counting sort onde um
 *    Theta(n^2) estouraria).
 *
 * O corretor estilo Verde (pasta `corretor/`, botao "Rodar") compila e
 * executa o codigo do aluno contra os exemplos (saida publica) e contra
 * casos extras gerados (saida privada), cuja resposta esperada vem da
 * solucao modelo. `npm run verificar:pratica` garante que toda solucao
 * modelo tira 100% nas duas.
 *
 * Pesquisados e descartados: 1022 TDA Racional, 1023 Estiagem, 1281 Ida a
 * Feira e 1430 Composicao de Jingles (parsing, nao estrutura de dados);
 * 1244 Ordenacao por Tamanho (aviso de direitos autorais da TopCoder);
 * 1256 Tabelas Hash e 1195/1200 arvores (escopo de Prova 2/3); katas do
 * Codewars sem assinatura Java confirmada (Bubblesort Once, Josephus
 * Survivor).
 */
export const prova1PraticaDrillCatalog: CodeDrill[] = [
  ...prova1PraticaOrdenacaoBuscaCatalog,
  ...prova1PraticaPilhaFilaCatalog,
  ...prova1PraticaListaMatrizRecursaoCatalog,
];
