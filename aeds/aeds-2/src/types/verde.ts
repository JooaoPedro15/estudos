/**
 * Resultado do corretor estilo Verde, como chega do servidor (POST
 * /api/verde/rodar). Espelho de corretor/tipos.ts — o corretor roda no
 * Node e e outro projeto TypeScript, entao os dois lados declaram o mesmo
 * formato. Mantenha em sincronia.
 */

export type StatusCasoVerde = 'correto' | 'errado' | 'erro-execucao' | 'tempo-excedido';

export type CasoVerde = {
  status: StatusCasoVerde;
  porcentagem: number;
  tempoMs: number;
  entrada?: string;
  esperado?: string;
  obtido?: string;
  erro?: string;
  dica?: string;
};

export type GrupoVerde = {
  porcentagem: number;
  casosCorretos: number;
  totalCasos: number;
  casos: CasoVerde[];
};

export type ResultadoVerde =
  | { status: 'erro-compilacao'; mensagem: string }
  | { status: 'executado'; publica: GrupoVerde; privada: GrupoVerde; limiteMs: number }
  | { status: 'indisponivel'; mensagem: string };
