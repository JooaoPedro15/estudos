/**
 * Tarde-media Q3: Agenda (arvore de listas com cabeca): remover(nome) e pesquisarPorCpf(cpf).
 */
class Contato {
   String nome; int cpf;
   Contato(String n, int c) { nome = n; cpf = c; }
}

class Celula {
   Contato contato; Celula prox;
   Celula(Contato c) { contato = c; prox = null; }
}

class No {
   char letra; No esq, dir; Celula primeiro, ultimo;
   No(char c) { letra = c; primeiro = ultimo = new Celula(null); }
}

class Agenda {
   private No raiz;

   // insercao de apoio (a do aulao: cria o no se faltar)
   public void inserir(Contato c) { raiz = inserir(c, raiz); }
   private No inserir(Contato c, No i) {
      char l = c.nome.charAt(0);
      if (i == null) { i = new No(l); inserirLista(i, c); }
      else if (l == i.letra) { inserirLista(i, c); }
      else if (l < i.letra) { i.esq = inserir(c, i.esq); }
      else { i.dir = inserir(c, i.dir); }
      return i;
   }
   private void inserirLista(No no, Contato c) { no.ultimo.prox = new Celula(c); no.ultimo = no.ultimo.prox; }

   private No pesquisarArvore(char letra, No i) {
      No resp;
      if (i == null) resp = null;
      else if (letra == i.letra) resp = i;
      else if (letra < i.letra) resp = pesquisarArvore(letra, i.esq);
      else resp = pesquisarArvore(letra, i.dir);
      return resp;
   }

   // ===================== RESPOSTA DA QUESTAO =====================
   /** Remove o contato da lista do no da letra inicial. Theta(1) para achar o no + Theta(m) na lista. */
   public boolean remover(String nome) {
      boolean resp = false;
      No no = pesquisarArvore(nome.charAt(0), raiz);
      if (no != null) {
         Celula i = no.primeiro;                                 // i para ANTES do contato
         while (i.prox != null && !i.prox.contato.nome.equals(nome)) {
            i = i.prox;
         }
         if (i.prox != null) {
            Celula tmp = i.prox;
            i.prox = tmp.prox;
            if (tmp == no.ultimo) {
               no.ultimo = i;                                    // removeu o ultimo da lista
            }
            tmp.prox = null;
            resp = true;
         }
      }
      return resp;
   }

   /** CPF nao e chave: caminha a arvore toda, parando ao achar. Pior caso Theta(n). */
   public Contato pesquisarPorCpf(int cpf) { return pesquisarPorCpf(raiz, cpf); }
   private Contato pesquisarPorCpf(No i, int cpf) {
      Contato resp = null;
      if (i != null) {
         for (Celula c = i.primeiro.prox; c != null && resp == null; c = c.prox) {   // visita o no
            if (c.contato.cpf == cpf) resp = c.contato;
         }
         if (resp == null) resp = pesquisarPorCpf(i.esq, cpf);
         if (resp == null) resp = pesquisarPorCpf(i.dir, cpf);
      }
      return resp;
   }
   // ================================================================

   String lista(char l) {
      No no = pesquisarArvore(l, raiz); String s = "";
      if (no != null) for (Celula c = no.primeiro.prox; c != null; c = c.prox) s += c.contato.nome + " ";
      return s.trim();
   }
   String ultimo(char l) { No no = pesquisarArvore(l, raiz); return (no == null || no.ultimo.contato == null) ? null : no.ultimo.contato.nome; }
}

public class Q3_AgendaRemover {
   static int falhas = 0;
   static void checar(boolean ok, String desc) { System.out.println((ok ? "OK    " : "FALHA ") + desc); if (!ok) falhas++; }

   public static void main(String[] args) {
      Agenda vazia = new Agenda();
      checar(!vazia.remover("Ana") && vazia.pesquisarPorCpf(1) == null, "agenda vazia");
      Agenda a = new Agenda();
      String[] nomes = {"Maria", "Tania", "Teo", "Tiago", "Caio", "Clara", "Wagner"};
      for (int i = 0; i < nomes.length; i++) a.inserir(new Contato(nomes[i], 100 + i));
      checar(a.remover("Teo") && a.lista('T').equals("Tania Tiago"), "remove do meio");
      checar(a.remover("Tiago") && "Tania".equals(a.ultimo('T')), "remove o ultimo -> ultimo atualizado");
      a.inserir(new Contato("Tulio", 200));
      checar(a.lista('T').equals("Tania Tulio"), "inserir no fim depois de remover o ultimo funciona");
      checar(a.remover("Caio") && a.lista('C').equals("Clara"), "remove o primeiro da lista");
      checar(!a.remover("Zeca") && !a.remover("Carla"), "inexistente (letra sem no / nome sem contato) -> false");
      checar(a.pesquisarPorCpf(106) != null && a.pesquisarPorCpf(106).nome.equals("Wagner"), "acha CPF numa subarvore");
      checar(a.pesquisarPorCpf(102) == null, "CPF de contato removido -> null");
      System.out.println(falhas == 0 ? "TODOS OK" : falhas + " FALHA(S)");
   }
}
