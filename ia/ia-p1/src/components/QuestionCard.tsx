import { Check, X, NotebookPen, BookCheck } from 'lucide-react';
import { useEffect, useId, useMemo, useState } from 'react';

import type { Campo, QuestaoMC, QuestaoNum, Questao } from '../content/types';
import { dentroDaTolerancia, fmt, lerNumero } from '../engine/calc';
import { useEstudo } from '../state/EstudoContext';
import { Blocos, Fontes } from './Blocos';
import { MeEnsine } from './MeEnsine';
import { RichText } from './RichText';

export const LETRAS = ['A', 'B', 'C', 'D', 'E'];

type Props = {
  questao: Questao;
  /** chamado depois de corrigir */
  onRespondida?: (correta: boolean) => void;
  /** texto acima do enunciado (ex.: "Questão 3 de 12") */
  rotulo?: string;
};

type Retorno = { saiu: boolean; entrou: boolean };

function AvisoCaderno({ correta, retorno }: { correta: boolean; retorno: Retorno }) {
  if (correta && retorno.saiu) {
    return (
      <p className="aviso-caderno ok">
        <BookCheck size={16} aria-hidden="true" /> Saiu do caderno de erros.
      </p>
    );
  }
  if (!correta) {
    return (
      <p className="aviso-caderno">
        <NotebookPen size={16} aria-hidden="true" /> {retorno.entrou ? 'Foi para o caderno de erros.' : 'Continua no caderno de erros.'}
      </p>
    );
  }
  return null;
}

