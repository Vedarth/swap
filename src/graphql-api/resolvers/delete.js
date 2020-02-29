const { GraphQLID, GraphQLNonNull } = require("graphql");
const { deletes_task } = require("../../models/task-model");
const { RespMessage } = require("../types");

const delete_task = {
  type: RespMessage,
  args: {
    id: { type: GraphQLNonNull(GraphQLID) }
  },
  resolve: async (root, args, context, info) => {
    let item = await deletes_task(args.id);
    let response = {};
    if (item.result.n === 0) {
      response["id"] = args.id;
      response["message"] = `${args.id} is not found`;
    } else {
      response["id"] = args.id;
      response["message"] = `Successfully deleted ${args.id}`;
    }
    return response;
  }
};

module.exports = { delete_task };
