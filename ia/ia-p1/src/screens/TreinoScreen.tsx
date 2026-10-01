import { ArrowLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useState } from 'react';

import { link } from '../app/router';
import { modulo, QUESTOES, questao as buscarQuestao, questoesDoModulo } from '../content';
import type { ModuloId, Questao } from '../content/types';
import { QuestionCard } from '../components/QuestionCard';
import { RichText } from '../components/RichText';
import { embaralhar } from '../state/game';
import type { Save } from '../state/save';
import { useEstudo } from '../state/EstudoContext';
import { resumoEnunciado } from './ModuloScreen';

type Plano = { titulo: string; questoes: Questao[]; voltar: { href: string; rotulo: string }; refazer: string };

const doCaderno = (save: Save, filtro?: ModuloId): Questao[] =>
  Object.entries(save.caderno)
    .sort((a, b) => b[1].vezes - a[1].vezes || a[1].quando - b[1].quando)
    .map(([id]) => buscarQuestao(id))
    .filter((q): q is Questao => Boolean(q) && (!filtro || q!.modulo === filtro));

/** Monta a lista de questoes a partir da rota /treino/<alvo>/<inicio>. */
export function planejar(save: Save, alvo: string, inicio?: string): Plano {
  if (alvo === 'misto') {
    return {
      titulo: 'Treino misto',
      questoes: embaralhar(QUESTOES.filter((q) => q.modulo !== 'codigos' || q.nivel > 1)).slice(0, 10),
      voltar: { href: '/', rotulo: 'Início' },
      refazer: '/treino/caderno',
    };
  }
  if (alvo === 'caderno' || alvo.startsWith('caderno-')) {
    const filtro = alvo.startsWith('caderno-') ? (alvo.slice(8) as ModuloId) : undefined;
    const lista = doCaderno(save, filtro);
    const unica = inicio ? lista.filter((q) => q.id === inicio) : [];
    return {
      titulo: filtro ? `Refazer erradas: ${modulo(filtro)?.curto ?? ''}` : 'Refazer só as erradas',
      questoes: unica.length ? unica : lista,
      voltar: filtro ? { href: `/modulo/${filtro}`, rotulo: modulo(filtro)?.curto ?? 'Módulo' } : { href: '/caderno', rotulo: 'Caderno de erros' },
      refazer: alvo,
    };
  }
  const m = modulo(alvo);
  if (m) {
    const todas = questoesDoModulo(m.id);
    let ordem = [...todas.filter((q) => !(save.registros[q.id]?.acertos > 0)), ...todas.filter((q) => save.registros[q.id]?.acertos > 0)];
    if (inicio) {
      const i = todas.findIndex((q) => q.id === inicio);
      if (i >= 0) ordem = [...todas.slice(i), ...todas.slice(0, i)];
    }
    return { titulo: `Questões: ${m.curto}`, questoes: ordem, voltar: { href: `/modulo/${m.id}/questoes`, rotulo: m.curto }, refazer: `caderno-${m.id}` };
  }
  return { titulo: 'Treino', questoes: [], voltar: { href: '/', rotulo: 'Início' }, refazer: '/caderno' };
}

export function TreinoScreen({ alvo, inicio }: { alvo: string; inicio?: string }) {
  const { save } = useEstudo();
  const [plano] = useState(() => planejar(save, alvo, inicio));
  const [indice, setIndice] = useState(0);
  const [resultados, setResultados] = useState<Record<string, boolean>>({});
  const total = plano.questoes.length;
  const q = plano.questoes[indice];
  const respondida = q ? q.id in resultados : false;
  const fim = indice >= total;
  const acertos = Object.values(resultados).filter(Boolean).length;
  const erradas = plano.questoes.filter((x) => resultados[x.id] === false);

  return (
    <div className="treino">
      <a href={link(plano.voltar.href)} className="voltar">
        <ArrowLeft size={16} aria-hidden="true" /> {plano.voltar.rotulo}
      </a>
      <header className="treino-topo">
        <h1>{plano.titulo}</h1>
        {total > 0 && (
          <div className="treino-progresso">
            <div className="barra" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={Object.keys(resultados).length} aria-label="Questões respondidas">
              <span className="barra-cheia" style={{ width: `${(Object.keys(resultados).length / total) * 100}%` }} />
            </div>
            <span>
              {Math.min(indice + 1, total)} de {total}
            </span>
          </div>
        )}
      </header>

      {total === 0 && (
        <div className="vazio">
          <p>Nada para refazer aqui: o caderno de erros está vazio para esta seleção.</p>
          <a className="btn" href={link(plano.voltar.href)}>
            Voltar
          </a>
        </div>
      )}

      {!fim && q && (
        <>
          <QuestionCard
            key={q.id}
            questao={q}
            rotulo={`Questão ${indice + 1} de ${total}${alvo === 'misto' ? `, ${modulo(q.modulo)?.curto}` : ''}`}
            onRespondida={(c) => setResultados((r) => ({ ...r, [q.id]: c }))}
          />
          {respondida && (
            <div className="acoes acoes-fixas">
              <button type="button" className="btn btn-primario" onClick={() => setIndice((i) => i + 1)} autoFocus>
                {indice + 1 < total ? 'Próxima questão' : 'Ver resultado'}
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
          )}
        </>
      )}

      {fim && total > 0 && (
        <section className="resultado" aria-labelledby="h-resultado">
          <h2 id="h-resultado">
            {acertos} de {Object.keys(resultados).length} certas
          </h2>
          {erradas.length > 0 ? (
            <>
              <p>Estas foram para o caderno de erros:</p>
              <ul className="lista-erradas">
                {erradas.map((x) => (
                  <li key={x.id}>
                    <RichText texto={resumoEnunciado(x)} />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>Nenhum erro nesta rodada.</p>
          )}
          <div className="acoes">
            {erradas.length > 0 && (
              <a className="btn btn-primario" href={link(`/treino/${plano.refazer.replace(/^\/treino\//, '')}/r${Date.now()}`)}>
                <RotateCcw size={16} aria-hidden="true" /> Refazer só as erradas
              </a>
            )}
            <a className="btn" href={link(plano.voltar.href)}>
              Voltar para {plano.voltar.rotulo.toLowerCase()}
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
