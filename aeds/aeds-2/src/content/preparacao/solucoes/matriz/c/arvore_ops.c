/* Matriz de operacoes - ARVORE BINARIA EM C (convencao Max/Walisson: novoNo, No**). Exercicios C1..C11. */
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct No { int elemento; struct No *esq, *dir; } No;

No* novoNo(int x) {
   No* n = (No*) malloc(sizeof(No));
   if (n == NULL) { fprintf(stderr, "Sem memoria\n"); exit(1); }
   n->elemento = x; n->esq = n->dir = NULL; return n;
}
/* C1 inserir com No** */ void inserirRec(int x, No** i) { if (*i == NULL) *i = novoNo(x); else if (x < (*i)->elemento) inserirRec(x, &((*i)->esq)); else if (x > (*i)->elemento) inserirRec(x, &((*i)->dir)); }
/* C2 inserir com retorno (alternativa sem No**: o pai recebe o retorno) */ No* inserirRetorno(int x, No* i) { if (i == NULL) i = novoNo(x); else if (x < i->elemento) i->esq = inserirRetorno(x, i->esq); else if (x > i->elemento) i->dir = inserirRetorno(x, i->dir); return i; }
/* C3 */ bool pesquisar(int x, No* i) { bool r = false; while (i != NULL && !r) { if (x == i->elemento) r = true; else i = (x < i->elemento) ? i->esq : i->dir; } return r; }
/* C4 */ int contarNos(No* i) { return i == NULL ? 0 : 1 + contarNos(i->esq) + contarNos(i->dir); }
/* C5 */ int contarFolhas(No* i) { int r = 0; if (i != NULL) r = (i->esq == NULL && i->dir == NULL) ? 1 : contarFolhas(i->esq) + contarFolhas(i->dir); return r; }
/* C6 vazia = -1 */ int altura(No* i) { int r = -1; if (i != NULL) { int e = altura(i->esq), d = altura(i->dir); r = 1 + (e > d ? e : d); } return r; }
/* C7 */ int soma(No* i) { return i == NULL ? 0 : i->elemento + soma(i->esq) + soma(i->dir); }
/* C8 */ void espelhar(No* i) { if (i != NULL) { No* t = i->esq; i->esq = i->dir; i->dir = t; espelhar(i->esq); espelhar(i->dir); } }
/* C9 */ bool simetricas(No* a, No* b) { bool r; if (a == NULL && b == NULL) r = true; else if (a == NULL || b == NULL) r = false; else r = a->elemento == b->elemento && simetricas(a->esq, b->dir) && simetricas(a->dir, b->esq); return r; }
/* C10 */ void removerFolhas(No** i) { if (*i != NULL) { if ((*i)->esq == NULL && (*i)->dir == NULL) { free(*i); *i = NULL; } else { removerFolhas(&((*i)->esq)); removerFolhas(&((*i)->dir)); } } }
/* C11 liberar em pos-ordem e zerar a raiz (No** para nao deixar ponteiro pendente) */ void liberar(No** i) { if (*i != NULL) { liberar(&((*i)->esq)); liberar(&((*i)->dir)); free(*i); *i = NULL; } }

/* ERRADO (versao do aulao): i e copia; a raiz continua NULL e a memoria vaza */
void inserirErrado(int x, No* i) { if (i == NULL) i = novoNo(x); else if (x < i->elemento) inserirErrado(x, i->esq); else if (x > i->elemento) inserirErrado(x, i->dir); }

int falhas = 0;
void checar(bool ok, const char* d) { printf("%s %s\n", ok ? "OK   " : "FALHA", d); if (!ok) falhas++; }

int main(void) {
   No* raiz = NULL;
   inserirErrado(10, raiz);
   checar(raiz == NULL, "versao errada (No* por valor) NAO altera a raiz - por isso No**");
   checar(contarNos(raiz) == 0 && altura(raiz) == -1 && !pesquisar(1, raiz), "arvore vazia");
   int ins[] = {10, 5, 15, 2, 7, 20};
   for (int i = 0; i < 6; i++) inserirRec(ins[i], &raiz);
   No* outra = NULL;
   for (int i = 0; i < 6; i++) outra = inserirRetorno(ins[i], outra);
   checar(contarNos(raiz) == 6 && contarNos(outra) == 6, "C1/C2 inserir com No** e com retorno");
   checar(pesquisar(7, raiz) && !pesquisar(8, raiz), "C3 pesquisar");
   checar(contarFolhas(raiz) == 3 && altura(raiz) == 2 && soma(raiz) == 59, "C5-C7 folhas/altura/soma");
   espelhar(outra);
   checar(simetricas(raiz, outra) && !simetricas(raiz, raiz), "C8/C9 espelhar + simetricas");
   removerFolhas(&raiz);
   checar(contarNos(raiz) == 3 && contarFolhas(raiz) == 2, "C10 remover folhas (sobram 10, 5, 15)");
   liberar(&raiz); liberar(&outra);
   checar(raiz == NULL && outra == NULL, "C11 liberar zera a raiz");
   printf(falhas == 0 ? "TODOS OK\n" : "%d FALHA(S)\n", falhas);
   return falhas;
}
