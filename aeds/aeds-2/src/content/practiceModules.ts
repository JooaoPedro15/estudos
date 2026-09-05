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
 *
 * `allowedModuleIds`, quando informado, restringe a lista aos módulos de
 * uma prova específica (ver `src/content/examCatalog.ts`) — "Conteúdo
 * inteiro" nesse caso passa a significar "toda a prova", não o app inteiro.
 */
export function getPracticeModules(allowedModuleIds?: ContentModuleId[]): PracticeModule[] {
  const counts = countByModule();
  const allowed = allowedModuleIds ? new Set(allowedModuleIds) : null;

  const specificModules: PracticeModule[] = contentModuleCatalog
    .filter((module) => (counts.get(module.id) ?? 0) > 0)
    .filter((module) => !allowed || allowed.has(module.id))
    .map((module) => ({
      id: module.id,
      title: module.title,
      description: module.description,
      count: counts.get(module.id) ?? 0,
    }));

  const allDrillsCount = allowed
    ? codeDrillCatalog.filter((drill) => allowed.has(getDrillModuleId(drill))).length
    : codeDrillCatalog.length;

  return [
    {
      id: 'all',
      title: allowed ? 'Todo o conteudo desta prova' : 'Conteudo inteiro',
      description: allowed
        ? 'Todas as questoes dos modulos desta prova, em ordem aleatoria.'
        : 'Todas as questoes, em ordem aleatoria. Funciona como um treino geral da materia.',
      count: allDrillsCount,
    },
    ...specificModules,
  ];
}

/**
 * Drills do módulo escolhido ("all" = catálogo completo, ou toda a prova
 * quando `allowedModuleIds` restringe o escopo).
 */
export function getDrillsForModule(moduleId: PracticeModuleId, allowedModuleIds?: ContentModuleId[]): CodeDrill[] {
  const pool = allowedModuleIds
    ? codeDrillCatalog.filter((drill) => allowedModuleIds.includes(getDrillModuleId(drill)))
    : codeDrillCatalog;

  if (moduleId === 'all') {
    return pool;
  }
  return pool.filter((drill) => getDrillModuleId(drill) === moduleId);
}

/** Título curto do módulo, para mostrar durante o treino. */
export function getModuleTitle(moduleId: PracticeModuleId): string {
  return getPracticeModules().find((module) => module.id === moduleId)?.title ?? 'Conteudo inteiro';
}
