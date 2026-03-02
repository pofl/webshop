import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { config } from "dotenv";
import { Hono } from "hono";
import { openDatabase } from "./db.js";
import { MigrationRunner } from "./migrate.js";
import { migrations } from "./migrations.js";
import { createApiRoutes } from "./routes/api.js";
import { createCartRoutes } from "./routes/cart.js";
import { createHomeRoutes } from "./routes/home.js";
import { createProductRoutes } from "./routes/products.js";

config();
const db = openDatabase();

const runner = new MigrationRunner(db);
runner.runMigrations(migrations);

const app = new Hono();

app.use("/static/*", serveStatic({ root: "./public", rewriteRequestPath: (path) => path.replace(/^\/static/, "") }));

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
