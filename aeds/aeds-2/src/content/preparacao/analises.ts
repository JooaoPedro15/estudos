import type { ExamId } from '../examCatalog';
import p1 from './analises/p1.md?raw';
import p3 from './analises/p3.md?raw';
import reav from './analises/reav.md?raw';
import { assuntoQuestao,getQuestoesPreparacao,planos,type QuestaoPreparacao } from './catalogo';
export const analises:Partial<Record<ExamId,string>>={p1,p3,reav};
const esqueletos:Record<string,string>={
  analise:'Definir operação relevante → contar repetições → fechar soma → justificar crescimento.',
  fila:'Manter os índices e a posição reservada; só modificar a estrutura após validar o caso.',
  ordenacao:'Manter o invariante do algoritmo e substituir apenas a relação de ordem exigida.',
  'ordenacao-completa':'Partição, intercalação ou heap: preservar o algoritmo pedido.',
  recursividade:'Caso base, avanço finito e composição da resposta.',
  busca:'Manter o intervalo onde o elemento ainda pode estar.',
  arvore:'Separar pesquisa pela chave de percurso por todos os nós.',
  avl:'Percorrer, combinar informações dos filhos e atualizar níveis na ordem correta.',
  alvinegra:'Declarar a convenção de cores; propagar a informação de cada caminho.',
  arvore234:'Comparar chaves do nó, escolher intervalo e visitar apenas filhos válidos.',
  trie:'Descer pelos caracteres e distinguir marcador de palavra de existência do caminho.',
  patricia:'Comparar o segmento inteiro e respeitar os intervalos dos rótulos.',
  hash:'Aplicar exatamente a distribuição e a política de colisão fornecidas.',
  hibrida:'Separar a rota de cada camada; caminhar quando o campo não tem índice.',
  lista:'Salvar referências e preservar cabeça, primeiro dado e último.',
  parcial:'Manter os k selecionados e analisar também a dependência em k.',
  treesort:'Inserção em ABP + percurso central, com regra explícita para repetidos.',
};
function transferencia(q:QuestaoPreparacao) {
  if(/hibrida|uniao|prefixoSufixo|sufixo|niveis|arvore-outro-campo/.test(q.id))return 'Combinação: junta rotinas conhecidas, mas exige um novo contrato entre elas.';
  if(/inserir|exata|busca|comparador|soma|impares/.test(q.id))return 'Base: implemente e justifique este esqueleto antes das variações.';
  return 'Variação: o percurso pode ser reaproveitado; a condição e os casos de borda mudam.';
}
export function matrizOperacoes(exam:ExamId) {
  return getQuestoesPreparacao(exam).map(question=>{
    const id=assuntoQuestao(question),tema=planos[exam].topics.find(t=>t.id===id);
    return {question,tema:tema?.title??id,esqueleto:esqueletos[id]??'Leia o contrato e preserve os invariantes da estrutura.',transferencia:transferencia(question),evidencia:tema?.evidence??'Revisão cumulativa das operações dos materiais da disciplina.'};
  });
}
