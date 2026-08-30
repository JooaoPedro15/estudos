import type { StructureVisual } from '../types/content';
import { buildLevelOrderTree, e, layoutTree, n, p, snap, type TreeNode } from './sceneUtils';
import type { VizEdge, VizNode, VizPointer, VizScene } from './vizTypes';

/**
 * Cenas ESTÁTICAS (um único quadro) para as alternativas das questões de
 * desenho. Cada desenho representa exatamente o estado descrito pelos labels
 * da alternativa — sem animação, sem valores fixos e sem reaproveitar dados
 * de outra questão. Reutiliza a mesma linguagem visual (nós, arestas,
 * ponteiros) das demais estruturas do jogo.
 */

function scene(nodes: VizNode[], edges: VizEdge[], pointers: VizPointer[], width: number, height: number): VizScene {
  return {
    operation: 'estado',
    complexity: '',
    code: [],
    frames: [snap(nodes, edges, pointers, '')],
    width,
    height,
  };
}

const clean = (labels: string[]) => labels.map((label) => label.trim());

/* ---------- vetor / array ---------- */

function arrayStatic(labels: string[]): VizScene {
  const items = clean(labels);
  const count = Math.max(items.length, 1);
  const cellW = Math.min(56, 340 / count);
  const startX = 30 + cellW / 2;
  const nodes = items.map((label, index) =>
    n(`c${index}`, startX + index * cellW, 60, label, { shape: 'box', w: cellW - 8, h: 40, sub: `${index}` }),
  );
  return scene(nodes, [], [], startX + count * cellW, 110);
}

/* ---------- pilha (labels[0] = base, último = topo) ---------- */

function stackStatic(labels: string[]): VizScene {
  const items = clean(labels);
  const h = 34;
  const baseY = 40 + Math.max(items.length, 1) * h;
  const nodes: VizNode[] = items.map((label, index) =>
    n(`s${index}`, 120, baseY - index * h, label, {
      shape: 'box',
      w: 90,
      h: h - 4,
      sub: index === items.length - 1 ? 'topo' : undefined,
    }),
  );
  nodes.push(n('base', 120, baseY + 8, '', { shape: 'slot', w: 100, h: 10 }));
  const pointers = items.length ? [p(`s${items.length - 1}`, 'TOPO', 'right', 'primary')] : [];
  return scene(nodes, [], pointers, 240, baseY + 40);
}

/* ---------- fila (labels[0] = frente, último = trás) ---------- */

function queueStatic(labels: string[]): VizScene {
  const items = clean(labels);
  const count = Math.max(items.length, 1);
  const cellW = Math.min(60, 320 / count);
  const startX = 40 + cellW / 2;
  const nodes = items.map((label, index) =>
    n(`q${index}`, startX + index * cellW, 70, label, { shape: 'box', w: cellW - 8, h: 42 }),
  );
  const pointers: VizPointer[] = [];
  if (items.length) {
    pointers.push(p('q0', 'FRENTE', 'top', 'accent'));
    pointers.push(p(`q${items.length - 1}`, 'TRÁS', 'bottom', 'primary'));
  }
  return scene(nodes, [], pointers, startX + count * cellW, 130);
}

/* ---------- lista encadeada (boxes + setas → ∅) ---------- */

function listStatic(labels: string[]): VizScene {
  const items = clean(labels);
  const count = Math.max(items.length, 1);
  const gap = Math.min(96, 320 / (count + 1));
  const nodes: VizNode[] = items.map((label, index) =>
    n(`l${index}`, 50 + index * gap, 60, label, { shape: 'box', w: Math.min(58, gap - 10), h: 40 }),
  );
  nodes.push(n('lnull', 50 + items.length * gap, 60, '∅', { shape: 'pill', w: 44, h: 34 }));
  const edges: VizEdge[] = items.map((_, index) =>
    e(`l${index}`, index + 1 < items.length ? `l${index + 1}` : 'lnull', { arrow: true }),
  );
  const pointers = items.length ? [p('l0', 'INÍCIO', 'top', 'accent')] : [];
  return scene(nodes, edges, pointers, 60 + (count + 1) * gap, 110);
}

/* ---------- matriz 3x3 ---------- */

