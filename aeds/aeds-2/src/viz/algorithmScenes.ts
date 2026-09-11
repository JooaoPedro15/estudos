import { n, p, snap } from './sceneUtils';
import type { VizNode, VizScene } from './vizTypes';

export type ArrayInputResult =
  | { ok: true; values: number[] }
  | { ok: false; error: string };

const MIN_ARRAY_LENGTH = 2;
const MAX_ARRAY_LENGTH = 12;
const MAX_ABSOLUTE_VALUE = 999;

/** Validates user input before it can produce an algorithm scene. */
export function parseArrayInput(raw: string): ArrayInputResult {
  const parts = raw.split(',').map((part) => part.trim());

  if (parts.length < MIN_ARRAY_LENGTH || parts.length > MAX_ARRAY_LENGTH || parts.some((part) => !part)) {
    return { ok: false, error: `Informe de ${MIN_ARRAY_LENGTH} a ${MAX_ARRAY_LENGTH} números separados por vírgula.` };
  }

  const values = parts.map(Number);
  if (!values.every((value) => Number.isInteger(value) && Math.abs(value) <= MAX_ABSOLUTE_VALUE)) {
    return { ok: false, error: `Use apenas inteiros entre -${MAX_ABSOLUTE_VALUE} e ${MAX_ABSOLUTE_VALUE}.` };
  }

  return { ok: true, values };
}

export type ArrayTargetInputResult =
  | { ok: true; values: number[]; target: number }
  | { ok: false; error: string };

/** Mesma validação do vetor, mais um valor buscado no formato "vetor | alvo". */
export function parseArrayAndTargetInput(raw: string): ArrayTargetInputResult {
  const parts = raw.split('|');
  if (parts.length !== 2) {
    return { ok: false, error: 'Use o formato "vetor | valor buscado" (ex.: 8, 4, 2, 9, 1 | 4).' };
  }

  const arrayResult = parseArrayInput(parts[0]);
  if (!arrayResult.ok) {
    return arrayResult;
  }

  const target = Number.parseInt(parts[1].trim(), 10);
  if (!Number.isInteger(target) || Math.abs(target) > MAX_ABSOLUTE_VALUE) {
    return { ok: false, error: `O valor buscado deve ser um inteiro entre -${MAX_ABSOLUTE_VALUE} e ${MAX_ABSOLUTE_VALUE}.` };
  }

  return { ok: true, values: arrayResult.values, target };
}

type ArrayItem = { id: string; value: number; slot: number; state?: VizNode['state']; row?: number; sub?: string };

/**
 * Posiciona por (slot, row): slot decide a coluna (dentro da fileira), row
 * decide a fileira (0 = fileira principal, 1+ = fileiras auxiliares, usadas
 * pra "extrair" um elemento — insertion sort — ou pra agrupar por balde —
 * bucket sort). cellWidth compartilhado entre fileiras pra colunas alinharem.
 */
function arrayNodes(items: ArrayItem[], width: number, rowGap = 72): VizNode[] {
  const cellWidth = Math.min(76, (width - 58) / items.length);
  const start = width / 2 - (cellWidth * (items.length - 1)) / 2;

  return [...items]
    .sort((a, b) => a.slot - b.slot || (a.row ?? 0) - (b.row ?? 0))
    .map((item) =>
      n(item.id, start + item.slot * cellWidth, 150 + (item.row ?? 0) * rowGap, String(item.value), {
        shape: 'box',
        w: cellWidth - 10,
        h: 46,
        state: item.state ?? 'default',
        sub: item.sub ?? `[${item.slot}]`,
      }),
    );
}

function swapSlots(a: ArrayItem, b: ArrayItem) {
  const slot = a.slot;
  a.slot = b.slot;
  b.slot = slot;
}

function resetStates(items: ArrayItem[], sortedSuffixAfter = -1) {
  items.forEach((item) => {
    item.state = item.slot > sortedSuffixAfter ? 'sorted' : 'default';
  });
}

/**
 * Produces complete snapshots for bubble sort. The renderer only consumes
 * snapshots; it knows nothing about the sorting algorithm itself.
 */
