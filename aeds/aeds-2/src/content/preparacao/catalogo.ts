import type { ExamId } from '../examCatalog';
import p2 from './simuladosP2.json';
import { ampliadosP1,ampliadosP2,ampliadosP3,revisaoHeap } from './exerciciosAmpliados';

export type Nivel = 'facil' | 'media' | 'dificil';
export type Tema = {
  id: string; title: string;
  forms: { title: string }[];
  evidence: string; operation: string; trap: string; sources: string[];
};
export type QuestaoPreparacao = { id: string; title: string; body: string; sources: string[]; answer?: string; topic?: string; base?: string; level?: Nivel };
export type SimuladoPreparacao = { id: string; exam: ExamId; title: string; level: Nivel; questions: QuestaoPreparacao[] };
export type Plano = { scope: string; status: string; history: string[]; missing: string[]; topics: Tema[] };
const forma = (title: string) => ({title});
export const planos: Record<ExamId, Plano> = {
  p1: {
    scope: 'Complexidade e somatórios; bolha, seleção e inserção; estruturas lineares e recursão. Conforme orientação do aluno em 08/11/2026, a primeira questão é de complexidade; Quick, Merge e Heap ficam na P2.',
    status: 'Análise, ordenação básica e estruturas lineares',
    history: ['Uma edição fotografada, em duas páginas: análise por blocos com melhor/pior caso; perturbação e indução; métodos novos em fila circular.', 'As fotos não identificam o semestre. O roteiro reúne o conteúdo disponível para toda a turma.', 'A pasta reservada à P1 de 2026/2 está vazia. A prova de 2019/2 é uma referência adicional de análise, sem equivalência garantida ao formato atual.'],
    missing: ['Enunciado e gabarito da P1 de 2026/2 para conferir as regras exatas.', 'Semestre e edição das fotos.', 'Regras atuais da prática: linguagem por questão, restrições e rubrica.'],
    topics: [
      { id:'analise',title:'Contar antes de classificar',forms:[forma('Laços dependentes e ramificações'),forma('Somatório, fechamento e indução')],evidence:'As questões 1 e 2 da edição fotografada cobram essa sequência. Frequência observada não é probabilidade de uma prova futura.',operation:'Identificar operação relevante → escrever Σ → fechar → justificar Θ.',trap:'Somar custos de ramos mutuamente exclusivos ou trocar O por Θ sem limite inferior.',sources:['autoral/Fundamentos.java'] },
      { id:'fila',title:'Fila circular e invariantes',forms:[forma('Desfazer inserção'),forma('Percurso inverso recursivo')],evidence:'Questão 3 da edição fotografada; código oficial de fila sequencial.',operation:'Atualizar último com módulo e preservar primeiro; distinguir cheia e vazia.',trap:'Fazer (ultimo - 1) % tamanho em Java: o resto pode ser negativo.',sources:['autoral/Fundamentos.java'] },
      { id:'ordenacao',title:'Bolha, seleção e inserção',forms:[forma('Inserção estável'),forma('Comparador e desempates')],evidence:'Orientação atual do aluno em 08/11/2026: bolha, seleção e inserção na P1. TP2 e código oficial oferecem as implementações de referência.',operation:'Adaptar a comparação mantendo o algoritmo solicitado.',trap:'Trocar o algoritmo pedido por uma ordenação pronta.',sources:['autoral/Fundamentos.java'] },
      {id:'recursividade',title:'Recursão e comparação de strings',forms:[forma('Caso base e avanço'),forma('Comparador lexicográfico')],evidence:'P1 de 2019/2 inclui comparador recursivo; o plano de ensino e TP1 tratam recursividade.',operation:'Definir caso base, avanço e composição do retorno; tratar prefixos de strings.',trap:'Ler charAt após o fim da string ou comparar só o comprimento.',sources:['autoral/FundamentosMais.java']},
      {id:'busca',title:'Busca em vetor ordenado',forms:[forma('Limites da pesquisa binária')],evidence:'u01 e TP2 incluem pesquisa; é aplicação dos invariantes e análise logarítmica.',operation:'Manter intervalo e excluir corretamente a posição já examinada.',trap:'Não avançar o limite ou usar busca binária em dados não ordenados.',sources:['autoral/FundamentosMais.java']},
    ],
  },
  p2: {
    scope:'Estruturas flexíveis (u04), ABP e híbridas (u05), além de ordenação parcial e ordenação em listas (u03). Remoção genérica em ABP fora do escopo de 2026/2; removerFolhas e liberar permanecem dentro.',
    status:'Teórica aplicada em 04/11/2026 · registro de conteúdo disponível',
    history:['A análise anterior reúne quatro P2 completas e um fragmento de 2026/1. A amostra contém árvore em Java e questões em C sobre listas/ordenação em lista; não são cinco edições igualmente completas.', 'Formato observado: implementação com código-base, eventualmente figura, e complexidade em Θ. Pratique no papel: o editor aqui é um rascunho.', 'Backtest anterior: ao ocultar uma edição, a análise relatou acerto das três famílias de estrutura, mas apenas 1,5/3 operações exatas. É um teste retrospectivo pequeno, sem validação estatística independente.'],
    missing:['Foto/enunciado da P2 de 04/11 para confirmar parâmetros e critérios.', 'Detalhes da inserção por nível: escolha de posição, níveis válidos e tratamento de nível ocupado.', 'Enunciados completos e confirmação de se o Quicksort era completo ou parcial.'],
    topics:[
      { id:'arvore',title:'Árvore por caminhamento',forms:[forma('Árvore em C'),forma('Contar, somar ou altura'),forma('Espelhar (forma específica)')],evidence:'Histórico da P2, TP4 e aulão de 30/10: pratique a manipulação de árvores em Java e C, com atenção a referências e caminhamentos.',operation:'Público → privado recursivo; tratar vazio; percorrer conforme a chave.',trap:'Buscar por nome em árvore ordenada por ano: é preciso visitar os dois ramos.',sources:['autoral/Anos.java','matriz/java/ArvoreOps.java','matriz/c/arvore_ops.c'] },
      { id:'hibrida',title:'Estruturas híbridas',forms:[forma('Árvore de listas'),forma('Matriz de listas')],evidence:'As quatro P2 completas da análise anterior usam híbridas. Aulão e slides T6 reforçam composição de estruturas.',operation:'Separar a busca no primeiro nível do percurso na estrutura interna.',trap:'Multiplicar custos de buscas sequenciais; ignorar cabeça ou pré-condição de nó existente.',sources:['matriz/java/HibridasOps.java','autoral/Anos.java'] },
      { id:'parcial',title:'Ordenação parcial',forms:[forma('Quick parcial'),forma('Heap parcial'),forma('Seleção/Inserção parcial')],evidence:'TP4 de 27/10 e slides atualizados; treinos e prática da disciplina. O relato da P2 confirma Quicksort, mas não confirma a modalidade parcial.',operation:'Limitar trabalho ao prefixo k e formalizar todos os desempates.',trap:'Afirmar Θ(n log n) para qualquer entrada de Quicksort ou esquecer k=0 e k=n.',sources:['autoral/Parcial.java','autoral/Parcial.c','autoral/Heap.java'] },
      { id:'lista',title:'Lista encadeada e ponteiros',forms:[forma('Lista em C'),forma('Inserir, remover e inverter')],evidence:'Slides T5, questões históricas de meiose e ordenação em lista dupla circular; aulão de estruturas híbridas.',operation:'Pular cabeça, manter último e salvar o próximo antes de alterar vínculos.',trap:'Perder a referência do restante da lista ou deixar ultimo apontando para célula removida.',sources:['matriz/java/ListaOps.java','matriz/c/lista_ops.c','matriz/c/lista_dupla_circular.c'] },
      { id:'treesort',title:'TreeSort como variação',forms:[forma('Inserção + percurso central')],evidence:'Slides T4, exercício 7 e código oficial: inserção em ABP seguida de percurso central.',operation:'Inserir todos os elementos e fazer percurso central; definir repetidos.',trap:'Garantir Θ(n log n) em ABP sem balanceamento: pior caso Θ(n²).',sources:['tarde-media/Q2_TreeSort.java'] },
      {id:'ordenacao-completa',title:'Quick, Merge e Heap completos',forms:[forma('Partição'),forma('Intercalação'),forma('Construção e reconstrução de heap')],evidence:'Orientação do aluno em 08/11/2026; TP3 e u03 ensinam os três algoritmos na preparação da P2.',operation:'Preservar o invariante de cada algoritmo e distinguir completo de parcial.',trap:'Trocar o algoritmo pedido ou omitir a dependência de k nas versões parciais.',sources:['matriz/java/OrdenacaoOps.java']},
    ],
  },
  p3:{
    scope:'Balanceamento (AVL, alvinegra e 2-3-4), hash e TRIE/PATRICIA (u06–u08), com estruturas híbridas. Base histórica; orientações de 2026/2 ainda não recebidas.',
    status:'Preparação pelo histórico · orientações ainda não disponíveis',
    history:['Duas edições fotografadas: ambas trazem método em árvore e pesquisa híbrida. Uma inclui TRIE invertida e V/F; a outra pede contagem de nós balanceados e palavras com prefixo.', 'A lista de preparação para a P3 reforça composições de estruturas. Ela amplia o repertório, mas não prova frequência nem autoria.', 'O roteiro reúne as formas presentes no histórico e na lista: implemente métodos, simule as estruturas e justifique a complexidade.'],
    missing:['Orientações de 2026/2, quando forem divulgadas.', 'Semestre das duas edições.', 'Formato e regras atuais da prática.'],
    topics:[
      {id:'avl',title:'AVL: altura e equilíbrio',forms:[forma('Contar nós balanceados com nivel pronto'),forma('Rotação e atualização de alturas')],evidence:'Duas edições fotografadas incluem métodos de árvore; uma pede explicitamente uso do atributo nivel.',operation:'Separar altura armazenada de altura calculada; validar fator em cada nó.',trap:'Testar só a raiz ou somar recálculos de altura desnecessários.',sources:['autoral/Estruturas.java']},
      {id:'trie',title:'TRIE: percursos e prefixos',forms:[forma('Percorrer subárvore de prefixo'),forma('Criar TRIE com palavras invertidas')],evidence:'Uma forma em cada edição fotografada e conteúdo de u08.',operation:'Descer pelo prefixo e percorrer todos os finais de palavra na subárvore.',trap:'Confundir folha com fimPalavra: uma palavra pode ser prefixo de outra.',sources:['autoral/Estruturas.java']},
      {id:'hash',title:'Hash: reserva, rehash e colisões',forms:[forma('Pesquisa T1 → reserva → árvore/lista'),forma('V/F sobre colisão e pior caso')],evidence:'Pesquisa em híbrida nas duas edições; lista da P3 e u07.',operation:'Aplicar cada função de distribuição e percorrer somente a reserva correta.',trap:'Prometer custo constante no pior caso ou usar valor zero como posição vazia.',sources:['autoral/Hibrida.java']},
      {id:'alvinegra',title:'Alvinegra: cores e caminhos',forms:[forma('Contar cores'),forma('Validar altura negra'),forma('Fragmentar por troca de cores')],evidence:'V/F da P3 edição A; lista P3 e TP4 com bicolor em C.',operation:'Declarar a convenção de cor e verificar invariantes em todos os caminhos.',trap:'Confundir contar todos os nós pretos com contar pretos em cada caminho.',sources:['autoral/Cores234.java']},
      {id:'arvore234',title:'Árvore 2-3-4: chaves e fragmentação',forms:[forma('Pesquisar entre chaves'),forma('Contar folhas e 4-nós'),forma('Dividir raiz cheia')],evidence:'P3 edição A e questões de balanceamento da lista e da reavaliação.',operation:'Preservar intervalos das chaves e distribuir os filhos válidos ao fragmentar.',trap:'Confundir três chaves com três nós ou perder subárvores na divisão.',sources:['autoral/Cores234.java']},
      {id:'patricia',title:'PATRICIA: intervalos e compressão',forms:[forma('Casar segmentos completos'),forma('Contar caracteres dos rótulos'),forma('Detectar compressão pendente')],evidence:'u08 e lista P3. O código oficial usa rótulos por índices i,j,k.',operation:'Comparar todos os caracteres do intervalo e respeitar o marcador de fim.',trap:'Aceitar uma consulta que termina no meio do rótulo ou apagar uma fronteira de palavra.',sources:['autoral/IndicesTexto.java']},
      {id:'hibrida',title:'Híbridas: uma consulta, várias camadas',forms:[forma('Hash com rehash e reserva'),forma('Consulta por campo sem índice')],evidence:'Uma questão híbrida em cada edição fotografada da P3; lista P3 e código de referência.',operation:'Seguir a rota da chave; percorrer quando a consulta recebe outro campo.',trap:'Aplicar a ordenação por código para procurar nome.',sources:['autoral/HibridaCamadas.java']},
    ],
  },
  reav:{
    scope:'Revisão cumulativa de u00–u08 pelo histórico: análise, simulação de balanceamento, ordenação e implementação em estrutura composta. Escopo atual não divulgado.',
    status:'Revisão cumulativa · orientações ainda não disponíveis',
    history:['Uma edição principal e uma segunda incompleta. A principal reúne seis macroformatos: somatório/indução; simulação de árvores; V/F; adaptação da inserção; melhor/pior caso; pesquisa híbrida.', 'A edição incompleta é evidência secundária; não contamos páginas como provas independentes.', 'O roteiro é único e cumulativo: pratique as operações de todas as avaliações.'],
    missing:['Orientações atuais e confirmação do caráter cumulativo.', 'Edição completa da segunda reavaliação.', 'Semestre e edição das fotos.'],
    topics:[
      {id:'analise',title:'Somatórios e casos',forms:[forma('Fechamento + indução'),forma('Contagem por ramo')],evidence:'Questões 1 e 5 da edição principal.',operation:'Contar a operação pedida e provar o fechamento por indução.',trap:'Contar o corpo inteiro quando se pedem apenas multiplicações.',sources:['autoral/Fundamentos.java']},
      {id:'avl',title:'Balanceamento no papel',forms:[forma('Simular inserções'),forma('Provar/refutar invariantes')],evidence:'Questões 2 e 3: AVL, alvinegra e 2-3-4.',operation:'Desenhar após cada inserção; distinguir rotação de fragmentação.',trap:'Afirmar que ascensão e descida sempre produzem árvore idêntica.',sources:['autoral/Estruturas.java']},
      {id:'ordenacao',title:'Adaptar ordenação',forms:[forma('Ordenação por grupos e valor'),forma('Análise de estabilidade e custo')],evidence:'Questão 4 da edição principal adapta inserção por paridade.',operation:'Criar a relação de ordem e preservar o laço da inserção.',trap:'Comparar só o grupo, esquecendo a ordem dentro de cada grupo.',sources:['autoral/Fundamentos.java']},
      {id:'hash',title:'Pesquisar na estrutura composta',forms:[forma('Hash + árvore/lista'),forma('Chave diferente do campo consultado')],evidence:'Questão 6 da edição principal e material de revisão de híbridas.',operation:'Desenhar a rota da busca e justificar o custo de cada nível.',trap:'Assumir que toda árvore permite busca binária por qualquer atributo.',sources:['autoral/Hibrida.java','autoral/Anos.java']},
    ],
  },
};


