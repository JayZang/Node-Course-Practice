const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');
const { todos, users, populateTodos, populateUsers } = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('Post /todo', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todo')
      .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  })
])

describe('Get /todo/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todo/${todos[0]._id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  })

  it('should not return todo doc created by other user', (done) => {
    request(app)
      .get(`/todo/${todos[0]._id}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  })

  it('should return 404 if todo not found', (done) => {
    var id = new ObjectID();
    request(app)
      .get(`/todo/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  })

  it('should return 404 if for non-object id', (done) => {
    request(app)
      .get('/todo/invalidId')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  })
})

describe('DELETE /todo/:id', () => {
  it('should remove a todo', (done) => {
    var id = todos[1]._id.toString();

    request(app)
      .delete(`/todo/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(id);
      })
      .end((err, res) => {
        if(err)
          return done(err);

        Todo.findById(id)
          .then((todo) => {
            expect(todo).toBeFalsy();
            done();
          })
          .catch((e) => {
            done(e);
          })
      });
  })

  it('should not remove a todo created by other user', (done) => {
    var id = todos[1]._id.toString();

    request(app)
      .delete(`/todo/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if(err)
          return done(err);

        Todo.findById(id)
          .then((todo) => {
            expect(todo).toBeTruthy();
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
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  })

  it('should return 404 if object id is invalid', (done) => {
    var id = '123';

    request(app)
      .delete(`/todo/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  })
})

describe('PATCH /todo/:id', () => {
  it('should update the todo', (done) => {
    var id = todos[0]._id;
    var text = 'new text';

    request(app)
      .patch(`/todo/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completeAt).toBe('number');
      })
      .end(done)
  })

  it('should not update the todo created by other user', (done) => {
    var id = todos[0]._id;
    var text = 'new text';

    request(app)
      .patch(`/todo/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed: true,
        text
      })
      .expect(404)
      .end(done)
  })

  it('should clear completeAt when todo is not completed', (done) => {
    var id = todos[1]._id;
    var text = 'new text';

    request(app)
      .patch(`/todo/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completeAt).toBeFalsy();
      })
      .end(done)
  })
})

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done)
  });

  it('should return 404 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done)
  });
})

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = 'test1234';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err)
          return done(err)

        User.findOne({email})
          .then((user) => {
            expect(user).toBeTruthy();
            expect(user.password).not.toBe(password);
            done();
          })
          .catch((e) => {
            done(e)
          })
      })
  })

  it('should return validation errors if request invalid', (done) => {
    var email = 'example@example.com';
    var password = 'test';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  })

  it('should not create user if email is use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: '123456789'
      })
      .expect(400)
      .end(done);
  })
})

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy()
      })
      .end((err, res) => {
        if(err)
          return done(err)

        User.findById(users[1]._id)
          .then((user) => {
            expect(user.tokens[1]).toMatchObject({
              access: 'auth',
              token: res.headers['x-auth']
            })
            done();
          })
          .catch((e) => {
            done(e)
          })
      })
  })

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: 'invalidPassword'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeFalsy()
      })
      .end((err, res) => {
        if(err)
          return done(err)

        User.findById(users[1]._id)
          .then((user) => {
            expect(user.tokens.length).toBe(1);
            done();
          })
          .catch((e) => {
            done(e)
          })
      })
  })
})

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if(err)
          return done(err)

        User.findById(users[0]._id)
          .then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch((e) => {
            done(e);
          })
      })
  })
})
