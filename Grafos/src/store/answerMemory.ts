export type MemoryStage = 0 | 1 | 2;

export interface CodeMemoryEntry {
  stage: MemoryStage;
  attempts: number;
  interval: number;
  dueAt: number;
}

export type CodeMemory = Record<string, CodeMemoryEntry>;

const STORAGE_KEY = 'grafos-code-memory-v1';
const DAY = 24 * 60 * 60 * 1000;
const REVIEW_DAYS = [1, 3, 7, 14, 30];

export function loadCodeMemory(): CodeMemory {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.fromEntries(Object.entries(parsed).filter((entry): entry is [string, CodeMemoryEntry] => {
      const value = entry[1] as Partial<CodeMemoryEntry>;
      return value && (value.stage === 0 || value.stage === 1 || value.stage === 2)
        && Number.isFinite(value.attempts) && Number.isFinite(value.interval) && Number.isFinite(value.dueAt);
    }));
  } catch { return {}; }
}

export function saveCodeMemory(memory: CodeMemory): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(memory)); } catch { /* Navegação privada ou armazenamento indisponível. */ }
}

export function recordCodeAttempt(memory: CodeMemory, id: string, cleanSuccess: boolean, now = Date.now()): CodeMemory {
  const before = memory[id] ?? { stage: 0, attempts: 0, interval: 0, dueAt: 0 };
  let stage = before.stage;
  let interval = before.interval;
  let dueAt = now;
  if (cleanSuccess) {
    if (stage < 2) stage = (stage + 1) as MemoryStage;
    else {
      dueAt = now + REVIEW_DAYS[Math.min(interval, REVIEW_DAYS.length - 1)] * DAY;
      interval += 1;
    }
  } else {
    stage = Math.max(0, stage - 1) as MemoryStage;
    interval = 0;
  }
  return { ...memory, [id]: { stage, attempts: before.attempts + 1, interval, dueAt } };
}

export function dueCodeIds(memory: CodeMemory, now = Date.now()): string[] {
  return Object.entries(memory).filter(([, entry]) => entry.attempts > 0 && entry.dueAt <= now).map(([id]) => id);
}

export function normalizeCodeLine(line: string): string {
  return line.trim().replace(/\s+/g, '').replaceAll('<-', '←');
}

export function hiddenLineIndices(length: number): number[] {
  if (length < 1) return [];
  return Array.from({ length }, (_, index) => index).filter((index) => index % 2 === 1 || (length === 1 && index === 0));
}
