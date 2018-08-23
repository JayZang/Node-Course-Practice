const expect = require('expect');
const rewire = require('rewire');

var app = rewire('./app');

describe('App', () => {
  var db = {
    saveUser: expect.createSpy()
  }
  app.__set__('db', db)

  it('should call spy correctly', () => {
    var spy = expect.createSpy();
    spy();
    expect(spy).toHaveBeenCalled();
  })

  it('should call saveUser with user object', () => {
    var email = '';
    var password = '';

    app.handleSingup(email, password);
    expect(db.saveUser).toHaveBeenCalledWith({email, password});
  })
})
