import type { Bloco } from './types';

/** Enunciado no formato da professora: contexto + afirmacoes I, II, III + pergunta. */
export function afirmacoes(contexto: string | Bloco[], itens: string[], pergunta = 'Quais das afirmações estão corretas?'): Bloco[] {
  const romanos = ['I', 'II', 'III', 'IV', 'V'];
  const base: Bloco[] = typeof contexto === 'string' ? [{ tipo: 'p', texto: contexto }] : contexto;
  return [
    ...base,
    { tipo: 'lista', itens: itens.map((t, i) => `**${romanos[i]}.** ${t}`) },
    { tipo: 'p', texto: pergunta },
  ];
}

/** Explicacao afirmacao por afirmacao: [['I', true, 'porque...'], ...]. */
export function analise(itens: [string, boolean, string][], fecho?: string): Bloco[] {
  const blocos: Bloco[] = [
    {
      tipo: 'lista',
      itens: itens.map(([n, ok, texto]) => `**${n}. ${ok ? 'Correta' : 'Incorreta'}.** ${texto}`),
    },
  ];
  if (fecho) blocos.push({ tipo: 'p', texto: fecho });
  return blocos;
}

export const p = (texto: string): Bloco => ({ tipo: 'p', texto });
export const formula = (tex: string, nome?: string): Bloco => ({ tipo: 'formula', tex, nome });
export const lista = (...itens: string[]): Bloco => ({ tipo: 'lista', itens });
export const codigo = (fonte: string, legenda?: string): Bloco => ({ tipo: 'codigo', codigo: fonte.replace(/^\n/, ''), legenda });
export const nota = (variante: 'info' | 'alerta' | 'fora' | 'prova', texto: string): Bloco => ({ tipo: 'nota', variante, texto });
export const tabela = (cabecalho: string[], linhas: string[][], legenda?: string): Bloco => ({ tipo: 'tabela', cabecalho, linhas, legenda });

/** Arredonda para exibir em gabarito/resolucao com virgula. */
export const n = (valor: number, casas = 4): string =>
  Number(valor.toFixed(casas)).toLocaleString('pt-BR', { maximumFractionDigits: casas });
