import type { StructureVisual } from '../types/content';
import { avlToViz, balance, insertPlain, rebalance, type AvlNode } from './avlModel';
import { defaultDoidonaConfig, doidonaScene } from './doidona';
import { buildLevelOrderTree, e, layoutTree, n, p, snap, type TreeNode } from './sceneUtils';
import { staticSceneForVisual } from './staticScenes';
import type { VizEdge, VizFrame, VizNode, VizScene } from './vizTypes';

/* =====================================================================
   Cenas usadas pelos visuais das questões (simulado e treino).
   As operações interativas da aba "Estruturas" vivem em structureOps.ts.
   ===================================================================== */

/* ---------- TABELA HASH — inserção com colisão (visual de questão) ---------- */

export function hashScene(collidingKey = 30): VizScene {
  const code = [
    'inserir(chave):',
    '  pos = chave % 7',
    '  se tabela[pos] está livre:',
    '    tabela[pos] = chave',
    '  senão:  // colisão!',
    '    encadeia na posição pos',
  ];

  const y = 196;
  const slotX = (index: number) => 55 + index * 58;
  const slots: VizNode[] = Array.from({ length: 7 }, (_, index) =>
    n(`slot${index}`, slotX(index), y, '', { shape: 'slot', w: 50, h: 46, sub: `${index}` }),
  );

  const fixos: VizNode[] = [];
  const frames: VizFrame[] = [];
  const chave = collidingKey;
  const posColisao = ((chave % 7) + 7) % 7;
  const ocupante = posColisao === 2 ? 23 : posColisao + 16;

  frames.push(snap([...slots], [], [], 'Tabela hash: a chave vira índice por uma função de espalhamento.', undefined));

  const k42 = n('h42', 230, 66, '42', { shape: 'pill', w: 56, h: 34, state: 'inserted' });
  frames.push(snap([...slots, k42], [], [], 'inserir(42): a chave chega para ser posicionada.', 0, [{ name: 'chave', value: '42' }]));
  frames.push(snap([...slots, k42], [], [p('slot0', 'pos', 'bottom', 'warning')], 'hash: 42 % 7 = 0. O índice sai direto da conta.', 1, [{ name: 'pos', value: '0' }]));

  k42.x = slotX(0);
  k42.y = y;
  frames.push(snap([...slots, k42], [], [], 'Posição 0 livre: 42 entra sem comparação nenhuma.', 3, [{ name: 'pos', value: '0' }]));
  k42.state = 'default';
  fixos.push(k42);

  const kOcupante = n('hocc', slotX(posColisao), y, `${ocupante}`, { shape: 'pill', w: 56, h: 34 });
  fixos.push(kOcupante);
  frames.push(snap([...slots, ...fixos], [], [], `${ocupante} já ocupa a posição ${posColisao} (${ocupante} % 7 = ${posColisao}).`, 3, [{ name: 'pos', value: `${posColisao}` }]));

  const kNova = n('hnew', 230, 66, `${chave}`, { shape: 'pill', w: 56, h: 34, state: 'inserted' });
  frames.push(snap([...slots, ...fixos, kNova], [], [p(`slot${posColisao}`, 'pos', 'bottom', 'warning')], `inserir(${chave}): ${chave} % 7 = ${posColisao} de novo…`, 1, [{ name: 'chave', value: `${chave}` }, { name: 'pos', value: `${posColisao}` }]));

  kOcupante.state = 'compare';
  kNova.state = 'error';
  frames.push(snap([...slots, ...fixos, kNova], [], [p(`slot${posColisao}`, 'pos', 'bottom', 'warning')], 'Colisão! Duas chaves disputam o mesmo índice.', 4, [{ name: 'pos', value: `${posColisao}` }]));

  kNova.state = 'inserted';
  kNova.x = slotX(posColisao);
  kNova.y = y + 72;
  const corrente = [e('hocc', 'hnew', { arrow: true, state: 'inserted' })];
  frames.push(snap([...slots, ...fixos, kNova], corrente, [], 'Colisão não é ausência: a chave desvia para a estrutura reserva.', 5, [{ name: 'pos', value: `${posColisao}` }]));

  kOcupante.state = 'default';
  kNova.state = 'default';
  frames.push(snap([...slots, ...fixos, kNova], corrente, [], 'Busca média O(1); a colisão vira uma lista curta na posição.', 5));

  return { operation: `inserir(42) e inserir(${chave}) com colisão`, complexity: 'O(1) médio', code, frames, width: 460, height: 320 };
}

