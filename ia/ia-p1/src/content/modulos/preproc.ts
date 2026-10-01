import { f } from '../fontes';
import { afirmacoes, analise, codigo, lista, nota, p, tabela } from '../helpers';
import type { Modulo, Questao } from '../types';

export const moduloPreproc: Modulo = {
  id: 'preproc',
  ordem: 2,
  titulo: 'Pré-processamento (partes 1 a 4)',
  curto: 'Pré-processamento',
  prioridade: 'alta',
  descricao: 'Balanceamento, dados ausentes, inconsistentes e redundantes, conversão simbólico-numérica.',
  peso: 'Caiu em código na prova de 2025 (SMOTE sobre X_treino) e aparece em todo notebook.',
  resumo: [
    {
      id: 'balanceamento',
      titulo: 'Parte 1: balanceamento',
      blocos: [
        p('Base desbalanceada: o número de objetos varia muito entre as classes. Exemplo do slide: 80% dos testes de COVID dão negativo (classe **majoritária**) e 20% positivo (classe **minoritária**). Vários algoritmos passam a favorecer a classe majoritária.'),
        p('Três saídas apresentadas:'),
        lista(
          '**Redefinir o tamanho do conjunto**: acrescentar instâncias da minoritária (**oversampling**) ou remover da majoritária (**undersampling**).',
          '**Custos diferentes** por classe (difícil definir os custos; ex.: errar a minoritária vale dois erros da majoritária).',
          '**Induzir um modelo para uma classe** só (aprender as classes separadamente).',
        ),
        { tipo: 'diagrama', id: 'over-under' },
        tabela(
          ['', 'Risco citado no slide'],
          [
            ['Oversampling', 'Instâncias criadas podem representar situações que nunca ocorrerão; **overfitting**'],
            ['Undersampling', 'Dados importantes da majoritária podem ser perdidos; **underfitting**'],
          ],
        ),
        p('**Regra de ouro:** balancear **apenas o treino**, **depois** do `train_test_split`. Balancear a base completa gera **vazamento de dados (data leakage)**. O teste continua desbalanceado.'),
        { tipo: 'diagrama', id: 'vazamento' },
        tabela(
          ['Método (imblearn)', 'Tipo', 'Uso no material'],
          [
            ['`SMOTE(random_state=42)`', 'Oversampling', 'Cria exemplos sintéticos da minoritária a partir dos vizinhos mais próximos'],
            ['`TomekLinks(sampling_strategy=\'auto\')`', 'Undersampling', 'Remove instâncias da majoritária'],
            ['`RandomUnderSampler(random_state=42)`', 'Undersampling', 'Remove instâncias da majoritária ao acaso'],
          ],
        ),
        p('Com undersampling, a professora pede **dois conjuntos de teste**: o teste separado no split e um segundo só com as instâncias descartadas pelo balanceamento.'),
        p('Resultado real no notebook (câncer, treino com 165 x 63): `TomekLinks` deixou **153 x 63** (não iguala as classes); `SMOTE(sampling_strategy=\'minority\')` deixou **165 x 165** (330 instâncias).'),
      ],
      fontes: [f('bal', 'slides 2 a 13'), f('nbCodifica', 'células 59 a 82'), f('prova', 'Q6')],
    },
    {
      id: 'ausentes',
      titulo: 'Parte 2: dados ausentes',
      blocos: [
        p('Causas: problemas no equipamento de coleta, na transmissão e no armazenamento, ou no preenchimento humano. Razões: atributo não era importante na coleta (e-mail em 1990), falta de conhecimento (tipo sanguíneo), distração, falta de obrigação (renda), inexistência do valor (número de partos de homem).'),
        p('**As 4 alternativas:**'),
        lista(
          '**Eliminar as instâncias** com ausentes. Usada quando o atributo ausente é o que indica a classe. Não recomendada quando poucos atributos faltam, quando o número de ausentes varia muito entre instâncias ou quando restariam poucas instâncias.',
          '**Preencher manualmente**. Não recomendada quando há muitas instâncias ou atributos com ausentes.',
          '**Método ou heurística automática** (imputação): moda, média, ou um indutor estimando o valor. **Uma das mais recomendadas.**',
          '**Algoritmos de AM que lidam internamente** com ausentes, como alguns indutores de árvore. Em Python: MissForest e KNNImputer.',
        ),
        codigo(`
from sklearn.impute import KNNImputer
imputer = KNNImputer(n_neighbors=5)
imputer.fit(X_train)                       # aprende SÓ com o treino
X_train_imputed = imputer.transform(X_train)
X_test_imputed = imputer.transform(X_test)  # aplica os mesmos parâmetros`, 'Slide 10'),
        p('Por que o `fit` só no treino? Exemplo do slide (k = 1, imputando Age pela proximidade de Fare): no cenário correto, o vizinho de Te1 (Fare 8,00) é T3 (7,90) e Te1 recebe **Age = 26**. Fazendo `fit` em treino + teste, o vizinho vira Te2 (8,05), outra instância do teste, e Te1 recebe **Age = 45**. Em produção, um passageiro novo chega sozinho, sem "Te2" ao lado: isso é vazamento.'),
        p('Formas de eliminar (notebook com `dropna`): objetos com ausente em qualquer atributo (`how=\'any\'`), em todos (`how=\'all\'`), em atributos selecionados (`subset=`), atributos com ausente em qualquer objeto (`axis=\'columns\'`), em todos os objetos, ou em um número determinado (`thresh=`).'),
        p('No notebook da base de câncer, os ausentes vinham como `?`: `isnull().sum()` dava zero até fazer `base.replace(\'?\', np.nan)`. Depois apareceram 8 em `node-caps` e 1 em `breast-quad`, imputados pela **moda**. No notebook da Iris, a imputação foi pela **média dos valores da mesma classe**.'),
      ],
      fontes: [f('aus', 'slides 2 a 15'), f('nbCodifica', 'células 9 a 35'), f('nbIris', 'células 8 a 10')],
    },
    {
      id: 'inconsistentes',
      titulo: 'Parte 3: inconsistentes e redundantes',
      blocos: [
        p('**Inconsistentes**: valores conflitantes nos atributos. Surgem muito na integração de dados (escalas diferentes: metros e centímetros) e quando **duas instâncias iguais têm classificações diferentes**.'),
        p('**Redundantes** podem ser instâncias ou atributos:'),
        lista(
          'Instância redundante: muito semelhante a outra; no caso extremo, literalmente igual.',
          'Atributo redundante: seu valor pode ser deduzido de outros (Idade a partir da Data de nascimento; VendaTotal = NumVendas × Valor por venda). No extremo, tem o mesmo valor de outro atributo em todas as instâncias (# Int e # Vis).',
          'Redundância de atributo está ligada à **correlação** (Horas de estudo x Nota, corr > 0,90). Se a correlação for entre entrada e classe, a entrada terá grande influência na predição.',
        ),
        p('Causas: problemas na coleta, entrada, armazenamento, integração ou transmissão.'),
        codigo(`
df_duplicates = base[base.duplicated(subset=Nome_das_Colunas, keep=False)]
base = base.drop_duplicates(keep='first')                          # redundantes: fica 1 cópia
base = base.drop_duplicates(subset=Nome_das_Colunas, keep=False)   # inconsistentes: saem TODAS`, 'Lendo_e_tratando_arquivo_IRIS.ipynb'),
        p('Na Iris alterada: linhas 34 e 38 (iguais, setosa) e 102 e 143 (iguais, virginica) eram redundantes; 34 e 35 tinham os mesmos atributos com classes diferentes (setosa x versicolor). A base foi de 151 para 147 linhas. Inconsistentes são apagadas **as duas**, "já que não sabemos qual delas está correta".'),
      ],
      fontes: [f('inc', 'slides 2 a 9'), f('nbIris', 'células 11 a 21')],
    },
    {
      id: 'conversao',
      titulo: 'Parte 4: conversão simbólico-numérica',
      blocos: [
        p('Redes neurais, SVM e vários algoritmos de agrupamento só lidam com números. Três casos:'),
        { tipo: 'diagrama', id: 'codificacoes' },
        lista(
          '**Caso 1, dois valores** (presença/ausência): um dígito binário. Gênero: Masculino 0, Feminino 1. Tumor: Maligno 0, Benigno 1.',
          '**Caso 2, nominal com mais de dois valores**: sem ordem, a diferença entre quaisquer dois valores precisa ser a mesma. Codificação **1-de-c** (canônica ou topológica): c bits, um só bit vale 1. Distância de Hamming entre quaisquer dois códigos = **2**. "Binarizar": 6 cores viram 6 colunas.',
          'Com muitos valores (193 países), 1-de-c não é boa opção: use **pseudoatributos** (Continente com 7 binários, PIB, População, TMA, Área).',
          '**Caso 3, ordinal**: a codificação preserva a ordem. Inteiro pela posição (Primeiro 0, Segundo 1...). Se precisar de binário: **código cinza** ou **código termômetro**.',
        ),
        tabela(
          ['Valor ordinal', 'Inteiro', 'Código cinza', 'Termômetro'],
          [
            ['Primeiro', '0', '000', '00000'],
            ['Segundo', '1', '001', '00001'],
            ['Terceiro', '2', '011', '00011'],
            ['Quarto', '3', '010', '00111'],
            ['Quinto', '4', '110', '01111'],
            ['Sexto', '5', '100', '11111'],
          ],
          'Tabelas dos slides 16 e 17.',
        ),
        p('**No notebook do restaurante**: Sim/Nao vira 1/0; Cliente, Preço e Tempo são mapeados à mão em ordem (Nenhum 0, Alguns 1, Cheio 2; R 0, RR 1, RRR 2; 0-10 0, 10-30 1, 30-60 2, >60 3); Tipo vira One-Hot com `pd.get_dummies` (4 colunas). Resultado: 13 colunas.'),
        p('**LabelEncoder numera em ordem alfabética.** Na prova de 2025 isso é dado no enunciado (outlook: overcast 0, rainy 1, sunny 2). Em Cliente, a ordem alfabética seria Alguns 0, Cheio 1, Nenhum 2, o que quebra a ordem real; por isso o notebook mapeia ordinais à mão.'),
      ],
      fontes: [f('conv', 'slides 2 a 18'), f('nbRest', 'célula 9'), f('nbCodifica', 'células 39 a 43'), f('prova', 'Q8')],
    },
    {
      id: 'normalizacao',
      titulo: 'Normalização e outliers (como aparecem nos notebooks)',
      blocos: [
        p('`MinMaxScaler` transforma os dados para ficarem num intervalo, geralmente entre 0 e 1 (após o `describe`, min = 0 e max = 1 em todas as colunas). `StandardScaler` é importado em alguns notebooks e fica comentado no k-means.'),
        p('Outliers: o notebook da Iris sugere **boxplot** de cada atributo e **pairplot** (dispersão) e termina com "investigue como eliminar outlier a partir destes gráficos".'),
        nota('alerta', 'No notebook da Iris, `base_normalizada[classe] = base[classe]` alinha pelo índice. Como linhas tinham sido apagadas, a linha 143 ficou com classe NaN na saída. Atenção ao índice depois de remover linhas.'),
        nota('fora', 'As fórmulas de normalização e métodos formais de detecção de outliers não aparecem nos slides.'),
      ],
      fontes: [f('nbIris', 'células 22 a 28'), f('nbKmeans', 'células 2 e 5'), f('nbPresos', 'célula 1')],
    },
  ],
  formulas: [
    { nome: 'Imputação pela média', tex: String.raw`\hat{x} = \frac{1}{n}\sum_{i=1}^{n} x_i \quad(\text{só valores conhecidos})`, nota: 'Idades 18, 49, 18, 21, 22 e 34 → 162/6 = 27 (slide 8).', fonte: f('aus', 'slides 7 e 8') },
    { nome: '1-de-c', tex: String.raw`c \text{ valores} \Rightarrow c \text{ colunas;}\quad d_{Hamming} = 2`, nota: 'Cada código tem um único bit 1.', fonte: f('conv', 'slides 5 a 9') },
    { nome: 'SMOTE com minority', tex: String.raw`n_{min}' = n_{maj} \qquad \text{sintéticos} = n_{maj} - n_{min}`, nota: '165 x 63 → 165 x 165: 102 sintéticos, total 330.', fonte: f('nbCodifica', 'células 74 a 82') },
  ],
  exemplo: {
    titulo: 'Imputação pela média/moda e o KNNImputer sem vazamento',
    enunciado: [
      tabela(
        ['Idade', 'Sexo', 'Peso', 'Manchas', 'Temp.', '# Int.', 'Diagnóstico'],
        [
          ['—', 'M', '79', '—', '38,0', '—', 'Doente'],
          ['18', 'F', '67', 'Inexistentes', '39,5', '4', 'Doente'],
          ['49', 'M', '92', 'Espalhadas', '38,0', '2', 'Saudável'],
          ['18', '—', '43', 'Inexistentes', '38,5', '8', 'Doente'],
          ['21', 'F', '52', 'Uniformes', '37,6', '1', 'Saudável'],
          ['22', 'F', '72', 'Inexistentes', '38,0', '3', 'Doente'],
          ['—', 'F', '87', 'Espalhadas', '39,0', '6', 'Doente'],
          ['34', 'M', '67', 'Uniformes', '38,4', '2', 'Saudável'],
        ],
        'Base do slide 8 (Dados ausentes).',
      ),
      p('Preencha os ausentes pela média (numéricos) e pela moda (categóricos). Depois, diga o valor imputado em Te1 pelo KNNImputer (k = 1) nos dois cenários do slide.'),
    ],
    passos: [
      { titulo: 'Idade (média)', blocos: [p('Conhecidas: 18, 49, 18, 21, 22, 34. Soma = 162; 162/6 = **27**. As duas idades ausentes viram 27.')] },
      { titulo: 'Sexo (moda)', blocos: [p('Conhecidos: M, F, M, F, F, F, M → F aparece 4 vezes, M 3. Moda = **F**.')] },
      { titulo: 'Manchas (moda)', blocos: [p('Inexistentes 3, Espalhadas 2, Uniformes 2. Moda = **Inexistentes**.')] },
      { titulo: '# Int. (média)', blocos: [p('4 + 2 + 8 + 1 + 3 + 6 + 2 = 26; 26/7 = 3,71. O slide mostra **4** porque arredondou para inteiro.')] },
      { titulo: 'KNNImputer, cenário certo', blocos: [p('`fit` só no treino. Distâncias |Fare − 8,00|: T1 = 0,80; T3 = 0,10; T6 = 13,10... Mais próximo: T3 → Te1 recebe **Age = 26**.')] },
      { titulo: 'KNNImputer, cenário errado', blocos: [p('`fit` em treino + teste: Te2 (Fare 8,05) está a 0,05 → Te1 recebe **Age = 45**, valor vindo de outra instância de teste. É vazamento.')] },
    ],
    fontes: [f('aus', 'slides 8 e 11 a 14')],
  },
  pegadinhas: [
    { texto: 'Balancear **antes** do split é vazamento de dados. Primeiro `train_test_split`, depois `fit_resample(X_treino, y_treino)`.', fonte: f('bal', 'slide 9') },
    { texto: 'SMOTE cria exemplos sintéticos da **minoritária**, usando vizinhos mais próximos, e não da majoritária.', fonte: f('prova', 'Q6') },
    { texto: 'SMOTE não "dobra a base": com `minority`, a minoritária sobe até o tamanho da majoritária (165 x 63 → 165 x 165).', fonte: f('nbCodifica', 'células 80 a 82') },
    { texto: 'TomekLinks é undersampling e não garante classes iguais: 165 x 63 → 153 x 63.', fonte: f('nbCodifica', 'células 63 a 65') },
    { texto: 'Undersampling: as instâncias descartadas formam um **segundo conjunto de teste**.', fonte: f('bal', 'slide 13') },
    { texto: 'KNNImputer: `fit` só no treino, `transform` em treino e teste.', fonte: f('aus', 'slide 10') },
    { texto: '`?` não é NaN para o pandas: `isnull()` só enxerga depois de `replace(\'?\', np.nan)`.', fonte: f('nbCodifica', 'células 11 a 19') },
    { texto: 'Inconsistente = mesmos atributos, classes diferentes: as duas saem (`keep=False`). Redundante: fica uma cópia (`keep=\'first\'`).', fonte: f('nbIris', 'células 15 a 19') },
    { texto: 'LabelEncoder é **alfabético**: em Cliente daria Alguns 0, Cheio 1, Nenhum 2.', fonte: f('nbRest', 'célula 9') },
    { texto: '1-de-c para 193 países não é boa ideia: use pseudoatributos.', fonte: f('conv', 'slides 12 e 13') },
    { texto: 'Código cinza muda **um bit** de um valor para o seguinte; o termômetro vai acumulando 1s.', fonte: f('conv', 'slide 17') },
  ],
  chefe: { nome: 'O Vazamento de Dados', fala: 'Balanceia a base inteira antes do split. Ninguém vai perceber.' },
};

