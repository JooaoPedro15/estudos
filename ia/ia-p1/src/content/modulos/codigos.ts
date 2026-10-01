import { f } from '../fontes';
import { afirmacoes, analise, codigo, n, nota, p, tabela } from '../helpers';
import type { Bloco, Modulo, Questao, Secao } from '../types';

/** Teste t da planilha "Teste T - AD e RF.xlsx" (aba "Teste t AD e RF"). */
export const TESTE_T = (() => {
  const [n1, m1, s1] = [96, 0.93, 0.06];
  const [n2, m2, s2] = [96, 0.94, 0.05];
  const t = (m1 - m2) / Math.sqrt(s1 ** 2 / n1 + s2 ** 2 / n2);
  return { t, gl: n1 + n2 - 2, critico: 1.9725281820013127 };
})();

type FichaNotebook = {
  id: string;
  arquivo: Parameters<typeof f>[0];
  titulo: string;
  prioridade?: 'baixa';
  faz: string;
  parametros: string;
  pegadinhas: string;
  trecho?: string;
  onde: string;
};

const ficha = (x: FichaNotebook): Secao => {
  const blocos: Bloco[] = [];
  if (x.prioridade === 'baixa') blocos.push(nota('info', 'Prioridade baixa: fora do aviso oficial da prova. Leia só para reconhecer o código.'));
  blocos.push(
    tabela(['', ''], [
      ['O que faz', x.faz],
      ['Parâmetros que podem cair', x.parametros],
      ['Pegadinhas', x.pegadinhas],
    ]),
  );
  if (x.trecho) blocos.push(codigo(x.trecho));
  return { id: x.id, titulo: x.titulo, blocos, fontes: [f(x.arquivo, x.onde)] };
};

