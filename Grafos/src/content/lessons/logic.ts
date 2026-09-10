import type { GraphData } from '../types';
import type { AnimationStep, GraphAnimation, LessonCatalog } from './types';
import { AMBER, BLUE, GREEN, RED, makeLessonGraph } from './builders';

// In these diagrams, arrows represent membership or function application, never
// an unstated relationship. Technical paragraphs remain in the original topics.
function diagram(columns: string[][], edges: [string, string][] = []): GraphData {
  const graph = makeLessonGraph(columns.flat(), edges, true);
  return { ...graph, vertices: graph.vertices.map(vertex => {
    const column = columns.findIndex(items => items.includes(vertex.id));
    const row = columns[column].indexOf(vertex.id);
    return { ...vertex, x: columns.length === 1 ? 280 : 80 + column * (400 / (columns.length - 1)),
      y: columns[column].length === 1 ? 155 : 55 + row * (200 / (columns[column].length - 1)) };
  }) };
}

function animation(id: string, title: string, steps: AnimationStep[]): GraphAnimation {
  return { id, title, steps };
}

const vf = (value: boolean) => value ? 'V' : 'F';
const assignments: [boolean, boolean][] = [[true, true], [true, false], [false, true], [false, false]];
const truthGraph = diagram([['VV', 'VF'], ['FV', 'FF']]);

/** Each vertex is one assignment, progressively evaluated alongside its row. */
function truthRows(id: string, title: string, headers: string[], evaluate: (p: boolean, q: boolean) => boolean[], explain: (p: boolean, q: boolean) => string): GraphAnimation {
  const colors: Record<string, string> = {};
  const notes: Record<string, string> = {};
  const rows: string[][] = [];
  const steps: AnimationStep[] = [{ graph: truthGraph,
    message: 'Cada vértice representa um caso (p,q): VV, VF, FV ou FF. Vamos avaliar os quatro casos.',
    table: { headers: ['p', 'q', ...headers], rows: [] } }];
  for (const [p, q] of assignments) {
    const results = evaluate(p, q);
    const vertex = `${vf(p)}${vf(q)}`;
    colors[vertex] = results[results.length - 1] ? GREEN : RED;
    notes[vertex] = `${headers[headers.length - 1]} = ${vf(results[results.length - 1])}`;
    rows.push([vf(p), vf(q), ...results.map(vf)]);
    steps.push({ graph: truthGraph, currentVertex: vertex,
      vertexColorMap: { ...colors }, vertexNotes: { ...notes },
      message: explain(p, q), legend: [{ label: 'Última coluna: V', color: GREEN }, { label: 'Última coluna: F', color: RED }], table: { headers: ['p', 'q', ...headers], rows: rows.map(row => [...row]) } });
  }
  return animation(id, title, steps);
}

const universe = diagram([['1', '2'], ['3', '4']]);
const setGroups = [{ label: 'A = {1,2}', vertexIds: ['1', '2'], color: BLUE },
  { label: 'B = {2,3}', vertexIds: ['2', '3'], color: AMBER }];
function selectSet(selected: string[]): Record<string, string> {
  return Object.fromEntries(['1', '2', '3', '4'].map(id => [id, selected.includes(id) ? GREEN : RED]));
}

const domain = diagram([['2', '3', '4']]);
function predicateScan(id: string, title: string, values: boolean[], messages: string[], formula: string): GraphAnimation {
  const ids = ['2', '3', '4'];
  return animation(id, title, [
    { graph: domain, message: 'Domínio D = {2,3,4}. Cada vértice é um valor possível de x; vamos testar P(x).', formula },
    ...ids.map((currentVertex, index): AnimationStep => ({ graph: domain, currentVertex,
      vertexColorMap: Object.fromEntries(ids.slice(0, index + 1).map((vertex, i) => [vertex, values[i] ? GREEN : RED])),
      vertexNotes: Object.fromEntries(ids.slice(0, index + 1).map((vertex, i) => [vertex, `P(${vertex}) = ${vf(values[i])}`])),
      table: { headers: ['x', 'P(x)'], rows: ids.slice(0, index + 1).map((vertex, i) => [vertex, vf(values[i])]) },
      message: messages[index], formula, legend: [{label: 'P(x) verdadeiro', color: GREEN}, {label: 'P(x) falso', color: RED}],
    })),
  ]);
}

