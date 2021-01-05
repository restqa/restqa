const proxyquire = require('proxyquire')
const chalk = require('chalk')
const { Table } = require('console-table-printer')
const Config = require('../config')

function getSteps (keyword) {


  const result = {}

  const register = (cucumberFn, gerkin, comment) => {
    cucumberFn = cucumberFn.toLowerCase()
    result[cucumberFn] = result[cucumberFn] || []
    result[cucumberFn].push({ gerkin, comment })
  }

  const cucumber = {
    After: () => {},
    AfterAll: () => {},
    Before: () => {},
    BeforeAll: () => {},
    defineParameterType: () => {},
    setWorldConstructor: () => {},
    Given: (gerkin, fn, comment) => register('Given', gerkin, comment),
    When: (gerkin, fn, comment) => register('When', gerkin, comment),
    Then: (gerkin, fn, comment) => register('Then', gerkin, comment)
  }


  proxyquire('../setup', {
    'cucumber': cucumber
  })
  return result[keyword]
}

module.exports = function (keyword, program) {
  const { config } = program || {}

  const keywords = ['given', 'when', 'then']

  if (!keyword) {
    throw new TypeError(`Provide a keyword. Available: given | when | then`)
  }

  if (!keywords.includes(keyword.toLowerCase())) {
    throw new TypeError(`"${keyword}" is not a valid argument. Available: ${keywords.join(' | ')}`)
  }

  keyword = keyword.toLowerCase()

  process.env.RESTQA_CONFIG = Config.locate({configFile: config})


  const table = new Table({
    style: 'fatBorder', // style of border of the table
    columns: [
      { name: 'Keyword', alignment: 'left' },
      { name: 'Step', alignment: 'left' },
      { name: 'Comment', alignment: 'left', color: 'red' }
    ]
  })

  getSteps(keyword)
    .forEach(r => {
      table.addRow({
        Keyword: keyword || chalk.blue(keyword),
        Step: r.gerkin || chalk.yellow(r.gerkin),
        Comment: r.comment
      })
    })
  table.printTable()
}
