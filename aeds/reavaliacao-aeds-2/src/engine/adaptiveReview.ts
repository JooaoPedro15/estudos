import { reviewVariations } from '../content/reviewVariations';
import type { MistakeTag, PracticeVariation } from '../types/content';
import type { ErrorNotebook, ErrorRecord, ErrorType, StepAttempt } from '../types/progress';

/** Acertos espacados necessarios para considerar o conteudo dominado. */
export const MASTERY_TARGET = 3;

export function createEmptyNotebook(): ErrorNotebook {
  return { records: [] };
}

/**
 * Registra uma resposta ERRADA no caderno, agrupando por tipo + modulo +
 * assunto. Respostas certas nao criam registros aqui (ver applyAttempt).
 */
export function recordStepAttempt(
  notebook: ErrorNotebook,
  attempt: StepAttempt,
  seenAt = new Date().toISOString(),
): ErrorNotebook {
  if (attempt.correct) {
    return notebook;
  }

  const id = buildErrorRecordId(attempt);
  const existingRecord = notebook.records.find((record) => record.id === id);

  if (!existingRecord) {
    return {
      records: [
        ...notebook.records,
        {
          id,
          type: attempt.questionType,
          moduleId: attempt.moduleId,
          domainId: attempt.domainId,
          skillId: attempt.skillId,
          questionFormat: attempt.format,
          subjectTag: attempt.subjectTag,
          mistakeTag: attempt.mistakeTag,
          challengeId: attempt.stepId,
          questionId: attempt.questionId,
          attempts: 1,
          correctCount: 0,
          masteryLevel: 0,
          firstSeenAt: seenAt,
          lastSeenAt: seenAt,
          resolved: false,
        },
      ],
    };
  }

  return updateRecord(notebook, id, {
    ...existingRecord,
    mistakeTag: attempt.mistakeTag ?? existingRecord.mistakeTag,
    challengeId: attempt.stepId,
    questionId: attempt.questionId ?? existingRecord.questionId,
    attempts: existingRecord.attempts + 1,
    // Reincidir zera o dominio: precisa reaprender do zero.
    masteryLevel: 0,
    lastSeenAt: seenAt,
    resolved: false,
  });
}

/**
 * Aplica QUALQUER tentativa (de qualquer modo de treino) ao caderno:
 * - erro cria/incrementa o registro e zera o dominio;
 * - acerto avanca o dominio do erro em recuperacao (targetId) ou, na falta
 *   dele, do erro mais prioritario do mesmo tipo e modulo.
 */
export function applyAttempt(
  notebook: ErrorNotebook,
  attempt: StepAttempt,
  targetId?: string | null,
  seenAt = new Date().toISOString(),
): ErrorNotebook {
  if (!attempt.correct) {
    return recordStepAttempt(notebook, attempt, seenAt);
  }

  if (targetId && notebook.records.some((record) => record.id === targetId && !record.resolved)) {
    return recordReviewResult(notebook, targetId, true, seenAt);
  }

  const match = findMatchingRecord(notebook, attempt);
  if (match) {
    return recordReviewResult(notebook, match.id, true, seenAt);
  }

  return notebook;
}

/** Erro nao resolvido mais prioritario compativel com um acerto. */
function findMatchingRecord(notebook: ErrorNotebook, attempt: StepAttempt): ErrorRecord | undefined {
  const candidates = getPriorityErrors(notebook).filter(
    (record) => record.type === attempt.questionType && record.moduleId === attempt.moduleId,
  );

  if (attempt.subjectTag) {
    const exact = candidates.find((record) => record.subjectTag === attempt.subjectTag);
    if (exact) {
      return exact;
    }
  }

  return candidates[0];
}

export function getPriorityErrors(notebook: ErrorNotebook): ErrorRecord[] {
  return [...notebook.records]
    .filter((record) => !record.resolved)
    .sort((left, right) => {
      const scoreDelta = priorityScore(right) - priorityScore(left);
      if (scoreDelta !== 0) {
        return scoreDelta;
      }

      const rightTime = new Date(right.lastSeenAt).getTime();
      const leftTime = new Date(left.lastSeenAt).getTime();
      return (Number.isNaN(rightTime) ? 0 : rightTime) - (Number.isNaN(leftTime) ? 0 : leftTime);
    });
}

/**
 * Prioriza mais erros, dominio baixo e poucos acertos. A recencia entra como
 * desempate na ordenacao acima.
 */
function priorityScore(record: ErrorRecord): number {
  const attempts = record.attempts ?? 0;
  const mastery = record.masteryLevel ?? 0;
  const corrects = record.correctCount ?? 0;
  return attempts * 3 + Math.max(0, MASTERY_TARGET - mastery) - corrects;
}

/**
 * Resultado de uma questao de recuperacao para um registro especifico.
 * Acerto sobe uma caixa de Leitner (dominio); erro derruba para zero.
 */
export function recordReviewResult(
  notebook: ErrorNotebook,
  recordId: string,
  correct: boolean,
  seenAt = new Date().toISOString(),
): ErrorNotebook {
  const record = notebook.records.find((item) => item.id === recordId);

  if (!record) {
    return notebook;
  }

  if (!correct) {
    return updateRecord(notebook, recordId, {
      ...record,
      attempts: record.attempts + 1,
      masteryLevel: 0,
      lastSeenAt: seenAt,
      resolved: false,
    });
  }

  const masteryLevel = (record.masteryLevel ?? 0) + 1;

  return updateRecord(notebook, recordId, {
    ...record,
    correctCount: (record.correctCount ?? 0) + 1,
    masteryLevel,
    lastSeenAt: seenAt,
    resolved: masteryLevel >= MASTERY_TARGET,
  });
}

export function selectSimilarPractice(
  record: ErrorRecord,
  variations: PracticeVariation[] = reviewVariations,
): PracticeVariation | undefined {
  return (
    variations.find(
      (variation) =>
        variation.domainId === record.domainId && variation.targetMistakeTag === record.mistakeTag,
    ) ?? variations.find((variation) => variation.targetMistakeTag === record.mistakeTag)
  );
}

const typeLabels: Record<ErrorType, string> = {
  codigo: 'Codigo',
  conceitual: 'Conceitual',
  desenho: 'Desenho',
};

const subjectLabels: Record<MistakeTag, string> = {
  'wrong-rotation': 'Rotacao',
  'lost-pointer': 'Ponteiros',
  'prefix-vs-word': 'Prefixo x palavra',
  'incomplete-layer-search': 'Busca em camadas',
  'wrong-summation-bound': 'Somatorio',
  'missing-base-case': 'Caso base',
  'wrong-case-analysis': 'Analise de casos',
  'algorithm-confusion': 'Escolha do algoritmo',
};

export function getErrorTypeLabel(type: ErrorType): string {
  return typeLabels[type];
}

/** Rotulo do assunto/operacao do erro; cai no generico quando nao ha tag. */
export function getSubjectLabel(record: ErrorRecord): string {
  if (record.subjectTag) {
    return subjectLabels[record.subjectTag];
  }
  if (record.mistakeTag) {
    return subjectLabels[record.mistakeTag];
  }
  return 'Revisao geral';
}

function buildErrorRecordId(attempt: StepAttempt): string {
  return `${attempt.questionType}:${attempt.moduleId}:${attempt.subjectTag ?? 'geral'}`;
}

function updateRecord(notebook: ErrorNotebook, recordId: string, updatedRecord: ErrorRecord): ErrorNotebook {
  return {
    records: notebook.records.map((record) => (record.id === recordId ? updatedRecord : record)),
  };
}
