import { config } from "dotenv";
import { openDatabase, MigrationRunner, migrations, Repository } from "@webshop/database";

config();

const db = openDatabase();

const runner = new MigrationRunner(db);
runner.runMigrations(migrations);

export const repo = new Repository(db);
