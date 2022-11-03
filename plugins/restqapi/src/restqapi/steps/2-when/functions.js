const When = {};

When.callApi = async function () {
  this.attach(this.api.getCurl())
  try{ 
  const result = await this.api.run();
  } catch (e) {
    console.log(e)
  }
  return result;
};

module.exports = When;
