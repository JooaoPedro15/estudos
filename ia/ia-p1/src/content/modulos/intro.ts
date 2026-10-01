import { f } from '../fontes';
import { afirmacoes, analise, codigo, lista, nota, p, tabela } from '../helpers';
import type { Modulo, Questao } from '../types';

export const moduloIntro: Modulo = {
  id: 'intro',
  ordem: 1,
  titulo: 'Introdução a IA e Aprendizado de Máquina',
  curto: 'Intro: IA, AM e KDD',
  prioridade: 'alta',
  descricao: 'IA x AM x KDD, tipos de problema e de aprendizado, treino/teste, holdout, validação cruzada, overfitting.',
  peso: 'Base de vocabulário para as afirmações I/II/III e para ler os códigos.',
  resumo: [
    {
      id: 'visoes',
      titulo: 'Os quatro pontos de vista da IA',
      blocos: [
        p('A professora organiza a IA em dois eixos: **pensar x agir** e **como humanos x racionalmente**.'),
        tabela(
          ['Visão', 'Ideia central', 'Exemplos do slide'],
          [
            ['Pensar racionalmente', 'IA clássica ou simbólica: o mundo vira proposições lógicas e o programa tira conclusões', 'Sócrates é homem, todo homem é mortal; MYCIN (diagnóstico, anos 70 e 80); ELIZA; assistentes virtuais'],
            ['Pensar humanamente', 'Ainda não se sabe como pensamos: é preciso estudar o ser humano (ciências cognitivas)', 'Redes neurais'],
            ['Agir humanamente', 'Teste de Turing: a métrica é parecer humano', 'Envolve linguagem natural, representação do conhecimento, raciocínio, aprendizado e "ser capaz de errar"'],
            ['Agir racionalmente', 'Agentes: percebem o ambiente por sensores e agem por atuadores', 'Ser humano, robô (câmeras e motores), softbot (recebe teclas, exibe na tela)'],
          ],
        ),
        p('Definições citadas: Rich & Knight (1993) "fazer os computadores realizarem coisas que, no momento, as pessoas fazem melhor"; Winston (1992) "computações que tornam possível perceber, raciocinar e agir"; Barr & Feigenbaum (1981) sistemas que exibem características associadas à inteligência humana.'),
      ],
      fontes: [f('introIA', 'slides 2 a 11')],
    },
    {
      id: 'ia-am-dl',
      titulo: 'IA x AM x Deep Learning',
      blocos: [
        p('Os conjuntos são encaixados como bonecas russas: **IA ⊃ Aprendizado de Máquina ⊃ Redes Neurais ⊃ Deep Learning**. Na linha do tempo do slide, a IA aparece nos anos 1950, o aprendizado de máquina floresce nos anos 1980 e o deep learning nos anos 2010.'),
        { tipo: 'diagrama', id: 'ia-am-dl' },
        p('Marcos históricos: o I Workshop de IA foi em **Dartmouth, 1956** (brainstorming de seis semanas); em 2006 houve o encontro comemorativo AI@50. O termo **aprendizado de máquina** surgiu em **1959, com Arthur Lee Samuel**.'),
      ],
      fontes: [f('introIA', 'slide 12'), f('passado', 'slides 4 e 6')],
    },
    {
      id: 'am',
      titulo: 'O que é aprendizado de máquina',
      blocos: [
        p('Definição de Mitchell (1997): um programa aprende a partir da **experiência E**, em relação a uma classe de **tarefas T**, com **medida de desempenho P**, se seu desempenho em T, medido por P, melhora com E. Brownlee: treinar um modelo a partir de dados que generalizam uma decisão contra uma medida de desempenho.'),
        p('Estrutura de dados: cada linha é uma **instância**; as colunas são **atributos de entrada** e o **atributo de classificação** (classe). Os atributos podem ser **nominais ou numéricos**. Exemplo do slide: base "Jogar tênis" com 14 dias (d1 a d14).'),
        p('Ferramentas citadas: Python, WEKA, Knime, R e Orange.'),
      ],
      fontes: [f('introAM', 'slides 2, 3, 21 e 22')],
    },
    {
      id: 'kdd',
      titulo: 'KDD e mineração de dados',
      blocos: [
        p('**Descobrir conhecimento** (Wives): identificar e receber informações relevantes, processá-las e agregá-las ao conhecimento prévio do usuário, mudando o estado do seu conhecimento para resolver um problema.'),
        p('**Mineração de dados**: descoberta de padrões interessantes e desconhecidos em grandes bancos de dados. É **uma parte** do processo geral de **KDD** (Knowledge Discovery in Databases). Alguns pesquisadores usam "mineração de dados" como sinônimo do KDD completo.'),
        p('Fayyad et al. (1996): KDD é "o processo não trivial de identificar padrões válidos, novos, potencialmente úteis e, finalmente, compreensíveis em dados". Friedman (1997a): análise automática de dados exploratórios de grandes bancos de dados.'),
        { tipo: 'diagrama', id: 'kdd', legenda: 'Processo de KDD segundo Rokach (2015): a mineração (DM) é só um trecho do caminho.' },
      ],
      fontes: [f('kdd', 'slides 2 a 7'), f('introAM', 'slides 17 a 20')],
    },
    {
      id: 'problemas',
      titulo: 'Tipos de problema',
      blocos: [
        tabela(
          ['Problema', 'O que se prevê', 'Exemplo do slide'],
          [
            ['Classificação', 'Uma classe: o atributo de classificação é **nominal**', 'Vai esperar no restaurante? Jogar tênis?'],
            ['Regressão', 'Igual à classificação, mas a classe é **numérica**', 'Valor da comida; temperatura; tempo de vida'],
            ['Agrupamento', 'Grupos de instâncias pelos atributos de entrada; **a classe não é conhecida**', 'Perfis de usuários em redes sociais'],
            ['Regras de associação', 'Associações entre elementos', 'Quem comprou A também comprou B'],
          ],
        ),
        p('Cada tipo tem sua métrica: classificação usa a **matriz de confusão**; agrupamento, métricas como o **silhouette index**; regressão, **MSE, MAE** (e versões normalizadas); associação, **suporte, confiança e lift**.'),
      ],
      fontes: [f('introAM', 'slides 4 a 10'), f('ad5', 'slide 2')],
    },
    {
      id: 'aprendizado',
      titulo: 'Tipos de aprendizagem',
      blocos: [
        { tipo: 'diagrama', id: 'tipos-aprendizado' },
        tabela(
          ['Tipo', 'O que o indutor recebe', 'Técnicas citadas'],
          [
            ['Supervisionado', 'Exemplos na forma (entrada, rótulo_desejado)', 'MLP, SVM, árvores de decisão'],
            ['Não supervisionado', 'Apenas atributos de entrada; busca agrupamentos', 'Mapas auto-organizáveis, k-médias'],
            ['Semi-supervisionado', 'Dados rotulados e não rotulados', 'SVM'],
            ['Por reforço', 'Maximiza recompensas do resultado', 'Rede neural'],
            ['Deep learning', 'Rede neural com muitas camadas', 'Rede neural'],
          ],
        ),
      ],
      fontes: [f('introAM', 'slides 11 a 16')],
    },
    {
      id: 'avaliacao',
      titulo: 'Treino, teste, holdout e validação cruzada',
      blocos: [
        p('Nos notebooks, a divisão `train_test_split(X, y, test_size=0.20, random_state=...)` aparece com o título **"Método de amostragem Holdout"**: uma parte treina, a outra fica guardada só para testar.'),
        tabela(
          ['Notebook', 'Instâncias', 'test_size', 'Treino', 'Teste'],
          [
            ['Restaurante', '12', '0.20', '9', '3'],
            ['Codifica imputa e balanceia (câncer)', '286', '0.20', '228', '58'],
            ['Lendo e tratando IRIS', '147', '0.20', '117', '30'],
          ],
          'Saídas reais dos notebooks: o teste fica com o valor arredondado para cima (0,2 × 12 = 2,4 vira 3).',
        ),
        p('**Validação cruzada (k-fold)**: o código divide o treino em k partes; cada parte vira validação uma vez e o modelo é treinado k vezes. `cross_val_score` devolve uma acurácia por fold e o notebook resume com média ± desvio padrão.'),
        { tipo: 'diagrama', id: 'holdout-kfold' },
        codigo(`
kf = KFold(n_splits=10, shuffle=True, random_state=42)
modelo = DecisionTreeClassifier(criterion='gini', max_depth=3)
scoresAD = cross_val_score(modelo, X_treino, y_treino, cv=kf)
print("Acurácia média da Árvore:", scoresAD, scoresAD.mean(), "+-", scoresAD.std())`, 'CrossValidationAD_RF.ipynb, célula 7'),
        p('Saída: AD = 0,9417 ± 0,0534 e RF = 0,95 ± 0,0553. Todas as acurácias são múltiplos de 1/12 (0,8333; 0,9167; 1,0) porque cada fold valida 12 das 120 instâncias de treino.'),
        p('Outra amostragem do material é o **bootstrap** (com reposição), visto no módulo de ensembles.'),
        nota('fora', 'Os slides não trazem uma definição formal de validação cruzada; o que está aqui é o que os notebooks fazem. Estratificação e leave-one-out não aparecem no material.'),
      ],
      fontes: [f('nbCodifica', 'células 46 a 51'), f('nbIris', 'células 37 a 44'), f('nbRest', 'célula 11'), f('nbCV', 'células 4 a 7'), f('nbRF', 'célula 4'), f('nbPresos', 'células 3 e 4')],
    },
    {
      id: 'overfitting',
      titulo: 'Overfitting x underfitting',
      blocos: [
        p('**Overfitting**: o modelo fica **superajustado aos dados de treinamento**. O slide de balanceamento cita esse risco ao acrescentar instâncias (oversampling).'),
        p('**Underfitting**: o modelo induzido **não se ajusta aos dados de treinamento**. O slide cita esse risco ao eliminar instâncias importantes (undersampling).'),
        p('Ligações com outros módulos: a navalha de Occam ("mais simples é melhor") mede a complexidade da árvore por nº de nodos, folhas, profundidade e atributos; a árvore é **instável** (pequenas mudanças no treino mudam muito a árvore); o bagging tende a **reduzir a variância** dos classificadores base.'),
        nota('fora', 'Viés x variância como teoria, curvas de aprendizado e regularização não aparecem no material.'),
      ],
      fontes: [f('bal', 'slide 6'), f('ad1', 'slide 4'), f('ad4', 'slide 7'), f('ens', 'slide 8')],
    },
    {
      id: 'desafios',
      titulo: 'Oportunidades e desafios (leitura rápida)',
      blocos: [
        lista(
          'Desafios: modelos não interpretáveis (desempenho preditivo x interpretabilidade), vieses discriminatórios (etnia, gênero, religião; documentário Coded Bias), fake news geradas por IA.',
          'Regulação: no Brasil, o PL 2338/2023 sobre uso de IA tramita no Congresso.',
          'SBC: uso de IA generativa em artigos deve ser declarado; a ferramenta não pode ser autora.',
        ),
      ],
      fontes: [f('passado', 'slides 19 a 25')],
    },
  ],
  formulas: [
    { nome: 'Definição de Mitchell', tex: String.raw`\text{aprende} \iff P(T) \text{ melhora com } E`, nota: 'E = experiência, T = tarefa, P = medida de desempenho.', fonte: f('introAM', 'slide 2') },
    { nome: 'Holdout nos notebooks', tex: String.raw`n_{teste} = \lceil \text{test\_size} \cdot n \rceil \qquad n_{treino} = n - n_{teste}`, nota: 'Regra observada nas saídas: 12 → 9/3; 286 → 228/58; 147 → 117/30.', fonte: f('nbCodifica', 'células 49 a 51') },
    { nome: 'k-fold: tamanho do fold', tex: String.raw`\text{validação por fold} = \frac{n_{treino}}{k}`, nota: '120 instâncias e k = 10 → 12 por fold; acurácias são múltiplos de 1/12.', fonte: f('nbCV', 'célula 7') },
    { nome: 'GridSearchCV: total de treinos', tex: String.raw`\text{fits} = \text{candidatos} \times \text{folds}`, nota: '2 × 6 × 7 = 84 candidatos; 84 × 10 = 840 fits (saída do notebook).', fonte: f('nbGrid', 'células 6 e 7') },
  ],
  exemplo: {
    titulo: 'Do problema do restaurante até a validação cruzada',
    enunciado: [
      p('A base "Vai esperar?" tem 12 instâncias, 10 atributos e a classe Sim/Não. Classifique o problema, diga quantas instâncias ficam no teste com `test_size=0.20` e explique por que o `cross_val_score` da Iris só devolve acurácias como 0,8333 e 0,9167.'),
    ],
    passos: [
      { titulo: 'Tipo de problema', blocos: [p('A classe "Vai esperar?" é nominal (Sim/Não), então é **classificação**. Cada exemplo vem com o rótulo, então o aprendizado é **supervisionado**.')] },
      { titulo: 'Holdout', blocos: [p('0,20 × 12 = 2,4. A saída do notebook mostra `Treino: (9, 13)` e `Teste: (3, 13)`: o teste arredonda para cima e fica com 3 instâncias. As 13 colunas vêm da codificação (9 atributos + 4 colunas do One-Hot de Tipo).')] },
      { titulo: 'Folds', blocos: [p('No notebook da Iris, `X_treino` tem 120 instâncias e `KFold(n_splits=10)`. Cada fold valida 120 / 10 = 12 instâncias.')] },
      { titulo: 'Acurácias possíveis', blocos: [p('Com 12 instâncias por fold, a acurácia só pode ser k/12: 10/12 = 0,8333; 11/12 = 0,9167; 12/12 = 1,0. É exatamente o que o notebook imprimiu.')] },
      { titulo: 'Leitura final', blocos: [p('AD: 0,9417 ± 0,0534; RF: 0,95 ± 0,0553. As médias são próximas e os desvios se sobrepõem; a planilha "Teste T - AD e RF" mostra como comparar duas médias com teste t.')] },
    ],
    fontes: [f('introAM', 'slides 5 e 12'), f('nbRest', 'células 9 e 11'), f('nbRF', 'célula 4 (X_treino com 120 linhas)'), f('nbCV', 'célula 7')],
  },
  pegadinhas: [
    { texto: 'Mineração de dados é **uma etapa** do KDD; só alguns autores usam o termo como sinônimo do processo inteiro.', fonte: f('kdd', 'slides 4 e 6') },
    { texto: 'Classificação: classe **nominal**. Regressão: classe **numérica**. A base pode ser a mesma; o que muda é o atributo de saída.', fonte: f('introAM', 'slides 5 e 8') },
    { texto: 'Agrupamento **não conhece** o atributo de classificação: é não supervisionado (k-médias, mapas auto-organizáveis).', fonte: f('introAM', 'slides 9 e 13') },
    { texto: 'Semi-supervisionado usa dados **rotulados e não rotulados** (técnica citada: SVM).', fonte: f('introAM', 'slide 14') },
    { texto: 'Teste de Turing é **agir humanamente**, não pensar humanamente.', fonte: f('introIA', 'slide 8') },
    { texto: '`test_size=0.20` com 12 instâncias deixa **3** no teste, não 2.', fonte: f('nbRest', 'célula 11') },
    { texto: 'Oversampling arrisca **overfitting**; undersampling arrisca **underfitting**. Não inverta.', fonte: f('bal', 'slide 6') },
    { texto: '`cross_val_score` roda só sobre o que você passar (no notebook, `X_treino`): o teste continua guardado.', fonte: f('nbCV', 'célula 7') },
  ],
  chefe: { nome: 'O Overfitting', fala: 'Eu decorei o treino inteiro. Quero ver você me pegar no teste.' },
};

