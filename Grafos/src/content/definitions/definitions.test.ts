import { describe, expect, it } from 'vitest';
import { definitionQuestions } from './index';
import { topics } from '@/content/topics';
import { questions } from '@/content/questions';

describe('banco de definições', () => {
  const topicIds = new Set(topics.map((t) => t.id));

  it('tem ids únicos com prefixo def- e não colide com o banco geral', () => {
    const ids = definitionQuestions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id.startsWith('def-')).toBe(true);
    const all = questions.map((q) => q.id);
    expect(new Set(all).size).toBe(all.length);
  });

  it('cobre pelo menos 110 conceitos, todos em tópicos existentes', () => {
    expect(definitionQuestions.length).toBeGreaterThanOrEqual(110);
    for (const q of definitionQuestions) expect(topicIds.has(q.topic), `${q.id}: tópico ${q.topic}`).toBe(true);
  });

  it('cada definição tem redação literal, 1–5 pontos-chave, intuição e fonte com arquivo', () => {
    for (const q of definitionQuestions) {
      expect(q.solution.length, q.id).toBeGreaterThan(20);
      expect(q.keyPoints.length, q.id).toBeGreaterThanOrEqual(1);
      expect(q.keyPoints.length, q.id).toBeLessThanOrEqual(5);
      expect(q.intuition.length, q.id).toBeGreaterThan(40);
      expect(q.source.file, q.id).toBeTruthy();
      expect(q.hints.length, q.id).toBe(q.keyPoints.length);
      expect(q.duration).toBe('quick');
      expect(q.prompt.length, q.id).toBeGreaterThan(10);
    }
  });

  it('cobre os seis módulos da P1', () => {
    const byTopic = new Map<string, number>();
    for (const q of definitionQuestions) byTopic.set(q.topic, (byTopic.get(q.topic) ?? 0) + 1);
    for (const t of [
      'definicao-terminologia', 'passeios-caminhos-ciclos', 'aperto-de-maos-familias',
      'matriz-adjacencia', 'matriz-incidencia', 'lista-adjacencia',
      'isomorfismo', 'complemento-subgrafo', 'teoremas-contagem',
      'bfs', 'dfs-classificacao', 'fecho-transitivo', 'base-antibase', 'deteccao-ciclo',
      'excentricidade-raio-diametro', 'scc-kosaraju',
      'teoria-de-conjuntos', 'logica-proposicional', 'logica-de-predicados',
    ]) expect(byTopic.get(t) ?? 0, t).toBeGreaterThan(0);
  });
});
