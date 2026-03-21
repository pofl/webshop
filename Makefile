dev:
	pnpm dev

dev-server:
	pnpm dev:server

dev-spa:
	pnpm dev:spa

dev-astro:
	pnpm dev:astro

build:
	pnpm build

build-server:
	pnpm build:server

build-spa:
	pnpm build:spa

build-astro:
	pnpm build:astro

start:
	node apps/server/dist/index.js

migrate:
	pnpm migrate
