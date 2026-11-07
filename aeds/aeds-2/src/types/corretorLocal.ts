/**
 * Resultado do corretor estilo Local, como chega do servidor (POST
 * /api/local/rodar). Espelho de corretor/tipos.ts — o corretor roda no
 * Node e e outro projeto TypeScript, entao os dois lados declaram o mesmo
 * formato. Mantenha em sincronia.
 */

export type StatusCasoLocal = 'correto' | 'errado' | 'erro-execucao' | 'tempo-excedido';

export type CasoLocal = {
  status: StatusCasoLocal;
  porcentagem: number;
  tempoMs: number;
  entrada?: string;
  esperado?: string;
  obtido?: string;
  erro?: string;
  dica?: string;
};

export type GrupoLocal = {
  porcentagem: number;
  casosCorretos: number;
  totalCasos: number;
  casos: CasoLocal[];
};

export type ResultadoLocal =
  | { status: 'erro-compilacao'; mensagem: string }
  | { status: 'executado'; publica: GrupoLocal; privada: GrupoLocal; limiteMs: number }
  | { status: 'indisponivel'; mensagem: string };
