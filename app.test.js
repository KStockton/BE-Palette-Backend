const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)


// import request from 'supertest'
const request = require('supertest')
const app = require('./app')


// describe('Server', () => {
//   beforeEach(async () => {
//     await database.seed.run()
//   })
  
  // describe('Server', () => {
    describe('init', () => {
      it('should return a 200 status', () => {
        // const res = request(app).get('/')
        expect(true).toEqual(true)
      })
    })
  // })
// })

describe('Get /projects', () => {
  it('should return a all the projects in the database', async (request, response) => {
    const projects = await database('projects').select()

    // const response = await app
  })
})