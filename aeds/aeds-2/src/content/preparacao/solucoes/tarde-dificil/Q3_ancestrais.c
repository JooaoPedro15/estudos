/* Tarde-dificil Q3: ABP em C com a API da pratica da tarde (new_*):
   contar_um_filho e mostrar_ancestrais (imprime x e os ancestrais, de x ate a raiz). */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

typedef struct No { int elemento; struct No *esq, *dir; } No;
typedef struct ArvoreBinaria { No* raiz; } ArvoreBinaria;

No* new_no(int elemento) {
   No* no = (No*) malloc(sizeof(No));
   no->elemento = elemento; no->esq = no->dir = NULL;
   return no;
}
void delete_no(No* no) { free(no); }
ArvoreBinaria* new_arvore_binaria() { ArvoreBinaria* ab = (ArvoreBinaria*) malloc(sizeof(ArvoreBinaria)); ab->raiz = NULL; return ab; }
void delete_rec(No* i) { if (i != NULL) { delete_rec(i->esq); delete_rec(i->dir); delete_no(i); } }
void delete_arvore_binaria(ArvoreBinaria* ab) { delete_rec(ab->raiz); free(ab); }
void inserir_rec(No** i, int x) {
   if (*i == NULL) *i = new_no(x);
   else if (x < (*i)->elemento) inserir_rec(&((*i)->esq), x);
   else if (x > (*i)->elemento) inserir_rec(&((*i)->dir), x);
}
void inserir(ArvoreBinaria* ab, int x) { inserir_rec(&(ab->raiz), x); }

char saida[512]; int pos = 0;     /* so para o teste conferir o que foi impresso */
void imprimir(int x) { printf("%d ", x); pos += sprintf(saida + pos, "%d ", x); }

/* ===================== RESPOSTA DA QUESTAO ===================== */
int contar_um_filho_rec(No* i) {
   int resp = 0;
   if (i != NULL) {
      if ((i->esq == NULL) != (i->dir == NULL)) {   /* exatamente um filho (XOR) */
         resp = 1;
      }
      resp += contar_um_filho_rec(i->esq) + contar_um_filho_rec(i->dir);
   }
   return resp;
}
int contar_um_filho(ArvoreBinaria* ab) { return contar_um_filho_rec(ab->raiz); }

/* Desce como numa pesquisa; se achou, cada chamada imprime o seu no NA VOLTA:
   primeiro o x (mais fundo), depois o pai, ..., ate a raiz. */
bool ancestrais_rec(No* i, int x) {
   bool achou = false;
   if (i != NULL) {
      if (x == i->elemento) achou = true;
      else if (x < i->elemento) achou = ancestrais_rec(i->esq, x);
      else achou = ancestrais_rec(i->dir, x);
      if (achou) imprimir(i->elemento);              /* impressao na volta da recursao */
   }
   return achou;
}
bool mostrar_ancestrais(ArvoreBinaria* ab, int x) { bool r = ancestrais_rec(ab->raiz, x); printf("\n"); return r; }
/* Pior caso (ABP degenerada): Theta(n). Balanceada: Theta(lg n). */
/* =============================================================== */

int falhas = 0;
void checar(bool ok, const char* d) { printf("%s %s\n", ok ? "OK   " : "FALHA", d); if (!ok) falhas++; }

int main(void) {
   ArvoreBinaria* ab = new_arvore_binaria();
   checar(contar_um_filho(ab) == 0, "arvore vazia -> 0 nos com um filho");
   pos = 0; saida[0] = '\0';
   checar(!mostrar_ancestrais(ab, 7) && pos == 0, "arvore vazia: nao acha e nao imprime");
   int ins[] = {10, 5, 15, 2, 7, 20};
   for (int i = 0; i < 6; i++) inserir(ab, ins[i]);
   checar(contar_um_filho(ab) == 1, "10 5 15 2 7 20 -> 1 no com um filho (15)");
   pos = 0; saida[0] = '\0';
   checar(mostrar_ancestrais(ab, 7) && strcmp(saida, "7 5 10 ") == 0, "ancestrais de 7: 7 5 10");
   pos = 0; saida[0] = '\0';
   checar(mostrar_ancestrais(ab, 10) && strcmp(saida, "10 ") == 0, "x na raiz: imprime so 10");
   pos = 0; saida[0] = '\0';
   checar(!mostrar_ancestrais(ab, 8) && pos == 0, "x ausente (8): false e nada impresso");
   inserir(ab, 6);
   checar(contar_um_filho(ab) == 2, "inserindo 6: nos com um filho = 15 e 7");
   delete_arvore_binaria(ab);
   printf(falhas == 0 ? "TODOS OK\n" : "%d FALHA(S)\n", falhas);
   return falhas;
}
