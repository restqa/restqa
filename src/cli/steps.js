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
  const { config, tag } = program || {}

  const keywords = ['given', 'when', 'then']

  if (!keyword) {
    throw new TypeError(`Provide a keyword. Available: given | when | then`)
  }

  if (!keywords.includes(keyword.toLowerCase())) {
    throw new TypeError(`"${keyword}" is not a valid argument. Available: ${keywords.join(' | ')}`)
  }

  keyword = keyword.toLowerCase()

  const options  = {
    configFile: Config.locate({configFile: config})
  }

  const table = new Table({
    style: 'fatBorder', // style of border of the table
    columns: [
      { name: 'Plugin', alignment: 'left', color: 'green'  },
      { name: 'Keyword', alignment: 'left' },
      { name: 'Step', alignment: 'left' },
      { name: 'Comment', alignment: 'left', color: 'magenta' }
    ]
  })

  let steps = getSteps(keyword, options)

  if (tag) {
    let reg = new RegExp(tag)
    steps = steps.filter(step => {
      return step.tag.match(reg)
    })
  }

  steps.forEach(r => {
      table.addRow({
        Plugin: r.plugin,
        Keyword: keyword,
        Step: r.gerkin,
        Comment: r.comment
      })
    })
  table.printTable()
}
