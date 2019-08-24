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
      const expectedPalettes = await database('projects').select();
      const response = await request(app).get('/api/v1/projects')
      const projects = response.body
      expect(response.status).toBe(200);
      expect(projects[0].name).toEqual('test 1')
    })
  })

  describe('GET /api/v1/palettes', () => {
    it('Should return all palettes and 200 status', async () => {
      const expectedPalettes = await database('palettes').select('name', 'id', 'project_id')
      const response = await request(app).get('/api/v1/palettes')
      const returnedPalettes = response.body.map(palette => (
        { name: palette.name,
          id: palette.id,
          project_id: palette.project_id 
        }))
      expect(response.status).toBe(200)
      expect(returnedPalettes).toEqual(expectedPalettes)
    })
  })

  describe('GET /api/v1/projects/:id/palettes', () => {
    it('HAPPY PATH: should return a status of 200 and all the palettes from a single project', async () => {
      const expectedId = await database('projects').first('id').then(object => object.id)
      const expectedPalette = await database('palettes').first().where({ project_id: expectedId }).select();
      const response = await request(app).get(`/api/v1/projects/${expectedId}/palettes`)
      const result = response.body
      expect(response.status).toBe(200);
      expect(result[0].name).toEqual(expectedPalette.name)
    })
  })

  describe('GET /api/v1/projects/:id', () => {
    it('HAPPY PATH: should return status 200 and specific project', async () => {
      const expectedProject = await database('projects').select('name', 'id')
        .then(projects => projects[0])
        console.log(expectedProject)
      const response = await request(app)
        .get(`/api/v1/projects/${expectedProject.id}`)
      const result = response.body.map(project => (
        {
          name: project.name,
          id: project.id
        }))
      expect(response.status).toBe(200)
      expect(result[0]).toEqual(expectedProject)
    })
  })

  describe('GET /api/v1/palettes/:id', () => {
    it('HAPPY PATH: should return a status of 200 and a single pallete from all the palettes', async () => {
      const expectedId = await database('palettes').first('id').then(object => object.id)
      const expectedPalette = await database('palettes').first();
      const response = await request(app).get(`/api/v1/palettes/${expectedId}`);
      const result = response.body;
      expect(response.status).toBe(200);
      expect(result[0].name).toEqual(expectedPalette.name)
    })

    it('SAD PAth: should return a status of 404 if an id is sent in that doesnt exist', async () => {
      const invalidId = -1;
      const response = await request(app).get(`/api/v1/palettes/${invalidId}`);
      expect(response.status).toBe(404)
      expect(response.body.error).toEqual(`Could not find palette with id #${invalidId}`)
    })
  })

  // describe('POST /api/v1/palettes', () => {
  //   it('HAPPY PATH: should post a new palette to the database', async () => {
  //     const newPalette = {name: 'new pal', color_1: '#FFFFFF', color_2: '#FFFFFF', color_3: '#FFFFFF', color_4: '#FFFFFF', color_5: '#FFFFFF', project_name: 'new proj'}
  //     const response = await request(app).post('/api/v1/palettes').send(newPalette)
  //     const pals = await database('palettes').where({ id: response.body.id });
  //     const newPalettes = pals[0]
  //     expect(response.status).toBe(200)
  //     expect(newPalettes.name).toEqual(newPalette.name)
  //   })
  // })

  // describe('PATCH /api/v1/palettes/:id', () => {
  //   it('HAPPY PATH: should return a status of 201 and update a specific palette', async () => {
  //     const updatePalette = {project_id: 1, name: '#ASDLKJ'};
  //     const expectedId = await database('palettes').first('id');
  //     const response = await request(app).patch(`/api/v1/palettes/${expectedId}`).send(updatePalette);
  //     const newPalette = await database('palettes').where({ id: expectedId })
  //     expect(response.status).toBe(201)
  //     expect(newPalette[0].color_one).toEqual(updatePalette.color_1)
  //   })
  // })

  describe('DELETE /api/v1/projects/:id', () => {
    it('HAPPY PATH: should return a status of 204 when a projects is deleted', async () => {
      const expectedId = await database('projects').first('id').then(object => object.id);
      const response = await request(app).delete(`/api/v1/projects/${expectedId}`)
      expect(response.status).toBe(204)
    })
    
    it('SAD PATH: should return a 404 if a request id is bad', async () => {
      const response = await request(app).delete('/api/v1/projects/-2')
      expect(response.status).toBe(404)
    })
  })
})
