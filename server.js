const express = require('express');
const app = express();
const cors = require('cors');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.set('port', process.env.PORT || 3001);
app.locals.title = 'Palette Picker Database';

app.get('/', (request, response) => {

});

app.listen(app.get('port'), () => {
  console.log(`Running on port ${app.get('port')}`)
});

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => response.status(200).json(projects))
    .catch(error => response.status(500).json({error}))
});

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then(palettes => response.status(200).json(palettes))
    .catch(error => response.status(500).json({error}))
});

app.get('/api/v1/projects/:id', (request, response) => {
  database('projects').where('id', request.params.id).select()
    .then(project => {
      if(project.length) {
        response.status(200).json(project)
      } else {
        response.status(404)
          .json({error: `Could not find project with id #${request.params.id}`})
      }
    })
    .catch(error => response.status(500).json({error}))
})

app.get('/api/v1/palettes/:id', (request, response) => {
  database('palettes').where('id', request.params.id).select()
    .then(palette => {
      if(palette.length) {
        response.status(200).json(palette)
      } else {
        response.status(404)
          .json({error: `Could not find palette with id #${request.params.id}`})
      }
    })
    .catch(error => response.status(500).json({error}))
})

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;
  for(let requiredParameter of ['name']) {
    if(!project[requiredParameter]) {
      return response
        .status(422)
        .send({error: `Expected format: {name: <String>}. You're missing a ${requiredParameter} property.`})
    }
  }
  database('projects').insert(project, 'id')
    .then(project => response.status(201).json({id: project[0]}))
    .catch(error => response.status(500).json({error}))
})