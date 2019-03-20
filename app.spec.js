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
      const expected = `Deleted palette with ID of ${p_id}`

      expect(response.body).toEqual(expected)
    })
  })

})