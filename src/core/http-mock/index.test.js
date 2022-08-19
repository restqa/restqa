const YAML = require('yaml')
const path = require('path')
const fs = require('fs')
const Request = require("@restqa/restqapi/src/restqapi/lib/api/request");
const Response = require("@restqa/restqapi/src/restqapi/lib/api/response");
const HttpMock = require("./index")

const jestqa = new JestQA(__filename, true);

beforeEach(jestqa.beforeEach);
afterEach(jestqa.afterEach);

describe('http-mock', () => {
  test('No success - no test cases', () => {
    const outputFolder = path.resolve(jestqa.getTmpFolder(), "mocks")
    const instance = new HttpMock({outputFolder})
    const result = instance.generate();
    expect(result).toBeUndefined()
  })

  test('No success - invalid properties', () => {
    const outputFolder = path.resolve(jestqa.getTmpFolder(), "mocks")
    const instance = new HttpMock({outputFolder})
    instance.add([],{})
    const result = instance.generate();
    expect(result).toBeUndefined()
  })

  test('Success - simple GET', () => {
    const apis = [
      {
        request: Request("http://localhost/status", false, "xx-yyy-zzzz"),
        response: Response({
          statusCode: 201,
          headers: {
            "content-type": "application/json"
          },
          body: {
            "message": "Hello World!"
          }
        })
      }
    ];

    const scenario = {
      pickle: {
        uri: "example/features/users.api.feature",
        language: "en",
        locations: [
          {
            column: 1,
            line: 4
          }
        ]
      }
    };

    const outputFolder = path.resolve(jestqa.getTmpFolder(), "mocks")

    const instance = new HttpMock({outputFolder})
    instance.add(apis, scenario);
    const result = instance.generate();

    const expectedContent = YAML.stringify({
      request: {
        url: '/status',
        method: 'GET'
      },
      response: {
        status: 201,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          "message": "Hello World!"
        })
      }
    })

    const filename = path.resolve(jestqa.getTmpFolder(), "mocks/users.api.feature1.mock.yml");
    jestqa.getCurrent().files.push(filename);
    const fileContent = fs.readFileSync(filename).toString();
    expect(fileContent).toEqual(expectedContent)
    expect(result).toEqual({
      outputFolder,
      files: [
        filename
      ]
    })
  })

  test('Success - GET with query parameters and custom headers', () => {
    const request = Request("http://localhost/users/johnny")
    request.setQueryString('match', 'query')
    request.setBearer('xxx-yyy-zzz')
    const apis = [
      {
        request,
        response: Response({
          statusCode: 201,
          headers: {
            "content-type": "application/json"
          },
          body: {
            message: "Hello World with query parameters!"
          }
        })
      }
    ];

    const scenario = {
      pickle: {
        uri: "example/features/users.api.feature",
        language: "en",
        locations: [
          {
            column: 1,
            line: 4
          }
        ]
      }
    };

    const outputFolder = path.resolve(jestqa.getTmpFolder(), "mocks")

    const instance = new HttpMock({outputFolder})
    instance.add(apis, scenario);
    const result = instance.generate();

    const expectedContent = YAML.stringify({
      request: {
        url: '/users/johnny',
        method: 'GET',
        query: {
          match: 'query'
        },
        headers: {
          authorization: 'Bearer xxx-yyy-zzz'
        }
      },
      response: {
        status: 201,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          "message": "Hello World with query parameters!"
        })
      }
    })

    const filename = path.resolve(jestqa.getTmpFolder(), "mocks/users.api.feature1.mock.yml");
    jestqa.getCurrent().files.push(filename);
    const fileContent = fs.readFileSync(filename).toString();
    expect(fileContent).toEqual(expectedContent)
    expect(result).toEqual({
      outputFolder,
      files: [
        filename
      ]
    })
  })

  test('Success - POST with json payload', () => {
    const request = Request("http://localhost/users")
    request.setMethod('POST')
    request.setPayload({
      firstName: 'John', 
      lastName: 'Doe'
    })
    request.setBearer('xxx-yyy-zzz')
    const apis = [
      {
        request,
        response: Response({
          statusCode: 202,
          headers: {
            "content-type": "application/json"
          },
          body: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe'
          }
        })
      }
    ];

    const scenario = {
      pickle: {
        uri: "example/features/users.api.feature",
        language: "en",
        locations: [
          {
            column: 1,
            line: 4
          }
        ]
      }
    };

    const outputFolder = path.resolve(jestqa.getTmpFolder(), "mocks")

    const instance = new HttpMock({outputFolder})
    instance.add(apis, scenario);
    const result = instance.generate();

    const expectedContent = YAML.stringify({
      request: {
        url: '/users',
        method: 'POST',
        headers: {
          authorization: 'Bearer xxx-yyy-zzz',
          'content-type': 'application/json'
        },
        payload: JSON.stringify({
          firstName: 'John',
          lastName: 'Doe'
        })
      },
      response: {
        status: 202,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          id: 1,
          firstName: 'John',
          lastName: 'Doe'
        })
      }
    })

    const filename = path.resolve(jestqa.getTmpFolder(), "mocks/users.api.feature1.mock.yml");
    jestqa.getCurrent().files.push(filename);
    const fileContent = fs.readFileSync(filename).toString();
    expect(fileContent).toEqual(expectedContent)
    expect(result).toEqual({
      outputFolder,
      files: [
        filename
      ]
    })
  })

  test('Success - 2 request POST with json payload and simple GET', () => {

    const scenario = {
      pickle: {
        uri: "example/features/users.api.feature",
        language: "en",
        locations: [
          {
            column: 1,
            line: 4
          }
        ]
      }
    };

    const apis1 = [
      {
        request: new Request("http://localhost/status", false, "xx-yyy-zzzz"),
        response: Response({
          statusCode: 201,
          headers: {
            "content-type": "application/json"
          },
          body: {
            "message": "Hello World!"
          }
        })
      }
    ];


    const request = new Request("http://localhost/users")
    request.setMethod('POST')
    request.setPayload({
      firstName: 'John', 
      lastName: 'Doe'
    })
    request.setBearer('xxx-yyy-zzz')
    const apis2 = [
      {
        request,
        response: Response({
          statusCode: 202,
          headers: {
            "content-type": "application/json"
          },
          body: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe'
          }
        })
      }
    ];

    const outputFolder = path.resolve(jestqa.getTmpFolder(), "mocks")

    const instance = new HttpMock({outputFolder})
    instance.add(apis1, scenario);
    instance.add(apis2, scenario);
    const result = instance.generate();

    let expectedContent = YAML.stringify({
      request: {
        url: '/status',
        method: 'GET'
      },
      response: {
        status: 201,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          "message": "Hello World!"
        })
      }
    })

    const filename1 = path.resolve(jestqa.getTmpFolder(), "mocks/users.api.feature1.mock.yml");
    jestqa.getCurrent().files.push(filename1);
    let fileContent = fs.readFileSync(filename1).toString();
    expect(fileContent).toEqual(expectedContent)

    expectedContent = YAML.stringify({
      request: {
        url: '/users',
        method: 'POST',
        headers: {
          authorization: 'Bearer xxx-yyy-zzz',
          'content-type': 'application/json'
        },
        payload: JSON.stringify({
          firstName: 'John',
          lastName: 'Doe'
        })
      },
      response: {
        status: 202,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          id: 1,
          firstName: 'John',
          lastName: 'Doe'
        })
      }
    })

    const filename2 = path.resolve(jestqa.getTmpFolder(), "mocks/users.api.feature2.mock.yml");
    jestqa.getCurrent().files.push(filename2);
    fileContent = fs.readFileSync(filename2).toString();
    expect(fileContent).toEqual(expectedContent)
    expect(result).toEqual({
      outputFolder,
      files: [
        filename1,
        filename2
      ]
    })
  })
})

