dev:
	pnpm dev

dev-server:
	pnpm dev:server

dev-spa:
	pnpm dev:spa

build:
	pnpm build

build-server:
	pnpm build:server

build-spa:
	pnpm build:spa

start:
	node apps/server/dist/index.js

migrate:
	pnpm migrate
