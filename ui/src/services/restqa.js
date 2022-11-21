import History from "./history";

class RestQA {
  constructor(id) {
    this._current = id || History.last();
  }

  isLatestReport() {
    return this.id === History.last().id;
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
    return percentContributor(this._current.RESTQA_CONTRIBUTORS);
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

function percentContributor(result) {
  if (Array.isArray(result) === false) return [];
  const total = result.reduce(
    (result, item) => result + Number(item.commits),
    0
  );
  return result.map((item) => {
    item.percent = Math.floor((item.commits / total) * 100);
    return item;
  });
}

export default RestQA;
