/** Pesquisa autoral em hash com reserva em árvore ou lista com cabeça. */
public class Hibrida {
  static class No { int elemento; No esq,dir; No(int x) { elemento=x; } }
  static class Celula { int elemento; Celula prox; Celula(int x) { elemento=x; } }
  static class Posicao { int elemento; boolean ocupado; No raiz; Celula primeiro=new Celula(0); }
  Posicao[] tabela=new Posicao[5];
  Hibrida() { for(int i=0;i<tabela.length;i++) tabela[i]=new Posicao(); }
  /** Mapeia negativos e positivos para um índice válido. */
  int hash(int x) { int resp=x%tabela.length; if(resp<0) resp+=tabela.length; return resp; }
  /** Pesquisa a posição primária e só depois a reserva escolhida pela paridade. */
  boolean pesquisar(int x) {
    Posicao p=tabela[hash(x)]; boolean resp=p.ocupado && p.elemento==x;
    if(!resp && x%2==0) {
      No i=p.raiz;
      while(i!=null && !resp) {
        if(x==i.elemento) resp=true;
        else if(x<i.elemento) i=i.esq;
        else i=i.dir;
      }
    } else if(!resp) {
      for(Celula i=p.primeiro.prox;i!=null && !resp;i=i.prox) resp=i.elemento==x;
    }
    return resp;
  }
  /** Exercita acerto primário, ambas as reservas, zero e ausência. */
  public static void main(String[] args) {
    Hibrida h=new Hibrida(); h.tabela[0].elemento=0; h.tabela[0].ocupado=true;
    h.tabela[0].raiz=new No(10); h.tabela[0].raiz.dir=new No(20);
    h.tabela[0].primeiro.prox=new Celula(15);
    h.tabela[4].primeiro.prox=new Celula(-1);
    if(!h.pesquisar(0) || !h.pesquisar(20) || !h.pesquisar(15) || !h.pesquisar(-1)) throw new AssertionError("acerto");
    if(h.pesquisar(30) || h.pesquisar(25) || h.pesquisar(1)) throw new AssertionError("ausencia");
    System.out.println("TODOS OK");
  }
}
