/** Operações de AVL com nivel=1 na folha e nivel=0 para referência nula. */
public class AvlRevisao {
  static class No { int elemento,nivel=1; No esq,dir; No(int x){elemento=x;} }
  No raiz;
  /** Consulta o nível armazenado sem recalcular a árvore. */
  static int nivel(No i){int resp=0;if(i!=null)resp=i.nivel;return resp;}
  /** Recalcula em pós-ordem, sem confiar nos valores armazenados. */
  static int recalcular(No i){int resp=0;if(i!=null){int e=recalcular(i.esq),d=recalcular(i.dir);resp=1+(e>d?e:d);i.nivel=resp;}return resp;}
  /** Propaga limites globais; long permite aceitar os extremos do tipo int. */
  static boolean ehABB(No i,long menor,long maior){boolean resp=true;if(i!=null)resp=i.elemento>menor&&i.elemento<maior&&ehABB(i.esq,menor,i.elemento)&&ehABB(i.dir,i.elemento,maior);return resp;}
  /** Retorna níveis ou -1 para desequilíbrio em qualquer descendente. */
  static int nivelBalanceado(No i){int resp=0;if(i!=null){int e=nivelBalanceado(i.esq),d=nivelBalanceado(i.dir);if(e<0||d<0||e-d>1||d-e>1)resp=-1;else resp=1+(e>d?e:d);}return resp;}
  /** Verifica ordenação global e equilíbrio sem alterar a estrutura. */
  public boolean isAVL(){return ehABB(raiz,Long.MIN_VALUE,Long.MAX_VALUE)&&nivelBalanceado(raiz)>=0;}
  /** Atualiza um único nó a partir dos filhos. */
  static void atualizar(No i){int e=nivel(i.esq),d=nivel(i.dir);i.nivel=1+(e>d?e:d);}
  /** Rotação simples à direita; requer filho esquerdo. */
  static No direita(No i){No resp=i.esq;i.esq=resp.dir;resp.dir=i;atualizar(i);atualizar(resp);return resp;}
  /** Rotação simples à esquerda; requer filho direito. */
  static No esquerda(No i){No resp=i.dir;i.dir=resp.esq;resp.esq=i;atualizar(i);atualizar(resp);return resp;}
  /** Corrige os quatro casos ao retornar da inserção. */
  static No balancear(No i){
    atualizar(i);int fator=nivel(i.dir)-nivel(i.esq);
    if(fator>1){if(nivel(i.dir.esq)>nivel(i.dir.dir))i.dir=direita(i.dir);i=esquerda(i);}
    else if(fator< -1){if(nivel(i.esq.dir)>nivel(i.esq.esq))i.esq=esquerda(i.esq);i=direita(i);}
    return i;
  }
  /** Insere sem duplicar chaves; o público reassocia a raiz. */
  public void inserir(int x){raiz=inserir(x,raiz);}
  /** Pesquisa o ramo pela chave e balanceia na volta. */
  private No inserir(int x,No i){if(i==null)i=new No(x);else if(x<i.elemento){i.esq=inserir(x,i.esq);i=balancear(i);}else if(x>i.elemento){i.dir=inserir(x,i.dir);i=balancear(i);}return i;}
  /** Conta chaves para os testes e a alocação da fila de percurso. */
  static int quantidade(No i){int resp=0;if(i!=null)resp=1+quantidade(i.esq)+quantidade(i.dir);return resp;}
  /** Soma em intervalo fechado podando ramos impossíveis numa ABB válida. */
  static long somaIntervalo(No i,int a,int b){long resp=0;if(i!=null&&a<=b){if(i.elemento>a)resp+=somaIntervalo(i.esq,a,b);if(i.elemento>=a&&i.elemento<=b)resp+=i.elemento;if(i.elemento<b)resp+=somaIntervalo(i.dir,a,b);}return resp;}
  /** Percurso por níveis com uma fila em vetor, sem coleções prontas. */
  public int[] porNiveis(){int n=quantidade(raiz),primeiro=0,ultimo=0;int[] resp=new int[n];No[] fila=new No[n];if(raiz!=null)fila[ultimo++]=raiz;while(primeiro<ultimo){No i=fila[primeiro];resp[primeiro++]=i.elemento;if(i.esq!=null)fila[ultimo++]=i.esq;if(i.dir!=null)fila[ultimo++]=i.dir;}return resp;}
  /** Falha explicitamente mesmo sem habilitar assert da JVM. */
  static void exigir(boolean ok){if(!ok)throw new AssertionError("AVL");}
  /** Testa rotações simples/duplas, limites globais, níveis e inserção ordenada. */
  public static void main(String[] args){
    AvlRevisao vazia=new AvlRevisao();exigir(vazia.isAVL()&&vazia.porNiveis().length==0);
    int[][] casos={{30,20,10},{10,20,30},{30,10,20},{10,30,20}};
    for(int[] c:casos){AvlRevisao a=new AvlRevisao();for(int x:c)a.inserir(x);exigir(a.raiz.elemento==20&&a.isAVL()&&a.raiz.nivel==2);int[] v=a.porNiveis();exigir(v[0]==20&&v[1]==10&&v[2]==30);}
    AvlRevisao a=new AvlRevisao();for(int x=1;x<=200;x++){a.inserir(x);exigir(a.isAVL());}a.inserir(80);exigir(quantidade(a.raiz)==200&&somaIntervalo(a.raiz,5,8)==26&&somaIntervalo(a.raiz,9,1)==0);
    No ruim=new No(20);ruim.esq=new No(10);ruim.esq.dir=new No(25);exigir(!ehABB(ruim,Long.MIN_VALUE,Long.MAX_VALUE));
    No extremos=new No(Integer.MIN_VALUE);extremos.dir=new No(Integer.MAX_VALUE);exigir(ehABB(extremos,Long.MIN_VALUE,Long.MAX_VALUE));extremos.nivel=99;exigir(recalcular(extremos)==2&&extremos.nivel==2);
    No cadeia=new No(1);cadeia.dir=new No(2);cadeia.dir.dir=new No(3);exigir(nivelBalanceado(cadeia)==-1);
    System.out.println("TODOS OK");
  }
}
