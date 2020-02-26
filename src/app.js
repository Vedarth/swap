const Express = require("express");
const ExpressGraphQL = require("express-graphql");
const { schema } = require("./graphql-api/design")
const port = require('../config')['port']

const app = Express();
app.use("/graphql", ExpressGraphQL({
    schema: schema,
    graphiql: true
}));
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/graphql`);
})

module.exports = app;