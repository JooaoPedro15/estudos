import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, Shuffle, SkipForward } from 'lucide-react';

/* Cena da tela inicial: um vetor sendo ordenado passo a passo, com o código
   Java da aula ao lado marcando a linha atual e os contadores de
   comparações e movimentações (o que a prova costuma pedir). */

type AlgoId = 'insercao' | 'selecao' | 'bolha';

interface Passo {
  arr: number[];
  foco: number[];
  troca: boolean;
  fixos: number[];
  menor?: number;
  tmp?: { valor: number; pos: number };
  linha: number;
  frase: string;
  comp: number;
  mov: number;
}

const CODIGO: Record<AlgoId, string[]> = {
  insercao: [
    'for (int i = 1; i < n; i++) {',
    '  int tmp = array[i];',
    '  int j = i - 1;',
    '  while (j >= 0 && array[j] > tmp) {',
    '    array[j + 1] = array[j];',
    '    j--;',
    '  }',
    '  array[j + 1] = tmp;',
    '}',
  ],
  selecao: [
    'for (int i = 0; i < n - 1; i++) {',
    '  int menor = i;',
    '  for (int j = i + 1; j < n; j++) {',
    '    if (array[menor] > array[j]) {',
    '      menor = j;',
    '    }',
    '  }',
    '  swap(menor, i);',
    '}',
  ],
  bolha: [
    'for (int i = n - 1; i > 0; i--) {',
    '  for (int j = 0; j < i; j++) {',
    '    if (array[j] > array[j + 1]) {',
    '      swap(j, j + 1);',
    '    }',
    '  }',
    '}',
  ],
};

const NOMES: { id: AlgoId; rotulo: string }[] = [
  { id: 'insercao', rotulo: 'Inserção' },
  { id: 'selecao', rotulo: 'Seleção' },
  { id: 'bolha', rotulo: 'Bolha' },
];

function insercao(v: number[]): Passo[] {
  const a = [...v];
  const n = a.length;
  const P: Passo[] = [];
  let comp = 0;
  let mov = 0;
  P.push({ arr: [...a], foco: [], troca: false, fixos: [0], linha: 0, frase: 'O primeiro elemento sozinho já está ordenado.', comp, mov });
  for (let i = 1; i < n; i++) {
    const tmp = a[i];
    mov++;
    const fix = Array.from({ length: i }, (_, k) => k);
    P.push({ arr: [...a], foco: [i], troca: false, fixos: fix, tmp: { valor: tmp, pos: i }, linha: 1, frase: `Tira tmp = ${tmp} da posição ${i} para abrir espaço.`, comp, mov });
    let j = i - 1;
    while (j >= 0) {
      comp++;
      if (a[j] > tmp) {
        P.push({ arr: [...a], foco: [j], troca: false, fixos: fix, tmp: { valor: tmp, pos: j + 1 }, linha: 3, frase: `${a[j]} > ${tmp}: ${a[j]} anda uma casa para a direita.`, comp, mov });
        a[j + 1] = a[j];
        mov++;
        P.push({ arr: [...a], foco: [j + 1], troca: true, fixos: fix, tmp: { valor: tmp, pos: j }, linha: 4, frase: `array[${j + 1}] = ${a[j]}.`, comp, mov });
        j--;
      } else {
        P.push({ arr: [...a], foco: [j], troca: false, fixos: fix, tmp: { valor: tmp, pos: j + 1 }, linha: 3, frase: `${a[j]} ≤ ${tmp}: para de andar.`, comp, mov });
        break;
      }
    }
    a[j + 1] = tmp;
    mov++;
    P.push({ arr: [...a], foco: [j + 1], troca: true, fixos: Array.from({ length: i + 1 }, (_, k) => k), linha: 7, frase: `Coloca tmp = ${tmp} na posição ${j + 1}. Os ${i + 1} primeiros estão ordenados.`, comp, mov });
  }
  P.push({ arr: [...a], foco: [], troca: false, fixos: a.map((_, k) => k), linha: 8, frase: `Pronto: ${comp} comparações e ${mov} movimentações.`, comp, mov });
  return P;
}

function selecao(v: number[]): Passo[] {
  const a = [...v];
  const n = a.length;
  const P: Passo[] = [];
  let comp = 0;
  let mov = 0;
  for (let i = 0; i < n - 1; i++) {
    let menor = i;
    const fix = Array.from({ length: i }, (_, k) => k);
    P.push({ arr: [...a], foco: [i], troca: false, fixos: fix, menor, linha: 1, frase: `Procura o menor de ${i} até o fim. Começa supondo que é ${a[i]}.`, comp, mov });
    for (let j = i + 1; j < n; j++) {
      comp++;
      const achou = a[menor] > a[j];
      P.push({ arr: [...a], foco: [menor, j], troca: false, fixos: fix, menor, linha: 3, frase: achou ? `${a[menor]} > ${a[j]}: novo menor é ${a[j]}.` : `${a[menor]} ≤ ${a[j]}: o menor continua ${a[menor]}.`, comp, mov });
      if (achou) menor = j;
    }
    [a[i], a[menor]] = [a[menor], a[i]];
    mov += 3;
    P.push({ arr: [...a], foco: [i, menor], troca: true, fixos: Array.from({ length: i + 1 }, (_, k) => k), linha: 7, frase: `swap(${menor}, ${i}): ${a[i]} vai para a posição ${i} (3 movimentações).`, comp, mov });
  }
  P.push({ arr: [...a], foco: [], troca: false, fixos: a.map((_, k) => k), linha: 8, frase: `Pronto: ${comp} comparações, sempre n(n−1)/2, e ${mov} movimentações.`, comp, mov });
  return P;
}

