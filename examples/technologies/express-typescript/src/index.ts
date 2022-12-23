import express, { Express, Request, Response } from 'express';

const { PORT = 9000 } = process.env
const server = express()
 .get('/', (req: Request, res: Response) => {
    res.json({
      hello: 'world'
    })
  })
  .listen(PORT, () => {
    console.log('server run on port ' + PORT)
    setTimeout(() => {
      process.kill(process.pid, 'SIGTERM')
    }, 2000)
  })

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('---- server is closing')
  })
})
