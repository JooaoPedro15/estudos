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

type ArrayItem = { id: string; value: number; slot: number; state?: VizNode['state']; dropped?: boolean; sub?: string };

function arrayNodes(items: ArrayItem[], width: number): VizNode[] {
  const cellWidth = Math.min(76, (width - 58) / items.length);
  const start = width / 2 - (cellWidth * (items.length - 1)) / 2;

  return [...items]
    .sort((a, b) => a.slot - b.slot)
    .map((item) =>
      n(item.id, start + item.slot * cellWidth, item.dropped ? 150 + 72 : 150, String(item.value), {
        shape: 'box',
        w: cellWidth - 10,
        h: 52,
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
    keyItem.dropped = true;
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
    keyItem.dropped = false;
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
  const items: ArrayItem[] = values.map((value, index) => ({ id: `value-${index}`, value, slot: index }));
  const frames: VizScene['frames'] = [];
  const code = [
    'count[v] = quantas vezes v aparece',
    'acumula count[i] += count[i-1]',
    'para i = n-1 até 0:',
    '  saida[count[vetor[i]] - 1] = vetor[i]',
    '  count[vetor[i]]--',
  ];
  const push = (caption: string, codeLine: number, vars: Record<string, string>) => {
    frames.push(snap(arrayNodes(items, width), [], [], caption, codeLine, Object.entries(vars).map(([name, value]) => ({ name, value }))));
  };

  push('O Counting Sort conta ocorrências de cada valor, sem comparar elementos entre si.', 0, { n: String(items.length) });

  const offset = Math.min(0, ...values);
  const shifted = values.map((value) => value - offset);
  const maior = Math.max(...shifted);
  const count = new Array(maior + 1).fill(0);
  for (const value of shifted) count[value] += 1;
  push('Contando quantas vezes cada valor aparece no vetor.', 1, { k: String(maior + 1) });

  for (let i = 1; i <= maior; i += 1) count[i] += count[i - 1];
  push('Acumulando as contagens: agora count[v] diz quantos elementos são ≤ v.', 2, {});

  const finalSlot = new Map<string, number>();
  for (let i = items.length - 1; i >= 0; i -= 1) {
    const value = shifted[i];
    const pos = count[value] - 1;
    finalSlot.set(items[i].id, pos);
    count[value] -= 1;
  }

  items.forEach((item) => {
    item.state = 'active';
    item.slot = finalSlot.get(item.id)!;
  });
  push('Cada elemento vai direto para a posição indicada pela contagem acumulada.', 4, { status: 'posicionado' });

  items.forEach((item) => {
    item.state = 'sorted';
  });
  push('Vetor ordenado. Custo Θ(n + k), onde k é o maior valor — não depende de comparações.', 4, { status: 'concluído' });

  return { operation: 'Counting Sort', complexity: 'Θ(n + k)', code, frames, width, height: 280 };
}

/* ---------- BUCKET SORT ---------- */

export function buildBucketSortScene(values: number[]): VizScene {
  const width = 540;
  const items: ArrayItem[] = values.map((value, index) => ({ id: `value-${index}`, value, slot: index }));
  const frames: VizScene['frames'] = [];
  const code = [
    'balde = valor * numBaldes / (maior + 1)',
    'distribui cada elemento no seu balde',
    'ordena cada balde (insertion sort)',
    'concatena os baldes em ordem',
  ];
  const push = (caption: string, codeLine: number, vars: Record<string, string>) => {
    frames.push(snap(arrayNodes(items, width), [], [], caption, codeLine, Object.entries(vars).map(([name, value]) => ({ name, value }))));
  };

  push('O Bucket Sort distribui os elementos em faixas de valor (baldes) e ordena cada uma.', 0, { numBaldes: String(items.length) });

  const offset = Math.min(0, ...values);
  const shifted = values.map((value) => value - offset);
  const numBaldes = items.length;
  const maior = Math.max(...shifted);
  const baldeDe = shifted.map((value) => Math.min(numBaldes - 1, Math.floor((value * numBaldes) / (maior + 1))));

  items.forEach((item, index) => {
    item.state = 'compare';
    item.sub = `balde ${baldeDe[index]}`;
  });
  push('Cada elemento é atribuído a um balde, conforme a faixa em que seu valor cai.', 1, { status: 'distribuído' });

  const ordemFinal = items
    .map((item, index) => ({ item, balde: baldeDe[index], value: shifted[index] }))
    .sort((a, b) => (a.balde !== b.balde ? a.balde - b.balde : a.value - b.value));

  ordemFinal.forEach(({ item }, slot) => {
    item.slot = slot;
    item.state = 'active';
  });
  push('Cada balde é ordenado internamente (insertion sort) e concatenado na ordem dos baldes.', 3, { status: 'reunido' });

  items.forEach((item) => {
    item.state = 'sorted';
    item.sub = undefined;
  });
  push('Vetor ordenado. Melhor caso Θ(n) com distribuição uniforme; pior caso Θ(n²) se tudo cair no mesmo balde.', 3, { status: 'concluído' });

  return { operation: 'Bucket Sort', complexity: 'Θ(n) médio', code, frames, width, height: 280 };
}

/* ---------- RADIX SORT ---------- */

export function buildRadixSortScene(values: number[]): VizScene {
  const width = 540;
  const items: ArrayItem[] = values.map((value, index) => ({ id: `value-${index}`, value, slot: index }));
  const frames: VizScene['frames'] = [];
  const code = [
    'para exp = 1, 10, 100, ... enquanto maior/exp > 0:',
    '  counting sort usando (vetor[i] / exp) % 10 como chave',
  ];
  const push = (caption: string, codeLine: number, vars: Record<string, string>) => {
    frames.push(snap(arrayNodes(items, width), [], [], caption, codeLine, Object.entries(vars).map(([name, value]) => ({ name, value }))));
  };

  push('O Radix Sort repete um Counting Sort por dígito, das unidades ao dígito mais significativo.', 0, { n: String(items.length) });

  const offset = Math.min(0, ...values);
  let shifted = values.map((value) => value - offset);
  const maiorTotal = Math.max(...shifted);
  const digitoNomes = ['unidades', 'dezenas', 'centenas', 'milhares'];
  let digito = 0;

  for (let exp = 1; Math.floor(maiorTotal / exp) > 0; exp *= 10) {
    const n10 = 10;
    const count = new Array(n10).fill(0);
    const currentShifted = shifted;
    for (const value of currentShifted) count[Math.floor(value / exp) % n10] += 1;
    for (let i = 1; i < n10; i += 1) count[i] += count[i - 1];

    const output = new Array(currentShifted.length);
    const outputIds = new Array<string>(currentShifted.length);
    for (let i = currentShifted.length - 1; i >= 0; i -= 1) {
      const value = currentShifted[i];
      const d = Math.floor(value / exp) % n10;
      const pos = count[d] - 1;
      output[pos] = value;
      outputIds[pos] = items[i].id;
      count[d] -= 1;
    }

    outputIds.forEach((id, slot) => {
      const item = items.find((candidate) => candidate.id === id)!;
      item.slot = slot;
      item.state = 'active';
    });
    push(
      `Ordenando pelo dígito das ${digitoNomes[digito] ?? `10^${digito}`} (exp = ${exp}).`,
      1,
      { exp: String(exp) },
    );

    shifted = output;
    digito += 1;
  }

  items.forEach((item) => {
    item.state = 'sorted';
  });
  push('Vetor ordenado. Custo Θ(d · n), onde d é o número de dígitos do maior valor.', 1, { status: 'concluído' });

  return { operation: 'Radix Sort', complexity: 'Θ(d · n)', code, frames, width, height: 280 };
}
