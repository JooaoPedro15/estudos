import { useSearchParams } from 'react-router-dom';
import { modulesForExam, topicIdsForExam } from '@/content/modules';
import { getActiveExam } from '@/store/activeExam';

export const ALL_MODULES = 'todos';

/** Tópicos do módulo escolhido; "matéria inteira" = todos os tópicos da prova ativa (P1 ou P2). */
export function topicIdsForModule(moduleId: string): string[] | undefined {
  const exam = getActiveExam();
  if (moduleId === ALL_MODULES) return topicIdsForExam(exam);
  return modulesForExam(exam).find((m) => m.id === moduleId)?.topicIds ?? topicIdsForExam(exam);
}

/**
 * Módulo escolhido persistido na URL (`?modulo=fundamentos`), para
 * sobreviver a refresh e poder ser linkado da página do módulo.
 */
export function useModuleParam(): [string, (id: string) => void] {
  const [params, setParams] = useSearchParams();
  const raw = params.get('modulo');
  const value = raw && modulesForExam(getActiveExam()).some((m) => m.id === raw) ? raw : ALL_MODULES;
  const set = (id: string) => {
    const next = new URLSearchParams(params);
    if (id === ALL_MODULES) next.delete('modulo');
    else next.set('modulo', id);
    setParams(next, { replace: true });
  };
  return [value, set];
}
