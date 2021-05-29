import axios from 'axios'

export class ForbiddenError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ForbiddenError'
  }
}

export class ValidationError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ValidationError'
  }
}


function client () {

  let baseURL = ''

  if ('development' === process.env.NODE_ENV) {
    baseURL = 'http://localhost:8081'
  }

  const instance = axios.create({ 
    baseURL
  })

  instance.interceptors.response.use(function (response) {
    return Promise.resolve(response)
  }, function (error) {
    if (error.response && error.response.status) {
      switch (error.response.status) {
      case 403:
        error = new ForbiddenError(error.response.data.message)
        break
      case 406:
        error = new ValidationError(error.response.data.message)
        break
      }
    }
    return Promise.reject(error)
  })

  return instance
}


export default client

