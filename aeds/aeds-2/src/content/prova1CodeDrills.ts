import type { CodeDrill, FunctionRequirement, FunctionStep, GapStep, RubricStep, StructureVisual } from '../types/content';

/**
 * Exercicios novos de treino de codigo pra Prova 1 (u00-u04): ordenacao,
 * complexidade e estruturas lineares (fila, pilha, lista), estaticas e
 * flexiveis. Classes e assinaturas copiadas dos materiais oficiais em
 * materiais/Codigos/u02, u03 e u04 (ver docs/prova1-format.md e
 * docs/regras-professor.md). Progressao: cada bloco comeca com os metodos
 * basicos (inserir/remover) em fase 'repeat' e sobe pra variacoes em fase
 * 'modify', quase sempre pedindo implementar um metodo (nao so responder).
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

type GapExamStep = GapStep & { skillId: 'justify' };

function gapStep(step: Omit<GapExamStep, 'kind' | 'skillId'>): GapExamStep {
  return { kind: 'gap', skillId: 'justify', ...step };
}

type RubricExamStep = RubricStep & { skillId: 'justify' };

function rubricStep(step: Omit<RubricExamStep, 'kind' | 'skillId'>): RubricExamStep {
  return { kind: 'rubric', skillId: 'justify', ...step };
}

export const prova1CodeDrillCatalog: CodeDrill[] = [
  // ---------------------------------------------------------------------
  // ORDENACAO
  // ---------------------------------------------------------------------
  {
    id: 'code-prova1-ordenacao-mergesort',
    domainId: 'ordenacao',
    title: 'Ordenacao: mergesort completo',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-ordenacao-mergesort',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Escrever a divisao recursiva do mergesort ate ficar automatica.',
    stem:
      'A intercalacao ja esta pronta (usa sentinela para nao precisar copiar sobras). Implemente mergesort(esq, dir), que divide o vetor ao meio, ordena as duas metades e intercala.',
    scaffold: `class Ordenacao {
  int[] array;

  void mergesort(int esq, int dir) {
    // implementar
  }

  void intercalar(int esq, int meio, int dir) {
    int n1 = meio - esq + 1;
    int n2 = dir - meio;
    int[] a1 = new int[n1 + 1];
    int[] a2 = new int[n2 + 1];
    int i, j, k;
    for (i = 0; i < n1; i++) a1[i] = array[esq + i];
    for (j = 0; j < n2; j++) a2[j] = array[meio + j + 1];
    a1[i] = a2[j] = Integer.MAX_VALUE;
    for (i = j = 0, k = esq; k <= dir; k++) {
      array[k] = (a1[i] <= a2[j]) ? a1[i++] : a2[j++];
    }
  }
}`,
    visual: visual('array', 'Divide e intercala', 'mergesort divide ate sobrar 1 elemento, depois intercalar junta.', ['esq', 'meio', 'dir']),
    step: functionStep({
      id: 'code-prova1-ordenacao-mergesort-step',
      prompt: 'Escreva a funcao mergesort completa.',
      signature: 'void mergesort(int esq, int dir)',
      solution: `void mergesort(int esq, int dir) {
  if (esq < dir) {
    int meio = (esq + dir) / 2;
    mergesort(esq, meio);
    mergesort(meio + 1, dir);
    intercalar(esq, meio, dir);
  }
}`,
      requiredFragments: [
        req('base', 'so divide se sobrar mais de 1 elemento', 'if (esq < dir)', ),
        req('meio', 'calcula o meio', 'int meio = (esq + dir) / 2;'),
        req('rec-esq', 'ordena a metade esquerda', 'mergesort(esq, meio);'),
        req('rec-dir', 'ordena a metade direita', 'mergesort(meio + 1, dir);'),
        req('merge', 'intercala as duas metades ja ordenadas', 'intercalar(esq, meio, dir);'),
      ],
      lineExplanations: [
        { code: 'if (esq < dir)', note: 'Caso base: 0 ou 1 elemento ja esta ordenado.' },
        { code: 'mergesort(esq, meio); mergesort(meio + 1, dir);', note: 'Ordena cada metade antes de juntar.' },
      ],
      mistakeTag: 'missing-base-case',
      explanation: 'O mergesort e "dividir, ordenar as partes, juntar" — a parte nova de cada chamada e so a divisao e a chamada de intercalar.',
    }),
  },
  {
    id: 'code-prova1-ordenacao-mergesort-decrescente',
    domainId: 'ordenacao',
    title: 'Ordenacao: mergesort em ordem decrescente',
    source: 'prova1',
    difficulty: 'avancado',
    repetitionGroup: 'prova1-ordenacao-mergesort',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Adaptar a intercalacao mudando o sentido da comparacao e da sentinela.',
    stem:
      'mergesort(esq, dir) ja esta pronto e chama intercalar. Implemente intercalar para deixar o vetor em ordem DECRESCENTE (cuidado: a sentinela tambem precisa mudar de sentido).',
    scaffold: `class Ordenacao {
  int[] array;

  void mergesort(int esq, int dir) {
    if (esq < dir) {
      int meio = (esq + dir) / 2;
      mergesort(esq, meio);
      mergesort(meio + 1, dir);
      intercalar(esq, meio, dir);
    }
  }

  void intercalar(int esq, int meio, int dir) {
    // implementar para ordem DECRESCENTE
  }
}`,
    visual: visual('array', 'Intercalacao decrescente', 'A sentinela precisa ser o menor valor possivel, nao o maior.', ['9', '7', '5', '3', '1']),
    step: functionStep({
      id: 'code-prova1-ordenacao-mergesort-decrescente-step',
      prompt: 'Escreva a funcao intercalar completa, em ordem decrescente.',
      signature: 'void intercalar(int esq, int meio, int dir)',
      solution: `void intercalar(int esq, int meio, int dir) {
  int n1 = meio - esq + 1;
  int n2 = dir - meio;
  int[] a1 = new int[n1 + 1];
  int[] a2 = new int[n2 + 1];
  int i, j, k;
  for (i = 0; i < n1; i++) a1[i] = array[esq + i];
  for (j = 0; j < n2; j++) a2[j] = array[meio + j + 1];
  a1[i] = a2[j] = Integer.MIN_VALUE;
  for (i = j = 0, k = esq; k <= dir; k++) {
    array[k] = (a1[i] >= a2[j]) ? a1[i++] : a2[j++];
  }
}`,
      requiredFragments: [
        req('sentinel', 'sentinela vira o menor valor possivel', 'Integer.MIN_VALUE'),
        req('compare', 'compara com >= em vez de <=', 'a1[i] >= a2[j]'),
      ],
      lineExplanations: [
        {
          code: 'a1[i] = a2[j] = Integer.MIN_VALUE;',
          note: 'A sentinela precisa "perder" toda comparacao; em ordem decrescente isso e o menor valor possivel.',
        },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'So dois detalhes mudam: o sinal da comparacao e o valor da sentinela. O resto do algoritmo e identico.',
    }),
  },
  {
    id: 'code-prova1-ordenacao-mergesort-complexidade',
    domainId: 'ordenacao',
    moduleId: 'complexidade',
    title: 'Complexidade do mergesort',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-ordenacao-mergesort',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'justify',
    goal: 'Reconhecer que mergesort nao depende da entrada.',
    stem: 'Mergesort sempre divide o vetor ao meio e sempre intercala em tempo linear, nao importa a ordem dos dados.',
    scaffold: `// mergesort(esq, dir) sempre executa log(n) niveis de divisao,
// e cada nivel intercala um total de n elementos.`,
    visual: visual('array', 'Sempre a mesma arvore de recursao', 'A divisao nao depende dos valores, so do tamanho.', ['n', 'n/2 + n/2', '...']),
    step: gapStep({
      id: 'code-prova1-ordenacao-mergesort-complexidade-step',
      prompt: 'Digite a complexidade Theta do mergesort, valida tanto pro melhor quanto pro pior caso.',
      answers: ['Theta(n log n)', 'O(n log n)'],
      mistakeTag: 'wrong-case-analysis',
      explanation: 'log n niveis de divisao, cada um custando Theta(n) pra intercalar: Theta(n log n) sempre, independente da entrada.',
    }),
  },
  {
    id: 'code-prova1-ordenacao-shellsort',
    domainId: 'ordenacao',
    title: 'Ordenacao: shellsort completo',
    source: 'prova1',
    difficulty: 'avancado',
    repetitionGroup: 'prova1-ordenacao-shellsort',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Reproduzir o shellsort do professor (insercao por "cor", passo h decrescente).',
    stem:
      'insercaoPorCor(cor, h) ja esta pronto (insertion sort dentro do pseudo-array de passo h). Implemente sort(), que calcula o h inicial (h = h*3+1 ate estourar n) e vai dividindo h por 3 ate chegar a 1.',
    scaffold: `class Ordenacao {
  int[] array;
  int n;

  void sort() {
    // implementar
  }

  void insercaoPorCor(int cor, int h) {
    for (int i = h + cor; i < n; i += h) {
      int tmp = array[i];
      int j = i - h;
      while (j >= 0 && array[j] > tmp) {
        array[j + h] = array[j];
        j -= h;
      }
      array[j + h] = tmp;
    }
  }
}`,
    visual: visual('array', 'Pseudo-arrays de passo h', 'Cada "cor" 0..h-1 e um sub-array que anda de h em h.', ['h=13', 'h=4', 'h=1']),
    step: functionStep({
      id: 'code-prova1-ordenacao-shellsort-step',
      prompt: 'Escreva a funcao sort completa.',
      signature: 'void sort()',
      solution: `void sort() {
  int h = 1;
  do { h = h * 3 + 1; } while (h < n);
  do {
    h /= 3;
    for (int cor = 0; cor < h; cor++) {
      insercaoPorCor(cor, h);
    }
  } while (h != 1);
}`,
      requiredFragments: [
        req('grow', 'cresce h ate passar de n', 'do { h = h * 3 + 1; } while (h < n);'),
        req('shrink', 'divide h por 3 a cada rodada', 'h /= 3;'),
        req('loop-cor', 'roda insercaoPorCor pra cada cor', 'for (int cor = 0; cor < h; cor++)'),
        req('stop', 'para quando h chega a 1', 'while (h != 1);'),
      ],
      lineExplanations: [
        { code: 'do { h = h * 3 + 1; } while (h < n);', note: 'Acha a maior sequencia de Knuth (1, 4, 13, 40...) menor que n.' },
        { code: 'h /= 3;', note: 'Volta um passo da sequencia a cada rodada, ate h = 1 (insertion sort normal).' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Shellsort e insertion sort aplicado varias vezes com passo h decrescente; o ultimo passo (h=1) e o insertion sort de sempre.',
    }),
  },
  {
    id: 'code-prova1-ordenacao-countingsort',
    domainId: 'ordenacao',
    title: 'Ordenacao: counting sort completo',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-ordenacao-countingsort',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Reproduzir o counting sort inteiro (conta, acumula, posiciona).',
    stem:
      'getMaior() ja esta pronto. Implemente countingsort() assumindo que todo elemento do array e >= 0: conte quantas vezes cada valor aparece, acumule as contagens e use isso pra colocar cada elemento na posicao final.',
    scaffold: `class Ordenacao {
  int[] array;
  int n;

  void countingsort() {
    // implementar
  }

  int getMaior() {
    int maior = array[0];
    for (int i = 1; i < n; i++) {
      if (array[i] > maior) maior = array[i];
    }
    return maior;
  }
}`,
    visual: visual('array', 'Contagem acumulada', 'count[i] acumulado ja diz a posicao final de cada valor.', ['count', 'acumulado', 'posicionar']),
    step: functionStep({
      id: 'code-prova1-ordenacao-countingsort-step',
      prompt: 'Escreva a funcao countingsort completa.',
      signature: 'void countingsort()',
      solution: `void countingsort() {
  int[] count = new int[getMaior() + 1];
  int[] ordenado = new int[n];
  for (int i = 0; i < count.length; i++) {
    count[i] = 0;
  }
  for (int i = 0; i < n; i++) {
    count[array[i]]++;
  }
  for (int i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }
  for (int i = n - 1; i >= 0; i--) {
    ordenado[count[array[i]] - 1] = array[i];
    count[array[i]]--;
  }
  for (int i = 0; i < n; i++) {
    array[i] = ordenado[i];
  }
}`,
      requiredFragments: [
        req('count-size', 'array de contagem do tamanho do maior valor', 'int[] count = new int[getMaior() + 1];'),
        req('count-up', 'conta ocorrencias', 'count[array[i]]++;'),
        req('acumula', 'acumula contagens', 'count[i] += count[i - 1];'),
        req('posiciona', 'posiciona de tras pra frente (mantem estabilidade)', 'ordenado[count[array[i]] - 1] = array[i];'),
      ],
      lineExplanations: [
        { code: 'for (int i = n - 1; i >= 0; i--)', note: 'Percorrer de tras pra frente mantem a ordem original entre elementos iguais (estavel).' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Counting sort nao compara elementos entre si; usa a contagem acumulada como indice direto da posicao final.',
    }),
  },
  {
    id: 'code-prova1-ordenacao-countingsort-complexidade',
    domainId: 'ordenacao',
    moduleId: 'complexidade',
    title: 'Complexidade do counting sort',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-ordenacao-countingsort',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'justify',
    goal: 'Perceber que counting sort depende do maior valor, nao so de n.',
    stem: 'counting sort percorre o array de entrada (tamanho n) e o array de contagem (tamanho k = maior valor + 1) mais de uma vez, sempre em lacos simples.',
    scaffold: `// k = getMaior() + 1 (tamanho do array de contagem)`,
    visual: visual('array', 'Dois tamanhos importam', 'n elementos, mas o array de contagem tem tamanho k.', ['n', 'k']),
    step: gapStep({
      id: 'code-prova1-ordenacao-countingsort-complexidade-step',
      prompt: 'Digite a complexidade Theta do counting sort em funcao de n (tamanho do array) e k (o maior valor).',
      answers: ['Theta(n + k)', 'O(n + k)'],
      mistakeTag: 'wrong-summation-bound',
      explanation: 'Todo laco e O(n) ou O(k); somando os quatro lacos, fica Theta(n + k). Se k for muito maior que n, counting sort deixa de compensar.',
    }),
  },
  {
    id: 'code-prova1-ordenacao-heapsort-reconstruir',
    domainId: 'ordenacao',
    title: 'Ordenacao: heapsort (reconstruir o heap)',
    source: 'prova1',
    difficulty: 'desafio',
    repetitionGroup: 'prova1-ordenacao-heapsort',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Reproduzir o sift-down do heapsort do professor.',
    stem:
      'O array usa indice 1 como raiz (indice 0 fica sem uso). getMaiorFilho ja esta pronto. Implemente reconstruir(tamHeap): a partir da raiz, desce trocando com o maior filho ate o heap voltar a ser valido ou nao ter mais filhos.',
    scaffold: `class Ordenacao {
  int[] array; // indice 0 nao usado; elementos ocupam 1..tamHeap

  void reconstruir(int tamHeap) {
    // implementar
  }

  int getMaiorFilho(int i, int tamHeap) {
    if (2 * i == tamHeap || array[2 * i] > array[2 * i + 1]) {
      return 2 * i;
    }
    return 2 * i + 1;
  }

  void swap(int i, int j) {
    int tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }
}`,
    visual: visual('array', 'Sift-down', 'Desce trocando com o maior filho ate o heap ficar valido.', ['raiz', 'filho esq', 'filho dir']),
    step: functionStep({
      id: 'code-prova1-ordenacao-heapsort-reconstruir-step',
      prompt: 'Escreva a funcao reconstruir completa.',
      signature: 'void reconstruir(int tamHeap)',
      solution: `void reconstruir(int tamHeap) {
  int i = 1;
  while (i <= tamHeap / 2) {
    int filho = getMaiorFilho(i, tamHeap);
    if (array[i] < array[filho]) {
      swap(i, filho);
      i = filho;
    } else {
      i = tamHeap;
    }
  }
}`,
      requiredFragments: [
        req('start', 'comeca na raiz', 'int i = 1;'),
        req('has-child', 'so continua se tiver pelo menos um filho', 'while (i <= tamHeap / 2)'),
        req('bigger-child', 'acha o maior filho', 'int filho = getMaiorFilho(i, tamHeap);'),
        req('swap-down', 'troca e desce se o filho for maior', 'swap(i, filho);'),
        req('stop', 'para quando o heap ja esta valido', 'i = tamHeap;'),
      ],
      lineExplanations: [
        { code: 'while (i <= tamHeap / 2)', note: 'Um no so tem filho se i*2 <= tamHeap, ou seja, i <= tamHeap/2.' },
        { code: 'i = tamHeap;', note: 'Truque pra sair do while sem uma flag extra: um valor de i garantidamente > tamHeap/2.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'reconstruir e chamado depois de cada swap(1, tamHeap--) no laco principal do heapsort, restaurando a propriedade de heap.',
    }),
  },
  {
    id: 'code-prova1-ordenacao-quicksort-decrescente',
    domainId: 'ordenacao',
    title: 'Ordenacao: quicksort em ordem decrescente',
    source: 'prova1',
    difficulty: 'avancado',
    repetitionGroup: 'ordenacao-quicksort',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Adaptar o quicksort do professor invertendo as comparacoes do particionamento.',
    stem: 'Mesmo quicksort (pivo do meio, indices i e j), mas ordenando em ordem DECRESCENTE.',
    scaffold: `class Quicksort {
  int[] array;

  void swap(int i, int j) {
    int tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }

  void quicksort(int esq, int dir) {
    // implementar em ordem DECRESCENTE
  }
}`,
    visual: visual('array', 'Particionamento invertido', 'i para quando acha algo menor que o pivo; j quando acha maior.', ['esq', 'i', 'pivo', 'j', 'dir']),
    step: functionStep({
      id: 'code-prova1-ordenacao-quicksort-decrescente-step',
      prompt: 'Escreva a funcao quicksort completa, em ordem decrescente.',
      signature: 'void quicksort(int esq, int dir)',
      solution: `void quicksort(int esq, int dir) {
  int i = esq, j = dir;
  int pivo = array[(dir + esq) / 2];
  while (i <= j) {
    while (array[i] > pivo) i++;
    while (array[j] < pivo) j--;
    if (i <= j) {
      swap(i, j);
      i++;
      j--;
    }
  }
  if (esq < j) quicksort(esq, j);
  if (i < dir) quicksort(i, dir);
}`,
      requiredFragments: [
        req('left', 'i avanca enquanto for maior que o pivo', 'while (array[i] > pivo) i++;'),
        req('right', 'j recua enquanto for menor que o pivo', 'while (array[j] < pivo) j--;'),
        req('rec', 'recursao nos dois lados', 'if (esq < j) quicksort(esq, j);'),
      ],
      lineExplanations: [{ code: 'while (array[i] > pivo) i++;', note: 'So os sinais das comparacoes mudam; o resto do algoritmo e identico.' }],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Trocar > por < (e vice-versa) nas duas buscas internas inverte o sentido da ordenacao sem mexer em mais nada.',
    }),
  },
  {
    id: 'code-prova1-ordenacao-insercao-complexidade',
    domainId: 'ordenacao',
    moduleId: 'ordenacao-insercao',
    title: 'Complexidade do insertion sort',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'ordenacao-insercao-adaptada',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'justify',
    goal: 'Diferenciar melhor e pior caso do insertion sort.',
    stem: 'while (j >= 0 && array[j] > chave) { desloca; j--; } — no pior caso, esse while roda o maximo possivel a cada i.',
    scaffold: `// pior caso: vetor em ordem decrescente (cada elemento desloca tudo que veio antes)`,
    visual: visual('array', 'Pior caso do insertion sort', 'Vetor decrescente: cada chave desloca todo o prefixo.', ['9', '7', '5', '3', '1']),
    step: gapStep({
      id: 'code-prova1-ordenacao-insercao-complexidade-step',
      prompt: 'Digite a complexidade Theta do insertion sort no PIOR caso (vetor em ordem decrescente).',
      answers: ['Theta(n^2)', 'O(n^2)'],
      mistakeTag: 'wrong-case-analysis',
      explanation: 'No pior caso cada uma das n chaves desloca em media n/2 posicoes: soma 1+2+...+n = Theta(n^2). No melhor caso (vetor ja ordenado) o while nunca roda: Theta(n).',
    }),
  },
  {
    id: 'code-prova1-ordenacao-selection-complexidade',
    domainId: 'ordenacao',
    moduleId: 'ordenacao-selecao',
    title: 'Complexidade do selection sort',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'ordenacao-selection',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'justify',
    goal: 'Perceber que selection sort nao melhora com entrada ja ordenada.',
    stem: 'for (int j = i + 1; j < array.length; j++) sempre percorre a cauda inteira pra achar o menor, nao importa se ja esta ordenado.',
    scaffold: `// o laco interno sempre roda ate o fim, mesmo se o vetor ja estiver ordenado`,
    visual: visual('array', 'Busca sempre completa', 'O laco interno nunca para cedo, mesmo com entrada ja ordenada.', ['i', 'busca ate o fim']),
    step: gapStep({
      id: 'code-prova1-ordenacao-selection-complexidade-step',
      prompt: 'Digite a complexidade Theta do selection sort, valida tanto pro melhor quanto pro pior caso.',
      answers: ['Theta(n^2)'],
      mistakeTag: 'wrong-case-analysis',
      explanation: 'Diferente do insertion sort, o laco interno do selection sort sempre percorre a cauda inteira: Theta(n^2) sempre, mesmo com o vetor ja ordenado.',
    }),
  },

  // ---------------------------------------------------------------------
  // ORDENACAO: BOLHA, INSERCAO, SELECAO — os 3 algoritmos mais cobrados.
  // Cada um ganha modulo proprio (moduleId) pra treinar separado.
  // ---------------------------------------------------------------------
  {
    id: 'code-prova1-ordenacao-bolha-completo',
    domainId: 'ordenacao',
    moduleId: 'ordenacao-bolha',
    title: 'Bolha: completo',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova1-ordenacao-bolha',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Escrever o bubble sort classico ate virar automatico.',
    stem: 'Escreva a funcao de bubble sort classico: a cada passada, compara vizinhos e troca se estiverem fora de ordem.',
    scaffold: `class Ordenacao {
  void bolha(int[] array) {
    // implementar
  }
}`,
    visual: visual('array', 'Bolhas sobem', 'A cada passada, o maior ainda fora do lugar "sobe" ate sua posicao final.', ['5', '2', '8', '1']),
    step: functionStep({
      id: 'code-prova1-ordenacao-bolha-completo-step',
      prompt: 'Escreva a funcao bolha completa.',
      signature: 'void bolha(int[] array)',
      solution: `void bolha(int[] array) {
  for (int i = array.length - 1; i > 0; i--) {
    for (int j = 0; j < i; j++) {
      if (array[j] > array[j + 1]) {
        int tmp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = tmp;
      }
    }
  }
}`,
      requiredFragments: [
        req('outer', 'laco externo decrescente', 'for (int i = array.length - 1; i > 0; i--)'),
        req('inner', 'laco interno ate i', 'for (int j = 0; j < i; j++)'),
        req('compare', 'compara vizinhos', 'if (array[j] > array[j + 1])'),
        req('swap', 'troca se fora de ordem', 'array[j] = array[j + 1];'),
      ],
      lineExplanations: [
        { code: 'for (int i = array.length - 1; i > 0; i--)', note: 'A cada passada, o maior elemento da parte nao ordenada "borbulha" ate o fim.' },
        { code: 'for (int j = 0; j < i; j++)', note: 'So precisa comparar ate i, porque depois de i ja esta tudo ordenado.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Pior caso Theta(n^2): vetor decrescente troca em toda comparacao de toda passada.',
    }),
  },
  {
    id: 'code-prova1-ordenacao-bolha-contar-trocas',
    domainId: 'ordenacao',
    moduleId: 'ordenacao-bolha',
    title: 'Bolha: contar trocas',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-ordenacao-bolha',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Adaptar o bubble sort pra devolver uma metrica em vez de so ordenar.',
    stem: 'Adapte a bolha pra tambem contar e devolver quantas trocas aconteceram no total.',
    scaffold: `class Ordenacao {
  int bolhaContarTrocas(int[] array) {
    // implementar
  }
}`,
    visual: visual('array', 'Contando trocas', 'Cada troca de vizinhos incrementa o contador.', ['troca?', 'troca?', 'troca?']),
    step: functionStep({
      id: 'code-prova1-ordenacao-bolha-contar-trocas-step',
      prompt: 'Escreva a funcao bolhaContarTrocas completa.',
      signature: 'int bolhaContarTrocas(int[] array)',
      solution: `int bolhaContarTrocas(int[] array) {
  int trocas = 0;
  for (int i = array.length - 1; i > 0; i--) {
    for (int j = 0; j < i; j++) {
      if (array[j] > array[j + 1]) {
        int tmp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = tmp;
        trocas++;
      }
    }
  }
  return trocas;
}`,
      requiredFragments: [
        req('init', 'contador comeca em 0', 'int trocas = 0;'),
        req('count', 'incrementa a cada troca real', 'trocas++;'),
        req('return', 'devolve o total', 'return trocas;'),
      ],
      lineExplanations: [{ code: 'trocas++;', note: 'So conta quando o if entra (troca de verdade), nao a cada comparacao.' }],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Vetor ja ordenado: 0 trocas. Vetor totalmente invertido: numero maximo de trocas, igual ao numero de pares fora de ordem (inversoes).',
    }),
  },
  {
    id: 'code-prova1-ordenacao-bolha-decrescente',
    domainId: 'ordenacao',
    moduleId: 'ordenacao-bolha',
    title: 'Bolha: ordem decrescente',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova1-ordenacao-bolha',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Reconhecer que so o sinal da comparacao muda pra inverter o sentido.',
    stem: 'Adapte a bolha pra ordem DECRESCENTE.',
    scaffold: `class Ordenacao {
  void bolhaDecrescente(int[] array) {
    // implementar
  }
}`,
    visual: visual('array', 'Bolha ao contrario', 'So troca o sinal da comparacao.', ['1', '8', '2', '5']),
    step: functionStep({
      id: 'code-prova1-ordenacao-bolha-decrescente-step',
      prompt: 'Escreva a funcao bolhaDecrescente completa.',
      signature: 'void bolhaDecrescente(int[] array)',
      solution: `void bolhaDecrescente(int[] array) {
  for (int i = array.length - 1; i > 0; i--) {
    for (int j = 0; j < i; j++) {
      if (array[j] < array[j + 1]) {
        int tmp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = tmp;
      }
    }
  }
}`,
      requiredFragments: [req('compare', 'inverte o sinal da comparacao', 'if (array[j] < array[j + 1])')],
      lineExplanations: [{ code: 'if (array[j] < array[j + 1])', note: 'Trocar > por < basta: agora "fora de ordem" significa o menor vindo depois do maior.' }],
      mistakeTag: 'algorithm-confusion',
      explanation: 'O esqueleto (dois lacos, troca) e sempre o mesmo; so a condicao do if muda o sentido da ordenacao.',
    }),
  },
  {
    id: 'code-prova1-ordenacao-bolha-complexidade',
    domainId: 'ordenacao',
    moduleId: 'ordenacao-bolha',
    title: 'Complexidade da bolha otimizada',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-ordenacao-bolha',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'justify',
    goal: 'Diferenciar a bolha classica da versao com flag de parada antecipada.',
    stem: 'A versao otimizada da bolha usa uma flag: se uma passada inteira nao faz nenhuma troca, o vetor ja esta ordenado e o metodo para.',
    scaffold: `// com a flag de parada antecipada, um vetor ja ordenado so precisa de 1 passada`,
    visual: visual('array', 'Para na primeira passada limpa', 'Se nenhuma troca acontece numa passada, o vetor ja esta ordenado.', ['1', '2', '3', '4']),
    step: gapStep({
      id: 'code-prova1-ordenacao-bolha-complexidade-step',
      prompt: 'Digite a complexidade Theta da bolha OTIMIZADA (com flag) no MELHOR caso (vetor ja ordenado).',
      answers: ['Theta(n)', 'O(n)'],
      mistakeTag: 'wrong-case-analysis',
      explanation: 'Sem a flag, a bolha sempre roda Theta(n^2), mesmo se o vetor ja estiver ordenado. Com a flag, o melhor caso cai pra Theta(n): uma unica passada sem trocas ja confirma que esta ordenado.',
    }),
  },
  {
    id: 'code-prova1-ordenacao-insercao-busca-binaria',
    domainId: 'ordenacao',
    moduleId: 'ordenacao-insercao',
    title: 'Insercao: posicao por busca binaria',
    source: 'prova1',
    difficulty: 'avancado',
    repetitionGroup: 'prova1-ordenacao-insercao',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Combinar busca binaria com insertion sort pra reduzir comparacoes.',
    stem:
      'insertionSortBinario ja esta pronto e chama buscarPosicao. Implemente buscarPosicao(array, esq, dir, chave): busca binaria recursiva que retorna a posicao onde chave deveria entrar dentro do prefixo array[esq..dir], ja ordenado.',
    scaffold: `class Ordenacao {
  void insertionSortBinario(int[] array) {
    for (int i = 1; i < array.length; i++) {
      int chave = array[i];
      int pos = buscarPosicao(array, 0, i - 1, chave);
      for (int j = i - 1; j >= pos; j--) {
        array[j + 1] = array[j];
      }
      array[pos] = chave;
    }
  }

  int buscarPosicao(int[] array, int esq, int dir, int chave) {
    // implementar
  }
}`,
    visual: visual('array', 'Busca binaria pela posicao', 'Acha a posicao certa em log(i) passos; ainda precisa deslocar em O(i) pra abrir espaco.', ['esq', 'meio', 'dir']),
    step: functionStep({
      id: 'code-prova1-ordenacao-insercao-busca-binaria-step',
      prompt: 'Escreva a funcao buscarPosicao completa.',
      signature: 'int buscarPosicao(int[] array, int esq, int dir, int chave)',
      solution: `int buscarPosicao(int[] array, int esq, int dir, int chave) {
  if (esq > dir) {
    return esq;
  }
  int meio = (esq + dir) / 2;
  if (array[meio] > chave) {
    return buscarPosicao(array, esq, meio - 1, chave);
  }
  return buscarPosicao(array, meio + 1, dir, chave);
}`,
      requiredFragments: [
        req('base', 'para quando o intervalo fecha', 'if (esq > dir) {\n    return esq;\n  }'),
        req('meio', 'calcula o meio', 'int meio = (esq + dir) / 2;'),
        req('left', 'busca a esquerda se o meio ja e maior', 'return buscarPosicao(array, esq, meio - 1, chave);'),
        req('right', 'busca a direita caso contrario', 'return buscarPosicao(array, meio + 1, dir, chave);'),
      ],
      lineExplanations: [
        { code: 'if (esq > dir) { return esq; }', note: 'Quando o intervalo fecha, esq ja e a posicao certa pra inserir a chave.' },
      ],
      mistakeTag: 'missing-base-case',
      explanation: 'A busca da posicao cai pra Theta(log n), mas os deslocamentos continuam Theta(n) — no pior caso a complexidade total nao muda, so o numero de COMPARACOES melhora.',
    }),
  },
  {
    id: 'code-prova1-ordenacao-insercao-decrescente',
    domainId: 'ordenacao',
    moduleId: 'ordenacao-insercao',
    title: 'Insercao: ordem decrescente',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova1-ordenacao-insercao',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Reconhecer que so o sinal da comparacao muda pra inverter o sentido.',
    stem: 'Adapte o insertion sort pra ordem DECRESCENTE.',
    scaffold: `class Ordenacao {
  void insertionSortDecrescente(int[] array) {
    // implementar
  }
}`,
    visual: visual('array', 'Insercao ao contrario', 'So troca o sinal da comparacao no while.', ['9', '2', '7', '4']),
    step: functionStep({
      id: 'code-prova1-ordenacao-insercao-decrescente-step',
      prompt: 'Escreva a funcao insertionSortDecrescente completa.',
      signature: 'void insertionSortDecrescente(int[] array)',
      solution: `void insertionSortDecrescente(int[] array) {
  for (int i = 1; i < array.length; i++) {
    int chave = array[i];
    int j = i - 1;
    while (j >= 0 && array[j] < chave) {
      array[j + 1] = array[j];
      j--;
    }
    array[j + 1] = chave;
  }
}`,
      requiredFragments: [req('compare', 'inverte o sinal da comparacao', 'while (j >= 0 && array[j] < chave)')],
      lineExplanations: [{ code: 'while (j >= 0 && array[j] < chave)', note: 'Trocar > por < basta: agora desloca enquanto o vizinho for MENOR que a chave.' }],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Mesmo esqueleto do insertion sort de sempre; so o sinal da comparacao no while inverte o sentido.',
    }),
  },
  {
    id: 'code-prova1-ordenacao-insercao-contar-comparacoes',
    domainId: 'ordenacao',
    moduleId: 'ordenacao-insercao',
    title: 'Insercao: contar comparacoes',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-ordenacao-insercao',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Instrumentar o algoritmo pra enxergar a complexidade na pratica.',
    stem:
      'Adapte o insertion sort pra tambem contar e devolver quantas vezes array[j] e comparado com chave (conte so as comparacoes que realmente avaliam array[j], nao a checagem de j >= 0 sozinha).',
    scaffold: `class Ordenacao {
  int insertionSortContarComparacoes(int[] array) {
    // implementar
  }
}`,
    visual: visual('array', 'Contando comparacoes', 'Cada vez que array[j] e comparado com a chave, o contador sobe.', ['chave', 'array[j]?']),
    step: functionStep({
      id: 'code-prova1-ordenacao-insercao-contar-comparacoes-step',
      prompt: 'Escreva a funcao insertionSortContarComparacoes completa.',
      signature: 'int insertionSortContarComparacoes(int[] array)',
      solution: `int insertionSortContarComparacoes(int[] array) {
  int comparacoes = 0;
  for (int i = 1; i < array.length; i++) {
    int chave = array[i];
    int j = i - 1;
    while (j >= 0 && array[j] > chave) {
      comparacoes++;
      array[j + 1] = array[j];
      j--;
    }
    if (j >= 0) {
      comparacoes++;
    }
    array[j + 1] = chave;
  }
  return comparacoes;
}`,
      requiredFragments: [
        req('init', 'contador comeca em 0', 'int comparacoes = 0;'),
        req('count-loop', 'conta as comparacoes que continuam deslocando', 'comparacoes++;'),
        req('count-last', 'conta tambem a comparacao que encerra o while', 'if (j >= 0) {\n      comparacoes++;\n    }'),
      ],
      lineExplanations: [
        { code: 'if (j >= 0) { comparacoes++; }', note: 'O while para por dois motivos: j < 0 (acabou o prefixo) ou array[j] <= chave. So o segundo motivo e uma comparacao de verdade.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'No melhor caso (ja ordenado), 1 comparacao por elemento: Theta(n). No pior caso, ate i comparacoes pro elemento i: Theta(n^2).',
    }),
  },
  {
    id: 'code-prova1-ordenacao-selecao-decrescente',
    domainId: 'ordenacao',
    moduleId: 'ordenacao-selecao',
    title: 'Selecao: ordem decrescente',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova1-ordenacao-selecao',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Reconhecer que so a busca (menor vira maior) muda pra inverter o sentido.',
    stem: 'Adapte o selection sort pra ordem DECRESCENTE (procure o MAIOR da cauda a cada passada).',
    scaffold: `class Ordenacao {
  void selectionSortDecrescente(int[] array) {
    // implementar
  }
}`,
    visual: visual('array', 'Selecao ao contrario', 'Busca o maior da cauda em vez do menor.', ['i', 'busca o maior']),
    step: functionStep({
      id: 'code-prova1-ordenacao-selecao-decrescente-step',
      prompt: 'Escreva a funcao selectionSortDecrescente completa.',
      signature: 'void selectionSortDecrescente(int[] array)',
      solution: `void selectionSortDecrescente(int[] array) {
  for (int i = 0; i < array.length - 1; i++) {
    int maior = i;
    for (int j = i + 1; j < array.length; j++) {
      if (array[j] > array[maior]) {
        maior = j;
      }
    }
    int tmp = array[i];
    array[i] = array[maior];
    array[maior] = tmp;
  }
}`,
      requiredFragments: [
        req('init', 'assume que i tem o maior', 'int maior = i;'),
        req('compare', 'procura o maior, nao o menor', 'if (array[j] > array[maior])'),
        req('swap', 'coloca o maior em i', 'array[i] = array[maior];'),
      ],
      lineExplanations: [{ code: 'if (array[j] > array[maior])', note: 'Trocar < por > (e "menor" por "maior") inverte o sentido da selecao.' }],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Mesmo esqueleto do selection sort de sempre; so a busca interna muda de "achar o menor" pra "achar o maior".',
    }),
  },
  {
    id: 'code-prova1-ordenacao-selecao-contar-trocas',
    domainId: 'ordenacao',
    moduleId: 'ordenacao-selecao',
    title: 'Selecao: contar trocas',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-ordenacao-selecao',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Perceber que selection sort faz poucas trocas, mesmo com muitas comparacoes.',
    stem: 'Adapte o selection sort pra so trocar quando o menor encontrado NAO for a propria posicao i, e devolver quantas trocas de verdade aconteceram.',
    scaffold: `class Ordenacao {
  int selectionSortContarTrocas(int[] array) {
    // implementar
  }
}`,
    visual: visual('array', 'Trocar so quando precisa', 'Se o menor ja esta em i, nao ha troca.', ['i ja e o menor?', 'pula a troca']),
    step: functionStep({
      id: 'code-prova1-ordenacao-selecao-contar-trocas-step',
      prompt: 'Escreva a funcao selectionSortContarTrocas completa.',
      signature: 'int selectionSortContarTrocas(int[] array)',
      solution: `int selectionSortContarTrocas(int[] array) {
  int trocas = 0;
  for (int i = 0; i < array.length - 1; i++) {
    int menor = i;
    for (int j = i + 1; j < array.length; j++) {
      if (array[j] < array[menor]) {
        menor = j;
      }
    }
    if (menor != i) {
      int tmp = array[i];
      array[i] = array[menor];
      array[menor] = tmp;
      trocas++;
    }
  }
  return trocas;
}`,
      requiredFragments: [
        req('guard', 'so troca se o menor nao for a propria posicao', 'if (menor != i)'),
        req('count', 'conta a troca de verdade', 'trocas++;'),
      ],
      lineExplanations: [{ code: 'if (menor != i)', note: 'Sem essa checagem, o metodo "trocaria" um elemento com ele mesmo e contaria uma troca que nao mudou nada.' }],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Selection sort faz NO MAXIMO n-1 trocas totais, nao importa a entrada — bem menos que bolha ou insercao, que podem trocar Theta(n^2) vezes no pior caso.',
    }),
  },
  {
    id: 'code-prova1-ordenacao-selecao-bidirecional',
    domainId: 'ordenacao',
    moduleId: 'ordenacao-selecao',
    title: 'Selecao: bidirecional (min-max)',
    source: 'prova1',
    difficulty: 'desafio',
    repetitionGroup: 'prova1-ordenacao-selecao',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Otimizar o selection sort achando o menor e o maior na mesma passada.',
    stem:
      'Implemente selectionSortBidirecional: a cada passada, ache o MENOR e o MAIOR da faixa [esq, dir] ao mesmo tempo, coloque o menor em esq e o maior em dir, depois encolha a faixa dos dois lados. Cuidado com o caso em que o maior estava na posicao esq (o mesmo lugar que acabou de receber o menor).',
    scaffold: `class Ordenacao {
  void selectionSortBidirecional(int[] array) {
    // implementar
  }
}`,
    visual: visual('array', 'Duas pontas por passada', 'Cada passada resolve o inicio E o fim da faixa, encolhendo dos dois lados.', ['esq', '...', 'dir']),
    step: functionStep({
      id: 'code-prova1-ordenacao-selecao-bidirecional-step',
      prompt: 'Escreva a funcao selectionSortBidirecional completa.',
      signature: 'void selectionSortBidirecional(int[] array)',
      solution: `void selectionSortBidirecional(int[] array) {
  int esq = 0, dir = array.length - 1;
  while (esq < dir) {
    int posMenor = esq, posMaior = dir;
    for (int k = esq; k <= dir; k++) {
      if (array[k] < array[posMenor]) posMenor = k;
      if (array[k] > array[posMaior]) posMaior = k;
    }
    int tmp = array[esq];
    array[esq] = array[posMenor];
    array[posMenor] = tmp;
    if (posMaior == esq) {
      posMaior = posMenor;
    }
    tmp = array[dir];
    array[dir] = array[posMaior];
    array[posMaior] = tmp;
    esq++;
    dir--;
  }
}`,
      requiredFragments: [
        req('find', 'acha os dois extremos na mesma passada', 'if (array[k] < array[posMenor]) posMenor = k;'),
        req('swap-min', 'coloca o menor em esq', 'array[esq] = array[posMenor];'),
        req('edge-case', 'corrige posMaior se ele apontava pra esq', 'if (posMaior == esq)'),
        req('swap-max', 'coloca o maior em dir', 'array[dir] = array[posMaior];'),
        req('shrink', 'encolhe a faixa dos dois lados', 'esq++;'),
      ],
      lineExplanations: [
        {
          code: 'if (posMaior == esq) { posMaior = posMenor; }',
          note: 'Se o maior valor estava bem na posicao esq, a primeira troca ja o moveu pra posMenor — sem esse ajuste, a segunda troca pegaria o valor errado.',
        },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Ainda e Theta(n^2) (a busca dos extremos continua O(n) por passada), mas faz metade das passadas do selection sort normal — otimizacao de constante, nao de classe assintotica.',
    }),
  },

  // ---------------------------------------------------------------------
  // COMPLEXIDADE (analise de codigo, sem estrutura especifica)
  // ---------------------------------------------------------------------
  {
    id: 'code-prova1-complexidade-laco-simples',
    domainId: 'somatorio',
    moduleId: 'complexidade',
    title: 'Complexidade: laco simples',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova1-complexidade-lacos',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'justify',
    goal: 'Contar execucoes de um laco que depende linearmente de n.',
    stem: 'for (int i = 0; i < n; i++) { foo(); }',
    scaffold: `void metodo(int n) {
  for (int i = 0; i < n; i++) {
    foo();
  }
}`,
    visual: visual('array', 'Um laco, n voltas', 'i vai de 0 ate n-1: exatamente n execucoes de foo().', ['i=0', 'i=1', '...', 'i=n-1']),
    step: gapStep({
      id: 'code-prova1-complexidade-laco-simples-step',
      prompt: 'Quantas vezes foo() executa, em Theta e em funcao de n?',
      answers: ['Theta(n)', 'O(n)'],
      mistakeTag: 'wrong-summation-bound',
      explanation: 'O laco roda exatamente n vezes (i = 0, 1, ..., n-1): Theta(n).',
    }),
  },
  {
    id: 'code-prova1-complexidade-laco-aninhado',
    domainId: 'somatorio',
    moduleId: 'complexidade',
    title: 'Complexidade: laco aninhado dependente',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-complexidade-lacos',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'justify',
    goal: 'Fechar o somatorio de um laco interno que depende do externo.',
    stem: 'for (int i = 0; i < n; i++) { for (int j = 0; j < i; j++) { foo(); } }',
    scaffold: `void metodo(int n) {
  for (int i = 0; i < n; i++) {
    for (int j = 0; j < i; j++) {
      foo();
    }
  }
}`,
    visual: visual('array', 'Triangulo de execucoes', 'i=0 nao executa nada, i=1 executa 1 vez, ..., i=n-1 executa n-1 vezes.', ['0', '1', '2', '...', 'n-1']),
    step: gapStep({
      id: 'code-prova1-complexidade-laco-aninhado-step',
      prompt: 'Quantas vezes foo() executa no total, em Theta e em funcao de n?',
      answers: ['Theta(n^2)', 'O(n^2)'],
      mistakeTag: 'wrong-summation-bound',
      explanation: 'O total e 0 + 1 + 2 + ... + (n-1) = n(n-1)/2, que e Theta(n^2).',
    }),
  },
  {
    id: 'code-prova1-complexidade-laco-log',
    domainId: 'somatorio',
    moduleId: 'complexidade',
    title: 'Complexidade: laco que divide por 2',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-complexidade-lacos',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'justify',
    goal: 'Reconhecer o padrao logaritmico de um laco que divide o contador.',
    stem: 'for (int i = n; i > 0; i = i / 2) { foo(); }',
    scaffold: `void metodo(int n) {
  for (int i = n; i > 0; i = i / 2) {
    foo();
  }
}`,
    visual: visual('array', 'Reduz pela metade', 'i vai de n para n/2, n/4, ..., ate chegar a 1: log2(n) passos.', ['n', 'n/2', 'n/4', '...', '1']),
    step: gapStep({
      id: 'code-prova1-complexidade-laco-log-step',
      prompt: 'Quantas vezes foo() executa, em Theta e em funcao de n?',
      answers: ['Theta(log n)', 'O(log n)'],
      mistakeTag: 'wrong-summation-bound',
      explanation: 'Dividir por 2 a cada volta so precisa de log2(n) passos pra chegar a 1: Theta(log n).',
    }),
  },
  {
    id: 'code-prova1-complexidade-busca-linear',
    domainId: 'somatorio',
    moduleId: 'complexidade',
    title: 'Complexidade: melhor e pior caso de busca linear',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-complexidade-lacos',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'justify',
    goal: 'Diferenciar melhor e pior caso de um laco que pode parar cedo.',
    stem:
      'boolean pesquisar(int[] array, int x) { for (int i = 0; i < array.length; i++) { if (array[i] == x) return true; } return false; } — o vetor NAO esta ordenado.',
    scaffold: `boolean pesquisar(int[] array, int x) {
  for (int i = 0; i < array.length; i++) {
    if (array[i] == x) return true;
  }
  return false;
}`,
    visual: visual('array', 'Para assim que acha', 'O laco encerra cedo se achar x logo no comeco.', ['x?', 'x?', 'x!']),
    step: rubricStep({
      id: 'code-prova1-complexidade-busca-linear-step',
      prompt: 'Qual alternativa descreve corretamente o melhor e o pior caso dessa busca?',
      acceptableOptionIds: ['certo'],
      options: [
        {
          id: 'certo',
          label: 'Melhor caso Theta(1), quando x esta na primeira posicao. Pior caso Theta(n), quando x esta na ultima posicao ou nao existe.',
        },
        {
          id: 'sempre-n',
          label: 'Melhor e pior caso sao sempre Theta(n), porque o metodo sempre percorre o vetor inteiro.',
          mistakeTag: 'wrong-case-analysis',
        },
        {
          id: 'invertido',
          label: 'Melhor caso Theta(n) e pior caso Theta(1), porque o return corta o laco.',
          mistakeTag: 'wrong-case-analysis',
        },
      ],
      explanation: 'O return dentro do laco permite parar assim que encontra x — isso so ajuda o MELHOR caso. Se x nao existir (ou estiver no fim), o laco roda ate o fim: pior caso Theta(n).',
    }),
  },

  // ---------------------------------------------------------------------
  // FILA ESTATICA (u02) — array circular, indices primeiro/ultimo
  // ---------------------------------------------------------------------
  {
    id: 'code-prova1-fila-estatica-inserir',
    domainId: 'vetores',
    moduleId: 'fila',
    title: 'Fila estatica: inserir',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova1-fila-estatica',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Praticar a insercao circular ate virar automatico.',
    stem:
      'Fila circular por array (tamanho n + 1, um slot sempre vazio pra distinguir cheia de vazia). Implemente inserir(x), que lanca excecao se a fila estiver cheia.',
    scaffold: `class Fila {
  private int[] array;
  private int primeiro, ultimo;

  public Fila(int tamanho) {
    array = new int[tamanho + 1];
    primeiro = ultimo = 0;
  }

  public void inserir(int x) throws Exception {
    // implementar
  }
}`,
    visual: visual('queue', 'Fila circular', 'ultimo aponta pro proximo slot livre; um slot fica sempre vazio.', ['primeiro', '...', 'ultimo']),
    step: functionStep({
      id: 'code-prova1-fila-estatica-inserir-step',
      prompt: 'Escreva o corpo de inserir(x).',
      signature: 'public void inserir(int x)',
      solution: `public void inserir(int x) throws Exception {
  if (((ultimo + 1) % array.length) == primeiro) {
    throw new Exception("Erro ao inserir!");
  }
  array[ultimo] = x;
  ultimo = (ultimo + 1) % array.length;
}`,
      requiredFragments: [
        req('full', 'detecta fila cheia', 'if (((ultimo + 1) % array.length) == primeiro)'),
        req('store', 'guarda o valor em ultimo', 'array[ultimo] = x;'),
        req('advance', 'avanca ultimo, circular', 'ultimo = (ultimo + 1) % array.length;'),
      ],
      lineExplanations: [
        { code: 'if (((ultimo + 1) % array.length) == primeiro)', note: 'Fila cheia quando o proximo slot depois de ultimo seria primeiro.' },
      ],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(1): so escreve num indice e avanca um ponteiro, sem percorrer nada.',
    }),
  },
  {
    id: 'code-prova1-fila-estatica-remover',
    domainId: 'vetores',
    moduleId: 'fila',
    title: 'Fila estatica: remover',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova1-fila-estatica',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Praticar a remocao circular ate virar automatico.',
    stem: 'Implemente remover(), que lanca excecao se a fila estiver vazia.',
    scaffold: `class Fila {
  private int[] array;
  private int primeiro, ultimo;

  public int remover() throws Exception {
    // implementar
  }
}`,
    visual: visual('queue', 'Remover do inicio', 'primeiro aponta pro proximo elemento a sair.', ['primeiro', '...', 'ultimo']),
    step: functionStep({
      id: 'code-prova1-fila-estatica-remover-step',
      prompt: 'Escreva o corpo de remover().',
      signature: 'public int remover()',
      solution: `public int remover() throws Exception {
  if (primeiro == ultimo) {
    throw new Exception("Erro ao remover!");
  }
  int resp = array[primeiro];
  primeiro = (primeiro + 1) % array.length;
  return resp;
}`,
      requiredFragments: [
        req('empty', 'detecta fila vazia', 'if (primeiro == ultimo)'),
        req('read', 'le o valor em primeiro', 'int resp = array[primeiro];'),
        req('advance', 'avanca primeiro, circular', 'primeiro = (primeiro + 1) % array.length;'),
      ],
      lineExplanations: [{ code: 'if (primeiro == ultimo)', note: 'Fila vazia quando primeiro alcancou ultimo.' }],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(1): le um indice e avanca um ponteiro, sem deslocar nenhum elemento.',
    }),
  },
  {
    id: 'code-prova1-fila-estatica-contar',
    domainId: 'vetores',
    moduleId: 'fila',
    title: 'Fila estatica: contar elementos',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-fila-estatica',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Calcular quantidade sem percorrer elemento a elemento.',
    stem: 'Implemente contarElementos(), que retorna quantos elementos a fila tem agora, usando so os indices (sem laco).',
    scaffold: `class Fila {
  private int[] array;
  private int primeiro, ultimo;

  public int contarElementos() {
    // implementar sem percorrer o array
  }
}`,
    visual: visual('queue', 'Distancia circular', 'A quantidade e a distancia de primeiro ate ultimo, dando a volta se precisar.', ['primeiro', 'ultimo']),
    step: functionStep({
      id: 'code-prova1-fila-estatica-contar-step',
      prompt: 'Escreva o corpo de contarElementos().',
      signature: 'public int contarElementos()',
      solution: `public int contarElementos() {
  return (ultimo - primeiro + array.length) % array.length;
}`,
      requiredFragments: [req('formula', 'distancia circular entre os indices', '(ultimo - primeiro + array.length) % array.length')],
      lineExplanations: [
        {
          code: 'return (ultimo - primeiro + array.length) % array.length;',
          note: 'Somar array.length antes do modulo evita resultado negativo quando ultimo < primeiro.',
        },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(1): e so uma conta com os indices, sem percorrer a fila. Um laco tambem funcionaria, mas custaria Theta(n).',
    }),
  },
  {
    id: 'code-prova1-fila-estatica-concatenar',
    domainId: 'vetores',
    moduleId: 'fila',
    title: 'Fila estatica: concatenar duas filas',
    source: 'prova1',
    difficulty: 'avancado',
    repetitionGroup: 'prova1-fila-estatica',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Combinar duas instancias da mesma classe, acessando campos privados da outra.',
    stem: 'Implemente concatenar(outra), que insere, na ordem, todos os elementos de outra no final desta fila (sem esvaziar outra).',
    scaffold: `class Fila {
  private int[] array;
  private int primeiro, ultimo;

  public void inserir(int x) throws Exception {
    if (((ultimo + 1) % array.length) == primeiro) {
      throw new Exception("Erro ao inserir!");
    }
    array[ultimo] = x;
    ultimo = (ultimo + 1) % array.length;
  }

  public void concatenar(Fila outra) throws Exception {
    // implementar
  }
}`,
    visual: visual('queue', 'Duas filas, uma so', 'Percorre a outra fila do primeiro ao ultimo dela e insere nesta.', ['esta', '+', 'outra']),
    step: functionStep({
      id: 'code-prova1-fila-estatica-concatenar-step',
      prompt: 'Escreva o corpo de concatenar(outra).',
      signature: 'public void concatenar(Fila outra)',
      solution: `public void concatenar(Fila outra) throws Exception {
  for (int i = outra.primeiro; i != outra.ultimo; i = (i + 1) % outra.array.length) {
    inserir(outra.array[i]);
  }
}`,
      requiredFragments: [
        req('loop', 'percorre a outra fila do primeiro ao ultimo', 'for (int i = outra.primeiro; i != outra.ultimo;'),
        req('call', 'reusa inserir desta fila', 'inserir(outra.array[i]);'),
      ],
      lineExplanations: [
        { code: 'outra.primeiro', note: 'Java permite acessar campos privados de outro objeto da MESMA classe.' },
      ],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(m), sendo m o numero de elementos de outra. Reusar inserir() evita duplicar a logica circular.',
    }),
  },

  // ---------------------------------------------------------------------
  // FILA FLEXIVEL (u04) — encadeada, com celula cabeca
  // ---------------------------------------------------------------------
  {
    id: 'code-prova1-fila-flexivel-inserir',
    domainId: 'vetores',
    moduleId: 'fila',
    title: 'Fila flexivel: inserir',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova1-fila-flexivel',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Praticar a insercao com celula cabeca ate virar automatico.',
    stem: 'A fila comeca so com uma celula cabeca (primeiro == ultimo). Implemente inserir(x), que insere no final.',
    scaffold: `class Celula {
  int elemento;
  Celula prox;
  public Celula() { this(0); }
  public Celula(int elemento) { this.elemento = elemento; this.prox = null; }
}
class Fila {
  private Celula primeiro, ultimo;

  public Fila() {
    primeiro = new Celula();
    ultimo = primeiro;
  }

  public void inserir(int x) {
    // implementar
  }
}`,
    visual: visual('queue', 'Celula cabeca', 'primeiro e uma celula "vazia"; os elementos reais comecam em primeiro.prox.', ['cabeca', 'A', 'B', 'ultimo']),
    step: functionStep({
      id: 'code-prova1-fila-flexivel-inserir-step',
      prompt: 'Escreva o corpo de inserir(x).',
      signature: 'public void inserir(int x)',
      solution: `public void inserir(int x) {
  ultimo.prox = new Celula(x);
  ultimo = ultimo.prox;
}`,
      requiredFragments: [
        req('link', 'liga nova celula depois de ultimo', 'ultimo.prox = new Celula(x);'),
        req('advance', 'avanca ultimo pra nova celula', 'ultimo = ultimo.prox;'),
      ],
      lineExplanations: [{ code: 'ultimo.prox = new Celula(x);', note: 'Com celula cabeca, inserir no fim nunca precisa checar se a fila esta vazia.' }],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(1): so cria uma celula e religa dois ponteiros, sem percorrer nada.',
    }),
  },
  {
    id: 'code-prova1-fila-flexivel-remover',
    domainId: 'vetores',
    moduleId: 'fila',
    title: 'Fila flexivel: remover',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova1-fila-flexivel',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Praticar a remocao com celula cabeca ate virar automatico.',
    stem: 'Implemente remover(), que lanca excecao se a fila estiver vazia (primeiro == ultimo).',
    scaffold: `class Celula { int elemento; Celula prox; }
class Fila {
  private Celula primeiro, ultimo;

  public int remover() throws Exception {
    // implementar
  }
}`,
    visual: visual('queue', 'Remover apos a cabeca', 'A celula cabeca nunca sai; o elemento removido e primeiro.prox.', ['cabeca', 'A (sai)', 'B']),
    step: functionStep({
      id: 'code-prova1-fila-flexivel-remover-step',
      prompt: 'Escreva o corpo de remover().',
      signature: 'public int remover()',
      solution: `public int remover() throws Exception {
  if (primeiro == ultimo) {
    throw new Exception("Erro ao remover!");
  }
  Celula tmp = primeiro;
  primeiro = primeiro.prox;
  int resp = primeiro.elemento;
  tmp.prox = null;
  return resp;
}`,
      requiredFragments: [
        req('empty', 'detecta fila vazia', 'if (primeiro == ultimo)'),
        req('advance', 'a celula cabeca vira a antiga primeiro.prox', 'primeiro = primeiro.prox;'),
        req('read', 'le o elemento da nova cabeca', 'int resp = primeiro.elemento;'),
      ],
      lineExplanations: [{ code: 'primeiro = primeiro.prox;', note: 'A celula que era o primeiro elemento real vira a nova cabeca.' }],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(1): religa dois ponteiros, sem percorrer a fila.',
    }),
  },
  {
    id: 'code-prova1-fila-flexivel-contar',
    domainId: 'vetores',
    moduleId: 'fila',
    title: 'Fila flexivel: contar recursivo',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-fila-flexivel',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Aplicar o padrao publico-chama-privado-recursivo numa fila.',
    stem: 'Implemente contarElementos(), que conta os elementos reais (a partir de primeiro.prox), usando recursao.',
    scaffold: `class Celula { int elemento; Celula prox; }
class Fila {
  private Celula primeiro, ultimo;

  public int contarElementos() {
    // implementar
  }
}`,
    visual: visual('queue', 'Contagem recursiva', 'Conta 1 pra celula atual mais o resto da fila.', ['A', 'B', 'C', 'null']),
    step: functionStep({
      id: 'code-prova1-fila-flexivel-contar-step',
      prompt: 'Escreva o metodo publico e o auxiliar privado de contarElementos.',
      signature: 'public int contarElementos()',
      solution: `public int contarElementos() {
  return contarElementos(primeiro.prox);
}
private int contarElementos(Celula i) {
  int resp = 0;
  if (i != null) {
    resp = 1 + contarElementos(i.prox);
  }
  return resp;
}`,
      requiredFragments: [
        req('public-call', 'metodo publico chama o auxiliar a partir de primeiro.prox', 'return contarElementos(primeiro.prox);'),
        req('base', 'caso base nulo', 'if (i != null)'),
        req('rec', 'soma 1 mais o resto', 'resp = 1 + contarElementos(i.prox);'),
      ],
      lineExplanations: [{ code: 'return contarElementos(primeiro.prox);', note: 'Comeca depois da celula cabeca, que nao conta como elemento.' }],
      mistakeTag: 'missing-base-case',
      explanation: 'Custo Theta(n): visita cada elemento real uma vez.',
    }),
  },
  {
    id: 'code-prova1-fila-flexivel-buscar',
    domainId: 'vetores',
    moduleId: 'fila',
    title: 'Fila flexivel: pesquisar',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-fila-flexivel',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Percorrer a fila sem alterar seus ponteiros.',
    stem: 'Implemente pesquisar(x), que retorna se x esta na fila, sem alterar a fila.',
    scaffold: `class Celula { int elemento; Celula prox; }
class Fila {
  private Celula primeiro, ultimo;

  public boolean pesquisar(int x) {
    // implementar
  }
}`,
    visual: visual('queue', 'Percorrer sem alterar', 'So le i.elemento e anda com i = i.prox.', ['A', 'B', 'x?', 'C']),
    step: functionStep({
      id: 'code-prova1-fila-flexivel-buscar-step',
      prompt: 'Escreva o corpo de pesquisar(x).',
      signature: 'public boolean pesquisar(int x)',
      solution: `public boolean pesquisar(int x) {
  boolean resp = false;
  for (Celula i = primeiro.prox; i != null && !resp; i = i.prox) {
    resp = (i.elemento == x);
  }
  return resp;
}`,
      requiredFragments: [
        req('start', 'comeca depois da celula cabeca', 'Celula i = primeiro.prox;'),
        req('stop-early', 'para assim que encontra', 'i != null && !resp'),
        req('check', 'compara o elemento', 'resp = (i.elemento == x);'),
      ],
      lineExplanations: [{ code: 'i != null && !resp', note: 'Parar assim que resp vira true evita continuar percorrendo a toa.' }],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Melhor caso Theta(1) (x logo no comeco); pior caso Theta(n) (x no fim ou ausente).',
    }),
  },
  {
    id: 'code-prova1-fila-flexivel-inverter',
    domainId: 'vetores',
    moduleId: 'fila',
    title: 'Fila flexivel: inverter no lugar',
    source: 'prova1',
    difficulty: 'desafio',
    repetitionGroup: 'prova1-fila-flexivel',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Religar ponteiros com cuidado, atualizando corretamente primeiro e ultimo.',
    stem:
      'Implemente inverter(), que inverte a ordem dos elementos (o antigo ultimo vira o primeiro a sair), usando so os ponteiros da propria fila, sem array ou fila auxiliar.',
    scaffold: `class Celula { int elemento; Celula prox; }
class Fila {
  private Celula primeiro, ultimo;

  public void inverter() {
    // implementar
  }
}`,
    visual: visual('queue', 'Inversao de ponteiros', 'cabeca -> A -> B -> C vira cabeca -> C -> B -> A, com ultimo atualizado.', ['A', 'B', 'C']),
    step: functionStep({
      id: 'code-prova1-fila-flexivel-inverter-step',
      prompt: 'Escreva o corpo de inverter().',
      signature: 'public void inverter()',
      solution: `public void inverter() {
  Celula novoUltimo = primeiro.prox;
  Celula anterior = null;
  Celula atual = primeiro.prox;
  while (atual != null) {
    Celula proximo = atual.prox;
    atual.prox = anterior;
    anterior = atual;
    atual = proximo;
  }
  primeiro.prox = anterior;
  ultimo = (novoUltimo != null) ? novoUltimo : primeiro;
}`,
      requiredFragments: [
        req('save', 'guarda quem vai virar o novo ultimo', 'Celula novoUltimo = primeiro.prox;'),
        req('reverse', 'inverte os ponteiros um a um', 'atual.prox = anterior;'),
        req('reattach', 'religa a cabeca no novo primeiro real', 'primeiro.prox = anterior;'),
        req('fix-ultimo', 'atualiza ultimo pro antigo primeiro', 'ultimo = (novoUltimo != null) ? novoUltimo : primeiro;'),
      ],
      lineExplanations: [
        { code: 'Celula novoUltimo = primeiro.prox;', note: 'O antigo primeiro elemento real vira o novo ultimo, entao precisa ser guardado antes de comecar a inverter.' },
        { code: 'ultimo = (novoUltimo != null) ? novoUltimo : primeiro;', note: 'Se a fila estava vazia, ultimo continua sendo a propria cabeca.' },
      ],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(n): visita cada celula uma vez pra inverter o prox. Cuidado especial com fila vazia e com quem vira o novo ultimo.',
    }),
  },
  {
    id: 'code-prova1-fila-flexivel-complexidade',
    domainId: 'vetores',
    moduleId: 'fila',
    title: 'Complexidade da fila flexivel',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova1-fila-flexivel',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'justify',
    goal: 'Fixar que inserir/remover na fila flexivel nao dependem do tamanho.',
    stem: 'inserir(x) so cria uma celula e religa ultimo; remover() so religa primeiro. Nenhum dos dois percorre a fila.',
    scaffold: `// inserir e remover sempre mexem so nas pontas (primeiro/ultimo)`,
    visual: visual('queue', 'So mexe nas pontas', 'inserir mexe em ultimo; remover mexe em primeiro. Nenhum percorre o meio.', ['primeiro', '...', 'ultimo']),
    step: gapStep({
      id: 'code-prova1-fila-flexivel-complexidade-step',
      prompt: 'Digite a complexidade Theta de inserir(x) e de remover() na fila flexivel, em funcao do numero de elementos.',
      answers: ['Theta(1)', 'O(1)'],
      mistakeTag: 'wrong-case-analysis',
      explanation: 'Como a fila guarda ponteiros pras duas pontas (primeiro e ultimo), nenhuma das duas operacoes basicas precisa percorrer a fila: Theta(1).',
    }),
  },

  // ---------------------------------------------------------------------
  // PILHA ESTATICA — array + topo
  // ---------------------------------------------------------------------
  {
    id: 'code-prova1-pilha-estatica-inserir',
    domainId: 'vetores',
    moduleId: 'pilha',
    title: 'Pilha estatica: inserir',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova1-pilha-estatica',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Praticar a insercao no topo ate virar automatico.',
    stem: 'Pilha por array; topo comeca em -1 (pilha vazia). Implemente inserir(x), que lanca excecao se a pilha estiver cheia.',
    scaffold: `class Pilha {
  private int[] array;
  private int topo;

  public Pilha(int tamanho) {
    array = new int[tamanho];
    topo = -1;
  }

  public void inserir(int x) throws Exception {
    // implementar
  }
}`,
    visual: visual('stack', 'Empilhar', 'topo aponta pro ultimo elemento inserido.', ['topo', '...', 'fundo']),
    step: functionStep({
      id: 'code-prova1-pilha-estatica-inserir-step',
      prompt: 'Escreva o corpo de inserir(x).',
      signature: 'public void inserir(int x)',
      solution: `public void inserir(int x) throws Exception {
  if (topo >= array.length - 1) {
    throw new Exception("Erro ao inserir!");
  }
  topo++;
  array[topo] = x;
}`,
      requiredFragments: [
        req('full', 'detecta pilha cheia', 'if (topo >= array.length - 1)'),
        req('advance', 'avanca topo antes de escrever', 'topo++;'),
        req('store', 'guarda o valor no novo topo', 'array[topo] = x;'),
      ],
      lineExplanations: [{ code: 'topo++;', note: 'Avanca primeiro, escreve depois — por isso topo comeca em -1 (pilha vazia).' }],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(1): so escreve num indice e incrementa topo.',
    }),
  },
  {
    id: 'code-prova1-pilha-estatica-remover',
    domainId: 'vetores',
    moduleId: 'pilha',
    title: 'Pilha estatica: remover',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova1-pilha-estatica',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Praticar a remocao do topo ate virar automatico.',
    stem: 'Implemente remover(), que lanca excecao se a pilha estiver vazia (topo == -1).',
    scaffold: `class Pilha {
  private int[] array;
  private int topo;

  public int remover() throws Exception {
    // implementar
  }
}`,
    visual: visual('stack', 'Desempilhar', 'Le o elemento do topo e recua o ponteiro.', ['topo (sai)', '...', 'fundo']),
    step: functionStep({
      id: 'code-prova1-pilha-estatica-remover-step',
      prompt: 'Escreva o corpo de remover().',
      signature: 'public int remover()',
      solution: `public int remover() throws Exception {
  if (topo == -1) {
    throw new Exception("Erro ao remover!");
  }
  int resp = array[topo];
  topo--;
  return resp;
}`,
      requiredFragments: [
        req('empty', 'detecta pilha vazia', 'if (topo == -1)'),
        req('read', 'le o valor do topo', 'int resp = array[topo];'),
        req('retreat', 'recua topo', 'topo--;'),
      ],
      lineExplanations: [{ code: 'if (topo == -1)', note: 'Pilha vazia quando nao sobrou nenhum indice valido.' }],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(1): le um indice e decrementa topo.',
    }),
  },

  // ---------------------------------------------------------------------
  // PILHA FLEXIVEL (u04) — encadeada, topo
  // ---------------------------------------------------------------------
  {
    id: 'code-prova1-pilha-flexivel-inserir',
    domainId: 'vetores',
    moduleId: 'pilha',
    title: 'Pilha flexivel: inserir',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova1-pilha-flexivel',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Praticar a insercao no topo (sem celula cabeca) ate virar automatico.',
    stem: 'Pilha flexivel sem celula cabeca (topo == null quando vazia). Implemente inserir(x).',
    scaffold: `class Celula {
  int elemento;
  Celula prox;
  public Celula(int elemento) { this.elemento = elemento; this.prox = null; }
}
class Pilha {
  private Celula topo;

  public void inserir(int x) {
    // implementar
  }
}`,
    visual: visual('stack', 'Empilhar flexivel', 'A nova celula aponta pro antigo topo e vira o novo topo.', ['nova', 'topo antigo']),
    step: functionStep({
      id: 'code-prova1-pilha-flexivel-inserir-step',
      prompt: 'Escreva o corpo de inserir(x).',
      signature: 'public void inserir(int x)',
      solution: `public void inserir(int x) {
  Celula tmp = new Celula(x);
  tmp.prox = topo;
  topo = tmp;
}`,
      requiredFragments: [
        req('link', 'nova celula aponta pro topo antigo', 'tmp.prox = topo;'),
        req('advance', 'topo passa a ser a nova celula', 'topo = tmp;'),
      ],
      lineExplanations: [{ code: 'tmp.prox = topo;', note: 'Funciona igual com pilha vazia: topo e null, e a nova celula aponta pra null.' }],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(1): cria uma celula e religa um ponteiro.',
    }),
  },
  {
    id: 'code-prova1-pilha-flexivel-remover',
    domainId: 'vetores',
    moduleId: 'pilha',
    title: 'Pilha flexivel: remover',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova1-pilha-flexivel',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Praticar a remocao do topo ate virar automatico.',
    stem: 'Implemente remover(), que lanca excecao se a pilha estiver vazia.',
    scaffold: `class Celula { int elemento; Celula prox; }
class Pilha {
  private Celula topo;

  public int remover() throws Exception {
    // implementar
  }
}`,
    visual: visual('stack', 'Desempilhar flexivel', 'topo passa a ser topo.prox.', ['topo (sai)', 'novo topo']),
    step: functionStep({
      id: 'code-prova1-pilha-flexivel-remover-step',
      prompt: 'Escreva o corpo de remover().',
      signature: 'public int remover()',
      solution: `public int remover() throws Exception {
  if (topo == null) {
    throw new Exception("Erro ao remover!");
  }
  int resp = topo.elemento;
  topo = topo.prox;
  return resp;
}`,
      requiredFragments: [
        req('empty', 'detecta pilha vazia', 'if (topo == null)'),
        req('read', 'le o elemento do topo', 'int resp = topo.elemento;'),
        req('advance', 'topo passa a ser topo.prox', 'topo = topo.prox;'),
      ],
      lineExplanations: [{ code: 'if (topo == null)', note: 'Pilha vazia quando nao sobrou nenhuma celula.' }],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(1): le um campo e religa um ponteiro.',
    }),
  },
  {
    id: 'code-prova1-pilha-flexivel-contar',
    domainId: 'vetores',
    moduleId: 'pilha',
    title: 'Pilha flexivel: contar recursivo',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pilha-flexivel',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Aplicar o padrao publico-chama-privado-recursivo numa pilha.',
    stem: 'Implemente contarElementos(), contando os elementos por recursao a partir do topo.',
    scaffold: `class Celula { int elemento; Celula prox; }
class Pilha {
  private Celula topo;

  public int contarElementos() {
    // implementar
  }
}`,
    visual: visual('stack', 'Contagem recursiva', '1 pra celula atual mais o resto da pilha.', ['topo', '...', 'fundo']),
    step: functionStep({
      id: 'code-prova1-pilha-flexivel-contar-step',
      prompt: 'Escreva o metodo publico e o auxiliar privado de contarElementos.',
      signature: 'public int contarElementos()',
      solution: `public int contarElementos() {
  return contarElementos(topo);
}
private int contarElementos(Celula i) {
  int resp = 0;
  if (i != null) {
    resp = 1 + contarElementos(i.prox);
  }
  return resp;
}`,
      requiredFragments: [
        req('public-call', 'chama o auxiliar pelo topo', 'return contarElementos(topo);'),
        req('base', 'caso base nulo', 'if (i != null)'),
        req('rec', 'soma 1 mais o resto', 'resp = 1 + contarElementos(i.prox);'),
      ],
      lineExplanations: [{ code: 'return contarElementos(topo);', note: 'Metodo publico so chama o auxiliar recursivo pela raiz da estrutura.' }],
      mistakeTag: 'missing-base-case',
      explanation: 'Custo Theta(n): visita cada elemento uma vez.',
    }),
  },
  {
    id: 'code-prova1-pilha-flexivel-media',
    domainId: 'vetores',
    moduleId: 'pilha',
    title: 'Pilha flexivel: media dos elementos',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-pilha-flexivel',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Combinar dois auxiliares recursivos ja prontos num metodo novo.',
    stem: 'getSoma e contarElementos ja estao prontos. Implemente media(), que retorna a media dos elementos e lanca excecao se a pilha estiver vazia.',
    scaffold: `class Celula { int elemento; Celula prox; }
class Pilha {
  private Celula topo;

  private int getSoma(Celula i) {
    int resp = 0;
    if (i != null) {
      resp = i.elemento + getSoma(i.prox);
    }
    return resp;
  }

  private int contarElementos(Celula i) {
    int resp = 0;
    if (i != null) {
      resp = 1 + contarElementos(i.prox);
    }
    return resp;
  }

  public double media() throws Exception {
    // implementar, usando getSoma e contarElementos
  }
}`,
    visual: visual('stack', 'Soma dividida pela contagem', 'media = getSoma(topo) / contarElementos(topo).', ['soma', '/', 'contagem']),
    step: functionStep({
      id: 'code-prova1-pilha-flexivel-media-step',
      prompt: 'Escreva o corpo de media().',
      signature: 'public double media()',
      solution: `public double media() throws Exception {
  if (topo == null) {
    throw new Exception("Pilha vazia!");
  }
  return (double) getSoma(topo) / contarElementos(topo);
}`,
      requiredFragments: [
        req('empty', 'lanca excecao se vazia', 'if (topo == null)'),
        req('cast', 'converte pra double antes de dividir', '(double) getSoma(topo)'),
        req('divide', 'divide soma por contagem', '/ contarElementos(topo);'),
      ],
      lineExplanations: [{ code: '(double) getSoma(topo)', note: 'Sem o cast, a divisao de dois int trunca o resultado (divisao inteira).' }],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(n): reusa dois metodos que ja percorrem a pilha uma vez cada.',
    }),
  },
  {
    id: 'code-prova1-pilha-flexivel-inverter',
    domainId: 'vetores',
    moduleId: 'pilha',
    title: 'Pilha flexivel: inverter so com recursao',
    source: 'prova1',
    difficulty: 'desafio',
    repetitionGroup: 'prova1-pilha-flexivel',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Usar a pilha de chamadas do proprio Java como memoria auxiliar.',
    stem:
      'Implemente inverter(), que inverte a ordem da pilha usando SO recursao (sem pilha, fila ou array auxiliar): desempilhe tudo recursivamente e, na volta, insira cada valor no FUNDO da pilha.',
    scaffold: `class Celula { int elemento; Celula prox; }
class Pilha {
  private Celula topo;

  public void inserir(int x) {
    Celula tmp = new Celula(x);
    tmp.prox = topo;
    topo = tmp;
  }

  public int remover() throws Exception {
    if (topo == null) {
      throw new Exception("Erro ao remover!");
    }
    int resp = topo.elemento;
    topo = topo.prox;
    return resp;
  }

  public void inverter() {
    // implementar
  }

  private void inserirNoFundo(int x) {
    // implementar
  }
}`,
    visual: visual('stack', 'Desempilha tudo, reinsere no fundo', 'Cada valor desempilhado espera na pilha de chamadas ate ser reinserido no fundo.', ['topo', '...', 'fundo']),
    step: functionStep({
      id: 'code-prova1-pilha-flexivel-inverter-step',
      prompt: 'Escreva inverter() e inserirNoFundo(x).',
      signature: 'public void inverter()',
      solution: `public void inverter() {
  if (topo != null) {
    int valor = remover();
    inverter();
    inserirNoFundo(valor);
  }
}

private void inserirNoFundo(int x) {
  if (topo == null) {
    inserir(x);
  } else {
    int valor = remover();
    inserirNoFundo(x);
    inserir(valor);
  }
}`,
      requiredFragments: [
        req('base-inverter', 'para quando a pilha esvazia', 'if (topo != null)'),
        req('pop', 'desempilha antes de recursar', 'int valor = remover();'),
        req('rec-inverter', 'inverte o resto antes de reinserir', 'inverter();'),
        req('bottom-call', 'insere o valor guardado no fundo', 'inserirNoFundo(valor);'),
        req('base-fundo', 'pilha vazia: so insere', 'if (topo == null)'),
      ],
      lineExplanations: [
        { code: 'int valor = remover();', note: 'Guarda o valor atual antes de continuar desempilhando o resto.' },
        { code: 'inserirNoFundo(valor);', note: 'So depois que TODA a pilha foi invertida, o valor guardado entra no fundo.' },
      ],
      mistakeTag: 'missing-base-case',
      explanation: 'Custo Theta(n^2): inserirNoFundo percorre ate n elementos, e e chamado uma vez pra cada um dos n elementos da pilha.',
    }),
  },
  {
    id: 'code-prova1-pilha-complexidade',
    domainId: 'vetores',
    moduleId: 'pilha',
    title: 'Complexidade da pilha (estatica e flexivel)',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova1-pilha-flexivel',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'justify',
    goal: 'Fixar que as operacoes basicas de pilha nao dependem do tamanho.',
    stem: 'inserir(x) e remover() so mexem no topo, seja pilha estatica (array + indice) ou flexivel (celula + ponteiro).',
    scaffold: `// inserir e remover so leem/escrevem no topo, nunca percorrem a pilha`,
    visual: visual('stack', 'So mexe no topo', 'inserir e remover so tocam a celula/indice do topo.', ['topo']),
    step: gapStep({
      id: 'code-prova1-pilha-complexidade-step',
      prompt: 'Digite a complexidade Theta de inserir(x) e remover() numa pilha (estatica ou flexivel), em funcao do numero de elementos.',
      answers: ['Theta(1)', 'O(1)'],
      mistakeTag: 'wrong-case-analysis',
      explanation: 'Politica LIFO: so o topo muda a cada operacao, entao inserir e remover sao Theta(1) em qualquer implementacao de pilha.',
    }),
  },

  // ---------------------------------------------------------------------
  // LISTA ESTATICA (u02) — array + n
  // ---------------------------------------------------------------------
  {
    id: 'code-prova1-lista-estatica-inserir-fim',
    domainId: 'vetores',
    moduleId: 'lista',
    title: 'Lista estatica: inserir no fim',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova1-lista-estatica',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Praticar a insercao mais simples da lista ate virar automatico.',
    stem: 'Lista sequencial por array; n conta os elementos validos. Implemente inserirFim(x), que lanca excecao se a lista estiver cheia.',
    scaffold: `class Lista {
  private int[] array;
  private int n;

  public Lista(int tamanho) {
    array = new int[tamanho];
    n = 0;
  }

  public void inserirFim(int x) throws Exception {
    // implementar
  }
}`,
    visual: visual('array', 'Inserir no fim', 'So escreve na posicao n e incrementa.', ['0', '...', 'n-1', 'n (novo)']),
    step: functionStep({
      id: 'code-prova1-lista-estatica-inserir-fim-step',
      prompt: 'Escreva o corpo de inserirFim(x).',
      signature: 'public void inserirFim(int x)',
      solution: `public void inserirFim(int x) throws Exception {
  if (n >= array.length) {
    throw new Exception("Erro ao inserir!");
  }
  array[n] = x;
  n++;
}`,
      requiredFragments: [
        req('full', 'detecta lista cheia', 'if (n >= array.length)'),
        req('store', 'escreve na posicao n', 'array[n] = x;'),
        req('inc', 'incrementa n', 'n++;'),
      ],
      lineExplanations: [{ code: 'array[n] = x;', note: 'A posicao n e sempre a primeira posicao livre.' }],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(1): nao precisa deslocar nenhum elemento.',
    }),
  },
  {
    id: 'code-prova1-lista-estatica-remover-fim',
    domainId: 'vetores',
    moduleId: 'lista',
    title: 'Lista estatica: remover do fim',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova1-lista-estatica',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Praticar a remocao mais simples da lista ate virar automatico.',
    stem: 'Implemente removerFim(), que lanca excecao se a lista estiver vazia.',
    scaffold: `class Lista {
  private int[] array;
  private int n;

  public int removerFim() throws Exception {
    // implementar
  }
}`,
    visual: visual('array', 'Remover do fim', 'So decrementa n e le a posicao antiga.', ['0', '...', 'n-1 (sai)']),
    step: functionStep({
      id: 'code-prova1-lista-estatica-remover-fim-step',
      prompt: 'Escreva o corpo de removerFim().',
      signature: 'public int removerFim()',
      solution: `public int removerFim() throws Exception {
  if (n == 0) {
    throw new Exception("Erro ao remover!");
  }
  return array[--n];
}`,
      requiredFragments: [
        req('empty', 'detecta lista vazia', 'if (n == 0)'),
        req('decrement-read', 'decrementa n e le no mesmo indice', 'return array[--n];'),
      ],
      lineExplanations: [{ code: 'return array[--n];', note: '--n decrementa antes de usar, entao ja le a ultima posicao valida.' }],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(1): nao precisa deslocar nenhum elemento.',
    }),
  },
  {
    id: 'code-prova1-lista-estatica-inserir-inicio',
    domainId: 'vetores',
    moduleId: 'lista',
    title: 'Lista estatica: inserir no inicio',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-lista-estatica',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Praticar o deslocamento necessario pra abrir espaco no inicio.',
    stem: 'Implemente inserirInicio(x): abra espaco deslocando todo mundo uma posicao pra direita, depois insira em array[0].',
    scaffold: `class Lista {
  private int[] array;
  private int n;

  public void inserirInicio(int x) throws Exception {
    // implementar
  }
}`,
    visual: visual('array', 'Deslocar tudo pra direita', 'Do fim pro comeco, cada elemento anda uma posicao.', ['x (novo)', '0', '1', '...', 'n-1']),
    step: functionStep({
      id: 'code-prova1-lista-estatica-inserir-inicio-step',
      prompt: 'Escreva o corpo de inserirInicio(x).',
      signature: 'public void inserirInicio(int x)',
      solution: `public void inserirInicio(int x) throws Exception {
  if (n >= array.length) {
    throw new Exception("Erro ao inserir!");
  }
  for (int i = n; i > 0; i--) {
    array[i] = array[i - 1];
  }
  array[0] = x;
  n++;
}`,
      requiredFragments: [
        req('full', 'detecta lista cheia', 'if (n >= array.length)'),
        req('shift', 'desloca de tras pra frente', 'for (int i = n; i > 0; i--)'),
        req('insert', 'insere na posicao 0', 'array[0] = x;'),
      ],
      lineExplanations: [{ code: 'for (int i = n; i > 0; i--)', note: 'Precisa ir de tras pra frente, senao sobrescreve valores antes de move-los.' }],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(n): precisa deslocar todos os elementos existentes.',
    }),
  },
  {
    id: 'code-prova1-lista-estatica-remover-inicio',
    domainId: 'vetores',
    moduleId: 'lista',
    title: 'Lista estatica: remover do inicio',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-lista-estatica',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Praticar o deslocamento necessario pra fechar o buraco do inicio.',
    stem: 'Implemente removerInicio(): guarde array[0], depois desloque todo mundo uma posicao pra esquerda.',
    scaffold: `class Lista {
  private int[] array;
  private int n;

  public int removerInicio() throws Exception {
    // implementar
  }
}`,
    visual: visual('array', 'Deslocar tudo pra esquerda', 'Do comeco pro fim, cada elemento anda uma posicao pra tras.', ['0 (sai)', '1', '2', '...']),
    step: functionStep({
      id: 'code-prova1-lista-estatica-remover-inicio-step',
      prompt: 'Escreva o corpo de removerInicio().',
      signature: 'public int removerInicio()',
      solution: `public int removerInicio() throws Exception {
  if (n == 0) {
    throw new Exception("Erro ao remover!");
  }
  int resp = array[0];
  n--;
  for (int i = 0; i < n; i++) {
    array[i] = array[i + 1];
  }
  return resp;
}`,
      requiredFragments: [
        req('empty', 'detecta lista vazia', 'if (n == 0)'),
        req('save', 'guarda o valor removido antes de deslocar', 'int resp = array[0];'),
        req('shift', 'desloca de frente pra tras', 'for (int i = 0; i < n; i++)'),
      ],
      lineExplanations: [{ code: 'for (int i = 0; i < n; i++)', note: 'Aqui pode ir de frente pra tras, porque cada copia le uma posicao ainda nao sobrescrita.' }],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(n): precisa deslocar todos os elementos restantes.',
    }),
  },
  {
    id: 'code-prova1-lista-estatica-inserir-pos',
    domainId: 'vetores',
    moduleId: 'lista',
    title: 'Lista estatica: inserir em posicao qualquer',
    source: 'prova1',
    difficulty: 'avancado',
    repetitionGroup: 'prova1-lista-estatica',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Generalizar inserirInicio pra qualquer posicao valida.',
    stem: 'Implemente inserir(x, pos), considerando que a primeira posicao valida e 0 e a ultima e n.',
    scaffold: `class Lista {
  private int[] array;
  private int n;

  public void inserir(int x, int pos) throws Exception {
    // implementar
  }
}`,
    visual: visual('array', 'Deslocar so a partir de pos', 'Do fim ate pos, cada elemento anda uma posicao pra direita.', ['0', '...', 'pos', 'x (novo)', '...', 'n']),
    step: functionStep({
      id: 'code-prova1-lista-estatica-inserir-pos-step',
      prompt: 'Escreva o corpo de inserir(x, pos).',
      signature: 'public void inserir(int x, int pos)',
      solution: `public void inserir(int x, int pos) throws Exception {
  if (n >= array.length || pos < 0 || pos > n) {
    throw new Exception("Erro ao inserir!");
  }
  for (int i = n; i > pos; i--) {
    array[i] = array[i - 1];
  }
  array[pos] = x;
  n++;
}`,
      requiredFragments: [
        req('valid', 'valida cheia e posicao', 'if (n >= array.length || pos < 0 || pos > n)'),
        req('shift', 'desloca so ate pos', 'for (int i = n; i > pos; i--)'),
        req('insert', 'insere na posicao pedida', 'array[pos] = x;'),
      ],
      lineExplanations: [{ code: 'for (int i = n; i > pos; i--)', note: 'inserirInicio e o caso especial pos = 0 desse mesmo laco.' }],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(n - pos) no pior caso: so desloca do fim ate a posicao pedida.',
    }),
  },

  // ---------------------------------------------------------------------
  // LISTA FLEXIVEL (u04) — encadeada, com celula cabeca
  // ---------------------------------------------------------------------
  {
    id: 'code-prova1-lista-flexivel-inserir-fim',
    domainId: 'vetores',
    moduleId: 'lista',
    title: 'Lista flexivel: inserir no fim',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova1-lista-flexivel',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Praticar a insercao mais simples com celula cabeca.',
    stem: 'A lista comeca so com a celula cabeca (primeiro == ultimo). Implemente inserirFim(x).',
    scaffold: `class Celula {
  int elemento;
  Celula prox;
  public Celula() { this(0); }
  public Celula(int elemento) { this.elemento = elemento; this.prox = null; }
}
class Lista {
  private Celula primeiro, ultimo;

  public Lista() {
    primeiro = new Celula();
    ultimo = primeiro;
  }

  public void inserirFim(int x) {
    // implementar
  }
}`,
    visual: visual('list', 'Inserir no fim', 'Igual a fila flexivel: religa ultimo.prox e avanca ultimo.', ['cabeca', 'A', 'B', 'x (novo)']),
    step: functionStep({
      id: 'code-prova1-lista-flexivel-inserir-fim-step',
      prompt: 'Escreva o corpo de inserirFim(x).',
      signature: 'public void inserirFim(int x)',
      solution: `public void inserirFim(int x) {
  ultimo.prox = new Celula(x);
  ultimo = ultimo.prox;
}`,
      requiredFragments: [
        req('link', 'liga nova celula em ultimo', 'ultimo.prox = new Celula(x);'),
        req('advance', 'avanca ultimo', 'ultimo = ultimo.prox;'),
      ],
      lineExplanations: [{ code: 'ultimo.prox = new Celula(x);', note: 'A celula cabeca garante que ultimo.prox sempre pode ser escrito.' }],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(1): so por causa do ponteiro ultimo, senao precisaria percorrer a lista inteira.',
    }),
  },
  {
    id: 'code-prova1-lista-flexivel-inserir-inicio',
    domainId: 'vetores',
    moduleId: 'lista',
    title: 'Lista flexivel: inserir no inicio',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-lista-flexivel',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Cuidar do caso especial em que a lista esta vazia.',
    stem:
      'Implemente inserirInicio(x). Cuidado: se a lista estiver vazia (primeiro == ultimo), a nova celula tambem precisa virar o novo ultimo.',
    scaffold: `class Celula { int elemento; Celula prox; }
class Lista {
  private Celula primeiro, ultimo;

  public void inserirInicio(int x) {
    // implementar
  }
}`,
    visual: visual('list', 'Insercao apos a cabeca', 'A nova celula entra entre a cabeca e o antigo primeiro elemento.', ['cabeca', 'x (novo)', 'A antigo']),
    step: functionStep({
      id: 'code-prova1-lista-flexivel-inserir-inicio-step',
      prompt: 'Escreva o corpo de inserirInicio(x).',
      signature: 'public void inserirInicio(int x)',
      solution: `public void inserirInicio(int x) {
  Celula tmp = new Celula(x);
  tmp.prox = primeiro.prox;
  primeiro.prox = tmp;
  if (primeiro == ultimo) {
    ultimo = tmp;
  }
}`,
      requiredFragments: [
        req('link', 'nova celula aponta pro antigo primeiro real', 'tmp.prox = primeiro.prox;'),
        req('attach', 'cabeca aponta pra nova celula', 'primeiro.prox = tmp;'),
        req('empty-case', 'atualiza ultimo se a lista estava vazia', 'if (primeiro == ultimo)'),
      ],
      lineExplanations: [{ code: 'if (primeiro == ultimo)', note: 'Sem esse ajuste, inserir na lista vazia deixaria ultimo apontando pra celula errada.' }],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(1). O caso especial de lista vazia e o detalhe que mais derruba nota nesse metodo.',
    }),
  },
  {
    id: 'code-prova1-lista-flexivel-remover-inicio',
    domainId: 'vetores',
    moduleId: 'lista',
    title: 'Lista flexivel: remover do inicio',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova1-lista-flexivel',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Praticar a remocao mais simples com celula cabeca.',
    stem: 'Implemente removerInicio(), que lanca excecao se a lista estiver vazia.',
    scaffold: `class Celula { int elemento; Celula prox; }
class Lista {
  private Celula primeiro, ultimo;

  public int removerInicio() throws Exception {
    // implementar
  }
}`,
    visual: visual('list', 'Remover apos a cabeca', 'A celula cabeca nunca sai; sai a proxima.', ['cabeca', 'A (sai)', 'B']),
    step: functionStep({
      id: 'code-prova1-lista-flexivel-remover-inicio-step',
      prompt: 'Escreva o corpo de removerInicio().',
      signature: 'public int removerInicio()',
      solution: `public int removerInicio() throws Exception {
  if (primeiro == ultimo) {
    throw new Exception("Erro ao remover (vazia)!");
  }
  Celula tmp = primeiro;
  primeiro = primeiro.prox;
  int resp = primeiro.elemento;
  tmp.prox = null;
  return resp;
}`,
      requiredFragments: [
        req('empty', 'detecta lista vazia', 'if (primeiro == ultimo)'),
        req('advance', 'primeiro passa a ser primeiro.prox', 'primeiro = primeiro.prox;'),
        req('read', 'le o elemento da nova cabeca', 'int resp = primeiro.elemento;'),
      ],
      lineExplanations: [{ code: 'primeiro = primeiro.prox;', note: 'A celula que era o primeiro elemento real vira a nova cabeca.' }],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(1), identico ao remover da fila flexivel — mesma estrutura de celula cabeca.',
    }),
  },
  {
    id: 'code-prova1-lista-flexivel-tamanho',
    domainId: 'vetores',
    moduleId: 'lista',
    title: 'Lista flexivel: tamanho',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-lista-flexivel',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Contar sem contar a celula cabeca.',
    stem: 'Implemente tamanho(), que retorna quantos elementos reais a lista tem.',
    scaffold: `class Celula { int elemento; Celula prox; }
class Lista {
  private Celula primeiro, ultimo;

  public int tamanho() {
    // implementar
  }
}`,
    visual: visual('list', 'Contar ate ultimo', 'Percorre de primeiro (cabeca) ate ultimo, sem contar a cabeca.', ['cabeca', 'A', 'B', 'ultimo']),
    step: functionStep({
      id: 'code-prova1-lista-flexivel-tamanho-step',
      prompt: 'Escreva o corpo de tamanho().',
      signature: 'public int tamanho()',
      solution: `public int tamanho() {
  int tam = 0;
  for (Celula i = primeiro; i != ultimo; i = i.prox) {
    tam++;
  }
  return tam;
}`,
      requiredFragments: [
        req('loop', 'percorre da cabeca ate ultimo', 'for (Celula i = primeiro; i != ultimo; i = i.prox)'),
        req('count', 'incrementa a cada volta', 'tam++;'),
      ],
      lineExplanations: [{ code: 'for (Celula i = primeiro; i != ultimo; i = i.prox)', note: 'Comecar em primeiro (a cabeca) e parar em ultimo conta certo os elementos reais.' }],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(n): precisa percorrer, ja que a lista nao guarda o tamanho num campo separado.',
    }),
  },
  {
    id: 'code-prova1-lista-flexivel-inverter',
    domainId: 'vetores',
    moduleId: 'lista',
    title: 'Lista flexivel: inverter no lugar',
    source: 'prova1',
    difficulty: 'desafio',
    repetitionGroup: 'prova1-lista-flexivel',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Religar ponteiros com cuidado, atualizando corretamente primeiro e ultimo.',
    stem:
      'Implemente inverter(), que inverte a ordem dos elementos da lista, usando so os ponteiros da propria lista (sem array ou lista auxiliar).',
    scaffold: `class Celula { int elemento; Celula prox; }
class Lista {
  private Celula primeiro, ultimo;

  public void inverter() {
    // implementar
  }
}`,
    visual: visual('list', 'Inversao de ponteiros', 'cabeca -> A -> B -> C vira cabeca -> C -> B -> A, com ultimo atualizado.', ['A', 'B', 'C']),
    step: functionStep({
      id: 'code-prova1-lista-flexivel-inverter-step',
      prompt: 'Escreva o corpo de inverter().',
      signature: 'public void inverter()',
      solution: `public void inverter() {
  Celula novoUltimo = primeiro.prox;
  Celula anterior = null;
  Celula atual = primeiro.prox;
  while (atual != null) {
    Celula proximo = atual.prox;
    atual.prox = anterior;
    anterior = atual;
    atual = proximo;
  }
  primeiro.prox = anterior;
  ultimo = (novoUltimo != null) ? novoUltimo : primeiro;
}`,
      requiredFragments: [
        req('save', 'guarda quem vai virar o novo ultimo', 'Celula novoUltimo = primeiro.prox;'),
        req('reverse', 'inverte os ponteiros um a um', 'atual.prox = anterior;'),
        req('reattach', 'religa a cabeca no novo primeiro real', 'primeiro.prox = anterior;'),
        req('fix-ultimo', 'atualiza ultimo pro antigo primeiro', 'ultimo = (novoUltimo != null) ? novoUltimo : primeiro;'),
      ],
      lineExplanations: [
        { code: 'Celula novoUltimo = primeiro.prox;', note: 'Mesma logica da inversao de fila: e a mesma forma de lista encadeada com celula cabeca.' },
      ],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(n). Identico, ponteiro por ponteiro, ao inverter() da fila flexivel.',
    }),
  },
  {
    id: 'code-prova1-lista-flexivel-complexidade',
    domainId: 'vetores',
    moduleId: 'lista',
    title: 'Complexidade da lista flexivel: removerFim',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova1-lista-flexivel',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'justify',
    goal: 'Perceber a assimetria entre remover do inicio e remover do fim numa lista simplesmente encadeada.',
    stem:
      'A lista e simplesmente encadeada (cada celula so aponta pra frente). removerFim() precisa achar a penultima celula pra desligar ultimo, e nao existe ponteiro "pra tras".',
    scaffold: `// removerFim precisa caminhar de primeiro ate a celula ANTES de ultimo`,
    visual: visual('list', 'Sem ponteiro pra tras', 'Pra tirar o ultimo, precisa achar quem aponta pra ele.', ['cabeca', 'A', 'B', 'C (ultimo, sai)']),
    step: gapStep({
      id: 'code-prova1-lista-flexivel-complexidade-step',
      prompt: 'Digite a complexidade Theta de removerFim() nessa lista simplesmente encadeada, em funcao do numero de elementos n.',
      answers: ['Theta(n)', 'O(n)'],
      mistakeTag: 'wrong-case-analysis',
      explanation: 'Sem ponteiro pra tras, so da pra achar a penultima celula caminhando desde o inicio: Theta(n). Isso contrasta com inserirFim() e removerInicio(), que sao Theta(1).',
    }),
  },
];
