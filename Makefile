install:
	pnpm install

dev:
	pnpm dev

dev-api:
	pnpm dev:api

dev-honojsx:
	pnpm dev:honojsx

dev-htmx-alpine:
	pnpm dev:htmx-alpine

dev-react-router:
	pnpm dev:react-router

dev-astro:
	pnpm dev:astro

dev-react-router-dom:
	pnpm dev:react-router-dom

dev-tanstack-router:
	pnpm dev:tanstack-router

build:
	pnpm build

build-api:
	pnpm build:api

build-honojsx:
	pnpm build:honojsx

build-htmx-alpine:
	pnpm build:htmx-alpine

build-react-router:
	pnpm build:react-router

build-astro:
	pnpm build:astro

build-react-router-dom:
	pnpm build:react-router-dom

build-tanstack-router:
	pnpm build:tanstack-router

start-api:
	node apps/api/dist/index.js

start-honojsx:
	node apps/honojsx/dist/index.js

start-htmx-alpine:
	node apps/htmx-alpine/dist/index.js

migrate:
	pnpm migrate
