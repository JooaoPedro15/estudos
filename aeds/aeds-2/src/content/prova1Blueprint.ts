import type { ExamBlueprint } from '../types/content';

export const prova1Blueprint: ExamBlueprint = {
  id: 'prova1-aeds-2-v1',
  title: 'Simulado de Prova 1 AEDS II',
  questions: [
    {
      id: 'q1-complexidade-lacos',
      number: 1,
      domainId: 'somatorio',
      moduleId: 'complexidade',
      format: 'case-analysis',
      title: 'Complexidade de lacos dependentes de condicao',
      stem:
        'Considere: if (a > b) { for (i = 0; i < n; i++) for (j = n; j > 0; j = j / 2) foo(); } else { for (i = n; i > 0; i--) foo(); }',
      visual: {
        kind: 'array',
        title: 'Dois ramos, dois custos',
        caption: 'O ramo executado depende da condicao a > b, nao do tamanho de n.',
        labels: ['if: n * log n', 'else: n'],
      },
      steps: [
        {
          id: 'prova1-complexidade-melhor-pior',
          kind: 'choice',
          skillId: 'recognize',
          prompt: 'Qual ramo representa o pior caso em Θ?',
          correctOptionId: 'ramo-if',
          options: [
            { id: 'ramo-if', label: 'Ramo do if: Θ(n log n)' },
            { id: 'ramo-else', label: 'Ramo do else: Θ(n)', mistakeTag: 'wrong-case-analysis' },
            { id: 'empate', label: 'Os dois tem o mesmo custo', mistakeTag: 'wrong-case-analysis' },
          ],
          explanation:
            'O laco interno do if divide j por 2 a cada volta (log n voltas) dentro de um laco externo de n voltas: Θ(n log n), maior que o Θ(n) do else.',
        },
        {
          id: 'prova1-complexidade-theta-else',
          kind: 'gap',
          skillId: 'justify',
          prompt: 'Digite a notacao Theta do ramo else (melhor caso).',
          answers: ['Theta(n)', 'O(n)'],
          mistakeTag: 'wrong-case-analysis',
          explanation: 'O ramo else tem um unico laco que decrementa i ate 0: Θ(n).',
        },
      ],
    },
    {
      id: 'q2-somatorio-perturbacao',
      number: 2,
      domainId: 'somatorio',
      format: 'summation-from-code',
      title: 'Perturbacao e inducao em somatorio',
      stem:
        'Use a propriedade de perturbacao (Sn + a(n+1) = a0 + soma de a(i+1), i de 0 a n) para achar a formula fechada de Sn = soma de (2i + 1), i de 0 a n. Depois, prove o resultado por inducao.',
      visual: {
        kind: 'array',
        title: 'Soma dos impares',
        caption: 'Sn soma os n + 1 primeiros numeros impares: 1, 3, 5, ..., 2n + 1.',
        labels: ['1', '3', '5', '...', '2n+1'],
      },
      steps: [
        {
          id: 'prova1-somatorio-fechada',
          kind: 'code',
          skillId: 'justify',
          prompt: 'Digite a formula fechada de Sn.',
          acceptedAnswers: ['(n + 1) ^ 2', '(n+1)^2', '(n + 1) * (n + 1)'],
          mistakeTag: 'wrong-summation-bound',
          explanation: 'A soma dos n + 1 primeiros impares e um quadrado perfeito: (n + 1)^2.',
        },
        {
          id: 'prova1-somatorio-passo-base',
          kind: 'rubric',
          skillId: 'justify',
          prompt: 'Qual e o passo base correto da prova por inducao?',
          acceptableOptionIds: ['base-n0'],
          options: [
            { id: 'base-n0', label: 'Para n = 0, S0 = 1 e (0 + 1)^2 = 1: bate.' },
            { id: 'base-n1', label: 'Para n = 1, S1 = 3 e (1 + 1)^2 = 3: bate.', mistakeTag: 'wrong-summation-bound' },
            { id: 'sem-base', label: 'Inducao nao precisa de passo base aqui.', mistakeTag: 'algorithm-confusion' },
          ],
          explanation: 'O somatorio comeca em i = 0, entao o passo base testa n = 0: S0 = 1 = (0 + 1)^2.',
        },
      ],
    },
    {
      id: 'q3-fila-desfazer',
      number: 3,
      domainId: 'vetores',
      moduleId: 'fila',
      format: 'code-modification',
      title: 'Fila circular: desfazer e mostrar invertido',
      stem:
        'A partir da Fila circular oficial (array de tamanho n + 1, indices primeiro/ultimo), implemente int desfazer(), que remove o ultimo elemento inserido e retorna -1 se a fila estiver vazia, e void mostrarInverso(), que exibe os elementos da fila do ultimo ao primeiro, recursivamente, sem alterar a fila.',
      scaffold: `class Fila {
  private int[] array;
  private int primeiro, ultimo;

  public Fila(int tamanho) {
    array = new int[tamanho + 1];
    primeiro = ultimo = 0;
  }

  public boolean isVazia() {
    return primeiro == ultimo;
  }

  public int desfazer() {
    // implementar
  }

  public void mostrarInverso() {
    // implementar
  }
}`,
      visual: {
        kind: 'queue',
        title: 'Fila circular',
        caption: 'ultimo aponta para o proximo slot livre; desfazer volta um slot.',
        labels: ['primeiro', '...', 'ultimo - 1', 'ultimo'],
      },
      steps: [
        {
          id: 'prova1-fila-desfazer-step',
          kind: 'function',
          skillId: 'program',
          prompt: 'Escreva o corpo de desfazer().',
          signature: 'public int desfazer()',
          solution: `public int desfazer() {
  int resp;
  if (isVazia()) {
    resp = -1;
  } else {
    ultimo = (ultimo - 1 + array.length) % array.length;
    resp = array[ultimo];
  }
  return resp;
}`,
          requiredFragments: [
            { id: 'vazia', label: 'testa fila vazia antes de desfazer', code: 'if (isVazia())' },
            {
              id: 'volta-ultimo',
              label: 'volta ultimo uma posicao, circular',
              code: 'ultimo = (ultimo - 1 + array.length) % array.length;',
            },
            { id: 'retorno', label: 'retorna o elemento removido', code: 'resp = array[ultimo];' },
          ],
          lineExplanations: [
            { code: 'if (isVazia())', note: 'sem isso, desfazer numa fila vazia daria estado invalido' },
            {
              code: 'ultimo = (ultimo - 1 + array.length) % array.length;',
              note: 'anda uma posicao pra tras, voltando ao inicio do array se necessario',
            },
          ],
          mistakeTag: 'lost-pointer',
          explanation: 'desfazer e o inverso de inserir: recua ultimo em vez de avancar. Custo Θ(1).',
        },
        {
          id: 'prova1-fila-mostrarinverso-step',
          kind: 'gap',
          skillId: 'justify',
          prompt: 'Qual a complexidade de mostrarInverso() em funcao do numero de elementos n da fila?',
          answers: ['Theta(n)', 'O(n)'],
          mistakeTag: 'wrong-case-analysis',
          explanation: 'mostrarInverso visita cada elemento da fila exatamente uma vez, do ultimo ao primeiro: Θ(n).',
        },
      ],
    },
  ],
};
