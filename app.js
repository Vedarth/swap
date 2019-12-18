const Express = require("express");
const ExpressGraphQL = require("express-graphql");
const Mongoose = require("mongoose");
const {
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLBoolean
} = require("graphql");

var app = Express();

Mongoose.connect("mongodb://localhost/todolist")

const TaskModel = Mongoose.model("task", {
    check: Boolean,
    name: String
});

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

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Query",
        fields: {
            tasks: {
                type: GraphQLList(TaskType),
                resolve: (root, args, context, info) => {
                    return TaskModel.find().exec();
                }
            },
            task: {
                type: TaskType,
                args: {
                    id: { type: GraphQLNonNull(GraphQLID)}
                },
                resolve: (root, args, context, info) => {
                    return TaskModel.findById(args.id).exec();
                }
            }
        }
    }),
    mutation: new GraphQLObjectType({
        name: "Mutation",
        fields: {
            create: {
                type: TaskType,
                args: {
                    name: { type: GraphQLNonNull(GraphQLString)}
                },
                resolve: (root, args, context, info) => {
                    var task = new TaskModel(args);
                    task.check = false;
                    return task.save();
                }
            },
            update: {
                type: TaskType,
                args: {
                    id: {type: GraphQLNonNull(GraphQLID)},
                    check: {type: GraphQLNonNull(GraphQLBoolean)}
                },
                resolve: (root, args, context, info) => {
                    var task = TaskModel.findByIdAndUpdate(args.id, {check: args.check}).exec();
                    return TaskModel.findById(args.id);
                }
            },
            delete: {
                type: TaskType,
                args: {
                    id: {type: GraphQLNonNull(GraphQLID)}
                },
                resolve: (root, args, context, info) => {
                    return TaskModel.findByIdAndDelete(args.id);
                }
            }
        }
    })
})

app.use("/graphql", ExpressGraphQL({
    schema: schema,
    graphiql: true
}));

app.listen(3000, () => {
    console.log("Listening at http://localhost:3000/graphql");
})

module.exports = app;