/* ---------- ÁRVORE BINÁRIA — percurso recursivo ---------- */

export function binaryTreeTraversalScene(labels: string[]): VizScene {
  const code = [
    'visitar(no):',
    '  se no == null: retorna',
    '  processa(no.valor)',
    '  visitar(no.esq)',
    '  visitar(no.dir)',
  ];

  const root = buildLevelOrderTree(labels) ?? buildLevelOrderTree(['A', 'B', 'C'])!;
  const positions = layoutTree(root, 460, { top: 52, levelGap: 78 });

  const nodes: VizNode[] = [];
  const edges: VizEdge[] = [];
  const preOrder: string[] = [];

  (function collect(node: TreeNode) {
    const at = positions.get(node.id)!;
    nodes.push(n(node.id, at.x, at.y, node.label));
    preOrder.push(node.id);
    if (node.left) {
      edges.push(e(node.id, node.left.id));
      collect(node.left);
    }
    if (node.right) {
      edges.push(e(node.id, node.right.id));
      collect(node.right);
    }
  })(root);

  const raiz = p(root.id, 'RAIZ', 'top', 'accent');
  const frames: VizFrame[] = [];
  frames.push(snap(nodes, edges, [raiz], 'A recursão parte da raiz e desce até os ponteiros nulos.', 0));

  for (const id of preOrder) {
    const alvo = nodes.find((node) => node.id === id)!;
    alvo.state = 'active';
    frames.push(snap(nodes, edges, [raiz], `Visita o nó ${alvo.label}: processa e desce para os filhos.`, 2, [{ name: 'no', value: alvo.label }]));
    alvo.state = 'visited';
  }

  frames.push(snap(nodes, edges, [raiz], 'Cada nó real é visitado exatamente uma vez → custo O(n).', 4, [{ name: 'visitados', value: `${preOrder.length}` }]));

  return { operation: 'percurso recursivo', complexity: 'O(n)', code, frames, width: 460, height: 300 };
}

/* ---------- AVL — sequência de inserções com rotações ---------- */

