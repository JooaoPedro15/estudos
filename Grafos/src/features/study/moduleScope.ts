import { useSearchParams } from 'react-router-dom';
import { modules } from '@/content/modules';

export const ALL_MODULES = 'todos';

/** Tópicos do módulo escolhido; undefined = matéria inteira. */
export function topicIdsForModule(moduleId: string): string[] | undefined {
  if (moduleId === ALL_MODULES) return undefined;
  return modules.find((m) => m.id === moduleId)?.topicIds;
}

/**
 * Módulo escolhido persistido na URL (`?modulo=fundamentos`), para
 * sobreviver a refresh e poder ser linkado da página do módulo.
 */
export function useModuleParam(): [string, (id: string) => void] {
  const [params, setParams] = useSearchParams();
  const raw = params.get('modulo');
  const value = raw && modules.some((m) => m.id === raw) ? raw : ALL_MODULES;
  const set = (id: string) => {
    const next = new URLSearchParams(params);
    if (id === ALL_MODULES) next.delete('modulo');
    else next.set('modulo', id);
    setParams(next, { replace: true });
  };
  return [value, set];
}
