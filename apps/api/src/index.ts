import { serve } from "@hono/node-server";
import { config } from "dotenv";
import { Hono } from "hono";
import { MigrationRunner, migrations, openDatabase, Repository } from "@webshop/database";
import { createApiRoutes } from "./routes/api.js";

config();
const db = openDatabase();

const runner = new MigrationRunner(db);
runner.runMigrations(migrations);

const repo = new Repository(db);

const app = new Hono();

// Mount API routes
app.route("/api", createApiRoutes(repo));

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`API server is running on http://localhost:${info.port}`);
  }
);
