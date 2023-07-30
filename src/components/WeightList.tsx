import * as elements from 'typed-html'
import { WeightTrackerHeader } from './WeightTracker'
import { Weight } from '../db/schema'

export default function WeightList({ weightList }: { weightList: Array<Weight> }) {
  return (
    <div id="weightTracker" class="flex flex-col gap-4 w-full p-2">
      <WeightTrackerHeader headerName='WEIGHT LIST' settingsOpen={true} />
      <div>
        {
          weightList.map((weight: Weight) => {
            return (
              <div class="flex justify-between">
                <div class="flex gap-4">
                  <span>{weight.timestamp}</span>
                  <span class="font-bold">{weight.weight}kg</span>
                </div>
                <div class="flex gap-2">
                  <span>Edit</span>
                  <span hx-post={`/delete/confirm/${weight.id}`}>Delete</span>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
