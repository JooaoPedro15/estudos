import java.util.Arrays;
import java.util.Random;

/**
 * Tarde-media Q2: TreeSort. Insere todos numa ABP (repetidos vao para a DIREITA)
 * e o caminhamento CENTRAL preenche o array em ordem.
 */
class No {
   int elemento; No esq, dir;
   No(int x) { elemento = x; }
}

class TreeSort {
   private No raiz;
   private int n;
   long comparacoes;                      // para conferir a analise

   // ===================== RESPOSTA DA QUESTAO =====================
   public int[] sort(int[] array) {
      raiz = null;
      for (int i = 0; i < array.length; i++) {
         raiz = inserir(array[i], raiz);
      }
      int[] resp = new int[array.length];
      n = 0;
      central(raiz, resp);
      return resp;
   }

   private No inserir(int x, No i) {
      if (i == null) {
         i = new No(x);
      } else {
         comparacoes++;
         if (x < i.elemento) {
            i.esq = inserir(x, i.esq);
         } else {                          // x >= i.elemento: repetido vai para a direita (nao perde elementos)
            i.dir = inserir(x, i.dir);
         }
      }
      return i;
   }

   private void central(No i, int[] resp) {
      if (i != null) {
         central(i.esq, resp);
         resp[n++] = i.elemento;
         central(i.dir, resp);
      }
   }
   // Cada elemento e comparado com todos os seus ancestrais.
   // Pior caso (array ordenado ou decrescente): 0 + 1 + ... + (n-1) = n(n-1)/2 -> Theta(n^2).
   // Melhor caso (arvore balanceada): Theta(n lg n). Caminhamento: Theta(n).
   // ================================================================
}

public class Q2_TreeSort {
   static int falhas = 0;
   public static void main(String[] args) {
      Random r = new Random(11);
      TreeSort t = new TreeSort();
      for (int c = 0; c < 2000; c++) {
         int n = r.nextInt(40);
         int[] v = new int[n];
         for (int i = 0; i < n; i++) v[i] = r.nextInt(8);       // muitos repetidos
         int[] esp = v.clone(); Arrays.sort(esp);
         if (!Arrays.equals(t.sort(v), esp)) { falhas++; System.out.println("FALHA " + Arrays.toString(v)); }
      }
      int[] ord = new int[100];
      for (int i = 0; i < 100; i++) ord[i] = i;
      t.comparacoes = 0; t.sort(ord);
      if (t.comparacoes != 100L * 99 / 2) { falhas++; System.out.println("FALHA pior caso"); }
      System.out.println("2000 casos aleatorios (inclui vazio e repetidos); pior caso ordenado = n(n-1)/2 = " + t.comparacoes + " comparacoes");
      System.out.println(falhas == 0 ? "TODOS OK" : falhas + " FALHA(S)");
   }
}
