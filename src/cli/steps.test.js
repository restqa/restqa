const fs = require('fs')
let filename

afterEach(() => {
  jest.resetModules()
  if (filename && fs.existsSync(filename)) {
    fs.unlinkSync(filename)
  }
})

beforeEach(() => {
  delete process.env.RESTQA_CONFIG
  if (filename && fs.existsSync(filename)) {
    fs.unlinkSync(filename)
    filename = undefined
  }
})

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
      - name: restqapi
        config:
          url: http://host.docker.internal:4046
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `
    filename = `/tmp/.restqa.yml`
    fs.writeFileSync(filename, content)

    /*****
     *  Some mock headach due to fact that jest is not compatible with proxyquire : https://github.com/facebook/jest/issues/1937
     */
    let mockOfMockCucumber

    jest.mock('proxyquire', () =>  {
      return function(file, { cucumber }) {
        mockOfMockCucumber = cucumber
        require(file)
      }
    })

    jest.mock('cucumber', () =>  {
      return {
        After: () => {},
        AfterAll: () => {},
        Before: () => {},
        BeforeAll: () => {},
        defineParameterType: () => {},
        setWorldConstructor: () => {},
        Given: (gerkin, fn, comment) => mockOfMockCucumber.Given(gerkin, fn, comment),
        When: (gerkin, fn, comment) => mockOfMockCucumber.When(gerkin, fn, comment),
        Then: (gerkin, fn, comment) => mockOfMockCucumber.ThenGiven(gerkin, fn, comment),
      }
    })

    jest.mock('@restqa/restqapi', () =>  {
      return function() {
        return {
          setParameterType: () => {},
          setHooks: () => {},
          getWorld: () => {
            return class test {
            }
          },
          setSteps: function({ Given }) {
            Given('my definition', () => {}, 'my comment')
            Given('ma definition', () => {}, 'mon commentaire')
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

    jest.mock('console-table-printer', () =>  {
      return {
        Table: mockTable
      }
    })
    

    const Steps = require('./steps')
    Steps('Given', { config: filename })

    expect(mockTable.mock.calls.length).toBe(1)
    expect(mockTable.mock.calls[0][0].columns[0].name).toEqual('Keyword')
    expect(mockTable.mock.calls[0][0].columns[1].name).toEqual('Step')
    expect(mockTable.mock.calls[0][0].columns[2].name).toEqual('Comment')

    expect(mockAddRow.mock.calls.length).toBe(2)
    expect(mockAddRow.mock.calls[0][0]).toEqual({
      Keyword: 'given',
      Step: 'my definition',
      Comment: 'my comment'
    })

    expect(mockAddRow.mock.calls[1][0]).toEqual({
      Keyword: 'given',
      Step: 'ma definition',
      Comment: 'mon commentaire'
    })
    expect(mockPrintTable.mock.calls.length).toBe(1)
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
      - name: restqapi
        config:
          url: http://host.docker.internal:4046
      - name: restqmocki
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `
    filename = `/tmp/.restqa-multiple.yml`
    fs.writeFileSync(filename, content)

    /*****
     *  Some mock headach due to fact that jest is not compatible with proxyquire : https://github.com/facebook/jest/issues/1937
     */
    let mockOfMockCucumber

    jest.mock('proxyquire', () =>  {
      return function(file, { cucumber }) {
        mockOfMockCucumber = cucumber
        require(file)
      }
    })

    jest.mock('cucumber', () =>  {
      return {
        After: () => {},
        AfterAll: () => {},
        Before: () => {},
        BeforeAll: () => {},
        defineParameterType: () => {},
        setWorldConstructor: () => {},
        Given: (gerkin, fn, comment) => mockOfMockCucumber.Given(gerkin, fn, comment),
        When: (gerkin, fn, comment) => mockOfMockCucumber.When(gerkin, fn, comment),
        Then: (gerkin, fn, comment) => mockOfMockCucumber.Then(gerkin, fn, comment),
      }
    })

    jest.mock('@restqa/restqapi', () =>  {
      return function() {
        return {
          setParameterType: () => {},
          setHooks: () => {},
          getWorld: () => {
            return class test {
            }
          },
          setSteps: function({ Then }) {
            Then('my definition', () => {}, 'my comment')
            Then('ma definition', () => {}, 'mon commentaire')
          }
        }
      }
    })

    jest.mock('@restqa/restqmocki', () =>  {
      return function() {
        return {
          setParameterType: () => {},
          setHooks: () => {},
          getWorld: () => {
            return class test {
            }
          },
          setSteps: function({ Then }) {
            Then('ma definition de mock', () => {}, 'mon commentaire de mock')
          }
        }
      }
    }, {virtual: true})

    jest.mock('../config/schema', () => {
      const originalModule = jest.requireActual('../config/schema');

      return {
        validate: originalModule.validate,
        pluginList: [
         'restqapi',
         'restqmock'
        ]
      };
    });

    const mockAddRow = jest.fn()
    const mockPrintTable = jest.fn()
    const mockTable = jest.fn(() => {
      return {
        addRow: mockAddRow,
        printTable: mockPrintTable
      }
    })

    jest.mock('console-table-printer', () =>  {
      return {
        Table: mockTable
      }
    })
    

    const Steps = require('./steps')
    Steps('Then', { config: filename })

    expect(mockTable.mock.calls.length).toBe(1)
    expect(mockTable.mock.calls[0][0].columns[0].name).toEqual('Keyword')
    expect(mockTable.mock.calls[0][0].columns[1].name).toEqual('Step')
    expect(mockTable.mock.calls[0][0].columns[2].name).toEqual('Comment')

    expect(mockAddRow.mock.calls.length).toBe(3)
    expect(mockAddRow.mock.calls[0][0]).toEqual({
      Keyword: 'then',
      Step: 'my definition',
      Comment: 'my comment'
    })

    expect(mockAddRow.mock.calls[1][0]).toEqual({
      Keyword: 'then',
      Step: 'ma definition',
      Comment: 'mon commentaire'
    })

    expect(mockAddRow.mock.calls[2][0]).toEqual({
      Keyword: 'then',
      Step: 'ma definition de mock',
      Comment: 'mon commentaire de mock'
    })
    expect(mockPrintTable.mock.calls.length).toBe(1)
  })

})

  test('Load the steps search tags', () => {
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
      - name: restqapi
        config:
          url: http://host.docker.internal:4046
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `
    filename = `/tmp/.restqa-tag.yml`
    fs.writeFileSync(filename, content)

    /*****
     *  Some mock headach due to fact that jest is not compatible with proxyquire : https://github.com/facebook/jest/issues/1937
     */
    let mockOfMockCucumber

    jest.mock('proxyquire', () =>  {
      return function(file, { cucumber }) {
        mockOfMockCucumber = cucumber
        require(file)
      }
    })

    jest.mock('cucumber', () =>  {
      return {
        After: () => {},
        AfterAll: () => {},
        Before: () => {},
        BeforeAll: () => {},
        defineParameterType: () => {},
        setWorldConstructor: () => {},
        Given: (gerkin, fn, comment, tags) => mockOfMockCucumber.Given(gerkin, fn, comment, tags),
        When: (gerkin, fn, comment, tags) => mockOfMockCucumber.When(gerkin, fn, comment, tags),
        Then: (gerkin, fn, comment, tags) => mockOfMockCucumber.ThenGiven(gerkin, fn, comment, tags),
      }
    })

    jest.mock('@restqa/restqapi', () =>  {
      return function() {
        return {
          setParameterType: () => {},
          setHooks: () => {},
          getWorld: () => {
            return class test {
            }
          },
          setSteps: function({ Given }) {
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

    jest.mock('console-table-printer', () =>  {
      return {
        Table: mockTable
      }
    })
    

    const Steps = require('./steps')
    Steps('Given', { config: filename, tag: 'header'})

    expect(mockTable.mock.calls.length).toBe(1)
    expect(mockTable.mock.calls[0][0].columns[0].name).toEqual('Keyword')
    expect(mockTable.mock.calls[0][0].columns[1].name).toEqual('Step')
    expect(mockTable.mock.calls[0][0].columns[2].name).toEqual('Comment')

    expect(mockAddRow.mock.calls.length).toBe(2)
    expect(mockAddRow.mock.calls[0][0]).toEqual({
      Keyword: 'given',
      Step: 'my definition',
      Comment: 'my comment'
    })

    expect(mockAddRow.mock.calls[1][0]).toEqual({
      Keyword: 'given',
      Step: 'my definitions',
      Comment: 'my comments'
    })

    expect(mockPrintTable.mock.calls.length).toBe(1)
  })
