const { GraphQLObjectType, GraphQLSchema } = require("graphql");
const { update_task, create_task, delete_task, find_task, find_all_tasks } = require("./resolvers");

// Contains the schema of the API. Query is for retrieving data and Mutation is for modifying data.
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      tasks: find_all_tasks,
      task: find_task
    }
  }),
  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: {
      create: create_task,
      update: update_task,
      delete: delete_task
    }
  })
});

module.exports = { schema };
