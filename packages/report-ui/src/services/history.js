const History = {};

const KEY_SUFFIX = "RESTQA_HISTORY";

History.limit = 10;

History.add = function (result) {
  if (!result) throw new Error("The received result is not valid");
  const { RESTQA_RESULT, RESTQA_CONFIG = {} } = result;
  this._microserviceCode = (RESTQA_CONFIG.metadata || {}).code;
  result.id = RESTQA_RESULT.id;
  if (this.get(result.id)) {
    return;
  }

  const list = this.list();
  list.push(result);
  if (list.length > this.limit) {
    list.shift(1, 0);
  }
  localStorage.setItem(this.key(), JSON.stringify(list));
  return this;
};

History.get = function (id) {
  const list = this.list();
  const result = list.find((item) => item.id === id);
  return result;
};

History.last = function () {
  return this.list().reverse()[0];
};

History.list = function () {
  const content = localStorage.getItem(this.key());
  let result = [];
  if (content) {
    result = JSON.parse(content);
  }
  return result;
};

History.key = function () {
  if (!this._key) {
    this._key = [this._microserviceCode, KEY_SUFFIX].join("-");
  }
  return this._key;
};

export default History;
