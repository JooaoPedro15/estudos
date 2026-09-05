# Formato da Prova 1

Baseado na foto real em `aeds/materiais-privados/Provas1/` (Prova I, disciplina
Algoritmos e Estruturas de Dados II, PUC Minas). Cobre u00-u04 (fundamentos
de analise, estruturas lineares estaticas, ordenacao, e u04 flexivel do
lado teorico).

## Observacoes principais

- A prova tem so 3 questoes, cada uma bem mais longa/multi-item que as da
  Reavaliacao (varios subitens a, b, c... por questao).
- Questao 1 e so complexidade: trecho de codigo com metodo `foo()`
  invocado em lacos aninhados dependentes de uma condicao (`if (a > b)`),
  cobrando melhor caso, pior caso, forma fechada por somatorio e notacao Theta
  separadamente.
- Questao 2 e prova por inducao usando a propriedade de perturbacao de
  somatorios (`Sn + a(n+1) = a0 + soma(a(i+1))`) para achar formula fechada
  e depois provar por inducao.
- Questao 3 e implementacao em estrutura estatica dada (fila circular por
  array, com `primeiro`/`ultimo` e tamanho + 1) - pede metodos alem dos
  basicos (ex.: um metodo que desfaz a ultima operacao e um metodo que
  mostra os elementos em ordem inversa), nao so os metodos de sempre.

## Macroformatos

| Questao | Formato observado | Como virar atividade |
| --- | --- | --- |
| Q1 | Complexidade de lacos aninhados por Theta, separado por melhor/pior caso e por bloco de codigo | Apresentar trecho com 2 ramos (if/else), pedir Theta de cada ramo e justificar qual e melhor/pior caso |
| Q2 | Formula fechada de somatorio por perturbacao + prova por inducao | Dar Sn generico, pedir fechamento por perturbacao e depois inducao (passo base + passo indutivo) |
| Q3 | Metodo novo em estrutura estatica dada (fila/pilha/lista por array) | Dar classe oficial completa, pedir metodo que nao e um dos basicos (inserir/remover/mostrar) |

## Aplicacao aos modulos de P1

| Modulo | Formato mais natural |
| --- | --- |
| complexidade | Q1: Theta por bloco/ramo, melhor e pior caso |
| somatorio | Q2: formula fechada + inducao |
| vetores | Q1/Q3: analise de lacos sobre array, metodo novo em vetor |
| ordenacao | Q3 (variante): metodo que usa/adapta um algoritmo de ordenacao dado |
| fila, pilha, lista, matriz | Q3: metodo novo na estrutura estatica ou flexivel oficial |
| recursividade | Q2/Q3: quando a solucao pedida e naturalmente recursiva |

## Como evitar copia de prova

Mesma politica da Reavaliacao (ver `docs/reavaliacao-format.md`): usar a
prova para aprender o formato e criar exercicios novos - trocar valores,
nomes de variaveis e estrutura especifica mantendo a mesma habilidade
cobrada.
