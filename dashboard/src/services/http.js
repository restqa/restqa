import axios from 'axios'

function client () {

  let baseURL = ''

  if ('development' === process.env.NODE_ENV) {
    baseURL = 'http://localhost:8081'
  }

  return axios.create({ 
    baseURL
  })
}

export default client
