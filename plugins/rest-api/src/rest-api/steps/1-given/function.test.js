beforeEach(() => {
  jest.resetModules();
});

describe("#StepDefinition - given - functions", () => {
  const Given = require("./functions");
  const os = require("os");
  const fs = require("fs");
  const path = require("path");

  let filename;

  beforeEach(() => {
    if (filename && fs.existsSync(filename)) {
      fs.unlinkSync(filename);
    }
  });

  test("Configuration", () => {
    const fns = Object.keys(Given);
    expect(fns).toHaveLength(16);
    const expectedFunctions = [
      "gateway",
      "gatewayHost",
      "ssl",
      "header",
      "headers",
      "bearer",
      "basicAuth",
      "queryString",
      "qs",
      "payload",
      "payloads",
      "jsonPayload",
      "jsonFilePayload",
      "form",
      "forms",
      "formUpload"
    ];
    expect(fns).toEqual(expectedFunctions);
  });

  describe("API Default Functions", () => {
    describe("gateway", () => {
      test("create api", () => {
        const mockApi = {
          foo: "bar",
          request: {
            setHeader: jest.fn()
          }
        };
        const $this = {
          createApi: jest.fn().mockReturnValue(mockApi),
          data: {
            get: jest.fn().mockReturnValue(undefined)
          }
        };
        Given.gateway.call($this);
        expect($this.createApi.mock.calls).toHaveLength(1);
        expect($this.createApi.mock.calls[0][0]).toBeUndefined();
        expect($this.api).toEqual(mockApi);
        expect($this.api.request.setHeader.mock.calls).toHaveLength(0);
        expect($this.data.get.mock.calls).toHaveLength(1);
        expect($this.data.get.mock.calls[0][0]).toEqual("{{__cookie_jar__}}");
      });

      test("gateway with cookies", () => {
        const mockApi = {
          foo: "bar",
          request: {
            setHeader: jest.fn(),
            ignoreSsl: jest.fn()
          }
        };
        const $this = {
          createApi: jest.fn().mockReturnValue(mockApi),
          data: {
            get: jest.fn().mockReturnValue("coooookie")
          }
        };
        Given.gateway.call($this);
        expect($this.createApi.mock.calls).toHaveLength(1);
        expect($this.createApi.mock.calls[0][0]).toBeUndefined();
        expect($this.api).toEqual(mockApi);
        expect($this.api.request.setHeader.mock.calls).toHaveLength(1);
        expect($this.api.request.setHeader.mock.calls[0][0]).toEqual("cookie");
        expect($this.api.request.setHeader.mock.calls[0][1]).toEqual(
          "coooookie"
        );
        expect($this.data.get.mock.calls).toHaveLength(1);
        expect($this.data.get.mock.calls[0][0]).toEqual("{{__cookie_jar__}}");
        expect($this.api.request.ignoreSsl.mock.calls).toHaveLength(0);
      });

      test("gateway with insecure", () => {
        const mockApi = {
          foo: "bar",
          request: {
            setHeader: jest.fn(),
            ignoreSsl: jest.fn()
          }
        };
        const $this = {
          createApi: jest.fn().mockReturnValue(mockApi),
          data: {
            get: jest.fn().mockReturnValue(undefined)
          },
          insecure: true
        };
        Given.gateway.call($this);
        expect($this.createApi.mock.calls).toHaveLength(1);
        expect($this.createApi.mock.calls[0][0]).toBeUndefined();
        expect($this.api).toEqual(mockApi);
        expect($this.api.request.setHeader.mock.calls).toHaveLength(0);
        expect($this.data.get.mock.calls).toHaveLength(1);
        expect($this.data.get.mock.calls[0][0]).toEqual("{{__cookie_jar__}}");
        expect($this.api.request.ignoreSsl.mock.calls).toHaveLength(1);
      });
    });

    describe("gatewayHost with a given url", () => {
      test("gatewayHost with a given url", () => {
        const mockApi = {
          foo: "bar",
          request: {
            setHeader: jest.fn()
          }
        };
        const $this = {
          createApi: jest.fn().mockReturnValue(mockApi),
          data: {
            get: jest.fn().mockReturnValue(undefined)
          }
        };
        Given.gatewayHost.call($this, "http://example.test");
        expect($this.createApi.mock.calls).toHaveLength(1);
        expect($this.createApi.mock.calls[0][0]).toBe("http://example.test");
        expect($this.api).toEqual(mockApi);
        expect($this.api.request.setHeader.mock.calls).toHaveLength(0);
        expect($this.data.get.mock.calls).toHaveLength(1);
        expect($this.data.get.mock.calls[0][0]).toEqual("{{__cookie_jar__}}");
      });

      test("gatewayHost with a given url and cookies", () => {
        const mockApi = {
          foo: "bar",
          request: {
            setHeader: jest.fn(),
            ignoreSsl: jest.fn()
          }
        };
        const $this = {
          createApi: jest.fn().mockReturnValue(mockApi),
          data: {
            get: jest.fn().mockReturnValue("coooookie"),
            options: {
              startSymbol: "[[",
              endSymbol: "]]"
            }
          }
        };
        Given.gatewayHost.call($this, "http://example.test");
        expect($this.createApi.mock.calls).toHaveLength(1);
        expect($this.createApi.mock.calls[0][0]).toBe("http://example.test");
        expect($this.api).toEqual(mockApi);
        expect($this.api.request.setHeader.mock.calls).toHaveLength(1);
        expect($this.api.request.setHeader.mock.calls[0][0]).toEqual("cookie");
        expect($this.api.request.setHeader.mock.calls[0][1]).toEqual(
          "coooookie"
        );
        expect($this.data.get.mock.calls).toHaveLength(1);
        expect($this.data.get.mock.calls[0][0]).toEqual("[[__cookie_jar__]]");
        expect($this.api.request.ignoreSsl.mock.calls).toHaveLength(0);
      });

      test("gatewayHost with a insecure url", () => {
        const mockApi = {
          foo: "bar",
          request: {
            setHeader: jest.fn(),
            ignoreSsl: jest.fn()
          }
        };
        const $this = {
          createApi: jest.fn().mockReturnValue(mockApi),
          data: {
            get: jest.fn().mockReturnValue("coooookie"),
            options: {
              startSymbol: "[[",
              endSymbol: "]]"
            }
          },
          insecure: true
        };
        Given.gatewayHost.call($this, "http://example.test");
        expect($this.createApi.mock.calls).toHaveLength(1);
        expect($this.createApi.mock.calls[0][0]).toBe("http://example.test");
        expect($this.api).toEqual(mockApi);
        expect($this.api.request.setHeader.mock.calls).toHaveLength(1);
        expect($this.api.request.setHeader.mock.calls[0][0]).toEqual("cookie");
        expect($this.api.request.setHeader.mock.calls[0][1]).toEqual(
          "coooookie"
        );
        expect($this.data.get.mock.calls).toHaveLength(1);
        expect($this.data.get.mock.calls[0][0]).toEqual("[[__cookie_jar__]]");
        expect($this.api.request.ignoreSsl.mock.calls).toHaveLength(1);
      });
    });

    test("ssl", () => {
      const $this = {
        api: {
          request: {
            ignoreSsl: jest.fn()
          }
        }
      };
      Given.ssl.call($this, "/foo");
      expect($this.api.request.ignoreSsl.mock.calls).toHaveLength(1);
      expect($this.api.request.ignoreSsl.mock.calls[0][0]).toBeUndefined();
    });
  });

  describe("Request header Functions", () => {
    test("header", () => {
      const $this = {
        api: {
          request: {
            setHeader: jest.fn()
          }
        },
        data: {
          get: jest.fn().mockReturnValue("bar1")
        }
      };
      Given.header.call($this, "x-foo", "bar");
      expect($this.api.request.setHeader.mock.calls).toHaveLength(1);
      expect($this.api.request.setHeader.mock.calls[0][0]).toBe("x-foo");
      expect($this.api.request.setHeader.mock.calls[0][1]).toBe("bar1");
      expect($this.data.get.mock.calls).toHaveLength(1);
      expect($this.data.get.mock.calls[0][0]).toBe("bar");
    });

    test("headers", () => {
      const $this = {
        api: {
          request: {
            setHeader: jest.fn()
          }
        },
        data: {
          get: jest.fn((_) => {
            return _ + "123";
          })
        }
      };

      const table = {
        raw: () => {
          return [
            ["x-foo", "foo-value"],
            ["x-bar", "bar-value"]
          ];
        }
      };
      Given.headers.call($this, table);
      expect($this.api.request.setHeader.mock.calls).toHaveLength(2);
      expect($this.api.request.setHeader.mock.calls[0][0]).toBe("x-foo");
      expect($this.api.request.setHeader.mock.calls[0][1]).toBe("foo-value123");
      expect($this.api.request.setHeader.mock.calls[1][0]).toBe("x-bar");
      expect($this.api.request.setHeader.mock.calls[1][1]).toBe("bar-value123");
      expect($this.data.get.mock.calls).toHaveLength(2);
      expect($this.data.get.mock.calls[0][0]).toBe("foo-value");
      expect($this.data.get.mock.calls[1][0]).toBe("bar-value");
    });

    test("bearer", () => {
      const $this = {
        api: {
          request: {
            setHeader: jest.fn()
          }
        },
        data: {
          get: jest.fn().mockReturnValue("Bearer bar1")
        }
      };
      Given.bearer.call($this, "bar");
      expect($this.api.request.setHeader.mock.calls).toHaveLength(1);
      expect($this.api.request.setHeader.mock.calls[0][0]).toBe(
        "authorization"
      );
      expect($this.api.request.setHeader.mock.calls[0][1]).toBe("Bearer bar1");
      expect($this.data.get.mock.calls).toHaveLength(1);
      expect($this.data.get.mock.calls[0][0]).toBe("Bearer bar");
    });

    test("basicAuth", () => {
      const $this = {
        api: {
          request: {
            setHeader: jest.fn()
          }
        },
        data: {
          get: jest
            .fn()
            .mockReturnValueOnce("admin")
            .mockReturnValueOnce("P@ssw0rd")
            .mockImplementation((param) => param)
        }
      };
      Given.basicAuth.call($this, "admin", "password");
      expect($this.api.request.setHeader.mock.calls).toHaveLength(1);
      expect($this.api.request.setHeader.mock.calls[0][0]).toBe(
        "authorization"
      );
      expect($this.api.request.setHeader.mock.calls[0][1]).toBe(
        "Basic YWRtaW46UEBzc3cwcmQ="
      );
      expect($this.data.get.mock.calls).toHaveLength(3);
      expect($this.data.get.mock.calls[0][0]).toBe("admin");
      expect($this.data.get.mock.calls[1][0]).toBe("password");
    });
  });

  describe("Request query string Functions", () => {
    test("queryString", () => {
      const $this = {
        api: {
          request: {
            setQueryString: jest.fn()
          }
        },
        data: {
          get: jest.fn().mockReturnValue("bar1")
        }
      };
      Given.queryString.call($this, "param1", "bar");
      expect($this.api.request.setQueryString.mock.calls).toHaveLength(1);
      expect($this.api.request.setQueryString.mock.calls[0][0]).toBe("param1");
      expect($this.api.request.setQueryString.mock.calls[0][1]).toBe("bar1");
      expect($this.data.get.mock.calls).toHaveLength(1);
      expect($this.data.get.mock.calls[0][0]).toBe("bar");
    });

    test("qs", () => {
      const $this = {
        api: {
          request: {
            setQueryString: jest.fn()
          }
        },
        data: {
          get: jest.fn((_) => {
            return _ + "123";
          })
        }
      };

      const table = {
        raw: () => {
          return [
            ["param1", "foo"],
            ["param2", "bar"]
          ];
        }
      };
      Given.qs.call($this, table);
      expect($this.api.request.setQueryString.mock.calls).toHaveLength(2);
      expect($this.api.request.setQueryString.mock.calls[0][0]).toBe("param1");
      expect($this.api.request.setQueryString.mock.calls[0][1]).toBe("foo123");
      expect($this.api.request.setQueryString.mock.calls[1][0]).toBe("param2");
      expect($this.api.request.setQueryString.mock.calls[1][1]).toBe("bar123");
      expect($this.data.get.mock.calls).toHaveLength(2);
      expect($this.data.get.mock.calls[0][0]).toBe("foo");
      expect($this.data.get.mock.calls[1][0]).toBe("bar");
    });
  });

  describe("Request body Functions", () => {
    test("payload", () => {
      const $this = {
        api: {
          request: {
            addPayload: jest.fn()
          }
        },
        data: {
          get: jest.fn().mockReturnValue("bar1")
        }
      };
      Given.payload.call($this, "param1", "bar");
      expect($this.api.request.addPayload.mock.calls).toHaveLength(1);
      expect($this.api.request.addPayload.mock.calls[0][0]).toBe("param1");
      expect($this.api.request.addPayload.mock.calls[0][1]).toBe("bar1");
      expect($this.data.get.mock.calls).toHaveLength(1);
      expect($this.data.get.mock.calls[0][0]).toBe("bar");
    });

    test("payloads", () => {
      const $this = {
        api: {
          request: {
            addPayload: jest.fn()
          }
        },
        data: {
          get: jest.fn((_) => {
            return _ + "123";
          })
        }
      };

      const table = {
        raw: () => {
          return [
            ["param.foo1", "foo"],
            ["param.foo2", "bar"]
          ];
        }
      };
      Given.payloads.call($this, table);
      expect($this.api.request.addPayload.mock.calls).toHaveLength(2);
      expect($this.api.request.addPayload.mock.calls[0][0]).toBe("param.foo1");
      expect($this.api.request.addPayload.mock.calls[0][1]).toBe("foo123");
      expect($this.api.request.addPayload.mock.calls[1][0]).toBe("param.foo2");
      expect($this.api.request.addPayload.mock.calls[1][1]).toBe("bar123");
      expect($this.data.get.mock.calls).toHaveLength(2);
      expect($this.data.get.mock.calls[0][0]).toBe("foo");
      expect($this.data.get.mock.calls[1][0]).toBe("bar");
    });

    test("jsonPayload", () => {
      const $this = {
        api: {
          request: {
            setPayload: jest.fn()
          }
        },
        data: {
          get: jest.fn((_) => {
            return _;
          })
        }
      };

      const json = `
        {
          "foo": "bar"
        }
      `;

      Given.jsonPayload.call($this, json);
      expect($this.api.request.setPayload.mock.calls).toHaveLength(1);
      expect($this.api.request.setPayload.mock.calls[0][0]).toEqual(
        JSON.parse(json)
      );
      expect($this.data.get.mock.calls).toHaveLength(1);
    });

    describe("jsonFilePayload", () => {
      test('Throw error if the filename doesn\'t have a "json" exentions', () => {
        const $this = {
          api: {
            request: {
              setPayload: jest.fn()
            }
          },
          data: {
            get: jest.fn((_) => _)
          }
        };

        expect(() => {
          Given.jsonFilePayload.call($this, "body.txt");
        }).toThrow(new Error('The file "body.txt" should be a .json file'));
      });

      test("Throw error when the file doesn't contain a valid json content", () => {
        filename = path.resolve(os.tmpdir(), "body.json");
        fs.writeFileSync(filename, "invalid body");

        const $this = {
          api: {
            request: {
              setPayload: jest.fn()
            }
          },
          data: {
            get: jest.fn((_) => _),
            getFile: jest.fn().mockReturnValue(filename)
          }
        };

        expect(() => {
          Given.jsonFilePayload.call($this, "body.json");
        }).toThrow(
          new Error('The file "body.json" doesn\'t contain a valid JSON')
        );
      });

      test("Load the payload as a json file", () => {
        const json = {
          foo: "bar"
        };
        filename = path.resolve(os.tmpdir(), "body.json");
        fs.writeFileSync(filename, JSON.stringify(json));

        const $this = {
          api: {
            request: {
              setPayload: jest.fn()
            }
          },
          data: {
            get: jest.fn((_) => _),
            getFile: jest.fn().mockReturnValue(filename)
          }
        };
        Given.jsonFilePayload.call($this, "body.json");
        expect($this.api.request.setPayload.mock.calls).toHaveLength(1);
        expect($this.api.request.setPayload.mock.calls[0][0]).toEqual(json);
        expect($this.data.get.mock.calls).toHaveLength(1);
        expect($this.data.getFile.mock.calls).toHaveLength(1);
      });
    });
  });

  describe("Request body Form Functions", () => {
    test("form", () => {
      const $this = {
        api: {
          request: {
            addFormField: jest.fn()
          }
        },
        data: {
          get: jest.fn().mockReturnValue("bar1")
        }
      };
      Given.form.call($this, "param1", "bar");
      expect($this.api.request.addFormField.mock.calls).toHaveLength(1);
      expect($this.api.request.addFormField.mock.calls[0][0]).toBe("param1");
      expect($this.api.request.addFormField.mock.calls[0][1]).toBe("bar1");
      expect($this.data.get.mock.calls).toHaveLength(1);
      expect($this.data.get.mock.calls[0][0]).toBe("bar");
    });

    test("formUpload", () => {
      const fs = require("fs");
      jest.mock("fs");
      fs.createReadStream = jest.fn().mockReturnValue("testFile.rs");

      const Given = require("./functions");

      const $this = {
        api: {
          request: {
            addFormField: jest.fn()
          }
        },
        data: {
          get: jest.fn().mockImplementation((param) => param),
          getFile: jest.fn().mockReturnValue("/usr/src/app/bar.png")
        }
      };
      Given.formUpload.call($this, "bar.png", "file");
      expect($this.api.request.addFormField.mock.calls).toHaveLength(1);
      expect($this.api.request.addFormField.mock.calls[0][0]).toBe("file");
      expect($this.api.request.addFormField.mock.calls[0][1]).toBe(
        "testFile.rs"
      );
      expect($this.data.get.mock.calls).toHaveLength(1);
      expect($this.data.get.mock.calls[0][0]).toBe("bar.png");
      expect($this.data.getFile.mock.calls).toHaveLength(1);
      expect($this.data.getFile.mock.calls[0][0]).toBe("bar.png");
      expect(fs.createReadStream.mock.calls).toHaveLength(1);
      expect(fs.createReadStream.mock.calls[0][0]).toBe("/usr/src/app/bar.png");
    });

    test("forms", () => {
      const $this = {
        api: {
          request: {
            addFormField: jest.fn()
          }
        },
        data: {
          get: jest.fn((_) => {
            return _ + "123";
          })
        }
      };

      const table = {
        raw: () => {
          return [
            ["param.foo1", "foo"],
            ["param.foo2", "bar"]
          ];
        }
      };
      Given.forms.call($this, table);
      expect($this.api.request.addFormField.mock.calls).toHaveLength(2);
      expect($this.api.request.addFormField.mock.calls[0][0]).toBe(
        "param.foo1"
      );
      expect($this.api.request.addFormField.mock.calls[0][1]).toBe("foo123");
      expect($this.api.request.addFormField.mock.calls[1][0]).toBe(
        "param.foo2"
      );
      expect($this.api.request.addFormField.mock.calls[1][1]).toBe("bar123");
      expect($this.data.get.mock.calls).toHaveLength(2);
      expect($this.data.get.mock.calls[0][0]).toBe("foo");
      expect($this.data.get.mock.calls[1][0]).toBe("bar");
    });
  });
});
