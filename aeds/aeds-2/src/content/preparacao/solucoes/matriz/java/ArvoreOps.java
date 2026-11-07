import java.util.Arrays;

/**
 * Matriz de operacoes - ARVORE BINARIA DE PESQUISA (Java). Exercicios A1..A22 (sem remocao generica).
 * Padrao: metodo publico chama privado recursivo; retorno unico em resp.
 */
class No { int elemento, quantidade = 1; No esq, dir; No(int x) { elemento = x; } }

class Arvore {
   No raiz;
   /** A1 */ void inserir(int x) throws Exception { raiz = inserir(x, raiz); }
   private No inserir(int x, No i) throws Exception {
      if (i == null) i = new No(x);
      else if (x < i.elemento) i.esq = inserir(x, i.esq);
      else if (x > i.elemento) i.dir = inserir(x, i.dir);
      else throw new Exception("Erro ao inserir!");
      return i;
   }
   /** A2 (P2-B Q2) repetido incrementa o contador */ void inserirContando(int x) { raiz = inserirContando(x, raiz); }
   private No inserirContando(int x, No i) {
      if (i == null) i = new No(x);
      else if (x < i.elemento) i.esq = inserirContando(x, i.esq);
      else if (x > i.elemento) i.dir = inserirContando(x, i.dir);
      else i.quantidade++;
      return i;
   }
   /** A3 */ boolean pesquisar(int x) { No i = raiz; boolean resp = false; while (i != null && !resp) { if (x == i.elemento) resp = true; else i = (x < i.elemento) ? i.esq : i.dir; } return resp; }
   /** A4 */ String pre() { return pre(raiz).trim(); }      String pre(No i) { return i == null ? "" : i.elemento + " " + pre(i.esq) + pre(i.dir); }
   /** A5 */ String central() { return central(raiz).trim(); } String central(No i) { return i == null ? "" : central(i.esq) + i.elemento + " " + central(i.dir); }
   /** A6 */ String pos() { return pos(raiz).trim(); }      String pos(No i) { return i == null ? "" : pos(i.esq) + pos(i.dir) + i.elemento + " "; }
   /** A7 */ int contarNos(No i) { return i == null ? 0 : 1 + contarNos(i.esq) + contarNos(i.dir); }
   /** A8 */ int folhas(No i) { int r = 0; if (i != null) r = (i.esq == null && i.dir == null) ? 1 : folhas(i.esq) + folhas(i.dir); return r; }
   /** A9 */ int internos(No i) { int r = 0; if (i != null && (i.esq != null || i.dir != null)) r = 1 + internos(i.esq) + internos(i.dir); return r; }
   /** A10 */ int umFilho(No i) { int r = 0; if (i != null) r = (((i.esq == null) != (i.dir == null)) ? 1 : 0) + umFilho(i.esq) + umFilho(i.dir); return r; }
   /** A11 */ int doisFilhos(No i) { int r = 0; if (i != null) r = ((i.esq != null && i.dir != null) ? 1 : 0) + doisFilhos(i.esq) + doisFilhos(i.dir); return r; }
   /** A12 */ int soma(No i) { return i == null ? 0 : i.elemento + soma(i.esq) + soma(i.dir); }
   /** A13 vazia = -1 */ int altura(No i) { int r = -1; if (i != null) r = 1 + Math.max(altura(i.esq), altura(i.dir)); return r; }
   /** A14 pre: nao vazia */ int maior() { No i = raiz; while (i.dir != null) i = i.dir; return i.elemento; }
   /** A15 pre: nao vazia */ int menor() { No i = raiz; while (i.esq != null) i = i.esq; return i.elemento; }
   /** A16 nivel/profundidade de x (raiz = 0; -1 se ausente) */ int nivel(int x) { int n = 0, r = -1; No i = raiz; while (i != null && r == -1) { if (x == i.elemento) r = n; else { i = (x < i.elemento) ? i.esq : i.dir; n++; } } return r; }
   /** A17 k-esimo menor (k = 1 e o menor): central com contador */
   private int cont, kresp;
   int kEsimoMenor(int k) { cont = 0; kresp = Integer.MIN_VALUE; kEsimo(raiz, k); return kresp; }
   private void kEsimo(No i, int k) { if (i != null && cont < k) { kEsimo(i.esq, k); if (++cont == k) kresp = i.elemento; kEsimo(i.dir, k); } }
   /** A18 menor ancestral comum numa ABB (a e b presentes) */ int lca(int a, int b) { No i = raiz; while ((a < i.elemento && b < i.elemento) || (a > i.elemento && b > i.elemento)) i = (a < i.elemento) ? i.esq : i.dir; return i.elemento; }
   /** A19 */ void espelhar(No i) { if (i != null) { No t = i.esq; i.esq = i.dir; i.dir = t; espelhar(i.esq); espelhar(i.dir); } }
   /** A20 */ static boolean iguais(No a, No b) { return (a == null || b == null) ? a == b : a.elemento == b.elemento && iguais(a.esq, b.esq) && iguais(a.dir, b.dir); }
   /** A21 */ static boolean simetricas(No a, No b) { return (a == null || b == null) ? a == b : a.elemento == b.elemento && simetricas(a.esq, b.dir) && simetricas(a.dir, b.esq); }
   /** A22 eh ABB? (arvore qualquer): todo no dentro de (min, max) */ static boolean ehABB(No i, long min, long max) { return i == null || (i.elemento > min && i.elemento < max && ehABB(i.esq, min, i.elemento) && ehABB(i.dir, i.elemento, max)); }
   /** A23 remover folhas em Java: o pai recebe o retorno (nao precisa de No**) */ void removerFolhas() { raiz = removerFolhas(raiz); }
   private No removerFolhas(No i) { if (i != null) { if (i.esq == null && i.dir == null) i = null; else { i.esq = removerFolhas(i.esq); i.dir = removerFolhas(i.dir); } } return i; }
   /** A24 Max: ha algum divisivel por 11? (parada antecipada) */ boolean hasDiv11(No i) { return i != null && (i.elemento % 11 == 0 || hasDiv11(i.esq) || hasDiv11(i.dir)); }
   /** A25 arvore -> lista ordenada (central inserindo no fim) */ int[] toArray() { int[] v = new int[contarNos(raiz)]; cont = 0; encher(raiz, v); return v; }
   private void encher(No i, int[] v) { if (i != null) { encher(i.esq, v); v[cont++] = i.elemento; encher(i.dir, v); } }
}

