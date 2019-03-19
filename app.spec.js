const request = require('supertest')
const app = require('./app')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const projects = require('./data/data')

describe('Server', () => {

  describe('GET /projects', () => {
    it('should return a status of 200 if okay', async () => {
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
})