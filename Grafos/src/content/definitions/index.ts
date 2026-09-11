import type { Question } from '@/content/types';
import type { DefinitionQuestion } from './builder';

export { definitionQuestions } from './open';
export { closedDefinitionQuestions, isDefinitionFamily } from './closed';
export type { DefinitionQuestion } from './builder';

/** Questão ABERTA "defina o conceito" (tipo DEFINITION). Para incluir as fechadas geradas, use `isDefinitionFamily`. */
export function isDefinitionQuestion(q: Question): q is DefinitionQuestion {
  return q.type === 'DEFINITION';
}
