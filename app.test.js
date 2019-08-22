const request = require('supertest');
const app = require('./app')
const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)



describe('API', () => {
  beforeEach(async () => {
    await database.seed.run()
  })
  describe('Get /api/v1/projects', () => {
    it('should return a status of 200 and all of the projects', async () => {
      const expectedProjects = await database('projects').select();
      const response = await request(app).get('/api/v1/projects')
      const projects = response.body
      expect(response.status).toBe(200);
      expect(projects[0].name).toEqual('test 1')
    })
  })
})