/* Matriz de operacoes - LISTA SIMPLES COM CABECA EM C. Exercicios S1..S5 (inclui a meiose da P2-B Q1). */
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct Celula { int elemento; struct Celula* prox; } Celula;
Celula* primeiro; Celula* ultimo;

Celula* novaCelula(int x) { Celula* n = (Celula*) malloc(sizeof(Celula)); n->elemento = x; n->prox = NULL; return n; }
void start() { primeiro = novaCelula(-1); ultimo = primeiro; }
/* S1 */ void inserirFim(int x) { ultimo->prox = novaCelula(x); ultimo = ultimo->prox; }
/* S2 */ void inserirInicio(int x) { Celula* t = novaCelula(x); t->prox = primeiro->prox; primeiro->prox = t; if (primeiro == ultimo) ultimo = t; }
/* S3 inverter religando ponteiros */
void inverter() {
   Celula *ant = NULL, *i = primeiro->prox;
   ultimo = (i == NULL) ? primeiro : i;
   while (i != NULL) { Celula* p = i->prox; i->prox = ant; ant = i; i = p; }
   primeiro->prox = ant;
}
/* S4 meiose (P2-B Q1): cada celula vira duas com metade do valor; anda 2 por vez para nao dividir a nova */
void meiose() {
   for (Celula* i = primeiro->prox; i != NULL; i = i->prox->prox) {
      i->elemento = i->elemento / 2;
      Celula* t = novaCelula(i->elemento);
      t->prox = i->prox; i->prox = t;
      if (t->prox == NULL) ultimo = t;
   }
}
/* S5 remover o fim: Theta(n) (precisa do anterior); libera a memoria */
int removerFim() {
   int resp = -1;
   if (primeiro != ultimo) {
      Celula* i = primeiro;
      while (i->prox != ultimo) i = i->prox;
      resp = ultimo->elemento; free(ultimo); ultimo = i; i->prox = NULL;
   }
   return resp;
}
void liberarLista() { Celula* i = primeiro; while (i != NULL) { Celula* p = i->prox; free(i); i = p; } }

int falhas = 0;
void checar(bool ok, const char* d) { printf("%s %s\n", ok ? "OK   " : "FALHA", d); if (!ok) falhas++; }
bool conteudo(const int* e, int n) { int k = 0; for (Celula* i = primeiro->prox; i != NULL; i = i->prox, k++) if (k >= n || i->elemento != e[k]) return false; return k == n; }
bool ultimoOk() { Celula* i = primeiro; while (i->prox != NULL) i = i->prox; return i == ultimo; }

int main(void) {
   start();
   meiose(); inverter();
   checar(primeiro->prox == NULL && ultimoOk() && removerFim() == -1, "lista vazia: meiose, inverter e removerFim nao quebram");
   inserirFim(8); inserirFim(5); inserirFim(6); inserirFim(1);
   meiose();
   int e1[] = {4, 4, 2, 2, 3, 3, 0, 0};
   checar(conteudo(e1, 8) && ultimoOk(), "S4 meiose: 8 5 6 1 -> 4 4 2 2 3 3 0 0 (exemplo da P2-B)");
   inverter();
   int e2[] = {0, 0, 3, 3, 2, 2, 4, 4};
   checar(conteudo(e2, 8) && ultimoOk(), "S3 inverter + ultimo correto");
   checar(removerFim() == 4 && ultimoOk(), "S5 remover fim");
   inserirInicio(9);
   checar(primeiro->prox->elemento == 9, "S2 inserir no inicio");
   liberarLista();
   printf(falhas == 0 ? "TODOS OK\n" : "%d FALHA(S)\n", falhas);
   return falhas;
}
