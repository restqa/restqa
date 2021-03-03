const Cucumber = require('cucumber')
const Bootstrap = require('./bootstrap')


try {

  const options = {
    env: process.env.RESTQA_ENV && String(process.env.RESTQA_ENV).toLowerCase(),
    configFile: process.env.RESTQA_CONFIG
  }
  Bootstrap(Cucumber, options)

} catch(err) {
  //throw err
  console.log(err)
  process.exit(1)
}