const q = (id:string,title:string,body:string,sources:string[],answer:string,topic:string):QuestaoPreparacao => ({id,title,body,sources,answer,topic});
const fundamentos='autoral/Fundamentos.java', estruturas='autoral/Estruturas.java', hibrida='autoral/Hibrida.java';
const questoes:Record<Exclude<ExamId,'p2'>,Record<Nivel,QuestaoPreparacao[]>> = {
  p1:{
    facil:[
      q('p1-soma','Laços em uma oficina','Considere contar(n), no código-base. Sem executar o método, escreva o somatório das operações resp++, obtenha a forma fechada e a ordem em Θ. Use n ≥ 0.',[fundamentos],'Σ(i=1..n) i = n(n+1)/2. Para n crescente, Θ(n²). O caso n=0 executa zero operações.','analise'),
      q('p1-fila','Desfazer uma reserva','Considere uma fila circular implementada por array de capacidade + 1, com primeiro indicando a primeira reserva e ultimo a posição livre. Implemente int desfazer(), removendo a última reserva. Fila vazia deve lançar uma exceção; justifique Θ.',[fundamentos],'Recuar ultimo com (ultimo - 1 + array.length) % array.length e devolver array[ultimo]. Θ(1). Ver método desfazer no programa testado.','fila'),
      q('p1-estavel','Manter os critérios','Considere ordenar(int[] a). Modifique a inserção para colocar pares antes de ímpares, cada grupo crescente. Mostre o resultado para [7, -2, 4, -5, 0] e justifique estabilidade.',[fundamentos],'[-2, 0, 4, -5, 7]. Mover apenas quando antes(tmp, a[j]) é verdadeiro; iguais não são ultrapassados. Melhor Θ(n), pior Θ(n²).','ordenacao'),
    ],
    media:[
      q('p1-inducao','Provar a contagem','Para o método contar(n), prove por indução a fórmula n(n+1)/2. Apresente base n=0, hipótese e passo indutivo sem usar a própria conclusão como premissa.',[fundamentos],'Base: 0. Hipótese S(n)=n(n+1)/2. S(n+1)=S(n)+(n+1)=(n+1)(n+2)/2.','analise'),
      q('p1-inverso','Consultar sem destruir','Considere a mesma fila circular. Implemente inverso() para devolver um vetor com as reservas da mais recente à mais antiga, com auxiliar recursivo, sem modificar primeiro, ultimo ou array. Considere a fila atravessando o fim do array.',[fundamentos],'Calcular quantidade com módulo; percorrer de primeiro até ultimo e preencher o vetor pela posição quantidade-1-indice. Θ(n) tempo e espaço.','fila'),
      q('p1-casos','Contar por caso','Se um ramo executa contar(n) e o outro executa um único laço de n incrementos, apresente melhor e pior caso, somatórios e Θ, considerando que apenas um ramo é executado.',[fundamentos],'Melhor: n, Θ(n). Pior: n(n+1)/2, Θ(n²). Não se somam os dois ramos para definir o custo de uma execução.','analise'),
    ],
    dificil:[
      q('p1-circular','Provar os invariantes','Em uma fila de capacidade 3, insira 19, 23, 29, remova a frente e insira 31. Desenhe primeiro, ultimo e array. Implemente a consulta inversa e a retirada da última inserção.',[fundamentos],'Após as operações, primeiro=1 e ultimo=0, conteúdo lógico [23,29,31]; inverso [31,29,23]. Desfazer devolve 31 e deixa ultimo=3.','fila'),
      q('p1-paridade','Um critério para negativos','Implemente inserção por paridade seguida de valor, com pares primeiro. Explique por que a%2 < b%2 não é um comparador correto para inteiros negativos.',[fundamentos],'Resto negativo pode ser -1; comparar apenas restos colocaria ímpares negativos antes dos pares. Use booleanos a%2==0 e b%2==0, depois a<b.','ordenacao'),
      q('p1-refutar','Refutar uma cota','Para contar(n), avalie e justifique: (a) O(n³), (b) Θ(n), (c) Ω(n²). Dê o fechamento e uma prova do limite inferior.',[fundamentos],'(a) verdadeiro: uma cota superior não precisa ser justa; (b) falso; (c) verdadeiro. n(n+1)/2 ≥ n²/2.','analise'),
    ],
  },
  p3:{
    facil:[
      q('p3-nivel','Usar a altura pronta','Considere No { elemento, esq, dir, nivel }, com nivel correto e vazio com nível 0. Implemente contarBalanceados(): quantos nós têm diferença de níveis dos filhos entre -1 e 1? Não acrescente atributos.',[estruturas],'Percorrer todos os nós; calcular fator com os níveis já prontos; somar 1 quando -1 ≤ fator ≤ 1. Θ(n), pilha Θ(h).','avl'),
      q('p3-prefixo','Dicionário de observações','Considere a TRIE de a a z fornecida em Estruturas.java, com fimPalavra. Conte as palavras iniciadas pelo prefixo informado. Prefixo ausente retorna 0; prefixo vazio conta todas.',[estruturas],'Descer até o fim do prefixo e contar marcadores fimPalavra na subárvore. Θ(p+26v); a palavra que é prefixo de outra também conta.','trie'),
      q('p3-reserva','Escolher a reserva','Considere uma tabela hash de cinco posições. Uma colisão par vai para uma ABP da posição; uma colisão ímpar vai para uma lista com cabeça. Implemente pesquisar(x) com retorno booleano, verificando primeiro a posição primária.',[hibrida],'Testar ocupado e elemento; depois paridade. ABP por comparação numérica ou lista desde primeiro.prox. Pior Θ(1+h) ou Θ(1+m).','hash'),
    ],
    media:[
      q('p3-rotacao','Reparar uma cadeia','Considere a árvore 30 → esq 20 → esq 10. Implemente a rotação simples à direita e atualize nivel dos dois nós. Apresente o percurso central e a complexidade.',[estruturas],'Nova raiz 20, com filhos 10 e 30. Central 10 20 30. Atualizar primeiro o antigo pai, depois o novo pai. Θ(1).','avl'),
      q('p3-inverter','Construir outro índice','Percorra a TRIE original e construa uma nova com cada palavra invertida. Não modifique a original e aceite palavras que são prefixos de outras.',[estruturas],'Acumular caracteres no início; em fimPalavra inserir na TRIE destino. Visitar todos os filhos, inclusive após fimPalavra. O custo inclui a construção das strings e o comprimento total inserido.','trie'),
      q('p3-negativo','Hash também para negativos','A estrutura Hibrida usa x % 5. Explique o problema com x=-1, corrija a função e teste pesquisa ausente em ambas as reservas.',[hibrida],'Em Java -1%5=-1. Se resto<0, somar tamanho, obtendo 4. Não usar abs(x): o menor inteiro não tem positivo representável.','hash'),
    ],
    dificil:[
      q('p3-semaltura','Altura sem auxiliar pronto','Implemente altura(No i) sem consultar nivel. A altura da árvore vazia é -1. Compare o custo com recalcular altura de cada nó para contar balanceados.',[estruturas],'altura(i)=1+max(altura(esq),altura(dir)); vazio=-1. Uma chamada custa Θ(n). Repetir por nó numa cadeia custa Θ(n²); com nivel correto, contarBalanceados é Θ(n).','avl'),
      q('p3-fim','A palavra termina aqui','Insira lu, lua, luz e sol. Conte palavras para prefixos lu, x e vazio; depois construa a TRIE invertida. Justifique por que contar somente folhas falha.',[estruturas],'Resultados 3, 0 e 4. Invertidas: ul, aul, zul, los. lu termina em nó com filhos e precisa ser contado por fimPalavra.','trie'),
      q('p3-custo','Desenhar o pior caminho','Implemente pesquisar(x) na híbrida sem métodos de coleção. Construa um cenário em que busca em hash custa Θ(n) e refute a afirmação de pior caso sempre constante.',[hibrida],'Todos os ímpares podem colidir em uma posição e formar uma lista de n elementos. Um ausente dessa mesma posição exige percorrer toda a lista: Θ(n).','hash'),
    ],
  },
  reav:{facil:[],media:[],dificil:[]},
};
for (const level of ['facil','media','dificil'] as Nivel[]) {
  questoes.reav[level]=[...questoes.p1[level],...questoes.p3[level]].map((question,index)=>({...question,id:`reav-${level}-${index}`,title:`${index+1}. ${question.title}`}));
}
const temasReav=[...planos.reav.topics.filter(t=>['analise','ordenacao'].includes(t.id)),...planos.p1.topics.filter(t=>['fila','recursividade','busca'].includes(t.id)),...planos.p3.topics,...planos.p2.topics.filter(t=>['arvore','lista','parcial','treesort','ordenacao-completa'].includes(t.id))];
planos.reav.topics=[...new Map(temasReav.map(t=>[t.id,t])).values()];
const extras={p1:ampliadosP1,p2:ampliadosP2,p3:ampliadosP3,reav:[
  ...[...ampliadosP1,...ampliadosP2,...ampliadosP3].map(q=>({...q,id:`reav-${q.id}`})),...revisaoHeap,
  ...p2.flatMap(sim=>sim.questions.map(q=>({...q,id:`reav-p2-${q.id}`,level:sim.level as Nivel}))),
]};
export function getQuestoesPreparacao(exam:ExamId):QuestaoPreparacao[] {
  const original:QuestaoPreparacao[]=exam==='p2'
    ? p2.flatMap(sim=>sim.questions.map(q=>({...q,level:sim.level as Nivel})))
    : Object.entries(questoes[exam]).flatMap(([level,qs])=>qs.map(q=>({...q,level:level as Nivel})));
  return [...new Map([...original,...extras[exam]].map(q=>[q.id,q])).values()];
}
function selecionar(exam:ExamId,ids:string[]):QuestaoPreparacao[] {
  return ids.map(id=>{const q=getQuestoesPreparacao(exam).find(q=>q.id===id);if(!q)throw new Error(`Exercício ausente: ${id}`);return q;});
}
const composicoes:{exam:ExamId;level:Nivel;versions:string[][]}[]=[
  {exam:'p1',level:'facil',versions:[['p1-soma','p1-selecao-conta','p1-deque-fim-c'],['p1-impares','p1-estavel','p1-deque-fim-c']]},
  {exam:'p1',level:'media',versions:[['p1-inducao','p1-insercao-trace','p1-deque-inicio-c'],['p1-dobros','p1-selecao-conta','p1-deque-inicio-c']]},
  {exam:'p1',level:'dificil',versions:[['p1-refutar','p1-bolha-ultima','p1-deque-inicio-c'],['p1-casos','p1-paridade','p1-deque-fim-c']]},
  {exam:'p3',level:'facil',versions:[['p3-recalcular','p3-trie-exata','p3-hash-inserir-c'],['p3-234-busca','p3-cor-contar','p3-hash-inserir-c']]},
  {exam:'p3',level:'media',versions:[['p3-trie-listar','p3-rotacao-dupla','p3-hash-rehash-c'],['p3-hibrida-codigo','p3-patricia-pesquisa','p3-hash-rehash-c']]},
  {exam:'p3',level:'dificil',versions:[['p3-cor-altura','p3-trie-uniao','p3-hash-contrato-c'],['p3-234-profundidade','p3-hibrida-nome','p3-hash-contrato-c']]},
  {exam:'reav',level:'facil',versions:[['reav-p1-impares','reav-p3-recalcular','reav-p3-trie-exata','reav-p1-selecao-conta','reav-p3-hash-inserir-c','reav-p3-hibrida-rota'],['reav-p1-impares','reav-p3-234-busca','reav-p3-cor-contar','reav-p1-insercao-trace','reav-p1-deque-fim-c','reav-p3-hibrida-rota']]},
  {exam:'reav',level:'media',versions:[['reav-p1-dobros','reav-p3-rotacao-dupla','reav-p3-trie-listar','reav-p1-insercao-trace','reav-p3-hash-rehash-c','reav-p3-hibrida-codigo'],['reav-p1-dobros','reav-p3-cor-dividir','reav-p3-patricia-pesquisa','reav-p1-selecao-conta','reav-p1-deque-inicio-c','reav-p2-arvore-outro-campo']]},
  {exam:'reav',level:'dificil',versions:[['reav-p1-dobros','reav-p3-avl-inserir','reav-p3-cor-altura','reav-p1-bolha-ultima','reav-p3-hash-contrato-c','reav-p3-hibrida-nome'],['reav-p1-impares','reav-p3-234-profundidade','reav-p3-trie-uniao','reav-p2-merge-completo','reav-p3-hash-contrato-c','reav-p2-arvore-outro-campo']]},
];
export const simuladosPreparacao:SimuladoPreparacao[]=[...(p2 as SimuladoPreparacao[]),...composicoes.flatMap(c=>c.versions.map((ids,i)=>({id:`${c.exam}-${c.level}-${i+1}`,exam:c.exam,level:c.level,title:`Simulado ${i+1}`,questions:selecionar(c.exam,ids)})))];

