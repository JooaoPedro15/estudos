# Arquitetura de Computadores

## Objetivo

Reunir modulos educacionais voltados para o estudo de **Arquitetura de
Computadores II**. Os modulos cobrem a arquitetura MIPS, caminho de dados
(datapath), pipeline, controle, linguagem de maquina, funcoes, memoria,
aritmetica e desempenho.

## Modulos disponiveis

### [jogo-arquitetura-roguelike/](jogo-arquitetura-roguelike/) - ARQUITETO: Tape-Out Run

**Estado:** Em desenvolvimento (modulo principal)

Modulo interativo para estudo de Arquitetura de Computadores, com atividades,
simulacoes e exercicios baseados no conteudo da disciplina. A aplicacao usa uma
estrutura roguelite: cada run leva o aluno por um mapa procedural, com relicarios,
arquetipos, desafios educacionais, topicos fracos que retornam e um boss
multi-etapa que representa a prova.

**Topicos cobertos:** Aritmetica computacional, CLA, Lei de Amdahl, Desempenho,
Hierarquia de memoria/Cache, ISA MIPS, Funcoes MIPS, Datapath e Controle,
Tempos (caminho critico), Pipeline.

### [jogo-arquitetura-legacy/](jogo-arquitetura-legacy/) - MIPS Datapath Quest (versao 1)

**Estado:** Versao antiga (preservada) - NAO modificar

Versao original da aplicacao em arquivo HTML unico. Quiz/simulador do datapath
MIPS uniciclo com 4 modos de atividade, Academia de licoes, Modo Aprendiz/Prova
e um modo "Roguelike da Prova" embutido. Funciona offline, sem servidor, sem
dependencias.

### [primeira-versao/](primeira-versao/) - Snapshot pre-roguelike

**Estado:** Preservado (backup)

Copia intacta da aplicacao original **antes** da implementacao do modo
"Roguelike da Prova". Serve como referencia do estado anterior ao modo
roguelike ter sido adicionado ao arquivo unico.

## Onde encontrar

| Pasta | Conteudo |
| --- | --- |
| [`jogo-arquitetura-roguelike/`](jogo-arquitetura-roguelike/) | Modulo principal em desenvolvimento |
| [`jogo-arquitetura-legacy/`](jogo-arquitetura-legacy/) | Versao antiga preservada e funcional |
| [`primeira-versao/`](primeira-versao/) | Snapshot anterior ao modo roguelike |
| [`docs/superpowers/`](docs/superpowers/) | Documentacao de design e plano de implementacao |
| [`work/checkpoints/`](work/checkpoints/) | 12 snapshots de desenvolvimento do legacy |
| [`materiais/`](materiais/) | Materiais academicos publicos |

> **Materiais privados** (PDFs de slides, listas, gabaritos) ficam em
> `materiais-privados/` (ignorada pelo Git). Veja o README dentro de `materiais/`.
