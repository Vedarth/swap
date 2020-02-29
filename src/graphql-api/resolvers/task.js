const { GraphQLID, GraphQLNonNull } = require("graphql");
const { finds_task } = require("../../models/task-model");
const { TaskType } = require("../types");

const find_task = {
  type: TaskType,
  args: {
    id: { type: GraphQLNonNull(GraphQLID) }
  },
  resolve: async (root, args, context, info) => {
    let item = await finds_task(args.id);
    item["id"] = item["_id"];
    return item;
  }
};

module.exports = { find_task };
