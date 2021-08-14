import * as Service from "../../../services/restqa/project";
jest.mock("../../..//services/restqa/project");

import {mount} from "@vue/test-utils";
import {createStore} from "vuex";
import ElementPlus from "element-plus";
import Store from "@/store/modules/restqa";
import {ValidationError} from "../../../services/http";
import RestQAProjectInit from "./RestQAProjectInit.vue";

describe("RestQAProjectInit", () => {
  let store;
  let mockConfigAction = jest.fn();

  Store.actions.config = mockConfigAction;

  Service.initialize = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    store = createStore({
      modules: {
        restqa: Store
      }
    });
  });

  test("Should show an error if the name is not defined when we try to trigger the initialization", async () => {
    const err = new ValidationError("Please share a project name.");
    Service.initialize.mockRejectedValue(err);

    const options = {
      global: {
        plugins: [store, ElementPlus],
        mocks: {
          $notify: jest.fn()
        }
      },
      shallow: false
    };
    const component = mount(RestQAProjectInit, options);

    expect(component.exists()).toBeTruthy();

    const inputs = {
      name: component.findComponent({ref: "form"}).findAll("input")[0],
      description: component.findComponent({ref: "form"}).findAll("input")[1],
      url: component.findComponent({ref: "form"}).findAll("input")[2],
      env: component.findComponent({ref: "form"}).findAll("input")[3],
      btn: component.findComponent({ref: "form"}).find("button")
    };

    expect(component.findComponent({name: "card"}).vm.loading).toBeFalsy();

    await inputs.btn.trigger("click");

    expect(component.findComponent({name: "card"}).vm.loading).toBeTruthy();

    await component.vm.$nextTick();

    expect(Service.initialize).toHaveBeenCalledTimes(1);
    const expectedData = {};
    expect(Service.initialize.mock.calls[0][0]).toEqual(expectedData);

    await component.vm.$nextTick();

    expect(options.global.mocks.$notify).toHaveBeenCalledTimes(1);
    const expectedNotification = {
      title: "Oups",
      message: "Please share a project name.",
      type: "warning"
    };
    expect(options.global.mocks.$notify.mock.calls[0][0]).toEqual(
      expectedNotification
    );
    expect(mockConfigAction).toHaveBeenCalledTimes(0);
  });

  test("Should show an error if the backend has a server error", async () => {
    const err = new Error("Backend error");
    Service.initialize.mockRejectedValue(err);

    const options = {
      global: {
        plugins: [store, ElementPlus],
        mocks: {
          $notify: jest.fn()
        }
      },
      shallow: false
    };
    const component = mount(RestQAProjectInit, options);

    expect(component.exists()).toBeTruthy();

    const inputs = {
      name: component.findComponent({ref: "form"}).findAll("input")[0],
      description: component.findComponent({ref: "form"}).findAll("input")[1],
      url: component.findComponent({ref: "form"}).findAll("input")[2],
      env: component.findComponent({ref: "form"}).findAll("input")[3],
      btn: component.findComponent({ref: "form"}).find("button")
    };

    expect(component.findComponent({name: "card"}).vm.loading).toBeFalsy();

    await inputs.btn.trigger("click");

    expect(component.findComponent({name: "card"}).vm.loading).toBeTruthy();

    await component.vm.$nextTick();

    expect(Service.initialize).toHaveBeenCalledTimes(1);
    const expectedData = {};
    expect(Service.initialize.mock.calls[0][0]).toEqual(expectedData);

    await component.vm.$nextTick();

    expect(options.global.mocks.$notify).toHaveBeenCalledTimes(1);
    const expectedNotification = {
      title: "Oups",
      message: "Backend error",
      type: "error"
    };
    expect(options.global.mocks.$notify.mock.calls[0][0]).toEqual(
      expectedNotification
    );
    expect(mockConfigAction).toHaveBeenCalledTimes(0);
  });

  test("Should initalize the project", async () => {
    Service.initialize.mockResolvedValue({
      folder: "/tmp/project/",
      configuration: "/tmp/project/.restqa.yml"
    });

    const options = {
      global: {
        plugins: [store, ElementPlus],
        mocks: {
          $notify: jest.fn()
        }
      },
      shallow: false
    };
    const component = mount(RestQAProjectInit, options);

    expect(component.exists()).toBeTruthy();

    const inputs = {
      name: component.findComponent({ref: "form"}).findAll("input")[0],
      description: component.findComponent({ref: "form"}).findAll("input")[1],
      url: component.findComponent({ref: "form"}).findAll("input")[2],
      env: component.findComponent({ref: "form"}).findAll("input")[3],
      btn: component.findComponent({ref: "form"}).find("button")
    };

    const expectedData = {
      name: "backend api",
      description:
        "The backend apis used by all the corporate frontend clients",
      url: "https://api.restqa.io",
      env: "prod"
    };

    inputs.name.setValue(expectedData.name);
    inputs.description.setValue(expectedData.description);
    inputs.url.setValue(expectedData.url);
    inputs.env.setValue(expectedData.env);

    expect(component.findComponent({name: "card"}).vm.loading).toBeFalsy();

    await inputs.btn.trigger("click");

    expect(component.findComponent({name: "card"}).vm.loading).toBeTruthy();

    await component.vm.$nextTick();

    expect(component.findComponent({name: "card"}).vm.loading).toBeFalsy();

    expect(Service.initialize).toHaveBeenCalledTimes(1);
    expect(Service.initialize.mock.calls[0][0]).toEqual(expectedData);

    await component.vm.$nextTick();

    expect(options.global.mocks.$notify).toHaveBeenCalledTimes(1);
    const expectedNotification = {
      title: "Let's go!",
      message: "🚀🚀 Your project has been created successfully!",
      type: "success"
    };
    expect(options.global.mocks.$notify.mock.calls[0][0]).toEqual(
      expectedNotification
    );
    expect(mockConfigAction).toHaveBeenCalledTimes(1);
  });
});
