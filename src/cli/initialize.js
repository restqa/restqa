const YAML = require('yaml')
const inquirer = require('inquirer')

module.exports = async function (program) {
  const { author, description, version } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Please input your project name',
    }, {
      type: 'input',
      name: 'description',
      message: 'Please input your project description',
    }, {
      type: 'input',
      name: 'version',
      message: 'Please input your version',
      default: '1.0.0',
    }, {
      type: 'input',
      name: 'version',
      message: 'Please input your version',
      default: '1.0.0',
    }
  ])
console.log( author, description, version )
}

