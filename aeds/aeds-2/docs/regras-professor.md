# Regras Obrigatorias de Codigo (professor)

Fonte: regras oficiais de avaliacao de trabalhos/laboratorios da disciplina
(fornecidas pelo usuario em 2026-09-05). Regras de ambiente de correcao
(Linux, VIM, corretor Local especifico) e de integridade academica (copia,
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
- A correção oficial da disciplina não é reproduzida. O corretor local deste app compila Java apenas no servidor de desenvolvimento; o build estático usa a análise de fragmentos, que não comprova a correção do programa.


## Atualização das fontes em 08/11/2026

O TP2 de 2026/2 amplia explicitamente a API de String em relação à regra básica acima: compareTo, equals, split e format, além de conversões para tipos primitivos. Em C, também lista operações adicionais de string.h e stdio.h. Essas permissões são do TP: a regra do enunciado da avaliação continua prevalecendo. Os exercícios autorais declaram a variante e usam operações básicas quando possível.

Para o roteiro atual da P1, a orientação do aluno em 08/11 separa bolha, seleção e inserção. Quick, Merge e Heap ficam na P2. Formas históricas mais amplas não alteram automaticamente esse escopo.
