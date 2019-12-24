const {
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean
} = require("graphql");
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient
url = 'mongodb://localhost:27017';
const dbName = 'todolist';

const {
    TaskType,
    RespMessage
} = require('./types');


const tasks = {
    type: GraphQLList(TaskType),
    resolve: (root, args, context, info) => {
        return MongoClient.connect('mongodb://localhost:27017').then(function(client) {
        db = client.db(dbName);
        var collection = db.collection('tasks');
        return collection.find().toArray();
        }).then(function(items) {
        for (item of items) {
            item['id'] = item['_id']
        }
        return items
        });
    }
};

const task = {
    type: TaskType,
    args: {
        id: { type: GraphQLNonNull(GraphQLID)}
    },
    resolve: (root, args, context, info) => {
        return MongoClient.connect('mongodb://localhost:27017').then(function(client) {
        db = client.db(dbName);
        var collection = db.collection('tasks');
        return collection.findOne({ _id: new mongo.ObjectID(args.id) });
        }).then(function(item) {
        item['id'] = item['_id'];
        return item;
        });
    }
}

const create = {
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
        item = item.ops[0];
        item['id'] = item['_id'];
        return item;
        });
    }
};

const update = {
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
        item = {};
        item['id'] = args.id;
        item['message'] = `Successfully updated ${args.id} to ${args.check}`;
        return item;
        });
    }
};

const deleteTask = {
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
};

module.exports = {tasks, task, create, update, deleteTask};