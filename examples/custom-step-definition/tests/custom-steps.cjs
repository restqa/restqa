const fs = require('fs')
module.exports = function ({ Given, When, Then }) {

  /*
  Given ('add a custom header', function () { //Sample of a custom Given step definition
    this.api.request.setHeader('x-custom', 12345)
  })
  */

  /*
  When ('erase request body', function () {  //Sample of a custom When step definition
    this.api.setPayload({})
  })
  */

  Then ('the file {string} exists', function (filename) { // Sample of a custom Then step definition 
    if (fs.existsSync(filename) === false) {
      throw new Error(`The file ${filename} does not exists`)
    }
  })
}
