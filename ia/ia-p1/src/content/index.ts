import { moduloArvore, questoesArvore } from './modulos/arvore';
import { moduloAssoc, questoesAssoc } from './modulos/assoc';
import { moduloBayes, questoesBayes } from './modulos/bayes';
import { moduloCodigos, questoesCodigos } from './modulos/codigos';
import { moduloEnsemble, questoesEnsemble } from './modulos/ensemble';
import { moduloIntro, questoesIntro } from './modulos/intro';
import { moduloPreproc, questoesPreproc } from './modulos/preproc';
import { PROVA_2025 } from './simulado2025';
import type { Modulo, ModuloId, Questao } from './types';

export const MODULOS: Modulo[] = [moduloIntro, moduloPreproc, moduloArvore, moduloEnsemble, moduloAssoc, moduloBayes, moduloCodigos];

export const QUESTOES: Questao[] = [
  ...questoesIntro,
  ...questoesPreproc,
  ...questoesArvore,
  ...questoesEnsemble,
  ...questoesAssoc,
  ...questoesBayes,
  ...questoesCodigos,
];

const porId = new Map<string, Questao>([...QUESTOES, ...PROVA_2025].map((q) => [q.id, q]));

export const questao = (id: string): Questao | undefined => porId.get(id);
export const modulo = (id: string): Modulo | undefined => MODULOS.find((m) => m.id === id);
export const questoesDoModulo = (id: ModuloId): Questao[] => QUESTOES.filter((q) => q.modulo === id);

/** Data da prova: segunda-feira, 05/10/2026 (horario local). */
export const DATA_PROVA = new Date(2026, 9, 5, 0, 0, 0);
