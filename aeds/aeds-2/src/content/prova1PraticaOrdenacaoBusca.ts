import type { CodeDrill } from '../types/content';
import { samplesDoBeecrowd } from './beecrowdSamples';
import { beecrowd, functionChoiceStep, functionStep, leetcode, req, visual } from './praticaHelpers';

/**
 * Prova pratica da Prova 1 — ordenacao e busca. Todos sao problemas REAIS
 * (beecrowd e LeetCode): mesmo problema, mesmas restricoes, mesmos exemplos
 * oficiais de entrada/saida (em `samples`) e solucao modelo que passa no
 * juiz de verdade (respeita o limite de tempo — por isso varios usam
 * quicksort/mergesort/counting sort no lugar de um Theta(n^2)). O texto do
 * enunciado e uma reescrita fiel em portugues; o original fica no link de
 * `judge`.
 */

const QUICKSORT_INT = `static void quicksort(int[] array, int esq, int dir) {
  int i = esq, j = dir;
  int pivo = array[(dir + esq) / 2];
  while (i <= j) {
    while (array[i] < pivo) i++;
    while (array[j] > pivo) j--;
    if (i <= j) {
      int tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
      i++;
      j--;
    }
  }
  if (esq < j) quicksort(array, esq, j);
  if (i < dir) quicksort(array, i, dir);
}`;

const LEITURA_RAPIDA = `  static StreamTokenizer in = new StreamTokenizer(new BufferedReader(new InputStreamReader(System.in)));

  static int lerInt() throws IOException {
    in.nextToken();
    return (int) in.nval;
  }`;

