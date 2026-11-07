import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Pause, Play, Shuffle } from 'lucide-react';

import { corClasse, pureza } from './SkTree';

/* Cena da página inicial. Aba 1: um aluno de exemplo desce por uma árvore
   de decisão no formato do plot_tree (esquerda = True). O aluno pode mexer
   nos atributos e ver o caminho mudar. Aba 2: entropia e Gini de um nó
   conforme a proporção de classes. */

interface Aluno { nome: string; horas: number; faltas: number; simulado: boolean }

interface No {
  id: string;
  x: number;
  y: number;
  teste?: string;
  value: [number, number];
  gini: string;
}

const NOS: Record<string, No> = {
  raiz: { id: 'raiz', x: 300, y: 8, teste: 'horas_estudo <= 6.5', value: [16, 24], gini: '0.48' },
  esq: { id: 'esq', x: 150, y: 120, teste: 'faltas <= 4.5', value: [10, 4], gini: '0.408' },
  dir: { id: 'dir', x: 450, y: 120, teste: 'fez_simulado <= 0.5', value: [6, 20], gini: '0.355' },
  ee: { id: 'ee', x: 75, y: 236, value: [1, 4], gini: '0.32' },
  ed: { id: 'ed', x: 225, y: 236, value: [9, 0], gini: '0.0' },
  de: { id: 'de', x: 375, y: 236, value: [5, 3], gini: '0.469' },
  dd: { id: 'dd', x: 525, y: 236, value: [1, 17], gini: '0.105' },
};
const ARESTAS: [string, string][] = [['raiz', 'esq'], ['raiz', 'dir'], ['esq', 'ee'], ['esq', 'ed'], ['dir', 'de'], ['dir', 'dd']];
const CLASSES = ['reprovado', 'aprovado'];
const W = 140;

const ALUNOS: Aluno[] = [
  { nome: 'Ana', horas: 9, faltas: 1, simulado: true },
  { nome: 'Bruno', horas: 4, faltas: 7, simulado: false },
  { nome: 'Carla', horas: 5, faltas: 2, simulado: true },
  { nome: 'Davi', horas: 8, faltas: 3, simulado: false },
];

function caminho(a: Aluno): { nos: string[]; frases: string[] } {
  const frases: string[] = [];
  const nos = ['raiz'];
  const t1 = a.horas <= 6.5;
  frases.push(`horas_estudo = ${a.horas} ${t1 ? '≤' : '>'} 6.5 → ${t1 ? 'True, vai para a esquerda' : 'False, vai para a direita'}.`);
  if (t1) {
    nos.push('esq');
    const t2 = a.faltas <= 4.5;
    frases.push(`faltas = ${a.faltas} ${t2 ? '≤' : '>'} 4.5 → ${t2 ? 'True, esquerda' : 'False, direita'}.`);
    nos.push(t2 ? 'ee' : 'ed');
  } else {
    nos.push('dir');
    const s = a.simulado ? 1 : 0;
    const t2 = s <= 0.5;
    frases.push(`fez_simulado = ${s} ${t2 ? '≤' : '>'} 0.5 → ${t2 ? 'True, esquerda' : 'False, direita'}.`);
    nos.push(t2 ? 'de' : 'dd');
  }
  const folha = NOS[nos[2]];
  const { classe } = pureza(folha.value);
  frases.push(`Chegou numa folha com value = [${folha.value.join(', ')}]: a maioria é "${CLASSES[classe]}", então essa é a previsão.`);
  return { nos, frases };
}

function NoSk({ no, ativo, passou }: { no: No; ativo: boolean; passou: boolean }) {
  const { classe, alfa } = pureza(no.value);
  const linhas = [no.teste, `gini = ${no.gini}`, `samples = ${no.value[0] + no.value[1]}`, `value = [${no.value.join(', ')}]`, `class = ${CLASSES[classe]}`].filter(Boolean) as string[];
  const h = linhas.length * 13.5 + 10;
  const estilo = { '--no-cor': corClasse(classe), '--no-alfa': alfa * 0.75 } as CSSProperties;
  return (
    <g transform={`translate(${no.x - W / 2} ${no.y})`} className={`ci-no${passou ? ' passou' : ''}${ativo ? ' ativo' : ''}`} style={estilo}>
      <rect width={W} height={h} rx={6} className="ci-no-caixa" />
      <rect width={W} height={h} rx={6} className="ci-no-tinta" />
      {linhas.map((l, i) => (
        <text key={l} x={W / 2} y={17 + i * 13.5} textAnchor="middle" className={i === 0 && no.teste ? 'ci-no-teste' : 'ci-no-txt'}>{l}</text>
      ))}
    </g>
  );
}

