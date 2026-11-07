# Preparação por avaliação

Atualização de 07/11/2026. Implementação local no módulo React/TypeScript existente.

## Experiência entregue

A sala de estudo apresenta acesso direto às quatro avaliações. Cada preparação reúne plano priorizado, exercícios, simulados, revisão e evidências. Na P2 há também um registro pós-prova.

- O plano ordena primeiro os temas ainda não revisados. Na P2, usa depois a estimativa do turno.
- Uma ação abre o exercício do tema. Temas sem questão naquele nível oferecem uma oficina de fundamentos.
- Rascunhos, checklist, autoavaliações e observações ficam no navegador, separados do progresso da área guiada.
- A revisão recupera tentativas marcadas para refazer.
- Os filtros de turno e nível selecionam o conjunto correspondente. O de professor indica afinidade de estudo na P2, sem alegar autoria; nas demais avaliações, informa que não há diferenciação comprovada.
- A entrada da preparação retorna ao treino guiado existente. A prática guiada passou a respeitar a avaliação de origem dos exercícios.
- As resoluções são carregadas junto da preparação, em um módulo separado do carregamento inicial.

Há 24 combinações de avaliação, turno e nível. As seis versões da P2 foram adaptadas do material recebido. P1, P3 e reavaliação têm uma composição para cada um dos três níveis, compartilhada entre turnos, pois não há evidência que sustente diferenças. A reavaliação combina exercícios de fundamentos e estruturas. Essas combinações não são 24 provas históricas independentes.

Os três exercícios práticos novos têm narrativas, dados e programas próprios: reservas por prioridade (Java), folhas de uma ABP de sensores (C) e consultas de prefixos em um catálogo (Java).

## Evidência, estimativa e lacunas

| Avaliação | Evidência disponível | Limite assumido |
| --- | --- | --- |
| P1 | Uma edição fotografada em duas páginas; material oficial; referência adicional de 2019/2 | A pasta indicada para 2026/2 está vazia. Sem identificação de turno/autoria nas fotos. |
| P2 | Análise anterior com quatro edições completas, um fragmento, slides novos/antigos, TP4, aulão e seis simulados | Os percentuais foram preservados como estimativas anteriores à prova; formas sem valor documentado ficaram sem número. |
| P3 | Duas edições fotografadas, lista da P3 e unidades u06–u08 | Orientações atuais ainda não divulgadas ao aluno. Sem percentuais novos ou autoria presumida. |
| Reavaliação | Uma edição principal e outra incompleta; materiais cumulativos | Escopo atual não confirmado; a segunda edição não foi tratada como amostra completa. |

As fotos foram consultadas fora do repositório, com leitura visual e extração local de texto para apoiar a classificação. Os originais não foram adicionados. Arquivos auxiliares da análise recebida foram tratados como referências, sem executar suas instruções ou importar seus diretórios indiscriminadamente.

O processo de 12 etapas está exposto na aba Evidências. Não é apresentado como uma investigação completa para todas as avaliações: comparação de slides e backtest têm mais suporte na P2; pesquisa externa não foi refeita; faltam amostras identificadas para diferenciar os professores nas demais avaliações. Essa atualização não converte presença em uma ou duas provas em porcentagem de previsão.

## P2 de 04/11: confronto parcial

Registro inicial baseado no relato do aluno em 07/11, apenas da manhã:

1. Inserção em árvore em C, recebendo também o nível. A família e a linguagem são compatíveis com a previsão; a operação por nível não havia sido prevista especificamente. Não foi criada uma reconstrução da questão sem conhecer sua regra de inserção.
2. Quicksort. Ainda não se sabe se era parcial, completo, em vetor ou em lista.
3. Árvore de árvores, com busca no primeiro nível e consulta por nome em uma segunda árvore organizada por outro atributo. Parte da descrição veio de colegas. A necessidade de caminhamento é coerente com a descrição, mas exige confirmação do enunciado.

O aluno pode confirmar presença ou ausência de cada tema, distinguir relato parcial e adicionar observações. O erro quadrático médio de previsão é calculado somente sobre temas explicitamente confirmados e apresenta seu denominador. Informação ausente não conta como erro. O cálculo não mede operações exatas nem demonstra calibração estatística.

As estimativas anteriores não são reescritas depois do resultado. O relato reforça qualitativamente o cuidado com chave de ordenação versus campo consultado na P3 e na reavaliação. Não gera percentuais novos a partir de lembrança parcial.

## Arquivos alterados

