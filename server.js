const express = require('express');
const app = express();
const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

app.use(express.json())

app.set('port', process.env.PORT || 3001);

app.listen(app.get('port'), () => {
  console.log(`App is running on http://localhost:${app.get('port')}`)
});

app.get('/api/v1/projects', (req, res) => {
  database('projects').select()
    .then(projects => {
      res.status(200).json(projects)
    })
    .catch(error => {
      res.status(500).json({ error })
    })
});

app.get('/api/v1/palettes', (req, res) => {
  database('palettes').select()
    .then(palettes => {
      res.status(200).json(palettes)
    })
    .catch(error => {
      res.status(500).json({ error })
    })
});

app.get('/api/v1/projects/:id', (req, res) => {
  const { id } = req.params

  database('projects').where('id', id).select()
    .then(project => {
      if (project[0]) {
        res.status(200).json(project[0])
      } else {
        res.status(404).json(`Requested project does not exist!`)
      }
    })
    .catch(error => {
      res.status(500).json(`Please check endpoint - valid params not provided! Error: ${error}`)
    })
});

app.get('/api/v1/palettes/:id', (req, res) => {
  const { id } = req.params

  database('palettes').where('id', id).select()
    .then(palette => {
      if (palette[0]) {
        res.status(200).json(palette[0])
      } else {
        res.status(404).json(`Requested palette does not exist!`)
      }
    })
    .catch(error => {
      res.status(500).json(`Please check endpoint - valid params not provided! Error: ${error}`)
    })
});

