const { GraphQLString, GraphQLNonNull } = require("graphql");
const { inserts_task } = require("../../models/task-model");
const { TaskType } = require("../types");

const create_task = {
  type: TaskType,
  args: {
    name: { type: GraphQLNonNull(GraphQLString) }
  },
  resolve: async (root, args, context, info) => {
    let item = await inserts_task({ name: args.name, check: false });
    item = item.ops[0];
    item["id"] = item["_id"];
    return item;
  }
};

module.exports = { create_task };
