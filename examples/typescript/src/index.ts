import express from 'express'

const { PORT = 9000 } = process.env
const server = express();
 .get('/', (req, res) => {
    res.json({
      hello: 'world'
    })
  })
  .listen(PORT, () => {
    console.log('server run on port ' + PORT)
  })

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('server is closing')
  })
})
