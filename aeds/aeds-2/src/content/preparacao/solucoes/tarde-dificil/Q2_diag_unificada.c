/* Exercício Q2 (versao C, = P2-B Q3): diagUnificada concatena as listas da diagonal principal
   numa lista DUPLA, sem as cabecas. Andar na diagonal = dir e depois inf. Versao Java: Q2_DiagUnificada.java. */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

typedef struct Celula { int elemento; struct Celula* prox; } Celula;
typedef struct CelulaMatriz {
   struct CelulaMatriz *esq, *dir, *inf, *sup;
   Celula *inicio, *fim;                                   /* inicio = cabeca */
} CelulaMatriz;
typedef struct CelulaDupla { int elemento; struct CelulaDupla *prox, *ant; } CelulaDupla;
typedef struct Matriz { CelulaMatriz* inicio; int linha, coluna; } Matriz;

Celula* novaCelula(int x) { Celula* c = (Celula*) malloc(sizeof(Celula)); c->elemento = x; c->prox = NULL; return c; }
CelulaDupla* novaCelulaDupla(int x) {
   CelulaDupla* c = (CelulaDupla*) malloc(sizeof(CelulaDupla));
   c->elemento = x; c->prox = c->ant = NULL;
   return c;
}
/* Apoio para os testes: malha quadrada l x l. */
Matriz* novaMatriz(int l) {
   Matriz* m = (Matriz*) malloc(sizeof(Matriz));
   m->linha = m->coluna = l; m->inicio = NULL;
   CelulaMatriz* acimaLinha = NULL;
   for (int i = 0; i < l; i++) {
      CelulaMatriz *ant = NULL, *primeiraLinha = NULL, *acima = acimaLinha;
      for (int j = 0; j < l; j++) {
         CelulaMatriz* c = (CelulaMatriz*) malloc(sizeof(CelulaMatriz));
         c->esq = c->dir = c->inf = c->sup = NULL;
         c->inicio = c->fim = novaCelula(-1);
         if (ant != NULL) { ant->dir = c; c->esq = ant; }
         if (acima != NULL) { acima->inf = c; c->sup = acima; acima = acima->dir; }
         if (j == 0) primeiraLinha = c;
         ant = c;
      }
      if (i == 0) m->inicio = primeiraLinha;
      acimaLinha = primeiraLinha;
   }
   return m;
}
void inserir(Matriz* m, int i, int j, int x) {
   CelulaMatriz* c = m->inicio;
   for (int a = 0; a < i; a++) c = c->inf;
   for (int b = 0; b < j; b++) c = c->dir;
   c->fim->prox = novaCelula(x); c->fim = c->fim->prox;
}

/* ===================== RESPOSTA DA QUESTAO ===================== */
CelulaDupla* diagUnificada(Matriz* m) {
   CelulaDupla *primeira = NULL, *ultima = NULL;
   CelulaMatriz* d = m->inicio;
   while (d != NULL) {
      for (Celula* c = d->inicio->prox; c != NULL; c = c->prox) {   /* pula a cabeca */
         CelulaDupla* nova = novaCelulaDupla(c->elemento);
         if (primeira == NULL) {
            primeira = nova;
         } else {
            ultima->prox = nova;
            nova->ant = ultima;
         }
         ultima = nova;
      }
      d = (d->dir == NULL) ? NULL : d->dir->inf;                     /* proxima da diagonal */
   }
   return primeira;
}
/* Theta(l + d): l celulas da diagonal (2 passos cada) + d elementos copiados. */
/* =============================================================== */

void frente(CelulaDupla* p, char* s) { s[0] = '\0'; for (; p != NULL; p = p->prox) sprintf(s + strlen(s), "%d ", p->elemento); }
void tras(CelulaDupla* p, char* s) {
   s[0] = '\0';
   if (p == NULL) return;
   while (p->prox != NULL) p = p->prox;
   for (; p != NULL; p = p->ant) sprintf(s + strlen(s), "%d ", p->elemento);
}
void liberarDupla(CelulaDupla* p) { while (p != NULL) { CelulaDupla* q = p->prox; free(p); p = q; } }

int falhas = 0;
void checar(bool ok, const char* d) { printf("%s %s\n", ok ? "OK   " : "FALHA", d); if (!ok) falhas++; }

int main(void) {
   char s[128];
   Matriz* m = novaMatriz(3);
   checar(diagUnificada(m) == NULL, "diagonal toda vazia -> NULL");
   inserir(m, 0, 0, 1); inserir(m, 0, 0, 2); inserir(m, 2, 2, 5); inserir(m, 0, 1, 99); inserir(m, 2, 0, 98);
   CelulaDupla* r = diagUnificada(m);
   frente(r, s);
   checar(strcmp(s, "1 2 5 ") == 0, "concatena a00 (1 2), a11 (vazia), a22 (5); ignora fora da diagonal");
   tras(r, s);
   checar(strcmp(s, "5 2 1 ") == 0 && r->ant == NULL, "ponteiros ant corretos (5 2 1) e primeira->ant == NULL");
   liberarDupla(r);
   Matriz* u = novaMatriz(1); inserir(u, 0, 0, 7);
   r = diagUnificada(u); frente(r, s);
   checar(strcmp(s, "7 ") == 0, "matriz 1x1");
   liberarDupla(r);
   printf(falhas == 0 ? "TODOS OK\n" : "%d FALHA(S)\n", falhas);
   return falhas;
}
