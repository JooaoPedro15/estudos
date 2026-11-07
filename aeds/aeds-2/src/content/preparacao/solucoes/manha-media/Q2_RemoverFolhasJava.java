/**
 * Manha-media Q2 (versao Java): remover todas as folhas da arvore ORIGINAL.
 * Em Java nao existe No**: o metodo RETORNA o novo no e o pai reatribui (i.esq = removerFolhas(i.esq)).
 * A versao em C com No** (o Walisson codou no aulao em C) esta em Q2_removerFolhas.c.
 */
class No {
   int elemento; No esq, dir;
   No(int elemento) { this.elemento = elemento; esq = dir = null; }
}

class ArvoreBinaria {
   No raiz;

   void inserir(int x) { raiz = inserir(x, raiz); }
   private No inserir(int x, No i) {
      if (i == null) i = new No(x);
      else if (x < i.elemento) i.esq = inserir(x, i.esq);
      else if (x > i.elemento) i.dir = inserir(x, i.dir);
      return i;
   }

   String caminharPre() { return caminharPre(raiz).trim(); }
   private String caminharPre(No i) {
      String resp = "";
      if (i != null) resp = i.elemento + " " + caminharPre(i.esq) + caminharPre(i.dir);
      return resp;
   }

   // ===================== RESPOSTA DA QUESTAO =====================
   public void removerFolhas() { raiz = removerFolhas(raiz); }

   /** Folha vira null (o coletor de lixo libera); senao, desce e reatribui os filhos. */
   private No removerFolhas(No i) {
      if (i != null) {
         if (i.esq == null && i.dir == null) {
            i = null;
         } else {
            i.esq = removerFolhas(i.esq);
            i.dir = removerFolhas(i.dir);
         }
      }
      return i;
   }
   // Theta(n). So remove as folhas da arvore original: quem vira folha depois nao e removido,
   // porque cada no e testado ANTES de os filhos serem removidos.
   // ================================================================
}

public class Q2_RemoverFolhasJava {
   static int falhas = 0;
   static void checar(boolean ok, String desc) { System.out.println((ok ? "OK    " : "FALHA ") + desc); if (!ok) falhas++; }

   public static void main(String[] args) {
      ArvoreBinaria a = new ArvoreBinaria();
      a.removerFolhas();
      checar(a.raiz == null, "arvore vazia: nao quebra");
      int[] ins = {10, 5, 15, 2, 7, 20};
      for (int x : ins) a.inserir(x);
      a.removerFolhas();
      checar(a.caminharPre().equals("10 5 15"), "10 5 15 2 7 20 -> sobra 10(5, 15)");
      checar(a.raiz.esq.esq == null && a.raiz.esq.dir == null && a.raiz.dir.dir == null, "ponteiros dos pais anulados");
      a.removerFolhas();
      checar(a.caminharPre().equals("10"), "segunda chamada remove 5 e 15 (as novas folhas)");
      a.removerFolhas();
      checar(a.raiz == null, "so a raiz: a raiz e folha e sai (raiz = null)");
      ArvoreBinaria d = new ArvoreBinaria();
      for (int x = 1; x <= 4; x++) d.inserir(x);
      d.removerFolhas();
      checar(d.caminharPre().equals("1 2 3"), "degenerada 1 2 3 4 -> remove so o 4");
      System.out.println(falhas == 0 ? "TODOS OK" : falhas + " FALHA(S)");
   }
}
