const Stream = require('stream')
const { version } = require('../../package.json')
const RestQA = require('../../src')

const Controllers = {}

Controllers.version = function(req, res) {
  res.json({ version })
}

Controllers.steps = function(req, res, next) {
  try {
    const {
      keyword
    } = req.query

    const keywords = (keyword && [keyword]) || ['given', 'when', 'then']

    const result = keywords.map(keyword => {
      const options = {
        keyword,
        configFile: req.app.get('restqa.configuration')
      }
      return RestQA.Steps(options)
    }).flat()

    res.json(result)
  } catch(e) {
    next(e)
  }
}

Controllers.generate = async function(req, res, next) {
  try {
    const {
      cmd
    } = req.body

    const scenario = await RestQA.Generate(cmd)
    res.json({ scenario })
    
  } catch(e) {
    next(e)
  }
}

Controllers.install = async function(req, res, next) {
  try {
    const options = req.body
    options.configFile = req.app.get('restqa.configuration')
    const config = await RestQA.Install(options)
    res
      .status(201)
      .json({ config })
    
  } catch(e) {
    next(e)
  }
}

Controllers.run = async function(req, res, next) {
  try {
    const options = req.body
    options.configFile = req.app.get('restqa.configuration')
    options.stream = new Stream.Writable()
    options.stream._write = () => {}
    const result = await RestQA.Run(options)
    res
      .status(201)
      .json(result)
    
  } catch(e) {
    next(e)
  }
}

module.exports = Controllers
