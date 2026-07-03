# Materiais Academicos - Arquitetura de Computadores II

## Objetivo

Centralizar materiais academicos relacionados a Arquitetura de Computadores II
que podem ser **compartilhados publicamente** (resumos, anotacoes proprias,
guias criados por voce).

## O que colocar aqui

- Resumos e anotacoes proprias (texto, Markdown).
- Diagramas criados por voce (PNG, SVG).
- Qualquer material que voce **tenha permissao para redistribuir**.

## O que NAO colocar aqui

- **Slides de aula** (direitos autorais do professor/universidade).
- **Listas de exercicio e gabaritos** oficiais.
- **Provas e resolucoes** oficiais.
- **Qualquer material que nao seja seu ou que nao tenha permissao para publicar.**

Esses materiais ficam em `materiais-privados/` (ignorada pelo Git).

## Como organizar materiais privados localmente

```text
arquitetura-computadores/
  materiais/              versionado (apenas conteudo proprio)
  materiais-privados/     ignorado pelo Git (slides, PDFs, listas, provas)
    slides/
    listas/
    provas/
```

Para criar a estrutura local:

```bash
mkdir -p arquitetura-computadores/materiais-privados/slides
mkdir -p arquitetura-computadores/materiais-privados/listas
mkdir -p arquitetura-computadores/materiais-privados/provas
```

> **Nota:** o modulo interativo faz referencia a materiais externos (via
> `src/content/fontes.js`) que ficam no caminho local `D:\CC\AC2`. Esses
> materiais nao sao incluidos neste repositorio.
