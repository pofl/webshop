import type { Database } from "better-sqlite3";
import { Hono } from "hono";
import type { FC } from "hono/jsx";
import { Layout } from "../components/Layout.js";
import { listTasks, type TaskRecord } from "../repository.js";
import { TaskListSection } from "./tasks.js";

const HomePage: FC<{ tasks: TaskRecord[] }> = ({ tasks }) => {
  return (
    <Layout title="Web App Template">
      <h1>Web App Template</h1>
      <p class="muted">Starter stack: Hono + server-rendered JSX + SQLite + Zod + HTMX + Alpine.js</p>

      <section class="card" x-data="{ showHint: false }">
        <div class="row-between">
          <h2>Tasks</h2>
          <button type="button" class="button-secondary" x-on:click="showHint = !showHint">
            Toggle hint
          </button>
        </div>
        <p class="muted" x-show="showHint" x-cloak>
          This module is intentionally tiny and demonstrates validated form handling, repository access, and HTMX
          partial swaps.
        </p>

        <form method="post" action="/tasks" hx-post="/tasks" hx-target="#task-list" hx-swap="outerHTML" class="row">
          <input type="text" name="title" placeholder="Add a task" required maxlength={200} />
          <button type="submit">Add</button>
        </form>
      </section>

      <TaskListSection tasks={tasks} />
    </Layout>
  );
};

export const createHomeRoutes = (db: Database) => {
  const app = new Hono();

  app.get("/", (c) => {
    return c.html(<HomePage tasks={listTasks(db)} />);
  });

  return app;
};
