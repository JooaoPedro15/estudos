import type { Topic } from '../types';
import { fundamentosTopics } from './01-fundamentos';
import { representacoesTopics } from './02-representacoes';
import { isomorfismoTopics } from './03-isomorfismo';
import { buscaTopics } from './04-busca';
import { conectividadeTopics } from './05-conectividade';
import { logicaConjuntosTopics } from './06-logica-conjuntos';
import { inducaoTopics } from './07-p2-inducao';
import { eulerHamiltonTopics } from './08-p2-euler-hamilton';
import { arvoresAgmTopics } from './09-p2-arvores-agm';
import { caminhosMinimosTopics } from './10-p2-caminhos-minimos';

export const topics: Topic[] = [
  ...fundamentosTopics,
  ...representacoesTopics,
  ...isomorfismoTopics,
  ...buscaTopics,
  ...conectividadeTopics,
  ...logicaConjuntosTopics,
  ...inducaoTopics,
  ...eulerHamiltonTopics,
  ...arvoresAgmTopics,
  ...caminhosMinimosTopics,
];

export function getTopic(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}

export function topicsForModule(moduleId: string): Topic[] {
  return topics.filter((t) => t.moduleId === moduleId).sort((a, b) => a.order - b.order);
}
