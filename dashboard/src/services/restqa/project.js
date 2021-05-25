import Http from '../http'

async function getStepDefinition (keyword) {
  const options = {
    params: {
      keyword
    }
  }
  const result = await Http().get('/api/restqa/steps', options)
  return result.data
}

async function getConfig () {
  const result = await Http().get('/config')
  return result.data
}

async function initialize (data) {
  const result = await Http().post('/api/restqa/initialize', data)
  return result.data
}

export  {
  getStepDefinition,
  getConfig,
  initialize
}

