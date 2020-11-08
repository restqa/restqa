const querystring = require('querystring');
const https = require('https');

module.exports = async function (program) {
  let { args } = program

  if ('curl' !== args[0]) {
    console.log(`You need to provide a curl command for me to generate an awesome scenario`)
    process.exit(0)
  }


  return  new Promise((resolve, reject) => {
    var postData = querystring.stringify({
        'cmd' : args.join(' ')
    });
    
    var options = {
      hostname: 'api2scenario.restqa.io',
      port: 443,
      path: '/curl',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    }
    
    var req = https.request(options, (res) => {
      res.on('data', (d) => {
        process.stdout.write(d);
      });
    });
    
    req.on('error', (e) => {
      console.error(e);
    });

    req.on('finish', resolve)
    
    req.write(postData);
    req.end();
  })
}
