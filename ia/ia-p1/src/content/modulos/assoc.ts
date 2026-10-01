import { conjuntos, TRANSACOES_AE, TRANSACOES_NOTEBOOK, TRANSACOES_PAO_MANTEIGA } from '../dados';
import { f } from '../fontes';
import { afirmacoes, analise, codigo, formula, lista, n, nota, p, tabela } from '../helpers';
import type { Modulo, Questao } from '../types';
import { confianca, lift, suporte } from '../../engine/calc';

const PM = conjuntos(TRANSACOES_PAO_MANTEIGA);
const AE = conjuntos(TRANSACOES_AE);
const NB = conjuntos(TRANSACOES_NOTEBOOK);

export const moduloAssoc: Modulo = {
  id: 'assoc',
  ordem: 5,
  titulo: 'Regras de associação e Apriori',
  curto: 'Regras de associação',
  prioridade: 'alta',
  descricao: 'Item, itemset, suporte, confiança, lift, monotonicidade do suporte, as duas fases do Apriori e o exemplo Pão e Manteiga.',
  peso: 'Está no aviso oficial da prova; conta rápida e cheia de pegadinhas de interpretação.',
  resumo: [
    {
      id: 'conceito',
      titulo: 'O que é uma regra de associação',
      blocos: [
        p('Parecidas com regras de classificação, mas relacionam atributos que **co-ocorrem** em conjuntos de itens (itemsets), e **qualquer atributo pode ficar no lado direito**. Forma: **se antecedente então consequente**, em que antecedente e consequente são itemsets. São de natureza **probabilística**, e o número de regras é muito maior que o de regras de classificação.'),
        lista(
          'Exemplos do slide: {fralda} ⇒ {cerveja} (compras de sexta à noite); quem compra pão e manteiga, 80% das vezes compra leite: {pão, manteiga} ⇒ {leite}.',
          '**Item**: par [atributo-valor]. **Itemset**: combinação de pares atributo-valor com um suporte mínimo.',
          'O grau de incerteza de uma regra é dado pela **confiança**.',
        ),
      ],
      fontes: [f('ra', 'slides 2 a 6')],
    },
    {
      id: 'metricas',
      titulo: 'Suporte, confiança e lift',
      blocos: [
        formula(String.raw`\text{suporte}(A \to B) = \frac{\#\text{transações com } A \cup B}{\#\text{transações}}`, 'Cobertura (ou suporte)'),
        formula(String.raw`\text{confiança}(A \to B) = \frac{P(A \cup B)}{P(A)} = \frac{\text{suporte}(A \cup B)}{\text{suporte}(A)}`, 'Acurácia (confiança)'),
        formula(String.raw`\text{lift}(A \to B) = \frac{\text{confiança}(A \to B)}{\text{suporte}(B)}`, 'Lift (coeficiente de interesse)'),
        p('Lift mede **o quanto B fica mais frequente quando A ocorre**: lift = 1 → independentes; lift > 1 → aparecem juntos mais que o esperado (efeito positivo); lift < 1 → aparecem juntos menos que o esperado (efeito negativo).'),
        tabela(['TID', 'Itens'], TRANSACOES_AE.map((t, i) => [String(i + 1), `{${t.join(', ')}}`]), 'Exemplo do slide 8: {a}:7, {d}:6, {a,d}:5, {a,e}:6...'),
        p(`A → D: confiança = 5/7 = ${n(confianca(AE, ['a'], ['d']), 2)}. Lift = (5/7) / suporte(D) = 0,714 / 0,6 = **${n(lift(AE, ['a'], ['d']), 2)}**.`),
        nota('alerta', 'No slide 12 o lift aparece escrito como (5/7)/6. O denominador certo é o suporte de D, 6/10 = 0,6, o que dá 1,19 (conferido em código).'),
      ],
      fontes: [f('ra', 'slides 7 a 12'), f('apr', 'slides 11, 23 e 24')],
    },
    {
      id: 'monotonicidade',
      titulo: 'Espaço de busca e monotonicidade do suporte',
      blocos: [
        p('Com um conjunto de itens A, existem exatamente **2^|A|** itemsets (ou 2^|A| − 1 sem o vazio). Por isso os algoritmos precisam podar.'),
        p('**Propriedade explorada pelo Apriori**: o suporte é **monotonicamente decrescente** com o número de itens. Se X ⊆ Y, então suporte(Y) ≤ suporte(X).'),
        lista(
          'Se um itemset é **pouco frequente**, todos os seus **superconjuntos** também são.',
          'Todos os **subconjuntos** de um itemset frequente são frequentes.',
        ),
        { tipo: 'diagrama', id: 'apriori-poda', legenda: 'Com suporte mínimo 0,3 em Pão e Manteiga, Leite (0,2) cai no nível 1 e nenhum par com Leite precisa ser contado.' },
      ],
      fontes: [f('ra', 'slides 14 a 16')],
    },
    {
      id: 'apriori',
      titulo: 'Algoritmo Apriori (Agrawal e Srikant, 1994)',
      blocos: [
        p('**Duas fases:** (1) gerar os itemsets com o **suporte mínimo**; (2) para cada itemset, gerar todas as regras e manter as que têm a **confiança mínima**.'),
        tabela(
          ['Nº', 'Leite', 'Café', 'Cerveja', 'Pão', 'Manteiga', 'Arroz', 'Feijão'],
          TRANSACOES_PAO_MANTEIGA.map((t, i) => [String(i + 1), ...['Leite', 'Café', 'Cerveja', 'Pão', 'Manteiga', 'Arroz', 'Feijão'].map((item) => (t.includes(item) ? 'Sim' : 'Não'))]),
          'Arquivo PãoeManteiga SimNao.csv (igual ao slide 3 do Apriori).',
        ),
        p('O arquivo "PãoeManteiga Sim.csv" tem as mesmas 10 transações, com `?` no lugar de "Não". Como item é um par atributo-valor, no arquivo SimNao "Leite = Não" também conta como item; no arquivo com `?`, os ausentes não viram itens. (Dedução a partir da definição de item; os slides não comentam os dois arquivos.)'),
        p('O especialista precisa dar valor às regras geradas e pode ser preciso descartar atributos que aparecem com muita frequência. Outros algoritmos citados: Eclat e FP-growth.'),
      ],
      fontes: [f('apr', 'slides 2, 3, 25 e 26'), f('csvSimNao', 'arquivo inteiro'), f('csvSim', 'arquivo inteiro'), f('ra', 'slide 6')],
    },
    {
      id: 'notebook',
      titulo: 'Apriori em Python (apyori)',
      blocos: [
        codigo(`
transacoes = []
for i in range(len(base)):
  transacoes.append([str(base.values[i, j]) for j in range(base.shape[1])])
regras = apriori(transacoes, min_support = 0.3, min_confidence = 0.6)
saida = list(regras)
# no pós-processamento:
#   if 'nan' in a or 'nan' in b: continue
#   if len(a) == 0 or len(b) == 0: continue`, 'Apriori.ipynb'),
        lista(
          'Células vazias viram a string `\'nan\'` com `str(...)`, e "nan" vira um item com suporte 1,0. Por isso o filtro.',
          'O apyori também devolve regras com antecedente vazio (`items_base=frozenset()`), também filtradas.',
          `Saída final: Alcool → Detergente (sup ${n(suporte(NB, ['Alcool', 'Detergente']))}, conf 0,75, lift ${n(lift(NB, ['Alcool'], ['Detergente']))}) e Alcool → Limao (conf 0,75, lift ${n(lift(NB, ['Alcool'], ['Limao']), 3)}).`,
          'Limao → Alcool não aparece: confiança 3/6 = 0,5 < 0,6. Arroz e Feijão (2/7 ≈ 0,29) não passam do suporte 0,3.',
        ),
        p('Leitura: Alcool → Limao tem confiança alta (0,75) mas **lift < 1**, porque Limão já está em 6 das 7 transações. Confiança alta sozinha não garante regra interessante.'),
      ],
      fontes: [f('nbApriori', 'células 3 a 19')],
    },
  ],
  formulas: [
    { nome: 'Suporte', tex: String.raw`\text{sup}(A \to B) = \frac{\#(A \cup B)}{N}`, fonte: f('ra', 'slide 8') },
    { nome: 'Confiança', tex: String.raw`\text{conf}(A \to B) = \frac{\text{sup}(A \cup B)}{\text{sup}(A)}`, fonte: f('ra', 'slide 9') },
    { nome: 'Lift', tex: String.raw`\text{lift}(A \to B) = \frac{\text{conf}(A \to B)}{\text{sup}(B)}`, fonte: f('ra', 'slide 11') },
    { nome: 'Espaço de busca', tex: String.raw`2^{|A|} \text{ itemsets} \quad (2^{|A|} - 1 \text{ sem o vazio})`, fonte: f('ra', 'slide 14') },
    { nome: 'Monotonicidade', tex: String.raw`X \subseteq Y \Rightarrow \text{sup}(Y) \le \text{sup}(X)`, fonte: f('ra', 'slide 15') },
  ],
  exemplo: {
    titulo: 'Apriori completo em Pão e Manteiga (suporte 0,3, confiança 0,8)',
    enunciado: [p('Use as 10 transações de "PãoeManteiga SimNao.csv". Suporte mínimo 0,3 e confiança mínima 0,8. Quais regras ficam e qual o lift de cada uma?')],
    passos: [
      { titulo: '1-itemsets', blocos: [p('Leite 0,2; Café 0,3; Cerveja 0,2; Pão 0,5; Manteiga 0,5; Arroz 0,2; Feijão 0,2. Passam: **Café, Pão, Manteiga**.')] },
      { titulo: '2-itemsets (só com os frequentes)', blocos: [p('Café+Pão 0,3; Café+Manteiga 0,3; Pão+Manteiga 0,4. Todos passam. Pares com Leite nem são contados (monotonicidade).')] },
      { titulo: '3-itemset', blocos: [p('Café+Pão+Manteiga: transações 1, 3 e 4 → 0,3. Passa.')] },
      {
        titulo: 'Regras e confiança',
        blocos: [
          tabela(
            ['Regra', 'Confiança', 'Fica?'],
            [
              ['Café → Pão', '3/3 = 1', 'Sim'],
              ['Pão → Café', '3/5 = 0,6', 'Não'],
              ['Café → Manteiga', '3/3 = 1', 'Sim'],
              ['Manteiga → Café', '3/5 = 0,6', 'Não'],
              ['Pão → Manteiga', '4/5 = 0,8', 'Sim'],
              ['Manteiga → Pão', '4/5 = 0,8', 'Sim'],
              ['Café e Pão → Manteiga', '3/3 = 1', 'Sim'],
              ['Café e Manteiga → Pão', '3/3 = 1', 'Sim'],
              ['Pão e Manteiga → Café', '3/4 = 0,75', 'Não'],
              ['Café → Pão e Manteiga', '3/3 = 1', 'Sim'],
              ['Pão → Café e Manteiga', '3/5 = 0,6', 'Não'],
              ['Manteiga → Café e Pão', '3/5 = 0,6', 'Não'],
            ],
          ),
        ],
      },
      {
        titulo: 'Lift das 7 regras',
        blocos: [
          lista(
            `Café → Pão: 1 / 0,5 = ${n(lift(PM, ['Café'], ['Pão']))}`,
            `Café → Manteiga: 1 / 0,5 = ${n(lift(PM, ['Café'], ['Manteiga']))}`,
            `Pão → Manteiga e Manteiga → Pão: 0,8 / 0,5 = ${n(lift(PM, ['Pão'], ['Manteiga']))}`,
            'Café e Pão → Manteiga; Café e Manteiga → Pão: 1 / 0,5 = 2',
            `Café → Pão e Manteiga: 1 / 0,4 = **${n(lift(PM, ['Café'], ['Pão', 'Manteiga']))}** (a maior)`,
          ),
          p('Leitura do slide: "clientes que compram café têm duas vezes mais chances de comprarem pão".'),
        ],
      },
    ],
    fontes: [f('apr', 'slides 4 a 24'), f('csvSimNao', 'arquivo inteiro')],
  },
  pegadinhas: [
    { texto: 'Confiança **não é simétrica**: Café → Pão = 1, mas Pão → Café = 0,6.', fonte: f('apr', 'slide 13') },
    { texto: 'Lift é o mesmo nos dois sentidos: Café → Pão e Pão → Café têm lift 2 (0,6/0,3 = 2). Conferido com as fórmulas do slide.', fonte: f('ra', 'slides 9 e 11') },
    { texto: 'Suporte de uma regra usa o itemset **inteiro** (A ∪ B), não só o antecedente.', fonte: f('ra', 'slide 8') },
    { texto: 'Confiança alta com lift < 1 existe: Alcool → Limao, conf 0,75 e lift 0,875.', fonte: f('nbApriori', 'célula 17') },
    { texto: 'Superconjunto nunca tem suporte maior que o subconjunto.', fonte: f('ra', 'slide 15') },
    { texto: 'Lift do slide 12 escrito como (5/7)/6: o denominador é sup(D) = 0,6.', fonte: f('ra', 'slide 12') },
    { texto: 'No apyori, `nan` vira item e regras de antecedente vazio aparecem: o notebook filtra as duas.', fonte: f('nbApriori', 'célula 16') },
    { texto: 'Com 7 itens há 2⁷ = 128 itemsets (127 sem o vazio).', fonte: f('ra', 'slide 14') },
  ],
  chefe: { nome: 'O Lift Enganoso', fala: 'Confiança de 75%! Só não olhe o suporte do consequente.' },
};