export function buildBubbleSortScene(values: number[]): VizScene {
  const width = 540;
  const items: ArrayItem[] = values.map((value, index) => ({ id: `value-${index}`, value, slot: index }));
  const frames: VizScene['frames'] = [];
  const code = [
    'para fim = n - 1 até 1:',
    '  para j = 0 até fim - 1:',
    '    se vetor[j] > vetor[j + 1]:',
    '      trocar(vetor[j], vetor[j + 1])',
    '  posição fim está ordenada',
  ];
  const push = (caption: string, codeLine: number, vars: Record<string, string>, pointers: ReturnType<typeof p>[] = []) => {
    frames.push(
      snap(
        arrayNodes(items, width),
        [],
        pointers,
        caption,
        codeLine,
        Object.entries(vars).map(([name, value]) => ({ name, value })),
      ),
    );
  };

  push('O Bubble Sort percorre o vetor e leva o maior valor ao fim a cada passagem.', 0, { n: String(values.length) });

  for (let end = items.length - 1; end > 0; end -= 1) {
    for (let j = 0; j < end; j += 1) {
      resetStates(items, end);
      const left = items.find((item) => item.slot === j)!;
      const right = items.find((item) => item.slot === j + 1)!;
      left.state = 'compare';
      right.state = 'compare';
      push(
        `Comparando vetor[${j}] = ${left.value} com vetor[${j + 1}] = ${right.value}.`,
        2,
        { j: String(j), fim: String(end) },
        [p(left.id, 'j', 'top', 'warning'), p(right.id, 'j + 1', 'top', 'warning')],
      );

      if (left.value > right.value) {
        push(
          `${left.value} > ${right.value}, portanto os elementos serão trocados.`,
          2,
          { j: String(j), fim: String(end) },
        );
        left.state = 'moving';
        right.state = 'moving';
        const previousSlot = left.slot;
        left.slot = right.slot;
        right.slot = previousSlot;
        push(
          `Troca concluída: vetor[${j}] = ${right.value} e vetor[${j + 1}] = ${left.value}.`,
          3,
          { j: String(j), fim: String(end) },
        );
      } else {
        push(
          `${left.value} ≤ ${right.value}, então a ordem do par é mantida.`,
          2,
          { j: String(j), fim: String(end) },
        );
      }
    }

    resetStates(items, end);
    const sorted = items.find((item) => item.slot === end)!;
    sorted.state = 'sorted';
    push(`A posição ${end} está ordenada: ${sorted.value} não será comparado novamente.`, 4, { fim: String(end) });
  }

  items.forEach((item) => {
    item.state = 'sorted';
  });
  push('Vetor ordenado. O Bubble Sort executa O(n²) comparações no pior caso.', 4, { comparações: 'concluídas' });

  return { operation: 'Bubble Sort', complexity: 'O(n²)', code, frames, width, height: 280 };
}

/* ---------- INSERTION SORT ---------- */

