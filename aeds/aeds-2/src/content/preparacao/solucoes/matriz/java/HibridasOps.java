/**
 * Matriz de operacoes - ESTRUTURAS HIBRIDAS (Java). Exercicios H1..H14.
 *  - Agenda (arvore de listas), Arvore de arvores (P2-A Q2), Matriz de listas, Lista de pilhas (P2-A Q1).
 */
class Contato { String nome; int cpf; Contato(String n, int c) { nome = n; cpf = c; } }
class CelulaC { Contato contato; CelulaC prox; CelulaC(Contato c) { contato = c; } }
class NoL { char letra; NoL esq, dir; CelulaC primeiro, ultimo; NoL(char c) { letra = c; primeiro = ultimo = new CelulaC(null); } }

class Agenda {
   NoL raiz;
   /** H1 inserir com pre-condicao (no existe), senao excecao */
   void inserirComPre(Contato c) throws Exception { NoL no = pesq(c.nome.charAt(0), raiz); if (no == null) throw new Exception("No inexistente!"); fim(no, c); }
   /** H2 inserir sem pre-condicao (cria o no) */ void inserir(Contato c) { raiz = ins(c, raiz); }
   private NoL ins(Contato c, NoL i) { char l = c.nome.charAt(0); if (i == null) { i = new NoL(l); fim(i, c); } else if (l == i.letra) fim(i, c); else if (l < i.letra) i.esq = ins(c, i.esq); else i.dir = ins(c, i.dir); return i; }
   void criarLetra(char l) { raiz = criar(l, raiz); }
   private NoL criar(char l, NoL i) { if (i == null) i = new NoL(l); else if (l < i.letra) i.esq = criar(l, i.esq); else if (l > i.letra) i.dir = criar(l, i.dir); return i; }
   private void fim(NoL no, Contato c) { no.ultimo.prox = new CelulaC(c); no.ultimo = no.ultimo.prox; }
   NoL pesq(char l, NoL i) { return (i == null || i.letra == l) ? i : pesq(l, l < i.letra ? i.esq : i.dir); }
   /** H3 pesquisar por nome (chave): 2 pesquisas */ Contato pesquisarNome(String nome) { Contato r = null; NoL no = pesq(nome.charAt(0), raiz); if (no != null) for (CelulaC c = no.primeiro.prox; c != null && r == null; c = c.prox) if (c.contato.nome.equals(nome)) r = c.contato; return r; }
   /** H4 contar todos os contatos (caminhar tudo) */ int total(NoL i) { int r = 0; if (i != null) { for (CelulaC c = i.primeiro.prox; c != null; c = c.prox) r++; r += total(i.esq) + total(i.dir); } return r; }
   /** H5 mostrar em ordem alfabetica de letra: central + lista */ String mostrar(NoL i) { String s = ""; if (i != null) { s += mostrar(i.esq); for (CelulaC c = i.primeiro.prox; c != null; c = c.prox) s += c.contato.nome + " "; s += mostrar(i.dir); } return s; }
}

class No2 { String palavra; No2 esq, dir; No2(String p) { palavra = p; } }
class NoA { char letra; NoA esq, dir; No2 raiz; NoA(char c) { letra = c; } }

class ArvoreArvore {
   NoA raiz;
   /** H6 inserir palavra (cria o no da letra se preciso) */ void inserir(String p) { raiz = ins1(p, raiz); }
   private NoA ins1(String p, NoA i) { char l = p.charAt(0); if (i == null) { i = new NoA(l); i.raiz = ins2(p, null); } else if (l == i.letra) i.raiz = ins2(p, i.raiz); else if (l < i.letra) i.esq = ins1(p, i.esq); else i.dir = ins1(p, i.dir); return i; }
   private No2 ins2(String p, No2 i) { if (i == null) i = new No2(p); else if (p.compareTo(i.palavra) < 0) i.esq = ins2(p, i.esq); else if (p.compareTo(i.palavra) > 0) i.dir = ins2(p, i.dir); return i; }
   /** H7 pesquisar: Theta(lg 26 + lg m) se balanceadas */ boolean pesquisar(String p) { NoA i = raiz; while (i != null && i.letra != p.charAt(0)) i = p.charAt(0) < i.letra ? i.esq : i.dir; boolean r = false; No2 j = (i == null) ? null : i.raiz; while (j != null && !r) { int c = p.compareTo(j.palavra); if (c == 0) r = true; else j = c < 0 ? j.esq : j.dir; } return r; }
   /** H8 (P2-A Q2) contar palavras com a mesma letra inicial E o mesmo tamanho de padrao */
   int contarPalavras(String padrao) { NoA i = raiz; while (i != null && i.letra != padrao.charAt(0)) i = padrao.charAt(0) < i.letra ? i.esq : i.dir; return (i == null) ? 0 : contarTam(i.raiz, padrao.length()); }
   private int contarTam(No2 i, int tam) { return i == null ? 0 : (i.palavra.length() == tam ? 1 : 0) + contarTam(i.esq, tam) + contarTam(i.dir, tam); }
   /** H9 (slide T6 Ex.2) existe String de tamanho 10 que comeca com c? */ boolean hasStringTam10(char c) { NoA i = raiz; while (i != null && i.letra != c) i = c < i.letra ? i.esq : i.dir; return i != null && contarTam(i.raiz, 10) > 0; }
}

class CelulaLista { int elemento; CelulaLista prox; CelulaLista(int x) { elemento = x; } }
class CelulaMat { CelulaMat esq, dir, inf, sup; CelulaLista primeiro, ultimo; CelulaMat() { primeiro = ultimo = new CelulaLista(-1); } }