export function avlScene(values: number[]): VizScene {
  const code = [
    'inserir(no, x):',
    '  desce comparando, como na ABB',
    '  cria a folha x',
    '  recalcula fb = h(esq) - h(dir)',
    '  se fb = +2 ou -2: rotaciona',
  ];

  const frames: VizFrame[] = [];
  let tree: AvlNode | undefined;

  const pushFrame = (
    caption: string,
    codeLine: number | undefined,
    marks: Record<number, VizNode['state']>,
    vars?: Array<{ name: string; value: string }>,
  ) => {
    const { nodes, edges, rootId } = avlToViz(tree, 460);
    for (const node of nodes) {
      const key = Number(node.label);
      if (marks[key]) node.state = marks[key];
    }
    frames.push(snap(nodes, edges, rootId ? [p(rootId, 'RAIZ', 'top', 'accent')] : [], caption, codeLine, vars));
  };

  for (const value of values) {
    if (!tree) {
      tree = { key: value };
      pushFrame(`inserir(${value}): a árvore estava vazia, ${value} vira a raiz.`, 2, { [value]: 'inserted' }, [{ name: 'x', value: `${value}` }]);
      continue;
    }

    let cursor: AvlNode | undefined = tree;
    while (cursor) {
      pushFrame(
        `inserir(${value}): ${value} ${value < cursor.key ? '<' : '>'} ${cursor.key} → desce para a ${value < cursor.key ? 'esquerda' : 'direita'}.`,
        1,
        { [cursor.key]: 'compare', [value]: 'inserted' },
        [{ name: 'x', value: `${value}` }, { name: 'no', value: `${cursor.key}` }],
      );
      cursor = value < cursor.key ? cursor.left : cursor.right;
    }

    tree = insertPlain(tree, value);
    pushFrame(`${value} entra como folha. Hora de conferir os fatores.`, 2, { [value]: 'inserted' }, [{ name: 'x', value: `${value}` }]);

    const factorRoot = tree ? balance(tree) : 0;
    const { node: balanced, rotation, pivot } = rebalance(tree);

    if (rotation && pivot !== undefined) {
      pushFrame(`fb saiu do intervalo [-1, 1] → ${rotation} no nó ${pivot}.`, 4, { [pivot]: 'error', [value]: 'inserted' }, [{ name: 'fb', value: `${factorRoot}` }]);
      tree = balanced;
      pushFrame(`Depois da ${rotation}, todos os fatores voltam para -1, 0 ou +1.`, 4, { [pivot]: 'found' }, [{ name: 'fb', value: '0' }]);
    } else {
      tree = balanced;
      pushFrame('Fatores dentro do intervalo: nenhuma rotação necessária.', 3, {}, [{ name: 'fb', value: `${factorRoot}` }]);
    }
  }

  pushFrame('AVL final: altura O(log n) garantida para busca, inserção e remoção.', 4, {});

  return { operation: `inserir ${values.join(', ')}`, complexity: 'O(log n)', code, frames, width: 460, height: 300 };
}

/* ---------- TRIE — caminho letra a letra (visual de questão) ---------- */

export function trieScene(labels: string[]): VizScene {
  const code = [
    'buscar(palavra):',
    '  no = raiz',
    '  para cada letra:',
    '    se filho não existe: falso',
    '    no = no.filho[letra]',
    '  retorna no.fim  // marcador!',
  ];

  const chars: string[] = [];
  const ends = new Set<number>();

  for (const raw of labels) {
    const label = raw.trim().toLowerCase();
    if (!label) continue;
    if (label === 'fim') {
      if (chars.length) ends.add(chars.length - 1);
    } else {
      chars.push(raw.trim());
    }
  }

  if (!chars.length) {
    chars.push('a', 'b');
    ends.add(1);
  }

  const stepX = Math.min(64, 340 / Math.max(chars.length, 1));
  const stepY = Math.min(46, 220 / Math.max(chars.length, 1));
  const nodes: VizNode[] = [n('root', 80, 54, '•')];
  const edges: VizEdge[] = [];

  chars.forEach((char, index) => {
    const id = `c${index}`;
    nodes.push(
      n(id, 80 + (index + 1) * stepX, 54 + (index + 1) * stepY, char, {
        sub: ends.has(index) ? '✓ fim' : undefined,
      }),
    );
    edges.push(e(index === 0 ? 'root' : `c${index - 1}`, id));
  });

  const raiz = p('root', 'RAIZ', 'top', 'accent');
  const lastEnd = Math.max(...(ends.size ? [...ends] : [chars.length - 1]));
  const word = chars.slice(0, lastEnd + 1).join('');
  const frames: VizFrame[] = [];

  frames.push(snap(nodes, edges, [raiz], 'TRIE: cada nível guarda uma letra; palavras terminam no marcador fim.', 1));

  for (let i = 0; i <= lastEnd; i += 1) {
    nodes[i + 1].state = 'compare';
    frames.push(snap(nodes, edges, [raiz], `Letra '${chars[i]}' existe como filho → desce um nível.`, 4, [{ name: 'letra', value: chars[i] }, { name: 'nível', value: `${i + 1}` }]));
    nodes[i + 1].state = 'visited';
  }

  nodes[lastEnd + 1].state = 'found';
  frames.push(snap(nodes, edges, [raiz], `Fim das letras e o nó tem marcador ✓ → "${word}" é palavra.`, 5, [{ name: 'no.fim', value: 'true' }]));

  const extraIndex = lastEnd + 1 < chars.length ? lastEnd + 1 : lastEnd > 0 ? lastEnd - 1 : -1;

  if (extraIndex >= 0) {
    const alvoPrefixo = chars.slice(0, extraIndex + 1).join('');
    for (const node of nodes) node.state = 'default';

    for (let i = 0; i <= extraIndex; i += 1) {
      nodes[i + 1].state = 'visited';
    }

    if (!ends.has(extraIndex)) {
      nodes[extraIndex + 1].state = 'error';
      frames.push(snap(nodes, edges, [raiz], `Já buscar "${alvoPrefixo}": o caminho existe, mas SEM marcador fim → é só prefixo, não palavra.`, 5, [{ name: 'no.fim', value: 'false' }]));
    } else {
      nodes[extraIndex + 1].state = 'found';
      frames.push(snap(nodes, edges, [raiz], `"${alvoPrefixo}" também tem marcador fim: duas palavras no mesmo caminho.`, 5, [{ name: 'no.fim', value: 'true' }]));
    }
  }

  frames.push(snap(nodes, edges, [raiz], 'Custo proporcional ao tamanho da palavra: O(k), independe de quantas palavras existem.', 5, [{ name: 'k', value: `${lastEnd + 1}` }]));

  return { operation: `buscar("${word}")`, complexity: 'O(k)', code, frames, width: 460, height: Math.max(280, 120 + (chars.length + 1) * stepY) };
}