export function buildInsertionSortScene(values: number[]): VizScene {
  const width = 540;
  const items: ArrayItem[] = values.map((value, index) => ({ id: `value-${index}`, value, slot: index }));
  const frames: VizScene['frames'] = [];
  const code = [
    'para i = 1 até n-1:',
    '  chave = vetor[i]; j = i - 1',
    '  enquanto j >= 0 e vetor[j] > chave:',
    '    vetor[j+1] = vetor[j]; j--',
    '  vetor[j+1] = chave',
  ];
  const push = (caption: string, codeLine: number, vars: Record<string, string>, pointers: ReturnType<typeof p>[] = []) => {
    frames.push(snap(arrayNodes(items, width), [], pointers, caption, codeLine, Object.entries(vars).map(([name, value]) => ({ name, value }))));
  };

  push('O Insertion Sort cresce um prefixo ordenado, inserindo cada elemento na posição certa.', 0, { n: String(values.length) });

  for (let i = 1; i < items.length; i += 1) {
    items.forEach((item) => {
      item.state = item.slot < i ? 'sorted' : 'default';
    });
    const keyItem = items.find((item) => item.slot === i)!;
    const chave = keyItem.value;
    keyItem.state = 'active';
    keyItem.row = 1;
    push(`chave = vetor[${i}] = ${chave} sai da fileira para abrir espaço.`, 1, { i: String(i), chave: String(chave) }, [p(keyItem.id, 'chave', 'top', 'warning')]);

    let j = i - 1;
    while (j >= 0) {
      const left = items.find((item) => item.slot === j)!;
      left.state = 'compare';
      push(`Comparando vetor[${j}] = ${left.value} com a chave ${chave}.`, 2, { j: String(j), chave: String(chave) }, [p(left.id, 'j', 'top', 'warning')]);

      if (left.value > chave) {
        left.slot = j + 1;
        left.state = 'moving';
        push(`${left.value} > ${chave}: desloca para a direita.`, 3, { j: String(j) });
        left.state = 'visited';
        j -= 1;
      } else {
        left.state = 'visited';
        push(`${left.value} ≤ ${chave}: achou a posição de encaixe.`, 2, { j: String(j) });
        break;
      }
    }

    keyItem.slot = j + 1;
    keyItem.row = 0;
    keyItem.state = 'inserted';
    push(`chave ${chave} entra na posição ${j + 1}.`, 4, { chave: String(chave) });
  }

  items.forEach((item) => {
    item.state = 'sorted';
  });
  push('Vetor ordenado. O Insertion Sort executa O(n²) no pior caso, O(n) se o vetor já estiver quase ordenado.', 4, { status: 'concluído' });

  return { operation: 'Insertion Sort', complexity: 'O(n²)', code, frames, width, height: 340 };
}

/* ---------- SELECTION SORT ---------- */

export function buildSelectionSortScene(values: number[]): VizScene {
  const width = 540;
  const items: ArrayItem[] = values.map((value, index) => ({ id: `value-${index}`, value, slot: index }));
  const frames: VizScene['frames'] = [];
  const code = [
    'para i = 0 até n-2:',
    '  menor = i',
    '  para j = i+1 até n-1:',
    '    se vetor[j] < vetor[menor]: menor = j',
    '  trocar(vetor[i], vetor[menor])',
  ];
  const push = (caption: string, codeLine: number, vars: Record<string, string>, pointers: ReturnType<typeof p>[] = []) => {
    frames.push(snap(arrayNodes(items, width), [], pointers, caption, codeLine, Object.entries(vars).map(([name, value]) => ({ name, value }))));
  };

  push('O Selection Sort procura o menor elemento restante e o leva para a posição atual.', 0, { n: String(values.length) });

  for (let i = 0; i < items.length - 1; i += 1) {
    items.forEach((item) => {
      item.state = item.slot < i ? 'sorted' : 'default';
    });
    let menorItem = items.find((item) => item.slot === i)!;
    menorItem.state = 'active';
    push(`Procurando o menor a partir da posição ${i}. Candidato inicial: ${menorItem.value}.`, 1, { i: String(i), menor: String(menorItem.value) }, [p(menorItem.id, 'menor', 'top', 'accent')]);

    for (let j = i + 1; j < items.length; j += 1) {
      const candidate = items.find((item) => item.slot === j)!;
      candidate.state = 'compare';
      push(`Comparando vetor[${j}] = ${candidate.value} com o menor atual (${menorItem.value}).`, 3, { j: String(j), menor: String(menorItem.value) }, [p(candidate.id, 'j', 'top', 'warning')]);

      if (candidate.value < menorItem.value) {
        if (menorItem.slot !== i) {
          menorItem.state = 'visited';
        } else {
          menorItem.state = 'default';
        }
        menorItem = candidate;
        menorItem.state = 'active';
        push(`Novo menor encontrado: ${menorItem.value}.`, 3, { j: String(j), menor: String(menorItem.value) }, [p(menorItem.id, 'menor', 'top', 'accent')]);
      } else {
        candidate.state = 'visited';
      }
    }

    const atual = items.find((item) => item.slot === i)!;
    if (menorItem.id !== atual.id) {
      atual.state = 'moving';
      menorItem.state = 'moving';
      push(`Trocando vetor[${i}] = ${atual.value} com o menor encontrado (${menorItem.value}).`, 4, { i: String(i) });
      swapSlots(atual, menorItem);
    }

    atual.state = 'sorted';
    push(`Posição ${i} está ordenada.`, 4, { i: String(i) });
  }

  items.forEach((item) => {
    item.state = 'sorted';
  });
  push('Vetor ordenado. O Selection Sort sempre executa O(n²) comparações, mas no máximo n-1 trocas.', 4, { status: 'concluído' });

  return { operation: 'Selection Sort', complexity: 'O(n²)', code, frames, width, height: 340 };
}

