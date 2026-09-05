import { prova1CodeDrillCatalog } from './prova1CodeDrills';
import { codeDrillCatalog } from './codeDrills';
import { evaluateStep } from '../engine/evaluator';

test('catalogo novo da Prova 1 cobre ordenacao, complexidade, fila, pilha e lista', () => {
  expect(prova1CodeDrillCatalog.length).toBeGreaterThanOrEqual(35);
  const moduleIds = new Set(prova1CodeDrillCatalog.map((drill) => drill.moduleId ?? drill.domainId));
  for (const expected of ['ordenacao', 'complexidade', 'fila', 'pilha', 'lista']) {
    expect(moduleIds.has(expected as never)).toBe(true);
  }
});

test('todo drill novo declara source prova1', () => {
  expect(prova1CodeDrillCatalog.every((drill) => drill.source === 'prova1')).toBe(true);
});

test('cada dupla repeat/modify no mesmo repetitionGroup progride de dificuldade', () => {
  const groups = new Map<string, typeof prova1CodeDrillCatalog>();
  for (const drill of prova1CodeDrillCatalog) {
    const list = groups.get(drill.repetitionGroup) ?? [];
    list.push(drill);
    groups.set(drill.repetitionGroup, list);
  }
  for (const [group, drills] of groups) {
    const hasRepeat = drills.some((drill) => drill.phase === 'repeat');
    const hasModify = drills.some((drill) => drill.phase === 'modify');
    expect(hasRepeat || hasModify, `grupo ${group} sem nenhuma fase`).toBe(true);
  }
});

test('a solucao modelo de cada passo de funcao satisfaz seus proprios fragmentos obrigatorios', () => {
  for (const drill of prova1CodeDrillCatalog) {
    if (drill.step.kind !== 'function') {
      continue;
    }
    const result = evaluateStep(drill.step, { kind: 'text', text: drill.step.solution });
    expect(result.correct, `${drill.id}: ${result.feedback}`).toBe(true);
  }
});

test('a resposta modelo de cada pergunta de complexidade (gap) satisfaz seu proprio gabarito', () => {
  for (const drill of prova1CodeDrillCatalog) {
    if (drill.step.kind !== 'gap') {
      continue;
    }
    const result = evaluateStep(drill.step, { kind: 'text', text: drill.step.answers[0] });
    expect(result.correct, `${drill.id}: ${result.feedback}`).toBe(true);
  }
});

test('a opcao aceitavel de cada rubrica realmente esta marcada como aceitavel', () => {
  for (const drill of prova1CodeDrillCatalog) {
    if (drill.step.kind !== 'rubric') {
      continue;
    }
    const result = evaluateStep(drill.step, { kind: 'choice', optionId: drill.step.acceptableOptionIds[0] });
    expect(result.correct, `${drill.id}: ${result.feedback}`).toBe(true);
  }
});

test('todo drill novo tem ids unicos dentro do catalogo completo', () => {
  const ids = codeDrillCatalog.map((drill) => drill.id);
  expect(new Set(ids).size).toBe(ids.length);
});

test('todo drill novo tem pelo menos um requiredFragment (funcao) ou uma resposta (gap/rubric)', () => {
  for (const drill of prova1CodeDrillCatalog) {
    if (drill.step.kind === 'function') {
      expect(drill.step.requiredFragments.length, drill.id).toBeGreaterThan(0);
    } else if (drill.step.kind === 'gap') {
      expect(drill.step.answers.length, drill.id).toBeGreaterThan(0);
    } else if (drill.step.kind === 'rubric') {
      expect(drill.step.acceptableOptionIds.length, drill.id).toBeGreaterThan(0);
      expect(drill.step.options.length, drill.id).toBeGreaterThan(drill.step.acceptableOptionIds.length);
    }
  }
});
