import { getQuestionsForConceptualDrawingModule } from '../content/lista2Questions';
import { getDrillsForModule } from '../content/practiceModules';
import type { ContentModuleId, DomainId, ErrorType, MistakeTag } from '../types/content';
import type { ErrorRecord } from '../types/progress';
import {
  buildCodeRecoveryOrder,
  buildConceptualRecoveryOrder,
  RECOVERY_DECK_SIZE,
  resolvePracticeTarget,
} from './recoverySession';

function rec(overrides: Partial<ErrorRecord>): ErrorRecord {
  return {
    id: 'x',
    type: 'codigo' as ErrorType,
    moduleId: 'somatorio' as ContentModuleId,
    domainId: 'somatorio' as DomainId,
    skillId: 'program',
    questionFormat: 'code-repetition',
    subjectTag: undefined,
    mistakeTag: undefined,
    challengeId: 'c',
    questionId: undefined,
    attempts: 1,
    correctCount: 0,
    masteryLevel: 0,
    firstSeenAt: '2026-07-01T10:00:00.000Z',
    lastSeenAt: '2026-07-01T10:00:00.000Z',
    resolved: false,
    ...overrides,
  };
}

test('erro de codigo abre o Treino de Codigo no modulo certo', () => {
  const target = resolvePracticeTarget(rec({ type: 'codigo', moduleId: 'somatorio', domainId: 'somatorio' }));
  expect(target.mode).toBe('practice');
  expect(getDrillsForModule(target.moduleId).length).toBeGreaterThan(0);
});

test('erro conceitual de arvore abre o modo Conceitual filtrado', () => {
  const target = resolvePracticeTarget(rec({ type: 'conceitual', moduleId: 'arvore', domainId: 'arvore' }));
  expect(target).toMatchObject({ mode: 'conceptual', moduleId: 'arvore' });
  expect(getQuestionsForConceptualDrawingModule('arvore', 'conceitual').length).toBeGreaterThan(0);
});

test('erro de desenho de hash abre o modo Desenho filtrado', () => {
  const target = resolvePracticeTarget(rec({ type: 'desenho', moduleId: 'hash', domainId: 'hash' }));
  expect(target).toMatchObject({ mode: 'drawing', moduleId: 'hash' });
  expect(getQuestionsForConceptualDrawingModule('hash', 'desenho').length).toBeGreaterThan(0);
});

test('modulo sem exercicios cai para um alvo compativel (nunca incompativel)', () => {
  const target = resolvePracticeTarget(rec({ type: 'codigo', moduleId: 'complexidade', domainId: 'somatorio' }));
  expect(target.mode).toBe('practice');
  expect(getDrillsForModule(target.moduleId).length).toBeGreaterThan(0);
});

test('baralho de codigo e curto, sem repetir e com variedade', () => {
  const drills = getDrillsForModule('somatorio');
  const order = buildCodeRecoveryOrder(rec({ moduleId: 'somatorio', subjectTag: 'wrong-summation-bound' as MistakeTag }), drills);

  expect(order.length).toBeGreaterThan(1);
  expect(order.length).toBeLessThanOrEqual(RECOVERY_DECK_SIZE);
  expect(new Set(order).size).toBe(order.length);
});

test('a questao parecida com a errada abre o baralho', () => {
  const drills = getDrillsForModule('somatorio');
  const target = drills[2];
  const order = buildCodeRecoveryOrder(rec({ moduleId: 'somatorio', questionId: target.id }), drills);

  expect(order[0]).toBe(target.id);
});

test('baralho conceitual tambem e curto e sem repeticoes', () => {
  const questions = getQuestionsForConceptualDrawingModule('arvore', 'conceitual');
  const order = buildConceptualRecoveryOrder(rec({ type: 'conceitual', moduleId: 'arvore' }), questions);

  expect(order.length).toBeGreaterThan(0);
  expect(order.length).toBeLessThanOrEqual(RECOVERY_DECK_SIZE);
  expect(new Set(order).size).toBe(order.length);
});
