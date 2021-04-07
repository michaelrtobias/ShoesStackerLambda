const Handler = require("./src/ShoesStackerAPI");
const sequelize = require("./src/db/index.js");
exports.handler = async (event, context) => {
  console.log(event);
  const handler = new Handler(event);
  const result = await handler.run();
  return result;
};
