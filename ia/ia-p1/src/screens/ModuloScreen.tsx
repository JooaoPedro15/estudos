import { ArrowLeft, Check, ChevronRight, CircleAlert, NotebookPen } from 'lucide-react';
import { useState } from 'react';

import { link } from '../app/router';
import { modulo, questoesDoModulo } from '../content';
import type { Modulo, ModuloId, Questao } from '../content/types';
import { Blocos, Fontes } from '../components/Blocos';
import { Formula, RichText } from '../components/RichText';
import { dominio } from '../state/game';
import { useEstudo } from '../state/EstudoContext';

const ABAS = [
  { id: 'resumo', rotulo: 'Resumo' },
  { id: 'formulas', rotulo: 'Fórmulas' },
  { id: 'exemplo', rotulo: 'Exemplo resolvido' },
  { id: 'pegadinhas', rotulo: 'Pegadinhas' },
  { id: 'questoes', rotulo: 'Questões' },
] as const;

type AbaId = (typeof ABAS)[number]['id'];

const PRIORIDADE = { alta: 'Prioridade alta', media: 'Prioridade média', baixa: 'Prioridade baixa' } as const;

/** Primeira frase do enunciado, para listas. */
export function resumoEnunciado(q: Questao): string {
  const p = q.enunciado.find((b) => b.tipo === 'p');
  const texto = p && p.tipo === 'p' ? p.texto : q.enunciado[0]?.tipo === 'codigo' ? 'Leitura de código' : 'Questão';
  return texto.length > 150 ? `${texto.slice(0, 147)}...` : texto;
}

