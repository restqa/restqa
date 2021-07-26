import { mount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import RestQAProjectEditorRunnerStep from './RestQAProjectEditorRunnerStep.vue'

describe('RestQAProjectEditorRunnerStep', () => {

  test('Do not show the  hidden steps', async () => {

    const data = {
      "keyword": "Before",
      "hidden": true,
      "match": {
        "location": "../node_modules/@restqa/restqapi/src/restqapi/hooks.js:5"
      },
      "result": {
        "status": "passed",
        "duration": 0
      }
    }

    const options = {
      props: {
        data
      },
      global: {
        plugins: [
          ElementPlus
        ]
      },
    }

    const component = mount(RestQAProjectEditorRunnerStep, options)
    expect(component.isVisible()).toBeFalsy()
  })

  test('Show a success step', async () => {

    const data = {
      "arguments": [],
      "keyword": "Given ",
      "line": 4,
      "name": "I have the api gateway",
      "match": {
        "location": "../node_modules/@restqa/restqapi/src/restqapi/steps/index.js:6"
      },
      "result": {
        "status": "passed",
        "duration": 0
      }
    }

    const options = {
      props: {
        data
      },
      global: {
        plugins: [
          ElementPlus
        ]
      }
    }

    const component = mount(RestQAProjectEditorRunnerStep, options)
    expect(component.isVisible()).toBeTruthy()
    expect(component.classes('passed')).toBe(true)
    expect(component.find('.keyword').text()).toBe('Given')
    expect(component.find('.step').text()).toBe('I have the api gateway')
    const btnError = component.findComponent('.btn-error')
    expect(btnError.exists()).toBe(false)
  })

  test('Show a failed step', async () => {

    const data = {
      "arguments": [],
      "keyword": "And ",
      "line": 14,
      "name": "the response body at \"title\" should equal \"sssA new RestQA post\"",
      "match": {
        "location": "../node_modules/@restqa/restqapi/src/restqapi/steps/index.js:16"
      },
      "result": {
        "status": "failed",
        "duration": 1000000,
        "error_message": "AssertionError [ERR_ASSERTION]: [POST /todos] The response body property title should be sssA new RestQA post <string> but received A new RestQA post <string>\n    + expected - actual\n\n    -A new RestQA post\n    +sssA new RestQA post\n\n    at RestQA.Then.shouldBeString (/Users/olivierodo/WORKS/restqa/restqa/node_modules/@restqa/restqapi/src/restqapi/steps/3-then/functions.js:116:14)"
      }
    }

    const options = {
      props: {
        data
      },
      global: {
        plugins: [
          ElementPlus
        ]
      }
    }

    const component = mount(RestQAProjectEditorRunnerStep, options)
    expect(component.isVisible()).toBeTruthy()
    expect(component.classes('failed')).toBe(true)
    expect(component.find('.keyword').text()).toBe('And')
    expect(component.find('.step').text()).toBe('the response body at "title" should equal "sssA new RestQA post"')
    const btnError = component.findComponent('.btn-error')
    expect(btnError.isVisible()).toBe(true)
    expect(btnError.text()).toBe('Show errors')
    let debug = component.find('.debug-error')
    expect(debug.exists()).toBe(false)

    btnError.trigger('click')

    await component.vm.$nextTick()

    debug = component.find('.debug-error')
    expect(debug.exists()).toBe(true)
    expect(debug.isVisible()).toBe(true)
    expect(debug.text()).toBe('AssertionError [ERR_ASSERTION]: [POST /todos] The response body property title should be sssA new RestQA post <string> but received A new RestQA post <string>\n    + expected - actual\n\n    -A new RestQA post\n    +sssA new RestQA post\n\n    at RestQA.Then.shouldBeString (/Users/olivierodo/WORKS/restqa/restqa/node_modules/@restqa/restqapi/src/restqapi/steps/3-then/functions.js:116:14)')

    btnError.trigger('click')

    await component.vm.$nextTick()

    debug = component.find('.debug-error')
    expect(debug.exists()).toBe(false)
  })

  test('Show a skipped step', async () => {

    const data = {
      "arguments": [],
      "keyword": "And ",
      "line": 7,
      "name": "I have the method \"PATCH\"",
      "match": {
        "location": "../node_modules/@restqa/restqapi/src/restqapi/steps/index.js:6"
      },
      "result": {
        "status": "skipped"
      }
    }

    const options = {
      props: {
        data
      },
      global: {
        plugins: [
          ElementPlus
        ]
      }
    }

    const component = mount(RestQAProjectEditorRunnerStep, options)
    expect(component.isVisible()).toBeTruthy()
    expect(component.classes('skipped')).toBe(true)
    expect(component.find('.keyword').text()).toBe('And')
    expect(component.find('.step').text()).toBe('I have the method "PATCH"')
    const btnError = component.findComponent('.btn-error')
    expect(btnError.exists()).toBe(false)
  })

  test('Show step attachement (json)', async () => {

    const data = {
      "arguments": [],
      "keyword": "Then ",
      "line": 15,
      "name": "I should receive a response with the status 200",
      "match": {
        "location": "../node_modules/@restqa/restqapi/src/restqapi/steps/index.js:16"
      },
      "result": {
        "status": "passed",
        "duration": 0
      },
      "embeddings": [
        {
          "data": "{\"apis\":[{\"foo\":\"bar\"}]}",
          "mime_type": "application/json"
        }
      ]
    }

    const options = {
      props: {
        data
      },
      global: {
        plugins: [
          ElementPlus
        ]
      }
    }

    const component = mount(RestQAProjectEditorRunnerStep, options)
    expect(component.isVisible()).toBeTruthy()
    expect(component.classes('passed')).toBe(true)
    expect(component.find('.keyword').text()).toBe('Then')
    expect(component.find('.step').text()).toBe('I should receive a response with the status 200')
    const btnError = component.findComponent('.btn-error')
    expect(btnError.exists()).toBe(false)
    const btnInfo = component.findComponent('.btn-info')
    expect(btnInfo.exists()).toBe(true)
    expect(btnInfo.isVisible()).toBe(true)
    expect(btnInfo.text()).toBe('Show info')

    btnInfo.trigger('click')

    let debug = component.find('.debug-info')
    expect(debug.exists()).toBe(false)

    await component.vm.$nextTick()

    debug = component.find('.debug-info')
    expect(debug.exists()).toBe(true)
    expect(debug.isVisible()).toBe(true)
    expect(debug.text()).toEqual(JSON.stringify(JSON.parse(data.embeddings[0].data), null, 2))

    btnInfo.trigger('click')

    await component.vm.$nextTick()

    debug = component.find('.debug-info')
    expect(debug.exists()).toBe(false)
  })

  test('Show multiple step attachement (json + txt)', async () => {

    const data = {
      "arguments": [],
      "keyword": "Then ",
      "line": 15,
      "name": "I should receive a response with the status 200",
      "match": {
        "location": "../node_modules/@restqa/restqapi/src/restqapi/steps/index.js:16"
      },
      "result": {
        "status": "passed",
        "duration": 0
      },
      "embeddings": [
        {
          "data": "Foo / bar my friend",
          "mime_type": "text/plain"
        },
        {
          "data": "{\"apis\":[{\"foo\":\"bar\"}]}",
          "mime_type": "application/json"
        }
      ]
    }

    const options = {
      props: {
        data
      },
      global: {
        plugins: [
          ElementPlus
        ]
      }
    }

    const component = mount(RestQAProjectEditorRunnerStep, options)
    expect(component.isVisible()).toBeTruthy()
    expect(component.classes('passed')).toBe(true)
    expect(component.find('.keyword').text()).toBe('Then')
    expect(component.find('.step').text()).toBe('I should receive a response with the status 200')
    const btnError = component.findComponent('.btn-error')
    expect(btnError.exists()).toBe(false)
    const btnInfo = component.findComponent('.btn-info')
    expect(btnInfo.exists()).toBe(true)
    expect(btnInfo.isVisible()).toBe(true)
    expect(btnInfo.text()).toBe('Show info')

    btnInfo.trigger('click')

    let debug = component.findAll('.debug-info')
    expect(debug).toHaveLength(0)

    await component.vm.$nextTick()

    debug = component.findAll('.debug-info')
    expect(debug).toHaveLength(2)
    expect(debug[0].text()).toEqual("Foo / bar my friend")
    expect(debug[1].text()).toEqual(JSON.stringify(JSON.parse(data.embeddings[1].data), null, 2))

    btnInfo.trigger('click')

    await component.vm.$nextTick()

    debug = component.findAll('.debug-info')
    expect(debug).toHaveLength(0)
  })

  test('Show hidden step when an attachement is available', async () => {

    const data = {
      "keyword": "After",
      "hidden": true,
      "match": {
        "location": "../node_modules/@restqa/restqapi/src/restqapi/hooks.js:39"
      },
      "result": {
        "status": "passed",
        "duration": 0
      },
      "embeddings": [
        {
          "data": "{\"apis\":[{\"request\":{\"hostname\":\"jsonplaceholder.typicode.com\",\"port\":\"\",\"protocol\":\"https:\",\"pathname\":\"/todos/300000\",\"hooks\":{\"afterResponse\":[null]},\"method\":\"delete\",\"headers\":{\"x-correlation-id\":\"test-e2e-delete-473-1624267098449\",\"user-agent\":\"restqa (https://github.com/restqa/restqa)\"},\"responseType\":\"json\"},\"response\":{\"body\":{},\"timing\":592,\"headers\":{\"date\":\"Mon, 21 Jun 2021 09:18:19 GMT\",\"content-type\":\"application/json; charset=utf-8\",\"content-length\":\"2\",\"connection\":\"close\",\"x-powered-by\":\"Express\",\"x-ratelimit-limit\":\"1000\",\"x-ratelimit-remaining\":\"998\",\"x-ratelimit-reset\":\"1624267125\",\"vary\":\"Origin, Accept-Encoding\",\"access-control-allow-credentials\":\"true\",\"cache-control\":\"no-cache\",\"pragma\":\"no-cache\",\"expires\":\"-1\",\"x-content-type-options\":\"nosniff\",\"etag\":\"W/\\\"2-vyGp6PvFo4RvsFtPoIWeCReyIC8\\\"\",\"via\":\"1.1 vegur\",\"cf-cache-status\":\"DYNAMIC\",\"cf-request-id\":\"0acf76224700002ec2f6bf7000000001\",\"expect-ct\":\"max-age=604800, report-uri=\\\"https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct\\\"\",\"report-to\":\"{\\\"endpoints\\\":[{\\\"url\\\":\\\"https:\\\\/\\\\/a.nel.cloudflare.com\\\\/report\\\\/v2?s=SoXoULDi4OyN%2BPzE4av2Q9rcaKHO6HKJsKwinV3eWKub8H%2BNQH5Y5sjcgvCKVKyB2wC5bXH2rx5nFG0Fl21y9pBcE%2BitDZXfAJArjoheI3B2cmCOq74mgXxgD7rYpWpWrRbfL1PLdkZumg%3D%3D\\\"}],\\\"group\\\":\\\"cf-nel\\\",\\\"max_age\\\":604800}\",\"nel\":\"{\\\"report_to\\\":\\\"cf-nel\\\",\\\"max_age\\\":604800}\",\"server\":\"cloudflare\",\"cf-ray\":\"662c2616d8f72ec2-SIN\",\"alt-svc\":\"h3-27=\\\":443\\\"; ma=86400, h3-28=\\\":443\\\"; ma=86400, h3-29=\\\":443\\\"; ma=86400, h3=\\\":443\\\"; ma=86400\"},\"statusCode\":200,\"request\":{\"path\":\"/todos/300000\",\"method\":\"delete\",\"prefix\":\"[DELETE /todos/300000]\"}}}]}",
          "mime_type": "application/json"
        }
      ]
    }

    const options = {
      props: {
        data
      },
      global: {
        plugins: [
          ElementPlus
        ]
      }
    }

    const component = mount(RestQAProjectEditorRunnerStep, options)
    expect(component.isVisible()).toBeTruthy()
    expect(component.classes('passed')).toBe(true)
    expect(component.find('.keyword').text()).toBe('After')
    expect(component.find('.step').text()).toBe('')
    const btnError = component.findComponent('.btn-error')
    expect(btnError.exists()).toBe(false)
    const btnInfo = component.findComponent('.btn-info')
    expect(btnInfo.exists()).toBe(true)
    expect(btnInfo.isVisible()).toBe(true)
    expect(btnInfo.text()).toBe('Show info')

    btnInfo.trigger('click')

    let debug = component.findAll('.debug-info')
    expect(debug).toHaveLength(0)

    await component.vm.$nextTick()

    debug = component.findAll('.debug-info')
    expect(debug).toHaveLength(1)
    expect(debug[0].text()).toEqual(JSON.stringify(JSON.parse(data.embeddings[0].data), null, 2))

    btnInfo.trigger('click')

    await component.vm.$nextTick()

    debug = component.findAll('.debug-info')
    expect(debug).toHaveLength(0)
  })
})
