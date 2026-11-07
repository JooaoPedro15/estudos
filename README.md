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
    aeds-2/         Modulo interativo de AEDS II
    materiais/                  Materiais academicos versionados
  arquitetura-computadores/     Materia Arquitetura de Computadores II
    datapath-quest/             Modulo interativo de datapath MIPS
    materiais/
    docs/
    work/
  ia/                           Materia Inteligencia Artificial
    ia-p1/                      Modulo de estudo da primeira prova
  Grafos/                       Materia Teoria dos Grafos (modulo na propria raiz)
    src/                        Modulo interativo de Grafos (React + Vite)
    Materiais/                  Materiais academicos versionados
    docs/                       Docs de escopo/estilo especificas do modulo
```

## Site unico

Todos os modulos sao publicados juntos num site so, com uma pagina inicial
([`portal/`](portal/)) para escolher a materia:

| Caminho | Modulo |
| --- | --- |
| `/` | Pagina inicial |
| `/arquitetura/` | Arquitetura de Computadores II |
| `/grafos/` | Teoria dos Grafos |
| `/aeds/` | AEDS II |
| `/ia/` | Inteligencia Artificial |

```bash
npm run build    # compila os modulos e monta tudo em site/
npm run preview  # serve site/ em http://localhost:4173
```

O script fica em [`scripts/montar-site.mjs`](scripts/montar-site.mjs). A
hospedagem usa `vercel.json` (Vercel) ou `netlify.toml` (Netlify): os dois
rodam `npm run build` e publicam `site/`. O corretor Java do AEDS so existe no
`npm run dev` do proprio modulo; no site publicado a tela avisa isso.

## Modulos principais

| Modulo | Materia | Estado | Pasta |
| --- | --- | --- | --- |
| AEDS II | AEDS II | Modulo interativo atual | [`aeds/aeds-2/`](aeds/aeds-2/) |
| Grafos | Teoria dos Grafos | Modulo interativo atual | [`Grafos/`](Grafos/) |
| IA P1 | Inteligencia Artificial | Modulo interativo atual | [`ia/ia-p1/`](ia/ia-p1/) |
| Modulo Interativo de Arquitetura de Computadores | Arquitetura II | Preservado | [`arquitetura-computadores/datapath-quest/`](arquitetura-computadores/datapath-quest/) |

## Materiais da disciplina

Os materiais de AEDS II ficam em [`aeds/materiais/`](aeds/materiais/). Eles sao
usados como referencia pelo modulo atual de AEDS, mas nao sao a pasta da
aplicacao educacional.

Provas oficiais e materiais sensiveis ficam em `aeds/materiais-privados/`,
ignorada pelo Git.

Os materiais de Grafos ficam em [`Grafos/Materiais/`](Grafos/Materiais/)
(cronograma, slides, provas e outras referencias versionadas usadas pelo
modulo).

## Como executar o modulo de AEDS

```bash
cd aeds/aeds-2
npm install
npm run dev
```

Comandos tambem existentes no `package.json` do modulo:

```bash
npm test
npm run lint
npm run build
```

## Como executar o modulo de Grafos

```bash
cd Grafos
npm install
npm run dev
```

Comandos tambem existentes no `package.json` do modulo:

```bash
npm test
npm run lint
npm run build
```

## Como executar o modulo de IA

```bash
cd ia/ia-p1
npm install
npm run dev
```

`npm run build` gera `dist/index.html` com tudo embutido, que abre direto do
arquivo (inclusive no celular). Tambem existem `npm test` e `npm run lint`.

## Documentacao

- [Organizacao do repositorio](docs/organizacao-do-repositorio.md)
- [Inventario dos modulos](docs/inventario-dos-projetos.md)
- [README da materia AEDS](aeds/README.md)
- [README do modulo de AEDS](aeds/aeds-2/README.md)
- [README do modulo de Grafos](Grafos/README.md)
- [README da materia IA](ia/README.md)
- [README do modulo IA P1](ia/ia-p1/README.md)