export const relatoP2 = [
  {id:'espelho',title:'Espelhamento não foi cobrado',text:'Atualização do aluno em 08/11/2026: não houve questão de espelhamento nessa avaliação.',result:'O exercício permanece como prática de recursão e referências, sem indicação de probabilidade de cobrança.'},
  {id:'arvore',title:'Árvore em C com inserção por nível',text:'Lembrança do aluno em 07/11/2026: recebia o número e o nível de inserção. Regras de posição e tratamento de ocupação não confirmadas.',result:'Treinar passagem de referências em C; a regra exata de inserção depende do enunciado.'},
  {id:'parcial',title:'Quicksort',text:'Lembrança do aluno em 07/11/2026. Não está confirmado se era parcial, sobre vetor ou lista.',result:'Revisar partição e recursão; a modalidade precisa ser confirmada no enunciado.'},
  {id:'hibrida',title:'Árvore de árvores: buscar por outro campo',text:'Relato aproximado: primeiro nível buscava por ano; segundo nível também organizado por ano, mas consulta por nome exigia caminhamento. Parte foi descrita ao aluno por colegas.',result:'Se o campo consultado não organiza a árvore, a busca pode exigir percorrer os dois ramos.'},
];

export const praticaPreparacao:Record<ExamId,QuestaoPreparacao[]> = {
  p1:[q('pratica-reservas','Reservas de observação · Java','Escreva um programa que processe lotes até EOF. Cada lote começa com n (0 ≤ n ≤ 500), seguido de n pares: código e prioridade inteira. Use inserção estável para imprimir os códigos por prioridade crescente; empates mantêm a chegada. Uma linha por lote, códigos separados por um espaço, sem espaço final. n=0 produz uma linha vazia.\n\nEntrada de exemplo:\n```text\n3\n51 2\n82 1\n63 2\n```\nSaída:\n```text\n82 51 63\n```',['autoral/Reservas.java'],'Mover código e prioridade juntos. Comparação estrita > mantém estabilidade. Melhor Θ(n), pior Θ(n²); espaço Θ(n). Casos locais: vazio, único, empate, prioridade negativa e vários lotes.','ordenacao')],
  p2:[q('pratica-sensores','Sensores em uma ABP · C','Leia lotes até EOF. Cada lote começa com n (0 ≤ n ≤ 500), seguido de n leituras inteiras. Insira na ABP na ordem recebida; leituras repetidas são ignoradas. Imprima o número de folhas, uma linha por lote. n=0 resulta em 0. Use No**, malloc e free.\n\nEntrada:\n```text\n5\n8 4 12 2 6\n```\nSaída:\n```text\n3\n```',['autoral/Sensores.c'],'Contar folhas depois de construir a árvore; vazio não é folha. Construção pior Θ(n²), contagem Θ(n), espaço Θ(n). Liberar no fim de cada lote.','arvore')],
  p3:[q('pratica-prefixos','Catálogo de expedições · Java','Processe lotes até EOF. Leia n e q (0 ≤ n,q ≤ 500), n palavras de a a z e q prefixos não vazios. Construa uma TRIE e imprima quantas palavras distintas começam por cada prefixo, uma resposta por linha. Palavras podem ser prefixos de outras; repetições não aumentam a contagem.\n\nEntrada:\n```text\n4 3\nlu lua luz sol\nlu x sol\n```\nSaída:\n```text\n3\n0\n1\n```',['autoral/Prefixos.java'],'Contar fimPalavra, não folhas. Prefixo ausente resulta em 0. Custo de consulta Θ(p+26v), sendo v os nós visitados após o prefixo. Reiniciar a raiz a cada lote.','trie')],
  reav:[],
};

export function assuntoQuestao(question:QuestaoPreparacao):string {
  if(question.topic) return question.topic;
  if(/parcial|heap|inserção estável/i.test(question.title)) return 'parcial';
  if(/treesort/i.test(question.title)) return 'treesort';
  if(/agenda|matriz|dicionário|listas|árvore.*lista|tolista|diag/i.test(question.title)) return 'hibrida';
  if(/lista/i.test(question.title)) return 'lista';
  return 'arvore';
}
