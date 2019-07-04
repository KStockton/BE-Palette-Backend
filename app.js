const environment = process.env.NODE_ENV || 'test'
const configuration= require('./knexfile')[environment]
const database = require('knex')(configuration);
const express = require('express');
// const bodyParser = require('body-parser');
const app = express();
app.set("port", process.env.PORT || 30001)


const cors = require('cors');
app.use(cors());

app.use(express.json())


// Projects
app.get('/', (request, response) => {
  response.send('We\'re going to test all the routes!');
});

app.get('/api/v1/projects', async (request, response) => {
  try {
    const projects = await database('projects').select()
      if(projects.length) return response.status(200).json(projects)
      if(!projects.length) return response.status(404).json('Not Found')
  } catch(error) {
      return response.status(500).json({error})
    }
});

app.get('/api/v1/projects/:id', async (request, response) => {
  const {id} = request.params
  try{
    const project = await database('projects').where('id', id).select()
      if(project.length) return response.status(200).json(project)
      if(!project.length) return response.status(404).json(`{Error: No palette found with ${id}}`)
  } catch(error) {
    return response.status(500).json({error})
  }
})


app.delete('/api/v1/projects/:id', async (request, response) => {
  const id = request.params.id
  const matchingProject = await database('projects').where('id', id)

  if(!matchingProject.length) return response.status(422).send(`No projects found with  id of ${id}`)

  try {
    await database('palettes').where('project_id', id).del()
    await database('projects').where('id', id).del() 
    response.status(204).send()
  } catch(error) {
    response.status(500).json({error})
  }
})

//Palettes
app.get('/api/v1/palettes', async (request, response) => {
  try {
    const palettes = await database('palettes').select()
      if(palettes.length) return response.status(200).json(palettes)
      if(!palettes.length) return response.status(404).json('No Palettes Found')
  } catch(error) {
      return response.status(500).json({error})
  }
})

app.get('/api/v1/palettes/:id', async (request, response) => {
  const {id} = request.params
  try {
    const palette = await database('palettes').where('id', id).select()
    if(palette.length) return response.status(200).json(palette)
    if(!palette.length) return response.status(404).json(`{Error: No palette found with ${id}}`)
  } catch(error) {
    return response.status(500).json({error})
  }
});

app.delete('/api/v1/palettes/:id', async (request, response) => {
  const {id} = request.params
  try {
    const matchingPalette = await database('palettes').where('id', id).select()
    console.log('log 1', matchingPalette)
    if(matchingPalette.length) {
      console.log('log 2', matchingPalette.length)
      await database('palettes').where('project_id', id).del()
      console.log('log 3',id)
      return response.status(203).json('entry deleted')
    }
    if(!matchingPalette.length) return response.status(404).json(`No entry matching id: ${id} found`)
  } catch(error) {
      return response.status(500).json({error})
  }
})

// app.post('/api/v1/palettes', async (request, response) => {
//   const  newProject  = request.body

//   for(let reqParameter of ['project_title']){
//     if(!newProject[reqParameter] ){
//       return 
//         response.status(422).send(`Error: Expected formate: project_title: <String> You're missing a ${reqParameter} property`)
//     }
//   }
//   try {
//     const projects = await database('projects').insert({newProject})
//     projects.
//   }
// })

module.exports = app