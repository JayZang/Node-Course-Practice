var db = require('./db')

module.exports.handleSingup = (email, password) => {
  db.saveUser({email, password});
}
