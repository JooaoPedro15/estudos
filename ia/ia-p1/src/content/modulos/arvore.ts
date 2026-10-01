import { ARVORE_PROVA_TENIS, ARVORE_RESTAURANTE } from '../arvores';
import { BASE_RESTAURANTE, BASE_TENIS, MATRIZ_CANCER_RF, MATRIZ_SLIDE } from '../dados';
import { f } from '../fontes';
import { afirmacoes, analise, codigo, formula, lista, n, nota, p, tabela } from '../helpers';
import type { Modulo, Questao } from '../types';
import {
  entropia,
  entropiaPonderada,
  ganhoGini,
  ganhoInformacao,
  gini,
  giniPonderado,
  metricasConfusao,
  particionar,
  razaoGanho,
  splitInfo,
} from '../../engine/calc';

const gTenis = (a: number) => ganhoInformacao(particionar(BASE_TENIS, a).grupos);

// Particao original usada nas questoes 03 e 04 (Listas: Fez / Nao fez; classe [Sim, Nao]).
const LISTAS = [
  [6, 1],
  [1, 4],
];
// Atributo identificador: 12 valores distintos, 1 exemplo cada (6 Sim e 6 Nao).
const ID12 = Array.from({ length: 12 }, (_, i) => (i < 6 ? [1, 0] : [0, 1]));
// Matriz original (classes X, Y, Z), linhas = real.
const MATRIZ_XYZ = [
  [30, 4, 6],
  [3, 25, 2],
  [5, 5, 20],
];
const mXYZ = metricasConfusao(MATRIZ_XYZ);
const mCancer = metricasConfusao(MATRIZ_CANCER_RF);
const cheio = BASE_RESTAURANTE.filter((l) => l[4] === 'Cheio');
const gCheio = (a: number) => ganhoInformacao(particionar(cheio, a).grupos);

