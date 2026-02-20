import type { Database } from "better-sqlite3";
import { Hono } from "hono";
import type { FC } from "hono/jsx";
import { createTask, deleteTask, listTasks, toggleTaskDone, type TaskRecord } from "../repository.js";
import { idParamSchema, taskTitleFormSchema } from "../schemas.js";
import { zValidator } from "../validator-wrapper.js";

export const TaskListSection: FC<{ tasks: TaskRecord[] }> = ({ tasks }) => {
  return (
    <section class="card" id="task-list">
      <h2>Current tasks</h2>
      {tasks.length === 0 ? (
        <p class="muted">No tasks yet.</p>
      ) : (
        <ul class="task-list">
          {tasks.map((task) => (
            <li class="task-item">
              <form
                method="post"
                action={`/tasks/${task.id}/toggle`}
                hx-post={`/tasks/${task.id}/toggle`}
                hx-target="#task-list"
                hx-swap="outerHTML"
              >
                <button type="submit" class="button-secondary">
                  {task.is_done ? "Mark open" : "Mark done"}
                </button>
              </form>
              <span class={task.is_done ? "task-title task-done" : "task-title"}>{task.title}</span>
              <form
                method="post"
                action={`/tasks/${task.id}/delete`}
                hx-post={`/tasks/${task.id}/delete`}
                hx-target="#task-list"
                hx-swap="outerHTML"
              >
                <button type="submit" class="button-danger">
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export const createTaskRoutes = (db: Database) => {
  const app = new Hono();

  app.post("/", zValidator("form", taskTitleFormSchema), (c) => {
    const { title } = c.req.valid("form");
    createTask(db, title);

    if (c.req.header("HX-Request")) {
      return c.html(<TaskListSection tasks={listTasks(db)} />);
    }

    return c.redirect("/");
  });

  app.post("/:id/toggle", zValidator("param", idParamSchema), (c) => {
    const { id } = c.req.valid("param");
    toggleTaskDone(db, id);

    if (c.req.header("HX-Request")) {
      return c.html(<TaskListSection tasks={listTasks(db)} />);
    }

    return c.redirect("/");
  });

  app.post("/:id/delete", zValidator("param", idParamSchema), (c) => {
    const { id } = c.req.valid("param");
    deleteTask(db, id);

    if (c.req.header("HX-Request")) {
      return c.html(<TaskListSection tasks={listTasks(db)} />);
    }

    return c.redirect("/");
  });

  return app;
};
