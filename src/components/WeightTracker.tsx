import * as elements from "typed-html";
interface WeightTrackerProps {
  streakPercentage?: number;
  weights: number[];
  labels: string[];
}

export function WeightTrackerHeader({ headerName = "WEIGHT TRACKER", settingsOpen = false }: { headerName?: string; settingsOpen?: boolean }) {
  return (
    <h1 class="text-primary opacity-50 flex w-full justify-between"><span>{headerName}</span>
      <span
        hx-post={settingsOpen ? "/settings/close" : "/settings/open"}
        hx-target="#weightTracker"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19.43 12.98c.04-.32.07-.64.07-.98c0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.488.488 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1a.566.566 0 0 0-.18-.03c-.17 0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98c0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46a.5.5 0 0 0 .61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.06.02.12.03.18.03c.17 0 .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-1.98-1.71c.04.31.05.52.05.73c0 .21-.02.43-.05.73l-.14 1.13l.89.7l1.08.84l-.7 1.21l-1.27-.51l-1.04-.42l-.9.68c-.43.32-.84.56-1.25.73l-1.06.43l-.16 1.13l-.2 1.35h-1.4l-.19-1.35l-.16-1.13l-1.06-.43c-.43-.18-.83-.41-1.23-.71l-.91-.7l-1.06.43l-1.27.51l-.7-1.21l1.08-.84l.89-.7l-.14-1.13c-.03-.31-.05-.54-.05-.74s.02-.43.05-.73l.14-1.13l-.89-.7l-1.08-.84l.7-1.21l1.27.51l1.04.42l.9-.68c.43-.32.84-.56 1.25-.73l1.06-.43l.16-1.13l.2-1.35h1.39l.19 1.35l.16 1.13l1.06.43c.43.18.83.41 1.23.71l.91.7l1.06-.43l1.27-.51l.7 1.21l-1.07.85l-.89.7l.14 1.13zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4s-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2z"></path></svg>
      </span>
    </h1>
  )
}
export default function WeightTracker({ streakPercentage = 0, weights, labels }: WeightTrackerProps) {
  return (
    <div id="weightTracker" class="flex flex-col gap-4 w-full p-2">
      <WeightTrackerHeader />
      <canvas id="myChart"></canvas>
      <div class="flex gap-6 justify-center">
        <div class="flex flex-col items-center"><div class="radial-progress bg-accent text-primary-content border-4 border-accent" style={`--value:${streakPercentage};`}>{streakPercentage}%</div>Streak</div>
      </div>
      <form class="flex gap-2" hx-post="/weight">
        <input type="text" name="weight" placeholder="Weight in KG" class="input input-bordered w-full max-w-xs" />
        <button class="btn" type="submit">Input</button>
      </form>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

      <script>
        {`
        // var because this code gets reran when closing settings and ctx is still in memory
        var ctx = document.getElementById('myChart');

        new Chart(ctx, {
          type: 'line',
          options: {
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              x: {
                display: false
              },
            },
          },
          data: {
            labels: ${JSON.stringify(labels)},
            datasets: [{
                data: ${JSON.stringify(weights)},
                fill: false,
                borderColor: '#58c1d8',
                tension: 0.1
              }]
            },
          });`
        }
      </script>
    </div>
  )
}
