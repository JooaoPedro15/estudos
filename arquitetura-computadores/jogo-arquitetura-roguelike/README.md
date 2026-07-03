# Modulo Interativo de Arquitetura de Computadores

## Nome

Modulo Interativo de Arquitetura de Computadores

## Descricao

Modulo interativo de Arquitetura de Computadores (MIPS) voltado a visualizacao,
pratica e revisao do conteudo de AC2. A aplicacao organiza atividades por
topico, apresenta exercicios com feedback, acompanha progresso e destaca pontos
que precisam de revisao.

## Objetivo educacional

Cobrir **toda a ementa de Arquitetura de Computadores II** de forma integrada,
com atividades baseadas em simulacao, analise, calculo, controle, pipeline e
desempenho. O foco e ajudar o aluno a relacionar os conceitos da disciplina,
identificar lacunas de entendimento e revisar com base no proprio desempenho.

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

- **Sequencia de atividades:** organiza os topicos em uma trilha de estudo com
  escolha de proximos exercicios.
- **Acompanhamento de progresso:** registra acertos, erros, recorrencia de
  dificuldades e topicos que precisam de revisao.
- **Motor adaptativo:** rastreia dominio por subtopico; topicos fracos voltam
  com mais frequencia.
- **Revisao orientada por erro:** erros persistentes geram indicacoes de estudo
  e atividades relacionadas.
- **Relatorio de estudo:** resume pontos fortes, pontos fracos e referencias de
  material para revisar.
- **Save/load local** versionado com sanitizacao de dados.

## Tecnologias

- **JavaScript (ES modules)** - zero dependencias externas
- **HTML5 + CSS3** - UI renderizada
- **WebAudio** - efeitos sonoros gerados proceduralmente
- **SVG** - datapaths e visuais gerados em codigo
- **localStorage** - persistencia de progresso
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

Executa testes de: RNG, geracao de sequencias, validacao de conteudo,
resolvedor de respostas, dominio por topico, selecao adaptativa, recursos,
migracao de dados, progresso e motor da experiencia.

## Estrutura das pastas

```text
jogo-arquitetura-roguelike/
  src/
    main.js               Bootstrap (carrega conteudo + dados locais, monta UI)
    config.js             Constantes sintonizaveis (sessao, avaliacao, scoring)
    core/                 Engine da experiencia (state machine, recursos, RNG, answers)
    mapgen/               Geracao de sequencias de estudo
    adaptive/             Mastery tracking, selecao adaptativa, relatorios
    meta/                 Recursos de progresso e configuracoes da experiencia
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

**Em desenvolvimento.** O nucleo (engine, sequenciamento, adaptativo, conteudo e
salvamento local) esta implementado e testado. A UI esta funcional. E o modulo
principal e ativo da materia.

## Limitacoes

- Sem simulador visual de datapath com fiacao interativa.
- Sem pipeline em tempo real com forwarding/stall interativo.
- Efeitos sonoros e visuais ainda em evolucao.
- Quantidade de desafios por subtopico pode ser expandida.

## Proximos passos

- Simulador visual de datapath com fiacao interativa.
- Pipeline em tempo real (forwarding/stall).
- Mais atividades por topico.
- Desafios diarios por seed.
- Editor de conteudo.
