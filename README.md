To run the tests, first launch the server by running `npm start` in one terminal, then run `npm test` in another terminal.
To play around the api open http://localhost:3000/graphql and use graphiql to query the api. Here are some suggested queries:-

{
  tasks{
    id,
    name,
    check
  }
}

mutation UpdateTask($id: ID!, $check: Boolean!) {
  update(id: $id, check: $check) {
    id,
    name,
    check
  }
}

mutation DeleteTask($id: ID!) {
  delete(id: $id) {
    id,
    name,
    check
  }
}

mutation CreateTask($name: String!) {
  create(name: $name) {
    id,
    name,
    check
  }
}