public class ArvoreOps {
   static int falhas = 0;
   static void checar(boolean ok, String d) { System.out.println((ok ? "OK    " : "FALHA ") + d); if (!ok) falhas++; }

   public static void main(String[] args) throws Exception {
      Arvore vazia = new Arvore();
      checar(vazia.contarNos(vazia.raiz) == 0 && vazia.altura(vazia.raiz) == -1 && !vazia.pesquisar(1) && vazia.nivel(1) == -1, "arvore vazia: 0 nos, altura -1");
      Arvore so = new Arvore(); so.inserir(5);
      checar(so.altura(so.raiz) == 0 && so.folhas(so.raiz) == 1 && so.internos(so.raiz) == 0, "so raiz: altura 0, 1 folha, 0 internos");
      Arvore a = new Arvore();
      for (int x : new int[]{50, 30, 70, 20, 40, 60, 80, 35}) a.inserir(x);
      checar(a.pre().equals("50 30 20 40 35 70 60 80") && a.central().equals("20 30 35 40 50 60 70 80") && a.pos().equals("20 35 40 30 60 80 70 50"), "A4-A6 pre/central/pos");
      checar(a.contarNos(a.raiz) == 8 && a.folhas(a.raiz) == 4 && a.internos(a.raiz) == 4 && a.umFilho(a.raiz) == 1 && a.doisFilhos(a.raiz) == 3, "A7-A11 contagens (folhas = 2 filhos + 1)");
      checar(a.soma(a.raiz) == 385 && a.altura(a.raiz) == 3 && a.maior() == 80 && a.menor() == 20, "A12-A15 soma/altura/maior/menor");
      checar(a.nivel(35) == 3 && a.nivel(50) == 0 && a.nivel(99) == -1, "A16 nivel");
      checar(a.kEsimoMenor(1) == 20 && a.kEsimoMenor(4) == 40 && a.kEsimoMenor(8) == 80, "A17 k-esimo menor");
      checar(a.lca(20, 35) == 30 && a.lca(35, 60) == 50 && a.lca(60, 80) == 70, "A18 menor ancestral comum");
      checar(Arrays.toString(a.toArray()).equals("[20, 30, 35, 40, 50, 60, 70, 80]"), "A25 arvore -> vetor ordenado (base do TreeSort)");
      Arvore b = new Arvore(); for (int x : new int[]{50, 30, 70, 20, 40, 60, 80, 35}) b.inserir(x);
      checar(Arvore.iguais(a.raiz, b.raiz) && !Arvore.simetricas(a.raiz, b.raiz), "A20 iguais");
      b.espelhar(b.raiz);
      checar(Arvore.simetricas(a.raiz, b.raiz) && b.central().equals("80 70 60 50 40 35 30 20"), "A19/A21 espelhar + simetricas");
      checar(Arvore.ehABB(a.raiz, Long.MIN_VALUE, Long.MAX_VALUE) && !Arvore.ehABB(b.raiz, Long.MIN_VALUE, Long.MAX_VALUE), "A22 eh ABB (espelhada nao e)");
      checar(!a.hasDiv11(a.raiz) && a.hasDiv11(new No(22)), "A24 divisivel por 11");
      Arvore c = new Arvore(); for (int x : new int[]{5, 3, 5, 8, 5}) c.inserirContando(x);
      checar(c.raiz.quantidade == 3 && c.contarNos(c.raiz) == 3, "A2 ABP com contador de repetidos (P2-B Q2)");
      a.removerFolhas();
      checar(a.central().equals("30 40 50 70"), "A23 remover folhas da arvore original");
      boolean lancou = false; try { so.inserir(5); } catch (Exception e) { lancou = true; }
      checar(lancou, "A1 repetido lanca excecao");
      System.out.println(falhas == 0 ? "TODOS OK" : falhas + " FALHA(S)");
   }
}
