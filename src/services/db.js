const { MongoClient } = require("mongodb");
const config = require("../../config");

const Collections = {
  Tasks: "tasks"
};

const connect = DBUri =>
  new Promise((resolve, reject) => {
    return MongoClient.connect(
      DBUri,
      {
        appname: "to-do-list",
        autoReconnect: true,
        ignoreUndefined: true,
        loggerLevel: "info",
        reconnectInterval: 5000,
        reconnectTries: Number.MAX_VALUE,
        useNewUrlParser: true
      },
      (err, connection) => {
        if (err) {
          return reject(err);
        }

        return resolve(connection.db());
      }
    );
  });

const mongodbUri = config["services"]["mongodb"]["uri"];
const connection_promise = connect(mongodbUri);

const create_collection = async ({ name, options }) => {
  const connection = await connection_promise;
  return connection.createCollection(name, options);
};

module.exports = {
  Collections,
  create_collection,
  connection_promise
};
