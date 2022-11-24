const Joi = require('@hapi/joi')
const got = require('got')
const { URLSearchParams } = require('url')

function Channel (config) {
  const schema = Joi.object({
    id: Joi.string().required(),
    apikey: Joi.string().required()
  })

  const { value, error } = schema.validate(config)

  if (error) {
    throw error
  }

  config = value

  async function get (sheet, rowIndex) {
    const path = 'values:batchGet'
    const options = {
      prefixUrl: `https://sheets.googleapis.com/v4/spreadsheets/${config.id}`,
      responseType: 'json',
      searchParams: new URLSearchParams([
        ['key', config.apikey],
        ['ranges', `${sheet}!1:1`],
        ['ranges', `${sheet}!${rowIndex}:${rowIndex}`]
      ])
    }
    let sheetData = await got(path, options)
    sheetData = sheetData.body.valueRanges

    const titles = sheetData[0].values[0]
    const data = sheetData[1].values && sheetData[1].values[0]

    if (!data) {
      throw new Error(`The data at the row ${rowIndex} doesn't exist`)
    }

    const result = titles.reduce((obj, item, index) => {
      obj[item] = data[index]
      return obj
    }, {})

    return result
  }

  return {
    get
  }
}

module.exports = Channel
