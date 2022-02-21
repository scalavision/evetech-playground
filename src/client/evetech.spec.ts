import axios from "axios"
import { getAllOrdersByCorporation, getAllOrdersByCorporationUrl, getNames, getOrdersByCorporation, Name, Order, sortByName, sortNames, typeIdsFromOrders } from "./evetech"
import { fetchNamesFromOrders, httpWithRetry } from "./httpHandler"

const url = 'https://esi.evetech.net/latest/markets/10000002/orders/?datasource=tranquility&order_type=all&page=1'
const corporationId = 10000002

test('getAllOrdersByCorporationUrl', () => {
  expect(getAllOrdersByCorporationUrl(corporationId)).toBe(url)
})

const testData = [
  {
    duration: 90,
    is_buy_order: false,
    issued: '2022-02-17T18:15:14Z',
    location_id: 60003760,
    min_volume: 1,
    order_id: 6202327043,
    price: 22990000,
    range: 'region',
    system_id: 30000142,
    type_id: 11198,
    volume_remain: 2,
    volume_total: 2
  },
  {
    duration: 90,
    is_buy_order: false,
    issued: '2022-02-16T08:34:36Z',
    location_id: 60003760,
    min_volume: 1,
    order_id: 6201278468,
    price: 297500,
    range: 'region',
    system_id: 30000142,
    type_id: 10694,
    volume_remain: 1,
    volume_total: 3
  },
]

const typeIds = [11198 , 10694 ]
const universes = [
  { category: 'inventory_type', id: 11198, name: 'Stiletto' },
  {
    category: 'inventory_type',
    id: 10694,
    name: '125mm Prototype Gauss Gun'
  }
]

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>
const httpGet = () => mockedAxios.get.mockResolvedValueOnce({ data: testData })
const httpGetFailure = (errorMsg) => mockedAxios.get.mockRejectedValueOnce(`failed with: ${errorMsg}`)
const httpPostMock = (resultSet) => mockedAxios.post.mockResolvedValue({ data: resultSet })

function getInventoryFromOrderId(typeIdsFromOrder: Order['type_id'][]) {
  const commonIds =  Array.from(new Set([...typeIdsFromOrder, ...universes.map((u) => u.id)]));
  const universeMap =  universes.reduce((obj, item) => (obj[item.id] = item, obj) ,{});
  return commonIds.reduce((accum, id) => {
    if( id in universeMap) {
      return [universeMap[id], ...accum]
    }
    return accum
  },[] as Name[])
}

const httpPostOrders = (orderIds: Order['type_id'][]) => mockedAxios.post.mockResolvedValueOnce(
  { data:  getInventoryFromOrderId(orderIds) } 
)

test('failed http retries', async () => {
  httpGetFailure('failed to fetch orders')
  await expect(
    httpWithRetry(() => getAllOrdersByCorporation(corporationId), 5)
  ).rejects.toThrow('unable to run http function, tried 5 times')
})

test('successfull fetching of orders', async () => {
  httpGet()
  await expect(getAllOrdersByCorporation(corporationId)).resolves.toEqual(testData)
})

test('failure fetching of orders', async () => {
  mockedAxios.get.mockRejectedValueOnce(new Error('Network error'))
  await expect(getAllOrdersByCorporation(corporationId)).resolves.toEqual(undefined)
})

test('extract all type_id from request', () => {
  const ids = typeIdsFromOrders(testData)
  expect(ids).toEqual(typeIds)
})

test('sort universe by name', () => {
  const sortedUniverses = universes.sort(sortByName)
  expect(sortedUniverses).toEqual(sortNames(universes))
})

test('post type_ids to lookupNameURL', async () => {
  httpGet()
  const orders = await getAllOrdersByCorporation(corporationId)
  if (!orders) {
    throw Error('unable to fetch orders')
  }
  const typeIds = typeIdsFromOrders(orders)
  httpPostMock(['hello', 'world'])
  const universes = await getNames(typeIds)
  await (expect(universes)).toEqual(['hello', 'world'])
})

test('fetch names in chunks to reduce congestion in service', async () => {
  const testData = ['data']
  httpPostMock(testData)
  const typeIds = [1, 2, 3, 4, 5]
  const result = await fetchNamesFromOrders(
    typeIds,
    2
  )
  expect(result).toEqual(['data', 'data', 'data'])
})

test('integration test for fetching names via orders', async() => {
  httpGet()
  const typeIds = await getOrdersByCorporation(corporationId)
  httpPostOrders(typeIds)
  const names = await fetchNamesFromOrders(typeIds, 500)
  await (expect(names)).toEqual(universes)
})
