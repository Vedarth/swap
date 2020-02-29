const { GraphQLList } = require("graphql");
const { lists_tasks } = require("../../models/task-model");
const { TaskType } = require("../types");

const find_all_tasks = {
  type: GraphQLList(TaskType),
  resolve: async (root, args, context, info) => {
    let items = await lists_tasks();
    for (item of items) {
      item["id"] = item["_id"];
    }
    return items;
  }
};

module.exports = { find_all_tasks };
