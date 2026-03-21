# Hono + SQLite Web App Template

## Quick start

```sh
npm install
npm run migrate
npm run dev
```

Open <http://localhost:3000>.

## Create a new app from this template (2 minutes)

Then bootstrap a new app:

```sh
npm pkg set name="my-new-app"
npm install
npm run migrate
npm run dev
```

Next, replace the starter `tasks` domain in `src/routes/tasks.tsx`, `src/repository.ts`, and `src/migrations.ts` with your own domain.

## What this template includes

- Hono server with server-rendered JSX
- SQLite data access via `better-sqlite3`
- SQL migrations with an executed-migrations table
- Route module split (`src/routes`) with domain-focused handlers
- Repository module (`src/repository.ts`) for SQL queries
- Zod validation on all form/param inputs (`src/schemas.ts` + `zValidator` wrapper)
- HTMX fragment updates and redirect compatibility middleware
- Small Alpine.js usage for local UI-only state

## Default domain in this template

The template ships with a minimal `tasks` domain so you can see the full request lifecycle end-to-end.

- Replace `tasks` with your own domain objects and tables.
- Keep the same layering (`routes` → `repository` → SQL).

## Key paths

- `src/index.tsx`: app composition + middleware + route mounting
- `src/routes/home.tsx`: page route
- `src/routes/tasks.tsx`: mutation routes + HTMX partial rendering
- `src/repository.ts`: SQL data access
- `src/migrations.ts`: schema migrations
- `src/schemas.ts`: Zod request schemas

## Environment

- `DATABASE_PATH` (optional): defaults to `./data/app.db`
