export const EVENTS = {
  GO: 'restqa.go'
}


export class GO extends CustomEvent {

  constructor(route) {
    super(EVENTS.GO);
    this._route = route;
  }

  set feature(id) {
    this._route = {
      name: "feature",
      params: {
        id
      }
    }
  }

  get route() {
    return this._route;
  }
}

