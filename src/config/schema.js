const Joi = require('joi')

function validate (config) {
  const schemaEnvironment = Joi.object({
    name: Joi.string().required(),
    default: Joi.boolean().optional(),
    secrets: Joi.object({}).unknown(),
    plugins: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        config: Joi.any()
      })
    ).required(),
    data: {
      storage: Joi.string(),
      channel: Joi.string(),
      config: Joi.object({}).unknown(),
      startSymbol: Joi.string(),
      endSymbol: Joi.string()
    },
    outputs: Joi.array().items(
      Joi.object({
        type: Joi.string(),
        enabled: Joi.boolean(),
        config: Joi.any()
      })
    )
  })

  const schemaConfig = Joi.object({
    version: Joi.any().allow('0.0.1'),
    metadata: {
      code: Joi.string().required(),
      name: Joi.string().required(),
      description: Joi.string().required()
    },
    environment: schemaEnvironment,
    analytics: Joi.object({
      key: Joi.string(),
      ignore: Joi.array()
    })
  })

  const { value, error } = schemaConfig.validate(config)

  if (error) {
    throw error
  }

  return value
}

module.exports = { validate }
