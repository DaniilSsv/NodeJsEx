const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); 
const { Rocket } = require('../models/rocket');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
    await Rocket.deleteMany({ name: { $regex: /^test-/ } }); // verwijderd alle test objecten uit database
  await mongoose.connection.close();
});

let token = ''; // staat hier om het token overal in het test file te kunnen gebruiken
let agencyId = '665efda364d66c75f7111949'; // Geef een bestaande id mee uit de database

describe('Rocket Routes', () => {

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

  describe('POST /api/rockets', () => {
    it('should create a new rocket', async () => {
      const newRocket = {
        name: 'test-Falcon 9',
        agencyId: agencyId,
        payloadCapacity: 22800,
        fuelType: 'liquid',
        launchDate: '2024-05-01'
      };

      const response = await request(app)
        .post('/api/rockets')
        .set('x-auth-token', token)
        .send(newRocket);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('test-Falcon 9');
    });

    it('should return 400 if rocket data is invalid', async () => {
      const invalidRocketData = {
        name: 'F', // Name too short
        agencyId: agencyId, 
        payloadCapacity: 22800,
        fuelType: 'liquid',
        launchDate: '2024-05-01'
      };

      const response = await request(app)
        .post('/api/rockets')
        .set('x-auth-token', token)
        .send(invalidRocketData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/rockets', () => {
    it('should get all rockets', async () => {
      const response = await request(app)
        .get('/api/rockets')
        .set('x-auth-token', token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(1);
    });
  });

  describe('GET /api/rockets/:id', () => {
    it('should get a single rocket by id', async () => {
      const newRocket = await Rocket.create({
        name: 'test-Falcon 9',
        agencyId: agencyId,
        payloadCapacity: 22800,
        fuelType: 'liquid',
        launchDate: '2024-05-01'
      });

      const response = await request(app)
        .get(`/api/rockets/${newRocket._id}`)
        .set('x-auth-token', token);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('test-Falcon 9');
    });

    it('should return 404 if rocket is not found', async () => {
      const response = await request(app)
        .get('/api/rockets/60b15c2698a9d117e89b00c8')
        .set('x-auth-token', token);

      expect(response.status).toBe(404);
      expect(response.text).toBe('Rocket not found.');
    });

    it('should return 400 if id is invalid', async () => {
      const response = await request(app)
        .get('/api/rockets/invalidid')
        .set('x-auth-token', token);

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid rocket ID');
    });
  });

  describe('PUT /api/rockets/:id', () => {
    it('should update a rocket by id', async () => {
      const newRocket = await Rocket.create({
        name: 'test-Falcon 9',
        agencyId: agencyId,
        payloadCapacity: 22800,
        fuelType: 'liquid',
        launchDate: '2024-05-01'
      });

      const updatedData = {
        name: 'test-Falcon 9 Updated',
        agencyId: newRocket.agencyId,
        payloadCapacity: 23000,
        fuelType: 'liquid',
        launchDate: '2024-06-01'
      };

      const response = await request(app)
        .put(`/api/rockets/${newRocket._id}`)
        .set('x-auth-token', token)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('test-Falcon 9 Updated');
    });

    it('should return 404 if rocket is not found', async () => {
      const updatedData = {
        name: 'test-Falcon 9 Updated',
        agencyId: agencyId,
        payloadCapacity: 23000,
        fuelType: 'liquid',
        launchDate: '2024-06-01'
      };

      const response = await request(app)
        .put('/api/rockets/60b15c2698a9d117e89b00c8')
        .set('x-auth-token', token)
        .send(updatedData);

      expect(response.status).toBe(404);
      expect(response.text).toBe('Rocket not found');
    });

    it('should return 400 if id is invalid', async () => {
      const response = await request(app)
        .put('/api/rockets/invalidid')
        .set('x-auth-token', token)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 if rocket data is invalid', async () => {
      const newRocket = await Rocket.create({
        name: 'test-Falcon 9',
        agencyId: agencyId,
        payloadCapacity: 22800,
        fuelType: 'liquid',
        launchDate: '2024-05-01'
      });

      const invalidData = {
        name: 'F', // Name too short
        agencyId: newRocket.agencyId,
        payloadCapacity: 23000,
        fuelType: 'liquid',
        launchDate: '2024-06-01'
      };

      const response = await request(app)
        .put(`/api/rockets/${newRocket._id}`)
        .set('x-auth-token', token)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('DELETE /api/rockets/:id', () => {
    it('should delete a rocket by id', async () => {
      const newRocket = await Rocket.create({
        name: 'test-Falcon 9',
        agencyId: agencyId,
        payloadCapacity: 22800,
        fuelType: 'liquid',
        launchDate: '2024-05-01'
      });

      const response = await request(app)
        .delete(`/api/rockets/${newRocket._id}`)
        .set('x-auth-token', token);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('test-Falcon 9');

      const deletedRocket = await Rocket.findById(newRocket._id);
      expect(deletedRocket).toBeNull();
    });

    it('should return 404 if rocket is not found', async () => {
      const response = await request(app)
        .delete('/api/rockets/60b15c2698a9d117e89b00c8')
        .set('x-auth-token', token);

      expect(response.status).toBe(404);
      expect(response.text).toBe('Rocket not found.');
    });

    it('should return 400 if id is invalid', async () => {
      const response = await request(app)
        .delete('/api/rockets/invalidid')
        .set('x-auth-token', token);

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid rocket ID');
    });
  });
});
