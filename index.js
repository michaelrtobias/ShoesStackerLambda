const Handler = require("./src/ShoesStackerAPI");
const sequelize = require("./src/db/index.js");
exports.handler = async (event, context) => {
  console.log(event);

  try {
    const handler = new Handler(event);
    const result = await handler.run();
    //close db connection before returning below

    // return {
    //   statusCode: 200,
    //   body: JSON.stringify(result),
    // };
    // {
    //   "Access-Control-Allow-Origin": "*", // Required for CORS
    //   "Access-Control-Allow-Credentials": true, // Required for CORS
    //   "Access-Control-Allow-Methods": "OPTIONS,GET,PUT,POST,PATCH,DELETE",
    //   "Access-Control-Allow-Headers":
    //     "Content-Type,x-tenant-id,x-user-id,x-request-id,x-resource-permissions,x-internal-support-user-id,x-expiration,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    // },

    let _response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: JSON.stringify(result),
    };

    return _response;
  } catch (e) {
    //close db connection before returning below

    return {
      statusCode: 500,
      body: JSON.stringify(e),
    };
  }
};
