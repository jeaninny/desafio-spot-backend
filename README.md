# Desafio Back-end — SPOT Metrics

<br />

<div align="center">
  <img src="https://img.shields.io/github/languages/top/jeaninny/desafio-spot-backend?style=flat-square" />
  <img src="https://img.shields.io/github/repo-size/jeaninny/desafio-spot-backend?style=flat-square" />
  <img src="https://img.shields.io/github/languages/count/jeaninny/desafio-spot-backend?style=flat-square" />
  <img src="https://img.shields.io/github/last-commit/jeaninny/desafio-spot-backend?style=flat-square" />

</div>

<br />

## Descrição

API REST para gerenciamento de **Agentes de Inteligência Artificial** desenvolvida como parte do processo seletivo de estágio backend da SPOT Metrics.

A API permite o cadastro de agentes, o registro de execuções e o acompanhamento do consumo de tokens.

---

## Tecnologias Utilizadas

| Item                | Descrição                           |
| ------------------- | ----------------------------------- |
| **Runtime**         | Node.js                             |
| **Linguagem**       | TypeScript                          |
| **Framework**       | NestJS                              |
| **ORM**             | TypeORM                             |
| **Banco de Dados**  | PostgreSQL 18                       |
| **Autenticação**    | JWT + Passport                      |
| **Validação**       | class-validator + class-transformer |
| **Documentação**    | Swagger (OpenAPI)                   |
| **Testes**          | Jest + SuperTest                    |
| **Containerização** | Docker + Docker Compose             |

---

## Arquitetura do Projeto

O projeto utiliza a arquitetura modular do NestJS, com três domínios principais: **Agentes**, **Execuções** e **Usuários**.

Cada módulo possui separação de responsabilidades:

- **Controller** → recebe e trata as requisições HTTP
- **Service** → contém as regras de negócio
- **Entity** → representa as tabelas do banco de dados
- **Repository do ORM** → comunicação com o banco de dados

---

## Diagrama Entidade-Relacionamento

```mermaid
erDiagram

tb_users {
  INT id PK
  VARCHAR name
  VARCHAR email
  VARCHAR password
}

tb_agents {
  INT id PK
  VARCHAR name
  VARCHAR description
  VARCHAR system_prompt
  INT max_tokens_per_execution
  INT monthly_token_limit
  ENUM status
}

tb_executions {
  INT id PK
  VARCHAR input_message
  VARCHAR output_message
  INT input_tokens
  INT output_tokens
  INT total_tokens
  INT execution_time_ms
  TIMESTAMP created_at
  INT agentId FK
}

tb_agents ||--o{ tb_executions : registra
```

---

## Fluxo de Autenticação (JWT)

A API utiliza **JSON Web Token (JWT)** com a biblioteca **Passport** para proteger os endpoints.

### Como autenticar:

**1. Cadastre um usuário:**

```http
POST /users
Content-Type: application/json

{
  "name": "Seu Nome",
  "email": "seu@email.com",
  "password": "suasenha"
}
```

**2. Faça login para obter o token:**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "seu@email.com",
  "password": "suasenha"
}
```

A resposta retornará um token no formato:
```json
{
  "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**3. Use o token nas requisições protegidas:**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> O token expira em **1 hora**. Após expirar, faça login novamente.

---

## Pré-requisitos

- Node.js 24+
- npm
- Docker e Docker Compose

---

## Como Executar o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/jeaninny/desafio-spot-backend.git
cd desafio-spot-backend
```

### 2. Configure as variáveis de ambiente

Com base no `.env.example`:

```bash
cp .env.example .env
```

Preencha o `JWT_SECRET` no `.env`.

### 3. Suba o banco de dados

```bash
docker compose up --build -d
```

Isso irá criar automaticamente os bancos `spot_jeaninny` (principal) e `spot_test_jeaninny` (testes).

> **Atenção:** se já tiver um volume anterior com o mesmo nome, rode `docker compose down` antes de subir novamente.

### 4. Instale as dependências

```bash
npm install
```

### 5. Execute a aplicação

```bash
npm run start:dev
```

As migrations serão executadas automaticamente na inicialização da aplicação por meio da configuração migrationsRun: true do TypeORM.

A API estará disponível em: `http://localhost:3000`

---

## Documentação da API

Com a aplicação rodando, acesse o Swagger em:

```
http://localhost:3000/swagger
```

---

## Endpoints Principais

| Método | Endpoint                       | Descrição                         | Auth |
| ------ | ------------------------------ | --------------------------------- | ---- |
| POST   | /users                         | Cadastrar usuário                 | ❌    |
| POST   | /auth/login                    | Login e geração do token JWT      | ❌    |
| GET    | /agents                        | Listar agentes                    | ✅    |
| POST   | /agents                        | Cadastrar agente                  | ✅    |
| GET    | /agents/:id                    | Buscar agente por ID              | ✅    |
| PATCH  | /agents/:id                    | Atualizar agente                  | ✅    |
| DELETE | /agents/:id                    | Remover agente                    | ✅    |
| GET    | /executions                    | Listar execuções                  | ✅    |
| POST   | /executions                    | Registrar execução                | ✅    |
| GET    | /executions/:id                | Buscar execução por ID            | ✅    |
| GET    | /executions/efficiency-ranking | Ranking de eficiência dos agentes | ✅    |

---

## Regras de Negócio

- `totalTokens` é calculado automaticamente como `inputTokens + outputTokens`
- O total de tokens não pode ultrapassar o limite máximo por execução do agente
- O consumo acumulado no mês não pode ultrapassar o limite mensal do agente
- Agentes inativos não podem registrar novas execuções
- Execuções são imutáveis — não há endpoints de update ou delete

---

## Como Rodar os Testes

### Testes unitários

```bash
npm run test
```

### Testes de integração (e2e)

Com o Docker rodando e a aplicação **parada**:

```bash
npm run test:e2e
```

---

## Autora

**Jeaninny Teixeira **

🔗 **GitHub:** https://github.com/jeaninny  
🔗 **LinkedIn:** https://www.linkedin.com/in/jeaninnyteixeira