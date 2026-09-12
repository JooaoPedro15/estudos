import type { DefinitionQuestion } from './builder';
import { fundamentosDefinitions } from './fundamentos';
import { representacoesDefinitions } from './representacoes';
import { isomorfismoDefinitions } from './isomorfismo';
import { buscaConectividadeDefinitions } from './busca-conectividade';
import { logicaDefinitions } from './logica';
import { conjuntosDefinitions } from './conjuntos';
import { PREREQUISITES } from './prerequisites';

/**
 * Banco de "Defina o conceito de X" (questões ABERTAS) — uma por definição do
 * material do professor (slides 01–07, quadro, aulão e resumo).
 */
export const definitionQuestions: DefinitionQuestion[] = [
  ...fundamentosDefinitions,
  ...representacoesDefinitions,
  ...isomorfismoDefinitions,
  ...buscaConectividadeDefinitions,
  ...conjuntosDefinitions,
  ...logicaDefinitions,
].map((d) => ({ ...d, prerequisites: (PREREQUISITES[d.id.slice('def-'.length)] ?? []).map((p) => `def-${p}`) }));
