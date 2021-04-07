const models = require("./db/models.js");
const Router = require("./Router");
const Shoes = require("./entities/Shoes");
const Users = require("./entities/Users");
const Brands = require("./entities/Brands");
const Collections = require("./entities/Collections");
const ShoeModels = require("./entities/ShoeModels");
const Cuts = require("./entities/Cuts");
const Types = require("./entities/Types");
const SizeTypes = require("./entities/SizeTypes");
const Images = require("./entities/Images");
const Sneaks = require("./entities/Sneaks");

class ShoesStackerAPI {
  constructor(event) {
    // super(event, ROUTES);
    this.event = event;
    this.body = JSON.parse(this.event.body);
  }

  router() {
    const { resource, httpMethod } = this.event;
    const routes = {
      ...Shoes.routes,
      ...Users.routes,
      ...Brands.routes,
      ...Collections.routes,
      ...ShoeModels.routes,
      ...Cuts.routes,
      ...Types.routes,
      ...Images.routes,
      ...SizeTypes.routes,
      ...Sneaks.routes,
    };

    if (routes[resource] && routes[resource][httpMethod]) {
      const instanceClass = routes[resource].instance;
      const instance = new instanceClass(this.event);
      const methodName = routes[resource][httpMethod];
      return instance[methodName]();
    } else {
      throw new Error("Unknown route");
    }
  }

  async run() {
    const result = await this.router();
    debugger;
    // TODO do status and headers returns in here
    return result;
  }
}

module.exports = ShoesStackerAPI;
