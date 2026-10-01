import { BASE_CREDITO, BASE_SUCESSO_17, BASE_TENIS, MATRIZ_NB_IRIS } from '../dados';
import { f } from '../fontes';
import { afirmacoes, analise, codigo, formula, lista, n, nota, p, tabela } from '../helpers';
import type { Modulo, Questao } from '../types';
import { metricasConfusao, naiveBayes, type ResultadoBayesClasse } from '../../engine/calc';

const por = (r: ResultadoBayesClasse[], classe: string) => r.find((c) => c.classe === classe)!;
const conta = (c: ResultadoBayesClasse) => [`${c.contagemClasse}/${c.total}`, ...c.termos.map((t) => `${t.contagem}/${t.total}`)].join(' · ');

const tenisExemplo = naiveBayes(BASE_TENIS, ['Sol', 'Fria', 'Normal', 'Não']);
const tenisQ = naiveBayes(BASE_TENIS, ['Chuva', 'Quente', 'Alta', 'Sim']);
const credito = naiveBayes(BASE_CREDITO, ['Boa', 'Alta', 'Nenhuma', '>35000']);
const creditoZero = naiveBayes(BASE_CREDITO, ['Ruim', 'Baixa', 'Adequada', '>35000']);
const sucessoQ = naiveBayes(BASE_SUCESSO_17, ['Alto', 'Pouco', 'Não']);
const iris = metricasConfusao(MATRIZ_NB_IRIS);

