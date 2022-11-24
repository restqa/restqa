const parse = require('csv-parse/lib/sync')
const Joi = require('@hapi/joi')
const path = require('path')
const fs = require('fs')

function Channel (config) {
  const schema = Joi.object({
    folder: Joi.string().required(),
    delimiter: Joi.string().optional().default(',')
  })

  const { value, error } = schema.validate(config)

  if (error) {
    throw error
  }

  config = value

  async function get (resource, rowIndex) {
    if (rowIndex <= 1) {
      throw new Error(`There is not data on the row ${rowIndex}`)
    }
    const newRowIndex = rowIndex - 1
    const file = `${resource}.csv`
    const filename = path.resolve(config.folder, file)

    if (!fs.existsSync(filename)) {
      throw new Error(`Impossible to load the dataset from the csv ${filename}`)
    }

    const options = {
      delimiter: config.delimiter,
      columns: true,
      skip_empty_lines: true,
      from: newRowIndex,
      to: newRowIndex
    }

    const input = fs.readFileSync(filename)

    const records = parse(input, options)

    const content = records[0]
    if (!content) {
      throw new Error(`The data set row ${rowIndex} doesn't exist on the resource ${file}`)
    }

    return content
  }
  return {
    get
  }
}

module.exports = Channel
