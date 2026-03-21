import { config } from "dotenv";
import { openDatabase, MigrationRunner, migrations } from "@webshop/database";

config();

export const db = openDatabase();

const runner = new MigrationRunner(db);
runner.runMigrations(migrations);
