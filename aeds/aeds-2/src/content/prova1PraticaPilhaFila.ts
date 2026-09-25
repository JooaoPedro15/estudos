import type { CodeDrill } from '../types/content';
import { samplesDoBeecrowd } from './beecrowdSamples';
import { beecrowd, codewars, functionChoiceStep, functionStep, leetcode, req, visual } from './praticaHelpers';

/**
 * Prova pratica da Prova 1 — pilha e fila. Problemas REAIS do beecrowd,
 * LeetCode e Codewars, com os exemplos oficiais em `samples` e solucao
 * modelo que passa no juiz de verdade. Enunciados reescritos em portugues
 * (o original fica no link de `judge`).
 */

export const prova1PraticaPilhaFilaCatalog: CodeDrill[] = [
  {
    id: 'code-prova1-pratica-pilha',
    domainId: 'vetores',
    moduleId: 'pilha',
    title: 'beecrowd 1068: Balanço de Parênteses I',
    source: 'prova1-pratica',
    difficulty: 'basico',
    repetitionGroup: 'prova1-pratica-pilha',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    judge: beecrowd('1068', 'Balanço de Parênteses I', 1),
    samples: samplesDoBeecrowd('1068'),
    goal: 'Aplicar pilha no classico de validar parenteses.',
    stem:
      'Dada uma expressao qualquer com parenteses, diga se a quantidade de parenteses esta correta, sem levar em conta o resto da expressao: todo parentese que fecha precisa ter um parentese que abre correspondente ANTES dele, e o total de parenteses que abrem e que fecham tem que ser igual.\n\n' +
      'Entrada: N expressoes (1 <= N <= 10000), uma por linha, cada uma com ate 1000 caracteres, ate o fim do arquivo.\n\n' +
      'Saida: uma linha para cada expressao da entrada, com a palavra correct ou incorrect.',
    scaffold: `import java.io.*;

public class Principal {
  static char[] pilha = new char[1000];
  static int topo;

  public static void main(String[] args) throws IOException {
    BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
    StringBuilder saida = new StringBuilder();
    String expressao = in.readLine();
    while (expressao != null) {
      saida.append(balanceada(expressao) ? "correct" : "incorrect").append('\\n');
      expressao = in.readLine();
    }
    System.out.print(saida);
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
        { code: 'return resp && topo == -1;', note: 'So checar os fechamentos nao basta: "(a" nao tem fechamento errado, mas sobra uma abertura sem par — por isso o "topo == -1" no final.' },
      ],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(m) por expressao (m = tamanho da linha): cada caractere e visitado uma unica vez.',
    }),
  },
  {
    id: 'code-prova1-pratica-pilha-minimo',
    domainId: 'vetores',
    moduleId: 'pilha',
    title: 'beecrowd 2929: Menor da Pilha',
    source: 'prova1-pratica',
    difficulty: 'avancado',
    repetitionGroup: 'prova1-pratica-pilha-minimo',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: beecrowd('2929', 'Menor da Pilha', 1),
    samples: samplesDoBeecrowd('2929'),
    goal: 'Manter uma pilha auxiliar de minimos para responder MIN em O(1) — com 10^6 operacoes, varrer a pilha estoura o tempo.',
    stem:
      'Os presentes do Papai Noel sao empilhados pelos elfos na fabrica do Polo Norte e o Noel sempre tira o presente do TOPO dessa pilha. Cada presente tem um grau de diversao, e durante a noite (enquanto novos presentes continuam sendo empilhados) o Noel quer saber qual e o presente MENOS divertido que esta na pilha naquele momento. Dada a sequencia de operacoes, responda as consultas.\n\n' +
      'Entrada: a primeira linha tem N (1 <= N <= 10^6), o numero de operacoes. Cada linha seguinte tem uma operacao: "PUSH V" (empilha um presente com grau de diversao V, 1 <= V <= 10^9), "POP" (o Noel tira o presente do topo) ou "MIN" (consulta o menor valor na pilha).\n\n' +
      'Saida: para cada "MIN", uma linha com o menor valor da pilha. Se a pilha estiver vazia numa operacao "MIN" ou "POP", imprima "EMPTY".',
    scaffold: `import java.io.*;

public class Principal {
  static int[] pilha = new int[1000000];
  static int[] pilhaMin = new int[1000000];
  static int topo = -1;
  static StringBuilder saida = new StringBuilder();

  public static void main(String[] args) throws IOException {
    BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
    int n = Integer.parseInt(in.readLine().trim());
    for (int i = 0; i < n; i++) {
      String linha = in.readLine().trim();
      if (linha.startsWith("PUSH")) {
        push(Integer.parseInt(linha.substring(4).trim()));
      } else if (linha.equals("POP")) {
        pop();
      } else {
        minimo();
      }
    }
    System.out.print(saida);
  }

  static void push(int v) {
    // implementar
  }

  static void pop() {
    // implementar (pilha vazia: saida.append("EMPTY\\n"))
  }

  static void minimo() {
    // implementar (pilha vazia: saida.append("EMPTY\\n"))
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
    saida.append("EMPTY\\n");
  } else {
    topo--;
  }
}

static void minimo() {
  if (topo == -1) {
    saida.append("EMPTY\\n");
  } else {
    saida.append(pilhaMin[topo]).append('\\n');
  }
}`,
      requiredFragments: [
        req('push-base', 'primeiro elemento e o proprio minimo', 'topo == 0 || v < pilhaMin[topo - 1]'),
        req('push-propagate', 'senao, repete o minimo anterior', 'pilhaMin[topo] = pilhaMin[topo - 1];'),
        req('empty', 'pilha vazia imprime EMPTY', 'saida.append("EMPTY'),
        req('min-read', 'MIN so le o topo da pilha auxiliar', 'saida.append(pilhaMin[topo])'),
      ],
      lineExplanations: [
        { code: 'if (topo == 0 || v < pilhaMin[topo - 1])', note: 'pilhaMin[i] = menor valor entre pilha[0..i]. Quando o topo sai, o minimo "de baixo" ja esta pronto na posicao anterior.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(1) por operacao. Varrer a pilha a cada MIN seria Theta(n) por consulta — ate 10^12 passos com 10^6 operacoes. A saida vai num StringBuilder porque 10^6 println estouram o tempo.',
    }),
  },
  {
    id: 'code-prova1-pratica-pilha-trilhos',
    domainId: 'vetores',
    moduleId: 'pilha',
    title: 'beecrowd 1062: Trilhos',
    source: 'prova1-pratica',
    difficulty: 'avancado',
    repetitionGroup: 'prova1-pratica-pilha-trilhos',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: beecrowd('1062', 'Trilhos', 1),
    samples: samplesDoBeecrowd('1062'),
    goal: 'Decidir se uma permutacao e alcancavel usando so uma pilha para reordenar.',
    stem:
      'A estacao de trem da cidade PopPush tem um unico trilho que termina na estacao: os vagoes que chegam da direcao A entram na estacao e so podem sair dela para a direcao B, sem voltar. O trem chega com N <= 1000 vagoes numerados em ordem crescente 1, 2, ..., N (o 1 chega primeiro). O chefe da estacao pode deixar entrar quantos vagoes quiser antes de tirar o primeiro, e quer saber se consegue fazer os vagoes sairem em B numa certa ordem a1, a2, ..., aN. Por exemplo, deixando entrar os vagoes 1 a 5 e tirando um a um, a saida 5 4 3 2 1 e possivel.\n\n' +
      'Entrada: varios blocos. A primeira linha de cada bloco tem N, a quantidade de vagoes; cada linha seguinte e uma permutacao de 1, 2, ..., N a testar; a ultima linha do bloco contem apenas 0. Um bloco que comeca com 0 indica o fim da entrada.\n\n' +
      'Saida: uma linha para cada permutacao da entrada: Yes se for possivel organizar os vagoes daquele jeito, No caso contrario. Ha tambem uma linha em branco depois de cada bloco.',
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
      'Empilha 1, 2, 3, ... ate o topo bater com o proximo vagao desejado; so entao desempilha.',
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
          note: 'Estrategia gulosa que sempre funciona quando e possivel: empilhar 1, 2, 3... ate o topo ser exatamente o proximo vagao que precisa sair.',
        },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(n) por permutacao: cada vagao e empilhado e desempilhado no maximo uma vez.',
    }),
  },
  {
    id: 'code-prova1-pratica-fila',
    domainId: 'vetores',
    moduleId: 'fila',
    title: 'beecrowd 1110: Jogando Cartas Fora',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-fila',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: beecrowd('1110', 'Jogando Cartas Fora', 1),
    samples: samplesDoBeecrowd('1110'),
    goal: 'Simular fila circular (descarta a frente, manda a proxima pro fim) e acertar a formatacao sem espaco sobrando.',
    stem:
      'Um monte tem n cartas numeradas de 1 ate n, com a carta 1 no topo e a carta n na base. Enquanto o monte tiver 2 ou mais cartas, faca: jogue fora a carta do topo e passe a carta que ficou no topo para a base do monte. Encontre a sequencia de cartas descartadas e a ultima carta que sobra.\n\n' +
      'Entrada: um numero indeterminado de linhas, cada uma com um valor n de 1 ate 50. A ultima linha contem 0 e nao deve ser processada.\n\n' +
      'Saida: para cada caso, duas linhas: "Discarded cards:" seguido das cartas descartadas, separadas por uma virgula e um espaco; e "Remaining card:" seguido do numero da carta que restou. Nenhuma linha tem espaco sobrando no comeco ou no fim — veja o formato exato nos exemplos.',
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
      'Fila circular de capacidade n+1: o primeiro sai duas vezes por rodada, e a segunda remocao volta pro fim.',
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
  String descartadas = "Discarded cards:";
  boolean primeiraCarta = true;
  while ((ultimo - primeiro + fila.length) % fila.length > 1) {
    descartadas += (primeiraCarta ? " " : ", ") + fila[primeiro];
    primeiraCarta = false;
    primeiro = (primeiro + 1) % fila.length;
    int mover = fila[primeiro];
    primeiro = (primeiro + 1) % fila.length;
    fila[ultimo] = mover;
    ultimo = (ultimo + 1) % fila.length;
  }
  System.out.println(descartadas);
  System.out.println("Remaining card: " + fila[primeiro]);
}`,
      requiredFragments: [
        req('loop-condition', 'continua enquanto sobrar mais de uma carta na fila circular', '(ultimo - primeiro + fila.length) % fila.length > 1'),
        req('separator', 'espaco antes da primeira carta, ", " antes das outras', '(primeiraCarta ? " " : ", ")'),
        req('move-read', 'le a proxima carta antes de mover', 'int mover = fila[primeiro];'),
        req('move-write', 'manda essa carta pro fim da fila', 'fila[ultimo] = mover;'),
      ],
      lineExplanations: [
        { code: 'String descartadas = "Discarded cards:";', note: 'Armadilha do n = 1: nenhuma carta e descartada e a linha tem que ser "Discarded cards:" sem espaco no fim — por isso o espaco so entra junto com a primeira carta.' },
      ],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(n): cada carta e descartada ou movida no maximo uma vez por rodada. A conta (ultimo - primeiro + tamanho) % tamanho da o numero de elementos da fila circular sem contador separado.',
    }),
  },
  {
    id: 'code-prova1-pratica-adivinhar-estrutura',
    domainId: 'vetores',
    title: 'beecrowd 1340: Eu Posso Adivinhar a Estrutura de Dados!',
    source: 'prova1-pratica',
    difficulty: 'desafio',
    repetitionGroup: 'prova1-pratica-adivinhar-estrutura',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: beecrowd('1340', 'Eu Posso Adivinhar a Estrutura de Dados!', 2),
    samples: samplesDoBeecrowd('1340'),
    goal: 'Simular pilha, fila e fila de prioridade em paralelo pra descobrir qual (ou quais) explicam a sequencia.',
    stem:
      'Existe uma estrutura do tipo "sacola" com duas operacoes: "1 x" joga o elemento x na sacola e "2 x" tira um elemento da sacola — e o elemento tirado foi x. Dada uma sequencia de operacoes com os valores retirados, adivinhe a estrutura: e uma pilha (ultimo a entrar, primeiro a sair), uma fila (primeiro a entrar, primeiro a sair), uma fila de prioridade (sempre sai o MAIOR elemento) ou outra coisa?\n\n' +
      'Entrada: varios casos de teste, ate o fim do arquivo (EOF). Cada caso comeca com uma linha com um inteiro n (1 <= n <= 1000). Cada uma das n linhas seguintes e um comando "1 x" ou "2 x" — depois de um comando do tipo 2, obtemos o elemento x sem erros. x e sempre um inteiro positivo e no maximo 100.\n\n' +
      'Saida: para cada caso, uma linha com: "stack" (com certeza e uma pilha), "queue" (com certeza e uma fila), "priority queue" (com certeza e uma fila de prioridade), "impossible" (nao pode ser nenhuma das tres) ou "not sure" (pode ser mais de uma das tres).',
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
    int x = valor[i];
    if (tipo[i] == 1) {
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
          note: 'A sacola pode ser ambigua: se DUAS estruturas explicam toda a sequencia, a resposta e "not sure", nao um palpite.',
        },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(n^2) no pior caso: cada remocao da fila de prioridade varre os elementos restantes pra achar o maior. Com n <= 1000 cabe folgado nos 2s.',
    }),
  },
  {
    id: 'code-prova1-pratica-diamantes-areia',
    domainId: 'vetores',
    moduleId: 'pilha',
    title: 'beecrowd 1069: Diamantes e Areia',
    source: 'prova1-pratica',
    difficulty: 'basico',
    repetitionGroup: 'prova1-pratica-diamantes-areia',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    judge: beecrowd('1069', 'Diamantes e Areia', 1),
    samples: samplesDoBeecrowd('1069'),
    goal: 'Casar "<" com ">" usando pilha (o mesmo esquema dos parenteses), contando os pares.',
    stem:
      'Joao trabalha numa mina tentando tirar o maximo de diamantes "<>". Ele deve ignorar as particulas de areia "." e, a cada diamante retirado, novos diamantes podem se formar. Por exemplo, em .<...<<..>>....>....>>>. saem tres diamantes: primeiro o <..>, depois o que se forma com a retirada dele, e por fim mais um, sobrando .....>>>. sem nenhum diamante. Diga quantos diamantes podem ser extraidos.\n\n' +
      'Entrada: um inteiro N, a quantidade de casos de teste. Cada uma das N linhas seguintes e um caso, com ate 1000 caracteres entre "<", ">" e ".".\n\n' +
      'Saida: para cada caso, uma linha com a quantidade de diamantes que podem ser extraidos.',
    scaffold: `import java.io.*;

public class Principal {
  static char[] pilha = new char[1000];
  static int topo;

  public static void main(String[] args) throws IOException {
    BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
    int n = Integer.parseInt(in.readLine().trim());
    for (int i = 0; i < n; i++) {
      String linha = in.readLine();
      System.out.println(contarDiamantes(linha == null ? "" : linha));
    }
  }

  static int contarDiamantes(String linha) {
    // implementar
  }
}`,
    visual: visual('stack', 'Pilha de "<"', 'Cada ">" fecha o "<" do topo e forma um diamante; ">" com a pilha vazia nao forma nada.', ['"<" empilha', '">" com topo: diamante', '"." ignora']),
    step: functionStep({
      id: 'code-prova1-pratica-diamantes-areia-step',
      prompt: 'Escreva o corpo de contarDiamantes(linha).',
      signature: 'static int contarDiamantes(String linha)',
      solution: `static int contarDiamantes(String linha) {
  topo = -1;
  int resp = 0;
  for (int i = 0; i < linha.length(); i++) {
    char c = linha.charAt(i);
    if (c == '<') {
      topo++;
      pilha[topo] = c;
    } else if (c == '>' && topo >= 0) {
      topo--;
      resp++;
    }
  }
  return resp;
}`,
      requiredFragments: [
        req('push', 'empilha cada "<"', "if (c == '<')"),
        req('match', 'fecha com o "<" do topo, se houver', "c == '>' && topo >= 0"),
        req('count', 'cada fechamento e um diamante', 'resp++;'),
      ],
      lineExplanations: [
        { code: "} else if (c == '>' && topo >= 0) {", note: 'Um ">" sem "<" pendente nao forma diamante e simplesmente e ignorado — diferente dos parenteses, aqui nao existe "incorreto".' },
      ],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(m) por linha. Remover os "<>" de verdade da String e repetir ate nao sobrar nenhum daria o mesmo numero, mas em Theta(m^2).',
    }),
  },
  {
    id: 'code-prova1-pratica-rna-alienigena',
    domainId: 'vetores',
    moduleId: 'pilha',
    title: 'beecrowd 1242: Ácido Ribonucleico Alienígena',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-rna-alienigena',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: beecrowd('1242', 'Ácido Ribonucleico Alienígena', 1),
    samples: samplesDoBeecrowd('1242'),
    goal: 'Problema disfarcado de parenteses: cada base "fecha" a do topo se for o par dela (B-S, C-F).',
    stem:
      'Foi descoberto um RNA alienigena (RNAA): uma fita formada pelas bases B, C, F e S, que se ligam em pares — os unicos pares possiveis sao B com S e C com F. Enquanto esta ativo, o RNAA dobra varios trechos da fita sobre si mesma: quando um trecho dobra, todas as bases dele se ligam com as correspondentes, cada base se liga a no maximo uma outra, e as dobras acontecem de forma a MAXIMIZAR o numero de ligacoes. Dada a fita, determine quantas ligacoes se formam quando ela fica ativa.\n\n' +
      'Entrada: varios casos de teste, ate o fim do arquivo (EOF). Cada caso e uma linha com a sequencia de bases da fita: de 1 a 300 bases, sem espacos, so com as letras B, C, F e S.\n\n' +
      'Saida: para cada caso, uma linha com o numero total de ligacoes.',
    scaffold: `import java.io.*;

public class Principal {
  static char[] pilha = new char[300];
  static int topo;

  public static void main(String[] args) throws IOException {
    BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
    String fita = in.readLine();
    while (fita != null) {
      fita = fita.trim();
      if (fita.length() > 0) {
        System.out.println(contarLigacoes(fita));
      }
      fita = in.readLine();
    }
  }

  static int contarLigacoes(String fita) {
    // implementar (pode criar um metodo auxiliar formaPar(a, b))
  }
}`,
    visual: visual('stack', 'Parenteses disfarcados', 'Se a base atual forma par com a do topo, elas se ligam (desempilha); senao, empilha.', ['B <-> S', 'C <-> F', 'par com o topo? liga']),
    step: functionStep({
      id: 'code-prova1-pratica-rna-alienigena-step',
      prompt: 'Escreva contarLigacoes(fita) e o auxiliar formaPar(a, b).',
      signature: 'static int contarLigacoes(String fita)',
      solution: `static int contarLigacoes(String fita) {
  topo = -1;
  int resp = 0;
  for (int i = 0; i < fita.length(); i++) {
    char c = fita.charAt(i);
    if (topo >= 0 && formaPar(pilha[topo], c)) {
      topo--;
      resp++;
    } else {
      topo++;
      pilha[topo] = c;
    }
  }
  return resp;
}

static boolean formaPar(char a, char b) {
  return (a == 'B' && b == 'S') || (a == 'S' && b == 'B') || (a == 'C' && b == 'F') || (a == 'F' && b == 'C');
}`,
      requiredFragments: [
        req('match-top', 'liga com a base do topo quando formam par', 'if (topo >= 0 && formaPar(pilha[topo], c))'),
        req('count', 'conta a ligacao e desempilha', 'resp++;'),
        req('push', 'senao, empilha a base', 'pilha[topo] = c;'),
      ],
      lineExplanations: [
        { code: 'if (topo >= 0 && formaPar(pilha[topo], c))', note: 'Uma dobra liga TODAS as bases do trecho, entao duas bases so se ligam se tudo entre elas ja estiver ligado — igual a parenteses aninhados. A base do topo e justamente a mais recente ainda solta.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(m) por fita. E o mesmo que apagar pares vizinhos (BS, SB, CF, FC) ate nao sobrar nenhum, so que numa passada: o exemplo SFBC da 0 porque nenhuma dobra pode deixar base solta no meio.',
    }),
  },
  {
    id: 'code-prova1-pratica-estacionamento',
    domainId: 'vetores',
    moduleId: 'pilha',
    title: 'beecrowd 1523: Estacionamento Linear',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-estacionamento',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: beecrowd('1523', 'Estacionamento Linear', 1),
    samples: samplesDoBeecrowd('1523'),
    goal: 'Reconhecer a pilha disfarcada (corredor com um portao so) e simular com capacidade K.',
    stem:
      'O estacionamento perto da faculdade tem um unico corredor, largo o suficiente para um carro e fundo o suficiente para K carros, um atras do outro, e um unico portao para entrar e sair. O primeiro carro vai ate o fundo e os seguintes param logo atras; como nenhum carro passa por cima de outro, so o ultimo da fila consegue sair. Dados os horarios de chegada e de saida prevista de N motoristas, diga se e possivel que todos estacionem e retirem seus carros.\n\n' +
      'Entrada: varios casos de teste. Cada caso comeca com N e K (3 <= N <= 10^4, 1 <= K <= 10^3): o numero de motoristas e quantos carros cabem no estacionamento. Seguem N linhas com dois inteiros C_i e S_i (1 <= C_i, S_i <= 10^5): o horario de chegada e de saida do motorista i. Os C_i vem em ordem crescente. Dois motoristas nunca chegam ao mesmo tempo nem saem ao mesmo tempo, mas um motorista pode chegar no mesmo instante em que outro quer sair. O caso com N = K = 0 indica o fim e nao deve ser processado.\n\n' +
      'Saida: para cada caso, uma linha com "Sim" se todos os N motoristas conseguirem usar o estacionamento, ou "Nao" caso contrario.',
    scaffold: `import java.io.*;

public class Principal {
  static StreamTokenizer in = new StreamTokenizer(new BufferedReader(new InputStreamReader(System.in)));

  static int lerInt() throws IOException {
    in.nextToken();
    return (int) in.nval;
  }

  public static void main(String[] args) throws IOException {
    int n = lerInt();
    int k = lerInt();
    while (n != 0 || k != 0) {
      int[] chegada = new int[n];
      int[] saida = new int[n];
      for (int i = 0; i < n; i++) {
        chegada[i] = lerInt();
        saida[i] = lerInt();
      }
      System.out.println(possivel(chegada, saida, n, k) ? "Sim" : "Nao");
      n = lerInt();
      k = lerInt();
    }
  }

  static boolean possivel(int[] chegada, int[] saida, int n, int k) {
    // implementar
  }
}`,
    visual: visual('stack', 'Corredor = pilha de horarios de saida', 'Antes de cada chegada, saem os carros do topo cujo horario ja passou; o novo carro precisa sair antes do que fica na frente dele.', ['tira topo se saida <= chegada', 'cheio? Nao', 'saida nova < topo?']),
    step: functionStep({
      id: 'code-prova1-pratica-estacionamento-step',
      prompt: 'Escreva o corpo de possivel(chegada, saida, n, k).',
      signature: 'static boolean possivel(int[] chegada, int[] saida, int n, int k)',
      solution: `static boolean possivel(int[] chegada, int[] saida, int n, int k) {
  int[] pilha = new int[n];
  int topo = -1;
  boolean resp = true;
  for (int i = 0; i < n && resp; i++) {
    while (topo >= 0 && pilha[topo] <= chegada[i]) {
      topo--;
    }
    if (topo + 1 == k || (topo >= 0 && pilha[topo] < saida[i])) {
      resp = false;
    } else {
      topo++;
      pilha[topo] = saida[i];
    }
  }
  return resp;
}`,
      requiredFragments: [
        req('leave', 'antes de entrar, saem os carros do topo que ja iam embora', 'while (topo >= 0 && pilha[topo] <= chegada[i])'),
        req('full', 'estacionamento lotado', 'topo + 1 == k'),
        req('blocked', 'o carro novo prenderia o da frente, que sai antes', 'pilha[topo] < saida[i]'),
        req('push', 'estaciona guardando o horario de saida', 'pilha[topo] = saida[i];'),
      ],
      lineExplanations: [
        { code: 'while (topo >= 0 && pilha[topo] <= chegada[i])', note: 'O "<=" vem do enunciado: um motorista pode chegar no mesmo instante em que outro sai.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(n) por caso: cada carro entra e sai da pilha uma vez. A pilha guarda so os horarios de saida — e o que decide se alguem fica preso.',
    }),
  },
  {
    id: 'code-prova1-pratica-trilhos-movimentos',
    domainId: 'vetores',
    moduleId: 'pilha',
    title: 'beecrowd 1063: Trilhos Novamente... Traçando Movimentos',
    source: 'prova1-pratica',
    difficulty: 'avancado',
    repetitionGroup: 'prova1-pratica-trilhos-movimentos',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: beecrowd('1063', 'Trilhos Novamente... Traçando Movimentos', 1),
    samples: samplesDoBeecrowd('1063'),
    goal: 'Mesma simulacao do 1062, mas registrando cada empilha (I) e desempilha (R) e parando no ponto em que trava.',
    stem:
      'De volta a estacao da cidade PopPush: cada vagao que chega pelo lado A e desconectado, entra na estacao e depois segue para o lado B; o vagao que entra na estacao so sai pelo lado B e, depois que sai, nao entra de novo. Agora os vagoes sao identificados por letras minusculas (de a ate z, no maximo 26 vagoes) e o chefe quer a sequencia de movimentos que produz a saida desejada: I (insere na estacao o proximo vagao do lado A) e R (remove um vagao da estacao para o lado B). Por exemplo, com a entrada e, t, d, a e a saida desejada d, a, t, e, os movimentos sao I, I, I, R, I, R, R, R.\n\n' +
      'Entrada: varios casos de teste, cada um com 3 linhas: a primeira com N, o numero de vagoes; a segunda com a sequencia de vagoes que vem do lado A; a terceira com a sequencia desejada no lado B (letras separadas por espaco). A ultima linha da entrada contem apenas 0.\n\n' +
      'Saida: para cada caso, uma linha com a sequencia de I e R. Se nao for possivel obter a saida desejada, as operacoes devem ser interrompidas e deve ser impressa a mensagem "Impossible", com um espaco depois da sequencia feita ate ali.',
    scaffold: `import java.io.*;

public class Principal {
  public static void main(String[] args) throws IOException {
    BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
    int n = Integer.parseInt(in.readLine().trim());
    while (n != 0) {
      char[] entrada = in.readLine().replace(" ", "").toCharArray();
      char[] saida = in.readLine().replace(" ", "").toCharArray();
      System.out.println(movimentos(entrada, saida, n));
      n = Integer.parseInt(in.readLine().trim());
    }
  }

  static String movimentos(char[] entrada, char[] saida, int n) {
    // implementar
  }
}`,
    visual: visual('stack', 'Registrando I e R', 'Empilha (I) ate o topo ser o proximo vagao desejado; entao desempilha (R). Travou? "Impossible".', ['I: empilha proximo de A', 'R: topo == desejado', 'sem vagao em A: trava']),
    step: functionStep({
      id: 'code-prova1-pratica-trilhos-movimentos-step',
      prompt: 'Escreva o corpo de movimentos(entrada, saida, n).',
      signature: 'static String movimentos(char[] entrada, char[] saida, int n)',
      solution: `static String movimentos(char[] entrada, char[] saida, int n) {
  char[] pilha = new char[n];
  int topo = -1;
  int proximo = 0;
  String resp = "";
  boolean possivel = true;
  for (int pos = 0; pos < n && possivel; pos++) {
    while ((topo == -1 || pilha[topo] != saida[pos]) && proximo < n) {
      topo++;
      pilha[topo] = entrada[proximo];
      proximo++;
      resp += "I";
    }
    if (topo == -1 || pilha[topo] != saida[pos]) {
      possivel = false;
    } else {
      topo--;
      resp += "R";
    }
  }
  if (!possivel) {
    resp += " Impossible";
  }
  return resp;
}`,
      requiredFragments: [
        req('push', 'empilha registrando I', 'resp += "I";'),
        req('pop', 'desempilha registrando R', 'resp += "R";'),
        req('stuck', 'sem vagao pra empilhar e topo errado: trava', 'if (topo == -1 || pilha[topo] != saida[pos])'),
        req('message', 'mensagem com espaco antes', 'resp += " Impossible";'),
      ],
      lineExplanations: [
        { code: 'resp += " Impossible";', note: 'A sequencia impressa e so ate onde deu para ir — os movimentos param no ponto em que travou, e o espaco vem antes da palavra.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(n): cada vagao gera no maximo um I e um R.',
    }),
  },
  {
    id: 'code-prova1-pratica-infixa-posfixa',
    domainId: 'vetores',
    moduleId: 'pilha',
    title: 'beecrowd 1077: Infixa para Posfixa',
    source: 'prova1-pratica',
    difficulty: 'avancado',
    repetitionGroup: 'prova1-pratica-infixa-posfixa',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: beecrowd('1077', 'Infixa para Posfixa', 1),
    samples: samplesDoBeecrowd('1077'),
    goal: 'Pilha de operadores com precedencia (Shunting-Yard): operando vai direto pra saida, operador espera na pilha.',
    stem:
      'O professor pediu um programa que converta uma expressao da forma infixa (a que usamos normalmente, com o operador NO MEIO dos operandos) para a forma posfixa (operador DEPOIS dos operandos). O programa so precisa lidar com os operadores binarios + - * / e a potencia (circunflexo), parenteses, letras e numeros. Por exemplo, A*B+C vira AB*C+.\n\n' +
      'Entrada: a primeira linha tem um inteiro N (N < 1000), o numero de casos de teste. Cada caso e uma expressao infixa valida, com ate 300 caracteres.\n\n' +
      'Saida: para cada caso, uma linha com a expressao convertida para a forma posfixa.',
    scaffold: `import java.io.*;

public class Principal {
  public static void main(String[] args) throws IOException {
    BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
    int n = Integer.parseInt(in.readLine().trim());
    for (int i = 0; i < n; i++) {
      System.out.println(converter(in.readLine().trim()));
    }
  }

  static String converter(String expressao) {
    // implementar (pode criar um metodo auxiliar prioridade(c))
  }
}`,
    visual: visual('stack', 'Pilha de operadores', 'Antes de empilhar um operador, desempilha para a saida os que tem prioridade maior ou igual; ")" desempilha ate o "(".', ['operando: direto', 'operador: espera', '")": esvazia ate "("']),
    step: functionStep({
      id: 'code-prova1-pratica-infixa-posfixa-step',
      prompt: 'Escreva converter(expressao) e o auxiliar prioridade(c).',
      signature: 'static String converter(String expressao)',
      solution: `static String converter(String expressao) {
  char[] pilha = new char[expressao.length()];
  int topo = -1;
  String resp = "";
  for (int i = 0; i < expressao.length(); i++) {
    char c = expressao.charAt(i);
    if (Character.isLetterOrDigit(c)) {
      resp += c;
    } else if (c == '(' || c == '^') {
      topo++;
      pilha[topo] = c;
    } else if (c == ')') {
      while (pilha[topo] != '(') {
        resp += pilha[topo];
        topo--;
      }
      topo--;
    } else {
      while (topo >= 0 && pilha[topo] != '(' && prioridade(pilha[topo]) >= prioridade(c)) {
        resp += pilha[topo];
        topo--;
      }
      topo++;
      pilha[topo] = c;
    }
  }
  while (topo >= 0) {
    resp += pilha[topo];
    topo--;
  }
  return resp;
}

static int prioridade(char c) {
  int resp = 1;
  if (c == '^') {
    resp = 3;
  } else if (c == '*' || c == '/') {
    resp = 2;
  }
  return resp;
}`,
      requiredFragments: [
        req('operand', 'letra ou digito vai direto pra saida', 'Character.isLetterOrDigit(c)'),
        req('close', '")" desempilha ate achar o "("', "while (pilha[topo] != '(')"),
        req('precedence', 'desempilha quem tem prioridade maior ou igual', 'prioridade(pilha[topo]) >= prioridade(c)'),
        req('flush', 'no fim, esvazia a pilha', 'while (topo >= 0)'),
      ],
      lineExplanations: [
        { code: "} else if (c == '(' || c == '^') {", note: 'A potencia e empilhada direto, sem desempilhar ninguem: e associativa a direita (a^b^c = a^(b^c)), igual as solucoes aceitas no juiz.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(m) por expressao: cada simbolo entra e sai da pilha no maximo uma vez. A prova teorica cobra a operacao inversa (avaliar a posfixa com pilha).',
    }),
  },
  {
    id: 'code-prova1-pratica-josephus',
    domainId: 'vetores',
    moduleId: 'fila',
    title: 'beecrowd 1030: A Lenda de Flavious Josephus',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-josephus',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: beecrowd('1030', 'A Lenda de Flavious Josephus', 1),
    samples: samplesDoBeecrowd('1030'),
    goal: 'Simular o circulo com fila circular (gira k-1, remove 1) ou achar a recorrencia do Josephus.',
    stem:
      'O problema de Josephus vem da lenda do historiador Flavius Josephus: ele e seus 40 companheiros, presos numa caverna cercada pelos romanos, formaram um circulo e foram eliminando um homem a cada salto de tres, ate sobrar um so. Generalizando: n pessoas em circulo, numeradas de 1 ate n, e um salto de tamanho k ate o proximo homem a ser eliminado. Por exemplo, com 5 homens e salto 2, quem sobra e o 3.\n\n' +
      'Entrada: NC (1 <= NC <= 30) casos de teste. Cada caso e um par de inteiros positivos n (1 <= n <= 10000) e k (1 <= k <= 1000): o numero de pessoas no circulo e o tamanho do salto.\n\n' +
      'Saida: para cada caso, uma linha no formato "Case n: m" (n e o numero do caso e m quem sobra), sempre com um espaco antes do n e antes do m.',
    scaffold: `import java.util.Scanner;

public class Principal {
  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    int nc = in.nextInt();
    for (int c = 1; c <= nc; c++) {
      int n = in.nextInt();
      int k = in.nextInt();
      System.out.println("Case " + c + ": " + sobrevivente(n, k));
    }
  }

  static int sobrevivente(int n, int k) {
    // implementar
  }
}`,
    visual: visual('queue', 'Circulo = fila circular', 'Girar k-1 pessoas da frente para o fim e eliminar a da frente e o mesmo que andar k no circulo.', ['gira k-1', 'remove a frente', 'ate sobrar 1']),
    step: functionChoiceStep({
      id: 'code-prova1-pratica-josephus-step',
      prompt: 'Escreva o corpo de sobrevivente(n, k).',
      variants: [
        {
          id: 'fila-circular',
          label: 'Simulacao com fila circular',
          signature: 'static int sobrevivente(int n, int k)',
          solution: `static int sobrevivente(int n, int k) {
  int[] fila = new int[n + 1];
  int primeiro = 0, ultimo = 0;
  for (int i = 1; i <= n; i++) {
    fila[ultimo] = i;
    ultimo = (ultimo + 1) % fila.length;
  }
  int tamanho = n;
  while (tamanho > 1) {
    int passos = (k - 1) % tamanho;
    for (int p = 0; p < passos; p++) {
      fila[ultimo] = fila[primeiro];
      ultimo = (ultimo + 1) % fila.length;
      primeiro = (primeiro + 1) % fila.length;
    }
    primeiro = (primeiro + 1) % fila.length;
    tamanho--;
  }
  return fila[primeiro];
}`,
          requiredFragments: [
            req('rotate', 'gira k-1 da frente pro fim (modulo o tamanho atual)', '(k - 1) % tamanho'),
            req('move', 'a frente vai pro fim', 'fila[ultimo] = fila[primeiro];'),
            req('remove', 'elimina a frente', 'tamanho--;'),
          ],
          lineExplanations: [{ code: 'int passos = (k - 1) % tamanho;', note: 'Girar "tamanho" vezes volta ao mesmo estado; o modulo evita voltas inuteis quando k e maior que o circulo.' }],
        },
        {
          id: 'recorrencia',
          label: 'Recorrencia de Josephus (recursiva)',
          signature: 'static int sobrevivente(int n, int k)',
          solution: `static int sobrevivente(int n, int k) {
  return josephus(n, k) + 1;
}

static int josephus(int n, int k) {
  int resp = 0;
  if (n > 1) {
    resp = (josephus(n - 1, k) + k) % n;
  }
  return resp;
}`,
          requiredFragments: [
            req('base', 'um so no circulo: posicao 0', 'int resp = 0;'),
            req('step', 'J(n) = (J(n - 1) + k) % n', '(josephus(n - 1, k) + k) % n'),
            req('one-based', 'posicao 0 vira pessoa 1', 'josephus(n, k) + 1'),
          ],
          lineExplanations: [{ code: 'resp = (josephus(n - 1, k) + k) % n;', note: 'Depois da primeira eliminacao sobram n - 1 pessoas, comecando k posicoes a frente: renumerando, o sobrevivente e o de n - 1 deslocado k.' }],
        },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Fila circular: Theta(n * min(k, n)) — ate 10^7 por caso, ainda cabe. Recorrencia: Theta(n). Remover de um vetor comum deslocando os elementos seria Theta(n^2) por caso.',
    }),
  },
  {
    id: 'code-prova1-pratica-crise-energia',
    domainId: 'vetores',
    moduleId: 'fila',
    title: 'beecrowd 1031: Crise de Energia',
    source: 'prova1-pratica',
    difficulty: 'avancado',
    repetitionGroup: 'prova1-pratica-crise-energia',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: beecrowd('1031', 'Crise de Energia', 1),
    samples: samplesDoBeecrowd('1031'),
    goal: 'Josephus disfarcado: simular a fila para cada m e parar no primeiro que deixa a regiao 13 por ultimo.',
    stem:
      'Numa crise de energia na Nova Zelandia, o pais foi dividido em N regioes (Auckland e a regiao 1 e Wellington a 13) e foi criado um esquema "justo" de corte de luz: escolhe-se um numero m, desliga-se primeiro a regiao 1 e, a partir dela, a cada m regioes ainda ligadas (dando a volta e pulando as ja desligadas) desliga-se a seguinte. Com N = 17 e m = 5, a ordem e 1, 6, 11, 16, 5, 12, 2, 9, 17, 10, 4, 15, 14, 3, 8, 13, 7. Seria mais justo Wellington (regiao 13, onde fica a sede da empresa) ser a ULTIMA: dado N, encontre o menor m que garante isso.\n\n' +
      'Entrada: uma serie de linhas, cada uma com o numero de regioes N (13 <= N <= 100). O fim da entrada e indicado por uma linha com 0.\n\n' +
      'Saida: para cada linha de entrada, uma linha com o menor m que deixa a regiao 13 por ultimo.',
    scaffold: `import java.util.Scanner;

public class Principal {
  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    int n = in.nextInt();
    while (n != 0) {
      System.out.println(menorSalto(n));
      n = in.nextInt();
    }
  }

  static int menorSalto(int n) {
    // implementar (pode criar um metodo auxiliar ultimaDesligada(n, m) que simula com uma fila)
  }
}`,
    visual: visual('queue', 'Testa m = 1, 2, 3, ...', 'Para cada m, simula a fila: tira a regiao 1, depois gira m-1 e desliga a da frente. Parou no 13? Achou.', ['remove 1', 'gira m-1, remove', 'ultima == 13?']),
    step: functionStep({
      id: 'code-prova1-pratica-crise-energia-step',
      prompt: 'Escreva menorSalto(n) e o auxiliar ultimaDesligada(n, m).',
      signature: 'static int menorSalto(int n)',
      solution: `static int menorSalto(int n) {
  int m = 1;
  while (ultimaDesligada(n, m) != 13) {
    m++;
  }
  return m;
}

static int ultimaDesligada(int n, int m) {
  int[] fila = new int[n + 1];
  int primeiro = 0, ultimo = 0;
  for (int i = 1; i <= n; i++) {
    fila[ultimo] = i;
    ultimo = (ultimo + 1) % fila.length;
  }
  int resp = fila[primeiro];
  primeiro = (primeiro + 1) % fila.length;
  int tamanho = n - 1;
  while (tamanho > 0) {
    int passos = (m - 1) % tamanho;
    for (int p = 0; p < passos; p++) {
      fila[ultimo] = fila[primeiro];
      ultimo = (ultimo + 1) % fila.length;
      primeiro = (primeiro + 1) % fila.length;
    }
    resp = fila[primeiro];
    primeiro = (primeiro + 1) % fila.length;
    tamanho--;
  }
  return resp;
}`,
      requiredFragments: [
        req('search-m', 'testa m crescente ate achar', 'while (ultimaDesligada(n, m) != 13)'),
        req('first-off', 'a regiao 1 e sempre a primeira desligada', 'int tamanho = n - 1;'),
        req('rotate', 'gira m-1 regioes ligadas', '(m - 1) % tamanho'),
        req('last', 'guarda a ultima desligada', 'resp = fila[primeiro];'),
      ],
      lineExplanations: [
        { code: 'int tamanho = n - 1;', note: 'Diferente do Josephus classico, a PRIMEIRA eliminada e fixa (regiao 1); a contagem de m comeca depois dela.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Cada simulacao custa Theta(n * min(m, n)) e o m procurado e pequeno para N <= 100. E o problema de Josephus com o ponto de partida deslocado.',
    }),
  },
  {
    id: 'code-prova1-pratica-cw-josephus-permutation',
    domainId: 'vetores',
    moduleId: 'fila',
    title: 'Codewars: Josephus Permutation (5 kyu)',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-cw-josephus-permutation',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: codewars('5550d638a99ddb113e0000a2', 'Josephus Permutation'),
    samples: [{ input: 'items = [1,2,3,4,5,6,7], k = 3', output: '[3,6,2,7,5,1,4]' }],
    goal: 'Devolver a ORDEM de eliminacao do Josephus, nao so o sobrevivente.',
    stem:
      'O nome vem da historia de Josephus: cercado pelos romanos numa caverna com 40 soldados, o grupo formou um circulo e eliminava um homem a cada tres, ate sobrar o ultimo. Crie uma funcao que devolve a permutacao de Josephus: recebe a lista inicial de itens, dispostos como num circulo, e vai contando de k em k — cada item contado sai do circulo e entra no resultado — ate nao sobrar nenhum. Dica do enunciado: conte de 1 ate n em vez de 0 ate n-1; k e sempre >= 1.\n\n' +
      'Entrada: a lista items e o inteiro k (parametros do metodo).\n\n' +
      'Saida: a lista com os itens na ordem em que foram retirados. Com items = [1,2,3,4,5,6,7] e k = 3, saem 3, 6, 2, 7, 5, 1 e por ultimo 4.',
    scaffold: `import java.util.ArrayList;
import java.util.List;

public class Josephus {
  public static <T> List<T> josephusPermutation(final List<T> items, final int k) {
    // implementar
  }
}`,
    visual: visual('queue', 'Circulo com indice', 'Com o circulo numa lista, o proximo eliminado esta em (pos + k - 1) % tamanho.', ['pos = (pos + k - 1) % tam', 'remove pos', 'resultado recebe']),
    step: functionStep({
      id: 'code-prova1-pratica-cw-josephus-permutation-step',
      prompt: 'Escreva o metodo josephusPermutation(items, k).',
      signature: 'public static <T> List<T> josephusPermutation(final List<T> items, final int k)',
      solution: `public static <T> List<T> josephusPermutation(final List<T> items, final int k) {
  List<T> circulo = new ArrayList<T>(items);
  List<T> resp = new ArrayList<T>();
  int pos = 0;
  while (circulo.size() > 0) {
    pos = (pos + k - 1) % circulo.size();
    resp.add(circulo.remove(pos));
  }
  return resp;
}`,
      requiredFragments: [
        req('copy', 'trabalha numa copia (nao mexe na lista recebida)', 'new ArrayList<T>(items)'),
        req('next', 'proximo eliminado: anda k - 1 a partir de pos, dando a volta', 'pos = (pos + k - 1) % circulo.size();'),
        req('remove', 'tira do circulo e poe no resultado', 'resp.add(circulo.remove(pos));'),
      ],
      lineExplanations: [
        { code: 'pos = (pos + k - 1) % circulo.size();', note: 'Depois de remover, o elemento seguinte "escorrega" para a posicao pos — por isso anda k - 1, e nao k.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Theta(n^2) no pior caso (cada remove desloca a lista), o bastante para os testes do kata. E o 1030 do beecrowd devolvendo a ordem inteira.',
    }),
  },
  {
    id: 'code-prova1-pratica-cw-dir-reduc',
    domainId: 'vetores',
    moduleId: 'pilha',
    title: 'Codewars: Directions Reduction (5 kyu)',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-cw-dir-reduc',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: codewars('550f22f4d758534c1100025a', 'Directions Reduction'),
    samples: [
      { input: 'arr = ["NORTH", "SOUTH", "SOUTH", "EAST", "WEST", "NORTH", "WEST"]', output: '["WEST"]' },
      { input: 'arr = ["NORTH", "SOUTH", "EAST", "WEST"]', output: '[]' },
      { input: 'arr = ["NORTH", "EAST", "WEST", "SOUTH", "WEST", "WEST"]', output: '["WEST", "WEST"]' },
      { input: 'arr = ["NORTH", "WEST", "SOUTH", "EAST"]', output: '["NORTH", "WEST", "SOUTH", "EAST"]' },
    ],
    goal: 'Parenteses disfarcados: uma direcao "fecha" a do topo se for a oposta.',
    stem:
      'No velho oeste, um viajante recebeu uma lista de direcoes: "NORTH", "SOUTH", "WEST" e "EAST". NORTH e SOUTH sao opostas, WEST e EAST tambem. Andar numa direcao e LOGO EM SEGUIDA na oposta e esforco a toa. Devolva uma versao simplificada do caminho, removendo as direcoes opostas lado a lado — atencao: depois de uma remocao, outras direcoes opostas podem ficar lado a lado e tambem saem. Nem todo caminho simplifica: ["NORTH", "WEST", "SOUTH", "EAST"] continua igual, porque nenhum par vizinho e oposto.\n\n' +
      'Entrada: o vetor arr com as direcoes (parametro do metodo).\n\n' +
      'Saida: o vetor com as direcoes que sobraram (pode ser vazio).',
    scaffold: `public class DirReduction {
  public static String[] dirReduc(String[] arr) {
    // implementar (pode criar um metodo auxiliar opostas(a, b))
  }
}`,
    visual: visual('stack', 'Oposta ao topo cancela', 'Empilha cada direcao; se ela for oposta a do topo, as duas se anulam (desempilha).', ['NORTH x SOUTH', 'EAST x WEST', 'oposta ao topo? pop']),
    step: functionStep({
      id: 'code-prova1-pratica-cw-dir-reduc-step',
      prompt: 'Escreva dirReduc(arr) e o auxiliar opostas(a, b).',
      signature: 'public static String[] dirReduc(String[] arr)',
      solution: `public static String[] dirReduc(String[] arr) {
  String[] pilha = new String[arr.length];
  int topo = -1;
  for (int i = 0; i < arr.length; i++) {
    if (topo >= 0 && opostas(pilha[topo], arr[i])) {
      topo--;
    } else {
      topo++;
      pilha[topo] = arr[i];
    }
  }
  String[] resp = new String[topo + 1];
  for (int i = 0; i <= topo; i++) {
    resp[i] = pilha[i];
  }
  return resp;
}

static boolean opostas(String a, String b) {
  return (a.equals("NORTH") && b.equals("SOUTH")) || (a.equals("SOUTH") && b.equals("NORTH"))
      || (a.equals("EAST") && b.equals("WEST")) || (a.equals("WEST") && b.equals("EAST"));
}`,
      requiredFragments: [
        req('cancel', 'oposta ao topo: as duas se anulam', 'if (topo >= 0 && opostas(pilha[topo], arr[i]))'),
        req('push', 'senao, empilha', 'pilha[topo] = arr[i];'),
        req('result', 'o que sobrou na pilha, de baixo pra cima, e a resposta', 'String[] resp = new String[topo + 1];'),
      ],
      lineExplanations: [
        { code: 'if (topo >= 0 && opostas(pilha[topo], arr[i]))', note: 'A pilha resolve de graca o "depois de remover, outras podem ficar lado a lado": o novo topo ja e o vizinho da esquerda.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Theta(n) com pilha. Remover pares e recomecar a varredura ate nao mudar nada funciona, mas e Theta(n^2).',
    }),
  },
  {
    id: 'code-prova1-pratica-lc-valid-parentheses',
    domainId: 'vetores',
    moduleId: 'pilha',
    title: 'LeetCode 20: Valid Parentheses',
    source: 'prova1-pratica',
    difficulty: 'basico',
    repetitionGroup: 'prova1-pratica-lc-valid-parentheses',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    judge: leetcode('20', 'valid-parentheses', 'Valid Parentheses'),
    samples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
      { input: 's = "([])"', output: 'true' },
      { input: 's = "([)]"', output: 'false' },
    ],
    goal: 'Parenteses com 3 tipos: agora a pilha precisa guardar QUAL abriu.',
    stem:
      'Dada uma string s contendo apenas os caracteres (, ), {, }, [ e ], diga se ela e valida. Uma string e valida quando: todo simbolo que abre e fechado pelo mesmo tipo de simbolo; os simbolos que abrem sao fechados na ordem correta; e todo simbolo que fecha tem um simbolo que abre correspondente, do mesmo tipo.\n\n' +
      'Entrada: a string s (1 <= s.length <= 10^4, so com os caracteres ()[]{}), parametro do metodo.\n\n' +
      'Saida: true se s for valida, false caso contrario.',
    scaffold: `class Solution {
    public boolean isValid(String s) {
        // implementar
    }
}`,
    visual: visual('stack', 'Pilha guarda o tipo', 'Fechamento so vale se o topo for a abertura do MESMO tipo.', ['( [ { empilham', ') ] } conferem o topo', 'vazia no fim']),
    step: functionStep({
      id: 'code-prova1-pratica-lc-valid-parentheses-step',
      prompt: 'Escreva o metodo isValid(s) (pode criar um auxiliar combina(abre, fecha)).',
      signature: 'public boolean isValid(String s)',
      solution: `public boolean isValid(String s) {
  char[] pilha = new char[s.length()];
  int topo = -1;
  boolean resp = true;
  for (int i = 0; i < s.length() && resp; i++) {
    char c = s.charAt(i);
    if (c == '(' || c == '[' || c == '{') {
      topo++;
      pilha[topo] = c;
    } else if (topo == -1 || !combina(pilha[topo], c)) {
      resp = false;
    } else {
      topo--;
    }
  }
  return resp && topo == -1;
}

private boolean combina(char abre, char fecha) {
  return (abre == '(' && fecha == ')') || (abre == '[' && fecha == ']') || (abre == '{' && fecha == '}');
}`,
      requiredFragments: [
        req('push', 'empilha as aberturas', "if (c == '(' || c == '[' || c == '{')"),
        req('check', 'fechamento precisa casar com o topo', '!combina(pilha[topo], c)'),
        req('final', 'nada pode sobrar aberto', 'return resp && topo == -1;'),
      ],
      lineExplanations: [
        { code: 'return resp && topo == -1;', note: 'Sem isso, "((" seria aceita: nenhum fechamento errado, mas duas aberturas sem par.' },
      ],
      mistakeTag: 'lost-pointer',
      explanation: 'Theta(n) com uma pilha em vetor (no maximo n aberturas). Mesma ideia do beecrowd 1068, agora com tres tipos.',
    }),
  },
  {
    id: 'code-prova1-pratica-lc-min-stack',
    domainId: 'vetores',
    moduleId: 'pilha',
    title: 'LeetCode 155: Min Stack',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-lc-min-stack',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: leetcode('155', 'min-stack', 'Min Stack'),
    samples: [
      {
        input: '["MinStack","push","push","push","getMin","pop","top","getMin"]\n[[],[-2],[0],[-3],[],[],[],[]]',
        output: '[null,null,null,null,-3,null,0,-2]',
      },
    ],
    goal: 'A classe inteira de uma pilha com minimo em O(1) — a versao "orientada a objeto" do beecrowd 2929.',
    stem:
      'Projete uma pilha que suporte push, pop, top e a consulta do MENOR elemento, todas em tempo constante. Implemente a classe MinStack: MinStack() inicializa a pilha; void push(int value) empilha value; void pop() remove o elemento do topo; int top() devolve o elemento do topo; int getMin() devolve o menor elemento da pilha. Cada funcao deve ser O(1).\n\n' +
      'Entrada: a sequencia de chamadas (primeira linha) e os argumentos de cada uma (segunda linha), no formato do LeetCode. Os valores cabem num int; pop, top e getMin sempre sao chamados com a pilha nao vazia; no maximo 3 * 10^4 chamadas.\n\n' +
      'Saida: o retorno de cada chamada, na ordem (null para o construtor e para os metodos void).',
    scaffold: `class MinStack {

    public MinStack() {
        // implementar
    }

    public void push(int value) {
        // implementar
    }

    public void pop() {
        // implementar
    }

    public int top() {
        // implementar
    }

    public int getMin() {
        // implementar
    }
}`,
    visual: visual('stack', 'Duas pilhas lado a lado', 'pilhaMin[i] guarda o menor valor de pilha[0..i]; getMin so le o topo dela.', ['push: min(novo, min anterior)', 'pop: as duas descem', 'getMin: pilhaMin[topo]']),
    step: functionStep({
      id: 'code-prova1-pratica-lc-min-stack-step',
      prompt: 'Escreva os atributos, o construtor e os metodos da classe MinStack.',
      signature: 'class MinStack',
      solution: `private int[] pilha = new int[30000];
private int[] pilhaMin = new int[30000];
private int topo = -1;

public MinStack() {
}

public void push(int value) {
  topo++;
  pilha[topo] = value;
  if (topo == 0 || value < pilhaMin[topo - 1]) {
    pilhaMin[topo] = value;
  } else {
    pilhaMin[topo] = pilhaMin[topo - 1];
  }
}

public void pop() {
  topo--;
}

public int top() {
  return pilha[topo];
}

public int getMin() {
  return pilhaMin[topo];
}`,
      requiredFragments: [
        req('min-push', 'novo minimo ou repete o anterior', 'value < pilhaMin[topo - 1]'),
        req('min-copy', 'repete o minimo de baixo', 'pilhaMin[topo] = pilhaMin[topo - 1];'),
        req('get-min', 'getMin le o topo da pilha auxiliar', 'return pilhaMin[topo];'),
      ],
      lineExplanations: [
        { code: 'private int[] pilha = new int[30000];', note: 'O enunciado garante no maximo 3 * 10^4 chamadas, entao um vetor desse tamanho nunca estoura.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Todas as operacoes Theta(1). Guardar so UMA variavel "menor" nao funciona: quando o menor sai com pop, voce nao sabe qual era o segundo menor.',
    }),
  },
  {
    id: 'code-prova1-pratica-lc-queue-using-stacks',
    domainId: 'vetores',
    moduleId: 'fila',
    title: 'LeetCode 232: Implement Queue using Stacks',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-lc-queue-using-stacks',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: leetcode('232', 'implement-queue-using-stacks', 'Implement Queue using Stacks'),
    samples: [
      {
        input: '["MyQueue", "push", "push", "peek", "pop", "empty"]\n[[], [1], [2], [], [], []]',
        output: '[null, null, null, 1, 1, false]',
      },
    ],
    goal: 'Fila com duas pilhas (o Fila2Pilha do material do professor), com custo amortizado O(1).',
    stem:
      'Implemente uma fila (primeiro a entrar, primeiro a sair) usando APENAS duas pilhas. A classe MyQueue deve ter: void push(int x) poe x no fim da fila; int pop() remove e devolve o elemento da frente; int peek() devolve o elemento da frente; boolean empty() diz se a fila esta vazia. So valem as operacoes normais de pilha: empilhar no topo, ver/desempilhar o topo, tamanho e vazia.\n\n' +
      'Entrada: a sequencia de chamadas (primeira linha) e os argumentos de cada uma (segunda linha), no formato do LeetCode. 1 <= x <= 9; no maximo 100 chamadas; pop e peek sempre sao validos.\n\n' +
      'Saida: o retorno de cada chamada, na ordem (null para o construtor e para push). Desafio do enunciado: custo amortizado O(1) por operacao.',
    scaffold: `class MyQueue {

    public MyQueue() {
        // implementar
    }

    public void push(int x) {
        // implementar
    }

    public int pop() {
        // implementar
    }

    public int peek() {
        // implementar
    }

    public boolean empty() {
        // implementar
    }
}`,
    visual: visual('stack', 'Duas pilhas = uma fila', 'push vai na pilha de entrada; pop/peek usam a de saida, que so e reabastecida (invertendo a de entrada) quando esvazia.', ['entrada: push', 'saida vazia? transfere', 'pop/peek na saida']),
    step: functionStep({
      id: 'code-prova1-pratica-lc-queue-using-stacks-step',
      prompt: 'Escreva os atributos, o construtor e os metodos da classe MyQueue.',
      signature: 'class MyQueue',
      solution: `private int[] entrada = new int[100];
private int[] saida = new int[100];
private int topoEntrada = -1, topoSaida = -1;

public MyQueue() {
}

public void push(int x) {
  topoEntrada++;
  entrada[topoEntrada] = x;
}

public int pop() {
  transferir();
  int resp = saida[topoSaida];
  topoSaida--;
  return resp;
}

public int peek() {
  transferir();
  return saida[topoSaida];
}

public boolean empty() {
  return topoEntrada == -1 && topoSaida == -1;
}

private void transferir() {
  if (topoSaida == -1) {
    while (topoEntrada >= 0) {
      topoSaida++;
      saida[topoSaida] = entrada[topoEntrada];
      topoEntrada--;
    }
  }
}`,
      requiredFragments: [
        req('push', 'push sempre na pilha de entrada', 'entrada[topoEntrada] = x;'),
        req('only-when-empty', 'so transfere quando a saida esta vazia', 'if (topoSaida == -1)'),
        req('reverse', 'desempilha da entrada e empilha na saida (inverte a ordem)', 'saida[topoSaida] = entrada[topoEntrada];'),
        req('empty', 'vazia so se as duas pilhas estiverem vazias', 'topoEntrada == -1 && topoSaida == -1'),
      ],
      lineExplanations: [
        { code: 'if (topoSaida == -1) {', note: 'Transferir com a saida ainda cheia embaralharia a ordem: os elementos antigos precisam sair antes.' },
      ],
      mistakeTag: 'lost-pointer',
      explanation: 'Cada elemento e empilhado e desempilhado no maximo duas vezes (uma em cada pilha): custo amortizado Theta(1).',
    }),
  },
  {
    id: 'code-prova1-pratica-lc-circular-queue',
    domainId: 'vetores',
    moduleId: 'fila',
    title: 'LeetCode 622: Design Circular Queue',
    source: 'prova1-pratica',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pratica-lc-circular-queue',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    judge: leetcode('622', 'design-circular-queue', 'Design Circular Queue'),
    samples: [
      {
        input:
          '["MyCircularQueue", "enQueue", "enQueue", "enQueue", "enQueue", "Rear", "isFull", "deQueue", "enQueue", "Rear"]\n[[3], [1], [2], [3], [4], [], [], [], [4], []]',
        output: '[null, true, true, true, false, 3, true, true, true, 4]',
      },
    ],
    goal: 'A fila circular do professor (vetor de tamanho k + 1, primeiro/ultimo) — e o tipo de estrutura da Q3 da Prova 1.',
    stem:
      'Implemente uma fila circular: uma estrutura linear FIFO (primeiro a entrar, primeiro a sair) em que a ultima posicao se liga de volta a primeira, formando um circulo (tambem chamada de "ring buffer"). A vantagem e reaproveitar os espacos da frente da fila que ja foram liberados. A classe MyCircularQueue deve ter: MyCircularQueue(k) cria a fila com tamanho k; int Front() devolve o elemento da frente (-1 se vazia); int Rear() devolve o ultimo elemento (-1 se vazia); boolean enQueue(int value) insere e devolve true se deu certo; boolean deQueue() remove e devolve true se deu certo; boolean isEmpty() e boolean isFull(). Nao use a fila pronta da linguagem.\n\n' +
      'Entrada: a sequencia de chamadas (primeira linha) e os argumentos de cada uma (segunda linha), no formato do LeetCode. 1 <= k <= 1000; 0 <= value <= 1000; no maximo 3000 chamadas.\n\n' +
      'Saida: o retorno de cada chamada, na ordem (null para o construtor).',
    scaffold: `class MyCircularQueue {

    public MyCircularQueue(int k) {
        // implementar
    }

    public boolean enQueue(int value) {
        // implementar
    }

    public boolean deQueue() {
        // implementar
    }

    public int Front() {
        // implementar
    }

    public int Rear() {
        // implementar
    }

    public boolean isEmpty() {
        // implementar
    }

    public boolean isFull() {
        // implementar
    }
}`,
    visual: visual('queue', 'Fila circular com uma posicao sobrando', 'Vetor de k + 1 posicoes: vazia quando primeiro == ultimo, cheia quando (ultimo + 1) % tamanho == primeiro.', ['vazia: primeiro == ultimo', 'cheia: (ultimo + 1) % t == primeiro', 'Rear: ultimo - 1']),
    step: functionStep({
      id: 'code-prova1-pratica-lc-circular-queue-step',
      prompt: 'Escreva os atributos, o construtor e os metodos da classe MyCircularQueue.',
      signature: 'class MyCircularQueue',
      solution: `private int[] array;
private int primeiro, ultimo;

public MyCircularQueue(int k) {
  array = new int[k + 1];
  primeiro = ultimo = 0;
}

public boolean enQueue(int value) {
  boolean resp = false;
  if (!isFull()) {
    array[ultimo] = value;
    ultimo = (ultimo + 1) % array.length;
    resp = true;
  }
  return resp;
}

public boolean deQueue() {
  boolean resp = false;
  if (!isEmpty()) {
    primeiro = (primeiro + 1) % array.length;
    resp = true;
  }
  return resp;
}

public int Front() {
  return isEmpty() ? -1 : array[primeiro];
}

public int Rear() {
  return isEmpty() ? -1 : array[(ultimo - 1 + array.length) % array.length];
}

public boolean isEmpty() {
  return primeiro == ultimo;
}

public boolean isFull() {
  return (ultimo + 1) % array.length == primeiro;
}`,
      requiredFragments: [
        req('size', 'vetor com uma posicao a mais (estilo do professor)', 'new int[k + 1]'),
        req('full', 'cheia quando o proximo de ultimo e o primeiro', '(ultimo + 1) % array.length == primeiro'),
        req('empty', 'vazia quando primeiro == ultimo', 'primeiro == ultimo'),
        req('rear', 'o ultimo elemento esta uma posicao antes de ultimo (dando a volta)', '(ultimo - 1 + array.length) % array.length'),
      ],
      lineExplanations: [
        { code: 'array = new int[k + 1];', note: 'A posicao extra e o que diferencia "cheia" de "vazia" sem contador: com k posicoes, primeiro == ultimo significaria as duas coisas.' },
      ],
      mistakeTag: 'lost-pointer',
      explanation: 'Todas as operacoes Theta(1). E a Fila.java do material (u02) com os nomes de metodo do LeetCode; o "+ array.length" no Rear evita indice negativo quando ultimo == 0.',
    }),
  },
];
