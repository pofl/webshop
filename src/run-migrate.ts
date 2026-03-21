import { config } from "dotenv";
import { openDatabase } from "./db/db.js";
import { MigrationRunner } from "./db/migrate.js";
import { migrations } from "./migrations.js";

config();

function main() {
  const db = openDatabase();
  const runner = new MigrationRunner(db);
  runner.runMigrations(migrations);
}

try {
  main();
} catch (error) {
  console.error("Migration run failed:", error);
  process.exit(1);
}
