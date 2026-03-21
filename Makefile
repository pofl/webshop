install:
	pnpm install

dev:
	pnpm dev

dev-server:
	pnpm dev:server

dev-react-router:
	pnpm dev:react-router

dev-astro:
	pnpm dev:astro

dev-tanstack:
	pnpm dev:tanstack

build:
	pnpm build

build-server:
	pnpm build:server

build-react-router:
	pnpm build:react-router

build-astro:
	pnpm build:astro

build-tanstack:
	pnpm build:tanstack

start:
	node apps/server/dist/index.js

migrate:
	pnpm migrate
