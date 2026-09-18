import type { CodeDrill, FunctionRequirement, FunctionStep, GapStep, RubricStep, CodeStep, StructureVisual } from '../types/content';

/**
 * Questoes REAIS da Reavaliacao (materiais-privados/ProvasReav, fotografada
 * — REAV1 e REAV2_incompleta) que cobrem materia de Prova 1 (u00-u04):
 * complexidade/inducao, ordenacao e pilha/fila. Marcadas com
 * oldExam.studyScope = 'p1' pra aparecerem tambem em "Provas antigas" da
 * Prova 1, mesmo tendo sido fotografadas na Reavaliacao (oldExam.paperExam
 * = 'reav'). As demais questoes dessas provas (arvore, AVL/2-3-4/alvinegra,
 * hash/doidona, matriz encadeada) sao materia de Prova 2/3 e ficam de fora
 * deste arquivo.
 */

const REAV_P1: { paperExam: 'reav'; studyScope: 'p1'; questionLabel: string } = {
  paperExam: 'reav',
  studyScope: 'p1',
  questionLabel: '',
};

function reavP1(questionLabel: string) {
  return { ...REAV_P1, questionLabel };
}

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

type CodeExamStep = CodeStep & { skillId: 'justify' };

function codeStep(step: Omit<CodeExamStep, 'kind' | 'skillId'>): CodeExamStep {
  return { kind: 'code', skillId: 'justify', ...step };
}

const reavQ1Codigo = `public void calcula(int n) {
  for (int i = 1; i <= n; i++) {
    a *= 2;
    for (int j = 1; j <= i; j++) {
      b *= 2;
      c *= 2;
    }
  }
}`;

const reavQ2BolhaCodigo = `void bubblesort(int[] array) {
  for (int i = (array.length - 1); i > 0; i--) {
    for (int j = 0; j < i; j++) {
      if (array[j] > array[j + 1]) {
        int temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
      }
    }
  }
}`;

