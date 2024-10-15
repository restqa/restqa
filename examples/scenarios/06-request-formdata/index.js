const Express = require('express')

const PORT = process.env.PORT || 8887

const server = Express()
  .use(Express.urlencoded({extended: true}))
  .post('/', (req, res) => {
    res.json(req.body)
  })
  .listen(PORT, () => {
    console.log('server is running on the port', PORT)
  })

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('server is closing')
  })
})
