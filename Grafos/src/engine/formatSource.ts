import type { Source } from '@/content/types';

/** Linha de citação curta ("01-graphs-concepts.pdf · slide 15 · Terminologia") para mostrar de onde veio uma definição. */
export function formatSource(source: Source): string {
  const parts: string[] = [];
  switch (source.type) {
    case 'professor_slide':
      if (source.file) parts.push(source.file);
      if (source.page !== undefined) parts.push(`slide ${source.page}`);
      break;
    case 'professor_board':
      parts.push('quadro da aula');
      if (source.file) parts.push(source.file);
      break;
    case 'old_exam':
      parts.push(`prova antiga${source.file ? ` ${source.file}` : ''}`);
      break;
    case 'professor_support_material':
      if (source.file) parts.push(source.file);
      if (source.page !== undefined) parts.push(`p. ${source.page}`);
      break;
    case 'book':
      if (source.author) parts.push(source.author);
      if (source.chapter) parts.push(source.chapter);
      if (source.page !== undefined) parts.push(`p. ${source.page}`);
      break;
  }
  if (source.note) parts.push(source.note);
  return parts.join(' · ');
}
