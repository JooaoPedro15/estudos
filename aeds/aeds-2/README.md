# AEDS II

Modulo interativo para estudo de Algoritmos e Estruturas de Dados II (AEDS II),
organizado por prova: Prova 1, Prova 2, Prova 3 e Reavaliacao (cumulativa,
cobra tudo). Cada prova tem escopo proprio de modulos, alem da lista completa
de conteudo para estudo livre sem filtro. Este e o modulo atual de AEDS no
repositorio.

## Objetivo do modulo

Ajudar o aluno a praticar ate conseguir resolver questoes no formato real de
cada prova, que cobram simulacao, justificativa, codigo, complexidade e
manipulacao de estruturas de dados.

## Principais funcionalidades

- Selecao de prova (Prova 1/2/3/Reavaliacao) que filtra o Treino de Codigo e
  o Simulado pelos modulos daquela prova; "Ver todo o conteudo" mantem o
  estudo livre sem filtro.
- Campanha com os dominios da Reavaliacao.
- Oficina de codigo com escolha, lacuna, blocos, correcao, codigo curto e
  funcoes inteiras.
- Treino de codigo em sessoes rapidas ou maratona continua.
- Caderno adaptativo de erros com persistencia em `localStorage`.
- Simulado da Reavaliacao com 6 questoes; Prova 1 tem um simulado de
  referencia com as 3 questoes reais; Prova 2 e Prova 3 ainda nao tem
  simulado proprio.
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
aeds-2/
  docs/         Documentacao de produto, arquitetura, interacoes e testes
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
- [Regras obrigatorias de codigo do professor](docs/regras-professor.md)
- [Formato da Prova 1](docs/prova1-format.md)
- [Formato da Prova 2](docs/prova2-format.md)
- [Formato da Prova 3](docs/prova3-format.md)
- [Formato da Reavaliacao](docs/reavaliacao-format.md)
- [Experiencia de aprendizagem](docs/game-mechanics.md)
- [Mapa de conteudo](docs/content-map.md)
- [Caderno adaptativo de erros](docs/adaptive-error-notebook.md)
- [Arquitetura](docs/architecture.md)
- [Estrategia de testes](docs/testing-strategy.md)
- [Roadmap](docs/implementation-roadmap.md)
