import { QUESTOES } from '../content';
import { atualizarStreak, CHEFE, diaLocal, dominio, montarChefe, nivelDe, responder, streakVisivel, xpPorAcerto } from './game';
import { CHAVE, carregar, salvar, saveVazio } from './save';

const q = { id: 'x', nivel: 2 as const };
const dia = (d: number) => new Date(2026, 9, d, 12);

describe('XP e niveis', () => {
  it('acerto vale 10 por nivel, +5 na primeira vez e bonus de sequencia a partir de 3', () => {
    expect(xpPorAcerto(1, true, 1)).toBe(15);
    expect(xpPorAcerto(2, false, 3)).toBe(22);
    expect(xpPorAcerto(3, false, 20)).toBe(40);
  });

  it('niveis sobem nos limiares', () => {
    expect(nivelDe(0).nivel).toBe(1);
    expect(nivelDe(99).nivel).toBe(1);
    expect(nivelDe(100).nivel).toBe(2);
    expect(nivelDe(5000).nivel).toBe(10);
    expect(nivelDe(5000).xpProximo).toBeNull();
  });
});

describe('responder', () => {
  it('acerto soma XP, registra e libera a primeira conquista', () => {
    const r = responder(saveVazio(), q, true, dia(1));
    expect(r.xp).toBe(25);
    expect(r.save.registros.x).toMatchObject({ tentativas: 1, acertos: 1, ultimaCorreta: true });
    expect(r.conquistas).toContain('primeiro-acerto');
    expect(r.save.streak.dias).toBe(1);
  });

  it('erro vai para o caderno; acertar depois tira do caderno e conta como limpa', () => {
    const errou = responder(saveVazio(), q, false, dia(1), 'B');
    expect(errou.save.caderno.x).toMatchObject({ vezes: 1, ultimaResposta: 'B' });
    expect(errou.save.combo.atual).toBe(0);
    const acertou = responder(errou.save, q, true, dia(1));
    expect(acertou.save.caderno.x).toBeUndefined();
    expect(acertou.save.limpas).toBe(1);
    expect(acertou.saiuDoCaderno).toBe(true);
  });

  it('sequencia diaria: dias seguidos somam, pular um dia zera', () => {
    let s = atualizarStreak(saveVazio().streak, diaLocal(dia(1)));
    s = atualizarStreak(s, diaLocal(dia(1)));
    expect(s.dias).toBe(1);
    s = atualizarStreak(s, diaLocal(dia(2)));
    expect(s.dias).toBe(2);
    s = atualizarStreak(s, diaLocal(dia(4)));
    expect(s.dias).toBe(1);
    expect(s.melhor).toBe(2);
    expect(streakVisivel(s, diaLocal(dia(6)))).toBe(0);
  });

  it('virada de mes conta como dia seguido', () => {
    const s = atualizarStreak({ dias: 3, ultimoDia: '2026-09-30', melhor: 3 }, '2026-10-01');
    expect(s.dias).toBe(4);
  });
});

describe('dominio e chefe', () => {
  it('dominio conta questoes distintas acertadas', () => {
    const qs = [{ id: 'a' }, { id: 'b' }];
    let s = responder(saveVazio(), { id: 'a', nivel: 1 }, true).save;
    s = responder(s, { id: 'a', nivel: 1 }, true).save;
    s = responder(s, { id: 'b', nivel: 1 }, false).save;
    const d = dominio(s, qs);
    expect(d).toMatchObject({ acertadas: 1, tentativas: 3, acertos: 2, erros: 1, fracao: 0.5 });
  });

  it('chefe monta 8 questoes do modulo com pelo menos uma aberta-fechada', () => {
    const qs = QUESTOES.filter((x) => x.modulo === 'arvore');
    const bateria = montarChefe(saveVazio(), qs, CHEFE.questoes, () => 0.3);
    expect(bateria).toHaveLength(8);
    expect(new Set(bateria.map((x) => x.id)).size).toBe(8);
    expect(bateria.some((x) => x.tipo === 'num')).toBe(true);
    expect(bateria.every((x) => x.modulo === 'arvore')).toBe(true);
  });
});

describe('persistencia com try/catch', () => {
  it('salva e carrega', () => {
    const s = { ...saveVazio(), xp: 42 };
    salvar(s, window.localStorage);
    expect(carregar(window.localStorage).xp).toBe(42);
  });

  it('JSON corrompido ou storage que lanca erro voltam ao vazio sem quebrar', () => {
    window.localStorage.setItem(CHAVE, '{quebrado');
    expect(carregar(window.localStorage).xp).toBe(0);
    const ruim = { getItem: () => { throw new Error('bloqueado'); }, setItem: () => { throw new Error('cheio'); } } as unknown as Storage;
    expect(carregar(ruim).xp).toBe(0);
    expect(() => salvar(saveVazio(), ruim)).not.toThrow();
  });
});
