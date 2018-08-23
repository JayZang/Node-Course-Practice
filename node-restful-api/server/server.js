const express= require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb');
const _ = require('lodash');

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

      res.send({todo});
    })
    .catch((e) => {
      res.status(404).send();
    })
})

// Patch 為 Http 協議中的更新 Request（資料原本就有，但 '部份' 更新）
// 而 PUT Request 則是假使原有資料就更換成新數據（有替換之意），若沒有則新增數據
app.patch('/todo/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(id))
    res.status(404).send();

  if(_.isBoolean(body.completed) && body.completed)
    body.completeAt = new Date().getTime();
  else{
    body.completed = false;
    body.completeAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
    .then((todo) => {
      if(!todo)
        res.status(404).send();

      res.send({todo});
    }).catch((e) => {
      res.status(404).send(e);
    })


})

app.listen(3000, () => {
  console.log('Server is started')
})

module.exports = {
  app
}
