/* Exercício Q2: simetricas(a, b) e clonarEspelhado(i). */
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct No { int elemento; struct No *esq, *dir; } No;

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
/* b e o espelho de a: mesmos elementos, esquerda de uma = direita da outra. */
bool simetricas(No* a, No* b) {
   bool resp;
   if (a == NULL && b == NULL) {
      resp = true;                                   // ambas acabaram juntas
   } else if (a == NULL || b == NULL) {
      resp = false;                                  // so uma acabou: formas diferentes
   } else {
      resp = (a->elemento == b->elemento)
             && simetricas(a->esq, b->dir)
             && simetricas(a->dir, b->esq);
   }
   return resp;
}

/* Nova arvore espelhada; a original nao e alterada. */
No* clonarEspelhado(No* i) {
   No* resp = NULL;
   if (i != NULL) {
      resp = novoNo(i->elemento);
      resp->esq = clonarEspelhado(i->dir);           // o que era direita vira esquerda
      resp->dir = clonarEspelhado(i->esq);
   }
   return resp;
}
/* Ambas Theta(n) (cada no visitado uma vez). simetricas(r, clonarEspelhado(r)) e sempre true
   (inducao: vale para vazia; se vale para as subarvores, vale para a raiz). */
/* =============================================================== */

void central(No* i, int* v, int* n) { if (i != NULL) { central(i->esq, v, n); v[(*n)++] = i->elemento; central(i->dir, v, n); } }
void liberar(No* i) { if (i != NULL) { liberar(i->esq); liberar(i->dir); free(i); } }
int falhas = 0;
void checar(bool ok, const char* d) { printf("%s %s\n", ok ? "OK   " : "FALHA", d); if (!ok) falhas++; }

int main(void) {
   checar(simetricas(NULL, NULL), "duas vazias sao simetricas");
   checar(clonarEspelhado(NULL) == NULL, "clone de vazia = NULL");

   No* a = NULL;
   int ins[] = {10, 5, 15, 2, 7, 20};
   for (int i = 0; i < 6; i++) inserirRec(ins[i], &a);
   No* b = clonarEspelhado(a);
   checar(simetricas(a, b), "a e seu clone espelhado sao simetricas");
   checar(!simetricas(a, a), "a nao e simetrica de si mesma (nao e simetrica em si)");
   int v[10], n = 0;
   central(a, v, &n);
   checar(n == 6 && v[0] == 2 && v[5] == 20, "original intacta (central crescente)");
   n = 0; central(b, v, &n);
   checar(n == 6 && v[0] == 20 && v[5] == 2, "clone em central e decrescente");
   b->esq->elemento = 99;
   checar(!simetricas(a, b), "mudou um valor -> nao simetricas");
   No* c = novoNo(10); c->esq = novoNo(5);
   checar(!simetricas(a, c), "formas diferentes -> false");
   liberar(a); liberar(b); liberar(c);
   printf(falhas == 0 ? "TODOS OK\n" : "%d FALHA(S)\n", falhas);
   return falhas;
}
