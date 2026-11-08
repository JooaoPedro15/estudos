/** Consulta T1 -> T2 com rehash -> ABP ou lista com cabeça. */
public class HibridaCamadas {
  static class Registro {int codigo;String nome;Registro(int x,String n){codigo=x;nome=n;}}
  static class No {Registro elemento;No esq,dir;No(Registro r){elemento=r;}}
  static class Celula {Registro elemento;Celula prox;Celula(Registro r){elemento=r;}}
  static class T2 {Registro[] tabela=new Registro[5];No raiz;Celula primeiro=new Celula(null);}
  static class Posicao {Registro elemento;T2 t2;}
  Posicao[] tabela=new Posicao[3];
  HibridaCamadas(){for(int i=0;i<tabela.length;i++)tabela[i]=new Posicao();}
  /** Busca por código não negativo seguindo somente a rota de inserção. */
  Registro pesquisar(int codigo){Registro resp=null;if(codigo>=0){Posicao p=tabela[codigo%3];if(p.elemento!=null&&p.elemento.codigo==codigo)resp=p.elemento;else if(p.t2!=null){T2 t=p.t2;int h=codigo%5,r=(h+1)%5;if(t.tabela[h]!=null&&t.tabela[h].codigo==codigo)resp=t.tabela[h];else if(t.tabela[r]!=null&&t.tabela[r].codigo==codigo)resp=t.tabela[r];else if(codigo%2==0){No i=t.raiz;while(i!=null&&resp==null){if(i.elemento.codigo==codigo)resp=i.elemento;else if(codigo<i.elemento.codigo)i=i.esq;else i=i.dir;}}else for(Celula i=t.primeiro.prox;i!=null&&resp==null;i=i.prox)if(i.elemento.codigo==codigo)resp=i.elemento;}}return resp;}
  /** Campo sem índice: visita posições primárias, reservas e estruturas internas. */
  Registro pesquisarNome(String nome){Registro resp=null;for(int j=0;j<tabela.length&&resp==null;j++){Posicao p=tabela[j];if(p.elemento!=null&&igual(p.elemento.nome,nome))resp=p.elemento;T2 t=p.t2;if(resp==null&&t!=null){for(int k=0;k<t.tabela.length&&resp==null;k++)if(t.tabela[k]!=null&&igual(t.tabela[k].nome,nome))resp=t.tabela[k];if(resp==null)resp=percorrer(t.raiz,nome);for(Celula i=t.primeiro.prox;i!=null&&resp==null;i=i.prox)if(igual(i.elemento.nome,nome))resp=i.elemento;}}return resp;}
  /** A ordenação por código não permite podar a pesquisa por nome. */
  private Registro percorrer(No i,String nome){Registro resp=null;if(i!=null){if(igual(i.elemento.nome,nome))resp=i.elemento;if(resp==null)resp=percorrer(i.esq,nome);if(resp==null)resp=percorrer(i.dir,nome);}return resp;}
  /** Compara nomes com as operações básicas de String. */
  static boolean igual(String a,String b){boolean resp=a.length()==b.length();for(int j=0;j<a.length()&&resp;j++)resp=a.charAt(j)==b.charAt(j);return resp;}
  /** Verifica todas as rotas e pesquisas sem índice. */
  public static void main(String[] args){
    HibridaCamadas h=new HibridaCamadas();if(h.pesquisar(0)!=null)throw new AssertionError("vazia");
    h.tabela[0].elemento=new Registro(0,"zero");T2 t=h.tabela[0].t2=new T2();t.tabela[0]=new Registro(15,"vega");t.tabela[1]=new Registro(30,"lume");t.raiz=new No(new Registro(60,"zeta"));t.raiz.dir=new No(new Registro(90,"alfa"));t.primeiro.prox=new Celula(new Registro(45,"brisa"));t.primeiro.prox.prox=new Celula(new Registro(75,"norte"));
    for(int x:new int[]{0,15,30,60,90,45,75})if(h.pesquisar(x)==null||h.pesquisar(x).codigo!=x)throw new AssertionError("rota");
    if(h.pesquisar(120)!=null||h.pesquisar(105)!=null||h.pesquisar(-1)!=null||h.pesquisar(2)!=null)throw new AssertionError("ausente");
    if(h.pesquisarNome("alfa").codigo!=90||h.pesquisarNome("norte").codigo!=75||h.pesquisarNome("outra")!=null)throw new AssertionError("nome");
    System.out.println("TODOS OK");
  }
}
