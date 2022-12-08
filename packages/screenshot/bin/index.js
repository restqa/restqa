#!/usr/bin/env node

import { program } from 'commander'
import Main from '../src/index.js'

program
  .option('-r,--report <report>', 'The filename of the local restqa report', 'restqa/index.html')
  .option('-ex,--export <export>', 'Filename of the screenshot export', 'screenshot-restqa.png')
  .option('-h,--hash <hash>', 'Change hash location of the page', '#/features')
  .option('-e,--element <element>', 'The element selector that needs to be screenshoted', '#dashboard-analytics')
  .option('-w,--waitfor <waitFor>', 'The selector element that triggering the readiness of the page', '.logo')
  .option('-p,--pause <pause>', 'after the hash change pause waiting time (ms)', 2000)
program.parse()

const line = (n) => [...new Array(n)].map(()=> '-').join('')

Main(program.opts())
  .then(opt => {
    const msg = `🖼️ - The screenshot has been generated successfully: ${opt.export}`
    console.log(line(msg.length))
    console.log(msg)
    console.log(line(msg.length))
    process.exit(0)
  })
  .catch(err => {
    console.log('❌', line(60))
    console.log(err)
    process.exit(1)
  })


