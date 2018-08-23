const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '1234567';
var hashedPassword = '$2a$10$Q9q.WthowrztWa/lkXXC6ON4NZo68n/B0EyCpmNLGfPoKsoML5YxC';
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
    hashedPassword = hash;
  })
})

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res)
})

// var data = {
//   id: 10
// }
//
// var token = jwt.sign(data, 'mysalt');
// console.log(token)
//
// console.log(jwt.verify(token, 'mysalt'))


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
