# Brainstorm e decisao de design - Modulo Arquitetura

Data: 2026-06-27. Processo conduzido com 3 agentes especializados em paralelo
(mineracao de material, design de experiencia educacional, arquitetura de
software/educacional).

## 1. Conceitos considerados

A premissa compartilhada que emergiu: **evitar perguntas isoladas sem relacao
com o modelo estudado.** O modelo do MIPS/arquitetura deve orientar a
experiencia. Acertar/errar precisa produzir feedback conceitual claro, nao
apenas marcar uma resposta como certa ou errada.

### Conceito A - "Datapath Forge" (montar e simular)

O aluno monta uma CPU a partir de componentes e roda um programa por ela. Os
tempos das unidades (Memoria 4ns, Reg 1ns, ULA 2ns...) sao atributos
quantitativos; os sinais de controle sao a fiacao; o caminho critico real
(lw=12, sw=11, R=8, beq=7, j=4) e a referencia de validacao. Um erro deve ficar
visivel no proprio datapath.

- Forca: cobre datapath, controle, tempos, CLA, uni/multiciclo. Muito expansivel.
- Risco: simulador de datapath + UI de fiacao e o item mais caro de implementar.

### Conceito B - "Pipeline Dispatcher" (puzzle de hazards em tempo real)

O aluno atua como unidade de controle de hazards de um pipeline de 5 estagios.
Instrucoes fluem IF->ID->EX->MEM->WB; ele insere forwarding/stall/flush sob
restricoes de tempo e dependencia.

- Forca: ensina pipeline, hazards, timing e convencao de chamada com visualizacao direta.
- Risco: topico estreito (nao cobre aritmetica, cache, Amdahl). Pode virar uma atividade repetitiva se a visualizacao for fraca.

### Conceito C - "Profiler's Gambit" (otimizacao/economia)

O aluno analisa desempenho com orcamento limitado e prazo. Lei de Amdahl mostra
que cada melhoria so acelera a fracao que toca. Cache, clock e compilador
entram como escolhas de otimizacao com tradeoff. Otimizar o caso comum
(GCC/ABC) e a referencia de sucesso.

- Forca: cobre Amdahl, desempenho (IC x CPI x clock), cache, metrica MIPS, representacao numerica. E o mais facil de implementar (resolvedor de formulas + escolhas parametrizadas).
- Risco: pode parecer "planilha" se a visualizacao for fraca.

## 2. Comparacao (resumo das pontuacoes dos agentes)

| Criterio | A Forge | B Dispatcher | C Profiler |
|---|---|---|---|
| Engajamento | 4 | 5 | 3 |
| Poder de ensino | 5 | 4 | 4 |
| Variedade entre sessoes | 4 | 4 | 4 |
| Facilidade de implementacao | 2 | 3 | 4 |
| Potencial de expansao | 5 | 3 | 4 |
| Pouca dependencia de perguntas isoladas (maior=melhor) | 4 | 5 | 4 |
| Cobertura do conteudo | alta (estrutural) | media | alta (quantitativa) |

Nenhum conceito sozinho cobre toda a ementa. A/forge domina o lado estrutural;
C/profiler o lado quantitativo; B/dispatcher o lado dinamico.

## 3. Proposta escolhida - Modulo Interativo de Arquitetura de Computadores

**Modulo educacional de construcao e analise de CPU.** Cada sessao conduz o
aluno por uma sequencia de atividades sobre processador, desempenho, datapath,
controle e pipeline. As decisoes de estudo e as respostas do aluno mudam quais
topicos retornam com mais frequencia.

Espinha = estado educacional do conceito A + C (modelo estrutural + resolvedor
de desempenho), com atividades de B (pipeline) quando o topico exigir
visualizacao temporal.

### Por que esta escolha

1. **Cobre a ementa inteira** confirmada nos materiais (aritmetica, CLA, Amdahl, desempenho, cache, ISA, funcoes, datapath, controle, tempos, pipeline): cada topico vira conteudo de dado (data-driven), expansivel.
2. **Nao e quiz isolado**: o que da profundidade e a relacao entre modelo, feedback, revisao adaptativa e retorno dos topicos fracos.
3. **Implementavel em vanilla JS** sem simulador pesado: o nucleo usa matematica de desempenho real (caminho critico, Amdahl, CPI) e avaliadores testaveis.
4. **Sessao curta com progresso**: pratica de ~15-30 min, save local e acompanhamento leve.

### Mudancas principais vs. versao antiga

- Versao antiga: arquivo unico, atividades do datapath e fluxo de revisao embutido.
- Nova versao: modulo multi-arquivo (ES modules), logica/conteudo/UI/dados separados, conteudo validado em dado estruturado, motor adaptativo, testes em Node, cobertura de toda a ementa.

## 4. Sistemas implementados no nucleo (MVP)

- RNG semeado (mulberry32) -> sequencias e selecao reprodutiveis.
- Sequenciamento de atividades com escolha de caminho de estudo.
- Recursos de acompanhamento: progresso, foco de revisao e historico de acertos/erros.
- Configuracoes da experiencia que alteram o resolvedor de respostas.
- Conteudo educacional validado, com explicacao de erro por alternativa.
- Motor adaptativo (mastery por subtopico + selecao que ressurge fraquezas).
- Revisao orientada a erros persistentes.
- Relatorio de estudo (fortes/fracos + o que estudar, com fonte do material).
- Save/load local versionado com sanitizacao.

## 5. Melhorias futuras recomendadas

- Simulador de datapath com fiacao visual (conceito A completo).
- Pipeline em tempo real com forwarding/stall interativo (conceito B completo).
- Mais configuracoes de experiencia e eventos educacionais.
- Editor de conteudo + mais challenges por subtopico.
- Animacoes e efeitos sonoros mais ricos; acessibilidade.
