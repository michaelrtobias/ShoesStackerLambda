const models = require("../db/models.js");

class Collections {
  static routes = {
    "/brands/{brandid}/collections": {
      instance: this,
      GET: "getBrandCollections",
      POST: "createCollection",
    },
    "/brands/{brandid}/collections/search": {
      instance: this,
      POST: "searchCollections",
    },
  };

  constructor(event) {
    this.event = event;
    this.body = JSON.parse(this.event.body);
  }

  async searchCollections() {
    const body = this.body;
    const brandId = this.event.pathParameters.brandid;

    const collections = await models.Collection.findOrCreate({
      where: {
        name: body.name.toLowerCase(),
      },
      defaults: {
        brandId: brandId,
      },
    });
    return collections;
  }

  async getBrandCollections() {
    const body = this.body;
    const brandId = this.event.pathParameters.brandid;
    const collection = await models.Collection.findAll({
      where: {
        brandId: brandId,
      },
    });
    return collection;
  }

  async createCollection() {
    const body = this.body;
    const brandId = this.event.pathParameters.brandid;
    const collection = await models.Collection.create({
      name: body.name,
      brandId: brandId,
    });
    return collection;
  }
}

module.exports = Collections;
