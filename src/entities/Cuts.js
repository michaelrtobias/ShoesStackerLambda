const models = require("../db/models.js");

class Cuts {
  static routes = {
    "/cuts": {
      instance: this,
      GET: "findAllCuts",
      POST: "createCut",
    },
  };

  constructor(event) {
    this.event = event;
    this.body = JSON.parse(this.event.body);
  }

  async findAllCuts() {
    const cuts = await models.Cut.findAll({});
    return cuts;
  }
  async createCut() {
    const body = this.body;
    const cut = await models.Cut.create({
      cut: body.cut,
    });
    return cut;
  }
}

module.exports = Cuts;
