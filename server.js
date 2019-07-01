const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');

app.use(cors())
app.set('port', process.env.PORT || 3001)

app.listen(app.get('port'), () => {
  console.log(`server is running on port ${app.get('port')}`)
})

app.get('/', (request, response) => {
  return response.status(200).json('hello world');
})
