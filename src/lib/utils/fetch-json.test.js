jest.mock('node-fetch', () => require('fetch-mock').sandbox())

const fetchJson = require('./fetch-json')
const fetchMock = require('node-fetch')

const url = 'http://localhost/index.json'
const options = {
    method: 'GET',
    headers: { 'content-type': 'application/json' },
}

describe('fetch-json', () => {
    afterEach(() => fetchMock.reset())

    test('200 response', async () => {
        fetchMock.mock(url, { status: 200, body: '{ "data": {} }' }, options)
        expect(await fetchJson(url, options)).toEqual({ data: {} })
    })

    test('4xx response', async () => {
        fetchMock.mock(url, { status: 400, body: '{ "data": {} }' }, options)
        await expect(fetchJson(url, options)).rejects.toEqual(new Error('Bad Request'))
    })

    test('503 response', async () => {
        fetchMock.mock(url, { status: 503, body: 'There was an error' }, options)
        await expect(fetchJson(url, options)).rejects.toEqual(new Error('Service Unavailable'))
    })

    test('networking error', async () => {
        const fetchError = new Error('ECONNRESET')
        fetchMock.mock(url, { throws: fetchError }, options)
        await expect(fetchJson(url, options)).rejects.toEqual(fetchError)
    })
})
