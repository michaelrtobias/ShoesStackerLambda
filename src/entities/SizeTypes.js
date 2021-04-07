const models = require("../db/models.js");

class SizeTypes {
  static routes = {
    "/sizetype": {
      instance: this,
      GET: "getAllSizeTypes",
      POST: "createSizeTypes",
    },
  };

  constructor(event) {
    this.event = event;
    this.body = JSON.parse(this.event.body);
  }

  async getAllSizeTypes() {
    const sizeType = await models.SizeType.findAll({});
    return sizeType;
  }
  async createSizeTypes() {
    const body = this.body;
    const sizeType = await models.SizeType.create({
      sizeType: body.sizeType,
    });
    return sizeType;
  }
}

module.exports = SizeTypes;
