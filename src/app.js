const Express = require("express");
const ExpressGraphQL = require("express-graphql");
const { schema } = require("./graphql-api/design");
const port = require("../config")["port"];

const express_server = Express();
express_server.use(
  "/graphql",
  ExpressGraphQL({
    schema: schema,
    graphiql: true
  })
);
express_server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/graphql`);
});

module.exports = express_server;
