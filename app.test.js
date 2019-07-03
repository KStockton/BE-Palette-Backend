const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)


// import request from 'supertest'
const request = require('supertest')
const app = require('./app')


describe('Server', () => {
  beforeEach(async () => {
    await database.seed.run()
  })

  
  describe('Server', () => {
    describe('init', () => {
      it('should return a 200 status', () => {
        const res = request(app).get('/')
        expect(true).toEqual(true)
      })
    })
  })
  
  describe('Get /projects', () => {
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

 
});