const mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true
  },
  completed: {
    type: String,
    default: false
  },
  completeAt: {
    type: Number,
    default: null
  }
})

module.exports = {
  Todo
}
