import Http, { ForbiddenError, ValidationError } from './http'
import axios from 'axios'

afterEach(() => {
  process.env.NODE_ENV = 'test'
  jest.clearAllMocks();
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

  test('Change error type to ForbiddenError when the response is a 403', async () => {
    process.env.NODE_ENV = 'development'

    const client = Http()
    expect(client.interceptors.response.handlers).toHaveLength(1)
    
    const { fulfilled, rejected } = client.interceptors.response.handlers[0]

    const Response = {
      status: 403,
      data: {
        message: 'There is an authorize issue'
      }
    }

    const ResponseError = new Error('Forbidden')
    ResponseError.response = Response
    ResponseError.isAxiosError = true

    await expect(fulfilled(Response)).resolves.toEqual(Response)
    await expect(rejected(ResponseError)).rejects.toThrow(new ForbiddenError('There is an authorize issue'))
  })

  test('Change error type to ValidationError when the response is a 406', async () => {
    process.env.NODE_ENV = 'development'

    const client = Http()
    expect(client.interceptors.response.handlers).toHaveLength(1)
    
    const { fulfilled, rejected } = client.interceptors.response.handlers[0]

    const Response = {
      status: 406,
      data: {
        message: 'There is a validation issue'
      }
    }

    const ResponseError = new Error('Not acceptable')
    ResponseError.response = Response
    ResponseError.isAxiosError = true

    await expect(fulfilled(Response)).resolves.toEqual(Response)
    await expect(rejected(ResponseError)).rejects.toThrow(new ValidationError('There is a validation issue'))
  })
})
