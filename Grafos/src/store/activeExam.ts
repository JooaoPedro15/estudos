import { useSyncExternalStore } from 'react';
import type { ExamId } from '@/content/types';

// Prova ativa (P1 ou P2): decide quais módulos, sessões e simulados o app
// mostra. Fica no localStorage — é conveniência de quem está estudando, não
// dado que precise sobreviver a limpar o navegador.

const KEY = 'graphlab:active-exam';
const listeners = new Set<() => void>();

function read(): ExamId {
  try {
    return localStorage.getItem(KEY) === 'P1' ? 'P1' : 'P2';
  } catch {
    return 'P2';
  }
}

let current: ExamId = read();

export function getActiveExam(): ExamId {
  return current;
}

export function setActiveExam(exam: ExamId): void {
  current = exam;
  try {
    localStorage.setItem(KEY, exam);
  } catch {
    // sem storage (aba anônima, etc.): vale só até recarregar
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useActiveExam(): ExamId {
  return useSyncExternalStore(subscribe, getActiveExam, getActiveExam);
}
