# Grafos — Backend (`api/`)

Registro das decisões de implementação do backend do Grafos P1. **Nada aqui está implementado ainda** — este documento existe para que, quando a implementação começar, as escolhas já estejam feitas e justificadas. Decisões tomadas em 11/09/2026.

## Por que um backend

O app hoje é uma SPA estática (Vite + React + TypeScript). Conteúdo (questões, definições) vive em `.ts`; progresso vive no IndexedDB do navegador (`idb-keyval`). Isso é suficiente para uso pessoal, mas não para compartilhar com a turma:

- progresso fica preso no aparelho — abrir no celular e no PC dá dois progressos diferentes;
- limpar o cache do navegador apaga tudo;
- não há como comparar desempenho entre colegas.

O backend resolve isso. Ele **não** substitui o conteúdo do front: questões e definições continuam em `src/content/`.

## Decisões

| Tema | Decisão | Motivo | Alternativas descartadas |
|---|---|---|---|
| Objetivo nº 1 | **Progresso sincronizado + login** | É o que impede compartilhar com a turma hoje. | Correção por IA das abertas; painel de conteúdo — ficam para depois. |
| Escopo v1 | Progresso por usuário · **ranking/estatísticas da turma** · **offline-first com sync** | Turma vai usar no celular, muitas vezes sem rede boa; ranking dá motivo pra voltar. | Conteúdo no banco (CRUD de questões) — só vale se outros forem editar conteúdo. |
| Login | **E-mail + senha** | Escolha do autor: implementar autenticação do zero é parte do aprendizado. | Google OAuth (menos atrito, mas esconde a mecânica); apelido sem senha (inseguro). |
| Linguagem | **Java 21 + Spring Boot 3** | Alinhado com o que a PUC cobra e com vagas de estágio em BH; Java 21 já instalado. | TypeScript/Node (reaproveitaria os tipos do front); Python/FastAPI; Go. |
| Build | **Maven** via `mvnw` (wrapper) | Sem instalar Maven global; `./mvnw spring-boot:run` funciona em qualquer máquina com JDK. | Gradle. |
| Banco | **PostgreSQL** | Padrão com Spring Data JPA; plano gratuito no Neon/Supabase quando publicar; é o que aparece em vaga. | MySQL (equivalente, menos plano gratuito); H2 (só teste); MongoDB (fora do que a faculdade ensina). |
| Migrações | **Flyway** | Schema versionado em SQL, sem `ddl-auto=update` em produção. | Liquibase. |
| Hospedagem | **Só local por enquanto** | Publicar depois; deixar `Dockerfile` + `docker-compose.yml` prontos para qualquer host (Render, Railway, Fly, VPS). | — |
| Repositório | **Mesmo monorepo** (`Jogos Estudos/Grafos/api`) | Um `git log` só enquanto é estudo. `git subtree split` extrai a pasta com histórico quando quiser publicar separado. | Repo `grafos` separado. |

### Pendente (decidir quando começar a implementar)

- **Postgres local sem Docker.** A máquina não tem Docker nem Postgres. Opções: instalar Docker Desktop (recomendado — é o fluxo de estágio); instalar Postgres direto no Windows; ou perfil `dev` com H2 em arquivo e perfil `prod` com Postgres (JPA torna a troca barata).
- **Sessão:** proposta é JWT de acesso curto (15 min) no header + refresh token em cookie `httpOnly`. Alternativa: sessão em cookie com Spring Session. Decidir junto com o Spring Security.

## Estrutura de pastas proposta

```
Grafos/
├── src/              # front atual (Vite + React) — sem mudança de lugar por enquanto
├── api/              # backend Spring Boot (este README)
│   ├── pom.xml
│   ├── mvnw, mvnw.cmd
│   ├── docker-compose.yml   # postgres para desenvolvimento
│   ├── Dockerfile
│   └── src/main/java/br/pucminas/grafos/
│       ├── auth/       # registro, login, refresh, hash de senha (BCrypt)
│       ├── user/       # entidade e perfil
│       ├── attempt/    # tentativas de questão (o "progresso")
│       ├── stats/      # agregações: por usuário e por turma
│       └── config/     # Spring Security, CORS, JWT
└── docs/
```

