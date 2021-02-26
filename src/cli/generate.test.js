const fs = require('fs')
const filename = process.cwd() + '/test.feature'

afterEach(() => {
    jest.resetModules()
    jest.resetAllMocks()
    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename)
    }
})

beforeEach(() => {
    global.console = {
      log: jest.fn(),
      error: jest.fn()
    }
    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename)
    }
})


describe('# cli - generator', () => {
    test('Throw an error if the command is not a curl command', () => {
      const Generate = require('./generate')
      const program = {
        args: [
          'ls',
          '-lah'
        ]
      }
      return expect(Generate(program)).rejects.toThrow('You need to provide a curl command for me to generate an awesome scenario')
    })

    test('Throw an error if curl options are not supported', () => {
      const Generate = require('./generate')
      const program = {
        args: [
          'curl',
          'http://www.example.com',
          '--proxy-tlsauthtype',
          'someting',
        ]
      }
      return expect(Generate(program)).rejects.toThrow('The curl options "--proxy-tlsauthtype" is not supported')
    })
    
    test('Throw an error if curl options are not supported and the URL at the end', () => {
      const Generate = require('./generate')
      const program = {
        args: [
          'curl',
          '--proxy-tlsauthtype',
          'someting',
          'http://www.example.com'
        ]
      }
      return expect(Generate(program)).rejects.toThrow('The curl options "--proxy-tlsauthtype" is not supported')
    })

    test('Throw an error if curl options are not supported and the URL at the middle', () => {
      const Generate = require('./generate')
      const program = {
        args: [
          'curl',
          '--proxy-tlsauthtype',
          'someting',
          'http://www.example.com',
          'k'
        ]
      }
      return expect(Generate(program)).rejects.toThrow('The curl options "--proxy-tlsauthtype" is not supported')
    })

    test('Throw an error if curl command does not contain an url', () => {
      const Generate = require('./generate')
      const program = {
        args: [
          'curl',
          '-k',
          '-H',
          'content-type: application/json'
        ]
      }
      expect(Generate(program)).rejects.toThrow('You need to provide an url into your curl command')
    })

    test('Get the Scenario with json request body', async () => {
      let resultScenario = `
        Given I have an example
      `
      let mockGenerator = jest.fn().mockReturnValue(resultScenario)
      
      jest.mock('@restqa/restqapi', () => ({
        Generator: mockGenerator
      }))
      const Generate = require('./generate')
      const program = {
        args: [
          'curl',
          '-H',
          'x-correlation-id: e2e-test-79477561-6025-4205-80fa-1c8bdfa0c559',
          '-H',
          'authorization: Bearer xxx-yyy-zzz-aaa-bbb',
          '-H',
          'accept: application/json',
          '-H',
          'content-type: application/json:test',
          '--data-binary',
          '{"lead":{"id":"9754"}}',
          '--compressed',
          'https://examples/quotes/legacy/bw15',
          '-k',
          '-X',
          'POST'
        ]
      }
      let result = await Generate(program)
      expect(result).toEqual(resultScenario)
      let expectOptions = {
        url: 'https://examples/quotes/legacy/bw15',
        headers: {
          'x-correlation-id': 'e2e-test-79477561-6025-4205-80fa-1c8bdfa0c559',
          'authorization': 'Bearer xxx-yyy-zzz-aaa-bbb',
          'accept': 'application/json',
          'content-type': 'application/json:test',
        },
        method: 'POST',
        body: {
          "lead":{
            "id":"9754"
          }
        },
        isJson: true,
        ignoreSsl: true
      }
      expect(mockGenerator.mock.calls.length).toBe(1)
      expect(mockGenerator.mock.calls[0][0]).toEqual(expectOptions)

    })

    test('Get the Scenario with only cookies set', async () => {
      let resultScenario = `
        Given I have an example
      `
      let mockGenerator = jest.fn().mockReturnValue(resultScenario)
      
      jest.mock('@restqa/restqapi', () => ({
        Generator: mockGenerator
      }))
      const Generate = require('./generate')
      const program = {
        args: [
          'curl',
          '--cookie',
          'my-chocolate-cookie',
          'https://examples/quotes/legacy/bw15'
        ]
      }
      let result = await Generate(program)
      expect(result).toEqual(resultScenario)
      let expectOptions = {
        url: 'https://examples/quotes/legacy/bw15',
        headers: {
          'cookie': 'my-chocolate-cookie',
        },
        isJson: false
      }
      expect(mockGenerator.mock.calls.length).toBe(1)
      expect(mockGenerator.mock.calls[0][0]).toEqual(expectOptions)
    })

    test('Get the Scenario with json request body but not method specified into the command', async () => {
      let resultScenario = `
        Given I have an example
      `
      let mockGenerator = jest.fn().mockReturnValue(resultScenario)
      
      jest.mock('@restqa/restqapi', () => ({
        Generator: mockGenerator
      }))
      const Generate = require('./generate')
      const program = {
        args: [
          'curl',
          '--user-agent',
          'my test',
          '--cookie',
          'my-chocolate-cookie',
          '-H',
          'x-correlation-id: e2e-test-79477561-6025-4205-80fa-1c8bdfa0c559',
          '-H',
          'authorization: Bearer xxx-yyy-zzz-aaa-bbb',
          '-H',
          'accept: application/json',
          '-H',
          'content-type: application/json:test',
          '--data-binary',
          '{"lead":{"id":"9754"}}',
          '--compressed',
          'https://examples/quotes/legacy/bw15'
        ]
      }
      let result = await Generate(program)
      expect(result).toEqual(resultScenario)
      let expectOptions = {
        url: 'https://examples/quotes/legacy/bw15',
        headers: {
          'x-correlation-id': 'e2e-test-79477561-6025-4205-80fa-1c8bdfa0c559',
          'authorization': 'Bearer xxx-yyy-zzz-aaa-bbb',
          'accept': 'application/json',
          'content-type': 'application/json:test',
          'user-agent': 'my test',
          'cookie': 'my-chocolate-cookie',
        },
        method: 'POST',
        body: {
          "lead":{
            "id":"9754"
          }
        },
        isJson: true
      }
      expect(mockGenerator.mock.calls.length).toBe(1)
      expect(mockGenerator.mock.calls[0][0]).toEqual(expectOptions)
    })

    test('Get the Scenario with json request body with basic authent user and specify url as option', async () => {
      let resultScenario = `
        Given I have an example
      `
      let mockGenerator = jest.fn().mockReturnValue(resultScenario)
      
      jest.mock('@restqa/restqapi', () => ({
        Generator: mockGenerator
      }))
      const Generate = require('./generate')
      const program = {
        args: [
          'curl',
          '--user',
          'test:test',
          '-H',
          'accept: application/json',
          '-H',
          'content-type: application/json:test',
          '--data-binary',
          '{"lead":{"id":"9754"}}',
          '--compressed',
          '--url',
          'https://examples/quotes/legacy/bw15',
          '-XPATCH'
        ]
      }
      let result = await Generate(program)
      expect(result).toEqual(resultScenario)
      let expectOptions = {
        url: 'https://examples/quotes/legacy/bw15',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json:test',
        },
        method: 'PATCH',
        body: {
          "lead":{
            "id":"9754"
          }
        },
        user: {
          username: 'test',
          password: 'test'
        },
        isJson: true
      }
      expect(mockGenerator.mock.calls.length).toBe(1)
      expect(mockGenerator.mock.calls[0][0]).toEqual(expectOptions)
    })

    test('Get the Scenario with json request body (--data)', async () => {
      let resultScenario = `
        Given I have an example
      `
      let mockGenerator = jest.fn().mockReturnValue(resultScenario)
      
      jest.mock('@restqa/restqapi', () => ({
        Generator: mockGenerator
      }))
      const Generate = require('./generate')
      const program = {
        args: [
          'curl',
          '-H',
          'accept: application/json',
          '-H',
          'content-type: application/json:test',
          '--data',
          '{"lead":{"id":"9754"}}',
          '--compressed',
          '--url',
          'https://examples/quotes/legacy/bw15',
          '-XPATCH'
        ]
      }
      let result = await Generate(program)
      expect(result).toEqual(resultScenario)
      let expectOptions = {
        url: 'https://examples/quotes/legacy/bw15',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json:test',
        },
        method: 'PATCH',
        body: {
          "lead":{
            "id":"9754"
          }
        },
        isJson: true
      }
      expect(mockGenerator.mock.calls.length).toBe(1)
      expect(mockGenerator.mock.calls[0][0]).toEqual(expectOptions)
    })

    test('Get the Scenario with form request body', async () => {
      let resultScenario = `
        Given I have an example
      `
      let mockGenerator = jest.fn().mockReturnValue(resultScenario)
      
      jest.mock('@restqa/restqapi', () => ({
        Generator: mockGenerator
      }))
      const Generate = require('./generate')
      const program = {
        args: [
          'curl',
          '--url',
          'https://example/send',
          '--header',
          'content-type: multipart/form-data',
          '--cookie',
          'JSESSIONID=B28CABC3FA3059E10CDE5201105D90F1',
          '-F',
          'ACCOUNT=@ccount',
          '-F',
          'PASSWORD=THIS_IS_PASS',
          '-F',
          'MOBILE=09876463',
          '--form',
          'MESSAGE=test-sms'
        ]
      }
      let result = await Generate(program)
      expect(result).toEqual(resultScenario)
      let expectOptions = {
        url: 'https://example/send',
        headers: {
          'content-type': 'multipart/form-data',
          'cookie': 'JSESSIONID=B28CABC3FA3059E10CDE5201105D90F1',
        },
        form: {
          ACCOUNT: '@ccount',
          PASSWORD: 'THIS_IS_PASS',
          MOBILE: '09876463',
          MESSAGE: 'test-sms'
        },
        method: 'POST',
        isJson: false
      }
      expect(mockGenerator.mock.calls.length).toBe(1)
      expect(mockGenerator.mock.calls[0][0]).toEqual(expectOptions)
    })

    test('Get the Scenario with form multipart request body', async () => {
      let resultScenario = `
        Given I have an example
      `
      let mockGenerator = jest.fn().mockReturnValue(resultScenario)
      
      jest.mock('@restqa/restqapi', () => ({
        Generator: mockGenerator
      }))
      const Generate = require('./generate')
      const program = {
        args: [
          'curl',
          '--url',
          'https://example/send',
          '--header',
          'content-type: application/x-www-form-urlencoded',
          '--cookie',
          'JSESSIONID=B28CABC3FA3059E10CDE5201105D90F1',
          '-d',
          'ACCOUNT=@ccount',
          '--data',
          'PASSWORD=THIS_IS_PASS',
          '--data-raw',
          'MOBILE=09876463',
          '--data',
          'MESSAGE=test-sms'
        ]
      }
      let result = await Generate(program)
      expect(result).toEqual(resultScenario)
      let expectOptions = {
        url: 'https://example/send',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'cookie': 'JSESSIONID=B28CABC3FA3059E10CDE5201105D90F1',
        },
        body: {
          ACCOUNT: '@ccount',
          PASSWORD: 'THIS_IS_PASS',
          MOBILE: '09876463',
          MESSAGE: 'test-sms'
        },
        method: 'POST',
        isJson: false
      }
      expect(mockGenerator.mock.calls.length).toBe(1)
      expect(mockGenerator.mock.calls[0][0]).toEqual(expectOptions)
    })

    test('Write the scenario into a file when file doesn\'t exist', async () => {
      
      let resultScenario = `
        Given I have an example
      `.trim()
      let mockGenerator = jest.fn().mockReturnValue(resultScenario)
      
      jest.mock('@restqa/restqapi', () => ({
        Generator: mockGenerator
      }))
      
      const Generate = require('./generate')
      const program = {
        args: [
          'curl',
          'https://examples/quotes/legacy/bw15',
          '-o',
          'test.feature'
        ]
      }

      let result = await Generate(program)

      expect(result).toEqual(resultScenario)

      let expectOptions = {
        url: 'https://examples/quotes/legacy/bw15',
        isJson: false
      }

      expect(mockGenerator.mock.calls.length).toBe(1)
      expect(mockGenerator.mock.calls[0][0]).toEqual(expectOptions)

      let contentFile = fs.readFileSync(filename).toString()
      let expectedScenario = `
Feature: Generated scenario

Scenario: Test on GET https://examples/quotes/legacy/bw15
Given I have an example
      `.trim()

      expect(contentFile).toEqual(expectedScenario + '\n\n\n\n\n')
    })

    test('Write the scenario into a file when file already exist', async () => {
      let existingContent = `
Feature: Generated new scenario

Scenario: Test on GET https://examples/quotes/legacy/bw15
Given I have an example
      `.trim()
      fs.writeFileSync(filename, existingContent + '\n\n\n\n\n')
      
      let resultScenario = `
        Given I have a second example
      `.trim()
      let mockGenerator = jest.fn().mockReturnValue(resultScenario)
      
      jest.mock('@restqa/restqapi', () => ({
        Generator: mockGenerator
      }))
      
      const Generate = require('./generate')
      const program = {
        args: [
          'curl',
          'https://examples/quotes/legacy/bw15',
          '-o',
          'test.feature'
        ]
      }

      let result = await Generate(program)

      expect(result).toEqual(resultScenario)

      let expectOptions = {
        url: 'https://examples/quotes/legacy/bw15',
        isJson: false
      }

      expect(mockGenerator.mock.calls.length).toBe(1)
      expect(mockGenerator.mock.calls[0][0]).toEqual(expectOptions)

      let contentFile = fs.readFileSync(filename).toString()
      let expectedScenario = `
Feature: Generated new scenario

Scenario: Test on GET https://examples/quotes/legacy/bw15
Given I have an example




Scenario: Test on GET https://examples/quotes/legacy/bw15
Given I have a second example
      `.trim()

      expect(contentFile).toEqual(expectedScenario + '\n\n\n\n\n')
    })
})
