/**
 * Matriz de operacoes - LISTA SIMPLES COM CELULA CABECA (Java). Exercicios L1..L18.
 * Todas as operacoes mantem as invariantes: primeiro = cabeca; ultimo = ultima celula (ou a cabeca se vazia).
 */
class Celula { int elemento; Celula prox; Celula() { this(0); } Celula(int x) { elemento = x; prox = null; } }

class Lista {
   Celula primeiro, ultimo;
   Lista() { primeiro = new Celula(); ultimo = primeiro; }

   /** L1 */ void inserirInicio(int x) { Celula t = new Celula(x); t.prox = primeiro.prox; primeiro.prox = t; if (primeiro == ultimo) ultimo = t; }
   /** L2 */ void inserirFim(int x) { ultimo.prox = new Celula(x); ultimo = ultimo.prox; }
   /** L3 posicao 0..tamanho */
   void inserir(int x, int pos) throws Exception {
      int tam = tamanho();
      if (pos < 0 || pos > tam) throw new Exception("Erro ao inserir!");
      Celula i = primeiro;
      for (int j = 0; j < pos; j++) i = i.prox;           // i para ANTES da posicao
      Celula t = new Celula(x); t.prox = i.prox; i.prox = t;
      if (t.prox == null) ultimo = t;
   }
   /** L4 */ void inserirOrdenado(int x) {
      Celula i = primeiro;
      while (i.prox != null && i.prox.elemento < x) i = i.prox;
      Celula t = new Celula(x); t.prox = i.prox; i.prox = t;
      if (t.prox == null) ultimo = t;
   }
   /** L5 */ int removerInicio() throws Exception {
      if (primeiro == ultimo) throw new Exception("Erro ao remover!");
      Celula t = primeiro.prox; primeiro.prox = t.prox;
      if (t == ultimo) ultimo = primeiro;
      t.prox = null; return t.elemento;
   }
   /** L6 Theta(n): precisa do anterior */ int removerFim() throws Exception {
      if (primeiro == ultimo) throw new Exception("Erro ao remover!");
      Celula i = primeiro;
      while (i.prox != ultimo) i = i.prox;
      int resp = ultimo.elemento; ultimo = i; i.prox = null; return resp;
   }
   /** L7 */ int remover(int pos) throws Exception {
      int tam = tamanho();
      if (primeiro == ultimo || pos < 0 || pos >= tam) throw new Exception("Erro ao remover!");
      Celula i = primeiro;
      for (int j = 0; j < pos; j++) i = i.prox;
      Celula t = i.prox; i.prox = t.prox;
      if (t == ultimo) ultimo = i;
      t.prox = null; return t.elemento;
   }
   /** L8 1a ocorrencia */ boolean removerValor(int x) {
      boolean resp = false; Celula i = primeiro;
      while (i.prox != null && i.prox.elemento != x) i = i.prox;
      if (i.prox != null) { Celula t = i.prox; i.prox = t.prox; if (t == ultimo) ultimo = i; t.prox = null; resp = true; }
      return resp;
   }
   /** L9 todas as ocorrencias; retorna quantas */ int removerTodas(int x) {
      int resp = 0; Celula i = primeiro;
      while (i.prox != null) {
         if (i.prox.elemento == x) { Celula t = i.prox; i.prox = t.prox; if (t == ultimo) ultimo = i; resp++; }
         else i = i.prox;                                  // so avanca se nao removeu
      }
      return resp;
   }
   /** L10 */ boolean pesquisar(int x) { boolean resp = false; for (Celula i = primeiro.prox; i != null && !resp; i = i.prox) resp = (i.elemento == x); return resp; }
   /** L11 */ int tamanho() { int resp = 0; for (Celula i = primeiro.prox; i != null; i = i.prox) resp++; return resp; }
   /** L12 */ int somar() { int resp = 0; for (Celula i = primeiro.prox; i != null; i = i.prox) resp += i.elemento; return resp; }
   /** L13 pre: nao vazia */ int maior() { int resp = primeiro.prox.elemento; for (Celula i = primeiro.prox.prox; i != null; i = i.prox) if (i.elemento > resp) resp = i.elemento; return resp; }
   /** L14 inverter religando ponteiros */ void inverter() {
      Celula ant = null, i = primeiro.prox;
      ultimo = (i == null) ? primeiro : i;
      while (i != null) { Celula p = i.prox; i.prox = ant; ant = i; i = p; }
      primeiro.prox = ant;
   }
   /** L15 intercalar duas listas ORDENADAS numa nova (merge) em Theta(n + m) */
   static Lista intercalar(Lista a, Lista b) {
      Lista r = new Lista(); Celula i = a.primeiro.prox, j = b.primeiro.prox;
      while (i != null && j != null) { if (i.elemento <= j.elemento) { r.inserirFim(i.elemento); i = i.prox; } else { r.inserirFim(j.elemento); j = j.prox; } }
      for (; i != null; i = i.prox) r.inserirFim(i.elemento);
      for (; j != null; j = j.prox) r.inserirFim(j.elemento);
      return r;
   }
   /** L16 remover repetidos de lista ORDENADA */ void removerRepetidosOrdenada() {
      for (Celula i = primeiro.prox; i != null && i.prox != null; ) {
         if (i.prox.elemento == i.elemento) { Celula t = i.prox; i.prox = t.prox; if (t == ultimo) ultimo = i; }
         else i = i.prox;
      }
   }
   /** L17 inserir uma lista de valores ANTES do valor de referencia (warm-up "Amigos"); se nao achar, no fim */
   void inserirAntes(int[] novos, int ref) {
      Celula i = primeiro;
      while (i.prox != null && i.prox.elemento != ref) i = i.prox;
      for (int x : novos) { Celula t = new Celula(x); t.prox = i.prox; i.prox = t; i = t; if (t.prox == null) ultimo = t; }
   }
   /** L18 meiose (P2-B Q1): cada celula vira duas com metade do valor */ void meiose() {
      for (Celula i = primeiro.prox; i != null; i = i.prox.prox) {   // pula a celula nova
         i.elemento = i.elemento / 2;
         Celula t = new Celula(i.elemento); t.prox = i.prox; i.prox = t;
         if (t.prox == null) ultimo = t;
      }
   }
   String str() { String s = ""; for (Celula i = primeiro.prox; i != null; i = i.prox) s += i.elemento + " "; return s.trim(); }
}

