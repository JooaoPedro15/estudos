import { describe, expect, it } from 'vitest';
import { modules, modulesForExam, topicIdsForExam } from './modules';
import { appearancesFor, examFamilies, examFamiliesFor, examFamilyWeight, totalExamsFor, type ExamFamily } from './examFamilies';

describe('escopo de todo o conteúdo', () => {
  it('inclui cada módulo e tópico uma vez, mantendo os filtros P1 e P2', () => {
    const all = modulesForExam('all');
    expect(new Set(all.map((m) => m.id)).size).toBe(modules.length);
    expect(all).toHaveLength(modules.length);
    expect(modulesForExam('P1').every((m) => m.exam === 'P1')).toBe(true);
    expect(modulesForExam('P2').some((m) => m.exam === 'P1')).toBe(true);
    expect(topicIdsForExam('all')).toContain('dijkstra');
    expect(topicIdsForExam('P1')).not.toContain('dijkstra');
  });

  it('reúne todas as famílias de prova sem duplicar famílias cumulativas', () => {
    const all = examFamiliesFor('all');
    expect(all).toHaveLength(examFamilies.length);
    expect(new Set(all.map((f) => f.id)).size).toBe(all.length);
    expect(totalExamsFor('all')).toBe(totalExamsFor('P1') + totalExamsFor('P2'));
  });

  it('conta P1 e P2 do mesmo semestre separadamente, mas cada prova só uma vez', () => {
    const family: ExamFamily = {
      id: 'teste', title: 'Teste', concepts: [],
      appearances: ['2024/1-Q1', '2024/1-Q2'],
      alsoP2: ['2024/1-Q1', '2024/1-Q3'],
    };
    const exams = new Set(appearancesFor(family, 'all').map((a) => a.split('-Q')[0]));
    expect(exams.size).toBe(2);
    expect(examFamilyWeight(family, 'all')).toBe(3);
  });
});
