/* Matriz de operacoes - LISTA DUPLA CIRCULAR COM CELULA CABECA (C). Exercicios D1..D6.
   Estrutura da P2-C Q3 e da P2 2026/1: representada so por primeiro (cabeca);
   primeiro->ant = ultima celula; ultima->prox = primeiro. Todo laco para em primeiro, nunca em NULL. */
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct CelulaDupla {
   int elemento;               // Elemento inserido na celula.
   struct CelulaDupla* prox;   // Aponta a celula prox.
   struct CelulaDupla* ant;    // Aponta a celula anterior.
} CelulaDupla;

//LISTA PROPRIAMENTE DITA =======================================
CelulaDupla* primeiro;

CelulaDupla* novaCelulaDupla(int x) {
   CelulaDupla* n = (CelulaDupla*) malloc(sizeof(CelulaDupla));
   n->elemento = x; n->prox = n->ant = NULL;
   return n;
}
/* D1 */ void start() { primeiro = novaCelulaDupla(-1); primeiro->prox = primeiro->ant = primeiro; }
/* D2 inserir no fim: Theta(1) gracas a primeiro->ant */
void inserirFim(int x) {
   CelulaDupla* ultima = primeiro->ant;
   CelulaDupla* nova = novaCelulaDupla(x);
   nova->ant = ultima; nova->prox = primeiro;
   ultima->prox = nova; primeiro->ant = nova;
}
/* D3 InsertionSort (P2 2026/1): desloca valores para tras ate achar o lugar */
void insertionSort() {
   for (CelulaDupla* i = primeiro->prox->prox; i != primeiro; i = i->prox) {
      int tmp = i->elemento;
      CelulaDupla* j = i->ant;
      while (j != primeiro && j->elemento > tmp) { j->prox->elemento = j->elemento; j = j->ant; }
      j->prox->elemento = tmp;
   }
}
/* D4 SelectionSort trocando valores */
void selectionSort() {
   for (CelulaDupla* i = primeiro->prox; i != primeiro && i->prox != primeiro; i = i->prox) {
      CelulaDupla* menor = i;
      for (CelulaDupla* j = i->prox; j != primeiro; j = j->prox) if (j->elemento < menor->elemento) menor = j;
      int t = i->elemento; i->elemento = menor->elemento; menor->elemento = t;
   }
}
/* D5 Quicksort (P2-C Q3): particao de Lomuto com pivo = ultimo da faixa; troca VALORES.
   Faixa [esq, dir] de celulas uteis; para quando a faixa tem 0 ou 1 celula. */
void trocar(CelulaDupla* a, CelulaDupla* b) { int t = a->elemento; a->elemento = b->elemento; b->elemento = t; }
void quicksortRec(CelulaDupla* esq, CelulaDupla* dir) {
   if (esq != dir && esq != dir->prox) {            /* pelo menos 2 celulas e esq antes de dir */
      int pivo = dir->elemento;
      CelulaDupla* i = esq->ant;                    /* fronteira dos <= pivo */
      for (CelulaDupla* j = esq; j != dir; j = j->prox) {
         if (j->elemento <= pivo) { i = i->prox; trocar(i, j); }
      }
      i = i->prox; trocar(i, dir);                  /* pivo na posicao final */
      quicksortRec(esq, i->ant);
      quicksortRec(i->prox, dir);
   }
}
void quicksort() { if (primeiro->prox != primeiro) quicksortRec(primeiro->prox, primeiro->ant); }
/* D6 mostrar de tras para frente (prova que ant esta correto) */
int paraVetorReverso(int* v) { int n = 0; for (CelulaDupla* i = primeiro->ant; i != primeiro; i = i->ant) v[n++] = i->elemento; return n; }
int paraVetor(int* v) { int n = 0; for (CelulaDupla* i = primeiro->prox; i != primeiro; i = i->prox) v[n++] = i->elemento; return n; }
void liberarLista() { CelulaDupla* i = primeiro->prox; while (i != primeiro) { CelulaDupla* p = i->prox; free(i); i = p; } free(primeiro); }

int falhas = 0;
void checar(bool ok, const char* d) { printf("%s %s\n", ok ? "OK   " : "FALHA", d); if (!ok) falhas++; }
int cmp(const void* a, const void* b) { return *(const int*)a - *(const int*)b; }

int main(void) {
   void (*algs[3])(void) = {insertionSort, selectionSort, quicksort};
   const char* nomes[3] = {"D3 insertionSort", "D4 selectionSort", "D5 quicksort"};
   srand(9);
   for (int a = 0; a < 3; a++) {
      bool ok = true;
      for (int c = 0; c < 800; c++) {
         int n = rand() % 25, base[30], v[30], esp[30];
         start();
         for (int i = 0; i < n; i++) { base[i] = rand() % 12; inserirFim(base[i]); }
         for (int i = 0; i < n; i++) esp[i] = base[i];
         qsort(esp, n, sizeof(int), cmp);
         algs[a]();
         int m = paraVetor(v);
         for (int i = 0; i < n; i++) ok &= (v[i] == esp[i]);
         int r = paraVetorReverso(v);
         for (int i = 0; i < n; i++) ok &= (v[i] == esp[n - 1 - i]);
         ok &= (m == n && r == n);
         liberarLista();
      }
      char msg[80]; sprintf(msg, "%s: 800 listas (vazia, 1 elemento, repetidos), ida e volta", nomes[a]);
      checar(ok, msg);
   }
   start(); inserirFim(8); inserirFim(6); inserirFim(12); inserirFim(-1); quicksort();
   int v[10]; int n = paraVetor(v);
   checar(n == 4 && v[0] == -1 && v[1] == 6 && v[2] == 8 && v[3] == 12, "D5 exemplo da figura da P2-C: 8 6 12 -1 -> -1 6 8 12");
   liberarLista();
   printf(falhas == 0 ? "TODOS OK\n" : "%d FALHA(S)\n", falhas);
   return falhas;
}
