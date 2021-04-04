const models = require("../db/models.js");
const SneaksAPI = require("sneaks-api");

class Sneaks {
  static routes = {
    "/sneaks": {
      instance: this,
      GET: "getSneaksData",
    },
  };

  constructor(event) {
    this.event = event;
    this.body = JSON.parse(this.event.body);
  }

  async getSneaksData() {
    const body = this.body;
    const term = this.event.queryStringParameters.term;
    const sneaks = new SneaksAPI();
    const shoes = await sneaks.getProducts(term, (err, shoes) => {
      if (err) {
        throw err;
      } else {
        console.log(`Shoes for ${term}`);
        return shoes;
      }
    });
    return shoes;
  }
}

module.exports = Sneaks;
