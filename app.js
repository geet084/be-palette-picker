const express = require('express');
const app = express();
const cors = require('cors')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(cors())
app.use(express.json())

app.get('/api/v1/projects', (req, res) => {
  const { project_name } = req.query

  if (project_name) {
    database('projects').where('project_name', 'like', `%${project_name}%`)
      .then(projects => {
        res.status(200).json(projects)
      })
      .catch(error => {
        res.status(500).json({ error })
      })
  } else {
    database('projects').select()
      .then(projects => {
        res.status(200).json(projects)
      })
      .catch(error => {
        res.status(500).json({ error })
      })
  }
});

app.get('/api/v1/projects/:id/palettes', (req, res) => {
  const { id } = req.params;

  database('palettes').where('project_id', id).select()
    .then(palettes => {
      if (palettes[0]) {
        res.status(200).json(palettes)
      } else {
        res.status(404).json(`No projects associated with this project!`)
      }
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

app.get('/api/v1/projects/:id/palettes/:p_id', (req, res) => {
  const { p_id } = req.params

  database('palettes').where('id', p_id).select()
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

app.post('/api/v1/projects', (req, res) => {
  const { project_name } = req.body

  for (let reqParam of ['project_name']) {
    if (!req.body[reqParam]) {
      return res.status(422).send({
        error: `Expected format: { project_name: <String> }. You're missing a "${reqParam}" property!`
      })
    }
  }

  database('projects').insert({ project_name }, 'id')
    .then(project => {
      if (project[0]) {
        res.status(201).json({ id: project[0], ...req.body })
      }
    })
    .catch(error => {
      res.status(500).json({ error })
    })
});

app.post('/api/v1/projects/:id/palettes', (req, res) => {
  const { id } = req.params
  const { palette_name, color_1, color_2, color_3, color_4, color_5 } = req.body

  for (let reqParam of ['palette_name', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5']) {
    if (!req.body[reqParam]) {
      return res.status(422).send({
        error: `Expected format: { palette_name: <String>, color_1: <String>, color_2: <String>, color_3: <String>, color_4: <String>, color_5: <String> }. You're missing a "${reqParam}" property!`
      })
    }
  }

  database('palettes').insert({
    palette_name, color_1, color_2, color_3, color_4, color_5, project_id: id
  }, 'id')
    .then(palette => {
      if (palette[0]) {
        res.status(201).json({ id: palette[0], ...req.body })
      }
    })
    .catch(error => {
      res.status(500).json({ error })
    })
});

app.delete('/api/v1/projects/:id/palettes/:p_id', (req, res) => {
  const { p_id } = req.params
  let found = false

  database('palettes').select()
    .then(palettes => {
      palettes.forEach(palette => {
        if (palette.id === parseInt(p_id)) {
          found = true
        }
      })
      if (!found) {
        return res.status(404).json(`Palette not found! Delete unsuccessful.`)
      } else {
        database('palettes').where('id', parseInt(p_id)).del()
          .then(() => {
            res.status(202).json(p_id)
          })
      }
    })
    .catch(error => {
      res.status(500).json({ error })
    })
});

app.delete('/api/v1/projects/:id', (req, res) => {
  const { id } = req.params
  let found = false

  database('palettes').where('project_id', parseInt(id)).del()
    .then(() => {
      database('projects').select()
        .then(projects => {
          projects.forEach(project => {
            if (project.id === parseInt(id)) {
              found = true
            }
          })
          if (!found) {
            return res.status(404).json(`Project not found! Delete unsuccessful.`)
          } else {
            database('projects').where('id', parseInt(id)).del()
              .then(() => {
                res.status(202).json(id)
              })
          }
        })
        .catch(error => {
          res.status(500).json({ error })
        })
    })
})

app.put('/api/v1/projects/:id', (req, res) => {
  const { id } = req.params
  let found = false
  const { project_name } = req.body

  for (let reqParam of ['project_name']) {
    if (!req.body[reqParam]) {
      return res.status(422).send({
        error: `Expected format: { project_name: <String> }. You're missing a "${reqParam}" property!`
      })
    }
  }

  database('projects').select()
    .then(projects => {
      projects.forEach(project => {
        if (project.id === parseInt(id)) {
          found = true
        }
      })
      if (!found) {
        return res.status(404).json(`Project not found! Update unsuccessful.`)
      } else {
        database('projects').where('id', id).update({ project_name })
          .then(project => {
            res.status(200).json({ id, ...req.body })
          })
      }
    })
    .catch(error => {
      res.status(500).json({ error })
    })
})

app.put('/api/v1/projects/:id/palettes/:p_id', (req, res) => {
  const { p_id } = req.params
  let found = false
  const { palette_name, color_1, color_2, color_3, color_4, color_5 } = req.body

  for (let reqParam of ['palette_name', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5']) {
    if (!req.body[reqParam]) {
      return res.status(422).send({
        error: `Expected format: { palette_name: <String>, color_1: <String>, color_2: <String>, color_3: <String>, color_4: <String>, color_5: <String> }. You're missing a "${reqParam}" property!`
      })
    }
  }

  database('palettes').select()
    .then(palettes => {
      palettes.forEach(palette => {
        if (palette.id === parseInt(p_id)) {
          found = true
        }
      })
      if (!found) {
        return res.status(404).json(`Palette not found! Update unsuccessful.`)
      } else {
        database('palettes').where('id', p_id).update({
          palette_name,
          color_1,
          color_2,
          color_3,
          color_4,
          color_5
        })
          .then(palette => {
            res.status(200).json({ p_id, ...req.body })
          })
      }
    })
    .catch(error => {
      res.status(500).json({ error })
    })
})

module.exports = app;