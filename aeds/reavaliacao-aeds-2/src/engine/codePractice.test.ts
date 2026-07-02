import {
  answerCurrentPracticeStep,
  createPracticeSession,
  getCurrentPracticeDrill,
  getPracticeProgressLabel,
} from './codePractice';
import { codeDrillCatalog } from '../content/codeDrills';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  vi.restoreAllMocks();
});

test('cria uma sessao rapida para fazer uma ou duas questoes', () => {
  const session = createPracticeSession(codeDrillCatalog, {
    mode: 'quick',
    targetCount: 2,
    drillOrder: [codeDrillCatalog[0].id, codeDrillCatalog[1].id],
  });

  expect(session.mode).toBe('quick');
  expect(session.targetCount).toBe(2);
  expect(session.completed).toBe(false);
  expect(getPracticeProgressLabel(session)).toBe('0/2');
  expect(getCurrentPracticeDrill(codeDrillCatalog, session)?.id).toBe(codeDrillCatalog[0].id);
  expect(getCurrentPracticeDrill(codeDrillCatalog, session)?.step.kind).toBe('function');
});

test('embaralha a ordem dos treinos em cada nova sessao', () => {
  const session = createPracticeSession(codeDrillCatalog, { mode: 'marathon', random: () => 0 });
  const catalogOrder = codeDrillCatalog.map((drill) => drill.id);

  expect(session.drillOrder).toHaveLength(codeDrillCatalog.length);
  expect(new Set(session.drillOrder)).toEqual(new Set(catalogOrder));
  expect(session.drillOrder).not.toEqual(catalogOrder);
  expect(getCurrentPracticeDrill(codeDrillCatalog, session)?.id).toBe(session.drillOrder[0]);
});

test('sessao rapida conclui no alvo e maratona continua gerando proxima questao', () => {
  const drillOrder = [codeDrillCatalog[0].id, codeDrillCatalog[1].id, codeDrillCatalog[2].id];
  let quick = createPracticeSession(codeDrillCatalog, { mode: 'quick', targetCount: 2, drillOrder });

  quick = answerCurrentPracticeStep(codeDrillCatalog, quick, {
    kind: 'text',
    text: `private int contar(No i) {
      if (i == null) return 0;
      return contar(i.esq) + contar(i.dir) + 1;
    }`,
  });
  quick = answerCurrentPracticeStep(codeDrillCatalog, quick, {
    kind: 'text',
    text: `private boolean ehEstritamenteBinaria(No i) {
      if (i == null) return true;
      if (i.esq == null && i.dir == null) return true;
      if (i.esq != null && i.dir != null) return ehEstritamenteBinaria(i.esq) && ehEstritamenteBinaria(i.dir);
      return false;
    }`,
  });

  expect(quick.completed).toBe(true);
  expect(quick.completedCount).toBe(2);

  let marathon = createPracticeSession(codeDrillCatalog, { mode: 'marathon', drillOrder });
  marathon = answerCurrentPracticeStep(codeDrillCatalog, marathon, {
    kind: 'text',
    text: `private int contar(No i) {
      if (i == null) return 0;
      return contar(i.esq) + contar(i.dir) + 1;
    }`,
  });
  marathon = answerCurrentPracticeStep(codeDrillCatalog, marathon, {
    kind: 'text',
    text: `private boolean ehEstritamenteBinaria(No i) {
      if (i == null) return true;
      if (i.esq == null && i.dir == null) return true;
      if (i.esq != null && i.dir != null) return ehEstritamenteBinaria(i.esq) && ehEstritamenteBinaria(i.dir);
      return false;
    }`,
  });

  expect(marathon.completed).toBe(false);
  expect(marathon.completedCount).toBe(2);
  expect(getCurrentPracticeDrill(codeDrillCatalog, marathon)?.id).toBe(drillOrder[2]);
});

test('maratona reembaralha quando termina o baralho', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0);
  const drillOrder = [codeDrillCatalog[0].id, codeDrillCatalog[1].id];
  let marathon = createPracticeSession(codeDrillCatalog, { mode: 'marathon', drillOrder });

  marathon = answerCurrentPracticeStep(codeDrillCatalog, marathon, {
    kind: 'text',
    text: `private int contar(No i) {
      if (i == null) return 0;
      return contar(i.esq) + contar(i.dir) + 1;
    }`,
  });
  marathon = answerCurrentPracticeStep(codeDrillCatalog, marathon, {
    kind: 'text',
    text: `private boolean ehEstritamenteBinaria(No i) {
      if (i == null) return true;
      if (i.esq == null && i.dir == null) return true;
      if (i.esq != null && i.dir != null) return ehEstritamenteBinaria(i.esq) && ehEstritamenteBinaria(i.dir);
      return false;
    }`,
  });

  expect(marathon.completed).toBe(false);
  expect(marathon.completedCount).toBe(2);
  expect(marathon.currentDrillIndex).toBe(0);
  expect(marathon.drillOrder).not.toEqual(drillOrder);
});

test('registra tentativas com metadados de dominio e erro para o caderno', () => {
  const session = createPracticeSession(codeDrillCatalog, {
    mode: 'quick',
    targetCount: 2,
    drillOrder: [codeDrillCatalog[0].id, codeDrillCatalog[1].id],
  });
  const nextSession = answerCurrentPracticeStep(codeDrillCatalog, session, {
    kind: 'text',
    text: `private int contar(No i) {
      return contar(i.esq) + contar(i.dir);
    }`,
  });

  expect(nextSession.attempts[0]).toMatchObject({
    questionId: 'code-arvore-contar-nos-base',
    domainId: 'arvore',
    skillId: 'program',
    format: 'code-repetition',
    correct: false,
    mistakeTag: 'missing-base-case',
  });
});
