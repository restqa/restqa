const Express = require('express')

const PORT = process.env.PORT || 8887

const server = Express()
  .get('/', (req, res) => {
    res.json({
      message: `The query string received is q = ${req.query.q}`
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