export const logicLessons: LessonCatalog = {
  'teoria-de-conjuntos': [
    {
      id: 'pertinencia-subconjunto', title: 'Um objeto e uma coleção de objetos', technicalIndices: [0],
      intuitiveExplanation: 'Pense numa caixa com as peças 1, 2 e 3. A peça 2 está na caixa; já uma caixinha que contém somente a peça 2 tem todos os seus elementos na caixa maior. As chaves mudam o tipo de coisa que estamos comparando.',
      examples: [animation('pertinencia-caixa', 'Elemento ou subconjunto?', [
        { graph: diagram([['1', '2', '3'], ['A']], [['1', 'A'], ['2', 'A'], ['3', 'A']]),
          highlightVertexIds: ['2', 'A'], highlightEdgeIds: ['e1'], edgeLabels: { e0: '∈', e1: '∈', e2: '∈' },
          message: 'Cada seta significa “pertence a”. A seta da peça 2 para A afirma 2∈A, com A={1,2,3}.', formula: '2 ∈ A' },
        { graph: diagram([['1', '2', '3'], ['A', '{2}']], [['1', 'A'], ['2', 'A'], ['3', 'A'], ['2', '{2}']]),
          highlightVertexIds: ['2', '{2}'], highlightEdgeIds: ['e1', 'e3'], edgeLabels: { e0: '∈', e1: '∈', e2: '∈', e3: '∈' },
          message: 'Criamos o conjunto {2}. Seu único elemento também pertence a A; por isso {2}⊆A. O conjunto {2} não é um dos números que formam A.', formula: '{2} ⊆ A; {2} ∉ A' },
      ])],
    },
    {
      id: 'partes', title: 'Todas as escolhas possíveis', technicalIndices: [1],
      intuitiveExplanation: 'Com dois ingredientes, você pode escolher nenhum, só o primeiro, só o segundo ou os dois. Cada ingrediente tem duas opções: entrar ou ficar de fora. O conjunto das partes guarda todas essas escolhas.',
      examples: [animation('partes-escolhas', 'Construindo P({a,b})', [
        { graph: diagram([['∅', '{a}']]), highlightVertexIds: ['∅', '{a}'],
          message: 'Para o ingrediente a, há duas escolhas: não pegar nada ou pegar a.', formula: 'P({a}) = {∅, {a}}' },
        { graph: diagram([['∅', '{a}'], ['{b}', '{a,b}']], [['∅', '{b}'], ['{a}', '{a,b}']]),
          highlightVertexIds: ['{b}', '{a,b}'], edgeLabels: { e0: '+ b', e1: '+ b' },
          message: 'Mantemos as escolhas antigas e fazemos uma cópia de cada uma com b. As setas significam “adicionar b”. São quatro subconjuntos, incluindo ∅ e o conjunto inteiro.', formula: '|P({a,b})| = 2² = 4' },
      ])],
    },
    {
      id: 'operacoes-conjuntos', title: 'Combinar, filtrar e retirar elementos', technicalIndices: [2],
      intuitiveExplanation: 'Duas listas de convidados podem ser combinadas, comparadas para achar nomes repetidos ou usadas para retirar nomes. O complemento também depende de uma lista maior: o universo de pessoas que estamos considerando.',
      examples: [animation('operacoes-listas', 'A={1,2}, B={2,3}, U={1,2,3,4}', [
        { graph: universe, groups: setGroups, vertexColorMap: selectSet(['1', '2', '3']), message: 'Na união, selecionamos quem está em A ou em B: 1, 2 e 3. Verde significa selecionado; vermelho, fora do resultado.', formula: 'A∪B = {1,2,3}' },
        { graph: universe, groups: setGroups, vertexColorMap: selectSet(['2']), message: 'Na interseção, fica apenas quem está nas duas listas: 2.', formula: 'A∩B = {2}' },
        { graph: universe, groups: setGroups, vertexColorMap: selectSet(['1']), message: 'Na diferença A\\B, partimos de A e retiramos quem também está em B. Sobra 1.', formula: 'A\\B = {1}' },
        { graph: universe, groups: setGroups, vertexColorMap: selectSet(['3', '4']), message: 'No complemento de A em U, selecionamos os elementos do universo que não estão em A: 3 e 4.', formula: 'Aᶜ = U\\A = {3,4}' },
      ])],
    },
    {
      id: 'morgan-conjuntos', title: 'Ficar fora da união ou da interseção', technicalIndices: [2],
      intuitiveExplanation: 'Quem não está em nenhuma das duas listas precisa estar fora da primeira e fora da segunda. Já quem não está nas duas ao mesmo tempo pode faltar em uma delas ou nas duas.',
      examples: [animation('morgan-selecao', 'Conferindo as duas leis no mesmo universo', [
        { graph: universe, groups: setGroups, vertexColorMap: selectSet(['1', '2', '3']), message: 'A união seleciona 1, 2 e 3.', formula: 'A∪B = {1,2,3}' },
        { graph: universe, groups: setGroups, vertexColorMap: selectSet(['4']), message: 'Negar essa seleção deixa somente 4, que está fora de A E fora de B.', formula: '(A∪B)ᶜ = {4} = Aᶜ∩Bᶜ' },
        { graph: universe, groups: setGroups, vertexColorMap: selectSet(['2']), message: 'Agora selecionamos a interseção: somente 2 está nos dois conjuntos.', formula: 'A∩B = {2}' },
        { graph: universe, groups: setGroups, vertexColorMap: selectSet(['1', '3', '4']), message: 'Negar a interseção deixa 1, 3 e 4: cada um está fora de A OU fora de B.', formula: '(A∩B)ᶜ = {1,3,4} = Aᶜ∪Bᶜ' },
      ])],
    },
    {
      id: 'cartesiano', title: 'Todas as duplas, com ordem', technicalIndices: [3],
      intuitiveExplanation: 'Para montar um uniforme, escolha uma camiseta e depois uma calça. Duas camisetas e duas calças dão quatro combinações. A primeira e a segunda posição têm papéis diferentes, assim como origem e destino de uma seta.',
      examples: [animation('cartesiano-pares', 'De pares ordenados a arcos', [
        { graph: diagram([['a', 'b'], ['1', '2']], [['a', '1'], ['a', '2']]), highlightEdgeIds: ['e0', 'e1'], message: 'Fixamos o primeiro elemento a e combinamos com cada elemento de B={1,2}. Cada seta representa um par ordenado.', formula: '(a,1), (a,2)' },
        { graph: diagram([['a', 'b'], ['1', '2']], [['a', '1'], ['a', '2'], ['b', '1'], ['b', '2']]), highlightEdgeIds: ['e2', 'e3'], message: 'Fazemos o mesmo com b. Obtivemos todos os quatro pares de A×B.', formula: '|A×B| = 2·2 = 4' },
        { graph: diagram([['a'], ['b']], [['a', 'b']]), highlightEdgeIds: ['e0'], message: 'Em um digrafo, as duas posições vêm do mesmo V. Escolher E={(a,b)} dentre V×V cria a seta a→b, mas não cria b→a nem os laços automaticamente.', formula: 'E = {(a,b)} ⊆ V×V, V={a,b}' },
      ])],
    },
    {
      id: 'funcao-injetora', title: 'Uma saída por entrada; imagens sem repetição', technicalIndices: [4],
      intuitiveExplanation: 'Imagine entregar um armário a cada aluno. Para ser função, cada aluno recebe exatamente um armário. Para ser injetora, dois alunos diferentes nunca recebem o mesmo armário; ainda pode sobrar armário vazio.',
      examples: [animation('injetora-armarios', 'Repetir ou separar as imagens', [
        { graph: diagram([['a', 'b'], ['1', '2', '3']], [['a', '1'], ['b', '1']]), vertexColorMap: { '1': RED }, highlightEdgeIds: ['e0', 'e1'], message: 'Cada entrada tem uma saída, portanto é função. Mas a e b chegam ao mesmo 1: não é injetora.', formula: 'a ≠ b, f(a) = f(b)' },
        { graph: diagram([['a', 'b'], ['1', '2', '3']], [['a', '1'], ['b', '2']]), vertexColorMap: { '1': GREEN, '2': GREEN, '3': AMBER }, highlightEdgeIds: ['e1'], message: 'Mudamos a imagem de b para 2. As imagens são distintas: agora é injetora. O 3 sem seta mostra que ela ainda não é sobrejetora.', formula: 'f(a)=1; f(b)=2; Im(f)={1,2}' },
      ])],
    },
    {
      id: 'funcao-sobrejetora', title: 'Cobrir todo o contradomínio', technicalIndices: [4],
      intuitiveExplanation: 'Agora o objetivo é que todos os armários sejam usados. Mais de um aluno pode apontar para o mesmo armário. O que importa para a sobrejeção é não deixar nenhum destino sem uma origem.',
      examples: [animation('sobrejetora-cobertura', 'Atingindo o destino que faltava', [
        { graph: diagram([['a', 'b', 'c'], ['1', '2']], [['a', '1'], ['b', '1'], ['c', '1']]), vertexColorMap: { '1': GREEN, '2': RED }, message: 'O contradomínio é B={1,2}, mas a imagem só contém 1. O destino 2 está sem origem: não é sobrejetora.', formula: 'Im(f)={1} ≠ B' },
        { graph: diagram([['a', 'b', 'c'], ['1', '2']], [['a', '1'], ['b', '1'], ['c', '2']]), vertexColorMap: { '1': GREEN, '2': GREEN }, highlightEdgeIds: ['e2'], message: 'Agora c chega a 2. Todos os destinos são atingidos: é sobrejetora, embora a e b ainda repitam a imagem 1.', formula: 'Im(f)=B; f(a)=f(b)' },
      ])],
    },
    {
      id: 'bijecao-inversa', title: 'Voltar sem ambiguidade', technicalIndices: [4],
      intuitiveExplanation: 'Se cada pessoa tem um único crachá e todo crachá pertence a uma única pessoa, dá para consultar nos dois sentidos. Se um crachá fosse compartilhado, não saberíamos para quem voltar; se sobrasse um crachá, não haveria para quem voltar.',
      examples: [animation('inversa-setas', 'Invertendo uma bijeção', [
        { graph: diagram([['a', 'b'], ['1', '2']], [['a', '1'], ['b', '2']]), highlightEdgeIds: ['e0', 'e1'], message: 'As imagens são distintas e cobrem B: f é bijetora.', formula: 'f(a)=1; f(b)=2' },
        { graph: diagram([['a', 'b'], ['1', '2']], [['1', 'a'], ['2', 'b']]), highlightEdgeIds: ['e0', 'e1'], message: 'Invertemos as setas. Cada elemento de B tem agora exatamente uma saída para A: obtivemos a função inversa.', formula: 'f⁻¹(1)=a; f⁻¹(2)=b' },
      ])],
    },
    {
      id: 'composicao', title: 'Passar por duas máquinas em sequência', technicalIndices: [5],
      intuitiveExplanation: 'Uma máquina soma 1 e a seguinte multiplica por 2. O número sai da primeira e entra na segunda. Para a entrada 2, o resultado é 6; trocar a ordem das máquinas daria 5.',
      examples: [animation('composicao-maquinas', 'Primeiro f, depois g', [
        { graph: diagram([['2'], ['3'], ['6']], [['2', '3'], ['3', '6']]), currentVertex: '2', message: 'A entrada é 2. A seta f soma 1; a seta g multiplica por 2.', edgeLabels: { e0: 'f: +1', e1: 'g: ×2' }, formula: '(g∘f)(2)=g(f(2))' },
        { graph: diagram([['2'], ['3'], ['6']], [['2', '3'], ['3', '6']]), currentVertex: '3', traversal: { from: '2', to: '3' }, highlightEdgeIds: ['e0'], edgeLabels: { e0: 'f: +1', e1: 'g: ×2' }, message: 'Aplicamos f primeiro: 2+1=3. O 3 será a entrada de g.', formula: 'f(2)=3' },
        { graph: diagram([['2'], ['3'], ['6']], [['2', '3'], ['3', '6']]), currentVertex: '6', traversal: { from: '3', to: '6' }, highlightEdgeIds: ['e1'], edgeLabels: { e0: 'f: +1', e1: 'g: ×2' }, message: 'Aplicamos g ao resultado 3: 3×2=6. A escrita g∘f acompanha a leitura de dentro para fora.', formula: '(g∘f)(2)=6' },
      ])],
    },
  ],
  'logica-proposicional': [
    {
      id: 'proposicao', title: 'Uma frase que pode ser julgada', technicalIndices: [0],
      intuitiveExplanation: 'Uma proposição funciona como uma ficha que aceita V ou F usando um critério definido. Uma pergunta ainda não faz uma afirmação; uma sensação sem critério fixo não fornece uma ficha objetiva.',
      examples: [animation('frases-valor', 'Critério objetivo e valor-verdade', [
        { graph: diagram([['2+2=4', 'Está frio']]), vertexLabels: { '2+2=4': 'P', 'Está frio': 'Q' }, currentVertex: '2+2=4', vertexColorMap: { '2+2=4': GREEN }, vertexNotes: { '2+2=4': 'P: V, proposição', 'Está frio': 'Q: sem critério fixo' }, message: 'P: “2+2=4” tem valor objetivo V. Q: “Está frio”, sem um limite de temperatura, depende de quem sente.', table: { headers: ['Frase', 'Valor'], rows: [['2+2=4', 'V'], ['Está frio', 'Sem critério']] } },
        { graph: diagram([['2+2=4', 'T<10°C']]), vertexLabels: { '2+2=4': 'P', 'T<10°C': 'Q' }, currentVertex: 'T<10°C', vertexColorMap: { '2+2=4': GREEN, 'T<10°C': RED }, vertexNotes: { 'T<10°C': 'Q: F, medição de 15°C' }, message: 'Fixamos local, instante e medição de 15°C. “A temperatura medida é menor que 10°C” agora é uma proposição falsa. Ser falsa não a impede de ser proposição.', table: { headers: ['Frase', 'Valor'], rows: [['2+2=4', 'V'], ['15°C < 10°C', 'F']] } },
      ])],
    },
    {
      id: 'negacao-conjuncao', title: 'Inverter e exigir as duas condições', technicalIndices: [1],
      intuitiveExplanation: 'Negar “a porta está aberta” troca a resposta. Já uma entrada que exige ingresso e documento só libera quando as duas verificações passam.',
      examples: [truthRows('tabela-e-nao', 'Negação e conjunção', ['¬p', 'p∧q'], (p,q) => [!p, p && q], (p,q) => `Com p=${vf(p)} e q=${vf(q)}, ¬p=${vf(!p)} e p∧q=${vf(p&&q)}. ${p&&q ? 'As duas exigências foram satisfeitas.' : 'Pelo menos uma exigência falhou.'}`)],
    },
    {
      id: 'disjuncao-exclusivo', title: 'Pelo menos uma opção ou exatamente uma', technicalIndices: [1],
      intuitiveExplanation: '“Aceitamos dinheiro ou cartão” permite ter as duas opções disponíveis. “Escolha exatamente uma sobremesa” exclui escolher as duas. O ou inclusivo e o exclusivo diferem justamente quando as duas condições são verdadeiras.',
      examples: [truthRows('tabela-ou-xor', 'Comparando ∨ e ⊕', ['p∨q', 'p⊕q'], (p,q) => [p||q, p!==q], (p,q) => `p=${vf(p)}, q=${vf(q)}: o ou inclusivo dá ${vf(p||q)} e o exclusivo dá ${vf(p!==q)}. ${p&&q ? 'Com as duas verdadeiras, somente o exclusivo rejeita.' : 'Neste caso, os dois operadores concordam.'}`)],
    },
    {
      id: 'implicacao', title: 'Quando uma promessa é quebrada', technicalIndices: [2],
      intuitiveExplanation: 'A promessa “se entregar o trabalho, ganha o ponto” é quebrada quando você entrega e não recebe. Se você não entrega, essa promessa não determina se receberá o ponto por outro motivo. A implicação lógica segue essa regra de avaliação.',
      examples: [truthRows('tabela-implicacao', 'O único caso falso de p→q', ['p→q'], (p,q) => [!p||q], (p,q) => p ? q ? 'Entregou e ganhou: a promessa foi cumprida, V.' : 'Entregou e não ganhou: este é o único caso que quebra a promessa, F.' : `Não entregou. A premissa é falsa e a implicação é V, com q=${vf(q)}. Isso não afirma que q seja verdadeiro.`)],
    },
    {
      id: 'contrapositiva', title: 'Trocar, negar e comparar', technicalIndices: [3],
      intuitiveExplanation: '“Se é um quadrado, tem quatro lados” não permite concluir que toda figura de quatro lados é quadrado. Mas uma figura sem quatro lados certamente não é um quadrado. Trocar e negar ao mesmo tempo preserva a afirmação original.',
      examples: [truthRows('tabela-contrapositiva', 'Original, recíproca, inversa e contrapositiva', ['p→q', 'q→p', '¬p→¬q', '¬q→¬p'],
        (p,q) => [!p||q, !q||p, p||!q, q||!p],
        (p,q) => `Na linha ${vf(p)}${vf(q)}, original e contrapositiva valem ${vf(!p||q)}; recíproca e inversa valem ${vf(!q||p)}. ${p!==q ? 'Aqui aparece por que trocar apenas ou negar apenas não preserva a original.' : 'Concordar só nesta linha ainda não prova equivalência.'}`)],
    },
    {
      id: 'precedencia', title: 'A ordem das operações lógicas', technicalIndices: [4],
      intuitiveExplanation: 'Assim como multiplicar vem antes de somar, os conectivos têm uma fila de prioridade. Os parênteses podem reorganizar essa fila. A árvore mostra quais resultados precisam estar prontos antes de calcular o próximo.',
      examples: [animation('precedencia-arvore', 'Calculando ¬p∨q∧r com p=V, q=F, r=V', [
        { graph: diagram([['p', 'q', 'r'], ['¬p', 'q∧r'], ['∨']], [['p','¬p'], ['q','q∧r'], ['r','q∧r'], ['¬p','∨'], ['q∧r','∨']]), currentVertex: '¬p', vertexColorMap: { 'p': GREEN, 'q': RED, 'r': GREEN, '¬p': RED }, vertexNotes: { '¬p': 'F' }, highlightEdgeIds: ['e0'], message: 'Primeiro a negação: p é V, então ¬p é F.', formula: '¬p∨q∧r = (¬p)∨(q∧r)' },
        { graph: diagram([['p', 'q', 'r'], ['¬p', 'q∧r'], ['∨']], [['p','¬p'], ['q','q∧r'], ['r','q∧r'], ['¬p','∨'], ['q∧r','∨']]), currentVertex: 'q∧r', vertexColorMap: { 'p': GREEN, 'q': RED, 'r': GREEN, '¬p': RED, 'q∧r': RED }, vertexNotes: { '¬p': 'F', 'q∧r': 'F' }, highlightEdgeIds: ['e1','e2'], message: 'Depois a conjunção: q∧r = F∧V = F.', formula: 'F∨(F∧V) = F∨F' },
        { graph: diagram([['p', 'q', 'r'], ['¬p', 'q∧r'], ['∨']], [['p','¬p'], ['q','q∧r'], ['r','q∧r'], ['¬p','∨'], ['q∧r','∨']]), currentVertex: '∨', vertexColorMap: { 'p': GREEN, 'q': RED, 'r': GREEN, '¬p': RED, 'q∧r': RED, '∨': RED }, vertexNotes: { '¬p': 'F', 'q∧r': 'F', '∨': 'F' }, highlightEdgeIds: ['e3','e4'], message: 'Por último, o ou: F∨F=F. Na ordem completa, → vem depois de ∨, e ↔ vem por último.', formula: '¬ → ∧ → ∨ → implicação → bicondicional (ordem de avaliação)' },
      ])],
    },
    {
      id: 'morgan-logico', title: 'Negar uma combinação', technicalIndices: [5],
      intuitiveExplanation: '“Não trouxe caderno e caneta” significa que faltou pelo menos um deles. “Não trouxe caderno nem caneta” significa que faltaram os dois. Ao distribuir uma negação, o e troca com o ou.',
      examples: [truthRows('morgan-e', 'Negação do e', ['¬(p∧q)', '¬p∨¬q'], (p,q) => [!(p&&q), !p||!q], (p,q) => `No caso ${vf(p)}${vf(q)}, as duas formas dão ${vf(!(p&&q))}. ${p&&q ? 'Como ambos valem, negar a conjunção é F.' : 'Falta pelo menos um: a negação da conjunção é V.'}`),
        truthRows('morgan-ou', 'Negação do ou', ['¬(p∨q)', '¬p∧¬q'], (p,q) => [!(p||q), !p&&!q], (p,q) => `No caso ${vf(p)}${vf(q)}, negar o ou e exigir as duas negações dão ${vf(!(p||q))}. Só o caso FF torna ambas verdadeiras.`)],
    },
    {
      id: 'equivalencias', title: 'Reescrever sem mudar os casos verdadeiros', technicalIndices: [5],
      intuitiveExplanation: 'Duas expressões equivalentes são duas maneiras de escrever a mesma regra: aceitam e rejeitam exatamente os mesmos casos. Reordenar termos de e/ou, reagrupar ou distribuir deve conservar esse resultado.',
      examples: [truthRows('dupla-comutativa', 'Dupla negação e troca de ordem', ['p', '¬¬p', 'p∧q', 'q∧p'], (p,q) => [p, !!p, p&&q, q&&p], (p,q) => `Na linha ${vf(p)}${vf(q)}, p e ¬¬p coincidem; p∧q e q∧p também. Compare cada par de colunas até completar a tabela.`),
        animation('distributiva-associativa', 'Distribuir e reagrupar com três variáveis', [false, true].map((r): AnimationStep => {
          const graph = diagram([['VV', 'VF'], ['FV', 'FF']]);
          return { graph, message: `Fixamos r=${vf(r)} e verificamos os quatro pares p,q. Compare as duas colunas de cada lei; juntas, as duas etapas cobrem as oito combinações.`,
            vertexColorMap: Object.fromEntries(assignments.map(([p,q]) => [`${vf(p)}${vf(q)}`, p&&(q||r) ? GREEN : RED])),
            vertexNotes: Object.fromEntries(assignments.map(([p,q]) => [`${vf(p)}${vf(q)}`, `r=${vf(r)}; distributiva=${vf(p&&(q||r))}`])),
            table: { headers: ['p','q','r','p∧(q∨r)','(p∧q)∨(p∧r)','(p∨q)∨r','p∨(q∨r)'],
              rows: assignments.map(([p,q]) => [p,q,r,p&&(q||r),(p&&q)||(p&&r),(p||q)||r,p||(q||r)].map(vf)) },
            formula: 'Distributiva e associativa: os dois lados concordam em todas as linhas.' };
        })),
      ],
    },
    {
      id: 'bicondicional-classificacao', title: 'Mesmos valores e classificação de fórmulas', technicalIndices: [2, 5],
      intuitiveExplanation: 'O bicondicional exige que as duas respostas concordem. Uma fórmula que aceita todos os casos é uma tautologia; se rejeita todos, uma contradição; se alterna, uma contingência.',
      examples: [truthRows('bicondicional-classes', 'Comparando os resultados em todas as linhas', ['p↔q', 'p∨¬p', 'p∧¬p'], (p,q) => [p===q, true, false], (p,q) => `Na linha ${vf(p)}${vf(q)}, p↔q=${vf(p===q)}. Ao completar a tabela, ↔ alterna (contingência), p∨¬p é sempre V (tautologia) e p∧¬p é sempre F (contradição). A cor do vértice acompanha a última coluna.`)],
    },
  ],
  'logica-de-predicados': [
    {
      id: 'predicado-substituicao', title: 'Uma frase com um espaço em branco', technicalIndices: [0],
      intuitiveExplanation: '“___ é par” é uma ficha incompleta. Colocar 4 no espaço produz uma frase verdadeira; colocar 3 produz uma falsa. A variável indica qual espaço ainda precisa ser preenchido.',
      examples: [predicateScan('predicado-par', 'Substituindo valores em P(x): x é par', [true, false, true], [
        'Substituímos x por 2: “2 é par” tem valor V.', 'Substituímos x por 3: “3 é par” tem valor F. O resultado depende do valor escolhido.', 'Substituímos x por 4: P(4)=V. Cada substituição concreta gera uma proposição.',
      ], 'P(x): x é par')],
    },
    {
      id: 'universal', title: 'Todos precisam passar', technicalIndices: [1],
      intuitiveExplanation: 'Dizer que todas as lâmpadas estão acesas exige conferir todas. Encontrar uma apagada já derruba a afirmação; encontrar uma acesa ainda não basta para confirmá-la.',
      examples: [predicateScan('universal-contraexemplo', 'Todo elemento de {2,3,4} é par?', [true, false, true], [
        '2 é par. Um caso favorável ainda não prova uma afirmação sobre todos.', '3 não é par: encontramos um contraexemplo. A afirmação universal já está refutada.', '4 é par, mas isso não apaga o contraexemplo 3. Portanto ∀x∈D P(x) é F.',
      ], '∀x∈{2,3,4}, x é par: F')],
    },
    {
      id: 'existencial', title: 'Uma testemunha é suficiente', technicalIndices: [2],
      intuitiveExplanation: 'Para afirmar que existe uma lâmpada acesa, basta mostrar uma. Para afirmar que não existe nenhuma, você precisa conferir todas e não encontrar uma sequer.',
      examples: [predicateScan('existencial-testemunha', 'Existe um elemento ímpar em {2,3,4}?', [false, true, false], [
        '2 não é ímpar. Uma tentativa que falha ainda não torna o existencial falso.', '3 é ímpar. Ele é uma testemunha: o existencial é verdadeiro.', '4 não é ímpar. Isso não elimina a testemunha 3; ∃x∈D P(x) continua V.',
      ], 'P(x): x é ímpar; ∃x∈D P(x) = V'),
      predicateScan('existencial-nenhum', 'Existe um elemento maior que 5?', [false, false, false], [
        '2 não é maior que 5. Ainda faltam candidatos.', '3 também não é maior que 5. Falta verificar 4.', '4 também falha. Examinamos todo D sem testemunha: o existencial é falso.',
      ], 'P(x): x>5; ∃x∈D P(x) = F')],
    },
    {
      id: 'negacao-quantificadores', title: 'De todos para um contraexemplo; de algum para nenhum', technicalIndices: [3],
      intuitiveExplanation: 'Negar “todos passaram” é dizer “alguém não passou”. Negar “alguém passou” exige que ninguém tenha passado. Além de trocar o quantificador, precisamos negar a propriedade.',
      examples: [animation('negacao-universal', 'Negando “todos são pares”', [
        { graph: domain, vertexColorMap: { '2': GREEN, '3': RED, '4': GREEN }, vertexNotes: { '2': 'P=V', '3': 'P=F', '4': 'P=V' }, message: 'Para P(x): x é par, o elemento 3 faz ∀xP(x) ser falso. Portanto sua negação é verdadeira.', formula: '¬∀x∈D P(x) = V' },
        { graph: domain, vertexColorMap: { '2': RED, '3': GREEN, '4': RED }, currentVertex: '3', vertexNotes: { '2': '¬P=F', '3': '¬P=V: testemunha', '4': '¬P=F' }, message: 'Agora avaliamos ¬P, “não é par”. As cores se invertem; 3 é testemunha de ∃x¬P(x). A mesma pessoa que derruba “todos” prova “existe um que não”.', formula: '¬∀xP(x) ≡ ∃x¬P(x)' },
      ]), animation('negacao-existencial', 'Negando “existe alguém maior que 5”', [
        { graph: domain, vertexColorMap: { '2': RED, '3': RED, '4': RED }, vertexNotes: { '2': 'P=F', '3': 'P=F', '4': 'P=F' }, message: 'Nenhum elemento de D é maior que 5. ∃xP(x) é falso e sua negação é verdadeira.', formula: 'P(x): x>5; ¬∃x∈D P(x) = V' },
        { graph: domain, vertexColorMap: { '2': GREEN, '3': GREEN, '4': GREEN }, vertexNotes: { '2': '¬P=V', '3': '¬P=V', '4': '¬P=V' }, message: 'Negando a propriedade, todos satisfazem x≤5. Cada nó mudou de P falso para ¬P verdadeiro.', formula: '¬∃xP(x) ≡ ∀x¬P(x)' },
      ])],
    },
    {
      id: 'dominio-universal', title: 'Restringir uma afirmação universal', technicalIndices: [4],
      intuitiveExplanation: '“Todo cliente com cupom recebe desconto” só exige algo dos clientes com cupom. Não exige que todas as pessoas tenham cupom. A implicação permite ignorar, nessa regra, quem está fora da condição.',
      examples: [animation('dominio-implicacao', 'Em D={2,3,4}, todo par é maior que 1', [
        { graph: domain, vertexColorMap: { '2': BLUE, '3': AMBER, '4': BLUE }, vertexNotes: { '2': 'par', '3': 'não par', '4': 'par' }, message: 'Selecionamos o grupo sobre o qual a regra fala: 2 e 4 são pares. O 3 está fora dessa restrição.', formula: '∀x∈D (Par(x) → x>1)' },
        { graph: domain, vertexColorMap: { '2': GREEN, '3': GREEN, '4': GREEN }, vertexNotes: { '2': 'V→V = V', '3': 'F→V = V', '4': 'V→V = V' }, message: 'Os dois pares são maiores que 1. No 3, a premissa falsa torna a implicação verdadeira. Todas as linhas passam.', formula: '∀x∈D (Par(x) → x>1) = V', table: { headers: ['x','Par(x)','x>1','→'], rows: [['2','V','V','V'],['3','F','V','V'],['4','V','V','V']] } },
        { graph: domain, vertexColorMap: { '2': GREEN, '3': RED, '4': GREEN }, currentVertex: '3', vertexNotes: { '3': 'não é par: conjunção falha' }, message: 'Se trocarmos → por ∧, exigiremos que todo elemento seja par e maior que 1. O 3 derruba essa nova afirmação.', formula: '∀x∈D (Par(x) ∧ x>1) = F', table: { headers: ['x','Par(x)','x>1','∧'], rows: [['2','V','V','V'],['3','F','V','F'],['4','V','V','V']] } },
      ])],
    },
    {
      id: 'dominio-existencial', title: 'A testemunha precisa cumprir as duas condições', technicalIndices: [4],
      intuitiveExplanation: '“Existe cliente com cupom e desconto” pede uma pessoa que tenha as duas coisas. Uma pessoa sem cupom não serve como testemunha só porque uma regra condicional sobre cupons não foi quebrada.',
      examples: [animation('dominio-conjuncao', 'Existe par maior que 5 em D={2,3,4}?', [
        { graph: domain, vertexColorMap: { '2': RED, '3': RED, '4': RED }, message: 'Com a conjunção, nenhum candidato é simultaneamente par e maior que 5. O existencial correto é falso.', formula: '∃x∈D (Par(x) ∧ x>5) = F', table: { headers: ['x','Par(x)','x>5','∧'], rows: [['2','V','F','F'],['3','F','F','F'],['4','V','F','F']] } },
        { graph: domain, vertexColorMap: { '2': RED, '3': GREEN, '4': RED }, currentVertex: '3', vertexNotes: { '3': 'F→F = V' }, message: 'Trocando ∧ por →, o 3 faz a expressão ser verdadeira porque não é par. Isso afirma outra coisa e não fornece um par maior que 5.', formula: '∃x∈D (Par(x) → x>5) = V', table: { headers: ['x','Par(x)','x>5','→'], rows: [['2','V','F','F'],['3','F','F','V'],['4','V','F','F']] } },
      ])],
    },
    {
      id: 'livre-ligada', title: 'Quem preenche cada variável', technicalIndices: [5],
      intuitiveExplanation: 'Um quantificador é uma instrução que controla um espaço da frase. Se ele controla x mas deixa y sem valor, a frase inteira ainda depende de y. Ligar ou substituir a variável que falta fecha essa pendência.',
      examples: [animation('escopo-variaveis', 'A dependência em ∀x(x<y)', [
        { graph: diagram([['∀x'], ['x', 'y']], [['∀x','x']]), edgeLabels: { e0: 'liga' }, vertexColorMap: { x: BLUE, y: AMBER }, vertexNotes: { x: 'ligada', y: 'livre' }, message: 'A seta representa o vínculo de escopo. ∀x liga a ocorrência de x, mas não a de y; falta escolher y.', formula: '∀x∈{1,2} (x<y)' },
        { graph: diagram([['∀x'], ['x', 'y=3']], [['∀x','x']]), edgeLabels: { e0: 'liga' }, vertexColorMap: { x: BLUE, 'y=3': GREEN }, message: 'Substituindo y por 3, temos uma proposição verdadeira: 1<3 e 2<3.', formula: '∀x∈{1,2} (x<3) = V', table: { headers: ['x','x<3'], rows: [['1','V'],['2','V']] } },
        { graph: diagram([['∀x', '∃y'], ['x', 'y']], [['∀x','x'], ['∃y','y']]), edgeLabels: { e0: 'liga', e1: 'liga' }, vertexColorMap: { x: BLUE, y: BLUE }, vertexNotes: { x: 'ligada por ∀x', y: 'ligada por ∃y' }, message: 'Outra opção é quantificar y: ∃y∈{1,2,3} ∀x∈{1,2}(x<y). Agora não restam variáveis livres; y=3 é uma testemunha.', formula: '∃y∈{1,2,3} ∀x∈{1,2} (x<y) = V' },
      ])],
    },
  ],
};
