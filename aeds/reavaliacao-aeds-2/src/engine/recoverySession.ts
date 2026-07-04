import {
  getQuestionsForConceptualDrawingModule,
  type ConceptualDrawingModuleId,
  type ConceptualDrawingQuestion,
  type ConceptualDrawingType,
} from '../content/lista2Questions';
import { getDrillsForModule, type PracticeModuleId } from '../content/practiceModules';
import type { CodeDrill, MistakeTag } from '../types/content';
import type { ErrorRecord } from '../types/progress';

/**
 * Sessao de recuperacao: transforma um erro do caderno em um treino curto,
 * focado e progressivo, sempre no MODO e MODULO corretos.
 *
 * Estrutura do baralho (ver requisito 3):
 * 1. questao parecida com a errada;
 * 2. mesmo assunto com pequena variacao;
 * 3. uma questao um pouco mais dificil;
 * 4. questoes de revisao do mesmo modulo.
 */

export type PracticeMode = 'practice' | 'conceptual' | 'drawing';

export type PracticeTarget = {
  mode: PracticeMode;
  moduleId: PracticeModuleId & ConceptualDrawingModuleId;
};

/** Tamanho maximo do baralho de recuperacao (curto e focado). */
export const RECOVERY_DECK_SIZE = 5;

const DIFFICULTY_RANK: Record<string, number> = {
  basico: 0,
  intermediario: 1,
  avancado: 2,
  reavaliacao: 3,
  desafio: 4,
};

function rankOf(difficulty: string | undefined): number {
  return difficulty ? DIFFICULTY_RANK[difficulty] ?? 1 : 1;
}

function conceptualType(mode: PracticeMode): ConceptualDrawingType {
  return mode === 'drawing' ? 'desenho' : 'conceitual';
}

/**
 * Escolhe modo + modulo compativel com o erro, garantindo que o modulo tenha
 * questoes (senao cai para o dominio e, por fim, "all"). Nunca envia para um
 * treino incompativel com o tipo do erro.
 */
export function resolvePracticeTarget(record: ErrorRecord): PracticeTarget {
  if (record.type === 'codigo') {
    const moduleId = firstNonEmpty(
      [record.moduleId, record.domainId, 'all'],
      (id) => getDrillsForModule(id as PracticeModuleId).length > 0,
    );
    return { mode: 'practice', moduleId: moduleId as PracticeTarget['moduleId'] };
  }

  const mode: PracticeMode = record.type === 'desenho' ? 'drawing' : 'conceptual';
  const type = conceptualType(mode);
  const moduleId = firstNonEmpty(
    [record.moduleId, record.domainId, 'all'],
    (id) => getQuestionsForConceptualDrawingModule(id as ConceptualDrawingModuleId, type).length > 0,
  );
  return { mode, moduleId: moduleId as PracticeTarget['moduleId'] };
}

function firstNonEmpty(candidates: string[], hasContent: (id: string) => boolean): string {
  return candidates.find((id) => hasContent(id)) ?? 'all';
}

/** Ordem dos drills de codigo: parecido -> mesmo assunto -> mais dificil -> revisao. */
export function buildCodeRecoveryOrder(record: ErrorRecord, drills: CodeDrill[]): string[] {
  const similar = drills.filter(
    (drill) => drill.id === record.questionId || drill.step.id === record.challengeId,
  );
  const similarIds = new Set(similar.map((drill) => drill.id));

  const sameSubject = drills
    .filter((drill) => !similarIds.has(drill.id) && stepMistakeTag(drill) === record.subjectTag && record.subjectTag)
    .sort((left, right) => rankOf(left.difficulty) - rankOf(right.difficulty));
  const chosenIds = new Set([...similarIds, ...sameSubject.map((drill) => drill.id)]);

  const rest = drills
    .filter((drill) => !chosenIds.has(drill.id))
    .sort((left, right) => rankOf(left.difficulty) - rankOf(right.difficulty));

  return dedupe([...similar, ...sameSubject, ...rest].map((drill) => drill.id)).slice(0, RECOVERY_DECK_SIZE);
}

/** Ordem das questoes conceituais/desenho: parecida -> mesmo modulo por dificuldade. */
export function buildConceptualRecoveryOrder(
  record: ErrorRecord,
  questions: ConceptualDrawingQuestion[],
): string[] {
  const similar = questions.filter((question) => question.id === record.questionId);
  const similarIds = new Set(similar.map((question) => question.id));

  const rest = questions
    .filter((question) => !similarIds.has(question.id))
    .sort((left, right) => rankOf(left.difficulty) - rankOf(right.difficulty));

  return dedupe([...similar, ...rest].map((question) => question.id)).slice(0, RECOVERY_DECK_SIZE);
}

function stepMistakeTag(drill: CodeDrill): MistakeTag | undefined {
  return 'mistakeTag' in drill.step ? drill.step.mistakeTag : undefined;
}

function dedupe(ids: string[]): string[] {
  return [...new Set(ids)];
}
