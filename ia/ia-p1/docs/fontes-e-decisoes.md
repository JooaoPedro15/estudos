# Fontes e decisões de conteúdo

Material lido (pasta `D:\CC\IA`), todos usados como fonte:

| Grupo | Arquivos |
| --- | --- |
| Slides | Introdução à Inteligência Artificial; Introdução a aprendizado de Máquina; Introdução a KDD; IA passado, presente e futuro 2024; Algoritmos de Indução de Árvore partes 1 a 5; Processamento partes 1 a 4; Métodos Ensemble; Naïve Bayes; Regras de associação parte 1; Algoritmo Apriori parte 2 |
| Prova | Primeira Prova_IA_1o2025 Coreu.pdf |
| Notebooks | AD_Restaurante_codifica_treina_e_avalia, Apriori, Bagging, Codifica imputa e balanceia, CrossValidationAD_RF, DecisionTree_com_gridsearch, Intervalo_de_confiança, Kmeans, Lendo_e_tratando_arquivo_IRIS, NaiveBayes, Random_Forest, RNA, validacao_cruzada_presos |
| Dados | PãoeManteiga Sim.csv, PãoeManteiga SimNao.csv, Teste T - AD e RF.xlsx |
| Listas | Lista 2 - IA - 2o2026.pdf (enunciado da professora, citado na leitura de árvore) |

"Slide N" nas citações é a página N do PDF.

## Escopo

Segue o aviso da prova: introdução a IA e AM, árvore de decisão, Random Forest,
regras de associação, pré-processamento partes 1 a 4 e códigos de sala. Naive
Bayes entra com prioridade média (caiu em 2025). Redes neurais, SVM e k-means
aparecem só como fichas de prioridade baixa no módulo de códigos.

## Números conferidos em código

Todo número das questões numéricas sai de `src/engine/calc.ts` e é testado
contra valores calculados à parte. Divergências encontradas no material:

| Onde | O material diz | Calculado | Tratamento |
| --- | --- | --- | --- |
| Naïve Bayes, slide 6 | 12,24% / 8,06% / 79,68% | 12,27% / 8,18% / 79,54% | O slide arredonda os produtos antes de normalizar; a página mostra as duas colunas |
| Regras de associação, slide 12 | lift(A → D) = (5/7)/6 | (5/7)/(6/10) = 1,19 | Nota de alerta no módulo |
| Dados ausentes, slide 8 | # Int. imputado = 4 | 26/7 = 3,71 | Explicado como arredondamento |
| Restaurante, 2º nível (slide 38 pede o cálculo) | — | Fome, Preço, Res, Tipo e Tempo empatam com 0,2516 | Mostrado no resumo e na questão arv-15 |

## Gabarito do simulado de 2025

Q1 B, Q2 C, Q3 A, Q4 B, Q5 A, Q6 C, Q7 d (TFN de B = 10/60 = 0,17), Q8 B,
Q11 A, Q12 e (Iniciativa_Projetos, ganho 0,9968; Raciocínio 0,6295; Horas
0,5968), Q13 C (78,05% e 21,95%; produtos 0,0523 e 0,0147 normalizados).

- **Q9**: ambígua. Na leitura estrita, I e III estão corretas e não há
  alternativa para isso; se a II for aceita, seria D. Fica fora da nota
  (o simulado vale 24,5 de 26). Confirmar com a professora.
- **Q10**: gabarito provável C. Depende de "cobertura por classe" significar
  exemplos da classe na folha ÷ total daquela classe (a folha [3, 0] cobre 3
  dos 5 "no" = 60%). Confirmar com a professora.
- **Q4**: a alternativa E ("Apenas I está incorreta") diz o mesmo que a B; o
  gabarito marca B.

## Marcado como fora do material

Definição formal de validação cruzada, viés x variância, pré-poda e pós-poda
como técnicas gerais, como o CART trata ausentes, valor padrão de
`k_neighbors` do SMOTE, fórmulas de normalização, a suposição de independência
do Naive Bayes, correção de Laplace e o funcionamento do GaussianNB.

## Gamificação

Removida a pedido: não há XP, nível, sequência diária, conquistas, chefes ou
sons. Ficou o caderno de erros.
