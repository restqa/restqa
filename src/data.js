// const got = require('got')
const RestQData = require('@restqa/restqdata')

function Data (options) {
  options = Object.assign({
    startSymbol: '{{',
    endSymbol: '}}'
  }, options)

  const matchRegexp = new RegExp(`${options.startSymbol.replace(/(?=\W)/g, '\\')}(.*)${options.endSymbol.replace(/(?=\W)/g, '\\')}`, 'g')
  const dataRegex = /(.*).(\d).(.*)/

  const data = {}

  function parse (scenario) {
    if (!options.channel) return
    let list = JSON.stringify(scenario, null, 2).match(new RegExp(matchRegexp, 'g')) || []
    list = list.map(getDataVariable)
      .filter(_ => _.match(dataRegex))
      .map(_ => _.replace(/.[^.]*$/, '')) // return an array like ['1.users']

    list = [...new Set(list)] // dedup array
    list = list.map(value => retrieve(value)) // retrieve data promises

    return Promise.all(list)
  }

  async function retrieve (value) {
    const [resource, row] = value.trim().split('.')
    const data = RestQData(options)
    const response = await data.get(resource, row)

    Object.keys(response)
      .forEach(key => {
        set(`${value}.${key}`, response[key])
      })
  }

  function getDataVariable (variable) {
    return variable
      .replace(options.startSymbol, '')
      .replace(options.endSymbol, '')
      .trim()
  }

  function get (value) {
    if (typeof value !== 'string') return value
    const properties = value.match(matchRegexp)
    if (!properties) return value

    return properties.reduce((value, item) => {
      return value.replace(item, data[getDataVariable(item)])
    }, value)
  }

  function set (property, value) {
    data[property] = value
  }

  return {
    parse,
    get,
    set
  }
}

module.exports = Data
