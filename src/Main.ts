import {
  sortNames,
  Name,
  getOrdersByCorporation,
} from './client/evetech'
import * as _ from 'lodash'
import { fetchNamesFromOrders, httpWithRetry } from './client/httpHandler'

const corporationId = 10000002

async function fetchData(): Promise<Name[]> {

  const typeIds = await getOrdersByCorporation(corporationId)
  const names = await fetchNamesFromOrders(typeIds, 500)
  if (!names) {
    throw new Error("unable to fetch universe names")
  }
  return sortNames(names)
}

fetchData().then(
  (data) => {
    console.log('listing out all names, among them name of universes:')
    const names = data.map((d) => d.name)
    console.log(names.join('\n'))
  }
).catch(
  (error) => {
    console.log(`failed to fetch names, sorry for the inconvenience..:`)
    console.log(JSON.stringify(error))
  }
)
