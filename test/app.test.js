const chai = require('chai');

const expect = chai.expect;
const url = `http://localhost:3000`;
const request = require('supertest')(url);
const should = chai.should();
var testId;
var testtestId = "5df9bf117b5a4b23b3779ffa";

describe('GraphQL', () => {
    step('Creates a test task', (done) => {
        request.post('/graphql')
        .send({query: 'mutation ($name: String! ){ create(name: $name){ id, name, check } }',
                variables: '{"name": "test"}'})
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            testId = res.body.data.create.id;
            res.body.data.create.name.should.be.a("string");
            res.body.data.create.check.should.be.a("boolean");
            done();
        })
    }),
    step('Returns all tasks', (done) => {
        request.post('/graphql')
        .send({query: '{ tasks { id name check } }'})
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            res.body.data.should.have.property("tasks");
            done();
        })
    }),
    step('Updates a task', (done) => {
        request.post('/graphql')
        .send({query: 'mutation ( $id: ID!, $check: Boolean! ){ update(id: $id, check: $check){ id, name, check } }',
                variables: `{"id": "${testId}", "check": true}`})
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            expect(res.body.data.update.check).to.equal(true);
            done();
        })
    }),
    step('Deletes a test task', (done) => {
        request.post('/graphql')
        .send({query: 'mutation ($id: ID! ){ delete(id: $id){ id, name, check } }',
                variables: `{"id": "${testId}"}`})
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            expect(res.body.data.delete.id).to.equal(testId);
            done();
        })
    })
})