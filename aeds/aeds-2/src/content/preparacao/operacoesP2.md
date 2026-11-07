## 1. Lista simples com célula cabeça (Java `ListaOps.java` · C `lista_ops.c`)

| # | Operação | Cobertura | Histórico | Exercício curto | Solução |
|---|---|---|---|---|---|
| L1–L2 | inserir início / fim | base | slides T5; TP2 2026/2 | insira 3 no início e 9 no fim de [5] | `inserirInicio`, `inserirFim` |
| L3 | inserir na posição | → L1/L2 + "parar antes" | slides T5 (complementar) | `inserir(7, 2)` em [1 2 3] | `inserir(x,pos)` |
| L4 | **inserir ordenado** | **própria** (condição de parada + `ultimo`) | P2-C Q1 (autoria inferida); AquecimentoP2 2025/2; slides Compl. 2 | insira 5, 1, 9, 7 mantendo a ordem | `inserirOrdenado` |
| L5–L7 | remover início / fim / posição | L6 **própria** (achar o anterior: Θ(n)) | slides T5; P2-B Q4(d) | remova o fim de [1 2 3] e diga o custo | `removerInicio/Fim/remover(pos)` |
| L8 | **remover por valor** | **própria** (anterior + `ultimo`) | aulão: "o remover eu deixo como exercício" (Naísses) | remova 9 (o último) e depois `inserirFim(10)` | `removerValor` |
| L9 | remover todas as ocorrências | → L8, mas **só avança se não removeu** | treinos e prática da disciplina | [3 1 3 3 2 3] sem os 3 | `removerTodas` |
| L10–L13 | pesquisar, tamanho, somar, maior | → percorrer | slides T5 Ex. 3 | maior de [4 9 1] | `pesquisar…maior` |
| L14 | **inverter** | **própria** (3 ponteiros: ant, i, prox) | slides T5 Ex. 1–2; Unicamp MC202 (E); LeetCode 206 (E) | inverta [1 2 3 4] e depois `inserirFim(0)` | `inverter` (Java e C) |
| L15 | intercalar duas ordenadas | → merge do Mergesort | P2-A Q3 (variação em vetor); LeetCode 21 (E) | [1 4 6] + [2 3 7 8] | `intercalar` |
| L16 | remover repetidos (ordenada) | → L9 | treinos e prática da disciplina | [1 1 2 3 3 3] | `removerRepetidosOrdenada` |
| L17 | inserir lista antes de referência | → L3 | treinos e prática da disciplina | [1 2 3 4], novos {8, 9} antes do 3 | `inserirAntes` |
| L18 | **meiose** (dividir cada célula) | **própria** (inserir enquanto percorre: andar 2) | **P2-B Q1 (C)** | [8 5 6 1] → [4 4 2 2 3 3 0 0] | `meiose` (Java e C) |

## 2. Lista dupla / dupla circular com cabeça (C `lista_dupla_circular.c`)

| # | Operação | Cobertura | Histórico | Exercício curto | Solução |
|---|---|---|---|---|---|
| D1–D2 | `start` / inserir no fim em Θ(1) | base (circular: `primeiro->ant` é o último) | `provaPASSADA.c` (2026/1) | crie a lista 8, 6, 12, −1 | `start`, `inserirFim` |
| D3 | **insertionSort** | **própria** (parar em `primeiro`) | **P2 2026/1 (C)** | ordene [8 6 12 −1] | `insertionSort` |
| D4 | selectionSort | → D3 + Seleção | TP3 2026/2 "Seleção com Lista Flexível em C" | idem | `selectionSort` |
| D5 | **quicksort** | **própria** (partição com ponteiros; faixas que encolhem) | **P2-C Q3 (C, Max)**; slides Compl. 7–8; TP3 2026/2 Q05 | idem | `quicksortRec` (Lomuto) |
| D6 | percorrer de trás para frente | → `ant` | slides T5 | imprima ao contrário | `paraVetorReverso` |

## 3. Árvore binária de pesquisa — sem remoção genérica (Java `ArvoreOps.java` · C `arvore_ops.c`)

