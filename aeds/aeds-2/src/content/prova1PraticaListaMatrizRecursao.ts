import type { CodeDrill } from '../types/content';
import { samplesDoBeecrowd } from './beecrowdSamples';
import { beecrowd, functionChoiceStep, functionStep, leetcode, req, visual } from './praticaHelpers';

/**
 * Prova pratica da Prova 1 — lista (estatica e encadeada), matriz e
 * recursividade. Problemas REAIS do beecrowd e LeetCode com os exemplos
 * oficiais em `samples`. Enunciados reescritos em portugues (o original
 * fica no link de `judge`).
 */

const LIST_NODE_LEETCODE = `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */`;

export const prova1PraticaListaMatrizRecursaoCatalog: CodeDrill[] = [
  {
    id: 'code-prova1-pratica-lista',
    domainId: 'vetores',
    moduleId: 'lista',
    title: 'LeetCode 26: Remove Duplicates from Sorted Array',
    source: 'prova1-pratica',
    difficulty: 'basico',
    repetitionGroup: 'prova1-pratica-lista',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: leetcode('26', 'remove-duplicates-from-sorted-array', 'Remove Duplicates from Sorted Array'),
    samples: [
      { input: 'nums = [1,1,2]', output: '2, nums = [1,2,_]' },
      { input: 'nums = [0,0,1,1,1,2,2,3,3,4]', output: '5, nums = [0,1,2,3,4,_,_,_,_,_]' },
    ],
    goal: 'Compactar a lista estatica no proprio vetor com os indices de leitura e escrita.',
    stem:
      'Dado um vetor de inteiros nums em ordem nao decrescente, remova as duplicatas NO PROPRIO VETOR (in-place), de forma que cada valor apareca uma unica vez, mantendo a ordem relativa. Seja k a quantidade de valores unicos: devolva k. Os k primeiros elementos de nums devem conter os valores unicos, em ordem; o que ficar a partir da posicao k nao importa (aparece como _ na saida).\n\n' +
      'Entrada: o vetor nums (1 <= nums.length <= 3 * 10^4, -100 <= nums[i] <= 100, em ordem nao decrescente), parametro do metodo.\n\n' +
      'Saida: o k devolvido e, junto, os k primeiros elementos de nums — o juiz confere os dois.',
    scaffold: `class Solution {
    public int removeDuplicates(int[] nums) {
        // implementar
    }
}`,
    visual: visual('array', 'Leitura e escrita', 'So escreve quando o valor lido e diferente do ultimo escrito.', ['leitura', 'escrita', 'mudou?']),
    step: functionStep({
      id: 'code-prova1-pratica-lista-step',
      prompt: 'Escreva o metodo removeDuplicates(nums).',
      signature: 'public int removeDuplicates(int[] nums)',
      solution: `public int removeDuplicates(int[] nums) {
  int escrita = 1;
  for (int leitura = 1; leitura < nums.length; leitura++) {
    if (nums[leitura] != nums[escrita - 1]) {
      nums[escrita] = nums[leitura];
      escrita++;
    }
  }
  return escrita;
}`,
      requiredFragments: [
        req('start', 'o primeiro elemento sempre fica (nums.length >= 1)', 'int escrita = 1;'),
        req('compare', 'compara com o ultimo ESCRITO, nao com o ultimo lido', 'nums[leitura] != nums[escrita - 1]'),
        req('write', 'so escreve quando muda', 'nums[escrita] = nums[leitura];'),
        req('return', 'devolve quantos ficaram', 'return escrita;'),
      ],
      lineExplanations: [{ code: 'nums[leitura] != nums[escrita - 1]', note: 'Como o vetor esta ordenado, os repetidos sao vizinhos: basta comparar com o ultimo valor ja guardado.' }],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Uma passada, Theta(n), sem vetor auxiliar. Remover cada repetido deslocando o resto (como no remover(pos) da lista do professor) daria Theta(n^2).',
    }),
  },
  {
    id: 'code-prova1-pratica-amigos',
    domainId: 'vetores',
    moduleId: 'lista',
    title: 'beecrowd 3160: Amigos',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-amigos',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: beecrowd('3160', 'Amigos', 1),
    samples: samplesDoBeecrowd('3160'),
    goal: 'O inserir(x, pos) da lista do professor: desloca para a direita e encaixa, a partir de uma busca sequencial.',
    stem:
      'Luiggy vive fazendo amizades na rede social ListBook, que deixa incluir novos amigos na lista de amizades e tambem indica-los para outro amigo da rede. Ele pediu um programa que: leia a lista atual de amigos; leia a nova lista de amigos; e leia o nome do amigo que vai receber a nova lista como indicacao.\n\n' +
      'Entrada: tres linhas. A primeira tem a lista de amigos L de Luiggy (so o primeiro nome, separados por um espaco em branco). A segunda tem a nova lista de amigos N. A terceira tem o nome do amigo S que vai receber a indicacao; se ninguem for indicado, a terceira linha tem a palavra "nao".\n\n' +
      'Saida: a lista de amigos de Luiggy atualizada. Havendo indicacao, os novos amigos entram ANTES do nome do amigo indicado; sem indicacao, os novos nomes entram no FIM da lista.',
    scaffold: `import java.util.Scanner;

public class Principal {
  static String[] array;
  static int n;

  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    String[] atuais = in.nextLine().trim().split(" ");
    String[] novos = in.nextLine().trim().split(" ");
    String indicado = in.nextLine().trim();
    array = new String[atuais.length + novos.length];
    n = 0;
    for (int i = 0; i < atuais.length; i++) {
      inserirFim(atuais[i]);
    }
    adicionarNovos(novos, indicado);
    String saida = array[0];
    for (int i = 1; i < n; i++) {
      saida += " " + array[i];
    }
    System.out.println(saida);
  }

  static void inserirFim(String x) {
    array[n] = x;
    n++;
  }

  static void inserir(String x, int pos) {
    // implementar: desloca para a direita a partir de pos e coloca x em pos
  }

  static void adicionarNovos(String[] novos, String indicado) {
    // implementar: acha a posicao do indicado (ou o fim, se for "nao") e insere os novos ali, na ordem
  }
}`,
    visual: visual('list', 'Inserir no meio da lista estatica', 'Acha o indice do amigo indicado e insere cada novo ali, deslocando o resto para a direita.', ['pos = indice do indicado', 'inserir(novo, pos + i)', 'sem indicacao: pos = n']),
    step: functionStep({
      id: 'code-prova1-pratica-amigos-step',
      prompt: 'Escreva inserir(x, pos) e adicionarNovos(novos, indicado).',
      signature: 'static void inserir(String x, int pos)',
      solution: `static void inserir(String x, int pos) {
  for (int i = n; i > pos; i--) {
    array[i] = array[i - 1];
  }
  array[pos] = x;
  n++;
}

static void adicionarNovos(String[] novos, String indicado) {
  int pos = n;
  for (int i = 0; i < n; i++) {
    if (pos == n && array[i].equals(indicado)) {
      pos = i;
    }
  }
  for (int i = 0; i < novos.length; i++) {
    inserir(novos[i], pos + i);
  }
}`,
      requiredFragments: [
        req('shift', 'desloca da direita pra esquerda ate pos', 'array[i] = array[i - 1];'),
        req('place', 'coloca na posicao liberada', 'array[pos] = x;'),
        req('search', 'busca sequencial pelo indicado', 'array[i].equals(indicado)'),
        req('order', 'cada novo entra logo depois do anterior', 'inserir(novos[i], pos + i);'),
      ],
      lineExplanations: [
        { code: 'for (int i = n; i > pos; i--) {', note: 'Deslocar do FIM para pos: indo da esquerda pra direita, o array[pos] sobrescreveria todo mundo com o mesmo valor.' },
      ],
      mistakeTag: 'lost-pointer',
      explanation: 'Cada insercao custa Theta(n) de deslocamento; com m novos amigos, Theta(n * m). Se o indicado for "nao", pos fica em n e os novos vao para o fim.',
    }),
  },
  {
    id: 'code-prova1-pratica-lc-reverse-list',
    domainId: 'vetores',
    moduleId: 'lista',
    title: 'LeetCode 206: Reverse Linked List',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-lc-reverse-list',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: leetcode('206', 'reverse-linked-list', 'Reverse Linked List'),
    samples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', output: '[2,1]' },
      { input: 'head = []', output: '[]' },
    ],
    goal: 'Inverter os ponteiros de uma lista simplesmente encadeada sem perder o resto da lista.',
    stem:
      'Dada a cabeca (head) de uma lista simplesmente encadeada, inverta a lista e devolva a lista invertida. O proprio enunciado desafia: a lista pode ser invertida de forma iterativa ou recursiva — consegue fazer as duas?\n\n' +
      'Entrada: a lista, passada pelo no head (de 0 a 5000 nos, -5000 <= val <= 5000).\n\n' +
      'Saida: a lista invertida (a nova cabeca).',
    scaffold: `${LIST_NODE_LEETCODE}
class Solution {
    public ListNode reverseList(ListNode head) {
        // implementar
    }
}`,
    visual: visual('list', 'Tres ponteiros', 'Guarda o proximo ANTES de virar a seta do atual para o anterior; depois anda os dois.', ['proximo = atual.next', 'atual.next = anterior', 'anda anterior e atual']),
    step: functionChoiceStep({
      id: 'code-prova1-pratica-lc-reverse-list-step',
      prompt: 'Escreva o metodo reverseList(head).',
      variants: [
        {
          id: 'iterativo',
          label: 'Iterativo (tres ponteiros)',
          signature: 'public ListNode reverseList(ListNode head)',
          solution: `public ListNode reverseList(ListNode head) {
  ListNode anterior = null;
  ListNode atual = head;
  while (atual != null) {
    ListNode proximo = atual.next;
    atual.next = anterior;
    anterior = atual;
    atual = proximo;
  }
  return anterior;
}`,
          requiredFragments: [
            req('save', 'guarda o proximo antes de mexer', 'ListNode proximo = atual.next;'),
            req('flip', 'vira a seta para o anterior', 'atual.next = anterior;'),
            req('return', 'o ultimo no vira a cabeca', 'return anterior;'),
          ],
          lineExplanations: [{ code: 'ListNode proximo = atual.next;', note: 'Sem guardar antes, "atual.next = anterior" perde o acesso ao resto da lista.' }],
        },
        {
          id: 'recursivo',
          label: 'Recursivo',
          signature: 'public ListNode reverseList(ListNode head)',
          solution: `public ListNode reverseList(ListNode head) {
  ListNode resp = head;
  if (head != null && head.next != null) {
    resp = reverseList(head.next);
    head.next.next = head;
    head.next = null;
  }
  return resp;
}`,
          requiredFragments: [
            req('base', 'lista vazia ou de um no ja esta invertida', 'head != null && head.next != null'),
            req('flip', 'o proximo passa a apontar para head', 'head.next.next = head;'),
            req('cut', 'head vira o fim da lista', 'head.next = null;'),
          ],
          lineExplanations: [{ code: 'head.next.next = head;', note: 'Depois de inverter o resto, head.next e o ULTIMO no da parte invertida: basta pendurar head nele.' }],
        },
      ],
      mistakeTag: 'lost-pointer',
      explanation: 'As duas versoes sao Theta(n). A recursiva usa Theta(n) de pilha de chamadas; a iterativa, Theta(1) de espaco extra.',
    }),
  },
  {
    id: 'code-prova1-pratica-lc-merge-lists',
    domainId: 'vetores',
    moduleId: 'lista',
    title: 'LeetCode 21: Merge Two Sorted Lists',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-lc-merge-lists',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: leetcode('21', 'merge-two-sorted-lists', 'Merge Two Sorted Lists'),
    samples: [
      { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
      { input: 'list1 = [], list2 = []', output: '[]' },
      { input: 'list1 = [], list2 = [0]', output: '[0]' },
    ],
    goal: 'Intercalar duas listas encadeadas reaproveitando os nos, com no cabeca (como a lista do professor).',
    stem:
      'Voce recebe as cabecas de duas listas encadeadas ordenadas, list1 e list2. Intercale as duas numa unica lista ordenada, formada emendando os proprios nos das duas listas, e devolva a cabeca da lista intercalada.\n\n' +
      'Entrada: list1 e list2 (de 0 a 50 nos cada, -100 <= val <= 100, ambas em ordem nao decrescente).\n\n' +
      'Saida: a lista intercalada.',
    scaffold: `${LIST_NODE_LEETCODE}
class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // implementar
    }
}`,
    visual: visual('list', 'No cabeca + ultimo', 'Um no cabeca falso evita tratar a lista vazia; "ultimo" sempre aponta para o fim da lista montada.', ['cabeca falsa', 'menor dos dois vai pro fim', 'emenda o que sobrou']),
    step: functionStep({
      id: 'code-prova1-pratica-lc-merge-lists-step',
      prompt: 'Escreva o metodo mergeTwoLists(list1, list2).',
      signature: 'public ListNode mergeTwoLists(ListNode list1, ListNode list2)',
      solution: `public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
  ListNode cabeca = new ListNode();
  ListNode ultimo = cabeca;
  while (list1 != null && list2 != null) {
    if (list1.val <= list2.val) {
      ultimo.next = list1;
      list1 = list1.next;
    } else {
      ultimo.next = list2;
      list2 = list2.next;
    }
    ultimo = ultimo.next;
  }
  ultimo.next = (list1 != null) ? list1 : list2;
  return cabeca.next;
}`,
      requiredFragments: [
        req('sentinel', 'no cabeca (sentinela) como na lista do professor', 'ListNode cabeca = new ListNode();'),
        req('compare', 'o menor dos dois vai para o fim', 'if (list1.val <= list2.val)'),
        req('rest', 'emenda o que sobrou de uma das listas', 'ultimo.next = (list1 != null) ? list1 : list2;'),
        req('return', 'a lista de verdade comeca depois do no cabeca', 'return cabeca.next;'),
      ],
      lineExplanations: [{ code: 'ultimo.next = (list1 != null) ? list1 : list2;', note: 'Quando uma lista acaba, o resto da outra ja esta ordenado: basta emendar, sem percorrer.' }],
      mistakeTag: 'lost-pointer',
      explanation: 'Theta(n + m) — e o intercalar do mergesort, so que com ponteiros em vez de vetor. O "<=" mantem a intercalacao estavel.',
    }),
  },
  {
    id: 'code-prova1-pratica-matriz-quadrada',
    domainId: 'vetores',
    moduleId: 'matriz',
    title: 'beecrowd 1478: Matriz Quadrada II',
    source: 'prova1-pratica',
    difficulty: 'basico',
    repetitionGroup: 'prova1-pratica-matriz-quadrada',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    judge: beecrowd('1478', 'Matriz Quadrada II', 1),
    samples: samplesDoBeecrowd('1478'),
    goal: 'Achar a formula da celula (i, j) olhando o exemplo e acertar a formatacao com campo de largura 3.',
    stem:
      'Escreva um algoritmo que leia um inteiro N (0 <= N <= 100), a ordem de uma matriz M de inteiros, e construa a matriz seguindo o padrao mostrado no exemplo.\n\n' +
      'Entrada: varios inteiros, um por linha, cada um a ordem de uma matriz a ser construida. O fim da entrada e marcado por uma ordem igual a zero (0).\n\n' +
      'Saida: para cada inteiro da entrada, a matriz correspondente, como no exemplo. Cada valor ocupa um campo de tamanho 3, alinhado a direita, e os valores sao separados por um espaco; nao pode haver espaco depois do ultimo caractere de cada linha. Depois de cada matriz, deixe uma linha em branco.',
    scaffold: `import java.util.Scanner;

public class Principal {
  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    int n = in.nextInt();
    while (n != 0) {
      imprimirMatriz(n);
      n = in.nextInt();
    }
  }

  static void imprimirMatriz(int n) {
    // implementar
  }
}`,
    visual: visual('matrix', 'Distancia ate a diagonal', 'Na diagonal principal vale 1 e cresce 1 a cada casa de distancia: M[i][j] = |i - j| + 1.', ['diagonal = 1', '|i - j| + 1', '"%3d" separado por espaco']),
    step: functionStep({
      id: 'code-prova1-pratica-matriz-quadrada-step',
      prompt: 'Escreva o corpo de imprimirMatriz(n).',
      signature: 'static void imprimirMatriz(int n)',
      solution: `static void imprimirMatriz(int n) {
  int[][] matriz = new int[n][n];
  for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
      matriz[i][j] = Math.abs(i - j) + 1;
    }
  }
  for (int i = 0; i < n; i++) {
    String linha = String.format("%3d", matriz[i][0]);
    for (int j = 1; j < n; j++) {
      linha += " " + String.format("%3d", matriz[i][j]);
    }
    System.out.println(linha);
  }
  System.out.println();
}`,
      requiredFragments: [
        req('formula', 'valor = distancia ate a diagonal + 1', 'Math.abs(i - j) + 1'),
        req('width', 'campo de tamanho 3 alinhado a direita', 'String.format("%3d"'),
        req('separator', 'um espaco ENTRE os valores (nao depois do ultimo)', 'linha += " " +'),
        req('blank', 'linha em branco depois de cada matriz', 'System.out.println();'),
      ],
      lineExplanations: [
        { code: 'String linha = String.format("%3d", matriz[i][0]);', note: 'O primeiro valor entra sem espaco antes; os outros entram com " " na frente — assim nao sobra espaco no fim da linha.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Theta(n^2) para preencher e imprimir. Os espacos contam: "  1   2" sao dois campos de 3 ("  1" e "  2") com um espaco entre eles.',
    }),
  },
  {
    id: 'code-prova1-pratica-lc-spiral-matrix',
    domainId: 'vetores',
    moduleId: 'matriz',
    title: 'LeetCode 54: Spiral Matrix',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-lc-spiral-matrix',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: leetcode('54', 'spiral-matrix', 'Spiral Matrix'),
    samples: [
      { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[1,2,3,6,9,8,7,4,5]' },
      { input: 'matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]', output: '[1,2,3,4,8,12,11,10,9,5,6,7]' },
    ],
    goal: 'Percorrer a matriz em camadas com quatro limites (cima, baixo, esquerda, direita).',
    stem:
      'Dada uma matriz m x n, devolva todos os seus elementos na ordem em espiral: primeira linha da esquerda para a direita, ultima coluna de cima para baixo, ultima linha da direita para a esquerda, primeira coluna de baixo para cima, e assim por diante para dentro.\n\n' +
      'Entrada: a matriz matrix (1 <= m, n <= 10, -100 <= matrix[i][j] <= 100), parametro do metodo.\n\n' +
      'Saida: a lista com os elementos em ordem espiral.',
    scaffold: `class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        // implementar
    }
}`,
    visual: visual('matrix', 'Quatro limites que encolhem', 'Cada volta percorre a borda atual e fecha um limite: cima++, dir--, baixo--, esq++.', ['-> cima', 'v dir', '<- baixo', '^ esq']),
    step: functionStep({
      id: 'code-prova1-pratica-lc-spiral-matrix-step',
      prompt: 'Escreva o metodo spiralOrder(matrix).',
      signature: 'public List<Integer> spiralOrder(int[][] matrix)',
      solution: `public List<Integer> spiralOrder(int[][] matrix) {
  List<Integer> resp = new ArrayList<Integer>();
  int cima = 0, baixo = matrix.length - 1;
  int esq = 0, dir = matrix[0].length - 1;
  while (cima <= baixo && esq <= dir) {
    for (int j = esq; j <= dir; j++) {
      resp.add(matrix[cima][j]);
    }
    cima++;
    for (int i = cima; i <= baixo; i++) {
      resp.add(matrix[i][dir]);
    }
    dir--;
    if (cima <= baixo) {
      for (int j = dir; j >= esq; j--) {
        resp.add(matrix[baixo][j]);
      }
      baixo--;
    }
    if (esq <= dir) {
      for (int i = baixo; i >= cima; i--) {
        resp.add(matrix[i][esq]);
      }
      esq++;
    }
  }
  return resp;
}`,
      requiredFragments: [
        req('loop', 'continua enquanto sobrar camada', 'while (cima <= baixo && esq <= dir)'),
        req('check-row', 'so volta pela linha de baixo se ela ainda existir', 'if (cima <= baixo)'),
        req('check-col', 'so sobe pela coluna da esquerda se ela ainda existir', 'if (esq <= dir)'),
      ],
      lineExplanations: [
        { code: 'if (cima <= baixo) {', note: 'Sem esse teste, matriz com uma linha so (ou camada central de uma linha) repete elementos na volta.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Theta(m * n): cada elemento e visitado uma vez. O cuidado todo esta nas matrizes retangulares, onde a ultima camada pode ser so uma linha ou so uma coluna.',
    }),
  },
  {
    id: 'code-prova1-pratica-fibonacci-chamadas',
    domainId: 'somatorio',
    moduleId: 'recursividade',
    title: 'beecrowd 1029: Fibonacci, Quantas Chamadas?',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-fibonacci-chamadas',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: beecrowd('1029', 'Fibonacci, Quantas Chamadas?', 1),
    samples: samplesDoBeecrowd('1029'),
    goal: 'Transformar a arvore de chamadas em recorrencia: chamadas(n) = chamadas(n-1) + chamadas(n-2) + 2.',
    stem:
      'Quase todo estudante de Computacao encontra a sequencia de Fibonacci no inicio do curso: os dois primeiros valores sao 0 e 1, e cada proximo valor e a soma dos dois anteriores — fib(0) = 0, fib(1) = 1 e fib(n) = fib(n-1) + fib(n-2). Uma forma de calcular fib(n) e por chamadas recursivas: para fib(4), a arvore de chamadas tem 8 chamadas recursivas (sem contar a chamada inicial) e o resultado e 3.\n\n' +
      'Entrada: a primeira linha tem um inteiro N, o numero de casos de teste. Cada caso tem um inteiro X (1 <= X <= 39).\n\n' +
      'Saida: para cada caso, uma linha no formato "fib(n) = num_calls calls = result", onde num_calls e o numero de chamadas recursivas e result e o valor de fib(n), sempre com um espaco antes e depois de cada sinal de igual.',
    scaffold: `import java.util.Scanner;

public class Principal {
  static int[] fib = new int[40];
  static int[] chamadas = new int[40];

  public static void main(String[] args) {
    preencher(39);
    Scanner in = new Scanner(System.in);
    int n = in.nextInt();
    for (int i = 0; i < n; i++) {
      int x = in.nextInt();
      System.out.println("fib(" + x + ") = " + chamadas[x] + " calls = " + fib[x]);
    }
  }

  static void preencher(int max) {
    // implementar: fib[i] e chamadas[i] (chamadas recursivas que o calculo de fib(i) faz), para i = 0..max
  }
}`,
    visual: visual('array', 'Contar a arvore sem percorre-la', 'fib(n) chama fib(n-1) e fib(n-2) (2 chamadas) e cada uma delas faz as suas: chamadas(n) = chamadas(n-1) + chamadas(n-2) + 2.', ['chamadas(0) = chamadas(1) = 0', '+ 2 por nivel', 'tabela ate 39']),
    step: functionChoiceStep({
      id: 'code-prova1-pratica-fibonacci-chamadas-step',
      prompt: 'Escreva o corpo de preencher(max).',
      variants: [
        {
          id: 'iterativo',
          label: 'Tabela iterativa',
          signature: 'static void preencher(int max)',
          solution: `static void preencher(int max) {
  fib[0] = 0;
  fib[1] = 1;
  chamadas[0] = 0;
  chamadas[1] = 0;
  for (int i = 2; i <= max; i++) {
    fib[i] = fib[i - 1] + fib[i - 2];
    chamadas[i] = chamadas[i - 1] + chamadas[i - 2] + 2;
  }
}`,
          requiredFragments: [
            req('fib', 'recorrencia de Fibonacci', 'fib[i] = fib[i - 1] + fib[i - 2];'),
            req('calls', 'recorrencia das chamadas: as duas subarvores + as 2 chamadas feitas agora', 'chamadas[i - 1] + chamadas[i - 2] + 2'),
          ],
          lineExplanations: [{ code: 'chamadas[i] = chamadas[i - 1] + chamadas[i - 2] + 2;', note: 'fib(i) faz 2 chamadas diretas; cada uma faz as proprias chamadas: somam-se as duas subarvores.' }],
        },
        {
          id: 'recursivo-memo',
          label: 'Recursivo com memorizacao',
          signature: 'static void preencher(int max)',
          solution: `static void preencher(int max) {
  for (int i = 0; i <= max; i++) {
    chamadas[i] = -1;
  }
  calcular(max);
}

static int calcular(int n) {
  if (chamadas[n] == -1) {
    if (n <= 1) {
      fib[n] = n;
      chamadas[n] = 0;
    } else {
      calcular(n - 1);
      calcular(n - 2);
      fib[n] = fib[n - 1] + fib[n - 2];
      chamadas[n] = chamadas[n - 1] + chamadas[n - 2] + 2;
    }
  }
  return fib[n];
}`,
          requiredFragments: [
            req('memo', 'so calcula o que ainda nao esta na tabela', 'if (chamadas[n] == -1)'),
            req('calls', 'recorrencia das chamadas', 'chamadas[n - 1] + chamadas[n - 2] + 2'),
          ],
          lineExplanations: [{ code: 'if (chamadas[n] == -1) {', note: 'Memorizacao: cada fib(i) e calculado uma vez so, em vez de milhoes de vezes na arvore ingenua.' }],
        },
      ],
      mistakeTag: 'missing-base-case',
      explanation: 'A recursao ingenua com um contador global funciona, mas fib(39) faz 204.668.308 chamadas — com varios casos de teste, estoura o 1s. A tabela custa Theta(39) uma vez e cada resposta sai em Theta(1).',
    }),
  },
  {
    id: 'code-prova1-pratica-lc-pow',
    domainId: 'somatorio',
    moduleId: 'recursividade',
    title: 'LeetCode 50: Pow(x, n)',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-lc-pow',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: leetcode('50', 'powx-n', 'Pow(x, n)'),
    samples: [
      { input: 'x = 2.00000, n = 10', output: '1024.00000' },
      { input: 'x = 2.10000, n = 3', output: '9.26100' },
      { input: 'x = 2.00000, n = -2', output: '0.25000' },
    ],
    goal: 'Potencia recursiva em Theta(log n) (divide o expoente por 2) e o caso n = -2^31.',
    stem:
      'Implemente pow(x, n), que calcula x elevado a n.\n\n' +
      'Entrada: o real x (-100.0 < x < 100.0) e o inteiro n (-2^31 <= n <= 2^31 - 1), parametros do metodo. Garantias: x nao e zero ou n > 0, e -10^4 <= x^n <= 10^4.\n\n' +
      'Saida: o valor de x^n (mostrado com 5 casas decimais). Por exemplo, 2^-2 = 1/2^2 = 1/4 = 0.25.',
    scaffold: `class Solution {
    public double myPow(double x, int n) {
        // implementar
    }
}`,
    visual: visual('array', 'Metade do expoente', 'x^n = (x^(n/2))^2, vezes x se n for impar: o expoente cai pela metade a cada chamada.', ['x^n = (x^(n/2))^2', 'impar: * x', 'negativo: 1 / x^(-n)']),
    step: functionStep({
      id: 'code-prova1-pratica-lc-pow-step',
      prompt: 'Escreva myPow(x, n) (pode criar um auxiliar recursivo potencia(x, n) com n long).',
      signature: 'public double myPow(double x, int n)',
      solution: `public double myPow(double x, int n) {
  long expoente = n;
  double resp;
  if (expoente < 0) {
    resp = 1 / potencia(x, -expoente);
  } else {
    resp = potencia(x, expoente);
  }
  return resp;
}

private double potencia(double x, long n) {
  double resp = 1;
  if (n > 0) {
    double metade = potencia(x, n / 2);
    resp = metade * metade;
    if (n % 2 == 1) {
      resp = resp * x;
    }
  }
  return resp;
}`,
      requiredFragments: [
        req('long', 'expoente em long: -(-2^31) nao cabe em int', 'long expoente = n;'),
        req('negative', 'expoente negativo vira 1 / x^(-n)', '1 / potencia(x, -expoente)'),
        req('half', 'uma chamada so, com metade do expoente', 'double metade = potencia(x, n / 2);'),
        req('odd', 'expoente impar multiplica mais um x', 'if (n % 2 == 1)'),
      ],
      lineExplanations: [
        { code: 'long expoente = n;', note: 'Armadilha: com n = -2147483648, "-n" em int continua negativo (estouro). Em long da 2147483648 certinho.' },
        { code: 'double metade = potencia(x, n / 2);', note: 'Chamar potencia(x, n / 2) DUAS vezes (metade * metade direto) voltaria a ser Theta(n) chamadas.' },
      ],
      mistakeTag: 'missing-base-case',
      explanation: 'T(n) = T(n/2) + 1 => Theta(log n) chamadas. Multiplicar x por ele mesmo n vezes seria Theta(n) — ate 2 * 10^9 multiplicacoes.',
    }),
  },
];