export const moduloArvore: Modulo = {
  id: 'arvore',
  ordem: 3,
  titulo: 'Árvore de Decisão',
  curto: 'Árvore de decisão',
  prioridade: 'alta',
  descricao: 'Entropia, ganho (ID3), gain ratio (C4.5), Gini (CART), contínuos, ausentes, poda, leitura de árvore do sklearn e métricas.',
  peso: 'Maior bloco da prova de 2025: Q1, Q2, Q3, Q7 a Q11 e a Q12 (5,5 pontos).',
  resumo: [
    {
      id: 'o-que-e',
      titulo: 'O que é e como se lê',
      blocos: [
        p('Árvore de classificação (classe nominal) ou de regressão (classe numérica). É popular por ser **simples e fácil de interpretar**. Estrutura: **nós** (testes em atributos), **ramos** (resultados dos testes) e **folhas** (classificação). Qualquer função booleana pode virar árvore.'),
        p('A árvore é uma **disjunção de conjunções de regras**: **cada caminho da raiz até uma folha é uma regra**. Complexidade medida por número de nodos, número de folhas, profundidade e número de atributos usados. Navalha de Occam: mais simples é melhor.'),
        tabela(
          ['Ano', 'Algoritmo', 'Autor'],
          [
            ['1966', 'CLS', '—'],
            ['1979', 'ID3 (teoria da informação, classificação)', 'Ross Quinlan'],
            ['1984', 'CART (classificação e regressão)', 'Breiman et al.'],
            ['1993', 'C4.5 (ID3 melhorado, classificação)', 'Ross Quinlan'],
          ],
        ),
      ],
      fontes: [f('ad1', 'slides 3 a 10')],
    },
    {
      id: 'intuicao',
      titulo: 'Intuição: bom atributo x atributo inútil',
      blocos: [
        p('Na base do restaurante (6 Sim, 6 Não), **Tipo é inútil**: os quatro valores ficam com metade Sim e metade Não. **Cliente é bom**: Nenhum → todos Não; Alguns → todos Sim; Cheio → 2 Sim e 4 Não (só esse ramo precisa continuar).'),
        p('Um atributo perfeito divide os exemplos em conjuntos todos positivos ou todos negativos. Todas as medidas concordam: divisão que mantém as proporções de classe é inútil; divisão com partições puras tem utilidade máxima.'),
      ],
      fontes: [f('ad2', 'slides 6 a 12'), f('ad3', 'slides 10 e 32')],
    },
    {
      id: 'entropia',
      titulo: 'Entropia',
      blocos: [
        p('Vem da Teoria da Informação de Shannon (1948). Mede a **(im)pureza**: a falta de homogeneidade dos dados em relação à classe. Evento certo não traz informação (entropia 0); evento raro traz mais informação.'),
        formula(String.raw`\text{Entropia}(S) = -\sum_{i=1}^{c} p_i \log_2 p_i`, 'Entropia'),
        p('Entropia alta: classes misturadas. Entropia zero: todos da mesma classe. Moeda justa: 1 bit. Moeda que dá 99% cara: 0,0808 bit.'),
        { tipo: 'diagrama', id: 'entropia-gini', legenda: 'Para duas classes: entropia máxima 1 em p = 0,5; Gini máximo 0,5.' },
        nota('alerta', 'Slide 15: "Se desejar que o ganho e a entropia esteja entre 0 e 1, a base do log precisa ser igual ao número de classes." Com log₂ e 3 classes equilibradas, a entropia é log₂3 = 1,585.'),
      ],
      fontes: [f('ad3', 'slides 4 a 19')],
    },
    {
      id: 'id3',
      titulo: 'Ganho de informação e o ID3',
      blocos: [
        formula(String.raw`\text{Entropia}(atributo) = \sum_{i=1}^{v} \frac{p_i + n_i}{p + n}\, I\!\left(\frac{p_i}{p_i+n_i}, \frac{n_i}{p_i+n_i}\right)`, 'Entropia do atributo (média ponderada)'),
        formula(String.raw`\text{ganho}(atributo) = \text{Entropia}(classe) - \text{Entropia}(atributo)`, 'Ganho'),
        p('Escolhe-se o atributo de **maior ganho**. Restaurante: ganho(Cliente) = 0,541; ganho(Tipo) = 0; ganho(Fome) = 0,196 → Cliente na raiz.'),
        p('**Algoritmo:** escolher atributo; criar um ramo por valor; passar os exemplos para as folhas; para cada folha, se todos são da mesma classe, vira folha com essa classe; senão, repetir com menos exemplos e um atributo a menos.'),
        p('**ID3** (Iterative Dichotomiser 3, Quinlan, 1979, Sydney): pioneiro, usa entropia e ganho, **recursivo e guloso**. Limitações: **só atributos discretos** (contínuos precisam ser discretizados), **não trata valores desconhecidos** e **não tem pós-poda**.'),
        p(`Segundo nível do restaurante (ramo Cliente = Cheio, 2 Sim e 4 Não, entropia ${n(entropia([2, 4]))}): conferido em código, Fome, Preço, Res, Tipo e Tempo empatam com ganho ${n(gCheio(3))}; Alternativo e Sex/Sab ${n(gCheio(0))}; Chuva ${n(gCheio(6))}; Bar 0.`),
      ],
      fontes: [f('ad3', 'slides 20 a 43')],
    },
    {
      id: 'c45',
      titulo: 'C4.5: contínuos, ausentes, poda e gain ratio',
      blocos: [
        lista(
          '**Contínuos**: cria um limiar e divide em dois subconjuntos (≤ limiar e > limiar). Ordena os valores; candidatos são pontos entre dois valores consecutivos diferentes (usual: a média deles). Fayyad e Irani (1993): os pontos que maximizam o ganho separam exemplos de **classes diferentes**.',
          '**Ausentes**: valores podem ser rotulados como `?`; os ausentes **não entram** no cálculo de entropia e ganho.',
          '**Poda após a criação**: retrocede na árvore e troca ramos que não ajudam por folhas.',
          '**Gain ratio** no lugar do ganho, para corrigir o viés do ganho a favor de atributos com muitos valores.',
        ),
        p('O viés: um atributo ID (código único) divide a base em subconjuntos de 1 elemento, todos puros. info(ID, T) = 0 e o ganho fica **máximo**, mesmo sem utilidade nenhuma.'),
        formula(String.raw`\text{split-info}(X,T) = -\sum_{i=1}^{r} \frac{|T_i|}{|T|}\log_2\frac{|T_i|}{|T|} \qquad \text{gain-ratio}(X,T) = \frac{\text{gain}(X,T)}{\text{split-info}(X,T)}`),
        p(`Cliente (2, 4 e 6 exemplos): split-info = ${n(splitInfo(particionar(BASE_RESTAURANTE, 4).grupos), 3)}; gain ratio = 0,541 / 1,459 = ${n(razaoGanho(particionar(BASE_RESTAURANTE, 4).grupos), 2)}.`),
      ],
      fontes: [f('ad3', 'slides 44 a 54')],
    },
    {
      id: 'cart',
      titulo: 'CART e o índice de Gini',
      blocos: [
        p('CART (Classification and Regression Trees): Breiman, Friedman, Olshen e Stone, 1984. Serve para **classificação e regressão**. Constrói **árvores binárias** (cada nó interno tem exatamente dois filhos). Critério: **Gini** para classificação e **erro quadrático médio** para regressão.'),
        formula(String.raw`\text{Gini}(S) = 1 - \sum_i p_i^2 \qquad \text{Gini}_{pond} = \frac{|S_L|}{|S|}\text{Gini}(S_L) + \frac{|S_R|}{|S|}\text{Gini}(S_R) \qquad \text{Ganho} = \text{Gini}(S) - \text{Gini}_{pond}`),
        p('Por que "1 −"? Σp² mede **pureza** (1 quando o nó é puro). O "1 −" inverte para medir **impureza**: nó puro tem Gini 0; duas classes 50/50 têm Gini 0,5 (máximo para 2 classes); 70/30 tem 0,42.'),
        tabela(
          ['Split (lado esquerdo)', 'Esquerda', 'Direita', 'Gini pond.', 'Ganho'],
          [
            ['{Alguns}', '4 Sim', '6 Não, 2 Sim', n(giniPonderado([[4, 0], [2, 6]])), n(ganhoGini([[4, 0], [2, 6]]))],
            ['{Cheio, Nenhum}', '6 Não, 2 Sim', '4 Sim', n(giniPonderado([[2, 6], [4, 0]])), n(ganhoGini([[2, 6], [4, 0]]))],
            ['{Nenhum}', '2 Não', '6 Sim, 4 Não', n(giniPonderado([[0, 2], [6, 4]])), n(ganhoGini([[0, 2], [6, 4]]))],
            ['{Cheio}', '4 Não, 2 Sim', '4 Sim, 2 Não', n(giniPonderado([[2, 4], [4, 2]])), n(ganhoGini([[2, 4], [4, 2]]))],
          ],
          'Splits binários de Cliente (slide 64). Gini da classe = 0,5. Raiz: Cliente com {Alguns} x {Nenhum, Cheio}.',
        ),
      ],
      fontes: [f('ad3', 'slides 56 a 65')],
    },
    {
      id: 'comparacao',
      titulo: 'ID3 x C4.5 x CART',
      blocos: [
        tabela(
          ['', 'ID3', 'C4.5', 'CART'],
          [
            ['Critério', 'Ganho de informação (entropia)', 'Razão de ganho (split-info)', 'Redução da impureza de Gini'],
            ['Viés', 'Favorece atributos com muitos valores', 'Corrige o viés normalizando o ganho', '—'],
            ['Contínuos', 'Não: precisa discretizar', 'Sim: limiar durante o treino', 'Splits binários'],
            ['Ausentes', 'Não trata', 'Sim: `?` fora do cálculo', 'Prova de 2025: falso dizer que "não consegue lidar"'],
            ['Poda', 'Sem pós-poda', 'Poda após criar', '—'],
            ['Tarefa', 'Classificação', 'Classificação', 'Classificação e regressão'],
          ],
        ),
        nota('fora', 'Os slides não detalham como o CART trata ausentes, nem a poda do CART. A linha "Ausentes" do CART vem só do gabarito da Q2 de 2025.'),
        nota('prova', 'Nada no material diz que um algoritmo é "muito melhor" que outro: afirmações assim (Q1, III) são falsas.'),
      ],
      fontes: [f('ad3', 'slides 42 a 46, 56 e 58'), f('prova', 'Q1 a Q3')],
    },
    {
      id: 'vantagens',
      titulo: 'Vantagens, desvantagens e poda',
      blocos: [
        tabela(
          ['Vantagens', 'Desvantagens'],
          [
            ['**Flexibilidade**: não paramétrica, não assume distribuição; cobertura exaustiva do espaço', '**Valores ausentes** exigem mecanismos especiais'],
            ['**Seleção de atributos**: robusta a atributos irrelevantes e redundantes', '**Contínuos**: ordenar pode consumir 70% do tempo de indução'],
            ['**Interpretabilidade**: decisões globais viram decisões locais simples', '**Instabilidade**: pequenas variações no treino mudam muito a árvore'],
            ['**Eficiência**: gulosa, top-down, sem backtracking, tempo linear no nº de exemplos', 'Inferências perto das folhas são menos confiáveis que perto da raiz'],
          ],
        ),
        p('Poda no material: ID3 não tem pós-poda; C4.5 poda depois de criar; Random Forest não faz poda. Nos códigos, `max_depth` limita a profundidade e pode deixar folhas impuras (Q8 de 2025: profundidade 3 não separou tudo).'),
        nota('fora', 'Os termos pré-poda e pós-poda como técnicas gerais não são detalhados nos slides.'),
      ],
      fontes: [f('ad4', 'slides 2 a 7'), f('ad3', 'slides 43 e 46'), f('ens', 'slide 27')],
    },
    {
      id: 'sklearn',
      titulo: 'Lendo uma árvore do sklearn',
      blocos: [
        p('Cada caixa do `plot_tree` traz: o **teste** (`atributo <= limiar`), o critério (`entropy` ou `gini`), `samples` (exemplos no nó), `value` (quantos de cada classe, **na ordem alfabética das classes**) e `class` (a classe majoritária).'),
        lista(
          'Seta da **esquerda** = teste **verdadeiro** (≤); direita = falso (>).',
          'Com LabelEncoder alfabético, `outlook <= 0.5` significa outlook = overcast (overcast 0, rainy 1, sunny 2); `humidity <= 0.5` = high; `windy <= 0.5` = False.',
          'Folha com entropia > 0 é impura. Na figura da prova, folhas `value = [1, 1]` aparecem com `class = no`.',
          'Número de regras = número de folhas.',
        ),
        { tipo: 'arvore', arvore: ARVORE_PROVA_TENIS, legenda: 'Árvore da prova de 2025 (Q8 a Q10). value = [no, yes].', nomesClasses: ['no', 'yes'] },
        p('**Cobertura de uma regra.** Nos slides de associação, cobertura = suporte = nº de exemplos cobertos ÷ total. A Q10 de 2025 fala em "cobertura **por classe**": exemplos da classe na folha ÷ total de exemplos daquela classe. Na árvore acima, a folha [3, 0] cobre 3 dos 5 "no" = **60%**. Pela leitura de suporte simples, ela cobre 3/14 = 21%; como a alternativa cita 60%, a leitura por classe é a que fecha.'),
        nota('alerta', 'A ligação entre "cobertura por classe" e esse cálculo é dedução a partir do enunciado; confirme a definição com a professora.'),
      ],
      fontes: [f('prova', 'Q8 a Q10'), f('ra', 'slide 8'), f('nbRest', 'célula 21'), f('lista2', 'Q2')],
    },
    {
      id: 'metricas',
      titulo: 'Métricas pela matriz de confusão',
      blocos: [
        p('Linhas = **classe verdadeira**; colunas = **classe predita**. A diagonal são os acertos.'),
        { tipo: 'diagrama', id: 'matriz-leitura' },
        tabela(
          ['Métrica', 'Como ler', 'Classe 1 do slide'],
          [
            ['TVP', 'acertos da classe ÷ total da **linha**', '11/15'],
            ['TFN', 'erros da **linha** ÷ total da linha (complementar da TVP)', '4/15'],
            ['TFP', 'erros na **coluna** da classe ÷ total das **outras** classes', '3/14'],
            ['TVN', 'outras classes − FP, ÷ total das outras (complementar da TFP)', '11/14'],
          ],
          'Matriz do slide 5: [[11, 1, 3], [1, 4, 0], [2, 1, 6]].',
        ),
        formula(String.raw`\text{Precision} = \frac{VP}{VP + FP} \qquad \text{Recall} = \frac{VP}{VP + FN} \qquad Ac = \frac{VP + VN}{VP + VN + FP + FN}`),
        formula(String.raw`F1 = \frac{2 \cdot recall \cdot precision}{recall + precision} \qquad F1_w = \frac{(w + 1)\cdot recall \cdot precision}{recall + w \cdot precision}`),
        p('F1 é a **média harmônica**: puxa para o menor valor. Precisão 1 e recall 0,2 dão F1 = 0,33, não 0,6.'),
        p('No `classification_report`, `support` é o número de instâncias **reais** de cada classe (soma da linha).'),
      ],
      fontes: [f('ad5', 'slides 3 a 15'), f('nbRest', 'célula 23')],
    },
  ],
  formulas: [
    { nome: 'Entropia', tex: String.raw`\text{Entropia}(S) = -\sum_{i=1}^{c} p_i \log_2 p_i`, fonte: f('ad3', 'slides 4 e 14') },
    { nome: 'Informação com p positivos e n negativos', tex: String.raw`I\!\left(\tfrac{p}{p+n}, \tfrac{n}{p+n}\right) = -\tfrac{p}{p+n}\log_2\tfrac{p}{p+n} - \tfrac{n}{p+n}\log_2\tfrac{n}{p+n}`, fonte: f('ad3', 'slide 20') },
    { nome: 'Entropia do atributo', tex: String.raw`\sum_{i=1}^{v}\tfrac{p_i+n_i}{p+n}\, I\!\left(\tfrac{p_i}{p_i+n_i}, \tfrac{n_i}{p_i+n_i}\right)`, fonte: f('ad3', 'slide 23') },
    { nome: 'Ganho (ID3)', tex: String.raw`\text{ganho} = \text{Entropia}(classe) - \text{Entropia}(atributo)`, fonte: f('ad3', 'slide 24') },
    { nome: 'Split-info e gain ratio (C4.5)', tex: String.raw`\text{split-info} = -\sum \tfrac{|T_i|}{|T|}\log_2\tfrac{|T_i|}{|T|} \qquad \text{GR} = \tfrac{\text{gain}}{\text{split-info}}`, fonte: f('ad3', 'slide 49') },
    { nome: 'Gini (CART)', tex: String.raw`\text{Gini}(S) = 1 - \sum_i p_i^2 \qquad \text{Ganho} = \text{Gini}(S) - \text{Gini}_{pond}`, fonte: f('ad3', 'slide 60') },
    { nome: 'TVP, TFN, TFP, TVN', tex: String.raw`TVP = \tfrac{VP}{\text{linha}} \quad TFN = \tfrac{FN}{\text{linha}} \quad TFP = \tfrac{FP}{\text{outras}} \quad TVN = \tfrac{VN}{\text{outras}}`, nota: 'linha = total real da classe; outras = total das demais classes.', fonte: f('ad5', 'slides 4 a 13') },
    { nome: 'Precisão, recall, acurácia', tex: String.raw`P = \tfrac{VP}{VP+FP} \quad R = \tfrac{VP}{VP+FN} \quad Ac = \tfrac{VP+VN}{VP+VN+FP+FN}`, fonte: f('ad5', 'slides 14 e 15') },
    { nome: 'F1 e F1 com peso', tex: String.raw`F1 = \tfrac{2RP}{R+P} \qquad F1 = \tfrac{(w+1)RP}{R + wP}`, fonte: f('ad5', 'slide 15') },
  ],
  exemplo: {
    titulo: 'ID3 na base "Jogar tênis": qual é a raiz?',
    enunciado: [
      p('Base do slide 3 de AM (14 dias, 9 Sim e 5 Não). É a mesma base da árvore do sklearn na prova de 2025, por isso a raiz bate com `outlook`. Calcule o ganho de cada atributo.'),
    ],
    passos: [
      { titulo: 'Entropia da classe', blocos: [formula(String.raw`E(S) = -\tfrac{9}{14}\log_2\tfrac{9}{14} - \tfrac{5}{14}\log_2\tfrac{5}{14} = ${n(entropia([9, 5]))}`)] },
      {
        titulo: 'Aparência',
        blocos: [
          p(`Sol: 2 Sim, 3 Não → E = ${n(entropia([2, 3]))}. Nublado: 4 Sim → E = 0. Chuva: 3 Sim, 2 Não → E = ${n(entropia([3, 2]))}.`),
          p(`Ponderada = 5/14·${n(entropia([2, 3]))} + 4/14·0 + 5/14·${n(entropia([3, 2]))} = ${n(entropiaPonderada(particionar(BASE_TENIS, 0).grupos))}. **Ganho = ${n(gTenis(0))}**.`),
        ],
      },
      { titulo: 'Umidade', blocos: [p(`Alta: 3 Sim, 4 Não (E = ${n(entropia([3, 4]))}); Normal: 6 Sim, 1 Não (E = ${n(entropia([6, 1]))}). Ponderada = ${n(entropiaPonderada(particionar(BASE_TENIS, 2).grupos))}. **Ganho = ${n(gTenis(2))}**.`)] },
      { titulo: 'Ventando', blocos: [p(`Não: 6 Sim, 2 Não (E = ${n(entropia([6, 2]))}); Sim: 3 e 3 (E = 1). Ponderada = ${n(entropiaPonderada(particionar(BASE_TENIS, 3).grupos))}. **Ganho = ${n(gTenis(3))}**.`)] },
      { titulo: 'Temperatura', blocos: [p(`Quente 2/2 (E = 1); Agradável 4/2 (E = ${n(entropia([4, 2]))}); Fria 3/1 (E = ${n(entropia([3, 1]))}). Ponderada = ${n(entropiaPonderada(particionar(BASE_TENIS, 1).grupos))}. **Ganho = ${n(gTenis(1))}**.`)] },
      { titulo: 'Decisão', blocos: [p(`Maior ganho: **Aparência (${n(gTenis(0))})**. Nublado vira folha pura "Sim"; Sol e Chuva continuam com 5 exemplos cada. Na árvore do sklearn da prova, a raiz é \`outlook <= 0.5\` (overcast à esquerda, folha [0, 4]) com entropy = 0.94 e value = [5, 9].`)] },
    ],
    fontes: [f('introAM', 'slide 3'), f('ad3', 'slides 20 a 24'), f('prova', 'Q8')],
  },
  pegadinhas: [
    { texto: 'ID3 usa ganho, que **favorece atributos com muitos valores** (caso extremo: ID). C4.5 corrige com gain ratio.', fonte: f('ad3', 'slides 46 a 49') },
    { texto: 'ID3: só discretos, não trata desconhecidos, sem pós-poda.', fonte: f('ad3', 'slides 42 e 43') },
    { texto: 'CART faz **regressão** também (erro quadrático médio). Dizer que só classifica é falso.', fonte: f('ad3', 'slide 56') },
    { texto: 'Para 2 classes: entropia máxima 1, Gini máximo 0,5.', fonte: f('ad3', 'slides 17 e 62') },
    { texto: 'Entropia com mais de 2 classes e log₂ pode passar de 1. Para ficar entre 0 e 1, a base do log é o número de classes.', fonte: f('ad3', 'slide 15') },
    { texto: 'sklearn: esquerda = condição verdadeira; `value` segue a ordem alfabética das classes ([no, yes], [Nao, Sim]).', fonte: f('prova', 'Q8') },
    { texto: 'Contar regras = contar folhas. A árvore da prova tem 5 folhas, não 4.', fonte: f('prova', 'Q10') },
    { texto: 'TFN e TVP se leem na **linha** (classe real). TFP e TVN usam a **coluna** e o total das outras classes.', fonte: f('ad5', 'slides 4 a 9') },
    { texto: 'Precisão não tem FN na fórmula; recall não tem FP. É a Q11 de 2025.', fonte: f('ad5', 'slide 14') },
    { texto: 'F1 é média harmônica: com uma das métricas baixa, F1 cai.', fonte: f('ad5', 'slide 15') },
    { texto: 'Acurácia alta pode esconder recall baixo da minoritária: RF na base de câncer teve 0,71 de acurácia e recall 0,36 em recurrence.', fonte: f('nbCodifica', 'células 55 e 58') },
  ],
  chefe: { nome: 'A Entropia Máxima', fala: 'Metade sim, metade não. Nenhum atributo vai me separar.' },
};

