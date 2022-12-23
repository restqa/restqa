const Express = require('express')

const PORT = process.env.PORT || 8887

const server = Express()
  .get('/authorization', (req, res) => {
    res.json({
      message: `The Authorization header received is: ${req.headers['authorization']}`
    })
  })
  .listen(PORT, () => {
    console.log('server is running on the port', PORT)
  })

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('server is closing')
  })
})
