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

type ArrayItem = { id: string; value: number; slot: number; state?: VizNode['state'] };

function arrayNodes(items: ArrayItem[], width: number): VizNode[] {
  const cellWidth = Math.min(76, (width - 58) / items.length);
  const start = width / 2 - (cellWidth * (items.length - 1)) / 2;

  return [...items]
    .sort((a, b) => a.slot - b.slot)
    .map((item) =>
      n(item.id, start + item.slot * cellWidth, 150, String(item.value), {
        shape: 'box',
        w: cellWidth - 10,
        h: 52,
        state: item.state ?? 'default',
        sub: `[${item.slot}]`,
      }),
    );
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