function Resumo({ m }: { m: Modulo }) {
  return (
    <>
      <nav className="sumario" aria-label="Seções do resumo">
        {m.resumo.map((s) => (
          <a key={s.id} href={`#sec-${s.id}`} onClick={(e) => {
            e.preventDefault();
            document.getElementById(`sec-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}>
            {s.titulo}
          </a>
        ))}
      </nav>
      {m.resumo.map((s) => (
        <section key={s.id} id={`sec-${s.id}`} className="secao-conteudo" aria-labelledby={`h-${s.id}`}>
          <h2 id={`h-${s.id}`}>{s.titulo}</h2>
          <Blocos blocos={s.blocos} />
          <Fontes fontes={s.fontes} />
        </section>
      ))}
    </>
  );
}

function Formulas({ m }: { m: Modulo }) {
  return (
    <div className="formulas-grade">
      {m.formulas.map((fo) => (
        <section key={fo.nome} className="formula-cartao" aria-label={fo.nome}>
          <h3>{fo.nome}</h3>
          <Formula tex={fo.tex} />
          {fo.nota && (
            <p className="formula-nota">
              <RichText texto={fo.nota} />
            </p>
          )}
          <Fontes fontes={[fo.fonte]} />
        </section>
      ))}
    </div>
  );
}

function Exemplo({ m }: { m: Modulo }) {
  const [visiveis, setVisiveis] = useState(0);
  const { exemplo } = m;
  const todos = visiveis >= exemplo.passos.length;
  return (
    <section className="secao-conteudo" aria-labelledby="h-exemplo">
      <h2 id="h-exemplo">{exemplo.titulo}</h2>
      <Blocos blocos={exemplo.enunciado} />
      <ol className="passos">
        {exemplo.passos.slice(0, visiveis).map((ps, i) => (
          <li key={i} className="passo">
            <h3>
              <span className="passo-num">{i + 1}</span>
              {ps.titulo}
            </h3>
            <Blocos blocos={ps.blocos} />
          </li>
        ))}
      </ol>
      {!todos && (
        <div className="acoes">
          <button type="button" className="btn btn-primario" onClick={() => setVisiveis((v) => v + 1)}>
            {visiveis === 0 ? 'Mostrar o primeiro passo' : 'Próximo passo'}
          </button>
          <button type="button" className="btn" onClick={() => setVisiveis(exemplo.passos.length)}>
            Mostrar tudo
          </button>
          <span className="dica-teclado">
            {visiveis} de {exemplo.passos.length} passos. Tente fazer cada um antes de abrir.
          </span>
        </div>
      )}
      <Fontes fontes={exemplo.fontes} />
    </section>
  );
}

function Pegadinhas({ m }: { m: Modulo }) {
  return (
    <section className="pegadinhas" aria-labelledby="h-peg">
      <h2 id="h-peg">
        <CircleAlert size={20} aria-hidden="true" /> Pegadinhas de prova
      </h2>
      <ul>
        {m.pegadinhas.map((pg, i) => (
          <li key={i}>
            <RichText texto={pg.texto} />
            <Fontes fontes={[pg.fonte]} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ListaQuestoes({ m, questoes }: { m: Modulo; questoes: Questao[] }) {
  const { save } = useEstudo();
  return (
    <section aria-labelledby="h-questoes">
      <div className="lista-topo">
        <h2 id="h-questoes">{questoes.length} questões</h2>
        <a className="btn btn-primario" href={link(`/treino/${m.id}`)}>
          Treinar todas
        </a>
      </div>
      <ol className="lista-questoes">
        {questoes.map((q, i) => {
          const r = save.registros[q.id];
          const noCaderno = Boolean(save.caderno[q.id]);
          const estado = !r ? 'nova' : r.acertos > 0 && !noCaderno ? 'certa' : 'errada';
          return (
            <li key={q.id}>
              <a href={link(`/treino/${m.id}/${q.id}`)} className={`item-questao item-${estado}`}>
                <span className="item-num">{i + 1}</span>
                <span className="item-texto">
                  <RichText texto={resumoEnunciado(q)} />
                  <span className="item-meta">
                    {q.tipo === 'mc' ? 'Fechada' : 'Aberta-fechada'}, nível {q.nivel}
                    {noCaderno ? ', no caderno de erros' : ''}
                  </span>
                </span>
                <span className="item-estado" aria-label={estado === 'certa' ? 'acertada' : estado === 'errada' ? 'errada' : 'não feita'}>
                  {estado === 'certa' ? <Check size={16} /> : estado === 'errada' ? <NotebookPen size={16} /> : <ChevronRight size={16} />}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function ModuloScreen({ id, aba }: { id: ModuloId; aba?: string }) {
  const m = modulo(id)!;
  const { save } = useEstudo();
  const questoes = questoesDoModulo(id);
  const d = dominio(save, questoes);
  const erradas = questoes.filter((q) => save.caderno[q.id]).length;
  const atual: AbaId = ABAS.some((a) => a.id === aba) ? (aba as AbaId) : 'resumo';

  return (
    <div className="modulo">
      <a href={link('/')} className="voltar">
        <ArrowLeft size={16} aria-hidden="true" /> Início
      </a>
      <header className="modulo-topo">
        <p className="modulo-num">Módulo {m.ordem} de 7</p>
        <h1>{m.titulo}</h1>
        <p className="modulo-desc">{m.descricao}</p>
        <p className="modulo-peso">
          <span className={`selo selo-${m.prioridade}`}>{PRIORIDADE[m.prioridade]}</span> {m.peso}
        </p>
        <div className="modulo-progresso">
          <div className="barra barra-grande" role="progressbar" aria-valuemin={0} aria-valuemax={d.total} aria-valuenow={d.acertadas} aria-label="Questões acertadas">
            <span className="barra-cheia" style={{ width: `${Math.round(d.fracao * 100)}%` }} />
          </div>
          <span>
            {d.acertadas} de {d.total} questões acertadas
          </span>
        </div>
        <div className="acoes">
          <a className="btn btn-primario" href={link(`/treino/${id}`)}>
            Treinar questões
          </a>
          {erradas > 0 && (
            <a className="btn" href={link(`/treino/caderno-${id}`)}>
              Refazer as {erradas} erradas
            </a>
          )}
        </div>
      </header>

      <nav className="abas" aria-label="Partes do módulo">
        {ABAS.map((a) => (
          <a key={a.id} href={link(`/modulo/${id}/${a.id}`)} aria-current={a.id === atual ? 'page' : undefined}>
            {a.rotulo}
            {a.id === 'questoes' && <span className="aba-n">{questoes.length}</span>}
          </a>
        ))}
      </nav>

      <div className="modulo-corpo">
        {atual === 'resumo' && <Resumo m={m} />}
        {atual === 'formulas' && <Formulas m={m} />}
        {atual === 'exemplo' && <Exemplo m={m} />}
        {atual === 'pegadinhas' && <Pegadinhas m={m} />}
        {atual === 'questoes' && <ListaQuestoes m={m} questoes={questoes} />}
      </div>

      {atual !== 'questoes' && (
        <nav className="proxima-aba" aria-label="Próxima parte">
          {(() => {
            const i = ABAS.findIndex((a) => a.id === atual);
            const prox = ABAS[i + 1];
            return prox ? (
              <a className="btn" href={link(`/modulo/${id}/${prox.id}`)}>
                Seguir para {prox.rotulo.toLowerCase()}
                <ChevronRight size={16} aria-hidden="true" />
              </a>
            ) : null;
          })()}
        </nav>
      )}
    </div>
  );
}