/* ---------- VETOR — varredura de laço (somatórios) ---------- */

export function arraySweepScene(labels: string[]): VizScene {
  const code = ['para i = 0 até n-1:', '  processa vetor[i]', '// total = soma das execuções'];

  const itens = labels.filter((label) => label.trim());
  const count = Math.max(itens.length, 1);
  const width = 460;
  const cellW = Math.min(78, (width - 60) / count);
  const startX = width / 2 - (cellW * (count - 1)) / 2;

  const nodes: VizNode[] = itens.map((label, index) =>
    n(`cell${index}`, startX + index * cellW, 150, label, { shape: 'box', w: cellW - 10, h: 46, sub: `${index}` }),
  );

  const frames: VizFrame[] = [];
  frames.push(snap(nodes, [], [], 'Cada célula representa uma rodada do laço.', 0, [{ name: 'i', value: '0' }]));

  itens.forEach((label, index) => {
    nodes[index].state = 'active';
    frames.push(snap(nodes, [], [p(`cell${index}`, 'i', 'top', 'warning')], `i = ${index}: o laço executa "${label}".`, 1, [{ name: 'i', value: `${index}` }]));
    nodes[index].state = 'visited';
  });

  frames.push(snap(nodes, [], [], 'Somando as execuções de cada rodada nasce o somatório da questão.', 2, [{ name: 'rodadas', value: `${itens.length}` }]));

  return { operation: 'contar execuções do laço', complexity: 'soma dos termos', code, frames, width, height: 250 };
}

/* ---------- VETOR — passo do insertion sort ---------- */

