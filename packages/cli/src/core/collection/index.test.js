const path = require("path");
const fs = require("fs");
const Request = require("@restqa/rest-api-plugin/src/rest-api/lib/api/request");
const Response = require("@restqa/rest-api-plugin/src/rest-api/lib/api/response");
const Collection = require("./index");
const Config = require("../../config");

const jestqa = new JestQA(__filename, true);

beforeEach(jestqa.beforeEach);
afterEach(jestqa.afterEach);

describe("collection", () => {
  describe("postman", () => {
    test("Generate a collection", () => {
      const projectName = "USERS";
      const config = new Config();
      config.getCollection().setTool("postman");
      config
        .getCollection()
        .setExportFile(path.resolve(jestqa.getTmpFolder(), "collections"));

      const instance = new Collection(projectName, config.getCollection());

      const scenario1 = {
        gherkinDocument: {
          feature: {
            name: "GET /"
          }
        },
        pickle: {
          name: "Succesfull Hello World"
        }
      };

      const apis1 = [
        {
          request: new Request(
            "http://localhost:3000/status",
            false,
            "xx-yyy-zzzz"
          ),
          response: Response({
            statusCode: 201,
            headers: {
              "content-type": "application/json"
            },
            body: {
              message: "Hello World!"
            }
          })
        }
      ];
      apis1[0].request.setQueryString("match", "query");

      instance.add(apis1, scenario1);

      const scenario2 = {
        gherkinDocument: {
          feature: {
            name: "GET /"
          }
        },
        pickle: {
          name: "Succesfull POST"
        }
      };

      const apis2 = [
        {
          request: new Request("http://localhost:3000/users/account"),
          response: Response({
            statusCode: 202,
            headers: {
              "content-type": "application/json"
            },
            body: {
              id: 1,
              firstName: "John",
              lastName: "Doe"
            }
          })
        }
      ];
      apis2[0].request.setMethod("POST");
      apis2[0].request.setPayload({
        firstName: "John",
        lastName: "Doe"
      });
      apis2[0].request.setBearer("xxx-yyy-zzz");

      instance.add(apis2, scenario2);
      const result = instance.generate();

      const expectedContent = {
        info: {
          name: "users",
          schema:
            "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        },
        item: [
          {
            name: "GET /",
            item: [
              {
                name: "Succesfull Hello World",
                request: {
                  method: "GET",
                  url: {
                    protocol: "http",
                    host: ["{{host}}"],
                    path: ["status"],
                    query: [
                      {
                        key: "match",
                        value: "query"
                      }
                    ]
                  }
                },
                response: []
              },
              {
                name: "Succesfull POST",
                request: {
                  method: "POST",
                  header: [
                    {
                      key: "Authorization",
                      value: "Bearer xxx-yyy-zzz",
                      type: "text"
                    },
                    {
                      key: "Content-Type",
                      value: "application/json",
                      type: "text"
                    }
                  ],
                  body: {
                    mode: "raw",
                    raw: JSON.stringify({
                      firstName: "John",
                      lastName: "Doe"
                    })
                  },
                  url: {
                    protocol: "http",
                    host: ["{{host}}"],
                    path: ["users", "account"]
                  }
                },
                response: []
              }
            ]
          }
        ],
        variable: [
          {
            key: "host",
            value: "http://localhost:3000"
          }
        ]
      };

      const filename = path.resolve(
        jestqa.getTmpFolder(),
        "collections/users.postman_collection.json"
      );

      const fileContent = JSON.parse(fs.readFileSync(filename).toString());
      expect(fileContent).toEqual(expectedContent);

      expect(result).toEqual({
        postman: filename,
        insomnia: null,
        hoppscotch: null
      });
    });
  });
});
