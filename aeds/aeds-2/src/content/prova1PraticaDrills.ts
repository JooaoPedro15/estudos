import type { CodeDrill, FunctionRequirement, FunctionStep, StructureVisual } from '../types/content';

/**
 * Exercicios de prova pratica (estilo BeeCrowd/Verde) pra Prova 1: mesmo
 * escopo da prova teorica (ordenacao, fila, pilha, lista), so que como
 * programa completo com entrada/saida, no lugar de um metodo isolado.
 *
 * Ordenacao, fila e pilha sao problemas REAIS do URI/beecrowd (mesmo
 * enunciado, mesmos exemplos de entrada/saida — a ideia e treinar a
 * questao que pode cair literalmente igual no Verde):
 *  - URI 1162 "Train Swapping" (ordenacao: numero minimo de trocas
 *    adjacentes pra ordenar, o mesmo que a contagem de trocas do bubble
 *    sort)
 *  - URI 1110 "Throwing Cards Away" (fila: descarta o topo, manda o
 *    proximo pro fim, repete)
 *  - URI 1068 "Balanco de Parenteses I" (pilha: so parenteses, sem
 *    colchete/chave)
 *  - URI 2929 "Smallest on the Stack" (pilha, mais avancado: PUSH/POP/MIN
 *    com pilha auxiliar de minimos)
 * Estatutos consultados via web.archive.org (urionlinejudge.com.br), com
 * a prosa traduzida pro portugues e os valores de entrada/saida mantidos
 * exatamente como no problema original.
 *
 * "Lista" nao teve um problema real equivalente encontrado (o tema
 * "insercao/remocao com deslocamento" nao aparece como uma categoria
 * isolada no URI/beecrowd) — o exercicio abaixo continua sendo uma
 * questao autoral no estilo BeeCrowd, nao uma copia de um problema real.
 */

function req(id: string, label: string, code: string): FunctionRequirement {
  return { id, label, code };
}

function visual(kind: StructureVisual['kind'], title: string, caption: string, labels: string[]): StructureVisual {
  return { kind, title, caption, labels };
}

type FunctionExamStep = FunctionStep & { skillId: 'program' };

function functionStep(step: Omit<FunctionExamStep, 'kind' | 'skillId'>): FunctionExamStep {
  return { kind: 'function', skillId: 'program', ...step };
}