function Fechada({ questao, onRespondida }: { questao: QuestaoMC; onRespondida?: (c: boolean) => void }) {
  const { responder } = useEstudo();
  const [marcada, setMarcada] = useState<number | null>(null);
  const [corrigida, setCorrigida] = useState(false);
  const [retorno, setRetorno] = useState<Retorno>({ saiu: false, entrou: false });
  const [desistiu, setDesistiu] = useState(false);
  const nome = useId();
  const correta = !desistiu && marcada === questao.correta;

  const desistir = () => {
    if (corrigida) return;
    const r = responder(questao.id, false, 'abriu a resolução');
    setRetorno({ saiu: r.saiuDoCaderno, entrou: r.entrouNoCaderno });
    setDesistiu(true);
    setCorrigida(true);
    onRespondida?.(false);
  };

  const confirmar = () => {
    if (marcada === null || corrigida) return;
    const r = responder(questao.id, marcada === questao.correta, LETRAS[marcada]);
    setRetorno({ saiu: r.saiuDoCaderno, entrou: r.entrouNoCaderno });
    setCorrigida(true);
    onRespondida?.(marcada === questao.correta);
  };

  useEffect(() => {
    if (corrigida) return;
    const tecla = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement | null;
      if (alvo && ['INPUT', 'TEXTAREA', 'SELECT'].includes(alvo.tagName)) return;
      const i = LETRAS.indexOf(e.key.toUpperCase());
      if (i >= 0 && i < questao.opcoes.length) setMarcada(i);
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [corrigida, questao.opcoes.length]);

  return (
    <>
      <MeEnsine questaoId={questao.id} respondida={corrigida} onDesistir={desistir} />
      <fieldset className="opcoes" disabled={corrigida}>
        <legend className="sr-only">Alternativas</legend>
        {questao.opcoes.map((op, i) => {
          const estado = corrigida ? (i === questao.correta ? 'certa' : i === marcada ? 'errada' : 'neutra') : i === marcada ? 'marcada' : 'neutra';
          return (
            <label key={i} className={`opcao opcao-${estado}`}>
              <input type="radio" name={nome} checked={marcada === i} onChange={() => setMarcada(i)} />
              <span className="opcao-letra" aria-hidden="true">
                {LETRAS[i]}
              </span>
              <span className="opcao-texto">
                <RichText texto={op} />
              </span>
              {corrigida && i === questao.correta && <Check className="opcao-icone" size={18} aria-label="alternativa correta" />}
              {corrigida && i === marcada && i !== questao.correta && <X className="opcao-icone" size={18} aria-label="sua resposta" />}
            </label>
          );
        })}
      </fieldset>
      {!corrigida ? (
        <div className="acoes">
          <button type="button" className="btn btn-primario" disabled={marcada === null} onClick={confirmar}>
            Responder
          </button>
          <span className="dica-teclado">Teclas A a {LETRAS[questao.opcoes.length - 1]} marcam a alternativa.</span>
        </div>
      ) : (
        <div className={`feedback ${correta ? 'feedback-ok' : 'feedback-erro'}`} role="status">
          <p className="feedback-titulo">
            {correta ? <Check size={18} aria-hidden="true" /> : <X size={18} aria-hidden="true" />}
            {correta ? 'Certo.' : desistiu ? `Resolução aberta. Resposta certa: ${LETRAS[questao.correta]}.` : `Resposta certa: ${LETRAS[questao.correta]}.`}
          </p>
          <Blocos blocos={questao.explicacao} />
          <AvisoCaderno correta={correta} retorno={retorno} />
        </div>
      )}
    </>
  );
}

type EstadoCampo = { valor: string; lido: number | null; ok: boolean };

function avaliar(campo: Campo, valor: string): EstadoCampo {
  const lido = lerNumero(valor);
  return { valor, lido, ok: lido !== null && dentroDaTolerancia(lido, campo.resposta, campo.tolerancia ?? 0.01) };
}

function CampoInput({
  campo,
  valor,
  onChange,
  corrigido,
  estado,
  rotuloVisivel,
}: {
  campo: Campo;
  valor: string;
  onChange: (v: string) => void;
  corrigido: boolean;
  estado?: EstadoCampo;
  rotuloVisivel: boolean;
}) {
  const id = useId();
  const classe = corrigido ? (estado?.ok ? 'campo-ok' : 'campo-erro') : '';
  return (
    <div className={`campo ${classe}`}>
      <label htmlFor={id} className={rotuloVisivel ? 'campo-rotulo' : 'sr-only'}>
        {campo.rotulo}
      </label>
      <div className="campo-linha">
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          value={valor}
          disabled={corrigido}
          placeholder="0,00"
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={corrigido && !estado?.ok}
        />
        {corrigido && (estado?.ok ? <Check size={16} aria-label="certo" /> : <X size={16} aria-label="errado" />)}
      </div>
      {corrigido && !estado?.ok && (
        <p className="campo-porque">
          Esperado {fmt(campo.resposta, 4)}
          {estado?.lido === null && estado.valor.trim() !== '' ? ' (não entendi o número digitado)' : ''}. <RichText texto={campo.porque} />
        </p>
      )}
    </div>
  );
}

function Aberta({ questao, onRespondida }: { questao: QuestaoNum; onRespondida?: (c: boolean) => void }) {
  const { responder } = useEstudo();
  const [valores, setValores] = useState<Record<string, string>>({});
  const [estados, setEstados] = useState<Record<string, EstadoCampo> | null>(null);
  const [retorno, setRetorno] = useState<Retorno>({ saiu: false, entrou: false });
  const [desistiu, setDesistiu] = useState(false);
  const campos = useMemo(() => new Map(questao.campos.map((c) => [c.id, c])), [questao]);
  const corrigido = estados !== null;
  const preenchidos = questao.campos.filter((c) => (valores[c.id] ?? '').trim() !== '').length;
  const acertos = estados ? Object.values(estados).filter((e) => e.ok).length : 0;
  const tudoCerto = !desistiu && estados !== null && acertos === questao.campos.length;

  const corrigir = () => {
    const novos: Record<string, EstadoCampo> = {};
    for (const c of questao.campos) novos[c.id] = avaliar(c, valores[c.id] ?? '');
    const certo = Object.values(novos).every((e) => e.ok);
    const r = responder(questao.id, certo, questao.campos.map((c) => valores[c.id] ?? '').join(' | '));
    setRetorno({ saiu: r.saiuDoCaderno, entrou: r.entrouNoCaderno });
    setEstados(novos);
    onRespondida?.(certo);
  };

  const desistir = () => {
    if (corrigido) return;
    const novos: Record<string, EstadoCampo> = {};
    for (const c of questao.campos) novos[c.id] = avaliar(c, valores[c.id] ?? '');
    const r = responder(questao.id, false, 'abriu a resolução');
    setRetorno({ saiu: r.saiuDoCaderno, entrou: r.entrouNoCaderno });
    setDesistiu(true);
    setEstados(novos);
    onRespondida?.(false);
  };

  const input = (id: string, rotuloVisivel: boolean) => {
    const campo = campos.get(id)!;
    return (
      <CampoInput
        campo={campo}
        valor={valores[id] ?? ''}
        onChange={(v) => setValores((atual) => ({ ...atual, [id]: v }))}
        corrigido={corrigido}
        estado={estados?.[id]}
        rotuloVisivel={rotuloVisivel}
      />
    );
  };

  return (
    <>
      <MeEnsine questaoId={questao.id} respondida={corrigido} onDesistir={desistir} />
      <form
        className="aberta"
        onSubmit={(e) => {
          e.preventDefault();
          if (!corrigido) corrigir();
        }}
      >
        {questao.tabela ? (
          <div className="tabela-rolagem">
            <table className="tabela-campos">
              <thead>
                <tr>
                  {questao.tabela.cabecalho.map((c, i) => (
                    <th key={i} scope="col">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {questao.tabela.linhas.map((linha, i) => (
                  <tr key={i}>
                    {linha.map((cel, j) =>
                      typeof cel === 'string' ? (
                        <th key={j} scope="row">
                          <RichText texto={cel} />
                        </th>
                      ) : (
                        <td key={j}>{input(cel.campo, false)}</td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="campos">{questao.campos.map((c) => <div key={c.id}>{input(c.id, true)}</div>)}</div>
        )}
        {!corrigido && (
          <div className="acoes">
            <button type="submit" className="btn btn-primario" disabled={preenchidos === 0}>
              Corrigir
            </button>
            <span className="dica-teclado">Aceita 0,17, 0.17, 10/60 ou 17%. Tolerância de ±0,01.</span>
          </div>
        )}
      </form>
      {corrigido && (
        <div className={`feedback ${tudoCerto ? 'feedback-ok' : 'feedback-erro'}`} role="status">
          <p className="feedback-titulo">
            {tudoCerto ? <Check size={18} aria-hidden="true" /> : <X size={18} aria-hidden="true" />}
            {tudoCerto
              ? 'Todos os campos certos.'
              : desistiu
                ? 'Resolução aberta. Os valores esperados estão em cada campo acima.'
                : `${acertos} de ${questao.campos.length} campos certos. Os errados estão marcados acima, com o porquê.`}
          </p>
          <h4 className="resolucao-titulo">Resolução passo a passo</h4>
          <Blocos blocos={questao.resolucao} />
          <AvisoCaderno correta={tudoCerto} retorno={retorno} />
        </div>
      )}
    </>
  );
}

export function QuestionCard({ questao, onRespondida, rotulo }: Props) {
  return (
    <article className="questao" aria-label={rotulo ?? 'Questão'}>
      <header className="questao-topo">
        {rotulo && <span className="questao-rotulo">{rotulo}</span>}
        <span className="questao-tipo">{questao.tipo === 'mc' ? 'Fechada' : 'Aberta-fechada: complete os valores'}</span>
      </header>
      <div className="questao-enunciado">
        <Blocos blocos={questao.enunciado} />
      </div>
      {questao.tipo === 'mc' ? <Fechada questao={questao} onRespondida={onRespondida} /> : <Aberta questao={questao} onRespondida={onRespondida} />}
      <Fontes fontes={questao.fontes} />
    </article>
  );
}
