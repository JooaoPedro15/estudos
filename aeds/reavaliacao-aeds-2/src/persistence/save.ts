import type { ConceptualDrawingModuleId } from '../content/lista2Questions';
import type { PracticeModuleId } from '../content/practiceModules';
import type { ConceptualPracticeSession } from '../engine/lista2Practice';
import type { ErrorNotebook, ExamSession, PracticeSession } from '../types/progress';

export const SAVE_KEY = 'reavaliacao-aeds-2:save';

export type SavedGameState = {
  session: ExamSession;
  notebook: ErrorNotebook;
  practiceSession?: PracticeSession;
  conceptualSession?: ConceptualPracticeSession;
  /** Modulo de treino ativo, para o deck restaurado bater com o filtro. */
  practiceModuleId?: PracticeModuleId | null;
  conceptualModuleId?: ConceptualDrawingModuleId | null;
  drawingModuleId?: ConceptualDrawingModuleId | null;
};

export function saveGame(state: SavedGameState, storage: Storage = window.localStorage): void {
  storage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function loadSavedGame(storage: Storage = window.localStorage): SavedGameState | undefined {
  const rawSave = storage.getItem(SAVE_KEY);

  if (!rawSave) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(rawSave) as Partial<SavedGameState>;

    if (!parsed.session || !parsed.notebook) {
      return undefined;
    }

    return parsed as SavedGameState;
  } catch {
    return undefined;
  }
}

export function clearSavedGame(storage: Storage = window.localStorage): void {
  storage.removeItem(SAVE_KEY);
}
