module.exports = class {
  constructor (options, provider) {
    this._processors = {}
    this._provider = provider
    this._options = Object.assign({
      startSymbol: '{{',
      endSymbol: '}}'
    }, options)

    if (this._options.startSymbol.length !== 2) {
      throw new Error('The startSymbol should contains 2 charaters')
    }

    if (this._options.endSymbol.length !== 2) {
      throw new Error('The endSymbol should contains 2 charaters')
    }

    const o = {
      start: `\\${this._options.startSymbol[0]}\\${this._options.startSymbol[1]}([^${'\\' + this._options.startSymbol[0]}`,
      end: `\\${this._options.endSymbol[0]}]+)\\${this._options.endSymbol[0]}\\${this._options.endSymbol[1]}`
    }

    this.matchRegexp = new RegExp(`${o.start}${o.end}`) // Build a regex like : /\{\{([^\{\}]+)\}\}/ to match all the values with placeholders
    this.dataRegex = /(.*).(\d).(.*)/

    this.store = {}
  }

  set provider (value) {
    this._provider = value
  }

  get provider () {
    return this._provider
  }

  addProcessor (key, fn) {
    this._processors[key] = fn
  }

  async parse (scenario) {
    if (!this._options.channel) return
    let list = JSON
      .stringify(scenario, null, 2)
      .match(new RegExp(this.matchRegexp, 'g'))
    list = (list || []).map(el => this.getDataVariable(el))
      .filter(_ => _.match(this.dataRegex))
      .map(_ => _.replace(/.[^.]*$/, '')) // return an array like ['1.users']

    list = [...new Set(list)] // dedup array
    const result = this.fetch(list)
    for await (const entity of result) {
      this.set(entity.key, entity.value)
    }
  }

  async * fetch (list) {
    for (const value of list) {
      const [resource, row] = value.trim().split('.')
      const response = await this.provider.get(resource, row)
      for (const key in response) {
        yield {
          key: `${value}.${key}`,
          value: response[key]
        }
      }
    }
  }

  get options () {
    return this._options
  }

  set (property, value) {
    this.store[property] = value
  }

  get (value) {
    if (typeof value !== 'string') return value
    const properties = value.match(new RegExp(this.matchRegexp.source, 'g'))
    if (!properties) return value

    return properties.reduce((value, item) => {
      const key = this.getDataVariable(item)

      if (Object.keys(this._processors).length) {
        const propSplit = key.split('.')
        const processedData = this._processors[propSplit[0]] && this._processors[propSplit[0]](propSplit.slice(1).join('.'))
        if (processedData) return processedData
      }

      const found = this.store[key]
      if (value === item && found && !Number.isNaN(found)) {
        return found
      }
      return value.replace(item, found || item)
    }, value)
  }

  getDataVariable (variable) {
    return variable
      .replace(this._options.startSymbol, '')
      .replace(this._options.endSymbol, '')
      .trim()
  }

  getFile (filename) {
    return this.provider && this.provider.storage.get(filename)
  }
}
