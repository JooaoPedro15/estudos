import { BookOpen, ChevronDown, ChevronUp, Eye, GraduationCap, ListChecks, Sigma } from 'lucide-react';
import { useId, useState } from 'react';

import { MODULOS } from '../content';
import { ENSINE } from '../content/ensine';
import type { Formula as FormulaT, Modulo, Secao } from '../content/types';
import { Blocos, Fontes } from './Blocos';
import { Formula, RichText } from './RichText';

function buscarSecao(ref: string): { m: Modulo; s: Secao } | null {
  const [mid, sid] = ref.split('/');
  const m = MODULOS.find((x) => x.id === mid);
  const s = m?.resumo.find((x) => x.id === sid);
  return m && s ? { m, s } : null;
}

function buscarFormula(ref: string): FormulaT | null {
  const i = ref.indexOf('/');
  const m = MODULOS.find((x) => x.id === ref.slice(0, i));
  return m?.formulas.find((fo) => fo.nome === ref.slice(i + 1)) ?? null;
}

type Props = {
  questaoId: string;
  /** a questao ja foi corrigida (respondida ou desistida) */
  respondida: boolean;
  /** abre a resolucao antes de responder; a questao conta como errada */
  onDesistir: () => void;
};

/**
 * Botao "Me ensine": explica o que a questao cobra e como fazer, mostra as
 * formulas e as secoes do resumo para rever. So entrega a resposta se a
 * pessoa desistir, e ai a questao vai para o caderno de erros.
 */
export function MeEnsine({ questaoId, respondida, onDesistir }: Props) {
  const [aberto, setAberto] = useState(false);
  const painel = useId();
  const e = ENSINE[questaoId];
  if (!e) return null;
  const secoes = e.rever.map(buscarSecao).filter((x): x is { m: Modulo; s: Secao } => x !== null);
  const formulas = (e.formulas ?? []).map(buscarFormula).filter((x): x is FormulaT => x !== null);

  return (
    <div className="me-ensine">
      <button type="button" className="btn btn-ensine" aria-expanded={aberto} aria-controls={painel} onClick={() => setAberto((v) => !v)}>
        <GraduationCap size={16} aria-hidden="true" />
        {aberto ? 'Fechar explicação' : 'Me ensine'}
        {aberto ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
      </button>

      {aberto && (
        <div id={painel} className="ensine-painel" role="region" aria-label="Me ensine">
          <section className="ensine-bloco">
            <h4>
              <GraduationCap size={16} aria-hidden="true" /> O que esta questão cobra
            </h4>
            <p>
              <RichText texto={e.ideia} />
            </p>
          </section>

          {e.passos && e.passos.length > 0 && (
            <section className="ensine-bloco">
              <h4>
                <ListChecks size={16} aria-hidden="true" /> Como fazer
              </h4>
              <ol className="ensine-passos">
                {e.passos.map((ps, i) => (
                  <li key={i}>
                    <RichText texto={ps} />
                  </li>
                ))}
              </ol>
            </section>
          )}

          {formulas.length > 0 && (
            <section className="ensine-bloco">
              <h4>
                <Sigma size={16} aria-hidden="true" /> Fórmulas
              </h4>
              <div className="ensine-formulas">
                {formulas.map((fo) => (
                  <div key={fo.nome} className="formula-caixa">
                    <span className="formula-nome">{fo.nome}</span>
                    <Formula tex={fo.tex} />
                    {fo.nota && (
                      <p className="formula-nota">
                        <RichText texto={fo.nota} />
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="ensine-bloco">
            <h4>
              <BookOpen size={16} aria-hidden="true" /> Rever no resumo
            </h4>
            {secoes.map(({ m, s }) => (
              <details key={`${m.id}/${s.id}`} className="ensine-secao">
                <summary>
                  {s.titulo} <span className="ensine-modulo">{m.curto}</span>
                </summary>
                <div className="ensine-secao-corpo">
                  <Blocos blocos={s.blocos} />
                  <Fontes fontes={s.fontes} />
                </div>
              </details>
            ))}
          </section>

          {!respondida && (
            <div className="ensine-desistir">
              <button type="button" className="btn btn-pequeno" onClick={onDesistir}>
                <Eye size={14} aria-hidden="true" /> Desistir e ver a resolução
              </button>
              <span className="dica-teclado">A questão conta como errada e vai para o caderno de erros.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