export const questoesIntro: Questao[] = [
  {
    id: 'intro-01',
    modulo: 'intro',
    tipo: 'mc',
    nivel: 1,
    enunciado: [p('Na base do restaurante, a professora sugere prever "o valor da comida, com base nos atributos". Que tipo de problema é esse?')],
    opcoes: ['Classificação, porque a base é a mesma do "Vai esperar?"', 'Regressão, porque o atributo a prever é numérico', 'Agrupamento, porque não há classe', 'Regras de associação, porque relaciona atributos'],
    correta: 1,
    explicacao: [p('Regressão é "semelhante ao problema anterior, porém o atributo de classe é numérico". O exemplo do slide é justamente prever o valor da comida na base do restaurante.')],
    fontes: [f('introAM', 'slide 8')],
  },
  {
    id: 'intro-02',
    modulo: 'intro',
    tipo: 'mc',
    nivel: 1,
    enunciado: afirmacoes('Sobre os tipos de aprendizagem de máquina:', [
      'No aprendizado supervisionado, o indutor recebe exemplos na forma (entrada, rótulo_desejado).',
      'O algoritmo k-médias é um exemplo de aprendizado supervisionado, pois usa a classe para formar os grupos.',
      'O aprendizado semi-supervisionado utiliza dados rotulados e não rotulados.',
    ]),
    opcoes: ['Apenas I', 'Apenas I e III', 'Apenas II e III', 'I, II e III', 'Todas estão incorretas'],
    correta: 1,
    explicacao: analise([
      ['I', true, 'É a definição do slide de supervisionado.'],
      ['II', false, 'k-médias está em não supervisionado: o indutor recebe apenas os atributos de entrada.'],
      ['III', true, 'Definição do slide de semi-supervisionado.'],
    ]),
    fontes: [f('introAM', 'slides 12 a 14')],
  },
  {
    id: 'intro-03',
    modulo: 'intro',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes('Sobre KDD e mineração de dados:', [
      'A mineração de dados é uma parte do processo geral de descoberta de conhecimento em bancos de dados.',
      'Alguns pesquisadores usam o termo "mineração de dados" como sinônimo do processo completo de KDD.',
      'No processo de KDD apresentado (Rokach), a mineração de dados acontece antes da seleção e do pré-processamento.',
    ]),
    opcoes: ['Apenas I', 'Apenas I e II', 'Apenas II e III', 'I, II e III', 'Todas estão incorretas'],
    correta: 1,
    explicacao: analise([
      ['I', true, 'Texto do slide "Mineração de Dados".'],
      ['II', true, 'O slide 6 diz exatamente isso.'],
      ['III', false, 'No diagrama, seleção (2), pré-processamento (3) e transformação (4) vêm antes da mineração (5, 6 e 7).'],
    ]),
    fontes: [f('kdd', 'slides 4, 6 e 7')],
  },
  {
    id: 'intro-04',
    modulo: 'intro',
    tipo: 'mc',
    nivel: 1,
    enunciado: [p('O Teste de Turing usa como métrica "parecer humano". Em qual dos quatro pontos de vista da IA ele se encaixa?')],
    opcoes: ['Pensar racionalmente', 'Pensar humanamente', 'Agir humanamente', 'Agir racionalmente'],
    correta: 2,
    explicacao: [p('O slide "Agir Humanamente" traz o Teste de Turing. Agir racionalmente é a visão de agentes (sensores e atuadores); pensar racionalmente é a IA simbólica com lógica.')],
    fontes: [f('introIA', 'slides 3, 7, 8 e 9')],
  },
  {
    id: 'intro-05',
    modulo: 'intro',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes('Considere as visões da IA apresentadas em aula:', [
      'A IA clássica (simbólica) representa o mundo por proposições lógicas e tira conclusões a partir delas.',
      'Um softbot é um agente que recebe sequências de teclas como entrada e atua exibindo algo na tela.',
      'Pensar humanamente é simples de implementar, pois já se sabe exatamente como o ser humano pensa.',
    ]),
    opcoes: ['Apenas I', 'Apenas I e II', 'Apenas II e III', 'I, II e III', 'Todas estão incorretas'],
    correta: 1,
    explicacao: analise([
      ['I', true, 'É o "pensar racionalmente" (Sócrates é homem...).'],
      ['II', true, 'Exemplo de agente do slide 9.'],
      ['III', false, 'O slide diz o contrário: "ainda não se sabe como nós pensamos", por isso as ciências cognitivas.'],
    ]),
    fontes: [f('introIA', 'slides 3, 7 e 9')],
  },
  {
    id: 'intro-06',
    modulo: 'intro',
    tipo: 'num',
    nivel: 1,
    enunciado: [
      p('No notebook "Codifica imputa e balanceia", a base de câncer tem 286 instâncias e é dividida com:'),
      codigo(`X_treino, X_teste, y_treino, y_teste = train_test_split(X_prev, y_classe, test_size = 0.20, random_state = 0)`),
      p('Quantas instâncias ficam em cada conjunto?'),
    ],
    campos: [
      { id: 'treino', rotulo: 'Instâncias de treino', resposta: 228, porque: '286 − 58 = 228 (saída `X_treino.shape` = (228, 9)).' },
      { id: 'teste', rotulo: 'Instâncias de teste', resposta: 58, porque: '0,20 × 286 = 57,2, que arredonda para cima: 58 (saída `X_teste.shape` = (58, 9)).' },
    ],
    resolucao: [p('0,20 × 286 = 57,2. Os notebooks mostram o teste sempre arredondado para cima: 58. O treino fica com 286 − 58 = 228. Confira nas células 50 e 51 do notebook.')],
    fontes: [f('nbCodifica', 'células 49 a 51')],
  },
  {
    id: 'intro-07',
    modulo: 'intro',
    tipo: 'num',
    nivel: 2,
    enunciado: [
      p('No notebook de validação cruzada, `X_treino` tem 120 instâncias:'),
      codigo(`kf = KFold(n_splits=10, shuffle=True, random_state=42)
scoresAD = cross_val_score(modelo, X_treino, y_treino, cv=kf)`),
      p('Responda:'),
    ],
    campos: [
      { id: 'fold', rotulo: 'Instâncias de validação em cada fold', resposta: 12, porque: '120 / 10 = 12.' },
      { id: 'acc', rotulo: 'Acurácia de um fold que acerta 11 instâncias', resposta: 11 / 12, porque: '11 / 12 = 0,9167.' },
      { id: 'treinos', rotulo: 'Quantas vezes o modelo é treinado', resposta: 10, porque: 'Um treino por fold: 10.' },
    ],
    resolucao: [p('Com k = 10, cada fold valida 120/10 = 12 instâncias e o modelo é treinado 10 vezes (uma por fold). Um fold com 11 acertos tem acurácia 11/12 = 0,9167, valor que aparece na saída do notebook.')],
    fontes: [f('nbCV', 'células 6 e 7')],
  },
  {
    id: 'intro-08',
    modulo: 'intro',
    tipo: 'mc',
    nivel: 1,
    enunciado: [p('Ao balancear uma base removendo instâncias da classe majoritária, dados importantes podem se perder. Segundo o slide, isso pode levar a qual problema?')],
    opcoes: ['Overfitting: o modelo fica superajustado ao treino', 'Underfitting: o modelo não se ajusta aos dados de treinamento', 'Vazamento de dados', 'Nenhum, pois o undersampling não altera o treino'],
    correta: 1,
    explicacao: [p('Problema com undersampling: perder dados importantes "pode levar ao problema de underfitting". O overfitting é o risco citado para o oversampling.')],
    fontes: [f('bal', 'slide 6')],
  },
  {
    id: 'intro-09',
    modulo: 'intro',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes('Sobre como avaliar a qualidade dos modelos:', [
      'Em problemas de classificação, a avaliação é feita pela matriz de confusão.',
      'Em problemas de agrupamento, usa-se uma métrica específica como o silhouette index.',
      'Em problemas de associação, as métricas são MSE e MAE.',
    ]),
    opcoes: ['Apenas I', 'Apenas I e II', 'Apenas II e III', 'I, II e III', 'Todas estão incorretas'],
    correta: 1,
    explicacao: analise([
      ['I', true, 'Slide 2 de métricas.'],
      ['II', true, 'Silhouette aparece no slide e no notebook do k-means.'],
      ['III', false, 'MSE e MAE são de regressão; associação usa suporte, confiança e lift.'],
    ]),
    fontes: [f('ad5', 'slide 2')],
  },
  {
    id: 'intro-10',
    modulo: 'intro',
    tipo: 'mc',
    nivel: 1,
    enunciado: [p('Um modelo aprende a decidir se o cliente vai esperar no restaurante usando exemplos rotulados e é avaliado pela acurácia. Pela definição de Mitchell, quem são E, T e P?')],
    opcoes: [
      'E = acurácia; T = exemplos rotulados; P = decidir se espera',
      'E = exemplos rotulados; T = decidir se espera; P = acurácia',
      'E = decidir se espera; T = acurácia; P = exemplos rotulados',
      'E = árvore gerada; T = acurácia; P = exemplos',
    ],
    correta: 1,
    explicacao: [p('Experiência E são os dados (exemplos); a tarefa T é a decisão; a medida P é o desempenho (acurácia).')],
    fontes: [f('introAM', 'slide 2')],
  },
  {
    id: 'intro-11',
    modulo: 'intro',
    tipo: 'mc',
    nivel: 1,
    enunciado: [p('Sobre a relação entre IA, aprendizado de máquina (ML) e deep learning (DL), qual afirmação está de acordo com o slide "IA x ML x DL"?')],
    opcoes: [
      'DL contém ML, que contém IA',
      'Todo deep learning é aprendizado de máquina, e todo aprendizado de máquina é IA',
      'São áreas independentes, sem interseção',
      'IA surgiu depois do deep learning',
    ],
    correta: 1,
    explicacao: [p('As bonecas do slide: IA ⊃ Machine Learning ⊃ Neural Networks ⊃ Deep Learning. Na linha do tempo, IA vem nos anos 1950 e DL nos anos 2010.')],
    fontes: [f('introIA', 'slide 12')],
  },
  {
    id: 'intro-12',
    modulo: 'intro',
    tipo: 'mc',
    nivel: 2,
    enunciado: [
      codigo(`scoresAD = cross_val_score(modelo, X_treino, y_treino, cv=kf)
scoresRF = cross_val_score(modelo2, X_treino, y_treino, cv=kf)
# saída: AD 0.9417 +- 0.0534 | RF 0.95 +- 0.0553`),
      p('Qual leitura desse resultado é correta?'),
    ],
    opcoes: [
      'As médias usam o conjunto de teste, então o RF é melhor na prova final',
      'Cada média resume 10 acurácias obtidas nos folds do conjunto de treino; o teste não entra',
      'O desvio padrão mostra a acurácia mínima de cada modelo',
      'cross_val_score treina o modelo uma única vez',
    ],
    correta: 1,
    explicacao: [p('`cross_val_score` recebe `X_treino` e `cv=kf` (10 folds): gera 10 acurácias, e o notebook imprime média e desvio padrão. O `X_teste` não é usado nesse trecho.')],
    fontes: [f('nbCV', 'células 6 e 7')],
  },
];
