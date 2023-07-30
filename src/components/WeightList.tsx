import * as elements from 'typed-html'
import { WeightTrackerHeader } from './WeightTracker'
import { Weight } from '../db/schema'

export default function Settings({ weightList, token = undefined }: { weightList: Array<Weight>, token?: string }) {
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
                  <span hx-post={`/delete/confirm/${weight.id}`} hx-swap="outerHTML">Delete</span>
                </div>
              </div>
            )
          })
        }
      </div>
      <h1 class="text-primary opacity-50 flex w-full justify-between"><span>Token</span></h1>
      <div class="flex flex-col">
        <small>Current Token</small>
        <span>{token ? token : "None"}</span>
      </div>
      <form class="flex gap-4" action="/token/set" method="post">
        <input name="token" type="text" placeholder='Insert token here' class="input input-bordered w-full max-w-xs" />
        <button class="btn">Save</button>
      </form>
    </div>
  )
}
