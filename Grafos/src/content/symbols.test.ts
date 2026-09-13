import { describe, expect, it } from 'vitest';
import { symbolsIn } from './symbols';
import { PC } from './pseudocode';

const names = (...texts: string[]) => symbolsIn(...texts).map((s) => s.symbol);

describe('symbolsIn — notação do pseudocódigo', () => {
  it('BASE: reconhece B, V, v, d⁻(v), ∅, ∪, for/if/return, == e comentários', () => {
    const found = names(PC.BASE);
    for (const s of ['NOME(G)', 'V', 'B', 'C, X', '∅', 'd⁻(v) / d⁺(v)', 'for x ∈ S', 'if cond:', '= / ==', 'return', '∪ / ∩', '∈ / ∉', '// texto']) {
      expect(found, s).toContain(s);
    }
  });

  it('VISIT: estados visitado[u], N(v), vértices minúsculos', () => {
    const found = names(PC.VISIT);
    for (const s of ['visitado[u]', 'N(v)', 'v, u, w', 'for x ∈ S', 'if cond:']) expect(found, s).toContain(s);
    expect(found).not.toContain('B');
    expect(found).not.toContain('while cond');
  });

  it('DISTANCIAS: fila, dist[u], while, ≠', () => {
    const found = names(PC.DISTANCIAS);
    for (const s of ['fila', 'dist[u]', 'while cond', '≠', 'return']) expect(found, s).toContain(s);
  });

  it('KOSARAJU: fim[u] e transposto', () => {
    const found = names(PC.KOSARAJU);
    for (const s of ['fim[u]', 'Gᵀ']) expect(found, s).toContain(s);
  });

  it('não dispara pseudocódigo em texto comum', () => {
    const found = names('Prove que um grafo com n vértices e k componentes tem no mínimo n − k arestas.');
    for (const s of ['NOME(G)', 'V', 'B', 'for x ∈ S', 'if cond:', 'return', '= / ==']) expect(found, s).not.toContain(s);
    expect(found).toContain('n − k');
  });

  it('sem repetição e na ordem do dicionário', () => {
    const found = names(PC.BASE, PC.BASE);
    expect(new Set(found).size).toBe(found.length);
  });
});
