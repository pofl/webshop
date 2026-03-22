import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { config } from "dotenv";
import { Hono } from "hono";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
import { MigrationRunner, migrations, openDatabase, Repository } from "@webshop/database";
import { createCartRoutes, createCartPartialRoutes } from "./routes/cart.js";
import { createHomeRoutes, createHomePartialRoutes } from "./routes/home.js";
import { createProductRoutes, createProductPartialRoutes } from "./routes/products.js";

config();
const db = openDatabase();

const runner = new MigrationRunner(db);
runner.runMigrations(migrations);

const repo = new Repository(db);

const app = new Hono();

// Resolve the public directory relative to this file's location
const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = process.env.PUBLIC_DIR ?? resolve(__dirname, "../../../public");

app.use("/static/*", serveStatic({ root: publicDir, rewriteRequestPath: (path) => path.replace(/^\/static/, "") }));

// Full-page routes
app.route("/", createHomeRoutes(repo));
app.route("/products", createProductRoutes(repo));
app.route("/cart", createCartRoutes(repo));

// Partial routes for HTMX swaps
app.route("/partials", createHomePartialRoutes(repo));
app.route("/partials/products", createProductPartialRoutes(repo));
app.route("/partials/cart", createCartPartialRoutes(repo));

serve(
  {
    fetch: app.fetch,
    port: 3002,
  },
  (info) => {
    console.log(`HTMX + Alpine server is running on http://localhost:${info.port}`);
  }
);
