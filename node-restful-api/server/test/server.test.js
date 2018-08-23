const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');

const todos = [
  {
    _id: new ObjectID(),
    text: 'First'
  },
  {
    _id: new ObjectID(),
    text: 'Second'
  }
]

beforeEach((done) => {
  Todo.deleteMany()
    .then(() => {
      Todo.insertMany(todos);
      done();
    })
    .catch((e) => {
      done(e);
    })
})

describe('Post /todo', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todo')
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text)
      })
      .end((err, res) => {
        if(err) {
          return done(err)
        }

        Todo.find({ text })
          .then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch((e) => { done(e) })
      })
  })

  it('should not create todo with invalid body data', (done) => {
    var text = '';

    request(app)
      .post('/todo')
      .send({ text })
      .expect(400)
      .end((err, res) => {
        if(err) {
          return done(err)
        }

        Todo.find()
          .then((todos) => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch((e) => { done(e) })
      })
  })
})

describe('Get /todo', () => [
  it('should get all todos', (done) => {
    request(app)
      .get('/todo')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  })
])

describe('Get /todo/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todo/${todos[0]._id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  })

  it('should return 404 if todo not found', (done) => {
    var id = new ObjectID();
    request(app)
      .get(`/todo/${id}`)
      .expect(404)
      .end(done);
  })

  it('should return 404 if for non-object id', (done) => {
    request(app)
      .get('/todo/invalidId')
      .expect(404)
      .end(done);
  })
})

describe('DELETE /todo/:id', () => {
  it('should remove a todo', (done) => {
    var id = todos[0]._id.toString();

    request(app)
      .delete(`/todo/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(id);
      })
      .end((err, res) => {
        if(err)
          return done(err);

        Todo.findById(id)
          .then((todo) => {
            expect(todo).toNotExist();
            done();
          })
          .catch((e) => {
            done(e);
          })
      });
  })

  it('should return 404 if todo not found', (done) => {
    var id = new ObjectID();

    request(app)
      .delete(`/todo/${id}`)
      .expect(404)
      .end(done);
  })

  it('should return 404 if object id is invalid', (done) => {
    var id = '123';

    request(app)
      .delete(`/todo/${id}`)
      .expect(404)
      .end(done);
  })
})