export const prova1PraticaDrillCatalog: CodeDrill[] = [
  {
    id: 'code-prova1-pratica-ordenacao',
    domainId: 'ordenacao',
    title: 'Pratica: numero minimo de trocas pra ordenar (URI 1162)',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-ordenacao',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Contar trocas de um bubble sort de verdade, no lugar de so ordenar — questao real do URI/beecrowd.',
    stem:
      'Problema real: URI 1162 "Train Swapping". Um trem tem vagoes numerados; o unico movimento permitido e trocar dois vagoes ADJACENTES de posicao. ' +
      'Dada a ordem atual dos vagoes (uma permutacao de 1 a L), calcule o numero MINIMO de trocas adjacentes necessarias pra deixar os vagoes em ordem crescente (1, 2, 3, ..., L).\n\n' +
      'Entrada: a primeira linha tem um inteiro N (numero de casos de teste). Cada caso de teste tem duas linhas: a primeira com um inteiro L (0 <= L <= 50), a segunda com uma permutacao dos numeros de 1 a L.\n\n' +
      'Saida: para cada caso, uma linha no formato "Optimal train swapping takes S swaps." (S e o numero de trocas).\n\n' +
      'Exemplo de entrada:\n3\n3\n1 3 2\n4\n4 3 2 1\n2\n2 1\n\nExemplo de saida:\nOptimal train swapping takes 1 swaps.\nOptimal train swapping takes 6 swaps.\nOptimal train swapping takes 1 swaps.',
    scaffold: `import java.util.Scanner;

public class Principal {
  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    int n = in.nextInt();
    for (int c = 0; c < n; c++) {
      int l = in.nextInt();
      int[] vagoes = new int[l];
      for (int i = 0; i < l; i++) {
        vagoes[i] = in.nextInt();
      }
      System.out.println("Optimal train swapping takes " + contarTrocas(vagoes, l) + " swaps.");
    }
  }

  static int contarTrocas(int[] vagoes, int l) {
    // implementar
  }
}`,
    visual: visual(
      'array',
      'Trocas adjacentes = trocas do bubble sort',
      'O numero minimo de trocas adjacentes pra ordenar e exatamente o numero de trocas que o bubble sort faz.',
      ['compara vizinhos', 'troca se fora de ordem', 'conta cada troca'],
    ),
    step: functionStep({
      id: 'code-prova1-pratica-ordenacao-step',
      prompt: 'Escreva o corpo de contarTrocas(vagoes, l).',
      signature: 'static int contarTrocas(int[] vagoes, int l)',
      solution: `static int contarTrocas(int[] vagoes, int l) {
  int trocas = 0;
  for (int i = 0; i < l - 1; i++) {
    for (int j = 0; j < l - 1 - i; j++) {
      if (vagoes[j] > vagoes[j + 1]) {
        int temp = vagoes[j];
        vagoes[j] = vagoes[j + 1];
        vagoes[j + 1] = temp;
        trocas++;
      }
    }
  }
  return trocas;
}`,
      requiredFragments: [
        req('compare', 'compara vizinhos adjacentes', 'vagoes[j] > vagoes[j + 1]'),
        req('swap', 'troca os dois vizinhos fora de ordem', 'vagoes[j + 1] = temp;'),
        req('count', 'conta cada troca feita', 'trocas++;'),
      ],
      lineExplanations: [
        { code: 'trocas++;', note: 'O numero minimo de trocas adjacentes pra ordenar uma permutacao e sempre igual ao numero de inversoes dela — e o bubble sort resolve exatamente uma inversao por troca.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(l^2): dois lacos aninhados, o mesmo custo do bubble sort comum — aqui o valor que importa nao e o vetor ordenado, e sim quantas trocas ele fez.',
    }),
  },
  {
    id: 'code-prova1-pratica-fila',
    domainId: 'vetores',
    moduleId: 'fila',
    title: 'Pratica: descartar cartas em fila (URI 1110)',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-fila',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Simular fila de verdade (descarta a frente, manda a proxima pro fim) — questao real do URI/beecrowd.',
    stem:
      'Problema real: URI 1110 "Throwing Cards Away". Um baralho tem n cartas numeradas de 1 a n, com a carta 1 no topo. Repita a seguinte operacao enquanto houver pelo menos 2 cartas: ' +
      'descarte a carta do topo e mova a carta que ficou no topo pro fundo do baralho. Imprima a sequencia de cartas descartadas e, por fim, a carta que restou.\n\n' +
      'Entrada: varias linhas, cada uma com um inteiro n (n <= 50). A entrada termina com uma linha contendo 0 (nao processar essa linha).\n\n' +
      'Saida: para cada n, duas linhas: "Discarded cards: " seguido da sequencia descartada (separada por ", "), e "Remaining card: " seguido da carta restante.\n\n' +
      'Exemplo de entrada:\n7\n19\n10\n6\n0\n\nExemplo de saida (para n=7):\nDiscarded cards: 1, 3, 5, 7, 4, 2\nRemaining card: 6',
    scaffold: `import java.util.Scanner;

public class Principal {
  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    int n = in.nextInt();
    while (n != 0) {
      resolver(n);
      n = in.nextInt();
    }
  }

  static void resolver(int n) {
    // implementar: monta a fila 1..n, descarta e move ate sobrar 1, imprime no formato pedido
  }
}`,
    visual: visual(
      'queue',
      'Descarta a frente, manda a proxima pro fim',
      'Fila circular de capacidade n+1: primeiro e removido duas vezes por rodada, a segunda remocao volta pro fim.',
      ['descarta fila[primeiro]', 'move fila[primeiro] pro fim', 'repete ate sobrar 1'],
    ),
    step: functionStep({
      id: 'code-prova1-pratica-fila-step',
      prompt: 'Escreva o corpo de resolver(n).',
      signature: 'static void resolver(int n)',
      solution: `static void resolver(int n) {
  int[] fila = new int[n + 1];
  int primeiro = 0, ultimo = 0;
  for (int i = 1; i <= n; i++) {
    fila[ultimo] = i;
    ultimo = (ultimo + 1) % fila.length;
  }
  StringBuilder descartadas = new StringBuilder();
  while ((ultimo - primeiro + fila.length) % fila.length > 1) {
    if (descartadas.length() > 0) {
      descartadas.append(", ");
    }
    descartadas.append(fila[primeiro]);
    primeiro = (primeiro + 1) % fila.length;
    int mover = fila[primeiro];
    primeiro = (primeiro + 1) % fila.length;
    fila[ultimo] = mover;
    ultimo = (ultimo + 1) % fila.length;
  }
  System.out.println("Discarded cards: " + descartadas);
  System.out.println("Remaining card: " + fila[primeiro]);
}`,
      requiredFragments: [
        req('loop-condition', 'continua enquanto sobrar mais de uma carta na fila circular', '(ultimo - primeiro + fila.length) % fila.length > 1'),
        req('discard', 'descarta a carta da frente', 'descartadas.append(fila[primeiro]);'),
        req('move-read', 'le a proxima carta antes de mover', 'int mover = fila[primeiro];'),
        req('move-write', 'manda essa carta pro fim da fila', 'fila[ultimo] = mover;'),
      ],
      lineExplanations: [
        { code: '(ultimo - primeiro + fila.length) % fila.length > 1', note: 'Conta quantos elementos ainda tem na fila circular sem precisar de um contador separado — a mesma conta usada em qualquer fila circular do curso.' },
      ],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(n): cada carta e descartada ou movida exatamente uma vez ao longo de toda a simulacao.',
    }),
  },
  {
    id: 'code-prova1-pratica-pilha',
    domainId: 'vetores',
    moduleId: 'pilha',
    title: 'Pratica: parenteses balanceados (URI 1068)',
    source: 'prova1-pratica',
    difficulty: 'basico',
    repetitionGroup: 'prova1-pratica-pilha',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Aplicar pilha pro classico de validar parenteses — questao real do URI/beecrowd.',
    stem:
      'Problema real: URI 1068 "Balanco de Parenteses I". Dada uma expressao qualquer com parenteses, diga se a quantidade de parenteses esta correta, sem considerar o resto da expressao. ' +
      'Todo parentese que fecha precisa ter um parentese que abre correspondente antes dele, e a quantidade total de parenteses que abrem e que fecham deve ser igual.\n\n' +
      'Entrada: varias linhas, cada uma com uma expressao de ate 1000 caracteres, ate o fim da entrada.\n\n' +
      'Saida: para cada linha, "correct" se os parenteses estiverem corretos, ou "incorrect" caso contrario.\n\n' +
      'Exemplo de entrada:\na+(b*c)-2-a\n(a+b*(2-c)-2+a)*2\n(a*b-(2+c)\n2*(3-a))\n)3+b*(2-c)(\n\nExemplo de saida:\ncorrect\ncorrect\nincorrect\nincorrect\nincorrect',
    scaffold: `import java.util.Scanner;

public class Principal {
  static char[] pilha = new char[1000];
  static int topo;

  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    while (in.hasNextLine()) {
      String expressao = in.nextLine();
      System.out.println(balanceada(expressao) ? "correct" : "incorrect");
    }
  }

  static boolean balanceada(String expressao) {
    // implementar
  }
}`,
    visual: visual('stack', 'Pilha de aberturas', 'Cada ")" precisa casar com o "(" que esta no topo da pilha.', ['(', '(', ')', 'topo']),
    step: functionStep({
      id: 'code-prova1-pratica-pilha-step',
      prompt: 'Escreva o corpo de balanceada(expressao).',
      signature: 'static boolean balanceada(String expressao)',
      solution: `static boolean balanceada(String expressao) {
  topo = -1;
  boolean resp = true;
  for (int i = 0; i < expressao.length() && resp; i++) {
    char c = expressao.charAt(i);
    if (c == '(') {
      topo++;
      pilha[topo] = c;
    } else if (c == ')') {
      if (topo == -1) {
        resp = false;
      } else {
        topo--;
      }
    }
  }
  return resp && topo == -1;
}`,
      requiredFragments: [
        req('open', 'empilha cada abertura', 'topo++;'),
        req('close-empty', 'fechar com pilha vazia e erro', 'if (topo == -1)'),
        req('close-match', 'desempilha quando fecha certo', 'topo--;'),
        req('final', 'exige pilha vazia no final (sem abertura sobrando)', 'return resp && topo == -1;'),
      ],
      lineExplanations: [
        { code: 'return resp && topo == -1;', note: 'So contar os fechamentos nao basta: "(a" teria zero fechamentos errados mas fica com uma abertura sem par, por isso o "topo == -1" final e obrigatorio.' },
      ],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(m): m e o tamanho da expressao, cada caractere e visitado uma unica vez.',
    }),
  },
  {
    id: 'code-prova1-pratica-pilha-minimo',
    domainId: 'vetores',
    moduleId: 'pilha',
    title: 'Pratica: pilha com consulta de minimo (URI 2929)',
    source: 'prova1-pratica',
    difficulty: 'avancado',
    repetitionGroup: 'prova1-pratica-pilha-minimo',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Manter uma segunda pilha auxiliar pra responder o minimo em O(1) — questao real do URI/beecrowd.',
    stem:
      'Problema real: URI 2929 "Smallest on the Stack". Implemente uma pilha de inteiros que suporta tres operacoes: "PUSH V" (empilha V), "POP" (desempilha) e "MIN" (informa o menor valor que esta na pilha agora). ' +
      'Para "MIN" com a pilha vazia, imprima "EMPTY". Para "POP" com a pilha vazia, tambem imprima "EMPTY".\n\n' +
      'Entrada: a primeira linha tem um inteiro N (numero de operacoes); cada uma das N linhas seguintes tem uma operacao.\n\n' +
      'Saida: uma linha para cada "MIN", com o menor valor da pilha (ou "EMPTY").\n\n' +
      'Exemplo de entrada:\n6\nPUSH 5\nPUSH 3\nMIN\nPOP\nMIN\nPOP\n\nExemplo de saida:\n3\n5',
    scaffold: `import java.util.Scanner;

public class Principal {
  static int[] pilha = new int[1000000];
  static int[] pilhaMin = new int[1000000];
  static int topo = -1;

  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    int n = in.nextInt();
    for (int i = 0; i < n; i++) {
      String op = in.next();
      if (op.equals("PUSH")) {
        push(in.nextInt());
      } else if (op.equals("POP")) {
        pop();
      } else {
        minimo();
      }
    }
  }

  static void push(int v) {
    // implementar
  }

  static void pop() {
    // implementar
  }

  static void minimo() {
    // implementar
  }
}`,
    visual: visual(
      'stack',
      'Pilha auxiliar de minimos',
      'Cada posicao da pilhaMin guarda o menor valor de baixo ate ali — MIN so olha o topo dela.',
      ['pilha: valores', 'pilhaMin: menor ate aqui', 'MIN le pilhaMin[topo]'],
    ),
    step: functionStep({
      id: 'code-prova1-pratica-pilha-minimo-step',
      prompt: 'Escreva o corpo de push(v), pop() e minimo().',
      signature: 'static void push(int v)',
      solution: `static void push(int v) {
  topo++;
  pilha[topo] = v;
  if (topo == 0 || v < pilhaMin[topo - 1]) {
    pilhaMin[topo] = v;
  } else {
    pilhaMin[topo] = pilhaMin[topo - 1];
  }
}

static void pop() {
  if (topo == -1) {
    System.out.println("EMPTY");
  } else {
    topo--;
  }
}

static void minimo() {
  if (topo == -1) {
    System.out.println("EMPTY");
  } else {
    System.out.println(pilhaMin[topo]);
  }
}`,
      requiredFragments: [
        req('push-base', 'primeiro elemento e o proprio minimo', 'topo == 0 || v < pilhaMin[topo - 1]'),
        req('push-propagate', 'senao, repete o minimo anterior', 'pilhaMin[topo] = pilhaMin[topo - 1];'),
        req('pop-empty', 'POP em pilha vazia imprime EMPTY', 'System.out.println("EMPTY");'),
        req('min-read', 'MIN so le o topo da pilha auxiliar', 'System.out.println(pilhaMin[topo]);'),
      ],
      lineExplanations: [
        { code: 'if (topo == 0 || v < pilhaMin[topo - 1])', note: 'A pilhaMin guarda, em cada posicao, o menor valor considerando tudo que esta abaixo dela — assim MIN responde em Theta(1), sem varrer a pilha inteira.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(1) por operacao: PUSH, POP e MIN so leem/escrevem o topo das duas pilhas, sem percorrer nada.',
    }),
  },
  {
    id: 'code-prova1-pratica-lista',
    domainId: 'vetores',
    moduleId: 'lista',
    title: 'Pratica: remover repetidos consecutivos',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-lista',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Compactar um vetor in-place, no estilo leitura/escrita ja visto na prova teorica.',
    stem:
      'Leia um inteiro n e, em seguida, n inteiros. Imprima os valores removendo repeticoes CONSECUTIVAS (mantendo so a primeira ocorrencia de cada sequencia igual), um por linha.\n\n' +
      'Entrada: a primeira linha tem n; a segunda linha tem n inteiros separados por espaco.\n\n' +
      'Saida: os valores restantes, um por linha, na ordem original.\n\n' +
      'Exemplo de entrada:\n6\n1 1 2 2 2 3\n\nExemplo de saida:\n1\n2\n3',
    scaffold: `import java.util.Scanner;

public class Principal {
  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    int n = in.nextInt();
    int[] array = new int[n];
    for (int i = 0; i < n; i++) {
      array[i] = in.nextInt();
    }
    int m = removerRepetidosConsecutivos(array, n);
    for (int i = 0; i < m; i++) {
      System.out.println(array[i]);
    }
  }

  static int removerRepetidosConsecutivos(int[] array, int n) {
    // implementar: compacta o array e retorna o novo tamanho
  }
}`,
    visual: visual('array', 'Leitura e escrita', 'So escreve quando o valor muda em relacao ao ultimo escrito.', ['leitura', 'escrita', 'muda?']),
    step: functionStep({
      id: 'code-prova1-pratica-lista-step',
      prompt: 'Escreva o corpo de removerRepetidosConsecutivos(array, n).',
      signature: 'static int removerRepetidosConsecutivos(int[] array, int n)',
      solution: `static int removerRepetidosConsecutivos(int[] array, int n) {
  if (n == 0) {
    return 0;
  }
  int escrita = 1;
  for (int leitura = 1; leitura < n; leitura++) {
    if (array[leitura] != array[escrita - 1]) {
      array[escrita] = array[leitura];
      escrita++;
    }
  }
  return escrita;
}`,
      requiredFragments: [
        req('empty', 'trata vetor vazio', 'if (n == 0)'),
        req('start', 'primeiro elemento sempre fica', 'int escrita = 1;'),
        req('compare', 'compara com o ultimo escrito, nao com o ultimo lido', 'array[leitura] != array[escrita - 1]'),
        req('write', 'so escreve quando muda', 'array[escrita] = array[leitura];'),
      ],
      lineExplanations: [{ code: 'array[leitura] != array[escrita - 1]', note: 'Comparar com escrita-1 (nao leitura-1) e o que torna a remocao "consecutiva" e nao "de duplicatas em geral".' }],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Padrao classico de leitura/escrita em uma passagem: Theta(n), sem vetor auxiliar.',
    }),
  },
];
