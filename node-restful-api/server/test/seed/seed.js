const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'test@example.com',
  password: '1234567890',
  tokens:[{
    access: 'auth',
    token: jwt.sign({
      _id: userOneId,
      access: 'auth'
    }, 'MySecret').toString()
  }]
}, {
  _id: userTwoId,
  email: 'test2@example.com',
  password: '0987654321'
}]

const todos = [{
    _id: new ObjectID(),
    text: 'First'
  }, {
    _id: new ObjectID(),
    text: 'Second',
    completed: true,
    completeAt: 333
  }
]

const populateTodos = (done) => {
  Todo.deleteMany()
    .then(() => {
      Todo.insertMany(todos);
      done();
    })
    .catch((e) => {
      done(e);
    })
}

const populateUsers = (done) => {
  User.remove()
    .then(() => {
      var userOne = new User(users[0]).save();
      var userTwo = new User(users[1]).save();

      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
}

module.exports = {
  todos,
  users,
  populateTodos,
  populateUsers
}
