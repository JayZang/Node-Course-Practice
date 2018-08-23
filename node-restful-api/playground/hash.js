const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
  id: 10
}

var token = jwt.sign(data, 'mysalt');
console.log(token)

console.log(jwt.verify(token, 'mysalt'))

// var message = 'i am user number 3';
// var hash = SHA256(message).toString();
//
// console.log(hash);
//
// var data = {
//   id: 4
// }
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data))
// }
