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

async function getFeatures() {
  const { data } = await Http().get('/api/project/features')
  let result = [];
  let level = { result }
  
  data.forEach(path => {
    path.split('/').reduce((r, name) => {
      if(!r[name]) {
        r[name] = {result: []}
        const obj = {
          label: name,
          children: r[name].result,
        }

        if (path.split('/').pop() === name) obj.filename =  path
        r.result.push(obj)
      }
      return r[name]
    }, level)
  })
  return result
}

async function getFeatureFile(name) {
  const { data } = await Http().get('/api/project/features/' + name)
  return data
}

async function testFeature(path) {
  const { data } = await Http().post('/api/restqa/run', { path })
  return {
    path,
    data
  }
}

export  {
  getStepDefinition,
  getConfig,
  initialize,
  getFeatures,
  getFeatureFile,
  testFeature
}

