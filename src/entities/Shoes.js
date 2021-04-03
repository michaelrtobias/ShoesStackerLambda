const models = require("../db/models.js");

class Shoes {
  static routes = {
    "/shoes": {
      instance: this,
      GET: "getAllShoes",
      // POST: "_createShoes"
    },
    // "/shoes/{shoeId}": {
    //   instance: this,
    //   GET: "someFunc",
    // },
  };

  constructor(event) {
    this.event = event;
  }

  async getAllShoes() {
    const bla = this.event;
    this.testfunc();
    const shoes = await models.Shoe.findAll();
    return shoes;
  }

  testfunc() {
    debugger;
  }
}

// const ROUTES = {
//   "/shoes": {
//     GET: Shoes.prototype._getAllShoes,
//   },
// };

module.exports = Shoes;
