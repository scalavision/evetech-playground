import * as _ from 'lodash'
import { getNames, TypeId, Name, Order } from './evetech'

export async function httpWithRetry<A>(
  httpFn: () => Promise<Array<A> | void>,
  nrOfAttempts: number = 5,
  tried: number = 0
): Promise<Array<A>> {
  const result = await httpFn()
  if (!result && nrOfAttempts >= tried + 1) {
    return httpWithRetry(httpFn, nrOfAttempts, tried + 1)
  }
  else if (!result) {
    throw new Error(`unable to run http function, tried ${tried} times`)
  }
  else return result
}

export async function httpWithRetryStrategy<A>(
  httpFn: Array<() => Promise<Array<A> | void>>,
  nrOfAttempts: number = 5,
  tried: number = 0
): Promise<Array<A>> {
  const result = await httpFn[tried]()
  if (!result && nrOfAttempts >= tried + 1) {
    return httpWithRetryStrategy(httpFn, nrOfAttempts, tried + 1)
  }
  else if (!result) {
    throw new Error(`unable to run http function, tried ${tried} times`)
  }
  else return result
}

export async function fetchNamesFromOrders(
  typeIds: Order['type_id'][],
  windowSize: number
): Promise<Array<Name>> {
  let results = []
  const uniqeTypeIds = _.uniq(typeIds)
  const idChunk = _.chunk(uniqeTypeIds, windowSize)

  for (const ids of idChunk) {
    const nextValue = await httpWithRetry(() => getNames(ids), 5)
    results.push(nextValue)
  }

  return results.flat()
}
