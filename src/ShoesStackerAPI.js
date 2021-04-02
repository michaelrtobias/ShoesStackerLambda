const models = require("./db/models.js");
const SneaksAPI = require("sneaks-api");

class ShoesStackerAPI {
  constructor(event) {
    this.event = event;
    this.body = JSON.parse(this.event.body);
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
    const collections = await models.Collection.findOrCreate({
      where: {
        name: body.name.toLowerCase(),
      },
      defaults: {
        brandId: body.brandId,
      },
    });
    return collections;
  }

  async _getBrandCollections() {
    const body = this.body;
    const brandId = this.event.pathParameters.brandId;
    const collection = await models.Collection.findAll({
      where: {
        brandId: brandId,
      },
    });
    return collection;
  }

  async _createCollection() {
    const body = this.body;
    const brandId = this.event.pathParameters.brandId;
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
    const brandId = this.event.pathParameters.brandId;
    const collectionId = this.event.pathParameters.collectionId;
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

    const image = s3.getSignedUrl("putObject", s3Params, (err, url) => {
      if (err) {
        throw err;
      } else {
        const returnData = {
          signedRequest: url,
          url: `https://${S3_Bucket}.s3.amazonaws.com/${fileName}`,
        };
        console.log("URL Created");
        return { success: true, data: { returnData } };
      }
    });
    return image;
  }
  //SNEAKS
  async _getSneaksData() {
    const body = this.body;
    const sneaks = new SneaksAPI();
    const shoes = await sneaks.getProducts(req.query.term, (err, shoes) => {
      if (err) {
        throw err;
      } else {
        res.send(shoes);
        console.log(`Shoes for ${req.query.term}`);
      }
    });
    return shoes;
  }

  async run() {
    const event = this.event;
    const resource = this.event.resource;
    const method = this.event.httpMethod;

    if (resource === "/shoes" && method === "GET") {
      return this._getAllShoes();
    } else if (resource === "/users/{userId}/shoes" && method === "GET") {
      return this._getAllUserShoes();
    } else if (resource === "/users/{userId}/shoes" && method === "POST") {
      return this._createUserShoe();
    } else if (
      resource === "/users/{userId}/shoes/{shoeId}" &&
      method === "DELETE"
    ) {
      return this._deleteUserShoe();
    } else if (resource === "/users" && method === "POST") {
      return this._createUser();
    } else if (resource === "/users" && method === "GET") {
      return this._getAllUsers();
    } else if (resource === "/users/{userId}" && method === "GET") {
      return this._getCurrentUser();
    } else if (resource === "/brands" && method === "GET") {
      return this._getAllBrands();
    } else if (resource === "/brands" && method === "POST") {
      return this._createBrands();
    } else if (resource === "/brands/search" && method === "POST") {
      return this._searchBrands();
    } else if (
      resource === "/brands/{brandId}/collections/search" &&
      method === "POST"
    ) {
      return this._searchCollections();
    } else if (
      resource ===
        "/brands/{brandId}/collections/{collectionId}/models/search" &&
      method === "POST"
    ) {
      return this._searchModels();
    } else if (resource === "/types" && method === "GET") {
      return this._getAllTypes();
    } else if (resource === "/types" && method === "POST") {
      return this._createType();
    } else if (
      resource === "/brands/{brandId}/collections" &&
      method === "GET"
    ) {
      return this._getBrandCollections();
    } else if (
      resource === "/brands/{brandId}/collections" &&
      method === "POST"
    ) {
      return this._createCollection();
    } else if (
      resource === "/brands/{brandId}/collections{collectionId}/models" &&
      method === "GET"
    ) {
      return this._findModelsOfCollection();
    } else if (
      resource === "/brands/{brandId}/collections{collectionId}/models" &&
      method === "POST"
    ) {
      return this._createModel();
    } else if (resource === "/cuts" && method === "POST") {
      return this._createCut();
    } else if (resource === "/cuts" && method === "GET") {
      return this._findAllCuts();
    } else if (resource === "/sizetype" && method === "POST") {
      return this._createSizeTypes();
    } else if (resource === "/sizetype" && method === "GET") {
      return this._getAllSizeTypes();
    } else if (resource === "/images" && method === "POST") {
      return this._createImage();
    } else if (resource === "/images" && method === "GET") {
      return this._getAllImages();
    } else if (resource === "/images/upload" && method === "POST") {
      return this._uploadUserShoeImage();
    } else if (resource === "/sneaks" && method === "GET") {
      return this._getSneaksData();
    } else if (resource === "/") {
      return "Test Complete";
    } else {
      throw new Error("unknown route");
    }
  }
}

module.exports = ShoesStackerAPI;
