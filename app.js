const Express = require("express");
const ExpressGraphQL = require("express-graphql");
var app = Express();
var Promise = require('promise');
var { validate, specifiedRules } = require('graphql/validation');
const {
    GraphQLObjectType,
    GraphQLSchema
} = require("graphql");

const {
    tasks,
    task,
    create,
    update,
    deleteTask
} = require('./resolver');

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Query",
        fields: {
            tasks: tasks,
            task: task
        }
    }),
    mutation: new GraphQLObjectType({
        name: "Mutation",
        fields: {
            create: create,
            update: update,
            delete: deleteTask
        }
    })
})

app.use("/graphql", ExpressGraphQL({
    schema: schema,
    validationRules: specifiedRules,
    graphiql: true
}));

app.listen(3000, () => {
    console.log("Listening at http://localhost:3000/graphql");
})

module.exports = app;