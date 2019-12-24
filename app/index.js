import { GraphQLID, GraphQLString, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLNonNull, GraphQLBoolean } from "graphql";
import { MongoClient, ObjectID } from "mongodb";
import * as Express from "express";
import * as ExpressGraphQL from "express-graphql";
const app = Express();
const url = 'mongodb://localhost:27017';
const dbName = 'todolist';
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
const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Query",
        fields: {
            tasks: {
                type: GraphQLList(TaskType),
                resolve: (root, args, context, info) => {
                    return MongoClient.connect('mongodb://localhost:27017').then(function (client) {
                        const db = client.db(dbName);
                        const collection = db.collection('tasks');
                        return collection.find().toArray();
                    }).then(function (items) {
                        console.log(items);
                        for (var item of items) {
                            item['id'] = item['_id'];
                        }
                        return items;
                    });
                }
            },
            task: {
                type: TaskType,
                args: {
                    id: { type: GraphQLNonNull(GraphQLID) }
                },
                resolve: (root, args, context, info) => {
                    return MongoClient.connect('mongodb://localhost:27017').then(function (client) {
                        const db = client.db(dbName);
                        var collection = db.collection('tasks');
                        console.log(args.id);
                        return collection.findOne({ _id: new ObjectID(args.id) });
                    }).then(function (item) {
                        console.log(item);
                        item['id'] = item['_id'];
                        return item;
                    });
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
                    name: { type: GraphQLNonNull(GraphQLString) }
                },
                resolve: (root, args, context, info) => {
                    return MongoClient.connect('mongodb://localhost:27017').then(function (client) {
                        const db = client.db(dbName);
                        const collection = db.collection('tasks');
                        return collection.insertOne({ name: args.name, check: false });
                    }).then(function (item) {
                        console.log(item.ops[0]);
                        const ans = item.ops[0];
                        ans['id'] = ans['_id'];
                        return ans;
                    });
                }
            },
            update: {
                type: RespMessage,
                args: {
                    id: { type: GraphQLNonNull(GraphQLID) },
                    check: { type: GraphQLNonNull(GraphQLBoolean) }
                },
                resolve: (root, args, context, info) => {
                    return MongoClient.connect('mongodb://localhost:27017').then(function (client) {
                        const db = client.db(dbName);
                        const collection = db.collection('tasks');
                        return collection.updateOne({ _id: new ObjectID(args.id) }, { $set: { check: args.check } });
                    }).then(function (item) {
                        const ans = new Object();
                        ans['id'] = args.id;
                        ans['message'] = `Successfully updated ${args.id} to ${args.check}`;
                        return ans;
                    });
                }
            },
            delete: {
                type: RespMessage,
                args: {
                    id: { type: GraphQLNonNull(GraphQLID) }
                },
                resolve: (root, args, context, info) => {
                    return MongoClient.connect('mongodb://localhost:27017').then(function (client) {
                        const db = client.db(dbName);
                        const collection = db.collection('tasks');
                        return collection.deleteOne({ _id: new ObjectID(args.id) });
                    }).then(function (item) {
                        console.log(item.result.n);
                        const ans = new Object();
                        if (item.result.n === 0) {
                            ans['id'] = args.id;
                            ans['message'] = `${args.id} is not found`;
                        }
                        else {
                            ans['id'] = args.id;
                            ans['message'] = `Successfully deleted ${args.id}`;
                        }
                        return ans;
                    });
                }
            }
        }
    })
});
app.use("/graphql", ExpressGraphQL({
    schema: schema,
    graphiql: true
}));
app.listen(3000, () => {
    console.log("Listening at http://localhost:3000/graphql");
});
module.exports = app;
