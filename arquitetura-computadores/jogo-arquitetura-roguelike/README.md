# ARQUITETO: Tape-Out Run

## Nome

ARQUITETO: Tape-Out Run

## Descricao

Modulo interativo de Arquitetura de Computadores (MIPS) com estrutura roguelite.
Cada run leva o aluno por um mapa procedural, constroi um "build" de CPU
(arquetipo + relicarios), enfrenta desafios educacionais de toda a ementa de AC2
e batalha um boss multi-etapa que representa a prova.

## Objetivo educacional

Cobrir **toda a ementa de Arquitetura de Computadores II** de forma integrada,
nao como quiz puro, mas como um ambiente interativo em que os conhecimentos sao
parte do estado da experiencia. Acertar/errar tem consequencias concretas
(integridade, defeitos, combo). O motor adaptativo ressurge topicos em que o
aluno tem dificuldade, gerando um relatorio de run com o que estudar.

## Conteudos trabalhados

10 topicos do syllabus confirmado nos materiais de AC2:

| Topico | Desafios disponiveis |
| --- | --- |
| Aritmetica computacional | `src/content/challenges/aritmetica.js` |
| CLA (Carry-Lookahead Adder) | `src/content/challenges/cla.js` |
| Lei de Amdahl | `src/content/challenges/amdahl.js` |
| Desempenho | `src/content/challenges/desempenho.js` |
| Memoria / Cache | `src/content/challenges/memoria.js` |
| ISA (Instruction Set Architecture) | `src/content/challenges/isa.js` |
| Funcoes MIPS | `src/content/challenges/funcoes.js` |
| Datapath e Controle | `src/content/challenges/datapath.js` |
| Tempos (caminho critico) | `src/content/challenges/datapath.js` |
| Pipeline | `src/content/challenges/pipeline.js` |

7 tipos de desafio: escolha unica, multipla escolha, numerico, ordenar blocos,
alternar sinais, corrigir bug, prever saida.

## Interacoes

- **Mapa procedural** em camadas (estilo Slay the Spire): sem becos sem saida,
  com escolha de caminho, nos de desafio, elite, loja, descanso, evento e boss.
- **Recursos de run:** Integridade (HP), Orcamento (moeda), Foco, Calor
  (overclock), Combo.
- **Build system:** arquetipo inicial + 8 relicarios com 3 arquetipos.
  Relicarios alteram o resolvedor de respostas.
- **Motor adaptativo:** rastreia mastery por subtopico; topicos fracos voltam
  mais vezes.
- **Defeitos (cicatrizes):** erros criam defeitos persistentes; salas de
  descanso/revisao podem cura-los.
- **Boss final:** multi-etapa, cobrindo multiplos topicos (representa a prova).
- **Relatorio de run:** pontos fortes, fracos e referencias de material para estudar.
- **Save/load local** versionado com sanitizacao de dados.

## Tecnologias

- **JavaScript (ES modules)** - zero dependencias externas
- **HTML5 + CSS3** - UI renderizada
- **WebAudio** - efeitos sonoros gerados proceduralmente
- **SVG** - datapaths e visuais gerados em codigo
- **localStorage** - persistencia de save
- **Node.js** - testes (sem framework, asserts manuais)

## Requisitos

- Node.js 22+ (para testes)
- Python 3 (para servir arquivos estaticos, via `npm run serve`)
- Navegador moderno (ES modules via `<script type="module">`)

## Instalacao

Nao ha `node_modules`: o projeto nao possui dependencias. Basta clonar e servir.

```bash
cd arquitetura-computadores/jogo-arquitetura-roguelike
npm run serve          # python -m http.server 8080
```

Ou abra `index.html` com qualquer servidor estatico na porta 8080.

## Execucao

```bash
npm run serve
```

Acesse `http://localhost:8080` no navegador.

## Testes

```bash
npm test              # node tests/run-all.js
```

Executa testes de: RNG, mapgen, validacao de conteudo, resolvedor de respostas,
mastery, selecao adaptativa, recursos, migracao de save, progressao e motor da
experiencia.

## Estrutura das pastas

```text
jogo-arquitetura-roguelike/
  src/
    main.js               Bootstrap (carrega conteudo + save, monta UI)
    config.js             Constantes sintonizaveis (run, combate, scoring)
    core/                 Engine da experiencia (state machine, recursos, RNG, answers)
    mapgen/               Geracao procedural de mapa
    adaptive/             Mastery tracking, selecao adaptativa, relatorios
    meta/                 Relicarios, arquetipos, meta-progressao
    persistence/          Save/load com migracao versionada
    content/              Schema, validacao, registro + 9 modulos de desafios
      challenges/         datapath, pipeline, funcoes, memoria, isa, cla,
                          aritmetica, amdahl, desempenho
    effects/              Efeitos sonoros (sfx)
  tests/                  Testes (Node puro, sem framework)
  styles/                 CSS principal
  docs/                   BRAINSTORM.md (decisoes de design)
  index.html              Entry point
  package.json
```

## Estado atual

**Em desenvolvimento.** O nucleo (engine, mapgen, adaptativo, conteudo, save)
esta implementado e testado. A UI esta funcional. E o modulo principal e ativo
da materia.

## Limitacoes

- Sem simulador visual de datapath com fiacao interativa (futuro: conceito A completo).
- Sem pipeline em tempo real com forwarding/stall interativo (futuro: conceito B completo).
- Efeitos sonoros e visuais ainda em evolucao.
- Quantidade de desafios por subtopico pode ser expandida.

## Proximos passos

- Simulador visual de datapath com fiacao interativa.
- Pipeline em tempo real (forwarding/stall).
- Mais arquetipos, relicarios e eventos.
- Desafios diarios por seed.
- Editor de conteudo.
