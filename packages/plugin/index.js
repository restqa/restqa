module.exports = class PluginFactory {
  /**
   *
   * @param {PluginFactory.Options} options
   */
  constructor(name) {
    if (typeof name === "string") {
      this._name = name;
    } else {
      throw new Error("A name property should be pass to the constructor");
    }

    // steps
    this._givenSteps = [];
    this._whenSteps = [];
    this._thenSteps = [];

    // hooks
    this._beforeHooks = [];
    this._afterHooks = [];
    this._beforeAllHooks = [];
    this._afterAllHooks = [];

    // state
    this._state = {};
  }

  get name() {
    return this._name;
  }

  addGivenStep(stepDefinition, handler, description, tags) {
    const formattedTags = this._formatTagsAndAddName(tags);

    this._givenSteps.push([
      stepDefinition,
      handler,
      description,
      formattedTags
    ]);

    return this;
  }

  addWhenStep(stepDefinition, handler, description, tags) {
    const formattedTags = this._formatTagsAndAddName(tags);

    this._whenSteps.push([stepDefinition, handler, description, formattedTags]);

    return this;
  }

  addThenStep(stepDefinition, handler, description, tags) {
    const formattedTags = this._formatTagsAndAddName(tags);

    this._thenSteps.push([stepDefinition, handler, description, formattedTags]);

    return this;
  }

  addBeforeHook(...args) {
    this._checkHookArguments(args, "addBeforeHook");

    this._beforeHooks.push(args);

    return this;
  }

  addAfterHook(...args) {
    this._checkHookArguments(args, "addAfterHook");

    this._afterHooks.push(args);

    return this;
  }

  addBeforeAllHook(...args) {
    this._checkHookArguments(args, "addBeforeAllHook");

    this._beforeAllHooks.push(args);

    return this;
  }

  addAfterAllHook(...args) {
    this._checkHookArguments(args, "addAfterAllHook");

    this._afterAllHooks.push(args);

    return this;
  }

  addState(key, value) {
    if (typeof key !== "string") {
      throw new TypeError(
        `addState key parameter should be string, instead got ${typeof key}`
      );
    } else if (key.length < 1) {
      throw new Error("addState key parameter should not be an empty string");
    }

    this._state[key] = value;

    return this;
  }

  /**
   *
   * FOR RESTQA CORE ONLY
   */
  _commit(cucumber, config) {
    if (
      cucumber === null ||
      typeof cucumber !== "object" ||
      Array.isArray(cucumber)
    ) {
      throw new TypeError(
        `Cucumber instance should be an object but got ${cucumber}`
      );
    }

    this._commitSteps("Given", this._givenSteps, cucumber.Given);
    this._commitSteps("When", this._whenSteps, cucumber.When);
    this._commitSteps("Then", this._thenSteps, cucumber.Then);

    this._commitHooks("After", this._afterHooks, cucumber.After);
    this._commitHooks("AfterAll", this._afterAllHooks, cucumber.AfterAll);
    this._commitHooks("Before", this._beforeHooks, cucumber.Before);
    this._commitHooks("BeforeAll", this._beforeAllHooks, cucumber.BeforeAll);

    if (config) {
      if (typeof config === "object" && !Array.isArray(config)) {
        this._config = config;
      } else {
        const wrongType = Array.isArray(config) ? "array" : typeof config;

        throw new TypeError(
          `Config should be an object instead got ${wrongType}`
        );
      }
    }

    return this;
  }

  _getState() {
    return this._state;
  }

  _getConfig() {
    return this._config;
  }

  /**
   * UTILS
   */
  _checkHookArguments(args, functionContextName = "hook") {
    const [firstArg, secondArg] = args;
    if (
      typeof firstArg !== "function" &&
      typeof firstArg !== "string" &&
      !firstArg.tags &&
      !firstArg.timeout
    ) {
      throw new TypeError(
        `${functionContextName} first parameter should be a function a string or an object with a tags property but got ${typeof firstArg}`
      );
    } else if (
      typeof firstArg !== "function" &&
      typeof secondArg !== "function"
    ) {
      throw new TypeError(
        `${functionContextName} second parameter should be a function but got ${typeof secondArg}`
      );
    }
  }

  _checkRestrictedHookArguments(args, functionContextName = "hook") {
    const [firstArg] = args;
    if (typeof firstArg !== "function") {
      throw new TypeError(
        `${functionContextName} first parameter should be a function but got ${typeof firstArg}`
      );
    }
  }

  _formatTagsAndAddName(tags) {
    if (tags !== undefined) {
      return Array.isArray(tags) ? [this.name, ...tags] : [this.name, tags];
    } else {
      return [this.name];
    }
  }

  _commitSteps(name, steps, instanceFunction) {
    if (steps.length) {
      if (typeof instanceFunction === "function") {
        steps.forEach((step) => {
          instanceFunction.apply(this, step);
        });
      } else {
        throw new Error(
          `There are ${name} steps to bind, cucumber instance should contains ${name} function`
        );
      }
    }
  }

  _commitHooks(name, hooks, instanceFunction) {
    if (hooks.length) {
      if (typeof instanceFunction === "function") {
        hooks.forEach((step) => instanceFunction.apply(this, step));
      } else {
        throw new Error(
          `There are ${name} hooks to bind, cucumber instance should contains ${name} function`
        );
      }
    }
  }
};
