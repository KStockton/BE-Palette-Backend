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


//Projects

app.get('/api/v1/projects', async (request, response) => {
  try {
    const projects = await database('projects').select()
      if(projects.length) return response.status(200).json(projects)
  } catch(error) {
      return response.status(500).json({error})
    }
});

//Get Sepcific Project
app.get('/api/v1/projects/:id', async (request, response) => {
  const {id} = request.params
  try{
    const project = await database('projects').where('id', id).select()
    if(project.length) return response.status(200).json(project)
    if(!project.length) return response.status(404).json({error: `No project found with id of ${id}`})
  } catch(error) {
    return response.status(500).json({error})
  }
});

app.delete('/api/v1/projects/:id', async (request, response) => {
  const id = request.params.id
  const matchingProject = await database('projects').where('id', id)

  if(!matchingProject.length) return response.status(422).json({error:`No projects found with id of ${id}`})

  try {
    await database('palettes').where('project_id', id).del()
    await database('projects').where('id', id).del() 
    response.status(204).send()
  } catch(error) {
    response.status(500).json({error})
  }
})
app.post('/api/v1/projects', async (request, response) => {
  const newPost = request.body
  for(let reqParameter of ['project_title']) {
    if(!newPost['project_title']) 
    return response.status(422).json(`Error: Expected format: {project_title: <String>} You are missing ${reqParameter}`)
  } 
  try {
    const updateDatabase =  await database('projects').insert(newPost, 'id').first()
    return response.status(201).json(updateDatabase)
  } catch(error) {
    return response.status(500).json({error})
  }
})

app.put('/api/v1/projects/:id', async (request, response) => {
  const updateRequest = request.body
  const newUpdateId = request.params.id

  await database('projects').where('id', newUpdateId).update({...updateRequest})
  let updateResponse = await database('projects').where('id', newUpdateId).first()

  return response.status(200).json(updateResponse)
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
    if(!palette.length) return response.status(404).json(`{Error: No palette found with ${id}}`)
  } catch(error) {
    return response.status(500).json({error})
  }
});

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