# Plataforma Interativa de Estudos

Repositorio unico com modulos educacionais interativos criados para visualizacao,
pratica e revisao de conteudos academicos. Cada modulo e independente: tem sua
propria pasta, dependencias, testes e comandos.

## Organizacao geral

```text
<raiz-do-repositorio>/
  README.md
  .gitignore
  docs/                         Documentacao geral do repositorio
  aeds/                         Materia AEDS II
    reavaliacao-aeds-2/         Modulo interativo de AEDS II
    materiais/                  Materiais academicos e provas usadas como referencia
  arquitetura-computadores/     Materia Arquitetura de Computadores II
    jogo-arquitetura-roguelike/ Modulo interativo principal da materia
    jogo-arquitetura-legacy/    Versao antiga preservada da materia
    primeira-versao/            Snapshot anterior
    datapath-quest/             Copia tecnica preservada do datapath
    materiais/
    docs/
    work/
```

## Modulos principais

| Modulo | Materia | Estado | Pasta |
| --- | --- | --- | --- |
| Reavaliacao AEDS II | AEDS II | Modulo interativo atual | [`aeds/reavaliacao-aeds-2/`](aeds/reavaliacao-aeds-2/) |
| Modulo Interativo de Arquitetura de Computadores | Arquitetura II | Em desenvolvimento | [`arquitetura-computadores/datapath-quest/`](arquitetura-computadores/datapath-quest/) |

## Materiais da disciplina

Os materiais de AEDS II ficam em [`aeds/materiais/`](aeds/materiais/). Eles sao
usados como referencia pelo modulo atual de AEDS, mas nao sao a pasta da
aplicacao educacional.

## Como executar o modulo atual de AEDS

```bash
cd aeds/reavaliacao-aeds-2
npm install
npm run dev
```

Comandos tambem existentes no `package.json` do modulo atual:

```bash
npm test
npm run lint
npm run build
```

## Documentacao

- [Organizacao do repositorio](docs/organizacao-do-repositorio.md)
- [Inventario dos modulos](docs/inventario-dos-projetos.md)
- [README da materia AEDS](aeds/README.md)
- [README do modulo atual de AEDS](aeds/reavaliacao-aeds-2/README.md)
