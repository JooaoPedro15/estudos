import { ARVORE_PROVA_TENIS } from './arvores';
import { ATRIBUTOS_SUCESSO, BASE_SUCESSO_15, BASE_SUCESSO_17, MATRIZ_PROVA_Q7 } from './dados';
import { f } from './fontes';
import { afirmacoes, analise, codigo, lista, n, nota, p, tabela } from './helpers';
import type { QuestaoMC } from './types';
import { entropia, entropiaPonderada, ganhoInformacao, metricasConfusao, naiveBayes, particionar } from '../engine/calc';

export type StatusGabarito = 'conferido' | 'provavel' | 'ambigua';

export type QuestaoProva = QuestaoMC & {
  numero: number;
  pontos: number;
  status: StatusGabarito;
};

const OPC_I_II_III = ['Apenas I', 'Apenas I e II', 'Apenas I e III', 'I, II e III', 'Todas estão incorretas'];
const fonteQ = (q: number) => f('prova', `Questão ${String(q).padStart(2, '0')}`);

const tabelaBase = (linhas: string[][]) =>
  tabela([...ATRIBUTOS_SUCESSO, 'Sucesso'], linhas.map((l) => [...l]));

const ganhos = [0, 1, 2].map((a) => {
  const part = particionar(BASE_SUCESSO_15, a);
  return { part, ganho: ganhoInformacao(part.grupos), pond: entropiaPonderada(part.grupos) };
});
const q7 = metricasConfusao(MATRIZ_PROVA_Q7);
const q13 = naiveBayes(BASE_SUCESSO_17, ['Médio', 'Moderado', 'Sim']);
const bem = q13.find((c) => c.classe === 'Bem sucedido')!;
const mal = q13.find((c) => c.classe === 'Mal sucedido')!;

const descreve = (a: number) =>
  ganhos[a].part.valores
    .map((v, i) => {
      const [b, m] = ganhos[a].part.grupos[i];
      return `${v}: ${b} bem, ${m} mal (E = ${n(entropia([b, m]))})`;
    })
    .join('; ');

