import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";
import WeightTracker from "./components/WeightTracker";
import { db } from "./db";
import { Weight, weights } from "./db/schema";
import { between } from "drizzle-orm";

const app = new Elysia()
  .use(html())
  .get("/", async ({ html }) => {
    const thisMonthStartTimestamp = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).getTime();
    const thisMonthEndTimestamp = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      1
    ).getTime();
    const numberOfDaysInMonth = (thisMonthEndTimestamp - thisMonthStartTimestamp) / (1000 * 60 * 60 * 24);
    const weightEntries = await db.select().from(weights).where(between(weights.timestamp, thisMonthStartTimestamp, thisMonthEndTimestamp)).all();
    const weightList = [...weightEntries.map((entry) => entry.weight)];
    const labels = [...weightEntries.map((entry) => entry.timestamp)];
    // get number of days for this month, then divide current entries from this month
    const percentage = Math.floor((weightList.length / numberOfDaysInMonth) * 100);
    return html(
      <BaseHtml>
        <body
          class="flex w-full h-screen justify-center items-center"
        >
          <WeightTracker streakPercentage={percentage} weights={weightList} labels={labels} />
        </body>
      </BaseHtml>
    )
  })
  .post("/weight", async ({ body }) => {
    // parse int body.weight
    const weight = parseInt(body.weight) || 0;
    const timestamp = new Date().getTime();
    await db.insert(weights).values({ weight, timestamp }).run()
    return "ok"
  })
  .get("/styles.css", () => Bun.file("./tailwind-gen/styles.css"))
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

const BaseHtml = ({ children }: elements.Children) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>THE BETH STACK</title>
  <script src="https://unpkg.com/htmx.org@1.9.3"></script>
  <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
  <link href="/styles.css" rel="stylesheet">
</head>

${children}
`;

function TodoItem({ content, completed, id }: Todo) {
  return (
    <div class="flex flex-row space-x-3">
      <p>{content}</p>
      <input
        type="checkbox"
        checked={completed}
        hx-post={`/todos/toggle/${id}`}
        hx-swap="outerHTML"
        hx-target="closest div"
      />
      <button
        class="text-red-500"
        hx-delete={`/todos/${id}`}
        hx-swap="outerHTML"
        hx-target="closest div"
      >
        X
      </button>
    </div>
  );
}

function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <div>
      {todos.map((todo) => (
        <TodoItem {...todo} />
      ))}
      <TodoForm />
    </div>
  );
}

function TodoForm() {
  return (
    <form
      class="flex flex-row space-x-3"
      hx-post="/todos"
      hx-swap="beforebegin"
      _="on submit target.reset()"
    >
      <input type="text" name="content" class="border border-black" />
      <button type="submit">Add</button>
    </form>
  );
}
