import type { Topic } from '../types';
import { fundamentosTopics } from './01-fundamentos';
import { representacoesTopics } from './02-representacoes';
import { isomorfismoTopics } from './03-isomorfismo';
import { buscaTopics } from './04-busca';
import { conectividadeTopics } from './05-conectividade';

export const topics: Topic[] = [
  ...fundamentosTopics,
  ...representacoesTopics,
  ...isomorfismoTopics,
  ...buscaTopics,
  ...conectividadeTopics,
];

export function getTopic(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}

export function topicsForModule(moduleId: string): Topic[] {
  return topics.filter((t) => t.moduleId === moduleId).sort((a, b) => a.order - b.order);
}