export const PROVA_2025: QuestaoProva[] = [
  {
    id: 'p25-01',
    numero: 1,
    pontos: 1.5,
    status: 'conferido',
    modulo: 'arvore',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes('Sobre os critérios de divisão utilizados nos algoritmos ID3, C4.5 e CART, analise as afirmações a seguir:', [
      'O ID3 utiliza o ganho de informação como métrica de divisão, o que pode favorecer atributos com muitos valores distintos.',
      'O C4.5 resolve a limitação do ID3 ao utilizar a razão de ganho (gain ratio), que normaliza o ganho de informação.',
      'O CART é um algoritmo de árvore muito melhor que o C4.5, pois encontra árvores com muito mais rapidez e melhores métricas de predição.',
    ]),
    opcoes: ['Apenas I', 'Apenas I e II', 'Apenas II e III', 'I, II e III', 'Todas estão incorretas'],
    correta: 1,
    explicacao: analise([
      ['I', true, 'Caso do atributo ID: ganho máximo sem utilidade (Parte 3, slides 47 e 48).'],
      ['II', true, 'Parte 3, slide 46: a razão de ganho normaliza o ganho considerando o número de valores distintos.'],
      ['III', false, 'Nada no material compara assim CART e C4.5; é afirmação absoluta sem base.'],
    ]),
    fontes: [fonteQ(1), f('ad3', 'slides 46 a 49')],
  },
  {
    id: 'p25-02',
    numero: 2,
    pontos: 1.5,
    status: 'conferido',
    modulo: 'arvore',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes('A respeito do tratamento de atributos contínuos e dados faltantes nos algoritmos de árvore de decisão:', [
      'O ID3 não lida diretamente com atributos contínuos; é necessário discretizá-los previamente.',
      'O CART não consegue lidar com valores ausentes em seus dados de entrada.',
      'O C4.5 pode lidar com atributos contínuos dinamicamente, encontrando pontos de corte durante o treinamento.',
    ]),
    opcoes: OPC_I_II_III,
    correta: 2,
    explicacao: [
      ...analise([
        ['I', true, 'Limitação do ID3 (Parte 3, slide 42).'],
        ['II', false, 'Considerada falsa no gabarito.'],
        ['III', true, 'C4.5 cria um limiar e divide em ≤ e > (slides 45 e 52).'],
      ]),
      nota('fora', 'Os slides não explicam como o CART trata ausentes; o gabarito só indica que a afirmação II é falsa.'),
    ],
    fontes: [fonteQ(2), f('ad3', 'slides 42, 45 e 52')],
  },
  {
    id: 'p25-03',
    numero: 3,
    pontos: 1.5,
    status: 'conferido',
    modulo: 'arvore',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes('Sobre a capacidade dos algoritmos em lidar com diferentes tipos de dados e problemas:', [
      'O ID3 foi originalmente desenvolvido para lidar com atributos categóricos e requer discretização para variáveis contínuas.',
      'O C4.5 introduz mecanismos para lidar com atributos contínuos e dados faltantes, sem necessidade de pré-processamento manual.',
      'O CART lida apenas com problemas de classificação, enquanto C4.5 pode ser usado para regressão.',
    ]),
    opcoes: ['Apenas I e II', 'Apenas II e III', 'Apenas I e III', 'Todas estão corretas', 'Apenas I está incorreta'],
    correta: 0,
    explicacao: analise([
      ['I', true, 'Parte 3, slide 42.'],
      ['II', true, 'Parte 3, slide 45.'],
      ['III', false, 'É o inverso: CART faz classificação e regressão (slide 56); C4.5 aparece no histórico como árvore de classificação (Parte 1, slide 6).'],
    ]),
    fontes: [fonteQ(3), f('ad3', 'slides 42, 45 e 56'), f('ad1', 'slide 6')],
  },
  {
    id: 'p25-04',
    numero: 4,
    pontos: 1.5,
    status: 'conferido',
    modulo: 'ensemble',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes('Sobre o funcionamento interno do algoritmo Random Forest, analise as afirmações a seguir:', [
      'Em cada nó de uma árvore da Random Forest, todos os atributos disponíveis são considerados para encontrar a melhor divisão, o que melhora a precisão do modelo.',
      'Durante o treinamento de uma Random Forest, cada árvore da floresta é construída com uma amostra diferente da base de dados original, obtida por bootstrapping.',
      'O uso de subconjuntos aleatórios de atributos por nó ajuda a reduzir a correlação entre as árvores, aumentando a diversidade da floresta.',
    ]),
    opcoes: ['Apenas I e II', 'Apenas II e III', 'Apenas I e III', 'Todas estão corretas', 'Apenas I está incorreta'],
    correta: 1,
    explicacao: [
      ...analise([
        ['I', false, 'Em cada nó são sorteados só m atributos (Ensemble, slides 25 a 27).'],
        ['II', true, 'Bootstrap (slide 27).'],
        ['III', true, 'Diversidade é condição para o ensemble funcionar (slide 5).'],
      ]),
      nota('alerta', 'Repare: "Apenas I está incorreta" (E) diz o mesmo que B. O gabarito oficial marca B.'),
    ],
    fontes: [fonteQ(4), f('ens', 'slides 5 e 25 a 27')],
  },
  {
    id: 'p25-05',
    numero: 5,
    pontos: 1.5,
    status: 'conferido',
    modulo: 'ensemble',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes(
      [
        p('Considere o seguinte trecho de código:'),
        codigo(`from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
clf = RandomForestClassifier(n_estimators=100, max_features=2, random_state=0)
clf.fit(X_train, y_train)`),
        p('Com base neste código, analise as seguintes afirmações:'),
      ],
      [
        'O parâmetro max_features=2 limita o número de atributos considerados por divisão em cada árvore para 2.',
        'O conjunto de teste reservado é muito alto, o que afetará negativamente o desempenho do modelo.',
        'O modelo está sujeito a aleatoriedade mesmo com random_state=0, pois o número de árvores é pequeno.',
      ],
    ),
    opcoes: ['Apenas I', 'Apenas II e III', 'Apenas I e III', 'Todas estão corretas', 'Todas estão incorretas'],
    correta: 0,
    explicacao: analise([
      ['I', true, 'É o m atributos por nó do RF.'],
      ['II', false, '30% de teste não é absurdo e nada garante piora; afirmação sem base.'],
      ['III', false, 'random_state fixa a aleatoriedade; 100 árvores não é "pequeno".'],
    ]),
    fontes: [fonteQ(5), f('ens', 'slides 27 a 30')],
  },
  {
    id: 'p25-06',
    numero: 6,
    pontos: 1.5,
    status: 'conferido',
    modulo: 'preproc',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes(
      [
        p('Considere o seguinte trecho de código:'),
        codigo(`from imblearn.over_sampling import SMOTE
from sklearn.model_selection import train_test_split

X_treino, X_teste, y_treino, y_teste = train_test_split(X_prev, y_classe, test_size = 0.20, random_state = 42)
smote = SMOTE(random_state=42)
X_treino_res, y_treino_res = smote.fit_resample(X_treino, y_treino)`),
        p('Com base neste código, analise as seguintes afirmações:'),
      ],
      [
        'O parâmetro k_neighbors=5 indica que cada nova amostra será gerada com base em 5 vizinhos da classe majoritária.',
        'O novo conjunto X_res terá o dobro do tamanho original se houver duas classes desbalanceadas.',
        'O SMOTE cria exemplos sintéticos da classe minoritária com base nos vizinhos mais próximos.',
      ],
    ),
    opcoes: ['Apenas I', 'Apenas II e III', 'Apenas III', 'Todas estão corretas', 'Todas estão incorretas'],
    correta: 2,
    explicacao: [
      ...analise([
        ['I', false, 'Os vizinhos usados são da classe minoritária (afirmação III).'],
        ['II', false, 'A minoritária sobe até a majoritária; no notebook, 228 → 330, não 456.'],
        ['III', true, 'Definição usada em aula.'],
      ]),
      nota('fora', 'O valor padrão k_neighbors = 5 não aparece no material; o código da questão nem passa esse parâmetro.'),
    ],
    fontes: [fonteQ(6), f('bal', 'slide 10'), f('nbCodifica', 'células 78 a 82')],
  },
  {
    id: 'p25-07',
    numero: 7,
    pontos: 1.5,
    status: 'conferido',
    modulo: 'arvore',
    tipo: 'mc',
    nivel: 2,
    enunciado: [
      p('Considere a seguinte matriz de confusão obtida com o classificador Random Forest para um problema de 3 classes A, B, C:'),
      tabela(['', 'Predito: A', 'Predito: B', 'Predito: C'], MATRIZ_PROVA_Q7.map((l, i) => [`Real: ${'ABC'[i]}`, ...l.map(String)])),
      p('Calcule a Taxa de Falsos Negativos (TFN) da classe B. **Importante:** é necessário mostrar os cálculos.'),
    ],
    opcoes: ['0,15', '0,12', '0,11', '0,17', '0,33'],
    correta: 3,
    explicacao: [
      p('TFN é por **linha** (classe real). Linha B: 5 + 50 + 5 = 60 instâncias; erros = 5 (previstas A) + 5 (previstas C) = 10.'),
      p(`TFN(B) = 10/60 = **${n(q7.classes[1].tfn)} ≈ 0,17**. Complementar: TVP(B) = 50/60 = ${n(q7.classes[1].tvp)}.`),
      nota('alerta', 'Quem soma a coluna B (5 + 3 = 8) calcula FP, não FN.'),
    ],
    fontes: [fonteQ(7), f('ad5', 'slides 4 e 5')],
  },
  {
    id: 'p25-08',
    numero: 8,
    pontos: 1.5,
    status: 'conferido',
    modulo: 'arvore',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes(
      [
        p('Considere a árvore abaixo, obtida a partir do algoritmo DecisionTreeClassifier do Python a partir da base de dados que possui os seguintes atributos: outlook, temperature, humidity, windy, além da classe "Jogar tênis ou não".'),
        p('Os atributos possuem os seguintes tipos: Outlook: Sunny, overcast e rainy; Temperature: hot, mild e cool; Humidity: high e normal; Windy: False e True; Classe: Yes (jogar) e No (não jogar). Considere ainda que a codificação utilizada foi a LabelEncoder, por ordem alfabética, em todos os atributos.'),
        { tipo: 'arvore', arvore: ARVORE_PROVA_TENIS, nomesClasses: ['no', 'yes'] },
        p('Sobre os nós-folha da árvore, analise:'),
      ],
      [
        'Algumas folhas possuem entropia maior que zero, indicando impureza.',
        'A profundidade 3 não foi suficiente para separar completamente todas as classes.',
        'Todas as folhas da árvore possuem número igual de exemplos das classes "yes" e "no".',
      ],
    ),
    opcoes: ['Apenas I', 'Apenas I e II', 'Apenas III', 'Todas estão corretas', 'Todas estão incorretas'],
    correta: 1,
    explicacao: analise([
      ['I', true, 'Duas folhas com entropy = 1.0 (value [1, 1]).'],
      ['II', true, 'Há folhas impuras no nível 3.'],
      ['III', false, 'Só duas folhas são [1, 1]; as outras são puras ([0, 4], [3, 0], [0, 3]).'],
    ]),
    fontes: [fonteQ(8)],
  },
  {
    id: 'p25-09',
    numero: 9,
    pontos: 1.5,
    status: 'ambigua',
    modulo: 'arvore',
    tipo: 'mc',
    nivel: 3,
    enunciado: afirmacoes('Sobre o caminho de decisão para a predição da classe "no" da questão anterior, considere:', [
      'A árvore classifica como "no" todos os exemplos onde outlook = sunny e humidity = high.',
      'A presença de windy = True em dias de chuva (rainy) leva à predição "no".',
      'temperature não é usada em nenhum dos caminhos que resultam em predição da classe "no".',
    ]),
    opcoes: ['Apenas I', 'Apenas I e II', 'Apenas III', 'Todas estão corretas', 'Todas estão incorretas'],
    correta: -1,
    explicacao: [
      ...analise([
        ['I', true, 'sunny (2) não é ≤ 0.5; high (0) é ≤ 0.5; sunny não é ≤ 1.5 → folha [3, 0], "no".'],
        ['II', false, 'Leitura estrita: windy só é testado no ramo humidity = normal. Rainy com humidity high vai para a folha [1, 1] sem olhar windy; e as duas folhas "no" envolvidas são empates [1, 1]. Não é windy = True que leva ao "no".'],
        ['III', true, 'temperature não aparece em nenhum nó.'],
      ]),
      nota('alerta', 'Na leitura estrita, só I e III estão corretas, e não há alternativa "Apenas I e III". Se a professora aceitar II (todo dia rainy com windy = True termina em "no"), a resposta seria D. Confirmar com a professora. Esta questão não entra na nota do simulado.'),
    ],
    fontes: [fonteQ(9)],
  },
  {
    id: 'p25-10',
    numero: 10,
    pontos: 1.5,
    status: 'provavel',
    modulo: 'arvore',
    tipo: 'mc',
    nivel: 3,
    enunciado: afirmacoes('Ainda em relação à árvore anterior, analise as afirmações abaixo:', [
      'Esta árvore gerou 4 regras para classificar quem sairá para jogar tênis ou não.',
      'Há duas regras com a mesma cobertura por classe.',
      'A maior cobertura é de 60% e corresponde à classe YES.',
    ]),
    opcoes: ['Apenas I', 'Apenas I e II', 'Apenas II', 'Todas estão corretas', 'Todas estão incorretas'],
    correta: 2,
    explicacao: [
      ...analise([
        ['I', false, 'São 5 folhas, logo 5 regras.'],
        ['II', true, 'As duas folhas [1, 1] (classe no) cobrem cada uma 1 dos 5 "no" = 20%.'],
        ['III', false, 'A cobertura de 60% é da folha [3, 0]: 3 dos 5 exemplos "no". É classe NO, não YES. A maior cobertura de yes é a folha [0, 4]: 4/9 = 44%.'],
      ]),
      nota('alerta', 'Gabarito provável (C). Depende da definição de "cobertura por classe" (exemplos da classe na folha ÷ total da classe), que é a leitura que faz aparecer o 60%. Confirmar com a professora.'),
    ],
    fontes: [fonteQ(10), f('ra', 'slide 8')],
  },
  {
    id: 'p25-11',
    numero: 11,
    pontos: 1.5,
    status: 'conferido',
    modulo: 'arvore',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes('Em um cenário de classificação com classes desbalanceadas, considere:', [
      'A precisão é insensível ao número de falsos negativos.',
      'O recall é sensível a mudanças no número de falsos positivos.',
      'O F1-score pode ser alto mesmo com precisão ou recall menor, desde que a outra seja muito alta.',
    ]),
    opcoes: ['Apenas I', 'Apenas I e III', 'Apenas II', 'Todas estão corretas', 'Todas estão incorretas'],
    correta: 0,
    explicacao: analise([
      ['I', true, 'Precision = VP/(VP + FP): FN não entra.'],
      ['II', false, 'Recall = VP/(VP + FN): FP não entra.'],
      ['III', false, 'F1 é média harmônica e é puxado para o menor valor: precisão 1 e recall 0,2 dão F1 = 0,33.'],
    ]),
    fontes: [fonteQ(11), f('ad5', 'slides 14 e 15')],
  },
  {
    id: 'p25-12',
    numero: 12,
    pontos: 5.5,
    status: 'conferido',
    modulo: 'arvore',
    tipo: 'mc',
    nivel: 3,
    enunciado: [
      p('Considerando a base de dados abaixo e o algoritmo de Árvore de decisão ID3, qual a raiz da árvore e qual o ganho de informação do atributo, respectivamente?'),
      p('**Obs:** é necessário apresentar todos os cálculos. O dataset possui 15 instâncias e 3 atributos independentes, além de uma variável alvo binária (Sucesso): Raciocínio_Lógico (Baixo, médio e alto), Horas_Estudo (Pouco, Moderado e muito), Iniciativa_Projetos (Sim ou Não) e Sucesso (bem-sucedido ou não).'),
      tabelaBase(BASE_SUCESSO_15),
    ],
    opcoes: [
      'A raiz da árvore é o atributo Raciocinio_Lógico com ganho de 0,62',
      'A raiz da árvore é o atributo Horas_Estudo com ganho de 0,59',
      'A raiz da árvore é o atributo Iniciativa_Projetos com ganho de 0,79',
      'A raiz da árvore é o atributo Raciocinio_Lógico com ganho de 0,52',
      'A raiz da árvore é o atributo Iniciativa_Projetos com ganho de 0,99',
    ],
    correta: 4,
    explicacao: [
      p(`Classe: 8 Bem sucedido, 7 Mal sucedido → E(S) = −(8/15)log₂(8/15) − (7/15)log₂(7/15) = **${n(entropia([8, 7]))}**.`),
      lista(
        `Raciocínio_Lógico — ${descreve(0)}. Ponderada = 6/15·0 + 6/15·${n(entropia([2, 4]))} + 3/15·0 = ${n(ganhos[0].pond)}. Ganho = **${n(ganhos[0].ganho)}**.`,
        `Horas_Estudo — ${descreve(1)}. Ponderada = 6/15·1 = ${n(ganhos[1].pond)}. Ganho = **${n(ganhos[1].ganho)}**.`,
        `Iniciativa_Projetos — ${descreve(2)}. Ponderada = 0. Ganho = **${n(ganhos[2].ganho)}**.`,
      ),
      p(`Raiz: **Iniciativa_Projetos**, ganho ${n(ganhos[2].ganho)} ≈ 0,99 (alternativa E). Ela separa perfeitamente: Sim → todos bem-sucedidos; Não → todos mal-sucedidos.`),
      nota('alerta', 'A alternativa A usa 0,62 para Raciocínio (o valor é 0,6295): é uma armadilha para quem não calcula os três.'),
    ],
    fontes: [fonteQ(12), f('ad3', 'slides 20 a 24')],
  },
  {
    id: 'p25-13',
    numero: 13,
    pontos: 4,
    status: 'conferido',
    modulo: 'bayes',
    tipo: 'mc',
    nivel: 3,
    enunciado: [
      p('Utilizando-se a base seguinte (veja que tem mais 2 instâncias = 17) e o algoritmo Naive Bayes, qual a probabilidade de a pessoa ser bem sucedida ou mal sucedida, respectivamente, para o seguinte registro: **Raciocínio_Lógico médio, Horas_Estudo moderado, Iniciativa_Projetos Sim**?'),
      tabelaBase(BASE_SUCESSO_17),
      p('**Obs:** apresentar os cálculos necessários para a solução da questão.'),
    ],
    opcoes: ['30,15% e 69,85%', '52,28% e 14,70%', '78,05% e 21,95%', '14,70% e 52,28%', '87,10% e 12,91%'],
    correta: 2,
    explicacao: [
      p(`Bem sucedido (9 de 17): 9/17 · P(Médio|Bem) 3/9 · P(Moderado|Bem) 3/9 · P(Sim|Bem) 8/9 = **${n(bem.produto)}**.`),
      p(`Mal sucedido (8 de 17): 8/17 · P(Médio|Mal) 4/8 · P(Moderado|Mal) 4/8 · P(Sim|Mal) 1/8 = **${n(mal.produto)}**.`),
      p(`Normalizando: ${n(bem.produto)} / (${n(bem.produto)} + ${n(mal.produto)}) = **${n(bem.probabilidade * 100, 2)}%**; mal sucedido = **${n(mal.probabilidade * 100, 2)}%**.`),
      nota('alerta', 'As alternativas B e D são os produtos sem normalizar (0,0523 e 0,0147 lidos como "porcentagem"). Normalizar é obrigatório.'),
    ],
    fontes: [fonteQ(13), f('nb', 'slide 6')],
  },
];

export const PONTOS_TOTAIS = PROVA_2025.reduce((acc, q) => acc + q.pontos, 0);
export const PONTOS_VALIDOS = PROVA_2025.filter((q) => q.status !== 'ambigua').reduce((acc, q) => acc + q.pontos, 0);
