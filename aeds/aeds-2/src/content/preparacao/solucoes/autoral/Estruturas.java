/** Métodos autorais de AVL e TRIE com testes de fronteira. */
public class Estruturas {
  static class No {
    int elemento,nivel=1; No esq,dir;
    No(int x) { elemento=x; }
  }
  No raiz;
  /** Obtém o nível armazenado: vazio tem zero níveis. */
  static int nivel(No i) { int resp=0; if(i!=null) resp=i.nivel; return resp; }
  /** Conta nós localmente balanceados usando alturas já calculadas, em Θ(n). */
  int contarBalanceados() { return contarBalanceados(raiz); }
  /** Percorre ambos os lados; não pressupõe que a árvore inteira é AVL. */
  private int contarBalanceados(No i) {
    int resp=0;
    if(i!=null) {
      int fator=nivel(i.dir)-nivel(i.esq);
      resp=contarBalanceados(i.esq)+contarBalanceados(i.dir);
      if(fator>=-1 && fator<=1) resp++;
    }
    return resp;
  }
  /** Mede altura em arestas sem depender do atributo nivel: Θ(n). */
  static int altura(No i) {
    int resp=-1;
    if(i!=null) { int e=altura(i.esq),d=altura(i.dir); resp=1+(e>d?e:d); }
    return resp;
  }
  /** Rotação simples à direita com atualização de níveis: Θ(1). Requer filho esquerdo. */
  static No direita(No i) {
    No resp=i.esq; i.esq=resp.dir; resp.dir=i;
    atualizar(i); atualizar(resp); return resp;
  }
  /** Recalcula nível usando os filhos. */
  static void atualizar(No i) {
    int e=nivel(i.esq),d=nivel(i.dir); i.nivel=1+(e>d?e:d);
  }
  static class Letra { Letra[] prox=new Letra[26]; boolean fimPalavra; }
  Letra inicio=new Letra();
  /** Insere palavras de a a z, aceitando prefixos e palavra vazia. */
  void inserir(String s) { inserir(s,0,inicio); }
  /** Cria somente os nós necessários para completar a palavra. */
  private void inserir(String s,int p,Letra i) {
    if(p==s.length()) i.fimPalavra=true;
    else {
      int c=s.charAt(p)-'a';
      if(i.prox[c]==null) i.prox[c]=new Letra();
      inserir(s,p+1,i.prox[c]);
    }
  }
  /** Conta palavras com prefixo, em Θ(p + 26v), v nós na subárvore encontrada. */
  int contarPrefixo(String s) {
    Letra i=inicio;
    for(int p=0;p<s.length() && i!=null;p++) i=i.prox[s.charAt(p)-'a'];
    return contarPalavras(i);
  }
  /** Conta marcadores de fim, incluindo palavras que possuem filhos. */
  private int contarPalavras(Letra i) {
    int resp=0;
    if(i!=null) {
      if(i.fimPalavra) resp=1;
      for(int c=0;c<26;c++) resp+=contarPalavras(i.prox[c]);
    }
    return resp;
  }
  /** Produz uma TRIE com as palavras invertidas sem modificar a original. */
  Estruturas invertida() {
    Estruturas resp=new Estruturas(); inverter(inicio,"",resp); return resp;
  }
  /** Acumula caracteres no começo e insere somente nos finais de palavra. */
  private void inverter(Letra i,String acumulado,Estruturas destino) {
    if(i.fimPalavra) destino.inserir(acumulado);
    for(int c=0;c<26;c++) if(i.prox[c]!=null)
      inverter(i.prox[c],(char)('a'+c)+acumulado,destino);
  }
  /** Testa vazio, cadeia, níveis, rotação e palavras que são prefixos. */
  public static void main(String[] args) {
    Estruturas a=new Estruturas();
    if(a.contarBalanceados()!=0 || altura(a.raiz)!=-1) throw new AssertionError("vazia");
    No r=new No(30),e=new No(20),f=new No(10); r.esq=e; e.esq=f;
    atualizar(e); atualizar(r); a.raiz=r;
    if(a.contarBalanceados()!=2 || altura(r)!=2) throw new AssertionError("cadeia");
    a.raiz=direita(r);
    if(a.raiz.elemento!=20 || nivel(a.raiz)!=2 || a.contarBalanceados()!=3) throw new AssertionError("rotacao");
    a.inserir("luz"); a.inserir("lua"); a.inserir("lu"); a.inserir("sol"); a.inserir("luz"); a.inserir("");
    if(a.contarPrefixo("lu")!=3 || a.contarPrefixo("x")!=0 || a.contarPrefixo("")!=5) throw new AssertionError("prefixo");
    Estruturas b=a.invertida();
    if(b.contarPrefixo("zul")!=1 || b.contarPrefixo("ul")!=1 || b.contarPrefixo("")!=5) throw new AssertionError("invertida");
    if(a.contarPrefixo("lu")!=3) throw new AssertionError("preservacao");
    System.out.println("TODOS OK");
  }
}
