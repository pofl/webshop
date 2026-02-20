import type { Migration } from "./migrate.js";

export const migrations: Migration[] = [
  {
    id: "20260220-create-table-tasks",
    sql: `
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
        updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
        title TEXT NOT NULL,
        is_done INTEGER NOT NULL DEFAULT 0,
        CONSTRAINT tasks_created_at_utc CHECK (created_at LIKE '%Z' AND datetime(created_at) IS NOT NULL),
        CONSTRAINT tasks_updated_at_utc CHECK (updated_at LIKE '%Z' AND datetime(updated_at) IS NOT NULL),
        CONSTRAINT tasks_is_done_bool CHECK (is_done IN (0, 1))
      );

      CREATE INDEX IF NOT EXISTS tasks_done_idx ON tasks (is_done);
      CREATE INDEX IF NOT EXISTS tasks_created_idx ON tasks (created_at);
    `,
  },
];