export const questoesPreproc: Questao[] = [
  {
    id: 'pre-01',
    modulo: 'preproc',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes(
      [
        p('Considere o trecho:'),
        codigo(`X_treino, X_teste, y_treino, y_teste = train_test_split(X, y, test_size=0.25, random_state=1)
smote = SMOTE(random_state=1)
X_bal, y_bal = smote.fit_resample(X_treino, y_treino)
modelo.fit(X_bal, y_bal)
previsoes = modelo.predict(X_teste)`),
        p('Analise:'),
      ],
      [
        'O balanceamento foi aplicado depois da divisão, o que evita vazamento de dados.',
        'O conjunto X_teste também foi balanceado pelo SMOTE.',
        'O SMOTE cria exemplos sintéticos da classe minoritária a partir dos vizinhos mais próximos.',
      ],
    ),
    opcoes: ['Apenas I', 'Apenas I e III', 'Apenas II e III', 'I, II e III', 'Todas estão incorretas'],
    correta: 1,
    explicacao: analise([
      ['I', true, 'É o que o slide manda: balancear após o train_test_split, só no treino.'],
      ['II', false, '`fit_resample` recebeu só X_treino. O teste continua desbalanceado, como deve ser.'],
      ['III', true, 'É a afirmação III da Q6 da prova de 2025, considerada correta.'],
    ]),
    fontes: [f('bal', 'slides 9 e 10'), f('prova', 'Q6')],
  },
  {
    id: 'pre-02',
    modulo: 'preproc',
    tipo: 'mc',
    nivel: 2,
    enunciado: [
      codigo(`X_res, y_res = SMOTE(random_state=42).fit_resample(X, y)
X_treino, X_teste, y_treino, y_teste = train_test_split(X_res, y_res, test_size=0.2)`),
      p('Qual o problema deste código?'),
    ],
    opcoes: [
      'Nenhum: a ordem entre SMOTE e split não importa',
      'Vazamento de dados: instâncias sintéticas geradas com a base toda caem no teste',
      'Underfitting, porque o SMOTE remove instâncias',
      'O SMOTE só funciona com RandomForest',
    ],
    correta: 1,
    explicacao: [p('"Fazer balanceamento no conjunto completo ocorrerá vazamento de dados (data leakage)." O teste passa a conter exemplos sintéticos criados a partir de vizinhos que podem estar no treino.')],
    fontes: [f('bal', 'slide 9')],
  },
  {
    id: 'pre-03',
    modulo: 'preproc',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes(
      [
        codigo(`balanceamento_under = TomekLinks(sampling_strategy='auto')
X_under, y_under = balanceamento_under.fit_resample(X_treino, y_treino)
np.unique(y_treino, return_counts=True)  # [165, 63]
np.unique(y_under, return_counts=True)   # [153, 63]`),
        p('Sobre o resultado:'),
      ],
      [
        'TomekLinks é um método de undersampling.',
        'Após o TomekLinks, as duas classes ficam obrigatoriamente com o mesmo número de instâncias.',
        'As 12 instâncias descartadas podem compor um segundo conjunto de teste.',
      ],
    ),
    opcoes: ['Apenas I', 'Apenas I e III', 'Apenas II e III', 'I, II e III', 'Todas estão incorretas'],
    correta: 1,
    explicacao: analise([
      ['I', true, 'Está em `imblearn.under_sampling`.'],
      ['II', false, 'A saída mostra 153 x 63: removeu só 12 da majoritária.'],
      ['III', true, 'O slide 13 pede um segundo teste com as instâncias desconsideradas pelo undersampling (165 − 153 = 12).'],
    ]),
    fontes: [f('nbCodifica', 'células 60 a 65'), f('bal', 'slide 13')],
  },
  {
    id: 'pre-04',
    modulo: 'preproc',
    tipo: 'num',
    nivel: 2,
    enunciado: [
      p('O treino tem 165 instâncias da classe majoritária e 63 da minoritária. Aplica-se:'),
      codigo(`balanceamento_over = SMOTE(sampling_strategy='minority')
X_over, y_over = balanceamento_over.fit_resample(X_treino, y_treino)`),
    ],
    campos: [
      { id: 'min', rotulo: 'Instâncias da minoritária depois', resposta: 165, porque: 'A minoritária sobe até igualar a majoritária: 165.' },
      { id: 'sint', rotulo: 'Exemplos sintéticos criados', resposta: 102, porque: '165 − 63 = 102.' },
      { id: 'total', rotulo: 'Total de X_over', resposta: 330, porque: '165 + 165 = 330 (saída `X_over.shape` = (330, 9)).' },
    ],
    resolucao: [p('Saída real do notebook: `np.unique(y_over)` = [165, 165] e `X_over.shape` = (330, 9). Foram criados 165 − 63 = 102 exemplos sintéticos. Note que a base não dobrou (228 → 330).')],
    fontes: [f('nbCodifica', 'células 77 a 82')],
  },
  {
    id: 'pre-05',
    modulo: 'preproc',
    tipo: 'mc',
    nivel: 1,
    enunciado: [p('Entre as quatro alternativas para dados ausentes, qual o slide aponta como uma das mais recomendadas?')],
    opcoes: [
      'Eliminar todas as instâncias com qualquer valor ausente',
      'Preencher manualmente cada valor',
      'Utilizar um método ou heurística para definir automaticamente os valores (imputação)',
      'Ignorar os ausentes e treinar normalmente com qualquer algoritmo',
    ],
    correta: 2,
    explicacao: [p('Slide 7: "Esta estratégia é uma das mais recomendadas" (moda, média, ou um indutor para estimar o valor). Eliminar e preencher à mão têm restrições; a quarta alternativa exige algoritmos que lidam internamente com ausentes.')],
    fontes: [f('aus', 'slides 4 a 9')],
  },
  {
    id: 'pre-06',
    modulo: 'preproc',
    tipo: 'num',
    nivel: 1,
    enunciado: [
      p('Na tabela do slide 8 de dados ausentes, as idades conhecidas são 18, 49, 18, 21, 22 e 34, e o número de internações conhecido é 4, 2, 8, 1, 3, 6 e 2.'),
      p('Calcule os valores imputados pela média (sem arredondar):'),
    ],
    campos: [
      { id: 'idade', rotulo: 'Idade imputada', resposta: 27, porque: '(18 + 49 + 18 + 21 + 22 + 34) / 6 = 162 / 6 = 27.' },
      { id: 'int', rotulo: '# Int. imputado', resposta: 26 / 7, porque: '(4 + 2 + 8 + 1 + 3 + 6 + 2) / 7 = 26 / 7 = 3,71. O slide mostra 4 porque arredondou.' },
    ],
    resolucao: [p('Média só dos valores conhecidos. Idade: 162/6 = 27. Internações: 26/7 = 3,7143; na tabela imputada do slide aparece 4 (valor inteiro).')],
    fontes: [f('aus', 'slide 8')],
  },
  {
    id: 'pre-07',
    modulo: 'preproc',
    tipo: 'mc',
    nivel: 2,
    enunciado: [
      p('Imputando Age com `KNNImputer(n_neighbors=1)` usando Fare como similaridade: com `fit` só no treino, Te1 recebe Age = 26; com `fit` em treino + teste, Te1 recebe Age = 45 (o vizinho passa a ser Te2, outra instância de teste).'),
      p('O que esse exemplo demonstra?'),
    ],
    opcoes: [
      'Que o KNNImputer deve usar k = 1 sempre',
      'Vazamento de dados: o teste influenciou a imputação de outra instância de teste',
      'Que imputação pela média é sempre melhor que KNN',
      'Que o teste nunca deve ser transformado',
    ],
    correta: 1,
    explicacao: [p('Em produção, um passageiro novo chega sozinho e não terá "Te2" ao lado. O correto é `fit` só no treino e `transform` em treino e teste (o teste é transformado, sim, mas com os parâmetros aprendidos no treino).')],
    fontes: [f('aus', 'slides 10 a 14')],
  },
  {
    id: 'pre-08',
    modulo: 'preproc',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes('Sobre dados inconsistentes e redundantes:', [
      'Duas instâncias com os mesmos valores de atributos e classificações diferentes são um caso de inconsistência.',
      'Um atributo é redundante quando seu valor, para todas as instâncias, pode ser deduzido de outros atributos.',
      'Dados redundantes se referem apenas a instâncias repetidas, nunca a atributos.',
    ]),
    opcoes: ['Apenas I', 'Apenas I e II', 'Apenas II e III', 'I, II e III', 'Todas estão incorretas'],
    correta: 1,
    explicacao: analise([
      ['I', true, 'Slide 2: "Duas instâncias iguais com classificações diferentes".'],
      ['II', true, 'Slide 5: Idade a partir da data de nascimento; VendaTotal = NumVendas × Valor.'],
      ['III', false, 'Slide 3: redundância pode se referir "tanto a instâncias quanto a atributos".'],
    ]),
    fontes: [f('inc', 'slides 2, 3 e 5')],
  },
  {
    id: 'pre-09',
    modulo: 'preproc',
    tipo: 'num',
    nivel: 2,
    enunciado: [
      p('No notebook do restaurante, X tem 10 atributos. Os binários viram 0/1, Cliente, Preço e Tempo viram inteiros e Tipo (Francês, Hamburger, Italiano, Tailandês) passa por `pd.get_dummies(X, columns=[\'Tipo\'], dtype=int)`.'),
    ],
    campos: [
      { id: 'tipo', rotulo: 'Colunas criadas para Tipo', resposta: 4, porque: '1-de-c: um bit por valor → 4 colunas (Tipo_Frances, Tipo_Hamburger, Tipo_Italiano, Tipo_Tailandes).' },
      { id: 'total', rotulo: 'Total de colunas de X', resposta: 13, porque: '10 − 1 (Tipo sai) + 4 = 13; confere com `Treino: (9, 13)`.' },
      { id: 'ham', rotulo: 'Distância de Hamming entre Francês e Italiano', resposta: 2, porque: '1000 x 0010: diferem em 2 posições. Em 1-de-c é sempre 2.' },
    ],
    resolucao: [p('Tipo some e entram 4 colunas binárias: 9 + 4 = 13 colunas, como mostra `X_treino.shape` = (9, 13). Na codificação 1-de-c, quaisquer dois códigos diferem em exatamente 2 bits.')],
    fontes: [f('nbRest', 'células 9 e 11'), f('conv', 'slides 5 a 9')],
  },
  {
    id: 'pre-10',
    modulo: 'preproc',
    tipo: 'mc',
    nivel: 2,
    enunciado: [p('Um atributo ordinal com seis níveis precisa virar binário. Qual par de códigos corresponde ao **Quarto** nível, segundo a tabela do slide (código cinza, código termômetro)?')],
    opcoes: ['011 e 00011', '010 e 00111', '100 e 11111', '110 e 01111'],
    correta: 1,
    explicacao: [p('Tabela do slide 17: Quarto → cinza 010, termômetro 00111. No cinza, de Terceiro (011) para Quarto (010) muda um único bit; no termômetro, cada nível acrescenta um 1.')],
    fontes: [f('conv', 'slide 17')],
  },
  {
    id: 'pre-11',
    modulo: 'preproc',
    tipo: 'mc',
    nivel: 3,
    enunciado: [
      p('Se o atributo Cliente (Nenhum, Alguns, Cheio) fosse codificado com `LabelEncoder`, que numeração sairia e qual o problema?'),
    ],
    opcoes: [
      'Nenhum 0, Alguns 1, Cheio 2; nenhum problema',
      'Alguns 0, Cheio 1, Nenhum 2; a ordem real (Nenhum < Alguns < Cheio) se perde',
      'Cheio 0, Alguns 1, Nenhum 2; vira One-Hot',
      'Os três recebem 1, pois são texto',
    ],
    correta: 1,
    explicacao: [p('O LabelEncoder usa ordem alfabética (é dado no enunciado da Q8 da prova de 2025). Alguns < Cheio < Nenhum alfabeticamente. Para ordinal, o notebook do restaurante mapeia à mão: Nenhum 0, Alguns 1, Cheio 2.')],
    fontes: [f('nbRest', 'célula 9'), f('prova', 'Q8'), f('conv', 'slides 15 e 16')],
  },
  {
    id: 'pre-12',
    modulo: 'preproc',
    tipo: 'num',
    nivel: 2,
    enunciado: [
      p('A base Iris alterada tem 151 linhas. Entre elas: as linhas 34 e 38 são idênticas (setosa); as linhas 102 e 143 são idênticas (virginica); a linha 35 tem os mesmos atributos da 34, mas é versicolor. Aplica-se:'),
      codigo(`base = base.drop_duplicates(keep='first')
base = base.drop_duplicates(subset=Nome_das_Colunas, keep=False)`),
    ],
    campos: [
      { id: 'red', rotulo: 'Linhas após remover redundantes', resposta: 149, porque: 'Saem 38 e 143 (fica a primeira cópia): 151 − 2 = 149.' },
      { id: 'inc', rotulo: 'Linhas após remover inconsistentes', resposta: 147, porque: 'Saem 34 e 35 (as duas, keep=False): 149 − 2 = 147.' },
    ],
    resolucao: [p('`keep=\'first\'` mantém uma cópia das linhas iguais em tudo (inclusive classe). Depois, `subset` só com os atributos e `keep=False` derruba todas as linhas que repetem atributos com classes diferentes. O `describe()` do notebook mostra count = 147.')],
    fontes: [f('nbIris', 'células 13 a 21')],
  },
  {
    id: 'pre-13',
    modulo: 'preproc',
    tipo: 'mc',
    nivel: 2,
    enunciado: [
      codigo(`base.isnull().sum()                 # tudo 0
base.replace('?', np.nan, inplace=True)
base.isnull().sum()                 # node-caps 8, breast-quad 1
base['node-caps'].fillna(base['node-caps'].mode()[0], inplace=True)`),
      p('Qual afirmação está correta?'),
    ],
    opcoes: [
      'A base não tinha ausentes, pois o primeiro isnull() deu zero',
      'Os ausentes estavam marcados com "?" e só viraram NaN após o replace; depois node-caps foi imputado pela moda',
      'fillna com mode() imputa pela média',
      'O replace apaga as linhas com "?"',
    ],
    correta: 1,
    explicacao: [p('O notebook mostra a instância 20 com `node-caps = ?`. Após `replace`, ela fica NaN e `fillna(...mode()[0])` coloca a moda ("no").')],
    fontes: [f('nbCodifica', 'células 9 a 28')],
  },
  {
    id: 'pre-14',
    modulo: 'preproc',
    tipo: 'mc',
    nivel: 1,
    enunciado: [p('Quando eliminar instâncias com valores ausentes **não** é recomendado, segundo o slide?')],
    opcoes: [
      'Quando o atributo ausente é justamente o que indica a classe',
      'Quando poucos atributos da instância possuem valores ausentes',
      'Quando a base é muito grande e os ausentes são raros na classe',
      'Sempre que o algoritmo for árvore de decisão',
    ],
    correta: 1,
    explicacao: [p('Não recomendado: poucos atributos ausentes na instância, número de ausentes variando muito entre instâncias, ou poucas instâncias restantes. A eliminação é usada quando o ausente é o atributo que indica a classe.')],
    fontes: [f('aus', 'slide 5')],
  },
  {
    id: 'pre-15',
    modulo: 'preproc',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes('Sobre o tratamento de desbalanceamento:', [
      'Usar custos de classificação diferentes por classe é uma das técnicas citadas, mas definir esses custos geralmente não é direto.',
      'Ao treinar com dados desbalanceados, vários algoritmos tendem a favorecer a classe majoritária.',
      'Depois de balancear o treino com SMOTE, o conjunto de teste também deve ser balanceado para a avaliação ser justa.',
    ]),
    opcoes: ['Apenas I', 'Apenas I e II', 'Apenas II e III', 'I, II e III', 'Todas estão incorretas'],
    correta: 1,
    explicacao: analise([
      ['I', true, 'Slide 7.'],
      ['II', true, 'Slide 4.'],
      ['III', false, 'O comentário do slide 10: treinar com os dados balanceados e testar com o arquivo de teste "que está desbalanceado".'],
    ]),
    fontes: [f('bal', 'slides 4, 7 e 10')],
  },
];
