const models = require("./db/models.js");
const SneaksAPI = require("sneaks-api");
const AWS = require("aws-sdk");
const Router = require("./Router");
const Shoes = require("./entities/Shoes");

class ShoesStackerAPI {
  constructor(event) {
    // super(event, ROUTES);
    this.event = event;
    this.body = JSON.parse(this.event.body);
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

  async _createUserShoe() {
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

    // console.log("this is the correct handler");
    return shoe;
  }

  async _deleteUserShoe() {
    const shoeId = this.event.pathParameters.shoeId;
    const shoe = await models.Shoe.destroy({
      where: {
        id: shoeId,
      },
    });
    return shoe;
  }

  //USERS
  async _createUser() {
    const body = this.body;
    const user = await models.User.create({
      firstName: body.firstName,
      lastName: body.lastName,
    });

    return user;
  }

  async _getAllUsers() {
    const users = await models.User.findAll();
    return users;
  }

  async _getCurrentUser() {
    const userId = this.event.pathParameters.userId;
    const user = await models.User.findAll({
      where: {
        id: userId,
      },
    });
    return user;
  }

  //BRANDS
  async _getAllBrands() {
    const brands = await models.Brand.findAll({});
    return brands;
  }

  async _createBrands() {
    const body = this.body;
    const brand = await models.Brand.create({
      name: body.name,
      headquarters: body.headquarters,
    });
    return brand;
  }

  async _searchBrands() {
    const body = this.body;
    const brands = await models.Brand.findOrCreate({
      where: { name: body.name },
      defaults: { headquarters: null },
    });

    return brands;
  }

  //COLLECTIONS

  async _searchCollections() {
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

  async _getBrandCollections() {
    const body = this.body;
    const brandId = this.event.pathParameters.brandid;
    const collection = await models.Collection.findAll({
      where: {
        brandId: brandId,
      },
    });
    return collection;
  }

  async _createCollection() {
    const body = this.body;
    const brandId = this.event.pathParameters.brandid;
    const collection = await models.Collection.create({
      name: body.name,
      brandId: brandId,
    });
    return collection;
  }

  //MODELS

  async _searchModels() {
    const body = this.body;
    const shoeModel = await models.Model.findOrCreate({
      where: {
        name: body.name,
      },
      defaults: {
        brandId: body.brandId,
        collectionId: body.collectionId,
      },
    });
    return shoeModel;
  }
  async _findModelsOfCollection() {
    const body = this.body;
    const collectionId = this.event.pathParameters.collectionId;
    const model = await models.Model.findAll({
      where: {
        collectionId: collectionId,
      },
    });
    return model;
  }
  async _createModel() {
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
  //TYPES
  async _getAllTypes() {
    const types = await models.Type.findAll({});
    return types;
  }
  async _createType() {
    const body = this.body;
    const type = await models.Type.create({
      name: body.name,
    });
    return type;
  }
  //CUTS
  async _findAllCuts() {
    const cuts = await models.Cut.findAll({});
    return cuts;
  }
  async _createCut() {
    const body = this.body;
    const cut = await models.Cut.create({
      cut: body.cut,
    });
    return cut;
  }
  //SIZETYPES
  async _getAllSizeTypes() {
    const sizeType = await models.SizeType.findAll({});
    return sizeType;
  }
  async _createSizeTypes() {
    const body = this.body;
    const sizeType = await models.SizeType.create({
      sizeType: body.sizeType,
    });
    return sizeType;
  }
  //IMAGES
  async _getAllImages() {
    const images = await models.Image.findAll({});
    return images;
  }
  async _createImage() {
    const body = this.body;
    const image = await models.Image.create({
      name: body.name,
      url: body.url,
      alt: body.alt,
    });
    return image;
  }

  async _uploadUserShoeImage() {
    const body = this.body;
    const S3_Bucket = process.env.BUCKET;

    const s3 = new AWS.S3();
    const fileName = body.fileName;
    const fileType = body.fileType;
    const s3Params = {
      Bucket: S3_Bucket,
      Key: fileName,
      Expires: 500,
      ContentType: fileType,
      ACL: "public-read",
    };

    const image = await s3.getSignedUrl("putObject", s3Params, (err, url) => {
      if (err) {
        throw err;
      } else {
        const returnData = {
          signedRequest: url,
          url: `https://${S3_Bucket}.s3.amazonaws.com/${fileName}`,
        };
        console.log("URL Created");
        return JSON.stringify({ success: true, data: { returnData } });
      }
    });
    return image;
  }
  //SNEAKS
  async _getSneaksData() {
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

  router() {
    const { resource, httpMethod } = this.event;
    const routes = {
      ...Shoes.routes,
      // ...Users.routes,
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

const ROUTES = {
  // "/shoes": {
  //   GET: Shoes.prototype._getAllShoes,
  // },
  "/users": {
    GET: ShoesStackerAPI.prototype._getAllUsers,
    POST: ShoesStackerAPI.prototype._createUser,
  },
  "/users/{userId}": {
    GET: ShoesStackerAPI.prototype._getCurrentUser,
  },
  "/users/{userId}/shoes": {
    GET: ShoesStackerAPI.prototype._getAllUserShoes,
    POST: ShoesStackerAPI.prototype._createUserShoe,
  },
  "/users/{userId}/shoes/{shoeId}": {
    DELETE: ShoesStackerAPI.prototype._deleteUserShoe,
  },
  "/brands": {
    GET: ShoesStackerAPI.prototype._getAllBrands,
    POST: ShoesStackerAPI.prototype._createBrands,
  },
  "/brands/search": {
    POST: ShoesStackerAPI.prototype._searchBrands,
  },
  "/brands/{brandid}/collections/search": {
    POST: ShoesStackerAPI.prototype._searchCollections,
  },
  "/brands/{brandid}/collections/{collectionId}/models/search": {
    POST: ShoesStackerAPI.prototype._searchModels,
  },
  "/types": {
    GET: ShoesStackerAPI.prototype._getAllTypes,
    POST: ShoesStackerAPI.prototype._createType,
  },
  "/brands/{brandid}/collections": {
    GET: ShoesStackerAPI.prototype._getBrandCollections,
    POST: ShoesStackerAPI.prototype._createCollection,
  },
  "/brands/{brandid}/collections/{collectionId}/models": {
    GET: ShoesStackerAPI.prototype._findModelsOfCollection,
    POST: ShoesStackerAPI.prototype._createModel,
  },
  "/cuts": {
    GET: ShoesStackerAPI.prototype._findAllCuts,
    POST: ShoesStackerAPI.prototype._createCut,
  },
  "/sizetype": {
    GET: ShoesStackerAPI.prototype._getAllSizeTypes,
    POST: ShoesStackerAPI.prototype._createSizeTypes,
  },
  "/images": {
    GET: ShoesStackerAPI.prototype._getAllImages,
    POST: ShoesStackerAPI.prototype._createImage,
  },
  "/images/upload": {
    POST: ShoesStackerAPI.prototype._uploadUserShoeImage,
  },
  "/sneaks": {
    GET: ShoesStackerAPI.prototype._getSneaksData,
  },
};

module.exports = ShoesStackerAPI;
