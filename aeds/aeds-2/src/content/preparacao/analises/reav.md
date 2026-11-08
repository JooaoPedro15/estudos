### Cobertura cumulativa observada

A edição principal combina seis tarefas: contagem e indução; simulação de balanceamento; justificativas de afirmações; adaptação da inserção por critério; análise de multiplicações em melhor/pior caso; implementação de busca híbrida. A segunda edição está incompleta: são visíveis uma questão de bolha otimizada e somatório, uma cópia de subconjunto de ABP, uma diagonal de matriz de listas e um bloco de justificativas. A questão intermediária ausente não foi reconstruída.

O formato exige trocar de habilidade dentro da mesma avaliação. Reconhecer a estrutura é só o início: o aluno precisa simular, escrever um método, explicar por que ele funciona e justificar seu custo. Por isso, a revisão reúne exercícios das P1, P2 e P3, em vez de oferecer apenas uma lista curta de palpites.

### Como as questões discriminam entendimento

Uma adaptação de inserção por grupos testa a relação de ordem: definir prioridade entre os grupos e ordem dentro de cada um. O uso de comparação estrita determina a estabilidade; números negativos podem revelar um comparador de paridade incorreto.

Na análise, é necessário contar a operação pedida, inclusive quando há várias multiplicações em uma linha ou operações nos cabeçalhos dos laços. A prova de indução precisa partir da hipótese para o passo seguinte, sem supor a própria conclusão. Justificar O, Ω e Θ requer distinguir limite de crescimento justo.

Na simulação de balanceamento, desenhe após cada inserção e declare a política de fragmentação. Ascensão e descida não são intercambiáveis por simples mudança de nome. Nas justificativas, uma única execução pode refutar uma afirmação universal, mas exemplos favoráveis não provam que ela vale sempre.

Na estrutura composta, liste primeiro a rota de distribuição: hash principal, rehash, reserva, árvore ou lista. A cabeça não é um dado; último precisa continuar correto após mudanças. Criar uma estrutura resultado exige decidir se há cópia ou movimentação de células, pois compartilhar referências pode alterar a origem sem intenção.

### Código-base e diferenças que importam

Fila e deque por vetor usam uma posição reservada para separar cheia de vazia. Listas podem ter célula cabeça ou começar diretamente pelo primeiro dado; leia a classe fornecida. A variante de AVL com nivel considera vazio como 0 níveis; uma função de altura em arestas pode usar -1 para vazio. Não misture essas convenções durante a mesma análise.

TRIE simples, TRIE que aceita palavras-prefixo e PATRICIA por intervalos são variantes distintas. Também não se deve substituir uma hash com uma única tentativa de rehash por sondagem sem limite. Os exercícios fornecem seus contratos e a referência testada correspondente.

A pesquisa de nomes em uma estrutura organizada por outra chave, relatada na P2 de 04/11, é uma transferência útil para a revisão cumulativa. Ela explica por que às vezes é necessário caminhar por tudo em uma estrutura que normalmente oferece busca por um único caminho.

### Comparação retrospectiva e limites

Usando as famílias da edição principal para comparar as quatro questões visíveis da edição incompleta, reaparecem ordenação, híbrida e justificativas. A cópia de subconjunto de ABP acrescenta uma operação própria. Sob a classificação estrita, não há operação exata repetida. O denominador é apenas o conteúdo visível, não a prova inteira.

Esse resultado é uma comparação retrospectiva de cobertura, sem cronologia confirmada e sem ajuste estatístico. Não permite declarar a forma exata da próxima reavaliação. Também não confirma seu escopo atual: ainda faltam orientações oficiais e páginas da segunda edição.

### Conjunto de habilidades para revisar

Use análise e somatórios como fundamento; depois ordenação básica e avançada; estruturas lineares e referências; árvores, seus percursos e medidas; balanceamento; hash, TRIE e PATRICIA; e, por fim, composições entre essas estruturas. A matriz liga cada operação a um exercício e explicita o esqueleto que pode ser transferido e a condição que muda.

Uma função que resolve uma variação não comprova que todas estão dominadas. Refaça sem consultar o gabarito, incluindo vazio, único, ausente, repetidos, extremos de valor e critério de desempate. Os testes dos programas de referência cobrem esses casos, mas o rascunho no navegador continua sendo autoavaliado.

### Fontes externas de apoio

A [análise assintótica da USP](https://users.ime.usp.br/~pf/analise_de_algoritmos/aulas/Oh.html) fundamenta a discussão de limites. O [gabarito público da Unicamp sobre árvores e heaps](https://ic.unicamp.br/~islene/mc202/prova2/gabarito.html) inclui percursos, métricas e verificação de propriedades, mostrando a transferência entre uma estrutura pronta e uma operação derivada. O [sumário de Ziviani](https://www2.dcc.ufmg.br/livros/algoritmos/capitulos.php) organiza os mesmos fundamentos em análise, estruturas básicas, ordenação e pesquisa.

Código encontrado em material público também pode conter erros de digitação. Ele não foi copiado como gabarito sem execução: as soluções exibidas nesta preparação têm verificação local reproduzível em Java e C.
