import {
  BASE_CREDITO,
  BASE_RESTAURANTE,
  BASE_SUCESSO_15,
  BASE_SUCESSO_17,
  BASE_TENIS,
  conjuntos,
  MATRIZ_PROVA_Q7,
  MATRIZ_SLIDE,
  TRANSACOES_AE,
  TRANSACOES_NOTEBOOK,
  TRANSACOES_PAO_MANTEIGA,
} from '../content/dados';
import {
  aprioriItemsets,
  aprioriRegras,
  confianca,
  entropia,
  f1Ponderado,
  fmt,
  ganhoGini,
  ganhoInformacao,
  gini,
  giniPonderado,
  lerNumero,
  lift,
  metricasConfusao,
  naiveBayes,
  particionar,
  razaoGanho,
  splitInfo,
  suporte,
} from './calc';

// Valores de referencia conferidos a parte em Python (scratchpad check.py / check2.py).

describe('entropia e ganho (ID3)', () => {
  it('moeda justa = 1 bit e moeda 99% = 0,0808', () => {
    expect(entropia([1, 1])).toBeCloseTo(1, 10);
    expect(entropia([1, 99])).toBeCloseTo(0.080793, 5);
    expect(entropia([4, 0])).toBe(0);
  });

  it('prova 2025 Q12: raiz = Iniciativa_Projetos com ganho 0,9968', () => {
    const [r, h, i] = [0, 1, 2].map((a) => ganhoInformacao(particionar(BASE_SUCESSO_15, a).grupos));
    expect(entropia([8, 7])).toBeCloseTo(0.9968, 4);
    expect(r).toBeCloseTo(0.6295, 4);
    expect(h).toBeCloseTo(0.5968, 4);
    expect(i).toBeCloseTo(0.9968, 4);
  });

  it('restaurante: Cliente 0,541; Tipo 0; Fome 0,196 (slides 26, 28, 31)', () => {
    const g = (a: number) => ganhoInformacao(particionar(BASE_RESTAURANTE, a).grupos);
    expect(g(4)).toBeCloseTo(0.5409, 4);
    expect(g(8)).toBeCloseTo(0, 10);
    expect(g(3)).toBeCloseTo(0.1957, 4);
    expect(g(9)).toBeCloseTo(0.2075, 4);
  });

  it('restaurante: split-info de Cliente 1,459 e gain ratio 0,37 (slides 50-51)', () => {
    const p = particionar(BASE_RESTAURANTE, 4);
    expect(splitInfo(p.grupos)).toBeCloseTo(1.4591, 4);
    expect(razaoGanho(p.grupos)).toBeCloseTo(0.3707, 4);
  });

  it('tenis: entropia da classe 0,940 e Aparencia com ganho 0,2467', () => {
    expect(entropia([9, 5])).toBeCloseTo(0.9403, 4);
    expect(ganhoInformacao(particionar(BASE_TENIS, 0).grupos)).toBeCloseTo(0.2467, 4);
    expect(ganhoInformacao(particionar(BASE_TENIS, 2).grupos)).toBeCloseTo(0.1518, 4);
  });
});

describe('Gini (CART)', () => {
  it('slide 62: 50/50 = 0,5 e 70/30 = 0,42', () => {
    expect(gini([1, 1])).toBeCloseTo(0.5, 10);
    expect(gini([7, 3])).toBeCloseTo(0.42, 10);
  });

  it('slide 60/64: {Alguns} x {Nenhum, Cheio} tem Gini ponderado 0,25 e ganho 0,25', () => {
    expect(giniPonderado([[4, 0], [2, 6]])).toBeCloseTo(0.25, 10);
    expect(ganhoGini([[4, 0], [2, 6]])).toBeCloseTo(0.25, 10);
    expect(ganhoGini([[0, 2], [6, 4]])).toBeCloseTo(0.1, 10);
    expect(ganhoGini([[2, 4], [4, 2]])).toBeCloseTo(0.0556, 4);
  });
});

describe('matriz de confusao', () => {
  it('prova 2025 Q7: TFN da classe B = 10/60', () => {
    const m = metricasConfusao(MATRIZ_PROVA_Q7);
    expect(m.classes[1].fn).toBe(10);
    expect(m.classes[1].tfn).toBeCloseTo(0.1667, 4);
    expect(m.classes[1].precisao).toBeCloseTo(0.8621, 4);
  });

  it('slides 5-13: TVP, TFN, TFP e TVN por classe', () => {
    const m = metricasConfusao(MATRIZ_SLIDE).classes;
    expect(m.map((c) => [c.vp, c.reais])).toEqual([
      [11, 15],
      [4, 5],
      [6, 9],
    ]);
    expect(m.map((c) => [c.fp, c.outras])).toEqual([
      [3, 14],
      [2, 24],
      [3, 20],
    ]);
    expect(m.map((c) => c.vn)).toEqual([11, 22, 17]);
  });

  it('F1 ponderado com w = 1 e igual ao F1', () => {
    expect(f1Ponderado(0.5, 1, 1)).toBeCloseTo((2 * 0.5) / 1.5, 10);
  });
});