export function insertionSortScene(values: number[]): VizScene {
  const code = [
    'para i = 1 até n-1:',
    '  chave = vetor[i]; j = i - 1',
    '  enquanto j >= 0 e vetor[j] > chave:',
    '    vetor[j+1] = vetor[j]; j--',
    '  vetor[j+1] = chave',
  ];

  let keyIndex = values.findIndex((value, index) => index > 0 && value < values[index - 1]);
  if (keyIndex < 0) keyIndex = values.length - 1;

  const width = 460;
  const count = values.length;
  const cellW = Math.min(80, (width - 60) / count);
  const startX = width / 2 - (cellW * (count - 1)) / 2;
  const rowY = 132;
  const cellX = (slot: number) => startX + slot * cellW;

  const nodes: VizNode[] = values.map((value, index) =>
    n(`v${index}`, cellX(index), rowY, `${value}`, { shape: 'box', w: cellW - 10, h: 46, sub: `${index}` }),
  );

  const slotOf = new Map(nodes.map((node, index) => [node.id, index]));
  const setSlot = (id: string, slot: number) => {
    const node = nodes.find((item) => item.id === id)!;
    node.x = cellX(slot);
    node.sub = `${slot}`;
    slotOf.set(id, slot);
  };

  const chave = values[keyIndex];
  const keyId = `v${keyIndex}`;
  const keyNode = nodes.find((node) => node.id === keyId)!;
  const frames: VizFrame[] = [];

  for (let i = 0; i < keyIndex; i += 1) nodes[i].state = 'visited';
  frames.push(snap(nodes, [], [], `Prefixo até a posição ${keyIndex - 1} já está ordenado.`, 0, [{ name: 'i', value: `${keyIndex}` }]));

  keyNode.state = 'active';
  keyNode.y = rowY + 84;
  frames.push(snap(nodes, [], [], `chave = ${chave} sai da posição ${keyIndex} para abrir espaço.`, 1, [{ name: 'chave', value: `${chave}` }, { name: 'j', value: `${keyIndex - 1}` }]));

  let j = keyIndex - 1;
  keyNode.x = cellX(keyIndex);

  while (j >= 0 && values[j] > chave) {
    const shifting = nodes.find((node) => node.id === `v${j}`)!;
    shifting.state = 'compare';
    frames.push(snap(nodes, [], [], `vetor[${j}] = ${values[j]} > ${chave} → desloca para a direita.`, 2, [{ name: 'chave', value: `${chave}` }, { name: 'j', value: `${j}` }]));

    setSlot(shifting.id, (slotOf.get(shifting.id) ?? j) + 1);
    shifting.state = 'visited';
    frames.push(snap(nodes, [], [], `${values[j]} ocupa a posição ${j + 1}; j recua.`, 3, [{ name: 'j', value: `${j - 1}` }]));
    j -= 1;
  }

  if (j >= 0) {
    const menor = nodes.find((node) => node.id === `v${j}`)!;
    menor.state = 'compare';
    frames.push(snap(nodes, [], [], `vetor[${j}] = ${values[j]} ≤ ${chave} → achou a abertura.`, 2, [{ name: 'j', value: `${j}` }]));
    menor.state = 'visited';
  }

  keyNode.y = rowY;
  keyNode.x = cellX(j + 1);
  keyNode.sub = `${j + 1}`;
  keyNode.state = 'inserted';
  frames.push(snap(nodes, [], [], `chave ${chave} entra na posição ${j + 1}: prefixo ordenado cresceu.`, 4, [{ name: 'chave', value: `${chave}` }]));

  for (const node of nodes) {
    if (Number(node.sub) <= keyIndex) node.state = 'visited';
  }
  keyNode.state = 'found';
  frames.push(snap(nodes, [], [], 'Melhor caso (já ordenado): O(n). Pior caso (invertido): O(n²).', 0, [{ name: 'deslocamentos', value: `${keyIndex - 1 - j}` }]));

  return { operation: `inserir chave ${chave} no prefixo ordenado`, complexity: 'O(n²) pior caso', code, frames, width, height: 290 };
}

/* ---------- VISUAIS ESTATICOS PARA ALTERNATIVAS DE DESENHO ---------- */

