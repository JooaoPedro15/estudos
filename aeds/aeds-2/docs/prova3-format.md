# Formato da Prova 3

Baseado em 2 edicoes reais em `materiais-privados/Provas3/` (Prova III) e
em `materiais/Listas/lista-aeds2-prova3.pdf` (bate fortemente com o padrao
observado). Cobre u06 (balanceamento: AVL, 2-3-4, alvinegra), u07 (hash) e
u08 (TRIE/PATRICIA), com forte tendencia a estruturas hibridas/doidona.

## Observacoes principais

- 3-4 questoes; quase sempre a Q1 e AVL (implementar metodo dado um
  atributo auxiliar ja calculado, tipo `nivel` ou uso de log2), a ultima
  quase sempre e doidona (hash + arvore + lista combinados).
- TRIE aparece com variacoes nao-triviais: gerar uma TRIE nova a partir de
  outra existente (strings invertidas), ou retornar todas as palavras com
  um prefixo dado como lista.
- Bloco de verdadeiro-ou-falso e recorrente e cobre rotacao de AVL,
  fragmentacao de arvore 2-3-4 e rotacoes de alvinegra comparando as 3
  estruturas de balanceamento entre si.
- Estruturas hibridas (doidona) sempre restringem o que pode ser usado
  ("nao e permitido adicionar atributos", "use so as classes fornecidas"),
  cobrando decidir a rota certa entre camadas (T1 -> T2 -> T3).

## Macroformatos

| Questao | Formato observado | Como virar atividade |
| --- | --- | --- |
| Q1 | Metodo em AVL usando atributo auxiliar ja calculado (nivel/altura) | Dar classe com atributo pronto, pedir metodo que usa esse atributo para validar propriedade da AVL |
| Q2 | TRIE com variacao (gerar nova TRIE, buscar por prefixo) | Dar TRIE oficial (array de filhos + fim), pedir metodo que ou transforma ou percorre coletando resultado |
| Q3 | Provar ou refutar comparando AVL / 2-3-4 / alvinegra | Bloco de afirmacoes sobre rotacoes/fragmentacao, aluno marca V/F e justifica |
| Q4 | Metodo em estrutura hibrida/doidona (hash + arvore + lista) | Dar 3+ classes conectadas (T1/T2/T3), pedir metodo que decide a rota entre camadas |

## Aplicacao aos modulos de P3

| Modulo | Formato mais natural |
| --- | --- |
| avl | Q1: metodo usando atributo auxiliar, validar propriedade AVL |
| alvinegra | Q3: comparar rotacoes com AVL/2-3-4 |
| arvore234 | Q3: fragmentacao por insercao, comparar com alvinegra |
| trie, patricia | Q2: gerar/transformar TRIE, busca por prefixo |
| hash | Q4: hash com 1+ niveis de reserva |
| doidona | Q4: decidir rota entre T1/T2/T3 (hash + arvore + lista) |

## Como evitar copia de prova

Mesma politica das demais provas. `lista-aeds2-prova3.pdf` reforca esse
padrao com mais 39 variacoes de estrutura hibrida - usar como banco de
inspiracao para variar valores/estrutura, nunca copiar enunciado.
