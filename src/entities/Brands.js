const models = require("../db/models.js");

class Brands {
  static routes = {
    "/brands": {
      instance: this,
      GET: "getAllBrands",
      POST: "createBrands",
    },
    "/brands/search": {
      instance: this,
      POST: "searchBrands",
    },
  };

  constructor(event) {
    this.event = event;
    this.body = JSON.parse(this.event.body);
  }
  async getAllBrands() {
    const brands = await models.Brand.findAll({});
    return brands;
  }

  async createBrands() {
    const body = this.body;
    const brand = await models.Brand.create({
      name: body.name,
      headquarters: body.headquarters,
    });
    return brand;
  }

  async searchBrands() {
    const body = this.body;
    const brands = await models.Brand.findOrCreate({
      where: { name: body.name },
      defaults: { headquarters: null },
    });

    return brands;
  }
}

module.exports = Brands;
