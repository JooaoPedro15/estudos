import { useSyncExternalStore } from 'react';
import type { ExamScope } from '@/content/types';

// Conteúdo ativo (tudo, P1 ou P2): decide quais módulos, sessões e simulados o app
// mostra. Fica no localStorage — é conveniência de quem está estudando, não
// dado que precise sobreviver a limpar o navegador.

const KEY = 'graphlab:active-exam';
const listeners = new Set<() => void>();

function read(): ExamScope {
  try {
    const saved = localStorage.getItem(KEY);
    return saved === 'P1' || saved === 'P2' || saved === 'all' ? saved : 'all';
  } catch {
    return 'all';
  }
}

let current: ExamScope = read();

export function getActiveExam(): ExamScope {
  return current;
}

export function setActiveExam(exam: ExamScope): void {
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

export function useActiveExam(): ExamScope {
  return useSyncExternalStore(subscribe, getActiveExam, getActiveExam);
}
