import type { ModuloId, Questao } from '../content/types';
import type { Save } from './save';

/* ------------------------------------------------------------------ */
/* Niveis                                                             */
/* ------------------------------------------------------------------ */

export const NIVEIS = [
  { xp: 0, nome: 'Dado bruto' },
  { xp: 100, nome: 'Dado limpo' },
  { xp: 250, nome: 'Atributo codificado' },
  { xp: 450, nome: 'Nó interno' },
  { xp: 700, nome: 'Ganho máximo' },
  { xp: 1000, nome: 'Árvore podada' },
  { xp: 1350, nome: 'Floresta aleatória' },
  { xp: 1750, nome: 'Regra com lift acima de 1' },
  { xp: 2200, nome: 'Classe normalizada' },
  { xp: 2700, nome: 'Pronto para a P1' },
] as const;

export type InfoNivel = { nivel: number; nome: string; xpNivel: number; xpProximo: number | null; fracao: number };

export function nivelDe(xp: number): InfoNivel {
  let i = 0;
  while (i + 1 < NIVEIS.length && xp >= NIVEIS[i + 1].xp) i++;
  const atual = NIVEIS[i];
  const prox = NIVEIS[i + 1];
  return {
    nivel: i + 1,
    nome: atual.nome,
    xpNivel: atual.xp,
    xpProximo: prox ? prox.xp : null,
    fracao: prox ? (xp - atual.xp) / (prox.xp - atual.xp) : 1,
  };
}

/* ------------------------------------------------------------------ */
/* Datas e sequencia diaria                                           */
/* ------------------------------------------------------------------ */