| # | Operação | Cobertura | Histórico | Exercício curto | Solução |
|---|---|---|---|---|---|
| A1 / C1–C2 | inserir (Java retornando `No`; C com `No**` ou com retorno) | base; **`No**` própria em C** | aulão (Walisson: "a versão errada não pode acontecer"); TP4 2026/2 | insira 10 5 15 2 7 20 e desenhe | `inserir`, `inserirRec`, `inserirRetorno` |
| A2 | inserir com contador de repetidos | → A1 (o `else` incrementa) | **P2-B Q2** | 5 3 5 8 5 → quantidade(5) = 3 | `inserirContando` |
| A3 / C3 | pesquisar | → A1 | TP4 2026/2 (caminho raiz esq dir) | pesquise 7 e 8 | `pesquisar` |
| A4–A6 | pré, central, pós | base | treinos e prática da disciplina | dê os 3 percursos de 50 30 70 20 40 60 80 35 | `pre/central/pos` |
| A7–A11 / C4–C5 | contar nós, folhas, internos, 1 filho, 2 filhos | → caminhamento + **condição no nó** | treinos e prática da disciplina | conte na árvore acima | `contarNos…doisFilhos` |
| A12 / C7 | soma | → A7 | slides T4 Ex. 3 | soma = 385 | `soma` |
| A13 / C6 | altura (vazia = −1) | **própria** (max de duas recursões) | treinos e prática da disciplina | altura = 3 | `altura` |
| A14–A15 | maior / menor | → descer à direita/esquerda | slides T5 Ex. 1–2 | 80 / 20 | `maior/menor` |
| A16 | nível / profundidade de x | → pesquisa + contador | treinos e prática da disciplina | nível de 35 = 3 | `nivel` |
| A17 | k-ésimo menor | → central + contador | slides T4 Ex. 12; LeetCode 230 (E) | k = 4 → 40 | `kEsimoMenor` |
| A18 | menor ancestral comum (ABB) | **própria** (divisão de caminhos) | slides T4 Ex. 13; LeetCode 235 (E) | LCA(20, 35) = 30 | `lca` |
| A19 / C8 | **espelhar** | → caminhamento + troca | **aulão (Walisson: "dá uma prova, merece")**; slides T4 Ex. 11; LeetCode 226 (E) | central da espelhada? | `espelhar` |
| A20 | iguais | → recursão dupla | slides T4 Ex. 5 | — | `iguais` |
| A21 / C9 | **simétricas** | → A20 com lados cruzados | **aulão ("já caiu em prova")**; LeetCode 101 (E) | árvore × espelho = true | `simetricas` |
| A22 | é ABB? | **própria** (limites min/max) | slides T4 Ex. 9; LeetCode 98 (E) | a espelhada não é ABB | `ehABB` |
| A23 / C10 | **remover folhas** | Java: retorno; C: **`No**` + `free`** | **aulão (Walisson: "obrigatoriamente ponteiro de ponteiro")**; slides T5 Ex. 6 | 10 5 15 2 7 20 → sobram 10 5 15 | `removerFolhas` |
| C11 | liberar (pós-ordem) | → pós-ordem | aulão; slides T3 | — | `liberar` |
| A24 | existe divisível por 11 (parada antecipada) | → caminhamento com OU | código do Max (`hasDiv11`) | — | `hasDiv11` |
| A25 | árvore → vetor/lista ordenada | → central | **P2-C Q2**; manhã-difícil Q3 | — | `toArray`, `ToLista` |
| — | ancestrais de x até a raiz | **própria** (imprimir na volta) | treinos e prática da disciplina | tarde-difícil Q3 | `Q3_ancestrais.c` |
| — | TreeSort | → A1 (repetidos à direita) + A25 | slides T4 Ex. 7; fala da Naísses | tarde-média Q2 | `Q2_TreeSort.java` |

## 4. Híbridas (Java `HibridasOps.java` + resoluções das provas)

| # | Operação | Cobertura | Histórico | Exercício curto | Solução |
|---|---|---|---|---|---|
| H1–H2 | Agenda: inserir com e sem pré-condição | → A1 + L2 | **aulão P1 (Naísses)**; slides T6 Ex. 1 | inserir "Wagner" sem o nó W | `inserirComPre`, `inserir` |
| H3 | pesquisar por nome (chave) | → A3 + L10 | aulão; `agenda.java` 2025/2 | — | `pesquisarNome` |
| — | pesquisar por CPF (não chave) | **própria** (caminhar tudo com parada) | **aulão P1** | tarde-média Q3 | `Q3_AgendaRemover` |
| — | remover contato | → L8 | aulão ("deixo como exercício") | tarde-média Q3 | `Q3_AgendaRemover` |
| H4–H5 | contar e mostrar tudo | → caminhamento + lista | slides T6 | — | `total`, `mostrar` |
| — | contar contatos de uma letra | → H3 | manhã-fácil Q1 | — | `Q1_Agenda` |
| — | dicionário: inserir **ordenado**, criando o nó | → A1 + **L4** | **P2-C Q1 (autoria inferida)** | manhã-difícil Q1 | `Q1_Dicionario` |
| H6–H7 | árvore de árvores: inserir / pesquisar | → A1 duas vezes | slides T6 Ex. 2; TP4 2026/1 | — | `ArvoreArvore` |
| H8 | **contarPalavras(padrão)** (letra + tamanho) | → pesquisa no 1º nível + contagem no 2º | **P2-A Q2 (autoria inferida)** | "PRATO" → 3 | `contarPalavras` |
| H9 | `hasStringTam10(c)` | → H8 | slides T6 Ex. 2 | — | `hasStringTam10` |
| H10–H12 | matriz de listas: inserir(i, j), pesquisar(i, j, x), pesquisar(x), total | → andar inf/dir + lista | **aulão P1 (a turma votou "Matriz")**; slides T6 Ex. 3 | manhã-média Q1 | `MatrizDeLista` |
| — | **diagUnificada** (diagonal → lista dupla) | **própria** (dir + inf; `ant`) | **P2-B Q3 (autoria inferida)** | tarde-difícil Q2 | `Q2_DiagUnificada` |
| — | árvore − lista proibida → lista em Θ(n + m) | **própria** (central + 2 ponteiros) | **P2-C Q2** (variação) | manhã-difícil Q3 | `Q3_ToLista` |
| H13 | lista de pilhas: `maiorPilha` | → percorrer + contar pilha | **P2-A Q1** | empate → a primeira | `maiorPilha` |

