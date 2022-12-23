import fastify from 'fastify'
import fs from 'fs'

const { PORT = 3012 } = process.env

const app = fastify({ logger: false })

// Declare a route
app.post('/create-file', async (request, reply) => {
  fs.writeFileSync('test.txt', 'test content')
  return { hello: 'world' }
})

// Run the server!
const start = async () => {
  try {
    const opt = {
      port: PORT,
      host: '0.0.0.0'
    }
    await app.listen(opt)
    console.log('Server running on the port %s', opt.port)
  } catch (err) {
    console.log(err)
    app.log.error(err)
    process.exit(1)
  }
}
start()


process.on('SIGTERM', () => {
  app.close(() => {
    console.log('server is closing')
  })
})
