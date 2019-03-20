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
})