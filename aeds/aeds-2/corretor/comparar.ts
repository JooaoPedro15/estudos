/**
 * Comparacao de saida no estilo Verde: linha a linha, e a nota do caso e a
 * porcentagem de linhas iguais. Linhas em branco no FIM da saida sao
 * ignoradas (todo juiz ignora a quebra de linha final), e "\r\n" do
 * Windows vira "\n".
 *
 * beecrowd e estrito: espaco sobrando ou faltando no meio/fim da linha e
 * linha diferente (no juiz real isso da "Presentation Error"). LeetCode e
 * Codewars comparam VALORES, entao ali os espacos sao ignorados e numeros
 * reais aceitam diferenca de 1e-5.
 */

export type ModoComparacao = 'estrito' | 'valores';

export type Comparacao = {
  linhasCertas: number;
  totalLinhas: number;
  /** A diferenca e so de espacos (dica de "Presentation Error"). */
  soEspacos: boolean;
};

export function linhasDaSaida(texto: string): string[] {
  const linhas = texto.replace(/\r\n?/g, '\n').split('\n');
  while (linhas.length > 0 && linhas[linhas.length - 1].trim() === '') {
    linhas.pop();
  }
  return linhas;
}

function semEspacos(linha: string): string {
  return linha.replace(/\s+/g, '');
}

function numerosProximos(a: string, b: string): boolean {
  if (!/^-?\d+(\.\d+)?$/.test(a) || !/^-?\d+(\.\d+)?$/.test(b)) {
    return false;
  }
  const x = Number(a);
  const y = Number(b);
  return Math.abs(x - y) <= 1e-5 * Math.max(1, Math.abs(x));
}

function linhasIguais(esperada: string, obtida: string, modo: ModoComparacao): boolean {
  if (modo === 'estrito') {
    return esperada === obtida;
  }
  const e = semEspacos(esperada);
  const o = semEspacos(obtida);
  return e === o || numerosProximos(e, o);
}

export function compararSaidas(esperado: string, obtido: string, modo: ModoComparacao): Comparacao {
  const linhasEsperadas = linhasDaSaida(esperado);
  const linhasObtidas = linhasDaSaida(obtido);
  const totalLinhas = Math.max(linhasEsperadas.length, linhasObtidas.length, 1);
  let linhasCertas = 0;
  if (linhasEsperadas.length === 0 && linhasObtidas.length === 0) {
    linhasCertas = 1;
  }
  for (let i = 0; i < Math.min(linhasEsperadas.length, linhasObtidas.length); i++) {
    if (linhasIguais(linhasEsperadas[i], linhasObtidas[i], modo)) {
      linhasCertas++;
    }
  }
  const conteudo = (linhas: string[]) =>
    linhas
      .map(semEspacos)
      .filter((linha) => linha !== '')
      .join('\n');
  const soEspacos = linhasCertas < totalLinhas && conteudo(linhasEsperadas) === conteudo(linhasObtidas);
  return { linhasCertas, totalLinhas, soEspacos };
}

/** Porcentagem arredondada para baixo: 99,9% nao pode aparecer como 100%. */
export function porcentagem(certas: number, total: number): number {
  return total === 0 ? 0 : Math.floor((100 * certas) / total);
}
