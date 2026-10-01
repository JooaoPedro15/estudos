# IA P1

Página de estudos para a primeira prova de Inteligência Artificial
(Profa. Cristiane Neri Nobre, PUC Minas), segunda-feira 05/10/2026.

Todo o conteúdo vem só do material da disciplina (slides, notebooks mostrados
em sala, prova de 2025, CSVs de Pão e Manteiga e planilha do teste t). Cada
seção, fórmula, pegadinha e questão cita o arquivo e o slide/célula de origem.
O que não está no material aparece marcado como "Fora do material".

## O que tem

- **7 módulos** na ordem do aviso da prova: Introdução (IA x AM x KDD,
  holdout, validação cruzada, overfitting), Pré-processamento (balanceamento,
  ausentes, inconsistentes/redundantes, conversão simbólico-numérica), Árvore de
  decisão, Random Forest e ensembles, Regras de associação, Naive Bayes
  (prioridade média) e Códigos Python (uma ficha por notebook).
- Em cada módulo: resumo, fórmulas, exemplo resolvido passo a passo, caixa de
  pegadinhas de prova e questões.
- **86 questões**: fechadas no estilo da professora (afirmações I/II/III) e
  abertas-fechadas, em que você completa campos ou uma tabela e a página corrige
  com tolerância de ±0,01, aponta o campo errado e mostra a resolução.
- **Caderno de erros**: toda questão errada (inclusive do simulado) fica salva
  no navegador e pode ser refeita sozinha; sai do caderno quando você acerta.
- **Simulado da prova de 2025** com cronômetro, correção e revisão. A Q9 é
  ambígua e fica fora da nota; a Q10 usa o gabarito provável (confirmar com a
  professora).
- **Ferramentas**: entropia e ganho (com gain ratio e Gini), matriz de confusão
  (precisão, recall, F1, TFN, TFP por classe), suporte/confiança/lift com
  Apriori e Naive Bayes passo a passo com normalização.
- Árvores desenhadas no formato do `plot_tree` do sklearn, com visão em texto
  (`export_text`) para o celular.

## Rodar

Dentro de `ia/ia-p1/`:

```bash
npm install
npm run dev
```

O `.npmrc` liga `legacy-peer-deps` (o npm 10 desta máquina falha sem isso).

## Abrir sem servidor (celular)

```bash
npm run build
```

Gera `dist/index.html` com tudo embutido (JS, CSS e fontes; cerca de 900 KB).
Dá para abrir direto do arquivo ou mandar para o celular. O progresso fica no
`localStorage` daquele navegador.

## Testes

```bash
npm test
npm run lint
```

Os testes conferem os números do conteúdo contra o motor de cálculo (ganhos
da Q12, Naive Bayes da Q13, TFN da Q7, Gini do slide 64, lifts do Apriori,
entropias de cada nó das árvores) e checam que toda seção e questão cita um
arquivo real do material, que não há emoji no texto e que os números escritos
à mão nas explicações batem com o gabarito calculado.

## Pastas

```text
ia-p1/
  docs/                 Mapa de fontes e decisões de conteúdo
  src/app/              Shell e rotas por hash (funciona via file://)
  src/components/       Questões, blocos de conteúdo, árvore do sklearn, diagramas
  src/content/          Bases do material, módulos, questões e simulado de 2025
  src/engine/           Cálculos (entropia, Gini, métricas, Apriori, Naive Bayes)
  src/screens/          Início, módulo, treino, caderno, simulado, ferramentas
  src/state/            Histórico, caderno de erros e localStorage com try/catch
  src/styles/           Tema e estilos
```

## Documentação

- [Fontes e decisões de conteúdo](docs/fontes-e-decisoes.md)
