import Http from './http'
import axios from 'axios'

describe('services - http', () => {
  test('Return the http client', () => {
    const client = Http()
    expect(client).toEqual(axios)
  })
})
