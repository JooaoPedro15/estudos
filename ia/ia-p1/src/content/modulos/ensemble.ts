import { f } from '../fontes';
import { afirmacoes, analise, codigo, formula, lista, n, nota, p, tabela } from '../helpers';
import type { Modulo, Questao } from '../types';

/** Acuracia do voto majoritario de 3 classificadores independentes com acuracia `a`. */
export const votoDeTres = (a: number): number => a ** 3 + 3 * a ** 2 * (1 - a);

export const moduloEnsemble: Modulo = {
  id: 'ensemble',
  ordem: 4,
  titulo: 'Random Forest e ensembles',
  curto: 'Random Forest',
  prioridade: 'alta',
  descricao: 'Bagging, bootstrap, boosting, stacking, Random Forest (atributos sorteados por nó), importância de atributos e parâmetros.',
  peso: 'Q4 e Q5 de 2025 (funcionamento interno e código com max_features).',
  resumo: [
    {
      id: 'ensembles',
      titulo: 'O que é um ensemble',
      blocos: [
        p('Métodos que **geram muitos classificadores e combinam os resultados** ("consultar vários especialistas"). Um conjunto de classificadores fracos costuma ser melhor que um único classificador, dada a mesma informação de treino.'),
        p('Condições para funcionar: **diversidade** (classificadores independentes, que idealmente cometem erros diferentes) e **acurácia** (cada base melhor que a classificação aleatória).'),
        p('Exemplo do slide: 3 classificadores com acurácia 0,6. Se cometem **os mesmos erros**, o ensemble fica em 0,6. Se são **independentes**, o ensemble só erra quando pelo menos 2 erram.'),
        p(`Fazendo a conta (não está no slide, mas segue a regra dele): P(pelo menos 2 acertam) = 0,6³ + 3·0,6²·0,4 = ${n(votoDeTres(0.6), 3)}.`),
        p('Combinação das predições: **voto (média)** ou **voto (média) ponderado**.'),
      ],
      fontes: [f('ens', 'slides 3 a 7')],
    },
    {
      id: 'bagging',
      titulo: 'Bagging e bootstrap',
      blocos: [
        lista(
          'Cada classificador é induzido com **uma amostra diferente** do treino, do **mesmo tamanho** do original, gerada por **bootstrap**.',
          'A classe final sai por **votação**.',
          'Tende a **reduzir a variância** dos classificadores base.',
        ),
        { tipo: 'diagrama', id: 'bootstrap' },
        p('**Bootstrap**: r subconjuntos de treino amostrados **com reposição**; um exemplo pode aparecer mais de uma vez. O teste é formado pelos exemplos que não foram sorteados: cerca de **um terço** fica de fora. Normalmente r ≈ 100, por isso é custoso. Estimador mais comum: **e0** (cada treino tem n exemplos). O resultado final é a **média do desempenho** nos subconjuntos de teste.'),
        tabela(['Amostra', 'Sorteados (com reposição)', 'Ficaram de fora'], [['1', 'x1, x6, x3, x5, x3, x1', 'x2, x4'], ['2', 'x3, x4, x1, x5, x5, x1', 'x2, x6'], ['m', 'x1, x2, x4, x2, x6, x4', 'x3, x5']], 'Slide 13, base {x1, ..., x6}. A coluna "ficaram de fora" foi deduzida.'),
      ],
      fontes: [f('ens', 'slides 8 a 14')],
    },
    {
      id: 'boosting',
      titulo: 'Boosting, stacking e XGBoost',
      blocos: [
        p('**Boosting** (AdaBoost é o mais conhecido): a cada iteração induz um classificador e **pondera cada exemplo** pelo desempenho; quanto mais difícil de aprender, **maior o peso**. Funciona de forma semelhante à minimização por gradiente descendente.'),
        { tipo: 'diagrama', id: 'boosting', legenda: 'Slide 16: exemplos classificados incorretamente (I) ganham peso na rodada seguinte.' },
        p('Indicado para classificadores base **fracos** (pouco melhores que o palpite); converge rápido; **pouco indicado para dados com ruído e bases pequenas**, por focar nos exemplos difíceis.'),
        p('**Stacking**: um algoritmo estimador (de AM) aprende a combinar as predições dos modelos base, que podem ser homogêneos ou heterogêneos.'),
        p('**XGBoost** (Extreme Gradient Boosting): combina árvores geradas pelo CART e pondera a resposta de cada árvore para reduzir a complexidade do modelo final.'),
      ],
      fontes: [f('ens', 'slides 15 a 20')],
    },
    {
      id: 'rf',
      titulo: 'Random Forest',
      blocos: [
        p('Proposto por **Breiman (2001)**: constrói muitas árvores de decisão e classifica um novo exemplo por **voto majoritário**. Usa amostragem **bootstrap**.'),
        { tipo: 'diagrama', id: 'bagging-rf', legenda: 'Slide 25: a diferença do RF para o bagging é o sorteio de m atributos para a divisão de cada nó.' },
        lista(
          'Treina cada árvore com uma amostra bootstrap.',
          'Considera só **m variáveis sorteadas** (de p). No algoritmo de Breiman (slide 26), o sorteio acontece **em cada nó**: "select m variables at random from the p variables", escolhe a melhor e divide o nó em dois.',
          '**Não faz poda.**',
          'Resultado: **voto majoritário** (classificação) ou **média** (regressão).',
          'Quantos atributos: alguns métodos usam a **raiz quadrada** do número de atributos; outros, o **log**.',
          'Desvantagem: difícil extrair conhecimento das árvores, embora o método mostre os **atributos mais relevantes**. Para explicabilidade: SHAP e LIME.',
        ),
        p('O sorteio por nó reduz a correlação entre as árvores e aumenta a diversidade da floresta (afirmação III da Q4 de 2025, correta).'),
      ],
      fontes: [f('ens', 'slides 21 a 32'), f('prova', 'Q4')],
    },
    {
      id: 'codigo-rf',
      titulo: 'RF em Python: parâmetros e importância',
      blocos: [
        codigo(`
from sklearn.ensemble import RandomForestClassifier
modelo = RandomForestClassifier(n_estimators=80, max_features=3, criterion='gini', random_state=42)
modelo.fit(X_treino, y_treino)
# saída: RandomForestClassifier(max_features=3, n_estimators=80, random_state=42)

importancias = modelo.feature_importances_
indices_ordenados = np.argsort(importancias)[::-1]   # do mais para o menos importante`, 'Random_Forest.ipynb, células 5 e 16'),
        tabela(
          ['Parâmetro', 'O que controla'],
          [
            ['`n_estimators`', 'Número de árvores da floresta'],
            ['`max_features`', 'Quantos atributos são considerados em cada divisão (int, \'sqrt\', \'log2\' ou fração)'],
            ['`criterion`', '\'gini\' ou \'entropy\''],
            ['`max_depth`', 'Profundidade máxima de cada árvore'],
            ['`random_state`', 'Semente: fixa a aleatoriedade e torna o resultado reproduzível'],
          ],
        ),
        p('Repare na saída do `fit`: `criterion=\'gini\'` não aparece porque o sklearn só imprime parâmetros diferentes do padrão. Gini é o padrão.'),
        p('Bagging no notebook: `BaggingClassifier(base_estimator=SVC(), n_estimators=10, random_state=0)`. O classificador base pode ser qualquer um (aqui, SVM). A saída mostra `BaggingClassifier(base_estimator=SVC(), random_state=0)`: n_estimators=10 sumiu porque é o padrão.'),
        p('Valores usados nos notebooks: `RandomForestClassifier(n_estimators=100, max_features=6, criterion=\'gini\', random_state=0)` (câncer), `n_estimators=30, max_depth=5, max_features="sqrt"` (validação cruzada), `criterion=\'entropy\', max_depth=10, n_estimators=100` (presos).'),
        nota('info', 'Slide 33: "Lembrar de ajustar os hiperparâmetros". O GridSearchCV do notebook de árvore é o exemplo de otimizador.'),
      ],
      fontes: [f('ens', 'slides 30 a 33'), f('nbRF', 'células 5 e 16'), f('nbBagging', 'célula 4'), f('nbCodifica', 'célula 53'), f('nbCV', 'célula 7'), f('nbPresos', 'célula 2')],
    },
  ],
  formulas: [
    { nome: 'Voto de 3 classificadores independentes', tex: String.raw`Ac_{ens} = a^3 + 3a^2(1-a)`, nota: 'Derivado da regra do slide 6 ("erra só se pelo menos 2 erram"). a = 0,6 → 0,648.', fonte: f('ens', 'slide 6') },
    { nome: 'Atributos por nó', tex: String.raw`m = \sqrt{p} \quad\text{ou}\quad m = \log p`, nota: 'O slide não fixa a base do log.', fonte: f('ens', 'slide 29') },
    { nome: 'Saída da floresta', tex: String.raw`\hat{y} = \text{voto majoritário}\{T_b(x)\} \qquad \hat{y} = \tfrac{1}{B}\sum_{b=1}^{B} T_b(x)`, nota: 'Classificação: voto. Regressão: média.', fonte: f('ens', 'slides 26 e 27') },
  ],
  exemplo: {
    titulo: 'Por que diversidade importa: 3 classificadores com acurácia 0,6',
    enunciado: [p('Três classificadores, cada um com acurácia 0,6, votam por maioria. Compare o ensemble quando eles erram nos mesmos exemplos e quando são independentes.')],
    passos: [
      { titulo: 'Mesmos erros', blocos: [p('Se os três erram sempre nos mesmos exemplos, o voto repete o erro: acurácia do ensemble = **0,6** (slide 6).')] },
      { titulo: 'Independentes: quando o voto acerta', blocos: [p('Com 3 votos, a maioria acerta se pelo menos 2 acertam. Casos: os 3 acertam, ou exatamente 2 acertam (3 combinações).')] },
      { titulo: 'Os 3 acertam', blocos: [formula(String.raw`0{,}6^3 = 0{,}216`)] },
      { titulo: 'Exatamente 2 acertam', blocos: [formula(String.raw`3 \times 0{,}6^2 \times 0{,}4 = 0{,}432`)] },
      { titulo: 'Total', blocos: [p(`0,216 + 0,432 = **${n(votoDeTres(0.6), 3)}** > 0,6. A diversidade melhora o resultado. É por isso que o RF sorteia atributos por nó: árvores menos parecidas erram em lugares diferentes.`)] },
    ],
    fontes: [f('ens', 'slides 5 e 6'), f('prova', 'Q4')],
  },
  pegadinhas: [
    { texto: 'O RF **não** considera todos os atributos em cada nó: sorteia m atributos **por nó** (Q4 de 2025, I falsa).', fonte: f('ens', 'slides 25 e 26') },
    { texto: 'Bootstrap é **com reposição** e do mesmo tamanho: o mesmo exemplo pode aparecer várias vezes; cerca de 1/3 fica de fora.', fonte: f('ens', 'slide 9') },
    { texto: 'Random Forest **não faz poda**.', fonte: f('ens', 'slide 27') },
    { texto: '`max_features=2` limita a 2 os atributos considerados por divisão (Q5 de 2025, I correta).', fonte: f('prova', 'Q5') },
    { texto: '`random_state` fixa a aleatoriedade: com ele, rodar de novo dá o mesmo resultado. 100 árvores não é "pouco" (Q5, III falsa).', fonte: f('prova', 'Q5') },
    { texto: 'Bagging reduz variância; boosting foca nos difíceis e sofre com ruído e bases pequenas.', fonte: f('ens', 'slides 8 e 17') },
    { texto: 'Parâmetro com valor padrão não aparece na saída do `fit`: `criterion=\'gini\'` some porque é o padrão.', fonte: f('nbRF', 'célula 5') },
    { texto: 'Ensemble de classificadores que erram igual não melhora nada.', fonte: f('ens', 'slide 6') },
    { texto: 'Regressão no RF: **média** das árvores; classificação: voto majoritário.', fonte: f('ens', 'slide 27') },
  ],
  chefe: { nome: 'A Floresta Sombria', fala: 'Cem árvores, nenhuma podada. Você sabe o que cada uma sorteou?' },
};

