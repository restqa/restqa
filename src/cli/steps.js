const proxyquire = require('proxyquire')
const chalk = require('chalk')
const { Table } = require('console-table-printer')

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

  const config = function () {
    return {
      environment: {
        plugins: [{
          name : 'restqapi',
          config: {}
        }]
      }

    }
  }

  proxyquire('../setup', {
    cucumber,
    helpers: { given: {}, when: {}, then: {} },
    './config': config,
    './data': function() {}
  })
  return result[keyword]
}

module.exports = function (keyword) {
  const keywords = ['given', 'when', 'then']
  if (!keywords.includes(keyword)) {
    return console.log(`The available keyword are [ ${keywords.join(' | ')} ]`)
  }
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
