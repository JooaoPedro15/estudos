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
- Prova pratica da Prova 1 com 44 problemas REAIS de juiz online (beecrowd,
  LeetCode e Codewars): mesmo problema, mesmas restricoes, exemplos oficiais
  de entrada/saida e link para o original.
- Corretor estilo Verde (botao `Rodar no corretor`): compila e executa o
  codigo com o JDK da maquina e da a nota em porcentagem da saida publica
  (exemplos oficiais) e da saida privada (casos extras gerados, com caso
  grande que pega algoritmo lento). Aceita so os metodos pedidos ou o
  programa inteiro, como no Verde.

## Requisitos

- Node.js e npm.
- Ambiente validado localmente com Node.js `v22.15.0` e npm `10.9.2`.
- Para o corretor da prova pratica: JDK (javac e java no PATH). Validado com
  Temurin 21. Sem JDK, o app funciona e a prova pratica volta a corrigir so
  pelos trechos obrigatorios do codigo.

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
npm run verificar:pratica
```

`verificar:pratica` precisa do JDK: compila e roda todas as solucoes modelo da
prova pratica no corretor e exige 100% na saida publica e na privada (e confere
as saidas privadas de alguns problemas contra implementacoes independentes).
Leva cerca de 1 a 2 minutos, por isso fica fora do `npm test`.

O `package.json` nao define comando de preview. O corretor so existe no
`npm run dev` (e um plugin do servidor do Vite); o build estatico nao tem
backend para executar Java.

## Principais pastas

```text
aeds-2/
  corretor/     Corretor estilo Verde (Node): monta, compila e roda o Java
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
