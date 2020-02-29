const { GraphQLID, GraphQLNonNull, GraphQLBoolean } = require("graphql");
const { updates_task } = require("../../models/task-model");
const { RespMessage } = require("../types");

const update_task = {
  type: RespMessage,
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    check: { type: GraphQLNonNull(GraphQLBoolean) }
  },
  resolve: async (root, args, context, info) => {
    let item = await updates_task(args.id, { check: args.check });
    let response = update_cases(item, args);
    return response;
  }
};

function update_cases(item, args) {
  let response = {};
  if (item.result.n === 0) {
    response["id"] = args.id;
    response["message"] = `${args.id} is not found`;
  } else if (item.result.n === 1 && item.result.nModified === 0) {
    response["id"] = args.id;
    response["message"] = `${args.id} is already ${args.check}`;
  } else if (item.result.n === 1 && item.result.nModified === 1) {
    response["id"] = args.id;
    response["message"] = `Successfully updated ${args.id} to ${args.check}`;
  } else {
    response["id"] = args.id;
    response["message"] = `Updating ${args.id} failed`;
  }
  return response;
}

module.exports = { update_task };
