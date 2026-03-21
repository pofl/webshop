dev:
	pnpm dev

dev-server:
	pnpm dev:server

dev-react-router:
	pnpm dev:react-router

dev-astro:
	pnpm dev:astro

build:
	pnpm build

build-server:
	pnpm build:server

build-react-router:
	pnpm build:react-router

build-astro:
	pnpm build:astro

start:
	node apps/server/dist/index.js

migrate:
	pnpm migrate