export const moduloBayes: Modulo = {
  id: 'bayes',
  ordem: 6,
  titulo: 'Naive Bayes',
  curto: 'Naive Bayes',
  prioridade: 'media',
  descricao: 'Tabela de probabilidades por contagem, produto P(classe)·ΠP(valor|classe) e normalização.',
  peso: 'Caiu na Q13 de 2025 (4 pontos). Não está no aviso oficial, por isso prioridade média.',
  resumo: [
    {
      id: 'tabela',
      titulo: 'A tabela de probabilidades',
      blocos: [
        p('Na base de risco de crédito (14 instâncias: 6 Alto, 3 Moderado, 5 Baixo), a professora monta uma tabela com:'),
        lista(
          '**P(classe)**: quantas instâncias da classe ÷ total. Ex.: P(Alto) = 6/14.',
          '**P(valor | classe)**: entre as instâncias **daquela classe**, quantas têm o valor. Ex.: P(História = Boa | Alto) = 1/6.',
        ),
        tabela(
          ['Risco', 'Boa', 'Desconh.', 'Ruim', 'Dív. Alta', 'Dív. Baixa', 'Nenhuma', 'Adequada', '<15000', '15000–35000', '>35000'],
          [
            ['Alto 6/14', '1/6', '2/6', '3/6', '4/6', '2/6', '6/6', '0/6', '3/6', '2/6', '1/6'],
            ['Moderado 3/14', '1/3', '1/3', '1/3', '1/3', '2/3', '2/3', '1/3', '0/3', '2/3', '1/3'],
            ['Baixo 5/14', '3/5', '2/5', '0/5', '2/5', '3/5', '3/5', '2/5', '0/5', '0/5', '5/5'],
          ],
          'Slide 4 (também na aba "Análise" de Arquivo Exemplo.xlsx).',
        ),
      ],
      fontes: [f('nb', 'slides 3 e 4')],
    },
    {
      id: 'novo-registro',
      titulo: 'Avaliar um registro novo e normalizar',
      blocos: [
        formula(String.raw`\text{prod}(c) = P(c)\cdot\prod_{i} P(x_i \mid c) \qquad P(c \mid x) = \frac{\text{prod}(c)}{\sum_{k}\text{prod}(k)}`),
        p('Registro do slide: História Boa, Dívida Alta, Garantias Nenhuma, Renda >35000.'),
        lista(
          `P(alto) = 6/14 · 1/6 · 4/6 · 6/6 · 1/6 = ${n(por(credito, 'Alto').produto)}`,
          `P(moderado) = 3/14 · 1/3 · 1/3 · 2/3 · 1/3 = ${n(por(credito, 'Moderado').produto)}`,
          `P(baixo) = 5/14 · 3/5 · 2/5 · 3/5 · 5/5 = ${n(por(credito, 'Baixo').produto)}`,
        ),
        p('**Normalizar**: dividir cada produto pela soma dos produtos, para as probabilidades somarem 100%.'),
        tabela(
          ['Classe', 'Slide (com arredondamento)', 'Valor exato'],
          [
            ['Alto', '12,24%', `${n(por(credito, 'Alto').probabilidade * 100, 2)}%`],
            ['Moderado', '8,06%', `${n(por(credito, 'Moderado').probabilidade * 100, 2)}%`],
            ['Baixo', '79,68%', `${n(por(credito, 'Baixo').probabilidade * 100, 2)}%`],
          ],
          'O slide arredonda os produtos antes de dividir (0,0052 e soma 0,0645); sem arredondar no meio, dá a coluna da direita. A classe vencedora é a mesma.',
        ),
        nota('fora', 'Os slides não explicam o "ingênuo" (independência entre atributos) nem a correção de Laplace para contagens zero. A tabela do slide tem zeros (0/6, 0/5): se um deles entrar no produto, aquela classe fica com probabilidade 0.'),
      ],
      fontes: [f('nb', 'slides 5 e 6')],
    },
    {
      id: 'python',
      titulo: 'Naive Bayes em Python',
      blocos: [
        codigo(`
from sklearn.naive_bayes import GaussianNB
modelo = GaussianNB()
modelo.fit(X_treino, y_treino)
previsoes = modelo.predict(X_teste)
accuracy_score(y_teste, previsoes)   # 0.9666666666666667`, 'NaiveBayes.ipynb'),
        p('Na Iris (atributos numéricos), a matriz foi [[11, 0, 0], [0, 13, 0], [0, 1, 5]]: uma virginica prevista como versicolor. Por isso recall de virginica = 5/6 = 0,83 e precisão de versicolor = 13/14 = 0,93.'),
        nota('fora', 'Como o GaussianNB calcula P(valor | classe) para atributos contínuos não aparece no material.'),
      ],
      fontes: [f('nbNB', 'células 4 a 14')],
    },
  ],
  formulas: [
    { nome: 'Probabilidade da classe', tex: String.raw`P(c) = \frac{n_c}{n}`, fonte: f('nb', 'slide 4') },
    { nome: 'Probabilidade condicional', tex: String.raw`P(x_i = v \mid c) = \frac{n_{v,c}}{n_c}`, nota: 'O denominador é o total da classe, não o total da base.', fonte: f('nb', 'slide 4') },
    { nome: 'Produto e normalização', tex: String.raw`P(c \mid x) = \frac{P(c)\prod_i P(x_i \mid c)}{\sum_k P(k)\prod_i P(x_i \mid k)}`, fonte: f('nb', 'slide 6') },
  ],
  exemplo: {
    titulo: 'Exercício do slide: jogar tênis com Sol, Fria, Normal, sem vento',
    enunciado: [p('Base "Jogar tênis" (9 Sim, 5 Não). Qual a probabilidade de Jogar e de Não jogar para Aparência = Sol, Temperatura = Fria, Umidade = Normal, Ventando = Não? (O slide propõe o exercício sem resposta; a resolução abaixo foi conferida em código.)')],
    passos: [
      { titulo: 'Probabilidades das classes', blocos: [p('P(Sim) = 9/14; P(Não) = 5/14.')] },
      { titulo: 'Contagens condicionais (Sim)', blocos: [p('Entre os 9 Sim: Sol 2, Fria 3, Normal 6, Ventando Não 6 → 2/9, 3/9, 6/9, 6/9.')] },
      { titulo: 'Contagens condicionais (Não)', blocos: [p('Entre os 5 Não: Sol 3, Fria 1, Normal 1, Ventando Não 2 → 3/5, 1/5, 1/5, 2/5.')] },
      {
        titulo: 'Produtos',
        blocos: [
          p(`Sim: ${conta(por(tenisExemplo, 'Sim'))} = **${n(por(tenisExemplo, 'Sim').produto, 5)}**`),
          p(`Não: ${conta(por(tenisExemplo, 'Não'))} = **${n(por(tenisExemplo, 'Não').produto, 5)}**`),
        ],
      },
      {
        titulo: 'Normalização',
        blocos: [
          p(`Soma = ${n(por(tenisExemplo, 'Sim').produto + por(tenisExemplo, 'Não').produto, 5)}.`),
          p(`P(Sim) = ${n(por(tenisExemplo, 'Sim').produto, 5)} / soma = **${n(por(tenisExemplo, 'Sim').probabilidade * 100, 2)}%**; P(Não) = **${n(por(tenisExemplo, 'Não').probabilidade * 100, 2)}%**. Previsão: jogar.`),
        ],
      },
    ],
    fontes: [f('nb', 'slides 8 e 9'), f('introAM', 'slide 3')],
  },
  pegadinhas: [
    { texto: 'Sem normalizar, o número não é probabilidade: 0,0523 não quer dizer 5,23% nem 52,28%. Na Q13 de 2025, as opções B e D são armadilhas desse tipo.', fonte: f('prova', 'Q13') },
    { texto: 'P(valor | classe) divide pelo total da **classe**: P(Médio | Bem sucedido) = 3/9, não 3/17.', fonte: f('nb', 'slide 4') },
    { texto: 'Um único zero zera o produto da classe inteira (a tabela do slide tem 0/6 e 0/5).', fonte: f('nb', 'slide 4') },
    { texto: 'Arredondar no meio muda as casas: o slide dá 12,24%, o exato é 12,27%. Na prova, siga as alternativas e mostre as contas.', fonte: f('nb', 'slide 6') },
    { texto: 'A classe prevista é a de maior produto; normalizar não muda o vencedor, mas é o que a questão pede quando fala em "probabilidade".', fonte: f('nb', 'slide 6') },
  ],
  chefe: { nome: 'O Produto Não Normalizado', fala: '0,0523 de chance? Pode marcar 5,23%, confia.' },
};