function linearStructureScene(labels: string[], kind: 'list' | 'queue' | 'stack'): VizScene {
  const items = labels.filter((label) => label.trim() !== '');
  const shown = items.length ? items : ['vazio'];
  const width = 460;
  const cellW = Math.min(78, (width - 70) / Math.max(shown.length, 1));
  const startX = width / 2 - (cellW * (shown.length - 1)) / 2;
  const y = kind === 'stack' ? 220 : 150;
  const nodes: VizNode[] = shown.map((label, index) =>
    n(`lin${index}`, kind === 'stack' ? width / 2 : startX + index * cellW, kind === 'stack' ? y - index * 48 : y, label, {
      shape: 'box',
      w: Math.max(46, cellW - 10),
      h: 40,
      state: index === 0 ? 'found' : 'default',
      sub: kind === 'queue' ? `${index}` : undefined,
    }),
  );
  const edges: VizEdge[] = [];

  for (let index = 0; index < nodes.length - 1; index++) {
    edges.push(e(nodes[index].id, nodes[index + 1].id, { arrow: true }));
  }

  const pointers =
    kind === 'stack'
      ? [p(nodes[nodes.length - 1].id, 'topo', 'top', 'accent')]
      : [p(nodes[0].id, 'primeiro', 'bottom', 'accent'), p(nodes[nodes.length - 1].id, 'ultimo', 'bottom', 'warning')];
  const label = kind === 'stack' ? 'pilha' : kind === 'queue' ? 'fila' : 'lista';

  return {
    operation: `estado de ${label}`,
    complexity: 'visual',
    code: ['estado final:', `  ${shown.join(kind === 'list' ? ' -> ' : ', ')}`],
    frames: [snap(nodes, edges, pointers, `Representacao visual do estado final da ${label}.`, undefined)],
    width,
    height: kind === 'stack' ? 290 : 250,
  };
}

function matrixStructureScene(labels: string[]): VizScene {
  const values = labels.filter((label) => label.trim() !== '');
  const shown = values.length >= 9 ? values.slice(0, 9) : ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const nodes: VizNode[] = [];
  const edges: VizEdge[] = [];
  const startX = 130;
  const startY = 78;
  const gap = 76;

  shown.forEach((label, index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    nodes.push(n(`m${index}`, startX + col * gap, startY + row * gap, label, {
      shape: 'box',
      w: 48,
      h: 40,
      state: row === col ? 'found' : 'default',
      sub: `${row},${col}`,
    }));
  });

  for (let index = 0; index < nodes.length; index++) {
    if (index % 3 < 2) edges.push(e(`m${index}`, `m${index + 1}`, { arrow: true }));
    if (index < 6) edges.push(e(`m${index}`, `m${index + 3}`, { arrow: true, dashed: true }));
  }

  return {
    operation: 'matriz encadeada',
    complexity: 'visual',
    code: ['diagonal:', '  avanca inf.dir'],
    frames: [snap(nodes, edges, [p('m0', 'inicio', 'top', 'accent')], 'Diagonal principal marcada na matriz encadeada.', 1)],
    width: 460,
    height: 310,
  };
}

function multiwayTreeScene(labels: string[], operation: string): VizScene {
  const shown = labels.filter((label) => label.trim() !== '');
  const rootLabel = shown[0] ?? '[8|12|18]';
  const childLabels = shown.length > 1 ? shown.slice(1, 5) : ['[2|4|6]', '[10]', '[14|16]', '[20|22]'];
  const nodes: VizNode[] = [n('root234', 230, 70, rootLabel, { shape: 'box', w: 104, h: 42, state: 'found' })];
  const edges: VizEdge[] = [];
  const startX = 82;

  childLabels.forEach((label, index) => {
    const id = `child234${index}`;
    nodes.push(n(id, startX + index * 98, 184, label, { shape: 'box', w: 82, h: 42 }));
    edges.push(e('root234', id));
  });

  return {
    operation,
    complexity: 'altura logaritmica',
    code: ['no 2-3-4:', '  chaves ordenadas', '  filhos entre intervalos'],
    frames: [snap(nodes, edges, [p('root234', 'raiz', 'top', 'accent')], 'No multi-chave com filhos separados por intervalos.', 1)],
    width: 460,
    height: 260,
  };
}

