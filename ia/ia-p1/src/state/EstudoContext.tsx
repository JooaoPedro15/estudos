import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { responder as responderPuro, type ResultadoResposta } from './game';
import { apagar, carregar, salvar, saveVazio, type Save } from './save';

type Estudo = {
  save: Save;
  responder: (id: string, correta: boolean, resposta?: string) => ResultadoResposta;
  iniciarSimulado: (limiteMin: number | null) => void;
  marcarSimulado: (id: string, opcao: number) => void;
  entregarSimulado: (nota: number) => void;
  descartarSimulado: () => void;
  apagarProgresso: () => void;
};

const Ctx = createContext<Estudo | null>(null);

export function EstudoProvider({ children, inicial }: { children: ReactNode; inicial?: Save }) {
  const [save, setSave] = useState<Save>(() => inicial ?? carregar());
  const atual = useRef(save);
  atual.current = save;

  useEffect(() => {
    salvar(save);
  }, [save]);

  const aplicar = useCallback((proximo: Save) => {
    atual.current = proximo;
    setSave(proximo);
  }, []);

  const responder = useCallback(
    (id: string, correta: boolean, resposta?: string) => {
      const r = responderPuro(atual.current, id, correta, new Date(), resposta);
      aplicar(r.save);
      return r;
    },
    [aplicar],
  );

  const iniciarSimulado = useCallback(
    (limiteMin: number | null) => {
      const s = atual.current;
      aplicar({ ...s, simulado: { ...s.simulado, emAndamento: { respostas: {}, inicio: Date.now(), limiteMin } } });
    },
    [aplicar],
  );

  const marcarSimulado = useCallback(
    (id: string, opcao: number) => {
      const s = atual.current;
      const em = s.simulado.emAndamento;
      if (!em) return;
      aplicar({ ...s, simulado: { ...s.simulado, emAndamento: { ...em, respostas: { ...em.respostas, [id]: opcao } } } });
    },
    [aplicar],
  );

  const entregarSimulado = useCallback(
    (nota: number) => {
      const s = atual.current;
      aplicar({
        ...s,
        simulado: { melhor: Math.max(s.simulado.melhor ?? 0, nota), feitos: s.simulado.feitos + 1, emAndamento: undefined },
      });
    },
    [aplicar],
  );

  const descartarSimulado = useCallback(() => {
    const s = atual.current;
    aplicar({ ...s, simulado: { ...s.simulado, emAndamento: undefined } });
  }, [aplicar]);

  const apagarProgresso = useCallback(() => {
    apagar();
    aplicar(saveVazio());
  }, [aplicar]);

  const valor = useMemo(
    () => ({ save, responder, iniciarSimulado, marcarSimulado, entregarSimulado, descartarSimulado, apagarProgresso }),
    [save, responder, iniciarSimulado, marcarSimulado, entregarSimulado, descartarSimulado, apagarProgresso],
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useEstudo(): Estudo {
  const v = useContext(Ctx);
  if (!v) throw new Error('useEstudo fora do EstudoProvider');
  return v;
}