export const questoesEnsemble: Questao[] = [
  {
    id: 'ens-01',
    modulo: 'ensemble',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes(
      [
        p('Uma base tem 9 atributos. Considere:'),
        codigo(`clf = RandomForestClassifier(n_estimators=50, max_features='sqrt', criterion='entropy', random_state=7)
clf.fit(X_treino, y_treino)`),
      ],
      [
        'Em cada divisão de cada árvore, são considerados 3 atributos sorteados.',
        'Cada uma das 50 árvores é treinada com uma amostra bootstrap do treino.',
        'Ao final, a floresta poda cada árvore para evitar overfitting.',
      ],
    ),
    opcoes: ['Apenas I', 'Apenas I e II', 'Apenas II e III', 'I, II e III', 'Todas estão incorretas'],
    correta: 1,
    explicacao: analise([
      ['I', true, '√9 = 3 atributos por divisão (raiz quadrada da quantidade de atributos, slide 29).'],
      ['II', true, 'O RF treina cada árvore com amostras bootstrap (slide 27).'],
      ['III', false, '"Random Forest não faz poda" (slide 27).'],
    ]),
    fontes: [f('ens', 'slides 27 e 29')],
  },
  {
    id: 'ens-02',
    modulo: 'ensemble',
    tipo: 'num',
    nivel: 3,
    enunciado: [p('Três classificadores **independentes**, cada um com acurácia 0,7, votam por maioria. Qual a acurácia do ensemble? E se os três cometessem exatamente os mesmos erros?')],
    campos: [
      { id: 'ind', rotulo: 'Acurácia do ensemble (independentes)', resposta: votoDeTres(0.7), porque: '0,7³ + 3·0,7²·0,3 = 0,343 + 0,441 = 0,784.' },
      { id: 'mesmos', rotulo: 'Acurácia (mesmos erros)', resposta: 0.7, porque: 'Votos iguais repetem o mesmo erro: 0,7.' },
    ],
    resolucao: [p(`O voto acerta quando pelo menos 2 acertam: todos acertam (0,343) ou exatamente 2 (3 × 0,49 × 0,3 = 0,441). Total ${n(votoDeTres(0.7), 3)}. Com erros idênticos, fica 0,7, como no exemplo do slide 6.`)],
    fontes: [f('ens', 'slide 6')],
  },
  {
    id: 'ens-03',
    modulo: 'ensemble',
    tipo: 'num',
    nivel: 1,
    enunciado: [p('Base de treino {x1, ..., x6}. Uma amostra bootstrap saiu: x2, x2, x5, x1, x5, x6.')],
    campos: [
      { id: 'tam', rotulo: 'Tamanho da amostra', resposta: 6, porque: 'Mesmo tamanho do original: 6.' },
      { id: 'dist', rotulo: 'Exemplos distintos no treino', resposta: 4, porque: 'x1, x2, x5 e x6.' },
      { id: 'fora', rotulo: 'Exemplos que vão para o teste', resposta: 2, porque: 'Os não sorteados: x3 e x4.' },
    ],
    resolucao: [p('Bootstrap: com reposição, mesmo tamanho (6). Repetições (x2 e x5 duas vezes) são permitidas. Os que não saíram (x3, x4) formam o teste. 2 de 6 é um terço, como o slide 9 comenta.')],
    fontes: [f('ens', 'slides 9 e 13')],
  },
  {
    id: 'ens-04',
    modulo: 'ensemble',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes('Sobre bagging e boosting:', [
      'No bagging, cada classificador é induzido com uma amostra bootstrap e a classe é definida por votação.',
      'No boosting, exemplos difíceis de aprender recebem maior peso nas iterações seguintes.',
      'O boosting é especialmente indicado para dados com muito ruído e bases pequenas.',
    ]),
    opcoes: ['Apenas I', 'Apenas I e II', 'Apenas II e III', 'I, II e III', 'Todas estão incorretas'],
    correta: 1,
    explicacao: analise([
      ['I', true, 'Slide 8.'],
      ['II', true, 'Slide 15.'],
      ['III', false, 'Slide 17: "pouco indicado para dados com ruídos e pequenos conjuntos de dados".'],
    ]),
    fontes: [f('ens', 'slides 8, 15 e 17')],
  },
  {
    id: 'ens-05',
    modulo: 'ensemble',
    tipo: 'mc',
    nivel: 1,
    enunciado: [p('No stacking, como as predições dos modelos base são combinadas?')],
    opcoes: [
      'Por voto simples, sempre',
      'Um algoritmo estimador (de AM) aprende a combinar as predições',
      'Pela média dos pesos de cada exemplo, como no AdaBoost',
      'Escolhendo o modelo base com maior acurácia',
    ],
    correta: 1,
    explicacao: [p('Slide 18: "Um algoritmo estimador aprende a combinar predições de modelos base". Os modelos base podem ser homogêneos ou heterogêneos.')],
    fontes: [f('ens', 'slide 18')],
  },
  {
    id: 'ens-06',
    modulo: 'ensemble',
    tipo: 'mc',
    nivel: 2,
    enunciado: [
      codigo(`importancias = modelo.feature_importances_
indices_ordenados = np.argsort(importancias)[::-1]
for idx in indices_ordenados:
    print(f"{nomes_das_features[idx]}: {importancias[idx]}")`),
      p('O que esse trecho imprime?'),
    ],
    opcoes: [
      'Os atributos em ordem alfabética',
      'Os atributos do mais importante para o menos importante, segundo o Random Forest',
      'Os atributos do menos importante para o mais importante',
      'Apenas o atributo mais importante',
    ],
    correta: 1,
    explicacao: [p('`argsort` ordena do menor para o maior; `[::-1]` inverte. O RF não é interpretável árvore a árvore, mas "exibe os atributos mais relevantes" (slide 28).')],
    fontes: [f('nbRF', 'célula 16'), f('ens', 'slides 28 e 31')],
  },
  {
    id: 'ens-07',
    modulo: 'ensemble',
    tipo: 'mc',
    nivel: 2,
    enunciado: [
      p('O notebook executou `RandomForestClassifier(n_estimators=80, max_features=3, criterion=\'gini\', random_state=42)` e o `fit` mostrou:'),
      codigo(`RandomForestClassifier(max_features=3, n_estimators=80, random_state=42)`),
      p('Por que `criterion` não aparece na saída?'),
    ],
    opcoes: ['Porque foi ignorado e o RF usou entropia', 'Porque gini é o valor padrão e a saída só mostra parâmetros diferentes do padrão', 'Porque RF não aceita criterion', 'Porque max_features substitui o criterion'],
    correta: 1,
    explicacao: [p('A mesma coisa acontece no Bagging: `n_estimators=10` sumiu de `BaggingClassifier(base_estimator=SVC(), random_state=0)`. Os parâmetros ocultos estão com o valor padrão.')],
    fontes: [f('nbRF', 'célula 5'), f('nbBagging', 'célula 4')],
  },
  {
    id: 'ens-08',
    modulo: 'ensemble',
    tipo: 'mc',
    nivel: 2,
    enunciado: [p('Qual a diferença entre o funcionamento do bagging (com árvores) e o do Random Forest, segundo o diagrama da professora?')],
    opcoes: [
      'O bagging não usa bootstrap; o RF usa',
      'O RF sorteia m atributos para a divisão de cada nó; o bagging considera todos',
      'O bagging usa voto e o RF usa média em classificação',
      'O RF usa uma única árvore podada',
    ],
    correta: 1,
    explicacao: [p('Nos dois diagramas há amostragem aleatória (bootstrap) e voto majoritário. O que só o RF tem é a "seleção aleatória de m atributos para a divisão do nó".')],
    fontes: [f('ens', 'slides 25 e 26')],
  },
  {
    id: 'ens-09',
    modulo: 'ensemble',
    tipo: 'mc',
    nivel: 1,
    enunciado: [p('Num Random Forest de **regressão**, como sai o valor final?')],
    opcoes: ['Voto majoritário das árvores', 'Média dos valores preditos pelas árvores', 'Valor da árvore com menor erro', 'Mediana dos atributos'],
    correta: 1,
    explicacao: [p('Slide 27: classificação → voto majoritário; regressão → média dos valores preditos.')],
    fontes: [f('ens', 'slide 27')],
  },
  {
    id: 'ens-10',
    modulo: 'ensemble',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes('Sobre ensembles de árvores:', [
      'O XGBoost combina árvores geradas pelo algoritmo CART e pondera a resposta de cada árvore.',
      'Para um ensemble ter bom desempenho, os classificadores base devem ter diversidade e acurácia melhor que a aleatória.',
      'Uma desvantagem do Random Forest é não conseguir indicar quais atributos foram mais relevantes.',
    ]),
    opcoes: ['Apenas I', 'Apenas I e II', 'Apenas II e III', 'I, II e III', 'Todas estão incorretas'],
    correta: 1,
    explicacao: analise([
      ['I', true, 'Slide 20.'],
      ['II', true, 'Slide 5.'],
      ['III', false, 'O slide 28 diz que é difícil extrair conhecimento, "apesar de o método exibir os atributos mais relevantes".'],
    ]),
    fontes: [f('ens', 'slides 5, 20 e 28')],
  },
  {
    id: 'ens-11',
    modulo: 'ensemble',
    tipo: 'num',
    nivel: 1,
    enunciado: [p('Uma base tem 16 atributos. Quantos atributos o RF considera por divisão com `max_features=\'sqrt\'`? E com `max_features=\'log2\'`?')],
    campos: [
      { id: 'sqrt', rotulo: 'sqrt', resposta: 4, porque: '√16 = 4.' },
      { id: 'log', rotulo: 'log2', resposta: 4, porque: 'log₂16 = 4.' },
    ],
    resolucao: [p('Slide 29: raiz quadrada ou log da quantidade de atributos. √16 = 4 e log₂16 = 4. Os valores \'sqrt\' e \'log2\' aparecem no GridSearch do notebook de árvore.')],
    fontes: [f('ens', 'slide 29'), f('nbGrid', 'célula 6')],
  },
];
