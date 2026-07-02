# Reavaliacao AEDS II

Jogo educacional voltado ao aprendizado de estruturas de dados de AEDS II, com
foco no formato real da reavaliacao. Este e o projeto atual de AEDS no
repositorio.

## Objetivo do jogo

Ajudar o aluno a praticar ate conseguir resolver questoes de reavaliacao que
cobram simulacao, justificativa, codigo, complexidade e manipulacao de
estruturas de dados.

## Principais funcionalidades

- Campanha com 6 dominios da reavaliacao.
- Oficina de codigo com escolha, lacuna, blocos, correcao, codigo curto e
  funcoes inteiras.
- Treino de codigo em sessoes rapidas ou maratona continua.
- Caderno adaptativo de erros com persistencia em `localStorage`.
- Simulado final com 6 questoes no formato da reavaliacao.
- Aba de estruturas com visualizacoes animadas, insercao, remocao, busca,
  execucao passo a passo e visualizacao de codigo.
- Visualizacoes dedicadas para estruturas como Doidona, TRIE e AVL.
- Botao `Me ensine` para apoio durante as questoes.

## Requisitos

- Node.js e npm.
- Ambiente validado localmente com Node.js `v22.15.0` e npm `10.9.2`.

## Instalar dependencias

```bash
npm install
```

## Executar localmente

```bash
npm run dev
```

O Vite informa a URL local no terminal ao iniciar o servidor.

## Testar e gerar build

```bash
npm test
npm run lint
npm run build
```

O `package.json` nao define comando de preview.

## Principais pastas

```text
reavaliacao-aeds-2/
  docs/         Documentacao de produto, arquitetura, mecanicas e testes
  src/app/      Telas principais da experiencia
  src/content/  Dominios, questoes e treinos de codigo
  src/engine/   Avaliadores, simulado, treino e revisao adaptativa
  src/persistence/ Salvamento local em localStorage
  src/styles/   Tema compartilhado
  src/test/     Configuracao dos testes
  src/types/    Tipos de conteudo e progresso
  src/viz/      Visualizacoes e operacoes das estruturas
```

## Problemas comuns

- Se `npm` falhar no PowerShell por politica de execucao, use `npm.cmd` no lugar
  de `npm`, por exemplo `npm.cmd run dev`.
- Se dependencias estiverem ausentes, execute `npm install` dentro desta pasta.
- Se o progresso local ficar inconsistente durante desenvolvimento, limpe o
  `localStorage` do navegador para este app.
- Se o build falhar com erro de tipo, rode `npm run lint` para ver o erro do
  TypeScript sem gerar build.

## Documentacao

- [Visao de produto](docs/product-spec.md)
- [Formato da reavaliacao](docs/reavaliacao-format.md)
- [Mecanicas de jogo](docs/game-mechanics.md)
- [Mapa de conteudo](docs/content-map.md)
- [Caderno adaptativo de erros](docs/adaptive-error-notebook.md)
- [Arquitetura](docs/architecture.md)
- [Estrategia de testes](docs/testing-strategy.md)
- [Roadmap](docs/implementation-roadmap.md)

## Versao antiga

A versao antiga do jogo geral de AEDS foi preservada em
[`../../nao_utilizados/jogo-aeds-2-antigo/`](../../nao_utilizados/jogo-aeds-2-antigo/).
Ela nao esta mais em desenvolvimento e nao deve ser considerada a versao
principal.
