const Express = require("express");
const ExpressGraphQL = require("express-graphql");
// const Mongoose = require("mongoose");
var mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient
const {
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLBoolean
} = require("graphql");
const assert = require('assert');
var app = Express();
var Promise = require('promise');

url = 'mongodb://localhost:27017';
const dbName = 'todolist';


// const TaskModel = Mongoose.model("task", {
//     check: Boolean,
//     name: String
// });

const insertTask = function(db, name, callback) {
    // Get the documents collection
    const collection = db.collection('tasks');
    // Insert some documents
    collection.insertOne(
      {name : name, check: false}
    , function(err, result) {
      assert.equal(err, null);
      callback(result);
    });
  };

const findTasks = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('tasks');
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
      assert.equal(err, null);
      callback(docs);
    });
  };



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
                    return MongoClient.connect('mongodb://localhost:27017').then(function(client) {
                    db = client.db(dbName);
                    var collection = db.collection('tasks');
                    return collection.find().toArray();
                    }).then(function(items) {
                    console.log(items);
                    for (item of items) {
                        item['id'] = item['_id']
                    }
                    return items
                    });
                }
            },
            task: {
                type: TaskType,
                args: {
                    id: { type: GraphQLNonNull(GraphQLID)}
                },
                resolve: (root, args, context, info) => {
                    return MongoClient.connect('mongodb://localhost:27017').then(function(client) {
                    db = client.db(dbName);
                    var collection = db.collection('tasks');
                    console.log(args.id);
                    return collection.findOne({ _id: new mongo.ObjectID(args.id) });
                    }).then(function(item) {
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
                    name: { type: GraphQLNonNull(GraphQLString)}
                },
                resolve: (root, args, context, info) => {
                    return MongoClient.connect('mongodb://localhost:27017').then(function(client) {
                    db = client.db(dbName);
                    var collection = db.collection('tasks');
                    return collection.insertOne({name : args.name, check: false});
                    }).then(function(item) {
                    console.log(item.ops[0]);
                    item = item.ops[0];
                    item['id'] = item['_id'];
                    return item;
                    });
                }
            },
            update: {
                type: RespMessage,
                args: {
                    id: {type: GraphQLNonNull(GraphQLID)},
                    check: {type: GraphQLNonNull(GraphQLBoolean)}
                },
                resolve: (root, args, context, info) => {
                    return MongoClient.connect('mongodb://localhost:27017').then(function(client) {
                    db = client.db(dbName);
                    var collection = db.collection('tasks');
                    return collection.updateOne({_id : new mongo.ObjectID(args.id)}, { $set: {check: args.check}});
                    }).then(function(item) {
                    console.log(item.message);
                    item = {};
                    item['id'] = args.id;
                    item['message'] = `Successfully updated ${args.id} to ${args.check}`;
                    return item;
                    });
                }
            },
            delete: {
                type: RespMessage,
                args: {
                    id: {type: GraphQLNonNull(GraphQLID)}
                },
                resolve: (root, args, context, info) => {
                    return MongoClient.connect('mongodb://localhost:27017').then(function(client) {
                    db = client.db(dbName);
                    var collection = db.collection('tasks');
                    return collection.deleteOne({_id : new mongo.ObjectID(args.id)});
                    }).then(function(item) {
                    console.log(item.result.n);
                    if (item.result.n === 0) {
                        item = {};
                        item['id'] = args.id;
                        item['message'] = `${args.id} is not found`;
                    } else {
                    item = {};
                    item['id'] = args.id;
                    item['message'] = `Successfully deleted ${args.id}`;
                    }
                    return item;
                    });
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