import java.util.Arrays;
import java.util.Random;

/**
 * Manha-media Q3: Quicksort parcial (pivo no meio). Ao final, array[0..k-1] = k menores, em ordem.
 */
class Ordenacao {
   int[] array; int n;
   Ordenacao(int[] v) { array = v; n = v.length; }
   void swap(int i, int j) { int t = array[i]; array[i] = array[j]; array[j] = t; }

   // ===================== RESPOSTA DA QUESTAO =====================
   void quicksortParcial(int esq, int dir, int k) {
      int i = esq, j = dir;
      int pivo = array[(esq + dir) / 2];
      while (i <= j) {
         while (array[i] < pivo) { i++; }
         while (array[j] > pivo) { j--; }
         if (i <= j) {
            swap(i, j);
            i++;
            j--;
         }
      }
      if (esq < j) {
         quicksortParcial(esq, j, k);          // a esquerda sempre pode ter posicoes < k
      }
      if (i < k && i < dir) {                  // poda: a direita comeca em i; se i >= k, nada ali entra nos k primeiros
         quicksortParcial(i, dir, k);
      }
   }
   // Esperado: O(n + k lg k). Pior caso: Theta(n^2) (pivo sempre ruim).
   // ================================================================
}

public class Q3_QuicksortParcial {
   static int falhas = 0;
   public static void main(String[] args) {
      Random r = new Random(3);
      int casos = 0;
      for (int t = 0; t < 3000; t++) {
         int n = 1 + r.nextInt(50), k = 1 + r.nextInt(n);
         int[] v = new int[n];
         for (int i = 0; i < n; i++) v[i] = r.nextInt(t % 2 == 0 ? 10 : 1000);   // com e sem muitos repetidos
         int[] esp = v.clone(); Arrays.sort(esp);
         Ordenacao o = new Ordenacao(v.clone());
         o.quicksortParcial(0, n - 1, k);
         if (!Arrays.equals(Arrays.copyOf(o.array, k), Arrays.copyOf(esp, k))) {
            falhas++; System.out.println("FALHA n=" + n + " k=" + k + " " + Arrays.toString(v));
         }
         casos++;
      }
      int[] ord = {1, 2, 3, 4, 5, 6, 7, 8};
      Ordenacao o = new Ordenacao(ord.clone()); o.quicksortParcial(0, 7, 3);
      if (!Arrays.equals(Arrays.copyOf(o.array, 3), new int[]{1, 2, 3})) { falhas++; System.out.println("FALHA ja ordenado"); }
      System.out.println(casos + " casos aleatorios + vetor ja ordenado");
      System.out.println(falhas == 0 ? "TODOS OK" : falhas + " FALHA(S)");
   }
}
