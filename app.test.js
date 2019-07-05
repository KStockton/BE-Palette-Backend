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
    })

 
});