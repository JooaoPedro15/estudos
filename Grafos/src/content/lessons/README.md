# Lições por conceito

O catálogo `index.ts` reúne os 22 tópicos. O conteúdo acadêmico continua exclusivamente em `content/topics`: a interface usa `technicalIndices` para buscar os parágrafos originais de `Topic.understand`, sem reescrevê-los. Os campos `whatYouNeedToKnow`, alertas, diferenças de convenção e exercícios também continuam na página.

Cada conceito tem uma explicação intuitiva e um ou mais exemplos. Cada exemplo contém snapshots completos (`AnimationStep`) do grafo e da informação associada: texto da etapa, cores, destaques, anotações, sequência, fila, fórmula e tabela. Snapshots completos permitem avançar, voltar e reiniciar sem executar mutações inversas. Quando necessário, a nova explicação qualifica imprecisões encontradas no original, preservando o texto acadêmico.

## Adicionar conteúdo

1. Inclua um `GraphConcept` no catálogo do tópico, com id único, título curto, explicação intuitiva e índices dos parágrafos técnicos relacionados. Vários conceitos podem apontar ao mesmo parágrafo.
2. Defina ao menos um exemplo com estados que demonstrem a ideia. Não use uma sequência genérica para assuntos distintos.
3. Reutilize `makeLessonGraph`, `traversalSteps`, `constructionSteps` ou `bipartiteSteps` quando se aplicarem. A BFS de bipartição percorre todos os componentes e para no primeiro conflito.
4. Use posições fixas dentro do espaço 560 × 320. Para conjuntos ou algoritmos, nomeie as cores em `legend`, a fila em `queueLabel` e a sequência em `sequenceLabel`. Tabelas complementam o desenho em lógica e representações.
5. `traversal` representa um movimento entre extremos de uma aresta reta existente. O player interpola o marcador; etapas manuais mostram o destino diretamente. Exemplos com laços ou curvas devem usar destaques por etapa em vez desse marcador reto.
6. Rode `npm test`, `npm run lint` e `npm run build`. Os testes conferem cobertura de todos os parágrafos, referências dos estados, percursos, árvore, K(2,3), BFS e limites do player. Confira também a apresentação no navegador, sobretudo fórmulas e rótulos em tela estreita.

## Interface

`GraphLesson` organiza as duas camadas e a seleção. Trocar tópico, conceito ou exemplo remonta o player pausado na primeira etapa. `lessonPlayback` controla o relógio local, inclusive pausa durante o deslocamento. A última etapa permanece visível; Reproduzir no fim repete o exemplo. Nenhum atalho global interfere nas questões. Movimento reduzido mantém as mudanças sem interpolar o marcador.

`GraphVisualizer` é compartilhado com exercícios e playground. As novas propriedades são opcionais; mantenha esse contrato. Os exploradores anteriores de matrizes, listas, isomorfismo, conjuntos e lógica permanecem como exploração livre abaixo da lição.
