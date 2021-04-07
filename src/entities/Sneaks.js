const models = require("../db/models.js");
const SneaksAPI = require("sneaks-api");
const express = require("express");
const app = new express();

class Sneaks {
  static routes = {
    "/sneaks": {
      instance: this,
      GET: "getSneaksData",
    },
  };

  constructor(event) {
    this.event = event;
    this.body = JSON.parse(this.event.body);
  }

  async getSneaksData() {
    const term = this.event.queryStringParameters.term;
    const sneaks = new SneaksAPI();
    const shoes = await sneaks.getProducts(term, (err, shoes, callback) => {
      if (err) {
        throw err;
      } else {
        console.log(`Shoes for ${term}`);
        console.log(shoes);
        callback(null, shoes);
      }
    });
    return shoes;
    // app.get("/sneaks", (req, res, callback) => {
    //   sneaks.getProducts(term, (err, shoes) => {
    //     if (err) {
    //       throw err;
    //     } else {
    //       res.send(shoes);
    //       console.log(`Shoes for ${term}`);
    //     }
    //   });
    // });
  }
}

module.exports = Sneaks;
