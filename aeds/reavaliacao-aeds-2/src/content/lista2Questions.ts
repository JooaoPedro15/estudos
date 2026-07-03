import { contentModuleCatalog, getContentModule } from './contentModules';
import type { ContentModuleId, DomainId, StructureVisual, StructureVisualKind } from '../types/content';

export type ConceptualDrawingType = 'conceitual' | 'desenho';
export type ConceptualDifficulty = 'basico' | 'intermediario' | 'avancado' | 'reavaliacao' | 'desafio';

export type ConceptualDrawingOption = {
  id: string;
  label: string;
  visual?: StructureVisual;
  explanation?: string;
};

export type ConceptualDrawingQuestion = {
  id: string;
  type: ConceptualDrawingType;
  moduleId: ContentModuleId;
  domainId: DomainId;
  difficulty: ConceptualDifficulty;
  source: 'lista-2';
  title: string;
  stem: string;
  options: ConceptualDrawingOption[];
  correctOptionId: string;
  explanation: string;
};

export type ConceptualDrawingModuleId = ContentModuleId | 'all';

export type ConceptualDrawingModule = {
  id: ConceptualDrawingModuleId;
  title: string;
  description: string;
  count: number;
};

function visual(kind: StructureVisualKind, title: string, caption: string, labels: string[]): StructureVisual {
  return { kind, title, caption, labels };
}

function option(id: string, label: string, explanation?: string, visualValue?: StructureVisual): ConceptualDrawingOption {
  return { id, label, explanation, visual: visualValue };
}

/**
 * Permutacao deterministica de [0,1,2,3] a partir do numero da questao.
 * Mantem a alternativa correta em posicoes diferentes (nao sempre "A"),
 * de forma estavel entre renders e sessoes.
 */
