/* Tarde-facil Q3: lista simples COM cabeca em C: inserirOrdenado e removerValor (com free). */
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct Celula { int elemento; struct Celula* prox; } Celula;
Celula* primeiro;   /* cabeca */
Celula* ultimo;

Celula* novaCelula(int x) {
   Celula* nova = (Celula*) malloc(sizeof(Celula));
   if (nova == NULL) { fprintf(stderr, "Sem memoria\n"); exit(1); }
   nova->elemento = x; nova->prox = NULL;
   return nova;
}
void start() { primeiro = novaCelula(-1); ultimo = primeiro; }
void inserirFim(int x) { ultimo->prox = novaCelula(x); ultimo = ultimo->prox; }

/* ===================== RESPOSTA DA QUESTAO ===================== */
void inserirOrdenado(int x) {
   Celula* i = primeiro;                               /* i para ANTES da posicao */
   while (i->prox != NULL && i->prox->elemento < x) {
      i = i->prox;
   }
   Celula* tmp = novaCelula(x);
   tmp->prox = i->prox;
   i->prox = tmp;
   if (tmp->prox == NULL) {
      ultimo = tmp;                                    /* entrou no fim */
   }
}

int removerValor(int x) {
   int resp = 0;
   Celula* i = primeiro;
   while (i->prox != NULL && i->prox->elemento != x) {
      i = i->prox;
   }
   if (i->prox != NULL) {
      Celula* tmp = i->prox;
      i->prox = tmp->prox;
      if (tmp == ultimo) {
         ultimo = i;                                   /* removeu o ultimo: o anterior vira ultimo */
      }
      free(tmp);
      resp = 1;
   }
   return resp;
}
/* Ambas: melhor Theta(1), pior Theta(n). */
/* =============================================================== */

int falhas = 0;
void checar(bool ok, const char* d) { printf("%s %s\n", ok ? "OK   " : "FALHA", d); if (!ok) falhas++; }
bool conteudo(int* esp, int n) {
   int k = 0;
   for (Celula* i = primeiro->prox; i != NULL; i = i->prox, k++) if (k >= n || i->elemento != esp[k]) return false;
   return k == n;
}

int main(void) {
   start();
   checar(removerValor(1) == 0 && ultimo == primeiro, "remover de lista vazia -> 0");
   int ins[] = {5, 1, 3, 9, 7};
   for (int i = 0; i < 5; i++) inserirOrdenado(ins[i]);
   int e1[] = {1, 3, 5, 7, 9};
   checar(conteudo(e1, 5) && ultimo->elemento == 9, "insere 5 1 3 9 7 -> 1 3 5 7 9, ultimo = 9");
   checar(removerValor(9) == 1 && ultimo->elemento == 7, "remove o ultimo (9) -> ultimo = 7");
   inserirFim(10);
   int e2[] = {1, 3, 5, 7, 10};
   checar(conteudo(e2, 5), "inserirFim depois funciona (ultimo correto)");
   checar(removerValor(1) == 1, "remove o primeiro util (1)");
   checar(removerValor(42) == 0, "valor inexistente -> 0");
   removerValor(3); removerValor(5); removerValor(7); removerValor(10);
   checar(primeiro->prox == NULL && ultimo == primeiro, "removeu tudo -> ultimo volta para a cabeca");
   inserirOrdenado(4);
   checar(ultimo->elemento == 4 && primeiro->prox->elemento == 4, "insere em lista vazia");
   printf(falhas == 0 ? "TODOS OK\n" : "%d FALHA(S)\n", falhas);
   return falhas;
}