export const prova1PraticaOrdenacaoBuscaCatalog: CodeDrill[] = [
  {
    id: 'code-prova1-pratica-ordenacao',
    domainId: 'ordenacao',
    moduleId: 'ordenacao-bolha',
    title: 'beecrowd 1162: Organizador de Vagões',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-ordenacao',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    judge: beecrowd('1162', 'Organizador de Vagões', 1),
    samples: samplesDoBeecrowd('1162'),
    goal: 'Contar as trocas de um bubble sort de verdade, no lugar de so ordenar.',
    stem:
      'Um funcionario da estacao reordena os vagoes de um trem trocando de lugar DOIS VAGOES VIZINHOS por vez (a ponte giratoria so comporta dois vagoes). Dado o trem, descubra quantas trocas de vagoes adjacentes sao necessarias para deixa-lo ordenado: vagao 1 primeiro, depois o 2, e assim por diante ate o L.\n\n' +
      'Entrada: a primeira linha tem o numero N de casos de teste. Cada caso tem duas linhas: a primeira com o tamanho L do trem (0 <= L <= 50) e a segunda com uma permutacao dos numeros de 1 a L (a ordem atual dos vagoes).\n\n' +
      'Saida: para cada caso, a frase "Optimal train swapping takes S swaps." (S e o numero de trocas).',
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
        { code: 'trocas++;', note: 'O numero minimo de trocas adjacentes pra ordenar uma permutacao e o numero de inversoes dela — e o bubble sort desfaz exatamente uma inversao por troca.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(l^2): dois lacos aninhados, o mesmo custo do bubble sort comum — aqui o valor que importa nao e o vetor ordenado, e sim quantas trocas ele fez. Com L <= 50 isso passa folgado no limite de 1s.',
    }),
  },
  {
    id: 'code-prova1-pratica-ordenacao-altura',
    domainId: 'ordenacao',
    moduleId: 'ordenacao-counting',
    title: 'beecrowd 1566: Altura',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-ordenacao-altura',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: beecrowd('1566', 'Altura', 4),
    samples: samplesDoBeecrowd('1566'),
    goal: 'Reconhecer quando o counting sort e o algoritmo certo: chave pequena (20 a 230) e milhoes de valores.',
    stem:
      'Para criar a "bolsa altura", o governo precisa da lista das alturas da populacao de varias cidades em ordem crescente. Cada cidade tem menos de 3 milhoes de habitantes e ninguem passa de 230 cm. O arquivo de entrada e enorme: use leitura e escrita rapidas.\n\n' +
      'Entrada: a primeira linha tem NC (NC < 100), o numero de cidades (casos de teste). Cada caso tem uma linha com N (1 < N <= 3000000), a quantidade de pessoas, e outra com as N alturas h em centimetros (20 <= h <= 230), separadas por um espaco.\n\n' +
      'Saida: para cada caso, uma linha com as alturas em ordem crescente, separadas por um espaco.',
    scaffold: `import java.io.*;

public class Principal {
  static byte[] buffer = new byte[1 << 16];
  static int tamBuffer = 0, posBuffer = 0;

  public static void main(String[] args) throws IOException {
    PrintWriter out = new PrintWriter(new BufferedWriter(new OutputStreamWriter(System.out)));
    int nc = lerInt();
    for (int c = 0; c < nc; c++) {
      int n = lerInt();
      int[] alturas = new int[n];
      for (int i = 0; i < n; i++) {
        alturas[i] = lerInt();
      }
      ordenar(alturas, n);
      StringBuilder linha = new StringBuilder();
      for (int i = 0; i < n; i++) {
        if (i > 0) {
          linha.append(' ');
        }
        linha.append(alturas[i]);
      }
      out.println(linha);
    }
    out.flush();
  }

  /** Leitura rapida (o arquivo do juiz tem milhoes de numeros). */
  static int lerByte() throws IOException {
    if (posBuffer == tamBuffer) {
      tamBuffer = System.in.read(buffer, 0, buffer.length);
      posBuffer = 0;
    }
    return tamBuffer <= 0 ? -1 : buffer[posBuffer++];
  }

  static int lerInt() throws IOException {
    int c = lerByte();
    while (c != -1 && (c < '0' || c > '9')) {
      c = lerByte();
    }
    int resp = 0;
    while (c >= '0' && c <= '9') {
      resp = resp * 10 + (c - '0');
      c = lerByte();
    }
    return resp;
  }

  static void ordenar(int[] alturas, int n) {
    // implementar: as alturas estao entre 20 e 230
  }
}`,
    visual: visual(
      'array',
      'Contar em vez de comparar',
      'count[h] guarda quantas pessoas tem altura h; reescrever o vetor na ordem de h ja deixa tudo ordenado.',
      ['count[h]++', 'h = 20..230', 'reescreve count[h] vezes'],
    ),
    step: functionChoiceStep({
      id: 'code-prova1-pratica-ordenacao-altura-step',
      prompt: 'Escreva o corpo de ordenar(alturas, n) com counting sort.',
      variants: [
        {
          id: 'contagem-direta',
          label: 'Counting sort reconstruindo pela contagem',
          signature: 'static void ordenar(int[] alturas, int n)',
          solution: `static void ordenar(int[] alturas, int n) {
  int[] count = new int[231];
  for (int i = 0; i < n; i++) {
    count[alturas[i]]++;
  }
  int k = 0;
  for (int h = 20; h <= 230; h++) {
    for (int j = 0; j < count[h]; j++) {
      alturas[k] = h;
      k++;
    }
  }
}`,
          requiredFragments: [
            req('count', 'conta quantas vezes cada altura aparece', 'count[alturas[i]]++'),
            req('rebuild', 'reescreve o vetor na ordem das alturas', 'alturas[k] = h;'),
          ],
          lineExplanations: [
            { code: 'count[alturas[i]]++;', note: 'Nenhuma comparacao entre elementos: a propria altura vira o indice do vetor de contagem.' },
          ],
        },
        {
          id: 'contagem-professor',
          label: 'Counting sort do professor (contagem acumulada + vetor ordenado)',
          signature: 'static void ordenar(int[] alturas, int n)',
          solution: `static void ordenar(int[] alturas, int n) {
  int[] count = new int[231];
  int[] ordenado = new int[n];
  for (int i = 0; i < n; count[alturas[i]]++, i++);
  for (int i = 1; i < count.length; count[i] += count[i - 1], i++);
  for (int i = n - 1; i >= 0; ordenado[count[alturas[i]] - 1] = alturas[i], count[alturas[i]]--, i--);
  for (int i = 0; i < n; alturas[i] = ordenado[i], i++);
}`,
          requiredFragments: [
            req('accumulate', 'acumula: count[i] vira quantos sao menores ou iguais a i', 'count[i] += count[i - 1]'),
            req('place', 'posiciona cada elemento pela contagem acumulada', 'ordenado[count[alturas[i]] - 1] = alturas[i]'),
          ],
          lineExplanations: [
            { code: 'count[i] += count[i - 1]', note: 'Depois do acumulado, count[h] - 1 e a ULTIMA posicao onde a altura h deve ficar.' },
          ],
        },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(n + k) com k = 211 alturas possiveis. Com N ate 3 milhoes por cidade, um Theta(n^2) (bolha, selecao, insercao) nunca termina no limite de tempo, e mesmo o Theta(n log n) perde pro counting sort aqui.',
    }),
  },
  {
    id: 'code-prova1-pratica-ordenacao-pares-impares',
    domainId: 'ordenacao',
    moduleId: 'ordenacao',
    title: 'beecrowd 1259: Pares e Ímpares',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-ordenacao-pares-impares',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: beecrowd('1259', 'Pares e Ímpares', 1),
    samples: samplesDoBeecrowd('1259'),
    goal: 'Trocar so o CRITERIO de comparacao de um quicksort — com N = 10^5 e 1s, um Theta(n^2) estoura o tempo.',
    stem:
      'Ordene inteiros nao negativos com o seguinte criterio: primeiro os PARES, em ordem CRESCENTE, e depois os IMPARES, em ordem DECRESCENTE.\n\n' +
      'Entrada: a primeira linha tem um inteiro positivo N (1 < N <= 10^5), a quantidade de linhas que vem a seguir. Cada uma das N linhas seguintes tem um inteiro nao negativo.\n\n' +
      'Saida: todos os valores lidos, na ordem descrita acima, um por linha.',
    scaffold: `import java.io.*;

public class Principal {
${LEITURA_RAPIDA}

  public static void main(String[] args) throws IOException {
    int n = lerInt();
    int[] valores = new int[n];
    for (int i = 0; i < n; i++) {
      valores[i] = lerInt();
    }
    ordenar(valores, n);
    StringBuilder saida = new StringBuilder();
    for (int i = 0; i < n; i++) {
      saida.append(valores[i]).append('\\n');
    }
    System.out.print(saida);
  }

  static void ordenar(int[] valores, int n) {
    // implementar (pode criar um metodo auxiliar vemAntes(a, b))
  }
}`,
    visual: visual('array', 'Criterio de ordem customizado', 'Todo par vem antes de todo impar; dentro de cada grupo, a ordem muda de sentido.', ['par < par: crescente', 'impar < impar: decrescente', 'par sempre antes de impar']),
    step: functionStep({
      id: 'code-prova1-pratica-ordenacao-pares-impares-step',
      prompt: 'Escreva o corpo de ordenar(valores, n) — um quicksort que compara com vemAntes(a, b).',
      signature: 'static void ordenar(int[] valores, int n)',
      solution: `static void ordenar(int[] valores, int n) {
  quicksort(valores, 0, n - 1);
}

static void quicksort(int[] array, int esq, int dir) {
  int i = esq, j = dir;
  int pivo = array[(dir + esq) / 2];
  while (i <= j) {
    while (vemAntes(array[i], pivo)) i++;
    while (vemAntes(pivo, array[j])) j--;
    if (i <= j) {
      int tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
      i++;
      j--;
    }
  }
  if (esq < j) quicksort(array, esq, j);
  if (i < dir) quicksort(array, i, dir);
}

static boolean vemAntes(int a, int b) {
  boolean parA = a % 2 == 0;
  boolean parB = b % 2 == 0;
  boolean resp;
  if (parA != parB) {
    resp = parA;
  } else if (parA) {
    resp = a < b;
  } else {
    resp = a > b;
  }
  return resp;
}`,
      requiredFragments: [
        req('parity-split', 'par e impar nunca se misturam: par sempre vem antes', 'if (parA != parB)'),
        req('even-order', 'pares entre si: crescente', 'resp = a < b;'),
        req('odd-order', 'impares entre si: decrescente', 'resp = a > b;'),
        req('left-scan', 'quicksort anda a esquerda enquanto o elemento vem antes do pivo', 'while (vemAntes(array[i], pivo))'),
        req('right-scan', 'quicksort anda a direita enquanto o pivo vem antes do elemento', 'while (vemAntes(pivo, array[j]))'),
      ],
      lineExplanations: [
        { code: 'while (vemAntes(array[i], pivo)) i++;', note: 'E o quicksort do professor com "array[i] < pivo" trocado por vemAntes(array[i], pivo): o algoritmo nao muda, so o criterio de comparacao.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(n log n) no caso medio. Com N = 10^5, o insertion sort faria ~2,5 * 10^9 deslocamentos no pior caso e estouraria o 1s do juiz.',
    }),
  },
  {
    id: 'code-prova1-pratica-busca-binaria',
    domainId: 'ordenacao',
    moduleId: 'busca-binaria',
    title: 'beecrowd 1025: Onde está o Mármore?',
    source: 'prova1-pratica',
    difficulty: 'avancado',
    repetitionGroup: 'prova1-pratica-busca-binaria',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: beecrowd('1025', 'Onde está o Mármore?', 2),
    samples: samplesDoBeecrowd('1025'),
    goal: 'Combinar ordenacao Theta(n log n) com busca binaria da PRIMEIRA ocorrencia.',
    stem:
      'Raju enfileira bolinhas de gude numeradas em ordem crescente e Meena pergunta onde esta a PRIMEIRA bolinha com um certo numero (contando 1, 2, 3...). Escreva o programa que responde todas as perguntas de Meena rapido.\n\n' +
      'Entrada: varios casos de teste (menos de 65). Cada caso comeca com dois inteiros N (numero de bolinhas) e Q (numero de consultas). As N linhas seguintes tem os numeros das bolinhas, sem nenhuma ordem, e as Q linhas seguintes tem as consultas. Nenhum numero e negativo nem maior que 10000. A entrada termina com N = 0 e Q = 0.\n\n' +
      'Saida: para cada caso, a linha "CASE# k:" (k comeca em 1) e, para cada consulta x, uma linha "x found at y" (y = posicao da primeira bolinha x, numerando de 1 a N depois de ordenar) ou "x not found".',
    scaffold: `import java.io.*;

public class Principal {
${LEITURA_RAPIDA}

  public static void main(String[] args) throws IOException {
    StringBuilder saida = new StringBuilder();
    int caso = 1;
    int n = lerInt();
    int q = lerInt();
    while (n != 0 || q != 0) {
      int[] bolinhas = new int[n];
      for (int i = 0; i < n; i++) {
        bolinhas[i] = lerInt();
      }
      ordenar(bolinhas, n);
      saida.append("CASE# ").append(caso).append(":\\n");
      for (int i = 0; i < q; i++) {
        int x = lerInt();
        int pos = buscarPrimeiro(bolinhas, n, x);
        if (pos == -1) {
          saida.append(x).append(" not found\\n");
        } else {
          saida.append(x).append(" found at ").append(pos + 1).append('\\n');
        }
      }
      caso++;
      n = lerInt();
      q = lerInt();
    }
    System.out.print(saida);
  }

  static void ordenar(int[] bolinhas, int n) {
    // implementar
  }

  static int buscarPrimeiro(int[] bolinhas, int n, int x) {
    // implementar: busca binaria pela PRIMEIRA ocorrencia de x; -1 se nao existir
  }
}`,
    visual: visual('array', 'Ordena, depois busca binaria pela esquerda', 'Achar x na busca binaria nao basta: precisa continuar procurando mais a esquerda pra achar a PRIMEIRA ocorrencia.', ['ordenar', 'buscar meio', 'achou? continua a esquerda']),
    step: functionStep({
      id: 'code-prova1-pratica-busca-binaria-step',
      prompt: 'Escreva ordenar(bolinhas, n) (quicksort) e buscarPrimeiro(bolinhas, n, x).',
      signature: 'static void ordenar(int[] bolinhas, int n)',
      solution: `static void ordenar(int[] bolinhas, int n) {
  quicksort(bolinhas, 0, n - 1);
}

${QUICKSORT_INT}

static int buscarPrimeiro(int[] bolinhas, int n, int x) {
  int esq = 0, dir = n - 1, resp = -1;
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
        req('go-left', 'meio maior (ou igual) a x: busca na metade esquerda', 'dir = meio - 1;'),
      ],
      lineExplanations: [
        { code: 'resp = meio;', note: 'Uma busca binaria comum pararia aqui — mas o problema pede a PRIMEIRA ocorrencia, entao o "dir = meio - 1" logo abaixo continua procurando mais a esquerda mesmo depois de achar.' },
      ],
      mistakeTag: 'incomplete-layer-search',
      explanation: 'Custo Theta(n log n) pra ordenar (quicksort) mais Theta(log n) por consulta. Com varios casos grandes, um insertion sort Theta(n^2) arrisca estourar os 2s do juiz.',
    }),
  },
  {
    id: 'code-prova1-pratica-fila-recreio',
    domainId: 'ordenacao',
    moduleId: 'ordenacao-insercao',
    title: 'beecrowd 1548: Fila do Recreio',
    source: 'prova1-pratica',
    difficulty: 'basico',
    repetitionGroup: 'prova1-pratica-fila-recreio',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    judge: beecrowd('1548', 'Fila do Recreio', 1),
    samples: samplesDoBeecrowd('1548'),
    goal: 'Ordenar uma COPIA em ordem decrescente e comparar posicao a posicao com a original.',
    stem:
      'Na cantina da escola, a fila do recreio deixou de ser por ordem de chegada: o professor de matematica decidiu que quem tem a maior nota se serve primeiro. Dada a ordem de chegada dos alunos e as notas de cada um, reordene a fila pela nota (da maior para a menor) e diga quantos alunos NAO precisaram trocar de lugar.\n\n' +
      'Entrada: a primeira linha tem N, o numero de casos de teste. Cada caso comeca com um inteiro M (1 <= M <= 1000), o numero de alunos, seguido de M inteiros distintos P_i (1 <= P_i <= 1000): a nota do i-esimo aluno a chegar na fila.\n\n' +
      'Saida: para cada caso, uma linha com o numero de alunos que continuaram na mesma posicao depois da reordenacao.',
    scaffold: `import java.util.Scanner;

public class Principal {
  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    int n = in.nextInt();
    for (int c = 0; c < n; c++) {
      int m = in.nextInt();
      int[] notas = new int[m];
      for (int i = 0; i < m; i++) {
        notas[i] = in.nextInt();
      }
      System.out.println(naoTrocaram(notas, m));
    }
  }

  static int naoTrocaram(int[] notas, int m) {
    // implementar
  }
}`,
    visual: visual('array', 'Original x ordenado', 'Copia, ordena a copia em ordem decrescente e conta as posicoes que ficaram iguais.', ['copia', 'ordena decrescente', 'fila[i] == notas[i]?']),
    step: functionStep({
      id: 'code-prova1-pratica-fila-recreio-step',
      prompt: 'Escreva o corpo de naoTrocaram(notas, m).',
      signature: 'static int naoTrocaram(int[] notas, int m)',
      solution: `static int naoTrocaram(int[] notas, int m) {
  int[] fila = new int[m];
  for (int i = 0; i < m; i++) {
    fila[i] = notas[i];
  }
  for (int i = 1; i < m; i++) {
    int tmp = fila[i];
    int j = i - 1;
    while (j >= 0 && fila[j] < tmp) {
      fila[j + 1] = fila[j];
      j--;
    }
    fila[j + 1] = tmp;
  }
  int resp = 0;
  for (int i = 0; i < m; i++) {
    if (fila[i] == notas[i]) {
      resp++;
    }
  }
  return resp;
}`,
      requiredFragments: [
        req('copy', 'ordena uma COPIA (a ordem de chegada ainda e necessaria)', 'fila[i] = notas[i];'),
        req('desc', 'insercao em ordem DECRESCENTE', 'fila[j] < tmp'),
        req('compare', 'conta quem ficou na mesma posicao', 'if (fila[i] == notas[i])'),
      ],
      lineExplanations: [
        { code: 'fila[j] < tmp', note: 'Trocar ">" por "<" no insertion sort inverte o sentido: a maior nota vai para a frente da fila.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(m^2) no pior caso com o insertion sort — com M <= 1000 cabe no limite. Ordenar o vetor original direto perderia a ordem de chegada.',
    }),
  },
  {
    id: 'code-prova1-pratica-lista-chamada',
    domainId: 'ordenacao',
    moduleId: 'ordenacao-selecao',
    title: 'beecrowd 2381: Lista de Chamada',
    source: 'prova1-pratica',
    difficulty: 'basico',
    repetitionGroup: 'prova1-pratica-lista-chamada',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    judge: beecrowd('2381', 'Lista de Chamada', 1),
    samples: samplesDoBeecrowd('2381'),
    goal: 'Selection sort com Strings (compareTo) e acesso direto a K-esima posicao.',
    stem:
      'Tia Joana sorteou um numero K para premiar o K-esimo aluno da lista de chamada, mas esqueceu o diario de classe. Ela sabe os nomes de todos os alunos e que os numeros de 1 a N sao dados em ordem alfabetica. Dados os nomes e o numero sorteado, descubra quem ganhou o bonus.\n\n' +
      'Entrada: a primeira linha tem dois inteiros N e K separados por um espaco (1 <= K <= N <= 100). Cada uma das N linhas seguintes tem um nome com 1 a 20 caracteres, so letras minusculas de "a" a "z".\n\n' +
      'Saida: uma unica linha com o nome do aluno premiado.',
    scaffold: `import java.util.Scanner;

public class Principal {
  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    int n = in.nextInt();
    int k = in.nextInt();
    String[] nomes = new String[n];
    for (int i = 0; i < n; i++) {
      nomes[i] = in.next();
    }
    ordenar(nomes, n);
    System.out.println(nomes[k - 1]);
  }

  static void ordenar(String[] nomes, int n) {
    // implementar (ordem alfabetica)
  }
}`,
    visual: visual('array', 'Selecao com compareTo', 'Mesmo selection sort de inteiros; so a comparacao vira nomes[j].compareTo(nomes[menor]) < 0.', ['acha o menor', 'troca com i', 'resposta = nomes[k - 1]']),
    step: functionStep({
      id: 'code-prova1-pratica-lista-chamada-step',
      prompt: 'Escreva o corpo de ordenar(nomes, n) com selection sort.',
      signature: 'static void ordenar(String[] nomes, int n)',
      solution: `static void ordenar(String[] nomes, int n) {
  for (int i = 0; i < n - 1; i++) {
    int menor = i;
    for (int j = i + 1; j < n; j++) {
      if (nomes[j].compareTo(nomes[menor]) < 0) {
        menor = j;
      }
    }
    String tmp = nomes[menor];
    nomes[menor] = nomes[i];
    nomes[i] = tmp;
  }
}`,
      requiredFragments: [
        req('compare', 'compara Strings com compareTo', 'nomes[j].compareTo(nomes[menor]) < 0'),
        req('select', 'guarda a posicao do menor', 'menor = j;'),
        req('swap', 'troca o menor para a posicao i', 'nomes[i] = tmp;'),
      ],
      lineExplanations: [
        { code: 'nomes[j].compareTo(nomes[menor]) < 0', note: 'Com Strings nao da pra usar "<": compareTo devolve negativo quando nomes[j] vem antes em ordem alfabetica.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(n^2) comparacoes (selecao), com n <= 100. A resposta e nomes[k - 1] porque o vetor comeca na posicao 0 e a chamada comeca no 1.',
    }),
  },
  {
    id: 'code-prova1-pratica-frequencia-numeros',
    domainId: 'ordenacao',
    moduleId: 'ordenacao-counting',
    title: 'beecrowd 1171: Frequência de Números',
    source: 'prova1-pratica',
    difficulty: 'basico',
    repetitionGroup: 'prova1-pratica-frequencia-numeros',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    judge: beecrowd('1171', 'Frequência de Números', 1),
    samples: samplesDoBeecrowd('1171'),
    goal: 'Usar o vetor de contagem do counting sort para responder a frequencia em ordem crescente.',
    stem:
      'Leia varios numeros e diga quantas vezes cada um aparece, escrevendo cada valor distinto uma unica vez, em ordem crescente.\n\n' +
      'Entrada: um unico caso de teste. A primeira linha tem um inteiro N, a quantidade de valores X que vem a seguir, um por linha (1 <= X <= 2000). Nenhum numero aparece mais de 20 vezes.\n\n' +
      'Saida: para cada valor distinto, em ordem crescente, uma linha no formato "X aparece C vez(es)".',
    scaffold: `import java.util.Scanner;

public class Principal {
  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    int n = in.nextInt();
    int[] valores = new int[n];
    for (int i = 0; i < n; i++) {
      valores[i] = in.nextInt();
    }
    imprimirFrequencias(valores, n);
  }

  static void imprimirFrequencias(int[] valores, int n) {
    // implementar
  }
}`,
    visual: visual('array', 'Vetor de contagem', 'count[x] ja e a frequencia de x; varrer x de 1 a 2000 sai em ordem crescente de graca.', ['count[x]++', 'x = 1..2000', 'imprime se count[x] > 0']),
    step: functionStep({
      id: 'code-prova1-pratica-frequencia-numeros-step',
      prompt: 'Escreva o corpo de imprimirFrequencias(valores, n).',
      signature: 'static void imprimirFrequencias(int[] valores, int n)',
      solution: `static void imprimirFrequencias(int[] valores, int n) {
  int[] count = new int[2001];
  for (int i = 0; i < n; i++) {
    count[valores[i]]++;
  }
  for (int x = 1; x <= 2000; x++) {
    if (count[x] > 0) {
      System.out.println(x + " aparece " + count[x] + " vez(es)");
    }
  }
}`,
      requiredFragments: [
        req('count', 'conta cada valor', 'count[valores[i]]++'),
        req('skip-zero', 'so imprime valores que apareceram', 'if (count[x] > 0)'),
        req('format', 'formato exato da saida', '" aparece " + count[x] + " vez(es)"'),
      ],
      lineExplanations: [
        { code: 'for (int x = 1; x <= 2000; x++)', note: 'Percorrer o vetor de contagem pelo indice ja entrega os valores em ordem crescente — e a mesma ideia do counting sort.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(n + 2000). Ordenar e depois contar repeticoes vizinhas tambem funciona, mas custa Theta(n log n).',
    }),
  },
  {
    id: 'code-prova1-pratica-carneirinhos',
    domainId: 'ordenacao',
    moduleId: 'ordenacao',
    title: 'beecrowd 1609: Contando Carneirinhos',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-carneirinhos',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: beecrowd('1609', 'Contando Carneirinhos', 1),
    samples: samplesDoBeecrowd('1609'),
    goal: 'Contar distintos ordenando: iguais ficam vizinhos. Com ids ate 10^9 nao da pra usar vetor de contagem.',
    stem:
      'Para dormir voce resolveu contar carneirinhos, mas o sono nao vem e alguns carneirinhos estao se repetindo. Cada um tem um identificador inteiro unico, entao voce vai evitar contar os repetidos: dada a sequencia, diga quantos carneirinhos DISTINTOS voce contou.\n\n' +
      'Entrada: a primeira linha tem T, o numero de casos de teste (T = 100 na maior parte dos testes). Cada caso tem uma linha com N, o numero de carneirinhos (1 <= N <= 100 em cerca de 90% dos testes e 1 <= N <= 10^4 nos demais), e outra com os N identificadores separados por espaco, que vao de 0 ate 10^9.\n\n' +
      'Saida: para cada caso, uma linha com o numero de carneirinhos distintos.',
    scaffold: `import java.io.*;

public class Principal {
${LEITURA_RAPIDA}

  public static void main(String[] args) throws IOException {
    int t = lerInt();
    for (int c = 0; c < t; c++) {
      int n = lerInt();
      int[] ids = new int[n];
      for (int i = 0; i < n; i++) {
        ids[i] = lerInt();
      }
      System.out.println(contarDistintos(ids, n));
    }
  }

  static int contarDistintos(int[] ids, int n) {
    // implementar
  }
}`,
    visual: visual('array', 'Ordenar junta os iguais', 'Depois de ordenar, cada valor novo e um elemento diferente do vizinho da esquerda.', ['quicksort', 'ids[i] != ids[i - 1]?', 'conta']),
    step: functionStep({
      id: 'code-prova1-pratica-carneirinhos-step',
      prompt: 'Escreva o corpo de contarDistintos(ids, n) (ordene com quicksort e conte as mudancas).',
      signature: 'static int contarDistintos(int[] ids, int n)',
      solution: `static int contarDistintos(int[] ids, int n) {
  quicksort(ids, 0, n - 1);
  int resp = 1;
  for (int i = 1; i < n; i++) {
    if (ids[i] != ids[i - 1]) {
      resp++;
    }
  }
  return resp;
}

${QUICKSORT_INT}`,
      requiredFragments: [
        req('sort', 'ordena antes de contar', 'quicksort(ids, 0, n - 1);'),
        req('neighbor', 'compara com o vizinho da esquerda', 'if (ids[i] != ids[i - 1])'),
        req('start', 'o primeiro sempre conta (N >= 1)', 'int resp = 1;'),
      ],
      lineExplanations: [
        { code: 'if (ids[i] != ids[i - 1])', note: 'Num vetor ordenado, repetidos ficam lado a lado: so conta quando o valor muda.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(n log n) pra ordenar + Theta(n) pra contar. Um vetor de contagem precisaria de 10^9 posicoes, e comparar todos com todos seria Theta(n^2).',
    }),
  },
  {
    id: 'code-prova1-pratica-sort-sort-sort',
    domainId: 'ordenacao',
    moduleId: 'ordenacao',
    title: 'beecrowd 1252: Sort! Sort!! e Sort!!!',
    source: 'prova1-pratica',
    difficulty: 'avancado',
    repetitionGroup: 'prova1-pratica-sort-sort-sort',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: beecrowd('1252', 'Sort! Sort!! e Sort!!!', 2),
    samples: samplesDoBeecrowd('1252'),
    goal: 'Comparador com 4 regras de desempate (inclusive resto de numero negativo) dentro de um quicksort.',
    stem:
      'Voce recebe N numeros e um inteiro positivo M, e deve ordenar os numeros em ordem CRESCENTE do resto da divisao por M (modulo M). Se dois numeros tiverem o mesmo resto: um impar vem antes de um par; entre dois impares, o MAIOR vem antes; entre dois pares, o MENOR vem antes. Para numeros negativos, siga a regra do C (a mesma do operador % do Java): o resto nunca e maior que zero — por exemplo, -100 MOD 3 = -1 e -100 MOD 4 = 0.\n\n' +
      'Entrada: varios casos de teste. Cada caso comeca com dois inteiros N (0 < N <= 10000) e M (0 < M <= 10000); cada uma das N linhas seguintes tem um numero, que cabe num inteiro de 32 bits com sinal. A entrada termina com uma linha com dois zeros, que nao deve ser processada.\n\n' +
      'Saida: para cada caso, uma linha com os valores de N e M, seguida de N linhas com os numeros ordenados pelas regras acima. No final, imprima tambem os dois zeros da ultima linha da entrada.',
    scaffold: `import java.io.*;

public class Principal {
${LEITURA_RAPIDA}

  public static void main(String[] args) throws IOException {
    StringBuilder saida = new StringBuilder();
    int n = lerInt();
    int m = lerInt();
    while (n != 0 || m != 0) {
      int[] v = new int[n];
      for (int i = 0; i < n; i++) {
        v[i] = lerInt();
      }
      ordenar(v, n, m);
      saida.append(n).append(' ').append(m).append('\\n');
      for (int i = 0; i < n; i++) {
        saida.append(v[i]).append('\\n');
      }
      n = lerInt();
      m = lerInt();
    }
    saida.append("0 0\\n");
    System.out.print(saida);
  }

  static void ordenar(int[] v, int n, int m) {
    // implementar (crie vemAntes(a, b, m) e use num quicksort)
  }
}`,
    visual: visual('array', 'Desempate em cascata', 'Resto diferente decide; resto igual: impar antes de par; dois impares: maior antes; dois pares: menor antes.', ['a % m x b % m', 'impar antes de par', 'impar: desc / par: cresc']),
    step: functionStep({
      id: 'code-prova1-pratica-sort-sort-sort-step',
      prompt: 'Escreva ordenar(v, n, m), o quicksort e o comparador vemAntes(a, b, m).',
      signature: 'static void ordenar(int[] v, int n, int m)',
      solution: `static void ordenar(int[] v, int n, int m) {
  quicksort(v, 0, n - 1, m);
}

static void quicksort(int[] array, int esq, int dir, int m) {
  int i = esq, j = dir;
  int pivo = array[(dir + esq) / 2];
  while (i <= j) {
    while (vemAntes(array[i], pivo, m)) i++;
    while (vemAntes(pivo, array[j], m)) j--;
    if (i <= j) {
      int tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
      i++;
      j--;
    }
  }
  if (esq < j) quicksort(array, esq, j, m);
  if (i < dir) quicksort(array, i, dir, m);
}

static boolean vemAntes(int a, int b, int m) {
  boolean imparA = a % 2 != 0;
  boolean imparB = b % 2 != 0;
  boolean resp;
  if (a % m != b % m) {
    resp = a % m < b % m;
  } else if (imparA != imparB) {
    resp = imparA;
  } else if (imparA) {
    resp = a > b;
  } else {
    resp = a < b;
  }
  return resp;
}`,
      requiredFragments: [
        req('mod', 'primeiro criterio: resto da divisao por m', 'resp = a % m < b % m;'),
        req('odd-test', 'impar testado com != 0 (negativo impar da resto -1)', 'a % 2 != 0'),
        req('odd-first', 'resto empatado: impar vem antes de par', 'resp = imparA;'),
        req('odd-desc', 'dois impares: maior antes', 'resp = a > b;'),
        req('even-asc', 'dois pares: menor antes', 'resp = a < b;'),
      ],
      lineExplanations: [
        { code: 'boolean imparA = a % 2 != 0;', note: 'Armadilha: -3 % 2 vale -1 em Java, entao "a % 2 == 1" diria que -3 e par. Teste impar com "!= 0".' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(n log n) por caso com o quicksort. O "%" do Java ja segue a regra do C pedida no enunciado (resto de negativo e <= 0), entao nao precisa ajustar nada.',
    }),
  },
  {
    id: 'code-prova1-pratica-diga-frequencia',
    domainId: 'ordenacao',
    moduleId: 'ordenacao-counting',
    title: 'beecrowd 1251: Diga-me a Frequência',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-diga-frequencia',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: beecrowd('1251', 'Diga-me a Frequência', 1),
    samples: samplesDoBeecrowd('1251'),
    goal: 'Contar com vetor indexado pelo codigo ASCII e ordenar os presentes por (frequencia crescente, codigo decrescente).',
    stem:
      'Dada uma linha de texto, encontre a frequencia de cada caractere presente nela. As linhas nao tem nenhum dos 32 primeiros nem dos 128 ultimos caracteres da tabela ASCII, e o caractere de fim de linha nao conta.\n\n' +
      'Entrada: varios casos de teste, ate o fim do arquivo (EOF). Cada caso e uma unica linha de texto com ate 1000 caracteres.\n\n' +
      'Saida: para cada caso, uma linha "codigo frequencia" para cada caractere presente (codigo = valor ASCII), em ordem CRESCENTE de frequencia; se dois caracteres tiverem a mesma frequencia, o de valor ASCII MAIOR vem primeiro. Uma linha em branco separa as saidas de dois casos.',
    scaffold: `import java.io.*;

public class Principal {
  public static void main(String[] args) throws IOException {
    BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
    String linha = in.readLine();
    boolean primeiro = true;
    while (linha != null) {
      if (!primeiro) {
        System.out.println();
      }
      imprimirFrequencias(linha);
      primeiro = false;
      linha = in.readLine();
    }
  }

  static void imprimirFrequencias(String linha) {
    // implementar
  }
}`,
    visual: visual('array', 'Contagem + ordenacao dos presentes', 'count[c] conta cada caractere; depois ordena so os codigos presentes pelo criterio pedido.', ['count[c]++', 'junta presentes', 'freq cresc, codigo desc']),
    step: functionStep({
      id: 'code-prova1-pratica-diga-frequencia-step',
      prompt: 'Escreva o corpo de imprimirFrequencias(linha).',
      signature: 'static void imprimirFrequencias(String linha)',
      solution: `static void imprimirFrequencias(String linha) {
  int[] count = new int[128];
  for (int i = 0; i < linha.length(); i++) {
    count[linha.charAt(i)]++;
  }
  int[] codigos = new int[128];
  int n = 0;
  for (int c = 0; c < 128; c++) {
    if (count[c] > 0) {
      codigos[n] = c;
      n++;
    }
  }
  for (int i = 1; i < n; i++) {
    int tmp = codigos[i];
    int j = i - 1;
    while (j >= 0 && (count[codigos[j]] > count[tmp] || (count[codigos[j]] == count[tmp] && codigos[j] < tmp))) {
      codigos[j + 1] = codigos[j];
      j--;
    }
    codigos[j + 1] = tmp;
  }
  for (int i = 0; i < n; i++) {
    System.out.println(codigos[i] + " " + count[codigos[i]]);
  }
}`,
      requiredFragments: [
        req('count', 'conta pelo codigo do caractere', 'count[linha.charAt(i)]++'),
        req('freq-order', 'frequencia menor vem antes', 'count[codigos[j]] > count[tmp]'),
        req('tie', 'empate: codigo ASCII maior vem antes', 'codigos[j] < tmp'),
      ],
      lineExplanations: [
        { code: 'count[linha.charAt(i)]++;', note: 'Um char em Java e um numero: usar o proprio caractere como indice e o counting sort direto.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(m) pra contar (m = tamanho da linha) + no maximo 96 caracteres distintos pra ordenar — o insertion sort sobre eles e constante na pratica.',
    }),
  },
  {
    id: 'code-prova1-pratica-camisetas',
    domainId: 'ordenacao',
    moduleId: 'ordenacao',
    title: 'beecrowd 1258: Camisetas',
    source: 'prova1-pratica',
    difficulty: 'avancado',
    repetitionGroup: 'prova1-pratica-camisetas',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: beecrowd('1258', 'Camisetas', 1),
    samples: samplesDoBeecrowd('1258'),
    goal: 'Ordenar registros por 3 chaves (cor crescente, tamanho decrescente, nome crescente).',
    stem:
      'O professor Rolien vai encomendar camisetas polo pretas para as turmas; cada aluno escolhe a cor dos detalhes do logo (branco ou vermelho) e o tamanho (P, M ou G). Ajude a organizar a lista de cada turma ordenando as camisetas pela cor do logo, depois pelo tamanho e, por ultimo, pelo nome do aluno.\n\n' +
      'Entrada: varios casos de teste. Cada caso comeca com um inteiro N (1 <= N <= 60), a quantidade de camisetas da turma. Seguem 2 linhas por camiseta: a primeira com o nome do aluno e a segunda com a cor do logo ("branco" ou "vermelho"), um espaco e o tamanho ("P", "M" ou "G"). A entrada termina com N = 0, que nao deve ser processado.\n\n' +
      'Saida: para cada caso, uma linha por camiseta no formato "cor tamanho nome", ordenadas pela cor em ordem ascendente, depois pelo tamanho em ordem DESCENDENTE e por fim pelo nome em ordem ascendente. Imprima uma linha em branco entre dois casos de teste.',
    scaffold: `import java.io.*;

public class Principal {
  static class Camiseta {
    String nome;
    String cor;
    char tamanho;
  }

  public static void main(String[] args) throws IOException {
    BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
    int n = Integer.parseInt(in.readLine().trim());
    boolean primeiro = true;
    while (n != 0) {
      Camiseta[] camisetas = new Camiseta[n];
      for (int i = 0; i < n; i++) {
        camisetas[i] = new Camiseta();
        camisetas[i].nome = in.readLine();
        String[] partes = in.readLine().trim().split(" ");
        camisetas[i].cor = partes[0];
        camisetas[i].tamanho = partes[partes.length - 1].charAt(0);
      }
      ordenar(camisetas, n);
      if (!primeiro) {
        System.out.println();
      }
      for (int i = 0; i < n; i++) {
        System.out.println(camisetas[i].cor + " " + camisetas[i].tamanho + " " + camisetas[i].nome);
      }
      primeiro = false;
      n = Integer.parseInt(in.readLine().trim());
    }
  }

  static void ordenar(Camiseta[] camisetas, int n) {
    // implementar (pode criar um metodo auxiliar vemAntes(a, b))
  }
}`,
    visual: visual('array', 'Tres chaves em cascata', 'Cor decide; empate na cor, tamanho decide (P > M > G); empate nos dois, nome decide.', ['cor: branco < vermelho', 'tamanho: P, M, G', 'nome: alfabetico']),
    step: functionStep({
      id: 'code-prova1-pratica-camisetas-step',
      prompt: 'Escreva ordenar(camisetas, n) e o comparador vemAntes(a, b).',
      signature: 'static void ordenar(Camiseta[] camisetas, int n)',
      solution: `static void ordenar(Camiseta[] camisetas, int n) {
  for (int i = 1; i < n; i++) {
    Camiseta tmp = camisetas[i];
    int j = i - 1;
    while (j >= 0 && vemAntes(tmp, camisetas[j])) {
      camisetas[j + 1] = camisetas[j];
      j--;
    }
    camisetas[j + 1] = tmp;
  }
}

static boolean vemAntes(Camiseta a, Camiseta b) {
  boolean resp;
  if (!a.cor.equals(b.cor)) {
    resp = a.cor.compareTo(b.cor) < 0;
  } else if (a.tamanho != b.tamanho) {
    resp = a.tamanho > b.tamanho;
  } else {
    resp = a.nome.compareTo(b.nome) < 0;
  }
  return resp;
}`,
      requiredFragments: [
        req('color', 'primeira chave: cor em ordem ascendente', 'resp = a.cor.compareTo(b.cor) < 0;'),
        req('size', 'segunda chave: tamanho DESCENDENTE (P > M > G)', 'resp = a.tamanho > b.tamanho;'),
        req('name', 'terceira chave: nome ascendente', 'resp = a.nome.compareTo(b.nome) < 0;'),
        req('insertion', 'insertion sort usando o comparador', 'while (j >= 0 && vemAntes(tmp, camisetas[j]))'),
      ],
      lineExplanations: [
        { code: 'resp = a.tamanho > b.tamanho;', note: '"Descendente" aqui e pela letra: P (80) > M (77) > G (71). Por isso a saida mostra P, depois M, depois G.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(n^2) com insertion sort (N <= 60). O cuidado e o comparador: cada chave so e consultada quando TODAS as anteriores empatam.',
    }),
  },
  {
    id: 'code-prova1-pratica-elfo-trevas',
    domainId: 'ordenacao',
    moduleId: 'ordenacao',
    title: 'beecrowd 1766: O Elfo das Trevas',
    source: 'prova1-pratica',
    difficulty: 'avancado',
    repetitionGroup: 'prova1-pratica-elfo-trevas',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: beecrowd('1766', 'O Elfo das Trevas', 2),
    samples: samplesDoBeecrowd('1766'),
    goal: 'Ordenacao por 4 chaves com sentidos diferentes (peso decrescente, o resto crescente).',
    stem:
      'O Elfo das Trevas soltou as renas do Papai Noel e voce ficou encarregado de colocar cada rena capturada na sua posicao no treno. As renas vao numa fila unica e a ordem segue estas caracteristicas: primeiro peso, em ordem DECRESCENTE; empatando no peso, idade em ordem crescente; depois altura em ordem crescente; e, se ainda empatar, nome em ordem crescente. Nem todas as renas vao na viagem: so as M primeiras dessa ordem.\n\n' +
      'Entrada: a primeira linha tem T (1 <= T <= 10^5), o numero de casos de teste. Cada caso comeca com N e M (5 <= N, M <= 10^3): o total de renas e quantas vao puxar o treno. Seguem N linhas, cada uma com o nome S da rena (uma unica palavra de ate 100 caracteres), o peso P e a idade I (1 <= P, I <= 300) e a altura A (numero real, 0.00 <= A <= 3.00).\n\n' +
      'Saida: para cada caso, a linha "CENARIO {i}" (i e o numero do caso, comecando em 1; as chaves fazem parte da saida) seguida de M linhas "posicao - nome" com as M renas escolhidas, na ordem.',
    scaffold: `import java.io.*;
import java.util.StringTokenizer;

public class Principal {
  static class Rena {
    String nome;
    int peso;
    int idade;
    double altura;
  }

  static BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
  static StringTokenizer st;

  static String proximo() throws IOException {
    while (st == null || !st.hasMoreTokens()) {
      st = new StringTokenizer(in.readLine());
    }
    return st.nextToken();
  }

  public static void main(String[] args) throws IOException {
    StringBuilder saida = new StringBuilder();
    int t = Integer.parseInt(proximo());
    for (int c = 1; c <= t; c++) {
      int n = Integer.parseInt(proximo());
      int m = Integer.parseInt(proximo());
      Rena[] renas = new Rena[n];
      for (int i = 0; i < n; i++) {
        renas[i] = new Rena();
        renas[i].nome = proximo();
        renas[i].peso = Integer.parseInt(proximo());
        renas[i].idade = Integer.parseInt(proximo());
        renas[i].altura = Double.parseDouble(proximo());
      }
      ordenar(renas, n);
      saida.append("CENARIO {").append(c).append("}\\n");
      for (int i = 0; i < m; i++) {
        saida.append(i + 1).append(" - ").append(renas[i].nome).append('\\n');
      }
    }
    System.out.print(saida);
  }

  static void ordenar(Rena[] renas, int n) {
    // implementar (pode criar um metodo auxiliar vemAntes(a, b))
  }
}`,
    visual: visual('array', 'Quatro chaves', 'Peso decrescente; empate: idade, altura e nome crescentes, nessa ordem.', ['peso desc', 'idade asc', 'altura asc', 'nome asc']),
    step: functionStep({
      id: 'code-prova1-pratica-elfo-trevas-step',
      prompt: 'Escreva ordenar(renas, n) e o comparador vemAntes(a, b).',
      signature: 'static void ordenar(Rena[] renas, int n)',
      solution: `static void ordenar(Rena[] renas, int n) {
  for (int i = 1; i < n; i++) {
    Rena tmp = renas[i];
    int j = i - 1;
    while (j >= 0 && vemAntes(tmp, renas[j])) {
      renas[j + 1] = renas[j];
      j--;
    }
    renas[j + 1] = tmp;
  }
}

static boolean vemAntes(Rena a, Rena b) {
  boolean resp;
  if (a.peso != b.peso) {
    resp = a.peso > b.peso;
  } else if (a.idade != b.idade) {
    resp = a.idade < b.idade;
  } else if (a.altura != b.altura) {
    resp = a.altura < b.altura;
  } else {
    resp = a.nome.compareTo(b.nome) < 0;
  }
  return resp;
}`,
      requiredFragments: [
        req('weight', 'peso decrescente', 'resp = a.peso > b.peso;'),
        req('age', 'idade crescente', 'resp = a.idade < b.idade;'),
        req('height', 'altura crescente', 'resp = a.altura < b.altura;'),
        req('name', 'nome crescente', 'resp = a.nome.compareTo(b.nome) < 0;'),
      ],
      lineExplanations: [
        { code: 'resp = a.peso > b.peso;', note: 'So a primeira chave e decrescente — as outras tres continuam crescentes.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(n^2) por caso com insertion sort (N <= 1000); estavel, entao a ordem das chaves no comparador e o que decide tudo.',
    }),
  },
  {
    id: 'code-prova1-pratica-bolhas-baldes',
    domainId: 'ordenacao',
    moduleId: 'ordenacao',
    title: 'beecrowd 1088: Bolhas e Baldes',
    source: 'prova1-pratica',
    difficulty: 'desafio',
    repetitionGroup: 'prova1-pratica-bolhas-baldes',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: beecrowd('1088', 'Bolhas e Baldes', 3),
    samples: samplesDoBeecrowd('1088'),
    goal: 'Perceber que cada jogada desfaz UMA inversao e contar inversoes em Theta(n log n) dentro do mergesort.',
    stem:
      'Andrea, Carlos e Marcelo passam os fins de semana na piscina, e Carlos e Marcelo jogam "Bolhas": geram uma permutacao aleatoria de 1, 2, ..., N e, alternadamente, cada jogador escolhe um par de elementos CONSECUTIVOS fora de ordem e inverte os dois. Marcelo sempre comeca. Cedo ou tarde a sequencia fica ordenada, e perde quem nao conseguir fazer uma jogada. Dada a sequencia inicial, determine quem ganha.\n\n' +
      'Entrada: varios casos de teste, cada um numa unica linha: um inteiro N (2 <= N <= 10^5) seguido da sequencia inicial X1, X2, ..., XN, com N inteiros distintos (1 <= Xi <= N), separados por um espaco. A entrada termina com uma linha contendo apenas 0.\n\n' +
      'Saida: para cada caso, uma linha com o nome do vencedor: Carlos ou Marcelo.',
    scaffold: `import java.io.*;

public class Principal {
${LEITURA_RAPIDA}

  public static void main(String[] args) throws IOException {
    StringBuilder saida = new StringBuilder();
    int n = lerInt();
    while (n != 0) {
      int[] array = new int[n];
      for (int i = 0; i < n; i++) {
        array[i] = lerInt();
      }
      long inversoes = contarInversoes(array, 0, n - 1);
      saida.append(inversoes % 2 == 1 ? "Marcelo" : "Carlos").append('\\n');
      n = lerInt();
    }
    System.out.print(saida);
  }

  static long contarInversoes(int[] array, int esq, int dir) {
    // implementar: mergesort que devolve quantas inversoes existem entre esq e dir
  }
}`,
    visual: visual('array', 'Inversoes contadas na intercalacao', 'Quando um elemento da metade direita passa na frente, ele inverte com TODOS os que ainda sobram na metade esquerda.', ['mergesort', 'a2[j] < a1[i]', 'inversoes += n1 - i']),
    step: functionStep({
      id: 'code-prova1-pratica-bolhas-baldes-step',
      prompt: 'Escreva contarInversoes(array, esq, dir) como um mergesort que soma as inversoes, e o intercalar(...).',
      signature: 'static long contarInversoes(int[] array, int esq, int dir)',
      solution: `static long contarInversoes(int[] array, int esq, int dir) {
  long resp = 0;
  if (esq < dir) {
    int meio = (esq + dir) / 2;
    resp += contarInversoes(array, esq, meio);
    resp += contarInversoes(array, meio + 1, dir);
    resp += intercalar(array, esq, meio, dir);
  }
  return resp;
}

static long intercalar(int[] array, int esq, int meio, int dir) {
  int n1 = meio - esq + 1;
  int n2 = dir - meio;
  int[] a1 = new int[n1 + 1];
  int[] a2 = new int[n2 + 1];
  int i, j, k;
  for (i = 0; i < n1; i++) {
    a1[i] = array[esq + i];
  }
  for (j = 0; j < n2; j++) {
    a2[j] = array[meio + j + 1];
  }
  a1[i] = a2[j] = 0x7FFFFFFF;
  long inversoes = 0;
  for (i = j = 0, k = esq; k <= dir; k++) {
    if (a1[i] <= a2[j]) {
      array[k] = a1[i++];
    } else {
      array[k] = a2[j++];
      inversoes += n1 - i;
    }
  }
  return inversoes;
}`,
      requiredFragments: [
        req('recurse', 'soma as inversoes das duas metades', 'resp += contarInversoes(array, meio + 1, dir);'),
        req('merge', 'soma as inversoes que cruzam as metades', 'resp += intercalar(array, esq, meio, dir);'),
        req('cross', 'elemento da direita passou na frente de n1 - i da esquerda', 'inversoes += n1 - i;'),
        req('long', 'contador em long (ate ~5 * 10^9 inversoes)', 'long inversoes = 0;'),
      ],
      lineExplanations: [
        { code: 'inversoes += n1 - i;', note: 'a1 esta ordenado: se a2[j] < a1[i], entao a2[j] tambem e menor que a1[i+1..n1-1] — sao n1 - i inversoes de uma vez.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Cada jogada troca dois vizinhos fora de ordem = desfaz exatamente 1 inversao, entao o jogo sempre dura "inversoes" jogadas: numero impar, Marcelo faz a ultima e ganha. Contar com dois lacos e Theta(n^2) (10^10 com N = 10^5); dentro do mergesort e Theta(n log n).',
    }),
  },
  {
    id: 'code-prova1-pratica-menor-posicao',
    domainId: 'vetores',
    moduleId: 'busca-sequencial',
    title: 'beecrowd 1180: Menor e Posição',
    source: 'prova1-pratica',
    difficulty: 'basico',
    repetitionGroup: 'prova1-pratica-menor-posicao',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    judge: beecrowd('1180', 'Menor e Posição', 1),
    samples: samplesDoBeecrowd('1180'),
    goal: 'Busca sequencial guardando a POSICAO do menor, nao so o valor.',
    stem:
      'Leia um valor N, o tamanho de um vetor X[N]. Depois leia os valores de X, encontre o menor elemento do vetor e a posicao dele, e mostre essas informacoes.\n\n' +
      'Entrada: a primeira linha tem um inteiro N (1 < N < 1000), o numero de elementos do vetor X. A segunda linha tem os N valores inteiros, separados por um espaco. Nao ha numeros repetidos.\n\n' +
      'Saida: a primeira linha com "Menor valor:", um espaco e o menor valor lido; a segunda com "Posicao:", um espaco e a posicao do menor valor no vetor (a primeira posicao e a zero).',
    scaffold: `import java.util.Scanner;

public class Principal {
  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    int n = in.nextInt();
    int[] x = new int[n];
    for (int i = 0; i < n; i++) {
      x[i] = in.nextInt();
    }
    int pos = posicaoMenor(x, n);
    System.out.println("Menor valor: " + x[pos]);
    System.out.println("Posicao: " + pos);
  }

  static int posicaoMenor(int[] x, int n) {
    // implementar
  }
}`,
    visual: visual('array', 'Guarda o indice, nao o valor', 'Com o indice do menor em maos, o valor e so x[resp].', ['resp = 0', 'x[i] < x[resp]?', 'resp = i']),
    step: functionStep({
      id: 'code-prova1-pratica-menor-posicao-step',
      prompt: 'Escreva o corpo de posicaoMenor(x, n).',
      signature: 'static int posicaoMenor(int[] x, int n)',
      solution: `static int posicaoMenor(int[] x, int n) {
  int resp = 0;
  for (int i = 1; i < n; i++) {
    if (x[i] < x[resp]) {
      resp = i;
    }
  }
  return resp;
}`,
      requiredFragments: [
        req('start', 'comeca supondo que o menor esta na posicao 0', 'int resp = 0;'),
        req('compare', 'compara com o menor ate agora', 'if (x[i] < x[resp])'),
        req('update', 'guarda a nova posicao', 'resp = i;'),
      ],
      lineExplanations: [
        { code: 'int resp = 0;', note: 'Comecar com "menor = 0" (valor) falharia com vetor so de positivos; comecar pela posicao 0 funciona sempre.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Busca sequencial: n - 1 comparacoes, Theta(n) — e o laco interno do selection sort.',
    }),
  },
  {
    id: 'code-prova1-pratica-carteiro',
    domainId: 'ordenacao',
    moduleId: 'busca-binaria',
    title: 'beecrowd 2448: Carteiro',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-carteiro',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: beecrowd('2448', 'Carteiro', 1),
    samples: samplesDoBeecrowd('2448'),
    goal: 'Busca binaria para converter o numero da casa na posicao dela na rua.',
    stem:
      'Um carteiro entrega encomendas na rua de Joaozinho, sempre na mesma ordem em que foram enviadas. A rua tem N casas numeradas em ordem crescente (nao necessariamente consecutivos) e ele leva uma unidade de tempo para andar de uma casa ate a vizinha. Ha M encomendas, cada uma com o numero da casa de destino. Calcule quanto tempo o carteiro leva para entregar todas, comecando na primeira casa (a de menor numero) e parando quando a ultima encomenda e entregue (o tempo de por a encomenda na caixa de correio e desprezado).\n\n' +
      'Entrada: a primeira linha tem N e M (1 <= N, M <= 45000). A segunda linha tem N inteiros em ordem estritamente crescente: os numeros das casas (ate 10^9). A terceira tem M inteiros: os numeros das casas das encomendas (ate 10^9), na ordem de entrega.\n\n' +
      'Saida: uma unica linha com o tempo que o carteiro leva para entregar tudo.',
    scaffold: `import java.io.*;

public class Principal {
${LEITURA_RAPIDA}

  public static void main(String[] args) throws IOException {
    int n = lerInt();
    int m = lerInt();
    int[] casas = new int[n];
    for (int i = 0; i < n; i++) {
      casas[i] = lerInt();
    }
    int[] encomendas = new int[m];
    for (int i = 0; i < m; i++) {
      encomendas[i] = lerInt();
    }
    System.out.println(tempoTotal(casas, n, encomendas, m));
  }

  static long tempoTotal(int[] casas, int n, int[] encomendas, int m) {
    // implementar (pode criar um metodo auxiliar de busca binaria)
  }
}`,
    visual: visual('array', 'Numero da casa -> posicao na rua', 'A busca binaria acha o INDICE da casa; o tempo e a distancia entre indices.', ['buscar(casas, x)', '|destino - atual|', 'soma tudo']),
    step: functionStep({
      id: 'code-prova1-pratica-carteiro-step',
      prompt: 'Escreva tempoTotal(casas, n, encomendas, m) e a busca binaria auxiliar.',
      signature: 'static long tempoTotal(int[] casas, int n, int[] encomendas, int m)',
      solution: `static long tempoTotal(int[] casas, int n, int[] encomendas, int m) {
  long resp = 0;
  int atual = 0;
  for (int i = 0; i < m; i++) {
    int destino = buscar(casas, n, encomendas[i]);
    resp += Math.abs(destino - atual);
    atual = destino;
  }
  return resp;
}

static int buscar(int[] casas, int n, int x) {
  int esq = 0, dir = n - 1, resp = -1;
  while (esq <= dir && resp == -1) {
    int meio = (esq + dir) / 2;
    if (casas[meio] == x) {
      resp = meio;
    } else if (casas[meio] < x) {
      esq = meio + 1;
    } else {
      dir = meio - 1;
    }
  }
  return resp;
}`,
      requiredFragments: [
        req('search', 'busca binaria pelo indice da casa', 'int destino = buscar(casas, n, encomendas[i]);'),
        req('distance', 'soma a distancia entre indices', 'resp += Math.abs(destino - atual);'),
        req('binary', 'busca binaria classica', 'while (esq <= dir'),
      ],
      lineExplanations: [
        { code: 'long resp = 0;', note: 'No pior caso sao 45000 entregas de 44999 passos: ~2,02 * 10^9, que ainda cabe num int (limite ~2,15 * 10^9) — mas por muito pouco; long nao custa nada.' },
      ],
      mistakeTag: 'incomplete-layer-search',
      explanation: 'Custo Theta(m log n): uma busca binaria por encomenda. A busca sequencial seria Theta(m * n) = 2 * 10^9 no pior caso.',
    }),
  },
  {
    id: 'code-prova1-pratica-lc-merge-sorted-array',
    domainId: 'ordenacao',
    moduleId: 'ordenacao',
    title: 'LeetCode 88: Merge Sorted Array',
    source: 'prova1-pratica',
    difficulty: 'basico',
    repetitionGroup: 'prova1-pratica-lc-merge-sorted-array',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: leetcode('88', 'merge-sorted-array', 'Merge Sorted Array'),
    samples: [
      { input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', output: '[1,2,2,3,5,6]' },
      { input: 'nums1 = [1], m = 1, nums2 = [], n = 0', output: '[1]' },
      { input: 'nums1 = [0], m = 0, nums2 = [1], n = 1', output: '[1]' },
    ],
    goal: 'A intercalacao do mergesort feita de tras pra frente, sem vetor auxiliar.',
    stem:
      'Voce recebe dois vetores de inteiros nums1 e nums2, ambos em ordem nao decrescente, e dois inteiros m e n com a quantidade de elementos de cada um. Intercale os dois num unico vetor ordenado. O resultado nao e devolvido: ele deve ficar DENTRO de nums1, que tem tamanho m + n — os m primeiros elementos sao os que devem ser intercalados e os n ultimos valem 0 e devem ser ignorados. nums2 tem tamanho n.\n\n' +
      'Entrada: nums1, m, nums2 e n (parametros do metodo). Restricoes: 0 <= m, n <= 200, 1 <= m + n <= 200, -10^9 <= valores <= 10^9.\n\n' +
      'Saida: o conteudo final de nums1. Desafio do enunciado: fazer em O(m + n).',
    scaffold: `class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        // implementar
    }
}`,
    visual: visual('array', 'Intercalar de tras pra frente', 'O fim de nums1 esta livre: coloca ali o MAIOR entre nums1[i] e nums2[j] e anda pra esquerda.', ['k = m + n - 1', 'maior dos dois vai pra k', 'ate acabar nums2']),
    step: functionStep({
      id: 'code-prova1-pratica-lc-merge-sorted-array-step',
      prompt: 'Escreva o metodo merge(nums1, m, nums2, n).',
      signature: 'public void merge(int[] nums1, int m, int[] nums2, int n)',
      solution: `public void merge(int[] nums1, int m, int[] nums2, int n) {
  int i = m - 1, j = n - 1, k = m + n - 1;
  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) {
      nums1[k] = nums1[i];
      i--;
    } else {
      nums1[k] = nums2[j];
      j--;
    }
    k--;
  }
}`,
      requiredFragments: [
        req('from-end', 'comeca pelo fim de nums1', 'k = m + n - 1'),
        req('bigger', 'o maior dos dois vai para a posicao k', 'nums1[i] > nums2[j]'),
        req('until-nums2', 'para quando nums2 acabar (o resto de nums1 ja esta no lugar)', 'while (j >= 0)'),
      ],
      lineExplanations: [
        { code: 'while (j >= 0)', note: 'Se nums2 acabou, o que sobrou de nums1 ja esta ordenado e na posicao certa — nao precisa copiar.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(m + n): cada elemento e escrito uma vez. Intercalar da frente pra tras sobrescreveria elementos de nums1 ainda nao usados.',
    }),
  },
  {
    id: 'code-prova1-pratica-lc-sort-colors',
    domainId: 'ordenacao',
    moduleId: 'ordenacao-counting',
    title: 'LeetCode 75: Sort Colors',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-lc-sort-colors',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: leetcode('75', 'sort-colors', 'Sort Colors'),
    samples: [
      { input: 'nums = [2,0,2,1,1,0]', output: '[0,0,1,1,2,2]' },
      { input: 'nums = [2,0,1]', output: '[0,1,2]' },
    ],
    goal: 'Ordenar sem funcao de biblioteca quando so existem 3 chaves: counting sort ou particao em 3 partes.',
    stem:
      'Voce recebe um vetor nums com n objetos coloridos de vermelho, branco ou azul, representados por 0, 1 e 2. Ordene o vetor no proprio lugar (in-place) para que objetos da mesma cor fiquem juntos, na ordem vermelho, branco e azul. Nao use a funcao de ordenacao da biblioteca.\n\n' +
      'Entrada: o vetor nums (1 <= n <= 300, cada nums[i] e 0, 1 ou 2), parametro do metodo.\n\n' +
      'Saida: o vetor nums ordenado. Desafio do enunciado: uma unica passada com espaco extra constante.',
    scaffold: `class Solution {
    public void sortColors(int[] nums) {
        // implementar
    }
}`,
    visual: visual('array', 'So tres chaves', 'Contar quantos 0, 1 e 2 e reescrever (counting sort), ou separar em 3 regioes numa passada.', ['count[0..2]', 'ou: esq / i / dir', 'sem sort da biblioteca']),
    step: functionChoiceStep({
      id: 'code-prova1-pratica-lc-sort-colors-step',
      prompt: 'Escreva o metodo sortColors(nums).',
      variants: [
        {
          id: 'counting',
          label: 'Counting sort (duas passadas)',
          signature: 'public void sortColors(int[] nums)',
          solution: `public void sortColors(int[] nums) {
  int[] count = new int[3];
  for (int i = 0; i < nums.length; i++) {
    count[nums[i]]++;
  }
  int k = 0;
  for (int cor = 0; cor < 3; cor++) {
    for (int j = 0; j < count[cor]; j++) {
      nums[k] = cor;
      k++;
    }
  }
}`,
          requiredFragments: [
            req('count', 'conta cada cor', 'count[nums[i]]++'),
            req('rebuild', 'reescreve na ordem 0, 1, 2', 'nums[k] = cor;'),
          ],
          lineExplanations: [{ code: 'count[nums[i]]++;', note: 'Com so 3 valores possiveis, o vetor de contagem tem 3 posicoes.' }],
        },
        {
          id: 'particao',
          label: 'Particao em tres regioes (uma passada)',
          signature: 'public void sortColors(int[] nums)',
          solution: `public void sortColors(int[] nums) {
  int esq = 0, i = 0, dir = nums.length - 1;
  while (i <= dir) {
    if (nums[i] == 0) {
      int tmp = nums[esq];
      nums[esq] = nums[i];
      nums[i] = tmp;
      esq++;
      i++;
    } else if (nums[i] == 2) {
      int tmp = nums[dir];
      nums[dir] = nums[i];
      nums[i] = tmp;
      dir--;
    } else {
      i++;
    }
  }
}`,
          requiredFragments: [
            req('loop', 'varre ate encontrar a regiao dos 2', 'while (i <= dir)'),
            req('zero', 'manda 0 para a esquerda', 'nums[esq] = nums[i];'),
            req('two', 'manda 2 para a direita (sem avancar i)', 'nums[dir] = nums[i];'),
          ],
          lineExplanations: [{ code: 'dir--;', note: 'Depois de trocar com dir, NAO avance i: o valor que veio de dir ainda nao foi examinado.' }],
        },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'As duas versoes sao Theta(n). A particao e a mesma ideia do particionamento do quicksort, so que com tres regioes.',
    }),
  },
  {
    id: 'code-prova1-pratica-lc-binary-search',
    domainId: 'ordenacao',
    moduleId: 'busca-binaria',
    title: 'LeetCode 704: Binary Search',
    source: 'prova1-pratica',
    difficulty: 'basico',
    repetitionGroup: 'prova1-pratica-lc-binary-search',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    judge: leetcode('704', 'binary-search', 'Binary Search'),
    samples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1' },
    ],
    goal: 'A busca binaria classica, exigida em O(log n).',
    stem:
      'Dado um vetor de inteiros nums em ordem crescente e um inteiro target, escreva uma funcao que procura target em nums. Se target existir, devolva o seu indice; senao, devolva -1. O algoritmo tem que ser O(log n).\n\n' +
      'Entrada: nums (1 <= nums.length <= 10^4, valores unicos entre -10^4 e 10^4, em ordem crescente) e target (parametros do metodo).\n\n' +
      'Saida: o indice de target em nums, ou -1.',
    scaffold: `class Solution {
    public int search(int[] nums, int target) {
        // implementar
    }
}`,
    visual: visual('array', 'Corta o intervalo pela metade', 'Compara com o meio e descarta a metade onde target nao pode estar.', ['meio = (esq + dir) / 2', 'maior? vai pra direita', 'menor? vai pra esquerda']),
    step: functionStep({
      id: 'code-prova1-pratica-lc-binary-search-step',
      prompt: 'Escreva o metodo search(nums, target).',
      signature: 'public int search(int[] nums, int target)',
      solution: `public int search(int[] nums, int target) {
  int esq = 0, dir = nums.length - 1, resp = -1;
  while (esq <= dir && resp == -1) {
    int meio = (esq + dir) / 2;
    if (nums[meio] == target) {
      resp = meio;
    } else if (nums[meio] < target) {
      esq = meio + 1;
    } else {
      dir = meio - 1;
    }
  }
  return resp;
}`,
      requiredFragments: [
        req('loop', 'intervalo ainda nao vazio', 'esq <= dir'),
        req('middle', 'calcula o meio', 'int meio = (esq + dir) / 2;'),
        req('right', 'descarta a metade esquerda', 'esq = meio + 1;'),
        req('left', 'descarta a metade direita', 'dir = meio - 1;'),
      ],
      lineExplanations: [{ code: 'esq = meio + 1;', note: 'Usar "esq = meio" (sem o + 1) trava num laco infinito quando esq e dir ficam vizinhos.' }],
      mistakeTag: 'incomplete-layer-search',
      explanation: 'Theta(log n): o intervalo cai pela metade a cada volta. Single return no estilo do professor, com resp comecando em -1.',
    }),
  },
];
