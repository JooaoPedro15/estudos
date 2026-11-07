/* Manha-media Q2: removerFolhas(No** i) - remove e libera as folhas da arvore ORIGINAL. */
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct No { int elemento; struct No *esq, *dir; } No;
No* raiz;

No* novoNo(int elemento) {
   No* novo = (No*) malloc(sizeof(No));
   if (novo == NULL) { fprintf(stderr, "Sem memoria\n"); exit(1); }
   novo->elemento = elemento; novo->esq = novo->dir = NULL;
   return novo;
}
void inserirRec(int x, No** i) {
   if (*i == NULL) { *i = novoNo(x); }
   else if (x < (*i)->elemento) { inserirRec(x, &((*i)->esq)); }
   else if (x > (*i)->elemento) { inserirRec(x, &((*i)->dir)); }
}

/* ===================== RESPOSTA DA QUESTAO ===================== */
/* No** porque, ao achar uma folha, precisamos fazer o ponteiro DO PAI (ou a raiz) virar NULL.
   Com No* teriamos uma copia: o free aconteceria, mas o pai continuaria apontando para memoria
   liberada (ponteiro pendente). */
void removerFolhas(No** i) {
   if (*i != NULL) {
      if ((*i)->esq == NULL && (*i)->dir == NULL) {   // folha da arvore original
         free(*i);
         *i = NULL;
      } else {
         removerFolhas(&((*i)->esq));
         removerFolhas(&((*i)->dir));
      }
   }
}
/* Cada no e visitado uma vez: Theta(n). O pai que vira folha NAO e removido nesta chamada. */
/* =============================================================== */

void central(No* i, int* v, int* n) { if (i != NULL) { central(i->esq, v, n); v[(*n)++] = i->elemento; central(i->dir, v, n); } }
void liberar(No* i) { if (i != NULL) { liberar(i->esq); liberar(i->dir); free(i); } }
int falhas = 0;
void checar(bool ok, const char* d) { printf("%s %s\n", ok ? "OK   " : "FALHA", d); if (!ok) falhas++; }

int main(void) {
   raiz = NULL;
   removerFolhas(&raiz);
   checar(raiz == NULL, "arvore vazia nao quebra");

   inserirRec(42, &raiz);
   removerFolhas(&raiz);
   checar(raiz == NULL, "so raiz: a raiz e folha -> arvore fica vazia (raiz = NULL)");

   int ins[] = {10, 5, 15, 2, 7, 20};
   for (int i = 0; i < 6; i++) inserirRec(ins[i], &raiz);
   removerFolhas(&raiz);
   int v[10], n = 0;
   central(raiz, v, &n);
   checar(n == 3 && v[0] == 5 && v[1] == 10 && v[2] == 15, "10 5 15 2 7 20 -> sobram 5 10 15 (folhas 2, 7, 20 removidas)");
   checar(raiz->esq->esq == NULL && raiz->esq->dir == NULL && raiz->dir->dir == NULL, "ponteiros dos pais ficaram NULL");

   removerFolhas(&raiz);
   n = 0; central(raiz, v, &n);
   checar(n == 1 && v[0] == 10, "segunda chamada remove 5 e 15 -> sobra so 10");
   liberar(raiz);
   printf(falhas == 0 ? "TODOS OK\n" : "%d FALHA(S)\n", falhas);
   return falhas;
}
