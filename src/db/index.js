const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL, { logging: false });

try {
  sequelize.authenticate();
  console.log("postgreSQL is connected!");
} catch (error) {
  throw err;
}

module.exports = sequelize;
