const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

const request = require('supertest')
const app = require('./app')

describe('Server', () => {
  beforeEach(async () => {
    await database.seed.run()
  })

  describe('Server', () => {
    // describe('init', () => {
    //   it('should return a 200 status', () => {
    //     const res = request(app).get('/')
    //     expect(true).toEqual(true)
    //   })
    // })
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
      const result = response.body[0]

      expect(result).toEqual(expectedProject)
    })
  })
  
    describe('GET /api/v1/palettes/:id', () => {
    it('should return a matching palette for the id', async () => {
      const expectedPalette = await database('palettes').first()
      const id = expectedPalette.id
        expectedPalette.created_at = expectedPalette.created_at.toJSON()
        expectedPalette.updated_at = expectedPalette.updated_at.toJSON()

      const response = await request(app).get(`/api/v1/palettes/${id}`)
      const result = response.body[0]

      expect(result).toEqual(expectedPalette)
    })
  })

 
});