describe('regras de associacao', () => {
  const pm = conjuntos(TRANSACOES_PAO_MANTEIGA);

  it('Apriori slides 5-9: itemsets com suporte >= 0,3', () => {
    const niveis = aprioriItemsets(pm, 0.3);
    expect(niveis.map((n) => n.map((i) => `${i.itens.join('+')}:${i.contagem}`))).toEqual([
      ['Café:3', 'Manteiga:5', 'Pão:5'],
      ['Café+Manteiga:3', 'Café+Pão:3', 'Manteiga+Pão:4'],
      ['Café+Manteiga+Pão:3'],
    ]);
  });

  it('Apriori slides 20-22: 7 regras com confianca >= 0,8 e seus lifts', () => {
    const regras = aprioriRegras(pm, aprioriItemsets(pm, 0.3), 0.8);
    expect(regras).toHaveLength(7);
    expect(lift(pm, ['Café'], ['Pão'])).toBeCloseTo(2, 10);
    expect(lift(pm, ['Pão'], ['Manteiga'])).toBeCloseTo(1.6, 10);
    expect(lift(pm, ['Café'], ['Pão', 'Manteiga'])).toBeCloseTo(2.5, 10);
    expect(confianca(pm, ['Pão', 'Manteiga'], ['Café'])).toBeCloseTo(0.75, 10);
  });

  it('slides 10-12: A -> D tem confianca 5/7 e lift 1,19', () => {
    const t = conjuntos(TRANSACOES_AE);
    expect(confianca(t, ['a'], ['d'])).toBeCloseTo(5 / 7, 10);
    expect(lift(t, ['a'], ['d'])).toBeCloseTo(1.1905, 4);
  });

  it('Apriori.ipynb: Alcool -> Detergente lift 1,3125 e Alcool -> Limao lift 0,875', () => {
    const t = conjuntos(TRANSACOES_NOTEBOOK);
    expect(suporte(t, ['Alcool', 'Detergente'])).toBeCloseTo(0.428571, 5);
    expect(lift(t, ['Alcool'], ['Detergente'])).toBeCloseTo(1.3125, 10);
    expect(lift(t, ['Alcool'], ['Limao'])).toBeCloseTo(0.875, 10);
    expect(confianca(t, ['Limao'], ['Alcool'])).toBeCloseTo(0.5, 10);
  });
});

describe('Naive Bayes', () => {
  it('prova 2025 Q13: produtos 0,0523 e 0,0147; normalizado 78,05% e 21,95%', () => {
    const r = naiveBayes(BASE_SUCESSO_17, ['Médio', 'Moderado', 'Sim']);
    const bem = r.find((c) => c.classe === 'Bem sucedido')!;
    const mal = r.find((c) => c.classe === 'Mal sucedido')!;
    expect(bem.produto).toBeCloseTo(0.052288, 6);
    expect(mal.produto).toBeCloseTo(0.014706, 6);
    expect(bem.probabilidade).toBeCloseTo(0.780488, 6);
    expect(mal.probabilidade).toBeCloseTo(0.219512, 6);
    expect(bem.termos.map((t) => `${t.contagem}/${t.total}`)).toEqual(['3/9', '3/9', '8/9']);
  });

  it('slide 6 (credito): valores exatos 12,27% / 8,18% / 79,54%', () => {
    const r = naiveBayes(BASE_CREDITO, ['Boa', 'Alta', 'Nenhuma', '>35000']);
    const por = Object.fromEntries(r.map((c) => [c.classe, c]));
    expect(por.Alto.produto).toBeCloseTo(0.0079365, 6);
    expect(por.Moderado.produto).toBeCloseTo(0.0052910, 6);
    expect(por.Baixo.produto).toBeCloseTo(0.0514286, 6);
    expect(por.Baixo.probabilidade).toBeCloseTo(0.7954, 4);
  });

  it('slide 9 (tenis Sol, Fria, Normal, Nao): Sim 86,06%', () => {
    const r = naiveBayes(BASE_TENIS, ['Sol', 'Fria', 'Normal', 'Não']);
    expect(r.find((c) => c.classe === 'Sim')!.probabilidade).toBeCloseTo(0.8606, 4);
  });
});

describe('entrada do aluno', () => {
  it('aceita virgula, ponto, fracao e porcentagem', () => {
    expect(lerNumero('0,17')).toBeCloseTo(0.17);
    expect(lerNumero('0.17')).toBeCloseTo(0.17);
    expect(lerNumero('10/60')).toBeCloseTo(0.1667, 4);
    expect(lerNumero('78,05%')).toBeCloseTo(0.7805, 4);
    expect(lerNumero(' 2 ')).toBe(2);
    expect(lerNumero('abc')).toBeNull();
    expect(lerNumero('1/0')).toBeNull();
    expect(lerNumero('')).toBeNull();
  });

  it('formata no padrao brasileiro', () => {
    expect(fmt(0.99679, 4)).toBe('0,9968');
    expect(fmt(2, 4)).toBe('2');
  });
});
