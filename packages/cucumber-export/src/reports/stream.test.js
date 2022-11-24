const stream = require("stream");

describe("#report - STREAM", () => {
  const StreamReport = require("./stream");

  test("Rejected if the stream instance is not passed", () => {
    const config = {};
    const result = {};
    return expect(StreamReport(config, result)).rejects.toThrow(
      new Error('config.instance is required for the "stream" report')
    );
  });

  test("Rejected if the stream instance is not writable stream", () => {
    const config = {
      instance: []
    };
    const result = {};
    return expect(StreamReport(config, result)).rejects.toThrow(
      new Error("config.instance should be a writable stream")
    );
  });

  test("Resolve the stream", () => {
    return new Promise((resolve) => {
      let chunk = "";
      const instance = new stream.Writable({
        write: (data, encoding, next) => {
          chunk = data;
          next();
        }
      });

      const result = {
        foo: "bar"
      };

      const config = {
        instance
      };

      StreamReport(config, result);

      /*
      expect(StreamReport(config, result)).resolves.toBe(
        "[STREAM REPORT] - Content successfully written into the stream"
      );
      */

      instance.on("finish", () => {
        expect(Buffer.isBuffer(chunk)).toBe(true);
        expect(JSON.parse(chunk.toString("utf-8"))).toEqual(result);
        resolve();
      });
    });
  });

  test("Reject the promise if the stream has an issue", () => {
    const instance = new stream.Writable({});

    const result = "test";

    const config = {
      instance
    };

    return expect(StreamReport(config, result)).rejects.toThrow(
      new Error(
        "[STREAM REPORT][ERROR] - The _write() method is not implemented"
      )
    );
  });
});