function matrixStatic(labels: string[]): VizScene {
  const items = clean(labels);
  const size = items.length >= 9 ? 3 : Math.max(1, Math.ceil(Math.sqrt(items.length)));
  const cell = 54;
  const nodes: VizNode[] = items.slice(0, size * size).map((label, index) => {
    const row = Math.floor(index / size);
    const col = index % size;
    return n(`m${index}`, 40 + col * cell, 40 + row * cell, label, { shape: 'box', w: cell - 10, h: cell - 12 });
  });
  return scene(nodes, [], [], 40 + size * cell, 40 + size * cell);
}

/* ---------- árvore binária / ABB / AVL (labels em nível) ---------- */

function treeStatic(labels: string[], width = 360): VizScene {
  const root = buildLevelOrderTree(labels);
  if (!root) {
    return scene([n('empty', width / 2, 60, '∅', { shape: 'pill', w: 44, h: 34 })], [], [], width, 120);
  }
  const positions = layoutTree(root, width, { top: 40, levelGap: 60 });
  const nodes: VizNode[] = [];
  const edges: VizEdge[] = [];
  let maxY = 0;
  (function collect(node: TreeNode) {
    const at = positions.get(node.id)!;
    maxY = Math.max(maxY, at.y);
    nodes.push(n(node.id, at.x, at.y, node.label));
    if (node.left) {
      edges.push(e(node.id, node.left.id));
      collect(node.left);
    }
    if (node.right) {
      edges.push(e(node.id, node.right.id));
      collect(node.right);
    }
  })(root);
  const pointers = [p(root.id, 'RAIZ', 'top', 'accent')];
  return scene(nodes, edges, pointers, width, maxY + 50);
}

/* ---------- alvinegra: rótulo termina em B (preto) ou P (rubro) ---------- */

function redBlackStatic(labels: string[]): VizScene {
  const parsed = clean(labels).map((label) => {
    const match = label.match(/^(.*?)([BP])$/);
    return match ? { value: match[1], color: match[2] } : { value: label, color: '' };
  });
  const root = buildLevelOrderTree(parsed.map((item) => item.value));
  if (!root) {
    return scene([n('empty', 180, 60, '∅', { shape: 'pill', w: 44, h: 34 })], [], [], 360, 120);
  }
  const colorOf = new Map(parsed.map((item) => [item.value, item.color]));
  const positions = layoutTree(root, 380, { top: 42, levelGap: 62 });
  const nodes: VizNode[] = [];
  const edges: VizEdge[] = [];
  let maxY = 0;
  (function collect(node: TreeNode) {
    const at = positions.get(node.id)!;
    maxY = Math.max(maxY, at.y);
    const color = colorOf.get(node.label) ?? '';
    nodes.push(
      n(node.id, at.x, at.y, node.label, {
        sub: color === 'P' ? 'rubro' : color === 'B' ? 'preto' : undefined,
        state: color === 'P' ? 'removed' : 'default',
      }),
    );
    if (node.left) {
      edges.push(e(node.id, node.left.id));
      collect(node.left);
    }
    if (node.right) {
      edges.push(e(node.id, node.right.id));
      collect(node.right);
    }
  })(root);
  return scene(nodes, edges, [p(root.id, 'RAIZ', 'top', 'accent')], 380, maxY + 50);
}

/* ---------- 2-3-4: labels[0] = raiz multi-chave, resto = filhos ---------- */

function tree234Static(labels: string[]): VizScene {
  const items = clean(labels).filter(Boolean);
  if (!items.length) {
    return scene([n('empty', 180, 50, '∅', { shape: 'pill', w: 44, h: 34 })], [], [], 360, 100);
  }
  const rootLabel = items[0];
  const children = items.slice(1);
  const width = Math.max(360, children.length * 108);
  const rootW = Math.max(70, rootLabel.length * 11);
  const nodes: VizNode[] = [n('root', width / 2, 46, rootLabel, { shape: 'box', w: rootW, h: 38 })];
  const edges: VizEdge[] = [];
  const childCount = Math.max(children.length, 1);
  const step = (width - 80) / childCount;
  children.forEach((label, index) => {
    const id = `c${index}`;
    const childW = Math.max(56, label.length * 10);
    nodes.push(n(id, 40 + step / 2 + index * step, 140, label, { shape: 'box', w: childW, h: 36 }));
    edges.push(e('root', id));
  });
  return scene(nodes, edges, [], width, children.length ? 200 : 110);
}

