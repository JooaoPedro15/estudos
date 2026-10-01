import { ARVORE_PROVA_TENIS, ARVORE_RESTAURANTE, folhas, profundidade } from './arvores';
import { ENSINE } from './ensine';
import { ARQ } from './fontes';
import { MODULOS, QUESTOES } from './index';
import { votoDeTres } from './modulos/ensemble';
import { TESTE_T } from './modulos/codigos';
import { PONTOS_TOTAIS, PONTOS_VALIDOS, PROVA_2025 } from './simulado2025';
import type { Bloco, Fonte } from './types';
import { entropia, ganhoInformacao, metricasConfusao, particionar } from '../engine/calc';
import { BASE_SUCESSO_15, MATRIZ_PROVA_Q7 } from './dados';

const ARQUIVOS = new Set<string>(Object.values(ARQ));
const fonteValida = (fonte: Fonte) => ARQUIVOS.has(fonte.arquivo) && fonte.onde.trim().length > 0;

describe('estrutura do conteudo', () => {
  it('tem os 7 modulos na ordem pedida', () => {
    expect(MODULOS.map((m) => m.id)).toEqual(['intro', 'preproc', 'arvore', 'ensemble', 'assoc', 'bayes', 'codigos']);
    expect(MODULOS.find((m) => m.id === 'bayes')!.prioridade).toBe('media');
  });

  it('cada modulo tem resumo, formulas, exemplo resolvido, pegadinhas e questoes', () => {
    for (const m of MODULOS) {
      expect(m.resumo.length, m.id).toBeGreaterThan(0);
      expect(m.formulas.length, m.id).toBeGreaterThan(0);
      expect(m.exemplo.passos.length, m.id).toBeGreaterThanOrEqual(3);
      expect(m.pegadinhas.length, m.id).toBeGreaterThanOrEqual(4);
      expect(QUESTOES.filter((q) => q.modulo === m.id).length, m.id).toBeGreaterThanOrEqual(7);
    }
  });

  it('toda secao, formula, exemplo, pegadinha e questao cita uma fonte real do material', () => {
    for (const m of MODULOS) {
      for (const s of m.resumo) {
        expect(s.fontes.length, `${m.id}/${s.id}`).toBeGreaterThan(0);
        s.fontes.forEach((fo) => expect(fonteValida(fo), `${m.id}/${s.id}: ${fo.arquivo}`).toBe(true));
      }
      m.formulas.forEach((fo) => expect(fonteValida(fo.fonte), fo.nome).toBe(true));
      m.pegadinhas.forEach((pg) => expect(fonteValida(pg.fonte), pg.texto).toBe(true));
      m.exemplo.fontes.forEach((fo) => expect(fonteValida(fo), m.exemplo.titulo).toBe(true));
    }
    for (const q of [...QUESTOES, ...PROVA_2025]) {
      expect(q.fontes.length, q.id).toBeGreaterThan(0);
      q.fontes.forEach((fo) => expect(fonteValida(fo), `${q.id}: ${fo.arquivo}`).toBe(true));
    }
  });

  it('ids unicos', () => {
    const ids = [...QUESTOES, ...PROVA_2025].map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('questoes fechadas tem 4 ou 5 opcoes e gabarito valido', () => {
    for (const q of [...QUESTOES, ...PROVA_2025]) {
      if (q.tipo !== 'mc') continue;
      expect([4, 5], q.id).toContain(q.opcoes.length);
      if (q.id !== 'p25-09') {
        expect(q.correta, q.id).toBeGreaterThanOrEqual(0);
        expect(q.correta, q.id).toBeLessThan(q.opcoes.length);
      }
      expect(q.explicacao.length, q.id).toBeGreaterThan(0);
    }
  });

  it('questoes abertas-fechadas: campos com resposta finita, explicacao por campo e tabela consistente', () => {
    for (const q of QUESTOES) {
      if (q.tipo !== 'num') continue;
      expect(q.campos.length, q.id).toBeGreaterThan(0);
      for (const c of q.campos) {
        expect(Number.isFinite(c.resposta), `${q.id}/${c.id}`).toBe(true);
        expect(c.porque.length, `${q.id}/${c.id}`).toBeGreaterThan(5);
      }
      if (q.tabela) {
        const usados = q.tabela.linhas.flat().filter((c): c is { campo: string } => typeof c !== 'string').map((c) => c.campo);
        expect(new Set(usados), q.id).toEqual(new Set(q.campos.map((c) => c.id)));
      }
      expect(q.resolucao.length, q.id).toBeGreaterThan(0);
    }
  });

  it('numeros escritos a mao no "porque" de cada campo batem com o gabarito calculado', () => {
    const problemas: string[] = [];
    for (const q of QUESTOES) {
      if (q.tipo !== 'num') continue;
      for (const c of q.campos) {
        const numeros = [...c.porque.matchAll(/-?\d+(?:,\d+)?/g)].map((m) => m[0]);
        for (const bruto of numeros) {
          const casas = bruto.includes(',') ? bruto.split(',')[1].length : 0;
          const valor = Number(bruto.replace(',', '.'));
          const perto = Math.abs(valor - c.resposta) < 0.01;
          const arredondaCerto = Math.abs(valor - c.resposta) <= 0.5 * 10 ** -casas + 1e-9;
          if (casas >= 2 && perto && !arredondaCerto) problemas.push(`${q.id}/${c.id}: ${bruto} x ${c.resposta}`);
        }
      }
    }
    expect(problemas).toEqual([]);
  });

  it('a maioria das questoes e fechada, como na prova', () => {
    const mc = QUESTOES.filter((q) => q.tipo === 'mc').length;
    expect(mc / QUESTOES.length).toBeGreaterThan(0.55);
    expect(QUESTOES.length).toBeGreaterThanOrEqual(80);
  });

  it('nao ha emoji no texto de conteudo', () => {
    const emoji = /\p{Extended_Pictographic}/u;
    const textos: string[] = [];
    const deBlocos = (bs: Bloco[]) =>
      bs.forEach((b) => {
        if (b.tipo === 'p' || b.tipo === 'nota') textos.push(b.texto);
        if (b.tipo === 'lista') textos.push(...b.itens);
        if (b.tipo === 'tabela') textos.push(...b.cabecalho, ...b.linhas.flat());
      });
    MODULOS.forEach((m) => {
      m.resumo.forEach((s) => deBlocos(s.blocos));
      m.exemplo.passos.forEach((ps) => deBlocos(ps.blocos));
      textos.push(...m.pegadinhas.map((pg) => pg.texto));
    });
    [...QUESTOES, ...PROVA_2025].forEach((q) => {
      deBlocos(q.enunciado);
      if (q.tipo === 'mc') {
        deBlocos(q.explicacao);
        textos.push(...q.opcoes);
      }
    });
    textos.forEach((t) => expect(emoji.test(t), t).toBe(false));
  });
});

describe('me ensine', () => {
  it('toda questao (modulos e prova 2025) tem Me ensine com secoes e formulas que existem', () => {
    const secoes = new Set(MODULOS.flatMap((m) => m.resumo.map((s) => `${m.id}/${s.id}`)));
    const formulas = new Set(MODULOS.flatMap((m) => m.formulas.map((fo) => `${m.id}/${fo.nome}`)));
    for (const q of [...QUESTOES, ...PROVA_2025]) {
      const e = ENSINE[q.id];
      expect(e, q.id).toBeDefined();
      expect(e.ideia.length, q.id).toBeGreaterThan(30);
      expect(e.rever.length, q.id).toBeGreaterThan(0);
      e.rever.forEach((r) => expect(secoes.has(r), `${q.id}: ${r}`).toBe(true));
      (e.formulas ?? []).forEach((r) => expect(formulas.has(r), `${q.id}: ${r}`).toBe(true));
    }
    const ids = new Set([...QUESTOES, ...PROVA_2025].map((q) => q.id));
    Object.keys(ENSINE).forEach((id) => expect(ids.has(id), `Me ensine sem questao: ${id}`).toBe(true));
  });

  it('o Me ensine nao entrega a letra nem o numero do gabarito', () => {
    for (const q of [...QUESTOES, ...PROVA_2025]) {
      const e = ENSINE[q.id];
      const texto = [e.ideia, ...(e.passos ?? [])].join(' ');
      expect(texto, q.id).not.toMatch(/(alternativa|resposta|gabarito)\s+(é|e)\s+[A-E]/i);
      if (q.tipo === 'num') {
        for (const c of q.campos) {
          if (Math.abs(c.resposta) < 1e-9 || Number.isInteger(c.resposta)) continue;
          const alvo = c.resposta.toFixed(2).replace('.', ',');
          expect(texto.includes(alvo), `${q.id}/${c.id} entrega ${alvo}`).toBe(false);
        }
      }
    }
  });
});

describe('numeros conferidos', () => {
  it('simulado 2025 vale 26 pontos e o gabarito e o informado', () => {
    expect(PONTOS_TOTAIS).toBe(26);
    expect(PONTOS_VALIDOS).toBe(24.5);
    const letras = PROVA_2025.map((q) => (q.correta < 0 ? '?' : 'ABCDE'[q.correta]));
    expect(letras.join('')).toBe('BCABACDB?CAEC');
  });

  it('Q7: TFN de B = 0,17 e Q12: ganho 0,9968 / 0,6295 / 0,5968', () => {
    expect(metricasConfusao(MATRIZ_PROVA_Q7).classes[1].tfn).toBeCloseTo(10 / 60, 10);
    const g = [0, 1, 2].map((a) => ganhoInformacao(particionar(BASE_SUCESSO_15, a).grupos));
    expect(g.map((x) => Number(x.toFixed(4)))).toEqual([0.6295, 0.5968, 0.9968]);
  });

  it('arvores: a da prova tem 5 folhas e profundidade 3; entropias dos nos batem', () => {
    expect(folhas(ARVORE_PROVA_TENIS)).toHaveLength(5);
    expect(profundidade(ARVORE_PROVA_TENIS)).toBe(3);
    expect(folhas(ARVORE_RESTAURANTE)).toHaveLength(5);
    const confere = (no: typeof ARVORE_PROVA_TENIS): void => {
      const declarada = Number(no.impureza.split('=')[1]);
      expect(entropia(no.value)).toBeCloseTo(declarada, 2);
      expect(no.value.reduce((a, b) => a + b, 0)).toBe(no.samples);
      if (no.sim && no.nao) {
        expect(no.sim.samples + no.nao.samples).toBe(no.samples);
        confere(no.sim);
        confere(no.nao);
      }
    };
    confere(ARVORE_PROVA_TENIS);
    confere(ARVORE_RESTAURANTE);
  });

  it('ensemble e teste t', () => {
    expect(votoDeTres(0.6)).toBeCloseTo(0.648, 10);
    expect(votoDeTres(0.7)).toBeCloseTo(0.784, 10);
    expect(TESTE_T.t).toBeCloseTo(-1.2545, 4);
    expect(TESTE_T.gl).toBe(190);
  });
});
