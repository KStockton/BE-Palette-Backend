const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)
const projectsData = require('./seedData')
const request = require('supertest')
const app = require('./app')

describe('Server', () => {

  beforeEach(async () => {
    await database.seed.run()
  })
  
  describe('Get /api/v1/projects', () => {
    it('should return all the projects in the database', async () => {
      const expectedProjects = await database('projects').select()
        expectedProjects.forEach(project => {
       
        project.created_at = project.created_at.toJSON()
        project.updated_at = project.updated_at.toJSON()
      })
      
      const response = await request(app).get('/api/v1/projects')
      const projects = response.body   
      expect(expectedProjects).toEqual(projects)
    })
  })

  describe('GET /api/v1/projects/:id', () => {
    it('should return a matching project for the id', async () => {
      const expectedProject = await database('projects').first()
      const id = expectedProject.id
        expectedProject.created_at = expectedProject.created_at.toJSON()
        expectedProject.updated_at = expectedProject.updated_at.toJSON()

      const response = await request(app).get(`/api/v1/projects/${id}`)
      const projectName = response.body[0].project_title
      expect(projectName).toEqual(expectedProject.project_title)
    });

    it('should not return a project if there is no match with given id', async () => {
      const projectId = 0
      const mockResponse = `No project found with id of ${projectId}`
      const response = await request(app).get(`/api/v1/projects/${projectId}`)
      const result = response.body.error
      expect(result).toEqual(mockResponse)
    });
  });

  describe('DELETE /api/v1/projects/:id', () => {
    it('should delete the project if it exist in the database', async () => {
      const projectToDelete = await database('projects').first()
      const id = projectToDelete.id
      
      const response = await request(app).delete(`/api/v1/projects/${id}`)
      const deletedProject = await database('projects').where({id: id}).first()
      
      expect(deletedProject).toEqual(undefined)
    });

    it('should not process the request if params or incorrect', async () => {
      const nonExistentId = 123456789
      const noMatch = `No projects found with id of ${nonExistentId}`
      const response = await request(app).delete(`/api/v1/projects/${nonExistentId}`)
      const result = response.body.error
      expect(result).toEqual(noMatch)
    });
  });

  describe('POST /api/v1/projects', () => {
    it('should post a new project', async () => {
      const addProject = { project_title: 'Team Palette is Lit' }
      
      const response = await request(app).post('/api/v1/projects').send(addProject)
      const result = await database('projects').where('id', response.body.id).first()
      expect(addProject.project_title).toEqual(result.project_title)
    });

    it('should give a format error if params are incorrect', async () => {
      const badProject = { yolo: 'Michael yolo'}
      const missingParamsMsg = `Expected Format {project_title: <String>} You are missing project_title`
      const response = await request(app).post('/api/v1/projects').send(badProject)
      const result = response.body.error
      expect(result).toEqual(missingParamsMsg)
    })
  });

  describe('PUT /api/v1/projects/:id', () => {
    it('should be able to update a project', async () => {
      const updateProjId = await database('projects').first()
      const id = updateProjId.id

      const newTitle = { project_title: 'Michael Hype'}
      
      const response = await request(app).put(`/api/v1/projects/${id}`).send(newTitle)
      const newProject = response.body

      expect(newProject.project_title).toEqual(newTitle.project_title)
    });

    it('should be give an error message if missing correct params', async () => {
      const badPut = {title: 'michael jordan Michael Jackson'}
      const oldProject = await database('projects').first()
      const id = oldProject.id
      const expectedErrMsg = `Expected Format {project_title: <String>} You are missing project_title.`
     
      const response = await request(app).put(`/api/v1/projects/${id}`).send(badPut)
      const badPutError = response.body.error
      expect(badPutError).toEqual(expectedErrMsg)
    });

    it('should not update a project if the id does not exist', async () => {
      const goodProj = await database('projects').first()
      const goodProjTitle = 
      {
        project_title: goodProj.project_title
      }

      const badId = -1
      const badResponse = `No project found with id of ${badId}`

      const response = await request(app).put(`/api/v1/projects/${badId}`).send(goodProjTitle)

      expect(response.body.error).toEqual(badResponse)
    });
  });


 //Palettes Test
  
  describe('GET /api/v1/palettes/:id', () => {
    it('should return a matching palette for the id', async () => {
      const expectedPalette = await database('palettes').first()
      const id = expectedPalette.id
        expectedPalette.created_at = expectedPalette.created_at.toJSON()
        expectedPalette.updated_at = expectedPalette.updated_at.toJSON()

      const response = await request(app).get(`/api/v1/palettes/${id}`)
      const result = response.body[0]

      expect(result).toEqual(expectedPalette)
    });

    it('should not get a palette if id is not found', async () => {
      const badId = -1
      const expectedResponse = `No palette found with id of ${badId}`
      const response = await request(app).get(`/api/v1/palettes/${badId}`)
      const receivedRes = response.body.error
      expect(receivedRes).toEqual(expectedResponse)
    });
  });

    describe('DELETE /api/v1/palettes/:id', () => {
      it('should delete the palette based on the id', async () => {
        const paletteDelete = await database('palettes').first()
        const paletteDelId = paletteDelete.id
        
        const response = await request(app).delete(`/api/v1/palettes/${paletteDelId}`)
        expect(response.status).toBe(204)
      });

      it('should not delete a palette if the palette is not in the database', async () => {
        const badId = -1
        const expectedResponse = `No palette found with id of ${badId}`
        const response = await request(app).delete(`/api/v1/palettes/${badId}`)
        expect(response.body.error).toEqual(expectedResponse)
      });
    });

    describe('GET /api/v1/palettes', () => {
      it('should be able to get all palettes if the request is good', async () => {
        const allPalettes = await database('palettes').select()
            allPalettes.forEach(palette => {
              palette.created_at = palette.created_at.toJSON()
              palette.updated_at = palette.updated_at.toJSON()
            })
        const response = await request(app).get('/api/v1/palettes')
        const recPalettes = response.body
        
        expect(allPalettes).toEqual(recPalettes)
      });
    });

    describe('POST /api/v1/palettes', () => {
      it('should be able to post a new palette', async () => {
        const project = await database('projects').first()

        const newPalette = 
        {
          palette_title: 'M and K project',
          color_1: '#jnd094',
          color_2: '#vn9sdv',
          color_3: '#jasdfk',
          color_4: '#iifgkd',
          color_5: '#snasdg',
          project_title: project.project_title
        }

        const response = await request(app).post('/api/v1/palettes/').send(newPalette)
        const results = await database('palettes').where('id', response.body.id)
        const palette = results[0]
       
        expect(newPalette.palette_title).toEqual(palette.palette_title)
      })

      it('should not post if params are incorrect', async () => {
        const badPalette = { palette_title: 'Mic' }

        expectedError = {error: `expected format {palette_title: <String>, color_1: <String>, color_2: <String>, color_3: <String>, color_4: <String>, color_5: <String>, project_title: <String> } You are missing color_1`
        }

        const response = await request(app).post('/api/v1/palettes').send(badPalette)
        expect(response.body.error).toEqual(expectedError.error)
      });

      it('should not return a palette if project_title is not found', async () => {
        const newPalette = 
        {
          palette_title: 'M and K project',
          color_1: '#jnd094',
          color_2: '#vn9sdv',
          color_3: '#jasdfk',
          color_4: '#iifgkd',
          color_5: '#snasdg',
          project_title: 'Black Panther Colors'
        }
        const expectedResponse = `No project found called ${newPalette.project_title}`
        const response = await request(app).post('/api/v1/palettes/').send(newPalette)
        expect(response.body).toEqual(expectedResponse)
      })
    });

    describe('PUT ap1/v1/palettes/:id', () => {
      it('should be able to update a single palette', async () => {
        const palette = await database('palettes').first()
        const paletteId = palette.id

        const paletteChange = {
          palette_title: palette.palette_title,
          color_1: palette.color_3,
          color_2: palette.color_3,
          color_3: palette.color_3,
          color_4: palette.color_3,
          color_5: palette.color_3
        }
        const response = await request(app).put(`/api/v1/palettes/${paletteId}`).send(paletteChange)
        const result = response.body

        expect(result.palette_title).toEqual(paletteChange.palette_title)
        expect(result.color_1).toEqual(paletteChange.color_1)
        expect(result.color_2).toEqual(paletteChange.color_2)
        expect(result.color_3).toEqual(paletteChange.color_3)
        expect(result.color_4).toEqual(paletteChange.color_4)
        expect(result.color_5).toEqual(paletteChange.color_5)
      });

      it('should return a no found response if id does not exist', async() => {
        const badId = -1
        const palette = await database('palettes').first()
        const paletteChange = {
          palette_title: palette.palette_title,
          color_1: palette.color_3,
          color_2: palette.color_3,
          color_3: palette.color_3,
          color_4: palette.color_3,
          color_5: palette.color_3
        }

        const expectedResponse = `No palette found with id of ${badId}`
        const response = await request(app).put(`/api/v1/palettes/${badId}`).send(paletteChange)
        const errMsg = response.body
        expect(errMsg).toEqual(expectedResponse)
      });
    });
});