export const questoesArvore: Questao[] = [
  {
    id: 'arv-01',
    modulo: 'arvore',
    tipo: 'mc',
    nivel: 1,
    enunciado: afirmacoes('Sobre ID3, C4.5 e CART:', [
      'O C4.5 usa a razão de ganho para corrigir o viés do ganho de informação.',
      'O CART constrói árvores binárias, em que cada nó interno tem exatamente dois filhos.',
      'O ID3 trata valores ausentes ignorando-os no cálculo da entropia.',
    ]),
    opcoes: ['Apenas I', 'Apenas I e II', 'Apenas II e III', 'I, II e III', 'Todas estão incorretas'],
    correta: 1,
    explicacao: analise([
      ['I', true, 'Slide 46: a razão de ganho "normaliza o Ganho de Informação ao considerar o número de valores distintos".'],
      ['II', true, 'Slide 56.'],
      ['III', false, 'Quem ignora os `?` no cálculo é o C4.5. O ID3 "não apresenta nenhuma forma de tratar valores desconhecidos".'],
    ]),
    fontes: [f('ad3', 'slides 42, 45, 46 e 56')],
  },
  {
    id: 'arv-02',
    modulo: 'arvore',
    tipo: 'num',
    nivel: 1,
    enunciado: [p('Calcule a entropia (log₂) de cada nó, dado o `value` (contagem por classe):')],
    campos: [
      { id: 'a', rotulo: 'value = [4, 1]', resposta: entropia([4, 1]), porque: '−0,8·log₂0,8 − 0,2·log₂0,2 = 0,2575 + 0,4644 = 0,7219 (o 0.722 da árvore da prova).' },
      { id: 'b', rotulo: 'value = [1, 1]', resposta: 1, porque: 'Metade de cada: 1 bit, entropia máxima para 2 classes.' },
      { id: 'c', rotulo: 'value = [5, 9]', resposta: entropia([5, 9]), porque: '−(5/14)log₂(5/14) − (9/14)log₂(9/14) = 0,9403.' },
      { id: 'd', rotulo: 'value = [2, 2, 2] (3 classes)', resposta: entropia([2, 2, 2]), porque: 'Três classes iguais: log₂3 = 1,585. Passa de 1 porque a base do log não é 3.' },
    ],
    resolucao: [
      p('Use Entropia = −Σ pᵢ log₂ pᵢ com as proporções do nó.'),
      lista(`[4, 1]: ${n(entropia([4, 1]))}`, '[1, 1]: 1', `[5, 9]: ${n(entropia([5, 9]))}`, `[2, 2, 2]: ${n(entropia([2, 2, 2]))} (para ficar entre 0 e 1, usaria log₃)`),
    ],
    fontes: [f('ad3', 'slides 14, 15 e 17'), f('prova', 'Q8')],
  },
  {
    id: 'arv-03',
    modulo: 'arvore',
    tipo: 'num',
    nivel: 2,
    enunciado: [
      p('Numa base de 12 alunos (7 aprovados, 5 reprovados), o atributo **Listas** divide assim:'),
      tabela(['Listas', 'Aprovado', 'Reprovado'], [['Fez', '6', '1'], ['Não fez', '1', '4']]),
      p('Preencha a tabela (4 casas decimais):'),
    ],
    tabela: {
      cabecalho: ['Grandeza', 'Valor'],
      linhas: [
        ['Entropia da classe E(S)', { campo: 'es' }],
        ['E(Fez)', { campo: 'efez' }],
        ['E(Não fez)', { campo: 'enao' }],
        ['Entropia do atributo (ponderada)', { campo: 'pond' }],
        ['Ganho(Listas)', { campo: 'ganho' }],
      ],
    },
    campos: [
      { id: 'es', rotulo: 'E(S)', resposta: entropia([7, 5]), porque: '−(7/12)log₂(7/12) − (5/12)log₂(5/12) = 0,9799.' },
      { id: 'efez', rotulo: 'E(Fez)', resposta: entropia([6, 1]), porque: '−(6/7)log₂(6/7) − (1/7)log₂(1/7) = 0,5917.' },
      { id: 'enao', rotulo: 'E(Não fez)', resposta: entropia([1, 4]), porque: '−(1/5)log₂(1/5) − (4/5)log₂(4/5) = 0,7219.' },
      { id: 'pond', rotulo: 'Ponderada', resposta: entropiaPonderada(LISTAS), porque: '7/12 · 0,5917 + 5/12 · 0,7219 = 0,6460. Pesos pelo tamanho de cada ramo, não 1/2.' },
      { id: 'ganho', rotulo: 'Ganho', resposta: ganhoInformacao(LISTAS), porque: '0,9799 − 0,6460 = 0,3339. É a entropia da classe menos a ponderada.' },
    ],
    resolucao: [
      formula(String.raw`E(S) = -\tfrac{7}{12}\log_2\tfrac{7}{12} - \tfrac{5}{12}\log_2\tfrac{5}{12} = ${n(entropia([7, 5]))}`),
      p(`E(Fez) = ${n(entropia([6, 1]))}; E(Não fez) = ${n(entropia([1, 4]))}.`),
      p(`Ponderada = 7/12 · ${n(entropia([6, 1]))} + 5/12 · ${n(entropia([1, 4]))} = ${n(entropiaPonderada(LISTAS))}.`),
      p(`Ganho = ${n(entropia([7, 5]))} − ${n(entropiaPonderada(LISTAS))} = **${n(ganhoInformacao(LISTAS))}**.`),
    ],
    fontes: [f('ad3', 'slides 20 a 24')],
  },
  {
    id: 'arv-04',
    modulo: 'arvore',
    tipo: 'num',
    nivel: 2,
    enunciado: [p('Mesma partição da questão anterior (Fez: 6 aprovados e 1 reprovado; Não fez: 1 e 4). Agora pelo critério do CART:')],
    tabela: {
      cabecalho: ['Grandeza', 'Valor'],
      linhas: [
        ['Gini(S)', { campo: 'gs' }],
        ['Gini(Fez)', { campo: 'gf' }],
        ['Gini(Não fez)', { campo: 'gn' }],
        ['Gini ponderado', { campo: 'gp' }],
        ['Ganho Gini', { campo: 'gg' }],
      ],
    },
    campos: [
      { id: 'gs', rotulo: 'Gini(S)', resposta: gini([7, 5]), porque: '1 − (7/12)² − (5/12)² = 1 − 0,3403 − 0,1736 = 0,4861.' },
      { id: 'gf', rotulo: 'Gini(Fez)', resposta: gini([6, 1]), porque: '1 − (6/7)² − (1/7)² = 0,2449.' },
      { id: 'gn', rotulo: 'Gini(Não fez)', resposta: gini([1, 4]), porque: '1 − (1/5)² − (4/5)² = 0,32.' },
      { id: 'gp', rotulo: 'Gini ponderado', resposta: giniPonderado(LISTAS), porque: '7/12 · 0,2449 + 5/12 · 0,32 = 0,2762.' },
      { id: 'gg', rotulo: 'Ganho Gini', resposta: ganhoGini(LISTAS), porque: '0,4861 − 0,2762 = 0,2099.' },
    ],
    resolucao: [p(`Gini(S) = ${n(gini([7, 5]))}; Gini(Fez) = ${n(gini([6, 1]))}; Gini(Não fez) = ${n(gini([1, 4]))}; ponderado = ${n(giniPonderado(LISTAS))}; ganho = ${n(ganhoGini(LISTAS))}. Mesma receita do slide 60: Gini do nó, Gini ponderado dos filhos, diferença.`)],
    fontes: [f('ad3', 'slides 60 a 64')],
  },
  {
    id: 'arv-05',
    modulo: 'arvore',
    tipo: 'num',
    nivel: 3,
    enunciado: [p('Uma base tem 12 instâncias (6 Sim, 6 Não) e um atributo **Matrícula** com valor diferente em cada instância. Calcule:')],
    campos: [
      { id: 'g', rotulo: 'Ganho de informação de Matrícula', resposta: ganhoInformacao(ID12), porque: 'Cada ramo tem 1 exemplo (puro): entropia do atributo = 0. Ganho = 1 − 0 = 1, o máximo possível.' },
      { id: 'si', rotulo: 'Split-info de Matrícula', resposta: splitInfo(ID12), porque: '12 partições de 1/12: −12·(1/12)log₂(1/12) = log₂12 = 3,585.' },
      { id: 'gr', rotulo: 'Gain ratio de Matrícula', resposta: razaoGanho(ID12), porque: '1 / 3,585 = 0,279. O C4.5 derruba o atributo que o ID3 escolheria.' },
    ],
    resolucao: [
      p('É o caso do atributo ID dos slides 47 e 48: info(ID, T) = 0, então o ganho é máximo (1).'),
      p(`Split-info = log₂12 = ${n(splitInfo(ID12))}; gain ratio = 1 / ${n(splitInfo(ID12))} = ${n(razaoGanho(ID12))}. Compare com Cliente no restaurante: GR 0,37.`),
    ],
    fontes: [f('ad3', 'slides 47 a 51')],
  },
  {
    id: 'arv-06',
    modulo: 'arvore',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes(
      [
        p('A árvore abaixo foi gerada no notebook do restaurante (9 instâncias de treino, critério entropia). Tempo foi codificado como 0-10 → 0, 10-30 → 1, 30-60 → 2, >60 → 3; Cliente como Nenhum 0, Alguns 1, Cheio 2. value = [Nao, Sim].'),
        { tipo: 'arvore', arvore: ARVORE_RESTAURANTE, nomesClasses: ['Nao', 'Sim'] },
      ],
      [
        'A folha da direita da raiz corresponde a Tempo = ">60" e classifica como Nao.',
        'O teste "Tempo <= 1.5" separa os tempos 0-10 e 10-30 dos demais que chegaram ao nó.',
        'A regra "se Tempo > 30 minutos então Nao" sai diretamente da raiz.',
      ],
    ),
    opcoes: ['Apenas I', 'Apenas I e II', 'Apenas II e III', 'I, II e III', 'Todas estão incorretas'],
    correta: 1,
    explicacao: analise([
      ['I', true, 'Tempo > 2.5 só inclui o código 3 (>60): folha [2, 0], Nao.'],
      ['II', true, 'Tempo <= 1.5 pega os códigos 0 e 1.'],
      ['III', false, 'O código 2 (30-60) ainda é <= 2.5 e vai para a esquerda. A raiz só separa ">60".'],
    ], 'Ler o limiar sem olhar a codificação é o erro clássico.'),
    fontes: [f('nbRest', 'células 9 e 21')],
  },
  {
    id: 'arv-07',
    modulo: 'arvore',
    tipo: 'num',
    nivel: 3,
    enunciado: [
      p('Ainda na árvore do restaurante (treino com 4 Nao e 5 Sim). Calcule a cobertura **por classe** (exemplos da classe na folha ÷ total daquela classe) e a cobertura simples (samples da folha ÷ 9):'),
      { tipo: 'arvore', arvore: ARVORE_RESTAURANTE, nomesClasses: ['Nao', 'Sim'] },
    ],
    campos: [
      { id: 'a', rotulo: 'Por classe: folha [0, 4] (Sim)', resposta: 4 / 5, porque: '4 dos 5 Sim do treino: 0,8.' },
      { id: 'b', rotulo: 'Por classe: folha [2, 0] (Nao)', resposta: 2 / 4, porque: '2 dos 4 Nao: 0,5.' },
      { id: 'c', rotulo: 'Simples: folha [0, 4]', resposta: 4 / 9, porque: '4 de 9 instâncias: 0,4444.' },
      { id: 'd', rotulo: 'Quantas regras a árvore tem', resposta: 5, porque: 'Uma regra por folha: 5 folhas.' },
    ],
    resolucao: [
      p('Totais por classe na raiz: value = [4, 5] → 4 Nao e 5 Sim.'),
      lista('Folha [0, 4]: 4/5 = 0,8 dos Sim; 4/9 = 0,4444 do total.', 'Folha [2, 0]: 2/4 = 0,5 dos Nao; 2/9 do total.', 'Folhas: [1, 0], [0, 4], [0, 1], [1, 0], [2, 0] → 5 regras.'),
      nota('alerta', 'A definição de "cobertura por classe" é a leitura que fecha com a Q10 de 2025. Confirme com a professora.'),
    ],
    fontes: [f('nbRest', 'célula 21'), f('prova', 'Q10'), f('ra', 'slide 8')],
  },
  {
    id: 'arv-08',
    modulo: 'arvore',
    tipo: 'num',
    nivel: 2,
    enunciado: [
      p('Matriz de confusão de um classificador com classes X, Y e Z (linhas = real, colunas = predito):'),
      tabela(['Real \\ Predito', 'X', 'Y', 'Z'], [['X', '30', '4', '6'], ['Y', '3', '25', '2'], ['Z', '5', '5', '20']]),
    ],
    tabela: {
      cabecalho: ['Métrica', 'Valor'],
      linhas: [
        ['TFN da classe Y', { campo: 'tfny' }],
        ['TFP da classe Y', { campo: 'tfpy' }],
        ['Precisão da classe Z', { campo: 'pz' }],
        ['Recall da classe X', { campo: 'rx' }],
        ['Acurácia', { campo: 'ac' }],
      ],
    },
    campos: [
      { id: 'tfny', rotulo: 'TFN(Y)', resposta: mXYZ.classes[1].tfn, porque: 'Linha Y: erros 3 + 2 = 5 de 30 → 5/30 = 0,1667.' },
      { id: 'tfpy', rotulo: 'TFP(Y)', resposta: mXYZ.classes[1].tfp, porque: 'Coluna Y fora da diagonal: 4 + 5 = 9. Outras classes: 40 + 30 = 70 → 9/70 = 0,1286.' },
      { id: 'pz', rotulo: 'Precisão(Z)', resposta: mXYZ.classes[2].precisao, porque: 'Coluna Z: 20 certos de 6 + 2 + 20 = 28 → 0,7143.' },
      { id: 'rx', rotulo: 'Recall(X)', resposta: mXYZ.classes[0].recall, porque: 'Linha X: 30 de 40 → 0,75.' },
      { id: 'ac', rotulo: 'Acurácia', resposta: mXYZ.acuracia, porque: 'Diagonal 30 + 25 + 20 = 75 de 100 → 0,75.' },
    ],
    resolucao: [
      p('Linhas: X = 40, Y = 30, Z = 30 (total 100).'),
      lista(
        `TFN(Y) = (3 + 2)/30 = ${n(mXYZ.classes[1].tfn)}`,
        `TFP(Y) = (4 + 5)/(40 + 30) = ${n(mXYZ.classes[1].tfp)}`,
        `Precisão(Z) = 20/(6 + 2 + 20) = ${n(mXYZ.classes[2].precisao)}`,
        `Recall(X) = 30/40 = ${n(mXYZ.classes[0].recall)}`,
        `Acurácia = 75/100 = ${n(mXYZ.acuracia)}`,
      ),
    ],
    fontes: [f('ad5', 'slides 4 a 15'), f('prova', 'Q7')],
  },
  {
    id: 'arv-09',
    modulo: 'arvore',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes('Em um problema com classes desbalanceadas:', [
      'O recall de uma classe não se altera quando muda apenas o número de falsos positivos dessa classe.',
      'A precisão de uma classe depende diretamente do número de falsos negativos dessa classe.',
      'A acurácia pode ser alta mesmo com recall baixo na classe minoritária.',
    ]),
    opcoes: ['Apenas I', 'Apenas I e III', 'Apenas II e III', 'I, II e III', 'Todas estão incorretas'],
    correta: 1,
    explicacao: analise([
      ['I', true, 'Recall = VP/(VP + FN): FP não entra.'],
      ['II', false, 'Precisão = VP/(VP + FP): FN não entra.'],
      ['III', true, 'Exemplo real: RF na base de câncer, acurácia 0,71 e recall 0,36 para recurrence-events.'],
    ]),
    fontes: [f('ad5', 'slide 14'), f('nbCodifica', 'células 55 e 58')],
  },
  {
    id: 'arv-10',
    modulo: 'arvore',
    tipo: 'num',
    nivel: 2,
    enunciado: [
      p('No notebook "Codifica imputa e balanceia", o RandomForest sem balanceamento gerou:'),
      codigo(`confusion_matrix(y_teste, previsoes)
array([[33,  3],
       [14,  8]])   # ordem: no-recurrence-events, recurrence-events`),
      p('Calcule para a classe **recurrence-events**:'),
    ],
    campos: [
      { id: 'r', rotulo: 'Recall', resposta: mCancer.classes[1].recall, porque: 'Linha recurrence: 8 certos de 14 + 8 = 22 → 0,3636.' },
      { id: 'p', rotulo: 'Precisão', resposta: mCancer.classes[1].precisao, porque: 'Coluna recurrence: 8 de 3 + 8 = 11 → 0,7273.' },
      { id: 'f1', rotulo: 'F1', resposta: mCancer.classes[1].f1, porque: '2·0,7273·0,3636/(0,7273 + 0,3636) = 0,4848.' },
      { id: 'ac', rotulo: 'Acurácia do modelo', resposta: mCancer.acuracia, porque: '(33 + 8)/58 = 0,7069.' },
    ],
    resolucao: [p(`Recall = 8/22 = ${n(mCancer.classes[1].recall)}; precisão = 8/11 = ${n(mCancer.classes[1].precisao)}; F1 = ${n(mCancer.classes[1].f1)}; acurácia = 41/58 = ${n(mCancer.acuracia)}. O \`classification_report\` do notebook mostra 0.73, 0.36 e 0.48 para recurrence-events e accuracy 0.71.`)],
    fontes: [f('nbCodifica', 'células 55 a 58'), f('ad5', 'slides 14 e 15')],
  },
  {
    id: 'arv-11',
    modulo: 'arvore',
    tipo: 'mc',
    nivel: 3,
    enunciado: [
      p('Um atributo contínuo, já ordenado, tem os valores e classes: 64 (S), 65 (N), 68 (S), 69 (S), 70 (S), 71 (N). Seguindo Fayyad e Irani, quais pontos de referência o C4.5 precisa avaliar?'),
    ],
    opcoes: ['64,5; 66,5; 68,5; 69,5 e 70,5', '64,5; 66,5 e 70,5', 'Apenas 67,5 (a média geral)', 'Apenas 70,5'],
    correta: 1,
    explicacao: [p('Candidatos ficam entre valores consecutivos diferentes (usual: a média dos dois). Os pontos que maximizam o ganho separam exemplos de classes diferentes: 64/65 (S → N) dá 64,5; 65/68 (N → S) dá 66,5; 70/71 (S → N) dá 70,5. Entre 68, 69 e 70 a classe não muda.')],
    fontes: [f('ad3', 'slides 52 e 53')],
  },
  {
    id: 'arv-12',
    modulo: 'arvore',
    tipo: 'mc',
    nivel: 1,
    enunciado: afirmacoes('Sobre vantagens e desvantagens das árvores de decisão:', [
      'Pequenas variações no conjunto de treinamento podem produzir grandes variações na árvore final.',
      'Em bases grandes com muitos atributos contínuos, a ordenação pode consumir cerca de 70% do tempo de indução.',
      'Árvores de decisão assumem que os dados seguem distribuição normal.',
    ]),
    opcoes: ['Apenas I', 'Apenas I e II', 'Apenas II e III', 'I, II e III', 'Todas estão incorretas'],
    correta: 1,
    explicacao: analise([
      ['I', true, 'Instabilidade (slide 7).'],
      ['II', true, 'Atributos contínuos (slide 6).'],
      ['III', false, 'Slide 2: árvores não assumem distribuição; são não paramétricas.'],
    ]),
    fontes: [f('ad4', 'slides 2, 6 e 7')],
  },
  {
    id: 'arv-13',
    modulo: 'arvore',
    tipo: 'mc',
    nivel: 2,
    enunciado: afirmacoes(
      [p('Sobre a árvore da prova de 2025 (base de tênis, LabelEncoder alfabético; outlook: overcast 0, rainy 1, sunny 2; humidity: high 0, normal 1):'), { tipo: 'arvore', arvore: ARVORE_PROVA_TENIS, nomesClasses: ['no', 'yes'] }],
      [
        'A raiz manda para a esquerda os dias com outlook = overcast.',
        'A árvore tem 5 regras.',
        'O teste "humidity <= 0.5" é verdadeiro quando humidity = normal.',
      ],
    ),
    opcoes: ['Apenas I', 'Apenas I e II', 'Apenas II e III', 'I, II e III', 'Todas estão incorretas'],
    correta: 1,
    explicacao: analise([
      ['I', true, 'overcast = 0 ≤ 0.5.'],
      ['II', true, '5 folhas = 5 regras.'],
      ['III', false, 'humidity <= 0.5 é high (0). Normal (1) vai para a direita.'],
    ]),
    fontes: [f('prova', 'Q8')],
  },
  {
    id: 'arv-14',
    modulo: 'arvore',
    tipo: 'mc',
    nivel: 2,
    enunciado: [p('Por que um atributo como "código do cliente" (um valor por instância) é um problema para o ID3?')],
    opcoes: [
      'Porque gera entropia máxima e ganho zero',
      'Porque cada subconjunto tem um só caso, puro; info(ID, T) = 0 e o ganho fica máximo, embora o atributo seja inútil',
      'Porque o ID3 não aceita atributos nominais',
      'Porque o split-info desse atributo é zero',
    ],
    correta: 1,
    explicacao: [p('Slide 47: cada subconjunto tem um caso, todos puros, então o ganho é máximo. A informação potencial da partição (split-info) é alta, e a razão de ganho do C4.5 reduz esse atributo.')],
    fontes: [f('ad3', 'slides 47 a 49')],
  },
  {
    id: 'arv-15',
    modulo: 'arvore',
    tipo: 'num',
    nivel: 3,
    enunciado: [
      p('Restaurante, segundo nível: considere só as 6 instâncias com Cliente = Cheio (X2, X4, X5, X9, X10, X12: 2 Sim e 4 Não).'),
      p('Calcule:'),
    ],
    campos: [
      { id: 'e', rotulo: 'Entropia desse nó', resposta: entropia([2, 4]), porque: '−(2/6)log₂(2/6) − (4/6)log₂(4/6) = 0,9183.' },
      { id: 'fome', rotulo: 'Ganho de Fome no nó', resposta: gCheio(3), porque: 'Fome Sim: 2 Sim, 2 Não (E = 1); Fome Não: 2 Não (E = 0). Ponderada 4/6 = 0,6667 → 0,9183 − 0,6667 = 0,2516.' },
      { id: 'chuva', rotulo: 'Ganho de Chuva no nó', resposta: gCheio(6), porque: 'Chuva Não: 1 Sim, 3 Não (E = 0,8113); Sim: 1 e 1 (E = 1). Ponderada 0,8742 → 0,0441.' },
    ],
    resolucao: [
      p(`E(Cheio) = ${n(entropia([2, 4]))}. Fome: ${n(gCheio(3))}. Chuva: ${n(gCheio(6))}.`),
      p('Conferido em código: Fome, Preço, Res, Tipo e Tempo empatam com 0,2516; qualquer um pode ir para o segundo nível pelo critério de ganho.'),
    ],
    fontes: [f('ad3', 'slides 34 a 38')],
  },
  {
    id: 'arv-16',
    modulo: 'arvore',
    tipo: 'mc',
    nivel: 1,
    enunciado: [p('Ordene cronologicamente os algoritmos de indução de árvore citados no histórico:')],
    opcoes: ['ID3 (1979), CART (1984), C4.5 (1993)', 'C4.5, ID3, CART', 'CART (1979), ID3 (1984), C4.5 (1993)', 'ID3, C4.5, CART'],
    correta: 0,
    explicacao: [p('1966 CLS; 1979 ID3 (Quinlan); 1984 CART (Breiman et al.); 1993 C4.5 (Quinlan, ID3 melhorado).')],
    fontes: [f('ad1', 'slide 6')],
  },
  {
    id: 'arv-17',
    modulo: 'arvore',
    tipo: 'num',
    nivel: 1,
    enunciado: [
      p('Matriz do slide (linhas = classe verdadeira):'),
      tabela(['Real \\ Predito', '1', '2', '3'], MATRIZ_SLIDE.map((l, i) => [String(i + 1), ...l.map(String)])),
      p('Calcule para a classe 2:'),
    ],
    campos: [
      { id: 'tvp', rotulo: 'TVP', resposta: 4 / 5, porque: 'Linha 2: 4 acertos de 1 + 4 + 0 = 5 → 0,8.' },
      { id: 'tfp', rotulo: 'TFP', resposta: 2 / 24, porque: 'Coluna 2: 1 + 1 = 2 erros; outras classes 15 + 9 = 24 → 0,0833.' },
      { id: 'tvn', rotulo: 'TVN', resposta: 22 / 24, porque: '24 − 2 = 22 → 22/24 = 0,9167.' },
    ],
    resolucao: [p('Slides 5, 8 e 12: TVP da classe 2 = 4/5; TFP = 2/24; TVN = 22/24. TVP e TFN somam 1; TFP e TVN também.')],
    fontes: [f('ad5', 'slides 5 a 12')],
  },
];

