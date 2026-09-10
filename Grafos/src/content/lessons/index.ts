import type { LessonCatalog } from './types';
import { walkConcepts } from './walks';
import { foundationsLessons } from './foundations';
import { algorithmLessons } from './algorithms';
import { logicLessons } from './logic';

export const lessons: LessonCatalog = {
  ...foundationsLessons,
  ...algorithmLessons,
  ...logicLessons,
  'passeios-caminhos-ciclos': walkConcepts,
};
