const Config = require("../../../../config");

const config = new Config()
config.setName('My fixture 1')
config.setDescription('My description 1')
config.getSpecification().setTool('swagger')

module.exports =  config
