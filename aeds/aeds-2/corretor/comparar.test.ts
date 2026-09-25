import { describe, expect, test } from 'vitest';

import { compararSaidas, linhasDaSaida, porcentagem } from './comparar';

describe('comparacao de saida estilo Verde', () => {
  test('ignora \\r\\n do Windows e linhas em branco no fim', () => {
    expect(linhasDaSaida('a\r\nb\r\n\r\n')).toEqual(['a', 'b']);
    expect(compararSaidas('1\n2\n', '1\r\n2', 'estrito')).toEqual({ linhasCertas: 2, totalLinhas: 2, soEspacos: false });
  });

  test('nota parcial: linha a linha, contando linhas faltando ou sobrando', () => {
    expect(compararSaidas('1\n2\n3\n4', '1\n2\nx', 'estrito')).toMatchObject({ linhasCertas: 2, totalLinhas: 4 });
    expect(compararSaidas('1', '1\n2', 'estrito')).toMatchObject({ linhasCertas: 1, totalLinhas: 2 });
  });

  test('beecrowd e estrito com espaco, mas avisa que a diferenca e so de espaco', () => {
    const r = compararSaidas('Discarded cards:', 'Discarded cards: ', 'estrito');
    expect(r.linhasCertas).toBe(0);
    expect(r.soEspacos).toBe(true);
  });

  test('LeetCode/Codewars comparam valores: espacos nao importam e reais aceitam 1e-5', () => {
    expect(compararSaidas('[null, true, 3]', '[null,true,3]', 'valores').linhasCertas).toBe(1);
    expect(compararSaidas('9.26100', '9.26100000001', 'valores').linhasCertas).toBe(1);
    expect(compararSaidas('0.25000', '0.25100', 'valores').linhasCertas).toBe(0);
  });

  test('porcentagem arredonda para baixo (99,9% nao vira 100%)', () => {
    expect(porcentagem(999, 1000)).toBe(99);
    expect(porcentagem(3, 3)).toBe(100);
  });
});
