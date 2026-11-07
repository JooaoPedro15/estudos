/* Manha-facil Q2: espelhar a arvore (troca esq/dir em todos os nos). */
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct No { int elemento; struct No *esq, *dir; } No;
No* raiz;

No* novoNo(int elemento) {
   No* novo = (No*) malloc(sizeof(No));
   if (novo == NULL) { fprintf(stderr, "Sem memoria\n"); exit(1); }
   novo->elemento = elemento;
   novo->esq = novo->dir = NULL;
   return novo;
}

void inserirRec(int x, No** i) {
   if (*i == NULL) { *i = novoNo(x); }
   else if (x < (*i)->elemento) { inserirRec(x, &((*i)->esq)); }
   else if (x > (*i)->elemento) { inserirRec(x, &((*i)->dir)); }
}
void inserir(int x) { inserirRec(x, &raiz); }

/* ===================== RESPOSTA DA QUESTAO ===================== */
/* No* basta: trocamos os CAMPOS esq/dir do no; o endereco guardado no pai nao muda. */
void espelhar(No* i) {
   if (i != NULL) {
      No* tmp = i->esq;
      i->esq = i->dir;
      i->dir = tmp;
      espelhar(i->esq);
      espelhar(i->dir);
   }
}
/* =============================================================== */

/* caminhamento central guardando em vetor (para o teste conferir) */
void central(No* i, int* v, int* n) {
   if (i != NULL) { central(i->esq, v, n); v[(*n)++] = i->elemento; central(i->dir, v, n); }
}
void liberar(No* i) { if (i != NULL) { liberar(i->esq); liberar(i->dir); free(i); } }

int falhas = 0;
void checar(bool ok, const char* d) { printf("%s %s\n", ok ? "OK   " : "FALHA", d); if (!ok) falhas++; }
bool igual(int* a, int* b, int n) { for (int i = 0; i < n; i++) if (a[i] != b[i]) return false; return true; }

int main(void) {
   raiz = NULL;
   espelhar(raiz);
   checar(raiz == NULL, "espelhar arvore vazia nao quebra");

   int ins[] = {10, 5, 15, 2, 7, 20};
   for (int i = 0; i < 6; i++) inserir(ins[i]);
   int v[10], n = 0;
   central(raiz, v, &n);
   int antes[] = {2, 5, 7, 10, 15, 20};
   checar(n == 6 && igual(v, antes, 6), "central antes: 2 5 7 10 15 20");

   espelhar(raiz);
   n = 0; central(raiz, v, &n);
   int depois[] = {20, 15, 10, 7, 5, 2};
   checar(n == 6 && igual(v, depois, 6), "central depois: 20 15 10 7 5 2 (decrescente)");
   checar(raiz->esq->elemento == 15 && raiz->dir->elemento == 5, "filhos da raiz trocados (15 | 5)");
   checar(raiz->dir->esq->elemento == 7 && raiz->dir->dir->elemento == 2, "subarvore do 5 espelhada (7 | 2)");

   espelhar(raiz);
   n = 0; central(raiz, v, &n);
   checar(igual(v, antes, 6), "espelhar duas vezes volta ao original");
   liberar(raiz);
   printf(falhas == 0 ? "TODOS OK\n" : "%d FALHA(S)\n", falhas);
   return falhas;
}
