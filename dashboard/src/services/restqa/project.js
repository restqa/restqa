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

export  {
  getStepDefinition
}

