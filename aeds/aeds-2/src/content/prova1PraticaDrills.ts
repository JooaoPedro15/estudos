import type { CodeDrill, FunctionRequirement, FunctionStep, StructureVisual } from '../types/content';

/**
 * Exercicios de prova pratica (estilo BeeCrowd/Verde) pra Prova 1: mesmo
 * escopo da prova teorica (ordenacao, fila, pilha, lista, busca), so que
 * como programa completo com entrada/saida, no lugar de um metodo isolado.
 *
 * Praticamente todos sao problemas REAIS do URI/beecrowd (mesmo
 * enunciado, mesmos exemplos de entrada/saida — a ideia e treinar a
 * questao que pode cair literalmente igual no Verde):
 *  - URI 1162 "Train Swapping" (ordenacao: numero minimo de trocas
 *    adjacentes pra ordenar, o mesmo que a contagem de trocas do bubble
 *    sort)
 *  - URI 1566 "Altura" (ordenacao pura, N grande)
 *  - URI 1259 "Even and Odd" (ordenacao com comparador customizado:
 *    pares crescente, depois impares decrescente)
 *  - URI 1025 "Where is the Marble?" (ordenar + busca binaria da
 *    primeira ocorrencia)
 *  - URI 1110 "Throwing Cards Away" (fila: descarta o topo, manda o
 *    proximo pro fim, repete)
 *  - URI 1068 "Balanco de Parenteses I" (pilha: so parenteses, sem
 *    colchete/chave)
 *  - URI 2929 "Smallest on the Stack" (pilha, avancado: PUSH/POP/MIN com
 *    pilha auxiliar de minimos)
 *  - URI 1062 "Trilhos" (pilha: e possivel reordenar os vagoes 1..N pra
 *    sair na ordem pedida usando so uma pilha?)
 *  - URI 1340 "Eu Posso Adivinhar a Estrutura de Dados!" (desafio: simula
 *    pilha, fila e fila de prioridade em paralelo pra descobrir qual(is)
 *    ainda sao compativeis com a sequencia de operacoes)
 * Estatutos consultados via web.archive.org (urionlinejudge.com.br, ja
 * que o judge atual exige login), com a prosa traduzida pro portugues e
 * os valores de entrada/saida mantidos exatamente como no problema
 * original. Todas as solucoes foram compiladas e rodadas de verdade
 * contra os exemplos oficiais antes de entrar no catalogo.
 *
 * Pesquisado tambem (e descartado por fugir do escopo de estruturas de
 * dados/ordenacao da Prova 1): 1022 TDA Racional, 1023 Estiagem, 1069
 * Diamantes e Areia, 1077 Infixa pra Posfixa (avancado demais pra essa
 * rodada), 1088 Bolhas e Baldes (e teoria dos jogos, nao bubble sort de
 * verdade), 1244 Ordenacao por Tamanho (tem aviso de direitos autorais
 * da TopCoder proibindo reproducao), 1256 Tabelas Hash (e escopo de
 * Prova 3), 1281 Ida a Feira e 1430 Composicao de Jingles (parsing de
 * string, nao estrutura de dados), 1258 Camisetas (ordenacao por 3
 * chaves — real e no escopo, mas fica pra uma proxima rodada por ser bem
 * mais complexo de implementar e verificar com confianca).
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
    id: 'code-prova1-pratica-ordenacao-altura',
    domainId: 'ordenacao',
    title: 'Pratica: ordenar alturas (URI 1566)',
    source: 'prova1-pratica',
    difficulty: 'basico',
    repetitionGroup: 'prova1-pratica-ordenacao-altura',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Ordenacao pura, com varios casos de teste — questao real do URI/beecrowd.',
    stem:
      'Problema real: URI 1566 "Altura". Leia a altura (em cm) de todas as pessoas de uma cidade e imprima essas alturas em ordem crescente, numa unica linha separadas por espaco.\n\n' +
      'Entrada: a primeira linha tem um inteiro NC (numero de cidades/casos de teste). Cada caso de teste tem duas linhas: a primeira com um inteiro N (numero de pessoas), a segunda com as N alturas separadas por espaco.\n\n' +
      'Saida: para cada caso, uma linha com as alturas em ordem crescente, separadas por espaco.\n\n' +
      'Exemplo de entrada:\n2\n10\n65 31 37 37 72 76 61 35 57 37\n6\n133 55 67 166 112 41\n\nExemplo de saida:\n31 35 37 37 37 57 61 65 72 76\n41 55 67 112 133 166\n\n' +
      'Obs.: no problema real, N pode chegar a 3 milhoes e pede leitura/escrita rapida (o algoritmo ideal la e counting sort); aqui o foco e so o algoritmo de ordenacao em si.',
    scaffold: `import java.util.Scanner;

public class Principal {
  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    int nc = in.nextInt();
    for (int c = 0; c < nc; c++) {
      int n = in.nextInt();
      int[] alturas = new int[n];
      for (int i = 0; i < n; i++) {
        alturas[i] = in.nextInt();
      }
      ordenar(alturas);
      StringBuilder saida = new StringBuilder();
      for (int i = 0; i < n; i++) {
        if (i > 0) {
          saida.append(" ");
        }
        saida.append(alturas[i]);
      }
      System.out.println(saida);
    }
  }

  static void ordenar(int[] alturas) {
    // implementar
  }
}`,
    visual: visual('array', 'Ordenar e imprimir espacado', 'Mesmo algoritmo de sempre; o cuidado extra e montar a linha de saida com espacos entre os valores.', ['ordenar', 'juntar com espaco', 'uma linha por caso']),
    step: functionStep({
      id: 'code-prova1-pratica-ordenacao-altura-step',
      prompt: 'Escreva o corpo de ordenar(alturas).',
      signature: 'static void ordenar(int[] alturas)',
      solution: `static void ordenar(int[] alturas) {
  for (int i = 1; i < alturas.length; i++) {
    int chave = alturas[i];
    int j = i - 1;
    while (j >= 0 && alturas[j] > chave) {
      alturas[j + 1] = alturas[j];
      j--;
    }
    alturas[j + 1] = chave;
  }
}`,
      requiredFragments: [
        req('for', 'comeca em 1', 'for (int i = 1; i < alturas.length; i++)'),
        req('key', 'guarda a chave', 'int chave = alturas[i];'),
        req('while', 'desloca maiores', 'while (j >= 0 && alturas[j] > chave)'),
        req('insert', 'encaixa a chave', 'alturas[j + 1] = chave;'),
      ],
      lineExplanations: [{ code: 'saida.append(" ");', note: 'So adiciona espaco ANTES de valores que nao sao o primeiro — senao sobra um espaco extra no comeco da linha.' }],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Mesmo insertion sort de sempre; a diferenca da pratica e formatar a saida como uma unica linha espacada em vez de um valor por linha.',
    }),
  },
  {
    id: 'code-prova1-pratica-ordenacao-pares-impares',
    domainId: 'ordenacao',
    title: 'Pratica: pares crescente, impares decrescente (URI 1259)',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-ordenacao-pares-impares',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Adaptar o criterio de comparacao do insertion sort — questao real do URI/beecrowd.',
    stem:
      'Problema real: URI 1259 "Even and Odd". Leia N inteiros nao negativos e ordene-os assim: primeiro os PARES em ordem CRESCENTE, depois os IMPARES em ordem DECRESCENTE.\n\n' +
      'Entrada: a primeira linha tem um inteiro N; cada uma das N linhas seguintes tem um inteiro.\n\n' +
      'Saida: os N valores reordenados, um por linha.\n\n' +
      'Exemplo de entrada:\n10\n4\n32\n34\n543\n3456\n654\n567\n87\n6789\n98\n\nExemplo de saida:\n4\n32\n34\n98\n654\n3456\n6789\n567\n543\n87',
    scaffold: `import java.util.Scanner;

public class Principal {
  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    int n = in.nextInt();
    int[] valores = new int[n];
    for (int i = 0; i < n; i++) {
      valores[i] = in.nextInt();
    }
    ordenar(valores);
    for (int i = 0; i < n; i++) {
      System.out.println(valores[i]);
    }
  }

  static void ordenar(int[] valores) {
    // implementar (pode criar um metodo auxiliar vemDepois(a, b))
  }
}`,
    visual: visual('array', 'Criterio de ordem customizado', 'Todo par vem antes de todo impar; dentro de cada grupo, a ordem muda de sentido.', ['par < par: crescente', 'impar < impar: decrescente', 'par sempre antes de impar']),
    step: functionStep({
      id: 'code-prova1-pratica-ordenacao-pares-impares-step',
      prompt: 'Escreva o corpo de ordenar(valores) (pode criar um metodo auxiliar vemDepois(a, b)).',
      signature: 'static void ordenar(int[] valores)',
      solution: `static void ordenar(int[] valores) {
  for (int i = 1; i < valores.length; i++) {
    int chave = valores[i];
    int j = i - 1;
    while (j >= 0 && vemDepois(valores[j], chave)) {
      valores[j + 1] = valores[j];
      j--;
    }
    valores[j + 1] = chave;
  }
}
private static boolean vemDepois(int a, int b) {
  boolean parA = a % 2 == 0;
  boolean parB = b % 2 == 0;
  boolean resp;
  if (parA != parB) {
    resp = parB;
  } else if (parA) {
    resp = a > b;
  } else {
    resp = a < b;
  }
  return resp;
}`,
      requiredFragments: [
        req('parity-split', 'par e impar nunca se misturam: par sempre vem antes', 'if (parA != parB)'),
        req('even-order', 'pares entre si: crescente', 'resp = a > b;'),
        req('odd-order', 'impares entre si: decrescente', 'resp = a < b;'),
        req('reuse-insertion', 'reaproveita o insertion sort, so troca a comparacao', 'while (j >= 0 && vemDepois(valores[j], chave))'),
      ],
      lineExplanations: [{ code: 'if (parA != parB) {', note: 'Trocar o algoritmo de ordenacao nao e necessario — so o CRITERIO de comparacao muda, o insertion sort continua igual.' }],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(n^2) no pior caso, igual a qualquer insertion sort — o que muda de um exercicio pro outro e so a funcao de comparacao, nao a estrutura do algoritmo.',
    }),
  },
  {
    id: 'code-prova1-pratica-busca-binaria',
    domainId: 'ordenacao',
    title: 'Pratica: ordenar e buscar (URI 1025)',
    source: 'prova1-pratica',
    difficulty: 'avancado',
    repetitionGroup: 'prova1-pratica-busca-binaria',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Combinar ordenacao com busca binaria da primeira ocorrencia — questao real do URI/beecrowd.',
    stem:
      'Problema real: URI 1025 "Where is the Marble?". Leia N bolinhas (com numeros, sem ordem definida) e Q consultas. Ordene as bolinhas e, pra cada consulta x, diga a posicao (1-indexada) da PRIMEIRA bolinha com valor x, ou que ela nao foi encontrada.\n\n' +
      'Entrada: varios casos de teste. Cada um comeca com dois inteiros N e Q, seguidos de N valores das bolinhas e depois Q valores consultados. Termina com uma linha "0 0".\n\n' +
      'Saida: para cada caso, imprima "CASE# k:" (k comecando em 1) e, pra cada consulta, "x found at y" ou "x not found".\n\n' +
      'Exemplo de entrada:\n4 1\n2\n3\n5\n1\n5\n5 2\n1\n3\n3\n3\n1\n2\n3\n0 0\n\nExemplo de saida:\nCASE# 1:\n5 found at 4\nCASE# 2:\n2 not found\n3 found at 3',
    scaffold: `import java.util.Scanner;

public class Principal {
  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    int caso = 1;
    int n = in.nextInt();
    int q = in.nextInt();
    while (n != 0 || q != 0) {
      int[] bolinhas = new int[n];
      for (int i = 0; i < n; i++) {
        bolinhas[i] = in.nextInt();
      }
      ordenar(bolinhas);
      System.out.println("CASE# " + caso + ":");
      for (int i = 0; i < q; i++) {
        int x = in.nextInt();
        int pos = buscarPrimeiro(bolinhas, x);
        if (pos == -1) {
          System.out.println(x + " not found");
        } else {
          System.out.println(x + " found at " + (pos + 1));
        }
      }
      caso++;
      n = in.nextInt();
      q = in.nextInt();
    }
  }

  static void ordenar(int[] bolinhas) {
    // implementar
  }

  static int buscarPrimeiro(int[] bolinhas, int x) {
    // implementar: busca binaria pela PRIMEIRA ocorrencia de x; -1 se nao existir
  }
}`,
    visual: visual('array', 'Ordena, depois busca binaria pela esquerda', 'Achar x na busca binaria nao basta: precisa continuar procurando mais a esquerda pra achar a PRIMEIRA ocorrencia.', ['ordenar', 'buscar meio', 'achou? continua a esquerda']),
    step: functionStep({
      id: 'code-prova1-pratica-busca-binaria-step',
      prompt: 'Escreva o corpo de ordenar(bolinhas) e buscarPrimeiro(bolinhas, x).',
      signature: 'static void ordenar(int[] bolinhas)',
      solution: `static void ordenar(int[] bolinhas) {
  for (int i = 1; i < bolinhas.length; i++) {
    int chave = bolinhas[i];
    int j = i - 1;
    while (j >= 0 && bolinhas[j] > chave) {
      bolinhas[j + 1] = bolinhas[j];
      j--;
    }
    bolinhas[j + 1] = chave;
  }
}

static int buscarPrimeiro(int[] bolinhas, int x) {
  int esq = 0, dir = bolinhas.length - 1, resp = -1;
  while (esq <= dir) {
    int meio = (esq + dir) / 2;
    if (bolinhas[meio] == x) {
      resp = meio;
      dir = meio - 1;
    } else if (bolinhas[meio] < x) {
      esq = meio + 1;
    } else {
      dir = meio - 1;
    }
  }
  return resp;
}`,
      requiredFragments: [
        req('binary-loop', 'busca binaria classica', 'while (esq <= dir)'),
        req('found-keep-left', 'achou, mas continua procurando mais a esquerda', 'resp = meio;'),
        req('go-right', 'meio menor que x: busca na metade direita', 'esq = meio + 1;'),
        req('go-left', 'meio maior que x: busca na metade esquerda', 'dir = meio - 1;'),
      ],
      lineExplanations: [
        { code: 'resp = meio;', note: 'Uma busca binaria comum pararia aqui e retornaria — mas o problema pede a PRIMEIRA ocorrencia, entao o codigo logo abaixo (dir = meio - 1) continua procurando mais a esquerda mesmo depois de achar.' },
      ],
      mistakeTag: 'incomplete-layer-search',
      explanation: 'Custo Theta(n log n) pra ordenar (insertion sort aqui, Theta(n^2) no pior caso — o professor aceitaria qualquer algoritmo de ordenacao ja visto) mais Theta(log n) por busca binaria.',
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
    id: 'code-prova1-pratica-pilha-trilhos',
    domainId: 'vetores',
    moduleId: 'pilha',
    title: 'Pratica: reorganizar vagoes com uma pilha (URI 1062)',
    source: 'prova1-pratica',
    difficulty: 'avancado',
    repetitionGroup: 'prova1-pratica-pilha-trilhos',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Decidir se uma permutacao e alcancavel usando so uma pilha pra reordenar — questao real do URI/beecrowd.',
    stem:
      'Problema real: URI 1062 "Trilhos". Um trem chega numa estacao com N vagoes numerados 1, 2, ..., N nessa ordem. Cada vagao pode entrar na estacao (empilhar) e, quando sair, so pode sair na direcao B (nunca mais volta). ' +
      'Dada uma ordem de saida desejada, diga se e possivel obte-la usando so uma pilha pra reorganizar os vagoes.\n\n' +
      'Entrada: varios blocos. Cada bloco comeca com um inteiro N (quantidade de vagoes); as linhas seguintes tem cada uma uma permutacao de 1..N pra testar; uma linha soh com 0 encerra o bloco. Um bloco comecando com N=0 encerra a entrada.\n\n' +
      'Saida: "Yes" ou "No" pra cada permutacao testada, com uma linha em branco apos cada bloco.\n\n' +
      'Exemplo de entrada:\n5\n5 4 3 2 1\n1 2 3 4 5\n5 4 1 2 3\n0\n6\n1 3 2 5 4 6\n0\n0\n\nExemplo de saida:\nYes\nYes\nNo\n\nYes',
    scaffold: `import java.util.Scanner;

public class Principal {
  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    int n = in.nextInt();
    while (n != 0) {
      int primeiro = in.nextInt();
      while (primeiro != 0) {
        int[] alvo = new int[n];
        alvo[0] = primeiro;
        for (int i = 1; i < n; i++) {
          alvo[i] = in.nextInt();
        }
        System.out.println(possivel(alvo, n) ? "Yes" : "No");
        primeiro = in.nextInt();
      }
      System.out.println();
      n = in.nextInt();
    }
  }

  static boolean possivel(int[] alvo, int n) {
    // implementar
  }
}`,
    visual: visual(
      'stack',
      'Empilha ate achar, desempilha quando bate',
      'Empilha 1, 2, 3, ... ate o topo bater com o proximo valor desejado; so entao desempilha.',
      ['empilha 1..k', 'topo == alvo[pos]?', 'desempilha e avanca'],
    ),
    step: functionStep({
      id: 'code-prova1-pratica-pilha-trilhos-step',
      prompt: 'Escreva o corpo de possivel(alvo, n).',
      signature: 'static boolean possivel(int[] alvo, int n)',
      solution: `static boolean possivel(int[] alvo, int n) {
  int[] pilha = new int[n];
  int topo = -1;
  int proximo = 1;
  boolean resp = true;
  for (int pos = 0; pos < n && resp; pos++) {
    while ((topo == -1 || pilha[topo] != alvo[pos]) && proximo <= n) {
      topo++;
      pilha[topo] = proximo;
      proximo++;
    }
    if (topo == -1 || pilha[topo] != alvo[pos]) {
      resp = false;
    } else {
      topo--;
    }
  }
  return resp;
}`,
      requiredFragments: [
        req('push-until-match', 'empilha vagoes novos ate o topo bater com o alvo', 'while ((topo == -1 || pilha[topo] != alvo[pos]) && proximo <= n)'),
        req('give-up', 'se nao sobrou vagao pra empilhar e nao bateu, e impossivel', 'if (topo == -1 || pilha[topo] != alvo[pos])'),
        req('pop-match', 'bateu: desempilha e avanca pro proximo alvo', 'topo--;'),
      ],
      lineExplanations: [
        {
          code: 'while ((topo == -1 || pilha[topo] != alvo[pos]) && proximo <= n)',
          note: 'A estrategia gulosa que sempre funciona (quando e possivel): empilhar vagoes na ordem 1, 2, 3... ate o topo da pilha ser exatamente o proximo vagao que precisa sair.',
        },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(n) por permutacao testada: cada vagao e empilhado e desempilhado no maximo uma vez.',
    }),
  },
  {
    id: 'code-prova1-pratica-adivinhar-estrutura',
    domainId: 'vetores',
    title: 'Desafio: pilha, fila ou fila de prioridade? (URI 1340)',
    source: 'prova1-pratica',
    difficulty: 'desafio',
    repetitionGroup: 'prova1-pratica-adivinhar-estrutura',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Simular pilha, fila e fila de prioridade em paralelo pra descobrir qual (ou quais) explicam a sequencia observada — questao real do URI/beecrowd.',
    stem:
      'Problema real: URI 1340 "Eu Posso Adivinhar a Estrutura de Dados!". Existe uma estrutura tipo "sacola" com duas operacoes: "1 x" (coloca x na sacola) e "2 x" (tira um elemento da sacola, que veio a ser x). ' +
      'Descubra se a sacola SO PODE ser uma pilha, SO PODE ser uma fila, SO PODE ser uma fila de prioridade (sempre tira o maior), NENHUMA das tres (impossible), ou MAIS DE UMA delas explica a sequencia (not sure).\n\n' +
      'Entrada: varios casos de teste ate o fim do arquivo. Cada um comeca com um inteiro N; seguem N linhas, cada uma com um comando "1 x" ou "2 x".\n\n' +
      'Saida: para cada caso, uma linha: "stack", "queue", "priority queue", "impossible" ou "not sure".\n\n' +
      'Exemplo de entrada:\n6\n1 1\n1 2\n1 3\n2 1\n2 2\n2 3\n2\n1 1\n2 2\n\nExemplo de saida:\nqueue\nimpossible',
    scaffold: `import java.util.Scanner;

public class Principal {
  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    while (in.hasNextInt()) {
      int n = in.nextInt();
      int[] tipo = new int[n];
      int[] valor = new int[n];
      for (int i = 0; i < n; i++) {
        tipo[i] = in.nextInt();
        valor[i] = in.nextInt();
      }
      System.out.println(adivinhar(tipo, valor, n));
    }
  }

  static String adivinhar(int[] tipo, int[] valor, int n) {
    // implementar: simule pilha, fila e fila de prioridade em paralelo,
    // descartando cada uma assim que uma remocao nao bate com o que ela preveria
  }
}`,
    visual: visual(
      'stack',
      'Tres candidatas simuladas ao mesmo tempo',
      'Toda insercao entra nas tres; toda remocao testa as tres — quem errar uma vez sai da disputa.',
      ['pilha: remove o topo', 'fila: remove a frente', 'fila de prioridade: remove o maior'],
    ),
    step: functionStep({
      id: 'code-prova1-pratica-adivinhar-estrutura-step',
      prompt: 'Escreva o corpo de adivinhar(tipo, valor, n).',
      signature: 'static String adivinhar(int[] tipo, int[] valor, int n)',
      solution: `static String adivinhar(int[] tipo, int[] valor, int n) {
  int[] pilha = new int[n];
  int topoPilha = -1;
  boolean pilhaOk = true;

  int[] fila = new int[n];
  int inicioFila = 0, fimFila = 0;
  boolean filaOk = true;

  int[] prioridade = new int[n];
  int tamPrioridade = 0;
  boolean prioridadeOk = true;

  for (int i = 0; i < n; i++) {
    if (tipo[i] == 1) {
      int x = valor[i];
      if (pilhaOk) {
        topoPilha++;
        pilha[topoPilha] = x;
      }
      if (filaOk) {
        fila[fimFila] = x;
        fimFila++;
      }
      if (prioridadeOk) {
        prioridade[tamPrioridade] = x;
        tamPrioridade++;
      }
    } else {
      int x = valor[i];
      if (pilhaOk) {
        if (topoPilha == -1 || pilha[topoPilha] != x) {
          pilhaOk = false;
        } else {
          topoPilha--;
        }
      }
      if (filaOk) {
        if (inicioFila == fimFila || fila[inicioFila] != x) {
          filaOk = false;
        } else {
          inicioFila++;
        }
      }
      if (prioridadeOk) {
        int posMaior = -1;
        for (int j = 0; j < tamPrioridade; j++) {
          if (posMaior == -1 || prioridade[j] > prioridade[posMaior]) {
            posMaior = j;
          }
        }
        if (posMaior == -1 || prioridade[posMaior] != x) {
          prioridadeOk = false;
        } else {
          prioridade[posMaior] = prioridade[tamPrioridade - 1];
          tamPrioridade--;
        }
      }
    }
  }

  int quantos = (pilhaOk ? 1 : 0) + (filaOk ? 1 : 0) + (prioridadeOk ? 1 : 0);
  String resp;
  if (quantos == 0) {
    resp = "impossible";
  } else if (quantos > 1) {
    resp = "not sure";
  } else if (pilhaOk) {
    resp = "stack";
  } else if (filaOk) {
    resp = "queue";
  } else {
    resp = "priority queue";
  }
  return resp;
}`,
      requiredFragments: [
        req('stack-check', 'confere se a remocao bate com o topo da pilha', 'pilha[topoPilha] != x'),
        req('queue-check', 'confere se a remocao bate com a frente da fila', 'fila[inicioFila] != x'),
        req('pq-find-max', 'acha o maior elemento ainda vivo na fila de prioridade', 'prioridade[j] > prioridade[posMaior]'),
        req('pq-remove', 'remove o maior trocando com o ultimo (a ordem interna nao importa numa fila de prioridade)', 'prioridade[posMaior] = prioridade[tamPrioridade - 1];'),
        req('decide', 'decide o resultado pela quantidade de candidatas que sobreviveram', 'quantos > 1'),
      ],
      lineExplanations: [
        {
          code: 'int quantos = (pilhaOk ? 1 : 0) + (filaOk ? 1 : 0) + (prioridadeOk ? 1 : 0);',
          note: 'A sacola pode ser ambigua: se DUAS estruturas ainda explicam toda a sequencia observada, a resposta e "not sure", nao um palpite qualquer.',
        },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(n^2) no pior caso: cada remocao da fila de prioridade escaneia os elementos restantes pra achar o maior — mais lento que pilha/fila (Theta(1) cada), mas simples de implementar corretamente.',
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
