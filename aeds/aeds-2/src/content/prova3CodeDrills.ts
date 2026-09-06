import type { ChoiceStep, CodeDrill, FunctionRequirement, FunctionStep, GapStep, StructureVisual } from '../types/content';

/**
 * Exercicios novos de treino de codigo pra Prova 3 (u06-u08): comeca pela
 * arvore alvinegra, que estava rasa (so 3 exercicios, todos sobre validar
 * invariantes de cor — faltava a base: pesquisar, caminhar, contar).
 * Classes copiadas do material oficial em
 * materiais/Codigos/u06 Balanceamento de arvores/java/alvinegra.
 *
 * Arvore 2.3.4: cobre pesquisa e contagem de 4-nos (grounded nos slides
 * unidade06c_2_3_4.pdf) e o lado conceitual de fragmentacao (ascensao
 * reativa vs descida pro-ativa, tambem dos slides). A insercao com
 * fragmentacao em si (ascensao/descida) fica de fora como exercicio de
 * codigo — nao ha classe oficial completa de Arvore 2-3-4 no material
 * (so o No234 usado na lista de exercicios), e a logica multi-way de
 * fragmentacao e arriscada demais pra virar exercicio sem uma referencia
 * de codigo pra conferir contra.
 *
 * PATRICIA: cobre contarAs e pesquisar usando o modelo OFICIAL de
 * intervalo (i, j, k) sobre um vetor de strings, copiado de
 * materiais/Codigos/u08 Árvores TRIE/java/patricia/Patricia.java (esse
 * arquivo ja tem pesquisar() e contarAs() prontos — usados aqui como
 * gabarito, com um typo de maiuscula corrigido em charAt).
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

type ChoiceExamStep = ChoiceStep & { skillId: 'recognize' };

function choiceStep(step: Omit<ChoiceExamStep, 'kind' | 'skillId'>): ChoiceExamStep {
  return { kind: 'choice', skillId: 'recognize', ...step };
}

export const prova3CodeDrillCatalog: CodeDrill[] = [
  {
    id: 'code-prova3-alvinegra-pesquisar',
    domainId: 'avl',
    moduleId: 'alvinegra',
    title: 'Alvinegra: pesquisar',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova3-alvinegra',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Praticar que a busca numa alvinegra e identica a de qualquer ABB — a cor nao importa pra pesquisar.',
    stem: 'Implemente pesquisar(elemento): a cor do no (NoAN.cor) nao interfere na busca, so a propriedade de ABB.',
    scaffold: `class NoAN { boolean cor; int elemento; NoAN esq, dir; }
class Alvinegra {
  private NoAN raiz;

  public boolean pesquisar(int elemento) {
    // implementar
  }

  private boolean pesquisar(int elemento, NoAN i) {
    // implementar
  }
}`,
    visual: visual('red-black', 'Busca ignora a cor', 'A cor so importa pra insercao/remocao, nunca pra busca.', ['raiz', 'esq ou dir', 'achou ou null']),
    step: functionStep({
      id: 'code-prova3-alvinegra-pesquisar-step',
      prompt: 'Escreva o metodo publico e o auxiliar privado de pesquisar.',
      signature: 'public boolean pesquisar(int elemento)',
      solution: `public boolean pesquisar(int elemento) {
  return pesquisar(elemento, raiz);
}
private boolean pesquisar(int elemento, NoAN i) {
  boolean resp;
  if (i == null) {
    resp = false;
  } else if (elemento == i.elemento) {
    resp = true;
  } else if (elemento < i.elemento) {
    resp = pesquisar(elemento, i.esq);
  } else {
    resp = pesquisar(elemento, i.dir);
  }
  return resp;
}`,
      requiredFragments: [
        req('base', 'nao achou: chegou num null', 'resp = false;'),
        req('found', 'achou: elemento igual', 'resp = true;'),
        req('left', 'desce a esquerda se menor', 'resp = pesquisar(elemento, i.esq);'),
        req('right', 'desce a direita caso contrario', 'resp = pesquisar(elemento, i.dir);'),
      ],
      lineExplanations: [{ code: 'boolean resp;', note: 'Identico a busca de uma ABB comum: a cor do no (i.cor) nem aparece aqui.' }],
      mistakeTag: 'missing-base-case',
      explanation: 'Custo Theta(log n) GARANTIDO: diferente da ABB comum, o balanceamento da alvinegra impede que a altura degenere pra Theta(n).',
    }),
  },
  {
    id: 'code-prova3-alvinegra-caminhar-central',
    domainId: 'avl',
    moduleId: 'alvinegra',
    title: 'Alvinegra: caminhamento central com cor',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova3-alvinegra',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Praticar percorrer em ordem mostrando tambem um dado extra de cada no (a cor).',
    stem: 'Implemente o caminhamento central, imprimindo elemento e cor: "(p)" se i.cor for true, "(b)" se for false.',
    scaffold: `class NoAN { boolean cor; int elemento; NoAN esq, dir; }
class Alvinegra {
  private NoAN raiz;

  public void caminharCentral() {
    // implementar
  }

  private void caminharCentral(NoAN i) {
    // implementar
  }
}`,
    visual: visual('red-black', 'Em ordem, com a cor de cada no', 'Mesmo esqueleto do caminhamento central de sempre, so print diferente.', ['esq', 'raiz (cor)', 'dir']),
    step: functionStep({
      id: 'code-prova3-alvinegra-caminhar-central-step',
      prompt: 'Escreva o metodo publico e o auxiliar privado de caminharCentral.',
      signature: 'public void caminharCentral()',
      solution: `public void caminharCentral() {
  System.out.print("[ ");
  caminharCentral(raiz);
  System.out.println("]");
}
private void caminharCentral(NoAN i) {
  if (i != null) {
    caminharCentral(i.esq);
    System.out.print(i.elemento + ((i.cor) ? "(p) " : "(b) "));
    caminharCentral(i.dir);
  }
}`,
      requiredFragments: [
        req('base', 'para em subarvore vazia', 'if (i != null)'),
        req('print', 'imprime elemento e cor', 'System.out.print(i.elemento + ((i.cor) ? "(p) " : "(b) "));'),
      ],
      lineExplanations: [{ code: '(i.cor) ? "(p) " : "(b) "', note: 'So um detalhe extra no print de cada no; a estrutura do caminhamento nao muda em nada.' }],
      mistakeTag: 'missing-base-case',
      explanation: 'Custo Theta(n): visita cada no uma vez, igual a qualquer caminhamento em arvore binaria.',
    }),
  },
  {
    id: 'code-prova3-alvinegra-contar-nos',
    domainId: 'avl',
    moduleId: 'alvinegra',
    title: 'Alvinegra: contar nos por cor',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova3-alvinegra',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Adaptar uma contagem recursiva simples pra tambem checar uma condicao no no.',
    stem: 'Implemente contarComCor(cor), que retorna quantos nos da arvore tem exatamente a cor pedida.',
    scaffold: `class NoAN { boolean cor; int elemento; NoAN esq, dir; }
class Alvinegra {
  private NoAN raiz;

  public int contarComCor(boolean cor) {
    // implementar
  }

  private int contarComCor(boolean cor, NoAN i) {
    // implementar
  }
}`,
    visual: visual('red-black', 'Contagem condicional', '1 se a cor bater, mais o resultado dos dois lados.', ['i.cor == cor ?', '+ esq', '+ dir']),
    step: functionStep({
      id: 'code-prova3-alvinegra-contar-nos-step',
      prompt: 'Escreva o metodo publico e o auxiliar privado de contarComCor.',
      signature: 'public int contarComCor(boolean cor)',
      solution: `public int contarComCor(boolean cor) {
  return contarComCor(cor, raiz);
}
private int contarComCor(boolean cor, NoAN i) {
  int resp = 0;
  if (i != null) {
    resp = ((i.cor == cor) ? 1 : 0) + contarComCor(cor, i.esq) + contarComCor(cor, i.dir);
  }
  return resp;
}`,
      requiredFragments: [
        req('base', 'arvore/subarvore vazia conta 0', 'int resp = 0;'),
        req('check', 'conta 1 so se a cor bater', '(i.cor == cor) ? 1 : 0'),
        req('recurse', 'soma os dois lados', 'contarComCor(cor, i.esq) + contarComCor(cor, i.dir)'),
      ],
      lineExplanations: [{ code: '(i.cor == cor) ? 1 : 0', note: 'Mesmo padrao de "contagem condicional" usado em qualquer arvore: 1 se a condicao bate, 0 se nao.' }],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(n): precisa visitar todos os nos, porque a cor de cada um so se sabe olhando ele mesmo.',
    }),
  },
  {
    id: 'code-prova3-alvinegra-complexidade',
    domainId: 'avl',
    moduleId: 'alvinegra',
    title: 'Complexidade da alvinegra',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova3-alvinegra',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'justify',
    goal: 'Fixar a garantia de balanceamento da alvinegra, comparando com a ABB comum.',
    stem: 'A insercao da alvinegra faz rotacoes e recoloracoes sempre que necessario, pra nunca deixar a arvore degenerar numa lista.',
    scaffold: `// diferente da ABB comum, a alvinegra nunca deixa um caminho ficar muito mais longo que outro`,
    visual: visual('red-black', 'Altura sempre proxima de log n', 'Rotacoes e recoloracoes impedem o pior caso Theta(n) da ABB comum.', ['balanceada']),
    step: gapStep({
      id: 'code-prova3-alvinegra-complexidade-step',
      prompt: 'Digite a complexidade Theta garantida de pesquisar/inserir/remover numa arvore alvinegra, em qualquer ordem de insercao.',
      answers: ['Theta(log n)', 'O(log n)'],
      mistakeTag: 'wrong-case-analysis',
      explanation: 'Ao contrario da ABB comum (que pode degenerar pra Theta(n)), a alvinegra garante Theta(log n) sempre, gracas as rotacoes e recoloracoes feitas na insercao.',
    }),
  },
  {
    id: 'code-prova3-arvore234-pesquisar',
    domainId: 'avl',
    moduleId: 'arvore234',
    title: 'Arvore 2.3.4: pesquisar',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova3-arvore234',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Praticar a pesquisa em nos com varias chaves (2, 3 ou 4-no), a base de qualquer operacao na 2.3.4.',
    stem:
      'Cada no tem ate 3 chaves ordenadas (chaves[0..qtdChaves-1]) e ate 4 filhos (filhos[0..qtdChaves]). Implemente pesquisar(x): percorre as chaves do no da esquerda pra direita; se achar x, retorna true; senao desce pro filho entre as duas chaves que "cercam" x.',
    scaffold: `class No234 {
  int[] chaves = new int[3];
  int qtdChaves; // 1 (2-no), 2 (3-no) ou 3 (4-no)
  No234[] filhos = new No234[4];
}
class Arvore234 {
  private No234 raiz;

  public boolean pesquisar(int x) {
    // implementar
  }

  private boolean pesquisar(int x, No234 i) {
    // implementar
  }
}`,
    visual: visual('tree234', 'Um no, ate 3 chaves', 'Percorre as chaves da esquerda pra direita ate achar x ou achar por onde descer.', ['chaves[0]', 'chaves[1]', 'chaves[2]', 'filhos[pos]']),
    step: functionStep({
      id: 'code-prova3-arvore234-pesquisar-step',
      prompt: 'Escreva o metodo publico e o auxiliar privado de pesquisar.',
      signature: 'public boolean pesquisar(int x)',
      solution: `public boolean pesquisar(int x) {
  return pesquisar(x, raiz);
}
private boolean pesquisar(int x, No234 i) {
  boolean resp;
  if (i == null) {
    resp = false;
  } else {
    int pos = 0;
    while (pos < i.qtdChaves && x > i.chaves[pos]) {
      pos++;
    }
    if (pos < i.qtdChaves && x == i.chaves[pos]) {
      resp = true;
    } else {
      resp = pesquisar(x, i.filhos[pos]);
    }
  }
  return resp;
}`,
      requiredFragments: [
        req('base', 'nao achou: chegou num no nulo', 'resp = false;'),
        req('scan', 'anda pelas chaves ate achar uma maior ou igual a x', 'while (pos < i.qtdChaves && x > i.chaves[pos])'),
        req('found', 'achou exatamente a chave', 'x == i.chaves[pos]'),
        req('descend', 'desce pro filho entre as chaves vizinhas', 'resp = pesquisar(x, i.filhos[pos]);'),
      ],
      lineExplanations: [{ code: 'while (pos < i.qtdChaves && x > i.chaves[pos])', note: 'O mesmo laco serve pra 2-no, 3-no e 4-no: pos acaba parando na posicao certa em qualquer um dos tres casos.' }],
      mistakeTag: 'incomplete-layer-search',
      explanation: 'Custo Theta(log n): a altura de uma arvore 2.3.4 com n elementos e sempre Theta(log n), ja que todas as folhas ficam no mesmo nivel.',
    }),
  },
  {
    id: 'code-prova3-arvore234-contar-quatro-nos',
    domainId: 'avl',
    moduleId: 'arvore234',
    title: 'Arvore 2.3.4: contar 4-nos',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova3-arvore234',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Adaptar uma contagem recursiva pra um no com aridade variavel (2, 3 ou 4 filhos).',
    stem: 'Implemente contarQuatroNos(), que retorna quantos nos da arvore sao 4-nos (tem as 3 chaves preenchidas).',
    scaffold: `class No234 {
  int[] chaves = new int[3];
  int qtdChaves;
  No234[] filhos = new No234[4];
}
class Arvore234 {
  private No234 raiz;

  public int contarQuatroNos() {
    // implementar
  }

  private int contarQuatroNos(No234 i) {
    // implementar
  }
}`,
    visual: visual('tree234', 'Conta 1 por 4-no, soma os filhos', 'O numero de filhos de um no e sempre qtdChaves + 1.', ['qtdChaves == 3 ?', '+ 1', 'soma todos os filhos']),
    step: functionStep({
      id: 'code-prova3-arvore234-contar-quatro-nos-step',
      prompt: 'Escreva o metodo publico e o auxiliar privado de contarQuatroNos.',
      signature: 'public int contarQuatroNos()',
      solution: `public int contarQuatroNos() {
  return contarQuatroNos(raiz);
}
private int contarQuatroNos(No234 i) {
  int resp = 0;
  if (i != null) {
    resp = (i.qtdChaves == 3) ? 1 : 0;
    for (int f = 0; f <= i.qtdChaves; f++) {
      resp += contarQuatroNos(i.filhos[f]);
    }
  }
  return resp;
}`,
      requiredFragments: [
        req('base', 'arvore/subarvore vazia conta 0', 'int resp = 0;'),
        req('check', 'conta 1 so se for 4-no (3 chaves)', '(i.qtdChaves == 3) ? 1 : 0'),
        req('children-range', 'visita TODOS os filhos: sao qtdChaves + 1', 'for (int f = 0; f <= i.qtdChaves; f++)'),
        req('recurse', 'soma a contagem de cada filho', 'contarQuatroNos(i.filhos[f])'),
      ],
      lineExplanations: [{ code: 'for (int f = 0; f <= i.qtdChaves; f++)', note: 'Um no com qtdChaves chaves sempre tem qtdChaves + 1 filhos — por isso o laco vai ate <= qtdChaves, nao <.' }],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(n): visita cada no da arvore exatamente uma vez, com trabalho O(1) por no.',
    }),
  },
  {
    id: 'code-prova3-arvore234-complexidade',
    domainId: 'avl',
    moduleId: 'arvore234',
    title: 'Complexidade da arvore 2.3.4',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova3-arvore234',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'justify',
    goal: 'Fixar por que a arvore 2.3.4 nunca degenera, ja que todas as folhas ficam no mesmo nivel.',
    stem: 'Todas as folhas de uma arvore 2.3.4 ficam sempre no mesmo nivel, e cada no tem entre 2 e 4 filhos.',
    scaffold: `// diferente de uma ABB comum, uma arvore 2.3.4 nunca fica desbalanceada: todas as folhas estao no mesmo nivel`,
    visual: visual('tree234', 'Altura sempre Theta(log n)', 'Nos com 2 a 4 filhos e folhas no mesmo nivel garantem altura logaritmica.', ['2 a 4 filhos por no', 'folhas no mesmo nivel']),
    step: gapStep({
      id: 'code-prova3-arvore234-complexidade-step',
      prompt: 'Digite a complexidade Theta garantida de pesquisar numa arvore 2.3.4 com n elementos, no pior caso.',
      answers: ['Theta(log n)', 'O(log n)'],
      mistakeTag: 'wrong-case-analysis',
      explanation: 'Como todas as folhas ficam no mesmo nivel e cada no tem entre 2 e 4 filhos, a altura da arvore e sempre Theta(log n), garantindo pesquisa Theta(log n) no pior caso.',
    }),
  },
  {
    id: 'code-prova3-arvore234-proativo-reativo',
    domainId: 'avl',
    moduleId: 'arvore234',
    title: 'Fragmentacao: pro-ativa ou reativa?',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova3-arvore234',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'recognize',
    goal: 'Diferenciar as duas tecnicas de insercao da arvore 2.3.4 pelo momento em que fragmentam um 4-no.',
    stem:
      'A insercao com fragmentacao por ascensao so fragmenta um 4-no quando a insercao realmente cai nele (depois do fato). A insercao com fragmentacao na descida fragmenta todo 4-no encontrado no caminho, antes mesmo de saber se vai precisar.',
    scaffold: `// ascensao = espera o 4-no dar problema; descida = fragmenta qualquer 4-no do caminho, so por precaucao`,
    visual: visual('tree234', 'Reativa vs pro-ativa', 'Ascensao reage ao problema; descida se antecipa a ele.', ['ascensao: fragmenta so quem precisa', 'descida: fragmenta todo 4-no do caminho']),
    step: choiceStep({
      id: 'code-prova3-arvore234-proativo-reativo-step',
      prompt: 'Qual das duas tecnicas de insercao e classificada como PRO-ATIVA (se antecipa ao problema antes que ele aconteca)?',
      correctOptionId: 'descida',
      options: [
        { id: 'descida', label: 'Fragmentacao na descida' },
        { id: 'ascensao', label: 'Fragmentacao por ascensao', mistakeTag: 'algorithm-confusion' },
        { id: 'nenhuma', label: 'Nenhuma das duas, ambas sao reativas', mistakeTag: 'algorithm-confusion' },
      ],
      explanation:
        'A fragmentacao na descida fragmenta qualquer 4-no encontrado no caminho ANTES de precisar, evitando o problema antes que aconteca (tecnica pro-ativa); a por ascensao so fragmenta reagindo a insercao que efetivamente caiu num 4-no (tecnica reativa).',
    }),
  },
  {
    id: 'code-prova3-patricia-contar-as',
    domainId: 'trie',
    moduleId: 'patricia',
    title: 'PATRICIA: contar letras A nos rotulos',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova3-patricia',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Praticar o modelo oficial de rotulo por intervalo (i, j, k) antes de partir pra pesquisa.',
    stem:
      'Cada no guarda um intervalo (i, j, k): o rotulo do no e array[i].substring(j, k+1). Implemente contarAs(), que soma quantas letras "A" aparecem em TODOS os rotulos da arvore (visita cada no uma vez).',
    scaffold: `class NoPatricia {
  int i, j, k;
  NoPatricia[] prox = new NoPatricia[256];
  boolean folha;
}
class Patricia {
  private NoPatricia raiz;
  private String[] array;

  private String rotulo(NoPatricia no) {
    return (no == raiz) ? "" : array[no.i].substring(no.j, no.k + 1);
  }

  public int contarAs() {
    // implementar
  }
}`,
    visual: visual('patricia', 'Rotulo = intervalo (i, j, k)', 'array[i].substring(j, k+1) reconstroi o pedaco de string guardado no no.', ['rotulo(no)', "conta 'A'", 'soma dos filhos']),
    step: functionStep({
      id: 'code-prova3-patricia-contar-as-step',
      prompt: 'Escreva o metodo publico e o auxiliar privado de contarAs.',
      signature: 'public int contarAs()',
      solution: `public int contarAs() {
  return contarAs(raiz);
}
private int contarAs(NoPatricia no) {
  int resp = 0;
  String palavra = rotulo(no);
  for (int c = 0; c < palavra.length(); c++) {
    if (palavra.charAt(c) == 'A') {
      resp++;
    }
  }
  if (!no.folha) {
    for (int f = 0; f < no.prox.length; f++) {
      if (no.prox[f] != null) {
        resp += contarAs(no.prox[f]);
      }
    }
  }
  return resp;
}`,
      requiredFragments: [
        req('label', 'reconstroi o rotulo do no pelo intervalo (i, j, k)', 'String palavra = rotulo(no);'),
        req('count', 'conta as letras A do rotulo', "palavra.charAt(c) == 'A'"),
        req('children', 'visita os filhos existentes', 'no.prox[f] != null'),
      ],
      lineExplanations: [
        { code: 'String palavra = rotulo(no);', note: 'Cada no NAO guarda a palavra inteira, so o intervalo (i, j, k) — rotulo() reconstroi o pedaco de texto a partir do vetor original de palavras.' },
      ],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(s): s e o numero de nos da PATRICIA (proporcional ao numero de palavras da colecao, nao ao tamanho delas).',
    }),
  },
  {
    id: 'code-prova3-patricia-pesquisar',
    domainId: 'trie',
    moduleId: 'patricia',
    title: 'PATRICIA: pesquisar por segmentos comprimidos',
    source: 'prova1',
    difficulty: 'avancado',
    repetitionGroup: 'prova3-patricia',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Implementar a pesquisa oficial da PATRICIA, comparando a string de consulta contra o rotulo comprimido de cada no.',
    stem:
      'Implemente boolean pesquisar(String s): desce pela arvore comparando s com o rotulo de cada filho; so retorna true se consumir TODA a string s e o no onde parou for folha.',
    scaffold: `class NoPatricia {
  int i, j, k;
  NoPatricia[] prox = new NoPatricia[256];
  boolean folha;
}
class Patricia {
  private NoPatricia raiz;
  private String[] array;

  private String rotulo(NoPatricia no) {
    return (no == raiz) ? "" : array[no.i].substring(no.j, no.k + 1);
  }

  public boolean pesquisar(String s) {
    // implementar
  }

  private boolean pesquisar(NoPatricia no, String s, int pos) {
    // implementar
  }
}`,
    visual: visual('patricia', 'Compara contra o rotulo, nao letra a letra na raiz', 'Cada nivel consome um pedaco (rotulo) inteiro de s, nao so um caractere.', ['prox[s.charAt(pos)]', 'compara rotulo x resto de s', 'sobrou tudo + folha?']),
    step: functionStep({
      id: 'code-prova3-patricia-pesquisar-step',
      prompt: 'Escreva o metodo publico e o auxiliar privado de pesquisar.',
      signature: 'public boolean pesquisar(String s)',
      solution: `public boolean pesquisar(String s) {
  return pesquisar(raiz, s, 0);
}
private boolean pesquisar(NoPatricia no, String s, int pos) {
  boolean resp;
  if (no.prox[s.charAt(pos)] == null) {
    resp = false;
  } else {
    String rot = rotulo(no.prox[s.charAt(pos)]);
    int a, b;
    for (a = 0, b = pos; a < rot.length() && b < s.length() && rot.charAt(a) == s.charAt(b); a++, b++);
    if (b == s.length()) {
      resp = (a == rot.length()) && no.prox[s.charAt(pos)].folha;
    } else {
      resp = pesquisar(no.prox[s.charAt(pos)], s, b);
    }
  }
  return resp;
}`,
      requiredFragments: [
        req('missing-child', 'sem filho pro proximo caractere: nao existe', 'if (no.prox[s.charAt(pos)] == null)'),
        req('compare', 'compara o rotulo do filho contra o resto de s, caractere a caractere', 'rot.charAt(a) == s.charAt(b)'),
        req('exhausted-s', 'so decide quando s acabou', 'if (b == s.length())'),
        req('full-match-leaf', 'precisa ter consumido o rotulo INTEIRO e o no ser folha', '(a == rot.length()) && no.prox[s.charAt(pos)].folha'),
        req('descend', 'se sobrou string, desce mais um nivel', 'resp = pesquisar(no.prox[s.charAt(pos)], s, b);'),
      ],
      lineExplanations: [
        {
          code: '(a == rot.length()) && no.prox[s.charAt(pos)].folha',
          note: 'Duas condicoes obrigatorias: bater o rotulo TODO (senao "sap" pesquisando "sapo" pareceria achar) e o no ser realmente uma folha (fim de palavra), nao so um no intermediario.',
        },
      ],
      mistakeTag: 'incomplete-layer-search',
      explanation: 'Custo Theta(m): m e o tamanho da string s pesquisada — cada caractere de s e comparado no maximo uma vez ao longo de toda a descida, gracas aos rotulos comprimidos.',
    }),
  },
  {
    id: 'code-prova3-patricia-complexidade',
    domainId: 'trie',
    moduleId: 'patricia',
    title: 'Complexidade da pesquisa na PATRICIA',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova3-patricia',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'justify',
    goal: 'Fixar que o custo da PATRICIA depende do tamanho da string pesquisada, nao do numero de palavras guardadas.',
    stem: 'Cada nivel da PATRICIA consome um pedaco (rotulo) inteiro da string pesquisada de uma vez, nunca revisitando o mesmo caractere duas vezes.',
    scaffold: `// cada caractere da string pesquisada e comparado no maximo uma vez, nao importa quantas palavras existam na arvore`,
    visual: visual('patricia', 'Custo depende do tamanho da consulta', 'Nao depende de quantas palavras existem na PATRICIA, so do tamanho da string pesquisada.', ['m = tamanho de s']),
    step: gapStep({
      id: 'code-prova3-patricia-complexidade-step',
      prompt: 'Digite a complexidade Theta de pesquisar(s), em funcao de m (o tamanho da string s pesquisada).',
      answers: ['Theta(m)', 'O(m)'],
      mistakeTag: 'wrong-case-analysis',
      explanation: 'Cada caractere de s e comparado no maximo uma vez ao longo da descida (os rotulos comprimidos evitam revisitar caracteres), dando Theta(m), independente do numero de palavras guardadas.',
    }),
  },
];
