describe("#StepDefinition - given - functions", () => {
  const When = require("./functions");

  describe("Default Functions", () => {
    test("callApi POST", async () => {
      const $this = {
        data: {
          _data: {},
          get: function (key) {
            return this._data[key] || key;
          },
          set: function (key, data) {
            this._data[key] = data;
          }
        },
        api: {
          request: {
            setMethod: jest.fn(),
            setPath: jest.fn()
          },
          response: {
            headers: {
              "content-type": "application/json",
              "x-latency": "10ms"
            },
            isJson: true,
            dotBody: {
              hello: "world",
              "foo.message": "bar"
            }
          },
          run: jest.fn().mockResolvedValue(true),
          getCurl: () => "curl http://localhost/"
        },
        attach: jest.fn()
      };

      const fn = When.callApi("POST");

      await fn.call($this, "/");

      expect($this.api.run.mock.calls).toHaveLength(1);
      expect($this.api.run.mock.calls[0][0]).toBeUndefined();
      expect($this.attach.mock.calls).toHaveLength(1);
      expect($this.attach.mock.calls[0][0]).toEqual("curl http://localhost/");
      expect($this.api.request.setMethod.mock.calls).toHaveLength(1);
      expect($this.api.request.setMethod.mock.calls[0][0]).toEqual("post");
      expect($this.api.request.setPath.mock.calls).toHaveLength(1);
      expect($this.api.request.setPath.mock.calls[0][0]).toEqual("/");
      expect($this.data.get("response.body.hello")).toEqual("world");
      expect($this.data.get("response.body.foo.message")).toEqual("bar");
      expect($this.data.get("response.headers.x-latency")).toEqual("10ms");
    });

    test("error: callApi incorrect method", async () => {
      const $this = {
        data: {
          get: (_) => _
        },
        api: {
          request: {
            setMethod: jest.fn(),
            setPath: jest.fn()
          },
          run: jest.fn().mockResolvedValue(true),
          getCurl: () => "curl http://localhost/"
        },
        attach: jest.fn()
      };

      const fn = When.callApi("PUTT");

      return expect(fn.call($this, "/")).rejects.toThrow(
        '"PUTT" is not a valid http method. Accepted : https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods'
      );
    });

    test("callApi GET with 1 query parameter", async () => {
      const $this = {
        data: {
          get: (_) => _
        },
        api: {
          request: {
            setMethod: jest.fn(),
            setPath: jest.fn(),
            setQueryString: jest.fn()
          },
          run: jest.fn().mockResolvedValue(true),
          getCurl: () => "curl http://localhost/"
        },
        attach: jest.fn()
      };

      const fn = When.callApi("GET");

      await fn.call($this, "/users?firstname=john");

      expect($this.api.run.mock.calls).toHaveLength(1);
      expect($this.api.run.mock.calls[0][0]).toBeUndefined();
      expect($this.attach.mock.calls).toHaveLength(1);
      expect($this.attach.mock.calls[0][0]).toEqual("curl http://localhost/");
      expect($this.api.request.setMethod.mock.calls).toHaveLength(1);
      expect($this.api.request.setMethod.mock.calls[0][0]).toEqual("get");
      expect($this.api.request.setPath.mock.calls).toHaveLength(1);
      expect($this.api.request.setPath.mock.calls[0][0]).toEqual("/users");
      expect($this.api.request.setQueryString.mock.calls).toHaveLength(1);
      expect($this.api.request.setQueryString.mock.calls[0][0]).toEqual(
        "firstname"
      );
      expect($this.api.request.setQueryString.mock.calls[0][1]).toEqual("john");
    });

    test("callApi GET with multiple query parameters", async () => {
      const $this = {
        data: {
          get: (_) => _
        },
        api: {
          request: {
            setMethod: jest.fn(),
            setPath: jest.fn(),
            setQueryString: jest.fn()
          },
          run: jest.fn().mockResolvedValue(true),
          getCurl: () => "curl http://localhost/"
        },
        attach: jest.fn()
      };

      const fn = When.callApi("GET");

      await fn.call($this, "/users?firstname=john&lastname=doe");

      expect($this.api.run.mock.calls).toHaveLength(1);
      expect($this.api.run.mock.calls[0][0]).toBeUndefined();
      expect($this.attach.mock.calls).toHaveLength(1);
      expect($this.attach.mock.calls[0][0]).toEqual("curl http://localhost/");
      expect($this.api.request.setMethod.mock.calls).toHaveLength(1);
      expect($this.api.request.setMethod.mock.calls[0][0]).toEqual("get");
      expect($this.api.request.setPath.mock.calls).toHaveLength(1);
      expect($this.api.request.setPath.mock.calls[0][0]).toEqual("/users");
      expect($this.api.request.setQueryString.mock.calls).toHaveLength(2);
      expect($this.api.request.setQueryString.mock.calls[0][0]).toEqual(
        "firstname"
      );
      expect($this.api.request.setQueryString.mock.calls[0][1]).toEqual("john");
      expect($this.api.request.setQueryString.mock.calls[1][0]).toEqual(
        "lastname"
      );
      expect($this.api.request.setQueryString.mock.calls[1][1]).toEqual("doe");
    });
  });
});
