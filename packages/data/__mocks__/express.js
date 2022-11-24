const express = function () {
  const instance = {}
  instance.use = jest.fn().mockReturnValue(instance)
  instance.get = jest.fn().mockReturnValue(instance)
  instance.listen = jest.fn().mockReturnValue(instance)
  return instance
}

express.Router = function () {
  const instance = {}
  instance.use = jest.fn().mockReturnValue(instance)
  instance.get = jest.fn().mockReturnValue(instance)
  instance.post = jest.fn().mockReturnValue(instance)
  instance.options = jest.fn().mockReturnValue(instance)
  instance.put = jest.fn().mockReturnValue(instance)
  instance.patch = jest.fn().mockReturnValue(instance)
  instance.delete = jest.fn().mockReturnValue(instance)
  return instance
}

module.exports = express
