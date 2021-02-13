jest.mock('chalk', () => {
  return {
    redBright: _ => _,
    yellow: _ => _,
    bold: {
      cyan: _ => _
    }

  }
})
const Snippet = require('./restqa-snippet')


describe('RestQA Snippet', () => {
  test('generate snippet when the snippet interface is async-await, generator, promise, synchronous', () => {
    let options = {
      comment: 'This is my test comment',
      generatedExpressions: [{
        expressionTemplate: 'My undefined step definition!',
        parameterTypes: [{
          name: 'string',
          type: String,
          useForSnippets: true,
          preferForRegexpMatch: false
        }]
      }],
      functionName: 'Then',
      stepParameterNames: []
    }

    let expectedResult = `
😵 Oups, we are facing an issue with the step:
"""
My undefined step definition!
"""

Do not worry, we are here to find a solution with you, please try to:
---
👉 Check if you don't have any random spaces at the begining, in the middle or at the end of the line.
👉 Check the available steps on your project by using the command: restqa step then
👉 Look at the documentation: https://docs.restqa.io/tests/introduction
👉 Get more support by opening a new issue at https://github.com/restqa/restqa/issues/new/choose

Thank you for using RestQA! 💜`

    // --- async-await
    let snippet = new Snippet('async-await')
    let result = snippet.build(options)
    expect(result).toEqual(expectedResult)

    // --- callback
    snippet = new Snippet('callback')
    result = snippet.build(options)
    expect(result).toEqual(expectedResult)

    // --- generator
    snippet = new Snippet('generator')
    result = snippet.build(options)
    expect(result).toEqual(expectedResult)

    // --- promise
    snippet = new Snippet('promise')
    result = snippet.build(options)
    expect(result).toEqual(expectedResult)

    // --- synchronous
    snippet = new Snippet('synchronous')
    result = snippet.build(options)
    expect(result).toEqual(expectedResult)
  })

  test('generate snippet multiple failing step definition', () => {
    let options = {
      comment: 'This is my test comment',
      generatedExpressions: [{
        expressionTemplate: 'My undefined step definition! (number 1)',
        parameterTypes: [{
          name: 'string',
          type: String,
          useForSnippets: true,
          preferForRegexpMatch: false
        }]
      },{
        expressionTemplate: 'My undefined step definition! (number 2)',
        parameterTypes: [{
          name: 'string',
          type: String,
          useForSnippets: true,
          preferForRegexpMatch: false
        }]
      }],
      functionName: 'Given',
      stepParameterNames: []
    }

    const snippet = new Snippet('async-await')
    let result = snippet.build(options)
    let expectedResult = `
😵 Oups, we are facing an issue with the steps:
"""
My undefined step definition! (number 1)
My undefined step definition! (number 2)
"""

Do not worry, we are here to find a solution with you, please try to:
---
👉 Check if you don't have any random spaces at the begining, in the middle or at the end of the line.
👉 Check the available steps on your project by using the command: restqa step given
👉 Look at the documentation: https://docs.restqa.io/tests/introduction
👉 Get more support by opening a new issue at https://github.com/restqa/restqa/issues/new/choose

Thank you for using RestQA! 💜`
    expect(result).toEqual(expectedResult)
  })
})
