import Http from './http'
import axios from 'axios'

afterEach(() => {
  process.env.NODE_ENV = 'test'
  jest.resetModules()
  jest.resetAllMocks()
})


describe('services - http', () => {
  test('Return the http client on non-development mode', () => {
    const spy = jest.spyOn(axios, 'create')
    const client = Http()
    expect(spy).toHaveBeenCalled()
    expect(spy.mock.calls[0][0]).toEqual({
      baseURL: ''
    })
    expect(spy).not.toBeUndefined()
  })

  test('Return the http client on development mode', () => {
    process.env.NODE_ENV = 'development'
    const spy = jest.spyOn(axios, 'create')
    const client = Http()
    expect(spy).toHaveBeenCalled()
    expect(spy.mock.calls[0][0]).toEqual({
      baseURL: 'http://localhost:8081'
    })
    expect(spy).not.toBeUndefined()
  })
})
