const express =require('express');
const hbs = require('hbs');

var app = express();
const port = process.env.PORT || 3000;

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
})

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.send({
    name: 'Jay'
  });
})

app.get('/users', (req, res) => {
  res.send([{
    name: 'mike',
    age: 27
  },{
    name: 'jay',
    age: 18
  },{
    name: 'test',
    age: 100
  }])
})

app.get('/about', (req, res) => {
  res.render('about', {
    pageTitle: 'About Page',
  })
})

app.listen(port, () => {
  console.log(`Server is Started on ${port}`)
})

module.exports.app = app;
