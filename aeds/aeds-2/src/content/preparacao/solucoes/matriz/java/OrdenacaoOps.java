import java.util.Arrays;
import java.util.Random;

/**
 * Matriz de operacoes - ORDENACAO (Java). Exercicios O1..O8.
 * Quick, Merge e Heap completos (codigo da disciplina), intercalacao de vetores (P2-A Q3) e
 * ordenacao de registros com varios criterios. As parciais estao em codigo-base/ (testadas).
 */
public class OrdenacaoOps {
   static int[] array;
   static void swap(int i, int j) { int t = array[i]; array[i] = array[j]; array[j] = t; }

   /** O1 Quicksort (pivo no meio) */
   static void quicksort(int esq, int dir) {
      int i = esq, j = dir, pivo = array[(esq + dir) / 2];
      while (i <= j) { while (array[i] < pivo) i++; while (array[j] > pivo) j--; if (i <= j) { swap(i, j); i++; j--; } }
      if (esq < j) quicksort(esq, j);
      if (i < dir) quicksort(i, dir);
   }
   /** O2 Mergesort com intercalar (sentinela) */
   static void mergesort(int esq, int dir) { if (esq < dir) { int meio = (esq + dir) / 2; mergesort(esq, meio); mergesort(meio + 1, dir); intercalar(esq, meio, dir); } }
   static void intercalar(int esq, int meio, int dir) {
      int n1 = meio - esq + 1, n2 = dir - meio, i, j, k;
      int[] a1 = new int[n1 + 1], a2 = new int[n2 + 1];
      for (i = 0; i < n1; i++) a1[i] = array[esq + i];
      for (j = 0; j < n2; j++) a2[j] = array[meio + j + 1];
      a1[i] = a2[j] = 0x7FFFFFFF;
      for (i = j = 0, k = esq; k <= dir; k++) array[k] = (a1[i] <= a2[j]) ? a1[i++] : a2[j++];
   }
   /** O3 Heapsort (indice 1) */
   static void heapsort(int n) {
      int[] tmp = new int[n + 1]; for (int i = 0; i < n; i++) tmp[i + 1] = array[i]; array = tmp;
      for (int tam = 2; tam <= n; tam++) construir(tam);
      int tam = n; while (tam > 1) { swap(1, tam--); reconstruir(tam); }
      tmp = array; array = new int[n]; for (int i = 0; i < n; i++) array[i] = tmp[i + 1];
   }
   static void construir(int tam) { for (int i = tam; i > 1 && array[i] > array[i / 2]; i /= 2) swap(i, i / 2); }
   static void reconstruir(int tam) { int i = 1; while (i <= tam / 2) { int f = (2 * i == tam || array[2 * i] > array[2 * i + 1]) ? 2 * i : 2 * i + 1; if (array[i] < array[f]) { swap(i, f); i = f; } else i = tam; } }

   /** O4 (P2-A Q3) vetA e vetB DECRESCENTES -> vetor CRESCENTE em O(m + n): intercalar de tras para frente */
   static int[] vetorOrdenado(int[] vetA, int[] vetB) {
      int m = vetA.length, n = vetB.length;
      int[] resp = new int[m + n];
      int i = m - 1, j = n - 1, k = 0;                 // os menores estao no FIM de cada vetor
      while (i >= 0 && j >= 0) resp[k++] = (vetA[i] <= vetB[j]) ? vetA[i--] : vetB[j--];
      while (i >= 0) resp[k++] = vetA[i--];
      while (j >= 0) resp[k++] = vetB[j--];
      return resp;
   }

   /** O5 registros com 3 criterios (nota DESC, faltas ASC, nome ASC) via Quicksort */
   static class Aluno { int nota, faltas; String nome; Aluno(int a, int b, String c) { nota = a; faltas = b; nome = c; } }
   static int comparar(Aluno a, Aluno b) { int r = b.nota - a.nota; if (r == 0) r = a.faltas - b.faltas; if (r == 0) r = a.nome.compareTo(b.nome); return r; }
   static void quickAlunos(Aluno[] v, int esq, int dir) {
      int i = esq, j = dir; Aluno p = v[(esq + dir) / 2];
      while (i <= j) { while (comparar(v[i], p) < 0) i++; while (comparar(v[j], p) > 0) j--; if (i <= j) { Aluno t = v[i]; v[i] = v[j]; v[j] = t; i++; j--; } }
      if (esq < j) quickAlunos(v, esq, j);
      if (i < dir) quickAlunos(v, i, dir);
   }

   static int falhas = 0;
   static void checar(boolean ok, String d) { System.out.println((ok ? "OK    " : "FALHA ") + d); if (!ok) falhas++; }

   public static void main(String[] args) {
      Random r = new Random(5);
      boolean q = true, mg = true, h = true;
      for (int c = 0; c < 1500; c++) {
         int n = 1 + r.nextInt(60); int[] base = new int[n];
         for (int i = 0; i < n; i++) base[i] = r.nextInt(c % 2 == 0 ? 10 : 10000);
         int[] esp = base.clone(); Arrays.sort(esp);
         array = base.clone(); quicksort(0, n - 1); q &= Arrays.equals(array, esp);
         array = base.clone(); mergesort(0, n - 1); mg &= Arrays.equals(array, esp);
         array = base.clone(); heapsort(n); h &= Arrays.equals(array, esp);
      }
      checar(q, "O1 Quicksort: 1500 vetores aleatorios");
      checar(mg, "O2 Mergesort: 1500 vetores aleatorios");
      checar(h, "O3 Heapsort: 1500 vetores aleatorios");
      checar(Arrays.toString(vetorOrdenado(new int[]{46, 38, 22, 10}, new int[]{57, 33, 21})).equals("[10, 21, 22, 33, 38, 46, 57]"), "O4 vetorOrdenado (exemplo da P2-A)");
      checar(vetorOrdenado(new int[]{}, new int[]{3, 1}).length == 2 && vetorOrdenado(new int[]{}, new int[]{3, 1})[0] == 1, "O4 com um vetor vazio");
      Aluno[] v = { new Aluno(85, 3, "Ana"), new Aluno(92, 5, "Bruno"), new Aluno(92, 2, "Carlos"), new Aluno(92, 2, "Bia") };
      quickAlunos(v, 0, 3);
      checar(v[0].nome.equals("Bia") && v[1].nome.equals("Carlos") && v[2].nome.equals("Bruno") && v[3].nome.equals("Ana"), "O5 tres criterios de desempate");
      System.out.println(falhas == 0 ? "TODOS OK" : falhas + " FALHA(S)");
   }
}
