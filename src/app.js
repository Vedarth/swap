const Express = require("express");
const ExpressGraphQL = require("express-graphql");

const app = Express();

const { schema } = require("./graphql-api/design")

app.use("/graphql", ExpressGraphQL({
    schema: schema,
    graphiql: true
}));

app.listen(3000, () => {
    console.log("Listening at http://localhost:3000/graphql");
})

module.exports = app;