import axios from "axios"
import * as _ from 'lodash'

export interface Order {
  duration: number
  is_buy_order: boolean
  issued: string
  location_id: number
  min_volume: number
  order_id: number
  price: number
  range: string
  system_id: number
  type_id: number
  volume_remain: number
  volume_total: number
}

export interface TypeId {
  type_id: number
}

export function typeIdsFromOrders(orders: Order[]): Order['type_id'][] {
  return orders.map(({ type_id }) => type_id)
}

const Api = 'https://esi.evetech.net/latest'

export function getAllOrdersByCorporationUrl(
  corporationId: number,
  dataSource: string = 'tranquility',
  pagination: number = 1
) {
  return `${Api}/markets/${corporationId}/orders/?datasource=${dataSource}&order_type=all&page=${pagination}`
}

function logError(error): void {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(`error.response:${error.response.status}`)
    console.log(`${JSON.stringify(error.response.headers)}`)
    console.log(`${JSON.stringify(error.response.data)}`)

  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(`error.request:${error.request}`)
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('error.message', error.message);
  }
  console.log(`error.config:${JSON.stringify(error.config)}`);

}

export const getAllOrdersByCorporation =
  async (
    corporationId: number, dataSource: string = 'tranquility', pagination: number = 1
  ): Promise<Array<Order> | void> => {
    const url = getAllOrdersByCorporationUrl(corporationId, dataSource, pagination)
    try {
      const result = await axios.get<Array<Order>>(url)
      return result.data
    } catch (error) {
      logError(error)
    }
  }

export interface Name {
  id: number
  category: string
  name: string
}

type SortOrder = 'ascending' | 'descending'

export function sortNames(names: Name[], orderBy: SortOrder = 'ascending'): Name[] {
  return _.sortBy(names, [name => name.name.toLowerCase()], [orderBy])
}

export function sortByName(a: Name, b: Name): number {
  if (a.name < b.name) return -1
  if (a.name > b.name) return 1
  return 0
}

export const getNames = async (
  type_ids: Order['type_id'][]
): Promise<Array<Name> | void> => {
  if (type_ids.length === 0) return []
  if (type_ids.length >= 1000) throw Error('Unable to handle request for 1000 or more orders')
  const url = `${Api}/universe/names/?datasource=tranquility`
  try {
    const result = await axios.post<Array<Name>>(url, type_ids)
    return result.data
  } catch (error) {
    logError(error)
  }
}