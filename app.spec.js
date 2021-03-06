const request = require('supertest')
const app = require('./app')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const projects = require('./data/data')

describe('Server', () => {
  beforeEach(async () => {
    await database.seed.run()
  })

  describe('GET /projects', () => {
    it('should return a status of 200 if OK', async () => {
      const response = await request(app).get('/api/v1/projects');

      expect(response.status).toBe(200)
    })

    it('should return all of the projects in the DB if the response is OK', async () => {
      const expectedProjects = projects.length;

      const response = await request(app).get('/api/v1/projects');
      const results = response.body;

      expect(results.length).toEqual(expectedProjects);
    })

    it('should return projects based on a search param', async () => {
      const response = await request(app).get('/api/v1/projects?project_name=end')
      const results = response.body
      
      expect(results.length).toEqual(2)
    })
  })

  describe('GET /projects/:id/palettes', () => {
    it('should return a status of 200 if OK', async () => {
      const firstProject = await database('projects').first()
      const id = firstProject.id

      const response = await request(app).get(`/api/v1/projects/${id}/palettes`)

      expect(response.status).toBe(200);
    })

    it('should return a status of 404 if not OK', async () => {
      const id = -1
      const response = await request(app).get(`/api/v1/projects/${id}/palettes`)

      expect(response.status).toBe(404)
    })

    it('should return all of the palettes for a project in the DB if the response is OK', async () => {
      const expectedPalettes = projects[1].palettes.length
      const foundProject = await database('projects').where('project_name', 'back end project')
      const id = foundProject[0].id

      const response = await request(app).get(`/api/v1/projects/${id}/palettes`)
      const results = response.body

      expect(results.length).toEqual(expectedPalettes)
    })
  })

  describe('GET /projects/:id', () => {
    it('should return a status of 200 if OK', async () => {
      const firstProject = await database('projects').first()
      const id = firstProject.id
      const response = await request(app).get(`/api/v1/projects/${id}`);

      expect(response.status).toBe(200)
    })

    it('should return a status of 404 if not OK', async () => {
      const id = -1
      const response = await request(app).get(`/api/v1/projects/${id}`)

      expect(response.status).toBe(404)
    })

    it('should return a specific project in the DB if the response is OK', async () => {
      const expectedProject = projects[0]
      const foundProject = await database('projects').where('project_name', 'front end project')
      
      const id = foundProject[0].id

      const response = await request(app).get(`/api/v1/projects/${id}`)
      const results = response.body

      expect(results.project_name).toEqual(expectedProject.project_name)
    })
  })

  describe('GET /projects/:id/palettes/:p_id', () => {
    it('should return a status of 200 if OK', async () => {
      const firstProject = await database('projects').first()
      const id = firstProject.id
      const firstPalette = await database('palettes').first()
      const p_id = firstPalette.id

      const response = await request(app).get(`/api/v1/projects/${id}/palettes/${p_id}`);

      expect(response.status).toBe(200)
    })

    it('should return a status of 404 if not OK', async () => {
      const id = -1
      const p_id = -2
      const response = await request(app).get(`/api/v1/projects/${id}/palettes/${p_id}`)

      expect(response.status).toBe(404)
    })

    it('should return a specific palette for a project in the DB if the response is OK', async () => {
      const expectedPalette = projects[1].palettes[0]

      const foundProject = await database('projects').where('project_name', 'back end project')
      const id = foundProject[0].id
      const foundPalette = await database('palettes').where('palette_name', 'dreamy')
      const p_id = foundPalette[0].id

      const response = await request(app).get(`/api/v1/projects/${id}/palettes/${p_id}`)
      const results = response.body

      
      expect(results.palette_name).toEqual
      (expectedPalette.palette_name) 
    })
  })

  describe('POST /projects', () => {
    it('should return a status of 200 if OK', async () => {
      const newProject = {project_name: 'new Project'}

      const response = await request(app).post('/api/v1/projects').send(newProject);

      expect(response.status).toBe(201)
    })

    it('should return a status of 404 if not OK', async () => {
      const newProject = { project_wrong_property: 'new Project' }
      
      const response = await request(app).post('/api/v1/projects').send(newProject);

      expect(response.status).toBe(422)
    })

    it('should post a new project', async () => {
      const newProject = { project_name: 'new Project' }

      const response = await request(app).post('/api/v1/projects').send(newProject);
      const result = response.body
      
      expect(result.project_name).toEqual(newProject.project_name )
    })
  })

  describe('POST /api/v1/projects/:id/palettes', () => {
    it('should return a status of 200 if OK', async () => {
      const newPalette = { 
        palette_name: 'test',
        color_1: 'aaaaaa',
        color_2: 'aaaaaa',
        color_3: 'aaaaaa',
        color_4: 'aaaaaa',
        color_5: 'aaaaaa'
      }
      
      const project = await database('projects').first()
      const id = project.id

      const response = await request(app).post(`/api/v1/projects/${id}/palettes`).send(newPalette);

      expect(response.status).toBe(201)
    })

    it('should return a status of 404 if not OK', async () => {
      const newPaletteWrong = {
        palette_namezzz: 'test',
        color_1: 'aaaaaa',
        color_2: 'aaaaaa',
        color_3: 'aaaaaa',
        color_4: 'aaaaaa',
        color_5: 'aaaaaa'
      }

      const project = await database('projects').first()
      const id = project.id

      const response = await request(app).post(`/api/v1/projects/${id}/palettes`).send(newPaletteWrong);

      expect(response.status).toBe(422)
    })

    it('should post a new palette', async () => {
      const newPalette = {
        palette_name: 'test',
        color_1: 'aaaaaa',
        color_2: 'aaaaaa',
        color_3: 'aaaaaa',
        color_4: 'aaaaaa',
        color_5: 'aaaaaa'
      }

      const project = await database('projects').first()
      const id = project.id

      const response = await request(app).post(`/api/v1/projects/${id}/palettes`).send(newPalette);

      const results = response.body
      expect(results.palette_name).toEqual(newPalette.palette_name)
    }) 
  })

  describe('DELETE /api/v1/projects/:id/palettes/:p_id', () => {
    it('should return a status of 202 if delete is successful', async () => {
      const project = await database('projects').first()
      const id = project.id
      const paletteToDelete = await database('palettes').where('project_id', id)
      const p_id = paletteToDelete[0].id

      const response = await request(app).delete(`/api/v1/projects/${id}/palettes/${p_id}`)

      expect(response.status).toBe(202)
    })

    it('should return a status of 404 if there is no palette to delete', async () => {
      const project = await database('projects').first()
      const id = project.id
      const p_id = -1

      const response = await request(app).delete(`/api/v1/projects/${id}/palettes/${p_id}`)

      expect(response.status).toBe(404)
    })

    it('should delete the correct palette', async () => {
      const project = await database('projects').first()
      const id = project.id
      const paletteToDelete = await database('palettes').where('project_id', id)
      const p_id = paletteToDelete[0].id

      const response = await request(app).delete(`/api/v1/projects/${id}/palettes/${p_id}`)
      
      expect(response.body).toEqual(p_id.toString())
    })
  })

  describe('DELETE /api/v1/projects/:id', () => {
    it('should return a status of 202 if delete is successful', async () => {
      const project = await database('projects').first()
      const id = project.id

      const response = await request(app).delete(`/api/v1/projects/${id}/`)

      expect(response.status).toBe(202)
    })

    it('should return a status of 404 if there is no palette to delete', async () => {
      const id = -99

      const response = await request(app).delete(`/api/v1/projects/${id}/`)

      expect(response.status).toBe(404)
    })

    it('should delete the correct project', async () => {
      const project = await database('projects').first()
      const id = project.id

      const response = await request(app).delete(`/api/v1/projects/${id}/`)
      const foundProjects = await database('projects').where('id', id)
      
      expect(response.body).toEqual(id.toString())
      expect(foundProjects.length).toEqual(0)
    })

    it('should delete the associated palettes for a project', async () => {
      const project = await database('projects').first()
      const id = project.id

      await request(app).delete(`/api/v1/projects/${id}/`)
      const foundPalettes = await database('palettes').where('project_id', id)

      expect(foundPalettes.length).toEqual(0)
    })
  })

  describe('PUT /api/v1/projects/:id', () => {
    it('should return a status of 200 if response is OK', async () => {
      const projectToUpdate = await database('projects').first()
      const id = projectToUpdate.id
      const updatedProject = {project_name: 'THIS has BEEN updated'}

      const response = await request(app).put(`/api/v1/projects/${id}`).send(updatedProject)
      
      expect(response.status).toBe(200)
    })

    it('should return a status of 404 if project is not found', async () => {
      const id = -1
      const updatedProject = { project_name: 'THIS has not BEEN updated' }

      const response = await request(app).put(`/api/v1/projects/${id}`).send(updatedProject)

      expect(response.status).toBe(404)
    })

    it('should return a status of 422 if the correct params were not provided', async () => {
      const projectToUpdate = await database('projects').first()
      const id = projectToUpdate.id
      const updatedProject = { wrong_project_name: 'THIS has the wrong property' }

      const response = await request(app).put(`/api/v1/projects/${id}`).send(updatedProject)

      expect(response.status).toBe(422)
    })

    it('should update a project with a new name', async () => {
      const projectToUpdate = await database('projects').first()
      const id = projectToUpdate.id
      const updatedProject = { project_name: 'THIS has BEEN updated' }

      const response = await request(app).put(`/api/v1/projects/${id}`).send(updatedProject)
      const expected = {id: (id.toString()), project_name: "THIS has BEEN updated"}
      const foundProject = await database('projects').where('id', id)
      
      expect(response.body).toEqual(expected)
      expect(foundProject[0].project_name).toEqual(updatedProject.project_name)
    })
  })

  describe('PUT /api/v1/projects/:id/palettes/:p_id', () => {
    it('should return a status of 200 if response is OK', async () => {
      const project = await database('projects').first()
      const id = project.id
      const paletteToUpdate = await database('palettes').where('project_id', id).first()
      const p_id = paletteToUpdate.id
      const updatedPalette = {
        palette_name: 'palette NAME updated',
        color_1: 'aaaaaa',
        color_2: 'aaaaaa',
        color_3: 'aaaaaa',
        color_4: 'aaaaaa',
        color_5: 'aaaaaa'
      }

      const response = await request(app).put(`/api/v1/projects/${id}/palettes/${p_id}`).send(updatedPalette)
      
      expect(response.status).toBe(200)
    })

    it('should return a status of 404 if palette is not found', async () => {
      const project = await database('projects').first()
      const id = project.id
      const p_id = -1
      const updatedPalette = {
        palette_name: 'palette NAME updated',
        color_1: 'aaaaaa',
        color_2: 'aaaaaa',
        color_3: 'aaaaaa',
        color_4: 'aaaaaa',
        color_5: 'aaaaaa'
      }

      const response = await request(app).put(`/api/v1/projects/${id}/palettes/${p_id}`).send(updatedPalette)

      expect(response.status).toBe(404)
    })

    it('should return a status of 422 if the correct params were not provided', async () => {
      const project = await database('projects').first()
      const id = project.id
      const paletteToUpdate = await database('palettes').where('project_id', id).first()
      const p_id = paletteToUpdate.id
      const updatedPalette = {
        wrong_palette_name: 'palette property wrong',
        color_1: 'aaaaaa',
        color_2: 'aaaaaa',
        color_3: 'aaaaaa',
        color_4: 'aaaaaa',
        color_5: 'aaaaaa'
      }

      const response = await request(app).put(`/api/v1/projects/${id}/palettes/${p_id}`).send(updatedPalette)

      expect(response.status).toBe(422)
    })

    it('should update a palette with new information', async () => {
      const project = await database('projects').first()
      const id = project.id
      const paletteToUpdate = await database('palettes').where('project_id', id).first()
      const p_id = paletteToUpdate.id
      const updatedPalette = {
        palette_name: 'palette NAME updated',
        color_1: '111111',
        color_2: '111111',
        color_3: '111111',
        color_4: '111111',
        color_5: '111111'
      }

      const response = await request(app).put(`/api/v1/projects/${id}/palettes/${p_id}`).send(updatedPalette)
      const expected = {...updatedPalette, p_id: (p_id.toString())}
      const foundPalette = await database('palettes').where('id', p_id)

      expect(response.body).toEqual(expected)
      expect(foundPalette[0].palette_name).toEqual(updatedPalette.palette_name)
    })
  })
})