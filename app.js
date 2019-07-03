const environment = process.env.NODE_ENV || 'test'
const configuration= require('./knexfile')[environment]
const database = require('knex')(configuration);
const express = require('express');
// const bodyParser = require('body-parser');
const app = express();
app.set("port", process.env.PORT || 30001)


const cors = require('cors');
app.use(cors());
// app.use(bodyParser.json())


app.use(express.json())


// Projects
app.get('/', (request, response) => {
  response.send('We\'re going to test all the routes!');
});

// app.get('/api/v1/projects',  (request, response) => {
//   database('projects').select()
//   .then(projects => {
//     if(projects.length) {
//       return response.status(200).json(projects)
//     } else {
//       return response.status(404).json('Not Found')
//     }
//   })
//   .catch((error) => 
//     response.status(500).json({error}))
// });


app.get('/api/v1/projects', async (request, response) => {
  try {
    const projects = await database('projects').select()
      if(projects.length) return response.status(200).json(projects)
      if(!projects.length) return response.status(404).json('Not Found')
    } catch(error) {
      return response.status(500).json({error})
    }
})





//Palettes

app.get('/api/v1/palettes', async (request, response) => {
  try {
    const palettes = await database('palettes').select()
      if(palettes.length) return response.status(200).json(palettes)
      if(!palettes.length) return response.status(400).json('Not Found')
  } catch(error) {
    return response.status(500).json({error})
  }
})

app.get('/api/v1/palettes/:id', async (request, response) => {
  const {id} = request.params
  try{
    const palette = await database('palettes').where('id', id).select()
    if(palette.length) return response.status(200).json(palette)
    if(!palette.length) return response.status(404).json(`{Error: No palette found with ${id}`)
  } catch(error) {
    return response.status(500).json({error})
  }
})





module.exports = app