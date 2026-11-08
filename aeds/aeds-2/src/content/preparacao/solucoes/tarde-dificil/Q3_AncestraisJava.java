/**
 * Exercício Q3 (versao Java): contarUmFilho() e mostrarAncestrais(x),
 * que imprime x e os ancestrais, de x ate a raiz. A versao em C (API new_*) esta em Q3_ancestrais.c.
 */
class No {
   int elemento; No esq, dir;
   No(int elemento) { this.elemento = elemento; esq = dir = null; }
}

class ArvoreBinaria {
   No raiz;
   String saida = "";   // so para o teste conferir o que foi impresso

   void inserir(int x) { raiz = inserir(x, raiz); }
   private No inserir(int x, No i) {
      if (i == null) i = new No(x);
      else if (x < i.elemento) i.esq = inserir(x, i.esq);
      else if (x > i.elemento) i.dir = inserir(x, i.dir);
      return i;
   }
   private void imprimir(int x) { System.out.print(x + " "); saida += x + " "; }

   // ===================== RESPOSTA DA QUESTAO =====================
   public int contarUmFilho() { return contarUmFilho(raiz); }
   private int contarUmFilho(No i) {
      int resp = 0;
      if (i != null) {
         if ((i.esq == null) != (i.dir == null)) {   // exatamente um filho (XOR)
            resp = 1;
         }
         resp += contarUmFilho(i.esq) + contarUmFilho(i.dir);
      }
      return resp;
   }

   public boolean mostrarAncestrais(int x) {
      boolean resp = mostrarAncestrais(x, raiz);
      System.out.println();
      return resp;
   }
   /** Desce como na pesquisa; se achou, imprime o no NA VOLTA: x primeiro, depois o pai, ate a raiz. */
   private boolean mostrarAncestrais(int x, No i) {
      boolean achou = false;
      if (i != null) {
         if (x == i.elemento) achou = true;
         else if (x < i.elemento) achou = mostrarAncestrais(x, i.esq);
         else achou = mostrarAncestrais(x, i.dir);
         if (achou) imprimir(i.elemento);
      }
      return achou;
   }
   // Pior caso (ABP degenerada): Theta(n). Balanceada: Theta(lg n).
   // ================================================================
}

public class Q3_AncestraisJava {
   static int falhas = 0;
   static void checar(boolean ok, String desc) { System.out.println((ok ? "OK    " : "FALHA ") + desc); if (!ok) falhas++; }

   public static void main(String[] args) {
      ArvoreBinaria a = new ArvoreBinaria();
      checar(a.contarUmFilho() == 0, "arvore vazia -> 0");
      checar(!a.mostrarAncestrais(7) && a.saida.isEmpty(), "arvore vazia: false e nada impresso");
      int[] ins = {10, 5, 15, 2, 7, 20};
      for (int x : ins) a.inserir(x);
      checar(a.contarUmFilho() == 1, "10 5 15 2 7 20 -> 1 (o 15)");
      a.saida = "";
      checar(a.mostrarAncestrais(7) && a.saida.equals("7 5 10 "), "ancestrais de 7: 7 5 10");
      a.saida = "";
      checar(a.mostrarAncestrais(10) && a.saida.equals("10 "), "x na raiz: so 10");
      a.saida = "";
      checar(!a.mostrarAncestrais(8) && a.saida.isEmpty(), "x ausente: false e nada impresso");
      a.inserir(6);
      checar(a.contarUmFilho() == 2, "inserindo 6: 15 e 7 tem um filho");
      System.out.println(falhas == 0 ? "TODOS OK" : falhas + " FALHA(S)");
   }
}
