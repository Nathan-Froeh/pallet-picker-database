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

  describe('GET /api/v1/projects/:id/palettes', () => {
    it('HAPPY PATH: should return a status of 200 and a single palette from a single project', async () => {
      const expectedPalette = await database('palettes').first();
      const id = expectedPalette.project_id;
      const response = await request(app).get(`/api/v1/projects/${id}/palettes`)
      const result = response.body[0]
      expect(response.status).toBe(200);
      expect(result[0]).toEqual(expectedPalette[0])
    })
  })
})
