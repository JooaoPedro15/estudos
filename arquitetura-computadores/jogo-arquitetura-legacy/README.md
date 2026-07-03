# Aplicacao Legacy de Datapath MIPS

## Nome

Aplicacao Legacy de Datapath MIPS

## Descricao

Aplicacao educacional de estudo do caminho de dados do MIPS uniciclo, contendo
atividades de pratica, uma Academia de licoes, fluxo Aprendiz/Prova e uma
sequencia antiga de revisao preservada em um unico arquivo HTML. Tudo e inline
(HTML + CSS + JavaScript vanilla), sem bibliotecas, sem build, funciona offline.

## Objetivo educacional

Treinar os conteudos de datapath MIPS, controle, tempos do caminho critico e
pipeline de forma interativa, simulando o caminho das instrucoes pelas unidades
funcionais e exigindo que o aluno defina sinais de controle e calcule tempos.

## Conteudos trabalhados

- Caminho de dados MIPS uniciclo (datapath)
- Sinais de controle (RegDst, ALUSrc, MemtoReg, RegWrite, MemRead, MemWrite, Branch, Jump)
- Tempos do caminho critico (Memory 4ns, Register 1ns, ALU 2ns, Mux 0.5ns, etc.)
- Pipeline de 5 estagios (IF, ID, EX, MEM, WB)
- Sequencia antiga de revisao da prova, preservada apenas como historico

## Atividades

- **Roteirista:** trace o caminho de uma instrucao pelo datapath SVG.
- **Engenheiro de Controle:** ative/desative sinais de controle para uma instrucao.
- **Calculadora de Tempos:** calcule o tempo total (caminho critico) de cada tipo.
- **Pipeline Master:** mapeie instrucoes nos estagios do pipeline.
- **Academia:** licoes sobre cada topico.
- **Aprendiz/Prova:** fluxo de estudo com dicas e fluxo de avaliacao sem dicas.
- **Revisao da prova:** sequencia antiga com atividades encadeadas e feedback.

## Tecnologias

- HTML5 + CSS3 + JavaScript (tudo inline em um unico arquivo)
- SVG para diagramas do datapath
- WebAudio para efeitos sonoros
- `localStorage` para persistencia de progresso
- **Zero dependencias externas**

## Requisitos

- Navegador moderno com suporte a ES2020+
- Nenhum servidor necessario

## Instalacao

Nao ha instalacao. O arquivo e auto-contido.

## Execucao

Duplo-clique em `mips-datapath-quest.html` para abrir no navegador. Funciona
offline, sem servidor nem internet.

## Testes

Nao ha testes automatizados neste projeto.

## Estrutura das pastas

```text
jogo-arquitetura-legacy/
  mips-datapath-quest.html    Aplicacao completa (arquivo unico ~117 KB)
  launch.json                 Config de VS Code (python http.server 8765)
  README.md                   Este arquivo
```

## Estado atual

**Versao antiga (preservada).** NAO modificar. Este snapshot inclui a sequencia
antiga de revisao ja embutida. Serve como referencia funcional da aplicacao
original.

Uma copia anterior existe em `../primeira-versao/`.

## Limitacoes

- Arquivo unico: dificil de manter e evoluir.
- Fluxo antigo de revisao e simplificado comparado ao modulo reescrito.
- Sem sistema de testes automatizados.
- Sem separacao de responsabilidades (todo o codigo esta em um `<script>`).

## Observacoes

- A nova versao reescrita do zero fica em `../jogo-arquitetura-roguelike/`.
- Um snapshot anterior existe em `../primeira-versao/`.
