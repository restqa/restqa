const path = require("path");
const fs = require("fs");
const jestqa = new JestQA(__filename, true);

beforeEach(jestqa.beforeEach);
afterEach(jestqa.afterEach);

describe("# cli - generator", () => {
  global.console.error = jest.fn();

  test("Throw an error if the command is not a curl command", () => {
    const Generate = require("./generate");
    const program = {
      args: ["ls", "-lah"]
    };
    return expect(Generate({}, program)).rejects.toThrow(
      "You need to provide a curl command for me to generate an awesome scenario"
    );
  });

  test("Throw an error if curl options are not supported", () => {
    const Generate = require("./generate");
    const program = {
      args: [
        "curl",
        "http://www.example.com",
        "--proxy-tlsauthtype",
        "someting"
      ]
    };
    return expect(Generate({}, program)).rejects.toThrow(
      'The curl options "--proxy-tlsauthtype" is not supported'
    );
  });

  test("Throw an error if curl options are not supported and the URL at the end", () => {
    const Generate = require("./generate");
    const program = {
      args: [
        "curl",
        "--proxy-tlsauthtype",
        "someting",
        "http://www.example.com"
      ]
    };
    return expect(Generate({}, program)).rejects.toThrow(
      'The curl options "--proxy-tlsauthtype" is not supported'
    );
  });

  test("Throw an error if curl options are not supported and the URL at the middle", () => {
    const Generate = require("./generate");
    const program = {
      args: [
        "curl",
        "--proxy-tlsauthtype",
        "someting",
        "http://www.example.com",
        "k"
      ]
    };
    return expect(Generate({}, program)).rejects.toThrow(
      'The curl options "--proxy-tlsauthtype" is not supported'
    );
  });

  test("Throw an error if curl command does not contain an url", () => {
    const Generate = require("./generate");
    const program = {
      args: ["curl", "-k", "-H", "content-type: application/json"]
    };
    return expect(Generate({}, program)).rejects.toThrow(
      "You need to provide an url into your curl command"
    );
  });

  test("Get the Scenario with json request body", async () => {
    const resultScenario = `
        Given I have an example
      `;
    const mockGenerator = jest.fn().mockReturnValue(resultScenario);

    jest.mock("@restqa/restqapi", () => ({
      Generator: mockGenerator
    }));
    const Generate = require("./generate");
    const program = {
      args: [
        "curl",
        "-H",
        "x-correlation-id: e2e-test-79477561-6025-4205-80fa-1c8bdfa0c559",
        "-H",
        "authorization: Bearer xxx-yyy-zzz-aaa-bbb",
        "-H",
        "accept: application/json",
        "-H",
        "content-type: application/json:test",
        "--data-binary",
        '{"lead":{"id":"9754"}}',
        "--compressed",
        "https://examples/quotes/legacy/bw15",
        "-k",
        "-X",
        "POST"
      ]
    };
    const result = await Generate({}, program);
    expect(result).toEqual(resultScenario);
    const expectOptions = {
      url: "https://examples/quotes/legacy/bw15",
      headers: {
        "x-correlation-id": "e2e-test-79477561-6025-4205-80fa-1c8bdfa0c559",
        authorization: "Bearer xxx-yyy-zzz-aaa-bbb",
        accept: "application/json",
        "content-type": "application/json:test"
      },
      method: "POST",
      body: {
        lead: {
          id: "9754"
        }
      },
      isJson: true,
      ignoreSsl: true
    };
    expect(mockGenerator.mock.calls).toHaveLength(1);
    expect(mockGenerator.mock.calls[0][0]).toEqual(expectOptions);
    expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(2);
    expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch(
      "**** SCENARIO GENERATED SUCCESSFULLY ****"
    );
    expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch(
      "Given I have an example"
    );
  });

  test("Get the Scenario with only cookies set", async () => {
    const resultScenario = `
        Given I have an example
      `;
    const mockGenerator = jest.fn().mockReturnValue(resultScenario);

    jest.mock("@restqa/restqapi", () => ({
      Generator: mockGenerator
    }));
    const Generate = require("./generate");
    const program = {
      args: [
        "curl",
        "--cookie",
        "my-chocolate-cookie",
        "https://examples/quotes/legacy/bw15"
      ]
    };
    const result = await Generate({}, program);
    expect(result).toEqual(resultScenario);
    const expectOptions = {
      url: "https://examples/quotes/legacy/bw15",
      headers: {
        cookie: "my-chocolate-cookie"
      },
      isJson: false
    };
    expect(mockGenerator.mock.calls).toHaveLength(1);
    expect(mockGenerator.mock.calls[0][0]).toEqual(expectOptions);
    expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch(
      "**** SCENARIO GENERATED SUCCESSFULLY ****"
    );
    expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch(
      "Given I have an example"
    );
  });

  test("Get the Scenario with json request body but not method specified into the command", async () => {
    const resultScenario = `
        Given I have an example
      `;
    const mockGenerator = jest.fn().mockReturnValue(resultScenario);

    jest.mock("@restqa/restqapi", () => ({
      Generator: mockGenerator
    }));
    const Generate = require("./generate");
    const program = {
      args: [
        "curl",
        "--user-agent",
        "my test",
        "--cookie",
        "my-chocolate-cookie",
        "-H",
        "x-correlation-id: e2e-test-79477561-6025-4205-80fa-1c8bdfa0c559",
        "-H",
        "authorization: Bearer xxx-yyy-zzz-aaa-bbb",
        "-H",
        "accept: application/json",
        "-H",
        "content-type: application/json:test",
        "--data-binary",
        '{"lead":{"id":"9754"}}',
        "--compressed",
        "https://examples/quotes/legacy/bw15"
      ]
    };
    const result = await Generate({}, program);
    expect(result).toEqual(resultScenario);
    const expectOptions = {
      url: "https://examples/quotes/legacy/bw15",
      headers: {
        "x-correlation-id": "e2e-test-79477561-6025-4205-80fa-1c8bdfa0c559",
        authorization: "Bearer xxx-yyy-zzz-aaa-bbb",
        accept: "application/json",
        "content-type": "application/json:test",
        "user-agent": "my test",
        cookie: "my-chocolate-cookie"
      },
      method: "POST",
      body: {
        lead: {
          id: "9754"
        }
      },
      isJson: true
    };
    expect(mockGenerator.mock.calls).toHaveLength(1);
    expect(mockGenerator.mock.calls[0][0]).toEqual(expectOptions);
  });

  test("Get the Scenario with json request body with basic authent user and specify url as option", async () => {
    const resultScenario = `
        Given I have an example
      `;
    const mockGenerator = jest.fn().mockReturnValue(resultScenario);

    jest.mock("@restqa/restqapi", () => ({
      Generator: mockGenerator
    }));
    const Generate = require("./generate");
    const program = {
      args: [
        "curl",
        "--user",
        "test:test",
        "-H",
        "accept: application/json",
        "-H",
        "content-type: application/json:test",
        "--data-binary",
        '{"lead":{"id":"9754"}}',
        "--compressed",
        "--url",
        "https://examples/quotes/legacy/bw15",
        "-XPATCH"
      ]
    };
    const result = await Generate({}, program);
    expect(result).toEqual(resultScenario);
    const expectOptions = {
      url: "https://examples/quotes/legacy/bw15",
      headers: {
        accept: "application/json",
        "content-type": "application/json:test"
      },
      method: "PATCH",
      body: {
        lead: {
          id: "9754"
        }
      },
      user: {
        username: "test",
        password: "test"
      },
      isJson: true
    };
    expect(mockGenerator.mock.calls).toHaveLength(1);
    expect(mockGenerator.mock.calls[0][0]).toEqual(expectOptions);
  });

  test("Get the Scenario with json request body (--data)", async () => {
    const resultScenario = `
        Given I have an example
      `;
    const mockGenerator = jest.fn().mockReturnValue(resultScenario);

    jest.mock("@restqa/restqapi", () => ({
      Generator: mockGenerator
    }));
    const Generate = require("./generate");
    const program = {
      args: [
        "curl",
        "-H",
        "accept: application/json",
        "-H",
        "content-type: application/json:test",
        "--data",
        '{"lead":{"id":"9754"}}',
        "--compressed",
        "--url",
        "https://examples/quotes/legacy/bw15",
        "-XPATCH"
      ]
    };
    const result = await Generate({}, program);
    expect(result).toEqual(resultScenario);
    const expectOptions = {
      url: "https://examples/quotes/legacy/bw15",
      headers: {
        accept: "application/json",
        "content-type": "application/json:test"
      },
      method: "PATCH",
      body: {
        lead: {
          id: "9754"
        }
      },
      isJson: true
    };
    expect(mockGenerator.mock.calls).toHaveLength(1);
    expect(mockGenerator.mock.calls[0][0]).toEqual(expectOptions);
  });

  test("Get the Scenario with form request body", async () => {
    const resultScenario = `
        Given I have an example
      `;
    const mockGenerator = jest.fn().mockReturnValue(resultScenario);

    jest.mock("@restqa/restqapi", () => ({
      Generator: mockGenerator
    }));
    const Generate = require("./generate");
    const program = {
      args: [
        "curl",
        "--url",
        "https://example/send",
        "--header",
        "content-type: multipart/form-data",
        "--cookie",
        "JSESSIONID=B28CABC3FA3059E10CDE5201105D90F1",
        "-F",
        "ACCOUNT=@ccount",
        "-F",
        "PASSWORD=THIS_IS_PASS",
        "-F",
        "MOBILE=09876463",
        "--form",
        "MESSAGE=test-sms"
      ]
    };
    const result = await Generate({}, program);
    expect(result).toEqual(resultScenario);
    const expectOptions = {
      url: "https://example/send",
      headers: {
        "content-type": "multipart/form-data",
        cookie: "JSESSIONID=B28CABC3FA3059E10CDE5201105D90F1"
      },
      form: {
        ACCOUNT: "@ccount",
        PASSWORD: "THIS_IS_PASS",
        MOBILE: "09876463",
        MESSAGE: "test-sms"
      },
      method: "POST",
      isJson: false
    };
    expect(mockGenerator.mock.calls).toHaveLength(1);
    expect(mockGenerator.mock.calls[0][0]).toEqual(expectOptions);
  });

  test("Get the Scenario with form multipart request body", async () => {
    const resultScenario = `
        Given I have an example
      `;
    const mockGenerator = jest.fn().mockReturnValue(resultScenario);

    jest.mock("@restqa/restqapi", () => ({
      Generator: mockGenerator
    }));
    const Generate = require("./generate");
    const program = {
      args: [
        "curl",
        "--url",
        "https://example/send",
        "--header",
        "content-type: application/x-www-form-urlencoded",
        "--cookie",
        "JSESSIONID=B28CABC3FA3059E10CDE5201105D90F1",
        "-d",
        "ACCOUNT=@ccount",
        "--data",
        "PASSWORD=THIS_IS_PASS",
        "--data-raw",
        "MOBILE=09876463",
        "--data",
        "MESSAGE=test-sms"
      ]
    };
    const result = await Generate({}, program);
    expect(result).toEqual(resultScenario);
    const expectOptions = {
      url: "https://example/send",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        cookie: "JSESSIONID=B28CABC3FA3059E10CDE5201105D90F1"
      },
      body: {
        ACCOUNT: "@ccount",
        PASSWORD: "THIS_IS_PASS",
        MOBILE: "09876463",
        MESSAGE: "test-sms"
      },
      method: "POST",
      isJson: false
    };
    expect(mockGenerator.mock.calls).toHaveLength(1);
    expect(mockGenerator.mock.calls[0][0]).toEqual(expectOptions);
  });

  test("Write the scenario into a file when file doesn't exist", async () => {
    const filename = path.resolve(process.cwd(), "test.feature");
    jestqa.getCurrent().files.push(filename);
    const resultScenario = `
        Given I have an example
      `.trim();
    const mockGenerator = jest.fn().mockReturnValue(resultScenario);

    jest.mock("@restqa/restqapi", () => ({
      Generator: mockGenerator
    }));

    const Generate = require("./generate");
    const program = {
      args: [
        "curl",
        "https://examples/quotes/legacy/bw15",
        "-o",
        "test.feature"
      ]
    };

    const result = await Generate({}, program);

    expect(result).toEqual(resultScenario);

    const expectOptions = {
      url: "https://examples/quotes/legacy/bw15",
      isJson: false
    };

    expect(mockGenerator.mock.calls).toHaveLength(1);
    expect(mockGenerator.mock.calls[0][0]).toEqual(expectOptions);

    const contentFile = fs.readFileSync(filename).toString();
    const expectedScenario = `
Feature: Generated scenario

Scenario: Test on GET https://examples/quotes/legacy/bw15
Given I have an example
      `.trim();

    expect(contentFile).toEqual(expectedScenario + "\n\n\n\n\n");
    expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(1);
    expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch(
      'The Scenario has been added to the file "test.feature"'
    );
  });

  test("Write the scenario into a file when file already exist", async () => {
    const filename = path.resolve(process.cwd(), "test1.feature");
    jestqa.getCurrent().files.push(filename);
    const existingContent = `
Feature: Generated new scenario

Scenario: Test on GET https://examples/quotes/legacy/bw15
Given I have an example
      `.trim();
    fs.writeFileSync(filename, existingContent + "\n\n\n\n\n");

    const resultScenario = `
        Given I have a second example
      `.trim();
    const mockGenerator = jest.fn().mockReturnValue(resultScenario);

    jest.mock("@restqa/restqapi", () => ({
      Generator: mockGenerator
    }));

    const Generate = require("./generate");
    const program = {
      args: [
        "curl",
        "https://examples/quotes/legacy/bw15",
        "-o",
        "test1.feature"
      ]
    };

    const result = await Generate({print: true}, program);

    expect(result).toEqual(resultScenario);

    const expectOptions = {
      url: "https://examples/quotes/legacy/bw15",
      isJson: false
    };

    expect(mockGenerator.mock.calls).toHaveLength(1);
    expect(mockGenerator.mock.calls[0][0]).toEqual(expectOptions);

    const contentFile = fs.readFileSync(filename).toString();
    const expectedScenario = `
Feature: Generated new scenario

Scenario: Test on GET https://examples/quotes/legacy/bw15
Given I have an example




Scenario: Test on GET https://examples/quotes/legacy/bw15
Given I have a second example
      `.trim();

    expect(contentFile).toEqual(expectedScenario + "\n\n\n\n\n");
  });
});
