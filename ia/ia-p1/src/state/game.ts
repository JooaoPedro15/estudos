import type { Questao } from '../content/types';
import type { Save } from './save';

/* ------------------------------------------------------------------ */
/* Responder uma questao: historico + caderno de erros                */
/* ------------------------------------------------------------------ */

export type ResultadoResposta = { save: Save; saiuDoCaderno: boolean; entrouNoCaderno: boolean };

/**
 * Registra a resposta. Errou: a questao entra (ou continua) no caderno de
 * erros. Acertou uma questao que estava no caderno: ela sai e conta como limpa.
 */
export function responder(save: Save, id: string, correta: boolean, agora: Date = new Date(), resposta?: string): ResultadoResposta {
  const anterior = save.registros[id];
  const caderno = { ...save.caderno };
  let limpas = save.limpas;
  let saiuDoCaderno = false;
  let entrouNoCaderno = false;

  if (correta) {
    if (caderno[id]) {
      delete caderno[id];
      limpas += 1;
      saiuDoCaderno = true;
    }
  } else {
    const item = caderno[id];
    entrouNoCaderno = !item;
    caderno[id] = { vezes: (item?.vezes ?? 0) + 1, quando: agora.getTime(), ultimaResposta: resposta };
  }

  return {
    save: {
      ...save,
      registros: {
        ...save.registros,
        [id]: {
          tentativas: (anterior?.tentativas ?? 0) + 1,
          acertos: (anterior?.acertos ?? 0) + (correta ? 1 : 0),
          ultimaCorreta: correta,
          quando: agora.getTime(),
        },
      },
      caderno,
      limpas,
    },
    saiuDoCaderno,
    entrouNoCaderno,
  };
}

/* ------------------------------------------------------------------ */
/* Dominio por modulo                                                 */
/* ------------------------------------------------------------------ */

export type Dominio = {
  total: number;
  /** questoes distintas acertadas pelo menos uma vez */
  acertadas: number;
  /** questoes distintas ja tentadas */
  feitas: number;
  tentativas: number;
  acertos: number;
  erros: number;
  fracao: number;
};

export function dominio(save: Save, questoes: Pick<Questao, 'id'>[]): Dominio {
  let acertadas = 0;
  let feitas = 0;
  let tentativas = 0;
  let acertos = 0;
  for (const q of questoes) {
    const r = save.registros[q.id];
    if (!r) continue;
    feitas += 1;
    tentativas += r.tentativas;
    acertos += r.acertos;
    if (r.acertos > 0) acertadas += 1;
  }
  return {
    total: questoes.length,
    acertadas,
    feitas,
    tentativas,
    acertos,
    erros: tentativas - acertos,
    fracao: questoes.length ? acertadas / questoes.length : 0,
  };
}

/* ------------------------------------------------------------------ */
/* Sorteio                                                            */
/* ------------------------------------------------------------------ */

export function embaralhar<T>(itens: readonly T[], aleatorio: () => number = Math.random): T[] {
  const copia = [...itens];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/* ------------------------------------------------------------------ */
/* Datas                                                              */
/* ------------------------------------------------------------------ */

export function diaLocal(data: Date): string {
  const y = data.getFullYear();
  const m = String(data.getMonth() + 1).padStart(2, '0');
  const d = String(data.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
