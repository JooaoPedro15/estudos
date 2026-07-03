import type { CodeDrill, ContentModuleId, DomainId, FunctionRequirement, StructureVisual } from '../types/content';

type Lista2DrillInput = {
  number: number;
  id: string;
  moduleId: ContentModuleId;
  domainId: DomainId;
  title: string;
  difficulty: CodeDrill['difficulty'];
  phase?: CodeDrill['phase'];
  repetitionGroup: string;
  stem: string;
  scaffold: string;
  visual: StructureVisual;
  signature: string;
  solution: string;
  requiredFragments: FunctionRequirement[];
  explanation: string;
};

function req(id: string, label: string, code: string): FunctionRequirement {
  return { id, label, code };
}

function visual(kind: StructureVisual['kind'], title: string, caption: string, labels: string[]): StructureVisual {
  return { kind, title, caption, labels };
}

function drill(input: Lista2DrillInput): CodeDrill {
  return {
    id: input.id,
    domainId: input.domainId,
    moduleId: input.moduleId,
    title: input.title,
    source: 'lista-2',
    difficulty: input.difficulty,
    repetitionGroup: input.repetitionGroup,
    phase: input.phase ?? 'modify',
    format: input.phase === 'repeat' ? 'code-repetition' : 'code-modification',
    skillId: 'program',
    goal: `Resolver a questao ${input.number} da Lista 2 no modulo correto.`,
    stem: input.stem,
    scaffold: input.scaffold,
    visual: input.visual,
    step: {
      id: `${input.id}-step`,
      kind: 'function',
      skillId: 'program',
      prompt: `Escreva a solucao da questao ${input.number} conforme o gabarito comentado.`,
      signature: input.signature,
      solution: input.solution,
      requiredFragments: input.requiredFragments,
      lineExplanations: input.requiredFragments.slice(0, 5).map((fragment) => ({
        code: fragment.code,
        note: fragment.label,
      })),
      mistakeTag: 'wrong-case-analysis',
      explanation: `${input.explanation} Origem: Lista 2.`,
    },
  };
}