export function diaLocal(data: Date): string {
  const y = data.getFullYear();
  const m = String(data.getMonth() + 1).padStart(2, '0');
  const d = String(data.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function diaAnterior(dia: string): string {
  const [y, m, d] = dia.split('-').map(Number);
  return diaLocal(new Date(y, m - 1, d - 1));
}

export function atualizarStreak(streak: Save['streak'], hoje: string): Save['streak'] {
  if (streak.ultimoDia === hoje) return streak;
  const dias = streak.ultimoDia === diaAnterior(hoje) ? streak.dias + 1 : 1;
  return { dias, ultimoDia: hoje, melhor: Math.max(streak.melhor, dias) };
}

/** Sequencia exibida: zera se o ultimo dia estudado nao foi hoje nem ontem. */
export function streakVisivel(streak: Save['streak'], hoje: string): number {
  if (!streak.ultimoDia) return 0;
  if (streak.ultimoDia === hoje || streak.ultimoDia === diaAnterior(hoje)) return streak.dias;
  return 0;
}

/* ------------------------------------------------------------------ */
/* Conquistas                                                         */
/* ------------------------------------------------------------------ */

export type Conquista = { id: string; nome: string; descricao: string };

export const CONQUISTAS: Conquista[] = [
  { id: 'primeiro-acerto', nome: 'Primeira folha pura', descricao: 'Acerte sua primeira questão.' },
  { id: 'combo-5', nome: 'Ganho de informação', descricao: 'Acerte 5 questões seguidas.' },
  { id: 'combo-10', nome: 'Entropia zero', descricao: 'Acerte 10 questões seguidas.' },
  { id: 'streak-2', nome: 'Dois dias seguidos', descricao: 'Estude em dois dias consecutivos.' },
  { id: 'streak-4', nome: 'Até a véspera', descricao: 'Estude 4 dias seguidos.' },
  { id: 'explorador', nome: 'Explorador', descricao: 'Abra os 7 módulos.' },
  { id: 'calculista', nome: 'Calculista', descricao: 'Use as 4 ferramentas.' },
  { id: 'relampago', nome: 'Relâmpago', descricao: 'Faça 8 acertos ou mais num desafio cronometrado.' },
  { id: 'chefe-1', nome: 'Primeiro chefe', descricao: 'Derrote um chefe final.' },
  { id: 'chefe-todos', nome: 'Floresta completa', descricao: 'Derrote os 7 chefes finais.' },
  { id: 'simulado', nome: 'Ensaio geral', descricao: 'Entregue o simulado da prova de 2025.' },
  { id: 'simulado-70', nome: 'Aprovado no ensaio', descricao: 'Faça 70% ou mais no simulado.' },
  { id: 'caderno-5', nome: 'Caderno em dia', descricao: 'Tire 5 questões do caderno de erros acertando-as de novo.' },
  { id: 'nivel-5', nome: 'Ganho máximo', descricao: 'Chegue ao nível 5.' },
];

export const TOTAL_MODULOS = 7;
export const TOTAL_FERRAMENTAS = 4;

export function conquistasNovas(save: Save): string[] {
  const tem = (id: string) => id in save.conquistas;
  const acertou = Object.values(save.registros).some((r) => r.acertos > 0);
  const chefesVencidos = Object.values(save.chefes).filter((c) => c?.vencido).length;
  const regras: [string, boolean][] = [
    ['primeiro-acerto', acertou],
    ['combo-5', save.combo.melhor >= 5],
    ['combo-10', save.combo.melhor >= 10],
    ['streak-2', save.streak.melhor >= 2],
    ['streak-4', save.streak.melhor >= 4],
    ['explorador', save.vistos.length >= TOTAL_MODULOS],
    ['calculista', save.ferramentas.length >= TOTAL_FERRAMENTAS],
    ['relampago', save.desafio.melhor >= 8],
    ['chefe-1', chefesVencidos >= 1],
    ['chefe-todos', chefesVencidos >= TOTAL_MODULOS],
    ['simulado', save.simulado.feitos >= 1],
    ['simulado-70', (save.simulado.melhor ?? 0) >= 0.7],
    ['caderno-5', save.limpas >= 5],
    ['nivel-5', nivelDe(save.xp).nivel >= 5],
  ];
  return regras.filter(([id, ok]) => ok && !tem(id)).map(([id]) => id);
}

/* ------------------------------------------------------------------ */
/* Responder uma questao                                              */
/* ------------------------------------------------------------------ */

export type ResultadoResposta = {
  save: Save;
  xp: number;
  subiuNivel: boolean;
  conquistas: string[];
  saiuDoCaderno: boolean;
};

export function xpPorAcerto(nivelQuestao: number, primeiraVez: boolean, combo: number): number {
  const base = 10 * nivelQuestao;
  const bonusPrimeira = primeiraVez ? 5 : 0;
  const bonusCombo = combo >= 3 ? Math.min(10, 2 * (combo - 2)) : 0;
  return base + bonusPrimeira + bonusCombo;
}

export function responder(
  save: Save,
  q: Pick<Questao, 'id' | 'nivel'>,
  correta: boolean,
  agora: Date = new Date(),
  resposta?: string,
): ResultadoResposta {
  const anterior = save.registros[q.id];
  const primeiraVez = !anterior || anterior.acertos === 0;
  const combo = correta ? save.combo.atual + 1 : 0;
  const xp = correta ? xpPorAcerto(q.nivel, primeiraVez, combo) : 0;

  const caderno = { ...save.caderno };
  let limpas = save.limpas;
  let saiuDoCaderno = false;
  if (correta) {
    if (caderno[q.id]) {
      delete caderno[q.id];
      limpas += 1;
      saiuDoCaderno = true;
    }
  } else {
    const item = caderno[q.id];
    caderno[q.id] = { vezes: (item?.vezes ?? 0) + 1, quando: agora.getTime(), ultimaResposta: resposta };
  }

  const novo: Save = {
    ...save,
    xp: save.xp + xp,
    registros: {
      ...save.registros,
      [q.id]: {
        tentativas: (anterior?.tentativas ?? 0) + 1,
        acertos: (anterior?.acertos ?? 0) + (correta ? 1 : 0),
        ultimaCorreta: correta,
        quando: agora.getTime(),
      },
    },
    caderno,
    limpas,
    combo: { atual: combo, melhor: Math.max(save.combo.melhor, combo) },
    streak: atualizarStreak(save.streak, diaLocal(agora)),
  };
  return finalizar(save, novo, xp, agora, saiuDoCaderno);
}

/** Aplica bonus de XP e registra conquistas desbloqueadas. */
export function ganharXp(save: Save, xp: number, agora: Date = new Date()): ResultadoResposta {
  return finalizar(save, { ...save, xp: save.xp + xp }, xp, agora, false);
}

export function finalizar(antes: Save, depois: Save, xp: number, agora: Date, saiuDoCaderno: boolean): ResultadoResposta {
  const novas = conquistasNovas(depois);
  const conquistas = { ...depois.conquistas };
  novas.forEach((id) => (conquistas[id] = agora.getTime()));
  return {
    save: { ...depois, conquistas },
    xp,
    subiuNivel: nivelDe(depois.xp).nivel > nivelDe(antes.xp).nivel,
    conquistas: novas,
    saiuDoCaderno,
  };
}

/* ------------------------------------------------------------------ */
/* Dominio por modulo e medalhas                                      */
/* ------------------------------------------------------------------ */

export type Dominio = {
  total: number;
  acertadas: number;
  tentativas: number;
  acertos: number;
  erros: number;
  fracao: number;
};

export function dominio(save: Save, questoes: Pick<Questao, 'id'>[]): Dominio {
  let acertadas = 0;
  let tentativas = 0;
  let acertos = 0;
  for (const q of questoes) {
    const r = save.registros[q.id];
    if (!r) continue;
    tentativas += r.tentativas;
    acertos += r.acertos;
    if (r.acertos > 0) acertadas += 1;
  }
  return {
    total: questoes.length,
    acertadas,
    tentativas,
    acertos,
    erros: tentativas - acertos,
    fracao: questoes.length ? acertadas / questoes.length : 0,
  };
}

export type Medalhas = { bronze: boolean; prata: boolean; ouro: boolean };

export function medalhas(save: Save, modulo: ModuloId, d: Dominio): Medalhas {
  return {
    bronze: d.acertadas >= 3,
    prata: d.fracao >= 0.8,
    ouro: Boolean(save.chefes[modulo]?.vencido),
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

/** Bateria do chefe: 8 questoes mistas, priorizando as que a pessoa ainda nao acertou. */
export function montarChefe(save: Save, questoes: Questao[], tamanho = 8, aleatorio: () => number = Math.random): Questao[] {
  const pendentes = embaralhar(questoes.filter((q) => !(save.registros[q.id]?.acertos > 0)), aleatorio);
  const feitas = embaralhar(questoes.filter((q) => save.registros[q.id]?.acertos > 0), aleatorio);
  const escolhidas = [...pendentes, ...feitas].slice(0, tamanho);
  // garante pelo menos uma aberta-fechada quando existir
  if (!escolhidas.some((q) => q.tipo === 'num')) {
    const num = questoes.find((q) => q.tipo === 'num');
    if (num && escolhidas.length > 0) escolhidas[escolhidas.length - 1] = num;
  }
  return embaralhar(escolhidas, aleatorio);
}

export const CHEFE = { questoes: 8, acertosParaVencer: 6, vidas: 3, bonusXp: 100 } as const;
export const DESAFIO = { questoes: 10, segundos: 240, xpPorAcerto: 8 } as const;
