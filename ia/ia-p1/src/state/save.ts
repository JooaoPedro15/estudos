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
  /** historico por questao */
  registros: Record<string, Registro>;
  /** caderno de erros: questoes erradas que ainda nao foram refeitas com acerto */
  caderno: Record<string, ItemCaderno>;
  /** quantas questoes ja sairam do caderno (refeitas com acerto) */
  limpas: number;
  simulado: {
    melhor: number | null;
    feitos: number;
    /** simulado em andamento: questao -> opcao marcada */
    emAndamento?: { respostas: Record<string, number>; inicio: number; limiteMin: number | null };
  };
};

export function saveVazio(): Save {
  return {
    v: 1,
    registros: {},
    caderno: {},
    limpas: 0,
    simulado: { melhor: null, feitos: 0 },
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
      registros: lido.registros ?? base.registros,
      caderno: lido.caderno ?? base.caderno,
      limpas: lido.limpas ?? base.limpas,
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