function redBlackStructureScene(labels: string[]): VizScene {
  const shown = labels.filter((label) => label.trim() !== '');
  const root = buildLevelOrderTree(shown.length ? shown : ['12B', '8P', '18P', '4B', '10B', '14B', '20B'])!;
  const positions = layoutTree(root, 460, { top: 52, levelGap: 78 });
  const nodes: VizNode[] = [];
  const edges: VizEdge[] = [];

  (function collect(node: TreeNode) {
    const at = positions.get(node.id)!;
    const raw = node.label;
    const color = raw.endsWith('P') ? 'P' : raw.endsWith('B') ? 'B' : '';
    const label = color ? raw.slice(0, -1) : raw;
    nodes.push(n(node.id, at.x, at.y, label, { sub: color, state: color === 'P' ? 'active' : 'default' }));
    if (node.left) {
      edges.push(e(node.id, node.left.id, { state: node.left.label.endsWith('P') ? 'active' : 'default' }));
      collect(node.left);
    }
    if (node.right) {
      edges.push(e(node.id, node.right.id, { state: node.right.label.endsWith('P') ? 'active' : 'default' }));
      collect(node.right);
    }
  })(root);

  return {
    operation: 'arvore alvinegra',
    complexity: 'O(log n)',
    code: ['verificar cores:', '  raiz branca', '  sem dois coloridos seguidos', '  mesma altura branca'],
    frames: [snap(nodes, edges, [p(root.id, 'raiz', 'top', 'accent')], 'B indica branco; P indica preto/colorido na convencao da questao.', 1)],
    width: 460,
    height: 300,
  };
}

function patriciaStructureScene(labels: string[]): VizScene {
  const segments = labels.filter((label) => label.trim() !== '');
  const shown = segments.length ? segments : ['BRA', 'S', 'IL', 'A', 'VO'];
  const nodes: VizNode[] = [n('pat-root', 80, 66, 'raiz', { shape: 'pill', w: 62, h: 34 })];
  const edges: VizEdge[] = [];

  shown.slice(0, 5).forEach((label, index) => {
    const id = `pat${index}`;
    nodes.push(n(id, 170 + (index % 3) * 96, 70 + Math.floor(index / 3) * 92, label, {
      shape: 'pill',
      w: 78,
      h: 34,
      state: index === 0 ? 'found' : 'default',
    }));
    edges.push(e(index === 0 ? 'pat-root' : `pat${Math.max(0, index - 1)}`, id, { arrow: true }));
  });

  return {
    operation: 'PATRICIA comprimida',
    complexity: 'por caracteres visitados',
    code: ['comparar segmento:', '  avanca somente se o rotulo casar'],
    frames: [snap(nodes, edges, [p('pat-root', 'raiz', 'top', 'accent')], 'Segmentos sem bifurcacao sao comprimidos em um unico rotulo.', 1)],
    width: 460,
    height: 260,
  };
}

/* =====================================================================
   Mapeamento: visual do conteúdo → cena animada
   ===================================================================== */

function isNumeric(label: string): boolean {
  return label.trim() !== '' && !Number.isNaN(Number(label.trim()));
}

function demoSceneFromSteps(visual: StructureVisual): VizScene {
  const stepScenes = (visual.steps ?? []).map((step) =>
    staticSceneForVisual({
      ...visual,
      kind: step.kind ?? visual.kind,
      labels: step.labels,
      steps: undefined,
      operation: undefined,
      complexity: undefined,
    }),
  );
  const frames: VizFrame[] = stepScenes.map((scene, index) => {
    const frame = scene.frames[0];
    const step = visual.steps![index];

    return {
      ...frame,
      caption: step.caption,
      codeLine: index,
      vars: step.vars,
    };
  });
  const width = Math.max(...stepScenes.map((scene) => scene.width), 360);
  const height = Math.max(...stepScenes.map((scene) => scene.height), 220);
  const code = visual.steps!.map((step) => step.code ?? step.caption);

  return {
    operation: visual.operation ?? visual.title,
    complexity: visual.complexity ?? 'passo a passo',
    code,
    frames,
    width,
    height,
  };
}

