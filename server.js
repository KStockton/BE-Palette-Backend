// const environment = process.env.NODE_ENV || 'development'
// const configuration= require('./knexfile')[environment]
// const database = require('knex')(configuration)
const express = require('express');
// const bodyParser = require('body-parser');
const app = express();
// app.use(bodyParser.json())

const PORT = process.env.PORT || 3000

app.use(express.json())

app.get('/', (request, response) => {
  response.send('We\'re going to test all the routes!');
});

app.listen(PORT, () => {
  console.log(`App is running 👻 on port ${PORT}`)
});

