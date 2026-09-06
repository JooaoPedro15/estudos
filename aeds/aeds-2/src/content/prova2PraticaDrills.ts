import type { CodeDrill, FunctionRequirement, FunctionStep, StructureVisual } from '../types/content';

/**
 * Exercicios de prova pratica (estilo BeeCrowd/Verde) pra Prova 2: mesmo
 * escopo da prova teorica (matriz, arvore binaria basica u04-u05), so que
 * como programa completo com entrada/saida, em vez de um metodo isolado.
 * Igual a prova1PraticaDrills.ts, usa arrays/classes primitivas simples
 * (nao as classes encadeadas com celula cabeca do Treino de Codigo) —
 * formato baseado na skill aeds2 e docs/regras-professor.md.
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

export const prova2PraticaDrillCatalog: CodeDrill[] = [
  {
    id: 'code-prova2-pratica-matriz-diagonal',
    domainId: 'vetores',
    moduleId: 'matriz',
    title: 'Pratica: soma da diagonal principal',
    source: 'prova2-pratica',
    difficulty: 'basico',
    repetitionGroup: 'prova2-pratica-matriz',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Aquecer com uma matriz simples antes de partir pra estruturas encadeadas mais pesadas.',
    stem:
      'Leia um inteiro n e, em seguida, uma matriz n x n de inteiros. Imprima a soma dos elementos da diagonal principal (linha == coluna).\n\n' +
      'Entrada: a primeira linha tem n; as n linhas seguintes tem n inteiros cada, separados por espaco.\n\n' +
      'Saida: um unico inteiro, a soma da diagonal.\n\n' +
      'Exemplo de entrada:\n3\n1 2 3\n4 5 6\n7 8 9\n\nExemplo de saida:\n15',
    scaffold: `import java.util.Scanner;

public class Principal {
  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    int n = in.nextInt();
    int[][] matriz = new int[n][n];
    for (int i = 0; i < n; i++) {
      for (int j = 0; j < n; j++) {
        matriz[i][j] = in.nextInt();
      }
    }
    System.out.println(somaDiagonal(matriz, n));
  }

  static int somaDiagonal(int[][] matriz, int n) {
    // implementar
  }
}`,
    visual: visual('matrix', 'Diagonal principal', 'Soma so as posicoes onde linha == coluna.', ['matriz[0][0]', 'matriz[1][1]', 'matriz[2][2]']),
    step: functionStep({
      id: 'code-prova2-pratica-matriz-diagonal-step',
      prompt: 'Escreva o corpo de somaDiagonal(matriz, n).',
      signature: 'static int somaDiagonal(int[][] matriz, int n)',
      solution: `static int somaDiagonal(int[][] matriz, int n) {
  int soma = 0;
  for (int i = 0; i < n; i++) {
    soma += matriz[i][i];
  }
  return soma;
}`,
      requiredFragments: [
        req('for', 'um unico laco, um indice so', 'for (int i = 0; i < n; i++)'),
        req('diagonal', 'acessa linha == coluna', 'soma += matriz[i][i];'),
      ],
      lineExplanations: [{ code: 'soma += matriz[i][i];', note: 'A diagonal principal usa o MESMO indice pra linha e coluna — nao precisa de laco duplo.' }],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(n): um unico laco de n passagens, sem depender do tamanho total da matriz (n^2).',
    }),
  },
  {
    id: 'code-prova2-pratica-abb-inserir-central',
    domainId: 'arvore',
    title: 'Pratica: inserir numa ABB e imprimir em ordem',
    source: 'prova2-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova2-pratica-abb-inserir',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Montar uma ABB a partir de uma entrada e mostrar o caminhamento central, a base de toda a Prova 2 sobre arvores.',
    stem:
      'Leia um inteiro n e, em seguida, n inteiros distintos. Insira cada um, na ordem lida, numa arvore binaria de busca. Imprima os elementos em caminhamento central (ordem crescente), separados por espaco.\n\n' +
      'Entrada: a primeira linha tem n; a segunda linha tem n inteiros separados por espaco.\n\n' +
      'Saida: os elementos em ordem crescente, separados por espaco, em uma linha.\n\n' +
      'Exemplo de entrada:\n5\n5 3 8 1 4\n\nExemplo de saida:\n1 3 4 5 8',
    scaffold: `import java.util.Scanner;

public class Principal {
  static class No {
    int elemento;
    No esq, dir;
    No(int elemento) { this.elemento = elemento; }
  }
  static No raiz;

  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    int n = in.nextInt();
    for (int i = 0; i < n; i++) {
      raiz = inserir(in.nextInt(), raiz);
    }
    caminharCentral(raiz);
    System.out.println();
  }

  static No inserir(int x, No i) {
    // implementar
  }

  static void caminharCentral(No i) {
    if (i != null) {
      caminharCentral(i.esq);
      System.out.print(i.elemento + " ");
      caminharCentral(i.dir);
    }
  }
}`,
    visual: visual('binary-tree', 'Inserir e depois percorrer', 'Cada insercao desce comparando com o no atual ate achar um lugar vazio.', ['x < i.elemento -> esq', 'x > i.elemento -> dir', 'i == null -> cria']),
    step: functionStep({
      id: 'code-prova2-pratica-abb-inserir-central-step',
      prompt: 'Escreva o corpo de inserir(x, i).',
      signature: 'static No inserir(int x, No i)',
      solution: `static No inserir(int x, No i) {
  if (i == null) {
    i = new No(x);
  } else if (x < i.elemento) {
    i.esq = inserir(x, i.esq);
  } else if (x > i.elemento) {
    i.dir = inserir(x, i.dir);
  }
  return i;
}`,
      requiredFragments: [
        req('base', 'lugar vazio: cria o no novo', 'i = new No(x);'),
        req('left', 'menor desce pra esquerda', 'i.esq = inserir(x, i.esq);'),
        req('right', 'maior desce pra direita', 'i.dir = inserir(x, i.dir);'),
        req('return', 'devolve o no (novo ou o mesmo)', 'return i;'),
      ],
      lineExplanations: [{ code: 'return i;', note: 'Padrao classico de ABB: cada chamada recursiva reatribui o ponteiro do filho com o retorno, ligando o no novo na arvore.' }],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(h) por insercao (h = altura da arvore); no total, Theta(n * h) pra montar a arvore inteira com n insercoes.',
    }),
  },
  {
    id: 'code-prova2-pratica-abb-altura',
    domainId: 'arvore',
    title: 'Pratica: altura da arvore binaria de busca',
    source: 'prova2-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova2-pratica-abb-altura',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Calcular altura recursivamente, usando a convencao altura(vazia) = -1 e altura(folha) = 0.',
    stem:
      'Leia um inteiro n e, em seguida, n inteiros distintos. Insira cada um numa arvore binaria de busca. Imprima a altura da arvore resultante (arvore vazia tem altura -1; um unico no tem altura 0).\n\n' +
      'Entrada: a primeira linha tem n; a segunda linha tem n inteiros separados por espaco.\n\n' +
      'Saida: um unico inteiro, a altura da arvore.\n\n' +
      'Exemplo de entrada:\n4\n5 3 8 1\n\nExemplo de saida:\n2',
    scaffold: `import java.util.Scanner;

public class Principal {
  static class No {
    int elemento;
    No esq, dir;
    No(int elemento) { this.elemento = elemento; }
  }
  static No raiz;

  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    int n = in.nextInt();
    for (int i = 0; i < n; i++) {
      raiz = inserir(in.nextInt(), raiz);
    }
    System.out.println(getAltura(raiz));
  }

  static No inserir(int x, No i) {
    if (i == null) {
      i = new No(x);
    } else if (x < i.elemento) {
      i.esq = inserir(x, i.esq);
    } else if (x > i.elemento) {
      i.dir = inserir(x, i.dir);
    }
    return i;
  }

  static int getAltura(No i) {
    // implementar
  }
}`,
    visual: visual('binary-tree', 'Altura = 1 + maior altura dos filhos', 'Subarvore vazia conta -1; a altura de um no e 1 mais o maior dos dois lados.', ['getAltura(esq)', 'getAltura(dir)', '1 + max(...)']),
    step: functionStep({
      id: 'code-prova2-pratica-abb-altura-step',
      prompt: 'Escreva o corpo de getAltura(i).',
      signature: 'static int getAltura(No i)',
      solution: `static int getAltura(No i) {
  int resp;
  if (i == null) {
    resp = -1;
  } else {
    int alturaEsq = getAltura(i.esq);
    int alturaDir = getAltura(i.dir);
    resp = 1 + Math.max(alturaEsq, alturaDir);
  }
  return resp;
}`,
      requiredFragments: [
        req('base', 'vazia tem altura -1', 'resp = -1;'),
        req('recurse', 'calcula os dois lados antes de combinar', 'int alturaEsq = getAltura(i.esq);'),
        req('combine', 'soma 1 ao maior dos dois lados', 'resp = 1 + Math.max(alturaEsq, alturaDir);'),
      ],
      lineExplanations: [{ code: 'resp = -1;', note: 'Convencao padrao: subarvore vazia = altura -1, folha = altura 0 (1 + max(-1, -1) = 0).' }],
      mistakeTag: 'wrong-case-analysis',
      explanation: 'Custo Theta(n): visita cada no da arvore exatamente uma vez.',
    }),
  },
];
