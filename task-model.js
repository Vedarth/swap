const { createCollection, Collections } = require("./db");
const mongo = require("mongodb")

const collectionTasksPromise = createCollection({
    name: Collections.Tasks
}).then(async collection => {
    return collection;
});

const listsTasks = async () => {
    const collection = await collectionTasksPromise;
    const result = await collection.find().toArray();
    return result
}

const findsTask = async (id) => {
    const collection = await collectionTasksPromise;
    return collection.findOne({ _id: new mongo.ObjectID(id) });
};

const updatesTask = async (id, updateQuery) => {
    const collection = await collectionTasksPromise;
    const result = await collection.updateOne(
        { _id: new mongo.ObjectID(id) },
        {
            $set: updateQuery
        }
    );
    return result
};

const insertsTask = async (query) => {
    const collection = await collectionTasksPromise;
    const response = collection.insertOne(query);
    return response
};

const deletesTask = async (id) => {
    const collection = await collectionTasksPromise;
    const response = collection.deleteOne({ _id: new mongo.ObjectID(id) });
    return response
}

module.exports = {
    collectionTasksPromise,
    listsTasks,
    findsTask,
    updatesTask,
    insertsTask,
    deletesTask
} 