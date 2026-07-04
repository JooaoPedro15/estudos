# Organizacao do Repositorio

Este documento explica a estrutura da Plataforma Interativa de Estudos e como
novos modulos educacionais devem ser adicionados.

## Principios

1. Repositorio unico, modulos independentes.
2. Uma pasta raiz por materia.
3. Um modulo educacional por subpasta.
4. Documentacao junto do modulo.
5. Materiais ficam em `materiais/` quando podem ser versionados e em
   `materiais-privados/` quando devem ficar apenas localmente.

## Estrutura

```text
<raiz-do-repositorio>/
  README.md
  docs/
    README.md
    organizacao-do-repositorio.md
    inventario-dos-projetos.md
    superpowers/
      specs/
  aeds/
    README.md
    reavaliacao-aeds-2/
    materiais/
    materiais-privados/      ignorado pelo Git
  arquitetura-computadores/
    README.md
    datapath-quest/
    docs/
    materiais/
    work/
```

## Padrao de nomes

| Item | Regra | Exemplo |
| --- | --- | --- |
| Materia | minusculo, sem acento, hifenizado quando necessario | `arquitetura-computadores` |
| Modulo educacional | nome hifenizado e descritivo | `reavaliacao-aeds-2` |
| Docs do projeto | dentro do proprio modulo | `aeds/reavaliacao-aeds-2/docs/` |
| Materiais versionados | dentro da materia | `aeds/materiais/` |
| Materiais privados | pasta ignorada localmente | `aeds/materiais-privados/` |
| Versoes preservadas | dentro da materia correspondente | `arquitetura-computadores/datapath-quest/` |

## Como adicionar um modulo educacional

1. Criar a pasta dentro da materia.
2. Criar `README.md` do modulo.
3. Criar `docs/` do modulo com spec, experiencia de aprendizagem, arquitetura e roadmap quando fizer sentido.
4. Se houver codigo, manter dependencias e comandos dentro da propria pasta.
5. Atualizar o README da materia correspondente.
6. Atualizar `docs/inventario-dos-projetos.md`.
7. Atualizar o README raiz quando o modulo ja tiver estado tecnico claro.

## Onde colocar documentacao

| Tipo | Onde |
| --- | --- |
| Documentacao geral do repo | `docs/` |
| Spec formal do fluxo de design | `docs/superpowers/specs/` |
| Documentacao de um modulo | `<materia>/<modulo>/docs/` |
| README por materia | `<materia>/README.md` |
| README por modulo | `<materia>/<modulo>/README.md` |

## Materiais

Por padrao, materiais sensiveis ou privados ficam fora do Git. Ainda assim, um
modulo pode versionar materiais de referencia em `<materia>/materiais/` quando
o dono do repositorio decidir que eles podem subir.

No caso atual de AEDS II, provas oficiais ficam em
`aeds/materiais-privados/Provas/`, ignorada pelo Git. Materiais versionaveis,
como listas e slides autorizados, ficam em `aeds/materiais/` e sao usados como
base do modulo `aeds/reavaliacao-aeds-2`.

## Independencia dos modulos

- Cada modulo deve ter seus proprios comandos.
- Nao ha workspace, Turborepo ou Nx.
- Dependencias nao devem ser compartilhadas implicitamente entre modulos.
- O `.gitignore` raiz cobre dependencias, builds, temporarios e pastas privadas.
- Caminhos internos de um modulo devem funcionar a partir da propria pasta.
- Pastas preservadas como historico nao devem ser tratadas como modulo principal.
