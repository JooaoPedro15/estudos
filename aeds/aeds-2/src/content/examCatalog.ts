import type { ContentModuleId } from '../types/content';

export type ExamId = 'p1' | 'p2' | 'p3' | 'reav';

export type ExamCatalogEntry = {
  id: ExamId;
  title: string;
  shortTitle: string;
  description: string;
  /** Modulos no escopo desta prova. Omitido = sem filtro (Reavaliacao cai tudo). */
  moduleIds?: ContentModuleId[];
  /** Pastas/arquivos de materiais-privados ou materiais que embasam o escopo. */
  materialsRefs: string[];
};

export const examCatalog: ExamCatalogEntry[] = [
  {
    id: 'p1',
    title: 'Prova 1',
    shortTitle: 'P1',
    description:
      'Fundamentos de analise (complexidade, somatorios), estruturas lineares estaticas, ordenacao e u04 flexivel do lado teorico (u00-u04).',
    moduleIds: [
      'vetores',
      'somatorio',
      'ordenacao',
      'complexidade',
      'recursividade',
      'lista',
      'fila',
      'pilha',
      'matriz',
    ],
    materialsRefs: ['materiais-privados/Provas1'],
  },
  {
    id: 'p2',
    title: 'Prova 2',
    shortTitle: 'P2',
    description: 'Estruturas flexiveis/encadeadas e arvore binaria basica (u04-u05).',
    moduleIds: ['lista', 'fila', 'pilha', 'matriz', 'arvore'],
    materialsRefs: ['materiais-privados/Provas2'],
  },
  {
    id: 'p3',
    title: 'Prova 3',
    shortTitle: 'P3',
    description: 'Balanceamento (AVL, alvinegra, 2-3-4), hash e TRIE/PATRICIA (u06-u08).',
    moduleIds: ['avl', 'alvinegra', 'arvore234', 'hash', 'trie', 'patricia', 'doidona'],
    materialsRefs: ['materiais-privados/Provas3', 'materiais/Listas/lista-aeds2-prova3.pdf'],
  },
  {
    id: 'reav',
    title: 'Reavaliacao',
    shortTitle: 'Reav',
    description: 'Cumulativa: cai questao de todas as provas (u00-u08).',
    materialsRefs: ['materiais-privados/ProvasReav'],
  },
];

export function getExam(id: ExamId): ExamCatalogEntry {
  const exam = examCatalog.find((entry) => entry.id === id);
  if (!exam) {
    throw new Error(`Prova desconhecida: ${id}`);
  }
  return exam;
}
