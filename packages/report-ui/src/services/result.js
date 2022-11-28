import History from "./history";

class Result {
  constructor(id) {
    if (!id) {
      id = History.last().id;
    }
    this._current = History.get(id);
  }

  set current(id) {
    const item = History.get(id);
    if (!item) {
      throw new Error(`The history '${id}' does not exist anymore`);
    }
    this._current = item;
  }

  isFullReport() {
    const keys = Object.keys(this._current);
    if (keys.length === 2 && keys[0] === "RESTQA_RESULT" && keys[1] === "id") {
      return false;
    }
    return true;
  }

  isLatestReport() {
    return this.id === History.last().id;
  }

  get success() {
    return this.local.success;
  }

  get version() {
    return this._current.RESTQA_VERSION;
  }

  get config() {
    return this._current.RESTQA_CONFIG;
  }

  get id() {
    return this._current.id;
  }

  get local() {
    return this._current.RESTQA_RESULT;
  }

  get coverage() {
    return this._current.RESTQA_COVERAGE;
  }

  get contributors() {
    return this._current.RESTQA_CONTRIBUTORS;
  }

  get collection() {
    return this._current.RESTQA_COLLECTION;
  }

  get performance() {
    return this._current.RESTQA_PERFORMANCE || [];
  }

  get specification() {
    return this._current.RESTQA_SPECIFICATION;
  }

  get intgegration() {
    return this._current.RESTQA_INTEGRATION;
  }

  get httpMocks() {
    return this._current.RESTQA_HTTP_MOCKS;
  }
}

export default Result;
