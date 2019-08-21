const express = require('express');
const app = express();
const cors = require('cors');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.locals.title = 'Palette Picker Database';

app.get('/', (request, response) => {
});

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => response.status(200).json(projects))
    .catch(error => response.status(500).json({error}))
});

//TEST
app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then(palettes => response.status(200).json(palettes))
    .catch(error => response.status(500).json({error}))
});
//TEST

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  const {id} = request.params;
  database('palettes').where('project_id', id).select()
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
});

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
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;
  for(let requiredParameter of ['name']) {
    if(!project[requiredParameter]) {
      return response
        .status(422)
        .send({error: `Expected format: {name: <String>}. You're missing a ${requiredParameter} property.`})
    }
  }
  database('projects').where('name', project.name).select()
    .then(existingProject => {
      if(!existingProject.length) {
        database('projects').insert(project, 'id')
          .then(project => response.status(201).json({id: project[0]}))
          .catch(error => response.status(500).json({error}))
      } else {
        response.status(409).json(`${project.name} already exists.`)
      }
    })
});

app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;
  for(let requiredParameter of ['project_name', 'name', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5']) {
    if(!palette[requiredParameter]) {
      return response
        .status(422)
        .send({error: `Expected format: {name: <String>, color_1: <String>, color_2: <String>, color_3: <String>, color_4: <String>, color_5: <String>, project_name: <String>}. You're missing a ${requiredParameter} property.`})
    }
  }
  database('projects').where('name', palette.project_name).select('id')
    .then(project => {
      database('palettes').where('project_id', project[0].id).select()
        .then(existingPalettes => {
          const exists = existingPalettes.find((singlePalette) => {
           return  palette.name === singlePalette.name
          })
          if(project.length && !exists) {
            const newPalette = {
              name: palette.name,
              color_1: palette.color_1,
              color_2: palette.color_2,
              color_3: palette.color_3,
              color_4: palette.color_4,
              color_5: palette.color_5,
              project_id: project[0].id }
            database('palettes').insert(newPalette, 'id')
              .then(palette => response.status(201).json({id: palette[0]}))
              .catch(error => response.status(500).json({error}))
          } else {
            response.status(422).json(`${palette.name} for this project already exists`)
          }
        })
    })
});

app.patch('/api/v1/projects/:id', (request, response) => {
  const name = request.body.name;
  const id = request.params.id;
  database('projects').where('name', name).select()
    .then(existingName => {
      if(!existingName.length) {
        database('projects').where('id', id).update({name: name})
          .then(updated => {
            if(updated) {
              response.status(201).json(updated)
            } else {
              response.status(404).json(`id ${id} does not exist`)
            }
          })
          .catch(error => response.status(500).json({error}))
      } else {
        response.status(409).json(`Project ${name} already exists.`)
      }
    })
});




app.patch('/api/v1/palettes/:id', (request, response) => {
  const {name, color_1, color_2, color_3, color_4, color_5, project_id} = request.body;
  const paletteId = request.params.id;
  //get all palette names from project_id
  // if new name is unique then update
  database('palettes').where('project_id', project_id).select('name', 'id')
    .then(existingPalettes => {
      const matchingName = existingPalettes.find(existingPalette => {
        if(existingPalette.name === name 
          && Number(paletteId) !== existingPalette.id) {
          return existingPalette
        } 
      })
      return matchingName
    })
    .then(update => {
      if(!update) {
        database('palettes').where('id', paletteId).update(request.body)
          .then(() => response.status(201).json(`Palette ${paletteId} was updated`))
      } else {response.status(409).json(`${name} already exists.`)}
    })
  

})

app.delete('/api/v1/palettes/:id', (request, response) => {
  const {id} = request.params;
  database('palettes').where('id', id).select()
    .then(palette => {
      if(palette.length) {
        database('palettes').where('id', id).del()
          .then(() => response.status(204).json('Palette removed'))
          .catch(error => response.status(500).json({error}))
      } else {
        response.status(404).json('Palette does not exist')
      }
    })
})

app.delete('/api/v1/projects/:id', (request, response) => {
  const {id} = request.params;
  database('projects').where('id', id).select()
    .then(project => {
      if(project.length) {
        database('palettes').where('project_id', id).del()
          .then(() => {
            database('projects').where('id', id).del()
              .then(() => response.status(204).json('Project and palettes deleted'))
              .catch(error => response.status(500).json({error}))

          })
      } else {
        response.status(404).json('Project does not exist')
      }
    })
})

module.exports = app;
