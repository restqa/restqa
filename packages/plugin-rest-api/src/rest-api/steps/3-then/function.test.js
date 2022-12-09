const Response = require("../../lib/api/response");
const Then = require("./functions");
const os = require("os");
const fs = require("fs");
const path = require("path");

let filename;

beforeEach(() => {
  if (filename && fs.existsSync(filename)) {
    fs.unlinkSync(filename);
  }
  jest.resetModules();
  jest.clearAllMocks();
});

describe("#StepDefinition - then - functions", () => {
  test("Configuration", () => {
    const Then = require("./functions");
    const fns = Object.keys(Then);
    expect(fns).toHaveLength(37);
    const expectedFunctions = [
      "httpCode",
      "httpTiming",
      "headerValueExist",
      "headerValueNotExist",
      "headerValueEqual",
      "headers",
      "shouldBeEmptyArrayResponse",
      "shouldNotBeEmptyArrayResponse",
      "shouldBeEmptyResponse",
      "shouldBeNumber",
      "shouldBeTrue",
      "shouldBeFalse",
      "shouldBeNull",
      "shouldBeString",
      "shouldBeEmpty",
      "shouldNotBeNull",
      "shouldBeArraySize",
      "shouldBeAnArray",
      "shouldBeAnArrayOfXItems",
      "shouldMatch",
      "shouldNotBeEqual",
      "shouldBeNow",
      "shouldBeJsonBody",
      "shouldBePropertyMultiline",
      "shouldBeGreaterThan",
      "shouldBeGreaterThanOrEqualTo",
      "shouldBeLessThan",
      "shouldBeLessThanOrEqualTo",
      "shouldBeDateBefore",
      "shouldBeDateBeforeToday",
      "shouldBeDateAfter",
      "shouldBeDateAfterToday",
      "shouldMatchPropertyJsonSchema",
      "shouldMatchJsonSchema",
      "addHeaderPropertyToDataset",
      "addBodyPropertyToDataset",
      "cookieJar"
    ];
    expect(fns).toEqual(expectedFunctions);
  });

  describe("API Default Functions", () => {
    test("httpCode", () => {
      const $this = {
        api: {
          response: {
            statusCode: 201,
            request: {
              prefix: "[POST /users]"
            }
          }
        }
      };

      expect(() => {
        Then.httpCode.call($this, 200);
      }).toThrow(
        "[POST /users] The response httpCode is invalid, received 201 should be 200"
      );
    });

    test("httpTiming - When timing is higher", () => {
      const $this = {
        api: {
          response: {
            timing: 1000,
            request: {
              prefix: "[POST /users]"
            }
          }
        }
      };

      expect(() => {
        Then.httpTiming.call($this, 200);
      }).toThrow(
        "[POST /users] The response time is invalid, received 1000 should be lower than 200"
      );
    });

    test("httpTiming - When timing is lower", () => {
      const $this = {
        api: {
          response: {
            timing: 100,
            request: {
              prefix: "[POST /users]"
            }
          }
        }
      };

      expect(() => {
        Then.httpTiming.call($this, 200);
      }).not.toThrow();
    });
  });

  describe("API Headers Functions", () => {
    test("headerValueExist", () => {
      const $this = {
        api: {
          response: {
            findInHeader: jest.fn().mockReturnValue("xxx-yyy-zzz"),
            request: {
              prefix: "[POST /users]"
            }
          }
        }
      };

      expect(() => {
        Then.headerValueExist.call($this, "x-req-id");
      }).not.toThrow(
        "[POST /users] The response header should contain the x-req-id property"
      );
    });

    test("headerValueNotExist", () => {
      const $this = {
        api: {
          response: {
            findInHeader: jest.fn().mockReturnValue("xxx-yyy-zzz"),
            request: {
              prefix: "[POST /users]"
            }
          }
        }
      };

      const Then = require("./functions");
      expect(() => {
        Then.headerValueExist.call($this, "x-req-id");
      }).not.toThrow(
        "[POST /users] The response header should contain the x-req-id property"
      );
    });

    test("headerValueEqual", () => {
      const $this = {
        api: {
          response: {
            findInHeader: jest.fn().mockReturnValue("xxx-yyy-zzz"),
            request: {
              prefix: "[POST /users]"
            }
          }
        }
      };

      expect(() => {
        Then.headerValueEqual.call($this, "x-req-id", "aaa-bbb-ccc");
      }).toThrow(
        "[POST /users] The response header is invalid, the x-req-id property should be aaa-bbb-ccc but received xxx-yyy-zzz"
      );
    });

    test("headers", () => {
      const _Then = require("./functions");
      _Then.headerValueEqual = jest.fn();
      const table = {
        raw: () => {
          return [
            ["foo", "bar"],
            ["abc", "def"]
          ];
        }
      };
      _Then.headers.call({}, table);

      expect(_Then.headerValueEqual.mock.calls).toHaveLength(2);
      expect(_Then.headerValueEqual.mock.calls[0][0]).toBe("foo");
      expect(_Then.headerValueEqual.mock.calls[0][1]).toBe("bar");
      expect(_Then.headerValueEqual.mock.calls[1][0]).toBe("abc");
      expect(_Then.headerValueEqual.mock.calls[1][1]).toBe("def");
    });
  });

  describe("API Body Functions", () => {
    test("shouldBeEmptyArrayResponse", () => {
      const $this = {
        api: {
          response: new Response({
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify([1, 2, 3]),
            request: {
              prefix: "[POST /users]"
            }
          })
        }
      };

      expect(() => {
        Then.shouldBeEmptyArrayResponse.call($this);
      }).toThrow(
        "[POST /users] The response body should return an empty array, but received an array with 3 items"
      );
    });

    test("shouldNotBeEmptyArrayResponse", () => {
      const $this = {
        api: {
          response: new Response({
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify([]),
            request: {
              prefix: "[POST /users]"
            }
          })
        }
      };

      expect(() => {
        Then.shouldNotBeEmptyArrayResponse.call($this);
      }).toThrow(
        "[POST /users] The response body should return an array containing items, but received an array with 0 items"
      );
    });

    test("shouldBeEmptyResponse throw error", () => {
      const $this = {
        api: {
          response: {
            body: JSON.stringify([]),
            request: {
              prefix: "[POST /users]"
            }
          }
        }
      };

      expect(() => {
        Then.shouldBeEmptyResponse.call($this);
      }).toThrow("[POST /users] The response body should be empty");
    });

    test("shouldBeEmptyResponse", () => {
      const $this = {
        api: {
          response: {
            request: {
              prefix: "[POST /users]"
            }
          }
        }
      };

      expect(() => {
        Then.shouldBeEmptyResponse.call($this);
      }).not.toThrow("[POST /users] The response body should be empty");
    });

    describe("shouldBeNumber", () => {
      test("shouldBeNumber", () => {
        const $this = {
          data: {
            get: jest.fn().mockReturnValue(456)
          },
          api: {
            response: {
              findInBody: jest.fn((_) => 123),
              request: {
                prefix: "[POST /users]"
              }
            }
          }
        };

        expect(() => {
          Then.shouldBeNumber.call($this, "foo", "{{ val }}");
        }).toThrow(
          "[POST /users] The response body property foo should be 456<number> but received 123<number>"
        );
      });

      test("shouldBeNumber but it's different type", () => {
        const $this = {
          data: {
            get: jest.fn().mockReturnValue(123)
          },
          api: {
            response: {
              findInBody: jest.fn((_) => "123"),
              request: {
                prefix: "[POST /users]"
              }
            }
          }
        };

        expect(() => {
          Then.shouldBeNumber.call($this, "foo", "{{ val }}");
        }).toThrow(
          "[POST /users] The response body property foo should be 123<number> but received 123<string>"
        );
      });
    });

    test("shouldBeTrue", () => {
      const $this = {
        api: {
          response: {
            findInBody: jest.fn((_) => false),
            request: {
              prefix: "[POST /users]"
            }
          }
        }
      };

      expect(() => {
        Then.shouldBeTrue.call($this, "foo");
      }).toThrow(
        "[POST /users] The response body property foo should be true but received false"
      );
    });

    test("shouldBeFalse", () => {
      const $this = {
        api: {
          response: {
            findInBody: jest.fn((_) => true),
            request: {
              prefix: "[POST /users]"
            }
          }
        }
      };

      expect(() => {
        Then.shouldBeFalse.call($this, "foo");
      }).toThrow(
        "[POST /users] The response body property foo should be false but received true"
      );
    });

    test("shouldBeNull", () => {
      const $this = {
        api: {
          response: {
            findInBody: jest.fn((_) => "my value"),
            request: {
              prefix: "[POST /users]"
            }
          }
        }
      };

      expect(() => {
        Then.shouldBeNull.call($this, "foo");
      }).toThrow(
        "[POST /users] The response body property foo should be null but received my value"
      );
    });

    test("shouldBeString - Boolean true case", () => {
      const $this = {
        data: {
          get: jest.fn().mockReturnValue("true")
        },
        api: {
          response: {
            findInBody: jest.fn((_) => "my value"),
            request: {
              prefix: "[POST /users]"
            }
          }
        }
      };

      Then.shouldBeTrue = jest.fn();

      expect(() => {
        Then.shouldBeString.call($this, "{{ foo.bar }}", "true");
      }).not.toThrow();
    });

    test("shouldBeString - Boolean false case", () => {
      const $this = {
        data: {
          get: jest.fn().mockReturnValue("false")
        },
        api: {
          response: {
            findInBody: jest.fn((_) => "my value"),
            request: {
              prefix: "[POST /users]"
            }
          }
        }
      };

      Then.shouldBeFalse = jest.fn();

      expect(() => {
        Then.shouldBeString.call($this, "{{ foo.bar }}", "false");
      }).not.toThrow();
    });

    test("shouldBeString - Boolean null case", () => {
      const $this = {
        data: {
          get: jest.fn().mockReturnValue("null")
        },
        api: {
          response: {
            findInBody: jest.fn((_) => "my value"),
            request: {
              prefix: "[POST /users]"
            }
          }
        }
      };

      const Then = require("./functions");
      Then.shouldBeNull = jest.fn();
      expect(() => {
        Then.shouldBeString.call($this, "{{ foo.bar }}", "null");
      }).not.toThrow();
    });

    test("shouldBeString - string", () => {
      const $this = {
        data: {
          get: jest.fn().mockReturnValue("my-value")
        },
        api: {
          response: {
            findInBody: jest.fn((_) => "my value"),
            request: {
              prefix: "[POST /users]"
            }
          }
        }
      };

      expect(() => {
        Then.shouldBeString.call($this, "foo.bar", "{{ placehoder }}");
      }).toThrow(
        "[POST /users] The response body property foo.bar should be my-value <string> but received my value <string>"
      );
    });

    test("shouldBeEmpty", () => {
      const $this = {
        api: {
          response: {
            findInBody: jest.fn((_) => "my value"),
            request: {
              prefix: "[POST /users]"
            }
          }
        }
      };

      expect(() => {
        Then.shouldBeEmpty.call($this, "foo.bar");
      }).toThrow(
        "[POST /users] The response body property foo.bar should be empty but received my value"
      );
    });

    test("shouldNotBeNull", () => {
      const $this = {
        api: {
          response: {
            findInBody: jest.fn((_) => null),
            request: {
              prefix: "[POST /users]"
            }
          }
        }
      };

      expect(() => {
        Then.shouldNotBeNull.call($this, "foo.bar");
      }).toThrow(
        "[POST /users] The response body property foo.bar should not be null but received null"
      );
    });

    test("shouldBeAnArray", () => {
      const $this = {
        api: {
          response: {
            findInBody: jest.fn((_) => "my value"),
            body: JSON.stringify({
              foo: "test"
            }),
            request: {
              prefix: "[POST /users]"
            }
          }
        }
      };

      expect(() => {
        Then.shouldBeAnArray.call($this, "$.foo");
      }).toThrow(
        "[POST /users] The response body property should contain an array but received a string (my value)"
      );
    });

    test("shouldBeAnArrayOfXItems", () => {
      const $this = {
        api: {
          response: {
            findInBody: jest.fn((_) => [1, 2, 3]),
            body: JSON.stringify({
              foo: [1, 2, 3]
            }),
            request: {
              prefix: "[POST /users]"
            }
          }
        }
      };

      expect(() => {
        Then.shouldBeAnArrayOfXItems.call($this, "$.foo", 2);
      }).toThrow(
        "[POST /users] The response body property $.foo should contain an array of 2 but received 3 item(s)"
      );
    });

    test("shouldBeArraySize", () => {
      const $this = {
        api: {
          response: new Response({
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify([1, 2, 3]),
            request: {
              prefix: "[POST /users]"
            }
          })
        }
      };

      expect(() => {
        Then.shouldBeArraySize.call($this, 2);
      }).toThrow(
        "[POST /users] The response body property should contain an array of 2 items but received an array of 3 items"
      );
    });

    describe("shouldMatch", () => {
      test("shouldMatch with a regex format like \\d(.*)", () => {
        const $this = {
          api: {
            response: {
              findInBody: jest.fn((_) => "my value"),
              request: {
                prefix: "[POST /users]"
              }
            }
          }
        };

        expect(() => {
          Then.shouldMatch.call($this, "foo.bar", "^test$");
        }).toThrow(
          "[POST /users] The response body property foo.bar should match the regexp ^test$ but received : my value"
        );

        expect(() => {
          Then.shouldMatch.call($this, "foo.bar", "^my value$");
        }).not.toThrow();
      });

      test("shouldMatch with a regex format like /\\d(.*)/", () => {
        const $this = {
          api: {
            response: {
              findInBody: jest.fn((_) => "my value"),
              request: {
                prefix: "[POST /users]"
              }
            }
          }
        };

        expect(() => {
          Then.shouldMatch.call($this, "foo.bar", "/^test$/");
        }).toThrow(
          "[POST /users] The response body property foo.bar should match the regexp /^test$/ but received : my value"
        );

        expect(() => {
          Then.shouldMatch.call($this, "foo.bar", "/^my value$/");
        }).not.toThrow();
      });
    });

    describe("shouldNotBeEqual", () => {
      test("Throw an error if the value is equal", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  age: 22
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        expect(() => {
          Then.shouldNotBeEqual.call($this, "$.person.age", 22);
        }).toThrow(
          '[POST /users] The response body property "$.person.age" should not be equal to 22 <number>, but received : 22 <number>'
        );
      });

      test("To not throw  an error if the value is not equal (same value different type)", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  age: "22"
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldNotBeEqual.call($this, "$.person.age", 22);
        }).not.toThrow();
      });
    });

    test("shouldBeNow", () => {
      global.Date.now = jest.fn(() =>
        new Date("2019-04-07T11:20:30Z").getTime()
      );

      const $this = {
        api: {
          response: {
            findInBody: jest.fn((_) => "2019-04-07T10:21:30Z"),
            request: {
              prefix: "[POST /users]"
            }
          }
        }
      };

      expect(() => {
        Then.shouldBeNow.call($this, "foo.bar");
      }).toThrow(
        "[POST /users] The response body property foo.bar should be close to now, but received : 2019-04-07T10:21:30Z"
      );
    });

    test("shouldBeNow - close time", () => {
      global.Date.now = jest.fn(() =>
        new Date("2019-04-07T10:20:30Z").getTime()
      );

      const $this = {
        api: {
          response: {
            findInBody: jest.fn((_) => "2019-04-07T10:21:30Z"),
            request: {
              prefix: "[POST /users]"
            }
          }
        }
      };

      expect(() => {
        Then.shouldBeNow.call($this, "foo.bar");
      }).not.toThrow();
    });

    describe("shouldBeJsonBody", () => {
      test("Should be equal", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                foo: "bar"
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const json = `
          {
            "foo": "bar"
          }
        `;

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeJsonBody.call($this, json);
        }).not.toThrow();
      });

      test("Shouldn't be equal", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                f00: "b@r"
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const json = `
          {
            "foo": "bar"
          }
        `;

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeJsonBody.call($this, json);
        }).toThrow(
          `[POST /users] The response body should be '${JSON.stringify({
            foo: "bar"
          })}', but received : '${JSON.stringify({f00: "b@r"})}`
        );
      });
    });

    describe("shouldBePropertyMultiline", () => {
      test("Should be equal (JSON)", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  firstName: "john",
                  lastName: "doe"
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const json = `
          {
            "firstName": "john",
            "lastName": "doe"
          }
        `;

        const Then = require("./functions");
        expect(() => {
          Then.shouldBePropertyMultiline.call($this, "$.person", json);
        }).not.toThrow();
      });

      test("Should be equal (text)", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: `
foo
bar
`.trim()
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const txt = `
foo
bar
`.trim();

        const Then = require("./functions");
        expect(() => {
          Then.shouldBePropertyMultiline.call($this, "$.person", txt);
        }).not.toThrow();
      });

      test("Throw an error if it is not equal TXT", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: "foo\\nbar"
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const txt = `
foo
bar
`.trim();

        const Then = require("./functions");
        expect(() => {
          Then.shouldBePropertyMultiline.call($this, "$.person", txt);
        }).toThrow(
          `[POST /users] The response body at "$.person" should be 'foo
bar', but received : 'foo\\nbar'`
        );
      });

      test("Throw an error if it is not equal JSON", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  firstName: "john"
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const json = `
          {
            "foo": "bar"
          }
        `;

        const Then = require("./functions");
        expect(() => {
          Then.shouldBePropertyMultiline.call($this, "$.person", json);
        }).toThrow(
          `[POST /users] The response body at "$.person" should be '${JSON.stringify(
            {foo: "bar"}
          )}', but received : '${JSON.stringify({firstName: "john"})}'`
        );
      });
    });

    describe("shouldBeGreaterThanOrEqualTo", () => {
      test("Throw error if the response value is not number", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  age: "twenty-two"
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeGreaterThanOrEqualTo.call($this, "$.person.age", 22);
        }).toThrow(
          '[POST /users] The response body at "$.person.age" is not a number received: twenty-two <string>'
        );
      });

      test("Throw error if the response value (float) is less than the value", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  age: 10.1
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeGreaterThanOrEqualTo.call($this, "$.person.age", 22);
        }).toThrow(
          '[POST /users] The response body at "$.person.age" is not greater than or equal to 22, received: 10.1'
        );
      });

      test("Do not throw error if the response value (string) is equal to the value", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  age: "22"
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeGreaterThanOrEqualTo.call($this, "$.person.age", 22);
        }).not.toThrow();
      });

      test("To not throw an error if the response value is greater than the expected value", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  age: "30"
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeGreaterThanOrEqualTo.call($this, "$.person.age", 22);
        }).not.toThrow();
      });

      test("To not throw an error if the response value is greater than the expected value (float)", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  age: "-50.4"
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeGreaterThanOrEqualTo.call(
            $this,
            "$.person.age",
            -110.32
          );
        }).not.toThrow();
      });

      test("To not throw an error if the response value is greater than the expected value (negative value)", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  age: "-50"
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeGreaterThanOrEqualTo.call($this, "$.person.age", -110);
        }).not.toThrow();
      });
    });

    describe("shouldBeLessThanOrEqualTo", () => {
      test("Throw error if the response value is not number", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  age: "twenty-two"
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeLessThanOrEqualTo.call($this, "$.person.age", 22);
        }).toThrow(
          '[POST /users] The response body at "$.person.age" is not a number received: twenty-two <string>'
        );
      });

      test("Throw error if the response value (float) is greater than the value", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  age: 30.5
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeLessThanOrEqualTo.call($this, "$.person.age", 22);
        }).toThrow(
          '[POST /users] The response body at "$.person.age" is not lesser than or equal to 22, received: 30.5'
        );
      });

      test("Do not throw error if the response value (string) is equal to the value", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  age: "22"
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeLessThanOrEqualTo.call($this, "$.person.age", 22);
        }).not.toThrow();
      });

      test("To not throw an error if the response value is lesser than the expected value", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  age: "10"
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeLessThanOrEqualTo.call($this, "$.person.age", 22);
        }).not.toThrow();
      });

      test("To not throw an error if the response value is greater than the expected value (float)", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  age: "-500.4"
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeLessThanOrEqualTo.call($this, "$.person.age", -110.32);
        }).not.toThrow();
      });

      test("To not throw an error if the response value is greater than the expected value (negative value)", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  age: "-500"
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeLessThanOrEqualTo.call($this, "$.person.age", -110);
        }).not.toThrow();
      });
    });

    describe("shouldBeDateBefore", () => {
      test("Throw error if the received date is not valid", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                createDate: "twenty-two"
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeDateBefore.call($this, "$.createDate", "2020-10-21");
        }).toThrow(
          '[POST /users] The response body at "$.createDate" is not a valid date: twenty-two <string>'
        );
      });

      test("Throw error if the passed date is not valid", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                createDate: "2020/12/10"
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeDateBefore.call($this, "$.createDate", "202010T21");
        }).toThrow(
          '[POST /users] The passed value "202010T21" is not a valid date'
        );
      });

      test("Throw error if the received date after the passed date", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                createDate: "2020/12/20"
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeDateBefore.call($this, "$.createDate", "2020/12/11");
        }).toThrow(
          '[POST /users] The response body at "$.createDate" is not before "2020/12/11" (2020-12-11T00:00:00+00:00), received: "2020/12/20" (2020-12-20T00:00:00+00:00)'
        );
      });

      test("Do not throw an error if the passed date is before the received date", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                createDate: "2020/12/01"
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeDateBefore.call($this, "$.createDate", "2020/12/10");
        }).not.toThrow();
      });
    });

    describe("shouldBeDateBeforeToday", () => {
      test("Throw error if the received date is not valid", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                createDate: "twenty-two"
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeDateBeforeToday.call($this, "$.createDate");
        }).toThrow(
          '[POST /users] The response body at "$.createDate" is not a valid date: twenty-two <string>'
        );
      });

      test("Throw error if the received date greater than today", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                createDate: "2020/12/20"
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        jest.mock("moment", () => {
          const moment = jest.requireActual("moment");
          moment.suppressDeprecationWarnings = true;
          return (d) => jest.fn(moment)(d || "2020-12-11", undefined, false);
        });

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeDateBeforeToday.call($this, "$.createDate");
        }).toThrow(
          '[POST /users] The response body at "$.createDate" is not before today "2020/12/11" (2020-12-11T00:00:00+00:00), received: "2020/12/20" (2020-12-20T00:00:00+00:00)'
        );
      });

      test("Do not throw an error if the passed date is before today", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                createDate: "2020/12/01"
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        jest.mock("moment", () => {
          const moment = jest.requireActual("moment");
          moment.suppressDeprecationWarnings = true;
          return (d) => jest.fn(moment)(d || "2020-12-11", undefined, false);
        });

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeDateBeforeToday.call($this, "$.createDate");
        }).not.toThrow();
      });
    });

    describe("shouldBeDateAfter", () => {
      test("Throw error if the received date is not valid", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                createDate: "twenty-two"
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeDateAfter.call($this, "$.createDate", "2020-10-21");
        }).toThrow(
          '[POST /users] The response body at "$.createDate" is not a valid date: twenty-two <string>'
        );
      });

      test("Throw error if the passed date is not valid", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                createDate: "2020/12/10"
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeDateAfter.call($this, "$.createDate", "202010T21");
        }).toThrow(
          '[POST /users] The passed value "202010T21" is not a valid date'
        );
      });

      test("Throw error if the received date before the passed date", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                createDate: "2020/12/10"
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeDateAfter.call($this, "$.createDate", "2020/12/11");
        }).toThrow(
          '[POST /users] The response body at "$.createDate" is not after "2020/12/11" (2020-12-11T00:00:00+00:00), received: "2020/12/10" (2020-12-10T00:00:00+00:00)'
        );
      });

      test("Do not throw an error if the passed date is after the received date", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                createDate: "2020/12/20"
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeDateAfter.call($this, "$.createDate", "2020/12/11");
        }).not.toThrow();
      });
    });

    describe("shouldBeDateAfterToday", () => {
      test("Throw error if the received date is not valid", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                createDate: "twenty-two"
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeDateAfterToday.call($this, "$.createDate");
        }).toThrow(
          '[POST /users] The response body at "$.createDate" is not a valid date: twenty-two <string>'
        );
      });

      test("Throw error if the received date before today", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                createDate: "2020/12/01"
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        jest.mock("moment", () => {
          const moment = jest.requireActual("moment");
          moment.suppressDeprecationWarnings = true;
          return (d) => jest.fn(moment)(d || "2020-12-11", undefined, false);
        });

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeDateAfterToday.call($this, "$.createDate");
        }).toThrow(
          '[POST /users] The response body at "$.createDate" is not after today "2020/12/11" (2020-12-11T00:00:00+00:00), received: "2020/12/01" (2020-12-01T00:00:00+00:00)'
        );
      });

      test("Do not throw an error if the passed date is after today", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                createDate: "2020/12/25"
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        jest.mock("moment", () => {
          const moment = jest.requireActual("moment");
          moment.suppressDeprecationWarnings = true;
          return (d) => jest.fn(moment)(d || "2020-12-11", undefined, false);
        });

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeDateAfterToday.call($this, "$.createDate");
        }).not.toThrow();
      });
    });

    describe("shouldBeGreaterThan", () => {
      test("Throw error is the response value is not number", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  age: "twenty-two"
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeGreaterThan.call($this, "$.person.age", 22);
        }).toThrow(
          '[POST /users] The response body at "$.person.age" is not a number received: twenty-two <string>'
        );
      });

      test("Throw error is the response value (float) is less than the value", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  age: 10.1
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeGreaterThan.call($this, "$.person.age", 22);
        }).toThrow(
          '[POST /users] The response body at "$.person.age" is not greater than 22, received: 10.1'
        );
      });

      test("Throw error is the response value (string) is equal to the value", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  age: "22"
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeGreaterThan.call($this, "$.person.age", 22);
        }).toThrow(
          '[POST /users] The response body at "$.person.age" is not greater than 22, received: 22'
        );
      });

      test("To not throw an error if the response value is greater than the expected value", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  age: "30"
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeGreaterThan.call($this, "$.person.age", 22);
        }).not.toThrow();
      });

      test("To not throw an error if the response value is greater than the expected value (float)", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  age: "-50.4"
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeGreaterThan.call($this, "$.person.age", -110.32);
        }).not.toThrow();
      });

      test("To not throw an error if the response value is greater than the expected value (negative value)", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  age: "-50"
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeGreaterThan.call($this, "$.person.age", -110);
        }).not.toThrow();
      });
    });

    describe("shouldBeLessThan", () => {
      test("Throw error is the response value is not number", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  age: "twenty-two"
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeLessThan.call($this, "$.person.age", 22);
        }).toThrow(
          '[POST /users] The response body at "$.person.age" is not a number received: twenty-two <string>'
        );
      });

      test("Throw error is the response value (float) is greater than the value", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  age: 30.3
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeLessThan.call($this, "$.person.age", 22);
        }).toThrow(
          '[POST /users] The response body at "$.person.age" is not lesser than 22, received: 30.3'
        );
      });

      test("Throw error is the response value (string) is equal to the value", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  age: "22"
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeLessThan.call($this, "$.person.age", 22);
        }).toThrow(
          '[POST /users] The response body at "$.person.age" is not lesser than 22, received: 22'
        );
      });

      test("To not throw an error if the response value is lesser than the expected value", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  age: "10"
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeLessThan.call($this, "$.person.age", 22);
        }).not.toThrow();
      });

      test("To not throw an error if the response value is lesser than the expected value (float)", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  age: "-500.4"
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeLessThan.call($this, "$.person.age", -110.32);
        }).not.toThrow();
      });

      test("To not throw an error if the response value is greater than the expected value (negative value)", () => {
        const $this = {
          data: {
            get: (_) => _
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  age: "-500"
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };

        const Then = require("./functions");
        expect(() => {
          Then.shouldBeLessThan.call($this, "$.person.age", -110);
        }).not.toThrow();
      });
    });

    describe("shouldMatchPropertyJsonSchema", () => {
      test("throw an error if file is not json", () => {
        const $this = {};
        const Then = require("./functions");
        expect(() => {
          Then.shouldMatchPropertyJsonSchema.call(
            $this,
            "$.person",
            "person.js"
          );
        }).toThrow(new Error('The file "person.js" should be a .json file'));
      });

      test("throw an error if the file doesn't contains a valid JSON", () => {
        filename = path.resolve(os.tmpdir(), "person.json");
        const content = `
        ---
        foo: bar
        `;
        fs.writeFileSync(filename, content);
        const $this = {
          data: {
            get: (_) => _,
            getFile: () => filename
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  firstname: true,
                  lastname: 100
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };
        const Then = require("./functions");
        expect(() => {
          Then.shouldMatchPropertyJsonSchema.call(
            $this,
            "$.person",
            "person.json"
          );
        }).toThrow(
          new Error('The file "person.json" doesn\'t contain a valid JSON')
        );
      });

      test("throw an error if the json schema file is not matching the property in the response body", () => {
        filename = path.resolve(os.tmpdir(), "person.json");
        const content = JSON.stringify({
          type: "object",
          properties: {
            firstname: {
              type: "string"
            },
            lastname: {
              type: "string"
            }
          },
          additionalProperties: false
        });
        fs.writeFileSync(filename, content);
        const $this = {
          data: {
            get: (_) => _,
            getFile: () => filename
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  firstname: true,
                  lastname: 100
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };
        const Then = require("./functions");
        expect(() => {
          Then.shouldMatchPropertyJsonSchema.call(
            $this,
            "$.person",
            "person.json"
          );
        }).toThrow(
          new Error(
            '[POST /users] The JSON schema of the property "$.person" is not matching the expected result: \n - #/properties/firstname/type must be string\n- #/properties/lastname/type must be string'
          )
        );
      });

      test("Do not throw an error if the json schema file is matching the property in the response body", () => {
        filename = path.resolve(os.tmpdir(), "person.json");
        const content = JSON.stringify({
          type: "object",
          properties: {
            firstname: {
              type: "string"
            },
            lastname: {
              type: "string"
            }
          },
          additionalProperties: false
        });
        fs.writeFileSync(filename, content);
        const $this = {
          data: {
            get: (_) => _,
            getFile: () => filename
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  firstname: "John",
                  lastname: "Doe"
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };
        const Then = require("./functions");
        expect(() => {
          Then.shouldMatchPropertyJsonSchema.call(
            $this,
            "$.person",
            "person.json"
          );
        }).not.toThrow();
      });
    });

    describe("shouldMatchJsonSchema", () => {
      test("throw an error if the json schema file is not matching the all response body", () => {
        filename = path.resolve(os.tmpdir(), "user.json");
        const content = JSON.stringify({
          type: "object",
          properties: {
            firstname: {
              type: "string"
            },
            lastname: {
              type: "string"
            }
          },
          additionalProperties: false
        });
        fs.writeFileSync(filename, content);
        const $this = {
          data: {
            get: (_) => _,
            getFile: () => filename
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  firstname: true,
                  lastname: 100
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };
        const Then = require("./functions");
        expect(() => {
          Then.shouldMatchJsonSchema.call($this, "user.json");
        }).toThrow(
          new Error(
            "[POST /users] The JSON schema is not matching the expected response body: \n - #/additionalProperties must NOT have additional properties"
          )
        );
      });

      test("Do not throw  an error if the json schema file is matching the all response body", () => {
        filename = path.resolve(os.tmpdir(), "user.json");
        const content = JSON.stringify({
          type: "object",
          properties: {
            person: {
              type: "object",
              properties: {
                firstname: {
                  type: "string"
                },
                lastname: {
                  type: "string"
                }
              }
            }
          }
        });
        fs.writeFileSync(filename, content);
        const $this = {
          data: {
            get: (_) => _,
            getFile: () => filename
          },
          api: {
            response: new Response({
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                person: {
                  firstname: "John",
                  lastname: "Doe"
                }
              }),
              request: {
                prefix: "[POST /users]"
              }
            })
          }
        };
        const Then = require("./functions");
        expect(() => {
          Then.shouldMatchJsonSchema.call($this, "user.json");
        }).not.toThrow();
      });
    });

    test("addHeaderPropertyToDataset", () => {
      const $this = {
        data: {
          set: jest.fn()
        },
        api: {
          response: {
            findInHeader: jest.fn((_) => "my value")
          }
        }
      };

      const Then = require("./functions");
      Then.addHeaderPropertyToDataset.call($this, "foo.bar", "my-value");

      expect($this.api.response.findInHeader.mock.calls).toHaveLength(1);
      expect($this.api.response.findInHeader.mock.calls[0][0]).toBe("foo.bar");

      expect($this.data.set.mock.calls).toHaveLength(1);
      expect($this.data.set.mock.calls[0][0]).toBe("my-value");
      expect($this.data.set.mock.calls[0][1]).toBe("my value");
    });

    test("addBodyPropertyToDataset", () => {
      const $this = {
        data: {
          set: jest.fn()
        },
        api: {
          response: {
            findInBody: jest.fn((_) => "my value")
          }
        }
      };

      const Then = require("./functions");
      Then.addBodyPropertyToDataset.call($this, "foo.bar", "my-value");

      expect($this.api.response.findInBody.mock.calls).toHaveLength(1);
      expect($this.api.response.findInBody.mock.calls[0][0]).toBe("foo.bar");

      expect($this.data.set.mock.calls).toHaveLength(1);
      expect($this.data.set.mock.calls[0][0]).toBe("my-value");
      expect($this.data.set.mock.calls[0][1]).toBe("my value");
    });
  });

  describe("Cookies", () => {
    test("printRequest", () => {
      const $this = {
        data: {
          set: jest.fn()
        },
        api: {
          response: {
            findInHeader: jest.fn((_) => "my cookie")
          }
        }
      };

      const Then = require("./functions");
      Then.cookieJar.call($this);

      expect($this.api.response.findInHeader.mock.calls).toHaveLength(1);
      expect($this.api.response.findInHeader.mock.calls[0][0]).toBe(
        "set-cookie"
      );

      expect($this.data.set.mock.calls).toHaveLength(1);
      expect($this.data.set.mock.calls[0][0]).toBe("__cookie_jar__");
      expect($this.data.set.mock.calls[0][1]).toBe("my cookie");
    });
  });
});