function permuteFour(seed: number): number[] {
  const order = [0, 1, 2, 3];
  let state = (seed * 2654435761) % 2147483647;
  if (state <= 0) state += 2147483646;
  for (let i = 3; i > 0; i -= 1) {
    state = (state * 48271) % 2147483647;
    const j = state % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

function cq(
  number: number,
  title: string,
  moduleId: ContentModuleId,
  domainId: DomainId,
  difficulty: ConceptualDifficulty,
  stem: string,
  correct: string,
  wrongA: string,
  wrongB: string,
  wrongC: string,
  explanation: string,
): ConceptualDrawingQuestion {
  const texts = [correct, wrongA, wrongB, wrongC];
  const letters = ['a', 'b', 'c', 'd'];
  const order = permuteFour(number);
  const options = order.map((sourceIndex, position) => option(letters[position], texts[sourceIndex]));
  const correctOptionId = letters[order.indexOf(0)];

  return {
    id: `lista2-conceitual-q${String(number).padStart(2, '0')}`,
    type: 'conceitual',
    moduleId,
    domainId,
    difficulty,
    source: 'lista-2',
    title: `Q${number} - ${title}`,
    stem,
    correctOptionId,
    options,
    explanation: `Gabarito Lista 2: ${explanation}`,
  };
}

function dq(
  number: number,
  title: string,
  moduleId: ContentModuleId,
  domainId: DomainId,
  difficulty: ConceptualDifficulty,
  stem: string,
  correctOptionId: string,
  options: ConceptualDrawingOption[],
  explanation: string,
): ConceptualDrawingQuestion {
  return {
    id: `lista2-desenho-q${String(number).padStart(2, '0')}`,
    type: 'desenho',
    moduleId,
    domainId,
    difficulty,
    source: 'lista-2',
    title: `Q${number} - ${title}`,
    stem,
    correctOptionId,
    options,
    explanation: `Gabarito Lista 2: ${explanation}`,
  };
}

const conceptualQuestions: ConceptualDrawingQuestion[] = [
  cq(1, 'Somatorio e formula fechada', 'somatorio', 'somatorio', 'basico',
    'Para os lacos i=1..n e j=1..i, escolha a contagem exata e a ordem assintotica.',
    'Σ(i=1..n) i = n(n+1)/2, portanto Θ(n^2).',
    'Σ(i=1..n) n = n^2, portanto Θ(n).',
    'Σ(i=1..n) 1 = n, portanto Θ(log n).',
    'n(n-1), portanto Θ(n^3).',
    'o laco interno depende de i, formando o triangulo 1+2+...+n.'),
  cq(2, 'Funcao exata e ordem assintotica', 'complexidade', 'somatorio', 'intermediario',
    'Um metodo executa 4n^2 + 7n + 12 atribuicoes. Qual alternativa separa funcao exata e classe assintotica?',
    'A funcao exata preserva os termos; a classe justa e Θ(n^2), tambem em O(n^2) e Ω(n^2).',
    'A funcao exata descarta constantes; a classe justa e Θ(n).',
    'O termo 7n domina quando n cresce; logo Θ(n).',
    'Constantes impedem classificar em O, Ω e Θ.',
    'termos de menor grau e constantes nao alteram a classe assintotica justa.'),
  cq(3, 'Prove ou refute - bloco I', 'complexidade', 'arvore', 'reavaliacao',
    'Bloco prove-ou-refute (V/F): (a) a pesquisa sequencial tem melhor caso constante; (b) toda ABB tem altura logaritmica; (c) inserir em AVL/2-3-4/alvinegra e logaritmico; (d) sem ordenacao ou indice nao ha busca binaria correta; (e) a hash garante pior caso constante. Qual vetor de respostas segue o gabarito?',
    'a F, b F, c F, d V conforme gabarito, e F.',
    'a V, b V, c V, d F, e V.',
    'a F, b V, c F, d V, e F.',
    'a V, b F, c F, d F, e F.',
    'o gabarito marca d como verdadeira, embora a justificativa textual seja ambigua.'),
  cq(4, 'Pesquisa sequencial e binaria', 'vetores', 'vetores', 'basico',
    'Compare pesquisa sequencial e binaria em vetor.',
    'Sequencial nao exige ordenacao e tem pior caso O(n); binaria exige ordenacao e tem pior caso O(log n), mas inserir ordenado pode deslocar O(n).',
    'Binaria sempre permite inserir em O(log n), pois a posicao e achada em O(log n).',
    'Sequencial exige vetor ordenado para funcionar corretamente.',
    'Vetor ordenado elimina o custo de manutencao.',
    'achar a posicao nao elimina deslocamentos da insercao em vetor.'),
  cq(5, 'Lista sequencial', 'lista', 'vetores', 'intermediario',
    'Em uma lista sequencial com n elementos, qual custo esta correto?',
    'Inicio custa Θ(n), fim custa Θ(1) se houver capacidade, posicao arbitraria custa Θ(n) no pior caso; localizar por valor pode somar Θ(n).',
    'Inicio, fim e posicao sao sempre Θ(1).',
    'O fim e sempre Θ(n), pois e preciso deslocar todos.',
    'A posicao arbitraria e Θ(log n) se a lista estiver ordenada.',
    'o custo principal vem dos deslocamentos fisicos no vetor.'),
  cq(6, 'Fila circular', 'fila', 'vetores', 'intermediario',
    'Qual regra descreve a fila circular do material?',
    'Vazia quando primeiro==ultimo; cheia quando (ultimo+1)%array.length==primeiro; a posicao extra diferencia os estados.',
    'Vazia quando ultimo==array.length-1; cheia quando primeiro==0.',
    'A fila cheia e detectada por primeiro==ultimo, sem posicao extra.',
    'Remover sempre desloca todos os elementos para a esquerda.',
    'os indices avancam por modulo; os elementos nao sao deslocados.'),
  cq(7, 'Pilha, fila e lista', 'pilha', 'vetores', 'basico',
    'Escolha as estruturas adequadas para os cenarios classicos.',
    'Desfazer e parenteses usam pilha; atendimento e largura de arvore usam fila; posicoes arbitrarias usam lista.',
    'Desfazer usa fila; largura usa pilha; posicoes arbitrarias usam hash.',
    'Todos os cenarios sao melhor resolvidos por vetor ordenado.',
    'Parenteses balanceados exigem ABB.',
    'a escolha acompanha LIFO, FIFO e acesso por posicao.'),
  cq(8, 'Estruturas sequenciais e flexiveis', 'lista', 'vetores', 'intermediario',
    'Qual comparacao esta correta?',
    'Sequenciais tem localidade e acesso por indice, mas capacidade fixa/deslocamentos; flexiveis crescem e evitam deslocamentos, mas usam ponteiros e pior localidade.',
    'Flexiveis sempre acessam por indice em O(1).',
    'Sequenciais nunca sofrem overflow.',
    'Flexiveis nao usam alocacao dinamica.',
    'a diferenca central e vetor contiguo contra nos ligados por referencias.'),
  cq(9, 'Lista simples e lista dupla', 'lista', 'vetores', 'intermediario',
    'Ao remover uma celula do meio, qual alternativa preserva os ponteiros?',
    'Na simples e preciso o anterior para ant.prox=alvo.prox; na dupla religa alvo.ant.prox e alvo.prox.ant.',
    'Na simples basta alterar alvo.prox, sem anterior.',
    'Na dupla nao ha ponteiro para o anterior.',
    'Com referencia direta, simples e dupla sempre removem em O(1) sem sentinela.',
    'a lista dupla carrega ponteiro para os dois lados.'),
  cq(10, 'Matriz encadeada', 'matriz', 'vetores', 'avancado',
    'Como caminhar pela diagonal principal na matriz flexivel?',
    'Partindo da primeira celula de dados, avancar inf e dir; sentinelas/cabecas nao contam como dados.',
    'Avancar apenas dir ate o fim da primeira linha.',
    'Avancar sup e esq para chegar aos dados.',
    'Copiar as celulas-cabeca para a diagonal.',
    'a diagonal combina uma descida e um passo para a direita.'),
  cq(11, 'Estabilidade e memoria', 'ordenacao', 'ordenacao', 'intermediario',
    'Qual classificacao de estabilidade/memoria e coerente?',
    'Bubble e Insertion usuais sao estaveis e in-place; Selection classico nao; Merge e estavel com O(n) auxiliar; Quick/Heap geralmente nao sao estaveis.',
    'Selection classico e sempre estavel.',
    'Merge Sort e in-place na versao usual da disciplina.',
    'QuickSort e HeapSort sao obrigatoriamente estaveis.',
    'Counting/Radix podem ser estaveis dependendo da implementacao.'),
  cq(12, 'Bubble, Insertion e Merge', 'ordenacao', 'ordenacao', 'reavaliacao',
    'Qual melhor/pior caso esta correto?',
    'Bubble otimizado e Insertion tem melhor Θ(n) em vetor ordenado e pior Θ(n^2) no inverso; Merge e Θ(n log n) nos casos usuais.',
    'Merge Sort e Θ(n^2) no pior caso.',
    'Insertion Sort e sempre Θ(n log n).',
    'Bubble otimizado nunca melhora com vetor ordenado.',
    'a otimizacao do Bubble depende de passagem sem troca.'),
  cq(13, 'Selection, Quick, Heap, Counting e Radix', 'ordenacao', 'ordenacao', 'avancado',
    'Qual afirmacao resume esses algoritmos?',
    'Selection faz n(n-1)/2 comparacoes; Quick degrada com particoes ruins; Heap mantem Θ(n log n); Counting/Radix dependem de k, digitos e base.',
    'Selection fica linear se o vetor ja estiver ordenado.',
    'HeapSort pode degradar para Θ(n^2) por pivo ruim.',
    'Radix e sempre Θ(n), independente das chaves.',
    'Counting e Radix dependem de hipoteses sobre as chaves.'),
  cq(14, 'Escolha do algoritmo', 'ordenacao', 'ordenacao', 'intermediario',
    'Escolha algoritmos para cenarios de ordenacao.',
    'Quase ordenado pequeno: Insertion; estabilidade em grande volume: Merge; inteiros em faixa pequena: Counting; pouca memoria: Heap/Insertion; evitar Quick com pivo inicial em entrada ordenada.',
    'Quick com pivo inicial e ideal para vetor ja ordenado.',
    'Counting ignora o intervalo das chaves.',
    'Merge e a melhor escolha quando memoria auxiliar e proibida.',
    'cada escolha depende das restricoes do cenario.'),
  cq(15, 'Propriedades da ABB', 'arvore', 'arvore', 'basico',
    'Qual alternativa valida corretamente uma ABB?',
    'Todo valor da esquerda deve ser menor e todo valor da direita maior em toda a subarvore; conferir so filhos imediatos nao basta.',
    'Basta conferir se cada filho imediato respeita o pai.',
    'Toda ABB tem pesquisa sempre O(log n).',
    'Insercao e remocao em ABB degenerada continuam O(1).',
    'violacoes podem estar em descendentes profundos.'),
  cq(16, 'Remocao em ABB', 'arvore', 'arvore', 'intermediario',
    'Qual descricao da remocao em ABB esta correta?',
    'Folha retorna nulo; um filho substitui pelo filho; dois filhos usa predecessor maiorEsq ou sucessor preservando os intervalos.',
    'Todo no removido deve virar folha antes.',
    'maiorEsq escolhe o menor da direita.',
    'Remover a raiz sempre exige reconstruir a arvore inteira.',
    'o predecessor da esquerda mantem a ordem da ABB.'),
  cq(17, 'Padroes de recursao em arvore', 'recursividade', 'arvore', 'avancado',
    'Qual conjunto representa os tres padroes pedidos?',
    'Todos os nos para soma/contagem; um ramo na pesquisa ABB; baixo para cima em altura/validacao AVL.',
    'Todos os metodos de arvore devem percorrer sempre os dois lados.',
    'Pesquisa ABB usa baixo para cima como padrao principal.',
    'Altura de arvore nao precisa de caso base.',
    'os padroes mudam conforme a informacao que a funcao precisa.'),
  cq(18, 'AVL: nivel, fator e rotacoes', 'avl', 'avl', 'intermediario',
    'Usando nivel nulo 0 e fator nivel(dir)-nivel(esq), qual regra esta correta?',
    'Fator -2 leva a rotacoes para a direita, +2 para a esquerda, com casos duplos quando o filho pende para o lado oposto; atualizar niveis dos nos alterados.',
    'Fator +2 sempre exige rotacao direita.',
    'Rotacao nao altera niveis.',
    'AVL permite fator absoluto maior que 1.',
    'o sinal do fator define o lado pesado na convencao do material.'),
  cq(19, '2-3-4 e alvinegra', 'arvore234', 'avl', 'avancado',
    'Como representar 2-nos, 3-nos e 4-nos em alvinegra?',
    '2-no vira no branco; 3-no vira ligacao colorida; 4-no vira no branco com dois filhos coloridos; descida divide antes, ascensao depois do overflow.',
    'Todo 4-no vira uma cadeia so de nos brancos.',
    'Fragmentacao na descida e por ascensao ocorrem no mesmo instante.',
    '3-nos nao possuem representacao binaria.',
    'a equivalencia usa cores para simular chaves agrupadas.'),
  cq(20, 'Invariantes da alvinegra', 'alvinegra', 'avl', 'avancado',
    'Qual conjunto de propriedades mantem altura logaritmica?',
    'Raiz branca, sem dois coloridos consecutivos e mesma altura branca ate referencias nulas; recoloracao fragmenta 4-no e rotacao corrige conflito.',
    'Apenas a raiz precisa ser branca.',
    'Dois coloridos consecutivos sao sempre permitidos.',
    'Altura branca pode variar livremente entre caminhos.',
    'as invariantes limitam o desbalanceamento.'),
  cq(21, 'Colisoes em hash', 'hash', 'hash', 'intermediario',
    'Compare reserva, rehash e encadeamento.',
    'Reserva e simples mas limitada; rehash tem poucas alternativas; encadeamento usa nos; pior caso pode ser linear conforme carga/esquema.',
    'Todas garantem pior caso O(1).',
    'Encadeamento nao usa memoria adicional.',
    'Fator de carga nao influencia pesquisa.',
    'colisoes acumuladas podem alongar a busca.'),
  cq(22, 'TRIE e PATRICIA', 'trie', 'trie', 'intermediario',
    'Qual comparacao esta correta?',
    'Hash e boa para busca exata; TRIE percorre caracteres e encontra prefixos naturalmente; PATRICIA comprime caminhos; folha distingue palavra de prefixo.',
    'Alcancar o ultimo caractere basta mesmo sem folha.',
    'TRIE nao serve para prefixos.',
    'PATRICIA expande todos os caminhos sem compressao.',
    'o marcador folha evita confundir prefixo com palavra completa.'),
  cq(23, 'Complexidade de hibridas', 'doidona', 'doidona', 'avancado',
    'Uma pesquisa passa por ABB de categorias, hash e lista de colisoes. Qual expressao preserva as camadas?',
    'O(h + 1 + k) em hash media constante, ou O(h+k); no pior caso h e k podem ser lineares.',
    'Sempre O(1), pois existe uma hash no meio.',
    'Sempre O(log n), pois comeca em ABB.',
    'A lista de colisoes nunca entra na complexidade.',
    'a notacao deve explicitar cada camada percorrida.'),
  cq(24, 'Prove ou refute - bloco II', 'complexidade', 'arvore', 'desafio',
    'Qual vetor de respostas segue o gabarito?',
    'a V, b F, c F, d F, e V, f V, g F, h V.',
    'a F, b V, c V, d V, e F, f F, g V, h F.',
    'Todas sao verdadeiras.',
    'Todas sao falsas.',
    'AVL e ABB; ABB nao e necessariamente alvinegra; hash nao garante pior caso constante.'),
];

const drawingQuestions: ConceptualDrawingQuestion[] = [
  dq(25, 'Lista sequencial: deslocamentos', 'lista', 'vetores', 'basico',
    'Lista sequencial (vetor + n) iniciando com [4, 7, 9, 15]. Aplique nesta ordem: inserirInicio(2); inserir(8, 3); remover(4) — aqui 4 e a POSICAO removida, nao o valor; e removerFim(). Qual alternativa mostra o vetor final?',
    'b',
    [
      option('a', 'A. remove o valor 4, mantendo 9', 'Confunde remover(4) como valor.', visual('array', 'A', 'Remove valor 4', ['2', '7', '8', '9'])),
      option('b', 'B. [2,4,7,8] com n=4', 'Correto: o gabarito trata remover(4) como posicao que remove 9.', visual('array', 'B', 'Final correto', ['2', '4', '7', '8'])),
      option('c', 'C. [4,7,8,15]', 'Faltou inserir no inicio.', visual('array', 'C', 'Sem inserirInicio', ['4', '7', '8', '15'])),
      option('d', 'D. [2,4,7,8,15]', 'Faltou removerFim.', visual('array', 'D', 'Antes do removerFim', ['2', '4', '7', '8', '15'])),
    ],
    'estado final [2,4,7,8]; observacao: remover(4) foi interpretado como posicao no gabarito.'),
  dq(26, 'Fila circular: retorno ao inicio', 'fila', 'vetores', 'intermediario',
    'Escolha a ordem logica final da fila circular.',
    'a',
    [
      option('a', 'A. 40,50,60,70,80', 'Correto.', visual('queue', 'A', 'Ordem logica final', ['40', '50', '60', '70', '80'])),
      option('b', 'B. 10,20,30,40,80', 'Inclui elementos ja removidos.', visual('queue', 'B', 'Removidos ainda aparecem', ['10', '20', '30', '40', '80'])),
      option('c', 'C. 50,60,70,80', 'Perde o 40.', visual('queue', 'C', 'Perde primeiro logico', ['50', '60', '70', '80'])),
      option('d', 'D. 80,40,50,60,70', 'Confunde ordem fisica com logica.', visual('queue', 'D', 'Ordem fisica', ['80', '40', '50', '60', '70'])),
    ],
    'final logico 40,50,60,70,80 com primeiro apontando para 40.'),
  dq(27, 'Pilha e fila em sequencia', 'pilha', 'vetores', 'basico',
    'Escolha a combinacao correta dos estados finais.',
    'c',
    [
      option('a', 'A. pilha 5,2; fila 3,8', 'Esses sao valores removidos trocados.', visual('stack', 'A', 'Pilha errada', ['5', '2'])),
      option('b', 'B. pilha 3,8; fila 2,5', 'Inverte a leitura da fila.', visual('queue', 'B', 'Fila invertida', ['2', '5'])),
      option('c', 'C. pilha topo 8 sobre 3; fila 5,2', 'Correto.', visual('stack', 'C', 'Pilha final', ['3', '8'])),
      option('d', 'D. ambas terminam 3,8,5,2', 'Ignora remocoes.', visual('queue', 'D', 'Sem remocoes', ['3', '8', '5', '2'])),
    ],
    'pilha remove 5 e 2; fila remove 3 e 8.'),
  dq(28, 'Lista simples: insercao e remocao', 'lista', 'vetores', 'intermediario',
    'Escolha a lista final apos as operacoes.',
    'd',
    [
      option('a', 'A. 5->7->9->12', 'Estado antes das remocoes.', visual('list', 'A', 'Antes das remocoes', ['5', '7', '9', '12'])),
      option('b', 'B. 7->9->12', 'Faltou remover a posicao 1.', visual('list', 'B', 'Apos remover inicio', ['7', '9', '12'])),
      option('c', 'C. 5->12', 'Removeu itens errados.', visual('list', 'C', 'Removeu demais', ['5', '12'])),
      option('d', 'D. 7->12', 'Correto.', visual('list', 'D', 'Final correto', ['7', '12'])),
    ],
    'depois de inserir 7, remove inicio e remove posicao 1, sobrando 7->12.'),
  dq(29, 'Lista dupla: religacao', 'lista', 'vetores', 'intermediario',
    'Escolha o estado final da lista dupla.',
    'a',
    [
      option('a', 'A. 4<->15<->10', 'Correto: ultimo passa a ser 10.', visual('list', 'A', 'Lista dupla final', ['4', '15', '10'])),
      option('b', 'B. 4<->10<->15', 'Inseriu 10 no lugar errado.', visual('list', 'B', 'Ordem errada', ['4', '10', '15'])),
      option('c', 'C. 4<->15<->10<->16', 'Faltou remover fim.', visual('list', 'C', 'Antes do fim', ['4', '15', '10', '16'])),
      option('d', 'D. 8<->15<->10', 'Nao removeu 8.', visual('list', 'D', 'Removeu errado', ['8', '15', '10'])),
    ],
    'remove 8, insere 10 entre 15 e 16 e remove o fim 16.'),
  dq(30, 'Matriz encadeada e diagonal', 'matriz', 'vetores', 'reavaliacao',
    'Escolha o caminho da diagonal principal.',
    'b',
    [
      option('a', 'A. 1->2->3', 'Percorre linha, nao diagonal.', visual('matrix', 'A', 'Linha superior', ['1', '2', '3', '4', '5', '6', '7', '8', '9'])),
      option('b', 'B. 1->5->9', 'Correto.', visual('matrix', 'B', 'Diagonal principal', ['1', '2', '3', '4', '5', '6', '7', '8', '9'])),
      option('c', 'C. 3->5->7', 'Diagonal secundaria.', visual('matrix', 'C', 'Diagonal secundaria', ['3', '2', '1', '4', '5', '6', '9', '8', '7'])),
      option('d', 'D. cabecas da matriz', 'Sentinelas nao sao dados.', visual('list', 'D', 'Cabecas', ['cabeca', 'linha', 'coluna'])),
    ],
    'caminho (0,0)->inf.dir->inf.dir; as listas associadas a 1,5,9 nao foram detalhadas no enunciado.'),
  dq(31, 'Bubble Sort passo a passo', 'ordenacao', 'ordenacao', 'intermediario',
    'Escolha a sequencia de passagens correta.',
    'c',
    [
      option('a', 'A. [7,5,4,2,1]', 'Ordenou ao contrario.', visual('array', 'A', 'Decrescente', ['7', '5', '4', '2', '1'])),
      option('b', 'B. [2,5,1,7,4]', 'Parou no meio da primeira passagem.', visual('array', 'B', 'Parcial', ['2', '5', '1', '7', '4'])),
      option('c', 'C. [2,5,1,4,7] -> [2,1,4,5,7] -> [1,2,4,5,7]', 'Correto.', visual('array', 'C', 'Final ordenado', ['1', '2', '4', '5', '7'])),
      option('d', 'D. [1,2,4,7,5]', 'Faltou ultima troca.', visual('array', 'D', 'Quase final', ['1', '2', '4', '7', '5'])),
    ],
    'as passagens do gabarito terminam em [1,2,4,5,7].'),
  dq(32, 'Insertion impar/par', 'ordenacao', 'ordenacao', 'reavaliacao',
    'Escolha o vetor final da insercao que prioriza impares.',
    'a',
    [
      option('a', 'A. [1,3,5,7,9,0,2,4,6,8]', 'Correto.', visual('array', 'A', 'Impares e pares ordenados', ['1', '3', '5', '7', '9', '0', '2', '4', '6', '8'])),
      option('b', 'B. [0,1,2,3,4,5,6,7,8,9]', 'Ordenacao comum.', visual('array', 'B', 'Crescente comum', ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])),
      option('c', 'C. [9,7,5,3,1,8,6,4,2,0]', 'Grupos decrescentes.', visual('array', 'C', 'Decrescente por grupo', ['9', '7', '5', '3', '1', '8', '6', '4', '2', '0'])),
      option('d', 'D. [1,3,9,5,7,0,2,4,6,8]', 'Impares fora de ordem.', visual('array', 'D', 'Impares fora de ordem', ['1', '3', '9', '5', '7', '0', '2', '4', '6', '8'])),
    ],
    'impares antes dos pares e cada grupo em ordem crescente.'),
  dq(33, 'Merge Sort', 'ordenacao', 'ordenacao', 'intermediario',
    'Escolha a intercalacao final correta para [38,27,43,3,9,82,10].',
    'd',
    [
      option('a', 'A. [38,27,43,3,9,82,10]', 'Sem ordenar.', visual('array', 'A', 'Entrada original', ['38', '27', '43', '3', '9', '82', '10'])),
      option('b', 'B. [3,27,38,43,9,10,82]', 'So ordenou metades.', visual('array', 'B', 'Metades', ['3', '27', '38', '43', '9', '10', '82'])),
      option('c', 'C. [82,43,38,27,10,9,3]', 'Decrescente.', visual('array', 'C', 'Decrescente', ['82', '43', '38', '27', '10', '9', '3'])),
      option('d', 'D. [3,9,10,27,38,43,82]', 'Correto.', visual('array', 'D', 'Final correto', ['3', '9', '10', '27', '38', '43', '82'])),
    ],
    'divisoes unitarias e intercala final crescente.'),
  dq(34, 'Particionamento QuickSort', 'ordenacao', 'ordenacao', 'avancado',
    'Escolha uma particao compativel com pivo 3 no codigo classico.',
    'b',
    [
      option('a', 'A. [9,4,8,3,1,2,5]', 'Sem particionar.', visual('array', 'A', 'Entrada', ['9', '4', '8', '3', '1', '2', '5'])),
      option('b', 'B. [2,1,3,8,4,9,5]', 'Correto segundo uma execucao possivel do gabarito.', visual('array', 'B', 'Particao possivel', ['2', '1', '3', '8', '4', '9', '5'])),
      option('c', 'C. [1,2,3,4,5,8,9]', 'Isso ja e vetor ordenado, nao apenas particao.', visual('array', 'C', 'Ordenado', ['1', '2', '3', '4', '5', '8', '9'])),
      option('d', 'D. [8,4,9,5,3,2,1]', 'Menores ficaram a direita.', visual('array', 'D', 'Lados invertidos', ['8', '4', '9', '5', '3', '2', '1'])),
    ],
    'o gabarito admite pequenas diferencas se o laco exato mudar, mas exige particionar pelo pivo 3.'),
  dq(35, 'Construcao e percursos da ABB', 'arvore', 'arvore', 'basico',
    'Escolha a ABB correta para as insercoes dadas.',
    'a',
    [
      option('a', 'A. raiz 15; esquerda 8; direita 22', 'Correto.', visual('binary-tree', 'A', 'ABB correta', ['15', '8', '22', '4', '12', '18', '30', '10', '14'])),
      option('b', 'B. raiz 8', 'Raiz errada.', visual('binary-tree', 'B', 'Raiz errada', ['8', '4', '15', '12', '22', '10', '14', '18', '30'])),
      option('c', 'C. 12 antes de 8', 'Quebra ordem de insercao/ABB.', visual('binary-tree', 'C', 'Ordem quebrada', ['15', '12', '22', '8', '14', '18', '30', '4', '10'])),
      option('d', 'D. vetor ordenado sem arvore', 'Nao representa a ABB.', visual('array', 'D', 'Apenas central', ['4', '8', '10', '12', '14', '15', '18', '22', '30'])),
    ],
    'central 4 8 10 12 14 15 18 22 30; pre e pos seguem da arvore desenhada.'),
  dq(36, 'Remocoes na ABB', 'arvore', 'arvore', 'intermediario',
    'Escolha o estado apos remover 10, 12 e 15 usando maiorEsq.',
    'c',
    [
      option('a', 'A. raiz continua 15', 'Faltou remover a raiz.', visual('binary-tree', 'A', 'Raiz antiga', ['15', '8', '22', '4', '14', '18', '30'])),
      option('b', 'B. raiz vira 18', 'Usou sucessor, nao maiorEsq.', visual('binary-tree', 'B', 'Sucessor', ['18', '8', '22', '4', '14', '', '30'])),
      option('c', 'C. raiz vira 14', 'Correto: maior da esquerda substitui 15.', visual('binary-tree', 'C', 'Predecessor maiorEsq', ['14', '8', '22', '4', '', '18', '30'])),
      option('d', 'D. 12 permanece', 'Faltou remover 12.', visual('binary-tree', 'D', '12 ainda presente', ['14', '8', '22', '4', '12', '18', '30'])),
    ],
    '10 sai como folha, 12 e substituido por 14, 15 usa maiorEsq=14.'),
  dq(37, 'TreeSort', 'arvore', 'arvore', 'intermediario',
    'Escolha o caminhamento central que gera o vetor ordenado.',
    'b',
    [
      option('a', 'A. 7,3,9,1,5,8,10', 'Ordem de insercao.', visual('binary-tree', 'A', 'Insercao', ['7', '3', '9', '1', '5', '8', '10'])),
      option('b', 'B. 1,3,5,7,8,9,10', 'Correto.', visual('array', 'B', 'Central ordenado', ['1', '3', '5', '7', '8', '9', '10'])),
      option('c', 'C. 7,3,1,5,9,8,10', 'Pre-ordem.', visual('array', 'C', 'Pre-ordem', ['7', '3', '1', '5', '9', '8', '10'])),
      option('d', 'D. 1,5,3,8,10,9,7', 'Pos-ordem.', visual('array', 'D', 'Pos-ordem', ['1', '5', '3', '8', '10', '9', '7'])),
    ],
    'TreeSort usa caminhamento central da ABB para preencher 7 posicoes.'),
  dq(38, 'Quatro rotacoes AVL', 'avl', 'avl', 'intermediario',
    'Escolha a correspondencia correta para LL, RR, LR e RL.',
    'a',
    [
      option('a', 'A. 30,20,10 -> direita; 10,20,30 -> esquerda; 30,10,20 -> esquerda+direita; 10,30,20 -> direita+esquerda', 'Correto.', visual('avl', 'A', 'Rotacoes classicas', ['30', '20', '10'])),
      option('b', 'B. Todas usam rotacao direita', 'Ignora o lado pesado.', visual('avl', 'B', 'So direita', ['10', '20', '30'])),
      option('c', 'C. Todas usam rotacao esquerda', 'Ignora casos a esquerda.', visual('avl', 'C', 'So esquerda', ['30', '10', '20'])),
      option('d', 'D. Casos duplos dispensam duas rotacoes', 'Casos LR/RL precisam rotacao dupla.', visual('avl', 'D', 'Dupla omitida', ['10', '30', '20'])),
    ],
    'as quatro sequencias produzem os quatro tipos de rotacao.'),
  dq(39, 'AVL completa', 'avl', 'avl', 'reavaliacao',
    'Escolha a arvore final indicada pelo gabarito.',
    'd',
    [
      option('a', 'A. raiz 8', 'Raiz incorreta.', visual('avl', 'A', 'Raiz 8', ['8', '4', '18', '2', '6', '12', '20'])),
      option('b', 'B. raiz 18', 'Raiz incorreta.', visual('avl', 'B', 'Raiz 18', ['18', '12', '20', '8', '14', '', '22'])),
      option('c', 'C. raiz 12 sem 16', 'Falta no 16.', visual('avl', 'C', 'Incompleta', ['12', '8', '18', '4', '10', '14', '20', '2', '6', '', '', '', '', '', '22'])),
      option('d', 'D. raiz 12; esquerda 8; direita 18; 14 tem dir 16; 20 tem dir 22', 'Correto.', visual('avl', 'D', 'Final correto', ['12', '8', '18', '4', '10', '14', '20', '2', '6', '', '', '', '16', '', '22'])),
    ],
    'raiz 12 com fatores listados no gabarito.'),
  dq(40, '2-3-4 na descida', 'arvore234', 'arvore', 'reavaliacao',
    'Escolha a arvore 2-3-4 final.',
    'b',
    [
      option('a', 'A. raiz [12]', 'Raiz fragmentada demais.', visual('tree234', 'A', 'Raiz simples', ['[12]', '[4|8]', '[14|18|20]'])),
      option('b', 'B. raiz [8|12|18] com filhos [2|4|6], [10], [14|16], [20|22]', 'Correto.', visual('tree234', 'B', 'Final correto', ['[8|12|18]', '[2|4|6]', '[10]', '[14|16]', '[20|22]'])),
      option('c', 'C. raiz [4|8|12|18]', 'No tem quatro chaves, invalido.', visual('tree234', 'C', 'No invalido', ['[4|8|12|18]', '[2]', '[6]', '[10]', '[14|16|20|22]'])),
      option('d', 'D. todos em uma folha', 'Nao fragmentou 4-nos.', visual('tree234', 'D', 'Sem fragmentar', ['[2|4|6|8|10|12|14|16|18|20|22]'])),
    ],
    'raiz [8|12|18] e quatro filhos.'),
  dq(41, '2-3-4 por ascensao', 'arvore234', 'arvore', 'avancado',
    'Qual comparacao com a fragmentacao na descida esta correta?',
    'a',
    [
      option('a', 'A. A arvore final e a mesma da Q40; muda o momento de tratar overflow.', 'Correto.', visual('tree234', 'A', 'Mesmo final', ['[8|12|18]', '[2|4|6]', '[10]', '[14|16]', '[20|22]'])),
      option('b', 'B. A raiz final deve ser [4|20].', 'Final incorreto.', visual('tree234', 'B', 'Raiz errada', ['[4|20]', '[2]', '[6|8|10|12|14|16|18]', '[22]'])),
      option('c', 'C. O overflow nunca propaga.', 'Pode propagar.', visual('tree234', 'C', 'Overflow preso', ['[8|12]', '[2|4|6]', '[10|14|16|18|20|22]'])),
      option('d', 'D. Ascensao elimina folhas.', 'Ainda ha folhas no mesmo nivel.', visual('tree234', 'D', 'Estrutura invalida', ['[8|12|18]'])),
    ],
    'o gabarito informa final igual ao da Q40.'),
  dq(42, 'Arvore alvinegra', 'alvinegra', 'avl', 'reavaliacao',
    'Escolha uma representacao final compativel com o gabarito.',
    'c',
    [
      option('a', 'A. raiz 8B', 'Raiz errada.', visual('red-black', 'A', 'Raiz errada', ['8B', '4P', '12P', '2B', '6B', '10B', '18B'])),
      option('b', 'B. dois P consecutivos no ramo direito', 'Viola a invariante.', visual('red-black', 'B', 'Conflito de cor', ['12B', '8P', '18P', '4B', '10B', '14P', '20P', '2P', '6P', '', '', '', '16P', '', '22P'])),
      option('c', 'C. 12B; esquerda 8P; direita 18P; 4B com 2P/6P; 14B dir 16P; 20B dir 22P', 'Correto.', visual('red-black', 'C', 'Final compativel', ['12B', '8P', '18P', '4B', '10B', '14B', '20B', '2P', '6P', '', '', '', '16P', '', '22P'])),
      option('d', 'D. todos os nos brancos', 'Nao representa 3/4-nos.', visual('red-black', 'D', 'Sem cores', ['12B', '8B', '18B', '4B', '10B', '14B', '20B'])),
    ],
    'representacao final compativel com recoloracoes e rotacoes do material.'),
  dq(43, 'Hash: tres estrategias', 'hash', 'hash', 'intermediario',
    'Escolha o encadeamento separado correto para h(x)=x mod 7.',
    'a',
    [
      option('a', 'A. 0:14->21; 1:8->15->22; 3:3->10', 'Correto.', visual('hash', 'A', 'Encadeamento correto', ['14', '21', '8', '15', '22', '3', '10'])),
      option('b', 'B. 0:14; 1:21->8; 3:15->22->3->10', 'Usou indices errados.', visual('hash', 'B', 'Indices errados', ['14', '21', '8', '15'])),
      option('c', 'C. todos na reserva', 'Ignora posicoes principais.', visual('hash', 'C', 'So reserva', ['14', '21', '8', '15', '22'])),
      option('d', 'D. pesquisa 22 falha', '22 esta no bucket 1.', visual('hash', 'D', 'Falha indevida', ['22'])),
    ],
    'encadeamento por resto: 14/21 no 0, 8/15/22 no 1, 3/10 no 3.'),
  dq(44, 'TRIE, PATRICIA e doidona', 'trie', 'trie', 'desafio',
    'Escolha a representacao coerente para BRASIL, BRASA, BRAVO, CHILE e CHINA.',
    'd',
    [
      option('a', 'A. BRASIL, BRASA e BRAVO nao compartilham prefixo', 'Deveriam compartilhar BRA.', visual('trie', 'A', 'Sem compartilhamento', ['B', 'R', 'A', 'S', 'I', 'L', 'fim'])),
      option('b', 'B. CHILE e CHINA terminam no mesmo no', 'Finais sao diferentes.', visual('trie', 'B', 'Final confundido', ['C', 'H', 'I', 'fim'])),
      option('c', 'C. PATRICIA nao comprime segmentos', 'Contradiz a compressao.', visual('patricia', 'C', 'Sem compressao', ['B', 'R', 'A', 'S', 'I'])),
      option('d', 'D. TRIE compartilha BRA e CHI; PATRICIA comprime; doidona busca BRASA por B -> hash tamanho 5 -> lista/ABB', 'Correto.', visual('patricia', 'D', 'PATRICIA comprimida', ['BRA', 'S', 'IL', 'A', 'VO'])),
    ],
    'o desenho da doidona e aberto, mas o caminho BRASA deve respeitar as camadas descritas.'),
];

export const conceptualDrawingCatalog: ConceptualDrawingQuestion[] = [
  ...conceptualQuestions,
  ...drawingQuestions,
];

function getQuestionsByType(questionType: ConceptualDrawingType): ConceptualDrawingQuestion[] {
  return conceptualDrawingCatalog.filter((question) => question.type === questionType);
}

function countByModule(questionType: ConceptualDrawingType): Map<ContentModuleId, number> {
  const counts = new Map<ContentModuleId, number>();
  for (const question of getQuestionsByType(questionType)) {
    counts.set(question.moduleId, (counts.get(question.moduleId) ?? 0) + 1);
  }
  return counts;
}

export function getConceptualDrawingModules(questionType: ConceptualDrawingType): ConceptualDrawingModule[] {
  const typedQuestions = getQuestionsByType(questionType);
  const moduleCounts = countByModule(questionType);
  const specificModules: ConceptualDrawingModule[] = contentModuleCatalog
    .filter((module) => (moduleCounts.get(module.id) ?? 0) > 0)
    .map((module) => ({
      id: module.id,
      title: module.title,
      description: module.description,
      count: moduleCounts.get(module.id) ?? 0,
    }));

  const modules: ConceptualDrawingModule[] = [
    {
      id: 'all',
      title: 'Conteudo inteiro',
      description:
        questionType === 'conceitual'
          ? 'Mistura todas as questoes conceituais da Lista 2.'
          : 'Mistura todas as questoes de desenho da Lista 2.',
      count: typedQuestions.length,
    },
    ...specificModules,
  ];

  return modules.filter((module) => module.count > 0);
}

export function getQuestionsForConceptualDrawingModule(
  moduleId: ConceptualDrawingModuleId,
  questionType: ConceptualDrawingType,
): ConceptualDrawingQuestion[] {
  const typedQuestions = getQuestionsByType(questionType);

  if (moduleId === 'all') {
    return typedQuestions;
  }

  return typedQuestions.filter((question) => question.moduleId === moduleId);
}

export function getConceptualDrawingModuleTitle(moduleId: ConceptualDrawingModuleId): string {
  if (moduleId === 'all') return 'Conteudo inteiro';
  return getContentModule(moduleId).title;
}
