---
id: custom-step
title: Create your own step definition
sidebar_label: Custom step definition
parent: test-creation
video: https://www.youtube.com/watch?v=nhwfPNjNOno
order: 4
---

RestQA might not handle all the different use cases out of the box... However there is a super simple way for you
to add your own step definition :)

## 1. Create your custom step definition in a few second

Create a file in the folder `tests` as `<root>/tests/steps.js`

Then add the following contents:

```js
module.exports = function ({ Given, When, Then }) {

  Given ('add a custom header', function () {
    this.api.request.setHeader('x-custom', 12345)
  })

  When ('erase request body', function () {
    this.api.setPayload({})
  })

  Then ('status ok', function () {
    if (String(this.api.response.statusCode).charAt(0) !== '2') {
      throw new Error('The status code is not equal ok')
    }
  })

}
```

To get more detail about the **Given**, **When** and **Then** function, check the [cucumber-js documentation](https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/api_reference.md)

## 2. Manipulate the current API

Find below a full example on how you can use the built-in options to manipulate the API request

```js
// file: tests/steps.js
const assert = require('assert')

module.exports = function ({ Given, When, Then }) {

Given ('manipulate the request', function () {
  this.api.request.getId()                               // Get request correlation id
  this.api.request.getOptions()                          // compiled options used for the HTTP request
  this.api.request.setBaseUrl('http://example.com')      // Change the host for the request
  this.api.request.ignoreSsl()                           // Get ignore invalid ssl certification
  this.api.request.setPath('/path')                      // Define the api path
  this.api.request.setHeader('x-custom', 'xxx-zzz-yyy')  // Define a header
  this.api.request.setBearer('qazxswedcvfrtgbjnhya')     // Add an authorization bearer
  this.api.request.setMethod('POST')                     // Add method  to be used
  this.api.request.addPayload('hello.foo', 'bar')        // Add one field to the main request payload
  this.api.request.setPayload({                          // override the payload
    hello: {
      foo: "bar"
    },
    message: "hi"
  })
  this.api.request.setQueryString('q', 'search')         // add a query string
  this.api.request.addFormField('foo', 'bar')            // Get form field
})

When ('trigger the request', async function () {
  await this.api.run()
  conole.log('Curl command:', this.api.getCurl())
  conole.log('Full information about the api', this.api.toJSON())
})

Then ('assert the response', function () {
  assert.ok(this.api.response.timing < 1000)
  assert.equal(this.api.response.statusCode, 200)
  assert.equal(this.api.response.headers['x-foo'], 'bar')
  assert.equal(this.api.response.body, {
    foo: "bar"
  })
  assert.equal(this.api.response.findInBody("foo.bar": "hello world"))
  assert.equal(this.api.response.findInHeader('x-foo', 'bar'))
  assert.equal(this.api.response.isJson, true)    
  assert.equal(this.api.response.dotBody, {
    "foo.bar": "hello world",
    "message": "hi"
  })
})
```


## 3. Manipulate the data state

RestQA also has a few options allowing to manage the data flowing within one scenario.

```js
// file: tests/steps.js
const assert = require('assert')

module.exports = function ({ Given, When, Then }) {

Given ('manipulate the data', function (value) {
  this.data.set('foo', 'bar')
  console.log(this.data.get('{{foo}}')) // result: bar

  value = '/test/{{foo}}'
  console.log(this.data.get(value)) // result: /test/bar
})
```


