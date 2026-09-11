import type { Question } from '@/content/types';
import type { DefinitionQuestion } from './builder';
import { fundamentosDefinitions } from './fundamentos';
import { representacoesDefinitions } from './representacoes';
import { isomorfismoDefinitions } from './isomorfismo';
import { buscaConectividadeDefinitions } from './busca-conectividade';
import { logicaDefinitions } from './logica';
import { conjuntosDefinitions } from './conjuntos';

/**
 * Banco de "Defina o conceito de X" — uma questão por definição do material
 * do professor (slides 01–07, quadro, aulão e resumo). Entram no banco geral
 * (`content/questions`) e no modo "Decorar conceitos".
 */
export const definitionQuestions: DefinitionQuestion[] = [
  ...fundamentosDefinitions,
  ...representacoesDefinitions,
  ...isomorfismoDefinitions,
  ...buscaConectividadeDefinitions,
  ...conjuntosDefinitions,
  ...logicaDefinitions,
];

export function isDefinitionQuestion(q: Question): q is DefinitionQuestion {
  return q.type === 'DEFINITION';
}

export type { DefinitionQuestion } from './builder';
