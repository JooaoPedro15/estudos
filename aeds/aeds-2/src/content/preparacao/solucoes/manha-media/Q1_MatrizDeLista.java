/**
 * Exercício Q1: matriz flexivel em que cada celula aponta para uma lista COM cabeca.
 * inserir(i, j, x): vai ate a celula (i, j) e insere no fim da lista.
 * pesquisar(x): varre toda a matriz e, em cada celula, a sua lista; para ao achar.
 */
class CelulaLista {
   int elemento; CelulaLista prox;
   CelulaLista(int x) { elemento = x; prox = null; }
}

class CelulaMat {
   CelulaMat esq, dir, inf, sup; CelulaLista primeiro, ultimo;
   CelulaMat() { primeiro = ultimo = new CelulaLista(-1); }        // cabeca
}

class MatrizDeLista {
   CelulaMat inicio; int linhas, colunas;

   /** Constroi a malha l x c ligando esq/dir/inf/sup (apoio para os testes). */
   MatrizDeLista(int l, int c) {
      linhas = l; colunas = c;
      CelulaMat linhaAcima = null;
      for (int i = 0; i < l; i++) {
         CelulaMat anterior = null, primeiraDaLinha = null, acima = linhaAcima;
         for (int j = 0; j < c; j++) {
            CelulaMat nova = new CelulaMat();
            if (anterior != null) { anterior.dir = nova; nova.esq = anterior; }
            if (acima != null) { acima.inf = nova; nova.sup = acima; acima = acima.dir; }
            if (j == 0) primeiraDaLinha = nova;
            anterior = nova;
         }
         if (i == 0) inicio = primeiraDaLinha;
         linhaAcima = primeiraDaLinha;
      }
   }

   // ===================== RESPOSTA DA QUESTAO =====================
   /** Insere x no fim da lista da celula (i, j). Pre-condicao: indices validos. */
   public void inserir(int i, int j, int x) throws Exception {
      if (i < 0 || i >= linhas || j < 0 || j >= colunas) {
         throw new Exception("Indices invalidos!");
      }
      CelulaMat celula = inicio;
      for (int ii = 0; ii < i; ii++) {          // desce i linhas
         celula = celula.inf;
      }
      for (int jj = 0; jj < j; jj++) {          // anda j colunas
         celula = celula.dir;
      }
      celula.ultimo.prox = new CelulaLista(x);   // fim da lista: Theta(1) com ultimo
      celula.ultimo = celula.ultimo.prox;
   }

   /** true se x esta em alguma lista da matriz. */
   public boolean pesquisar(int x) {
      boolean resp = false;
      for (CelulaMat linha = inicio; linha != null && !resp; linha = linha.inf) {
         for (CelulaMat c = linha; c != null && !resp; c = c.dir) {
            resp = pesquisarLista(c, x);
         }
      }
      return resp;
   }

   private boolean pesquisarLista(CelulaMat c, int x) {
      boolean resp = false;
      for (CelulaLista i = c.primeiro.prox; i != null && !resp; i = i.prox) {
         resp = (i.elemento == x);
      }
      return resp;
   }
   // inserir: Theta(i + j) para chegar (pior Theta(l + c)) + Theta(1) para inserir
   // pesquisar: melhor Theta(1); pior Theta(l * c + n) (visita todas as celulas e todos os elementos)
   // ================================================================
}

public class Q1_MatrizDeLista {
   static int falhas = 0;
   static void checar(boolean ok, String desc) { System.out.println((ok ? "OK    " : "FALHA ") + desc); if (!ok) falhas++; }

   public static void main(String[] args) throws Exception {
      MatrizDeLista m = new MatrizDeLista(3, 3);
      checar(!m.pesquisar(5), "matriz com listas vazias -> false");
      m.inserir(0, 0, 5); m.inserir(1, 2, 8); m.inserir(1, 2, 13); m.inserir(2, 2, 0);
      checar(m.pesquisar(5), "acha na celula (0,0)");
      checar(m.pesquisar(13), "acha no fim da lista de (1,2)");
      checar(m.pesquisar(0), "acha na ultima celula (2,2)");
      checar(!m.pesquisar(42), "nao acha 42");
      CelulaMat a12 = m.inicio.inf.dir.dir;
      checar(a12.primeiro.prox.elemento == 8 && a12.ultimo.elemento == 13, "lista de (1,2) = 8 -> 13 e ultimo correto");
      boolean lancou = false;
      try { m.inserir(3, 0, 1); } catch (Exception e) { lancou = true; }
      checar(lancou, "indice invalido lanca excecao");
      MatrizDeLista um = new MatrizDeLista(1, 1);
      um.inserir(0, 0, 7);
      checar(um.pesquisar(7) && !um.pesquisar(8), "matriz 1x1");
      System.out.println(falhas == 0 ? "TODOS OK" : falhas + " FALHA(S)");
   }
}
