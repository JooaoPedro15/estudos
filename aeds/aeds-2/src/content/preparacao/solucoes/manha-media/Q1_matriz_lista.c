/* Manha-media Q1 (versao C): matriz flexivel em que cada celula aponta para uma lista COM cabeca.
   inserir(i, j, x): vai ate a celula (i, j) e insere no fim da lista; pesquisar(x): para ao achar.
   A versao Java esta em Q1_MatrizDeLista.java. */
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct CelulaLista { int elemento; struct CelulaLista* prox; } CelulaLista;
typedef struct CelulaMat {
   struct CelulaMat *esq, *dir, *inf, *sup;
   CelulaLista *primeiro, *ultimo;
} CelulaMat;
typedef struct MatrizDeLista { CelulaMat* inicio; int linhas, colunas; } MatrizDeLista;

CelulaLista* novaCelulaLista(int x) {
   CelulaLista* nova = (CelulaLista*) malloc(sizeof(CelulaLista));
   nova->elemento = x; nova->prox = NULL;
   return nova;
}
CelulaMat* novaCelulaMat() {
   CelulaMat* nova = (CelulaMat*) malloc(sizeof(CelulaMat));
   nova->esq = nova->dir = nova->inf = nova->sup = NULL;
   nova->primeiro = nova->ultimo = novaCelulaLista(-1);      /* cabeca */
   return nova;
}
/* Apoio para os testes: monta a malha l x c ligando esq/dir/inf/sup. */
MatrizDeLista* novaMatriz(int l, int c) {
   MatrizDeLista* m = (MatrizDeLista*) malloc(sizeof(MatrizDeLista));
   m->linhas = l; m->colunas = c; m->inicio = NULL;
   CelulaMat* linhaAcima = NULL;
   for (int i = 0; i < l; i++) {
      CelulaMat *anterior = NULL, *primeiraDaLinha = NULL, *acima = linhaAcima;
      for (int j = 0; j < c; j++) {
         CelulaMat* nova = novaCelulaMat();
         if (anterior != NULL) { anterior->dir = nova; nova->esq = anterior; }
         if (acima != NULL) { acima->inf = nova; nova->sup = acima; acima = acima->dir; }
         if (j == 0) primeiraDaLinha = nova;
         anterior = nova;
      }
      if (i == 0) m->inicio = primeiraDaLinha;
      linhaAcima = primeiraDaLinha;
   }
   return m;
}

/* ===================== RESPOSTA DA QUESTAO ===================== */
/* Retorna 0 se (i, j) for invalido (em C nao ha excecao), 1 se inseriu. */
int inserir(MatrizDeLista* m, int i, int j, int x) {
   int resp = 0;
   if (i >= 0 && i < m->linhas && j >= 0 && j < m->colunas) {
      CelulaMat* celula = m->inicio;
      for (int ii = 0; ii < i; ii++) celula = celula->inf;     /* desce i linhas */
      for (int jj = 0; jj < j; jj++) celula = celula->dir;     /* anda j colunas */
      celula->ultimo->prox = novaCelulaLista(x);                /* fim: Theta(1) com ultimo */
      celula->ultimo = celula->ultimo->prox;
      resp = 1;
   }
   return resp;
}

bool pesquisarLista(CelulaMat* c, int x) {
   bool resp = false;
   for (CelulaLista* i = c->primeiro->prox; i != NULL && !resp; i = i->prox) {   /* pula a cabeca */
      resp = (i->elemento == x);
   }
   return resp;
}

bool pesquisar(MatrizDeLista* m, int x) {
   bool resp = false;
   for (CelulaMat* linha = m->inicio; linha != NULL && !resp; linha = linha->inf) {
      for (CelulaMat* c = linha; c != NULL && !resp; c = c->dir) {
         resp = pesquisarLista(c, x);
      }
   }
   return resp;
}
/* inserir: Theta(i + j) para chegar (pior Theta(l + c)) + Theta(1) para inserir.
   pesquisar: melhor Theta(1); pior Theta(l * c + n). */
/* =============================================================== */

void liberarMatriz(MatrizDeLista* m) {
   CelulaMat* linha = m->inicio;
   while (linha != NULL) {
      CelulaMat* proxLinha = linha->inf;
      CelulaMat* c = linha;
      while (c != NULL) {
         CelulaMat* proxC = c->dir;
         CelulaLista* i = c->primeiro;
         while (i != NULL) { CelulaLista* p = i->prox; free(i); i = p; }
         free(c);
         c = proxC;
      }
      linha = proxLinha;
   }
   free(m);
}

int falhas = 0;
void checar(bool ok, const char* d) { printf("%s %s\n", ok ? "OK   " : "FALHA", d); if (!ok) falhas++; }

int main(void) {
   MatrizDeLista* m = novaMatriz(3, 3);
   checar(!pesquisar(m, 5), "matriz com listas vazias -> false");
   inserir(m, 0, 0, 5); inserir(m, 1, 2, 8); inserir(m, 1, 2, 13); inserir(m, 2, 2, 0);
   checar(pesquisar(m, 5), "acha na celula (0,0)");
   checar(pesquisar(m, 13), "acha no fim da lista de (1,2)");
   checar(pesquisar(m, 0), "acha na ultima celula (2,2)");
   checar(!pesquisar(m, 42), "nao acha 42");
   CelulaMat* a12 = m->inicio->inf->dir->dir;
   checar(a12->primeiro->prox->elemento == 8 && a12->ultimo->elemento == 13, "lista de (1,2) = 8 -> 13 e ultimo correto");
   checar(inserir(m, 3, 0, 1) == 0 && inserir(m, 0, -1, 1) == 0, "indice invalido -> 0");
   liberarMatriz(m);
   MatrizDeLista* um = novaMatriz(1, 1);
   inserir(um, 0, 0, 7);
   checar(pesquisar(um, 7) && !pesquisar(um, 8), "matriz 1x1");
   liberarMatriz(um);
   printf(falhas == 0 ? "TODOS OK\n" : "%d FALHA(S)\n", falhas);
   return falhas;
}
