import { Minus, Plus } from 'lucide-react';
import { useId, useMemo, useState } from 'react';

import { link } from '../app/router';
import {
  ATRIBUTOS_CREDITO,
  ATRIBUTOS_SUCESSO,
  ATRIBUTOS_TENIS,
  BASE_CREDITO,
  BASE_SUCESSO_17,
  BASE_TENIS,
  MATRIZ_CANCER_RF,
  MATRIZ_NB_IRIS,
  MATRIZ_PROVA_Q7,
  MATRIZ_SLIDE,
  TRANSACOES_AE,
  TRANSACOES_NOTEBOOK,
  TRANSACOES_PAO_MANTEIGA,
} from '../content/dados';
import { Formula } from '../components/RichText';
import {
  aprioriItemsets,
  aprioriRegras,
  confianca,
  contarSuporte,
  entropia,
  entropiaPonderada,
  ganhoGini,
  ganhoInformacao,
  gini,
  giniPonderado,
  lift,
  metricasConfusao,
  naiveBayes,
  razaoGanho,
  splitInfo,
  suporte,
  fmt,
  fmtPct,
} from '../engine/calc';

const ABAS = [
  { id: 'entropia', rotulo: 'Entropia e ganho' },
  { id: 'matriz', rotulo: 'Matriz de confusão' },
  { id: 'associacao', rotulo: 'Suporte, confiança e lift' },
  { id: 'bayes', rotulo: 'Naive Bayes' },
] as const;

const soma = (v: number[]) => v.reduce((a, b) => a + b, 0);
const num = (s: string) => {
  const v = Number(s.replace(',', '.'));
  return Number.isFinite(v) && v >= 0 ? v : 0;
};

