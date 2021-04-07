class Router {
  constructor(event, routes) {
    this.event = event;
    this.routes = routes;
  }

  async run() {
    const { resource, httpMethod } = this.event;

    if (this.routes[resource] && this.routes[resource][httpMethod]) {
      return this.routes[resource][httpMethod].call(this);
    } else {
      throw new Error("Unknown route");
    }
  }
}

module.exports = Router;
