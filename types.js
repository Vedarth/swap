const {
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLBoolean
} = require("graphql");

const TaskType = new GraphQLObjectType({
    name: "Task",
    fields: {
        id: {
            type: GraphQLID
        },
        check: {
            type: GraphQLBoolean
        },
        name: {
            type: GraphQLString
        }
    }
});

const RespMessage = new GraphQLObjectType({
    name: "Response",
    fields: {
        id: {
            type: GraphQLID
        },
        message: {
            type: GraphQLString
        }
    }
});

module.exports = {TaskType, RespMessage};