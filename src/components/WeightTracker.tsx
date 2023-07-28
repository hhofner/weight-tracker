import * as elements from "typed-html";
interface WeightTrackerProps {
  streakPercentage?: number;
  weights: number[];
  labels: string[];
}

export default function WeightTracker({ streakPercentage = 0, weights, labels }: WeightTrackerProps) {
  return (
    <div id="weightTracker" class="flex flex-col gap-4 w-full p-2">
      <h1 class="text-primary opacity-50">WEIGHT TRACKER</h1>
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
        const ctx = document.getElementById('myChart');

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
