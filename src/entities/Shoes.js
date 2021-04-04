const models = require("../db/models.js");

class Shoes {
  static routes = {
    "/shoes": {
      instance: this,
      GET: "getAllShoes",
    },
    "/users/{userId}/shoes": {
      instance: this,
      GET: "getAllUserShoes",
      POST: "createUserShoe",
    },
    "/users/{userId}/shoes/{shoeId}": {
      instance: this,
      DELETE: "deleteUserShoe",
    },
  };

  constructor(event) {
    this.event = event;
    this.body = JSON.parse(this.event.body);
  }

  async getAllShoes() {
    const shoes = await models.Shoe.findAll();
    return shoes;
  }

  async getAllUserShoes() {
    const userId = this.event.pathParameters.userId;
    const shoes = await models.Shoe.findAll({
      where: {
        userId: userId,
      },
      include: [
        {
          model: models.Image,
        },
        {
          model: models.Model,
        },
        {
          model: models.Brand,
        },
        {
          model: models.User,
        },
        {
          model: models.Collection,
        },
        {
          model: models.Cut,
        },
        {
          model: models.Type,
        },
        {
          model: models.SizeType,
        },
      ],
    });
    return shoes;
  }

  async createUserShoe() {
    const userId = this.event.pathParameters.userId;
    const body = this.body;
    const shoe = await models.Shoe.create({
      name: body.name,
      styleCode: body.styleCode,
      color: body.color,
      size: body.size,
      sizetypeId: body.sizetypeId,
      boxStatus: body.boxStatus,
      wears: body.wears,
      purchasePrice: body.purchasePrice,
      description: body.description,
      receipt: body.receipt,
      nickname: body.nickname,
      modelId: body.modelId,
      brandId: body.brandId,
      userId: userId,
      collectionId: body.collectionId,
      cutId: body.cutId,
      typeId: body.typeId,
      collaborator: body.collaborator,
      imageId: body.imageId,
      releaseDate: body.releaseDate,
      retailPrice: body.retailPrice,
      sneaksId: body.sneaksId,
    });

    return shoe;
  }

  async deleteUserShoe() {
    const shoeId = this.event.pathParameters.shoeId;
    const shoe = await models.Shoe.destroy({
      where: {
        id: shoeId,
      },
    });
    return shoe;
  }
}

module.exports = Shoes;
