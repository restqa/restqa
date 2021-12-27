const http = require('http')

http.createServer(function (req, res) {
  console.log('Console log from the microservice')
  const result = JSON.stringify({
    message: "Hello World"
  });
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write(result);
  res.end();
}).listen(process.env.PORT || 3010)
