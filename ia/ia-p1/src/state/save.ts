import type { ModuloId } from '../content/types';

export const CHAVE = 'ia-p1:save:v1';

export type Registro = {
  tentativas: number;
  acertos: number;
  ultimaCorreta: boolean;
  quando: number;
};

export type ItemCaderno = { vezes: number; quando: number; ultimaResposta?: string };

export type Save = {
  v: 1;
  xp: number;
  registros: Record<string, Registro>;
  caderno: Record<string, ItemCaderno>;
  limpas: number;
  streak: { dias: number; ultimoDia: string | null; melhor: number };
  combo: { atual: number; melhor: number };
  conquistas: Record<string, number>;
  chefes: Partial<Record<ModuloId, { melhor: number; vencido: boolean }>>;
  desafio: { melhor: number; jogos: number };
  simulado: {
    melhor: number | null;
    feitos: number;
    /** simulado em andamento: questao -> opcao marcada */
    emAndamento?: { respostas: Record<string, number>; inicio: number; limiteMin: number | null };
  };
  ferramentas: string[];
  vistos: ModuloId[];
  som: boolean;
};

export function saveVazio(): Save {
  return {
    v: 1,
    xp: 0,
    registros: {},
    caderno: {},
    limpas: 0,
    streak: { dias: 0, ultimoDia: null, melhor: 0 },
    combo: { atual: 0, melhor: 0 },
    conquistas: {},
    chefes: {},
    desafio: { melhor: 0, jogos: 0 },
    simulado: { melhor: null, feitos: 0 },
    ferramentas: [],
    vistos: [],
    som: false,
  };
}

function armazenamento(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

/** Le o progresso salvo. Qualquer falha (modo privado, JSON quebrado) volta ao estado vazio. */
export function carregar(storage: Storage | null = armazenamento()): Save {
  try {
    const bruto = storage?.getItem(CHAVE);
    if (!bruto) return saveVazio();
    const lido = JSON.parse(bruto) as Partial<Save>;
    if (!lido || lido.v !== 1) return saveVazio();
    const base = saveVazio();
    return {
      ...base,
      ...lido,
      streak: { ...base.streak, ...lido.streak },
      combo: { ...base.combo, ...lido.combo },
      desafio: { ...base.desafio, ...lido.desafio },
      simulado: { ...base.simulado, ...lido.simulado },
    };
  } catch {
    return saveVazio();
  }
}

export function salvar(save: Save, storage: Storage | null = armazenamento()): void {
  try {
    storage?.setItem(CHAVE, JSON.stringify(save));
  } catch {
    // sem armazenamento disponivel: o app continua funcionando, so nao lembra
  }
}

export function apagar(storage: Storage | null = armazenamento()): void {
  try {
    storage?.removeItem(CHAVE);
  } catch {
    // idem
  }
}
