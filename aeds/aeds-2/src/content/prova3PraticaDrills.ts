import type { CodeDrill, FunctionRequirement, FunctionStep, StructureVisual } from '../types/content';

/**
 * Exercicios de prova pratica (estilo BeeCrowd/Verde) pra Prova 3: mesmo
 * escopo da prova teorica (AVL, hash, TRIE — u06-u08), so que como programa
 * completo com entrada/saida, em vez de um metodo isolado. Igual as outras
 * pratica*, usa arrays/classes primitivas simples, sem as classes oficiais
 * completas (alvinegra com rotacao, PATRICIA com i/j/k) que sao complexas
 * demais pro estilo "microide" da prova pratica — essas ficam para o Treino
 * de Codigo (prova3CodeDrills.ts).
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

export const prova3PraticaDrillCatalog: CodeDrill[] = [
  {
    id: 'code-prova3-pratica-trie-prefixo',
    domainId: 'trie',
    title: 'Pratica: existe alguma palavra com esse prefixo?',
    source: 'prova3-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova3-pratica-trie-prefixo',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Descer na TRIE letra por letra pra responder se algum prefixo existe, sem precisar de fimPalavra.',
    stem:
      'Leia um inteiro n e, em seguida, n palavras minusculas (sem acentos). Depois, leia uma palavra de consulta. Imprima "SIM" se alguma das n palavras tem a consulta como prefixo, ou "NAO" caso contrario.\n\n' +
      'Entrada: a primeira linha tem n; cada uma das n linhas seguintes tem uma palavra; a ultima linha tem a consulta.\n\n' +
      'Saida: "SIM" ou "NAO".\n\n' +
      'Exemplo de entrada:\n3\ncasa\ncarro\nbola\nca\n\nExemplo de saida:\nSIM',
    scaffold: `import java.util.Scanner;

public class Principal {
  static class No {
    No[] filhos = new No[26];
  }
  static No raiz = new No();

  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    int n = in.nextInt();
    for (int i = 0; i < n; i++) {
      inserir(in.next());
    }
    String consulta = in.next();
    System.out.println(existePrefixo(consulta) ? "SIM" : "NAO");
  }

  static void inserir(String palavra) {
    No atual = raiz;
    for (int i = 0; i < palavra.length(); i++) {
      int idx = palavra.charAt(i) - 'a';
      if (atual.filhos[idx] == null) {
        atual.filhos[idx] = new No();
      }
      atual = atual.filhos[idx];
    }
  }

  static boolean existePrefixo(String prefixo) {
    // implementar
  }
}`,
    visual: visual('trie', 'Descer letra por letra', 'Se conseguir descer todas as letras do prefixo sem cair num filho nulo, o prefixo existe.', ['idx = c - a', 'filhos[idx] == null?', 'desce']),
    step: functionStep({
      id: 'code-prova3-pratica-trie-prefixo-step',
      prompt: 'Escreva o corpo de existePrefixo(prefixo).',
      signature: 'static boolean existePrefixo(String prefixo)',
      solution: `static boolean existePrefixo(String prefixo) {
  No atual = raiz;
  boolean resp = true;
  for (int i = 0; i < prefixo.length() && resp; i++) {
    int idx = prefixo.charAt(i) - 'a';
    if (atual.filhos[idx] == null) {
      resp = false;
    } else {
      atual = atual.filhos[idx];
    }
  }
  return resp;
}`,
      requiredFragments: [
        req('guard', 'para assim que faltar um filho', 'for (int i = 0; i < prefixo.length() && resp; i++)'),
        req('index', 'transforma o caractere em indice 0-25', "int idx = prefixo.charAt(i) - 'a';"),
        req('missing', 'filho nulo derruba a resposta', 'resp = false;'),
        req('descend', 'desce um nivel quando o filho existe', 'atual = atual.filhos[idx];'),
      ],
      lineExplanations: [{ code: 'return resp;', note: 'Nao precisa checar fimPalavra: se o caminho existe, alguma palavra inserida passou por ali, entao o prefixo existe.' }],
      mistakeTag: 'prefix-vs-word',
      explanation: 'Custo Theta(p): p e o tamanho do prefixo, uma descida direta sem backtracking.',
    }),
  },
  {
    id: 'code-prova3-pratica-hash-colisoes',
    domainId: 'hash',
    title: 'Pratica: contar colisoes numa tabela hash encadeada',
    source: 'prova3-pratica',
    difficulty: 'basico',
    repetitionGroup: 'prova3-pratica-hash-colisoes',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Praticar hash com tratamento de colisao por encadeamento — a base antes de qualquer hash mais elaborada.',
    stem:
      'Leia dois inteiros m e n (m = tamanho da tabela, n = quantidade de chaves) e, em seguida, n inteiros. Insira cada chave no INICIO da lista da posicao hash(chave) = chave % m. Imprima quantas insercoes causaram colisao (a posicao ja estava ocupada antes de inserir).\n\n' +
      'Entrada: a primeira linha tem m e n; a segunda linha tem n inteiros separados por espaco.\n\n' +
      'Saida: um unico inteiro, o total de colisoes.\n\n' +
      'Exemplo de entrada:\n3 4\n1 4 7 2\n\nExemplo de saida:\n2',
    scaffold: `import java.util.Scanner;

public class Principal {
  static class Celula {
    int elemento;
    Celula prox;
  }
  static Celula[] tabela;

  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    int m = in.nextInt();
    int n = in.nextInt();
    tabela = new Celula[m];
    int colisoes = 0;
    for (int i = 0; i < n; i++) {
      colisoes += inserir(in.nextInt(), m);
    }
    System.out.println(colisoes);
  }

  static int inserir(int chave, int m) {
    // implementar: insere no inicio da lista da posicao e retorna 1 se houve colisao, 0 caso contrario
  }
}`,
    visual: visual('hash', 'Encadeamento separado', 'Cada posicao guarda uma lista; colisao e quando a posicao ja tinha alguem antes de inserir.', ['posicao = chave % m', 'ja ocupada?', 'encadeia no inicio']),
    step: functionStep({
      id: 'code-prova3-pratica-hash-colisoes-step',
      prompt: 'Escreva o corpo de inserir(chave, m).',
      signature: 'static int inserir(int chave, int m)',
      solution: `static int inserir(int chave, int m) {
  int posicao = chave % m;
  int colisao = (tabela[posicao] != null) ? 1 : 0;
  Celula nova = new Celula();
  nova.elemento = chave;
  nova.prox = tabela[posicao];
  tabela[posicao] = nova;
  return colisao;
}`,
      requiredFragments: [
        req('hash', 'calcula a posicao pela funcao hash', 'int posicao = chave % m;'),
        req('detect', 'confere ANTES de sobrescrever se ja tinha alguem', 'int colisao = (tabela[posicao] != null) ? 1 : 0;'),
        req('link', 'liga a celula nova na cabeca da lista existente', 'nova.prox = tabela[posicao];'),
        req('head', 'atualiza a cabeca da lista pra celula nova', 'tabela[posicao] = nova;'),
      ],
      lineExplanations: [{ code: 'int colisao = (tabela[posicao] != null) ? 1 : 0;', note: 'Precisa calcular a colisao ANTES de sobrescrever tabela[posicao], senao a informacao se perde.' }],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(1) por insercao: acesso direto ao indice, sem percorrer a lista.',
    }),
  },
  {
    id: 'code-prova3-pratica-avl-contar-folhas',
    domainId: 'avl',
    title: 'Pratica: contar folhas de uma arvore de busca',
    source: 'prova3-pratica',
    difficulty: 'basico',
    repetitionGroup: 'prova3-pratica-avl-folhas',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Aquecer com uma contagem estrutural simples antes de entrar em rotacoes e recoloracoes.',
    stem:
      'Leia um inteiro n e, em seguida, n inteiros distintos. Insira cada um numa arvore binaria de busca. Imprima quantos nos sao folhas (sem filho esquerdo e sem filho direito).\n\n' +
      'Entrada: a primeira linha tem n; a segunda linha tem n inteiros separados por espaco.\n\n' +
      'Saida: um unico inteiro, a quantidade de folhas.\n\n' +
      'Exemplo de entrada:\n5\n5 3 8 1 4\n\nExemplo de saida:\n2',
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
    System.out.println(contarFolhas(raiz));
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

  static int contarFolhas(No i) {
    // implementar
  }
}`,
    visual: visual('binary-tree', 'Folha = sem filho nenhum', 'So conta o no quando os dois lados sao nulos.', ['i.esq == null', 'i.dir == null', 'conta 1']),
    step: functionStep({
      id: 'code-prova3-pratica-avl-contar-folhas-step',
      prompt: 'Escreva o corpo de contarFolhas(i).',
      signature: 'static int contarFolhas(No i)',
      solution: `static int contarFolhas(No i) {
  int resp = 0;
  if (i != null) {
    if (i.esq == null && i.dir == null) {
      resp = 1;
    } else {
      resp = contarFolhas(i.esq) + contarFolhas(i.dir);
    }
  }
  return resp;
}`,
      requiredFragments: [
        req('empty', 'arvore/subarvore vazia conta 0', 'int resp = 0;'),
        req('leaf', 'checa os dois filhos nulos pra contar folha', 'i.esq == null && i.dir == null'),
        req('recurse', 'so recorre quando NAO e folha', 'resp = contarFolhas(i.esq) + contarFolhas(i.dir);'),
      ],
      lineExplanations: [{ code: 'i.esq == null && i.dir == null', note: 'Errar isso pra "so um lado null" contaria nos com um unico filho como folha, o que esta errado.' }],
      mistakeTag: 'missing-base-case',
      explanation: 'Custo Theta(n): visita cada no da arvore exatamente uma vez.',
    }),
  },
];
