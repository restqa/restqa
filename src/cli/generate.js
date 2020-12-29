const { Command } = require('commander')
const { Generator } = require('@restqa/restqapi')
const fs = require('fs')
const path = require('path')

module.exports = async function (parentProgram, print) {

  if (undefined === print) {
    print = true
  }

  let { args, logger } = parentProgram

  logger = logger || console

  if ('curl' !== args[0]) {
    throw new ReferenceError(`You need to provide a curl command for me to generate an awesome scenario`)
  }

  try {
    const collect = (value, previous) =>previous.concat([value])
    const program = new Command()
    program
      .option('-H, --header <header>', 'Extra header to include in the request when sending HTTP to a server', collect, [])
      .option('-b, --cookie <cookie>', 'Pass the data to the HTTP server in the Cookie header')
      .option('-u, --user <user>', 'Tells curl to use HTTP Basic authentication with the remote host')
      .option('-A, --user-agent <userAgent>', 'Specify the User-Agent string to send to the HTTP server')
      .option('-X, --request <request>', 'Specifies a custom request method to use when communicating with the HTTP server')
      .option('--url <url>', 'Specify a URL to fetch')
      .option('-F, --form <form>', 'For HTTP protocol family, this lets curl emulate a filled-in form in which a user has pressed the submit button', collect, [])
      .option('-d, --data <data>', 'Sends the specified data in a POST request to the HTTP server', collect, [])
      .option('--data-raw <dataRaw>', 'This posts data similarly to -d, --data ', collect, [])
      .option('--data-binary <dataBinary>', 'This posts data exactly as specified with no extra processing whatsoever')
      .option('--data-urlencode <dataUrlEncode>','')
      .option('--compressed', 'Request a compressed response using one of the algorithms curl supports, and automatically decompress the content')
      .option('-k, --insecure', 'By default, every SSL connection curl makes is verified to be secure. This option allows curl to proceed and operate even for server connections otherwise considered insecure')
      .option('-o, --output <output>', 'Export the scenario output into a file')
      .exitOverride()
      .parse(['runner', ...args])

   if (program.args.length === 0 && !program.url) {
     throw new Error('You need to provide an url into your curl command')
   }

   const options = {
     url : program.url || program.args[0],
   }

   if (program.request) {
     options.method = program.request
   }

   program.header.forEach(item => {
     options.headers = options.headers || {}
     item = item.split(':')
     let key = item[0]
     let value = item.splice(1).join(':').trim()
     options.headers[key] = value
   })


   if (program.user) {
     let [username, password] = program.user.split(':')
     options.user = {
       username,
       password
     }
   }

   if (program.insecure) {
     options.ignoreSsl = true
   }

   options.isJson = (-1 !== (options.headers && options.headers['content-type'] || '').indexOf('json'))

   if (program.dataBinary) {
     options.method = options.method || 'POST'
     if (options.isJson) {
       program.dataBinary = JSON.parse(program.dataBinary)
     }
     options.body = program.dataBinary
   }

   program.data.concat(program.dataRaw).forEach(item => {
     options.method = program.request || 'POST'
     if (options.isJson) {
       options.body = JSON.parse(item)
     } else {
       options.body = options.body || {}
       item = item.split('=')
       let key = item[0]
       let value = item.splice(1).join('=').trim()
       options.body[key] = value
     }
   })

   program.form.forEach(item => {
     options.method = program.request || 'POST'
     options.form = options.form || {}
     item = item.split('=')
     let key = item[0]
     let value = item.splice(1).join('=').trim()
     options.form[key] = value
   })

   if (program.cookie) {
     options.headers['cookie'] = program.cookie
   }

   if (program.userAgent) {
     options.headers['user-agent'] = program.userAgent
   }

   let result = await Generator(options)

   if (program.output) {
     fs.appendFileSync(path.resolve(process.cwd(), program.output), result + '\n\n\n\n\n')
     logger.log(`The file has been added to the file "${program.output}"`)
   } else if (true === print) {
     logger.log('\n', '**** SCENARIO GENERATED SUCCESSFULLY ****', '\n')
     logger.log(result)
   }

   return result

  } catch(e) {
    if (e.code === 'commander.unknownOption') {
      let flag = e.message.match(/\'(.*)\'$/)[1]
      throw new Error(`The curl options "${flag}" is not supported`)
    } else {
      throw e
    }
  }
}
