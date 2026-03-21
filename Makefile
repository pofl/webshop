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

dev-react-router-dom:
	pnpm dev:react-router-dom

build:
	pnpm build

build-server:
	pnpm build:server

build-react-router:
	pnpm build:react-router

build-astro:
	pnpm build:astro

build-react-router-dom:
	pnpm build:react-router-dom

start:
	node apps/server/dist/index.js

migrate:
	pnpm migrate