export function buildSceneForVisual(visual: StructureVisual): VizScene {
  if (visual.steps?.length) {
    return demoSceneFromSteps(visual);
  }

  const cleaned = visual.labels.filter((label) => label.trim() !== '');

  switch (visual.kind) {
    case 'binary-tree':
      return binaryTreeTraversalScene(cleaned);
    case 'avl': {
      const numeric = cleaned.every(isNumeric) && cleaned.length >= 2;
      return numeric ? avlScene(cleaned.map(Number)) : binaryTreeTraversalScene(cleaned);
    }
    case 'trie':
      return trieScene(visual.labels);
    case 'hash': {
      const key = cleaned.map((label) => Number(label)).find((value) => !Number.isNaN(value));
      return hashScene(key ?? 30);
    }
    case 'doidona':
      // Busca que atravessa T1 → T2 → subestrutura, como na questão.
      return doidonaScene('buscar', 17, defaultDoidonaConfig);
    case 'list':
      return linearStructureScene(cleaned, 'list');
    case 'queue':
      return linearStructureScene(cleaned, 'queue');
    case 'stack':
      return linearStructureScene(cleaned, 'stack');
    case 'matrix':
      return matrixStructureScene(cleaned);
    case 'tree234':
      return multiwayTreeScene(cleaned, 'arvore 2-3-4');
    case 'red-black':
      return redBlackStructureScene(cleaned);
    case 'patricia':
      return patriciaStructureScene(cleaned);
    case 'array': {
      const numeric = cleaned.every(isNumeric) && cleaned.length >= 3;
      const sorted = numeric && cleaned.map(Number).every((value, index, all) => index === 0 || all[index - 1] <= value);
      return numeric && !sorted ? insertionSortScene(cleaned.map(Number)) : arraySweepScene(cleaned);
    }
    default:
      return arraySweepScene(cleaned);
  }
}

export type StructureCatalogEntry = {
  id: string;
  name: string;
  blurb: string;
  build: () => VizScene;
};

export const structureCatalog: StructureCatalogEntry[] = [
  {
    id: 'hash',
    name: 'Tabela hash',
    blurb: 'Chave vira indice; colisoes seguem para a reserva.',
    build: () => hashScene(30),
  },
  {
    id: 'arvore-binaria',
    name: 'Arvore binaria',
    blurb: 'Recursao visita a raiz e desce pelas subarvores.',
    build: () => binaryTreeTraversalScene(['8', '3', '10', '1', '6']),
  },
  {
    id: 'avl',
    name: 'Arvore AVL',
    blurb: 'Insercao com fator de balanceamento e rotacoes.',
    build: () => avlScene([30, 20, 10, 40, 50]),
  },
  {
    id: 'trie',
    name: 'Arvore TRIE',
    blurb: 'Uma letra por nivel; palavra completa exige marcador fim.',
    build: () => trieScene(['c', 'a', 's', 'a', 'fim']),
  },
  {
    id: 'somatorio',
    name: 'Somatorios',
    blurb: 'Lacos viram contagem de execucoes e formulas.',
    build: () => arraySweepScene(['1', '2', '3', '...', 'n']),
  },
  {
    id: 'ordenacao',
    name: 'Ordenacao',
    blurb: 'Insertion sort desloca valores ate encaixar a chave.',
    build: () => insertionSortScene([4, 3, 8, 6, 1, 2, 9]),
  },
  {
    id: 'doidona',
    name: 'Estrutura Doidona',
    blurb: 'Hash principal com desvio para estruturas de reserva.',
    build: () => doidonaScene('buscar', 17, defaultDoidonaConfig),
  },
];
