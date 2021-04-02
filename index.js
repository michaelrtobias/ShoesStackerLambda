const Handler = require("./src/ShoesStackerAPI");
const sequelize = require("./src/db/index.js");
exports.handler = async (event, context) => {
  console.log(event);

  try {
    const handler = new Handler(event);
    const result = await handler.run();
    //close db connection before returning below

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (e) {
    //close db connection before returning below

    return {
      statusCode: 500,
      body: JSON.stringify(e),
    };
  }
};