/* ---------- SHELL SORT (gap decrescente, insercao via trocas) ---------- */

export function buildShellSortScene(values: number[]): VizScene {
  const width = 540;
  const items: ArrayItem[] = values.map((value, index) => ({ id: `value-${index}`, value, slot: index }));
  const frames: VizScene['frames'] = [];
  const code = [
    'gap = n / 2',
    'enquanto gap > 0:',
    '  para i = gap até n-1:',
    '    enquanto j >= gap e vetor[j-gap] > vetor[j]:',
    '      trocar(vetor[j], vetor[j-gap]); j -= gap',
    '  gap = gap / 2',
  ];
  const push = (caption: string, codeLine: number, vars: Record<string, string>, pointers: ReturnType<typeof p>[] = []) => {
    frames.push(snap(arrayNodes(items, width), [], pointers, caption, codeLine, Object.entries(vars).map(([name, value]) => ({ name, value }))));
  };

  push('O Shell Sort compara elementos distantes (gap) primeiro, aproximando-os rápido da posição final.', 0, { n: String(values.length) });

  let gap = Math.floor(items.length / 2);
  while (gap > 0) {
    push(`Nova rodada com gap = ${gap}.`, 0, { gap: String(gap) });

    for (let i = gap; i < items.length; i += 1) {
      let j = i;
      while (j >= gap) {
        const left = items.find((item) => item.slot === j - gap)!;
        const right = items.find((item) => item.slot === j)!;
        left.state = 'compare';
        right.state = 'compare';
        push(`Comparando vetor[${j - gap}] = ${left.value} com vetor[${j}] = ${right.value} (gap = ${gap}).`, 3, { gap: String(gap), j: String(j) }, [p(left.id, 'j-gap', 'top', 'warning'), p(right.id, 'j', 'top', 'warning')]);

        if (left.value > right.value) {
          left.state = 'moving';
          right.state = 'moving';
          push(`${left.value} > ${right.value}: troca.`, 4, { gap: String(gap), j: String(j) });
          swapSlots(left, right);
          left.state = 'visited';
          right.state = 'visited';
          j -= gap;
        } else {
          left.state = 'visited';
          right.state = 'visited';
          break;
        }
      }
    }

    items.forEach((item) => {
      item.state = 'default';
    });
    push(`Rodada com gap = ${gap} concluída — array mais "quase ordenado".`, 5, { gap: String(gap) });
    gap = Math.floor(gap / 2);
  }

  items.forEach((item) => {
    item.state = 'sorted';
  });
  push('Vetor ordenado (última rodada é sempre gap = 1, um insertion sort quase sem trabalho a fazer).', 5, { status: 'concluído' });

  return { operation: 'Shell Sort', complexity: 'melhor que O(n²)', code, frames, width, height: 340 };
}

/* ---------- COUNTING SORT ---------- */

