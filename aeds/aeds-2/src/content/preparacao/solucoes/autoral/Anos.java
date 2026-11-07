/** Busca por ano no primeiro nível e por nome no segundo, ordenado também por ano. */
public class Anos {
  static class Registro { int ano; String nome; Registro esq,dir;
    Registro(int a,String n) { ano=a; nome=n; }
  }
  static class No { int ano; No esq,dir; Registro registros;
    No(int a) { ano=a; }
  }
  No raiz;
  /** Compara nomes apenas com length e charAt. */
  static boolean igual(String a,String b) {
    boolean resp=a.length()==b.length();
    for(int i=0;i<a.length() && resp;i++) resp=a.charAt(i)==b.charAt(i);
    return resp;
  }
  /** Localiza o ano e percorre a segunda árvore, cuja chave não é o nome. */
  boolean pesquisar(int ano,String nome) { return pesquisar(ano,nome,raiz); }
  /** Usa a ordenação da primeira árvore para evitar ramos irrelevantes. */
  private boolean pesquisar(int ano,String nome,No i) {
    boolean resp=false;
    if(i!=null) {
      if(ano==i.ano) resp=percorrer(nome,i.registros);
      else if(ano<i.ano) resp=pesquisar(ano,nome,i.esq);
      else resp=pesquisar(ano,nome,i.dir);
    }
    return resp;
  }
  /** Visita ambos os lados: comparar nome não permite escolher um único ramo. */
  private boolean percorrer(String nome,Registro i) {
    boolean resp=false;
    if(i!=null) resp=igual(nome,i.nome) || percorrer(nome,i.esq) || percorrer(nome,i.dir);
    return resp;
  }
  /** Verifica nó ausente, nome ausente e nome no ramo contrário à ordem alfabética. */
  public static void main(String[] args) {
    Anos a=new Anos();
    if(a.pesquisar(2024,"lira")) throw new AssertionError("vazia");
    a.raiz=new No(2024); a.raiz.registros=new Registro(2000,"mira");
    a.raiz.registros.dir=new Registro(2010,"alfa");
    a.raiz.registros.esq=new Registro(1990,"zeta");
    if(!a.pesquisar(2024,"alfa") || !a.pesquisar(2024,"zeta")) throw new AssertionError("ramos");
    if(a.pesquisar(2023,"alfa") || a.pesquisar(2024,"outra")) throw new AssertionError("ausencia");
    System.out.println("TODOS OK");
  }
}
