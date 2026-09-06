import type { ExamBlueprint } from '../types/content';

/**
 * Simulado de referencia da Prova 2, com as 3 questoes reais de uma das
 * provas fotografadas (materiais-privados/Provas2, foto de
 * "WhatsApp Image 2026-09-05 at 00.08.14.jpeg"): Lista de Pilhas, Arvore de
 * Arvore (contarPalavras) e vetorOrdenado. Ha outras versoes fotografadas da
 * Prova 2 (meiose de lista, BST com repetidos, matriz encadeada com
 * diagUnificada; dicionario em arvore de listas, matriz flexivel,
 * intercalarReverso) que ficam de fora deste blueprint fixo mas ja tem
 * exercicios equivalentes no Treino de Codigo (prova2CodeDrills.ts).
 */
export const prova2Blueprint: ExamBlueprint = {
  id: 'prova2-aeds-2-v1',
  title: 'Simulado de Prova 2 AEDS II',
  questions: [
    {
      id: 'q1-lista-de-pilhas-maior-pilha',
      number: 1,
      domainId: 'vetores',
      moduleId: 'lista',
      format: 'composite-structure-method',
      title: 'Lista de Pilhas: encontrar a maior pilha',
      stem:
        'Considere uma estrutura Lista de Pilhas: Lista tem inicio/fim (CelulaLista); cada CelulaLista tem topo (CelulaPilha) e prox (proxima CelulaLista); cada CelulaPilha tem elemento e prox. ' +
        'Implemente CelulaLista maiorPilha(), que retorna a CelulaLista que aponta para a pilha com o maior numero de elementos. Caso tenham pilhas do mesmo tamanho, retorne a primeira que aparece.',
      scaffold: `class Lista {
  CelulaLista inicio;
  CelulaLista fim;

  public CelulaLista maiorPilha() {
    // implementar
  }
}
class CelulaLista {
  CelulaPilha topo;
  CelulaLista prox;
}
class CelulaPilha {
  int elemento;
  CelulaPilha prox;
}`,
      visual: {
        kind: 'stack',
        title: 'Lista encadeada de pilhas',
        caption: 'Cada CelulaLista guarda o topo de uma pilha diferente; precisa contar cada uma pra achar a maior.',
        labels: ['topo -> ... (pilha 1)', 'topo -> ... (pilha 2)', 'topo -> ... (pilha 3)'],
      },
      steps: [
        {
          id: 'prova2-maiorpilha-step',
          kind: 'function',
          skillId: 'program',
          prompt: 'Escreva o corpo de maiorPilha() (pode criar um metodo auxiliar privado para contar uma pilha).',
          signature: 'public CelulaLista maiorPilha()',
          solution: `public CelulaLista maiorPilha() {
  CelulaLista maior = null;
  int maiorTam = -1;
  CelulaLista atual = inicio;
  while (atual != null) {
    int tam = contarPilha(atual.topo);
    if (tam > maiorTam) {
      maiorTam = tam;
      maior = atual;
    }
    atual = atual.prox;
  }
  return maior;
}
private int contarPilha(CelulaPilha p) {
  int cont = 0;
  while (p != null) {
    cont++;
    p = p.prox;
  }
  return cont;
}`,
          requiredFragments: [
            { id: 'traverse', label: 'percorre a lista de pilhas inteira', code: 'while (atual != null)' },
            { id: 'count', label: 'conta os elementos da pilha atual', code: 'int tam = contarPilha(atual.topo);' },
            {
              id: 'strict-greater',
              label: 'so troca em empate estrito maior (mantem a primeira em caso de empate)',
              code: 'if (tam > maiorTam)',
            },
            { id: 'track', label: 'guarda a celula-lista vencedora, nao so o tamanho', code: 'maior = atual;' },
          ],
          lineExplanations: [
            { code: 'if (tam > maiorTam)', note: 'Usar > (nao >=) e o que garante que empates ficam com a PRIMEIRA pilha que apareceu.' },
          ],
          mistakeTag: 'algorithm-confusion',
          explanation: 'Custo Theta(n): n e a soma de todos os elementos de todas as pilhas, ja que cada elemento de cada pilha e visitado exatamente uma vez.',
        },
        {
          id: 'prova2-maiorpilha-complexidade',
          kind: 'gap',
          skillId: 'justify',
          prompt: 'Digite a complexidade Theta de maiorPilha() em funcao de n, o numero total de elementos somando todas as pilhas.',
          answers: ['Theta(n)', 'O(n)'],
          mistakeTag: 'wrong-case-analysis',
          explanation: 'Cada CelulaPilha (de todas as pilhas) e visitada exatamente uma vez pela funcao auxiliar de contagem: Theta(n).',
        },
      ],
    },
    {
      id: 'q2-arvore-arvore-contar-palavras',
      number: 2,
      domainId: 'arvore',
      format: 'composite-structure-method',
      title: 'Arvore de Arvore: contar palavras por letra e tamanho',
      stem:
        'Considere uma "arvore de arvore" (No raiz de uma BST por letra; cada No tem um No2 raiz de uma segunda BST, com as palavras que comecam com aquela letra). ' +
        'Implemente int contarPalavras(String padrao) que retorna quantas palavras comecam com a mesma letra de padrao e tem a mesma quantidade de caracteres dele. ' +
        'Ex.: se padrao for "PROVA", conte quantas palavras comecam com P e tem 5 caracteres. Faca tambem a analise de complexidade.',
      scaffold: `class ArvoreArvore {
  No raiz;

  public int contarPalavras(String padrao) {
    // implementar
  }
}
class No {
  char letra;
  No esq, dir;
  No2 raiz;
}
class No2 {
  String palavra;
  No2 esq, dir;
}`,
      visual: {
        kind: 'binary-tree',
        title: 'BST de letras, cada uma com sua BST de palavras',
        caption: 'Primeiro busca a letra (BST por char); dentro dela, percorre a BST de palavras inteira (nao esta ordenada por tamanho).',
        labels: ['No (letra)', 'No2 (palavra)', 'mesma letra + mesmo tamanho?'],
      },
      steps: [
        {
          id: 'prova2-contarpalavras-step',
          kind: 'function',
          skillId: 'program',
          prompt: 'Escreva o corpo de contarPalavras(padrao) (pode criar metodos auxiliares privados).',
          signature: 'public int contarPalavras(String padrao)',
          solution: `public int contarPalavras(String padrao) {
  No no = buscarLetra(raiz, padrao.charAt(0));
  int resp = 0;
  if (no != null) {
    resp = contarPorTamanho(no.raiz, padrao.length());
  }
  return resp;
}
private No buscarLetra(No no, char letra) {
  No resp = null;
  if (no != null) {
    if (no.letra == letra) {
      resp = no;
    } else if (letra < no.letra) {
      resp = buscarLetra(no.esq, letra);
    } else {
      resp = buscarLetra(no.dir, letra);
    }
  }
  return resp;
}
private int contarPorTamanho(No2 no2, int tamanho) {
  int resp = 0;
  if (no2 != null) {
    if (no2.palavra.length() == tamanho) {
      resp = 1;
    }
    resp += contarPorTamanho(no2.esq, tamanho) + contarPorTamanho(no2.dir, tamanho);
  }
  return resp;
}`,
          requiredFragments: [
            { id: 'find-letter', label: 'busca a letra na BST principal', code: 'No no = buscarLetra(raiz, padrao.charAt(0));' },
            { id: 'not-found', label: 'letra inexistente conta 0', code: 'int resp = 0;' },
            { id: 'match-length', label: 'compara o tamanho da palavra, nao o conteudo', code: 'no2.palavra.length() == tamanho' },
            {
              id: 'visit-all-no2',
              label: 'visita TODA a subarvore No2 (nao esta ordenada por tamanho)',
              code: 'contarPorTamanho(no2.esq, tamanho) + contarPorTamanho(no2.dir, tamanho)',
            },
          ],
          lineExplanations: [
            {
              code: 'resp += contarPorTamanho(no2.esq, tamanho) + contarPorTamanho(no2.dir, tamanho);',
              note: 'A BST de palavras (No2) e ordenada alfabeticamente, nao por tamanho — por isso precisa visitar todo mundo, sem atalho de busca binaria aqui.',
            },
          ],
          mistakeTag: 'algorithm-confusion',
          explanation:
            'Custo Theta(h + k): h e a altura da BST de letras (so uma busca) e k e o numero de palavras que comecam com aquela letra (precisa visitar todas, ja que a BST de palavras nao esta ordenada por tamanho).',
        },
        {
          id: 'prova2-contarpalavras-complexidade',
          kind: 'gap',
          skillId: 'justify',
          prompt: 'No pior caso (uma unica letra concentra quase todas as palavras da colecao), qual a complexidade Theta de contarPalavras em funcao de n (numero total de palavras)?',
          answers: ['Theta(n)', 'O(n)'],
          mistakeTag: 'wrong-case-analysis',
          explanation: 'Se quase todas as palavras comecam com a mesma letra, a segunda BST concentra quase todo o conjunto e precisa ser percorrida por inteiro: Theta(n).',
        },
      ],
    },
    {
      id: 'q3-vetor-ordenado-merge',
      number: 3,
      domainId: 'ordenacao',
      format: 'algorithm-adaptation',
      title: 'Mesclar dois vetores decrescentes em um vetor ascendente, O(m+n)',
      stem:
        'Implemente public static int[] vetorOrdenado(int[] vetA, int[] vetB), que recebe dois arrays de inteiros (tamanhos m e n) e retorna um terceiro array (tamanho m+n). ' +
        'vetA possui elementos pares, nao primos, ordenados de forma decrescente. vetB possui elementos impares, nao primos, ordenados de forma decrescente. ' +
        'O array retornado deve conter os valores dos dois arrays ordenados de forma CRESCENTE. A complexidade deve ser O(m+n).\n\n' +
        'Exemplo: vetA = [46, 38, 22, 10], vetB = [57, 33, 21] -> vetC = [10, 21, 22, 33, 38, 46, 57].',
      scaffold: `public class Principal {
  public static int[] vetorOrdenado(int[] vetA, int[] vetB) {
    // implementar
  }
}`,
      visual: {
        kind: 'array',
        title: 'Merge de duas listas decrescentes, lidas de tras pra frente',
        caption: 'O menor de cada array esta no FINAL (arrays decrescentes) — por isso os ponteiros comecam no ultimo indice.',
        labels: ['i = m-1 (vetA)', 'j = n-1 (vetB)', 'k = 0 (vetC)'],
      },
      steps: [
        {
          id: 'prova2-vetorordenado-step',
          kind: 'function',
          skillId: 'program',
          prompt: 'Escreva o corpo de vetorOrdenado(vetA, vetB).',
          signature: 'public static int[] vetorOrdenado(int[] vetA, int[] vetB)',
          solution: `public static int[] vetorOrdenado(int[] vetA, int[] vetB) {
  int m = vetA.length;
  int n = vetB.length;
  int[] vetC = new int[m + n];
  int i = m - 1, j = n - 1, k = 0;
  while (i >= 0 && j >= 0) {
    if (vetA[i] <= vetB[j]) {
      vetC[k] = vetA[i];
      i--;
    } else {
      vetC[k] = vetB[j];
      j--;
    }
    k++;
  }
  while (i >= 0) {
    vetC[k] = vetA[i];
    i--;
    k++;
  }
  while (j >= 0) {
    vetC[k] = vetB[j];
    j--;
    k++;
  }
  return vetC;
}`,
          requiredFragments: [
            { id: 'tail-pointers', label: 'ponteiros comecam no FIM dos arrays decrescentes (onde estao os menores valores)', code: 'int i = m - 1, j = n - 1, k = 0;' },
            { id: 'compare', label: 'compara os candidatos atuais dos dois arrays', code: 'if (vetA[i] <= vetB[j])' },
            { id: 'advance-a', label: 'anda pra tras em vetA quando ele vence', code: 'i--;' },
            { id: 'leftover-a', label: 'esgota o resto de vetA se vetB acabou antes', code: 'while (i >= 0)' },
            { id: 'leftover-b', label: 'esgota o resto de vetB se vetA acabou antes', code: 'while (j >= 0)' },
          ],
          lineExplanations: [
            {
              code: 'int i = m - 1, j = n - 1, k = 0;',
              note: 'Como os dois arrays de entrada sao DECRESCENTES, o menor elemento de cada um fica no ultimo indice — por isso os ponteiros de leitura comecam no fim.',
            },
          ],
          mistakeTag: 'algorithm-confusion',
          explanation: 'Custo O(m+n): cada elemento de vetA e vetB e lido e escrito em vetC exatamente uma vez, sem laco aninhado — o mesmo custo do merge do merge sort.',
        },
        {
          id: 'prova2-vetorordenado-complexidade',
          kind: 'gap',
          skillId: 'justify',
          prompt: 'Digite a complexidade Theta de vetorOrdenado em funcao de m e n (o enunciado pede O(m+n); em notacao Theta, some os dois tamanhos).',
          answers: ['Theta(m + n)', 'Theta(m+n)', 'O(m + n)', 'O(m+n)'],
          mistakeTag: 'wrong-case-analysis',
          explanation: 'Nao ha busca nem laco aninhado: cada posicao dos dois vetores de entrada e visitada uma unica vez, dando Theta(m+n).',
        },
      ],
    },
  ],
};
