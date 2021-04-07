const models = require("../db/models.js");

class ShoeModels {
  static routes = {
    "/brands/{brandid}/collections/{collectionId}/models": {
      instance: this,
      GET: "findModelsOfCollection",
      POST: "createModel",
    },

    "/brands/{brandid}/collections/{collectionId}/models/search": {
      instance: this,
      POST: "searchModels",
    },
  };

  constructor(event) {
    this.event = event;
    this.body = JSON.parse(this.event.body);
  }
  async searchModels() {
    const body = this.body;
    const brandId = this.event.pathParameters.brandid;
    const collectionId = this.event.pathParameters.collectionId;

    const shoeModel = await models.Model.findOrCreate({
      where: {
        name: body.name,
      },
      defaults: {
        brandId: brandId,
        collectionId: collectionId,
      },
    });
    return shoeModel;
  }
  async findModelsOfCollection() {
    const body = this.body;
    const collectionId = this.event.pathParameters.collectionId;
    const model = await models.Model.findAll({
      where: {
        collectionId: collectionId,
      },
    });
    return model;
  }
  async createModel() {
    const body = this.body;
    const brandId = this.event.pathParameters.brandid;
    const collectionId = this.event.pathParameters.collectionId;
    debugger;
    const model = await models.Model.create({
      name: body.name,
      brandId: brandId,
      collectionId: collectionId,
    });
    return model;
  }
}

module.exports = ShoeModels;
