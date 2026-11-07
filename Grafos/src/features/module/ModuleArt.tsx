import type { ReactNode } from 'react';
import clsx from 'clsx';

/* Desenhos pequenos que ilustram cada módulo (capas dos cards). Cada um
   mostra o conceito central do módulo, não um ícone genérico. */

type P = [number, number];
const V = ({ p, c, r = 7 }: { p: P; c?: string; r?: number }) => <circle cx={p[0]} cy={p[1]} r={r} className={clsx('ma-v', c)} />;
const E = ({ a, b, c }: { a: P; b: P; c?: string }) => <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className={clsx('ma-e', c)} />;
const T = ({ p, children, c }: { p: P; children: ReactNode; c?: string }) => (
  <text x={p[0]} y={p[1]} className={clsx('ma-t', c)} textAnchor="middle" dominantBaseline="central">{children}</text>
);

const ART: Record<string, ReactNode> = {
  fundamentos: (
    <>
      <E a={[24, 60]} b={[60, 20]} /><E a={[60, 20]} b={[96, 60]} /><E a={[24, 60]} b={[96, 60]} /><E a={[60, 20]} b={[60, 46]} c="hot" />
      <V p={[24, 60]} /><V p={[96, 60]} /><V p={[60, 46]} r={5} /><V p={[60, 20]} c="hot" />
      <T p={[60, 6]} c="small">grau 3</T>
    </>
  ),
  representacoes: (
    <>
      <E a={[16, 26]} b={[40, 14]} /><E a={[40, 14]} b={[40, 46]} /><E a={[16, 26]} b={[40, 46]} />
      <V p={[16, 26]} r={5} /><V p={[40, 14]} r={5} /><V p={[40, 46]} r={5} c="acc" />
      {[0, 1, 2].map((r) => [0, 1, 2].map((c) => (
        <g key={`${r}${c}`}>
          <rect x={58 + c * 18} y={10 + r * 18} width={16} height={16} rx={2} className={clsx('ma-cell', r !== c && 'on', r === 2 && c === 0 && 'acc')} />
          <T p={[66 + c * 18, 18 + r * 18]} c={clsx('small', r !== c && 'inv')}>{r === c ? 0 : 1}</T>
        </g>
      )))}
      <T p={[60, 72]} c="small">matriz de adjacência</T>
    </>
  ),
  'isomorfismo-propriedades': (
    <>
      <E a={[14, 18]} b={[44, 18]} /><E a={[44, 18]} b={[44, 52]} /><E a={[44, 52]} b={[14, 52]} /><E a={[14, 52]} b={[14, 18]} />
      <V p={[14, 18]} c="ok" /><V p={[44, 18]} c="acc" /><V p={[44, 52]} c="hot" /><V p={[14, 52]} />
      <T p={[60, 36]} c="big">≅</T>
      <E a={[76, 18]} b={[106, 52]} /><E a={[106, 52]} b={[106, 18]} /><E a={[106, 18]} b={[76, 52]} /><E a={[76, 52]} b={[76, 18]} />
      <V p={[76, 18]} c="ok" /><V p={[106, 52]} c="acc" /><V p={[106, 18]} c="hot" /><V p={[76, 52]} />
    </>
  ),
  'busca-alcancabilidade': (
    <>
      <E a={[60, 12]} b={[30, 38]} c="tree" /><E a={[60, 12]} b={[90, 38]} c="tree" /><E a={[30, 38]} b={[16, 64]} c="tree" /><E a={[30, 38]} b={[44, 64]} /><E a={[90, 38]} b={[104, 64]} /><E a={[44, 64]} b={[90, 38]} c="dash" />
      <V p={[60, 12]} c="ok" /><V p={[30, 38]} c="ok" /><V p={[90, 38]} c="ok" /><V p={[16, 64]} c="hot" /><V p={[44, 64]} /><V p={[104, 64]} />
    </>
  ),
  'conectividade-caminhos': (
    <>
      <ellipse cx={34} cy={40} rx={28} ry={26} className="ma-blob ok" />
      <ellipse cx={90} cy={40} rx={24} ry={22} className="ma-blob acc" />
      <E a={[22, 28]} b={[46, 28]} /><E a={[46, 28]} b={[34, 54]} /><E a={[34, 54]} b={[22, 28]} /><E a={[46, 28]} b={[80, 32]} c="hot" /><E a={[80, 32]} b={[98, 50]} />
      <V p={[22, 28]} r={5} /><V p={[46, 28]} r={5} /><V p={[34, 54]} r={5} /><V p={[80, 32]} r={5} /><V p={[98, 50]} r={5} />
    </>
  ),
  'logica-conjuntos': (
    <>
      <circle cx={46} cy={40} r={24} className="ma-blob acc" /><circle cx={74} cy={40} r={24} className="ma-blob hot" />
      <T p={[60, 40]} c="big">∩</T>
      <T p={[30, 40]}>A</T><T p={[90, 40]}>B</T>
    </>
  ),
  'p2-inducao': (
    <>
      {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={14 + k * 20} y={60 - k * 11} width={16} height={8 + k * 11} rx={2} className={clsx('ma-cell on', k === 4 && 'hot')} />)}
      <T p={[26, 14]} c="small">n → n+1</T>
    </>
  ),
  'p2-euler-hamilton': (
    <>
      <path d="M20 58 L40 18 L60 58 L80 18 L100 58 Z" className="ma-trail" />
      <E a={[20, 58]} b={[40, 18]} /><E a={[40, 18]} b={[60, 58]} /><E a={[60, 58]} b={[80, 18]} /><E a={[80, 18]} b={[100, 58]} /><E a={[20, 58]} b={[100, 58]} />
      <V p={[20, 58]} c="hot" /><V p={[40, 18]} /><V p={[60, 58]} /><V p={[80, 18]} /><V p={[100, 58]} />
    </>
  ),
  'p2-arvores-agm': (
    <>
      <E a={[16, 20]} b={[60, 14]} c="dash" /><E a={[16, 20]} b={[30, 58]} c="tree" /><E a={[30, 58]} b={[60, 14]} c="tree" /><E a={[60, 14]} b={[96, 26]} c="tree" /><E a={[30, 58]} b={[80, 62]} c="tree" /><E a={[80, 62]} b={[96, 26]} c="dash" />
      <T p={[18, 40]} c="small">2</T><T p={[50, 40]} c="small">1</T><T p={[78, 12]} c="small">3</T><T p={[56, 70]} c="small">2</T>
      <V p={[16, 20]} c="ok" /><V p={[60, 14]} c="ok" /><V p={[30, 58]} c="ok" /><V p={[96, 26]} c="ok" /><V p={[80, 62]} c="ok" />
    </>
  ),
  'p2-caminhos-minimos': (
    <>
      <E a={[14, 40]} b={[44, 14]} c="tree" /><E a={[44, 14]} b={[78, 30]} c="tree" /><E a={[78, 30]} b={[106, 58]} c="tree" /><E a={[14, 40]} b={[50, 62]} /><E a={[50, 62]} b={[106, 58]} />
      <V p={[14, 40]} c="ok" /><V p={[44, 14]} c="ok" /><V p={[78, 30]} c="ok" /><V p={[106, 58]} c="hot" /><V p={[50, 62]} />
      <T p={[14, 62]} c="small">0</T><T p={[106, 76]} c="small hotT">d=7</T>
    </>
  ),
  'p2-conectividade': (
    <>
      <defs>
        <marker id="ma-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L8 4L0 8z" className="ma-head" /></marker>
      </defs>
      <ellipse cx={42} cy={38} rx={32} ry={28} className="ma-blob acc" />
      <path d="M22 26 L56 22" className="ma-e arr" markerEnd="url(#ma-arrow)" /><path d="M58 30 L40 54" className="ma-e arr" markerEnd="url(#ma-arrow)" /><path d="M36 54 L22 32" className="ma-e arr" markerEnd="url(#ma-arrow)" />
      <path d="M64 30 L98 44" className="ma-e arr hot" markerEnd="url(#ma-arrow)" />
      <V p={[20, 26]} r={5} /><V p={[60, 22]} r={5} /><V p={[38, 58]} r={5} /><V p={[102, 46]} r={5} c="hot" />
    </>
  ),
};

export function ModuleArt({ moduleId, className }: { moduleId: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={clsx('module-art', className)} aria-hidden="true">
      {ART[moduleId] ?? ART.fundamentos}
    </svg>
  );
}
