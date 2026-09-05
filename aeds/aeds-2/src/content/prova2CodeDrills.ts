import type { CodeDrill, FunctionRequirement, FunctionStep, GapStep, StructureVisual } from '../types/content';

/**
 * Exercicios novos de treino de codigo pra Prova 2 (u04-u05): matriz
 * encadeada e arvore binaria de pesquisa (ABB) basica, sem balanceamento.
 * Classes copiadas dos materiais oficiais em materiais/Codigos/u04/matriz
 * e u05/arvoreBinaria/java (ver docs/prova2-format.md). A matriz oficial
 * (Matriz.java) e um esqueleto do proprio professor com metodos vazios
 * (isQuadrada, mostrarDiagonalPrincipal); os exercicios abaixo pedem
 * exatamente esses metodos, ja que sao os que o material oficial aponta
 * como o que falta implementar. lista/fila/pilha ja ganharam bastante
 * conteudo novo no lote da Prova 1 (moduleIds compartilhados entre P1 e
 * P2) — aqui o foco e so o que era exclusivo de P2 e continuava raso.
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

export const prova2CodeDrillCatalog: CodeDrill[] = [
  // ---------------------------------------------------------------------
  // MATRIZ ENCADEADA (u04) — celulas ligadas por sup/inf/esq/dir
  // ---------------------------------------------------------------------
  {
    id: 'code-prova2-matriz-quadrada',
    domainId: 'vetores',
    moduleId: 'matriz',
    title: 'Matriz: isQuadrada',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova2-matriz',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Metodo mais simples possivel pra comecar a treinar a classe.',
    stem: 'Implemente isQuadrada(), que retorna se a matriz tem o mesmo numero de linhas e colunas.',
    scaffold: `class Celula { int elemento; Celula sup, inf, esq, dir; }
class Matriz {
  private Celula inicio;
  private int linhas, colunas;

  public boolean isQuadrada() {
    // implementar
  }
}`,
    visual: visual('matrix', 'Linhas x colunas', 'So compara as duas dimensoes guardadas na matriz.', ['linhas', 'colunas']),
    step: functionStep({
      id: 'code-prova2-matriz-quadrada-step',
      prompt: 'Escreva o corpo de isQuadrada().',
      signature: 'public boolean isQuadrada()',
      solution: `public boolean isQuadrada() {
  return linhas == colunas;
}`,
      requiredFragments: [req('compare', 'compara linhas e colunas', 'return linhas == colunas;')],
      lineExplanations: [{ code: 'return linhas == colunas;', note: 'A matriz ja guarda as duas dimensoes; nao precisa percorrer nada.' }],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(1): so compara dois campos inteiros.',
    }),
  },
  {
    id: 'code-prova2-matriz-mostrar-linha',
    domainId: 'vetores',
    moduleId: 'matriz',
    title: 'Matriz: mostrar a primeira linha',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova2-matriz',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Praticar a navegacao mais simples da matriz: andar so por dir.',
    stem: 'Implemente mostrarLinha(), que imprime os elementos da primeira linha, a partir de inicio, andando por dir.',
    scaffold: `class Celula { int elemento; Celula sup, inf, esq, dir; }
class Matriz {
  private Celula inicio;
  private int linhas, colunas;

  public void mostrarLinha() {
    // implementar
  }
}`,
    visual: visual('matrix', 'Andar pra direita', 'inicio e o canto superior esquerdo; dir avanca na mesma linha.', ['inicio', 'dir', 'dir', 'dir']),
    step: functionStep({
      id: 'code-prova2-matriz-mostrar-linha-step',
      prompt: 'Escreva o corpo de mostrarLinha().',
      signature: 'public void mostrarLinha()',
      solution: `public void mostrarLinha() {
  System.out.print("[ ");
  for (Celula i = inicio; i != null; i = i.dir) {
    System.out.print(i.elemento + " ");
  }
  System.out.println("]");
}`,
      requiredFragments: [req('loop', 'anda por dir a partir de inicio', 'for (Celula i = inicio; i != null; i = i.dir)')],
      lineExplanations: [{ code: 'for (Celula i = inicio; i != null; i = i.dir)', note: 'A ultima celula da linha tem dir == null, encerrando o laco.' }],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(colunas): percorre so uma linha.',
    }),
  },
  {
    id: 'code-prova2-matriz-diagonal-principal',
    domainId: 'vetores',
    moduleId: 'matriz',
    title: 'Matriz: mostrar diagonal principal',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova2-matriz',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Combinar dir e inf pra andar na diagonal em vez de na linha.',
    stem: 'Implemente mostrarDiagonalPrincipal() (assuma matriz quadrada): imprime os elementos da diagonal principal, de inicio ate o canto inferior direito.',
    scaffold: `class Celula { int elemento; Celula sup, inf, esq, dir; }
class Matriz {
  private Celula inicio;
  private int linhas, colunas;

  public void mostrarDiagonalPrincipal() {
    // implementar
  }
}`,
    visual: visual('matrix', 'Um passo na diagonal = dir + inf', 'Andar uma casa na diagonal e andar uma pra direita e uma pra baixo.', ['inicio', 'dir->inf', 'dir->inf']),
    step: functionStep({
      id: 'code-prova2-matriz-diagonal-principal-step',
      prompt: 'Escreva o corpo de mostrarDiagonalPrincipal().',
      signature: 'public void mostrarDiagonalPrincipal()',
      solution: `public void mostrarDiagonalPrincipal() {
  System.out.print("[ ");
  Celula i = inicio;
  while (i != null) {
    System.out.print(i.elemento + " ");
    i = (i.dir != null) ? i.dir.inf : null;
  }
  System.out.println("]");
}`,
      requiredFragments: [
        req('step', 'anda uma casa na diagonal', 'i = (i.dir != null) ? i.dir.inf : null;'),
      ],
      lineExplanations: [{ code: 'i = (i.dir != null) ? i.dir.inf : null;', note: 'So da pra andar em diagonal combinando dois passos: um dir, depois um inf.' }],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(min(linhas, colunas)), que numa matriz quadrada e Theta(linhas).',
    }),
  },
  {
    id: 'code-prova2-matriz-soma-diagonal',
    domainId: 'vetores',
    moduleId: 'matriz',
    title: 'Matriz: somar diagonal principal',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova2-matriz',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Reaproveitar a navegacao da diagonal pra calcular algo, nao so imprimir.',
    stem: 'Implemente somaDiagonalPrincipal() (assuma matriz quadrada), que retorna a soma dos elementos da diagonal principal.',
    scaffold: `class Celula { int elemento; Celula sup, inf, esq, dir; }
class Matriz {
  private Celula inicio;
  private int linhas, colunas;

  public int somaDiagonalPrincipal() {
    // implementar
  }
}`,
    visual: visual('matrix', 'Acumular na diagonal', 'Mesma navegacao de mostrarDiagonalPrincipal, agora somando.', ['soma += elemento']),
    step: functionStep({
      id: 'code-prova2-matriz-soma-diagonal-step',
      prompt: 'Escreva o corpo de somaDiagonalPrincipal().',
      signature: 'public int somaDiagonalPrincipal()',
      solution: `public int somaDiagonalPrincipal() {
  int soma = 0;
  Celula i = inicio;
  while (i != null) {
    soma += i.elemento;
    i = (i.dir != null) ? i.dir.inf : null;
  }
  return soma;
}`,
      requiredFragments: [
        req('accumulate', 'acumula o elemento atual', 'soma += i.elemento;'),
        req('step', 'anda uma casa na diagonal', 'i = (i.dir != null) ? i.dir.inf : null;'),
      ],
      lineExplanations: [{ code: 'soma += i.elemento;', note: 'A navegacao e igual a de mostrarDiagonalPrincipal — so troca o print por uma soma.' }],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(linhas) numa matriz quadrada.',
    }),
  },
  {
    id: 'code-prova2-matriz-contar-maiores',
    domainId: 'vetores',
    moduleId: 'matriz',
    title: 'Matriz: contar elementos maiores que x',
    source: 'prova1',
    difficulty: 'avancado',
    repetitionGroup: 'prova2-matriz',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Combinar dois lacos (linhas e colunas) pra percorrer a matriz inteira.',
    stem: 'Implemente contarMaiores(x), que retorna quantos elementos da matriz inteira sao maiores que x, percorrendo linha por linha (inf) e, em cada linha, coluna por coluna (dir).',
    scaffold: `class Celula { int elemento; Celula sup, inf, esq, dir; }
class Matriz {
  private Celula inicio;
  private int linhas, colunas;

  public int contarMaiores(int x) {
    // implementar
  }
}`,
    visual: visual('matrix', 'Duas dimensoes de navegacao', 'Laco externo desce (inf); laco interno anda na linha (dir).', ['inicio', 'inf', 'inf']),
    step: functionStep({
      id: 'code-prova2-matriz-contar-maiores-step',
      prompt: 'Escreva o corpo de contarMaiores(x).',
      signature: 'public int contarMaiores(int x)',
      solution: `public int contarMaiores(int x) {
  int total = 0;
  for (Celula linha = inicio; linha != null; linha = linha.inf) {
    for (Celula col = linha; col != null; col = col.dir) {
      if (col.elemento > x) {
        total++;
      }
    }
  }
  return total;
}`,
      requiredFragments: [
        req('outer', 'laco externo desce pelas linhas', 'for (Celula linha = inicio; linha != null; linha = linha.inf)'),
        req('inner', 'laco interno anda na linha atual', 'for (Celula col = linha; col != null; col = col.dir)'),
        req('count', 'conta quando maior que x', 'if (col.elemento > x)'),
      ],
      lineExplanations: [{ code: 'for (Celula col = linha; col != null; col = col.dir)', note: 'col comeca em linha (a primeira celula daquela linha), nao em inicio.' }],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(linhas * colunas): visita cada celula da matriz exatamente uma vez.',
    }),
  },
  {
    id: 'code-prova2-matriz-complexidade',
    domainId: 'vetores',
    moduleId: 'matriz',
    title: 'Complexidade da matriz encadeada',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova2-matriz',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'justify',
    goal: 'Fixar que percorrer a matriz inteira depende das duas dimensoes.',
    stem: 'contarMaiores(x) visita cada celula da matriz exatamente uma vez, seja qual for o valor de x.',
    scaffold: `// dois lacos aninhados, um por linha e um por coluna dentro de cada linha`,
    visual: visual('matrix', 'Visita cada celula uma vez', 'O total de celulas e linhas vezes colunas.', ['linhas * colunas']),
    step: gapStep({
      id: 'code-prova2-matriz-complexidade-step',
      prompt: 'Digite a complexidade Theta de percorrer a matriz inteira, em funcao do numero total de elementos n (n = linhas * colunas).',
      answers: ['Theta(n)', 'O(n)'],
      mistakeTag: 'wrong-case-analysis',
      explanation: 'Cada celula e visitada exatamente uma vez, entao o custo e proporcional ao numero total de elementos: Theta(n).',
    }),
  },

  // ---------------------------------------------------------------------
  // ARVORE BINARIA DE PESQUISA (u05) — sem balanceamento
  // ---------------------------------------------------------------------
  {
    id: 'code-prova2-arvore-inserir',
    domainId: 'arvore',
    title: 'Arvore: inserir (ABB)',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova2-arvore',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Praticar o metodo mais basico e mais cobrado de arvore ate virar automatico.',
    stem: 'Implemente inserir(x): o metodo publico chama o auxiliar privado recursivo, que retorna o no (novo ou alterado) pra religar na arvore.',
    scaffold: `class No {
  int elemento;
  No esq, dir;
  public No(int elemento) { this.elemento = elemento; }
}
class Arvore {
  private No raiz;

  public void inserir(int x) throws Exception {
    // implementar
  }

  private No inserir(int x, No i) throws Exception {
    // implementar
  }
}`,
    visual: visual('binary-tree', 'Insercao por comparacao', 'Desce comparando com cada no ate achar um espaco vazio (null).', ['raiz', 'esq/dir', 'null']),
    step: functionStep({
      id: 'code-prova2-arvore-inserir-step',
      prompt: 'Escreva o metodo publico e o auxiliar privado de inserir.',
      signature: 'public void inserir(int x)',
      solution: `public void inserir(int x) throws Exception {
  raiz = inserir(x, raiz);
}
private No inserir(int x, No i) throws Exception {
  if (i == null) {
    i = new No(x);
  } else if (x < i.elemento) {
    i.esq = inserir(x, i.esq);
  } else if (x > i.elemento) {
    i.dir = inserir(x, i.dir);
  } else {
    throw new Exception("Erro ao inserir!");
  }
  return i;
}`,
      requiredFragments: [
        req('public-call', 'publico religa o retorno na raiz', 'raiz = inserir(x, raiz);'),
        req('base', 'caso base: cria o novo no', 'if (i == null)'),
        req('left', 'desce a esquerda', 'i.esq = inserir(x, i.esq);'),
        req('right', 'desce a direita', 'i.dir = inserir(x, i.dir);'),
        req('duplicate', 'nao permite repetido', 'throw new Exception("Erro ao inserir!");'),
      ],
      lineExplanations: [
        { code: 'raiz = inserir(x, raiz);', note: 'O retorno da recursao sempre religa o no (novo ou o mesmo) no lugar certo.' },
      ],
      mistakeTag: 'missing-base-case',
      explanation: 'Custo Theta(altura): melhor caso Theta(log n) numa arvore balanceada, pior caso Theta(n) se degenerar numa lista.',
    }),
  },
  {
    id: 'code-prova2-arvore-pesquisar',
    domainId: 'arvore',
    title: 'Arvore: pesquisar (ABB)',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova2-arvore',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Praticar a busca por comparacao ate virar automatico.',
    stem: 'Implemente pesquisar(x), usando a propriedade de ABB pra descartar metade da arvore a cada passo.',
    scaffold: `class No { int elemento; No esq, dir; }
class Arvore {
  private No raiz;

  public boolean pesquisar(int x) {
    // implementar
  }

  private boolean pesquisar(int x, No i) {
    // implementar
  }
}`,
    visual: visual('binary-tree', 'Busca por comparacao', 'x menor desce a esquerda; x maior desce a direita.', ['raiz', 'esq ou dir', 'achou ou null']),
    step: functionStep({
      id: 'code-prova2-arvore-pesquisar-step',
      prompt: 'Escreva o metodo publico e o auxiliar privado de pesquisar.',
      signature: 'public boolean pesquisar(int x)',
      solution: `public boolean pesquisar(int x) {
  return pesquisar(x, raiz);
}
private boolean pesquisar(int x, No i) {
  boolean resp;
  if (i == null) {
    resp = false;
  } else if (x == i.elemento) {
    resp = true;
  } else if (x < i.elemento) {
    resp = pesquisar(x, i.esq);
  } else {
    resp = pesquisar(x, i.dir);
  }
  return resp;
}`,
      requiredFragments: [
        req('base', 'nao achou: chegou num null', 'resp = false;'),
        req('found', 'achou: elemento igual', 'resp = true;'),
        req('left', 'desce a esquerda se menor', 'resp = pesquisar(x, i.esq);'),
        req('right', 'desce a direita caso contrario', 'resp = pesquisar(x, i.dir);'),
      ],
      lineExplanations: [{ code: 'x < i.elemento', note: 'So funciona por causa da propriedade de ABB: tudo a esquerda e menor, tudo a direita e maior.' }],
      mistakeTag: 'missing-base-case',
      explanation: 'Custo Theta(altura), igual a insercao: log n balanceada, n no pior caso.',
    }),
  },
  {
    id: 'code-prova2-arvore-caminhar-central',
    domainId: 'arvore',
    title: 'Arvore: caminhamento central (em ordem)',
    source: 'prova1',
    difficulty: 'basico',
    repetitionGroup: 'prova2-arvore',
    phase: 'repeat',
    format: 'code-repetition',
    skillId: 'program',
    goal: 'Praticar o caminhamento que sai em ordem crescente, ate virar automatico.',
    stem: 'Implemente o caminhamento central (esquerda, raiz, direita), que numa ABB imprime os elementos em ordem crescente.',
    scaffold: `class No { int elemento; No esq, dir; }
class Arvore {
  private No raiz;

  public void caminharCentral() {
    // implementar
  }

  private void caminharCentral(No i) {
    // implementar
  }
}`,
    visual: visual('binary-tree', 'Esquerda, raiz, direita', 'Numa ABB, esse caminhamento sempre sai em ordem crescente.', ['esq', 'raiz', 'dir']),
    step: functionStep({
      id: 'code-prova2-arvore-caminhar-central-step',
      prompt: 'Escreva o metodo publico e o auxiliar privado de caminharCentral.',
      signature: 'public void caminharCentral()',
      solution: `public void caminharCentral() {
  System.out.print("[ ");
  caminharCentral(raiz);
  System.out.println("]");
}
private void caminharCentral(No i) {
  if (i != null) {
    caminharCentral(i.esq);
    System.out.print(i.elemento + " ");
    caminharCentral(i.dir);
  }
}`,
      requiredFragments: [
        req('base', 'para em subarvore vazia', 'if (i != null)'),
        req('left', 'visita a esquerda primeiro', 'caminharCentral(i.esq);'),
        req('print', 'imprime o no atual no meio', 'System.out.print(i.elemento + " ");'),
        req('right', 'visita a direita por ultimo', 'caminharCentral(i.dir);'),
      ],
      lineExplanations: [{ code: 'caminharCentral(i.esq);\n    System.out.print(i.elemento + " ");\n    caminharCentral(i.dir);', note: 'A ordem esquerda-raiz-direita e o que garante a saida crescente numa ABB.' }],
      mistakeTag: 'missing-base-case',
      explanation: 'Custo Theta(n): visita cada no exatamente uma vez, nao importa a forma da arvore.',
    }),
  },
  {
    id: 'code-prova2-arvore-altura',
    domainId: 'arvore',
    title: 'Arvore: altura',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova2-arvore',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Combinar recursao nos dois lados com uma comparacao.',
    stem: 'Implemente getAltura() (arvore vazia tem altura -1; um unico no tem altura 0).',
    scaffold: `class No { int elemento; No esq, dir; }
class Arvore {
  private No raiz;

  public int getAltura() {
    // implementar
  }

  private int getAltura(No i) {
    // implementar
  }
}`,
    visual: visual('binary-tree', 'Maior dos dois lados, mais 1', 'Altura = 1 + maior altura entre esquerda e direita.', ['esq: altura', 'dir: altura', '+1']),
    step: functionStep({
      id: 'code-prova2-arvore-altura-step',
      prompt: 'Escreva o metodo publico e o auxiliar privado de getAltura.',
      signature: 'public int getAltura()',
      solution: `public int getAltura() {
  return getAltura(raiz);
}
private int getAltura(No i) {
  int resp = -1;
  if (i != null) {
    int alturaEsq = getAltura(i.esq);
    int alturaDir = getAltura(i.dir);
    resp = 1 + ((alturaEsq > alturaDir) ? alturaEsq : alturaDir);
  }
  return resp;
}`,
      requiredFragments: [
        req('base', 'arvore vazia tem altura -1', 'int resp = -1;'),
        req('left', 'altura da subarvore esquerda', 'int alturaEsq = getAltura(i.esq);'),
        req('right', 'altura da subarvore direita', 'int alturaDir = getAltura(i.dir);'),
        req('combine', 'maior altura mais 1', 'resp = 1 + ((alturaEsq > alturaDir) ? alturaEsq : alturaDir);'),
      ],
      lineExplanations: [{ code: 'int resp = -1;', note: 'Convencao: arvore vazia tem altura -1, entao um no folha (dois filhos vazios) da altura 0.' }],
      mistakeTag: 'missing-base-case',
      explanation: 'Custo Theta(n): visita todo mundo, porque precisa comparar as duas subarvores em cada no.',
    }),
  },
  {
    id: 'code-prova2-arvore-maior-menor',
    domainId: 'arvore',
    title: 'Arvore: maior e menor elemento',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova2-arvore',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Usar a propriedade de ABB pra achar extremos sem comparar tudo.',
    stem: 'Implemente getMaior() e getMenor(), retornando -1 se a arvore estiver vazia. Use a propriedade de ABB: o maior fica todo a direita, o menor todo a esquerda.',
    scaffold: `class No { int elemento; No esq, dir; }
class Arvore {
  private No raiz;

  public int getMaior() {
    // implementar
  }

  public int getMenor() {
    // implementar
  }
}`,
    visual: visual('binary-tree', 'So descer de um lado', 'O maior esta sempre no fim do caminho todo-direita.', ['raiz', 'dir', 'dir', 'maior']),
    step: functionStep({
      id: 'code-prova2-arvore-maior-menor-step',
      prompt: 'Escreva o corpo de getMaior() e getMenor().',
      signature: 'public int getMaior()',
      solution: `public int getMaior() {
  int resp = -1;
  if (raiz != null) {
    No i;
    for (i = raiz; i.dir != null; i = i.dir);
    resp = i.elemento;
  }
  return resp;
}
public int getMenor() {
  int resp = -1;
  if (raiz != null) {
    No i;
    for (i = raiz; i.esq != null; i = i.esq);
    resp = i.elemento;
  }
  return resp;
}`,
      requiredFragments: [
        req('empty', 'trata arvore vazia', 'if (raiz != null)'),
        req('right', 'maior: desce so a direita', 'for (i = raiz; i.dir != null; i = i.dir);'),
        req('left', 'menor: desce so a esquerda', 'for (i = raiz; i.esq != null; i = i.esq);'),
      ],
      lineExplanations: [{ code: 'for (i = raiz; i.dir != null; i = i.dir);', note: 'Nao precisa comparar elementos: a propriedade de ABB garante que descer so a direita chega no maior.' }],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(altura): so desce por um caminho, nao visita a arvore inteira.',
    }),
  },
  {
    id: 'code-prova2-arvore-remover',
    domainId: 'arvore',
    title: 'Arvore: remover (ABB)',
    source: 'prova1',
    difficulty: 'desafio',
    repetitionGroup: 'prova2-arvore',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Aplicar o padrao classico de remocao em ABB: substituir pelo maior da subarvore esquerda.',
    stem:
      'maiorEsq ja esta pronto (troca o elemento removido pelo maior da subarvore esquerda). Implemente remover(x, i): trata os 3 casos (sem filho a direita, sem filho a esquerda, com os dois).',
    scaffold: `class No { int elemento; No esq, dir; }
class Arvore {
  private No raiz;

  public void remover(int x) throws Exception {
    raiz = remover(x, raiz);
  }

  private No remover(int x, No i) throws Exception {
    // implementar
  }

  private No maiorEsq(No i, No j) {
    if (j.dir == null) {
      i.elemento = j.elemento;
      j = j.esq;
    } else {
      j.dir = maiorEsq(i, j.dir);
    }
    return j;
  }
}`,
    visual: visual('binary-tree', 'Tres casos de remocao', 'Sem filho a direita, sem filho a esquerda, ou com os dois (usa maiorEsq).', ['sem dir', 'sem esq', 'com os dois']),
    step: functionStep({
      id: 'code-prova2-arvore-remover-step',
      prompt: 'Escreva o corpo de remover(x, i).',
      signature: 'private No remover(int x, No i)',
      solution: `private No remover(int x, No i) throws Exception {
  if (i == null) {
    throw new Exception("Erro ao remover!");
  } else if (x < i.elemento) {
    i.esq = remover(x, i.esq);
  } else if (x > i.elemento) {
    i.dir = remover(x, i.dir);
  } else if (i.dir == null) {
    i = i.esq;
  } else if (i.esq == null) {
    i = i.dir;
  } else {
    i.esq = maiorEsq(i, i.esq);
  }
  return i;
}`,
      requiredFragments: [
        req('not-found', 'nao achou o elemento', 'throw new Exception("Erro ao remover!");'),
        req('no-right', 'sem filho a direita: sobe o esquerdo', 'i = i.esq;'),
        req('no-left', 'sem filho a esquerda: sobe o direito', 'i = i.dir;'),
        req('both', 'com os dois: usa maiorEsq', 'i.esq = maiorEsq(i, i.esq);'),
      ],
      lineExplanations: [
        { code: 'i.esq = maiorEsq(i, i.esq);', note: 'Quando o no tem os dois filhos, maiorEsq acha o maior da subarvore esquerda, coloca no lugar do removido e some com o antigo lugar do maior.' },
      ],
      mistakeTag: 'lost-pointer',
      explanation: 'Custo Theta(altura): desce comparando ate achar x, e no caso com dois filhos ainda desce ate o maior da esquerda.',
    }),
  },
  {
    id: 'code-prova2-arvore-contar-repetidos',
    domainId: 'arvore',
    title: 'Arvore: ABB com contagem de repetidos',
    source: 'prova1',
    difficulty: 'avancado',
    repetitionGroup: 'prova2-arvore',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'program',
    goal: 'Adaptar a insercao pra nao ignorar (nem duplicar no) elementos repetidos.',
    stem: 'No ganhou um campo repeticoes. Adapte inserir(x, i): se x ja existe na arvore, incremente repeticoes do no existente em vez de lancar excecao ou criar um no novo.',
    scaffold: `class No {
  int elemento;
  int repeticoes;
  No esq, dir;
  public No(int elemento) {
    this.elemento = elemento;
    this.repeticoes = 1;
  }
}
class Arvore {
  private No raiz;

  public void inserir(int x) {
    raiz = inserir(x, raiz);
  }

  private No inserir(int x, No i) {
    // implementar
  }
}`,
    visual: visual('binary-tree', 'Repetido incrementa, nao duplica', 'Elemento igual ao no atual so soma 1 em repeticoes.', ['x == i.elemento', 'repeticoes++']),
    step: functionStep({
      id: 'code-prova2-arvore-contar-repetidos-step',
      prompt: 'Escreva o corpo de inserir(x, i).',
      signature: 'private No inserir(int x, No i)',
      solution: `private No inserir(int x, No i) {
  if (i == null) {
    i = new No(x);
  } else if (x < i.elemento) {
    i.esq = inserir(x, i.esq);
  } else if (x > i.elemento) {
    i.dir = inserir(x, i.dir);
  } else {
    i.repeticoes++;
  }
  return i;
}`,
      requiredFragments: [
        req('duplicate', 'repetido incrementa em vez de lancar excecao', 'i.repeticoes++;'),
      ],
      lineExplanations: [{ code: 'i.repeticoes++;', note: 'Unica mudanca real em relacao ao inserir classico: o caso "igual" agora conta em vez de dar erro.' }],
      mistakeTag: 'algorithm-confusion',
      explanation: 'Custo Theta(altura), igual ao inserir classico — a mudanca e so no que acontece quando encontra o elemento igual.',
    }),
  },
  {
    id: 'code-prova2-arvore-complexidade',
    domainId: 'arvore',
    title: 'Complexidade da ABB (sem balanceamento)',
    source: 'prova1',
    difficulty: 'intermediario',
    repetitionGroup: 'prova2-arvore',
    phase: 'modify',
    format: 'code-modification',
    skillId: 'justify',
    goal: 'Perceber que ABB sem balanceamento pode degenerar.',
    stem: 'inserir, pesquisar e remover sempre custam Theta(altura da arvore). A altura depende da ORDEM em que os elementos foram inseridos.',
    scaffold: `// inserir 1, 2, 3, 4, 5 em ordem crescente numa ABB sem balanceamento`,
    visual: visual('binary-tree', 'Pior caso: uma lista disfarcada', 'Inserir em ordem crescente cria uma arvore so com filhos a direita.', ['1', '2', '3', '4', '5']),
    step: gapStep({
      id: 'code-prova2-arvore-complexidade-step',
      prompt: 'Digite a complexidade Theta de inserir/pesquisar numa ABB sem balanceamento, no PIOR caso (elementos inseridos ja em ordem).',
      answers: ['Theta(n)', 'O(n)'],
      mistakeTag: 'wrong-case-analysis',
      explanation: 'Inserir em ordem crescente (ou decrescente) faz a ABB degenerar numa "lista" so de filhos a direita (ou esquerda): altura Theta(n), pior caso possivel. Por isso existem AVL e alvinegra, que garantem altura Theta(log n).',
    }),
  },
];
