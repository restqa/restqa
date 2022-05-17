const Joi = require("joi");

function validate(config) {
  const data = Joi.object({
    storage: Joi.string(),
    channel: Joi.string(),
    config: Joi.object({}).unknown(),
    variables: Joi.object({}).unknown(),
    startSymbol: Joi.string().default("{{"),
    endSymbol: Joi.string().default("}}")
  });

  const integration = Joi.object({
    name: Joi.string().required(),
    url: Joi.string().required(),
    secrets: Joi.object({}).unknown(),
    data,
    outputs: Joi.array().items(
      Joi.object({
        type: Joi.string(),
        enabled: Joi.boolean(),
        config: Joi.any()
      })
    )
  }).default([]);

  const schemaConfig = Joi.object({
    version: Joi.any().allow("0.0.1"),
    metadata: {
      code: Joi.string().required(),
      name: Joi.string().required(),
      description: Joi.string().required()
    },
    tests: {
      unit: {
        port: Joi.number().port().required(),
        command: Joi.string().required(),
        data
      },
      integrations: Joi.array().items(integration),
      performance: {
        tool: Joi.string().allow("artillery"),
        outputFolder: Joi.string(),
        onlySuccess: Joi.boolean()
      }
    },
    specification: {
      tool: Joi.string(),
      title: Joi.string(),
      description: Joi.string(),
      matches: {
        ids: Joi.array()
      },
      export: Joi.string()
    },
    collection: {
      tool: Joi.string().allow("postman"),
      exportFile: Joi.string()
    },
    plugins: Joi.array()
      .default([])
      .items(
        Joi.object({
          name: Joi.string().required(),
          config: Joi.any()
        })
      ),
    settings: Joi.object({
      timeout: Joi.number(),
      dashboard: Joi.object({
        server: Joi.object({
          testFolder: Joi.string(),
          whiteList: Joi.array(),
          report: Joi.object({
            urlPrefixPath: Joi.string(),
            outputFolder: Joi.string()
          })
        }),
        readOnly: Joi.boolean()
      }),
      tips: Joi.object({
        enabled: Joi.boolean(),
        messages: Joi.array()
      })
    })
  });

  const {value, error} = schemaConfig.validate(config);

  if (error) {
    throw error;
  }

  return value;
}

module.exports = {validate};