export function buildCountingSortScene(values: number[]): VizScene {
  const width = 540;
  const items: ArrayItem[] = values.map((value, index) => ({ id: `value-${index}`, value, slot: index, row: 1 }));
  const frames: VizScene['frames'] = [];
  const code = [
    'para cada elemento: count[valor]++',
    'acumula count[i] += count[i-1]',
    'para i = n-1 até 0:',
    '  saida[count[vetor[i]] - 1] = vetor[i]',
    '  count[vetor[i]]--',
  ];
  const push = (caption: string, codeLine: number, vars: Record<string, string>) => {
    frames.push(snap(arrayNodes(items, width, 64), [], [], caption, codeLine, Object.entries(vars).map(([name, value]) => ({ name, value }))));
  };

  push(
    'O Counting Sort conta ocorrências de cada valor, sem comparar elementos entre si (fileira de baixo = vetor original).',
    0,
    { n: String(items.length) },
  );

  const offset = Math.min(0, ...values);
  const shifted = values.map((value) => value - offset);
  const maior = Math.max(...shifted);
  const count = new Array(maior + 1).fill(0);

  const contagemMap = new Map<number, number>();
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    item.state = 'compare';
    push(`Olhando vetor[${i}] = ${item.value}.`, 0, { i: String(i) });

    count[shifted[i]] += 1;
    contagemMap.set(item.value, (contagemMap.get(item.value) ?? 0) + 1);
    const resumo = [...contagemMap.entries()].map(([val, c]) => `${val}→${c}`).join(', ');
    item.state = 'visited';
    push(`count[${item.value}]++`, 0, { contagem: resumo });
  }

  for (let i = 1; i <= maior; i += 1) count[i] += count[i - 1];
  push(
    'Acumulando: count[v] passa a dizer quantas posições finais são ≤ v (tabela auxiliar por valor, não aparece no vetor).',
    1,
    {},
  );

  items.forEach((item) => {
    item.state = 'default';
  });

  for (let i = items.length - 1; i >= 0; i -= 1) {
    const item = items[i];
    const v = shifted[i];
    item.state = 'active';
    push(`Pega vetor[${i}] = ${item.value} (direita pra esquerda, garante estabilidade).`, 2, { i: String(i) });

    const pos = count[v] - 1;
    count[v] -= 1;
    item.row = 0;
    item.slot = pos;
    item.state = 'inserted';
    push(`saida[count[${item.value}] - 1] = ${item.value} → posição ${pos}.`, 3, { posicao: String(pos) });
    item.state = 'found';
  }

  items.forEach((item) => {
    item.state = 'sorted';
  });
  push('Vetor ordenado. Custo Θ(n + k), onde k é o maior valor — não depende de comparações.', 4, { status: 'concluído' });

  return { operation: 'Counting Sort', complexity: 'Θ(n + k)', code, frames, width, height: 320 };
}

/* ---------- BUCKET SORT ---------- */

export function buildBucketSortScene(values: number[]): VizScene {
  const width = 540;
  const items: ArrayItem[] = values.map((value, index) => ({ id: `value-${index}`, value, slot: index, row: 0 }));
  const frames: VizScene['frames'] = [];
  const code = [
    'balde = valor * numBaldes / (maior + 1)',
    'distribui cada elemento no seu balde',
    'ordena cada balde (insertion sort)',
    'concatena os baldes em ordem',
  ];
  const rowGap = 46;
  const push = (caption: string, codeLine: number, vars: Record<string, string>) => {
    frames.push(snap(arrayNodes(items, width, rowGap), [], [], caption, codeLine, Object.entries(vars).map(([name, value]) => ({ name, value }))));
  };

  const numBaldes = items.length;
  const offset = Math.min(0, ...values);
  const maior = Math.max(...values.map((value) => value - offset));
  const baldeDe = (value: number) => Math.min(numBaldes - 1, Math.floor(((value - offset) * numBaldes) / (maior + 1)));

  push(
    `O Bucket Sort distribui os elementos em ${numBaldes} baldes por faixa de valor (cada fileira abaixo é um balde) e ordena cada um.`,
    0,
    { numBaldes: String(numBaldes) },
  );

  const ocupacaoBalde = new Array(numBaldes).fill(0);
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    const b = baldeDe(item.value);
    item.state = 'compare';
    push(`balde(${item.value}) = ${item.value} * ${numBaldes} / (${maior + 1}) → balde ${b}.`, 0, { elemento: String(item.value), balde: String(b) });

    item.row = b + 1;
    item.slot = ocupacaoBalde[b];
    ocupacaoBalde[b] += 1;
    item.state = 'visited';
    push(`${item.value} cai no balde ${b}.`, 1, { balde: String(b) });
  }

  for (let b = 0; b < numBaldes; b += 1) {
    const doBalde = items.filter((item) => item.row === b + 1).sort((x, y) => x.value - y.value);
    doBalde.forEach((item, index) => {
      item.slot = index;
    });
  }
  push('Cada balde é ordenado internamente com insertion sort (os poucos elementos de cada um se reorganizam na própria fileira).', 2, { status: 'baldes ordenados' });

  let pos = 0;
  for (let b = 0; b < numBaldes; b += 1) {
    const doBalde = items.filter((item) => item.row === b + 1).sort((x, y) => x.slot - y.slot);
    for (const item of doBalde) {
      item.state = 'active';
      push(`Balde ${b}, próximo elemento: ${item.value}.`, 3, { balde: String(b) });

      item.row = 0;
      item.slot = pos;
      item.state = 'inserted';
      push(`${item.value} concatenado na posição final ${pos}.`, 3, { posicao: String(pos) });
      item.state = 'found';
      pos += 1;
    }
  }

  items.forEach((item) => {
    item.state = 'sorted';
  });
  push('Vetor ordenado. Melhor caso Θ(n) com distribuição uniforme; pior caso Θ(n²) se tudo cair no mesmo balde.', 3, { status: 'concluído' });

  return { operation: 'Bucket Sort', complexity: 'Θ(n) médio', code, frames, width, height: 150 + (numBaldes + 1) * rowGap + 70 };
}

