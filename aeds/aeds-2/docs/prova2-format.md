# Formato da Prova 2

Baseado em 2 edicoes reais em `materiais-privados/Provas2/` (Prova II).
Cobre u04 (estruturas flexiveis/encadeadas, teorica e pratica) e u05
(arvore binaria/ABB basica, sem balanceamento ainda).

## Observacoes principais

- 3-4 questoes, cada uma dando uma estrutura composta ou hibrida pronta
  (classes completas) e pedindo 1 metodo novo especifico.
- Recorrente: estrutura "de estrutura" - lista de pilhas, arvore de arvore
  (arvore de caracteres + arvore de palavras), matriz encadeada com listas
  na diagonal. O aluno precisa decidir em qual camada agir.
- Uma edicao trouxe bloco de verdadeiro-ou-falso com justificativa sobre
  percursos de arvore, complexidade de Merge/Heap Sort, ponteiros (C) e
  complexidade de insercao/remocao em lista com celula cabeca.
- ABB pode ser cobrada com variacao da regra padrao (ex.: permitir
  repetidos com contador em vez de ignorar) - nao so o ABB de sempre.

## Macroformatos

| Questao | Formato observado | Como virar atividade |
| --- | --- | --- |
| Q1 | Metodo novo em estrutura composta (lista-de-X, arvore-de-X) | Dar classes completas, pedir metodo que percorre a camada externa e decide o que fazer na interna |
| Q2 | Variar uma regra padrao de ABB/lista/matriz | Dar estrutura oficial, pedir metodo que muda 1 regra (ex.: contar repetidos, dividir celulas, remover coluna) |
| Q3 | Metodo em estrutura flexivel com referencias em varias direcoes (matriz encadeada: sup/inf/esq/dir) | Dar classe com ponteiros em 4 direcoes, pedir metodo que percorre e religa sem perder referencia |
| Q4 (quando presente) | Provar ou refutar (percursos, complexidade, ponteiros, listas) | Bloco de afirmacoes tecnicas, aluno marca V/F e justifica |

## Aplicacao aos modulos de P2

| Modulo | Formato mais natural |
| --- | --- |
| lista | Q1/Q2: metodo em lista simples/dupla, variacao de regra (ex.: dividir cada celula em duas, ou remover valor) |
| fila | Q1: metodo em fila encadeada, decidir camada composta |
| pilha | Q1: metodo em pilha encadeada, estrutura "lista de pilhas" |
| matriz | Q3: metodo em matriz encadeada percorrendo/religando 4 direcoes |
| arvore | Q2/Q4: ABB com regra variada, percursos, complexidade |

## Como evitar copia de prova

Mesma politica das demais provas: usar como referencia de formato, variar
valores/nomes/estrutura especifica, nunca reproduzir o enunciado oficial
dentro do app.
