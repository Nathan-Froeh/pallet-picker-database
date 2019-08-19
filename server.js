const express = require('express');
const app = express();
const cors = require('cors');
const environment = process.env.NODE_ENV || 'development';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.set('port', process.env.PORT || 3001);
app.locals.title = 'Palette Picker Database';

app.get('/', (request, response) => {
  
})

app.listen(app.get('port'), () => {
  console.log(`Running on port ${app.get('port')}`)
})