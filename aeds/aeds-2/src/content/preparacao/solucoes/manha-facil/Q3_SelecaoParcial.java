import java.util.Arrays;
import java.util.Random;

/**
 * Exercício Q3: Selecao parcial (os k menores, em ordem, em array[0..k-1]).
 * Mudanca minima: o laco externo vai ate k em vez de n - 1.
 */
class Ordenacao {
   int[] array; int n;
   long comparacoes, movimentacoes;          // instrumentacao para conferir a analise

   Ordenacao(int[] v) { array = v; n = v.length; }

   void swap(int i, int j) {
      int tmp = array[i]; array[i] = array[j]; array[j] = tmp;
      movimentacoes += 3;                      // swap = 3 movimentacoes
   }

   // ===================== RESPOSTA DA QUESTAO =====================
   void selecaoParcial(int k) {
      for (int i = 0; i < k; i++) {           // so ate k
         int menor = i;
         for (int j = i + 1; j < n; j++) {
            comparacoes++;
            if (array[menor] > array[j]) {
               menor = j;
            }
         }
         swap(menor, i);
      }
   }
   // C(n) = soma_{i=0}^{k-1} (n - i - 1) = k*n - k(k+1)/2  -> Theta(k*n)
   // M(n) = 3k                                             -> Theta(k)
}

public class Q3_SelecaoParcial {
   static int falhas = 0;
   static void checar(boolean ok, String desc) { if (!ok) { System.out.println("FALHA " + desc); falhas++; } }

   public static void main(String[] args) {
      Random r = new Random(7);
      int casos = 0;
      for (int t = 0; t < 2000; t++) {
         int n = 1 + r.nextInt(30), k = 1 + r.nextInt(n);
         int[] v = new int[n];
         for (int i = 0; i < n; i++) v[i] = r.nextInt(10);   // repetidos
         int[] esp = v.clone(); Arrays.sort(esp);
         Ordenacao o = new Ordenacao(v.clone());
         o.selecaoParcial(k);
         checar(Arrays.equals(Arrays.copyOf(o.array, k), Arrays.copyOf(esp, k)), "k menores n=" + n + " k=" + k);
         checar(o.comparacoes == (long) k * n - (long) k * (k + 1) / 2, "C(n) = kn - k(k+1)/2");
         checar(o.movimentacoes == 3L * k, "M(n) = 3k");
         casos++;
      }
      System.out.println(casos + " casos aleatorios (k menores, C(n) e M(n) conferidos)");
      System.out.println(falhas == 0 ? "TODOS OK" : falhas + " FALHA(S)");
   }
}
