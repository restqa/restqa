import ElementPlus from "element-plus";
import {mount} from "@vue/test-utils";
import RestQAProjectSandbox from "./RestQAProjectSandbox.vue";

let msg;

beforeEach(() => {
  msg = {
    status: "PENDING",
    scenario: "Feature: This is my test",
    createdAt: "2021-10-02T21:19:39.000Z",
    transaction: {
      request: {
        method: "POST",
        path: "/greeting",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
          "accept-encoding": "gzip, deflate, br",
          connection: "close",
          "content-length": "37",
          host: "127.0.0.1:8081",
          "user-agent": "got (https://github.com/sindresorhus/got)"
        },
        query: {},
        body: {
          firstName: "John",
          lastName: "Doe"
        }
      },
      response: {
        status: 201,
        headers: {
          "content-length": "25",
          "content-type": "application/json; charset=utf-8"
        },
        body: {
          foo: "bar"
        }
      }
    }
  };
});

beforeAll(() => {
  global.EventSource = jest.fn(() => ({
    readyState: 0,
    close: jest.fn(),
    addEventListener: (type, fn) => {
      const data = JSON.stringify(msg);
      fn({data});
    }
  }));

  global.EventSource.CONNECTING = 0;
  global.EventSource.OPEN = 1;
  global.EventSource.CLOSED = 2;
});

describe("RestQAProjectSandbox", () => {
  test("Renders the data list on an empty sandbox", async () => {
    const options = {
      global: {
        plugins: [ElementPlus]
      }
    };

    const component = mount(RestQAProjectSandbox, options);
    expect(component.exists()).toBeTruthy();
    await component.vm.$nextTick();

    expect(component.vm.list).toHaveLength(1);
    const expectedMessage = {
      ...msg,
      date: "02/10/21 21:19"
    };
    expect(component.vm.list[0]).toEqual(expectedMessage);
  });

  test("Renders the data list on a non empty sandbox (new added goes first)", async () => {
    const expectedMessage1 = {
      ...msg,
      date: "02/10/21 21:19"
    };

    const options = {
      data() {
        return {
          data: [expectedMessage1]
        };
      },
      global: {
        plugins: [ElementPlus]
      }
    };

    msg.createdAt = "2021-10-02T22:00:00.000Z";

    const component = mount(RestQAProjectSandbox, options);
    expect(component.exists()).toBeTruthy();
    await component.vm.$nextTick();

    expect(component.vm.list).toHaveLength(2);

    const expectedMessage2 = {
      ...msg,
      date: "02/10/21 22:00"
    };
    expect(component.vm.list[0]).toEqual(expectedMessage2);
    expect(component.vm.list[1]).toEqual(expectedMessage1);
  });

  describe("getTagType", () => {
    test("get tag depending on the status code", async () => {
      const options = {
        global: {
          plugins: [ElementPlus]
        }
      };

      const component = mount(RestQAProjectSandbox, options);

      expect(component.exists()).toBeTruthy();
      await component.vm.$nextTick();

      //success status code
      expect(component.vm.getTagType(200)).toBe("success");
      expect(component.vm.getTagType(201)).toBe("success");
      expect(component.vm.getTagType(204)).toBe("success");

      //client error status code
      expect(component.vm.getTagType(400)).toBe("warning");
      expect(component.vm.getTagType(401)).toBe("warning");
      expect(component.vm.getTagType(403)).toBe("warning");

      //server error status code
      expect(component.vm.getTagType(500)).toBe("error");
      expect(component.vm.getTagType(501)).toBe("error");
      expect(component.vm.getTagType(504)).toBe("error");
    });
  });

  describe("Delete row", () => {
    test("Delete the selected row", async () => {
      const options = {
        data() {
          return {
            data: [
              {
                ...msg,
                createdAt: "2021-10-05T12:00:00.000Z"
              },
              {
                ...msg,
                createdAt: "2021-10-02T22:00:00.000Z"
              }
            ]
          };
        },
        global: {
          plugins: [ElementPlus]
        }
      };

      msg.createdAt = "2021-10-10T00:00:00.000Z";

      const component = mount(RestQAProjectSandbox, options);
      expect(component.exists()).toBeTruthy();
      await component.vm.$nextTick();

      expect(component.vm.list).toHaveLength(3);
      component.vm.deleteTransaction(1);

      expect(component.vm.list).toHaveLength(2);
      expect(component.vm.list[0].date).toEqual("10/10/21 00:00");
      expect(component.vm.list[1].date).toEqual("02/10/21 22:00");
    });
  });

  describe("copy Scenario", () => {
    test("copy the selected scenario", async () => {
      const $notify = jest.fn();
      const options = {
        global: {
          plugins: [ElementPlus],
          mocks: {
            $notify
          }
        }
      };

      const component = mount(RestQAProjectSandbox, options);
      expect(component.exists()).toBeTruthy();
      await component.vm.$nextTick();

      component.vm.copy(msg);
      expect($notify).toHaveBeenCalledTimes(1);
    });
  });
});
