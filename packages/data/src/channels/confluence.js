const got = require('got')
const Joi = require('@hapi/joi')
const { parse } = require('html-table-to-json')

function Channel (config) {
  const schema = Joi.object({
    url: Joi.string().uri().required(),
    space_key: Joi.string().required(),
    auth: {
      username: Joi.string().required(),
      password: Joi.string().required()
    },
    prefix_title: Joi.string().optional().allow('').default('Dataset')
  })

  const { value, error } = schema.validate(config)

  if (error) {
    throw error
  }

  config = value

  async function get (title, rowIndex) {
    title = `${config.prefix_title} ${title}`
    const options = {
      prefixUrl: config.url,
      searchParams: {
        expand: 'body.view',
        title,
        space: config.space_key
      },
      username: config.auth.username,
      password: config.auth.password,
      responseType: 'json'
    }

    const result = await got('rest/api/content', options)
    let content = result.body.results[0]
    if (!content) {
      throw new Error(`The dataset with the page title '${title}' doesn't exist in confluence '${options.searchParams.space}' space`)
    }

    content = content.body.view.value
    let data = parse(content).results[0]
    data = data[rowIndex - 1]
    if (!data) {
      throw new Error('Row not found')
    }
    // delete data['1']
    return data
  }
  return {
    get
  }
}

module.exports = Channel
