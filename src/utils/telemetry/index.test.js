const querystring = require("querystring");
const os = require("os");
const path = require("path");
const fs = require("fs");

const jestqa = new JestQA(__filename, true);

beforeEach(jestqa.beforeEach);
afterEach(jestqa.afterEach);

const date = new Date("04 Dec 1995 00:12:00 GMT");

beforeAll(function () {
  this.originalPlatform = process.platform;
  this.originalNodeVersion = process.version;
});

jestqa.hooks.beforeEach = function () {
  jest.useFakeTimers("modern");
  jest.setSystemTime(date.getTime());
  const filename = path.resolve(os.homedir(), ".config", "restqa.pref");
  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
  }
};

jestqa.hooks.afterEach = function () {
  Object.defineProperty(process, "platform", {
    value: this.originalPlatform
  });

  Object.defineProperty(process, "version", {
    value: this.originalNodeVersion
  });
  jest.useRealTimers();
  jest.clearAllMocks();
};

describe("# utils - telemetry - index", () => {
  describe("# utils - telemetry - toogle", () => {
    const Telemetry = require("./index");

    test("Create telemetry and tooble on / off the consent", () => {
      const filename = path.resolve(os.homedir(), ".config", "restqa.pref");

      jestqa.getCurrent().files.push(filename);

      expect(fs.existsSync(filename)).toBe(false);

      const options = {
        name: "@restqa/restqa",
        version: "0.0.1",
        trackingCode: "U-0000001"
      };

      const telemetry = new Telemetry(options);

      telemetry.toggle(true);

      expect(fs.existsSync(filename)).toBe(true);
      expect(JSON.parse(fs.readFileSync(filename).toString("utf-8"))).toEqual({
        telemetry: true
      });

      telemetry.toggle(false);

      expect(JSON.parse(fs.readFileSync(filename).toString("utf-8"))).toEqual({
        telemetry: false
      });
    });
  });

  describe("# utils - telemetry - track", () => {
    test("Create a telemetry instance and push the data if the options is set as true", () => {
      const mockRequestWrite = jest.fn();
      const mockRequestEnd = jest.fn();

      const mockRequest = jest.fn().mockReturnValue({
        write: mockRequestWrite,
        end: mockRequestEnd
      });

      jest.mock("https", () => {
        return {
          request: mockRequest
        };
      });

      const mockProvider = require("./provider");

      jest.mock("child_process", () => {
        return {
          fork: jest.fn().mockReturnValue({
            send: mockProvider,
            unref: jest.fn(),
            disconnect: jest.fn()
          })
        };
      });

      const filename = path.resolve(os.homedir(), ".config", "restqa.pref");
      jestqa.getCurrent().files.push(filename);

      const mockMath = Object.create(global.Math);
      mockMath.random = () => 0.5;
      global.Math = mockMath;

      Object.defineProperty(process, "version", {
        value: "12.6"
      });

      const options = {
        name: "@restqa/restqa",
        version: "0.0.1",
        trackingCode: "U-0000001"
      };

      const Telemetry = require("./index");
      const telemetry = new Telemetry(options);

      telemetry.toggle(true);

      telemetry.track("eventCategory", "eventAction", "eventLabel");

      const expectedEvent = {
        v: 1,
        t: "event",
        aip: 1,
        tid: "U-0000001",
        cid: 5000,
        cd1: "",
        cd2: "12.6",
        cd3: "0.0.1",
        z: date.getTime(),
        ec: "eventCategory",
        ea: "eventAction",
        el: "eventLabel"
      };

      expect(mockRequest).toHaveBeenCalledTimes(1);

      const httpsOptions = {
        host: "www.google-analytics.com",
        port: "443",
        path: "/collect",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(
            querystring.stringify(expectedEvent)
          )
        }
      };

      expect(mockRequest.mock.calls[0][0]).toEqual(httpsOptions);

      expect(mockRequestWrite).toHaveBeenCalledTimes(1);
      expect(mockRequestWrite.mock.calls[0][0]).toEqual(
        querystring.stringify(expectedEvent)
      );

      expect(mockRequestEnd).toHaveBeenCalledTimes(1);
    });

    test("Create a telemetry instance and do not push the data if the consent options is set as false then override using the environement variable", () => {
      const mockRequestWrite = jest.fn();
      const mockRequestEnd = jest.fn();

      const mockRequest = jest.fn().mockReturnValue({
        write: mockRequestWrite,
        end: mockRequestEnd
      });

      jest.mock("https", () => {
        return {
          request: mockRequest
        };
      });

      const mockProvider = require("./provider");

      jest.mock("child_process", () => {
        return {
          fork: jest.fn().mockReturnValue({
            send: mockProvider,
            unref: jest.fn(),
            disconnect: jest.fn()
          })
        };
      });

      const filename = path.resolve(os.homedir(), ".config", "restqa.pref");
      jestqa.getCurrent().files.push(filename);
      process.version = "12.6";

      const options = {
        name: "@restqa/restqa",
        version: "0.0.1",
        trackingCode: "U-0000001"
      };

      const Telemetry = require("./index");
      const telemetry = new Telemetry(options);

      telemetry.toggle(false);

      telemetry.track(
        "eventCategory",
        "eventAction",
        "eventLabel",
        "eventValue"
      );

      expect(mockRequest).toHaveBeenCalledTimes(1);

      process.env.RESTQA_TELEMETRY = "off";

      telemetry.track(
        "eventCategory",
        "eventAction",
        "eventLabel",
        "eventValue"
      );

      expect(mockRequest).toHaveBeenCalledTimes(1);

      process.env.RESTQA_TELEMETRY = "on";

      telemetry.track(
        "eventCategory",
        "eventAction",
        "eventLabel",
        "eventValue"
      );

      expect(mockRequest).toHaveBeenCalledTimes(2);
    });
  });
});