Quando fizer sentido, o front pode ir para `Grafos/web/` — não é necessário para começar.

## Modelo de dados (proposta)

```
users
  id            uuid pk
  email         text unique
  password_hash text
  display_name  text
  created_at    timestamptz

attempts
  id            uuid pk        -- gerado NO CLIENTE (ver "Sync")
  user_id       uuid fk users
  question_id   text           -- id da questão em src/content (ex.: def-laco, fund-fam-05)
  topic         text           -- Topic.id, copiado da questão no momento da tentativa
  correct       boolean
  hints_used    smallint
  time_ms       integer
  client_ts     timestamptz    -- quando o aluno respondeu (relógio do aparelho)
  received_at   timestamptz    -- quando o servidor recebeu
  unique (user_id, id)
```

Só isso na v1. Estatísticas (acerto por tópico, "vistas", ranking) são **calculadas** a partir de `attempts` — nada de tabela de resumo até medir que precisa.

Espelha `QuestionAttempt` de `src/content/types.ts`, com dois acréscimos: `id` (uuid) e o par `client_ts`/`received_at` no lugar de `timestamp`.

## API (proposta)

```
POST /auth/register        { email, password, displayName }
POST /auth/login           { email, password }            → access token + cookie refresh
POST /auth/refresh                                         → novo access token
POST /auth/logout

POST /me/attempts          [ attempt, ... ]                 # lote; idempotente por attempt.id
GET  /me/attempts?since=<received_at>                      # pull incremental
GET  /me/stats                                             # acerto por tópico, total de tentativas, tempo

GET  /class/ranking        # tentativas, acerto, conceitos vistos — só entre usuários logados
GET  /class/hardest        # questões/tópicos que a turma mais erra
```

Sem endpoint de conteúdo: o front já tem as questões.

## Sync offline-first (proposta)

Princípio que simplifica tudo: **tentativa é append-only**. Nunca se edita nem apaga uma tentativa; só se acrescenta. Logo não existe conflito de edição — sync é união de conjuntos.

1. Front continua gravando no IndexedDB como hoje (fonte local de verdade), mas cada tentativa passa a nascer com `id = crypto.randomUUID()`.
2. Fila de "não enviadas". Com rede, `POST /me/attempts` em lote; servidor ignora ids que já tem (`unique (user_id, id)`), então reenviar é seguro.
3. Ao abrir o app logado, `GET /me/attempts?since=<último received_at visto>` traz o que foi feito em outro aparelho; front faz união por `id`.
4. Sem login, tudo funciona igual a hoje (só local).

Mudança necessária no front: adicionar `id` a `QuestionAttempt` e uma fila de envio em `src/store/progress.ts`. Nada mais.

## Não vai ter (por enquanto)

- Correção automática das questões abertas por IA — exigiria chave de API no servidor; fica para uma v2, quando o backend já existir.
- CRUD de conteúdo — questões continuam em `.ts`, versionadas no git.
- Login social.
- Sync do conteúdo — o app publicado já leva o conteúdo embutido.

## Próximos passos (quando começar)

1. Resolver "Postgres local" (ver Pendente).
2. `spring init` / Spring Initializr: Web, Security, Data JPA, Validation, Flyway, PostgreSQL driver, Lombok opcional.
3. Migração V1 com as duas tabelas acima.
4. `auth/` primeiro (registro/login com BCrypt + JWT), depois `attempt/` (POST em lote + GET since), depois `stats/`.
5. No front: `id` nas tentativas, tela de login, fila de sync.
6. `docker-compose.yml` + `Dockerfile`; só então escolher host.
