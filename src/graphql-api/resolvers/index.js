const { update_task } = require("./update");
const { create_task } = require("./create");
const { delete_task } = require("./delete");
const { find_task } = require("./task");
const { find_all_tasks } = require("./tasks");

// Contains the resolvers. They contain the logic behind each query and mutation.

module.exports = {
  update_task,
  create_task,
  delete_task,
  find_task,
  find_all_tasks
};
