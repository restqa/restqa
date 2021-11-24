#!/usr/bin/env node

const { program, Argument } = require('commander')
const pkg = require('../package.json')
const Cli = require('../src/cli')
const logger = require('../src/utils/logger')
const path = require('path')
const Telemetry = require('../src/utils/telemetry')

const DEFAULT_CONFIG = process.env.RESTQA_CONFIG || path.resolve(process.cwd(), '.restqa.yml')

const telemetry = new Telemetry(pkg)
program
  .version(pkg.version)
  .hook('preAction', (parent, cmd) => {
    telemetry.track('cli', cmd.name(), cmd.args.join(' '))
  })

program
  .command('init')
  .option('-y', 'Initialize with default values')
  .description('Initialize a new RestQA project')
  .action(Cli('initialize'))

program
  .command('install [name]')
  .alias('i')
  .option('-c, --config <config>', 'Use a specific .restqa.yml file')
  .option('-e, --env <env>', 'Define the current environment')
  .description('Install an addon to your project')
  .action(Cli('install'))

program
  .command('steps [keyword]')
  .alias('st')
  .alias('step')
  .option('-c, --config <config>', 'Use a specific .restqa.yml file')
  .option('-e, --env <env>', 'Define the current environment')
  .option('-t, --tag <tag>', 'Filter the step definition by tag')
  .option('-o, --output <output>', 'Formating the output: short | medium | large')
  .description('Get the list of step by keyword : given | when | then')
  .action(Cli('steps'))

program
  .command('generate')
  .alias('gen')
  .allowUnknownOption()
  .description('Generate a Test scenario from a curl command')
  .usage('[global options] command')
  .action(Cli('generate'))

program
  .command('run')
  .alias('r')
  .option('-e, --env <env>', 'Define the current environment')
  .option('-c, --config <config>', 'Use a specific .restqa.yml file')
  .option('-t, --tags <tags>', 'Use --tags <EXPRESSION> to run specific features or scenarios (example: @prod)', (value, previous) => (previous || []).concat([value]))
  .option('-x, --exec <command>', 'Run a command before running tests (example: npm start)')
  .description('Execute the RestQA test suite')
  .usage('-c ./.restqa.yml -e local -t @success customer.feature')
  .action(Cli('run'))

program
  .command('dashboard')
  .alias('d')
  .option('--no-config', 'Run the dashboad on "no config" mode')
  .option('-c, --config <config>', 'Use a specific .restqa.yml file', DEFAULT_CONFIG)
  .option('-p, --port <port>', 'Define the running port (default: 8081)')
  .option('-r, --read-only', 'Restrict the access of the feature files to read only', process.env.RESTQA_DASHBOARD_READONLY === 'true')
  .description('Launch the RestQA Dashboard web server')
  .usage('[options]')
  .action(Cli('dashboard'))

program
  .command('example')
  .alias('ex')
  .description('Run a simple RestQA example')
  .action(Cli('example'))

program
  .command('telemetry')
  .addArgument(new Argument('[status]', 'status of the telemetry (choices: "on", "off")'))
  .description('Enable or disable the telemetry')
  .usage('[status]')
  .action(Cli('telemetry'))

program.on('--help', () => {
  /* eslint-disable no-console */
  logger.log(
    '  For more details please visit https://github.com/restqa/restqa'
  )
  /* eslint-enable no-console */
})

module.exports = {
  program: program,
  parseCommand: program.parseAsync
}
