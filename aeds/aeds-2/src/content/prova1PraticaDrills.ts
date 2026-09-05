import type { CodeDrill, FunctionRequirement, FunctionStep, StructureVisual } from '../types/content';

/**
 * Exercicios de prova pratica (estilo BeeCrowd/Verde) pra Prova 1: mesmo
 * escopo da prova teorica (ordenacao, fila, pilha, lista), so que como
 * programa completo com entrada/saida, no lugar de um metodo isolado. Sem
 * imagem de prova pratica real pra usar de referencia (ver
 * docs/prova1-format.md) — formato baseado na skill aeds2 e nas regras em
 * docs/regras-professor.md (Java/C ou primitivos + MyIO/String/Scanner, um
 * arquivo por questao, leitura de inteiro invalido vira zero).
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
    title: 'Pratica: ordenar vetor (insertion sort)',
    source: 'prova1-pratica',
    difficulty: 'basico',
    repetitionGroup: 'prova1-pratica-ordenacao',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Ler entrada, ordenar e imprimir no formato pedido — o basico de toda prova pratica.',
    stem:
      'Leia um inteiro n e, em seguida, n inteiros. Imprima os n valores em ordem crescente, um por linha, usando insertion sort.\n\n' +
      'Entrada: a primeira linha tem n; a segunda linha tem n inteiros separados por espaco.\n\n' +
      'Saida: os n valores ordenados, um por linha.\n\n' +
      'Exemplo de entrada:\n5\n5 3 8 1 9\n\nExemplo de saida:\n1\n3\n5\n8\n9',
    scaffold: `import java.util.Scanner;

public class Principal {
  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    int n = in.nextInt();
    int[] array = new int[n];
    for (int i = 0; i < n; i++) {
      array[i] = in.nextInt();
    }
    insertionSort(array);
    for (int i = 0; i < n; i++) {
      System.out.println(array[i]);
    }
  }

  static void insertionSort(int[] array) {
    // implementar
  }
}`,
    visual: visual('array', 'Ler, ordenar, imprimir', 'O esqueleto de entrada/saida ja esta pronto; falta so o algoritmo.', ['ler n', 'ler n valores', 'ordenar', 'imprimir']),
    step: functionStep({
      id: 'code-prova1-pratica-ordenacao-step',
      prompt: 'Escreva o corpo de insertionSort(array).',
      signature: 'static void insertionSort(int[] array)',
      solution: `static void insertionSort(int[] array) {
  for (int i = 1; i < array.length; i++) {
    int chave = array[i];
    int j = i - 1;
    while (j >= 0 && array[j] > chave) {
      array[j + 1] = array[j];
      j--;
    }
    array[j + 1] = chave;
  }
}`,
      requiredFragments: [
        req('for', 'comeca em 1', 'for (int i = 1; i < array.length; i++)'),
        req('key', 'guarda a chave', 'int chave = array[i];'),
        req('while', 'desloca maiores', 'while (j >= 0 && array[j] > chave)'),
        req('insert', 'encaixa a chave', 'array[j + 1] = chave;'),
      ],
      lineExplanations: [{ code: 'System.out.println(array[i]);', note: 'Cada valor numa linha, exatamente como o enunciado pede — formato de saida errado zera a questao no Verde.' }],
      mistakeTag: 'algorithm-confusion',
      explanation: 'O algoritmo e o mesmo da prova teorica; a diferenca da pratica e o cuidado extra com o formato exato de entrada e saida.',
    }),
  },
  {
    id: 'code-prova1-pratica-fila',
    domainId: 'vetores',
    moduleId: 'fila',
    title: 'Pratica: simular fila circular',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-fila',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Traduzir a fila circular estatica pra um programa que le e executa comandos.',
    stem:
      'Implemente uma fila circular de capacidade 10. Leia um inteiro m e, em seguida, m operacoes. Cada operacao e "I x" (insere x) ou "R" (remove e imprime o valor removido, ou -1 se a fila estiver vazia). Insercoes em fila cheia sao ignoradas silenciosamente.\n\n' +
      'Entrada: a primeira linha tem m; cada uma das m linhas seguintes tem uma operacao.\n\n' +
      'Saida: uma linha para cada operacao "R", com o valor removido.\n\n' +
      'Exemplo de entrada:\n4\nI 10\nI 20\nR\nR\n\nExemplo de saida:\n10\n20',
    scaffold: `import java.util.Scanner;

public class Principal {
  static int[] array = new int[11];
  static int primeiro = 0, ultimo = 0;

  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    int m = in.nextInt();
    for (int k = 0; k < m; k++) {
      String op = in.next();
      if (op.equals("I")) {
        int x = in.nextInt();
        inserir(x);
      } else {
        System.out.println(remover());
      }
    }
  }

  static void inserir(int x) {
    // implementar
  }

  static int remover() {
    // implementar (retorna -1 se a fila estiver vazia)
  }
}`,
    visual: visual('queue', 'Fila circular via comandos', 'Cada linha de entrada e um comando I ou R.', ['I 10', 'I 20', 'R -> 10', 'R -> 20']),
    step: functionStep({
      id: 'code-prova1-pratica-fila-step',
      prompt: 'Escreva o corpo de inserir(x) e remover().',
      signature: 'static void inserir(int x)',
      solution: `static void inserir(int x) {
  if (((ultimo + 1) % array.length) != primeiro) {
    array[ultimo] = x;
    ultimo = (ultimo + 1) % array.length;
  }
}

static int remover() {
  int resp = -1;
  if (primeiro != ultimo) {
    resp = array[primeiro];
    primeiro = (primeiro + 1) % array.length;
  }
  return resp;
}`,
      requiredFragments: [
        req('insert-guard', 'ignora insercao se a fila estiver cheia', 'if (((ultimo + 1) % array.length) != primeiro)'),
        req('remove-default', 'comeca assumindo vazia (-1)', 'int resp = -1;'),
        req('remove-guard', 'so remove se nao estiver vazia', 'if (primeiro != ultimo)'),
      ],
      lineExplanations: [{ code: 'int resp = -1;', note: 'O enunciado pede -1 em vez de excecao — prova pratica usa valor sentinela, nao throws.' }],
      mistakeTag: 'lost-pointer',
      explanation: 'Mesma fila circular estatica de sempre; a diferenca da pratica e devolver um valor especial (-1) em vez de lancar excecao.',
    }),
  },
  {
    id: 'code-prova1-pratica-pilha',
    domainId: 'vetores',
    moduleId: 'pilha',
    title: 'Pratica: parenteses balanceados',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-pilha',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Aplicar pilha pra um problema classico de validacao.',
    stem:
      'Leia uma linha de texto contendo parenteses (), colchetes [] e chaves {} (outros caracteres devem ser ignorados). Imprima "balanceada" se todos abrirem e fecharem na ordem certa, ou "nao balanceada" caso contrario.\n\n' +
      'Entrada: uma linha de texto.\n\n' +
      'Saida: "balanceada" ou "nao balanceada".\n\n' +
      'Exemplo de entrada:\na(b[c]{d})e\n\nExemplo de saida:\nbalanceada',
    scaffold: `import java.util.Scanner;

public class Principal {
  static char[] pilha = new char[1000];
  static int topo = -1;

  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    String s = in.nextLine();
    System.out.println(balanceada(s) ? "balanceada" : "nao balanceada");
  }

  static boolean balanceada(String s) {
    // implementar
  }
}`,
    visual: visual('stack', 'Pilha de aberturas', 'Cada fechamento precisa casar com o topo da pilha.', ['(', '[', '{']),
    step: functionStep({
      id: 'code-prova1-pratica-pilha-step',
      prompt: 'Escreva o corpo de balanceada(s).',
      signature: 'static boolean balanceada(String s)',
      solution: `static boolean balanceada(String s) {
  boolean resp = true;
  for (int i = 0; i < s.length() && resp; i++) {
    char c = s.charAt(i);
    if (c == '(' || c == '[' || c == '{') {
      topo++;
      pilha[topo] = c;
    } else if (c == ')' || c == ']' || c == '}') {
      if (topo == -1) {
        resp = false;
      } else {
        char a = pilha[topo];
        topo--;
        resp = (a == '(' && c == ')') || (a == '[' && c == ']') || (a == '{' && c == '}');
      }
    }
  }
  return resp && topo == -1;
}`,
      requiredFragments: [
        req('open', 'empilha aberturas', "c == '(' || c == '[' || c == '{'"),
        req('close-empty', 'fechar com pilha vazia e erro', 'if (topo == -1)'),
        req('match', 'confere se o par bate', "(a == '(' && c == ')')"),
        req('final', 'exige pilha vazia no final', 'return resp && topo == -1;'),
      ],
      lineExplanations: [{ code: "char c = s.charAt(i);", note: 'Regra do professor: em String, so charAt e length sao permitidos.' }],
      mistakeTag: 'lost-pointer',
      explanation: 'String terminando com abertura sem fechar so e pega pelo "topo == -1" no final — sem essa checagem, "(a" passaria como balanceada.',
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
