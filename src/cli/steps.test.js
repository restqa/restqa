const chalk = require('chalk')

const jestqa = new JestQA(__filename, true)

beforeEach(jestqa.beforeEach)
afterEach(jestqa.afterEach)

jestqa.hooks.beforeEach = () => {
  delete process.env.RESTQA_CONFIG
}

describe('#Cli - Steps', () => {
  test('Throw an error if the keyword is not passed', () => {
    const Steps = require('./steps')
    expect(() => {
      Steps()
    }).toThrow('Provide a keyword. Available: given | when | then')
  })

  test('Throw an error if the keyword is not valid', () => {
    const Steps = require('./steps')
    expect(() => {
      Steps('scenario')
    }).toThrow('"scenario" is not a valid argument. Available: given | when | then')
  })

  test('Throw an error if the output is not valid', () => {
    const Steps = require('./steps')
    expect(() => {
      Steps('Given', { output: 'foobar' })
    }).toThrow('"foobar" is not a valid output. Available: short | medium | large')
  })

  test('Throw an error if the passed environment in not in the config File', () => {
    const content = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
environments:
  - name: uat
    default: true
    plugins:
      - name: '@restqa/restqapi'
        config:
          url: http://host.docker.internal:4046
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
  - name: local
    default: true
    plugins:
      - name: '@restqa/restqapi'
        config:
          url: http://host.docker.internal:4046
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `
    const filename = jestqa.createTmpFile(content, '.restqa.yml')
    const opt = {
      env: 'prod',
      config: filename
    }
    const Steps = require('./steps')
    expect(() => {
      Steps('Given', opt)
    }).toThrow('"prod" is not an environment available in the config file, choose between : uat, local')
  })

  test('Load the steps', () => {
    const content = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
environments:
  - name: local
    default: true
    plugins:
      - name: '@restqa/restqapi'
        config:
          url: http://host.docker.internal:4046
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `
    const filename = jestqa.createTmpFile(content, '.restqa.yml')

    jest.mock('@restqa/restqapi', () => {
      return function () {
        return {
          setParameterType: () => {},
          setHooks: () => {},
          getWorld: () => {
            return class test {
            }
          },
          setSteps: function ({ Given }) {
            Given('my definition {string}', () => {}, 'my comment')
            Given('ma definition {int} and {string}', () => {}, 'mon commentaire')
          }
        }
      }
    })

    const mockAddRow = jest.fn()
    const mockPrintTable = jest.fn()
    const mockTable = jest.fn(() => {
      return {
        addRow: mockAddRow,
        printTable: mockPrintTable
      }
    })

    jest.mock('console-table-printer', () => {
      return {
        Table: mockTable
      }
    })

    const Steps = require('./steps')
    const result = Steps('Given', { config: filename })

    expect(mockTable.mock.calls).toHaveLength(1)
    expect(mockTable.mock.calls[0][0].columns[0].name).toEqual('Plugin')
    expect(mockTable.mock.calls[0][0].columns[1].name).toEqual('Keyword')
    expect(mockTable.mock.calls[0][0].columns[2].name).toEqual('Step')
    expect(mockTable.mock.calls[0][0].columns[3].name).toEqual('Comment')

    expect(mockAddRow.mock.calls).toHaveLength(2)
    expect(mockAddRow.mock.calls[0][0]).toEqual({
      Plugin: '@restqa/restqapi',
      Keyword: 'given',
      Step: `my definition ${chalk.yellow('{string}')}`,
      Comment: 'my comment'
    })

    expect(mockAddRow.mock.calls[1][0]).toEqual({
      Plugin: '@restqa/restqapi',
      Keyword: 'given',
      Step: `ma definition ${chalk.yellow('{int}')} and ${chalk.yellow('{string}')}`,
      Comment: 'mon commentaire'
    })
    expect(mockPrintTable.mock.calls).toHaveLength(1)
    expect(result).toEqual([{
      Plugin: '@restqa/restqapi',
      Keyword: 'given',
      Step: `my definition ${chalk.yellow('{string}')}`,
      Comment: 'my comment'
    }, {
      Plugin: '@restqa/restqapi',
      Keyword: 'given',
      Step: `ma definition ${chalk.yellow('{int}')} and ${chalk.yellow('{string}')}`,
      Comment: 'mon commentaire'
    }])
  })

  test('Load the steps from multiple plugin', () => {
    const content = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
environments:
  - name: local
    default: true
    plugins:
      - name: '@restqa/restqapi'
        config:
          url: http://host.docker.internal:4046
      - name: '@restqa/restqmocki'
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `
    const filename = jestqa.createTmpFile(content, '.restqa.yml')

    jest.mock('@restqa/restqapi', () => {
      return function () {
        return {
          setParameterType: () => {},
          setHooks: () => {},
          getWorld: () => {
            return class test {
            }
          },
          setSteps: function ({ Then }) {
            Then('my definition', () => {}, 'my comment')
            Then('ma definition', () => {}, 'mon commentaire')
          }
        }
      }
    })

    jest.mock('@restqa/restqmocki', () => {
      return function () {
        return {
          setParameterType: () => {},
          setHooks: () => {},
          getWorld: () => {
            return class test {
            }
          },
          setSteps: function ({ Then }) {
            Then('ma definition de mock', () => {}, 'mon commentaire de mock')
          }
        }
      }
    }, { virtual: true })

    jest.mock('../config/schema', () => {
      const originalModule = jest.requireActual('../config/schema')

      return {
        validate: originalModule.validate,
        pluginList: [
          'restqapi',
          'restqmock'
        ]
      }
    })

    const mockAddRow = jest.fn()
    const mockPrintTable = jest.fn()
    const mockTable = jest.fn(() => {
      return {
        addRow: mockAddRow,
        printTable: mockPrintTable
      }
    })

    jest.mock('console-table-printer', () => {
      return {
        Table: mockTable
      }
    })

    const Steps = require('./steps')
    const result = Steps('Then', { config: filename })

    expect(mockTable.mock.calls).toHaveLength(1)
    expect(mockTable.mock.calls[0][0].columns[0].name).toEqual('Plugin')
    expect(mockTable.mock.calls[0][0].columns[1].name).toEqual('Keyword')
    expect(mockTable.mock.calls[0][0].columns[2].name).toEqual('Step')
    expect(mockTable.mock.calls[0][0].columns[3].name).toEqual('Comment')

    expect(mockAddRow.mock.calls).toHaveLength(3)
    expect(mockAddRow.mock.calls[0][0]).toEqual({
      Plugin: '@restqa/restqapi',
      Keyword: 'then',
      Step: 'my definition',
      Comment: 'my comment'
    })

    expect(mockAddRow.mock.calls[1][0]).toEqual({
      Plugin: '@restqa/restqapi',
      Keyword: 'then',
      Step: 'ma definition',
      Comment: 'mon commentaire'
    })

    expect(mockAddRow.mock.calls[2][0]).toEqual({
      Plugin: '@restqa/restqmocki',
      Keyword: 'then',
      Step: 'ma definition de mock',
      Comment: 'mon commentaire de mock'
    })
    expect(mockPrintTable.mock.calls).toHaveLength(1)
    expect(result).toEqual([{
      Plugin: '@restqa/restqapi',
      Keyword: 'then',
      Step: 'my definition',
      Comment: 'my comment'
    }, {
      Plugin: '@restqa/restqapi',
      Keyword: 'then',
      Step: 'ma definition',
      Comment: 'mon commentaire'
    }, {
      Plugin: '@restqa/restqmocki',
      Keyword: 'then',
      Step: 'ma definition de mock',
      Comment: 'mon commentaire de mock'
    }])
  })

  test('Load the steps from multiple plugin but selecting the environment (output: short)', () => {
    const content = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
environments:
  - name: local
    default: true
    plugins:
      - name: '@restqa/restqapi'
        config:
          url: http://host.docker.internal:4046
      - name: '@restqa/restqmocki'
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
  - name: prod
    default: true
    plugins:
      - name: '@restqa/restqmocki'
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `
    const filename = jestqa.createTmpFile(content, '.restqa.yml')

    jest.mock('@restqa/restqmocki', () => {
      return function () {
        return {
          setParameterType: () => {},
          setHooks: () => {},
          getWorld: () => {
            return class test {
            }
          },
          setSteps: function ({ Then }) {
            Then('ma definition de mock', () => {}, 'mon commentaire de mock')
          }
        }
      }
    }, { virtual: true })

    const mockAddRow = jest.fn()
    const mockPrintTable = jest.fn()
    const mockTable = jest.fn(() => {
      return {
        addRow: mockAddRow,
        printTable: mockPrintTable
      }
    })

    jest.mock('console-table-printer', () => {
      return {
        Table: mockTable
      }
    })

    const Steps = require('./steps')
    const opt = {
      config: filename,
      env: 'prod',
      output: 'short'
    }
    const result = Steps('Then', opt)

    expect(mockTable.mock.calls).toHaveLength(1)
    expect(mockTable.mock.calls[0][0].columns).toHaveLength(2)
    expect(mockTable.mock.calls[0][0].columns[0].name).toEqual('Keyword')
    expect(mockTable.mock.calls[0][0].columns[1].name).toEqual('Step')

    expect(mockAddRow.mock.calls).toHaveLength(1)
    expect(mockAddRow.mock.calls[0][0]).toEqual({
      Keyword: 'then',
      Step: 'ma definition de mock'
    })
    expect(mockPrintTable.mock.calls).toHaveLength(1)
    expect(result).toEqual([{
      Keyword: 'then',
      Step: 'ma definition de mock'
    }])
  })

  test('Load the steps from multiple plugin but selecting the environment (output: medium)', () => {
    const content = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
environments:
  - name: local
    default: true
    plugins:
      - name: '@restqa/restqapi'
        config:
          url: http://host.docker.internal:4046
      - name: '@restqa/restqmocki'
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
  - name: prod
    default: true
    plugins:
      - name: '@restqa/restqmocki'
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `
    const filename = jestqa.createTmpFile(content, '.restqa.yml')

    jest.mock('@restqa/restqmocki', () => {
      return function () {
        return {
          setParameterType: () => {},
          setHooks: () => {},
          getWorld: () => {
            return class test {
            }
          },
          setSteps: function ({ Then }) {
            Then('ma definition de mock', () => {}, 'mon commentaire de mock')
          }
        }
      }
    }, { virtual: true })

    const mockAddRow = jest.fn()
    const mockPrintTable = jest.fn()
    const mockTable = jest.fn(() => {
      return {
        addRow: mockAddRow,
        printTable: mockPrintTable
      }
    })

    jest.mock('console-table-printer', () => {
      return {
        Table: mockTable
      }
    })

    const Steps = require('./steps')
    const opt = {
      config: filename,
      env: 'prod',
      output: 'medium'
    }
    const result = Steps('Then', opt)

    expect(mockTable.mock.calls).toHaveLength(1)
    expect(mockTable.mock.calls[0][0].columns).toHaveLength(3)
    expect(mockTable.mock.calls[0][0].columns[0].name).toEqual('Plugin')
    expect(mockTable.mock.calls[0][0].columns[1].name).toEqual('Keyword')
    expect(mockTable.mock.calls[0][0].columns[2].name).toEqual('Step')

    expect(mockAddRow.mock.calls).toHaveLength(1)
    expect(mockAddRow.mock.calls[0][0]).toEqual({
      Plugin: '@restqa/restqmocki',
      Keyword: 'then',
      Step: 'ma definition de mock'
    })
    expect(mockPrintTable.mock.calls).toHaveLength(1)
    expect(result).toEqual([{
      Plugin: '@restqa/restqmocki',
      Keyword: 'then',
      Step: 'ma definition de mock'
    }])
  })

  test('Load the steps from multiple plugin but selecting the environment (output: large)', () => {
    const content = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
environments:
  - name: local
    default: true
    plugins:
      - name: '@restqa/restqapi'
        config:
          url: http://host.docker.internal:4046
      - name: '@restqa/restqmocki'
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
  - name: prod
    default: true
    plugins:
      - name: '@restqa/restqmocki'
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `
    const filename = jestqa.createTmpFile(content, '.restqa.yml')

    jest.mock('@restqa/restqmocki', () => {
      return function () {
        return {
          setParameterType: () => {},
          setHooks: () => {},
          getWorld: () => {
            return class test {
            }
          },
          setSteps: function ({ Then }) {
            Then('ma definition de mock', () => {}, 'mon commentaire de mock')
          }
        }
      }
    }, { virtual: true })

    const mockAddRow = jest.fn()
    const mockPrintTable = jest.fn()
    const mockTable = jest.fn(() => {
      return {
        addRow: mockAddRow,
        printTable: mockPrintTable
      }
    })

    jest.mock('console-table-printer', () => {
      return {
        Table: mockTable
      }
    })

    const Steps = require('./steps')
    const opt = {
      config: filename,
      env: 'prod',
      output: 'large'
    }
    const result = Steps('Then', opt)

    expect(mockTable.mock.calls).toHaveLength(1)
    expect(mockTable.mock.calls[0][0].columns).toHaveLength(4)
    expect(mockTable.mock.calls[0][0].columns[0].name).toEqual('Plugin')
    expect(mockTable.mock.calls[0][0].columns[1].name).toEqual('Keyword')
    expect(mockTable.mock.calls[0][0].columns[2].name).toEqual('Step')
    expect(mockTable.mock.calls[0][0].columns[3].name).toEqual('Comment')

    expect(mockAddRow.mock.calls).toHaveLength(1)
    expect(mockAddRow.mock.calls[0][0]).toEqual({
      Plugin: '@restqa/restqmocki',
      Keyword: 'then',
      Step: 'ma definition de mock',
      Comment: 'mon commentaire de mock'
    })
    expect(mockPrintTable.mock.calls).toHaveLength(1)
    expect(result).toEqual([{
      Plugin: '@restqa/restqmocki',
      Keyword: 'then',
      Step: 'ma definition de mock',
      Comment: 'mon commentaire de mock'
    }])
  })

  test('Load the steps from multiple plugin but no output selected', () => {
    const content = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
environments:
  - name: local
    default: true
    plugins:
      - name: '@restqa/restqapi'
        config:
          url: http://host.docker.internal:4046
      - name: '@restqa/restqmocki'
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
  - name: prod
    default: true
    plugins:
      - name: '@restqa/restqmocki'
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `
    const filename = jestqa.createTmpFile(content, '.restqa.yml')

    jest.mock('@restqa/restqmocki', () => {
      return function () {
        return {
          setParameterType: () => {},
          setHooks: () => {},
          getWorld: () => {
            return class test {
            }
          },
          setSteps: function ({ Then }) {
            Then('ma definition de mock', () => {}, 'mon commentaire de mock')
          }
        }
      }
    }, { virtual: true })

    const mockAddRow = jest.fn()
    const mockPrintTable = jest.fn()
    const mockTable = jest.fn(() => {
      return {
        addRow: mockAddRow,
        printTable: mockPrintTable
      }
    })

    jest.mock('console-table-printer', () => {
      return {
        Table: mockTable
      }
    })

    const Steps = require('./steps')
    const opt = {
      config: filename,
      env: 'prod'
    }
    const result = Steps('Then', opt)

    expect(mockTable.mock.calls).toHaveLength(1)
    expect(mockTable.mock.calls[0][0].columns).toHaveLength(4)
    expect(mockTable.mock.calls[0][0].columns[0].name).toEqual('Plugin')
    expect(mockTable.mock.calls[0][0].columns[1].name).toEqual('Keyword')
    expect(mockTable.mock.calls[0][0].columns[2].name).toEqual('Step')
    expect(mockTable.mock.calls[0][0].columns[3].name).toEqual('Comment')

    expect(mockAddRow.mock.calls).toHaveLength(1)
    expect(mockAddRow.mock.calls[0][0]).toEqual({
      Plugin: '@restqa/restqmocki',
      Keyword: 'then',
      Step: 'ma definition de mock',
      Comment: 'mon commentaire de mock'
    })
    expect(mockPrintTable.mock.calls).toHaveLength(1)
    expect(result).toEqual([{
      Plugin: '@restqa/restqmocki',
      Keyword: 'then',
      Step: 'ma definition de mock',
      Comment: 'mon commentaire de mock'
    }])
  })

  test('Load the steps search tags and no print', () => {
    const content = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
environments:
  - name: local
    default: true
    plugins:
      - name: '@restqa/restqapi'
        config:
          url: http://host.docker.internal:4046
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `
    const filename = jestqa.createTmpFile(content, '.restqa.yml')

    jest.mock('@restqa/restqapi', () => {
      return function () {
        return {
          setParameterType: () => {},
          setHooks: () => {},
          getWorld: () => {
            return class test {
            }
          },
          setSteps: function ({ Given }) {
            Given('my definition', () => {}, 'my comment', 'header')
            Given('my definitions', () => {}, 'my comments', 'headers')
            Given('ma definition', () => {}, 'mon commentaire', 'api')
          }
        }
      }
    })

    const mockAddRow = jest.fn()
    const mockPrintTable = jest.fn()
    const mockTable = jest.fn(() => {
      return {
        addRow: mockAddRow,
        printTable: mockPrintTable
      }
    })

    jest.mock('console-table-printer', () => {
      return {
        Table: mockTable
      }
    })

    const Steps = require('./steps')
    const result = Steps('Given', { config: filename, tag: 'header', print: false })

    expect(mockTable.mock.calls).toHaveLength(1)
    expect(mockTable.mock.calls[0][0].columns[0].name).toEqual('Plugin')
    expect(mockTable.mock.calls[0][0].columns[1].name).toEqual('Keyword')
    expect(mockTable.mock.calls[0][0].columns[2].name).toEqual('Step')
    expect(mockTable.mock.calls[0][0].columns[3].name).toEqual('Comment')

    expect(mockAddRow.mock.calls).toHaveLength(2)
    expect(mockAddRow.mock.calls[0][0]).toEqual({
      Plugin: '@restqa/restqapi',
      Keyword: 'given',
      Step: 'my definition',
      Comment: 'my comment'
    })

    expect(mockAddRow.mock.calls[1][0]).toEqual({
      Plugin: '@restqa/restqapi',
      Keyword: 'given',
      Step: 'my definitions',
      Comment: 'my comments'
    })

    expect(mockPrintTable.mock.calls).toHaveLength(0)
    expect(result).toEqual([{
      Plugin: '@restqa/restqapi',
      Keyword: 'given',
      Step: 'my definition',
      Comment: 'my comment'
    }, {
      Plugin: '@restqa/restqapi',
      Keyword: 'given',
      Step: 'my definitions',
      Comment: 'my comments'
    }])
  })
})
