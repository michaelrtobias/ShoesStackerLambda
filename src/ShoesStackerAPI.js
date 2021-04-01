const models = require("./db/models.js");

class ShoesStackerAPI {
  constructor(event) {
    this.event = event;
  }

  async _getAllShoes() {
    const shoes = await models.Shoe.findAll();
    return shoes;
  }

  async _getAllUserShoes() {
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

  async run() {
    const resource = this.event.resource;
    switch (resource) {
      case "/shoes":
        return this._getAllShoes();

      case "/users/{userId}/shoes":
        return this._getAllUserShoes();
      default:
        throw new Error("unknown route");
    }
  }
}

module.exports = ShoesStackerAPI;
