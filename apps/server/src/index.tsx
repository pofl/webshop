import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { config } from "dotenv";
import { Hono } from "hono";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
import { MigrationRunner, migrations, openDatabase } from "@webshop/database";
import { createApiRoutes } from "./routes/api.js";
import { createCartRoutes } from "./routes/cart.js";
import { createHomeRoutes } from "./routes/home.js";
import { createProductRoutes } from "./routes/products.js";

config();
const db = openDatabase();

const runner = new MigrationRunner(db);
runner.runMigrations(migrations);

const app = new Hono();

// Resolve the public directory relative to this file's location (../../public from apps/server/src/)
const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = process.env.PUBLIC_DIR ?? resolve(__dirname, "../../../public");

app.use("/static/*", serveStatic({ root: publicDir, rewriteRequestPath: (path) => path.replace(/^\/static/, "") }));

// HTMX redirect middleware
app.use("*", async (c, next) => {
  await next();
  const response = c.res;
  const isHtmx = Boolean(c.req.header("HX-Request"));
  const location = response.headers.get("Location");

  if (isHtmx && location && response.status >= 300 && response.status < 400) {
    c.header("HX-Redirect", location);
    return c.body(null, 204);
  }

  return response;
});

// Mount route modules
app.route("/", createHomeRoutes(db));
app.route("/products", createProductRoutes(db));
app.route("/cart", createCartRoutes(db));
app.route("/api", createApiRoutes(db));

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
