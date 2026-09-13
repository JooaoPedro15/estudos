/**
 * Dicionário de notação da P1, para a legenda "símbolos usados aqui" do
 * "Me ensine": cada entrada tem o símbolo como aparece no texto, um
 * significado de uma linha e o padrão que o detecta no enunciado/solução.
 * Ordem = ordem de exibição (do mais específico para o mais genérico).
 */
export interface SymbolEntry {
  symbol: string;
  meaning: string;
  pattern: RegExp;
}

export const SYMBOLS: SymbolEntry[] = [
  { symbol: 'G = (V, E)', meaning: 'o grafo: V é o conjunto de vértices (bolinhas), E o de arestas (ligações)', pattern: /G\s*=\s*\(V,\s*[EA]\)/ },
  { symbol: '|V|', meaning: 'número de vértices (as barras | | = "quantos")', pattern: /\|V\|/ },
  { symbol: '|E|', meaning: 'número de arestas', pattern: /\|E(\([^)]*\))?\|/ },
  { symbol: 'n', meaning: 'número de vértices', pattern: /(^|[^\p{L}])n(?=[^\p{L}]|$)/u },
  { symbol: 'm', meaning: 'número de arestas (quando a questão define |E| = m)', pattern: /(^|[^\p{L}])m\s*(≤|=|>|<|≥)/u },
  { symbol: 'k', meaning: 'número de componentes conexos ("pedaços soltos") — ou um inteiro qualquer em "4k"', pattern: /(^|[^\p{L}])k(?=[^\p{L}]|$)/u },
  { symbol: 'r, s, t', meaning: 'tamanhos dos três lados do tripartido: r vértices no lado 1, s no lado 2, t no lado 3', pattern: /K\s*r\s*,\s*s\s*,\s*t|r,\s*s\s*e\s*t|rs\s*\+\s*rt\s*\+\s*st/ },
  { symbol: 'rs + rt + st', meaning: 'arestas entre lado 1 e 2 (r·s) + entre 1 e 3 (r·t) + entre 2 e 3 (s·t)', pattern: /rs\s*\+\s*rt\s*\+\s*st/ },
  { symbol: 'Kn', meaning: 'grafo completo com n vértices: todo mundo ligado a todo mundo', pattern: /K\s*n\b|K\d+(?![\d,])|K\(n/ },
  { symbol: 'Km,n', meaning: 'bipartido completo: m vértices de um lado, n do outro, todas as ligações cruzadas', pattern: /K\s*m\s*,\s*n|K\(\d+\s*,\s*\d+\)|K\d+,\d+(?!,)/ },
  { symbol: 'Kr,s,t', meaning: 'tripartido completo: três lados de tamanhos r, s, t; aresta só entre lados diferentes', pattern: /K\s*r\s*,\s*s\s*,\s*t|K\d+,\d+,\d+/ },
  { symbol: 'd(v)', meaning: 'grau de v: quantas arestas tocam o vértice v', pattern: /d\((v|u|w|[a-z])\)|d\(vi\)/ },
  { symbol: 'd⁻(v) / d⁺(v)', meaning: 'grau de entrada (setas chegando) / grau de saída (setas saindo)', pattern: /d[⁻⁺]\(/ },
  { symbol: 'Σ d(v)', meaning: 'soma dos graus de todos os vértices (Σ = "some tudo")', pattern: /Σ\s*d\(|Σ\s*_?\{?d/ },
  { symbol: 'Σ', meaning: 'sigma: "some todos os termos"', pattern: /Σ/ },
  { symbol: 'C(n, i)', meaning: '"escolher i entre n": de quantos jeitos dá para escolher i coisas de n (C(4,2) = 6)', pattern: /C\(\s*\w+\s*,\s*\w+\s*\)/ },
  { symbol: '2^x', meaning: '2 elevado a x: cada uma das x coisas tem 2 opções (entra / não entra)', pattern: /2\^/ },
  { symbol: 'n(n − 1)/2', meaning: 'arestas do grafo completo Kn (máximo possível com n vértices)', pattern: /n\s*\(\s*n\s*[−-]\s*1\s*\)\s*\/\s*2/ },
  { symbol: 'n(n − 1)/4', meaning: 'metade das arestas de Kn: arestas de um grafo auto-complementar', pattern: /n\s*\(\s*n\s*[−-]\s*1\s*\)\s*\/\s*4/ },
  { symbol: 'n − k', meaning: 'mínimo de arestas com n vértices e k componentes', pattern: /n\s*[−-]\s*k(?!\s*\+)/ },
  { symbol: '(n − k)(n − k + 1)/2', meaning: 'máximo de arestas com n vértices e k componentes', pattern: /\(\s*n\s*[−-]\s*k\s*\)\s*\(\s*n\s*[−-]\s*k\s*\+\s*1\s*\)/ },
  { symbol: 'Ḡ', meaning: 'complemento de G: tem aresta exatamente onde G não tem', pattern: /Ḡ|C\(G\)/ },
  { symbol: '≅', meaning: '"é isomorfo a": mesmo grafo, só com os nomes trocados', pattern: /≅/ },
  { symbol: '4k / 4k + 1', meaning: 'múltiplo de 4, ou múltiplo de 4 mais 1 (4, 5, 8, 9, 12, 13…)', pattern: /4k/ },
  { symbol: 'mod', meaning: 'resto da divisão: n ≡ 1 (mod 4) = "n dividido por 4 deixa resto 1"', pattern: /\bmod\b|≡/ },
  { symbol: 'ε(v)', meaning: 'excentricidade de v: distância até o vértice mais longe de v', pattern: /ε\(/ },
  { symbol: 'dist(v, u)', meaning: 'distância: menor número de arestas entre v e u', pattern: /dist\(/ },
  { symbol: 'Γ⁺(v)', meaning: 'fecho transitivo direto: tudo que v alcança seguindo as setas', pattern: /Γ⁺/ },
  { symbol: 'Gᵀ', meaning: 'grafo transposto: mesmas arestas, setas invertidas', pattern: /Gᵀ|Eᵀ|transposto/i },
  { symbol: 'aij', meaning: 'entrada da matriz de adjacência na linha i, coluna j (1 = existe aresta i→j)', pattern: /a\s*ij|aij/ },
  { symbol: 'N(v)', meaning: 'vizinhos de v: os vértices ligados a v (no dirigido, para onde as setas de v apontam)', pattern: /N\([a-z]\)/ },

  // Pseudocódigo no estilo do quadro (content/pseudocode.ts).
  { symbol: 'NOME(G)', meaning: 'cabeçalho do algoritmo: o nome em maiúsculo e o que ele recebe (G = o grafo); escrever NOME(G) dentro de outro algoritmo executa esse', pattern: /(^|\n)[A-ZÁÉÍÓÚ_]{3,}\([A-Za-z, ]*\)/ },
  { symbol: 'V', meaning: 'conjunto de todos os vértices do grafo — "for v ∈ V" = para cada vértice v, um de cada vez', pattern: /for\s+\S+\s*∈\s*V\b/ },
  { symbol: 'E', meaning: 'conjunto de todas as arestas — "(u, w) ∈ E" é a aresta que sai de u e chega em w', pattern: /∈\s*E\b|\(V,\s*E[ᵀ)]/ },
  { symbol: 'v, u, w', meaning: 'letras minúsculas = um vértice qualquer; v costuma ser o vértice atual e u um vizinho dele', pattern: /for\s+[uvw]\s*∈|\(G,\s*[uvw]\)/ },
  { symbol: 'B', meaning: 'o conjunto que o algoritmo vai montando (aqui, a base): começa vazio e recebe vértices com ∪', pattern: /(^|[^\p{L}])B\s*=\s*(∅|B\s*∪)/u },
  { symbol: 'C, X', meaning: 'C = conjunto dos componentes fortemente conexos devolvido por KOSARAJU; X é um deles (um ciclo contraído num só "hipervértice")', pattern: /X\s*∈\s*C|C\s*=\s*KOSARAJU/ },
  { symbol: '∅', meaning: 'conjunto vazio: nenhum elemento ainda', pattern: /∅/ },
  { symbol: '∞', meaning: 'infinito: distância que não existe (o vértice não é alcançável)', pattern: /∞/ },
  { symbol: '≠', meaning: '"diferente de"', pattern: /≠/ },
  { symbol: 'for x ∈ S', meaning: 'repete o bloco de baixo para cada elemento x do conjunto S', pattern: /\bfor\s+\S+\s*∈/ },
  { symbol: 'if cond:', meaning: 'se a condição vale, executa o que vem depois dos dois-pontos (ou o bloco mais indentado abaixo)', pattern: /\bif\b/ },
  { symbol: 'while cond', meaning: 'repete o bloco de baixo enquanto a condição valer', pattern: /\bwhile\b/ },
  { symbol: '= / ==', meaning: '"=" guarda um valor (x = 0 → x passa a valer 0); "==" pergunta se é igual (x == 0 → x vale 0?)', pattern: /==/ },
  { symbol: 'return', meaning: 'devolve o resultado e encerra o algoritmo', pattern: /\breturn\b/ },
  { symbol: 'visitado[u]', meaning: 'estado do vértice u na busca: 0 = ainda não visitado, 1 = em visita (a busca ainda está dentro dele), 2 = terminado', pattern: /visitado\[/ },
  { symbol: 'pai[u]', meaning: 'de qual vértice a busca chegou em u (serve para refazer o caminho de volta)', pattern: /pai\[/ },
  { symbol: 'dist[u]', meaning: 'distância de u até o vértice de partida, em número de arestas (−1 = ainda não alcançado)', pattern: /dist\[/ },
  { symbol: 'fim[u]', meaning: 'tempo em que a busca terminou u (momento em que visitado[u] virou 2)', pattern: /fim\[/ },
  { symbol: 'ge[v]', meaning: 'grau de entrada que ainda falta "consumir": quando chega a 0, v não depende mais de ninguém', pattern: /ge\[/ },
  { symbol: 't[v]', meaning: 'semana em que a tarefa v termina', pattern: /(^|[^\p{L}])t\[/u },
  { symbol: 'usada[a]', meaning: 'se a aresta a já foi percorrida (verdadeiro / falso)', pattern: /usada\[/ },
  { symbol: 'fila', meaning: 'fila: entra pelo fim, sai pelo início — o primeiro que entra é o primeiro que sai', pattern: /\bfila\b/ },
  { symbol: '|visitado|', meaning: 'número de elementos do conjunto visitado', pattern: /\|visitado\|/ },
  { symbol: '// texto', meaning: 'comentário: explica a linha, não faz parte do algoritmo', pattern: /\/\// },
  { symbol: '∈ / ∉', meaning: '"pertence a" / "não pertence a"', pattern: /[∈∉]/ },
  { symbol: '⊆ / ⊂', meaning: '"está contido em" (subconjunto)', pattern: /[⊆⊂]/ },
  { symbol: '∪ / ∩', meaning: 'união (junta) / interseção (o que é comum)', pattern: /[∪∩]/ },
  { symbol: '⇒', meaning: '"portanto", "logo"', pattern: /⇒/ },
  { symbol: '⟺ / sse', meaning: '"se e somente se": vale nos dois sentidos', pattern: /⟺|⇔|\bsse\b/ },
  { symbol: '∀ / ∃', meaning: '"para todo" / "existe pelo menos um"', pattern: /[∀∃]/ },
  { symbol: '¬ ∧ ∨ → ↔', meaning: 'não / e / ou / se…então / se e somente se', pattern: /[¬∧∨→↔]/ },
  { symbol: 'n!', meaning: 'fatorial: n·(n−1)·…·1 (4! = 24)', pattern: /\d+!|n!/ },
  { symbol: 'max / min', meaning: 'o maior / o menor valor entre os candidatos', pattern: /\bmax\b|\bmin\b/ },
];

/** Símbolos que aparecem em um texto, na ordem do dicionário e sem repetição. */
export function symbolsIn(...texts: string[]): SymbolEntry[] {
  const text = texts.join('\n');
  const seen = new Set<string>();
  return SYMBOLS.filter((s) => {
    if (seen.has(s.symbol) || !s.pattern.test(text)) return false;
    seen.add(s.symbol);
    return true;
  });
}