/* ---------- RADIX SORT ---------- */

export function buildRadixSortScene(values: number[]): VizScene {
  const width = 540;
  const items: ArrayItem[] = values.map((value, index) => ({ id: `value-${index}`, value, slot: index, row: 1 }));
  const frames: VizScene['frames'] = [];
  const code = [
    'para exp = 1, 10, 100, ... enquanto maior/exp > 0:',
    '  digito = (vetor[i] / exp) % 10',
    '  counting sort estável usando digito como chave',
  ];
  const push = (caption: string, codeLine: number, vars: Record<string, string>) => {
    frames.push(snap(arrayNodes(items, width, 64), [], [], caption, codeLine, Object.entries(vars).map(([name, value]) => ({ name, value }))));
  };

  push(
    'O Radix Sort repete um Counting Sort estável por dígito, das unidades ao dígito mais significativo (fileira de baixo = entrada da rodada).',
    0,
    { n: String(items.length) },
  );

  const offset = Math.min(0, ...values);
  const maiorTotal = Math.max(...values.map((value) => value - offset));
  const digitoNomes = ['unidades', 'dezenas', 'centenas', 'milhares'];
  let digito = 0;

  for (let exp = 1; Math.floor(maiorTotal / exp) > 0; exp *= 10) {
    const nomeDigito = digitoNomes[digito] ?? `10^${digito}`;
    const ordemAtual = [...items].sort((a, b) => a.slot - b.slot);
    const n10 = 10;
    const count = new Array(n10).fill(0);

    for (const item of ordemAtual) {
      const d = Math.floor((item.value - offset) / exp) % n10;
      count[d] += 1;
    }
    for (let i = 1; i < n10; i += 1) count[i] += count[i - 1];

    push(`Rodada do dígito das ${nomeDigito} (exp = ${exp}): extraindo o dígito de cada elemento.`, 1, { exp: String(exp) });

    for (let i = ordemAtual.length - 1; i >= 0; i -= 1) {
      const item = ordemAtual[i];
      const d = Math.floor((item.value - offset) / exp) % n10;
      item.state = 'active';
      push(`vetor[${i}] = ${item.value}: dígito das ${nomeDigito} é ${d}.`, 2, { i: String(i), digito: String(d) });

      const pos = count[d] - 1;
      count[d] -= 1;
      item.row = 0;
      item.slot = pos;
      item.state = 'inserted';
      push(`${item.value} vai pra posição ${pos} desta rodada.`, 2, { posicao: String(pos) });
      item.state = 'found';
    }

    const temProximaRodada = Math.floor(maiorTotal / (exp * 10)) > 0;
    if (temProximaRodada) {
      items.forEach((item) => {
        item.row = 1;
        item.state = 'default';
      });
      push(`Rodada do dígito das ${nomeDigito} concluída — este resultado vira a entrada da próxima rodada.`, 2, { status: 'rodada concluída' });
    }

    digito += 1;
  }

  items.forEach((item) => {
    item.state = 'sorted';
  });
  push('Vetor ordenado. Custo Θ(d · n), onde d é o número de dígitos do maior valor.', 2, { status: 'concluído' });

  return { operation: 'Radix Sort', complexity: 'Θ(d · n)', code, frames, width, height: 320 };
}

