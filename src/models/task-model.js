const { create_collection, Collections } = require("../services/db");
const mongo = require("mongodb");

const tasks_collection_promise = create_collection({
  name: Collections.Tasks
}).then(async collection => {
  return collection;
});

const lists_tasks = async () => {
  const collection = await tasks_collection_promise;
  const result = await collection.find().toArray();
  return result;
};

const finds_task = async id => {
  const collection = await tasks_collection_promise;
  return collection.findOne({ _id: new mongo.ObjectID(id) });
};

const updates_task = async (id, updateQuery) => {
  const collection = await tasks_collection_promise;
  const result = await collection.updateOne(
    { _id: new mongo.ObjectID(id) },
    {
      $set: updateQuery
    }
  );
  return result;
};

const inserts_task = async query => {
  const collection = await tasks_collection_promise;
  const response = collection.insertOne(query);
  return response;
};

const deletes_task = async id => {
  const collection = await tasks_collection_promise;
  const response = collection.deleteOne({ _id: new mongo.ObjectID(id) });
  return response;
};

module.exports = {
  tasks_collection_promise,
  lists_tasks,
  finds_task,
  updates_task,
  inserts_task,
  deletes_task
};
