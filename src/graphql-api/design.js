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
} = require("./resolver");

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

module.exports = {schema}