const mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  text: {
    type: String
  },
  completed: {
    type: String
  },
  completeAt: {
    type: Number
  }
})

module.exports = {
  Todo
}
