const models = require("../db/models.js");
const AWS = require("aws-sdk");

class Images {
  static routes = {
    "/images": {
      instance: this,
      GET: "getAllImages",
      POST: "createImage",
    },
    "/images/upload": {
      instance: this,
      POST: "uploadUserShoeImage",
    },
  };

  constructor(event) {
    this.event = event;
    this.body = JSON.parse(this.event.body);
  }

  async getAllImages() {
    const images = await models.Image.findAll({});
    return images;
  }
  async createImage() {
    const body = this.body;
    const image = await models.Image.create({
      name: body.name,
      url: body.url,
      alt: body.alt,
    });
    return image;
  }

  async uploadUserShoeImage() {
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
}

module.exports = Images;
