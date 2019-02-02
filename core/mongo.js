let logger = require("./logger");
let config = require("../config");

const Promise = require("bluebird");
let chalk = require("chalk");
let mongoose = require("mongoose");
let autoIncrement = require("mongoose-auto-increment-fix");

module.exports = function () {
  let db;

  logger.info();

  mongoose.Promise = Promise;

  if (mongoose.connection.readyState !== 1) {
    logger.info("Connecting to Mongo " + config.db.uri + "...");
    db = mongoose.connect(config.db.uri, { useNewUrlParser: true }, function mongoAfterConnect(err) {
      if (err) {
        logger.error("Could not connect to MongoDB!");
        return logger.error(err);
      }
      mongoose.set("debug", config.isDevMode());
    });

    mongoose.connection.on("error", function mongoConnectionError(err) {
      if (err.message.code === "ETIMEDOUT") {
        logger.warn("Mongo connection timeout!", err);
        setTimeout(() => {
          mongoose.connect(config.db.uri, config.db.options);
        }, 1000);
        return;
      }

      logger.error("Could not connect to MongoDB!");
      return logger.error(err);
    });

    autoIncrement.initialize(mongoose.connection);

    mongoose.connection.once("open", function mongoAfterOpen() {
      logger.info(chalk.yellow.bold("Mongo DB connected."));
      logger.info();
    });


  } else {
    logger.info("Mongo already connected.");
    db = mongoose;
  }

  return db;
};
