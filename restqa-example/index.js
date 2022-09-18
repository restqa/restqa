const Express = require('express')

const PORT = process.env.PORT || 8887

Express()
  .get('/', (req, res) => {
    res.json({
      hello: 'world'
    })
  })
  .listen(PORT, () => {
    console.log('server is running on the port', PORT)
  })
