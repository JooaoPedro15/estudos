# Preparação por avaliação

Atualização: 08/11/2026.

A preparação reúne conteúdos, exercícios, simulados, revisão e evidências por avaliação. Não há seleção por docente ou turno, nem percentuais de previsão. As versões de simulado variam os exercícios para treinar toda a turma. Os identificadores antigos permanecem internamente para preservar rascunhos salvos.

## Conteúdo e exercícios

| Avaliação | Exercícios disponíveis | Orientação |
| --- | ---: | --- |
| P1 | 18 | Complexidade na primeira questão; bolha, seleção e inserção, além dos fundamentos e estruturas lineares. |
| P2 | 21 | Árvores, estruturas combinadas e ordenação, incluindo Quick, Merge e Heap. |
| P3 | 39 | AVL, TRIE, hash, alvinegra, 2-3-4, PATRICIA e híbridas. |
| Reavaliação | 80 | Revisão cumulativa; reutiliza exercícios das avaliações anteriores e não representa 80 questões novas independentes. |

Cada avaliação tem seis simulados autorais: duas versões por nível. A pontuação e o uso de C são contratos de treino; não prometem o formato da próxima avaliação. A matriz de operações permite abrir diretamente o exercício correspondente. As resoluções incluem código-base e referências compiláveis.

A P3 tinha poucos exercícios porque a primeira implementação trazia apenas uma seleção curta, compartilhada entre simulados. A investigação ampliou as operações e separou o catálogo de exercícios da composição das provas de treino. Agora há variações de consulta, implementação, simulação e validação para sete assuntos.

## Investigação e limites

Foram examinados slides novos e antigos, provas fotografadas, listas, atividades recentes e histórico do repositório oficial. A classificação externa contém 741 registros de metadados: 24 questões históricas visíveis, 39 operações de lista, 136 exercícios dos slides novos e 542 atividades públicas de apoio. Isso não equivale a 741 questões de provas.

As análises específicas e as fontes externas estão em `src/content/preparacao/analises/`, acessíveis na aba Evidências. O relatório completo, o inventário e os entregáveis de estudo ficam fora do Git. Os documentos originais não são publicados.

A comparação retrospectiva mede cobertura manual de famílias entre edições: P1 2/3, P3 3/3 em uma direção e 3/4 na outra, reavaliação 3/4 das questões visíveis. Nenhuma operação exata se repetiu nesses recortes. Não é um backtest temporal validado: faltam datas e amostras completas. Não se inferem probabilidades, autoria ou regras atuais da P3/reavaliação a partir disso.

As convenções variam: nível AVL vazio 0 e folha 1; altura por arestas vazio -1; booleano de cor explicitado; TRIE com marcador de palavra; rehash restrito às posições definidas pelo contrato. Os exercícios informam suas hipóteses e distinguem os modelos oficiais das adaptações autorais.

## Verificação

- Testes do módulo: navegação, filtros, persistência, catálogo e matriz de operações.
- 45 programas de referência Java/C, compilados e executados isoladamente.
- Entrega independente com 37 programas Java/C e verificador portátil.
- Compilação integrada do site e conferência visual da preparação.

O registro de execução dos programas está em `validacao-preparacao.json`. Os testes verificam os casos explicitamente implementados; não constituem prova formal de correção de todas as variações possíveis.
