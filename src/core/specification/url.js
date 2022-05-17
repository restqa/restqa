const _ = require('lodash')

module.exports = function(matchers = {}) {
  
  const { ids } = matchers

  function parse (path) {
    const parameters = []
    path = path.split('?').shift()
      .split('/')
      .filter(_ => _)
      .reduce((res, item, i, arr) => {
        const isId = ids.map(_ => new RegExp(_)).some(_ => _.test(item))
        if (isId && i !== 0) {
          const key = arr[i-1].replace(/s$/, '') + 'Id'
          item = '{' + key + '}'
          parameters.push(key)
        }
        return [res, item].join('/')
      }, '')

    if (path === '') {
      path = '/'
    }

    return {
      parameters,
      path
    }
  }

  function getOperation(path, method) {
    return  _.camelCase(method + path)
  }

  return {
    parse,
    getOperation
  }
}
