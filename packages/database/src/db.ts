import type { Database } from "better-sqlite3";
import SQLite from "better-sqlite3";

export const openDatabase = (path?: string): Database => {
  const db = new SQLite(path ?? process.env.DATABASE_PATH ?? "./data/app.db");
  db.pragma("foreign_keys = ON");
  return db;
};