export const questoesBayes: Questao[] = [
  {
    id: 'nb-01',
    modulo: 'bayes',
    tipo: 'num',
    nivel: 2,
    enunciado: [p('Base "Jogar tênis" (9 Sim, 5 Não). Novo dia: Aparência = Chuva, Temperatura = Quente, Umidade = Alta, Ventando = Sim.')],
    tabela: {
      cabecalho: ['Classe', 'Produto', 'Probabilidade normalizada'],
      linhas: [
        ['Sim', { campo: 'ps' }, { campo: 'ns' }],
        ['Não', { campo: 'pn' }, { campo: 'nn' }],
      ],
    },
    campos: [
      { id: 'ps', rotulo: 'Produto Sim', resposta: por(tenisQ, 'Sim').produto, tolerancia: 0.001, porque: `${conta(por(tenisQ, 'Sim'))} = ${n(por(tenisQ, 'Sim').produto, 5)}.` },
      { id: 'pn', rotulo: 'Produto Não', resposta: por(tenisQ, 'Não').produto, tolerancia: 0.001, porque: `${conta(por(tenisQ, 'Não'))} = ${n(por(tenisQ, 'Não').produto, 5)}.` },
      { id: 'ns', rotulo: 'P(Sim | x)', resposta: por(tenisQ, 'Sim').probabilidade, porque: 'Produto Sim ÷ (produto Sim + produto Não).' },
      { id: 'nn', rotulo: 'P(Não | x)', resposta: por(tenisQ, 'Não').probabilidade, porque: 'Produto Não ÷ soma. As duas somam 1.' },
    ],
    resolucao: [
      p(`Sim: ${conta(por(tenisQ, 'Sim'))} = ${n(por(tenisQ, 'Sim').produto, 5)}.`),
      p(`Não: ${conta(por(tenisQ, 'Não'))} = ${n(por(tenisQ, 'Não').produto, 5)}.`),
      p(`Normalizando: Sim = ${n(por(tenisQ, 'Sim').probabilidade * 100, 2)}%, Não = ${n(por(tenisQ, 'Não').probabilidade * 100, 2)}%. Previsão: não jogar.`),
      nota('info', 'Os produtos têm tolerância de ±0,001 aqui, porque são números pequenos.'),
    ],
    fontes: [f('nb', 'slides 8 e 9')],
  },
  {
    id: 'nb-02',
    modulo: 'bayes',
    tipo: 'num',
    nivel: 3,
    enunciado: [p('Base de risco de crédito do slide. Novo cliente: História = Ruim, Dívida = Baixa, Garantias = Adequada, Renda = >35000. Calcule a probabilidade normalizada de cada risco.')],
    campos: [
      { id: 'alto', rotulo: 'P(Alto | x)', resposta: por(creditoZero, 'Alto').probabilidade, porque: 'P(Adequada | Alto) = 0/6: o produto de Alto é zero.' },
      { id: 'mod', rotulo: 'P(Moderado | x)', resposta: por(creditoZero, 'Moderado').probabilidade, porque: '3/14 · 1/3 · 2/3 · 1/3 · 1/3 é o único produto diferente de zero; normalizado vira 1.' },
      { id: 'baixo', rotulo: 'P(Baixo | x)', resposta: por(creditoZero, 'Baixo').probabilidade, porque: 'P(Ruim | Baixo) = 0/5: produto zero.' },
    ],
    resolucao: [
      lista(
        `Alto: ${conta(por(creditoZero, 'Alto'))} = 0`,
        `Moderado: ${conta(por(creditoZero, 'Moderado'))} = ${n(por(creditoZero, 'Moderado').produto, 5)}`,
        `Baixo: ${conta(por(creditoZero, 'Baixo'))} = 0`,
      ),
      p('Só Moderado sobra: depois de normalizar, 100%. Um zero na tabela elimina a classe inteira.'),
    ],
    fontes: [f('nb', 'slide 4')],
  },
  {
    id: 'nb-03',
    modulo: 'bayes',
    tipo: 'mc',
    nivel: 1,
    enunciado: [p('Num problema com duas classes, os produtos P(c)·ΠP(xᵢ|c) deram 0,06 para "Aprovado" e 0,02 para "Reprovado". Qual a probabilidade de "Aprovado"?')],
    opcoes: ['6%', '60%', '75%', '25%'],
    correta: 2,
    explicacao: [p('Normaliza: 0,06 / (0,06 + 0,02) = 0,75 = 75%. Dizer 6% é esquecer a normalização.')],
    fontes: [f('nb', 'slide 6')],
  },
  {
    id: 'nb-04',
    modulo: 'bayes',
    tipo: 'mc',
    nivel: 2,
    enunciado: [p('Na base de 17 alunos da prova de 2025 (9 "Bem sucedido", 8 "Mal sucedido"), 3 dos 9 bem-sucedidos têm Raciocínio Lógico = Médio. Qual valor entra no produto da classe "Bem sucedido"?')],
    opcoes: ['3/17', '3/9', '9/17', '6/17'],
    correta: 1,
    explicacao: [p('P(valor | classe) divide pelo total da classe: 3/9. O 9/17 é a probabilidade da classe, que entra uma vez só no produto.')],
    fontes: [f('nb', 'slide 4'), f('prova', 'Q13')],
  },
  {
    id: 'nb-05',
    modulo: 'bayes',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes('Sobre o Naive Bayes como apresentado em aula:', [
      'Para avaliar um registro novo, multiplica-se a probabilidade da classe pelas probabilidades condicionais de cada valor do registro.',
      'Para obter as probabilidades de cada classe, divide-se cada produto pela soma de todos os produtos.',
      'Se uma das probabilidades condicionais for 0, o produto daquela classe também será 0.',
    ]),
    opcoes: ['Apenas I', 'Apenas I e II', 'Apenas II e III', 'I, II e III', 'Todas estão incorretas'],
    correta: 3,
    explicacao: analise([
      ['I', true, 'P(alto) = 6/14 · 1/6 · 4/6 · 6/6 · 1/6 (slide 6).'],
      ['II', true, 'P(alto) = 0,0079 / 0,0645 (slide 6).'],
      ['III', true, 'Qualquer fator zero zera a multiplicação; a tabela do slide tem zeros.'],
    ]),
    fontes: [f('nb', 'slides 4 a 6')],
  },
  {
    id: 'nb-06',
    modulo: 'bayes',
    tipo: 'num',
    nivel: 3,
    enunciado: [p('Base de 17 alunos da Q13 de 2025. Registro novo: Raciocínio Lógico = Alto, Horas de Estudo = Pouco, Iniciativa = Não.')],
    tabela: {
      cabecalho: ['Classe', 'Produto', 'Probabilidade normalizada'],
      linhas: [
        ['Bem sucedido', { campo: 'pb' }, { campo: 'nb' }],
        ['Mal sucedido', { campo: 'pm' }, { campo: 'nm' }],
      ],
    },
    campos: [
      { id: 'pb', rotulo: 'Produto Bem', resposta: por(sucessoQ, 'Bem sucedido').produto, tolerancia: 0.001, porque: `${conta(por(sucessoQ, 'Bem sucedido'))}: "Pouco" nunca aparece com Bem sucedido.` },
      { id: 'pm', rotulo: 'Produto Mal', resposta: por(sucessoQ, 'Mal sucedido').produto, tolerancia: 0.001, porque: `${conta(por(sucessoQ, 'Mal sucedido'))} = ${n(por(sucessoQ, 'Mal sucedido').produto, 5)}.` },
      { id: 'nb', rotulo: 'P(Bem | x)', resposta: por(sucessoQ, 'Bem sucedido').probabilidade, porque: 'Produto zero → 0 depois de normalizar.' },
      { id: 'nm', rotulo: 'P(Mal | x)', resposta: por(sucessoQ, 'Mal sucedido').probabilidade, porque: 'Único produto diferente de zero → 1.' },
    ],
    resolucao: [
      p(`Bem sucedido: ${conta(por(sucessoQ, 'Bem sucedido'))} = 0 (P(Pouco | Bem) = 0/9).`),
      p(`Mal sucedido: ${conta(por(sucessoQ, 'Mal sucedido'))} = ${n(por(sucessoQ, 'Mal sucedido').produto, 5)}.`),
      p('Normalizado: Mal sucedido 100%.'),
    ],
    fontes: [f('prova', 'Q13'), f('nb', 'slide 6')],
  },
  {
    id: 'nb-07',
    modulo: 'bayes',
    tipo: 'num',
    nivel: 2,
    enunciado: [
      p('No NaiveBayes.ipynb (Iris), a matriz de confusão foi:'),
      codigo(`array([[11,  0,  0],    # setosa
       [ 0, 13,  0],    # versicolor
       [ 0,  1,  5]])   # virginica`),
    ],
    campos: [
      { id: 'rv', rotulo: 'Recall de virginica', resposta: iris.classes[2].recall, porque: '5 de 6 virginicas reais: 0,8333.' },
      { id: 'pv', rotulo: 'Precisão de versicolor', resposta: iris.classes[1].precisao, porque: 'Coluna versicolor: 13 certos de 14 previstos: 0,9286.' },
      { id: 'ac', rotulo: 'Acurácia', resposta: iris.acuracia, porque: '29 de 30: 0,9667.' },
    ],
    resolucao: [p('O `classification_report` do notebook mostra versicolor 0.93 de precisão e virginica 0.83 de recall; acurácia 0.97.')],
    fontes: [f('nbNB', 'células 11 a 14')],
  },
];
