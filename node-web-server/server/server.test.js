const expect = require('expect');
const request = require('supertest');

var app = require('./server').app;

describe('Server test', () => {

  describe('Get /', () => {
    it('should return world response', (done) => {
      request(app)
        .get('/')
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({
            name: 'Jay'
          })
        })
        .end(done);
    })
  })

  describe('Get /users', () => {
    it('should return my user object', (done) => {
      request(app)
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({
            name: 'jay',
            age: 18
          })
        })
        .end(done)
    })
  })
})
