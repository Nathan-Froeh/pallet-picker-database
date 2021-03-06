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

    it('SAD PATH: should return status 404 and error message', async () => {
      const expectedId = await database('projects').select('id')
        .then(project => project[0])
      const expectedResponse = {error: `Could not find project with id #${expectedId.id - 1}`}
      const response = await request(app)
        .get(`/api/v1/projects/${expectedId.id - 1}`)
      const result = response.body
      expect(response.status).toBe(404)
      expect(result).toEqual(expectedResponse)
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

    it('SAD PATH: should return a status of 404 if an id is sent in that doesnt exist', async () => {
      const invalidId = -1;
      const response = await request(app).get(`/api/v1/palettes/${invalidId}`);
      expect(response.status).toBe(404)
      expect(response.body.error).toEqual(`Could not find palette with id #${invalidId}`)
    })
  })

  describe('POST /api/v1/projects', () => {
    it('HAPPY PATH should return 201 status and object with new id', async () => {
      const expectedId = await database('projects').select('id')
        .then(project => project[0].id + 1)
      const expectedResponse = {id: expectedId}
      const newProject = {name: 'The Bat Cave'}
      const response = await request(app).post('/api/v1/projects').send(newProject)
      expect(response.status).toBe(201)
      expect(response.body).toEqual(expectedResponse)
    })

    it('SAD PATH: should return 409 status and project exists message', async () => {
      const newProject = {name: 'test 1'}
      const response = await request(app).post('/api/v1/projects').send(newProject)
      const errorMessage = 'test 1 already exists.';
      expect(response.status).toBe(409);
      expect(response.body).toEqual(errorMessage);
    })
  })

  describe('POST /api/v1/palettes', () => {
    it('HAPPY PATH: should post a new palette to the database', async () => {
      const newPalette = {name: 'new pal', color_1: '#FFFFFF', color_2: '#FFFFFF', color_3: '#FFFFFF', color_4: '#FFFFFF', color_5: '#FFFFFF', project_name: 'test 1'}
      const response = await request(app).post('/api/v1/palettes').send(newPalette)
      const pals = await database('palettes').where({ id: response.body.id });
      const newPalettes = pals[0]
      expect(response.status).toBe(201)
      expect(newPalettes.name).toEqual(newPalette.name)
    })
    it('SAD PATH: Should return a 422 status if the palette already exists', async () => {
      const newPalette = {name: 'palette 1', color_1: '#31393C', color_2: '#2176FF', color_3: '#33A1FD', color_4: 'FDCA40', color_5: '#F79824', project_name: 'test 1'}
      const response = await request(app).post(`/api/v1/palettes`).send(newPalette);
      expect(response.status).toBe(422)
    })
  })

  describe('PATCH /api/v1/projects/:id', () => {
    it('HAPPY PATH: should return 201 status and updated object', async () => {
      const updatedProject = {name: 'Updated test 1'}
      const expectedId = await database('projects').select('id')
        .then(project => project[0].id)
      const response = await request(app).patch(`/api/v1/projects/${expectedId}`).send(updatedProject)
      expect(response.status).toBe(201)
      expect(response.body).toEqual(1)
    })

    it('SAD PATH: should return status 404 and does not exist message', async () => {
      const updatedProject = {name: 'Updated test 1'}
      const expectedId = await database('projects').select('id')
        .then(project => project[0].id + 1)
      const response = await request(app).patch(`/api/v1/projects/${expectedId}`).send(updatedProject)
      expect(response.status).toBe(404)
      expect(response.body).toEqual(`id ${expectedId} does not exist`)
    })

    it('SAD PATH: should return 409 status and project exists message', async () => {
      const updatedProject = {name: 'test 1'}
      const expectedId = await database('projects').select('id')
        .then(project => project[0].id + 1)
      const response = await request(app).patch(`/api/v1/projects/${expectedId}`).send(updatedProject)
      expect(response.status).toBe(409)
      expect(response.body).toEqual("Project test 1 already exists.")
    })
  })

  describe('PATCH /api/v1/palettes/:id', () => {
    it('HAPPY PATH: should return a status of 201 and update a specific palette', async () => {
      const expectedProj = await database('projects').first('id').then(object => object.id)

      const updatePalette = {
        project_id: expectedProj,
        name: 'new pallete 1',
        color_1: '#31393Z',
        color_2: '2176FF',
        color_3: '33A1FD',
        color_4: 'FDCA40',
        color_5: '31393C'
      };
      const expectedId = await database('palettes').first('id').then(object => object.id);
      const response = await request(app).patch(`/api/v1/palettes/${expectedId}`).send(updatePalette);
      const newPalette = await database('palettes').where({ id: expectedId })
      expect(response.status).toBe(201)
      expect(newPalette[0].name).toEqual(updatePalette.name)
    })
    it.skip('SAD PATH: should send a 409 status code if a name already exists', async () => {
      const expectedProj = await database('projects').first('id').then(object => object.id)
      const expectedId = await database('palettes').first('id').then(object => object.id);
      const firstresponse = await request(app).get(`/api/v1/palettes`);
      console.log(firstresponse.body)
      const updatePalette = {
        project_id: expectedProj,
        name: 'pallete 2',
        color_1: '#31393E',
        color_2: '#2176FY',
        color_3: '#33A1FL',
        color_4: '#FDCA48',
        color_5: '#F79820',
      };
      const response = await request(app).patch(`/api/v1/palettes/${expectedId}`).send(updatePalette);
      const newresponse = await request(app).get(`/api/v1/palettes`);
      console.log(updatePalette.project_id)
      console.log(expectedId)
      console.log(firstresponse.body)
      console.log(newresponse.body)
      expect(response.status).toBe(409)
    })
  })

  describe('DELETE /api/v1/palettes/:id', () => {
    it('HAPPY PATH: should return 204 status', async () => {
      const paletteId = await database('palettes').select()
        .then(palette => palette[0].id)
      const response = await request(app).delete(`/api/v1/palettes/${paletteId}`)
      expect(response.status).toBe(204)
    })

    it('SAD PATH: should return 404 status', async () => {
      const paletteId = await database('palettes').select()
        .then(palette => palette[0].id - 1 )
      const response = await request(app).delete(`/api/v1/palettes/${paletteId}`)
      expect(response.status).toBe(404)
    })
  })

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

  describe('GET /api/v1/specificPalette', () => {
    it('HAPPY PATH: should return 200 status and a palette', async () => {
      const palette = await database('palettes').select()
        .then(palette => palette[0])
      const response = await request(app).get(`/api/v1/specificPalette?hexcode=%23${palette.color_1.substring(1)}`)
      const expected = [{
        name: 'palette 1',
        id: palette.id,
        color_1: palette.color_1
      }]
      const result = response.body.map(palette => (
        {
          name:palette.name,
          id: palette.id,
          color_1: palette.color_1
        }
      ))
      expect(response.status).toBe(200)
      expect(result).toEqual(expected)
    })

    it('SAD PATH: should return 404 status and hexcolor not found error', async () => {
      const palette = await database('palettes').select()
        .then(palette => palette[0])
      const response = await request(app).get(`/api/v1/specificPalette?hexcode=${palette.color_1.substring(1)}`) 
      const expected = 'Hexcolor not found'
      expect(response.status).toBe(404)
      expect(response.body).toEqual(expected)
    })

    it('SAD PATH: should return 500 error', async () => {
      const palette = await database('palettes').select()
        .then(palette => palette[0])
      const response = await request(app).get(`/api/v1/specificPalette?${palette.color_1.substring(1)}`) 
      const expected = 'Hexcolor not found'
      expect(response.status).toBe(500)
    })    
  })
})
