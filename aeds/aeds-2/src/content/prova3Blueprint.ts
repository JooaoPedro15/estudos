import type { ExamBlueprint } from '../types/content';

/**
 * Simulado de referencia da Prova 3, com as 3 questoes do proprio Prova III
 * real do usuario (materiais-privados/Provas3, fotos de
 * "WhatsApp Image 2026-09-05 at 00.10.12.jpeg" e "(1).jpeg"): ArvoreAVL
 * (contarNosBalanceados), ArvoreTrie (getPalavrasComPrefixo) e Hibrida
 * (pesquisar, a estrutura "doidona" com T1/T2/T3). Ha outra versao
 * fotografada da Prova 3 (isMax de altura, TRIE invertida LAEIRT, questoes
 * V/F sobre AVL/2.3.4/alvinegra, Doidona indexada por letra) que fica de
 * fora deste blueprint fixo mas cobre o mesmo escopo (u06-u08).
 */
export const prova3Blueprint: ExamBlueprint = {
  id: 'prova3-aeds-2-v1',
  title: 'Simulado de Prova 3 AEDS II',
  questions: [
    {
      id: 'q1-avl-contar-nos-balanceados',
      number: 1,
      domainId: 'avl',
      format: 'code-modification',
      title: 'ArvoreAVL: contar nos balanceados',
      stem:
        'A classe ArvoreAVL usa nos com atributo nivel (quantidade de niveis existentes a partir do proprio no), ja calculado corretamente (os balanceamentos da arvore nao sao mais realizados, mas nivel esta correto). ' +
        'Implemente int contarNosBalanceados(), que retorna a quantidade de nos que estao balanceados de acordo com o criterio de uma Arvore AVL (diferenca de nivel entre as subarvores esquerda e direita, no maximo, 1 — subarvore vazia conta nivel -1).',
      scaffold: `class ArvoreAVL {
  private No raiz;

  public int contarNosBalanceados() {
    // implementar
  }
}
class No {
  public int elemento;
  public No esq, dir;
  public int nivel;
}`,
      visual: {
        kind: 'avl',
        title: 'Diferenca de nivel entre esq e dir',
        caption: 'Subarvore vazia conta nivel -1; um no e balanceado se |nivel(esq) - nivel(dir)| <= 1.',
        labels: ['nivel(esq)', 'nivel(dir)', '|diferenca| <= 1 ?'],
      },
      steps: [
        {
          id: 'prova3-avl-contarbalanceados-step',
          kind: 'function',
          skillId: 'program',
          prompt: 'Escreva o corpo de contarNosBalanceados() (pode criar um metodo auxiliar privado).',
          signature: 'public int contarNosBalanceados()',
          solution: `public int contarNosBalanceados() {
  return contarNosBalanceados(raiz);
}
private int contarNosBalanceados(No no) {
  int resp = 0;
  if (no != null) {
    int nivelEsq = (no.esq != null) ? no.esq.nivel : -1;
    int nivelDir = (no.dir != null) ? no.dir.nivel : -1;
    if (Math.abs(nivelEsq - nivelDir) <= 1) {
      resp = 1;
    }
    resp += contarNosBalanceados(no.esq) + contarNosBalanceados(no.dir);
  }
  return resp;
}`,
          requiredFragments: [
            { id: 'null-level', label: 'subarvore vazia conta nivel -1', code: '(no.esq != null) ? no.esq.nivel : -1' },
            { id: 'balance-check', label: 'checa a diferenca de nivel em modulo', code: 'Math.abs(nivelEsq - nivelDir) <= 1' },
            { id: 'recurse-both', label: 'recorre nas duas subarvores, mesmo se este no nao for balanceado', code: 'contarNosBalanceados(no.esq) + contarNosBalanceados(no.dir)' },
          ],
          lineExplanations: [
            { code: 'int nivelEsq = (no.esq != null) ? no.esq.nivel : -1;', note: 'Convencao padrao de altura de arvore: subarvore vazia tem nivel -1, folha tem nivel 0.' },
          ],
          mistakeTag: 'wrong-case-analysis',
          explanation: 'Custo Theta(n): visita cada no exatamente uma vez, fazendo trabalho O(1) por no (ler nivel dos filhos ja calculado, sem recalcular altura).',
        },
        {
          id: 'prova3-avl-contarbalanceados-complexidade',
          kind: 'gap',
          skillId: 'justify',
          prompt: 'Digite a complexidade Theta de contarNosBalanceados() em funcao de n, o numero de nos da arvore.',
          answers: ['Theta(n)', 'O(n)'],
          mistakeTag: 'wrong-case-analysis',
          explanation: 'Como nivel ja vem calculado, cada no faz apenas trabalho constante (ler nivel dos filhos e comparar): Theta(n) no total.',
        },
      ],
    },
    {
      id: 'q2-trie-palavras-com-prefixo',
      number: 2,
      domainId: 'trie',
      format: 'code-modification',
      title: 'ArvoreTrie: todas as palavras com um prefixo',
      stem:
        'A classe No representa um no da TRIE (aceita palavras que podem ser prefixo de outras); getFilho(char) ja esta implementado e retorna o filho daquele caractere ou null. ' +
        'fimPalavra indica se o no representa o fim de uma palavra. A classe Lista (ja implementada) tem inserir(String). ' +
        'Implemente Lista getPalavrasComPrefixo(String prefixo), que pesquisa na arvore todas as palavras que comecam com o prefixo informado e retorna uma lista com as palavras encontradas.',
      scaffold: `class ArvoreTrie {
  private No raiz;

  public Lista getPalavrasComPrefixo(String prefixo) {
    // implementar
  }
}
class No {
  public char elemento;
  public boolean fimPalavra;
  public No getFilho(char letra) {
    // ja implementado
  }
}
class Lista {
  // classe ja implementada
  public void inserir(String palavra) {
    // ja implementado
  }
}`,
      visual: {
        kind: 'trie',
        title: 'Descer o prefixo, depois coletar tudo embaixo',
        caption: 'Primeiro desce letra a letra pelo prefixo; se chegar ate o fim, faz uma busca coletando toda palavra completa da subarvore.',
        labels: ['descer prefixo', 'no do prefixo', 'coletar subarvore'],
      },
      steps: [
        {
          id: 'prova3-trie-prefixo-step',
          kind: 'function',
          skillId: 'program',
          prompt: 'Escreva o corpo de getPalavrasComPrefixo(prefixo) (pode criar um metodo auxiliar privado de coleta).',
          signature: 'public Lista getPalavrasComPrefixo(String prefixo)',
          solution: `public Lista getPalavrasComPrefixo(String prefixo) {
  Lista lista = new Lista();
  No no = raiz;
  int pos = 0;
  while (no != null && pos < prefixo.length()) {
    no = no.getFilho(prefixo.charAt(pos));
    pos++;
  }
  if (no != null) {
    coletar(no, prefixo, lista);
  }
  return lista;
}
private void coletar(No no, String atual, Lista lista) {
  if (no.fimPalavra) {
    lista.inserir(atual);
  }
  for (char c = 'a'; c <= 'z'; c++) {
    No filho = no.getFilho(c);
    if (filho != null) {
      coletar(filho, atual + c, lista);
    }
  }
}`,
          requiredFragments: [
            { id: 'descend', label: 'desce um caractere do prefixo por vez', code: 'no = no.getFilho(prefixo.charAt(pos));' },
            { id: 'guard-descend', label: 'para se sair da arvore ou acabar o prefixo', code: 'while (no != null && pos < prefixo.length())' },
            { id: 'base-word', label: 'coleta a palavra quando o no marca fim de palavra', code: 'if (no.fimPalavra)' },
            { id: 'insert', label: 'insere a palavra coletada na lista de resposta', code: 'lista.inserir(atual);' },
            { id: 'explore-children', label: 'explora todos os filhos possiveis pra continuar coletando', code: "for (char c = 'a'; c <= 'z'; c++)" },
          ],
          lineExplanations: [
            { code: 'if (no.fimPalavra)', note: 'Erro classico: contar so o no exatamente no fim do prefixo, esquecendo que a resposta precisa de TODAS as palavras da subarvore (o prefixo pode nao ser palavra sozinho).' },
          ],
          mistakeTag: 'prefix-vs-word',
          explanation: 'Custo Theta(p + s): p e o tamanho do prefixo (descida) e s e o numero de nos da subarvore do prefixo (coleta, cada um com custo constante ja que o alfabeto tem tamanho fixo).',
        },
        {
          id: 'prova3-trie-prefixo-complexidade',
          kind: 'gap',
          skillId: 'justify',
          prompt: 'Digite a complexidade Theta de getPalavrasComPrefixo, em funcao de p (tamanho do prefixo) e s (numero de nos na subarvore do prefixo).',
          answers: ['Theta(p + s)', 'Theta(p+s)', 'O(p + s)', 'O(p+s)'],
          mistakeTag: 'wrong-case-analysis',
          explanation: 'Descer o prefixo custa Theta(p); coletar as palavras da subarvore visita cada no dela uma vez, custando Theta(s).',
        },
      ],
    },
    {
      id: 'q3-hibrida-pesquisar-cpf',
      number: 3,
      domainId: 'doidona',
      format: 'composite-structure-method',
      title: 'Hibrida: pesquisar por CPF em T1 -> T2 -> T3',
      stem:
        'A classe Hibrida armazena pessoas por CPF numa tabela hash T1 (tamanho n1). Cada celula de T1 tem um ponteiro pra Pessoa e outro pra uma tabela hash T2 (tamanho n2, com rehash). ' +
        'Quando rehashT2 tambem colide, o registro vai pra T3: hashT3 igual a 0 usa uma arvore binaria; hashT3 igual a 1 usa uma lista flexivel com celula cabeca. ' +
        'Implemente Pessoa pesquisar(int cpf), retornando null se o CPF nao for encontrado.',
      scaffold: `class Hibrida {
  T1 t1;
  public Pessoa pesquisar(int cpf) {
    // implementar
  }
}
class T1 {
  CelulaT1[] tabela;
  public int hashT1(int x) { return x % tabela.length; }
}
class CelulaT1 {
  Pessoa elemento;
  T2 t2;
}
class T2 {
  Pessoa[] tabela;
  T3 t3;
  public int hashT2(int x) { return x % tabela.length; }
  public int rehashT2(int x) { return ++x % tabela.length; }
}
class T3 {
  No raiz;
  Celula primeiro;
  public int hashT3(int x) { return x % 2; }
}
class No {
  Pessoa elemento;
  No esq, dir;
}
class Celula {
  Pessoa elemento;
  Celula prox;
}
class Pessoa {
  int cpf;
}`,
      visual: {
        kind: 'hash',
        title: 'Cascata T1 -> T2 -> T3 (arvore ou lista)',
        caption: 'Cada nivel tenta achar direto; se nao bate, desce pro proximo nivel da estrutura doidona.',
        labels: ['T1: hashT1', 'T2: hashT2 -> rehashT2', 'T3: arvore (0) ou lista com cabeca (1)'],
      },
      steps: [
        {
          id: 'prova3-hibrida-pesquisar-step',
          kind: 'function',
          skillId: 'program',
          prompt: 'Escreva o corpo de pesquisar(cpf) (pode criar metodos auxiliares privados para T2 e T3).',
          signature: 'public Pessoa pesquisar(int cpf)',
          solution: `public Pessoa pesquisar(int cpf) {
  int h1 = t1.hashT1(cpf);
  CelulaT1 c1 = t1.tabela[h1];
  Pessoa resp;
  if (c1.elemento != null && c1.elemento.cpf == cpf) {
    resp = c1.elemento;
  } else {
    resp = pesquisarT2(c1.t2, cpf);
  }
  return resp;
}
private Pessoa pesquisarT2(T2 t2, int cpf) {
  int h2 = t2.hashT2(cpf);
  Pessoa resp;
  if (t2.tabela[h2] != null && t2.tabela[h2].cpf == cpf) {
    resp = t2.tabela[h2];
  } else {
    int h2b = t2.rehashT2(cpf);
    if (t2.tabela[h2b] != null && t2.tabela[h2b].cpf == cpf) {
      resp = t2.tabela[h2b];
    } else {
      resp = pesquisarT3(t2.t3, cpf);
    }
  }
  return resp;
}
private Pessoa pesquisarT3(T3 t3, int cpf) {
  int h3 = t3.hashT3(cpf);
  Pessoa resp;
  if (h3 == 0) {
    resp = pesquisarArvore(t3.raiz, cpf);
  } else {
    resp = pesquisarLista(t3.primeiro, cpf);
  }
  return resp;
}
private Pessoa pesquisarArvore(No no, int cpf) {
  Pessoa resp = null;
  if (no != null) {
    if (no.elemento.cpf == cpf) {
      resp = no.elemento;
    } else if (cpf < no.elemento.cpf) {
      resp = pesquisarArvore(no.esq, cpf);
    } else {
      resp = pesquisarArvore(no.dir, cpf);
    }
  }
  return resp;
}
private Pessoa pesquisarLista(Celula cabeca, int cpf) {
  Pessoa resp = null;
  Celula p = cabeca.prox;
  while (p != null && resp == null) {
    if (p.elemento.cpf == cpf) {
      resp = p.elemento;
    }
    p = p.prox;
  }
  return resp;
}`,
          requiredFragments: [
            { id: 'check-t1', label: 'checa se o CPF bate direto em T1', code: 'if (c1.elemento != null && c1.elemento.cpf == cpf)' },
            { id: 'goto-t2', label: 'se nao bateu em T1, desce pra T2', code: 'resp = pesquisarT2(c1.t2, cpf);' },
            { id: 'rehash', label: 'tenta o rehash antes de desistir de T2', code: 't2.rehashT2(cpf)' },
            { id: 'goto-t3', label: 'se rehash tambem falhou, desce pra T3', code: 'resp = pesquisarT3(t2.t3, cpf);' },
            { id: 'hash3-branch', label: 'hashT3 decide entre arvore (0) e lista (1)', code: 'if (h3 == 0)' },
            { id: 'skip-header', label: 'pula a celula cabeca da lista flexivel', code: 'Celula p = cabeca.prox;' },
          ],
          lineExplanations: [
            { code: 'Celula p = cabeca.prox;', note: 'celula cabeca (sentinela) nunca guarda um elemento real — os dados comecam em cabeca.prox, igual as outras listas flexiveis do curso.' },
          ],
          mistakeTag: 'algorithm-confusion',
          explanation: 'Melhor caso Theta(1) (achou direto em T1 ou T2); pior caso Theta(n) se cair na lista flexivel de T3, que nao tem garantia de balanceamento e pode concentrar varias colisoes.',
        },
        {
          id: 'prova3-hibrida-pesquisar-complexidade',
          kind: 'gap',
          skillId: 'justify',
          prompt: 'Digite a complexidade Theta do PIOR caso de pesquisar(cpf), quando o registro esta na lista flexivel de T3.',
          answers: ['Theta(n)', 'O(n)'],
          mistakeTag: 'wrong-case-analysis',
          explanation: 'A lista flexivel de T3 nao tem garantia de tamanho pequeno nem de balanceamento: no pior caso, percorre todos os n elementos que colidiram ate ali.',
        },
      ],
    },
  ],
};
