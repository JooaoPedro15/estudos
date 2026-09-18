import { buildProva1Simulado } from './prova1SimuladoBuilder';
import { seededRng } from './simuladoBuilder';
import { evaluateStep } from '../engine/evaluator';

test('gera exatamente 3 questoes, numeradas 1, 2, 3', () => {
  const blueprint = buildProva1Simulado({ rng: seededRng(1) });

  expect(blueprint.questions).toHaveLength(3);
  blueprint.questions.forEach((question, index) => {
    expect(question.number).toBe(index + 1);
    expect(question.steps.length).toBeGreaterThan(0);
  });
});

test('posicao 2 e sempre ordenacao, com passo function-choice', () => {
  for (let seed = 0; seed < 30; seed += 1) {
    const [, ordenacao] = buildProva1Simulado({ rng: seededRng(seed) }).questions;
    expect(ordenacao.domainId).toBe('ordenacao');
    expect(ordenacao.steps[0].kind).toBe('function-choice');
  }
});

test('nao repete a mesma questao dentro de um simulado', () => {
  for (let seed = 0; seed < 40; seed += 1) {
    const ids = buildProva1Simulado({ rng: seededRng(seed) }).questions.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
  }
});

test('as questoes variam entre simulados diferentes', () => {
  const signatures = new Set<string>();
  for (let seed = 0; seed < 30; seed += 1) {
    signatures.add(buildProva1Simulado({ rng: seededRng(seed) }).questions.map((q) => q.id).join('|'));
  }

  expect(signatures.size).toBeGreaterThan(5);
});

test('evita repetir imediatamente a questao anterior na mesma posicao', () => {
  const alwaysFirst = () => 0;
  const first = buildProva1Simulado({ rng: alwaysFirst });
  const second = buildProva1Simulado({ rng: alwaysFirst, previous: first });

  first.questions.forEach((question, index) => {
    expect(second.questions[index].id).not.toBe(question.id);
  });
});

test('cada variante de function-choice sorteada bate com sua propria solucao (corretor tolerante)', () => {
  for (let seed = 0; seed < 30; seed += 1) {
    const [, ordenacao] = buildProva1Simulado({ rng: seededRng(seed) }).questions;
    const step = ordenacao.steps[0];
    if (step.kind !== 'function-choice') {
      throw new Error('esperado function-choice na posicao 2');
    }
    for (const variant of step.variants) {
      const result = evaluateStep(step, { kind: 'text', text: variant.solution });
      expect(result.correct, `${ordenacao.id} / ${variant.label}: ${result.feedback}`).toBe(true);
    }
  }
});

test('function-choice rejeita uma resposta que nao bate com nenhuma variante aceita', () => {
  const [, ordenacao] = buildProva1Simulado({ rng: seededRng(2) }).questions;
  const step = ordenacao.steps[0];
  if (step.kind !== 'function-choice') {
    throw new Error('esperado function-choice na posicao 2');
  }
  const result = evaluateStep(step, { kind: 'text', text: 'void ordenar() { array[0] = 1; }' });
  expect(result.correct).toBe(false);
});

test('todo passo bundlado (Reav) tem gabarito consistente consigo mesmo', () => {
  for (let seed = 0; seed < 30; seed += 1) {
    const questions = buildProva1Simulado({ rng: seededRng(seed) }).questions;
    for (const question of questions) {
      for (const step of question.steps) {
        if (step.kind === 'function') {
          expect(evaluateStep(step, { kind: 'text', text: step.solution }).correct, `${question.id}/${step.id}`).toBe(true);
        } else if (step.kind === 'gap') {
          expect(evaluateStep(step, { kind: 'text', text: step.answers[0] }).correct, `${question.id}/${step.id}`).toBe(true);
        } else if (step.kind === 'code') {
          expect(evaluateStep(step, { kind: 'text', text: step.acceptedAnswers[0] }).correct, `${question.id}/${step.id}`).toBe(true);
        } else if (step.kind === 'rubric') {
          expect(
            evaluateStep(step, { kind: 'choice', optionId: step.acceptableOptionIds[0] }).correct,
            `${question.id}/${step.id}`,
          ).toBe(true);
        }
      }
    }
  }
});
