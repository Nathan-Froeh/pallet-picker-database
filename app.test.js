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
    it('HAPPY PATH: should return a status of 200 and all the palettes from a single project', async () => {
      const expectedId = await database('projects').first('id').then(object => object.id)
      const expectedPalette = await database('palettes').first().where({ project_id: expectedId }).select();
      const response = await request(app).get(`/api/v1/projects/${expectedId}/palettes`)
      const result = response.body
      console.log(expectedPalette)
      expect(response.status).toBe(200);
      expect(result[0].name).toEqual(expectedPalette.name)
    })
  })

  // describe('GET /api/v1/palettes/:id', () => {
  //   it('HAPPY PATH: should return a status of 200 and a single pallete from all the palettes', async () => {
  //     const expectedId = await database('palettes').first('id').then(object => object.id)
  //     const expectedPalette = await database('palettes').first();
  //     console.log(expectedPalette)
  //     // const id = 425;
  //     const response = await request(app).get(`/api/v1/palettes/${id}`);
  //     const result = response.body;
  //     expect(response.status).toBe(200);
  //     expect(result).toEqual(expectedPalette)
  //   })
  // })
})