public class ListaOps {
   static int falhas = 0;
   static void checar(boolean ok, String d) { System.out.println((ok ? "OK    " : "FALHA ") + d); if (!ok) falhas++; }
   static Lista de(int... v) { Lista l = new Lista(); for (int x : v) l.inserirFim(x); return l; }
   static boolean ultimoOk(Lista l) { Celula i = l.primeiro; while (i.prox != null) i = i.prox; return i == l.ultimo; }

   public static void main(String[] args) throws Exception {
      Lista l = new Lista();
      checar(l.str().isEmpty() && l.tamanho() == 0 && ultimoOk(l), "lista vazia");
      l.inserirInicio(2); l.inserirFim(9); l.inserir(5, 1); l.inserirOrdenado(1); l.inserirOrdenado(7); l.inserirOrdenado(10);
      checar(l.str().equals("1 2 5 7 9 10") && ultimoOk(l), "L1-L4 inserir inicio/fim/pos/ordenado");
      checar(l.removerInicio() == 1 && l.removerFim() == 10 && l.remover(1) == 5 && ultimoOk(l), "L5-L7 remover inicio/fim/pos");
      checar(l.str().equals("2 7 9") && l.removerValor(9) && !l.removerValor(42) && ultimoOk(l), "L8 remover valor (inclusive o ultimo)");
      Lista t = de(3, 1, 3, 3, 2, 3);
      checar(t.removerTodas(3) == 4 && t.str().equals("1 2") && ultimoOk(t), "L9 remover todas as ocorrencias");
      checar(t.pesquisar(2) && !t.pesquisar(3) && t.somar() == 3 && de(4, 9, 1).maior() == 9, "L10-L13 pesquisar/tamanho/somar/maior");
      Lista inv = de(1, 2, 3, 4); inv.inverter(); inv.inserirFim(0);
      checar(inv.str().equals("4 3 2 1 0") && ultimoOk(inv), "L14 inverter (ultimo atualizado)");
      Lista v1 = new Lista(); v1.inverter(); checar(v1.str().isEmpty() && ultimoOk(v1), "L14 inverter vazia");
      checar(Lista.intercalar(de(1, 4, 6), de(2, 3, 7, 8)).str().equals("1 2 3 4 6 7 8"), "L15 intercalar ordenadas");
      Lista rep = de(1, 1, 2, 3, 3, 3); rep.removerRepetidosOrdenada();
      checar(rep.str().equals("1 2 3") && ultimoOk(rep), "L16 remover repetidos");
      Lista am = de(1, 2, 3, 4); am.inserirAntes(new int[]{8, 9}, 3);
      Lista am2 = de(1, 2); am2.inserirAntes(new int[]{7}, 99);
      checar(am.str().equals("1 2 8 9 3 4") && am2.str().equals("1 2 7") && ultimoOk(am2), "L17 inserir antes da referencia (Amigos)");
      Lista me = de(8, 5, 6, 1); me.meiose();
      checar(me.str().equals("4 4 2 2 3 3 0 0") && ultimoOk(me), "L18 meiose (P2-B Q1)");
      boolean lancou = false; try { new Lista().removerInicio(); } catch (Exception e) { lancou = true; }
      checar(lancou, "remover de lista vazia lanca excecao");
      System.out.println(falhas == 0 ? "TODOS OK" : falhas + " FALHA(S)");
   }
}
