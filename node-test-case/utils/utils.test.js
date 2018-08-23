const utils = require('./utils');
const expect = require('expect');

it('should add two numbers', () => {
  var result = utils.add(33, 11);

  expect(result).toBe(44);
});

it('should async add two numbers', (done) => {
  utils.asyncAdd(5, 6, (sum) => {
    expect(sum).toBe(11);
    done();
  })
})