function bolha(v: number[]): Passo[] {
  const a = [...v];
  const n = a.length;
  const P: Passo[] = [];
  let comp = 0;
  let mov = 0;
  const fix: number[] = [];
  for (let i = n - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      comp++;
      const troca = a[j] > a[j + 1];
      P.push({ arr: [...a], foco: [j, j + 1], troca: false, fixos: [...fix], linha: 2, frase: troca ? `${a[j]} > ${a[j + 1]}: troca.` : `${a[j]} ≤ ${a[j + 1]}: fica como está.`, comp, mov });
      if (troca) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        mov += 3;
        P.push({ arr: [...a], foco: [j, j + 1], troca: true, fixos: [...fix], linha: 3, frase: `swap(${j}, ${j + 1}).`, comp, mov });
      }
    }
    fix.push(i);
    P.push({ arr: [...a], foco: [i], troca: false, fixos: [...fix], linha: 0, frase: `O maior que sobrou (${a[i]}) "borbulhou" até a posição ${i}.`, comp, mov });
  }
  P.push({ arr: [...a], foco: [], troca: false, fixos: a.map((_, k) => k), linha: 6, frase: `Pronto: ${comp} comparações e ${mov} movimentações.`, comp, mov });
  return P;
}

const RODAR: Record<AlgoId, (v: number[]) => Passo[]> = { insercao, selecao, bolha };

function embaralhar(): number[] {
  const base = [2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = base.length - 1; i > 0; i--) {
    const k = Math.floor(Math.random() * (i + 1));
    [base[i], base[k]] = [base[k], base[i]];
  }
  return base.slice(0, 7);
}

export function HeroOrdenacao() {
  const reduzir = useRef(typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  const [algo, setAlgo] = useState<AlgoId>('insercao');
  const [vetor, setVetor] = useState<number[]>([7, 3, 9, 4, 6, 2, 5]);
  const [k, setK] = useState(0);
  const [tocando, setTocando] = useState(!reduzir.current);
  const passos = useMemo(() => RODAR[algo](vetor), [algo, vetor]);
  const p = passos[Math.min(k, passos.length - 1)];

  useEffect(() => {
    if (!tocando) return;
    const fim = k + 1 >= passos.length;
    const t = window.setTimeout(() => {
      if (fim) {
        setVetor(embaralhar());
        setK(0);
      } else setK(k + 1);
    }, fim ? 3200 : 1050);
    return () => window.clearTimeout(t);
  }, [tocando, k, passos.length]);

  const W = 46;
  const GAP = 10;
  const largura = p.arr.length * (W + GAP) - GAP;

  return (
    <div className="hero-ord">
      <div className="ho-abas" role="tablist" aria-label="Algoritmo">
        {NOMES.map((a) => (
          <button key={a.id} type="button" role="tab" aria-selected={algo === a.id} onClick={() => { setAlgo(a.id); setK(0); }}>
            {a.rotulo}
          </button>
        ))}
      </div>
      <div className="ho-corpo">
        <div className="ho-palco">
          <svg viewBox={`-6 -40 ${largura + 12} 214`} className="ho-svg" role="img" aria-label={`Ordenação por ${algo}. Vetor: ${p.arr.join(', ')}. ${p.frase}`}>
            {p.tmp && (
              <g style={{ transform: `translate(${p.tmp.pos * (W + GAP)}px, -36px)` }} className="ho-tmp">
                <rect width={W} height={26} rx={6} />
                <text x={W / 2} y={14} textAnchor="middle" dominantBaseline="central">tmp={p.tmp.valor}</text>
              </g>
            )}
            {p.arr.map((v, i) => {
              const h = 16 + v * 13;
              const classe = p.foco.includes(i) ? (p.troca ? 'troca' : 'foco') : p.fixos.includes(i) ? 'fixo' : '';
              return (
                <g key={i} transform={`translate(${i * (W + GAP)} 0)`} className={`ho-barra ${classe} ${p.menor === i ? 'menor' : ''}`}>
                  <rect y={140 - h} width={W} height={h} rx={6} style={{ transition: 'y .35s, height .35s, fill .3s' }} />
                  <text x={W / 2} y={140 - h - 8} textAnchor="middle" className="ho-val">{v}</text>
                  <text x={W / 2} y={160} textAnchor="middle" className="ho-idx">{i}</text>
                  {p.menor === i && <text x={W / 2} y={128} textAnchor="middle" className="ho-tag">menor</text>}
                </g>
              );
            })}
          </svg>
          <p className="ho-frase" aria-live="polite">{p.frase}</p>
          <div className="ho-linha">
            <span className="ho-cont"><b>{p.comp}</b> comparações</span>
            <span className="ho-cont"><b>{p.mov}</b> movimentações</span>
            <div className="ho-ctl">
              <button type="button" className="principal" aria-label={tocando ? 'Pausar' : 'Tocar'} onClick={() => setTocando(!tocando)}>
                {tocando ? <Pause size={15} /> : <Play size={15} />}
              </button>
              <button type="button" aria-label="Próximo passo" onClick={() => { setTocando(false); setK(Math.min(passos.length - 1, k + 1)); }}>
                <SkipForward size={15} />
              </button>
              <button type="button" aria-label="Embaralhar" onClick={() => { setVetor(embaralhar()); setK(0); }}>
                <Shuffle size={15} />
              </button>
            </div>
          </div>
        </div>
        <pre className="ho-codigo" aria-label="Código Java">
          {CODIGO[algo].map((l, i) => (
            <span key={i} className={i === p.linha ? 'atual' : ''}>
              <i>{i + 1}</i>{l}
            </span>
          ))}
        </pre>
      </div>
    </div>
  );
}
