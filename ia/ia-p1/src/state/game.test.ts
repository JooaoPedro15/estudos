import { dominio, embaralhar, responder } from './game';
import { CHAVE, carregar, salvar, saveVazio } from './save';

describe('responder e caderno de erros', () => {
  it('acerto registra o historico sem mexer no caderno', () => {
    const r = responder(saveVazio(), 'x', true);
    expect(r.save.registros.x).toMatchObject({ tentativas: 1, acertos: 1, ultimaCorreta: true });
    expect(r.save.caderno).toEqual({});
  });

  it('erro entra no caderno; errar de novo soma vezes; acertar tira e conta como limpa', () => {
    const e1 = responder(saveVazio(), 'x', false, new Date(), 'B');
    expect(e1.entrouNoCaderno).toBe(true);
    expect(e1.save.caderno.x).toMatchObject({ vezes: 1, ultimaResposta: 'B' });
    const e2 = responder(e1.save, 'x', false);
    expect(e2.entrouNoCaderno).toBe(false);
    expect(e2.save.caderno.x.vezes).toBe(2);
    const ok = responder(e2.save, 'x', true);
    expect(ok.save.caderno.x).toBeUndefined();
    expect(ok.save.limpas).toBe(1);
    expect(ok.saiuDoCaderno).toBe(true);
    expect(ok.save.registros.x).toMatchObject({ tentativas: 3, acertos: 1 });
  });
});

describe('dominio', () => {
  it('dominio conta questoes distintas acertadas', () => {
    const qs = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    let s = responder(saveVazio(), 'a', true).save;
    s = responder(s, 'a', true).save;
    s = responder(s, 'b', false).save;
    expect(dominio(s, qs)).toMatchObject({ acertadas: 1, feitas: 2, tentativas: 3, acertos: 2, erros: 1 });
    expect(dominio(s, qs).fracao).toBeCloseTo(1 / 3);
  });

  it('embaralhar mantem os mesmos itens', () => {
    const itens = [1, 2, 3, 4, 5];
    expect([...embaralhar(itens, () => 0.5)].sort()).toEqual(itens);
  });
});

describe('persistencia com try/catch', () => {
  it('salva e carrega', () => {
    const s = { ...saveVazio(), limpas: 3 };
    salvar(s, window.localStorage);
    expect(carregar(window.localStorage).limpas).toBe(3);
  });

  it('JSON corrompido ou storage que lanca erro voltam ao vazio sem quebrar', () => {
    window.localStorage.setItem(CHAVE, '{quebrado');
    expect(carregar(window.localStorage).limpas).toBe(0);
    const ruim = {
      getItem: () => {
        throw new Error('bloqueado');
      },
      setItem: () => {
        throw new Error('cheio');
      },
    } as unknown as Storage;
    expect(carregar(ruim).caderno).toEqual({});
    expect(() => salvar(saveVazio(), ruim)).not.toThrow();
  });
});
