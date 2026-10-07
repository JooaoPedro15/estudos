import type { LessonCatalog } from './types';
import { walkConcepts } from './walks';
import { foundationsLessons } from './foundations';
import { algorithmLessons } from './algorithms';
import { logicLessons } from './logic';
import { p2ExtraLessons, p2Lessons } from './p2';
import { p2ArvoresLessons } from './p2-arvores';
import { p2CaminhosExtraLessons, p2CaminhosLessons } from './p2-caminhos';

export const lessons: LessonCatalog = {
  ...foundationsLessons,
  ...algorithmLessons,
  ...logicLessons,
  'passeios-caminhos-ciclos': walkConcepts,
  ...p2Lessons,
  ...p2ArvoresLessons,
  ...p2CaminhosLessons,
};

// Tópicos que já tinham lição recebem os conceitos extras da P2 no fim.
for (const [topicId, extra] of Object.entries({ ...p2ExtraLessons, ...p2CaminhosExtraLessons })) {
  lessons[topicId] = [...(lessons[topicId] ?? []), ...extra];
}
