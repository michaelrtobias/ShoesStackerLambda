const models = require("../db/models.js");

class Users {
  static routes = {
    "/users": {
      instance: this,
      GET: "getAllUsers",
      POST: "createUser",
    },
    "/users/{userId}": {
      instance: this,
      GET: "getCurrentUser",
    },
  };
  constructor(event) {
    this.event = event;
    this.body = JSON.parse(this.event.body);
  }
  async createUser() {
    const body = this.body;
    const user = await models.User.create({
      firstName: body.firstName,
      lastName: body.lastName,
    });

    return user;
  }

  async getAllUsers() {
    const users = await models.User.findAll();
    return users;
  }

  async getCurrentUser() {
    const userId = this.event.pathParameters.userId;
    const user = await models.User.findAll({
      where: {
        id: userId,
      },
    });
    return user;
  }
}

module.exports = Users;
