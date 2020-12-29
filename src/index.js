const  generate = require('./cli/generate')

async function Generate (cmd) {
  let args = cmd
    .match(/"[^"]+"|'[^']+'|\S+/g)
    .map(str => str.replace(/^"/, '').replace(/"$/, ''))

  const options = {
    args,
    print: false
  }

  return  generate(options)
}

module.exports = {
  Generate
}