export const lista2CodeDrillCatalog: CodeDrill[] = [
  drill({
    number: 45,
    id: 'code-lista2-recursividade-contar-maiusculas',
    moduleId: 'recursividade',
    domainId: 'somatorio',
    title: 'Recursividade: contar maiusculas',
    difficulty: 'basico',
    phase: 'repeat',
    repetitionGroup: 'lista2-q45-contar-maiusculas',
    stem: 'Implemente contarMaiusculas(String s) sem lacos, com metodo publico chamando auxiliar por indice.',
    scaffold: `class Aquecimento {
  public static int contarMaiusculas(String s) {
    // implementar
  }
}`,
    visual: visual('array', 'String por indice', 'Cada caractere e processado uma vez.', ['A', 'e', 'D', 'S']),
    signature: 'public static int contarMaiusculas(String s)',
    solution: `public static int contarMaiusculas(String s) {
  return contarMaiusculas(s, 0);
}
private static int contarMaiusculas(String s, int i) {
  int resp = 0;
  if (i < s.length()) {
    resp = ((s.charAt(i) >= 'A' && s.charAt(i) <= 'Z') ? 1 : 0) + contarMaiusculas(s, i + 1);
  }
  return resp;
}`,
    requiredFragments: [
      req('public-call', 'metodo publico chama auxiliar com indice zero', 'return contarMaiusculas(s, 0);'),
      req('base', 'caso recursivo limitado pelo tamanho', 'if (i < s.length())'),
      req('upper', 'testa faixa A..Z', "s.charAt(i) >= 'A' && s.charAt(i) <= 'Z'"),
      req('advance', 'avanca para i + 1', 'contarMaiusculas(s, i + 1)'),
      req('return', 'retorna acumulado', 'return resp;'),
    ],
    explanation: 'Tempo O(|s|) e pilha O(|s|).',
  }),
  drill({
    number: 47,
    id: 'code-lista2-lista-sequencial-inserir-ordenado',
    moduleId: 'lista',
    domainId: 'vetores',
    title: 'Lista sequencial: inserir ordenado',
    difficulty: 'basico',
    repetitionGroup: 'lista2-q47-lista-sequencial-inserir-ordenado',
    stem: 'Implemente inserirOrdenado(int x) deslocando os elementos maiores e lancando excecao se estiver cheia.',
    scaffold: `class Lista {
  private int[] array;
  private int n;
  public void inserirOrdenado(int x) throws Exception {
    // implementar
  }
}`,
    visual: visual('array', 'Deslocar maiores', 'Abre espaco mantendo o vetor ordenado.', ['2', '5', '8', 'x', 'livre']),
    signature: 'public void inserirOrdenado(int x)',
    solution: `public void inserirOrdenado(int x) throws Exception {
  if (n >= array.length) {
    throw new Exception("Erro ao inserir!");
  }
  int i;
  for (i = n - 1; i >= 0 && array[i] > x; i--) {
    array[i + 1] = array[i];
  }
  array[i + 1] = x;
  n++;
}`,
    requiredFragments: [
      req('full', 'testa lista cheia', 'if (n >= array.length)'),
      req('loop', 'desloca maiores de tras para frente', 'i >= 0 && array[i] > x'),
      req('shift', 'move elemento para direita', 'array[i + 1] = array[i];'),
      req('insert', 'insere na abertura', 'array[i + 1] = x;'),
      req('inc', 'incrementa n', 'n++;'),
    ],
    explanation: 'Pior caso O(n); melhor O(1) quando o elemento entra no fim.',
  }),
  drill({
    number: 48,
    id: 'code-lista2-lista-sequencial-remover-todos',
    moduleId: 'lista',
    domainId: 'vetores',
    title: 'Lista sequencial: remover todas ocorrencias',
    difficulty: 'intermediario',
    repetitionGroup: 'lista2-q48-lista-sequencial-remover-todos',
    stem: 'Remova todas as ocorrencias de x em uma passagem principal, sem vetor auxiliar, retornando quantas foram removidas.',
    scaffold: `class Lista {
  private int[] array;
  private int n;
  public int removerTodos(int x) {
    // implementar
  }
}`,
    visual: visual('array', 'Leitura e escrita', 'Mantem apenas os elementos diferentes de x.', ['leitura', 'escrita', 'x', 'mantem']),
    signature: 'public int removerTodos(int x)',
    solution: `public int removerTodos(int x) {
  int escrita = 0;
  int removidos = 0;
  for (int leitura = 0; leitura < n; leitura++) {
    if (array[leitura] == x) {
      removidos++;
    } else {
      array[escrita++] = array[leitura];
    }
  }
  n = escrita;
  return removidos;
}`,
    requiredFragments: [
      req('write', 'ponteiro de escrita', 'int escrita = 0;'),
      req('removed', 'contador de removidos', 'int removidos = 0;'),
      req('loop', 'uma passagem de leitura', 'leitura < n'),
      req('copy', 'compacta mantendo nao removidos', 'array[escrita++] = array[leitura];'),
      req('n', 'atualiza tamanho final', 'n = escrita;'),
    ],
    explanation: 'Tempo O(n) e espaco O(1).',
  }),
  drill({
    number: 49,
    id: 'code-lista2-fila-circular-soma-recursiva',
    moduleId: 'fila',
    domainId: 'vetores',
    title: 'Fila circular: soma recursiva',
    difficulty: 'intermediario',
    repetitionGroup: 'lista2-q49-fila-circular-soma-recursiva',
    stem: 'Implemente somaRec() sem modificar primeiro e ultimo, tratando o retorno ao inicio por modulo.',
    scaffold: `class Fila {
  private int[] array;
  private int primeiro, ultimo;
  public int somaRec() {
    // implementar
  }
}`,
    visual: visual('queue', 'Fila circular', 'A recursao avanca por modulo ate ultimo.', ['primeiro', '10', '20', 'ultimo']),
    signature: 'public int somaRec()',
    solution: `public int somaRec() {
  return somaRec(primeiro);
}
private int somaRec(int i) {
  int resp = 0;
  if (i != ultimo) {
    resp = array[i] + somaRec((i + 1) % array.length);
  }
  return resp;
}`,
    requiredFragments: [
      req('call', 'publico chama auxiliar no primeiro', 'return somaRec(primeiro);'),
      req('stop', 'para ao chegar em ultimo', 'if (i != ultimo)'),
      req('sum', 'soma posicao atual', 'resp = array[i] + somaRec'),
      req('mod', 'avanca circularmente', '(i + 1) % array.length'),
    ],
    explanation: 'Percorre cada elemento uma vez e preserva os indices da fila.',
  }),
  drill({
    number: 50,
    id: 'code-lista2-pilha-parenteses-balanceados',
    moduleId: 'pilha',
    domainId: 'vetores',
    title: 'Pilha: parenteses balanceados',
    difficulty: 'intermediario',
    repetitionGroup: 'lista2-q50-parenteses-balanceados',
    stem: 'Use uma pilha flexivel de caracteres para validar (), [] e {}, ignorando outros caracteres.',
    scaffold: `class Balanceador {
  public static boolean balanceada(String s) throws Exception {
    // implementar
  }
}`,
    visual: visual('stack', 'Pilha de aberturas', 'Fechamentos precisam casar com o topo.', ['(', '[', '{']),
    signature: 'public static boolean balanceada(String s)',
    solution: `public static boolean balanceada(String s) throws Exception {
  PilhaChar p = new PilhaChar();
  boolean resp = true;
  for (int i = 0; i < s.length() && resp; i++) {
    char c = s.charAt(i);
    if (c == '(' || c == '[' || c == '{') {
      p.inserir(c);
    } else if (c == ')' || c == ']' || c == '}') {
      if (p.vazia()) {
        resp = false;
      } else {
        char a = p.remover();
        resp = (a == '(' && c == ')') || (a == '[' && c == ']') || (a == '{' && c == '}');
      }
    }
  }
  return resp && p.vazia();
}`,
    requiredFragments: [
      req('stack', 'cria pilha de caracteres', 'PilhaChar p = new PilhaChar();'),
      req('open', 'empilha aberturas', "c == '(' || c == '[' || c == '{'"),
      req('close', 'detecta fechamentos', "c == ')' || c == ']' || c == '}'"),
      req('empty', 'falha se fechar com pilha vazia', 'if (p.vazia())'),
      req('final', 'exige pilha vazia no fim', 'return resp && p.vazia();'),
    ],
    explanation: 'Tempo O(n) e espaco O(n).',
  }),
  drill({
    number: 51,
    id: 'code-lista2-pilha-maximo-recursivo',
    moduleId: 'pilha',
    domainId: 'vetores',
    title: 'Pilha flexivel: maximo recursivo',
    difficulty: 'intermediario',
    repetitionGroup: 'lista2-q51-pilha-maximo-recursivo',
    stem: 'Implemente getMax() por recursao, sem remover elementos, lancando excecao se a pilha estiver vazia.',
    scaffold: `class Celula { int elemento; Celula prox; }
class Pilha {
  private Celula topo;
  public int getMax() throws Exception {
    // implementar
  }
}`,
    visual: visual('stack', 'Maximo na pilha', 'Compara o topo com o maior do restante.', ['3', '9', '5']),
    signature: 'public int getMax()',
    solution: `public int getMax() throws Exception {
  if (topo == null) {
    throw new Exception("Pilha vazia!");
  }
  return getMax(topo);
}
private int getMax(Celula i) {
  int resp = i.elemento;
  if (i.prox != null) {
    int maxResto = getMax(i.prox);
    resp = (resp > maxResto) ? resp : maxResto;
  }
  return resp;
}`,
    requiredFragments: [
      req('empty', 'lanca excecao se vazia', 'if (topo == null)'),
      req('call', 'chama auxiliar pelo topo', 'return getMax(topo);'),
      req('base', 'comeca pelo elemento atual', 'int resp = i.elemento;'),
      req('rec', 'calcula maximo do restante', 'int maxResto = getMax(i.prox);'),
      req('cmp', 'compara atual e restante', 'resp = (resp > maxResto) ? resp : maxResto;'),
    ],
    explanation: 'Nao altera a pilha; custo O(n).',
  }),
  drill({
    number: 52,
    id: 'code-lista2-fila-inverter-com-pilha',
    moduleId: 'fila',
    domainId: 'vetores',
    title: 'Fila: inverter usando pilha',
    difficulty: 'intermediario',
    repetitionGroup: 'lista2-q52-inverter-fila-pilha',
    stem: 'Inverta a fila usando uma pilha auxiliar e apenas operacoes publicas inserir/remover.',
    scaffold: `class Util {
  public static void inverter(Fila fila) throws Exception {
    // implementar
  }
}`,
    visual: visual('queue', 'Fila invertida', 'A pilha inverte a ordem FIFO.', ['1', '2', '3', '4']),
    signature: 'public static void inverter(Fila fila)',
    solution: `public static void inverter(Fila fila) throws Exception {
  Pilha pilha = new Pilha();
  while (!fila.vazia()) {
    pilha.inserir(fila.remover());
  }
  while (!pilha.vazia()) {
    fila.inserir(pilha.remover());
  }
}`,
    requiredFragments: [
      req('stack', 'cria pilha auxiliar', 'Pilha pilha = new Pilha();'),
      req('to-stack', 'remove da fila para pilha', 'pilha.inserir(fila.remover());'),
      req('to-queue', 'remove da pilha para fila', 'fila.inserir(pilha.remover());'),
    ],
    explanation: 'Duas passagens lineares invertem a ordem usando LIFO.',
  }),
  drill({
    number: 53,
    id: 'code-lista2-lista-simples-inserir-ordenado',
    moduleId: 'lista',
    domainId: 'vetores',
    title: 'Lista simples: inserir ordenado',
    difficulty: 'intermediario',
    repetitionGroup: 'lista2-q53-lista-simples-inserir-ordenado',
    stem: 'Insira x em lista simples com celula-cabeca e ponteiro ultimo, tratando inicio, meio e fim.',
    scaffold: `class Celula { int elemento; Celula prox; }
class Lista {
  private Celula primeiro, ultimo;
  public void inserirOrdenado(int x) {
    // implementar
  }
}`,
    visual: visual('list', 'Lista ordenada', 'Procura ant/i ate o ponto de insercao.', ['cabeca', '4', '8', '12']),
    signature: 'public void inserirOrdenado(int x)',
    solution: `public void inserirOrdenado(int x) {
  Celula ant = primeiro;
  Celula i = primeiro.prox;
  while (i != null && i.elemento < x) {
    ant = i;
    i = i.prox;
  }
  Celula nova = new Celula(x);
  nova.prox = i;
  ant.prox = nova;
  if (i == null) {
    ultimo = nova;
  }
}`,
    requiredFragments: [
      req('ant', 'comeca no cabeca', 'Celula ant = primeiro;'),
      req('scan', 'anda enquanto elemento menor', 'i != null && i.elemento < x'),
      req('new', 'cria nova celula', 'Celula nova = new Celula(x);'),
      req('link', 'religa nova no meio', 'nova.prox = i;'),
      req('last', 'atualiza ultimo quando entra no fim', 'ultimo = nova;'),
    ],
    explanation: 'Mantem a lista ordenada sem criar outra lista.',
  }),
  drill({
    number: 54,
    id: 'code-lista2-lista-simples-remover-valor',
    moduleId: 'lista',
    domainId: 'vetores',
    title: 'Lista simples: remover por valor',
    difficulty: 'intermediario',
    repetitionGroup: 'lista2-q54-lista-simples-remover-valor',
    stem: 'Remova a primeira ocorrencia de x em lista simples com cabeca, retornando o valor e atualizando ultimo.',
    scaffold: `class Lista {
  private Celula primeiro, ultimo;
  public int removerValor(int x) throws Exception {
    // implementar
  }
}`,
    visual: visual('list', 'Remover primeira ocorrencia', 'Precisa do anterior para religar prox.', ['cabeca', '4', '8', '15']),
    signature: 'public int removerValor(int x)',
    solution: `public int removerValor(int x) throws Exception {
  Celula ant = primeiro;
  Celula i = primeiro.prox;
  while (i != null && i.elemento != x) {
    ant = i;
    i = i.prox;
  }
  if (i == null) {
    throw new Exception("Elemento inexistente!");
  }
  ant.prox = i.prox;
  if (i == ultimo) {
    ultimo = ant;
  }
  i.prox = null;
  return i.elemento;
}`,
    requiredFragments: [
      req('scan', 'procura valor mantendo anterior', 'i != null && i.elemento != x'),
      req('error', 'lanca se nao encontrar', 'throw new Exception("Elemento inexistente!");'),
      req('unlink', 'religa anterior ao proximo', 'ant.prox = i.prox;'),
      req('last', 'atualiza ultimo se removeu fim', 'ultimo = ant;'),
      req('return', 'retorna removido', 'return i.elemento;'),
    ],
    explanation: 'Remove em O(n) no pior caso e preserva o ponteiro ultimo.',
  }),
  drill({
    number: 55,
    id: 'code-lista2-lista-dupla-palindromo',
    moduleId: 'lista',
    domainId: 'vetores',
    title: 'Lista dupla: palindromo',
    difficulty: 'avancado',
    repetitionGroup: 'lista2-q55-lista-dupla-palindromo',
    stem: 'Compare do inicio e do fim simultaneamente, sem copiar para vetor.',
    scaffold: `class ListaDupla {
  private CelulaDupla primeiro, ultimo;
  public boolean isPalindromo() {
    // implementar
  }
}`,
    visual: visual('list', 'Dois ponteiros', 'esq avanca e dir recua ate o meio.', ['1', '2', '3', '2', '1']),
    signature: 'public boolean isPalindromo()',
    solution: `public boolean isPalindromo() {
  CelulaDupla esq = primeiro.prox;
  CelulaDupla dir = ultimo;
  boolean resp = true;
  while (esq != null && dir != primeiro && esq != dir && esq.ant != dir && resp) {
    resp = (esq.elemento == dir.elemento);
    esq = esq.prox;
    dir = dir.ant;
  }
  return resp;
}`,
    requiredFragments: [
      req('left', 'ponteiro esquerdo apos cabeca', 'CelulaDupla esq = primeiro.prox;'),
      req('right', 'ponteiro direito no ultimo', 'CelulaDupla dir = ultimo;'),
      req('middle', 'para ao cruzar no meio', 'esq != dir && esq.ant != dir'),
      req('cmp', 'compara elementos opostos', 'resp = (esq.elemento == dir.elemento);'),
      req('move', 'avanca e recua', 'dir = dir.ant;'),
    ],
    explanation: 'Tempo O(n) e espaco O(1).',
  }),
  drill({
    number: 56,
    id: 'code-lista2-matriz-diagonal-unificada',
    moduleId: 'matriz',
    domainId: 'vetores',
    title: 'Matriz encadeada: diagonal unificada',
    difficulty: 'reavaliacao',
    repetitionGroup: 'lista2-q56-matriz-diagonal-unificada',
    stem: 'Crie uma lista dupla nova com todos os elementos das listas das celulas da diagonal principal.',
    scaffold: `class Matriz {
  CelulaMatriz inicio;
  int linha, coluna;
  public CelulaDupla diagUnificada() {
    // implementar
  }
}`,
    visual: visual('matrix', 'Diagonal + lista', 'Copia listas associadas sem compartilhar celulas.', ['1', '2', '3', '4', '5', '6', '7', '8', '9']),
    signature: 'public CelulaDupla diagUnificada()',
    solution: `public CelulaDupla diagUnificada() {
  CelulaDupla cabeca = new CelulaDupla();
  CelulaDupla ultimo = cabeca;
  CelulaMatriz m = inicio;
  while (m != null) {
    for (Celula i = m.inicio.prox; i != null; i = i.prox) {
      CelulaDupla nova = new CelulaDupla();
      nova.elemento = i.elemento;
      nova.ant = ultimo;
      ultimo.prox = nova;
      ultimo = nova;
    }
    m = (m.inf != null) ? m.inf.dir : null;
  }
  return cabeca.prox;
}`,
    requiredFragments: [
      req('head', 'cria cabeca da lista nova', 'CelulaDupla cabeca = new CelulaDupla();'),
      req('diag', 'percorre celulas da diagonal', 'm = (m.inf != null) ? m.inf.dir : null;'),
      req('skip-head', 'ignora cabeca das listas originais', 'm.inicio.prox'),
      req('copy', 'cria celula dupla nova', 'CelulaDupla nova = new CelulaDupla();'),
      req('link', 'religa ant/prox na lista destino', 'nova.ant = ultimo;'),
    ],
    explanation: 'Custo proporcional a diagonal e aos elementos copiados; sentinelas podem exigir ajuste do ponto inicial.',
  }),
  drill({
    number: 57,
    id: 'code-lista2-ordenacao-bubble-ultima-troca',
    moduleId: 'ordenacao',
    domainId: 'ordenacao',
    title: 'Ordenacao: bubble com ultima troca',
    difficulty: 'reavaliacao',
    repetitionGroup: 'lista2-q57-bubble-ultima-troca',
    stem: 'Reimplemente Bubble Sort encerrando quando nao houver troca e reduzindo o limite ate a ultima troca.',
    scaffold: `class Bolha {
  int[] array; int n; int comparacoes, movimentacoes;
  public void sort() {
    // implementar
  }
}`,
    visual: visual('array', 'Ultima troca', 'O limite recua para a ultima posicao alterada.', ['7', '2', '5', '1', '4']),
    signature: 'public void sort()',
    solution: `public void sort() {
  int limite = n - 1;
  while (limite > 0) {
    int ultimaTroca = 0;
    for (int j = 0; j < limite; j++) {
      comparacoes++;
      if (array[j] > array[j + 1]) {
        swap(j, j + 1);
        movimentacoes += 3;
        ultimaTroca = j;
      }
    }
    limite = ultimaTroca;
  }
}`,
    requiredFragments: [
      req('limit', 'limite inicial no fim util', 'int limite = n - 1;'),
      req('last', 'controla ultima troca', 'int ultimaTroca = 0;'),
      req('cmp', 'conta comparacoes', 'comparacoes++;'),
      req('mov', 'conta tres movimentacoes por swap', 'movimentacoes += 3;'),
      req('shrink', 'reduz limite para ultima troca', 'limite = ultimaTroca;'),
    ],
    explanation: 'Pior caso quadratico; melhor caso encerra apos uma passagem sem troca.',
  }),
  drill({
    number: 58,
    id: 'code-lista2-ordenacao-insertion-impar-par-negativos',
    moduleId: 'ordenacao',
    domainId: 'ordenacao',
    title: 'Ordenacao: insertion impares antes dos pares',
    difficulty: 'reavaliacao',
    repetitionGroup: 'lista2-q58-insertion-impar-par-negativos',
    stem: 'Ordene impares antes de pares e mantenha cada grupo crescente, inclusive com numeros negativos.',
    scaffold: `class InsercaoEspecial {
  private boolean vemAntes(int a, int b) {
    // implementar
  }
  public void sort() {
    // implementar
  }
}`,
    visual: visual('array', 'Comparador por paridade', 'Math.abs evita erro com numeros negativos.', ['-3', '2', '-1', '4']),
    signature: 'public void sort()',
    solution: `private boolean vemAntes(int a, int b) {
  boolean imparA = Math.abs(a % 2) == 1;
  boolean imparB = Math.abs(b % 2) == 1;
  if (imparA != imparB) {
    return imparA;
  }
  return a < b;
}
public void sort() {
  for (int i = 1; i < n; i++) {
    int tmp = array[i];
    int j = i - 1;
    while (j >= 0 && vemAntes(tmp, array[j])) {
      array[j + 1] = array[j--];
    }
    array[j + 1] = tmp;
  }
}`,
    requiredFragments: [
      req('abs-a', 'paridade funciona para negativos', 'Math.abs(a % 2) == 1'),
      req('abs-b', 'paridade de b', 'Math.abs(b % 2) == 1'),
      req('group', 'impar vem antes de par', 'return imparA;'),
      req('value', 'mesmo grupo em ordem crescente', 'return a < b;'),
      req('while', 'insertion usa comparador adaptado', 'vemAntes(tmp, array[j])'),
    ],
    explanation: 'Melhor caso linear; pior caso quadratico por deslocamentos.',
  }),
  drill({
    number: 59,
    id: 'code-lista2-ordenacao-merge-decrescente',
    moduleId: 'ordenacao',
    domainId: 'ordenacao',
    title: 'Ordenacao: merge decrescente estavel',
    difficulty: 'intermediario',
    repetitionGroup: 'lista2-q59-merge-decrescente',
    stem: 'Adapte intercalar para ordem decrescente preservando estabilidade em elementos iguais.',
    scaffold: `class Merge {
  int[] array;
  private void intercalar(int esq, int meio, int dir) {
    // implementar
  }
}`,
    visual: visual('array', 'Merge decrescente', 'Usa >= para manter estabilidade da esquerda.', ['9', '7', '7', '4']),
    signature: 'private void intercalar(int esq, int meio, int dir)',
    solution: `private void intercalar(int esq, int meio, int dir) {
  int[] tmp = new int[dir - esq + 1];
  int i = esq, j = meio + 1, k = 0;
  while (i <= meio && j <= dir) {
    if (array[i] >= array[j]) tmp[k++] = array[i++];
    else tmp[k++] = array[j++];
  }
  while (i <= meio) tmp[k++] = array[i++];
  while (j <= dir) tmp[k++] = array[j++];
  for (k = 0; k < tmp.length; k++) array[esq + k] = tmp[k];
}`,
    requiredFragments: [
      req('size', 'tamanho do trecho', 'dir - esq + 1'),
      req('second', 'segunda metade comeca em meio + 1', 'j = meio + 1'),
      req('stable', '>= preserva estabilidade da esquerda', 'array[i] >= array[j]'),
      req('left', 'copia sobra esquerda', 'while (i <= meio)'),
      req('copy', 'copia de volta', 'array[esq + k] = tmp[k];'),
    ],
    explanation: 'A estabilidade exige escolher o elemento da esquerda em empates.',
  }),
  drill({
    number: 60,
    id: 'code-lista2-ordenacao-merge-aluno',
    moduleId: 'ordenacao',
    domainId: 'ordenacao',
    title: 'Ordenacao: merge de Aluno',
    difficulty: 'avancado',
    repetitionGroup: 'lista2-q60-merge-aluno',
    stem: 'Intercale objetos Aluno por nota decrescente e, em empate, nome crescente.',
    scaffold: `class Aluno { String nome; double nota; }
class MergeAluno {
  Aluno[] array;
  private void intercalar(int esq, int meio, int dir) {
    // implementar
  }
}`,
    visual: visual('array', 'Aluno por nota/nome', 'Nota maior primeiro; empate por nome.', ['9.5 Ana', '9.5 Bia', '8.0 Caio']),
    signature: 'private void intercalar(int esq, int meio, int dir)',
    solution: `private boolean vemAntes(Aluno a, Aluno b) {
  if (a.nota != b.nota) return a.nota > b.nota;
  return a.nome.compareTo(b.nome) <= 0;
}
private void intercalar(int esq, int meio, int dir) {
  Aluno[] tmp = new Aluno[dir - esq + 1];
  int i = esq, j = meio + 1, k = 0;
  while (i <= meio && j <= dir) {
    if (vemAntes(array[i], array[j])) tmp[k++] = array[i++];
    else tmp[k++] = array[j++];
  }
  while (i <= meio) tmp[k++] = array[i++];
  while (j <= dir) tmp[k++] = array[j++];
  for (k = 0; k < tmp.length; k++) array[esq + k] = tmp[k];
}`,
    requiredFragments: [
      req('nota', 'nota decrescente', 'return a.nota > b.nota;'),
      req('nome', 'empate por nome crescente e estavel', 'a.nome.compareTo(b.nome) <= 0'),
      req('tmp', 'vetor temporario de Aluno', 'Aluno[] tmp = new Aluno[dir - esq + 1];'),
      req('compare', 'usa comparador vemAntes', 'vemAntes(array[i], array[j])'),
      req('copy', 'copia resultado de volta', 'array[esq + k] = tmp[k];'),
    ],
    explanation: 'Comparador composto preserva estabilidade no Merge.',
  }),
  drill({
    number: 61,
    id: 'code-lista2-ordenacao-corrigir-merge',
    moduleId: 'ordenacao',
    domainId: 'ordenacao',
    title: 'Ordenacao: corrigir Merge Sort',
    difficulty: 'intermediario',
    repetitionGroup: 'lista2-q61-corrigir-merge',
    stem: 'Identifique os erros do intercalar que perde elementos e reescreva a versao correta.',
    scaffold: `private void intercalar(int esq, int meio, int dir) {
  int[] tmp = new int[dir - esq];
  int i = esq, j = meio;
  // corrigir
}`,
    visual: visual('array', 'Corrigir intercalacao', 'Tamanho, meio+1, sobras e copia de volta.', ['esq', 'meio', 'meio+1', 'dir']),
    signature: 'private void intercalar(int esq, int meio, int dir)',
    solution: `private void intercalar(int esq, int meio, int dir) {
  int[] tmp = new int[dir - esq + 1];
  int i = esq, j = meio + 1, k = 0;
  while (i <= meio && j <= dir) {
    if (array[i] <= array[j]) tmp[k++] = array[i++];
    else tmp[k++] = array[j++];
  }
  while (i <= meio) tmp[k++] = array[i++];
  while (j <= dir) tmp[k++] = array[j++];
  for (k = 0; k < tmp.length; k++) array[esq + k] = tmp[k];
}`,
    requiredFragments: [
      req('size', 'corrige tamanho', 'dir - esq + 1'),
      req('j', 'segunda metade começa em meio + 1', 'j = meio + 1'),
      req('while', 'testa esgotamento dos dois lados', 'i <= meio && j <= dir'),
      req('sobras', 'copia sobras', 'while (j <= dir)'),
      req('copy', 'copia de volta', 'array[esq + k] = tmp[k];'),
    ],
    explanation: 'Os quatro erros do gabarito ficam cobertos pela versao completa.',
  }),
  drill({
    number: 62,
    id: 'code-lista2-complexidade-trecho-misto',
    moduleId: 'complexidade',
    domainId: 'somatorio',
    title: 'Complexidade: melhor e pior caso misto',
    difficulty: 'reavaliacao',
    repetitionGroup: 'lista2-q62-trecho-misto',
    stem: 'Determine melhor e pior caso para multiplicacoes em trecho com ramo par logaritmico e ramo impar triangular.',
    scaffold: `class Analise {
  void trecho(int[] array, int n) {
    int x = 1;
    for (int i = 0; i < n; i++) {
      if (array[i] % 2 == 0) {
        for (int j = 1; j <= n; j *= 2) x *= 2;
      } else {
        for (int j = 0; j < i; j++) x *= 3;
      }
    }
  }
}`,
    visual: visual('array', 'Ramos de custo', 'Pares geram log; impares geram triangulo.', ['par log n', 'impar i', '...', 'n']),
    signature: 'analise de multiplicacoes',
    solution: `Melhor caso: todos os elementos pares, com n * (floor(log2(n)) + 1) multiplicacoes, portanto Theta(n log n).
Pior caso: todos os elementos impares, com soma de i de 0 ate n-1, isto e n * (n - 1) / 2, portanto Theta(n^2).`,
    requiredFragments: [
      req('best', 'melhor caso com todos pares', 'todos os elementos pares'),
      req('log', 'custo logaritmico por par', 'floor(log2(n)) + 1'),
      req('worst', 'pior caso com todos impares', 'todos os elementos impares'),
      req('tri', 'soma triangular', 'n * (n - 1) / 2'),
      req('theta', 'ordens finais', 'Theta(n^2)'),
    ],
    explanation: 'O gabarito assume n grande: Θ(n log n) para pares e Θ(n^2) para impares.',
  }),
  drill({
    number: 63,
    id: 'code-lista2-abb-pesquisar-comparacoes',
    moduleId: 'arvore',
    domainId: 'arvore',
    title: 'ABB: pesquisar contando comparacoes',
    difficulty: 'basico',
    repetitionGroup: 'lista2-q63-abb-pesquisar-comparacoes',
    stem: 'Implemente pesquisar(int x) e atualize comparacoes com o numero de nos comparados.',
    scaffold: `class ArvoreBinaria {
  private No raiz;
  private int comparacoes;
  public boolean pesquisar(int x) {
    // implementar
  }
}`,
    visual: visual('binary-tree', 'Pesquisa em ABB', 'Cada no visitado conta uma comparacao.', ['15', '8', '22', '4', '12']),
    signature: 'public boolean pesquisar(int x)',
    solution: `public boolean pesquisar(int x) {
  comparacoes = 0;
  return pesquisar(x, raiz);
}
private boolean pesquisar(int x, No i) {
  boolean resp;
  if (i == null) {
    resp = false;
  } else {
    comparacoes++;
    if (x == i.elemento) resp = true;
    else if (x < i.elemento) resp = pesquisar(x, i.esq);
    else resp = pesquisar(x, i.dir);
  }
  return resp;
}`,
    requiredFragments: [
      req('reset', 'zera contador publico', 'comparacoes = 0;'),
      req('call', 'chama auxiliar na raiz', 'return pesquisar(x, raiz);'),
      req('inc', 'incrementa por no real', 'comparacoes++;'),
      req('left', 'desce esquerda se menor', 'x < i.elemento'),
      req('right', 'desce direita caso contrario', 'pesquisar(x, i.dir)'),
    ],
    explanation: 'Conta exatamente os nos reais comparados durante a pesquisa.',
  }),
  drill({
    number: 64,
    id: 'code-lista2-abb-folhas-internos',
    moduleId: 'arvore',
    domainId: 'arvore',
    title: 'ABB: contar folhas e internos',
    difficulty: 'intermediario',
    repetitionGroup: 'lista2-q64-abb-folhas-internos',
    stem: 'Implemente contarFolhas() e contarInternos(), cada uma chamando auxiliar privado.',
    scaffold: `class ArvoreBinaria {
  private No raiz;
  public int contarFolhas() { /* implementar */ }
  public int contarInternos() { /* implementar */ }
}`,
    visual: visual('binary-tree', 'Folhas e internos', 'Folha tem zero filhos; interno tem ao menos um.', ['10', '5', '15', '2', '7']),
    signature: 'public int contarFolhas()',
    solution: `public int contarFolhas() { return contarFolhas(raiz); }
private int contarFolhas(No i) {
  int resp = 0;
  if (i != null) {
    if (i.esq == null && i.dir == null) resp = 1;
    else resp = contarFolhas(i.esq) + contarFolhas(i.dir);
  }
  return resp;
}
public int contarInternos() { return contarInternos(raiz); }
private int contarInternos(No i) {
  int resp = 0;
  if (i != null && (i.esq != null || i.dir != null)) {
    resp = 1 + contarInternos(i.esq) + contarInternos(i.dir);
  }
  return resp;
}`,
    requiredFragments: [
      req('leaf', 'folha tem dois filhos nulos', 'i.esq == null && i.dir == null'),
      req('leaf-rec', 'soma folhas dos filhos', 'contarFolhas(i.esq) + contarFolhas(i.dir)'),
      req('internal', 'interno tem algum filho', 'i.esq != null || i.dir != null'),
      req('internal-rec', 'conta atual e internos abaixo', '1 + contarInternos(i.esq) + contarInternos(i.dir)'),
    ],
    explanation: 'As duas contagens percorrem a arvore uma vez.',
  }),
  drill({
    number: 65,
    id: 'code-lista2-abb-altura-limite-log',
    moduleId: 'arvore',
    domainId: 'arvore',
    title: 'ABB: altura e limite logaritmico',
    difficulty: 'avancado',
    repetitionGroup: 'lista2-q65-abb-altura-limite-log',
    stem: 'Implemente isMax(valor), retornando true se altura <= valor * log2(qtdNos). Arvore vazia retorna true.',
    scaffold: `class ArvoreBinaria {
  private No raiz;
  public boolean isMax(double valor) {
    // implementar
  }
}`,
    visual: visual('binary-tree', 'Altura vs log', 'Precisa calcular quantidade e altura.', ['20', '10', '30', '5', '15']),
    signature: 'public boolean isMax(double valor)',
    solution: `public boolean isMax(double valor) {
  int n = quantidade(raiz);
  return n == 0 || altura(raiz) <= valor * (Math.log(n) / Math.log(2));
}
private int quantidade(No i) {
  return (i == null) ? 0 : 1 + quantidade(i.esq) + quantidade(i.dir);
}
private int altura(No i) {
  return (i == null) ? -1 : 1 + Math.max(altura(i.esq), altura(i.dir));
}`,
    requiredFragments: [
      req('qtd', 'calcula quantidade de nos', 'int n = quantidade(raiz);'),
      req('empty', 'arvore vazia retorna true', 'n == 0 ||'),
      req('log', 'usa log base 2', 'Math.log(n) / Math.log(2)'),
      req('count', 'quantidade recursiva', '1 + quantidade(i.esq) + quantidade(i.dir)'),
      req('height', 'altura com nulo -1', '(i == null) ? -1'),
    ],
    explanation: 'Nao havia metodos prontos, entao quantidade e altura sao auxiliares.',
  }),
  drill({
    number: 67,
    id: 'code-lista2-abb-subconjunto-menores',
    moduleId: 'arvore',
    domainId: 'arvore',
    title: 'ABB: subconjunto de menores',
    difficulty: 'reavaliacao',
    repetitionGroup: 'lista2-q67-abb-subconjunto-menores',
    stem: 'Crie uma nova ABB com todos os elementos menores ou iguais a x, sem compartilhar nos, lancando excecao se x nao existir.',
    scaffold: `class ArvoreBinaria {
  private No raiz;
  public ArvoreBinaria obterSubconjuntoMenores(int x) throws Exception {
    // implementar
  }
}`,
    visual: visual('binary-tree', 'Copia com poda', 'Copia valores <= x para outra ABB.', ['20', '10', '30', '5', '15', '25', '40']),
    signature: 'public ArvoreBinaria obterSubconjuntoMenores(int x)',
    solution: `public ArvoreBinaria obterSubconjuntoMenores(int x) throws Exception {
  if (!pesquisar(x)) throw new Exception("Elemento inexistente!");
  ArvoreBinaria resp = new ArvoreBinaria();
  copiarMenores(raiz, x, resp);
  return resp;
}
private void copiarMenores(No i, int x, ArvoreBinaria destino) throws Exception {
  if (i != null) {
    if (i.elemento <= x) {
      destino.inserir(i.elemento);
      copiarMenores(i.esq, x, destino);
      copiarMenores(i.dir, x, destino);
    } else {
      copiarMenores(i.esq, x, destino);
    }
  }
}`,
    requiredFragments: [
      req('exists', 'x precisa existir', 'if (!pesquisar(x)) throw new Exception'),
      req('new', 'cria nova arvore', 'ArvoreBinaria resp = new ArvoreBinaria();'),
      req('copy', 'insere valor em destino', 'destino.inserir(i.elemento);'),
      req('lte', 'copia somente <= x', 'i.elemento <= x'),
      req('prune', 'se maior, poda direita', 'copiarMenores(i.esq, x, destino);'),
    ],
    explanation: 'A nova ABB nao compartilha nos com a original.',
  }),
  drill({
    number: 68,
    id: 'code-lista2-hibrida-arvore-de-arvores',
    moduleId: 'doidona',
    domainId: 'doidona',
    title: 'Hibrida: arvore de arvores',
    difficulty: 'avancado',
    repetitionGroup: 'lista2-q68-arvore-de-arvores',
    stem: 'A primeira arvore e ordenada por letra; cada no possui uma segunda ABB de palavras. Implemente pesquisar e contarComTamanho.',
    scaffold: `class ArvoreArvore {
  private No raiz;
  public boolean pesquisar(String s) { /* implementar */ }
  public int contarComTamanho(int tam) { /* implementar */ }
}`,
    visual: visual('doidona', 'Arvore + ABB interna', 'Letra escolhe o no externo; palavra fica na segunda arvore.', ['letra', 'raiz2', 'palavra']),
    signature: 'public boolean pesquisar(String s)',
    solution: `public boolean pesquisar(String s) {
  return pesquisar(raiz, s);
}
private boolean pesquisar(No i, String s) {
  boolean resp;
  char c = s.charAt(0);
  if (i == null) resp = false;
  else if (c < i.letra) resp = pesquisar(i.esq, s);
  else if (c > i.letra) resp = pesquisar(i.dir, s);
  else resp = pesquisar2(i.raiz2, s);
  return resp;
}
private boolean pesquisar2(No2 i, String s) {
  if (i == null) return false;
  if (s.equals(i.palavra)) return true;
  return (s.compareTo(i.palavra) < 0) ? pesquisar2(i.esq, s) : pesquisar2(i.dir, s);
}
public int contarComTamanho(int tam) { return contar1(raiz, tam); }
private int contar1(No i, int tam) {
  return (i == null) ? 0 : contar2(i.raiz2, tam) + contar1(i.esq, tam) + contar1(i.dir, tam);
}
private int contar2(No2 i, int tam) {
  return (i == null) ? 0 : ((i.palavra.length() == tam) ? 1 : 0) + contar2(i.esq, tam) + contar2(i.dir, tam);
}`,
    requiredFragments: [
      req('letter', 'usa primeira letra na arvore externa', 'char c = s.charAt(0);'),
      req('left', 'desce esquerda por letra', 'c < i.letra'),
      req('inner', 'pesquisa na segunda ABB', 'pesquisar2(i.raiz2, s)'),
      req('compare', 'compara palavra na ABB interna', 's.compareTo(i.palavra) < 0'),
      req('count', 'conta tamanho nas segundas arvores', 'contar2(i.raiz2, tam)'),
    ],
    explanation: 'Pesquisa por palavra usa duas camadas; contagem percorre todas as segundas arvores.',
  }),
  drill({
    number: 69,
    id: 'code-lista2-hibrida-arvore-de-listas-agenda',
    moduleId: 'doidona',
    domainId: 'doidona',
    title: 'Hibrida: arvore de listas agenda',
    difficulty: 'avancado',
    repetitionGroup: 'lista2-q69-arvore-listas-agenda',
    stem: 'Cada no da ABB representa a primeira letra e contem uma lista de contatos. Implemente pesquisa por cpf e por nome.',
    scaffold: `class Agenda {
  private No raiz;
  public boolean pesquisar(int cpf) { /* implementar */ }
  public boolean pesquisarNome(String nome) { /* implementar */ }
}`,
    visual: visual('doidona', 'Arvore de listas', 'CPF procura em todas as listas; nome usa a primeira letra.', ['letra', 'lista', 'Contato']),
    signature: 'public boolean pesquisar(int cpf)',
    solution: `public boolean pesquisar(int cpf) { return pesquisarCpf(raiz, cpf); }
private boolean pesquisarCpf(No i, int cpf) {
  if (i == null) return false;
  return pesquisarLista(i.primeiro.prox, cpf) || pesquisarCpf(i.esq, cpf) || pesquisarCpf(i.dir, cpf);
}
private boolean pesquisarLista(Celula i, int cpf) {
  return i != null && (i.contato.cpf == cpf || pesquisarLista(i.prox, cpf));
}
public boolean pesquisarNome(String nome) { return pesquisarNome(raiz, nome); }
private boolean pesquisarNome(No i, String nome) {
  if (i == null) return false;
  char c = nome.charAt(0);
  if (c < i.letra) return pesquisarNome(i.esq, nome);
  if (c > i.letra) return pesquisarNome(i.dir, nome);
  for (Celula j = i.primeiro.prox; j != null; j = j.prox)
    if (j.contato.nome.equals(nome)) return true;
  return false;
}`,
    requiredFragments: [
      req('cpf-all', 'CPF percorre listas e subarvores', 'pesquisarLista(i.primeiro.prox, cpf) || pesquisarCpf(i.esq, cpf)'),
      req('list', 'pesquisa recursiva na lista', 'i.contato.cpf == cpf || pesquisarLista(i.prox, cpf)'),
      req('letter', 'nome usa primeira letra', 'char c = nome.charAt(0);'),
      req('name-left', 'desce pela letra do nome', 'c < i.letra'),
      req('scan-list', 'varre somente a lista escolhida', 'j.contato.nome.equals(nome)'),
    ],
    explanation: 'CPF nao tem chave externa; nome usa a arvore de letras para reduzir a busca.',
  }),
  drill({
    number: 71,
    id: 'code-lista2-avl-validar-com-niveis',
    moduleId: 'avl',
    domainId: 'avl',
    title: 'AVL: validar ABB, niveis e fator',
    difficulty: 'avancado',
    repetitionGroup: 'lista2-q71-validar-avl-com-niveis',
    stem: 'Valide simultaneamente propriedade de ABB, niveis armazenados corretos e |fator| <= 1 em O(n).',
    scaffold: `class AVL {
  private No raiz;
  public boolean isAVL() {
    // implementar
  }
}`,
    visual: visual('avl', 'Validacao unica', 'Retorna informacoes da subarvore em uma travessia.', ['20', '10', '30', '5', '15']),
    signature: 'public boolean isAVL()',
    solution: `private static class Info { boolean ok; int nivel; int min, max; boolean vazio; }
public boolean isAVL() { return validar(raiz).ok; }
private Info validar(No i) {
  Info r = new Info();
  if (i == null) { r.ok = true; r.nivel = 0; r.vazio = true; return r; }
  Info e = validar(i.esq), d = validar(i.dir);
  int nivel = 1 + Math.max(e.nivel, d.nivel);
  boolean ordem = (e.vazio || e.max < i.elemento) && (d.vazio || d.min > i.elemento);
  r.ok = e.ok && d.ok && ordem && Math.abs(d.nivel - e.nivel) <= 1 && i.nivel == nivel;
  r.nivel = nivel; r.vazio = false; r.min = e.vazio ? i.elemento : e.min; r.max = d.vazio ? i.elemento : d.max;
  return r;
}`,
    requiredFragments: [
      req('info', 'retorna Info da subarvore', 'private static class Info'),
      req('null', 'nulo tem nivel zero', 'r.nivel = 0'),
      req('ordem', 'valida intervalos de ABB', 'e.max < i.elemento'),
      req('factor', 'checa fator por niveis', 'Math.abs(d.nivel - e.nivel) <= 1'),
      req('stored', 'confere nivel armazenado', 'i.nivel == nivel'),
    ],
    explanation: 'Uma unica travessia evita recalcular altura a cada no.',
  }),
  drill({
    number: 72,
    id: 'code-lista2-avl-balancear-quatro-casos',
    moduleId: 'avl',
    domainId: 'avl',
    title: 'AVL: balancear quatro casos',
    difficulty: 'reavaliacao',
    repetitionGroup: 'lista2-q72-balancear-avl',
    stem: 'Implemente balancear(No no) com as rotacoes simples existentes, detectando os quatro casos.',
    scaffold: `class AVL {
  private No balancear(No no) throws Exception {
    // implementar
  }
}`,
    visual: visual('avl', 'Quatro casos', 'fator +2/-2 define rotacao simples ou dupla.', ['30', '10', '20']),
    signature: 'private No balancear(No no)',
    solution: `private No balancear(No no) throws Exception {
  if (no != null) {
    int fator = No.getNivel(no.dir) - No.getNivel(no.esq);
    if (Math.abs(fator) <= 1) {
      no.setNivel();
    } else if (fator == 2) {
      int fd = No.getNivel(no.dir.dir) - No.getNivel(no.dir.esq);
      if (fd < 0) no.dir = rotacionarDir(no.dir);
      no = rotacionarEsq(no);
    } else if (fator == -2) {
      int fe = No.getNivel(no.esq.dir) - No.getNivel(no.esq.esq);
      if (fe > 0) no.esq = rotacionarEsq(no.esq);
      no = rotacionarDir(no);
    } else throw new Exception("Fator invalido: " + fator);
  }
  return no;
}`,
    requiredFragments: [
      req('factor', 'calcula fator dir-esq', 'No.getNivel(no.dir) - No.getNivel(no.esq)'),
      req('ok', 'atualiza nivel se balanceado', 'no.setNivel();'),
      req('right-heavy', 'caso fator +2', 'fator == 2'),
      req('left-heavy', 'caso fator -2', 'fator == -2'),
      req('invalid', 'lanca fator invalido', 'throw new Exception("Fator invalido: " + fator);'),
    ],
    explanation: 'Os casos duplos rotacionam primeiro o filho no sentido oposto.',
  }),
  drill({
    number: 73,
    id: 'code-lista2-avl-remocao-balanceada',
    moduleId: 'avl',
    domainId: 'avl',
    title: 'AVL: remocao balanceada',
    difficulty: 'avancado',
    repetitionGroup: 'lista2-q73-remocao-avl',
    stem: 'Complete a remocao recursiva usando maiorEsq e aplicando balancear em cada retorno.',
    scaffold: `class AVL {
  private No remover(int x, No i) throws Exception {
    // implementar
  }
}`,
    visual: visual('avl', 'Balancear no retorno', 'Cada ancestral pode desbalancear apos a remocao.', ['20', '10', '30', '5', '15']),
    signature: 'private No remover(int x, No i)',
    solution: `private No remover(int x, No i) throws Exception {
  if (i == null) throw new Exception("Erro ao remover!");
  if (x < i.elemento) i.esq = remover(x, i.esq);
  else if (x > i.elemento) i.dir = remover(x, i.dir);
  else if (i.dir == null) i = i.esq;
  else if (i.esq == null) i = i.dir;
  else i.esq = maiorEsq(i, i.esq);
  return balancear(i);
}`,
    requiredFragments: [
      req('null', 'erro se nao encontrar', 'if (i == null) throw new Exception'),
      req('left', 'recorre esquerda', 'i.esq = remover(x, i.esq);'),
      req('right', 'recorre direita', 'i.dir = remover(x, i.dir);'),
      req('maior', 'usa maiorEsq em dois filhos', 'i.esq = maiorEsq(i, i.esq);'),
      req('balance', 'balanceia em cada retorno', 'return balancear(i);'),
    ],
    explanation: 'Balancear so a raiz final e insuficiente porque qualquer no do caminho pode desbalancear.',
  }),
  drill({
    number: 74,
    id: 'code-lista2-arvore234-validade',
    moduleId: 'arvore234',
    domainId: 'arvore',
    title: '2-3-4: validar invariantes',
    difficulty: 'avancado',
    repetitionGroup: 'lista2-q74-validar-arvore234',
    stem: 'Valide qtdChaves, ordem interna, filhos, intervalos e folhas no mesmo nivel.',
    scaffold: `class Arvore234 {
  private No234 raiz;
  public boolean valida() {
    // implementar
  }
}`,
    visual: visual('tree234', 'No 2-3-4', 'Chaves ordenadas e filhos entre intervalos.', ['[8|12|18]', '[2|4|6]', '[10]', '[14|16]', '[20|22]']),
    signature: 'public boolean valida()',
    solution: `public boolean valida() {
  return validar(raiz, null, null, 0, new int[] { -1 });
}
private boolean validar(No234 no, Integer min, Integer max, int nivel, int[] folhaNivel) {
  if (no == null) return true;
  if (no.qtdChaves < 1 || no.qtdChaves > 3) return false;
  for (int i = 1; i < no.qtdChaves; i++) if (no.chave[i - 1] >= no.chave[i]) return false;
  if ((min != null && no.chave[0] <= min) || (max != null && no.chave[no.qtdChaves - 1] >= max)) return false;
  boolean folha = no.filho[0] == null;
  if (folha) {
    if (folhaNivel[0] < 0) folhaNivel[0] = nivel;
    return folhaNivel[0] == nivel;
  }
  for (int i = 0; i <= no.qtdChaves; i++) if (no.filho[i] == null) return false;
  for (int i = no.qtdChaves + 1; i < 4; i++) if (no.filho[i] != null) return false;
  for (int i = 0; i <= no.qtdChaves; i++) {
    Integer filhoMin = (i == 0) ? min : no.chave[i - 1];
    Integer filhoMax = (i == no.qtdChaves) ? max : no.chave[i];
    if (!validar(no.filho[i], filhoMin, filhoMax, nivel + 1, folhaNivel)) return false;
  }
  return true;
}`,
    requiredFragments: [
      req('qtd', 'qtdChaves entre 1 e 3', 'no.qtdChaves < 1 || no.qtdChaves > 3'),
      req('order', 'chaves internas ordenadas', 'no.chave[i - 1] >= no.chave[i]'),
      req('range', 'respeita intervalos', 'no.chave[0] <= min'),
      req('leaf-level', 'folhas no mesmo nivel', 'folhaNivel[0] == nivel'),
      req('children', 'filhos esperados existem', 'i <= no.qtdChaves'),
    ],
    explanation: 'A questao aceita solucoes por objeto/Info; aqui os fragmentos cobrem as invariantes exigidas.',
  }),
  drill({
    number: 75,
    id: 'code-lista2-alvinegra-brancos-raiz',
    moduleId: 'alvinegra',
    domainId: 'avl',
    title: 'Alvinegra: brancos dos lados da raiz',
    difficulty: 'reavaliacao',
    repetitionGroup: 'lista2-q75-brancos-raiz',
    stem: 'Compare a quantidade de nos brancos nas subarvores esquerda e direita da raiz.',
    scaffold: `class Alvinegra {
  private NoAN raiz;
  public boolean mesmaQuantidadeBrancos() {
    // implementar
  }
}`,
    visual: visual('red-black', 'Altura branca local', 'cor false representa branco.', ['12B', '8P', '18P', '4B', '10B', '14B', '20B']),
    signature: 'public boolean mesmaQuantidadeBrancos()',
    solution: `public boolean mesmaQuantidadeBrancos() {
  return raiz == null || contarBrancos(raiz.esq) == contarBrancos(raiz.dir);
}
private int contarBrancos(NoAN i) {
  return (i == null) ? 0 : ((!i.cor) ? 1 : 0) + contarBrancos(i.esq) + contarBrancos(i.dir);
}`,
    requiredFragments: [
      req('root', 'arvore vazia valida', 'raiz == null ||'),
      req('compare', 'compara esquerda e direita', 'contarBrancos(raiz.esq) == contarBrancos(raiz.dir)'),
      req('white', 'conta branco quando cor false', '(!i.cor) ? 1 : 0'),
      req('rec', 'soma subarvores', 'contarBrancos(i.esq) + contarBrancos(i.dir)'),
    ],
    explanation: 'A questao local compara apenas os dois lados da raiz.',
  }),
  drill({
    number: 76,
    id: 'code-lista2-alvinegra-brancos-global',
    moduleId: 'alvinegra',
    domainId: 'avl',
    title: 'Alvinegra: brancos globais',
    difficulty: 'desafio',
    repetitionGroup: 'lista2-q76-brancos-global',
    stem: 'Para todo no, a quantidade de brancos na subarvore esquerda deve ser igual a da direita, em O(n).',
    scaffold: `class Alvinegra {
  private NoAN raiz;
  public boolean equilibradaBrancaGlobal() {
    // implementar
  }
}`,
    visual: visual('red-black', 'Info booleana + contagem', 'Retorna validade e contagem na mesma travessia.', ['12B', '8P', '18P', '4B', '10B', '14B', '20B']),
    signature: 'public boolean equilibradaBrancaGlobal()',
    solution: `private static class Info { boolean ok; int brancos; }
public boolean equilibradaBrancaGlobal() { return verificar(raiz).ok; }
private Info verificar(NoAN i) {
  Info r = new Info();
  if (i == null) { r.ok = true; r.brancos = 0; return r; }
  Info e = verificar(i.esq), d = verificar(i.dir);
  r.ok = e.ok && d.ok && e.brancos == d.brancos;
  r.brancos = e.brancos + d.brancos + ((!i.cor) ? 1 : 0);
  return r;
}`,
    requiredFragments: [
      req('info', 'Info carrega ok e brancos', 'private static class Info'),
      req('null', 'nulo tem zero brancos', 'r.brancos = 0'),
      req('eq', 'compara brancos dos dois lados em cada no', 'e.brancos == d.brancos'),
      req('sum', 'soma brancos da subarvore', 'e.brancos + d.brancos + ((!i.cor) ? 1 : 0)'),
    ],
    explanation: 'Retornar contagem junto do boolean evita uma solucao O(n^2).',
  }),
  drill({
    number: 77,
    id: 'code-lista2-alvinegra-invariantes',
    moduleId: 'alvinegra',
    domainId: 'avl',
    title: 'Alvinegra: verificar invariantes',
    difficulty: 'avancado',
    repetitionGroup: 'lista2-q77-invariantes-alvinegra',
    stem: 'Confirme raiz branca, ausencia de dois coloridos consecutivos e mesma altura branca ate nulos.',
    scaffold: `class Alvinegra {
  private NoAN raiz;
  public boolean verificaArvore() {
    // implementar
  }
}`,
    visual: visual('red-black', 'Invariantes de cor', 'alturaBranca retorna -1 quando encontra violacao.', ['12B', '8P', '18P', '4B', '10B', '14B', '20B']),
    signature: 'public boolean verificaArvore()',
    solution: `public boolean verificaArvore() {
  return raiz == null || (!raiz.cor && alturaBranca(raiz) >= 0);
}
private int alturaBranca(NoAN i) {
  if (i == null) return 0;
  if (i.cor && ((i.esq != null && i.esq.cor) || (i.dir != null && i.dir.cor))) return -1;
  int e = alturaBranca(i.esq), d = alturaBranca(i.dir);
  if (e < 0 || d < 0 || e != d) return -1;
  return e + ((!i.cor) ? 1 : 0);
}`,
    requiredFragments: [
      req('root', 'raiz precisa ser branca', '!raiz.cor'),
      req('sentinel', 'alturaBranca negativa marca erro', 'alturaBranca(raiz) >= 0'),
      req('double', 'proibe dois coloridos consecutivos', 'i.cor && ((i.esq != null && i.esq.cor) || (i.dir != null && i.dir.cor))'),
      req('equal', 'exige mesma altura branca', 'e != d'),
      req('white', 'soma branco quando cor false', '(!i.cor) ? 1 : 0'),
    ],
    explanation: 'Uma unica funcao devolve altura branca ou -1 para violacao.',
  }),
  drill({
    number: 78,
    id: 'code-lista2-hash-reserva-remover-promover',
    moduleId: 'hash',
    domainId: 'hash',
    title: 'Hash: remover com area de reserva',
    difficulty: 'intermediario',
    repetitionGroup: 'lista2-q78-hash-reserva-remocao',
    stem: 'Implemente pesquisa/remocao em hash com reserva; ao remover da principal, promova da reserva elemento compativel e compacte.',
    scaffold: `class Hash {
  int[] tabela; int m1, m2, reserva; final int NULO = -1;
  int h(int x) { return x % m1; }
  public boolean remover(int x) {
    // implementar
  }
}`,
    visual: visual('hash', 'Reserva compactada', 'Promove primeiro y da reserva com h(y)==pos.', ['principal', 'reserva', 'compacta']),
    signature: 'public boolean remover(int x)',
    solution: `public boolean pesquisar(int x) {
  int pos = h(x);
  if (tabela[pos] == x) return true;
  for (int i = 0; i < reserva; i++) {
    if (tabela[m1 + i] == x) return true;
  }
  return false;
}
public boolean remover(int x) {
  int pos = h(x);
  if (tabela[pos] == x) {
    int escolhido = -1;
    for (int i = 0; i < reserva && escolhido < 0; i++) {
      if (h(tabela[m1 + i]) == pos) escolhido = i;
    }
    if (escolhido >= 0) {
      tabela[pos] = tabela[m1 + escolhido];
      compactarReserva(escolhido);
    } else {
      tabela[pos] = NULO;
    }
    return true;
  }
  for (int i = 0; i < reserva; i++) {
    if (tabela[m1 + i] == x) {
      compactarReserva(i);
      return true;
    }
  }
  return false;
}`,
    requiredFragments: [
      req('search-main', 'pesquisa posicao principal', 'tabela[pos] == x'),
      req('search-reserve', 'varre area de reserva', 'i < reserva'),
      req('compatible', 'procura reserva compativel', 'h(tabela[m1 + i]) == pos'),
      req('promote', 'promove para area principal', 'tabela[pos] = tabela[m1 + escolhido];'),
      req('compact', 'compacta a reserva', 'compactarReserva(escolhido);'),
    ],
    explanation: 'Pior caso O(m2) por varrer/compactar a reserva.',
  }),
  drill({
    number: 79,
    id: 'code-lista2-hash-rehash-removido',
    moduleId: 'hash',
    domainId: 'hash',
    title: 'Hash: rehash com removido',
    difficulty: 'intermediario',
    repetitionGroup: 'lista2-q79-hash-rehash-removido',
    stem: 'Use NULO e REMOVIDO distintos para inserir, pesquisar e remover com h e reh.',
    scaffold: `class HashRehash {
  int[] tabela; int m;
  static final int NULO=-1, REMOVIDO=-2;
  public boolean inserir(int x) { /* implementar */ }
}`,
    visual: visual('hash', 'Duas tentativas', 'h(x) e reh(x)=(x+1)%m.', ['h', 'reh', 'REMOVIDO']),
    signature: 'public boolean inserir(int x)',
    solution: `static final int NULO = -1, REMOVIDO = -2;
public boolean inserir(int x) {
  int p = h(x);
  if (tabela[p] == NULO || tabela[p] == REMOVIDO) { tabela[p] = x; return true; }
  p = reh(x);
  if (tabela[p] == NULO || tabela[p] == REMOVIDO) { tabela[p] = x; return true; }
  return false;
}
public boolean pesquisar(int x) {
  return tabela[h(x)] == x || tabela[reh(x)] == x;
}
public boolean remover(int x) {
  int p = h(x); if (tabela[p] == x) { tabela[p] = REMOVIDO; return true; }
  p = reh(x); if (tabela[p] == x) { tabela[p] = REMOVIDO; return true; }
  return false;
}`,
    requiredFragments: [
      req('removed', 'usa marcador REMOVIDO distinto', 'REMOVIDO = -2'),
      req('insert-h', 'insere em h se livre/removido', 'tabela[p] == NULO || tabela[p] == REMOVIDO'),
      req('reh', 'tenta rehash', 'p = reh(x);'),
      req('search', 'pesquisa em h ou reh', 'tabela[h(x)] == x || tabela[reh(x)] == x'),
      req('remove', 'marca como REMOVIDO', 'tabela[p] = REMOVIDO;'),
    ],
    explanation: 'REMOVIDO preserva buscas que dependem da segunda tentativa.',
  }),
  drill({
    number: 80,
    id: 'code-lista2-hash-encadeamento-maior-lista',
    moduleId: 'hash',
    domainId: 'hash',
    title: 'Hash: encadeamento e maior lista',
    difficulty: 'intermediario',
    repetitionGroup: 'lista2-q80-hash-encadeamento',
    stem: 'Implemente inserirInicio, pesquisar, remover e maiorLista em hash indireta por listas.',
    scaffold: `class HashIndireta {
  Lista[] tabela; int m;
  public int maiorLista() {
    // implementar
  }
}`,
    visual: visual('hash', 'Buckets encadeados', 'maiorLista mede o maior bucket.', ['0:14->21', '1:8->15->22', '3:3->10']),
    signature: 'public int maiorLista()',
    solution: `public void inserirInicio(int x) {
  tabela[h(x)].inserirInicio(x);
}
public boolean pesquisar(int x) {
  return tabela[h(x)].pesquisar(x);
}
public boolean remover(int x) throws Exception {
  return tabela[h(x)].remover(x);
}
public int maiorLista() {
  int maior = 0;
  for (int i = 0; i < m; i++) {
    int tam = tabela[i].tamanho();
    if (tam > maior) maior = tam;
  }
  return maior;
}`,
    requiredFragments: [
      req('insert', 'insere no bucket h(x)', 'tabela[h(x)].inserirInicio(x);'),
      req('search', 'pesquisa no bucket h(x)', 'tabela[h(x)].pesquisar(x)'),
      req('remove', 'remove no bucket h(x)', 'tabela[h(x)].remover(x)'),
      req('scan', 'varre todos os buckets', 'for (int i = 0; i < m; i++)'),
      req('max', 'atualiza maior tamanho', 'if (tam > maior) maior = tam;'),
    ],
    explanation: 'maiorLista custa O(m+n); pesquisa media O(1+alfa), pior O(n).',
  }),
  drill({
    number: 81,
    id: 'code-lista2-trie-palavra-prefixo',
    moduleId: 'trie',
    domainId: 'trie',
    title: 'TRIE: palavra e prefixo',
    difficulty: 'intermediario',
    repetitionGroup: 'lista2-q81-trie-palavra-prefixo',
    stem: 'Implemente pesquisar(String s) exigindo folha=true e existePrefixo(String p) verificando palavra abaixo.',
    scaffold: `class ArvoreTrie {
  private No raiz;
  public boolean pesquisar(String s) { /* implementar */ }
  public boolean existePrefixo(String p) { /* implementar */ }
}`,
    visual: visual('trie', 'Prefixo com palavra abaixo', 'Caminho do prefixo existe e tem folha abaixo.', ['c', 'a', 's', 'fim', 'a', 'fim']),
    signature: 'public boolean existePrefixo(String p)',
    solution: `public boolean pesquisar(String s) { return pesquisar(s, raiz, 0); }
private boolean pesquisar(String s, No no, int i) {
  No f = no.prox[No.hash(s.charAt(i))];
  if (f == null) return false;
  if (i == s.length() - 1) return f.folha;
  return pesquisar(s, f, i + 1);
}
public boolean existePrefixo(String p) {
  No no = raiz;
  for (int i = 0; i < p.length(); i++) {
    no = no.prox[No.hash(p.charAt(i))];
    if (no == null) return false;
  }
  return temPalavra(no);
}
private boolean temPalavra(No no) {
  if (no.folha) return true;
  for (No f : no.prox) if (f != null && temPalavra(f)) return true;
  return false;
}`,
    requiredFragments: [
      req('folha', 'pesquisar exige folha no ultimo caractere', 'return f.folha;'),
      req('prefix-loop', 'percorre caracteres do prefixo', 'i < p.length()'),
      req('missing', 'prefixo ausente retorna false', 'if (no == null) return false;'),
      req('below', 'verifica palavra abaixo', 'return temPalavra(no);'),
      req('dfs', 'DFS nos filhos', 'for (No f : no.prox)'),
    ],
    explanation: 'O gabarito usa No.hash; se a classe real tiver outra funcao de indice, a ideia e a mesma.',
  }),
  drill({
    number: 82,
    id: 'code-lista2-trie-prefixo-sufixo',
    moduleId: 'trie',
    domainId: 'trie',
    title: 'TRIE: prefixo e sufixo',
    difficulty: 'avancado',
    repetitionGroup: 'lista2-q82-trie-prefixo-sufixo',
    stem: 'Navegue ate o prefixo e explore somente sua subarvore, testando se alguma palavra termina com o sufixo.',
    scaffold: `class ArvoreTrie {
  public boolean existePrefixoSufixo(String prefixo, String sufixo) {
    // implementar
  }
}`,
    visual: visual('trie', 'Subarvore do prefixo', 'Busca por sufixo so abaixo do prefixo encontrado.', ['b', 'r', 'a', 'fim', 's', 'a', 'fim']),
    signature: 'public boolean existePrefixoSufixo(String prefixo, String sufixo)',
    solution: `public boolean existePrefixoSufixo(String p, String suf) {
  No no = raiz;
  for (int i = 0; i < p.length(); i++) {
    no = no.prox[No.hash(p.charAt(i))];
    if (no == null) return false;
  }
  return buscarSufixo(no, p, suf);
}
private boolean buscarSufixo(No no, String atual, String suf) {
  if (no.folha && atual.endsWith(suf)) return true;
  for (No f : no.prox) if (f != null && buscarSufixo(f, atual + f.elemento, suf)) return true;
  return false;
}`,
    requiredFragments: [
      req('prefix', 'localiza prefixo primeiro', 'i < p.length()'),
      req('missing', 'se prefixo nao existe, falso', 'if (no == null) return false;'),
      req('dfs', 'busca sufixo na subarvore', 'return buscarSufixo(no, p, suf);'),
      req('ends', 'testa sufixo somente em palavra', 'no.folha && atual.endsWith(suf)'),
      req('child', 'constroi palavra atual', 'atual + f.elemento'),
    ],
    explanation: 'Complexidade depende dos caracteres visitados na subarvore do prefixo.',
  }),
  drill({
    number: 83,
    id: 'code-lista2-patricia-pesquisar-contar-a',
    moduleId: 'patricia',
    domainId: 'trie',
    title: 'PATRICIA: pesquisar e contar A',
    difficulty: 'avancado',
    repetitionGroup: 'lista2-q83-patricia-pesquisar-contar-a',
    stem: 'Implemente a ideia de pesquisar por segmentos e contar letras A nos rotulos sem repetir posicoes.',
    scaffold: `class Patricia {
  String[] array;
  No raiz;
  public boolean pesquisar(String s) { /* implementar */ }
  public int contarAs() { /* implementar */ }
}`,
    visual: visual('patricia', 'Segmentos comprimidos', 'Cada no guarda intervalo i,j,k no vetor de palavras.', ['BRA', 'S', 'IL', 'A', 'VO']),
    signature: 'public int contarAs()',
    solution: `public boolean pesquisar(String s) {
  return pesquisar(s, raiz, 0);
}
private boolean pesquisar(String s, No no, int pos) {
  if (no == null) return false;
  String palavra = array[no.i];
  for (int a = no.j; a <= no.k && pos < s.length(); a++, pos++) {
    if (palavra.charAt(a) != s.charAt(pos)) return false;
  }
  if (pos == s.length()) return no.folha;
  return pesquisar(s, proximo(no, s.charAt(pos)), pos);
}
public int contarAs() {
  return contarAs(raiz);
}
private int contarAs(No no) {
  if (no == null) return 0;
  int resp = 0;
  String palavra = array[no.i];
  for (int a = no.j; a <= no.k; a++) if (palavra.charAt(a) == 'A') resp++;
  for (No f : no.prox) resp += contarAs(f);
  return resp;
}`,
    requiredFragments: [
      req('segment', 'compara segmento j..k', 'for (int a = no.j; a <= no.k'),
      req('char', 'compara caractere por caractere', 'palavra.charAt(a) != s.charAt(pos)'),
      req('leaf', 'palavra completa exige folha', 'return no.folha;'),
      req('count', 'conta A nos rotulos', "palavra.charAt(a) == 'A'"),
      req('children', 'visita filhos uma vez', 'for (No f : no.prox)'),
    ],
    explanation: 'O gabarito e conceitual; esta versao expressa a pesquisa por segmentos e contagem linear nos rotulos visitados.',
  }),
  drill({
    number: 84,
    id: 'code-lista2-doidona-pesquisar-camadas-com-t3',
    moduleId: 'doidona',
    domainId: 'doidona',
    title: 'Doidona: pesquisar com T1, T3, lista e ABB',
    difficulty: 'desafio',
    repetitionGroup: 'lista2-q84-doidona-camadas-t3',
    stem: 'Pesquise na estrutura doidona: T1; em colisao, hashT2 escolhe T3, lista ou ABB; em T3, tente hash, rehash e outra ABB.',
    scaffold: `class Doidona {
  int[] t1, t3;
  Celula primeiroLista, ultimoLista;
  No raizArvoreT2, raizArvoreT3;
  public boolean pesquisar(int elemento) {
    // implementar
  }
}`,
    visual: visual('doidona', 'Doidona completa', 'T1 desvia para T3, lista ou arvores.', ['T1', 'T3', 'lista', 'ABB']),
    signature: 'public boolean pesquisar(int elemento)',
    solution: `public boolean pesquisar(int elemento) {
  int p = hashT1(elemento);
  if (t1[p] == elemento) return true;
  if (t1[p] == NULO) return false;
  int destino = hashT2(elemento);
  if (destino == 0) {
    p = hashT3(elemento);
    if (t3[p] == elemento) return true;
    p = rehashT3(elemento);
    return t3[p] == elemento || pesquisarArvore(raizArvoreT3, elemento);
  }
  if (destino == 1) {
    for (Celula i = primeiroLista.prox; i != null; i = i.prox)
      if (i.elemento == elemento) return true;
    return false;
  }
  return pesquisarArvore(raizArvoreT2, elemento);
}
private boolean pesquisarArvore(No i, int x) {
  if (i == null) return false;
  if (x == i.elemento) return true;
  return (x < i.elemento) ? pesquisarArvore(i.esq, x) : pesquisarArvore(i.dir, x);
}`,
    requiredFragments: [
      req('t1', 'tenta T1 primeiro', 'int p = hashT1(elemento);'),
      req('nulo', 'NULO em T1 encerra ausencia', 'if (t1[p] == NULO) return false;'),
      req('t2', 'hashT2 decide destino', 'int destino = hashT2(elemento);'),
      req('t3', 'T3 usa hash e rehash', 'p = rehashT3(elemento);'),
      req('lista', 'lista e varrida por celulas', 'for (Celula i = primeiroLista.prox; i != null; i = i.prox)'),
      req('tree', 'ABB pesquisada recursivamente', 'pesquisarArvore(raizArvoreT2, elemento)'),
    ],
    explanation: 'O gabarito cita NULO sem declarar no enunciado; aqui ele e tratado como sentinela da tabela.',
  }),
];
