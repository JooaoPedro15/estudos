import type { ProgressState } from '@/content/types';
import { exportProgress, importProgress } from './progress';
import { loadMemory, saveMemory, type AnswerMemory } from './answerMemory';

const PREFIX = 'GRAFOS-BACKUP:';

interface Backup { version: 1; savedAt: string; memory: AnswerMemory; progress: ProgressState }

/** Texto único que leva o progresso (memorização e histórico de questões) para outro computador. */
export async function createBackupText(): Promise<string> {
  const backup: Backup = { version: 1, savedAt: new Date().toISOString(), memory: loadMemory(), progress: await exportProgress() };
  return PREFIX + btoa(unescape(encodeURIComponent(JSON.stringify(backup))));
}

export interface BackupSummary { parts: number; attempts: number; savedAt: string }

/** Valida e grava; substitui o progresso deste computador. */
export async function restoreBackupText(text: string): Promise<BackupSummary> {
  const raw = text.trim();
  if (!raw.startsWith(PREFIX)) throw new Error('Esse texto não é um backup do Grafos. Copie de novo, do início ao fim.');
  let backup: Partial<Backup>;
  try { backup = JSON.parse(decodeURIComponent(escape(atob(raw.slice(PREFIX.length))))); } catch { throw new Error('O texto do backup está incompleto ou corrompido. Copie de novo.'); }
  const { memory, progress } = backup;
  if (backup.version !== 1 || !memory || typeof memory !== 'object' || !progress || !Array.isArray(progress.attempts)) throw new Error('Backup em formato desconhecido.');
  saveMemory(memory);
  await importProgress(progress);
  return { parts: Object.keys(memory).length, attempts: progress.attempts.length, savedAt: backup.savedAt ?? '' };
}
