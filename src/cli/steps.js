const { Table } = require('console-table-printer')
const Config = require('../config')
const Bootstrap = require('../bootstrap')

function getSteps (keyword, options) {
  const result = {}

  const register = (cucumberFn, gerkin, comment, tag) => {
    cucumberFn = cucumberFn.toLowerCase()
    result[cucumberFn] = result[cucumberFn] || []
    result[cucumberFn].push({
      gerkin,
      comment,
      tag,
      plugin: options.plugin
    })
  }

  const cucumber = {
    After: () => {},
    AfterAll: () => {},
    Before: () => {},
    BeforeAll: () => {},
    defineParameterType: () => {},
    setWorldConstructor: () => {},
    Given: (gerkin, fn, comment, tag) => register('Given', gerkin, comment, tag),
    When: (gerkin, fn, comment, tag) => register('When', gerkin, comment, tag),
    Then: (gerkin, fn, comment, tag) => register('Then', gerkin, comment, tag)
  }

  Bootstrap(cucumber, options)

  return result[keyword]
}

module.exports = function (keyword, program) {
  let { config, tag, print, env } = program || {}

  print = (undefined === print) ? true : print

  const keywords = ['given', 'when', 'then']

  if (!keyword) {
    throw new TypeError('Provide a keyword. Available: given | when | then')
  }

  if (!keywords.includes(keyword.toLowerCase())) {
    throw new TypeError(`"${keyword}" is not a valid argument. Available: ${keywords.join(' | ')}`)
  }

  keyword = keyword.toLowerCase()

  const options = {
    configFile: Config.locate({ configFile: config }),
    env
  }

  if (options.env) {
    const restqaConfig = Config.raw({ configFile: config })
    if (restqaConfig.environments.findIndex(_ => _.name === env) === -1) {
      throw new Error(`"${options.env}" is not an environment available in the config file, choose between : ${restqaConfig.environments.map(_ => _.name).join(', ')}`)
    }
  }

  const table = new Table({
    style: 'fatBorder', // style of border of the table
    columns: [
      { name: 'Plugin', alignment: 'left', color: 'green' },
      { name: 'Keyword', alignment: 'left' },
      { name: 'Step', alignment: 'left' },
      { name: 'Comment', alignment: 'left', color: 'magenta' }
    ]
  })

  let steps = getSteps(keyword, options)

  if (tag) {
    const reg = new RegExp(tag)
    steps = steps.filter(step => {
      return step.tag.match(reg)
    })
  }

  const result = steps.map(r => {
    const el = {
      Plugin: r.plugin,
      Keyword: keyword,
      Step: r.gerkin,
      Comment: r.comment
    }
    table.addRow(el)
    return el
  })

  if (print === true) {
    table.printTable()
  }
  return result
}
