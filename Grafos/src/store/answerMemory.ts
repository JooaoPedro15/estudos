/** 0 = ordenar, 1 = completar lacunas, 2 = escrever de memória. */
export type MemoryStage = 0 | 1 | 2;

export interface MemoryEntry {
  stage: MemoryStage;
  attempts: number;
  /** Quantas vezes errou: quem erra mais volta primeiro na revisão. */
  lapses: number;
  interval: number;
  dueAt: number;
}

export type AnswerMemory = Record<string, MemoryEntry>;

const STORAGE_KEY = 'grafos-answer-memory-v2';
const MINUTE = 60 * 1000;
/** Ao subir de etapa, a parte volta logo; depois de escrever de memória, o intervalo cresce. */
const NEXT_STAGE_MINUTES = 10;
const REVIEW_MINUTES = [20, 60, 4 * 60, 24 * 60, 3 * 24 * 60, 7 * 24 * 60, 16 * 24 * 60];

export function loadMemory(): AnswerMemory {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.fromEntries(Object.entries(parsed).filter((entry): entry is [string, MemoryEntry] => {
      const value = entry[1] as Partial<MemoryEntry>;
      return value && (value.stage === 0 || value.stage === 1 || value.stage === 2)
        && [value.attempts, value.lapses, value.interval, value.dueAt].every(Number.isFinite);
    }));
  } catch { return {}; }
}

export function saveMemory(memory: AnswerMemory): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(memory)); } catch { /* Navegação privada ou armazenamento indisponível. */ }
}

/** `played` é a etapa em que a tentativa foi feita; `minStage` impede cair numa etapa que a parte não tem. */
export function recordAttempt(memory: AnswerMemory, id: string, cleanSuccess: boolean, played: MemoryStage, minStage: MemoryStage = 0, now = Date.now()): AnswerMemory {
  const before = memory[id] ?? { stage: minStage, attempts: 0, lapses: 0, interval: 0, dueAt: 0 };
  let { interval, lapses } = before;
  let stage: MemoryStage = played;
  let dueAt = now;
  if (cleanSuccess && played < 2) {
    stage = (played + 1) as MemoryStage;
    dueAt = now + NEXT_STAGE_MINUTES * MINUTE;
  } else if (cleanSuccess) {
    dueAt = now + REVIEW_MINUTES[Math.min(interval, REVIEW_MINUTES.length - 1)] * MINUTE;
    interval += 1;
  } else {
    stage = Math.max(minStage, played - 1) as MemoryStage;
    interval = 0;
    lapses += 1;
  }
  return { ...memory, [id]: { stage, attempts: before.attempts + 1, lapses, interval, dueAt } };
}

/** Vencidas, com as mais erradas na frente. */
export function dueIds(memory: AnswerMemory, now = Date.now()): string[] {
  return Object.entries(memory)
    .filter(([, entry]) => entry.attempts > 0 && entry.dueAt <= now)
    .sort((a, b) => b[1].lapses - a[1].lapses || a[1].dueAt - b[1].dueAt)
    .map(([id]) => id);
}
