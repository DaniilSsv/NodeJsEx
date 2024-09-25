const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const { LandingPad } = require('../models/landingPad');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await LandingPad.deleteMany({ name: { $regex: /^test-lp-/ } }); // verwijderd alle test objecten uit database
  await mongoose.connection.close();
});

let token = ''; // staat hier om het token overal in het test file te kunnen gebruiken
let rocketId = '665f13e77f0ff7d4529a5e32'; // Geef een bestaande id mee uit de database

describe('LandingPad Routes', () => {

  describe('POST /auth/login', () => {
    it('should log in an existing user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'UnitTestAdmin',
          password: 'UnitTestAdminPassword'
        });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      token = response.body.token;
    });
  });

  describe('POST /api/landingPads', () => {
    it('should create a new landing pad', async () => {
      const newLandingPad = {
        name: 'test-lp-LC-39A',
        rocketId: rocketId,
        location: 'Cape Canaveral, FL, USA',
        surfaceType: 'concrete'
      };

      const response = await request(app)
        .post('/api/landingPads')
        .set('x-auth-token', token)
        .send(newLandingPad);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('test-lp-LC-39A');
    });

    it('should return 400 if landing pad data is invalid', async () => {
      const invalidLandingPadData = {
        name: 'L', // Name too short
        rocketId: rocketId,
        location: 'FL', // Too short location
        surfaceType: 'invalidSurfaceType'
      };

      const response = await request(app)
        .post('/api/landingPads')
        .set('x-auth-token', token)
        .send(invalidLandingPadData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/landingPads', () => {
    it('should get all landing pads', async () => {
      const response = await request(app)
        .get('/api/landingPads')
        .set('x-auth-token', token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/landingPads/:id', () => {
    it('should get a single landing pad by id', async () => {
      const newLandingPad = await LandingPad.create({
        name: 'test-lp-LC-39A',
        rocketId: rocketId,
        location: 'Cape Canaveral, FL, USA',
        surfaceType: 'concrete'
      });

      const response = await request(app)
        .get(`/api/landingPads/${newLandingPad._id}`)
        .set('x-auth-token', token);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('test-lp-LC-39A');
    });

    it('should return 404 if landing pad is not found', async () => {
      const response = await request(app)
        .get('/api/landingPads/60b15c2698a9d117e89b00c8')
        .set('x-auth-token', token);

      expect(response.status).toBe(404);
      expect(response.text).toBe('Landing pad not found.');
    });

    it('should return 400 if id is invalid', async () => {
      const response = await request(app)
        .get('/api/landingPads/invalidid')
        .set('x-auth-token', token);

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid landing pad ID');
    });
  });

  describe('PUT /api/landingPads/:id', () => {
    it('should update a landing pad by id', async () => {
      const newLandingPad = await LandingPad.create({
        name: 'test-lp-LC-39A',
        rocketId: rocketId,
        location: 'Cape Canaveral, FL, USA',
        surfaceType: 'concrete'
      });

      const updatedData = {
        name: 'test-lp-LC-39A Updated',
        rocketId: rocketId,
        location: 'Cape Canaveral, FL, USA',
        surfaceType: 'asphalt'
      };

      const response = await request(app)
        .put(`/api/landingPads/${newLandingPad._id}`)
        .set('x-auth-token', token)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('test-lp-LC-39A Updated');
    });

    it('should return 404 if landing pad is not found', async () => {
      const updatedData = {
        name: 'test-lp-LC-39A Updated',
        rocketId: rocketId,
        location: 'Cape Canaveral, FL, USA',
        surfaceType: 'asphalt'
      };

      const response = await request(app)
        .put('/api/landingPads/60b15c2698a9d117e89b00c8')
        .set('x-auth-token', token)
        .send(updatedData);

      expect(response.status).toBe(404);
      expect(response.text).toBe('Landing pad not found');
    });

    it('should return 400 if id is invalid', async () => {
      const response = await request(app)
        .put('/api/landingPads/invalidid')
        .set('x-auth-token', token)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 if landing pad data is invalid', async () => {
      const newLandingPad = await LandingPad.create({
        name: 'test-lp-LC-39A',
        rocketId: rocketId,
        location: 'Cape Canaveral, FL, USA',
        surfaceType: 'concrete'
      });

      const invalidData = {
        name: 'L', // Name too short
        rocketId: rocketId,
        location: 'Cape Canaveral, FL, USA',
        surfaceType: 'invalidSurfaceType'
      };

      const response = await request(app)
        .put(`/api/landingPads/${newLandingPad._id}`)
        .set('x-auth-token', token)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('DELETE /api/landingPads/:id', () => {
    it('should delete a landing pad by id', async () => {
      const newLandingPad = await LandingPad.create({
        name: 'test-lp-LC-39A',
        rocketId: rocketId,
        location: 'Cape Canaveral, FL, USA',
        surfaceType: 'concrete'
      });

      const response = await request(app)
        .delete(`/api/landingPads/${newLandingPad._id}`)
        .set('x-auth-token', token);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('test-lp-LC-39A');

      const deletedLandingPad = await LandingPad.findById(newLandingPad._id);
      expect(deletedLandingPad).toBeNull();
    });

    it('should return 404 if landing pad is not found', async () => {
      const response = await request(app)
        .delete('/api/landingPads/60b15c2698a9d117e89b00c8')
        .set('x-auth-token', token);

      expect(response.status).toBe(404);
      expect(response.text).toBe('Landing pad not found.');
    });

    it('should return 400 if id is invalid', async () => {
      const response = await request(app)
        .delete('/api/landingPads/invalidid')
        .set('x-auth-token', token);

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid landing pad ID');
    });
  });
});