export const moduloCodigos: Modulo = {
  id: 'codigos',
  ordem: 7,
  titulo: 'Códigos Python mostrados em sala',
  curto: 'Códigos Python',
  prioridade: 'alta',
  descricao: 'Uma ficha por notebook: o que faz, parâmetros que podem cair e pegadinhas.',
  peso: 'Q5 e Q6 de 2025 foram leitura de código; a árvore da Q8 é saída de DecisionTreeClassifier.',
  resumo: [
    ficha({
      id: 'restaurante',
      arquivo: 'nbRest',
      titulo: 'AD_Restaurante_codifica_treina_e_avalia',
      faz: 'Lê restaurante.csv; separa X (todas menos a última) e Y (última); codifica Sim/Nao em 1/0 detectando as colunas automaticamente; mapeia Cliente, Preço e Tempo em ordem; One-Hot em Tipo; holdout 80/20; treina árvore com entropia; avalia com acurácia, matriz (yellowbrick) e classification_report; desenha a árvore.',
      parametros: '`train_test_split(test_size=0.20, random_state=42)` → 9 treino / 3 teste. `DecisionTreeClassifier(criterion=\'entropy\', random_state=42)`. `pd.get_dummies(X, columns=[\'Tipo\'], dtype=int)` → 13 colunas. Acurácia 66,67% (2 de 3).',
      pegadinhas: 'O mapa de Cliente aceita "Algum" e "Alguns". O SettingWithCopyWarning é aviso, não erro (X é fatia de base). O ConfusionMatrix do yellowbrick refaz o fit no treino e o `score` devolve a acurácia (0,6667). A árvore tem raiz em Tempo, não em Cliente, porque só 9 instâncias treinam; leia os limiares pelos códigos (Tempo <= 2.5 separa só ">60").',
      trecho: `mapa_cliente = {'Nenhum': 0, 'Algum': 1, 'Alguns': 1, 'Cheio': 2}
X['Cliente'] = X['Cliente'].map(mapa_cliente)
X = pd.get_dummies(X, columns=['Tipo'], dtype=int)
X_treino, X_teste, y_treino, y_teste = train_test_split(X, Y, test_size=0.20, random_state=42)
arvore = DecisionTreeClassifier(criterion='entropy', random_state=42)`,
      onde: 'células 2 a 23',
    }),
    ficha({
      id: 'codifica',
      arquivo: 'nbCodifica',
      titulo: 'Codifica imputa e balanceia',
      faz: 'Base de câncer (286 linhas): troca "?" por NaN, conta ausentes, imputa pela moda, mostra as 6 formas de `dropna`, aplica LabelEncoder, faz holdout, treina RF sem balancear, depois com TomekLinks e com SMOTE, comparando métricas.',
      parametros: '`replace(\'?\', np.nan)`; `fillna(base[col].mode()[0])`; `dropna(how=\'any\'|\'all\', subset=..., axis=\'columns\', thresh=...)`; `train_test_split(test_size=0.20, random_state=0)` → 228/58; `RandomForestClassifier(n_estimators=100, max_features=6, criterion=\'gini\', random_state=0)`; `TomekLinks(sampling_strategy=\'auto\')`; `SMOTE(sampling_strategy=\'minority\')`.',
      pegadinhas: 'Sem o replace, `isnull().sum()` dá zero. TomekLinks: 165/63 → 153/63 (não iguala). SMOTE: 165/63 → 165/165 (330). Acurácias: 0,707 (sem balancear), 0,707 (Tomek), 0,690 (SMOTE): balancear não garante acurácia maior, mas o recall de recurrence subiu de 0,36 para 0,41.',
      onde: 'células 9 a 88',
    }),
    ficha({
      id: 'iris',
      arquivo: 'nbIris',
      titulo: 'Lendo_e_tratando_arquivo_IRIS',
      faz: 'Lê irisalterado.csv (151 linhas); imputa ausentes pela média da mesma classe; remove redundantes e inconsistentes; describe; normaliza com MinMaxScaler; boxplot e pairplot para outliers; holdout 80/20; salva iris.pkl com pickle.',
      parametros: '`duplicated(subset=atributos, keep=False)`; `drop_duplicates(keep=\'first\')`; `drop_duplicates(subset=..., keep=False)`; `MinMaxScaler().fit_transform`; `train_test_split(test_size=0.20, random_state=42)` → 117/30; `pickle.dump([X_treino, X_teste, y_treino, y_teste], f)`.',
      pegadinhas: 'Inconsistentes saem as duas cópias. Imputação por classe: sepalwidth da linha 0 virou 3,416327 (média das setosas). Ao juntar a classe na base normalizada, o índice desalinhado gerou NaN na linha 143.',
      onde: 'células 5 a 48',
    }),
    ficha({
      id: 'grid',
      arquivo: 'nbGrid',
      titulo: 'DecisionTree_com_gridsearch',
      faz: 'Carrega iris.pkl; testa combinações de hiperparâmetros da árvore com GridSearchCV (validação cruzada de 10 folds); treina uma árvore, avalia e desenha.',
      parametros: 'Grade: criterion (2) × max_depth [None, 2, 4, 6, 8, 10] (6) × max_features [None, \'sqrt\', \'log2\', 0.2, 0.4, 0.6, 0.8] (7) = 84 candidatos; `cv=10` → 840 fits; `n_jobs=5`; `verbose=1`. Melhor: entropy, max_depth 4, sqrt (best_score_ 0,9583).',
      pegadinhas: 'O modelo treinado depois **não** usa os melhores parâmetros: `DecisionTreeClassifier(max_depth=10, criterion=\'gini\', max_features=0.4)`. A saída `DecisionTreeClassifier(max_depth=10, max_features=0.4)` omite gini por ser o padrão.',
      trecho: `params = {'criterion': ['gini', 'entropy'],
          'max_depth': [None, 2, 4, 6, 8, 10],
          'max_features': [None, 'sqrt', 'log2', 0.2, 0.4, 0.6, 0.8]}
modelo = GridSearchCV(estimator=DecisionTreeClassifier(), param_grid=params, cv=10, n_jobs=5, verbose=1)
# Fitting 10 folds for each of 84 candidates, totalling 840 fits`,
      onde: 'células 5 a 19',
    }),
    ficha({
      id: 'cv',
      arquivo: 'nbCV',
      titulo: 'CrossValidationAD_RF',
      faz: 'Compara árvore e Random Forest com validação cruzada de 10 folds no treino da Iris, imprimindo as 10 acurácias, a média e o desvio padrão.',
      parametros: '`KFold(n_splits=10, shuffle=True, random_state=42)`; `DecisionTreeClassifier(criterion=\'gini\', max_depth=3)`; `RandomForestClassifier(n_estimators=30, max_depth=5, max_features="sqrt")`; `cross_val_score(modelo, X_treino, y_treino, cv=kf)`.',
      pegadinhas: 'AD 0,9417 ± 0,0534; RF 0,95 ± 0,0553. A célula de holdout (`modelo.fit` / `modelo.score`) aparece antes de `modelo` ser criado: na ordem do arquivo, daria erro. O RF não tem random_state, então o resultado pode variar entre execuções.',
      onde: 'células 4 a 7',
    }),
    ficha({
      id: 'presos',
      arquivo: 'nbPresos',
      titulo: 'validacao_cruzada_presos',
      faz: 'Separa 10% para teste final; faz KFold manual (10 folds) no restante; em cada fold treina RF, soma precisão, recall e F1 por classe, plota a matriz e guarda o modelo do fold de maior acurácia; no fim testa esse modelo no teste.',
      parametros: '`train_test_split(..., test_size=0.1)`; `RandomForestClassifier(criterion=\'entropy\', max_depth=10, n_estimators=100)`; `KFold(n_splits=10)`; `precision_recall_fscore_support(y_valid, predito, average=None)`; `copy.deepcopy(model)`; médias = soma / 10.',
      pegadinhas: '`iloc[train_index]` porque é DataFrame (comentário do código: numpy usaria take). Sem shuffle no KFold e sem random_state no split. No teste final: classe 1 com precisão 0,44 e recall 0,57 (suporte 7), acurácia 0,75 em 32.',
      onde: 'células 2 a 5',
    }),
    ficha({
      id: 'rf',
      arquivo: 'nbRF',
      titulo: 'Random_Forest',
      faz: 'Carrega iris.pkl (120 treino), treina RF, avalia e lista a importância dos atributos em ordem decrescente com gráfico de barras.',
      parametros: '`RandomForestClassifier(n_estimators=80, max_features=3, criterion=\'gini\', random_state=42)`; `feature_importances_`; `np.argsort(importancias)[::-1]`.',
      pegadinhas: 'A saída do fit omite criterion (gini é padrão). Acurácia 1,0 e matriz diagonal [[10,0,0],[0,9,0],[0,0,11]].',
      onde: 'células 4 a 16',
    }),
    ficha({
      id: 'bagging',
      arquivo: 'nbBagging',
      titulo: 'Bagging',
      faz: 'Treina um BaggingClassifier com SVM como classificador base na Iris.',
      parametros: '`BaggingClassifier(base_estimator=SVC(), n_estimators=10, random_state=0)`.',
      pegadinhas: 'O classificador base pode ser qualquer um (aqui SVC, não árvore). A saída omite n_estimators=10 (padrão). Acurácia 1,0.',
      onde: 'células 4 a 13',
    }),
    ficha({
      id: 'nb',
      arquivo: 'nbNB',
      titulo: 'NaiveBayes',
      faz: 'Treina GaussianNB na Iris e avalia.',
      parametros: '`GaussianNB()` sem parâmetros.',
      pegadinhas: 'Matriz [[11,0,0],[0,13,0],[0,1,5]]: versicolor precisão 0,93, virginica recall 0,83, acurácia 0,9667.',
      onde: 'células 4 a 14',
    }),
    ficha({
      id: 'apriori',
      arquivo: 'nbApriori',
      titulo: 'Apriori',
      faz: 'Lê transações (sem cabeçalho), monta lista de listas, roda `apriori` do apyori e transforma a saída em DataFrame de regras ordenável por lift.',
      parametros: '`pd.read_csv(..., sep=\';\', encoding=\'cp1252\', header=None)`; `apriori(transacoes, min_support=0.3, min_confidence=0.6)`; `sort_values(by=\'lift\', ascending=False)`.',
      pegadinhas: '`str(NaN)` vira o item "nan" (suporte 1,0) e há regras com antecedente vazio: o laço filtra os dois. `len(saida)` = 11 registros, mas só 4 regras sobram.',
      onde: 'células 3 a 19',
    }),
    ficha({
      id: 'ic',
      arquivo: 'nbIC',
      titulo: 'Intervalo_de_confiança (e planilha do teste t)',
      prioridade: 'baixa',
      faz: 'Calcula intervalo de confiança de 95% para F-measure, recall e precisão de cada classe (10 folds) para AD, RNA, RF e SVM. A planilha "Teste T - AD e RF.xlsx" compara as médias de acurácia de AD e RF.',
      parametros: '`st.t.interval(alpha=0.95, df=len(values)-1, loc=np.mean(values), scale=st.sem(values))`. Planilha: n = 96, médias 0,93 e 0,94, desvios 0,06 e 0,05, gl = 190.',
      pegadinhas: `RF tem os intervalos mais altos (F-measure da classe Inferior: 0,661 a 0,895 contra 0,522 a 0,820 da AD). Teste t: t = ${n(TESTE_T.t)}, |t| < ${n(TESTE_T.critico)} (valor crítico): não rejeita a igualdade das médias.`,
      onde: 'células 2 a 22; planilha, aba "Teste t AD e RF"',
    }),
    ficha({
      id: 'rna',
      arquivo: 'nbRNA',
      titulo: 'RNA',
      prioridade: 'baixa',
      faz: 'Treina MLPClassifier na base de câncer; mostra o aviso de não convergência com os padrões e testa max_iter=1000 com verbose.',
      parametros: '`MLPClassifier()` (aviso: 200 iterações sem convergir); `MLPClassifier(max_iter=1000, verbose=True)`; `hidden_layer_sizes`, `activation=\'relu\'`, `solver=\'adam\'`, `tol`.',
      pegadinhas: 'Na célula 10 cria-se `rede_neural` com novos parâmetros, mas o fit é feito em `modelo`: os parâmetros novos não são usados. Acurácia 0,672, matriz [[30,6],[13,9]].',
      onde: 'células 6 a 19',
    }),
    ficha({
      id: 'kmeans',
      arquivo: 'nbKmeans',
      titulo: 'Kmeans',
      prioridade: 'baixa',
      faz: 'Normaliza a Iris com MinMaxScaler, calcula silhouette de k = 2 a 8 e o método do cotovelo (WCSS = inertia_), e agrupa com k = 3.',
      parametros: '`KMeans(n_clusters=k)`, `silhouette_score`, `KneeLocator(..., curve="convex", direction="decreasing")`.',
      pegadinhas: 'Silhouette máximo em k = 2 (0,629) e cotovelo em k = 4, mas o notebook usa k = 3. Agrupamento não usa a classe.',
      onde: 'células 4 a 17',
    }),
  ],
  formulas: [
    { nome: 'Teste t (planilha)', tex: String.raw`t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}} \qquad gl = n_1 + n_2 - 2`, nota: `AD x RF: t = ${n(TESTE_T.t)}; valor crítico (5%) = ${n(TESTE_T.critico)}.`, fonte: f('testeT', 'aba "Teste t AD e RF"') },
    { nome: 'Grid search', tex: String.raw`\text{fits} = \prod \text{(valores de cada parâmetro)} \times cv`, nota: '2 × 6 × 7 × 10 = 840.', fonte: f('nbGrid', 'células 6 e 7') },
    { nome: 'Médias por fold (presos)', tex: String.raw`\bar{m} = \frac{1}{10}\sum_{k=1}^{10} m_k`, nota: 'precision_valid/10, recall_valid/10, fscore_valid/10.', fonte: f('nbPresos', 'célula 4') },
  ],
  exemplo: {
    titulo: 'Reconstruir a matriz de confusão a partir do classification_report',
    enunciado: [
      p('No fim do notebook dos presos, o teste final deu:'),
      codigo(`              precision    recall  f1-score   support
           0       0.87      0.80      0.83        25
           1       0.44      0.57      0.50         7
    accuracy                           0.75        32`),
      p('Monte a matriz de confusão (linhas = real).'),
    ],
    passos: [
      { titulo: 'Suportes', blocos: [p('`support` = instâncias reais: 25 da classe 0 e 7 da classe 1 (linhas).')] },
      { titulo: 'Linha da classe 1', blocos: [p('Recall 0,57 de 7 → VP = 4 (4/7 = 0,571). Logo FN = 3: três presos da classe 1 previstos como 0.')] },
      { titulo: 'Linha da classe 0', blocos: [p('Recall 0,80 de 25 → 20 acertos e 5 previstos como 1.')] },
      { titulo: 'Conferir pelas colunas', blocos: [p('Precisão da classe 1: 4/(4 + 5) = 0,44. Precisão da classe 0: 20/(20 + 3) = 0,87. Acurácia: (20 + 4)/32 = 0,75. Tudo bate.')] },
      { titulo: 'Matriz', blocos: [tabela(['Real \\ Predito', '0', '1'], [['0', '20', '5'], ['1', '3', '4']])] },
    ],
    fontes: [f('nbPresos', 'célula 5'), f('ad5', 'slides 14 e 15')],
  },
  pegadinhas: [
    { texto: 'Parâmetro com valor padrão some da saída do `fit` (gini no RF e na árvore; n_estimators=10 no Bagging).', fonte: f('nbRF', 'célula 5') },
    { texto: 'O notebook do GridSearch treina o modelo final com parâmetros diferentes dos `best_params_`.', fonte: f('nbGrid', 'células 7 e 9') },
    { texto: '`random_state` fixa a aleatoriedade; sem ele (RF do CrossValidation, split dos presos), rodar de novo pode mudar os números.', fonte: f('nbCV', 'célula 7') },
    { texto: '`fit_resample` e `fit` de imputador recebem só o treino.', fonte: f('nbCodifica', 'célula 61') },
    { texto: '`support` no classification_report é a soma da linha (instâncias reais).', fonte: f('nbPresos', 'célula 5') },
    { texto: 'Leia o limiar da árvore pela codificação usada no notebook.', fonte: f('nbRest', 'célula 21') },
  ],
  chefe: { nome: 'O Notebook Fora de Ordem', fala: 'Executei as células na ordem que eu quis. Adivinha o que o modelo usou.' },
};

