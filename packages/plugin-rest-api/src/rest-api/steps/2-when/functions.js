const When = {};

When.callApi = function (method) {
  return async function (path) {
    this.api = this.api || this.createApi();
    try {
      path = this.data.get(path);
      this.api.request.setPath(encodeURI(path));

      method = method.toLowerCase();
      const allowed = [
        "post",
        "put",
        "patch",
        "get",
        "delete",
        "head",
        "connect",
        "options",
        "trace"
      ];

      if (!allowed.includes(method)) {
        throw new RangeError(
          '"' +
            method.toUpperCase() +
            '" is not a valid http method. Accepted : https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods'
        );
      }
      this.api.request.setMethod(method);
      this.attach(this.api.getCurl());
      const result = await this.api.run();
      return result;
    } catch (e) {
      if (e instanceof RangeError) {
        throw e;
      }
    }
  };
};

module.exports = When;
