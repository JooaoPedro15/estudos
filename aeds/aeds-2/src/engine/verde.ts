import type { ChallengeStep, StepResult } from '../types/content';
import type { ResultadoVerde } from '../types/verde';
import { getStepMaxScore } from './evaluator';

/**
 * Lado do navegador do corretor estilo Verde: manda o codigo para o
 * servidor de desenvolvimento (plugin em corretor/plugin.ts) e traduz o
 * resultado para o formato de acerto/erro do treino.
 */

export async function rodarNoCorretor(drillId: string, codigo: string): Promise<ResultadoVerde> {
  try {
    const resposta = await fetch('/api/verde/rodar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drillId, codigo }),
    });
    const tipo = resposta.headers.get('Content-Type') ?? '';
    if (!tipo.includes('application/json')) {
      return {
        status: 'indisponivel',
        mensagem: 'Corretor fora do ar: ele so existe rodando o app com "npm run dev" (precisa do JDK instalado).',
      };
    }
    return (await resposta.json()) as ResultadoVerde;
  } catch {
    return {
      status: 'indisponivel',
      mensagem: 'Nao consegui falar com o corretor. Rode o app com "npm run dev" na maquina que tem o JDK.',
    };
  }
}

function resumoGrupo(nome: string, grupo: { porcentagem: number; casosCorretos: number; totalCasos: number }): string {
  return `saida ${nome} ${grupo.porcentagem}% (${grupo.casosCorretos}/${grupo.totalCasos} casos)`;
}

export function resumoVerde(resultado: ResultadoVerde): string {
  if (resultado.status === 'erro-compilacao') {
    return 'Corretor: erro de compilacao — confira a mensagem do javac.';
  }
  if (resultado.status === 'indisponivel') {
    return resultado.mensagem;
  }
  return `Corretor: ${resumoGrupo('publica', resultado.publica)}, ${resumoGrupo('privada', resultado.privada)}.`;
}

export function acertouNoVerde(resultado: ResultadoVerde): boolean {
  return resultado.status === 'executado' && resultado.publica.porcentagem === 100 && resultado.privada.porcentagem === 100;
}

/** Converte a correcao do Verde em acerto/erro do treino (so 100% nas duas saidas conta como acerto). */
export function resultadoDoVerde(resultado: ResultadoVerde, step: ChallengeStep): StepResult {
  const correto = acertouNoVerde(resultado);
  return {
    correct: correto,
    scoreDelta: correto ? getStepMaxScore(step) : 0,
    feedback: resumoVerde(resultado),
    mistakeTag: correto ? undefined : 'mistakeTag' in step ? step.mistakeTag : undefined,
  };
}
