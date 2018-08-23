const express= require('express')
const bodyParser = require('body-parser')
var { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todo', (req, res) => {

  var todo = new Todo({
    text: req.body.text
  })

  todo.save()
    .then((doc) => {
      res.send(doc);
    })
    .catch((e) => {
      res.status(400).send(e)
    })
})

app.get('/todo', (req, res) => {
  Todo.find()
    .then((todos) => {
      res.send({
        todos
      })
    })
    .catch((e) => {
      res.status(400).send(e);
    })
})

app.get('/todo/:id', (req, res) => {
  var id = req.params.id;

  if( !ObjectID.isValid(id) )
    return res.status(404).send();

  Todo.findById(id)
    .then((todo) => {
      if(!todo)
        return res.status(404).send();

      res.send({todo});
    })
    .catch((e) => {
      console.log(e)
      res.status(404).send(e);
    })
})

app.delete('/todo/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id))
    return res.status(404).send();

  Todo.findByIdAndDelete(id)
    .then((todo) => {
      if(!todo)
        res.status(404).send();

      res.send(todo);
    })
    .catch((e) => {
      res.status(404).send();
    })
})

app.listen(3000, () => {
  console.log('Server is started')
})

module.exports = {
  app
}
