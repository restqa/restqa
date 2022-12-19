const path = require('path')
const fs = require('fs')
const fsE = require('fs-extra')
const EsBuild = require('esbuild')
const chalk = require('chalk')

const OUTPUT_FOLDER = path.resolve('.', 'dist')



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
      'c8',
      '@restqa/report-ui'
    ],
    color: true,
  })
  .then(result => {
    fs.renameSync(path.resolve(OUTPUT_FOLDER, 'bin', 'restqa.js'), path.resolve(OUTPUT_FOLDER, 'bin', 'restqa'))
    console.log('> Renamed dist/bin/restqa.js to dist/bin/restqa')
  })
  .then(result => {
    console.log('> Successfull Build')
    process.exit(0)
  })
  .catch(error => {
    console.log(error)
    process.exit(1)
  })