export const questoesCodigos: Questao[] = [
  {
    id: 'cod-01',
    modulo: 'codigos',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes(
      [
        codigo(`params = {'criterion': ['gini', 'entropy'],
          'max_depth': [None, 2, 4, 6, 8, 10],
          'max_features': [None, 'sqrt', 'log2', 0.2, 0.4, 0.6, 0.8]}
modelo = GridSearchCV(estimator=DecisionTreeClassifier(), param_grid=params, cv=10, n_jobs=5, verbose=1)
modelo.fit(X_treino, y_treino)
# {'criterion': 'entropy', 'max_depth': 4, 'max_features': 'sqrt'}
modelo = DecisionTreeClassifier(max_depth=10, criterion='gini', max_features=0.4)`),
      ],
      [
        'O GridSearch avalia 84 combinações, totalizando 840 treinos.',
        'O modelo final do trecho usa os melhores hiperparâmetros encontrados pelo GridSearch.',
        'O GridSearch só variou o critério de divisão, sem testar profundidades.',
      ],
    ),
    opcoes: ['Apenas I', 'Apenas I e II', 'Apenas II e III', 'I, II e III', 'Todas estão incorretas'],
    correta: 0,
    explicacao: analise([
      ['I', true, '2 × 6 × 7 = 84 candidatos; com cv=10, 840 fits (saída do notebook).'],
      ['II', false, 'O melhor foi entropy, 4, sqrt; o modelo final usa gini, 10, 0.4.'],
      ['III', false, 'max_depth também está na grade.'],
    ]),
    fontes: [f('nbGrid', 'células 6 a 9')],
  },
  {
    id: 'cod-02',
    modulo: 'codigos',
    tipo: 'num',
    nivel: 1,
    enunciado: [
      p('No notebook do restaurante (12 instâncias), depois da codificação:'),
      codigo(`X_treino, X_teste, y_treino, y_teste = train_test_split(X, Y, test_size=0.20, random_state=42)
# y_teste    = ['Nao', 'Nao', 'Sim']
# previsoes  = ['Nao', 'Sim', 'Sim']`),
    ],
    campos: [
      { id: 'cols', rotulo: 'Número de colunas de X_treino', resposta: 13, porque: '9 atributos que não são Tipo + 4 colunas do One-Hot.' },
      { id: 'teste', rotulo: 'Instâncias de teste', resposta: 3, porque: '0,2 × 12 = 2,4 → 3.' },
      { id: 'acc', rotulo: 'Acurácia', resposta: 2 / 3, porque: 'Acertou a 1ª e a 3ª: 2/3 = 0,6667.' },
      { id: 'rnao', rotulo: 'Recall da classe Nao', resposta: 0.5, porque: 'Dois "Nao" reais, um acertado: 1/2.' },
    ],
    resolucao: [p('Saídas do notebook: `Treino: (9, 13)`, `Teste: (3, 13)`, `Acurácia: 66.67%`, e no report a classe Nao tem precisão 1,00 e recall 0,50.')],
    fontes: [f('nbRest', 'células 11 a 23')],
  },
  {
    id: 'cod-03',
    modulo: 'codigos',
    tipo: 'num',
    nivel: 3,
    enunciado: [
      p('Teste final do notebook dos presos:'),
      codigo(`              precision    recall  f1-score   support
           0       0.87      0.80      0.83        25
           1       0.44      0.57      0.50         7`),
      p('Reconstrua os valores da classe 1:'),
    ],
    campos: [
      { id: 'vp', rotulo: 'VP da classe 1', resposta: 4, porque: 'Recall 0,57 de 7 reais: 4.' },
      { id: 'fn', rotulo: 'FN da classe 1', resposta: 3, porque: '7 − 4 = 3.' },
      { id: 'fp', rotulo: 'FP da classe 1', resposta: 5, porque: 'Precisão 0,44 = 4/(4 + FP) → FP = 5. Confere: classe 0 tem 25 − 20 = 5 previstas como 1.' },
    ],
    resolucao: [p('Matriz [[20, 5], [3, 4]]: recall(1) = 4/7 = 0,57; precisão(1) = 4/9 = 0,44; acurácia 24/32 = 0,75.')],
    fontes: [f('nbPresos', 'célula 5'), f('ad5', 'slide 14')],
  },
  {
    id: 'cod-04',
    modulo: 'codigos',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes(
      [
        codigo(`x, x_test, y, y_test = train_test_split(df[columns_tmp], df[class_name], test_size=0.1)
kf = KFold(n_splits=10)
for train_index, valid_index in kf.split(x):
    ...
    model.fit(x_train, y_train)
    acuracia = np.mean(y_valid == predito)
    if acuracia > melhor:
        melhor = acuracia
        best_model = copy.deepcopy(model)
print(np.round(precision_valid/10, 2))`),
      ],
      [
        'O KFold é aplicado só sobre os 90% que não foram separados para o teste final.',
        'O modelo avaliado em x_test é o do fold com maior acurácia de validação.',
        'precision_valid/10 é a precisão do último fold.',
      ],
    ),
    opcoes: ['Apenas I', 'Apenas I e II', 'Apenas II e III', 'I, II e III', 'Todas estão incorretas'],
    correta: 1,
    explicacao: analise([
      ['I', true, '`kf.split(x)` usa `x`, o restante após separar 10% em x_test.'],
      ['II', true, '`best_model = copy.deepcopy(model)` quando a acurácia supera a melhor; depois `best_model.predict(x_test)`.'],
      ['III', false, 'É a soma das 10 precisões dividida por 10: a média.'],
    ]),
    fontes: [f('nbPresos', 'células 2 a 5')],
  },
  {
    id: 'cod-05',
    modulo: 'codigos',
    tipo: 'mc',
    nivel: 1,
    enunciado: [codigo(`modelo = BaggingClassifier(base_estimator=SVC(), n_estimators=10, random_state=0)`), p('Qual afirmação está correta?')],
    opcoes: ['O bagging só funciona com árvores, então o SVC é ignorado', 'Serão treinados 10 SVMs, cada um com uma amostra bootstrap, combinados por votação', 'n_estimators é o número de atributos por nó', 'random_state=0 desliga o bootstrap'],
    correta: 1,
    explicacao: [p('Bagging: cada classificador com uma amostra diferente (bootstrap), classe por votação (slide 8). O classificador base pode ser qualquer um; aqui, SVC.')],
    fontes: [f('nbBagging', 'célula 4'), f('ens', 'slide 8')],
  },
  {
    id: 'cod-06',
    modulo: 'codigos',
    tipo: 'num',
    nivel: 2,
    enunciado: [
      p('Planilha "Teste T - AD e RF": AD com média 0,93 e desvio 0,06; RF com média 0,94 e desvio 0,05; n = 96 em cada.'),
      p('Calcule (4 casas):'),
    ],
    campos: [
      { id: 'gl', rotulo: 'Graus de liberdade', resposta: TESTE_T.gl, porque: '96 + 96 − 2 = 190.' },
      { id: 't', rotulo: 't', resposta: TESTE_T.t, porque: '(0,93 − 0,94)/√(0,06²/96 + 0,05²/96) = −0,01/0,00797 = −1,2545.' },
    ],
    resolucao: [p(`t = ${n(TESTE_T.t)} com gl = 190. O valor crítico da planilha (5%, bicaudal) é ${n(TESTE_T.critico)}. Como |t| < valor crítico, t não está na região de rejeição: não há evidência de diferença entre as médias de AD e RF.`)],
    fontes: [f('testeT', 'aba "Teste t AD e RF"')],
  },
  {
    id: 'cod-07',
    modulo: 'codigos',
    tipo: 'num',
    nivel: 2,
    enunciado: [
      codigo(`regras = apriori(transacoes, min_support = 0.3, min_confidence = 0.6)
saida = list(regras)
print(len(saida))
# depois: if 'nan' in a or 'nan' in b: continue
#         if len(a) == 0 or len(b) == 0: continue`),
      p('Na execução do notebook:'),
    ],
    campos: [
      { id: 'reg', rotulo: 'Valor impresso por len(saida)', resposta: 11, porque: 'O notebook imprime 11 RelationRecords (incluindo os que têm "nan").' },
      { id: 'fin', rotulo: 'Regras no DataFrame RegrasFinais', resposta: 4, porque: 'Alcool→Detergente, Detergente→Alcool, Alcool→Limao, Detergente→Limao.' },
    ],
    resolucao: [p('Dos 11 registros, os filtros removem regras com "nan" e com antecedente ou consequente vazio. Sobram 4.')],
    fontes: [f('nbApriori', 'células 10, 16 e 17')],
  },
  {
    id: 'cod-08',
    modulo: 'codigos',
    tipo: 'mc',
    nivel: 2,
    enunciado: [
      codigo(`cm = ConfusionMatrix(arvore)
cm.fit(X_treino, y_treino)
cm.score(X_teste, y_teste)   # 0.6666666666666666`),
      p('O que o valor devolvido por `cm.score` representa?'),
    ],
    opcoes: ['A precisão da classe Sim', 'A acurácia no conjunto de teste', 'A entropia da raiz', 'O recall médio'],
    correta: 1,
    explicacao: [p('É o mesmo valor do `accuracy_score(y_teste, previsoes)` impresso antes: 66,67%. O yellowbrick desenha a matriz e devolve a acurácia.')],
    fontes: [f('nbRest', 'células 13 e 16')],
  },
  {
    id: 'cod-09',
    modulo: 'codigos',
    tipo: 'mc',
    nivel: 2,
    enunciado: [
      p('No notebook da Iris, a linha 0 (setosa) estava com sepalwidth ausente. Depois da função `trataFaltantes`, ela ficou com 3,416327. De onde vem esse valor?'),
    ],
    opcoes: ['Média de sepalwidth de toda a base', 'Média de sepalwidth das instâncias da mesma classe (setosa)', 'Moda de sepalwidth', 'Valor do vizinho mais próximo'],
    correta: 1,
    explicacao: [p('A docstring da função: "Substitui os valores faltantes pela média dos outros valores do mesmo atributo de amostras que sejam da mesma classe".')],
    fontes: [f('nbIris', 'célula 10')],
  },
  {
    id: 'cod-10',
    modulo: 'codigos',
    tipo: 'mc',
    nivel: 1,
    enunciado: [
      codigo(`modelo = MLPClassifier()
modelo.fit(X_treino, y_treino)
# ConvergenceWarning: Maximum iterations (200) reached ...
rede_neural = MLPClassifier(max_iter=1000, tol=0.00000000000001, solver='adam', activation='relu', hidden_layer_sizes=9)
modelo.fit(X_treino, y_treino)`),
      p('(Prioridade baixa.) Qual o efeito da última linha?'),
    ],
    opcoes: ['Treina a rede com hidden_layer_sizes=9', 'Treina de novo o `modelo` padrão; `rede_neural` nunca é usada', 'Dá erro porque rede_neural não existe', 'Converte a rede em árvore'],
    correta: 1,
    explicacao: [p('O objeto configurado se chama `rede_neural`, mas o fit é chamado em `modelo`.')],
    fontes: [f('nbRNA', 'células 6 a 10')],
  },
  {
    id: 'cod-11',
    modulo: 'codigos',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes(
      [codigo(`kf = KFold(n_splits=10, shuffle=True, random_state=42)
modelo2 = RandomForestClassifier(n_estimators=30, max_depth=5, max_features="sqrt")
scoresRF = cross_val_score(modelo2, X_treino, y_treino, cv=kf)`)],
      [
        'Os folds são embaralhados de forma reproduzível.',
        'Cada árvore do RF considera a raiz quadrada do número de atributos em cada divisão.',
        'Como os folds são fixos, o resultado do RF será sempre idêntico entre execuções.',
      ],
    ),
    opcoes: ['Apenas I', 'Apenas I e II', 'Apenas II e III', 'I, II e III', 'Todas estão incorretas'],
    correta: 1,
    explicacao: analise([
      ['I', true, 'shuffle=True com random_state=42.'],
      ['II', true, 'max_features="sqrt".'],
      ['III', false, 'O RandomForestClassifier não recebeu random_state: bootstrap e sorteio de atributos podem mudar.'],
    ]),
    fontes: [f('nbCV', 'células 6 e 7'), f('ens', 'slide 29')],
  },
  {
    id: 'cod-12',
    modulo: 'codigos',
    tipo: 'mc',
    nivel: 1,
    enunciado: [p('(Prioridade baixa.) No notebook do k-means, o silhouette foi maior em k = 2 (0,629) e o cotovelo apontou k = 4. Com qual k o agrupamento final foi feito?')],
    opcoes: ['2', '3', '4', '8'],
    correta: 1,
    explicacao: [p('`KMeans(n_clusters=3, random_state=0)` na célula 16. As métricas sugeriam outros valores; o notebook escolheu 3.')],
    fontes: [f('nbKmeans', 'células 8, 15 e 16')],
  },
  {
    id: 'cod-13',
    modulo: 'codigos',
    tipo: 'mc',
    nivel: 2,
    enunciado: [
      codigo(`colunas_binarias = [coluna for coluna in X.columns
                    if set(X[coluna].dropna().unique()).issubset(mapa_binario.keys())]`),
      p('Com `mapa_binario = {\'Nao\': 0, \'Sim\': 1}`, o que essa linha seleciona no restaurante?'),
    ],
    opcoes: ['Todas as colunas', 'As colunas cujos valores são só "Sim" e/ou "Nao" (Alternativo, Bar, SexSab, fome, Chuva, Res)', 'Só a coluna de classe', 'As colunas com valores ausentes'],
    correta: 1,
    explicacao: [p('Testa se o conjunto de valores da coluna está contido em {Nao, Sim}. Cliente, Preço, Tipo e Tempo ficam de fora. A classe já foi separada em Y.')],
    fontes: [f('nbRest', 'célula 9')],
  },
];
