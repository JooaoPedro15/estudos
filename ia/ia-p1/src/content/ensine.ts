/**
 * "Me ensine" de cada questao: o que ela cobra e como atacar, sem dar a
 * resposta. `rever` aponta secoes do resumo ('modulo/secao') e `formulas`
 * aponta formulas do modulo ('modulo/Nome da formula'), que o painel mostra
 * inline. Tudo sai do material ja citado nos modulos.
 */
export type Ensine = {
  ideia: string;
  passos?: string[];
  rever: string[];
  formulas?: string[];
};

const AFIRMACOES = 'Julgue I, II e III separadamente, como verdadeiro ou falso, antes de olhar as alternativas. Só depois procure a alternativa que junta exatamente as verdadeiras.';

export const ENSINE: Record<string, Ensine> = {
  /* ------------------------------ Introdução ------------------------------ */
  'intro-01': {
    ideia: 'O que define o tipo de problema é o atributo que você quer prever. Pergunte: a saída é um rótulo (nominal) ou um número?',
    rever: ['intro/problemas'],
  },
  'intro-02': {
    ideia: `${AFIRMACOES} Para cada tipo de aprendizagem, lembre o que o indutor recebe: com rótulo, sem rótulo ou os dois.`,
    rever: ['intro/aprendizado'],
  },
  'intro-03': {
    ideia: `${AFIRMACOES} Lembre a relação entre mineração de dados e KDD e a ordem das etapas no diagrama de Rokach.`,
    rever: ['intro/kdd'],
  },
  'intro-04': {
    ideia: 'Os quatro pontos de vista cruzam dois eixos: pensar x agir e como humanos x racionalmente. "Parecer humano" é sobre comportamento visível ou sobre raciocínio interno?',
    rever: ['intro/visoes'],
  },
  'intro-05': {
    ideia: `${AFIRMACOES} Cada afirmação descreve uma das visões; compare com a frase do slide correspondente (IA simbólica, agentes, ciências cognitivas).`,
    rever: ['intro/visoes'],
  },
  'intro-06': {
    ideia: 'Holdout: uma parte treina, a outra testa. Os notebooks mostram como o tamanho do teste é arredondado.',
    passos: ['Multiplique test_size pelo total de instâncias.', 'Arredonde como nas saídas dos notebooks (12 instâncias deram 3 no teste).', 'O treino é o total menos o teste.'],
    rever: ['intro/avaliacao'],
    formulas: ['intro/Holdout nos notebooks'],
  },
  'intro-07': {
    ideia: 'No k-fold, o conjunto passado é dividido em k partes; cada parte valida uma vez. A acurácia de um fold é acertos ÷ tamanho do fold.',
    passos: ['Tamanho do fold = instâncias ÷ k.', 'Acurácia do fold = acertos ÷ tamanho do fold.', 'Quantos treinos: um por fold.'],
    rever: ['intro/avaliacao'],
    formulas: ['intro/k-fold: tamanho do fold'],
  },
  'intro-08': {
    ideia: 'O slide de balanceamento associa um risco a cada estratégia: acrescentar instâncias arrisca um problema; remover instâncias importantes arrisca o oposto.',
    rever: ['intro/overfitting', 'preproc/balanceamento'],
  },
  'intro-09': {
    ideia: `${AFIRMACOES} O slide 2 de métricas lista uma forma de avaliar para cada tipo de problema (classificação, agrupamento, regressão, associação).`,
    rever: ['intro/problemas'],
  },
  'intro-10': {
    ideia: 'Na definição de Mitchell, E é de onde o programa aprende, T é o que ele faz e P é como se mede se ele faz bem. Encaixe cada elemento do enunciado nesses papéis.',
    rever: ['intro/am'],
    formulas: ['intro/Definição de Mitchell'],
  },
  'intro-11': {
    ideia: 'Pense nas bonecas russas do slide: qual conjunto fica dentro de qual? Quem está dentro herda o nome de quem está fora.',
    rever: ['intro/ia-am-dl'],
  },
  'intro-12': {
    ideia: 'Veja quais dados entram em cross_val_score e o que o cv=kf faz com eles. O que significa a média e o "+-" impressos?',
    rever: ['intro/avaliacao'],
  },

  /* --------------------------- Pré-processamento -------------------------- */
  'pre-01': {
    ideia: `${AFIRMACOES} Olhe a ordem das linhas (split antes ou depois do balanceamento) e quais variáveis entram no fit_resample.`,
    rever: ['preproc/balanceamento'],
  },
  'pre-02': {
    ideia: 'A regra de ouro do balanceamento diz em que conjunto e em que momento ele pode ser aplicado. Este código respeita a ordem?',
    rever: ['preproc/balanceamento'],
  },
  'pre-03': {
    ideia: `${AFIRMACOES} Compare as contagens antes e depois do TomekLinks e lembre o que o slide 13 pede para fazer com as instâncias descartadas.`,
    rever: ['preproc/balanceamento'],
  },
  'pre-04': {
    ideia: 'Com sampling_strategy="minority", o SMOTE cria exemplos só da minoritária até ela alcançar a majoritária.',
    passos: ['Minoritária depois = tamanho da majoritária.', 'Sintéticos = minoritária depois − minoritária antes.', 'Total = majoritária + minoritária depois.'],
    rever: ['preproc/balanceamento'],
    formulas: ['preproc/SMOTE com minority'],
  },
  'pre-05': {
    ideia: 'O slide de dados ausentes lista 4 alternativas e comenta quando cada uma não é recomendada. Uma delas recebe o comentário "uma das mais recomendadas".',
    rever: ['preproc/ausentes'],
  },
  'pre-06': {
    ideia: 'Imputar pela média usa só os valores conhecidos daquele atributo.',
    passos: ['Some os valores conhecidos.', 'Divida pela quantidade de valores conhecidos (não pelo total de linhas).', 'Não arredonde: a questão pede o valor exato.'],
    rever: ['preproc/ausentes'],
    formulas: ['preproc/Imputação pela média'],
  },
  'pre-07': {
    ideia: 'O resultado da imputação mudou só porque outra instância de teste estava no lote. Em produção, cada instância nova chega sozinha. Que problema isso caracteriza?',
    rever: ['preproc/ausentes'],
  },
  'pre-08': {
    ideia: `${AFIRMACOES} Separe as definições: inconsistente é conflito de valores; redundante pode ser instância ou atributo.`,
    rever: ['preproc/inconsistentes'],
  },
  'pre-09': {
    ideia: 'One-Hot (1-de-c) troca um atributo com c valores por c colunas binárias, cada código com um único 1.',
    passos: ['Conte os valores de Tipo: é o número de colunas novas.', 'Total de colunas = atributos − 1 (Tipo sai) + colunas novas.', 'Hamming: conte em quantas posições dois códigos diferem.'],
    rever: ['preproc/conversao'],
    formulas: ['preproc/1-de-c'],
  },
  'pre-10': {
    ideia: 'Confira a tabela do slide 17: no código cinza, valores vizinhos diferem em um bit; no termômetro, cada nível acrescenta um 1.',
    rever: ['preproc/conversao'],
  },
  'pre-11': {
    ideia: 'O LabelEncoder numera os valores em ordem alfabética. Coloque Nenhum, Alguns e Cheio em ordem alfabética e compare com a ordem real de lotação.',
    rever: ['preproc/conversao'],
  },
  'pre-12': {
    ideia: 'Rode o código na cabeça, uma linha por vez. keep="first" mantém uma cópia; subset só com atributos e keep=False derruba todas as linhas que repetem atributos.',
    passos: ['Primeira linha: quais pares são idênticos em tudo, inclusive classe? Sobra uma cópia de cada.', 'Segunda linha: quais linhas restantes têm os mesmos atributos com classe diferente? Saem todas elas.'],
    rever: ['preproc/inconsistentes'],
  },
  'pre-13': {
    ideia: 'O pandas só reconhece NaN como ausente. Veja como os ausentes estavam marcados nessa base e o que o replace e o fillna com mode() fazem.',
    rever: ['preproc/ausentes'],
  },
  'pre-14': {
    ideia: 'O slide 5 de dados ausentes diz quando eliminar instâncias é usado e quando não é recomendado. Ache a alternativa que cai na lista de "não recomendado".',
    rever: ['preproc/ausentes'],
  },
  'pre-15': {
    ideia: `${AFIRMACOES} Lembre as três técnicas para desbalanceamento e o que o comentário do slide 10 diz sobre o conjunto de teste.`,
    rever: ['preproc/balanceamento'],
  },

  /* -------------------------------- Árvore -------------------------------- */
  'arv-01': {
    ideia: `${AFIRMACOES} Monte mentalmente a comparação ID3 x C4.5 x CART: critério, tipo de árvore e tratamento de ausentes de cada um.`,
    rever: ['arvore/comparacao', 'arvore/c45'],
  },
  'arv-02': {
    ideia: 'Entropia mede impureza: 0 quando o nó é puro, máxima quando as classes estão empatadas.',
    passos: ['Transforme o value em proporções (divida cada contagem pelo total do nó).', 'Para cada proporção p > 0, calcule −p·log₂p.', 'Some os termos.'],
    rever: ['arvore/entropia'],
    formulas: ['arvore/Entropia'],
  },
  'arv-03': {
    ideia: 'Ganho = entropia da classe − entropia ponderada dos ramos. Os pesos são o tamanho de cada ramo.',
    passos: ['E(S) com as contagens totais da classe.', 'E de cada ramo com as contagens do ramo.', 'Ponderada = Σ (tamanho do ramo ÷ total) · E(ramo).', 'Ganho = E(S) − ponderada.'],
    rever: ['arvore/id3'],
    formulas: ['arvore/Entropia', 'arvore/Entropia do atributo', 'arvore/Ganho (ID3)'],
  },
  'arv-04': {
    ideia: 'Mesma receita do ganho, trocando entropia por Gini = 1 − Σp².',
    passos: ['Gini do nó com as contagens totais.', 'Gini de cada ramo.', 'Gini ponderado pelos tamanhos dos ramos.', 'Ganho = Gini do nó − ponderado.'],
    rever: ['arvore/cart'],
    formulas: ['arvore/Gini (CART)'],
  },
  'arv-05': {
    ideia: 'Atributo com um valor por instância cria ramos de 1 exemplo cada, todos puros. Calcule o ganho e veja como o split-info do C4.5 penaliza isso.',
    passos: ['Entropia de cada ramo de 1 exemplo: 0. Ganho = entropia da classe.', 'Split-info: entropia dos tamanhos dos ramos (12 ramos de 1/12).', 'Gain ratio = ganho ÷ split-info.'],
    rever: ['arvore/c45'],
    formulas: ['arvore/Split-info e gain ratio (C4.5)'],
  },
  'arv-06': {
    ideia: `${AFIRMACOES} Traduza cada limiar para os valores reais usando a codificação dada (Tempo 0 a 3). "Tempo <= 2.5" pega quais códigos?`,
    rever: ['arvore/sklearn'],
  },
  'arv-07': {
    ideia: 'Cobertura por classe = exemplos daquela classe na folha ÷ total daquela classe no treino. Cobertura simples = samples da folha ÷ total.',
    passos: ['Leia na raiz quantos exemplos de cada classe existem (value).', 'Para a folha pedida, pegue o número da classe majoritária e divida pelo total daquela classe.', 'Regras: conte as folhas.'],
    rever: ['arvore/sklearn'],
  },
  'arv-08': {
    ideia: 'Linha = classe real, coluna = classe predita. TFN olha a linha; TFP e precisão olham a coluna; acurácia olha a diagonal.',
    passos: ['TFN(Y): erros da linha Y ÷ total da linha Y.', 'TFP(Y): erros da coluna Y ÷ total das outras classes (soma das outras linhas).', 'Precisão(Z): acerto de Z ÷ total da coluna Z.', 'Recall(X): acerto de X ÷ total da linha X.', 'Acurácia: soma da diagonal ÷ total.'],
    rever: ['arvore/metricas'],
    formulas: ['arvore/TVP, TFN, TFP, TVN', 'arvore/Precisão, recall, acurácia'],
  },
  'arv-09': {
    ideia: `${AFIRMACOES} Escreva as fórmulas de recall e precisão e veja quais letras (VP, FP, FN) aparecem em cada uma.`,
    rever: ['arvore/metricas'],
    formulas: ['arvore/Precisão, recall, acurácia'],
  },
  'arv-10': {
    ideia: 'Para a classe recurrence (segunda linha e segunda coluna): recall pela linha, precisão pela coluna, F1 pela média harmônica.',
    passos: ['Recall = acerto da classe ÷ soma da linha dela.', 'Precisão = acerto da classe ÷ soma da coluna dela.', 'F1 = 2·P·R ÷ (P + R).', 'Acurácia = diagonal ÷ total.'],
    rever: ['arvore/metricas'],
    formulas: ['arvore/Precisão, recall, acurácia', 'arvore/F1 e F1 com peso'],
  },
  'arv-11': {
    ideia: 'No C4.5, os candidatos a limiar ficam entre valores consecutivos diferentes. Fayyad e Irani: os que maximizam o ganho separam exemplos de classes diferentes.',
    passos: ['Percorra os pares consecutivos.', 'Marque só os pares em que a classe muda.', 'O ponto é a média dos dois valores.'],
    rever: ['arvore/c45'],
  },
  'arv-12': {
    ideia: `${AFIRMACOES} Lembre a tabela de vantagens (flexibilidade, seleção de atributos, interpretabilidade, eficiência) e desvantagens (ausentes, contínuos, instabilidade).`,
    rever: ['arvore/vantagens'],
  },
  'arv-13': {
    ideia: `${AFIRMACOES} Use a codificação alfabética dada para traduzir cada teste. Esquerda é sempre a condição verdadeira.`,
    rever: ['arvore/sklearn'],
  },
  'arv-14': {
    ideia: 'Imagine os ramos que um código único cria: quantos exemplos em cada um, e quão puros eles ficam? O que isso faz com o ganho?',
    rever: ['arvore/c45'],
  },
  'arv-15': {
    ideia: 'Depois que a raiz divide, cada ramo vira um problema novo com menos exemplos. Calcule tudo só com as 6 instâncias de Cheio.',
    passos: ['Entropia do nó com 2 Sim e 4 Não.', 'Para o atributo pedido, separe as 6 instâncias pelos valores dele e conte Sim/Não em cada parte.', 'Ponderada e ganho como na raiz.'],
    rever: ['arvore/id3'],
    formulas: ['arvore/Entropia do atributo', 'arvore/Ganho (ID3)'],
  },
  'arv-16': {
    ideia: 'O slide de histórico tem quatro datas: 1966, 1979, 1984 e 1993. Associe cada algoritmo a uma delas.',
    rever: ['arvore/o-que-e'],
  },
  'arv-17': {
    ideia: 'TVP olha a linha da classe; TFP e TVN olham as outras classes (as outras linhas), contando a coluna da classe.',
    passos: ['TVP = acerto ÷ total da linha da classe 2.', 'TFP = (coluna 2 fora da diagonal) ÷ (soma das linhas 1 e 3).', 'TVN = 1 − TFP, ou (outras − FP) ÷ outras.'],
    rever: ['arvore/metricas'],
    formulas: ['arvore/TVP, TFN, TFP, TVN'],
  },

  /* ------------------------------- Ensemble ------------------------------- */
  'ens-01': {
    ideia: `${AFIRMACOES} Traduza cada parâmetro: max_features="sqrt" com 9 atributos, o que o RF faz com cada árvore e o que o slide diz sobre poda.`,
    rever: ['ensemble/rf'],
    formulas: ['ensemble/Atributos por nó'],
  },
  'ens-02': {
    ideia: 'Com voto de 3, o ensemble acerta quando pelo menos 2 acertam. Se os erros são idênticos, votar não muda nada.',
    passos: ['Probabilidade dos 3 acertarem: a³.', 'Exatamente 2 acertarem: 3 combinações de a²·(1 − a).', 'Some as duas.', 'Com os mesmos erros, o ensemble fica com a acurácia de cada um.'],
    rever: ['ensemble/ensembles'],
    formulas: ['ensemble/Voto de 3 classificadores independentes'],
  },
  'ens-03': {
    ideia: 'Bootstrap sorteia com reposição e mantém o tamanho da base. Quem não foi sorteado vai para o teste.',
    passos: ['Tamanho = número de sorteios.', 'Distintos: conte cada exemplo uma vez só.', 'Fora: os da base original que não apareceram.'],
    rever: ['ensemble/bagging'],
  },
  'ens-04': {
    ideia: `${AFIRMACOES} Bagging: amostras e votação. Boosting: pesos nos exemplos difíceis. Lembre para que tipo de dado o slide diz que o boosting é pouco indicado.`,
    rever: ['ensemble/bagging', 'ensemble/boosting'],
  },
  'ens-05': {
    ideia: 'No stacking, quem decide a combinação não é uma regra fixa. Releia a definição do slide 18.',
    rever: ['ensemble/boosting'],
  },
  'ens-06': {
    ideia: 'argsort devolve os índices em ordem crescente de valor. O [::-1] faz o quê com essa lista?',
    rever: ['ensemble/codigo-rf'],
  },
  'ens-07': {
    ideia: 'Compare o que foi escrito no construtor com o que apareceu na saída. Que parâmetros sumiram, e que valor eles têm por padrão?',
    rever: ['ensemble/codigo-rf'],
  },
  'ens-08': {
    ideia: 'Os dois diagramas do slide 25 são quase iguais. Procure o único elemento que aparece só no do Random Forest.',
    rever: ['ensemble/rf'],
  },
  'ens-09': {
    ideia: 'O slide 27 diz como as árvores são combinadas em cada tipo de problema: um para classificação, outro para regressão.',
    rever: ['ensemble/rf'],
    formulas: ['ensemble/Saída da floresta'],
  },
  'ens-10': {
    ideia: `${AFIRMACOES} Lembre o que o slide diz sobre XGBoost, as condições para um ensemble funcionar e a desvantagem do RF (com o "apesar de...").`,
    rever: ['ensemble/ensembles', 'ensemble/boosting', 'ensemble/rf'],
  },
  'ens-11': {
    ideia: 'O slide 29 cita duas formas de definir quantos atributos sortear: raiz quadrada ou log da quantidade de atributos.',
    rever: ['ensemble/rf'],
    formulas: ['ensemble/Atributos por nó'],
  },

  /* ------------------------------ Associação ------------------------------ */
  'ass-01': {
    ideia: 'Suporte conta o itemset inteiro; confiança divide pelo antecedente; lift divide a confiança pelo suporte do consequente.',
    passos: ['Suporte = transações com a e e ÷ 10.', 'Confiança = transações com a e e ÷ transações com a.', 'Lift = confiança ÷ suporte(e).'],
    rever: ['assoc/metricas'],
    formulas: ['assoc/Suporte', 'assoc/Confiança', 'assoc/Lift'],
  },
  'ass-02': {
    ideia: 'Conte nas 10 transações do CSV. Cuidado com o sentido da regra: o antecedente vai no denominador da confiança; o consequente, no denominador do lift.',
    passos: ['Suporte: transações com os dois itens ÷ 10.', 'Confiança: transações com os dois ÷ transações com o antecedente.', 'Lift: confiança ÷ suporte do consequente.'],
    rever: ['assoc/metricas', 'assoc/apriori'],
    formulas: ['assoc/Suporte', 'assoc/Confiança', 'assoc/Lift'],
  },
  'ass-03': {
    ideia: `${AFIRMACOES} A monotonicidade vale em um sentido só: acrescentar item nunca aumenta o suporte. O que isso garante para subconjuntos e para superconjuntos?`,
    rever: ['assoc/monotonicidade'],
    formulas: ['assoc/Monotonicidade'],
  },
  'ass-04': {
    ideia: 'Uma fase trabalha com suporte e gera itemsets; a outra trabalha com confiança e gera regras. Qual precisa vir antes?',
    rever: ['assoc/apriori'],
  },
  'ass-05': {
    ideia: 'Confiança diz quanto B aparece quando A aparece. Lift compara isso com o quanto B aparece sozinho. Lift abaixo de 1 significa o quê?',
    rever: ['assoc/metricas', 'assoc/notebook'],
    formulas: ['assoc/Lift'],
  },
  'ass-06': {
    ideia: 'Cada item pode estar ou não estar num itemset: duas escolhas por item.',
    rever: ['assoc/monotonicidade'],
    formulas: ['assoc/Espaço de busca'],
  },
  'ass-07': {
    ideia: `${AFIRMACOES} Calcule as confianças com as contagens dadas e compare com min_confidence. Para a III, lembre o que o str() faz com uma célula vazia.`,
    rever: ['assoc/notebook'],
    formulas: ['assoc/Confiança', 'assoc/Lift'],
  },
  'ass-08': {
    ideia: `${AFIRMACOES} Calcule as três métricas para as duas regras: o suporte usa o itemset; a confiança divide pelo antecedente; o lift, pelo suporte do consequente.`,
    rever: ['assoc/metricas'],
    formulas: ['assoc/Suporte', 'assoc/Confiança', 'assoc/Lift'],
  },
  'ass-09': {
    ideia: 'Use as contagens do enunciado (7 transações) direto nas três fórmulas.',
    passos: ['Suporte = juntos ÷ 7.', 'Confiança = juntos ÷ transações com Alcool.', 'Lift = confiança ÷ (Detergente ÷ 7).'],
    rever: ['assoc/notebook'],
    formulas: ['assoc/Suporte', 'assoc/Confiança', 'assoc/Lift'],
  },
  'ass-10': {
    ideia: 'Calcule o suporte de cada alternativa no CSV. Lembre também da monotonicidade: se um item sozinho já não é frequente, nenhum par com ele é.',
    rever: ['assoc/apriori', 'assoc/monotonicidade'],
  },
  'ass-11': {
    ideia: `${AFIRMACOES} Compare regras de associação com regras de classificação: lado direito, medida de incerteza e quantidade de regras (slides 2 e 3).`,
    rever: ['assoc/conceito'],
  },

  /* ------------------------------ Naive Bayes ----------------------------- */
  'nb-01': {
    ideia: 'Para cada classe: probabilidade da classe vezes as probabilidades condicionais de cada valor do registro. Depois normalize.',
    passos: ['P(classe) = instâncias da classe ÷ 14.', 'Para cada atributo: entre as instâncias da classe, quantas têm o valor do registro (÷ total da classe).', 'Multiplique tudo: é o produto da classe.', 'Normalize: produto ÷ soma dos produtos.'],
    rever: ['bayes/tabela', 'bayes/novo-registro'],
    formulas: ['bayes/Probabilidade da classe', 'bayes/Probabilidade condicional', 'bayes/Produto e normalização'],
  },
  'nb-02': {
    ideia: 'Mesma receita, mas olhe a tabela do slide 4 antes de multiplicar: algum valor deste registro tem contagem zero em alguma classe?',
    passos: ['Para cada classe, pegue as frações da tabela para os 4 valores do registro.', 'Se uma fração for 0, o produto daquela classe é 0.', 'Normalize com os produtos que sobraram.'],
    rever: ['bayes/tabela', 'bayes/novo-registro'],
    formulas: ['bayes/Produto e normalização'],
  },
  'nb-03': {
    ideia: 'Os produtos ainda não são probabilidades. Para virar probabilidade, eles precisam somar 1.',
    rever: ['bayes/novo-registro'],
    formulas: ['bayes/Produto e normalização'],
  },
  'nb-04': {
    ideia: 'A probabilidade condicional P(valor | classe) olha só as instâncias daquela classe. Qual é o denominador?',
    rever: ['bayes/tabela'],
    formulas: ['bayes/Probabilidade condicional'],
  },
  'nb-05': {
    ideia: `${AFIRMACOES} Refaça mentalmente a conta do slide 6 (produto e divisão pela soma) e pense no que acontece se um fator for zero.`,
    rever: ['bayes/novo-registro'],
  },
  'nb-06': {
    ideia: 'Conte na base de 17 alunos, classe por classe. Antes de multiplicar, veja se algum valor do registro nunca aparece numa das classes.',
    passos: ['P(Bem) e P(Mal) pelas contagens das classes.', 'Para cada atributo, conte o valor do registro dentro de cada classe.', 'Multiplique e normalize.'],
    rever: ['bayes/novo-registro'],
    formulas: ['bayes/Produto e normalização'],
  },
  'nb-07': {
    ideia: 'Linhas = real, colunas = previsto. Recall pela linha da classe, precisão pela coluna, acurácia pela diagonal.',
    passos: ['Recall de virginica: acerto ÷ soma da linha virginica.', 'Precisão de versicolor: acerto ÷ soma da coluna versicolor.', 'Acurácia: diagonal ÷ total.'],
    rever: ['bayes/python', 'arvore/metricas'],
    formulas: ['arvore/Precisão, recall, acurácia'],
  },

  /* -------------------------------- Códigos ------------------------------- */
  'cod-01': {
    ideia: `${AFIRMACOES} Conte as combinações da grade (multiplique o número de valores de cada parâmetro) e compare o best_params_ com o modelo criado na última linha.`,
    rever: ['codigos/grid'],
    formulas: ['codigos/Grid search'],
  },
  'cod-02': {
    ideia: 'Junte o que você sabe da codificação (One-Hot de Tipo) com a regra do holdout e com a comparação entre y_teste e previsoes.',
    passos: ['Colunas: atributos que sobram + colunas do One-Hot.', 'Teste: test_size × 12, arredondado como nos notebooks.', 'Acurácia: posições em que y_teste e previsoes coincidem ÷ 3.', 'Recall de Nao: Nao acertados ÷ Nao reais.'],
    rever: ['codigos/restaurante', 'intro/avaliacao'],
  },
  'cod-03': {
    ideia: 'O support é a soma da linha (instâncias reais). Com ele, o recall dá os acertos; com a precisão, você acha os previstos.',
    passos: ['VP = recall × support (arredonde para inteiro).', 'FN = support − VP.', 'Precisão = VP ÷ (VP + FP): isole FP.'],
    rever: ['codigos/presos', 'arvore/metricas'],
    formulas: ['arvore/Precisão, recall, acurácia'],
  },
  'cod-04': {
    ideia: `${AFIRMACOES} Siga as variáveis: o que entra em kf.split, quando best_model é trocado e como precision_valid é acumulado.`,
    rever: ['codigos/presos'],
    formulas: ['codigos/Médias por fold (presos)'],
  },
  'cod-05': {
    ideia: 'O bagging não exige árvore: qualquer classificador pode ser o base. Lembre como o bagging gera as amostras e combina os resultados.',
    rever: ['codigos/bagging', 'ensemble/bagging'],
  },
  'cod-06': {
    ideia: 'Fórmula da planilha: diferença das médias dividida pela raiz da soma das variâncias de cada média.',
    passos: ['Graus de liberdade = n1 + n2 − 2.', 'Numerador = média AD − média RF.', 'Denominador = √(s1²/n1 + s2²/n2).', 't = numerador ÷ denominador.'],
    rever: ['codigos/ic'],
    formulas: ['codigos/Teste t (planilha)'],
  },
  'cod-07': {
    ideia: 'O apyori devolve registros com o item "nan" e com antecedente vazio; o laço do notebook filtra os dois. Quantos sobram no DataFrame final?',
    rever: ['codigos/apriori', 'assoc/notebook'],
  },
  'cod-08': {
    ideia: 'Compare o número devolvido por cm.score com o accuracy_score impresso antes no mesmo notebook.',
    rever: ['codigos/restaurante'],
  },
  'cod-09': {
    ideia: 'Leia a docstring de trataFaltantes: ela diz qual média é usada e de quais instâncias.',
    rever: ['codigos/iris', 'preproc/ausentes'],
  },
  'cod-10': {
    ideia: 'Olhe o nome da variável que recebe os novos parâmetros e o nome do objeto que chama fit.',
    rever: ['codigos/rna'],
  },
  'cod-11': {
    ideia: `${AFIRMACOES} Veja quais objetos recebem random_state: o KFold recebeu; o RandomForestClassifier também?`,
    rever: ['codigos/cv'],
  },
  'cod-12': {
    ideia: 'O notebook calcula duas métricas para sugerir k, mas a linha que treina o modelo final fixa um valor. Procure o n_clusters dessa linha.',
    rever: ['codigos/kmeans'],
  },
  'cod-13': {
    ideia: 'A condição testa se o conjunto de valores da coluna está contido em {Nao, Sim}. Quais colunas do restaurante só têm esses valores?',
    rever: ['codigos/restaurante'],
  },

  /* ------------------------------ Prova 2025 ------------------------------ */
  'p25-01': {
    ideia: `${AFIRMACOES} Cuidado com afirmações absolutas ("muito melhor"): elas precisam estar no material para serem verdadeiras.`,
    rever: ['arvore/comparacao', 'arvore/c45'],
  },
  'p25-02': {
    ideia: `${AFIRMACOES} Use a comparação dos três algoritmos: contínuos e ausentes em cada um.`,
    rever: ['arvore/comparacao', 'arvore/c45'],
  },
  'p25-03': {
    ideia: `${AFIRMACOES} Lembre qual algoritmo faz classificação e regressão (o próprio nome entrega).`,
    rever: ['arvore/comparacao', 'arvore/cart'],
  },
  'p25-04': {
    ideia: `${AFIRMACOES} Onde acontece o sorteio de atributos no RF: na árvore inteira, em cada nó, ou não acontece?`,
    rever: ['ensemble/rf'],
  },
  'p25-05': {
    ideia: `${AFIRMACOES} Traduza max_features, test_size e random_state. Desconfie de afirmações que preveem resultado sem base.`,
    rever: ['ensemble/codigo-rf', 'ensemble/rf'],
  },
  'p25-06': {
    ideia: `${AFIRMACOES} De qual classe o SMOTE cria exemplos e com vizinhos de qual classe? Até quanto ele aumenta a base?`,
    rever: ['preproc/balanceamento'],
  },
  'p25-07': {
    ideia: 'TFN é por linha: erros da classe real ÷ total real da classe.',
    passos: ['Ache a linha "Real: B".', 'Some a linha inteira (total de B).', 'Some só os erros (fora da diagonal).', 'Divida erros pelo total.'],
    rever: ['arvore/metricas'],
    formulas: ['arvore/TVP, TFN, TFP, TVN'],
  },
  'p25-08': {
    ideia: `${AFIRMACOES} Olhe só as folhas (nós sem teste): quais têm entropy > 0 e quais têm value com números iguais.`,
    rever: ['arvore/sklearn'],
  },
  'p25-09': {
    ideia: `${AFIRMACOES} Siga cada caminho com a codificação alfabética (overcast 0, rainy 1, sunny 2; high 0, normal 1; False 0, True 1).`,
    rever: ['arvore/sklearn'],
  },
  'p25-10': {
    ideia: `${AFIRMACOES} Conte as folhas (regras) e calcule a cobertura por classe de cada folha: exemplos da classe na folha ÷ total da classe na raiz.`,
    rever: ['arvore/sklearn'],
  },
  'p25-11': {
    ideia: `${AFIRMACOES} Escreva as fórmulas de precisão, recall e F1 e veja o que cada uma usa. F1 é média harmônica.`,
    rever: ['arvore/metricas'],
    formulas: ['arvore/Precisão, recall, acurácia', 'arvore/F1 e F1 com peso'],
  },
  'p25-12': {
    ideia: 'ID3: calcule o ganho dos três atributos e escolha o maior. Não pare no primeiro que parecer bom.',
    passos: ['Entropia da classe: conte Bem e Mal nas 15 linhas.', 'Para cada atributo, separe por valor e conte Bem/Mal em cada valor.', 'Entropia ponderada de cada atributo.', 'Ganho = entropia da classe − ponderada. Raiz = maior ganho.'],
    rever: ['arvore/id3'],
    formulas: ['arvore/Entropia', 'arvore/Entropia do atributo', 'arvore/Ganho (ID3)'],
  },
  'p25-13': {
    ideia: 'Naive Bayes com 17 linhas: produto por classe e, no fim, normalização. As alternativas incluem números sem normalizar.',
    passos: ['P(classe) para Bem e Mal.', 'Para Médio, Moderado e Sim: contagem dentro de cada classe ÷ total da classe.', 'Produto por classe.', 'Divida cada produto pela soma dos dois.'],
    rever: ['bayes/novo-registro'],
    formulas: ['bayes/Produto e normalização'],
  },
};
