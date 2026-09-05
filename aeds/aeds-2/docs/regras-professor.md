# Regras Obrigatorias de Codigo (professor)

Fonte: regras oficiais de avaliacao de trabalhos/laboratorios da disciplina
(fornecidas pelo usuario em 2026-09-05). Regras de ambiente de correcao
(Linux, VIM, corretor Verde especifico) e de integridade academica (copia,
excecoes negociadas com o professor) ficam de fora daqui por serem so
logistica de correcao, nao formato de codigo - nao se aplicam a exercicios
gerados por este app.

Todo exercicio novo (teorico ou pratico) escrito para este app deve
respeitar:

1. Programas em Java ou C.
2. Em Java: so tipos primitivos + `MyIO`, `String` (somente os metodos
   `char charAt(int)` e `int length()`), `Scanner`. Em C: so tipos
   primitivos + os metodos disponiveis em `stdio.h`/`stdlib.h`.
3. **Um unico arquivo** por questao (`.java` ou `.c`) - nao separar classes
   auxiliares em arquivos proprios; tudo no mesmo arquivo.
4. Comentario Javadoc curto em cada metodo. Metodo sem comentario ou com
   comentario que nao explica nada e considerado incompleto.
5. Leitura de inteiro: entrada vazia ou nao-numerica deve resultar em zero,
   nao em excecao.
6. Contagem de letras/vogais/consoantes ignora acento e cedilha -
   considerar somente caracteres cujo codigo ASCII esteja entre 'A'-'Z' ou
   'a'-'z'.
7. Por exercicio: a resposta esperada cobre analise + implementacao +
   comentarios. Recomenda-se testar mais de uma vez antes de considerar
   pronto, mesmo sem corretor automatico neste app.

## Fora de escopo (nao se aplica aqui)

- Copia de trabalho / excecoes negociadas com o professor (integridade
  academica, nao formato de codigo).
- Correcao no Linux dos laboratorios, uso do VIM, apresentacao ao vivo
  (logistica presencial da disciplina, nao existe neste app).
- Corretor Verde e identificador de plagio especificos da PUC (este app nao
  compila nem executa codigo de verdade, nao ha corretor tipo Verde aqui).
