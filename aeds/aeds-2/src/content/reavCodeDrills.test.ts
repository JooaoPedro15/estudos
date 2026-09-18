import { reavCodeDrillCatalog } from './reavCodeDrills';
import { codeDrillCatalog } from './codeDrills';
import { evaluateStep } from '../engine/evaluator';

test('todo drill da Reavaliacao real declara oldExam com studyScope p1', () => {
  expect(reavCodeDrillCatalog.length).toBeGreaterThanOrEqual(13);
  expect(reavCodeDrillCatalog.every((drill) => drill.oldExam?.paperExam === 'reav')).toBe(true);
  expect(reavCodeDrillCatalog.every((drill) => drill.oldExam?.studyScope === 'p1')).toBe(true);
});

test('a solucao modelo de cada passo de funcao satisfaz seus proprios fragmentos obrigatorios', () => {
  for (const drill of reavCodeDrillCatalog) {
    if (drill.step.kind !== 'function') {
      continue;
    }
    const result = evaluateStep(drill.step, { kind: 'text', text: drill.step.solution });
    expect(result.correct, `${drill.id}: ${result.feedback}`).toBe(true);
  }
});

test('a resposta modelo de cada pergunta de complexidade (gap) satisfaz seu proprio gabarito', () => {
  for (const drill of reavCodeDrillCatalog) {
    if (drill.step.kind !== 'gap') {
      continue;
    }
    const result = evaluateStep(drill.step, { kind: 'text', text: drill.step.answers[0] });
    expect(result.correct, `${drill.id}: ${result.feedback}`).toBe(true);
  }
});

test('a resposta modelo de cada pergunta de forma fechada (code) satisfaz seu proprio gabarito', () => {
  for (const drill of reavCodeDrillCatalog) {
    if (drill.step.kind !== 'code') {
      continue;
    }
    const result = evaluateStep(drill.step, { kind: 'text', text: drill.step.acceptedAnswers[0] });
    expect(result.correct, `${drill.id}: ${result.feedback}`).toBe(true);
  }
});

test('a opcao aceitavel de cada rubrica realmente esta marcada como aceitavel', () => {
  for (const drill of reavCodeDrillCatalog) {
    if (drill.step.kind !== 'rubric') {
      continue;
    }
    const result = evaluateStep(drill.step, { kind: 'choice', optionId: drill.step.acceptableOptionIds[0] });
    expect(result.correct, `${drill.id}: ${result.feedback}`).toBe(true);
  }
});

test('cada rubrica tem mais opcoes do que respostas aceitaveis (existem distratores)', () => {
  for (const drill of reavCodeDrillCatalog) {
    if (drill.step.kind !== 'rubric') {
      continue;
    }
    expect(drill.step.options.length, drill.id).toBeGreaterThan(drill.step.acceptableOptionIds.length);
  }
});

test('todo drill da Reavaliacao tem ids unicos dentro do catalogo completo', () => {
  const ids = codeDrillCatalog.map((drill) => drill.id);
  expect(new Set(ids).size).toBe(ids.length);
});