/* ---------- TRIE: palavras completas compartilham prefixos ---------- */

type TrieRenderNode = {
  id: string;
  label: string;
  children: Map<string, TrieRenderNode>;
  terminal: boolean;
  depth: number;
  x: number;
};

function trieWordsStatic(words: string[]): VizScene {
  let nextId = 0;
  const root: TrieRenderNode = {
    id: 'root',
    label: '•',
    children: new Map(),
    terminal: false,
    depth: 0,
    x: 0,
  };

  for (const word of words) {
    let cursor = root;
    for (const rawChar of word.trim().toUpperCase()) {
      const char = rawChar;
      let child = cursor.children.get(char);
      if (!child) {
        child = {
          id: `tw${nextId++}`,
          label: char,
          children: new Map(),
          terminal: false,
          depth: cursor.depth + 1,
          x: 0,
        };
        cursor.children.set(char, child);
      }
      cursor = child;
    }
    cursor.terminal = true;
  }

  let leafIndex = 0;
  let maxDepth = 0;
  const assignX = (node: TrieRenderNode): number => {
    maxDepth = Math.max(maxDepth, node.depth);
    const children = [...node.children.values()].sort((a, b) => a.label.localeCompare(b.label));
    if (children.length === 0) {
      node.x = leafIndex++;
      return node.x;
    }

    const childXs = children.map(assignX);
    node.x = childXs.reduce((sum, value) => sum + value, 0) / childXs.length;
    return node.x;
  };
  assignX(root);

  const width = Math.max(380, Math.max(1, leafIndex) * 78 + 80);
  const xOf = (node: TrieRenderNode) => 40 + node.x * 78;
  const yOf = (node: TrieRenderNode) => 38 + node.depth * 50;
  const nodes: VizNode[] = [];
  const edges: VizEdge[] = [];

  const collect = (node: TrieRenderNode) => {
    nodes.push(
      n(node.id, xOf(node), yOf(node), node.label, {
        sub: node.terminal ? 'fim' : undefined,
        state: node.terminal ? 'found' : 'default',
      }),
    );
    for (const child of [...node.children.values()].sort((a, b) => a.label.localeCompare(b.label))) {
      edges.push(e(node.id, child.id));
      collect(child);
    }
  };
  collect(root);

  return scene(nodes, edges, [p('root', 'RAIZ', 'left', 'accent')], width, Math.max(150, yOf({ ...root, depth: maxDepth }) + 52));
}

/* ---------- TRIE: caminho de caracteres, 'fim' marca folha ---------- */

function trieStatic(labels: string[]): VizScene {
  const tokens = clean(labels).filter(Boolean);
  const wordTokens = tokens.filter((label) => /^[A-Za-z]+$/.test(label) && label.length > 1 && label.toLowerCase() !== 'fim');
  if (wordTokens.length >= 1) {
    return trieWordsStatic(wordTokens);
  }

  const chars: string[] = [];
  const ends = new Set<number>();
  for (const raw of tokens) {
    const label = raw.toLowerCase();
    if (label === 'fim') {
      if (chars.length) ends.add(chars.length - 1);
    } else if (label) {
      chars.push(raw);
    }
  }
  if (!chars.length) {
    return scene([n('root', 70, 50, '•')], [], [p('root', 'RAIZ', 'left', 'accent')], 360, 110);
  }
  const stepX = Math.min(58, 300 / (chars.length + 1));
  const stepY = Math.min(40, 200 / (chars.length + 1));
  const nodes: VizNode[] = [n('root', 60, 46, '•')];
  const edges: VizEdge[] = [];
  chars.forEach((char, index) => {
    const id = `t${index}`;
    nodes.push(
      n(id, 60 + (index + 1) * stepX, 46 + (index + 1) * stepY, char, {
        sub: ends.has(index) ? '✓ fim' : undefined,
      }),
    );
    edges.push(e(index === 0 ? 'root' : `t${index - 1}`, id));
  });
  return scene(nodes, edges, [p('root', 'RAIZ', 'left', 'accent')], 360, 60 + (chars.length + 1) * stepY);
}

/* ---------- doidona: rota T1 -> hash -> subestrutura ---------- */

