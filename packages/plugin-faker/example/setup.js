const cucumber = require('@cucumber/cucumber')
const RestQAFaker = require('../src/index')


class World {

  constructor({ attach }) {
    this.attach = attach
    this._data = {}
  }

  get data() {
    return {
      options: {
        startSymbol: '}}',
        endSymbol: '{{'
      },
      get: (key) => {
        return this._data[key]
      },
      set: (key, val) => {
        this._data[key] = val
      },
      addProcessor: () => {}
    }
  }

  getConfig () {
    return {
      name: 'local',
      url: 'https://jsonplaceholder.typicode.com',
      performance: {
        tool: 'artillery'
      }
    }
  }
}

RestQAFaker._commit(cucumber, {})

cucumber.defineParameterType({
  regexp: /{{ (.*) }}/,
  transformer: function (value) {
    value = `{{ ${value} }}`
    return this.data.get(value)
  },
  name: 'data'
})
cucumber.setWorldConstructor(World)
