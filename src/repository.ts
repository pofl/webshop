import type { Database } from "better-sqlite3";

export interface TaskRecord {
  id: number;
  title: string;
  is_done: boolean;
  created_at: string;
  updated_at: string;
}

function parseTaskRecord(row: Record<string, unknown>): TaskRecord {
  return {
    id: Number(row.id),
    title: String(row.title),
    is_done: Number(row.is_done) === 1,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export function listTasks(db: Database): TaskRecord[] {
  const rows = db.prepare("SELECT * FROM tasks ORDER BY is_done ASC, datetime(created_at) DESC").all() as Record<
    string,
    unknown
  >[];
  return rows.map((row) => parseTaskRecord(row));
}

export function createTask(db: Database, title: string): TaskRecord {
  const result = db.prepare("INSERT INTO tasks (title) VALUES (?)").run(title);
  const created = getTaskById(db, Number(result.lastInsertRowid));
  if (!created) {
    throw new Error("Could not create task");
  }
  return created;
}

export function getTaskById(db: Database, id: number): TaskRecord | null {
  const row = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
  if (!row) {
    return null;
  }
  return parseTaskRecord(row as Record<string, unknown>);
}

export function toggleTaskDone(db: Database, id: number): void {
  db.prepare(
    `
      UPDATE tasks
      SET
        is_done = CASE is_done WHEN 1 THEN 0 ELSE 1 END,
        updated_at = (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
      WHERE id = ?
    `
  ).run(id);
}

export function deleteTask(db: Database, id: number): void {
  db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
}
