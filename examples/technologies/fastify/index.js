// Require the framework and instantiate it
const fastify = require('fastify')({ logger: false })

const { PORT = 3012 } = process.env

// Declare a route
fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

// Run the server!
const start = async () => {
  try {
    const opt = {
      port: PORT,
      host: '0.0.0.0'
    }
    await fastify.listen(opt)
    console.log('Server running on the port %s', opt.port)
  } catch (err) {
    console.log(err)
    fastify.log.error(err)
    process.exit(1)
  }
}
start()


process.on('SIGTERM', () => {
  fastify.close(() => {
    console.log('server is closing')
  })
})