function Presets<T>({ itens, onEscolher }: { itens: { nome: string; valor: T }[]; onEscolher: (v: T) => void }) {
  return (
    <div className="presets" role="group" aria-label="Carregar exemplo do material">
      <span>Carregar:</span>
      {itens.map((p) => (
        <button key={p.nome} type="button" className="chip" onClick={() => onEscolher(p.valor)}>
          {p.nome}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* (a) Entropia e ganho                                               */
/* ------------------------------------------------------------------ */

type Particao = { classes: string[]; linhas: { valor: string; c: number[] }[] };

const PRESETS_ENTROPIA: { nome: string; valor: Particao }[] = [
  { nome: 'Prova 2025: Raciocínio_Lógico', valor: { classes: ['Bem', 'Mal'], linhas: [{ valor: 'Alto', c: [6, 0] }, { valor: 'Médio', c: [2, 4] }, { valor: 'Baixo', c: [0, 3] }] } },
  { nome: 'Prova 2025: Iniciativa_Projetos', valor: { classes: ['Bem', 'Mal'], linhas: [{ valor: 'Sim', c: [8, 0] }, { valor: 'Não', c: [0, 7] }] } },
  { nome: 'Restaurante: Cliente', valor: { classes: ['Sim', 'Não'], linhas: [{ valor: 'Nenhum', c: [0, 2] }, { valor: 'Alguns', c: [4, 0] }, { valor: 'Cheio', c: [2, 4] }] } },
  { nome: 'Restaurante: Tipo', valor: { classes: ['Sim', 'Não'], linhas: [{ valor: 'Francês', c: [1, 1] }, { valor: 'Italiano', c: [1, 1] }, { valor: 'Tailandês', c: [2, 2] }, { valor: 'Hambúrguer', c: [2, 2] }] } },
  { nome: 'Tênis: Aparência', valor: { classes: ['Sim', 'Não'], linhas: [{ valor: 'Sol', c: [2, 3] }, { valor: 'Nublado', c: [4, 0] }, { valor: 'Chuva', c: [3, 2] }] } },
];

const termoEntropia = (c: number[]) => {
  const n = soma(c);
  const termos = c.filter((x) => x > 0).map((x) => String.raw`\tfrac{${x}}{${n}}\log_2\tfrac{${x}}{${n}}`);
  return termos.length ? `-${termos.join(' - ')}` : '0';
};

function FerramentaEntropia() {
  const [p, setP] = useState<Particao>(PRESETS_ENTROPIA[0].valor);
  const grupos = p.linhas.map((l) => l.c);
  const total = p.classes.map((_, i) => soma(grupos.map((g) => g[i] ?? 0)));
  const n = soma(total);
  const setCelula = (li: number, ci: number, v: string) =>
    setP((x) => ({ ...x, linhas: x.linhas.map((l, i) => (i === li ? { ...l, c: l.c.map((y, j) => (j === ci ? num(v) : y)) } : l)) }));

  return (
    <div className="ferramenta">
      <p className="ferramenta-intro">Digite quantos exemplos de cada classe caem em cada valor do atributo.</p>
      <Presets itens={PRESETS_ENTROPIA} onEscolher={setP} />
      <div className="tabela-rolagem">
        <table className="tabela-entrada">
          <thead>
            <tr>
              <th scope="col">Valor do atributo</th>
              {p.classes.map((c, ci) => (
                <th key={ci} scope="col">
                  <input aria-label={`Nome da classe ${ci + 1}`} value={c} onChange={(e) => setP((x) => ({ ...x, classes: x.classes.map((y, j) => (j === ci ? e.target.value : y)) }))} />
                </th>
              ))}
              <th scope="col">Total</th>
              <th scope="col">Entropia</th>
              <th scope="col">Gini</th>
            </tr>
          </thead>
          <tbody>
            {p.linhas.map((l, li) => (
              <tr key={li}>
                <th scope="row">
                  <input aria-label={`Nome do valor ${li + 1}`} value={l.valor} onChange={(e) => setP((x) => ({ ...x, linhas: x.linhas.map((y, j) => (j === li ? { ...y, valor: e.target.value } : y)) }))} />
                </th>
                {p.classes.map((_, ci) => (
                  <td key={ci}>
                    <input inputMode="numeric" aria-label={`${l.valor}, ${p.classes[ci]}`} value={l.c[ci] ?? 0} onChange={(e) => setCelula(li, ci, e.target.value)} />
                  </td>
                ))}
                <td>{soma(l.c)}</td>
                <td>{fmt(entropia(l.c))}</td>
                <td>{fmt(gini(l.c))}</td>
              </tr>
            ))}
            <tr className="linha-total">
              <th scope="row">Classe (total)</th>
              {total.map((t, i) => (
                <td key={i}>{t}</td>
              ))}
              <td>{n}</td>
              <td>{fmt(entropia(total))}</td>
              <td>{fmt(gini(total))}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="acoes">
        <button type="button" className="btn btn-pequeno" onClick={() => setP((x) => ({ ...x, linhas: [...x.linhas, { valor: `valor ${x.linhas.length + 1}`, c: x.classes.map(() => 0) }] }))}>
          <Plus size={14} aria-hidden="true" /> Valor
        </button>
        <button type="button" className="btn btn-pequeno" disabled={p.linhas.length <= 1} onClick={() => setP((x) => ({ ...x, linhas: x.linhas.slice(0, -1) }))}>
          <Minus size={14} aria-hidden="true" /> Valor
        </button>
        <button type="button" className="btn btn-pequeno" disabled={p.classes.length >= 5} onClick={() => setP((x) => ({ classes: [...x.classes, `classe ${x.classes.length + 1}`], linhas: x.linhas.map((l) => ({ ...l, c: [...l.c, 0] })) }))}>
          <Plus size={14} aria-hidden="true" /> Classe
        </button>
        <button type="button" className="btn btn-pequeno" disabled={p.classes.length <= 2} onClick={() => setP((x) => ({ classes: x.classes.slice(0, -1), linhas: x.linhas.map((l) => ({ ...l, c: l.c.slice(0, -1) })) }))}>
          <Minus size={14} aria-hidden="true" /> Classe
        </button>
      </div>

      {n > 0 && (
        <div className="saida">
          <h3>Passo a passo (ID3)</h3>
          <Formula tex={String.raw`E(S) = ${termoEntropia(total)} = ${fmt(entropia(total))}`} />
          {p.linhas.map((l, i) => (
            <Formula key={i} tex={String.raw`E(\text{${l.valor.replace(/[{}\\$]/g, '')}}) = ${termoEntropia(l.c)} = ${fmt(entropia(l.c))}`} />
          ))}
          <Formula tex={String.raw`E(atributo) = ${p.linhas.map((l) => String.raw`\tfrac{${soma(l.c)}}{${n}}\cdot ${fmt(entropia(l.c))}`).join(' + ')} = ${fmt(entropiaPonderada(grupos))}`} />
          <dl className="resultados">
            <div>
              <dt>Ganho de informação</dt>
              <dd>{fmt(ganhoInformacao(grupos))}</dd>
            </div>
            <div>
              <dt>Split-info (C4.5)</dt>
              <dd>{fmt(splitInfo(grupos))}</dd>
            </div>
            <div>
              <dt>Gain ratio (C4.5)</dt>
              <dd>{fmt(razaoGanho(grupos))}</dd>
            </div>
            <div>
              <dt>Gini ponderado (CART)</dt>
              <dd>{fmt(giniPonderado(grupos))}</dd>
            </div>
            <div>
              <dt>Ganho Gini (CART)</dt>
              <dd>{fmt(ganhoGini(grupos))}</dd>
            </div>
          </dl>
          <p className="nota-leve">
            Com mais de dois valores, o Gini aqui é da divisão em múltiplos ramos. O CART testa divisões binárias: para comparar com o slide 64, junte valores em duas linhas (ex.: Alguns x Nenhum + Cheio).
          </p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* (b) Matriz de confusao                                             */
/* ------------------------------------------------------------------ */

type Matriz = { classes: string[]; m: number[][] };

const PRESETS_MATRIZ: { nome: string; valor: Matriz }[] = [
  { nome: 'Prova 2025, Q7', valor: { classes: ['A', 'B', 'C'], m: MATRIZ_PROVA_Q7 } },
  { nome: 'Slide de métricas', valor: { classes: ['1', '2', '3'], m: MATRIZ_SLIDE } },
  { nome: 'RF câncer (notebook)', valor: { classes: ['no-rec', 'rec'], m: MATRIZ_CANCER_RF } },
  { nome: 'Naive Bayes Iris', valor: { classes: ['setosa', 'versicolor', 'virginica'], m: MATRIZ_NB_IRIS } },
];

function redimensionar(x: Matriz, k: number): Matriz {
  const classes = Array.from({ length: k }, (_, i) => x.classes[i] ?? String.fromCharCode(65 + i));
  const m = Array.from({ length: k }, (_, i) => Array.from({ length: k }, (_, j) => x.m[i]?.[j] ?? 0));
  return { classes, m };
}

function FerramentaMatriz() {
  const [x, setX] = useState<Matriz>(PRESETS_MATRIZ[0].valor);
  const r = useMemo(() => metricasConfusao(x.m), [x]);
  const fr = (a: number, b: number) => `${a}/${b} = ${b ? fmt(a / b) : '—'}`;
  return (
    <div className="ferramenta">
      <p className="ferramenta-intro">Linhas = classe real; colunas = classe predita (como no slide e no sklearn).</p>
      <Presets itens={PRESETS_MATRIZ} onEscolher={setX} />
      <div className="acoes">
        <span>Classes:</span>
        {[2, 3, 4, 5].map((k) => (
          <button key={k} type="button" className={`chip ${x.classes.length === k ? 'chip-ativo' : ''}`} onClick={() => setX((v) => redimensionar(v, k))}>
            {k}
          </button>
        ))}
      </div>
      <div className="tabela-rolagem">
        <table className="tabela-entrada matriz">
          <thead>
            <tr>
              <th scope="col">Real \ Predito</th>
              {x.classes.map((c, j) => (
                <th key={j} scope="col">
                  <input aria-label={`Nome da classe ${j + 1}`} value={c} onChange={(e) => setX((v) => ({ ...v, classes: v.classes.map((y, i) => (i === j ? e.target.value : y)) }))} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {x.m.map((linha, i) => (
              <tr key={i}>
                <th scope="row">{x.classes[i]}</th>
                {linha.map((v, j) => (
                  <td key={j} className={i === j ? 'diag' : ''}>
                    <input
                      inputMode="numeric"
                      aria-label={`real ${x.classes[i]}, predito ${x.classes[j]}`}
                      value={v}
                      onChange={(e) => setX((s) => ({ ...s, m: s.m.map((l, a) => (a === i ? l.map((y, b) => (b === j ? num(e.target.value) : y)) : l)) }))}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="saida">
        <h3>Por classe</h3>
        <div className="tabela-rolagem">
          <table>
            <thead>
              <tr>
                <th scope="col">Classe</th>
                <th scope="col">VP</th>
                <th scope="col">FN</th>
                <th scope="col">FP</th>
                <th scope="col">VN</th>
                <th scope="col">TVP (recall)</th>
                <th scope="col">TFN</th>
                <th scope="col">TFP</th>
                <th scope="col">TVN</th>
                <th scope="col">Precisão</th>
                <th scope="col">F1</th>
              </tr>
            </thead>
            <tbody>
              {r.classes.map((c, i) => (
                <tr key={i}>
                  <th scope="row">{x.classes[i]}</th>
                  <td>{c.vp}</td>
                  <td>{c.fn}</td>
                  <td>{c.fp}</td>
                  <td>{c.vn}</td>
                  <td>{fr(c.vp, c.reais)}</td>
                  <td>{fr(c.fn, c.reais)}</td>
                  <td>{fr(c.fp, c.outras)}</td>
                  <td>{fr(c.vn, c.outras)}</td>
                  <td>{fr(c.vp, c.vp + c.fp)}</td>
                  <td>{fmt(c.f1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          <strong>Acurácia:</strong> {fmt(r.acuracia)} ({fmtPct(r.acuracia)}) com {r.total} instâncias.
        </p>
        <p className="nota-leve">TVP e TFN usam a linha (total real da classe). TFP e TVN usam o total das outras classes. Precisão usa a coluna.</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* (c) Suporte, confianca e lift                                      */
/* ------------------------------------------------------------------ */

const paraTexto = (t: string[][]) => t.map((l) => l.join(', ')).join('\n');
const PRESETS_ASSOC = [
  { nome: 'Pão e Manteiga (CSV)', valor: paraTexto(TRANSACOES_PAO_MANTEIGA) },
  { nome: 'Itens a a e (slide 8)', valor: paraTexto(TRANSACOES_AE) },
  { nome: 'Apriori.ipynb', valor: paraTexto(TRANSACOES_NOTEBOOK) },
];

function Chips({ itens, marcados, onToggle, rotulo }: { itens: string[]; marcados: string[]; onToggle: (i: string) => void; rotulo: string }) {
  return (
    <div className="chips" role="group" aria-label={rotulo}>
      <span>{rotulo}:</span>
      {itens.map((i) => (
        <button key={i} type="button" className={`chip ${marcados.includes(i) ? 'chip-ativo' : ''}`} aria-pressed={marcados.includes(i)} onClick={() => onToggle(i)}>
          {i}
        </button>
      ))}
    </div>
  );
}

function FerramentaAssociacao() {
  const [texto, setTexto] = useState(PRESETS_ASSOC[0].valor);
  const [a, setA] = useState<string[]>(['Café']);
  const [b, setB] = useState<string[]>(['Pão']);
  const [minSup, setMinSup] = useState('0,3');
  const [minConf, setMinConf] = useState('0,8');
  const idArea = useId();
  const transacoes = useMemo(
    () =>
      texto
        .split('\n')
        .map((l) => l.split(/[,;\t]/).map((s) => s.trim()).filter(Boolean))
        .filter((l) => l.length > 0)
        .map((l) => new Set(l)),
    [texto],
  );
  const itens = useMemo(() => [...new Set(transacoes.flatMap((t) => [...t]))], [transacoes]);
  const N = transacoes.length;
  const toggle = (lista: string[], set: (v: string[]) => void, outro: string[], setOutro: (v: string[]) => void) => (i: string) => {
    set(lista.includes(i) ? lista.filter((x) => x !== i) : [...lista, i]);
    if (outro.includes(i)) setOutro(outro.filter((x) => x !== i));
  };
  const niveis = useMemo(() => aprioriItemsets(transacoes, num(minSup)), [transacoes, minSup]);
  const regras = useMemo(() => aprioriRegras(transacoes, niveis, num(minConf)).sort((x, y) => y.lift - x.lift || y.confianca - x.confianca), [transacoes, niveis, minConf]);
  const nAB = contarSuporte(transacoes, [...a, ...b]);
  const nA = contarSuporte(transacoes, a);
  const nB = contarSuporte(transacoes, b);
  const valida = a.length > 0 && b.length > 0;

  return (
    <div className="ferramenta">
      <label htmlFor={idArea} className="ferramenta-intro">
        Uma transação por linha, itens separados por vírgula.
      </label>
      <Presets itens={PRESETS_ASSOC} onEscolher={(v) => setTexto(v)} />
      <textarea id={idArea} className="area" rows={6} value={texto} onChange={(e) => setTexto(e.target.value)} spellCheck={false} />
      <p className="nota-leve">{N} transações, {itens.length} itens.</p>

      <h3>Uma regra A → B</h3>
      <Chips itens={itens} marcados={a} rotulo="A (antecedente)" onToggle={toggle(a, setA, b, setB)} />
      <Chips itens={itens} marcados={b} rotulo="B (consequente)" onToggle={toggle(b, setB, a, setA)} />
      {valida && N > 0 && (
        <div className="saida">
          <Formula tex={String.raw`\text{suporte} = \tfrac{${nAB}}{${N}} = ${fmt(suporte(transacoes, [...a, ...b]))}`} />
          <Formula tex={String.raw`\text{confiança} = \tfrac{\text{sup}(A \cup B)}{\text{sup}(A)} = \tfrac{${nAB}}{${nA}} = ${nA ? fmt(confianca(transacoes, a, b)) : '—'}`} />
          <Formula tex={String.raw`\text{lift} = \tfrac{\text{confiança}}{\text{sup}(B)} = \tfrac{${nA ? fmt(confianca(transacoes, a, b)) : 0}}{${nB}/${N}} = ${nB && nA ? fmt(lift(transacoes, a, b)) : '—'}`} />
          {nA > 0 && nB > 0 && <p>{lift(transacoes, a, b) > 1 + 1e-9 ? 'Lift acima de 1: aparecem juntos mais que o esperado.' : lift(transacoes, a, b) < 1 - 1e-9 ? 'Lift abaixo de 1: aparecem juntos menos que o esperado.' : 'Lift igual a 1: independentes.'}</p>}
        </div>
      )}

      <h3>Apriori</h3>
      <div className="acoes">
        <label className="campo-inline">
          suporte mínimo <input inputMode="decimal" value={minSup} onChange={(e) => setMinSup(e.target.value)} />
        </label>
        <label className="campo-inline">
          confiança mínima <input inputMode="decimal" value={minConf} onChange={(e) => setMinConf(e.target.value)} />
        </label>
      </div>
      <div className="saida">
        {niveis.map((nivel, k) => (
          <p key={k}>
            <strong>{k + 1} {k === 0 ? 'item' : 'itens'}:</strong> {nivel.map((i) => `{${i.itens.join(', ')}} ${i.contagem}/${N}`).join('; ')}
          </p>
        ))}
        {niveis.length === 0 && <p>Nenhum itemset atinge o suporte mínimo.</p>}
        {regras.length > 0 && (
          <div className="tabela-rolagem">
            <table>
              <thead>
                <tr>
                  <th scope="col">Regra</th>
                  <th scope="col">Suporte</th>
                  <th scope="col">Confiança</th>
                  <th scope="col">Lift</th>
                </tr>
              </thead>
              <tbody>
                {regras.map((r, i) => (
                  <tr key={i}>
                    <th scope="row">
                      {r.antecedente.join(' e ')} → {r.consequente.join(' e ')}
                    </th>
                    <td>{fmt(r.suporte)}</td>
                    <td>{fmt(r.confianca)}</td>
                    <td>{fmt(r.lift)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* (d) Naive Bayes                                                    */
/* ------------------------------------------------------------------ */

const paraCsv = (cab: string[], linhas: string[][]) => [cab.join(';'), ...linhas.map((l) => l.join(';'))].join('\n');
const PRESETS_BAYES = [
  { nome: 'Prova 2025, Q13 (17 alunos)', valor: { csv: paraCsv([...ATRIBUTOS_SUCESSO, 'Sucesso'], BASE_SUCESSO_17), registro: ['Médio', 'Moderado', 'Sim'] } },
  { nome: 'Jogar tênis', valor: { csv: paraCsv([...ATRIBUTOS_TENIS, 'Jogar'], BASE_TENIS), registro: ['Sol', 'Fria', 'Normal', 'Não'] } },
  { nome: 'Risco de crédito', valor: { csv: paraCsv([...ATRIBUTOS_CREDITO, 'Risco'], BASE_CREDITO), registro: ['Boa', 'Alta', 'Nenhuma', '>35000'] } },
];

function lerCsv(texto: string): { cab: string[]; linhas: string[][] } {
  const brutas = texto.split('\n').map((l) => l.trim()).filter(Boolean);
  if (brutas.length === 0) return { cab: [], linhas: [] };
  const sep = brutas[0].includes(';') ? ';' : brutas[0].includes('\t') ? '\t' : ',';
  const partes = brutas.map((l) => l.split(sep).map((s) => s.trim()));
  const cab = partes[0];
  return { cab, linhas: partes.slice(1).filter((l) => l.length === cab.length) };
}

function FerramentaBayes() {
  const [csv, setCsv] = useState(PRESETS_BAYES[0].valor.csv);
  const [registro, setRegistro] = useState<(string | null)[]>(PRESETS_BAYES[0].valor.registro);
  const idArea = useId();
  const { cab, linhas } = useMemo(() => lerCsv(csv), [csv]);
  const atributos = cab.slice(0, -1);
  const valores = atributos.map((_, i) => [...new Set(linhas.map((l) => l[i]))]);
  const reg = atributos.map((_, i) => (registro[i] && valores[i].includes(registro[i]!) ? registro[i] : null));
  const r = useMemo(() => (linhas.length ? naiveBayes(linhas, reg) : []), [linhas, reg]);
  const somaProd = r.reduce((acc, c) => acc + c.produto, 0);
  const vencedor = r.length ? r.reduce((x, y) => (y.produto > x.produto ? y : x)) : null;

  return (
    <div className="ferramenta">
      <label htmlFor={idArea} className="ferramenta-intro">
        Base com cabeçalho (separador ; ou ,). A última coluna é a classe.
      </label>
      <Presets
        itens={PRESETS_BAYES}
        onEscolher={(v) => {
          setCsv(v.csv);
          setRegistro(v.registro);
        }}
      />
      <textarea id={idArea} className="area" rows={6} value={csv} onChange={(e) => setCsv(e.target.value)} spellCheck={false} />
      <p className="nota-leve">
        {linhas.length} instâncias, classe "{cab[cab.length - 1] ?? ''}".
      </p>
      <h3>Registro novo</h3>
      <div className="registro">
        {atributos.map((at, i) => (
          <label key={at} className="campo-inline">
            {at}
            <select value={reg[i] ?? ''} onChange={(e) => setRegistro(atributos.map((_, j) => (j === i ? e.target.value || null : reg[j])))}>
              <option value="">(ignorar)</option>
              {valores[i].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      {r.length > 0 && (
        <div className="saida">
          <h3>1. Produto por classe</h3>
          {r.map((c) => (
            <Formula
              key={c.classe}
              tex={String.raw`\text{${c.classe.replace(/[{}\\$%]/g, '')}}: \tfrac{${c.contagemClasse}}{${c.total}} ${c.termos.map((t) => String.raw`\cdot \tfrac{${t.contagem}}{${t.total}}`).join(' ')} = ${fmt(c.produto, 6)}`}
            />
          ))}
          {r.some((c) => c.termos.some((t) => t.contagem === 0)) && <p className="nota-leve">Há contagem zero: o produto daquela classe vira 0.</p>}
          <h3>2. Normalização (obrigatória)</h3>
          <Formula tex={String.raw`\text{soma} = ${r.map((c) => fmt(c.produto, 6)).join(' + ')} = ${fmt(somaProd, 6)}`} />
          <dl className="resultados">
            {r.map((c) => (
              <div key={c.classe} className={vencedor?.classe === c.classe ? 'vencedor' : ''}>
                <dt>{c.classe}</dt>
                <dd>{somaProd ? fmtPct(c.probabilidade) : '—'}</dd>
              </div>
            ))}
          </dl>
          {vencedor && somaProd > 0 && <p>Classe prevista: <strong>{vencedor.classe}</strong>.</p>}
        </div>
      )}
    </div>
  );
}

export function Ferramentas({ aba }: { aba?: string }) {
  const atual = ABAS.find((a) => a.id === aba)?.id ?? 'entropia';
  return (
    <div className="ferramentas">
      <header className="pagina-topo">
        <h1>Ferramentas</h1>
        <p>Calculadoras com os passos do jeito dos slides. Carregue um exemplo do material ou digite o seu.</p>
      </header>
      <nav className="abas" aria-label="Ferramentas">
        {ABAS.map((a) => (
          <a key={a.id} href={link(`/ferramentas/${a.id}`)} aria-current={a.id === atual ? 'page' : undefined}>
            {a.rotulo}
          </a>
        ))}
      </nav>
      {atual === 'entropia' && <FerramentaEntropia />}
      {atual === 'matriz' && <FerramentaMatriz />}
      {atual === 'associacao' && <FerramentaAssociacao />}
      {atual === 'bayes' && <FerramentaBayes />}
    </div>
  );
}