function CenaArvore() {
  const reduzir = useRef(typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  const [idx, setIdx] = useState(0);
  const [aluno, setAluno] = useState<Aluno>(ALUNOS[0]);
  const [passo, setPasso] = useState(reduzir.current ? 3 : 0);
  const [tocando, setTocando] = useState(!reduzir.current);
  const { nos, frases } = useMemo(() => caminho(aluno), [aluno]);

  useEffect(() => {
    if (!tocando) return;
    const t = window.setTimeout(() => {
      if (passo < 3) setPasso(passo + 1);
      else {
        const n = (idx + 1) % ALUNOS.length;
        setIdx(n);
        setAluno(ALUNOS[n]);
        setPasso(0);
      }
    }, passo === 3 ? 3000 : 1500);
    return () => window.clearTimeout(t);
  }, [tocando, passo, idx]);

  const mexer = (m: Partial<Aluno>) => { setTocando(false); setAluno((a) => ({ ...a, ...m, nome: 'Você' })); setPasso(3); };
  const visivel = nos.slice(0, Math.min(passo, 2) + 1);
  const atual = nos[Math.min(passo, 2)];
  const folha = NOS[nos[2]];
  const prev = pureza(folha.value).classe;
  const pos = NOS[atual];
  const frase = passo === 0 ? `${aluno.nome} entra pela raiz. ${frases[0]}` : frases[Math.min(passo, 3)] ?? frases[2];

  return (
    <>
      <svg viewBox="0 0 600 316" className="ci-svg" role="img" aria-label={`Árvore de decisão. ${frase}`}>
        {ARESTAS.map(([a, b]) => {
          const pa = NOS[a];
          const pb = NOS[b];
          const ya = pa.y + (pa.teste ? 77.5 : 64);
          const on = visivel.includes(a) && visivel.includes(b);
          const esq = pb.x < pa.x;
          return (
            <g key={b}>
              <path d={`M${pa.x} ${ya} C${pa.x} ${ya + 18}, ${pb.x} ${pb.y - 18}, ${pb.x} ${pb.y}`} className={`ci-aresta${on ? ' on' : ''}`} />
              {a === 'raiz' && <text x={(pa.x + pb.x) / 2 + (esq ? -14 : 14)} y={ya + 18} textAnchor="middle" className="ci-rot">{esq ? 'True' : 'False'}</text>}
            </g>
          );
        })}
        {Object.values(NOS).map((n) => <NoSk key={n.id} no={n} ativo={n.id === atual} passou={visivel.includes(n.id)} />)}
        <g className="ci-token" style={{ transform: `translate(${pos.x + W / 2 - 6}px, ${pos.y - 6}px)` }}>
          <circle r={13} />
          <text textAnchor="middle" dominantBaseline="central">{aluno.nome[0]}</text>
        </g>
      </svg>
      <div className="ci-pe">
        <p className="ci-frase" aria-live="polite">{frase}</p>
        <div className="ci-aluno">
          <span className="ci-aluno-nome">{aluno.nome}</span>
          <label>horas_estudo <b>{aluno.horas}</b>
            <input type="range" min={0} max={12} value={aluno.horas} onChange={(e) => mexer({ horas: Number(e.target.value) })} />
          </label>
          <label>faltas <b>{aluno.faltas}</b>
            <input type="range" min={0} max={10} value={aluno.faltas} onChange={(e) => mexer({ faltas: Number(e.target.value) })} />
          </label>
          <button type="button" className={`ci-sim${aluno.simulado ? ' on' : ''}`} aria-pressed={aluno.simulado} onClick={() => mexer({ simulado: !aluno.simulado })}>
            fez_simulado = {aluno.simulado ? 1 : 0}
          </button>
        </div>
        <div className="ci-linha">
          <span className={`ci-prev ${prev === 1 ? 'sim' : 'nao'}`} style={{ opacity: passo >= 2 ? 1 : 0.35 }}>
            previsão: {passo >= 2 ? CLASSES[prev] : '…'}
          </span>
          <div className="ci-ctl">
            <button type="button" aria-label={tocando ? 'Pausar' : 'Tocar'} className="principal" onClick={() => { if (!tocando && passo === 3) setPasso(0); setTocando(!tocando); }}>
              {tocando ? <Pause size={15} /> : <Play size={15} />}
            </button>
            <button type="button" aria-label="Outro aluno" onClick={() => { const n = (idx + 1) % ALUNOS.length; setIdx(n); setAluno(ALUNOS[n]); setPasso(0); setTocando(true); }}>
              <Shuffle size={15} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const H = (p: number) => (p <= 0 || p >= 1 ? 0 : -p * Math.log2(p) - (1 - p) * Math.log2(1 - p));
const G = (p: number) => 1 - p * p - (1 - p) * (1 - p);

function CenaEntropia() {
  const reduzir = useRef(typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  const [sim, setSim] = useState(14);
  const [auto, setAuto] = useState(!reduzir.current);
  const dir = useRef(1);
  useEffect(() => {
    if (!auto) return;
    const t = window.setInterval(() => {
      setSim((s) => {
        if (s >= 20) dir.current = -1;
        if (s <= 0) dir.current = 1;
        return s + dir.current;
      });
    }, 700);
    return () => window.clearInterval(t);
  }, [auto]);
  const p = sim / 20;
  const pts = Array.from({ length: 51 }, (_, i) => i / 50);
  const cx = (q: number) => 330 + q * 240;
  const cy = (v: number) => 230 - v * 190;
  return (
    <>
      <svg viewBox="0 0 600 270" className="ci-svg" role="img" aria-label={`Nó com ${sim} aprovados e ${20 - sim} reprovados: entropia ${H(p).toFixed(3)}, Gini ${G(p).toFixed(3)}.`}>
        <text x={150} y={22} textAnchor="middle" className="ci-rot">samples = 20 · value = [{20 - sim}, {sim}]</text>
        {Array.from({ length: 20 }, (_, i) => {
          const r = Math.floor(i / 5);
          const c = i % 5;
          return <circle key={i} cx={70 + c * 40} cy={60 + r * 42} r={15} className={`ci-bola ${i < sim ? 'sim' : 'nao'}`} />;
        })}
        <line x1={cx(0)} y1={cy(0)} x2={cx(1)} y2={cy(0)} className="ci-eixo" />
        <line x1={cx(0)} y1={cy(0)} x2={cx(0)} y2={cy(1)} className="ci-eixo" />
        <polyline points={pts.map((q) => `${cx(q)},${cy(H(q))}`).join(' ')} className="ci-curva h" />
        <polyline points={pts.map((q) => `${cx(q)},${cy(G(q))}`).join(' ')} className="ci-curva g" />
        <line x1={cx(p)} y1={cy(0)} x2={cx(p)} y2={cy(H(p))} className="ci-guia" />
        <circle cx={cx(p)} cy={cy(H(p))} r={6} className="ci-ponto h" />
        <circle cx={cx(p)} cy={cy(G(p))} r={5} className="ci-ponto g" />
        <text x={cx(0)} y={cy(0) + 18} className="ci-rot">0</text>
        <text x={cx(1)} y={cy(0) + 18} textAnchor="end" className="ci-rot">1</text>
        <text x={cx(0.5)} y={cy(0) + 32} textAnchor="middle" className="ci-rot">proporção de aprovados</text>
        <text x={cx(0) - 8} y={cy(1) + 4} textAnchor="end" className="ci-rot">1</text>
      </svg>
      <div className="ci-pe">
        <p className="ci-frase" aria-live="polite">
          {sim === 0 || sim === 20
            ? 'Nó puro: todo mundo é da mesma classe, entropia e Gini valem 0. A árvore para de dividir aqui.'
            : sim === 10
              ? 'Meio a meio: a incerteza é máxima. Entropia = 1 e Gini = 0.5.'
              : 'Quanto mais misturado o nó, maior a impureza. A árvore escolhe o teste que mais reduz esse valor (ganho de informação).'}
        </p>
        <label className="ci-slider">
          aprovados <b>{sim}</b> de 20
          <input type="range" min={0} max={20} value={sim} onChange={(e) => { setAuto(false); setSim(Number(e.target.value)); }} />
        </label>
        <div className="ci-linha">
          <span className="ci-valores">
            <span className="h">entropia = {H(p).toFixed(3)}</span>
            <span className="g">gini = {G(p).toFixed(3)}</span>
          </span>
          <div className="ci-ctl">
            <button type="button" aria-label={auto ? 'Pausar' : 'Tocar'} className="principal" onClick={() => setAuto(!auto)}>
              {auto ? <Pause size={15} /> : <Play size={15} />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function CenaInicio() {
  const [aba, setAba] = useState<'arvore' | 'entropia'>('arvore');
  return (
    <div className="cena-inicio">
      <div className="ci-abas" role="tablist" aria-label="Cena">
        <button type="button" role="tab" aria-selected={aba === 'arvore'} onClick={() => setAba('arvore')}>Árvore de decisão</button>
        <button type="button" role="tab" aria-selected={aba === 'entropia'} onClick={() => setAba('entropia')}>Entropia e Gini</button>
      </div>
      {aba === 'arvore' ? <CenaArvore /> : <CenaEntropia />}
    </div>
  );
}
