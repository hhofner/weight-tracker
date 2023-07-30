import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";
import WeightTracker from "./components/WeightTracker";
import WeightList from "./components/WeightList";
import { db } from "./db";
import { Weight, weights } from "./db/schema";
import { between, eq } from "drizzle-orm";

const app = new Elysia()
  .use(html())
  .get("/", async ({ html }) => {
    const { weightList, labels, percentage } = await fetchWeights();
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
  .post("/settings/open", async () => {
    const allWeights = await db.select().from(weights).all()
    return (
      <WeightList weightList={allWeights} />
    )
  })
  .post("settings/close", async () => {
    const { weightList, labels, percentage } = await fetchWeights();
    return <WeightTracker streakPercentage={percentage} weights={weightList} labels={labels} />
  })
  .post("/delete/confirm/:id", ({ params: { id } }) => {
    return (
      <span class="flex flex-col">
        <span class="text-sm">Are you sure?</span>
        <div>
          <span class="text-red-400" hx-post={`/delete/${id}`} hx-target="#weightTracker">YES</span>
          <span class="text-green-400" hx-get={`/delete/close/${id}`}>Cancel</span>
        </div>
      </span>
    )
  })
  .post("/delete/close/:id", ({ params: { id } }) => {
    return (
      <span hx-post={`/delete/confirm/${id}`}>Delete</span>
    )
  })
  .post("delete/:id", async ({ params: { id: toDeleteId } }) => {
    await db.delete(weights).where(eq(weights.id, parseInt(toDeleteId))).run()
    const { weightList, labels, percentage } = await fetchWeights();
    return <WeightTracker streakPercentage={percentage} weights={weightList} labels={labels} />
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

async function fetchWeights() {
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
  return { weightList, labels, percentage };
}
