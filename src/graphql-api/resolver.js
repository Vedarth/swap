const {
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean
} = require("graphql");
const {
    listsTasks,
    findsTask,
    updatesTask,
    insertsTask,
    deletesTask } = require("../models/task-model")
const {
    TaskType,
    RespMessage
} = require('./types');


const tasks = {
    type: GraphQLList(TaskType),
    resolve: async (root, args, context, info) => {
        let items = await listsTasks();
        for (item of items) {
            item['id'] = item['_id']
        }
        return items
    }
};

const task = {
    type: TaskType,
    args: {
        id: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (root, args, context, info) => {
        let item = await findsTask(args.id)
        item['id'] = item['_id'];
        return item;
    }
}

const create = {
    type: TaskType,
    args: {
        name: { type: GraphQLNonNull(GraphQLString) }
    },
    resolve: async (root, args, context, info) => {
        let item = await insertsTask({ name: args.name, check: false })
        item = item.ops[0];
        item['id'] = item['_id'];
        return item;
    }
};

const update = {
    type: RespMessage,
    args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        check: { type: GraphQLNonNull(GraphQLBoolean) }
    },
    resolve: async (root, args, context, info) => {
        let item = await updatesTask(args.id, { check: args.check })
        let response = updateCases(item, args);
        return response;
    }
};

const deleteTask = {
    type: RespMessage,
    args: {
        id: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (root, args, context, info) => {
        let item = await deletesTask(args.id)
        let response = {};
        if (item.result.n === 0) {
            response['id'] = args.id;
            response['message'] = `${args.id} is not found`;
        } else {
            response['id'] = args.id;
            response['message'] = `Successfully deleted ${args.id}`;
        }
        return response;
    }
};

function updateCases(item, args) {
    let response = {};
    if (item.result.n === 0) {
        response['id'] = args.id;
        response['message'] = `${args.id} is not found`;
    }
    else if (item.result.n === 1 && item.result.nModified === 0) {
        response['id'] = args.id;
        response['message'] = `${args.id} is already ${args.check}`;
    }
    else if (item.result.n === 1 && item.result.nModified === 1) {
        response['id'] = args.id;
        response['message'] = `Successfully updated ${args.id} to ${args.check}`;
    }
    else {
        response['id'] = args.id;
        response['message'] = `Updating ${args.id} failed`;
    }
    return response
}

module.exports = { tasks, task, create, update, deleteTask };