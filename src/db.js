const mongoose = require("mongoose");

function connect() {
  mongoose.connect(`${process.env.MONGO_CONNECTION}/airbnb`);

  mongoose.connection.once("open", () => {
    console.log("Connected with mongo");
  });

  mongoose.connection.on("error", (err) => {
    console.log("Something went wrong!", err);
  });

  return mongoose.connection;
}
module.exports = { connect };
