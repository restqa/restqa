const express = require('express')
const RestQData = require('./index')

const PORT = process.env.PORT || 8080

const options = {
  channel: process.env.RESTQDATA_CHANNEL
}

switch (options.channel) {
  case 'confluence':
    options.config = {
      url: process.env.RESTQDATA_CONFLUENCE_URL,
      space_key: process.env.RESTQDATA_CONFLUENCE_SPACE_KEY,
      auth: {
        username: process.env.RESTQDATA_CONFLUENCE_AUTH_USERNAME,
        password: process.env.RESTQDATA_CONFLUENCE_AUTH_PASSWORD
      },
      prefix_title: process.env.RESTQDATA_CONFLUENCE_PREFIX_TITLE || undefined
    }
    break
  case 'google-sheet':
    options.config = {
      id: process.env.RESTQDATA_GOOGLE_SHEEET_ID,
      apikey: process.env.RESTQDATA_GOOGLE_SHEEET_API_KEY
    }
    break
  case 'csv':
    options.config = {
      folder: process.env.RESTQDATA_CSV_FOLDER
    }
    break
}

options.storage = process.env.RESTQDATA_STORAGE_FOLDER

const Data = RestQData(options)

function ApiError (httpStatus) {
  const status = httpStatus
  return function (message) {
    const err = new Error(message)
    err.httpStatus = status
    return err
  }
}

const ApiErrors = {
  E401: ApiError(401),
  E403: ApiError(403),
  E404: ApiError(404),
  E406: ApiError(406),
  E500: ApiError(500)
}

express()
  .disable('x-powered-by')
  .use(express.json())
  .post('/storages', (req, res, next) => {
    const { filename, data } = req.body
    const result = Data.storage.set(filename, data)
    res.sendFile(result)
  })
  .get('/storages/:filename', (req, res, next) => {
    const { filename } = req.params
    const result = Data.storage.get(filename)
    res.sendFile(result)
  })
  .get('/:resource/:row', async (req, res, next) => {
    try {
      const { resource, row } = req.params

      if (!resource) throw new ApiErrors.E406('Please define the resource')
      if (!row) throw new ApiErrors.E406('Please define the row index')

      const result = await Data.get(resource, row)
      return res
        .set('x-restqdata-channel', options.channel)
        .json(result)
    } catch (e) {
      next(e)
    }
  })
  .use((req, res, next) => {
    next(new ApiErrors.E404('No API found with those values'))
  })
  .use((err, req, res, next) => {
    if (!err.httpStatus) {
      err.httpStatus = 500
    }
    console.log(err)
    return res
      .status(err.httpStatus)
      .set('x-restqdata-channel', options.channel)
      .json({ message: err.message })
  })
  .listen(PORT, () => {
    console.log(`Running on PORT: ${PORT}`)
  })
