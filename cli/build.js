const path = require('path')
const fs = require('fs')
const fsE = require('fs-extra')
const EsBuild = require('esbuild')
const chalk = require('chalk')

const OUTPUT_FOLDER = path.resolve('.', 'dist')
const UI_FOLDER = path.resolve('..', 'ui', 'dist')


if (false === fs.existsSync(UI_FOLDER)) {
  console.log(chalk.red.bold('Building failure: The RestQA UI hasn\'t been build yet 😛.'))
  console.log('👉 You can build it following the 3 steps:')
  console.log('      1. Go in the folder "restqa-ui"')
  console.log('      2. Install the dependencies "npm install"')
  console.log('      3. Build the ui "npm run build"')
  console.log('')
  process.exit(1)
}



EsBuild
  .build({
    entryPoints: [
      path.resolve('.', 'bin', 'restqa.js'),
      path.resolve('.', 'src', 'setup.js'),
      path.resolve('.', 'src', 'formatters', 'local-test-formatter.js'),
      path.resolve('.', 'src', 'formatters', 'export-formatter.js'),
      path.resolve('.', 'src', 'restqa-snippet.js'),
    ],
    outdir: OUTPUT_FOLDER, 
    bundle: true,
    minify: true,
    sourcemap: true,
    platform: 'node',
    target: [
      'node14'
    ],
    external: [
      'esprima',
      'jsonpath',
      '@cucumber/cucumber',
    ],
    color: true,
  })
  .then(result => {
    fs.copyFileSync(path.resolve('.', 'src', 'locales', 'en.yml'), path.resolve(OUTPUT_FOLDER, 'src', 'en.yml'))
    fs.copyFileSync(path.resolve('.', 'src', 'locales', 'en.yml'), path.resolve(OUTPUT_FOLDER, 'bin', 'en.yml'))
    console.log('> Locales files: en.yml copied')
    return result
  })
  .then(result => {
    fs.renameSync(path.resolve(OUTPUT_FOLDER, 'bin', 'restqa.js'), path.resolve(OUTPUT_FOLDER, 'bin', 'restqa'))
    console.log('> Renamed dist/bin/restqa.js to dist/bin/restqa')
  })
  .then(result => {
    return fsE.copy(UI_FOLDER, path.resolve(OUTPUT_FOLDER, 'ui'))
  })
  .then(result => {
    console.log('> Successfull Build')
    process.exit(0)
  })
  .catch(error => {
    console.log(error)
    process.exit(1)
  })
