# AGENTS.md

## Summary

Small TypeScript/Node web app template for internal tools. It serves
server-rendered JSX pages using Hono and stores data in SQLite via
better-sqlite3. For interactivity, Alpine.js is used for local UI state and
HTMX is used for server-driven interactions. Nested CSS is allowed. Progressive
Enhancement is ignored. The Post-Redirect-Get pattern is used unless HTMX can
avoid a page reload. All incoming request params and bodies should be validated
using Hono's `zValidator` middleware wrapper.

Documentation should stay focused on durable domain and architecture knowledge,
not low-level implementation details.

## Repo facts

- Size: small, single service.
- Languages/runtime: TypeScript (ESM), Node.js.
- Frameworks/libs: Hono + Hono JSX, @hono/node-server, better-sqlite3, dotenv,
  typed-htmx.
- Build output: `dist/` from `tsc`.

## Build, run, and validation

### Prereqs

- Node.js and npm.
- Writable SQLite location; configured via `DATABASE_PATH`.

### Bootstrap

- Run: `npm install`

### Run (dev)

- Start development server: `npm run dev`
- Default local URL: <http://localhost:3000>

### Minimal validation

- Build check: `npm run build`
- Schema check: `npm run migrate`

## Architecture and layout

### Application shape

- Single HTTP service with server-rendered pages.
- Route handlers are organized by user-facing page/domain.
- Shared UI and utility logic is separated from page-specific route logic.

### Template domain

- Starter `tasks` domain to demonstrate CRUD, validation, and HTMX partials.
- Replace `tasks` with your project-specific domain while preserving layers.

### Data model (high level)

- `tasks` table with title, done-state, and timestamps.
- `migrations` table for migration bookkeeping.

## Config and operations

- App config is environment-variable driven with dotenv for local development.
- SQLite is the primary datastore.
- Keep data and migration state in sync before running locally.

## Guidance for future agents

- Prefer stable, high-level documentation over file-by-file internals.
- Update docs when domain behavior or operational steps change.
- Always run install + migration before local build/run flows.
