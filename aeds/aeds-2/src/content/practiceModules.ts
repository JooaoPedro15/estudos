import { codeDrillCatalog } from './codeDrills';
import { contentModuleCatalog } from './contentModules';
import type { CodeDrill, ContentModuleId } from '../types/content';

/**
 * Fonte única de classificação dos treinos por módulo.
 * O conteúdo já vem classificado em cada drill pelo campo `domainId`;
 * aqui só derivamos a lista de módulos disponíveis (os que realmente
 * possuem exercícios) e o filtro correspondente. Nada de condições
 * espalhadas pelo restante do código.
 */

export type PracticeModuleId = ContentModuleId | 'all';

export type PracticeModule = {
  id: PracticeModuleId;
  title: string;
  description: string;
  count: number;
};

/** Quantos drills existem por domínio. */
function getDrillModuleId(drill: CodeDrill): ContentModuleId {
  return drill.moduleId ?? drill.domainId;
}

function countByModule(): Map<ContentModuleId, number> {
  const counts = new Map<ContentModuleId, number>();
  for (const drill of codeDrillCatalog) {
    const moduleId = getDrillModuleId(drill);
    counts.set(moduleId, (counts.get(moduleId) ?? 0) + 1);
  }
  return counts;
}

/**
 * Lista de módulos oferecida na tela de seleção do treino de código.
 * Sempre começa por "Conteúdo inteiro" e segue com os domínios que
 * têm ao menos um exercício, reaproveitando título/descrição de
 * `domainCatalog`.
 */
export function getPracticeModules(): PracticeModule[] {
  const counts = countByModule();

  const specificModules: PracticeModule[] = contentModuleCatalog
    .filter((module) => (counts.get(module.id) ?? 0) > 0)
    .map((module) => ({
      id: module.id,
      title: module.title,
      description: module.description,
      count: counts.get(module.id) ?? 0,
    }));

  return [
    {
      id: 'all',
      title: 'Conteudo inteiro',
      description: 'Todas as questoes, em ordem aleatoria. Funciona como um treino geral da materia.',
      count: codeDrillCatalog.length,
    },
    ...specificModules,
  ];
}

/** Drills do módulo escolhido ("all" = catálogo completo). */
export function getDrillsForModule(moduleId: PracticeModuleId): CodeDrill[] {
  if (moduleId === 'all') {
    return codeDrillCatalog;
  }
  return codeDrillCatalog.filter((drill) => getDrillModuleId(drill) === moduleId);
}

/** Título curto do módulo, para mostrar durante o treino. */
export function getModuleTitle(moduleId: PracticeModuleId): string {
  return getPracticeModules().find((module) => module.id === moduleId)?.title ?? 'Conteudo inteiro';
}
