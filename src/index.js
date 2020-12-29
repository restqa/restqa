const  generate = require('./cli/generate')

async function Generate (cmd) {
  let args = cmd
    .match(/"[^"]+"|'[^']+'|\S+/g)
    .map(str => str.replace(/^"/, '').replace(/"$/, ''))

  return  generate({ args }, false)
}

module.exports = {
  Generate
}
