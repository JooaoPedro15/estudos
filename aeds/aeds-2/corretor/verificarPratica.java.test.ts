import { describe, expect, test } from 'vitest';

import { prova1PraticaDrillCatalog } from '../src/content/prova1PraticaDrills';
import { linhasDaSaida } from './comparar';
import { casosPrivados, corrigir } from './corrigir';
import { temGeradorPrivado } from './testesPrivados';
import type { DrillCorrigivel } from './tipos';

/**
 * Verificacao de verdade (com javac/java): toda solucao modelo da prova
 * pratica da Prova 1 tem que tirar 100% na saida publica (exemplos
 * oficiais) E na privada (casos gerados). Nos problemas mais traicoeiros,
 * as saidas privadas tambem sao conferidas contra uma implementacao
 * independente em TypeScript, para nao confiar so na solucao modelo.
 */

const drills = prova1PraticaDrillCatalog as unknown as DrillCorrigivel[];

function solucoes(drill: DrillCorrigivel): string[] {
  if (drill.step.kind === 'function-choice') {
    return (drill.step.variants ?? []).map((variante) => variante.solution);
  }
  return [drill.step.solution ?? ''];
}

describe('solucoes modelo no corretor', () => {
  test('todo exercicio pratico tem gerador de casos privados', () => {
    const semGerador = drills.filter((drill) => !temGeradorPrivado(drill.id)).map((drill) => drill.id);
    expect(semGerador).toEqual([]);
  });

  for (const drill of drills) {
    test(`${drill.id}: 100% na publica e na privada`, async () => {
      for (const solucao of solucoes(drill)) {
        const resultado = await corrigir(drill, solucao);
        if (resultado.status !== 'executado') {
          throw new Error(`${drill.id}: ${resultado.status}\n${resultado.mensagem}`);
        }
        const falhas = [...resultado.publica.casos, ...resultado.privada.casos]
          .filter((caso) => caso.status !== 'correto')
          .map((caso) => `${caso.status} ${caso.porcentagem}% ${caso.erro ?? ''} ${caso.obtido?.slice(0, 300) ?? ''}`);
        expect(falhas).toEqual([]);
        expect(resultado.publica.porcentagem).toBe(100);
        expect(resultado.privada.porcentagem).toBe(100);
      }
    });
  }
});

// ---------- referencias independentes (TypeScript) ----------

function drillPorId(id: string): DrillCorrigivel {
  const drill = drills.find((item) => item.id === id);
  if (!drill) {
    throw new Error(`drill ${id} nao encontrado`);
  }
  return drill;
}

async function conferirPrivados(id: string, referencia: (entrada: string) => string[]) {
  const casos = await casosPrivados(drillPorId(id));
  expect(casos.length).toBeGreaterThan(0);
  for (const caso of casos) {
    expect(linhasDaSaida(caso.esperado)).toEqual(referencia(caso.entrada));
  }
}

function numeros(entrada: string): number[] {
  return entrada.split(/\s+/).filter((x) => x !== '').map(Number);
}

