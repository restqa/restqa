/*
 * Sample of custom step definition
 * More information in the documentation: https://github.com/restqa/restqa/blob/master/docs/test-creation/custom-step.md
 *
 */

module.exports = () => {
  return `

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

  /*
  Then ('status ok', function () { // Sample of a custom Then step definition 
    if (String(this.api.response.statusCode).charAt(0) !== '2') {
      throw new Error('The status code is not equal ok')
    }
  })
  */
}
  `.trim();
};
