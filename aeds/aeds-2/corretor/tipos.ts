/**
 * Tipos do corretor estilo Verde. O corretor roda no Node (plugin do Vite),
 * entao nao importa nada de src/ (projeto TypeScript separado): o drill
 * chega aqui so com os campos que a correcao usa. O formato do resultado e
 * espelhado em src/types/verde.ts (lado do navegador) — mantenha os dois
 * em sincronia.
 */

export type SiteJuiz = 'beecrowd' | 'LeetCode' | 'Codewars';

export type DrillCorrigivel = {
  id: string;
  scaffold: string;
  judge?: { site: SiteJuiz; timeLimit?: string };
  samples?: Array<{ input: string; output: string }>;
  step: { kind: string; solution?: string; variants?: Array<{ solution: string }> };
};

export type StatusCaso = 'correto' | 'errado' | 'erro-execucao' | 'tempo-excedido';

export type CasoResultado = {
  status: StatusCaso;
  /** Porcentagem de linhas da saida que bateram com a esperada (0 a 100). */
  porcentagem: number;
  tempoMs: number;
  /** So nos casos publicos (os privados ficam escondidos, como no Verde). */
  entrada?: string;
  esperado?: string;
  obtido?: string;
  /** Mensagem de erro do Java (excecao) ou do corretor. */
  erro?: string;
  /** Dica curta quando a diferenca e so de espacos/linhas em branco. */
  dica?: string;
};

export type GrupoResultado = {
  /** Linhas certas / linhas esperadas somando todos os casos do grupo (0 a 100). */
  porcentagem: number;
  casosCorretos: number;
  totalCasos: number;
  casos: CasoResultado[];
};

export type ResultadoCorrecao =
  | { status: 'erro-compilacao'; mensagem: string }
  | { status: 'executado'; publica: GrupoResultado; privada: GrupoResultado; limiteMs: number }
  | { status: 'indisponivel'; mensagem: string };

export type CasoTeste = { entrada: string; esperado: string };
