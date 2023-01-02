const {URL} = require("url");
const When = {};

When.callApi = function (method) {
  return async function (pathname) {
    this.api = this.api || this.createApi();
    try {
      pathname = this.data.get(pathname);
      const url = new URL(pathname, "http://fake.com");
      url.searchParams.forEach((value, key) => {
        this.api.request.setQueryString(key, value);
      });

      this.api.request.setPath(encodeURI(url.pathname));

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
