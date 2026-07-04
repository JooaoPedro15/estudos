# Materiais Academicos - AEDS II

Esta pasta centraliza materiais versionados usados como referencia para os
modulos de AEDS II.

## Uso atual

O modulo `aeds/reavaliacao-aeds-2` usa os materiais versionados desta pasta e as
provas locais privadas para entender:

- o formato das reavaliacoes;
- os tipos de questao cobrados;
- os dominios de conteudo mais importantes;
- exemplos de codigo, estruturas e algoritmos dos materiais.

## Organizacao

```text
aeds/materiais/
  Listas/
    lista-aeds2-prova3.pdf
  Slides AEDS 2/
    u01 Fundamentos de Analise de Algoritmos/
    u02 Estruturas de dados basicas lineares/
    u03 Ordenacao em memoria principal/
    u04 Estruturas de dados basicas flexiveis/
    u05 Arvores binarias/
    u06 Balanceamento de arvores/
    u07 Tabelas e dicionarios/
    u08 Arvores TRIE/
```

Provas oficiais e materiais sensiveis ficam fora do Git em:

```text
aeds/materiais-privados/Provas/
```

## Regra do repositorio

Para este projeto, o dono do repositorio autorizou que esta pasta de materiais
versionaveis possa subir para o Git. Se algum material futuro nao puder ser
versionado, use a pasta local ignorada:

```text
aeds/materiais-privados/
```

## Como o modulo deve usar estes materiais

A aplicacao deve usar os materiais como referencia de formato e conteudo,
criando exercicios proprios com valores, enunciados e variacoes novas. A ideia
nao e copiar uma prova inteira, mas treinar as habilidades que ela cobra.

A lista `lista-aeds2-prova3.pdf` deve guiar principalmente os treinos de codigo:
classes prontas, metodo pedido, estrutura visual e adaptacao de logica.
