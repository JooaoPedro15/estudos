import type { CodeDrill, FunctionRequirement, FunctionStep, GapStep, StructureVisual } from '../types/content';

/**
 * Exercicios novos de treino de codigo pra Prova 3 (u06-u08): comeca pela
 * arvore alvinegra, que estava rasa (so 3 exercicios, todos sobre validar
 * invariantes de cor — faltava a base: pesquisar, caminhar, contar).
 * Classes copiadas do material oficial em
 * materiais/Codigos/u06 Balanceamento de arvores/java/alvinegra.
 *
 * Arvore 2-3-4 e PATRICIA ficam de fora desta rodada: nao ha classe
 * oficial completa de Arvore 2-3-4 no material (so o No234 usado na lista
 * de exercicios), e a PATRICIA oficial usa uma representacao bem
 * diferente (indices i/j/k sobre um array de 255 posicoes) da que ja
 * esta no app (rotulo em String) — melhor tratar cada uma em um lote
 * proprio depois, com mais tempo pra verificar direito.
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
];
