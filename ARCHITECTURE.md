# Architecture & Tech Stack Playbook

This document explains the stack and architecture decisions used in this project so you can build another service the same way.

## 1) What this style optimizes for

- Fast delivery for internal tools
- Simple deployment and operations
- Strong server-side control of data and access
- Minimal frontend complexity with targeted interactivity

This is a **single-process monolith**: one Node.js service, one SQLite database, server-rendered HTML.

## 2) Technology stack and why it was chosen

### Runtime & language

- **Node.js + TypeScript (ESM)**
- Why: broad ecosystem, quick startup, type safety without heavy framework overhead.

### HTTP framework and rendering

- **Hono** with **Hono JSX** server rendering
- Why: lightweight routing/middleware model, fast development, JSX templating without SPA build complexity.

### Data store

- **SQLite** via **better-sqlite3**
- Why: zero external DB service, simple backup/restore, strong fit for small single-service workloads.
- **No ORM**
- Why: direct SQL keeps query behavior explicit and avoids abstraction overhead for this project size.

### Validation

- **Zod** + **@hono/zod-validator**
- Why: one schema language for request validation, explicit coercion and constraints at route boundaries.

### Interactivity

- **HTMX** (+ typed-htmx types)
- Why: partial page updates and server-driven interactions without client-side app architecture.
- **Alpine.js**
- Why: tiny client-side state for UI-only behavior (for example, switching input modes in forms) without introducing a SPA framework.

### Configuration

- **dotenv** for local env loading
- Why: environment-driven configuration with minimal setup.

### Tooling

- **tsx** for dev runtime
- **tsc** for builds
- **prettier** for formatting

## 3) Core architecture decisions

### A. Server-rendered pages first

- Pages are rendered on the server (JSX in route modules/components).
- Browser interactions call server endpoints and swap fragments (HTMX).
- Small, local UI state is handled with Alpine.js where it improves UX without changing server ownership of business logic.
- Decision impact: no client state synchronization layer, lower JS complexity.

### B. Route modules per domain/page

- Routing is split by user-facing domain (`home`, `tasks`, and future domains you add).
- Each route module owns:
  - request schemas
  - optional authorization checks
  - page/component composition
- Decision impact: feature logic is easy to locate and evolve.

### C. Repository layer for data access

- SQL statements live in `repository.ts` (or multiple repository files as domains grow).
- Route handlers call repository functions instead of embedding SQL.
- Decision impact: centralized query logic and easier schema evolution.

### D. Middleware for cross-cutting concerns

- Global middleware handles:
  - static assets
  - HTMX redirect compatibility
  - optional auth/session checks
- Decision impact: avoid repeating auth/transport behavior in every route.

### E. Validate all incoming params/forms

- Every route with input uses `zValidator("param" | "form", schema)`.
- Invalid input returns HTTP 400 (via wrapper).
- Decision impact: consistent, early rejection of invalid requests.

### F. Schema migrations at startup

- Migrations run at boot before serving traffic.
- Migrations are pure SQL strings (no ORM migration DSL).
- Applied migration IDs are recorded in a `migrations` table (`id`, `executed_at`) to prevent re-running completed migrations.
- Decision impact: app can self-initialize in new environments.

### G. Optional auth module

- Authentication is intentionally not required in the base template.
- If your domain needs it, add session middleware and route-level authorization checks as a separate module.
- Decision impact: keeps the starter small while preserving a clear path for protected apps.

## 4) Request lifecycle pattern

1. Request enters Hono app.
2. Optional auth middleware verifies session/cookie state.
3. Route-level `zValidator` checks params/form payload.
4. Route enforces authorization for resource access (if applicable).
5. Repository functions execute SQL.
6. Response returns full page or HTMX fragment.
7. For redirect responses under HTMX, middleware converts `Location` to `HX-Redirect`.

This keeps business logic in routes, data logic in repository modules, and protocol behavior in middleware.

## 5) Data model shape (high-level)

- `tasks`: demo domain table with title, done-state, and timestamps
- `migrations`: migration bookkeeping table

Add domain-specific tables by following the same migration + repository pattern.

## 6) Conventions to copy into a new project

### Project layout

- `src/index.tsx`: app composition, middleware, route mounting
- `src/routes/*.tsx`: domain route modules
- `src/components/*.tsx`: shared view components
- `src/repository.ts`: domain data access
- `src/schemas.ts`: shared Zod schemas
- `src/migrate.ts`, `src/migrations.ts`: migration runner and migrations

### Coding conventions

- Keep route handlers thin and explicit.
- Keep SQL in dedicated helpers/repositories.
- Use raw SQL directly (queries + migrations), not an ORM.
- Validate every external input with Zod.
- Use PRG (Post-Redirect-Get) for non-HTMX flows.
- Return partial HTML from mutation routes when HTMX is used.

### Operational conventions

- Environment variables define runtime config (`DATABASE_PATH`, optional domain-specific config).
- Migration step is mandatory before build/run.
- Default local dev flow: install → migrate → dev server.

## 7) Rebuild-this-stack checklist

Use this sequence for a new service built the same way:

1. Initialize TypeScript ESM Node project.
2. Add dependencies: `hono`, `@hono/node-server`, `better-sqlite3`, `zod`, `@hono/zod-validator`, `dotenv`.
3. Add dev tools: `tsx`, `typescript`, `prettier`.
4. Implement DB opener with SQLite foreign keys enabled.
5. Create migration runner and run migrations on startup.
6. Add optional auth/session module only if your domain needs protected routes.
7. Build route modules by domain and mount in a central app entry.
8. Add request-validation wrapper and apply to all param/form inputs.
9. Add HTMX redirect middleware for 3xx handling.
10. Keep shared JSX components under `src/components`.
11. Add scripts: `dev`, `build`, `start`, `migrate`.

## 8) Tradeoffs you should choose intentionally

- **Pros**: minimal moving parts, low ops burden, fast feature delivery, predictable backend-centric flow.
- **Cons**: limited horizontal scaling without redesign, less rich offline/client UX than SPA patterns.

If your next project has similar scale and trust boundaries, this architecture is a strong default.
