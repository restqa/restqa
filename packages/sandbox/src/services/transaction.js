module.exports = class Transaction {
  constructor(request, reply) {
    this._data = {
      request: {
        path: request.url.split("?")[0],
        method: request.method,
        query: request.query,
        headers: request.headers,
        json: request.body
      },
      response: {
        headers: reply.getHeaders(),
        statusCode: reply.statusCode,
        body: null
      }
    };
  }

  get response() {
    return this._data.response;
  }

  get request() {
    return this._data.request;
  }

  onData(data) {
    if (!this.response.body) {
      this.response.body = data;
    } else {
      this.response.body = this.response.body.concat(data);
    }
  }

  onEnd() {
    try {
      this.response.body = JSON.parse(this.response.body);
    } catch (e) {
      throw new Error(
        "Sorry at the moment RestQA Sandbox only handle JSON response"
      );
    }
  }
};
