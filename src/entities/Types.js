const models = require("../db/models.js");

class Types {
  static routes = {
    "/types": {
      instance: this,
      GET: "getAllTypes",
      POST: "createType",
    },
  };

  constructor(event) {
    this.event = event;
    this.body = JSON.parse(this.event.body);
  }

  async getAllTypes() {
    const types = await models.Type.findAll({});
    return types;
  }
  async createType() {
    const body = this.body;
    const type = await models.Type.create({
      name: body.name,
    });
    return type;
  }
}

module.exports = Types;