class MatrizDeLista {
   CelulaMat inicio; int linhas, colunas;
   MatrizDeLista(int l, int c) {
      linhas = l; colunas = c; CelulaMat acimaL = null;
      for (int i = 0; i < l; i++) { CelulaMat ant = null, prim = null, ac = acimaL;
         for (int j = 0; j < c; j++) { CelulaMat n = new CelulaMat(); if (ant != null) { ant.dir = n; n.esq = ant; } if (ac != null) { ac.inf = n; n.sup = ac; ac = ac.dir; } if (j == 0) prim = n; ant = n; }
         if (i == 0) inicio = prim; acimaL = prim; }
   }
   CelulaMat celula(int i, int j) { CelulaMat c = inicio; for (int a = 0; a < i; a++) c = c.inf; for (int b = 0; b < j; b++) c = c.dir; return c; }
   /** H10 */ void inserir(int i, int j, int x) { CelulaMat c = celula(i, j); c.ultimo.prox = new CelulaLista(x); c.ultimo = c.ultimo.prox; }
   /** H11 pesquisar na celula (i, j): Theta(i + j + n_ij) */ boolean pesquisar(int i, int j, int x) { boolean r = false; for (CelulaLista k = celula(i, j).primeiro.prox; k != null && !r; k = k.prox) r = k.elemento == x; return r; }
   /** H12 total de elementos: Theta(l*c + n) */ int total() { int r = 0; for (CelulaMat l = inicio; l != null; l = l.inf) for (CelulaMat c = l; c != null; c = c.dir) for (CelulaLista k = c.primeiro.prox; k != null; k = k.prox) r++; return r; }
}

class CelulaPilha { int elemento; CelulaPilha prox; CelulaPilha(int x) { elemento = x; } }
class CelulaListaP { CelulaPilha topo; CelulaListaP prox; }
class ListaDePilhas {
   CelulaListaP inicio, fim;   // sem cabeca (como na P2-A)
   void novaPilha(int... elementos) { CelulaListaP c = new CelulaListaP(); for (int x : elementos) { CelulaPilha p = new CelulaPilha(x); p.prox = c.topo; c.topo = p; } if (inicio == null) inicio = fim = c; else { fim.prox = c; fim = c; } }
   /** H13 (P2-A Q1) celula da lista cuja pilha tem mais elementos; em empate, a primeira */
   CelulaListaP maiorPilha() {
      CelulaListaP resp = null; int maior = -1;
      for (CelulaListaP i = inicio; i != null; i = i.prox) {
         int tam = 0;
         for (CelulaPilha p = i.topo; p != null; p = p.prox) tam++;
         if (tam > maior) { maior = tam; resp = i; }          // '>' estrito: empate mantem a primeira
      }
      return resp;
   }
}

public class HibridasOps {
   static int falhas = 0;
   static void checar(boolean ok, String d) { System.out.println((ok ? "OK    " : "FALHA ") + d); if (!ok) falhas++; }

   public static void main(String[] args) throws Exception {
      Agenda ag = new Agenda();
      checar(ag.total(ag.raiz) == 0 && ag.pesquisarNome("Ana") == null, "H agenda vazia");
      for (char c : new char[]{'M', 'F', 'T', 'C'}) ag.criarLetra(c);
      ag.inserirComPre(new Contato("Maria", 1)); ag.inserirComPre(new Contato("Tania", 2)); ag.inserirComPre(new Contato("Caio", 3));
      boolean lancou = false; try { ag.inserirComPre(new Contato("Wagner", 4)); } catch (Exception e) { lancou = true; }
      checar(lancou, "H1 pre-condicao violada -> excecao");
      ag.inserir(new Contato("Wagner", 4)); ag.inserir(new Contato("Teo", 5));
      checar(ag.pesquisarNome("Teo").cpf == 5 && ag.pesquisarNome("Tiago") == null, "H2/H3 inserir sem pre-condicao + pesquisar nome");
      checar(ag.total(ag.raiz) == 5 && ag.mostrar(ag.raiz).trim().equals("Caio Maria Tania Teo Wagner"), "H4/H5 total e mostrar em ordem de letra");
      ArvoreArvore aa = new ArvoreArvore();
      for (String p : new String[]{"PROVA", "PILHA", "PONTO", "PAI", "MESA", "PARALELISMO", "PROGRAMADO"}) aa.inserir(p);
      checar(aa.contarPalavras("PRATO") == 3 && aa.contarPalavras("ZEBRA") == 0 && aa.contarPalavras("MOLA") == 1, "H8 contarPalavras (letra + tamanho) - P2-A Q2");
      checar(aa.pesquisar("PONTO") && !aa.pesquisar("PONTA") && aa.hasStringTam10('P') && !aa.hasStringTam10('M'), "H7/H9 pesquisar e hasStringTam10");
      MatrizDeLista m = new MatrizDeLista(2, 3);
      m.inserir(0, 0, 5); m.inserir(1, 2, 8); m.inserir(1, 2, 13);
      checar(m.pesquisar(1, 2, 13) && !m.pesquisar(0, 0, 13) && m.total() == 3, "H10-H12 matriz de listas");
      ListaDePilhas lp = new ListaDePilhas();
      checar(lp.maiorPilha() == null, "H13 lista de pilhas vazia -> null");
      lp.novaPilha(1, 2); lp.novaPilha(1, 2, 3); lp.novaPilha(4, 5, 6); lp.novaPilha();
      checar(lp.maiorPilha() == lp.inicio.prox, "H13 maiorPilha: empate de 3 -> a primeira (2a celula)");
      System.out.println(falhas == 0 ? "TODOS OK" : falhas + " FALHA(S)");
   }
}
