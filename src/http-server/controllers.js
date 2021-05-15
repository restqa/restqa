const Stream = require('stream')
const { version } = require('../../package.json')
const RestQA = require('../../src')
const Remote = require('./services/remote')
const Report = require('./services/report')
const { URL } = require('url')

const Controllers = {}

Controllers.version = function (req, res) {
  res.json({ version })
}

Controllers.steps = function (req, res, next) {
  try {
    const {
      keyword
    } = req.query

    const keywords = (keyword && [keyword]) || ['given', 'when', 'then']

    const result = keywords
      .map(keyword => {
        const options = {
          keyword,
          configFile: req.app.get('restqa.configuration')
        }
        return RestQA.Steps(options)
      })
      .flat()
      .map(item => ({
        plugin: item.Plugin,
        comment: item.Comment,
        step: item.Step,
        keyword: item.Keyword
      }))

    res.json(result)
  } catch (e) {
    next(e)
  }
}

Controllers.generate = async function (req, res, next) {
  try {
    const {
      cmd
    } = req.body

    const scenario = await RestQA.Generate(cmd)
    res.json({ scenario })
  } catch (e) {
    next(e)
  }
}

Controllers.install = async function (req, res, next) {
  try {
    const options = req.body
    options.configFile = req.app.get('restqa.configuration')
    const config = await RestQA.Install(options)
    res
      .status(201)
      .json({ config })
  } catch (e) {
    next(e)
  }
}

Controllers.run = async function (req, res, next) {
  try {
    const options = req.body
    options.configFile = req.app.get('restqa.configuration')
    options.stream = new Stream.Writable()
    options.stream._write = () => {}
    const result = await RestQA.Run(options)
    res
      .status(201)
      .json(result)
  } catch (e) {
    next(e)
  }
}

Controllers.info = async function (req, res) {
  const result = await Remote.info()
  res.json(result)
}

Controllers.createReports = async function (req, res, next) {
  try {
    const { server } = req.app.get('restqa.options')
    const outputFolder = server.report.outputFolder
    const result = await Report.create(outputFolder, req.body)
    result.url = new URL('http://foo.bar') // Sadly this class can't be instanciate without parameter so let me pass a fake one!
    result.url.protocol = req.protocol
    result.url.host = req.headers.host
    result.url.pathname = server.report.urlPrefixPath + '/' + result.id
    res
      .status(201)
      .json(result)
  } catch (e) {
    next(e)
  }
}

Controllers.getReports = function (req, res, next) {
  try {
    const { server } = req.app.get('restqa.options')
    const outputFolder = server.report.outputFolder
    const list = Report.get(outputFolder)
      .map(item => {
        const result = {
          id: item.id,
          url: new URL('http://foo.bar') // Sadly this class can't be instanciate without parameter so let me pass a fake one!
        }
        result.url.protocol = req.protocol
        result.url.host = req.headers.host
        result.url.pathname = server.report.urlPrefixPath + '/' + item.id
        return result
      })
    res.json(list)
  } catch (e) {
    console.log(e)
    next(e)
  }
}

module.exports = Controllers