describe('saidas privadas conferidas contra referencias em TypeScript', () => {
  test('1242: pilha = apagar pares vizinhos (BS, SB, CF, FC) ate nao sobrar nenhum', async () => {
    // Uma dobra liga TODAS as bases do trecho: um par so se forma se tudo entre
    // as duas bases ja estiver ligado. Por isso vale apagar pares vizinhos em
    // loop (o exemplo oficial SFBC -> 0 confirma: nao ha dobra com base solta).
    const ligacoes = (fita: string) => {
      let atual = fita;
      let resp = 0;
      let mudou = true;
      while (mudou) {
        const proxima = atual.replace(/BS|SB|CF|FC/, '');
        mudou = proxima !== atual;
        if (mudou) {
          resp++;
          atual = proxima;
        }
      }
      return resp;
    };
    await conferirPrivados('code-prova1-pratica-rna-alienigena', (entrada) =>
      linhasDaSaida(entrada)
        .map((linha) => linha.trim())
        .filter((linha) => linha !== '')
        .map((fita) => String(ligacoes(fita))),
    );
  });

  test('1088: paridade das inversoes (arvore de Fenwick)', async () => {
    await conferirPrivados('code-prova1-pratica-bolhas-baldes', (entrada) => {
      const v = numeros(entrada);
      const resp: string[] = [];
      let i = 0;
      while (v[i] !== 0) {
        const n = v[i];
        const perm = v.slice(i + 1, i + 1 + n);
        i += n + 1;
        const bit = new Array(n + 1).fill(0);
        let inversoes = 0;
        for (let p = n - 1; p >= 0; p--) {
          for (let x = perm[p] - 1; x > 0; x -= x & -x) {
            inversoes += bit[x];
          }
          for (let x = perm[p]; x <= n; x += x & -x) {
            bit[x]++;
          }
        }
        resp.push(inversoes % 2 === 1 ? 'Marcelo' : 'Carlos');
      }
      return resp;
    });
  });

  test('1252: ordenacao com Array.sort e o comparador do enunciado', async () => {
    await conferirPrivados('code-prova1-pratica-sort-sort-sort', (entrada) => {
      const v = numeros(entrada);
      const resp: string[] = [];
      let i = 0;
      while (v[i] !== 0 || v[i + 1] !== 0) {
        const n = v[i];
        const m = v[i + 1];
        const lista = v.slice(i + 2, i + 2 + n);
        i += n + 2;
        lista.sort((a, b) => {
          const ra = a % m;
          const rb = b % m;
          if (ra !== rb) return ra - rb;
          const imparA = a % 2 !== 0;
          const imparB = b % 2 !== 0;
          if (imparA !== imparB) return imparA ? -1 : 1;
          return imparA ? b - a : a - b;
        });
        resp.push(`${n} ${m}`, ...lista.map(String));
      }
      resp.push('0 0');
      return resp;
    });
  });

  test('1030: recorrencia de Josephus', async () => {
    await conferirPrivados('code-prova1-pratica-josephus', (entrada) => {
      const v = numeros(entrada);
      const resp: string[] = [];
      for (let c = 0; c < v[0]; c++) {
        const n = v[1 + 2 * c];
        const k = v[2 + 2 * c];
        let j = 0;
        for (let i = 2; i <= n; i++) {
          j = (j + k) % i;
        }
        resp.push(`Case ${c + 1}: ${j + 1}`);
      }
      return resp;
    });
  });

  test('1031: simulacao com splice', async () => {
    await conferirPrivados('code-prova1-pratica-crise-energia', (entrada) =>
      numeros(entrada)
        .filter((n) => n !== 0)
        .map((n) => {
          let m = 1;
          for (;;) {
            const regioes = Array.from({ length: n }, (_, i) => i + 1);
            let pos = 0;
            let ultima = 0;
            while (regioes.length > 0) {
              ultima = regioes.splice(pos, 1)[0];
              if (regioes.length > 0) {
                pos = (pos + m - 1) % regioes.length;
              }
            }
            if (ultima === 13) {
              return String(m);
            }
            m++;
          }
        }),
    );
  });

  test('1523: simulacao com pilha em TypeScript', async () => {
    await conferirPrivados('code-prova1-pratica-estacionamento', (entrada) => {
      const v = numeros(entrada);
      const resp: string[] = [];
      let i = 0;
      while (v[i] !== 0 || v[i + 1] !== 0) {
        const n = v[i];
        const k = v[i + 1];
        i += 2;
        const pilha: number[] = [];
        let ok = true;
        for (let d = 0; d < n; d++) {
          const c = v[i + 2 * d];
          const s = v[i + 2 * d + 1];
          while (pilha.length > 0 && pilha[pilha.length - 1] <= c) pilha.pop();
          if (pilha.length === k || (pilha.length > 0 && pilha[pilha.length - 1] < s)) ok = false;
          pilha.push(s);
        }
        i += 2 * n;
        resp.push(ok ? 'Sim' : 'Nao');
      }
      return resp;
    });
  });
});

describe('o corretor pega solucoes erradas', () => {
  test('erro de compilacao aparece como erro de compilacao', async () => {
    const resultado = await corrigir(drillPorId('code-prova1-pratica-ordenacao'), 'static int contarTrocas(int[] vagoes, int l) {\n  return trocas\n}');
    expect(resultado.status).toBe('erro-compilacao');
  });

  test('saida errada tira menos que 100%', async () => {
    const resultado = await corrigir(drillPorId('code-prova1-pratica-ordenacao'), 'static int contarTrocas(int[] vagoes, int l) {\n  return 0;\n}');
    expect(resultado.status).toBe('executado');
    if (resultado.status === 'executado') {
      expect(resultado.publica.porcentagem).toBeLessThan(100);
      expect(resultado.privada.porcentagem).toBeLessThan(100);
    }
  });

  test('insertion sort Theta(n^2) passa na publica mas estoura o tempo na privada (1259)', async () => {
    const insercao = `static void ordenar(int[] valores, int n) {
  for (int i = 1; i < n; i++) {
    int tmp = valores[i];
    int j = i - 1;
    while (j >= 0 && vemAntes(tmp, valores[j])) {
      valores[j + 1] = valores[j];
      j--;
    }
    valores[j + 1] = tmp;
  }
}
static boolean vemAntes(int a, int b) {
  boolean parA = a % 2 == 0, parB = b % 2 == 0;
  return parA != parB ? parA : (parA ? a < b : a > b);
}`;
    const resultado = await corrigir(drillPorId('code-prova1-pratica-ordenacao-pares-impares'), insercao);
    expect(resultado.status).toBe('executado');
    if (resultado.status === 'executado') {
      expect(resultado.publica.porcentagem).toBe(100);
      expect(resultado.privada.casos.some((caso) => caso.status === 'tempo-excedido')).toBe(true);
      expect(resultado.privada.porcentagem).toBeLessThan(100);
    }
  });

  test('programa inteiro (como no Verde) tambem e aceito', async () => {
    const programa = `import java.util.*;
public class Main {
  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    int n = in.nextInt();
    int[] x = new int[n];
    for (int i = 0; i < n; i++) x[i] = in.nextInt();
    int p = 0;
    for (int i = 1; i < n; i++) if (x[i] < x[p]) p = i;
    System.out.println("Menor valor: " + x[p]);
    System.out.println("Posicao: " + p);
  }
}`;
    const resultado = await corrigir(drillPorId('code-prova1-pratica-menor-posicao'), programa);
    expect(resultado.status).toBe('executado');
    if (resultado.status === 'executado') {
      expect(resultado.publica.porcentagem).toBe(100);
      expect(resultado.privada.porcentagem).toBe(100);
    }
  });
});
