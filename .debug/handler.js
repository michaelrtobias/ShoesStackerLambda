const fs = require("fs");

const invoke = async () => {
  const event = JSON.parse(fs.readFileSync(`${__dirname}/event.json`));
  const context = {
    key: "mock context"
  };
  await require("../index")
    .handler(event, context)
    .then((output) => {
      console.log(output);
      fs.writeFileSync(
        `${__dirname}/out.json`,
        JSON.stringify(output, true, 2)
      );
    })
    .catch((err) => {
      throw new Error(err);
    });
};

module.exports = { invoke };
