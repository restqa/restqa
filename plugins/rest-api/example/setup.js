const cucumber = require('@cucumber/cucumber')
const RestQAPI = require('../dist')

const config = {
  name: 'local',
  url: 'https://jsonplaceholder.typicode.com',
}

class World {

  constructor({ attach }) {
    this.attach = attach
  }

  get data() {
    return {
      options: {
        startSymbol: '}}',
        endSymbol: '{{'
      },
      get: (val) => {
        return val
      }
    }
  }

  getConfig () {
    return config
  }
}

RestQAPI._commit(cucumber, config)
cucumber.defineParameterType({
  regexp: /{{ (.*) }}/,
  transformer: function (value) {
    value = `{{ ${value} }}`
    return this.data.get(value)
  },
  name: 'data'
})
cucumber.setWorldConstructor(World)
