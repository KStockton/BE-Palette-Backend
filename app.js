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

app.get('/api/v1/projects', async (request, response) => {
  try {
    const projects = await database('projects').select()
      if(projects.length) return response.status(200).json(projects)
  } catch(error) {
      return response.status(500).json(error.message)
    }
});

app.get('/api/v1/projects/:id', async (request, response) => {
  const {id} = request.params
  try{
    const project = await database('projects').where('id', id).select()
    if(project.length) return response.status(200).json(project)
    if(!project.length) return response.status(404).json({error: `No project found with id of ${id}`})
  } catch(error) {
    return response.status(500).json(error.message)
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
    response.status(500).json(error.message)
  }
});

app.post('/api/v1/projects', async (request, response) => {
  const newPost = request.body

  for(let reqParameter of ['project_title']) {
    if(!newPost['project_title']) 
    return response.status(422).json({ error: `Expected Format {project_title: <String>} You are missing ${reqParameter}`})
  } 
  try {
    const updateDatabase =  await database('projects').insert(newPost, 'id')
    return response.status(201).json({id: updateDatabase[0]})
  } catch(error) {
    return response.status(500).json(error.message)
  }
})

app.put('/api/v1/projects/:id', async (request, response) => {
  const updateRequest = request.body
  const newUpdateId = request.params.id
  
  for (let reqParam of ['project_title']) {
    if (!updateRequest['project_title']) return response.status(422).json({
      error: `Expected Format {project_title: <String>} You are missing ${reqParam}.`
    })
  }

  try {
    const isFound = await database('projects').where('id', newUpdateId).first()
    
    if (isFound) {
      await database('projects').where('id', newUpdateId).update({...updateRequest})
      
      const result = await database('projects').where('id', isFound.id).first()
      return response.status(200).json(result)
    } else if (!isFound) {
      return response.status(404).json({
        error: `No project found with id of ${newUpdateId}`
      })
    }
  } catch (error) {
    return response.status(500).json(error.message)
  }
});




// Palettes
app.get('/api/v1/palettes', async (request, response) => {
  try {
    const palettes = await database('palettes').select()
      if(palettes.length) return response.status(200).json(palettes)
  } catch(error) {
      return response.status(500).json(error.message)
  }
})

app.get('/api/v1/palettes/:id', async (request, response) => {
  const {id} = request.params
  try {
    const palette = await database('palettes').where('id', id).select()
    if(palette.length) return response.status(200).json(palette)
    if(!palette.length) return response.status(404).json({error:`No palette found with id of ${id}`})
  } catch(error) {
    return response.status(500).json(error.message)
  }
});

app.delete('/api/v1/palettes/:id', async (request, response) => {
  const id = request.params.id
  const matchingPalette = await database('palettes').where('id', id)
  if(!matchingPalette.length) return response.status(404).json({error: `No palette found with id of ${id}`})
  try {
      await database('palettes').where('id', id).del()
      return response.status(204).send()
  } catch(error) {
      return response.status(500).json(error.message)
  }
});

app.post('/api/v1/palettes', async (request, response) => {
 const newPalette = request.body

  for(let reqParam of ['palette_title', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5', 'project_title']) 
    if(!newPalette[reqParam]) {
      return response.status(422).json({error: `expected format {palette_title: <String>, color_1: <String>, color_2: <String>, color_3: <String>, color_4: <String>, color_5: <String>, project_title: <String> } You are missing ${reqParam}`
    })
  }
  const matchingProject = await database('projects').where('project_title', newPalette.project_title).first()
 
  try {
  if(matchingProject) {
    const postPalette = 
    {
      palette_title: newPalette.palette_title,
      color_1: newPalette.color_1,
      color_2: newPalette.color_2,
      color_3: newPalette.color_3,
      color_4: newPalette.color_4,
      color_5: newPalette.color_5,
      project_id : matchingProject.id
    }

    const result = await database('palettes').insert(postPalette,'id')
    return response.status(201).json({id: result[0]})
  } else {
    return response.status(404).json(`No project found called ${newPalette.project_title}`)
  }
 } catch(error) {
    return response.status(500).json(error.message)
  }
});

app.put('/api/v1/palettes/:id', async (request, response) => {
  const updatePalette = request.body

  for(let reqParam of ['palette_title', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5'])
    if(!updatePalette[reqParam]) {
      return response.status(422).json({error: `expected format {
        palette_title: <String>,
        color_1: <String>,
        color_2: <String>,
        color_3: <String>,
        color_4: <String>,
        color_5: <String>,
       } You are missing ${reqParam}`
      })
    } 

    try {
      const isFound = await database('palettes').where('id',parseInt(request.params.id)).first()
      if(isFound) {
        const result = await database('palettes').where('id', isFound.id).update({...updatePalette})
        const updatePaletted = await database('palettes').where('id', isFound.id)
        console.log('isfound', isFound)
        console.log('result', result )
        console.log('update', updatePaletted)
        return response.status(200).json(isFound)
      } else if(!isFound) {
        return response.status(404).json(`No palette found with id of ${request.params.id}`)
      }
    } catch(error) {
        return response.status(500).json(error.message)
    }
});

module.exports = app