## 5. Ordenação (Java `OrdenacaoOps.java`; parciais em `codigo-base/`)

| # | Operação | Cobertura | Histórico | Exercício curto | Solução |
|---|---|---|---|---|---|
| O1 | Quicksort (pivô no meio) | base | TP3 2026/2; oficina 4 (M) | ordene [5 1 4 2] na mão | `quicksort` |
| O2 | Mergesort + intercalar (sentinela) | base | TP3 2026/2; P2-B Q4(b) | — | `mergesort/intercalar` |
| O3 | Heapsort (índice 1) | base | TP3 2026/2; oficina 4–5 (M) | monte o heap de [4 10 3 5 1] | `heapsort` |
| P1 | seleção parcial | → Seleção (laço até k) | TP4 2026/2 Q01; slides T4 Ex. 1 | k = 3 | `Parciais.selecaoParcial` |
| P2 | inserção parcial (estável) | → Inserção (`j = (i<k)?…`) | TP4 2026/2 Q02; **treino ** | tarde-fácil Q1 | `Parciais.insercaoParcial`, `Q1_Corrida` |
| P3 | **Quick parcial** | → Quick (`if (i < k && i < dir)`) | TP4 2026/2 Q03 (C); **treino ** | manhã-média Q3, tarde-média Q1 | `Parciais.quicksortParcial` |
| P4 | **Heap parcial** | **própria** (heap de k com pior no topo) | TP4 2026/2 Q04; **treino ** | tarde-difícil Q1 | `Parciais.heapsortParcial`, `Q1_HeapParcialFilmes` |
| O4 | intercalar vetores decrescentes → crescente O(m+n) | → intercalar (de trás para frente) | **P2-A Q3** | exemplo da prova | `vetorOrdenado` |
| O5 | registros com 3 critérios | → comparador em cascata | treinos e prática da disciplina | — | `quickAlunos` |
| — | ordenar lista dupla circular | → D3–D5 | **P2-C, P2 2026/1** | — | `lista_dupla_circular.c` |
| — | TreeSort | → A1 + A25 | slides T4 Ex. 7 | tarde-média Q2 | `Q2_TreeSort` |

## 6. Pilha e fila (baixa prioridade: caíram na P1)

Pilha flexível (empilhar/desempilhar no topo) e fila flexível (inserir no fim, remover do início, com cabeça) são **cobertas por L1/L2/L5**. A P2 de 2022/1 cobrou "extrair da fila" (→ L8) e "fila circular de pilhas" (→ H13). Treine só se sobrar tempo.

## Conjunto mínimo: domine estes 12 e você faz qualquer variação

1. **L4** inserir ordenado (e o padrão "parar antes").
2. **L8** remover por valor com `ultimo`.
3. **L14** inverter com 3 ponteiros.
4. **D3/D5** ordenar a lista dupla circular (parar em `primeiro`).
5. **A1/C1** inserir em Java (retorno) e em C (`No**`).
6. **A7–A11** contagem por caminhamento (a condição muda; o esqueleto, não).
7. **A13** altura.
8. **A19/A21** espelhar e simétricas.
9. **A23/C10** remover folhas com `No**` e `free`.
10. **H1–H3** Agenda (2 níveis + pré-condição) e **H10–H12** matriz de listas (inf/dir).
11. **P3/P4** Quick e Heap parciais e o **custo** de cada parcial.
12. **O4** intercalar (base de L15, `toLista` e Mergesort).

Por que é suficiente: toda questão das 5 P2 analisadas e das 18 simuladas é **uma composição** desses 12 movimentos.
- `diagUnificada` = andar na matriz + L2 em lista dupla.
- `toLista` = A25 + O4.
- `meiose` = L2 durante o percurso.