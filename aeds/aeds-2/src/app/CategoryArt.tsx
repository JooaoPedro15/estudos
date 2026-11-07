import type { ActiveMode } from './appTypes';

/* Capa desenhada de cada categoria da tela inicial. Usa a cor da categoria
   (--cat-color) para o destaque. */

function Provas() {
  return (
    <>
      <rect x={22} y={6} width={76} height={68} rx={5} className="ca-folha" />
      <rect x={30} y={14} width={34} height={5} rx={2} className="ca-cor" />
      <text x={30} y={32} className="ca-cod">int soma(int n) {'{'}</text>
      <text x={36} y={43} className="ca-cod">return n * ...</text>
      <text x={30} y={54} className="ca-cod">{'}'}</text>
      <circle cx={86} cy={58} r={9} className="ca-cor" />
      <path d="M82 58l3 3 5-6" className="ca-check" />
    </>
  );
}

function Conceitual() {
  return (
    <>
      <text x={60} y={30} textAnchor="middle" className="ca-mat">T(n) = Θ(n log n)</text>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={14 + i * 24} y={44} width={20} height={20} rx={4} className={i === 2 ? 'ca-cor' : 'ca-opc'} />
          <text x={24 + i * 24} y={55} textAnchor="middle" dominantBaseline="central" className={i === 2 ? 'ca-letra inv' : 'ca-letra'}>{'ABCD'[i]}</text>
        </g>
      ))}
    </>
  );
}

function Desenho() {
  return (
    <>
      <path d="M60 16 L36 40 M60 16 L84 40 M36 40 L24 62 M36 40 L48 62 M84 40 L96 62" className="ca-aresta" />
      <circle cx={60} cy={16} r={9} className="ca-cor" />
      <circle cx={36} cy={40} r={8} className="ca-no" />
      <circle cx={84} cy={40} r={8} className="ca-no" />
      <circle cx={24} cy={62} r={7} className="ca-no" />
      <circle cx={48} cy={62} r={7} className="ca-no tracejado" />
      <circle cx={96} cy={62} r={7} className="ca-no" />
    </>
  );
}

function Estruturas() {
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x={8 + i * 22} y={10} width={20} height={18} rx={3} className={i === 3 ? 'ca-cor' : 'ca-opc'} />
          <text x={18 + i * 22} y={19.5} textAnchor="middle" dominantBaseline="central" className={i === 3 ? 'ca-letra inv' : 'ca-letra'}>{[12, 5, 31, 8, 20][i]}</text>
        </g>
      ))}
      <path d="M84 30 L84 42" className="ca-aresta" />
      <rect x={66} y={44} width={36} height={14} rx={7} className="ca-no" />
      <text x={84} y={51.5} textAnchor="middle" dominantBaseline="central" className="ca-letra">h(8)=3</text>
      <rect x={8} y={50} width={16} height={14} rx={3} className="ca-opc" />
      <path d="M24 57 h8" className="ca-aresta" />
      <rect x={32} y={50} width={16} height={14} rx={3} className="ca-cor fraco" />
      <path d="M48 57 h8" className="ca-aresta" />
      <text x={60} y={57} dominantBaseline="central" className="ca-letra">null</text>
    </>
  );
}

const ARTE: Partial<Record<ActiveMode, () => React.ReactElement>> = {
  exam: Provas,
  conceptual: Conceitual,
  drawing: Desenho,
  explore: Estruturas,
};

export function CategoryArt({ mode }: { mode: ActiveMode }) {
  const Arte = ARTE[mode];
  if (!Arte) return null;
  return (
    <svg viewBox="0 0 120 80" className="cat-art" aria-hidden="true">
      <Arte />
    </svg>
  );
}
