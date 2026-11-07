import type { ReactNode } from 'react';

import type { ModuloId } from '../content/types';

/* Desenho pequeno de cada módulo, mostrado no topo do cartão da página
   inicial e no topo da página do módulo. Azul = sim, laranja = não. */

const ARTE: Record<ModuloId, ReactNode> = {
  intro: (
    <>
      <ellipse cx={60} cy={40} rx={50} ry={30} className="am-anel" />
      <ellipse cx={60} cy={44} rx={32} ry={20} className="am-anel b" />
      <ellipse cx={60} cy={48} rx={15} ry={10} className="am-cheio" />
      <text x={60} y={14} className="am-t" textAnchor="middle">IA</text>
      <text x={60} y={30} className="am-t p" textAnchor="middle">AM</text>
      <text x={60} y={51} className="am-t p inv" textAnchor="middle">KDD</text>
    </>
  ),
  preproc: (
    <>
      {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => (
        <rect key={`${r}${c}`} x={10 + c * 18} y={10 + r * 15} width={16} height={13} rx={2} className={r === 1 && c === 2 ? 'am-cel falta' : 'am-cel'} />
      )))}
      <text x={45} y={27} className="am-t p" textAnchor="middle">?</text>
      <path d="M70 40h14" className="am-seta" markerEnd="url(#am-ponta)" />
      {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => (
        <rect key={`b${r}${c}`} x={90 + c * 9} y={10 + r * 15} width={8} height={13} rx={1.5} className="am-cel ok" />
      )))}
    </>
  ),
  arvore: (
    <>
      <path d="M60 22 L32 44 M60 22 L88 44 M32 44 L18 66 M32 44 L46 66" className="am-linha" />
      <rect x={44} y={10} width={32} height={14} rx={3} className="am-no" />
      <rect x={18} y={38} width={28} height={13} rx={3} className="am-no nao" />
      <rect x={74} y={38} width={28} height={13} rx={3} className="am-no sim" />
      <rect x={6} y={60} width={24} height={12} rx={3} className="am-no sim" />
      <rect x={34} y={60} width={24} height={12} rx={3} className="am-no nao forte" />
    </>
  ),
  ensemble: (
    <>
      {[20, 60, 100].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 14 L${x - 10} 32 M${x} 14 L${x + 10} 32`} className="am-linha" />
          <circle cx={x} cy={14} r={5} className="am-ponto" />
          <circle cx={x - 10} cy={32} r={4} className={i === 1 ? 'am-ponto nao' : 'am-ponto sim'} />
          <circle cx={x + 10} cy={32} r={4} className="am-ponto sim" />
          <path d={`M${x} 40 L60 58`} className="am-linha fina" />
        </g>
      ))}
      <rect x={42} y={58} width={36} height={14} rx={7} className="am-no sim forte" />
      <text x={60} y={66} className="am-t p inv" textAnchor="middle" dominantBaseline="central">voto</text>
    </>
  ),
  assoc: (
    <>
      <rect x={8} y={24} width={34} height={30} rx={6} className="am-no sim" />
      <text x={25} y={39} className="am-t p" textAnchor="middle" dominantBaseline="central">pão</text>
      <path d="M46 39h26" className="am-seta" markerEnd="url(#am-ponta)" />
      <rect x={78} y={24} width={34} height={30} rx={6} className="am-no nao" />
      <text x={95} y={39} className="am-t p" textAnchor="middle" dominantBaseline="central">leite</text>
      <text x={60} y={68} className="am-t m" textAnchor="middle">conf = 0.8</text>
    </>
  ),
  bayes: (
    <>
      <rect x={10} y={56} width={100} height={6} rx={3} className="am-trilho" />
      <rect x={10} y={56} width={72} height={6} rx={3} className="am-barra sim" />
      <rect x={14} y={20} width={22} height={30} rx={3} className="am-no sim" />
      <rect x={42} y={30} width={22} height={20} rx={3} className="am-no nao" />
      <rect x={70} y={12} width={22} height={38} rx={3} className="am-no sim forte" />
      <text x={102} y={20} className="am-t" textAnchor="middle">P</text>
      <text x={60} y={74} className="am-t m" textAnchor="middle">P(c|x) ∝ P(c)·ΠP(xᵢ|c)</text>
    </>
  ),
  codigos: (
    <>
      <rect x={8} y={8} width={104} height={64} rx={6} className="am-tela" />
      <circle cx={17} cy={16} r={2.4} className="am-ponto nao" /><circle cx={25} cy={16} r={2.4} className="am-ponto" /><circle cx={33} cy={16} r={2.4} className="am-ponto sim" />
      <text x={16} y={34} className="am-cod">clf.fit(X, y)</text>
      <text x={16} y={48} className="am-cod b">clf.predict(X)</text>
      <rect x={16} y={56} width={30} height={5} rx={2.5} className="am-barra sim" />
    </>
  ),
};

export function ArteModulo({ id, className }: { id: ModuloId; className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={`arte-modulo ${className ?? ''}`} aria-hidden="true">
      <defs>
        <marker id="am-ponta" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0L8 4L0 8z" className="am-ponta" />
        </marker>
      </defs>
      {ARTE[id]}
    </svg>
  );
}