function doidonaStatic(labels: string[]): VizScene {
  const items = clean(labels).filter(Boolean);
  const shown = items.length ? items : ['T1', 'hash', 'lista', 'ABB'];
  const nodes: VizNode[] = shown.map((label, index) =>
    n(`d${index}`, 64 + index * 92, index % 2 === 0 ? 66 : 132, label, {
      shape: index === 0 ? 'box' : 'pill',
      w: Math.max(58, Math.min(96, label.length * 9 + 18)),
      h: 36,
      state: index === shown.length - 1 ? 'found' : index === 1 ? 'active' : 'default',
    }),
  );
  const edges: VizEdge[] = [];
  for (let index = 0; index < nodes.length - 1; index += 1) {
    edges.push(e(nodes[index].id, nodes[index + 1].id, { arrow: true }));
  }
  const pointers = nodes.length ? [p(nodes[0].id, 'entrada', 'top', 'accent')] : [];
  return scene(nodes, edges, pointers, Math.max(360, 110 + shown.length * 92), 190);
}

/* ---------- PATRICIA: segmentos comprimidos em cadeia ---------- */

function patriciaStatic(labels: string[]): VizScene {
  const segments = clean(labels).filter(Boolean);
  if (!segments.length) {
    return scene([n('root', 70, 50, '•')], [], [p('root', 'RAIZ', 'left', 'accent')], 360, 110);
  }
  const stepX = Math.min(74, 300 / (segments.length + 1));
  const stepY = Math.min(40, 180 / (segments.length + 1));
  const nodes: VizNode[] = [n('root', 60, 46, '•')];
  const edges: VizEdge[] = [];
  segments.forEach((seg, index) => {
    const id = `p${index}`;
    const w = Math.max(46, seg.length * 12 + 16);
    nodes.push(n(id, 60 + (index + 1) * stepX, 46 + (index + 1) * stepY, seg, { shape: 'pill', w, h: 32 }));
    edges.push(e(index === 0 ? 'root' : `p${index - 1}`, id));
  });
  return scene(nodes, edges, [p('root', 'RAIZ', 'left', 'accent')], 360, 60 + (segments.length + 1) * stepY);
}

/* ---------- hash encadeamento separado: h(x) = x mod 7 ---------- */

function hashStatic(labels: string[]): VizScene {
  const size = 7;
  const values = clean(labels)
    .map((label) => Number(label))
    .filter((value) => Number.isFinite(value));
  const buckets: number[][] = Array.from({ length: size }, () => []);
  for (const value of values) {
    buckets[((value % size) + size) % size].push(value);
  }

  const slotY = (index: number) => 26 + index * 34;
  const nodes: VizNode[] = [];
  const edges: VizEdge[] = [];
  let maxChain = 0;

  for (let index = 0; index < size; index += 1) {
    nodes.push(n(`slot${index}`, 44, slotY(index), '', { shape: 'slot', w: 40, h: 28, sub: `${index}` }));
    let prev = `slot${index}`;
    buckets[index].forEach((value, depth) => {
      const id = `h${index}_${depth}`;
      nodes.push(n(id, 108 + depth * 60, slotY(index), `${value}`, { shape: 'pill', w: 46, h: 26 }));
      edges.push(e(prev, id, { arrow: true }));
      prev = id;
    });
    maxChain = Math.max(maxChain, buckets[index].length);
  }

  return scene(nodes, edges, [], 130 + maxChain * 60, slotY(size - 1) + 40);
}

/* ---------- roteamento ---------- */

export function staticSceneForVisual(visual: StructureVisual): VizScene {
  switch (visual.kind) {
    case 'array':
      return arrayStatic(visual.labels);
    case 'stack':
      return stackStatic(visual.labels);
    case 'queue':
      return queueStatic(visual.labels);
    case 'list':
      return listStatic(visual.labels);
    case 'matrix':
      return matrixStatic(visual.labels);
    case 'binary-tree':
    case 'avl':
      return treeStatic(visual.labels);
    case 'red-black':
      return redBlackStatic(visual.labels);
    case 'tree234':
      return tree234Static(visual.labels);
    case 'trie':
      return trieStatic(visual.labels);
    case 'patricia':
      return patriciaStatic(visual.labels);
    case 'hash':
      return hashStatic(visual.labels);
    case 'doidona':
      return doidonaStatic(visual.labels);
    default:
      return arrayStatic(visual.labels);
  }
}