export const questoesAssoc: Questao[] = [
  {
    id: 'ass-01',
    modulo: 'assoc',
    tipo: 'num',
    nivel: 1,
    enunciado: [p('Use as 10 transações do slide 8 ({a}:7, {e}:7, {a,e}:6). Calcule para a regra a → e:'), tabela(['TID', 'Itens'], TRANSACOES_AE.map((t, i) => [String(i + 1), `{${t.join(', ')}}`]))],
    campos: [
      { id: 'sup', rotulo: 'Suporte', resposta: suporte(AE, ['a', 'e']), porque: '{a, e} aparece em 6 de 10 transações: 0,6.' },
      { id: 'conf', rotulo: 'Confiança', resposta: confianca(AE, ['a'], ['e']), porque: '6/7 = 0,8571 (das 7 com a, 6 têm e).' },
      { id: 'lift', rotulo: 'Lift', resposta: lift(AE, ['a'], ['e']), porque: '0,8571 / suporte(e) = 0,8571 / 0,7 = 1,2245.' },
    ],
    resolucao: [p(`Suporte = 6/10 = 0,6. Confiança = sup(a ∪ e)/sup(a) = 0,6/0,7 = ${n(confianca(AE, ['a'], ['e']))}. Lift = ${n(confianca(AE, ['a'], ['e']))} / 0,7 = ${n(lift(AE, ['a'], ['e']))} > 1: efeito positivo.`)],
    fontes: [f('ra', 'slides 8 a 12')],
  },
  {
    id: 'ass-02',
    modulo: 'assoc',
    tipo: 'num',
    nivel: 2,
    enunciado: [p('Na base Pão e Manteiga (10 transações), calcule:')],
    tabela: {
      cabecalho: ['Regra', 'Suporte', 'Confiança', 'Lift'],
      linhas: [
        ['Manteiga → Café', { campo: 's1' }, { campo: 'c1' }, { campo: 'l1' }],
        ['Leite → Pão', { campo: 's2' }, { campo: 'c2' }, { campo: 'l2' }],
      ],
    },
    campos: [
      { id: 's1', rotulo: 'sup(Manteiga → Café)', resposta: suporte(PM, ['Manteiga', 'Café']), porque: '{Manteiga, Café} nas transações 1, 3 e 4: 3/10.' },
      { id: 'c1', rotulo: 'conf(Manteiga → Café)', resposta: confianca(PM, ['Manteiga'], ['Café']), porque: '3 / 5 transações com Manteiga = 0,6.' },
      { id: 'l1', rotulo: 'lift(Manteiga → Café)', resposta: lift(PM, ['Manteiga'], ['Café']), porque: '0,6 / sup(Café) = 0,6 / 0,3 = 2.' },
      { id: 's2', rotulo: 'sup(Leite → Pão)', resposta: suporte(PM, ['Leite', 'Pão']), porque: 'Leite e Pão juntos nas transações 2 e 4: 0,2.' },
      { id: 'c2', rotulo: 'conf(Leite → Pão)', resposta: confianca(PM, ['Leite'], ['Pão']), porque: 'As 2 com Leite têm Pão: 2/2 = 1.' },
      { id: 'l2', rotulo: 'lift(Leite → Pão)', resposta: lift(PM, ['Leite'], ['Pão']), porque: '1 / sup(Pão) = 1 / 0,5 = 2.' },
    ],
    resolucao: [
      p('Manteiga → Café: suporte 0,3; confiança 0,6 (não passaria no mínimo 0,8 do slide); lift 2.'),
      p('Leite → Pão: confiança 1 e lift 2, mas suporte 0,2 < 0,3: o Apriori com suporte 0,3 descarta Leite já no nível 1.'),
    ],
    fontes: [f('apr', 'slides 5 a 22'), f('csvSimNao', 'arquivo inteiro')],
  },
  {
    id: 'ass-03',
    modulo: 'assoc',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes('Sobre a propriedade explorada pelo Apriori:', [
      'Se X ⊆ Y, então suporte(Y) ≤ suporte(X).',
      'Se um itemset é pouco frequente, todos os seus superconjuntos também são pouco frequentes.',
      'Se um itemset é frequente, todos os seus superconjuntos também são frequentes.',
    ]),
    opcoes: ['Apenas I', 'Apenas I e II', 'Apenas II e III', 'I, II e III', 'Todas estão incorretas'],
    correta: 1,
    explicacao: analise([
      ['I', true, 'Monotonicidade do suporte (slide 15).'],
      ['II', true, 'Slide 16.'],
      ['III', false, 'É o contrário: os **subconjuntos** de um frequente são frequentes. Superconjuntos podem cair (Café é frequente; Café + Leite não).'],
    ]),
    fontes: [f('ra', 'slides 15 e 16')],
  },
  {
    id: 'ass-04',
    modulo: 'assoc',
    tipo: 'mc',
    nivel: 1,
    enunciado: [p('Quais são as duas fases do Apriori, na ordem?')],
    opcoes: [
      'Gerar regras com confiança mínima; depois filtrar por lift',
      'Gerar itemsets com suporte mínimo; depois gerar regras com confiança mínima',
      'Calcular o lift de todos os pares; depois o suporte',
      'Podar a árvore; depois votar',
    ],
    correta: 1,
    explicacao: [p('Slide 2 do Apriori. O lift entra depois, para avaliar as melhores regras (slide 21).')],
    fontes: [f('apr', 'slides 2 e 21')],
  },
  {
    id: 'ass-05',
    modulo: 'assoc',
    tipo: 'mc',
    nivel: 2,
    enunciado: [p('Uma regra A → B tem confiança 0,75 e lift 0,875. O que isso significa?')],
    opcoes: [
      'A e B são independentes',
      'A ocorrência de A tem efeito negativo sobre B: aparecem juntos menos que o esperado',
      'A regra é ótima, pois a confiança passou de 0,5',
      'O lift está errado: com confiança 0,75 ele precisa ser maior que 1',
    ],
    correta: 1,
    explicacao: [p('Lift < 1: "A e B aparecem com menos frequência do que o esperado em conjunto". É o caso real de Alcool → Limao no notebook: Limão está em 6 de 7 transações, então 0,75 é menos que os 0,857 que ele já teria sozinho.')],
    fontes: [f('apr', 'slide 23'), f('nbApriori', 'célula 17')],
  },
  {
    id: 'ass-06',
    modulo: 'assoc',
    tipo: 'num',
    nivel: 1,
    enunciado: [p('A base Pão e Manteiga tem 7 itens diferentes. Quantos itemsets existem no espaço de busca?')],
    campos: [
      { id: 'total', rotulo: 'Incluindo o vazio', resposta: 128, porque: '2⁷ = 128.' },
      { id: 'semvazio', rotulo: 'Sem o conjunto vazio', resposta: 127, porque: '2⁷ − 1 = 127.' },
    ],
    resolucao: [p('Slide 14: 2^|A| itemsets, ou 2^|A| − 1 sem o vazio. Com 7 itens: 128 e 127.')],
    fontes: [f('ra', 'slide 14')],
  },
  {
    id: 'ass-07',
    modulo: 'assoc',
    tipo: 'mc',
    nivel: 3,
    enunciado: afirmacoes(
      [
        p('No Apriori.ipynb há 7 transações; Alcool aparece em 4, Detergente em 4, Limao em 6 e Alcool com Limao em 3. Executa-se:'),
        codigo(`regras = apriori(transacoes, min_support = 0.3, min_confidence = 0.6)`),
      ],
      [
        'A regra Limao → Alcool não aparece na saída porque sua confiança é 0,5.',
        'A regra Alcool → Limao aparece com confiança 0,75 e lift menor que 1.',
        'O item "nan" nunca aparece nas regras brutas, pois o apyori descarta valores ausentes sozinho.',
      ],
    ),
    opcoes: ['Apenas I', 'Apenas I e II', 'Apenas II e III', 'I, II e III', 'Todas estão incorretas'],
    correta: 1,
    explicacao: analise([
      ['I', true, 'conf = 3/6 = 0,5 < 0,6.'],
      ['II', true, 'conf = 3/4 = 0,75; lift = 0,75 / (6/7) = 0,875.'],
      ['III', false, 'O `str()` transforma NaN em "nan", que aparece com suporte 1,0. O notebook filtra com `if \'nan\' in a or \'nan\' in b: continue`.'],
    ]),
    fontes: [f('nbApriori', 'células 6, 10 e 16')],
  },
  {
    id: 'ass-08',
    modulo: 'assoc',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes('Considere as regras Café → Pão e Pão → Café na base Pão e Manteiga:', [
      'As duas regras têm o mesmo suporte.',
      'As duas regras têm a mesma confiança.',
      'As duas regras têm o mesmo lift.',
    ]),
    opcoes: ['Apenas I', 'Apenas I e III', 'Apenas II e III', 'I, II e III', 'Todas estão incorretas'],
    correta: 1,
    explicacao: analise([
      ['I', true, 'O suporte usa o itemset {Café, Pão}: 0,3 nas duas.'],
      ['II', false, 'Café → Pão = 3/3 = 1; Pão → Café = 3/5 = 0,6.'],
      ['III', true, 'Café → Pão: 1/0,5 = 2. Pão → Café: 0,6/0,3 = 2.'],
    ]),
    fontes: [f('apr', 'slides 13 e 22')],
  },
  {
    id: 'ass-09',
    modulo: 'assoc',
    tipo: 'num',
    nivel: 2,
    enunciado: [p('No Apriori.ipynb (7 transações: Alcool em 4, Detergente em 4, os dois juntos em 3). Para a regra Alcool → Detergente:')],
    campos: [
      { id: 's', rotulo: 'Suporte', resposta: suporte(NB, ['Alcool', 'Detergente']), porque: '3/7 = 0,4286.' },
      { id: 'c', rotulo: 'Confiança', resposta: confianca(NB, ['Alcool'], ['Detergente']), porque: '3/4 = 0,75.' },
      { id: 'l', rotulo: 'Lift', resposta: lift(NB, ['Alcool'], ['Detergente']), porque: '0,75 / (4/7) = 1,3125.' },
    ],
    resolucao: [p('É a primeira linha do DataFrame `RegrasFinais` do notebook: suporte 0.428571, confiança 0.75, lift 1.3125.')],
    fontes: [f('nbApriori', 'células 14 e 17')],
  },
  {
    id: 'ass-10',
    modulo: 'assoc',
    tipo: 'mc',
    nivel: 1,
    enunciado: [p('Com suporte mínimo 0,3 na base Pão e Manteiga, qual itemset **não** é frequente?')],
    opcoes: ['{Café, Pão}', '{Pão, Manteiga}', '{Leite, Pão}', '{Café, Pão, Manteiga}'],
    correta: 2,
    explicacao: [p('{Leite, Pão} aparece nas transações 2 e 4: 0,2. Como Leite sozinho já tem 0,2, o Apriori nem conta esse par.')],
    fontes: [f('apr', 'slides 5 a 9')],
  },
  {
    id: 'ass-11',
    modulo: 'assoc',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes('Sobre regras de associação em geral:', [
      'Diferente das regras de classificação, qualquer atributo pode ocorrer no lado direito.',
      'O grau de incerteza de uma regra é dado pela sua confiança.',
      'O número de regras de associação costuma ser bem menor que o de regras de classificação.',
    ]),
    opcoes: ['Apenas I', 'Apenas I e II', 'Apenas II e III', 'I, II e III', 'Todas estão incorretas'],
    correta: 1,
    explicacao: analise([
      ['I', true, 'Slide 2.'],
      ['II', true, 'Slide 3.'],
      ['III', false, 'Slide 3: "muitíssimo maior".'],
    ]),
    fontes: [f('ra', 'slides 2 e 3')],
  },
];