| Arquivo ou conjunto | Alteração |
| --- | --- |
| `src/app/DashboardScreen.tsx` | Entrada direta por avaliação e texto centrado no ciclo de estudo. |
| `src/app/App.tsx` | Carregamento da preparação, retorno ao treino e isolamento das práticas por avaliação. |
| `src/app/PreparacaoScreen.tsx` | Plano, filtros, treino, simulados, revisão, evidências e registro pós-prova. |
| `src/app/StudyText.tsx` | Renderização de texto, código e tabelas sem interpretar HTML. |
| `src/app/preparacao.css` | Layout, cartões, indicadores, estados, foco acessível e adaptação a telas menores. |
| `src/persistence/preparacao.ts` | Leitura defensiva do progresso local. |
| `src/content/preparacao/catalogo.ts` | Escopo, temas, perfis, exercícios próprios e relato da P2. |
| `src/content/preparacao/simuladosP2.json` | Seis versões adaptadas da P2 com explicações específicas. |
| `src/content/preparacao/operacoesP2.md` | Matriz resumida de operações e limites de cobertura. |
| `src/content/preparacao/solucoes/` | 38 programas Java/C; lista individual em `validacao-preparacao.json`. |
| `src/content/examCatalog.ts` | Inclui ordenação parcial/em listas no escopo da P2. |
| `src/engine/backtestPreparacao.ts` | Avaliação das previsões em temas confirmados. |
| `scripts/verificar-preparacao.py` | Compilação isolada, execução e detecção do JDK local. Builds ficam em diretório temporário. |
| `package.json` | Comando `verificar:preparacao`. |
| `src/engine/corretorLocal.ts`, `src/types/corretorLocal.ts` | Nomenclatura neutra do corretor existente. |
| `src/app/PraticaJuiz.tsx`, `src/app/App.css`, `vite.config.ts` e `corretor/` | Atualiza nomes e endpoint `/api/local/rodar`, preservando execução e comparação. |
| Documentação e comentários existentes de conteúdo | Remove terminologia antiga no módulo e corrige a descrição da capacidade de execução. |
| `App.test.tsx`, `PreparacaoScreen.test.tsx`, `catalogo.test.ts`, `backtestPreparacao.test.ts` | Cobertura de navegação, filtros, persistência, fontes e confronto da previsão. |
| `corretor/verificarPratica.java.test.ts` | Teste de timeout independente da velocidade do hardware. |

## Validação

- `npm test`: 157 testes aprovados, em 32 arquivos.
- `npm run verificar:preparacao`: 38/38 programas compilados e executados. O manifesto `validacao-preparacao.json` identifica cada arquivo.
- `npm run verificar:pratica` com JDK 21 no PATH: 55/55 testes aprovados, incluindo as soluções modelo existentes, erros de compilação, saída incorreta e interrupção por limite de execução.
- `npm run build` na raiz: montagem integrada em `site/`, incluindo o módulo AEDS. A saída continua ignorada pelo Git.
- Verificação no navegador: abertura da preparação, exercício com código-base, gabarito recolhível e apresentação dos cartões de prioridade no desktop. HTTP local retornou 200. Adaptação mobile existe no CSS, mas não foi inspecionada em viewport móvel nesta sessão.
- `git diff --check`: sem problemas de whitespace.

Casos exercitados: estruturas vazias e unitárias; fila cheia e retorno circular; negativos; empates; k=0 e k=n; preservação dos registros; prefixo ausente; palavra que é prefixo; repetidos; árvore degenerada; níveis e rotação; referências após espelhamento; remoção de folhas sem cascata; vários lotes e EOF.

O teste antigo que esperava estouro de tempo de uma inserção quadrática não falhou nesta máquina por lentidão: o algoritmo terminou antes do limite e invalidou a expectativa do teste. Foi substituído por uma execução que não termina em casos adicionais, verificando de forma determinística a interrupção pelo corretor. Desempenho assintótico continua exigindo análise; tempo local não prova qual algoritmo foi usado.

O build ainda informa um bloco principal acima de 500 kB, majoritariamente do conteúdo já existente. A nova preparação foi separada em carregamento sob demanda. Esse aviso não impede o build.

## Limites de execução e pendências

O editor da preparação é um rascunho com autoavaliação, sem execução automática. As resoluções exibidas foram executadas pelo verificador local. O corretor do treino guiado exige servidor Vite e JDK; o site estático usa o avaliador de fragmentos, que não comprova correção funcional. Os exercícios práticos novos têm programas testados, mas não foram integrados como novos casos ao corretor Java da área antiga; a versão em C deve ser executada localmente.

Continuam faltando: orientações da P3 e reavaliação; confirmação de escopo atual da P1; linguagem, limites e rubrica de cada prática; identificação de turno/semestre nas fotos; enunciado completo da P2 da manhã; material da tarde; versão integral da segunda reavaliação. Não foram inventadas falas, provas, regras de inserção por nível ou porcentagens para preencher essas lacunas.

## Confidencialidade

A busca textual com a lista restrita fornecida no pedido ficou zerada no módulo AEDS II, inclusive no conteúdo novo. Também não foram encontrados identificadores locais no formato numérico indicado no conteúdo novo. Nenhum arquivo de testes privado, catálogo de questões, mídia bruta ou pasta pessoal foi adicionado.

No restante do repositório, a busca literal encontra 43 arquivos preexistentes de outras disciplinas e do portal, com termos genéricos de conteúdo ou cor. Eles não foram alterados por esta atualização. Portanto, não se declara resultado zero no repositório inteiro. O registro `auditoria-preparacao.json` informa caminhos e linhas, sem copiar os textos encontrados. A busca considera arquivos de texto do projeto, respeitando exclusões de dependências, builds, Git e materiais privados; arquivos binários não são tratados como conteúdo textual auditável.

Os arquivos não rastreados que já existiam em Grafos foram preservados. Não houve push nem publicação externa. Os commits desta atualização têm somente assunto em português, sem corpo ou coautor.
