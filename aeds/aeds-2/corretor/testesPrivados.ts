/**
 * Entradas dos casos PRIVADOS de cada exercicio pratico (o "pri.in" do
 * Verde). Sao geradas de forma deterministica (semente = id do drill), ate
 * a solucao modelo, e respeitam as restricoes do enunciado original. A
 * saida esperada NAO fica aqui: o corretor roda a solucao modelo nessas
 * entradas (ver corrigir.ts).
 *
 * Cada gerador mistura: casos de borda (minimo, repetidos, negativos,
 * vazio...), casos aleatorios medios e, onde o juiz real cobra desempenho,
 * um caso grande em que um algoritmo Theta(n^2) estoura o tempo.
 */

export type Aleatorio = {
  int: (min: number, max: number) => number;
  escolher: <T>(itens: readonly T[]) => T;
  embaralhar: <T>(itens: T[]) => T[];
};

/** Versao dos geradores: mudar invalida o cache das saidas esperadas. */
export const VERSAO_GERADORES = 1;

function hash(texto: string): number {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function criarAleatorio(semente: string): Aleatorio {
  let estado = hash(semente) || 1;
  const proximo = () => {
    // mulberry32
    estado = (estado + 0x6d2b79f5) | 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (min: number, max: number) => min + Math.floor(proximo() * (max - min + 1));
  const escolher = <T,>(itens: readonly T[]) => itens[int(0, itens.length - 1)];
  const embaralhar = <T,>(itens: T[]) => {
    for (let i = itens.length - 1; i > 0; i--) {
      const j = int(0, i);
      [itens[i], itens[j]] = [itens[j], itens[i]];
    }
    return itens;
  };
  return { int, escolher, embaralhar };
}

// ---------- utilitarios ----------

function intervalo(de: number, ate: number): number[] {
  const resp: number[] = [];
  for (let i = de; i <= ate; i++) {
    resp.push(i);
  }
  return resp;
}

function permutacao(r: Aleatorio, n: number): number[] {
  return r.embaralhar(intervalo(1, n));
}

function distintos(r: Aleatorio, quantidade: number, min: number, max: number): number[] {
  const vistos = new Set<number>();
  while (vistos.size < quantidade) {
    vistos.add(r.int(min, max));
  }
  return r.embaralhar([...vistos]);
}

function linhas(...partes: Array<string | number>): string {
  return `${partes.join('\n')}\n`;
}

const NOMES = [
  'Ana', 'Bruno', 'Carla', 'Diego', 'Elisa', 'Fabio', 'Gabi', 'Heitor', 'Iara', 'Joao', 'Kaio', 'Lara', 'Mateus', 'Nina', 'Otavio',
  'Paula', 'Quiteria', 'Rafael', 'Sofia', 'Tiago', 'Ursula', 'Vitor', 'Wanda', 'Xavier', 'Yara', 'Zeca', 'Amanda', 'Beto', 'Caio',
  'Duda', 'Enzo', 'Fernanda', 'Gustavo', 'Helena', 'Igor', 'Julia', 'Lucas', 'Marina', 'Nicolas', 'Olivia', 'Pedro', 'Renata',
];

function palavraMinuscula(r: Aleatorio, min: number, max: number): string {
  let resp = '';
  const tamanho = r.int(min, max);
  for (let i = 0; i < tamanho; i++) {
    resp += String.fromCharCode(97 + r.int(0, 25));
  }
  return resp;
}

/** Sequencia de pilha alcancavel: simula empilhar 1..n e desempilhar aleatoriamente. */
function saidaDePilha(r: Aleatorio, entrada: string[] | number[]): Array<string | number> {
  const pilha: Array<string | number> = [];
  const saida: Array<string | number> = [];
  let proximo = 0;
  while (saida.length < entrada.length) {
    if (proximo < entrada.length && (pilha.length === 0 || r.int(0, 1) === 0)) {
      pilha.push(entrada[proximo]);
      proximo++;
    } else {
      saida.push(pilha.pop() as string | number);
    }
  }
  return saida;
}

function formatarVetor(v: number[]): string {
  return `[${v.join(',')}]`;
}

function formatarTextos(v: string[]): string {
  return `[${v.map((x) => `"${x}"`).join(', ')}]`;
}

// ---------- geradores por exercicio ----------

type Gerador = (r: Aleatorio) => string[];

const geradores: Record<string, Gerador> = {
  // beecrowd 1162
  'code-prova1-pratica-ordenacao': (r) => {
    const caso = (tamanhos: number[]) =>
      linhas(tamanhos.length, ...tamanhos.flatMap((l) => [l, permutacao(r, l).join(' ')]));
    return [
      caso([0, 1, 2]),
      caso([50, 50, 50]),
      caso([5, 10, 20, 30, 40, 49]),
      linhas(2, 50, intervalo(1, 50).reverse().join(' '), 50, intervalo(1, 50).join(' ')),
    ];
  },

  // beecrowd 1566
  'code-prova1-pratica-ordenacao-altura': (r) => {
    const cidade = (n: number) => [n, Array.from({ length: n }, () => r.int(20, 230)).join(' ')];
    return [
      linhas(3, ...cidade(2), ...cidade(15), ...cidade(100)),
      linhas(2, 5, '230 20 230 20 125', 4, '20 20 20 20'),
      linhas(1, ...cidade(300000)),
    ];
  },

  // beecrowd 1259
  'code-prova1-pratica-ordenacao-pares-impares': (r) => {
    const aleatorio = (n: number, max: number) => {
      const v = Array.from({ length: n }, () => r.int(0, max));
      return linhas(n, ...v);
    };
    // Pior caso do insertion sort: cada novo valor vai para o comeco da sua regiao.
    const pares = intervalo(0, 49999).map((x) => 2 * x).reverse();
    const impares = intervalo(0, 49999).map((x) => 2 * x + 1);
    const grande = r.embaralhar([...pares.slice(0, 5)]).concat(pares.slice(5), impares);
    return [aleatorio(2, 1), linhas(5, 0, 0, 1, 1, 0), aleatorio(1000, 1000000), linhas(grande.length, grande.join('\n'))];
  },

  // beecrowd 1025
  'code-prova1-pratica-busca-binaria': (r) => {
    const caso = (n: number, q: number, max: number) => {
      const bolinhas = Array.from({ length: n }, () => r.int(0, max));
      const consultas = Array.from({ length: q }, () => r.int(0, max));
      return [`${n} ${q}`, ...bolinhas, ...consultas];
    };
    return [
      linhas(...caso(1, 3, 3), ...caso(6, 4, 2), '0 0'),
      linhas(...caso(50, 20, 30), ...caso(3, 5, 10000), ...caso(10, 10, 5), '0 0'),
      linhas(...caso(10000, 10000, 10000), ...caso(10000, 10000, 100), ...caso(10000, 10000, 10000), '0 0'),
    ];
  },

  // beecrowd 1548
  'code-prova1-pratica-fila-recreio': (r) => {
    const caso = (m: number) => [m, distintos(r, m, 1, 1000).join(' ')];
    const decrescente = intervalo(1, 1000).reverse();
    return [
      linhas(4, ...caso(1), ...caso(2), ...caso(10), ...caso(30)),
      linhas(3, 1000, decrescente.join(' '), 1000, intervalo(1, 1000).join(' '), ...caso(1000)),
    ];
  },

  // beecrowd 2381
  'code-prova1-pratica-lista-chamada': (r) => {
    const caso = (n: number, k: number) => {
      const nomes = new Set<string>();
      while (nomes.size < n) {
        nomes.add(palavraMinuscula(r, 1, 20));
      }
      return linhas(`${n} ${k}`, ...r.embaralhar([...nomes]));
    };
    return [
      caso(1, 1),
      caso(100, 1),
      caso(100, 100),
      caso(50, 27),
      linhas('4 2', 'ana', 'an', 'anab', 'a'),
    ];
  },

  // beecrowd 1171
  'code-prova1-pratica-frequencia-numeros': (r) => {
    const aleatorio = (n: number, max: number) => {
      const contagem = new Map<number, number>();
      const v: number[] = [];
      while (v.length < n) {
        const x = r.int(1, max);
        if ((contagem.get(x) ?? 0) < 20) {
          contagem.set(x, (contagem.get(x) ?? 0) + 1);
          v.push(x);
        }
      }
      return linhas(n, ...v);
    };
    return [linhas(1, 2000), linhas(3, 1, 2000, 1), aleatorio(200, 50), aleatorio(5000, 2000)];
  },

  // beecrowd 1609
  'code-prova1-pratica-carneirinhos': (r) => {
    const caso = (n: number, max: number) => [n, Array.from({ length: n }, () => r.int(0, max)).join(' ')];
    const casos: Array<string | number> = [];
    for (let i = 0; i < 90; i++) {
      casos.push(...caso(r.int(1, 100), r.escolher([5, 1000, 1000000000])));
    }
    for (let i = 0; i < 10; i++) {
      casos.push(...caso(10000, r.escolher([100, 1000000000])));
    }
    return [linhas(3, 1, 0, 1, 1000000000, 4, '7 7 7 7'), linhas(100, ...casos)];
  },

  // beecrowd 1252
  'code-prova1-pratica-sort-sort-sort': (r) => {
    const caso = (n: number, m: number, min: number, max: number) => [
      `${n} ${m}`,
      ...Array.from({ length: n }, () => r.int(min, max)),
    ];
    return [
      linhas('1 1', 5, '6 2', -3, -2, -1, 0, 1, 2, '0 0'),
      linhas(...caso(30, 7, -50, 50), ...caso(20, 1, -10, 10), ...caso(10, 10000, -2147483648, 2147483647), '0 0'),
      linhas('4 3', -2147483648, 2147483647, 0, -1, ...caso(10000, 97, -1000000000, 1000000000), ...caso(10000, 2, -1000, 1000), '0 0'),
    ];
  },

  // beecrowd 1251
  'code-prova1-pratica-diga-frequencia': (r) => {
    const linha = (n: number, de: number, ate: number) =>
      Array.from({ length: n }, () => String.fromCharCode(r.int(de, ate))).join('');
    return [
      linhas('a', 'zz', 'ab ba'),
      linhas(linha(1000, 32, 126), linha(50, 48, 57), linha(300, 65, 70), '~ ~!'),
    ];
  },

  // beecrowd 1258
  'code-prova1-pratica-camisetas': (r) => {
    const turma = (n: number) => {
      const nomes = new Set<string>();
      while (nomes.size < n) {
        nomes.add(`${r.escolher(NOMES)} ${r.escolher(NOMES)}${r.int(0, 3) === 0 ? ` ${r.escolher(NOMES)}` : ''}`);
      }
      return [n, ...[...nomes].flatMap((nome) => [nome, `${r.escolher(['branco', 'vermelho'])} ${r.escolher(['P', 'M', 'G'])}`])];
    };
    return [
      linhas(1, 'Zeca', 'vermelho G', 0),
      linhas(...turma(5), ...turma(60), ...turma(2), 0),
      linhas(3, 'Ana', 'branco G', 'Ana', 'branco P', 'Ana', 'branco M', ...turma(40), 0),
    ];
  },

  // beecrowd 1766
  'code-prova1-pratica-elfo-trevas': (r) => {
    const caso = (n: number, m: number) => {
      const nomes = new Set<string>();
      while (nomes.size < n) {
        nomes.add(`${r.escolher(NOMES)}${r.int(0, 999)}`);
      }
      return [
        `${n} ${m}`,
        ...[...nomes].map(
          (nome) => `${nome} ${r.escolher([10, 30, 50, r.int(1, 300)])} ${r.escolher([100, 107, r.int(1, 300)])} ${(r.int(0, 300) / 100).toFixed(2)}`,
        ),
      ];
    };
    return [
      linhas(2, ...caso(5, 5), '6 5', 'b 5 5 1.50', 'a 5 5 1.50', 'c 5 5 1.49', 'd 5 4 2.00', 'e 6 9 0.00', 'f 5 5 1.50'),
      linhas(4, ...caso(20, 7), ...caso(1000, 1000), ...caso(300, 5), ...caso(500, 250)),
    ];
  },

  // beecrowd 1088
  'code-prova1-pratica-bolhas-baldes': (r) => {
    const linhaDe = (v: number[]) => `${v.length} ${v.join(' ')}`;
    const casos = [linhaDe([2, 1]), linhaDe([1, 2]), linhaDe([3, 1, 2]), linhaDe(permutacao(r, 9)), linhaDe(permutacao(r, 1000))];
    return [
      linhas(...casos, 0),
      linhas(linhaDe(intervalo(1, 100000).reverse()), linhaDe(permutacao(r, 100000)), linhaDe(permutacao(r, 99999)), 0),
    ];
  },

  // beecrowd 1180
  'code-prova1-pratica-menor-posicao': (r) => [
    linhas(2, '5 3'),
    linhas(2, '-1 7'),
    linhas(999, distintos(r, 999, -100000, 100000).join(' ')),
    linhas(5, '9 8 7 6 5'),
  ],

  // beecrowd 2448
  'code-prova1-pratica-carteiro': (r) => {
    const caso = (n: number, m: number, extremos: boolean) => {
      const casas = distintos(r, n, 1, 1000000000).sort((a, b) => a - b);
      const encomendas = Array.from({ length: m }, (_, i) =>
        extremos ? casas[i % 2 === 0 ? n - 1 : 0] : casas[r.int(0, n - 1)],
      );
      return linhas(`${n} ${m}`, casas.join(' '), encomendas.join(' '));
    };
    return [linhas('1 1', 7, 7), caso(10, 20, false), caso(45000, 45000, true), caso(45000, 45000, false)];
  },

  // LeetCode 88
  'code-prova1-pratica-lc-merge-sorted-array': (r) => {
    const caso = (m: number, n: number) => {
      const a = Array.from({ length: m }, () => r.int(-1000000000, 1000000000)).sort((x, y) => x - y);
      const b = Array.from({ length: n }, () => r.int(-1000000000, 1000000000)).sort((x, y) => x - y);
      return `nums1 = ${formatarVetor([...a, ...Array(n).fill(0)])}, m = ${m}, nums2 = ${formatarVetor(b)}, n = ${n}`;
    };
    return [caso(0, 3), caso(3, 0), caso(5, 5), caso(100, 100), 'nums1 = [2,2,2,0,0], m = 3, nums2 = [2,2], n = 2', 'nums1 = [4,5,6,0,0,0], m = 3, nums2 = [1,2,3], n = 3'];
  },

  // LeetCode 75
  'code-prova1-pratica-lc-sort-colors': (r) => [
    'nums = [0]',
    'nums = [2,2,2]',
    'nums = [1,0]',
    `nums = ${formatarVetor(Array.from({ length: 300 }, () => r.int(0, 2)))}`,
    `nums = ${formatarVetor(Array.from({ length: 57 }, () => r.int(0, 2)))}`,
  ],

  // LeetCode 704
  'code-prova1-pratica-lc-binary-search': (r) => {
    const caso = (n: number, presente: boolean) => {
      const nums = distintos(r, n, -9999, 9999).sort((a, b) => a - b);
      let alvo = r.int(-9999, 9999);
      if (presente) {
        alvo = r.escolher(nums);
      }
      return `nums = ${formatarVetor(nums)}, target = ${alvo}`;
    };
    return ['nums = [5], target = 5', 'nums = [5], target = -5', 'nums = [1,3], target = 3', caso(10000, true), caso(10000, false), caso(37, true)];
  },

  // beecrowd 1068
  'code-prova1-pratica-pilha': (r) => {
    const expressao = (tamanho: number, balanceada: boolean) => {
      let resp = '';
      let abertos = 0;
      for (let i = 0; i < tamanho; i++) {
        const tipo = r.int(0, 3);
        if (tipo === 0) {
          resp += '(';
          abertos++;
        } else if (tipo === 1 && (abertos > 0 || !balanceada)) {
          resp += ')';
          abertos--;
        } else {
          resp += r.escolher(['a', 'b', '+', '*', '2', '-']);
        }
      }
      if (balanceada) {
        resp += ')'.repeat(Math.max(0, abertos));
      }
      return resp.slice(0, 1000);
    };
    const muitas = Array.from({ length: 2000 }, () => expressao(r.int(1, 400), r.int(0, 1) === 0));
    return [
      linhas('()', ')(', '(((', 'a', '((a)(b))', '(()'),
      linhas('('.repeat(500) + ')'.repeat(500), '('.repeat(500) + ')'.repeat(499), ...muitas),
    ];
  },

  // beecrowd 2929
  'code-prova1-pratica-pilha-minimo': (r) => {
    const operacoes = (n: number, max: number) => {
      const ops: string[] = [];
      let tamanho = 0;
      for (let i = 0; i < n; i++) {
        const t = r.int(0, 9);
        if (t < 5) {
          ops.push(`PUSH ${r.int(1, max)}`);
          tamanho++;
        } else if (t < 7) {
          ops.push('POP');
          tamanho = Math.max(0, tamanho - 1);
        } else {
          ops.push('MIN');
        }
      }
      return linhas(n, ...ops);
    };
    // Pilha grande crescente seguida de muitos MIN: varrer a pilha a cada MIN e Theta(n^2).
    const grande: string[] = [];
    for (let i = 0; i < 150000; i++) {
      grande.push(`PUSH ${1000000000 - i}`);
    }
    for (let i = 0; i < 150000; i++) {
      grande.push(i % 3 === 0 ? 'POP' : 'MIN');
    }
    return [linhas(3, 'POP', 'MIN', 'PUSH 7'), operacoes(40, 20), operacoes(2000, 1000000000), linhas(grande.length, grande.join('\n'))];
  },

  // beecrowd 1062
  'code-prova1-pratica-pilha-trilhos': (r) => {
    const bloco = (n: number, quantas: number) => {
      const perms: string[] = [];
      for (let i = 0; i < quantas; i++) {
        const v = r.int(0, 1) === 0 ? saidaDePilha(r, intervalo(1, n)) : permutacao(r, n);
        perms.push(v.join(' '));
      }
      return [n, ...perms, 0];
    };
    return [
      linhas(1, 1, 0, 2, '2 1', '1 2', 0, 3, '3 1 2', '2 3 1', 0, 0),
      linhas(...bloco(10, 20), ...bloco(1000, 10), ...bloco(7, 30), 0),
    ];
  },

  // beecrowd 1110
  'code-prova1-pratica-fila': () => [linhas(1, 2, 3, 0), linhas(50, 49, 32, 17, 5, 0), linhas(...intervalo(1, 50), 0)],

  // beecrowd 1340
  'code-prova1-pratica-adivinhar-estrutura': (r) => {
    const caso = (n: number, tipo: 'pilha' | 'fila' | 'prioridade' | 'aleatoria', max: number) => {
      const sacola: number[] = [];
      const comandos: string[] = [];
      for (let i = 0; i < n; i++) {
        if (sacola.length === 0 || r.int(0, 2) > 0) {
          const x = r.int(1, max);
          sacola.push(x);
          comandos.push(`1 ${x}`);
        } else {
          let posicao = 0;
          if (tipo === 'pilha') {
            posicao = sacola.length - 1;
          } else if (tipo === 'prioridade') {
            posicao = sacola.indexOf(Math.max(...sacola));
          } else if (tipo === 'aleatoria') {
            posicao = r.int(0, sacola.length - 1);
          }
          comandos.push(`2 ${sacola.splice(posicao, 1)[0]}`);
        }
      }
      return [n, ...comandos];
    };
    const tipos = ['pilha', 'fila', 'prioridade', 'aleatoria'] as const;
    const varios: Array<string | number> = [];
    for (let i = 0; i < 40; i++) {
      varios.push(...caso(r.int(1, 30), r.escolher(tipos), r.escolher([2, 5, 100])));
    }
    return [
      linhas(1, '1 5', 2, '1 5', '2 5', 3, '1 1', '1 2', '2 2'),
      linhas(...varios),
      linhas(...caso(1000, 'pilha', 100), ...caso(1000, 'fila', 100), ...caso(1000, 'prioridade', 100), ...caso(1000, 'aleatoria', 100)),
    ];
  },

  // beecrowd 1069
  'code-prova1-pratica-diamantes-areia': (r) => {
    const linha = (n: number) => Array.from({ length: n }, () => r.escolher(['<', '>', '.', '<', '>'])).join('');
    return [linhas(4, '<>', '><', '...', '<<<>>>'), linhas(20, ...Array.from({ length: 20 }, () => linha(r.int(1, 1000))))];
  },

  // beecrowd 1242
  'code-prova1-pratica-rna-alienigena': (r) => {
    const fita = (n: number) => Array.from({ length: n }, () => r.escolher(['B', 'C', 'F', 'S'])).join('');
    const aninhada = (pares: number) => {
      let resp = '';
      for (let i = 0; i < pares; i++) {
        const par = r.escolher(['BS', 'SB', 'CF', 'FC']);
        const meio = r.int(0, resp.length);
        resp = resp.slice(0, meio) + par + resp.slice(meio);
      }
      return resp;
    };
    return [
      linhas('B', 'BS', 'SB', 'BC', 'CFFC', 'BCFS'),
      linhas(...Array.from({ length: 15 }, () => fita(r.int(1, 300))), aninhada(150), aninhada(10)),
    ];
  },

  // beecrowd 1523
  'code-prova1-pratica-estacionamento': (r) => {
    const caso = (n: number, k: number, empilhavel: boolean) => {
      // Chegadas distintas crescentes; saidas distintas e depois da chegada.
      const chegadas = distintos(r, n, 1, 50000).sort((a, b) => a - b);
      const saidasUsadas = new Set<number>();
      const pares = chegadas.map((c, i) => {
        let s = empilhavel ? 100000 - i * 3 - r.int(0, 1) : r.int(c + 1, Math.min(100000, c + 5000));
        while (saidasUsadas.has(s) || s <= c) {
          s = r.int(c + 1, 100000);
        }
        saidasUsadas.add(s);
        return `${c} ${s}`;
      });
      return [`${n} ${k}`, ...pares];
    };
    return [
      linhas('3 1', '1 2', '2 3', '3 4', '3 1', '1 3', '2 4', '5 6', '0 0'),
      linhas(...caso(10, 3, false), ...caso(10, 10, true), ...caso(10, 9, true), ...caso(50, 1000, false), '0 0'),
      linhas(...caso(10000, 1000, false), ...caso(10000, 1000, true), '0 0'),
    ];
  },

  // beecrowd 1063
  'code-prova1-pratica-trilhos-movimentos': (r) => {
    const caso = (n: number, alcancavel: boolean) => {
      const letras = r.embaralhar(intervalo(0, 25).map((x) => String.fromCharCode(97 + x))).slice(0, n);
      const saida = alcancavel ? (saidaDePilha(r, letras) as string[]) : r.embaralhar([...letras]);
      return [n, letras.join(' '), saida.join(' ')];
    };
    const casos: Array<string | number> = [];
    for (let i = 0; i < 12; i++) {
      casos.push(...caso(r.int(1, 26), r.int(0, 1) === 0));
    }
    return [linhas(1, 'a', 'a', 2, 'a b', 'a b', 2, 'a b', 'b a', 0), linhas(...casos, 0)];
  },

  // beecrowd 1077
  'code-prova1-pratica-infixa-posfixa': (r) => {
    const operando = () => r.escolher(['A', 'B', 'c', 'd', 'x', '2', '7', 'Z']);
    const expressao = (profundidade: number): string => {
      if (profundidade === 0 || r.int(0, 3) === 0) {
        return operando();
      }
      const op = r.escolher(['+', '-', '*', '/', '^', '+', '*']);
      const e = `${expressao(profundidade - 1)}${op}${expressao(profundidade - 1)}`;
      return r.int(0, 2) === 0 ? `(${e})` : e;
    };
    const lista: string[] = [];
    while (lista.length < 60) {
      const e = expressao(r.int(1, 6));
      if (e.length <= 300) {
        lista.push(e);
      }
    }
    return [linhas(6, 'a', 'a^b^c', 'a-b-c', 'a/b*c', '(a+b)^(c-d)^e', '2^3*4+(5-6)/7'), linhas(lista.length, ...lista)];
  },

  // beecrowd 1030
  'code-prova1-pratica-josephus': (r) => {
    const pares = Array.from({ length: 27 }, () => `${r.int(1, 10000)} ${r.int(1, 1000)}`);
    return [linhas(4, '1 1', '1 1000', '2 1', '10 1'), linhas(30, '10000 1000', '10000 999', '9999 1', ...pares)];
  },

  // beecrowd 1031
  'code-prova1-pratica-crise-energia': () => [linhas(13, 14, 100, 0), linhas(...intervalo(13, 100), 0)],

  // Codewars Josephus Permutation
  'code-prova1-pratica-cw-josephus-permutation': (r) => [
    'items = [], k = 3',
    'items = [1,2,3,4,5,6,7,8,9,10], k = 1',
    'items = [1,2,3,4,5,6,7,8,9,10], k = 2',
    'items = [1,2,3,4,5,6,7,8,9,10], k = 40',
    `items = ${formatarVetor(intervalo(1, 50))}, k = ${r.int(2, 60)}`,
    `items = ${formatarVetor(distintos(r, 20, -100, 100))}, k = 7`,
  ],

  // Codewars Directions Reduction
  'code-prova1-pratica-cw-dir-reduc': (r) => {
    const direcoes = ['NORTH', 'SOUTH', 'EAST', 'WEST'];
    const aleatorio = (n: number) => `arr = ${formatarTextos(Array.from({ length: n }, () => r.escolher(direcoes)))}`;
    return [
      'arr = []',
      'arr = ["NORTH"]',
      'arr = ["NORTH", "EAST", "SOUTH", "WEST"]',
      'arr = ["EAST", "NORTH", "SOUTH", "WEST", "EAST"]',
      aleatorio(10),
      aleatorio(30),
      aleatorio(200),
    ];
  },

  // LeetCode 20
  'code-prova1-pratica-lc-valid-parentheses': (r) => {
    const valida = (pares: number): string => {
      if (pares === 0) {
        return '';
      }
      const dentro = r.int(0, pares - 1);
      const [a, f] = r.escolher([['(', ')'], ['[', ']'], ['{', '}']]);
      return `${a}${valida(dentro)}${f}${valida(pares - 1 - dentro)}`;
    };
    const aleatoria = (n: number) => Array.from({ length: n }, () => r.escolher(['(', ')', '[', ']', '{', '}'])).join('');
    return ['s = "["', 's = "]"', 's = "(("', 's = "{[]}"', `s = "${valida(200)}"`, `s = "${valida(5)}]"`, `s = "${aleatoria(8)}"`, `s = "${'['.repeat(5000)}${']'.repeat(5000)}"`];
  },

  // LeetCode 155
  'code-prova1-pratica-lc-min-stack': (r) => {
    const caso = (n: number, min: number, max: number) => {
      const ops = ['"MinStack"'];
      const args = ['[]'];
      let tamanho = 0;
      for (let i = 0; i < n; i++) {
        const t = tamanho === 0 ? 0 : r.int(0, 3);
        if (t === 0) {
          ops.push('"push"');
          args.push(`[${r.int(min, max)}]`);
          tamanho++;
        } else if (t === 1) {
          ops.push('"pop"');
          args.push('[]');
          tamanho--;
        } else {
          ops.push(t === 2 ? '"top"' : '"getMin"');
          args.push('[]');
        }
      }
      return `[${ops.join(',')}]\n[${args.join(',')}]`;
    };
    return [caso(10, -5, 5), caso(300, -2147483648, 2147483647), caso(29999, -1000, 1000)];
  },

  // LeetCode 232
  'code-prova1-pratica-lc-queue-using-stacks': (r) => {
    const caso = (n: number) => {
      const ops = ['"MyQueue"'];
      const args = ['[]'];
      let tamanho = 0;
      for (let i = 0; i < n; i++) {
        const t = tamanho === 0 ? r.escolher([0, 3]) : r.int(0, 3);
        if (t === 0) {
          ops.push('"push"');
          args.push(`[${r.int(1, 9)}]`);
          tamanho++;
        } else if (t === 1) {
          ops.push('"pop"');
          args.push('[]');
          tamanho--;
        } else {
          ops.push(t === 2 ? '"peek"' : '"empty"');
          args.push('[]');
        }
      }
      return `[${ops.join(', ')}]\n[${args.join(', ')}]`;
    };
    return [caso(5), caso(40), caso(99)];
  },

  // LeetCode 622
  'code-prova1-pratica-lc-circular-queue': (r) => {
    const caso = (k: number, n: number) => {
      const ops = ['"MyCircularQueue"'];
      const args = [`[${k}]`];
      for (let i = 0; i < n; i++) {
        const op = r.escolher(['enQueue', 'enQueue', 'deQueue', 'Front', 'Rear', 'isEmpty', 'isFull']);
        ops.push(`"${op}"`);
        args.push(op === 'enQueue' ? `[${r.int(0, 1000)}]` : '[]');
      }
      return `[${ops.join(', ')}]\n[${args.join(', ')}]`;
    };
    return [caso(1, 12), caso(3, 40), caso(8, 300), caso(1000, 2999)];
  },

  // LeetCode 26
  'code-prova1-pratica-lista': (r) => {
    const caso = (n: number, min: number, max: number) =>
      `nums = ${formatarVetor(Array.from({ length: n }, () => r.int(min, max)).sort((a, b) => a - b))}`;
    return ['nums = [7]', 'nums = [-100,-100,-100]', 'nums = [1,2,3]', caso(300, -100, 100), caso(30000, -100, 100), caso(50, 0, 3)];
  },

  // beecrowd 3160
  'code-prova1-pratica-amigos': (r) => {
    const caso = (atuais: number, novos: number, indicar: boolean) => {
      const nomes = r.embaralhar([...NOMES]).slice(0, atuais + novos);
      const lista = nomes.slice(0, atuais);
      return linhas(lista.join(' '), nomes.slice(atuais).join(' '), indicar ? r.escolher(lista) : 'nao');
    };
    return [
      linhas('Ana', 'Bia', 'Ana'),
      linhas('Ana', 'Bia', 'nao'),
      linhas('Ana Beto Caio', 'Duda Enzo', 'Caio'),
      caso(20, 10, true),
      caso(15, 20, false),
      caso(30, 1, true),
    ];
  },

  // LeetCode 206
  'code-prova1-pratica-lc-reverse-list': (r) => [
    'head = [7]',
    `head = ${formatarVetor(Array.from({ length: 10 }, () => r.int(-5000, 5000)))}`,
    `head = ${formatarVetor(Array.from({ length: 5000 }, () => r.int(-5000, 5000)))}`,
  ],

  // LeetCode 21
  'code-prova1-pratica-lc-merge-lists': (r) => {
    const ordenada = (n: number) => formatarVetor(Array.from({ length: n }, () => r.int(-100, 100)).sort((a, b) => a - b));
    return ['list1 = [5], list2 = []', 'list1 = [1,1,1], list2 = [1,1]', `list1 = ${ordenada(50)}, list2 = ${ordenada(50)}`, `list1 = ${ordenada(3)}, list2 = ${ordenada(40)}`];
  },

  // beecrowd 1478
  'code-prova1-pratica-matriz-quadrada': () => [linhas(1, 0), linhas(10, 0), linhas(100, 7, 12, 0)],

  // LeetCode 54
  'code-prova1-pratica-lc-spiral-matrix': (r) => {
    const matriz = (m: number, n: number) =>
      `matrix = [${Array.from({ length: m }, () => formatarVetor(Array.from({ length: n }, () => r.int(-100, 100)))).join(',')}]`;
    return [matriz(1, 1), matriz(1, 10), matriz(10, 1), matriz(2, 2), matriz(10, 10), matriz(5, 8), matriz(9, 4)];
  },

  // beecrowd 1029
  'code-prova1-pratica-fibonacci-chamadas': (r) => [
    linhas(3, 1, 2, 3),
    linhas(10, 39, 39, 39, 39, 39, 38, 37, 36, 35, 34),
    linhas(20, ...Array.from({ length: 20 }, () => r.int(1, 39))),
  ],

  // LeetCode 50
  'code-prova1-pratica-lc-pow': (r) => {
    const casos = ['x = 1.00000, n = -2147483648', 'x = -1.00000, n = -2147483648', 'x = -1.00000, n = 2147483647', 'x = 2.00000, n = 0', 'x = 0.00001, n = 1', 'x = -2.00000, n = 13', 'x = 0.50000, n = -13'];
    for (let i = 0; i < 5; i++) {
      const base = r.int(-300, 300) / 100 || 1.5;
      const limite = Math.max(1, Math.floor(Math.log(10000) / Math.log(Math.max(Math.abs(base), 1.0001))));
      casos.push(`x = ${base.toFixed(5)}, n = ${r.int(0, Math.min(limite, 60))}`);
    }
    return casos;
  },
};

/** Entradas privadas do exercicio (vazio se o drill nao tiver gerador). */
export function gerarEntradasPrivadas(drillId: string): string[] {
  const gerador = geradores[drillId];
  return gerador ? gerador(criarAleatorio(drillId)) : [];
}

export function temGeradorPrivado(drillId: string): boolean {
  return drillId in geradores;
}
