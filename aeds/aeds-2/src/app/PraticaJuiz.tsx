import { CircleCheck, CircleX, ExternalLink, LoaderCircle, Timer, TriangleAlert } from 'lucide-react';

import type { JudgeProblemRef, ProblemSample } from '../types/content';
import type { CasoVerde, GrupoVerde, ResultadoVerde } from '../types/verde';

/**
 * Pecas da tela de prova pratica que imitam o juiz: de onde vem o problema
 * (com link para o original), os exemplos oficiais em blocos de texto puro
 * (como no beecrowd) e o painel de correcao estilo Verde (compilacao,
 * saida publica e saida privada em porcentagem).
 */

export function CabecalhoJuiz({ judge }: { judge: JudgeProblemRef }) {
  return (
    <div className="judge-header">
      <span className={`judge-site judge-site-${judge.site.toLowerCase()}`}>{judge.site}</span>
      <span className="judge-name">Problema real, mesmos exemplos oficiais</span>
      {judge.timeLimit && (
        <span className="judge-limit">
          <Timer aria-hidden="true" size={14} />
          limite {judge.timeLimit}
        </span>
      )}
      <a className="judge-link" href={judge.url} rel="noreferrer" target="_blank">
        Abrir original
        <ExternalLink aria-hidden="true" size={14} />
      </a>
    </div>
  );
}

export function ExemplosOficiais({ samples }: { samples: ProblemSample[] }) {
  return (
    <div className="judge-samples" aria-label="Exemplos oficiais">
      {samples.map((sample, indice) => (
        <div className="judge-sample" key={indice}>
          <div>
            <span className="judge-sample-label">{samples.length > 1 ? `Exemplo de entrada ${indice + 1}` : 'Exemplo de entrada'}</span>
            <pre>{sample.input}</pre>
          </div>
          <div>
            <span className="judge-sample-label">{samples.length > 1 ? `Exemplo de saida ${indice + 1}` : 'Exemplo de saida'}</span>
            <pre>{sample.output}</pre>
          </div>
        </div>
      ))}
    </div>
  );
}

const ROTULO_STATUS: Record<CasoVerde['status'], string> = {
  correto: 'Correto',
  errado: 'Saida incorreta',
  'erro-execucao': 'Erro de execucao',
  'tempo-excedido': 'Tempo limite excedido',
};

function nivel(porcentagem: number): 'ok' | 'parcial' | 'zero' {
  if (porcentagem === 100) {
    return 'ok';
  }
  return porcentagem > 0 ? 'parcial' : 'zero';
}

function IconeStatus({ status }: { status: CasoVerde['status'] }) {
  if (status === 'correto') {
    return <CircleCheck aria-hidden="true" size={16} />;
  }
  if (status === 'tempo-excedido') {
    return <Timer aria-hidden="true" size={16} />;
  }
  return <CircleX aria-hidden="true" size={16} />;
}

function Nota({ titulo, grupo }: { titulo: string; grupo: GrupoVerde }) {
  return (
    <div className={`verde-score is-${nivel(grupo.porcentagem)}`}>
      <span className="verde-score-title">{titulo}</span>
      <strong>{grupo.totalCasos === 0 ? '—' : `${grupo.porcentagem}%`}</strong>
      <span>
        {grupo.casosCorretos}/{grupo.totalCasos} casos
      </span>
    </div>
  );
}

function CasoPublico({ caso, indice }: { caso: CasoVerde; indice: number }) {
  return (
    <details className={`verde-case is-${caso.status}`} open={caso.status !== 'correto'}>
      <summary>
        <IconeStatus status={caso.status} />
        <span>
          Caso publico {indice + 1}: {ROTULO_STATUS[caso.status]}
        </span>
        <span className="verde-case-meta">
          {caso.porcentagem}% · {caso.tempoMs} ms
        </span>
      </summary>
      {caso.dica && <p className="verde-hint">{caso.dica}</p>}
      {caso.erro && <pre className="verde-error">{caso.erro}</pre>}
      <div className="verde-io">
        <div>
          <span className="judge-sample-label">Entrada</span>
          <pre>{caso.entrada}</pre>
        </div>
        <div>
          <span className="judge-sample-label">Saida esperada</span>
          <pre>{caso.esperado}</pre>
        </div>
        <div>
          <span className="judge-sample-label">Sua saida</span>
          <pre>{caso.obtido === '' ? '(nada foi impresso)' : caso.obtido}</pre>
        </div>
      </div>
    </details>
  );
}

export type EstadoVerde = { carregando: boolean; resultado: ResultadoVerde | null };

export function PainelVerde({ estado }: { estado: EstadoVerde }) {
  if (estado.carregando) {
    return (
      <section className="verde-panel" aria-label="Corretor" aria-live="polite">
        <p className="verde-loading">
          <LoaderCircle aria-hidden="true" className="spin" size={18} />
          Compilando e rodando os casos de teste...
        </p>
      </section>
    );
  }
  const resultado = estado.resultado;
  if (!resultado) {
    return null;
  }
  return (
    <section className="verde-panel" aria-label="Corretor" aria-live="polite">
      <h4>Corretor (estilo Verde)</h4>
      {resultado.status === 'indisponivel' && (
        <p className="verde-warning">
          <TriangleAlert aria-hidden="true" size={18} />
          {resultado.mensagem}
        </p>
      )}
      {resultado.status === 'erro-compilacao' && (
        <>
          <p className="verde-compile is-error">
            <CircleX aria-hidden="true" size={18} />
            Erro de compilacao
          </p>
          <pre className="verde-error">{resultado.mensagem}</pre>
        </>
      )}
      {resultado.status === 'executado' && (
        <>
          <p className="verde-compile">
            <CircleCheck aria-hidden="true" size={18} />
            Compilou · limite local {(resultado.limiteMs / 1000).toFixed(1)}s por caso
          </p>
          <div className="verde-scores">
            <Nota grupo={resultado.publica} titulo="Saida publica" />
            <Nota grupo={resultado.privada} titulo="Saida privada" />
          </div>
          <div className="verde-cases">
            {resultado.publica.casos.map((caso, indice) => (
              <CasoPublico caso={caso} indice={indice} key={`pub-${indice}`} />
            ))}
          </div>
          {resultado.privada.casos.length > 0 && (
            <ul className="verde-private" aria-label="Casos privados">
              {resultado.privada.casos.map((caso, indice) => (
                <li className={`is-${caso.status}`} key={`pri-${indice}`} title={caso.erro ?? ROTULO_STATUS[caso.status]}>
                  <IconeStatus status={caso.status} />
                  Privado {indice + 1}: {caso.status === 'tempo-excedido' ? 'tempo' : `${caso.porcentagem}%`}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