/* ---------- BUSCA SEQUENCIAL ---------- */

export function buildSequentialSearchScene(values: number[], target: number): VizScene {
  const width = 540;
  const items: ArrayItem[] = values.map((value, index) => ({ id: `value-${index}`, value, slot: index }));
  const frames: VizScene['frames'] = [];
  const code = ['para i = 0 até n-1:', '  se vetor[i] == x: retorna true', 'retorna false'];
  const push = (caption: string, codeLine: number, vars: Record<string, string>) => {
    frames.push(snap(arrayNodes(items, width), [], [], caption, codeLine, Object.entries(vars).map(([name, value]) => ({ name, value }))));
  };

  push(`Busca sequencial por ${target}: percorre do início ao fim, sem exigir vetor ordenado.`, 0, { x: String(target) });

  let achou = false;
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    item.state = 'compare';
    push(`vetor[${i}] = ${item.value} == ${target}?`, 1, { i: String(i) });

    if (item.value === target) {
      item.state = 'found';
      push(`Encontrado! vetor[${i}] = ${target}.`, 1, { i: String(i), resultado: 'true' });
      achou = true;
      break;
    }

    item.state = 'visited';
  }

  if (!achou) {
    push(`Chegou ao fim sem encontrar ${target}.`, 2, { resultado: 'false' });
  }

  return { operation: `Busca Sequencial por ${target}`, complexity: 'O(n)', code, frames, width, height: 280 };
}

/* ---------- BUSCA BINÁRIA ---------- */

export function buildBinarySearchScene(values: number[], target: number): VizScene {
  const width = 540;
  const wasSorted = values.every((value, index) => index === 0 || values[index - 1] <= value);
  const sorted = [...values].sort((a, b) => a - b);
  const items: ArrayItem[] = sorted.map((value, index) => ({ id: `value-${index}`, value, slot: index }));
  const frames: VizScene['frames'] = [];
  const code = [
    'esq = 0; dir = n-1',
    'enquanto esq <= dir:',
    '  meio = (esq+dir)/2',
    '  se vetor[meio] == x: retorna true',
    '  senao se x > vetor[meio]: esq = meio+1',
    '  senao: dir = meio-1',
    'retorna false',
  ];
  const push = (caption: string, codeLine: number, vars: Record<string, string>) => {
    frames.push(snap(arrayNodes(items, width), [], [], caption, codeLine, Object.entries(vars).map(([name, value]) => ({ name, value }))));
  };

  push(
    `Busca binária por ${target}.${wasSorted ? '' : ' O vetor foi ordenado primeiro: busca binária exige vetor ordenado.'}`,
    0,
    { x: String(target) },
  );

  let esq = 0;
  let dir = items.length - 1;
  let achou = false;

  while (esq <= dir) {
    const meio = Math.floor((esq + dir) / 2);
    const meioItem = items[meio];
    items.forEach((item, index) => {
      item.state = index < esq || index > dir ? 'muted' : index === meio ? 'compare' : 'default';
    });
    push(`esq=${esq}, dir=${dir}, meio=${meio}: vetor[${meio}] = ${meioItem.value}.`, 2, { esq: String(esq), dir: String(dir), meio: String(meio) });

    if (meioItem.value === target) {
      meioItem.state = 'found';
      push(`Encontrado! vetor[${meio}] = ${target}.`, 3, { resultado: 'true' });
      achou = true;
      break;
    }

    if (target > meioItem.value) {
      push(`${target} > ${meioItem.value}: descarta a metade esquerda.`, 4, { esq: String(meio + 1), dir: String(dir) });
      esq = meio + 1;
    } else {
      push(`${target} < ${meioItem.value}: descarta a metade direita.`, 5, { esq: String(esq), dir: String(meio - 1) });
      dir = meio - 1;
    }
  }

  if (!achou) {
    items.forEach((item) => {
      item.state = 'default';
    });
    push(`esq > dir: ${target} não está no vetor.`, 6, { resultado: 'false' });
  }

  return { operation: `Busca Binária por ${target}`, complexity: 'O(log n)', code, frames, width, height: 280 };
}
