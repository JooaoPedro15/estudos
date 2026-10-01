import { Check, ChevronLeft, ChevronRight, CircleAlert, Clock, Flag, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

import { link } from '../app/router';
import { PONTOS_TOTAIS, PONTOS_VALIDOS, PROVA_2025, type QuestaoProva } from '../content/simulado2025';
import { Blocos, Fontes } from '../components/Blocos';
import { LETRAS } from '../components/QuestionCard';
import { RichText } from '../components/RichText';
import { fmt } from '../engine/calc';
import { useEstudo } from '../state/EstudoContext';

const LIMITES = [
  { min: 60, rotulo: '60 min' },
  { min: 90, rotulo: '90 min' },
  { min: 120, rotulo: '120 min' },
  { min: null, rotulo: 'Sem limite' },
] as const;

type Resultado = { respostas: Record<string, number>; pontos: number; duracaoMs: number };

const letra = (_q: QuestaoProva, i: number) => LETRAS[i];

function relogio(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return `${h > 0 ? `${h}:` : ''}${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

function corrigir(respostas: Record<string, number>): number {
  return PROVA_2025.filter((q) => q.status !== 'ambigua' && respostas[q.id] === q.correta).reduce((acc, q) => acc + q.pontos, 0);
}

function Inicio({ onIniciar }: { onIniciar: (limite: number | null) => void }) {
  const { save } = useEstudo();
  const [limite, setLimite] = useState<number | null>(90);
  const nome = useId();
  return (
    <section className="simulado-inicio">
      <header className="pagina-topo">
        <h1>Simulado: primeira prova de 2025</h1>
        <p>As 13 questões da prova de 31/03/2025 (26 pontos), na ordem original. Você só vê a correção depois de entregar.</p>
      </header>
      <ul className="lista regras">
        <li>Q1 a Q11 valem 1,5 ponto; Q12 vale 5,5 e Q13 vale 4. Na prova, Q7, Q12 e Q13 exigem os cálculos: faça no papel.</li>
        <li>
          A Q9 é ambígua (na leitura estrita, nenhuma alternativa bate) e não entra na nota: o máximo aqui é {fmt(PONTOS_VALIDOS, 1)} de {PONTOS_TOTAIS}. A Q10 usa o gabarito provável (C).
        </li>
        <li>Questões erradas ou em branco vão para o caderno de erros.</li>
      </ul>
      <fieldset className="limite">
        <legend>Tempo (a duração real da prova não está no material)</legend>
        {LIMITES.map((l) => (
          <label key={l.rotulo} className={`chip ${limite === l.min ? 'chip-ativo' : ''}`}>
            <input type="radio" name={nome} checked={limite === l.min} onChange={() => setLimite(l.min)} />
            {l.rotulo}
          </label>
        ))}
      </fieldset>
      <div className="acoes">
        <button type="button" className="btn btn-primario" onClick={() => onIniciar(limite)}>
          Começar o simulado
        </button>
        {save.simulado.melhor !== null && (
          <span className="dica-teclado">
            Melhor resultado: {fmt(save.simulado.melhor * 100, 0)}% em {save.simulado.feitos} {save.simulado.feitos === 1 ? 'tentativa' : 'tentativas'}.
          </span>
        )}
      </div>
    </section>
  );
}

function Prova({ onEntregar }: { onEntregar: (r: Resultado) => void }) {
  const { save, marcarSimulado, descartarSimulado } = useEstudo();
  const em = save.simulado.emAndamento!;
  const [atual, setAtual] = useState(0);
  const [agora, setAgora] = useState(() => Date.now());
  const nome = useId();
  const q = PROVA_2025[atual];
  const decorrido = agora - em.inicio;
  const restante = em.limiteMin === null ? null : em.limiteMin * 60_000 - decorrido;
  const respondidas = PROVA_2025.filter((x) => em.respostas[x.id] !== undefined).length;

  const entregue = useRef(false);
  const entregar = () => {
    if (entregue.current) return;
    entregue.current = true;
    onEntregar({ respostas: em.respostas, pontos: corrigir(em.respostas), duracaoMs: Date.now() - em.inicio });
  };

  useEffect(() => {
    const t = window.setInterval(() => setAgora(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (restante !== null && restante <= 0) entregar();
  });

  const pedirEntrega = () => {
    const faltam = PROVA_2025.length - respondidas;
    if (faltam > 0 && !window.confirm(`Ainda há ${faltam} questão(ões) sem resposta. Entregar mesmo assim?`)) return;
    entregar();
  };

  return (
    <section className="simulado-prova">
      <div className="simulado-barra">
        <span className={`relogio ${restante !== null && restante < 5 * 60_000 ? 'relogio-fim' : ''}`} aria-live="off">
          <Clock size={16} aria-hidden="true" />
          {restante === null ? relogio(decorrido) : `faltam ${relogio(restante)}`}
        </span>
        <span>
          {respondidas} de {PROVA_2025.length} respondidas
        </span>
        <button type="button" className="btn btn-pequeno btn-primario" onClick={pedirEntrega}>
          <Flag size={14} aria-hidden="true" /> Entregar
        </button>
      </div>
      <nav className="mapa-questoes" aria-label="Questões do simulado">
        {PROVA_2025.map((x, i) => (
          <button
            type="button"
            key={x.id}
            className={`mapa-q ${em.respostas[x.id] !== undefined ? 'mapa-feita' : ''}`}
            aria-current={i === atual ? 'step' : undefined}
            onClick={() => setAtual(i)}
          >
            {x.numero}
          </button>
        ))}
      </nav>
      <article className="questao" aria-label={`Questão ${q.numero}`}>
        <header className="questao-topo">
          <span className="questao-rotulo">
            Questão {String(q.numero).padStart(2, '0')} ({fmt(q.pontos, 1)} {q.pontos === 1.5 ? 'ponto' : 'pontos'})
          </span>
        </header>
        <div className="questao-enunciado">
          <Blocos blocos={q.enunciado} />
        </div>
        <fieldset className="opcoes">
          <legend className="sr-only">Alternativas</legend>
          {q.opcoes.map((op, i) => (
            <label key={i} className={`opcao ${em.respostas[q.id] === i ? 'opcao-marcada' : 'opcao-neutra'}`}>
              <input type="radio" name={`${nome}-${q.id}`} checked={em.respostas[q.id] === i} onChange={() => marcarSimulado(q.id, i)} />
              <span className="opcao-letra" aria-hidden="true">
                {letra(q, i)}
              </span>
              <span className="opcao-texto">
                <RichText texto={op} />
              </span>
            </label>
          ))}
        </fieldset>
      </article>
      <div className="acoes acoes-entre">
        <button type="button" className="btn" disabled={atual === 0} onClick={() => setAtual((a) => a - 1)}>
          <ChevronLeft size={16} aria-hidden="true" /> Anterior
        </button>
        {atual < PROVA_2025.length - 1 ? (
          <button type="button" className="btn btn-primario" onClick={() => setAtual((a) => a + 1)}>
            Próxima <ChevronRight size={16} aria-hidden="true" />
          </button>
        ) : (
          <button type="button" className="btn btn-primario" onClick={pedirEntrega}>
            <Flag size={16} aria-hidden="true" /> Entregar
          </button>
        )}
      </div>
      <button
        type="button"
        className="btn-link"
        onClick={() => {
          if (window.confirm('Descartar este simulado? As respostas marcadas serão perdidas.')) descartarSimulado();
        }}
      >
        Descartar simulado
      </button>
    </section>
  );
}

function Revisao({ r, onNovo }: { r: Resultado; onNovo: () => void }) {
  const pct = r.pontos / PONTOS_VALIDOS;
  return (
    <section className="simulado-resultado">
      <header className="pagina-topo">
        <h1>
          {fmt(r.pontos, 1)} de {fmt(PONTOS_VALIDOS, 1)} pontos ({fmt(pct * 100, 0)}%)
        </h1>
        <p>
          Tempo: {relogio(r.duracaoMs)}. A Q9 ficou fora da nota (ambígua). As erradas e em branco já estão no caderno de erros.
        </p>
        <div className="acoes">
          <a className="btn btn-primario" href={link('/caderno')}>
            Ver caderno de erros
          </a>
          <button type="button" className="btn" onClick={onNovo}>
            Fazer de novo
          </button>
        </div>
      </header>
      <ol className="revisao">
        {PROVA_2025.map((q) => {
          const marcada = r.respostas[q.id];
          const certa = q.status !== 'ambigua' && marcada === q.correta;
          const classe = q.status === 'ambigua' ? 'rev-ambigua' : certa ? 'rev-certa' : 'rev-errada';
          return (
            <li key={q.id} className={`rev ${classe}`}>
              <details>
                <summary>
                  <span className="rev-num">Q{q.numero}</span>
                  <span className="rev-estado">
                    {q.status === 'ambigua' ? (
                      <>
                        <CircleAlert size={16} aria-hidden="true" /> confirmar com a professora
                      </>
                    ) : certa ? (
                      <>
                        <Check size={16} aria-hidden="true" /> certa
                      </>
                    ) : (
                      <>
                        <X size={16} aria-hidden="true" /> {marcada === undefined ? 'em branco' : `marcou ${letra(q, marcada)}`}, gabarito {letra(q, q.correta)}
                      </>
                    )}
                    {q.status === 'provavel' && <span className="selo selo-media">gabarito provável</span>}
                  </span>
                  <span className="rev-pontos">{fmt(q.pontos, 1)} pt</span>
                </summary>
                <div className="rev-corpo">
                  <Blocos blocos={q.enunciado} />
                  <ul className="rev-opcoes">
                    {q.opcoes.map((op, i) => (
                      <li key={i} className={i === q.correta ? 'rev-op-certa' : i === marcada ? 'rev-op-errada' : ''}>
                        <strong>{letra(q, i)})</strong> <RichText texto={op} />
                      </li>
                    ))}
                  </ul>
                  <h3 className="resolucao-titulo">Correção</h3>
                  <Blocos blocos={q.explicacao} />
                  <Fontes fontes={q.fontes} />
                </div>
              </details>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function Simulado() {
  const { save, iniciarSimulado, entregarSimulado, responder } = useEstudo();
  const [resultado, setResultado] = useState<Resultado | null>(null);

  if (resultado) return <Revisao r={resultado} onNovo={() => setResultado(null)} />;
  if (save.simulado.emAndamento) {
    return (
      <Prova
        onEntregar={(r) => {
          for (const q of PROVA_2025) {
            if (q.status === 'ambigua') continue;
            const marcada = r.respostas[q.id];
            responder(q.id, marcada === q.correta, marcada === undefined ? 'em branco' : letra(q, marcada));
          }
          entregarSimulado(r.pontos / PONTOS_VALIDOS);
          setResultado(r);
          window.scrollTo({ top: 0 });
        }}
      />
    );
  }
  return <Inicio onIniciar={iniciarSimulado} />;
}
