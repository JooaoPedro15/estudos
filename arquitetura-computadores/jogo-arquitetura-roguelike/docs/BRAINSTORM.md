# Brainstorm e decisao de design - Modulo Arquitetura (roguelite)

Data: 2026-06-27. Processo conduzido com 3 agentes especializados em paralelo
(mineracao de material, design de experiencia roguelike, arquitetura de
software/educacional).

## 1. Conceitos considerados

A premissa compartilhada que emergiu: **nao fazer "responder pergunta -> causar
dano".** O modelo do MIPS/arquitetura deve SER o estado da experiencia.
Acertar/errar vira consequencia (hardware que funciona ou quebra), nao um
checkpoint de quiz.

### Conceito A - "Datapath Forge" (montar e simular)

Voce monta uma CPU a partir de componentes saqueados e roda um programa por ela.
Os tempos das unidades (Memoria 4ns, Reg 1ns, ULA 2ns...) sao os
precos/atributos das pecas; os sinais de controle sao a fiacao; o caminho
critico real (lw=12, sw=11, R=8, beq=7, j=4) e a condicao de vitoria. Erro =
datapath quebrado visivel.

- Forca: cobre datapath, controle, tempos, CLA, uni/multiciclo. Muito expansivel.
- Risco: simulador de datapath + UI de fiacao e o item mais caro de implementar.

### Conceito B - "Pipeline Dispatcher" (puzzle de hazards em tempo real)

Voce e a unidade de controle de hazards de um pipeline de 5 estagios. Instrucoes
fluem IF->ID->EX->MEM->WB; voce insere forwarding/stall/flush sob pressao.

- Forca: ensina pipeline, hazards, timing, convencao de chamada de forma muito divertida.
- Risco: topico estreito (nao cobre aritmetica, cache, Amdahl). Pode virar uma atividade repetitiva se a visualizacao for fraca.

### Conceito C - "Profiler's Gambit" (otimizacao/economia)

Voce e engenheiro de desempenho com orcamento limitado e um prazo. Lei de Amdahl
e a matematica de combate: cada upgrade so acelera a fracao que toca. Cache,
clock, compilador sao cartas com tradeoff. Otimizar o caso comum (GCC/ABC) e a
condicao de vitoria.

- Forca: cobre Amdahl, desempenho (IC x CPI x clock), cache, metrica MIPS, representacao numerica. E o mais facil de implementar (resolvedor de formulas + cartas).
- Risco: pode parecer "planilha" se a visualizacao for fraca.

## 2. Comparacao (resumo das pontuacoes dos agentes)

| Criterio | A Forge | B Dispatcher | C Profiler |
|---|---|---|---|
| Diversao pura | 4 | 5 | 3 |
| Poder de ensino | 5 | 4 | 4 |
| Variedade entre runs | 4 | 4 | 4 |
| Facilidade de implementacao | 2 | 3 | 4 |
| Potencial de expansao | 5 | 3 | 4 |
| Pouca dependencia de perguntas (maior=melhor) | 4 | 5 | 4 |
| Cobertura do conteudo | alta (estrutural) | media | alta (quantitativa) |

Nenhum conceito sozinho cobre toda a ementa. A/forge domina o lado estrutural;
C/profiler o lado quantitativo; B/dispatcher o lado dinamico.

## 3. Proposta escolhida - "ARQUITETO: Tape-Out Run" (sintese)

**Modulo roguelite de construcao de CPU.** Cada run conduz o aluno por um mapa
procedural montando um processador. As decisoes de build (componentes/reliquias)
mudam QUAIS conhecimentos sao vantajosos. Encontros sao desafios educacionais
de toda a ementa, embrulhados em economia de run, risco/recompensa e defeitos
persistentes, nao em quiz puro.

Espinha = economia/estado do conceito A + C (build + resolvedor de desempenho),
com encontros de B (pipeline) como tipo de sala. Boss = a prova (etapas
multi-topico).

### Por que esta escolha

1. **Cobre a ementa inteira** confirmada nos materiais (aritmetica, CLA, Amdahl, desempenho, cache, ISA, funcoes, datapath, controle, tempos, pipeline): cada topico vira conteudo de dado (data-driven), expansivel.
2. **Nao e quiz**: o que da profundidade e o build (arquetipos + reliquias), o risco/recompensa (overclock, gastar orcamento), os **defeitos** (erros viram cicatrizes que persistem e precisam de reparo) e a **selecao adaptativa** (topicos fracos voltam mais).
3. **Implementavel em vanilla JS** sem simulador pesado: o nucleo usa matematica de desempenho real (caminho critico, Amdahl, CPI) + sistema de cartas, que e testavel.
4. **Sessao curta com progresso**: run de ~15-30 min, save local, meta-progressao leve.

### Mudancas principais vs. versao antiga

- Versao antiga: arquivo unico, 4 modos de exercicio do datapath + modo roguelike embutido.
- Nova versao: modulo multi-arquivo (ES modules), logica/conteudo/UI/dados separados, conteudo validado em dado estruturado, motor adaptativo, testes em Node, cobertura de toda a ementa.

## 4. Sistemas implementados no nucleo (MVP)

- RNG semeado (mulberry32) -> mapa/encontros/selecao reprodutiveis.
- Mapa procedural em camadas, sem becos sem saida, com escolha de caminho.
- Recursos de run: Integridade (vida), Orcamento, Combo, Calor (risco de overclock).
- Build: arquetipo inicial + reliquias/componentes que alteram o resolvedor.
- Encontros: Workload (combate), Elite, Loja, Descanso/Revisao, Evento, Boss.
- Conteudo educacional validado, com explicacao de erro por alternativa.
- Motor adaptativo (mastery por subtopico + selecao que ressurge fraquezas).
- Defeitos (cicatrizes) a partir de erros + salas de reparo.
- Boss final multi-etapa (a prova).
- Relatorio de run (fortes/fracos + o que estudar, com fonte do material).
- Save/load local versionado com sanitizacao.

## 5. Melhorias futuras recomendadas

- Simulador de datapath com fiacao visual (conceito A completo).
- Pipeline em tempo real com forwarding/stall interativo (conceito B completo).
- Mais arquetipos, reliquias e eventos; desafios diarios por seed.
- Editor de conteudo + mais challenges por subtopico.
- Animacoes e efeitos sonoros mais ricos; acessibilidade.
