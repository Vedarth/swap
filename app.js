const Express = require("express");
const ExpressGraphQL = require("express-graphql");
var app = Express();
var Promise = require('promise');
var { validate } = require('graphql/validation');


const schema = require('./resolver')

app.use("/graphql", ExpressGraphQL({
    schema: schema,
    graphiql: true
}));

app.listen(3000, () => {
    console.log("Listening at http://localhost:3000/graphql");
})

module.exports = app;