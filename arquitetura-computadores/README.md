# Arquitetura de Computadores

## Objetivo

Reunir modulos educacionais voltados para o estudo de **Arquitetura de
Computadores II**. Os modulos cobrem a arquitetura MIPS, caminho de dados
(datapath), pipeline, controle, linguagem de maquina, funcoes, memoria,
aritmetica e desempenho.

## Modulos disponiveis

### [jogo-arquitetura-roguelike/](jogo-arquitetura-roguelike/) - Modulo Interativo de Arquitetura de Computadores

**Estado:** Em desenvolvimento (modulo principal)

Modulo interativo para estudo de Arquitetura de Computadores, com atividades,
simulacoes, visualizacoes e exercicios baseados no conteudo da disciplina. A
aplicacao organiza a pratica por topico, reforca pontos fracos e acompanha o
progresso do aluno ao longo das atividades.

**Topicos cobertos:** Aritmetica computacional, CLA, Lei de Amdahl, Desempenho,
Hierarquia de memoria/Cache, ISA MIPS, Funcoes MIPS, Datapath e Controle,
Tempos (caminho critico), Pipeline.

### [jogo-arquitetura-legacy/](jogo-arquitetura-legacy/) - Aplicacao Legacy de Datapath MIPS

**Estado:** Versao antiga (preservada) - NAO modificar

Versao original da aplicacao em arquivo HTML unico. Inclui atividades de
datapath MIPS uniciclo, Academia de licoes, Modo Aprendiz/Prova e um fluxo de
revisao antigo preservado apenas como historico. Funciona offline, sem servidor,
sem dependencias.

### [primeira-versao/](primeira-versao/) - Snapshot inicial

**Estado:** Preservado (backup)

Copia intacta de uma versao anterior da aplicacao. Serve como referencia
historica do estado do arquivo unico antes das alteracoes posteriores.

## Onde encontrar

| Pasta | Conteudo |
| --- | --- |
| [`jogo-arquitetura-roguelike/`](jogo-arquitetura-roguelike/) | Modulo principal em desenvolvimento |
| [`jogo-arquitetura-legacy/`](jogo-arquitetura-legacy/) | Versao antiga preservada e funcional |
| [`primeira-versao/`](primeira-versao/) | Snapshot inicial preservado |
| [`docs/superpowers/`](docs/superpowers/) | Documentacao de design e plano de implementacao |
| [`work/checkpoints/`](work/checkpoints/) | 12 snapshots de desenvolvimento do legacy |
| [`materiais/`](materiais/) | Materiais academicos publicos |

> **Materiais privados** (PDFs de slides, listas, gabaritos) ficam em
> `materiais-privados/` (ignorada pelo Git). Veja o README dentro de `materiais/`.