export const reavCodeDrillCatalog: CodeDrill[] = [
  // ---------------------------------------------------------------------
  // REAV1, Q1: complexidade + inducao de calcula(n) (materia de Prova 1)
  // ---------------------------------------------------------------------
  {
    id: 'code-reav-q1-complexidade',
    domainId: 'somatorio',
    moduleId: 'complexidade',
    title: 'Reavaliacao real (Q1): complexidade de calcula(n)',
    source: 'prova1',
    difficulty: 'avancado',
    repetitionGroup: 'reav-q1-calcula',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'justify',
    goal: 'Questao real da Reavaliacao (materia de Prova 1): contar operacoes de um laco aninhado onde o interno depende do externo.',
    stem:
      'Questao real da Reavaliacao (materiais-privados/ProvasReav). Conte o numero de multiplicacoes (a *= 2, b *= 2, c *= 2) que calcula(n) executa ao todo.',
    scaffold: reavQ1Codigo,
    visual: visual('array', 'Um multiplicador fixo, um crescente', 'Cada i contribui 1 (a *= 2) mais 2*i (o laco interno faz i voltas, cada uma com 2 multiplicacoes).', ['i=1: 3', 'i=2: 5', '...', 'i=n: 1+2n']),
    step: gapStep({
      id: 'code-reav-q1-complexidade-step',
      prompt: 'Quantas multiplicacoes calcula(n) executa ao todo, em Theta e em funcao de n?',
      answers: ['Theta(n^2)', 'O(n^2)'],
      mistakeTag: 'wrong-summation-bound',
      explanation:
        'Somatorio_{i=1}^{n} (1 + 2i) = n + 2*(n(n+1)/2) = n + n(n+1) = n^2 + 2n, que e Theta(n^2).',
    }),
    oldExam: reavP1('q1-complexidade'),
  },
  {
    id: 'code-reav-q1-forma-fechada',
    domainId: 'somatorio',
    moduleId: 'complexidade',
    title: 'Reavaliacao real (Q1): forma fechada de calcula(n)',
    source: 'prova1',
    difficulty: 'avancado',
    repetitionGroup: 'reav-q1-calcula',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'justify',
    goal: 'Fechar o somatorio de calcula(n) numa formula em funcao de n.',
    stem: 'Mesma questao real. Digite a forma fechada do somatorio total de multiplicacoes.',
    scaffold: reavQ1Codigo,
    visual: visual('array', 'Forma fechada', 'n^2 + 2n = n(n + 2).', ['n^2', '+ 2n']),
    step: codeStep({
      id: 'code-reav-q1-forma-fechada-step',
      prompt: 'Digite a forma fechada de Somatorio_{i=1}^{n} (1 + 2i).',
      acceptedAnswers: ['n^2 + 2n', 'n^2+2n', 'n * (n + 2)', 'n*(n+2)'],
      mistakeTag: 'wrong-summation-bound',
      explanation: 'Somatorio_{i=1}^{n} (1 + 2i) = n + n(n+1) = n^2 + 2n = n(n + 2).',
    }),
    oldExam: reavP1('q1-forma-fechada'),
  },
  {
    id: 'code-reav-q1-passo-indutivo',
    domainId: 'somatorio',
    moduleId: 'complexidade',
    title: 'Reavaliacao real (Q1): passo indutivo',
    source: 'prova1',
    difficulty: 'avancado',
    repetitionGroup: 'reav-q1-calcula',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'justify',
    goal: 'Usar a hipotese de inducao pra fechar o passo indutivo de calcula(n).',
    stem:
      'Mesma questao real. Hipotese de inducao: suponha que vale pra n=k, ou seja, Sk = k(k+2). O termo que entra quando i vai de k pra k+1 e 1 + 2(k+1).',
    scaffold: `// hipotese: Sk = k * (k + 2)
// objetivo do passo indutivo: mostrar que S(k+1) = (k + 1) * (k + 3)`,
    visual: visual(
      'array',
      'Passo indutivo parte da hipotese',
      'S(k+1) = Sk + (1 + 2(k+1)) — usa Sk que a hipotese ja garante, so soma o termo novo.',
      ['Sk (hipotese)', '+ (1 + 2(k+1))', '= (k+1)(k+3)'],
    ),
    step: rubricStep({
      id: 'code-reav-q1-passo-indutivo-step',
      prompt: 'Qual sequencia de igualdades usa CORRETAMENTE a hipotese de inducao para chegar em S(k+1) = (k+1)(k+3)?',
      acceptableOptionIds: ['certo'],
      options: [
        {
          id: 'certo',
          label: 'S(k+1) = Sk + (1 + 2(k+1)) = k(k+2) + 2k+3 = k^2+2k+2k+3 = k^2+4k+3 = (k+1)(k+3)',
        },
        {
          id: 'sem-hipotese',
          label: 'S(k+1) = (k+1)(k+3), substituindo n por k+1 direto na formula original.',
          mistakeTag: 'algorithm-confusion',
        },
        {
          id: 'termo-errado',
          label: 'S(k+1) = Sk + (1 + 2k), esquecendo de avancar i pra k+1 no termo novo.',
          mistakeTag: 'wrong-summation-bound',
        },
      ],
      explanation:
        'O termo que entra quando i passa de k pra k+1 e 1 + 2(k+1) (nao 1 + 2k). O passo indutivo soma Sk (da hipotese) com esse termo novo, sem reescrever a formula do zero.',
    }),
    oldExam: reavP1('q1-passo-indutivo'),
  },

  // ---------------------------------------------------------------------
  // REAV1, Q3: prove ou refute (itens de materia de Prova 1)
  // ---------------------------------------------------------------------
  {
    id: 'code-reav-q3d-busca-binaria-aleatoria',
    domainId: 'somatorio',
    moduleId: 'busca-binaria',
    title: 'Reavaliacao real (Q3d): busca binaria em vetor aleatorio',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'reav-q3-prove-refute',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'justify',
    goal: 'Distinguir "o vetor nao vem ordenado" de "e impossivel obter busca binaria Theta(log n)".',
    stem:
      'Questao real da Reavaliacao. Prove ou refute: "Dado um array contendo numeros inteiros gerados de forma aleatoria entre 0 e 100, e impossivel projetar um algoritmo de busca binaria cuja complexidade no pior caso sera Theta(log n)."',
    scaffold: `// array gerado aleatoriamente, valores entre 0 e 100
// pergunta: da pra ter busca binaria com pior caso Theta(log n)?`,
    visual: visual('array', 'Ordenar primeiro nao muda a busca', 'Ordenar o vetor (pre-processamento) nao faz parte da busca binaria em si.', ['vetor aleatorio', 'ordenar', 'busca binaria: Theta(log n)']),
    step: rubricStep({
      id: 'code-reav-q3d-busca-binaria-aleatoria-step',
      prompt: 'A afirmacao e verdadeira ou falsa?',
      acceptableOptionIds: ['falsa'],
      options: [
        {
          id: 'falsa',
          label:
            'Falsa: nada impede ordenar o array primeiro (pre-processamento) e so depois rodar a busca binaria. Uma vez ordenado, a busca binaria em si e Theta(log n) no pior caso, independente de como os valores foram gerados originalmente.',
        },
        {
          id: 'verdadeira-sem-ordenar',
          label: 'Verdadeira, porque o array nao vem ordenado e busca binaria exige vetor ordenado.',
          mistakeTag: 'algorithm-confusion',
        },
        {
          id: 'verdadeira-valores-limitados',
          label: 'Verdadeira, porque os valores estao limitados entre 0 e 100.',
          mistakeTag: 'wrong-case-analysis',
        },
      ],
      explanation:
        '"Nao vir ordenado" e um problema de pre-processamento, nao da busca em si. Depois de ordenado (Theta(n log n) uma vez), toda busca binaria seguinte e Theta(log n) no pior caso.',
    }),
    oldExam: reavP1('q3d-busca-binaria'),
  },
  {
    id: 'code-reav-q3e-mergesort-movimentacao',
    domainId: 'ordenacao',
    title: 'Reavaliacao real (Q3e): mergesort e o melhor em movimentacao?',
    source: 'prova1',
    difficulty: 'avancado',
    repetitionGroup: 'reav-q3-prove-refute',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'justify',
    goal: 'Separar "melhor complexidade" de "menos movimentacao de registros".',
    stem:
      'Questao real da Reavaliacao. Prove ou refute: "O melhor algoritmo em termos de movimentacao de registros e o merge sort, cuja complexidade e Theta(n log n)."',
    scaffold: `// mergesort: Theta(n log n) em TODOS os casos (certo)
// mas: quantos elementos ele MOVE (copia) no total?`,
    visual: visual('array', 'Comparacoes x movimentacoes', 'Selection sort: poucas trocas (no maximo n-1), muitas comparacoes. Mergesort: Theta(n log n) tanto em comparacoes quanto em copias.', ['selection: <= n-1 trocas', 'mergesort: Theta(n log n) copias']),
    step: rubricStep({
      id: 'code-reav-q3e-mergesort-movimentacao-step',
      prompt: 'A afirmacao e verdadeira ou falsa?',
      acceptableOptionIds: ['falsa'],
      options: [
        {
          id: 'falsa',
          label:
            'Falsa (na parte "melhor em movimentacao"): a complexidade Theta(n log n) do mergesort esta certa, mas cada nivel da recursao copia todos os elementos pros arrays auxiliares, entao o total de movimentacoes tambem e Theta(n log n). O selection sort, por exemplo, faz no maximo n-1 trocas no pior caso, movimentando bem menos registros (mesmo com Theta(n^2) comparacoes).',
        },
        {
          id: 'verdadeira',
          label: 'Verdadeira: Theta(n log n) e a melhor complexidade possivel, entao tambem e o melhor em movimentacao.',
          mistakeTag: 'algorithm-confusion',
        },
        {
          id: 'falsa-complexidade',
          label: 'Falsa, porque a complexidade do mergesort nao e Theta(n log n) no pior caso.',
          mistakeTag: 'wrong-case-analysis',
        },
      ],
      explanation:
        'Complexidade (comparacoes) e movimentacao de registros sao coisas diferentes. O selection sort e conhecido por minimizar trocas (no maximo n-1), nao o mergesort.',
    }),
    oldExam: reavP1('q3e-mergesort-movimentacao'),
  },
  {
    id: 'code-reav-q3g-mergesort-pior-caso',
    domainId: 'ordenacao',
    title: 'Reavaliacao real (Q3g): mergesort fica quadratico no pior caso?',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'reav-q3-prove-refute',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'justify',
    goal: 'Reforcar que mergesort nao depende da ordem dos dados de entrada.',
    stem: 'Questao real da Reavaliacao. Prove ou refute: "No pior caso, a ordem de complexidade do mergesort sera quadratica."',
    scaffold: `// mergesort sempre divide ao meio
// mergesort sempre intercala em tempo linear`,
    visual: visual('array', 'Sempre a mesma divisao', 'Nao importa a ordem dos dados: mergesort sempre divide ao meio e intercala em tempo linear.', ['melhor: Theta(n log n)', 'pior: Theta(n log n)']),
    step: rubricStep({
      id: 'code-reav-q3g-mergesort-pior-caso-step',
      prompt: 'A afirmacao e verdadeira ou falsa?',
      acceptableOptionIds: ['falsa'],
      options: [
        {
          id: 'falsa',
          label:
            'Falsa: mergesort sempre divide o vetor ao meio e sempre intercala em tempo linear, nao importa a ordem dos dados. Melhor, medio e pior caso sao todos Theta(n log n) — nunca fica quadratico.',
        },
        {
          id: 'verdadeira-input-ordenado',
          label: 'Verdadeira, se o vetor de entrada ja estiver ordenado.',
          mistakeTag: 'wrong-case-analysis',
        },
        {
          id: 'verdadeira-tipo-quicksort',
          label: 'Verdadeira, porque todo algoritmo de divisao e conquista degenera pra quadratico no pior caso (como o quicksort).',
          mistakeTag: 'algorithm-confusion',
        },
      ],
      explanation:
        'Diferente do quicksort (que pode degenerar pra Theta(n^2) com pivo ruim), o mergesort NAO depende dos dados: a divisao e sempre ao meio e a intercalacao e sempre Theta(n).',
    }),
    oldExam: reavP1('q3g-mergesort-pior-caso'),
  },
  {
    id: 'code-reav-q3h-radix-linear',
    domainId: 'ordenacao',
    moduleId: 'ordenacao-radix',
    title: 'Reavaliacao real (Q3h): radix sort e linear no pior caso?',
    source: 'prova1',
    difficulty: 'avancado',
    repetitionGroup: 'reav-q3-prove-refute',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'justify',
    goal: 'Entender por que radix sort escapa do limite inferior Omega(n log n) da ordenacao por comparacao.',
    stem: 'Questao real da Reavaliacao. Prove ou refute: "No pior caso, a ordem de complexidade do radix sort sera linear."',
    scaffold: `// radix sort: Theta(d * (n + base)), d = numero de digitos do maior valor
// d e a base sao tratados como constantes (independentes de n)`,
    visual: visual('array', 'd constante vira fator constante', 'Theta(d * (n + base)) com d e base fixos = Theta(n).', ['d * (n + base)', '= Theta(n)']),
    step: rubricStep({
      id: 'code-reav-q3h-radix-linear-step',
      prompt: 'A afirmacao e verdadeira ou falsa?',
      acceptableOptionIds: ['verdadeira'],
      options: [
        {
          id: 'verdadeira',
          label:
            'Verdadeira: radix sort custa Theta(d * (n + base)), onde d e o numero de digitos do maior valor. Tratando d e a base como constantes, a complexidade fica Theta(n) — linear, mesmo no pior caso, sem contradizer o limite Omega(n log n) da ordenacao por comparacao, porque radix sort NAO compara elementos entre si.',
        },
        {
          id: 'falsa-comparacao',
          label: 'Falsa, porque nenhum algoritmo de ordenacao pode ser mais rapido que Theta(n log n).',
          mistakeTag: 'algorithm-confusion',
        },
        {
          id: 'falsa-quadratica',
          label: 'Falsa, o pior caso do radix sort e quadratico, igual ao counting sort quando os valores sao muito espalhados.',
          mistakeTag: 'wrong-case-analysis',
        },
      ],
      explanation:
        'O limite Omega(n log n) so vale pra ordenacao por COMPARACAO. Radix sort ordena por digito (counting sort repetido), nao compara elementos entre si, entao pode ser linear.',
    }),
    oldExam: reavP1('q3h-radix-linear'),
  },

  // ---------------------------------------------------------------------
  // REAV1, Q4: insertion sort adaptado (impares antes de pares)
  // ---------------------------------------------------------------------
  {
    id: 'code-reav-q4-insercao-paridade',
    domainId: 'ordenacao',
    moduleId: 'ordenacao-insercao',
    title: 'Reavaliacao real (Q4): insertion sort com impares antes de pares',
    source: 'prova1',
    difficulty: 'desafio',
    repetitionGroup: 'reav-q4-insercao-paridade',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Adaptar o comparador do insertion sort pra uma ordem de prioridade customizada (paridade, depois valor).',
    stem:
      'Questao real da Reavaliacao. Reimplemente o insertion sort para que, dado um vetor de numeros aleatorios, o resultado mantenha todos os numeros IMPARES antes dos PARES, mas cada grupo ordenado entre si. Ex.: 4,3,8,6,1,2,9,0,5,7 vira 1,3,5,7,9,0,2,4,6,8.',
    scaffold: `class Ordenacao {
  int[] array;

  void inserirPorParidade() {
    // implementar
  }
}`,
    visual: visual('array', 'Prioridade: paridade, depois valor', 'Impar sempre vem antes de par; dentro do mesmo grupo, ordena por valor.', ['1', '3', '5', '7', '9', '|', '0', '2', '4', '6', '8']),
    step: functionStep({
      id: 'code-reav-q4-insercao-paridade-step',
      prompt: 'Escreva o corpo de inserirPorParidade() (pode criar um metodo auxiliar privado de comparacao).',
      signature: 'void inserirPorParidade()',
      solution: `void inserirPorParidade() {
  for (int i = 1; i < array.length; i++) {
    int chave = array[i];
    int j = i - 1;
    while (j >= 0 && deveVirAntes(chave, array[j])) {
      array[j + 1] = array[j];
      j--;
    }
    array[j + 1] = chave;
  }
}

private boolean deveVirAntes(int a, int b) {
  boolean aImpar = (a % 2 != 0);
  boolean bImpar = (b % 2 != 0);
  if (aImpar != bImpar) {
    return aImpar;
  }
  return a < b;
}`,
      requiredFragments: [
        req('while-desloca', 'insertion sort classico: desloca enquanto a chave deve vir antes', 'while (j >= 0 && deveVirAntes(chave, array[j]))'),
        req('paridades', 'calcula a paridade dos dois valores comparados', 'boolean aImpar = (a % 2 != 0);'),
        req('paridade-diferente', 'se as paridades sao diferentes, impar sempre vence', 'if (aImpar != bImpar)'),
        req('mesmo-grupo', 'no mesmo grupo (mesma paridade), compara por valor normalmente', 'return a < b;'),
      ],
      lineExplanations: [
        { code: 'if (aImpar != bImpar)', note: 'So entra aqui quando um e impar e o outro e par: o impar sempre "ganha" (vem antes).' },
        { code: 'return a < b;', note: 'Se ambos sao impares ou ambos sao pares, cai no criterio normal de valor.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation:
        'E o MESMO insertion sort classico, so trocando o criterio de comparacao "a < b" por um comparador de duas prioridades (paridade primeiro, valor depois). Nao precisa de dois vetores nem duas passagens.',
    }),
    oldExam: reavP1('q4-insercao-paridade'),
  },

  // ---------------------------------------------------------------------
  // REAV2, Q1: bubblesort real (Sigma, forma fechada, otimizacao)
  // ---------------------------------------------------------------------
  {
    id: 'code-reav-q2bolha-complexidade',
    domainId: 'somatorio',
    moduleId: 'complexidade',
    title: 'Reavaliacao real (Q1a): complexidade do bubblesort dado',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'reav-q2bolha-somatorio',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'justify',
    goal: 'Fechar o somatorio de comparacoes de uma implementacao real de bubblesort de prova.',
    stem: 'Questao real da Reavaliacao. Quantas comparacoes (array[j] > array[j + 1]) o bubblesort executa ao todo, em Theta e em funcao de n = array.length?',
    scaffold: reavQ2BolhaCodigo,
    visual: visual('array', 'i decrescente, j crescente ate i', 'Pra cada i (de n-1 ate 1), o laco interno faz exatamente i comparacoes.', ['i=n-1: n-1 comp.', '...', 'i=1: 1 comp.']),
    step: gapStep({
      id: 'code-reav-q2bolha-complexidade-step',
      prompt: 'Qual a complexidade Theta do numero total de comparacoes, em funcao de n?',
      answers: ['Theta(n^2)', 'O(n^2)'],
      mistakeTag: 'wrong-summation-bound',
      explanation: 'Somatorio_{i=1}^{n-1} i = (n-1)n/2, que e Theta(n^2).',
    }),
    oldExam: reavP1('q2bolha-complexidade'),
  },
  {
    id: 'code-reav-q2bolha-forma-fechada',
    domainId: 'somatorio',
    moduleId: 'complexidade',
    title: 'Reavaliacao real (Q1b): forma fechada do bubblesort dado',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'reav-q2bolha-somatorio',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'justify',
    goal: 'Escrever a formula fechada exata do somatorio de comparacoes.',
    stem: 'Mesma questao real. Digite a forma fechada de Somatorio_{i=1}^{n-1} i, em funcao apenas de n.',
    scaffold: reavQ2BolhaCodigo,
    visual: visual('array', 'Forma fechada', '(n - 1) * n / 2.', ['(n-1) * n / 2']),
    step: codeStep({
      id: 'code-reav-q2bolha-forma-fechada-step',
      prompt: 'Digite a forma fechada do somatorio total de comparacoes.',
      acceptedAnswers: ['n * (n - 1) / 2', 'n*(n-1)/2', '(n - 1) * n / 2', '(n-1)*n/2'],
      mistakeTag: 'wrong-summation-bound',
      explanation: 'Somatorio_{i=1}^{n-1} i = (n-1)n/2 (soma dos n-1 primeiros naturais).',
    }),
    oldExam: reavP1('q2bolha-forma-fechada'),
  },
  {
    id: 'code-reav-q2bolha-otimizacao',
    domainId: 'ordenacao',
    moduleId: 'ordenacao-bolha',
    title: 'Reavaliacao real (Q1c): bubblesort com flag e limite encolhendo',
    source: 'prova1',
    difficulty: 'desafio',
    repetitionGroup: 'reav-q2bolha-otimizacao',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Combinar as duas otimizacoes classicas da bolha: parar cedo com flag, e encolher o limite pela posicao da ultima troca.',
    stem:
      'Mesma questao real. O bubblesort acima pode ser otimizado pra terminar mais cedo se nenhuma troca for realizada numa passagem completa. Uma melhoria adicional pode ser feita ao rastrear a posicao da ultima troca realizada, encolhendo o limite da proxima passagem ate ali. Implemente essa otimizacao.',
    scaffold: `class Ordenacao {
  int[] array;

  void bubblesortOtimizado() {
    // implementar
  }
}`,
    visual: visual('array', 'Limite encolhe ate a ultima troca', 'Tudo depois da ultima troca ja esta ordenado: a proxima passagem nao precisa visitar essa parte.', ['ultima troca em j', 'novo limite = j']),
    step: functionStep({
      id: 'code-reav-q2bolha-otimizacao-step',
      prompt: 'Escreva o corpo de bubblesortOtimizado().',
      signature: 'void bubblesortOtimizado()',
      solution: `void bubblesortOtimizado() {
  int limite = array.length - 1;
  boolean trocou = true;
  while (limite > 0 && trocou) {
    trocou = false;
    int ultimaTroca = 0;
    for (int j = 0; j < limite; j++) {
      if (array[j] > array[j + 1]) {
        int temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
        trocou = true;
        ultimaTroca = j;
      }
    }
    limite = ultimaTroca;
  }
}`,
      requiredFragments: [
        req('condicao-para', 'para cedo se a ultima passagem nao trocou nada', 'while (limite > 0 && trocou)'),
        req('marca-troca', 'liga a flag quando uma troca acontece', 'trocou = true;'),
        req('guarda-posicao', 'guarda a posicao da ultima troca na passagem', 'ultimaTroca = j;'),
        req('encolhe-limite', 'encolhe o limite da proxima passagem ate a ultima troca', 'limite = ultimaTroca;'),
      ],
      lineExplanations: [
        { code: 'while (limite > 0 && trocou)', note: 'Duas condicoes de parada juntas: nada mais pra ordenar (limite chegou a 0) OU a ultima passagem nao trocou nada.' },
        { code: 'limite = ultimaTroca;', note: 'Tudo que esta depois de ultimaTroca ja ficou ordenado nesta passagem — nao precisa revisitar.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation:
        'As duas otimizacoes juntas: a flag "trocou" evita passagens inteiras desnecessarias quando o vetor ja esta ordenado; encolher o limite pela posicao da ultima troca evita revisitar o "rabo" ja ordenado do vetor a cada passagem.',
    }),
    oldExam: reavP1('q2bolha-otimizacao'),
  },

  // ---------------------------------------------------------------------
  // REAV2, Q5: prove ou refute (pilha/fila, materia de Prova 1)
  // ---------------------------------------------------------------------
  {
    id: 'code-reav-q5c-fifo-lifo-estrutura',
    domainId: 'vetores',
    moduleId: 'fila',
    title: 'Reavaliacao real (Q5c): estrutura certa pra FIFO e LIFO',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'reav-q5-prove-refute',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'justify',
    goal: 'Reforcar a associacao correta entre conceito de acesso (FIFO/LIFO) e estrutura de dados.',
    stem:
      'Questao real da Reavaliacao. Prove ou refute: "Podemos lidar com estruturas de dados do tipo lista, fila, pilha e arvores, quando se trata de acesso a elementos em ordem especifica (FIFO ou LIFO). Com base nesse conceito, as estruturas mais adequadas sao Arvore para FIFO e Lista para LIFO."',
    scaffold: `// FIFO = First In, First Out (primeiro a entrar, primeiro a sair)
// LIFO = Last In, First Out (ultimo a entrar, primeiro a sair)`,
    visual: visual('queue', 'FIFO e LIFO tem estrutura propria', 'FIFO = Fila. LIFO = Pilha.', ['FIFO -> Fila', 'LIFO -> Pilha']),
    step: rubricStep({
      id: 'code-reav-q5c-fifo-lifo-estrutura-step',
      prompt: 'A afirmacao e verdadeira ou falsa?',
      acceptableOptionIds: ['falsa'],
      options: [
        {
          id: 'falsa',
          label:
            'Falsa: a estrutura certa pra FIFO e a FILA, nao a arvore; a estrutura certa pra LIFO e a PILHA, nao uma lista generica. Arvore nao tem ordem de acesso FIFO/LIFO fixa, e lista sozinha nao impoe LIFO.',
        },
        {
          id: 'verdadeira',
          label: 'Verdadeira: arvore e lista atendem bem esses dois casos.',
          mistakeTag: 'algorithm-confusion',
        },
        {
          id: 'so-fifo-certo',
          label: 'Verdadeira so pra FIFO (arvore), mas falsa pra LIFO (deveria ser pilha, nao lista).',
          mistakeTag: 'algorithm-confusion',
        },
      ],
      explanation: 'A associacao classica e: FIFO -> Fila, LIFO -> Pilha. Nenhuma das duas trocas (arvore, lista) esta certa aqui.',
    }),
    oldExam: reavP1('q5c-fifo-lifo'),
  },
  {
    id: 'code-reav-q5d-pilha-parenteses',
    domainId: 'vetores',
    moduleId: 'pilha',
    title: 'Reavaliacao real (Q5d): pilha pra parenteses balanceados',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'reav-q5-prove-refute',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'justify',
    goal: 'Confirmar o algoritmo classico de pilha pra verificar parenteses balanceados.',
    stem:
      'Mesma questao real. Prove ou refute: "Uma alternativa para verificar se uma sequencia de caracteres contem parenteses balanceados seria uma pilha que armazena apenas parenteses abertos e os remove ao encontrar parenteses correspondentes fechados."',
    scaffold: `// empilha cada parentese aberto
// ao achar um fechado: desempilha (se a pilha nao estiver vazia) e confere o par
// no final: pilha vazia = balanceado`,
    visual: visual('stack', 'Empilha abertos, desempilha nos fechados', '( ( ) -> empilha, empilha, desempilha. Pilha vazia no final = balanceado.', ['(', '(', ')  desempilha']),
    step: rubricStep({
      id: 'code-reav-q5d-pilha-parenteses-step',
      prompt: 'A afirmacao e verdadeira ou falsa?',
      acceptableOptionIds: ['verdadeira'],
      options: [
        {
          id: 'verdadeira',
          label:
            'Verdadeira: e exatamente o algoritmo classico — empilha cada parentese aberto; ao encontrar um fechado, desempilha (se a pilha nao estiver vazia) pra conferir o par; no final, a pilha precisa estar vazia pra sequencia ser balanceada.',
        },
        {
          id: 'falsa-fila',
          label: 'Falsa, o certo seria usar uma fila, nao uma pilha, pra manter a ordem de entrada.',
          mistakeTag: 'algorithm-confusion',
        },
        {
          id: 'falsa-todos-caracteres',
          label: 'Falsa, a pilha precisaria armazenar TODOS os caracteres da sequencia, nao so os parenteses abertos.',
          mistakeTag: 'wrong-case-analysis',
        },
      ],
      explanation: 'So os parenteses abertos precisam ficar na pilha — os outros caracteres nao afetam o balanceamento e nao precisam ser armazenados.',
    }),
    oldExam: reavP1('q5d-pilha-parenteses'),
  },
];
