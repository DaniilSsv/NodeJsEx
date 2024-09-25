const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); 
const { Agency } = require('../models/agency');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await Agency.deleteMany({ name: { $regex: /^test-/ } }); // verwijderd alle test objecten uit database
  await mongoose.connection.close();
});

let token = '';

describe('Agency Routes', () => {

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

// eerst the post om dan de get all te kunnen testen
  describe('POST /api/agencies', () => {
    it('should create a new agency', async () => {
      const newAgency = {
        name: 'test-New Agency',
        location: 'Test Location',
        contactEmail: 'test@example.com',
        establishedYear: 2000,
        completedLaunches: 10,
        failedLaunches: 1
      };

      const response = await request(app)
        .post('/api/agencies')
        .set('x-auth-token', token)
        .send(newAgency);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('test-New Agency');
    });

    it('should return 400 if agency data is invalid', async () => {
      const invalidAgencyData = {
        name: 'Short', 
        location: 'Test Location',
        contactEmail: 'test@example.com',
        completedLaunches: 10,
        failedLaunches: 1
      };

      const response = await request(app)
        .post('/api/agencies')
        .set('x-auth-token', token)
        .send(invalidAgencyData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/agencies', () => {
    it('should create a second agency', async () => {
        const newAgency = {
          name: 'test-Second Agency',
          location: 'Test Location',
          contactEmail: 'test@example.com',
          establishedYear: 2000,
          completedLaunches: 10,
          failedLaunches: 1
        };
  
        const response = await request(app)
          .post('/api/agencies')
          .set('x-auth-token', token)
          .send(newAgency);
  
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('test-Second Agency');
    });


    it('should get two agencies', async () => {
      const response = await request(app)
      .get('/api/agencies')
      .set('x-auth-token', token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(1);
    });
  });

  describe('GET /api/agencies/:id', () => {
    it('should get a single agency by id', async () => {
      const newAgency = await Agency.create({
        name: 'test-New Agency',
        location: 'Test Location',
        contactEmail: 'test@example.com',
        establishedYear: 2000,
        completedLaunches: 10,
        failedLaunches: 1
      });

      const response = await request(app)
      .get(`/api/agencies/${newAgency._id}`)
      .set('x-auth-token', token);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('test-New Agency');
    });

    it('should return 404 if agency is not found', async () => {
      const response = await request(app)
      .get('/api/agencies/60b15c2698a9d117e89b00c8')
      .set('x-auth-token', token);

      expect(response.status).toBe(404);
      expect(response.text).toBe('Agency not found.');
    });

    it('should return 400 if id is invalid', async () => {
      const response = await request(app)
      .get('/api/agencies/invalidid')
      .set('x-auth-token', token);

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid agency ID');
    });
  });

  describe('PUT /api/agencies/:id', () => {
    it('should update an agency by id', async () => {
      const newAgency = await Agency.create({
        name: 'test-New Agency',
        location: 'Test Location',
        contactEmail: 'test@example.com',
        establishedYear: 2000,
        completedLaunches: 10,
        failedLaunches: 1
      });

      const updatedData = {
        name: 'test-Updated Agency',
        location: 'Updated Location',
        contactEmail: 'updated@example.com',
        establishedYear: 2021,
        completedLaunches: 20,
        failedLaunches: 2
      };

      const response = await request(app)
        .put(`/api/agencies/${newAgency._id}`)
        .set('x-auth-token', token)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('test-Updated Agency');
    });

    it('should return 404 if agency is not found', async () => {
      const updatedData = {
        name: 'test-Updated Agency',
        location: 'Updated Location',
        contactEmail: 'updated@example.com',
        establishedYear: 2021,
        completedLaunches: 20,
        failedLaunches: 2
      };

      const response = await request(app)
        .put('/api/agencies/60b15c2698a9d117e89b00c8')
        .set('x-auth-token', token)
        .send(updatedData);

      expect(response.status).toBe(404);
      expect(response.text).toBe('Agency not found');
    });

    it('should return 400 if id is invalid', async () => {
      const response = await request(app)
        .put('/api/agencies/invalidid')
        .set('x-auth-token', token)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 if agency data is invalid', async () => {
      const newAgency = await Agency.create({
        name: 'test-New Agency',
        location: 'Test Location',
        contactEmail: 'test@example.com',
        establishedYear: 2021,
        completedLaunches: 10,
        failedLaunches: 1
      });

      const invalidData = {
        name: 'Short', // Name should be at least 3 characters
        location: 'Updated Location',
        contactEmail: 'updated@example.com',
        completedLaunches: 20,
        failedLaunches: 2
      };

      const response = await request(app)
        .put(`/api/agencies/${newAgency._id}`)
        .set('x-auth-token', token)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('DELETE /api/agencies/:id', () => {
    it('should delete an agency by id', async () => {
      const newAgency = await Agency.create({
        name: 'test-New Agency',
        location: 'Test Location',
        contactEmail: 'testDelete@example.com',
        establishedYear: 2000,
        completedLaunches: 10,
        failedLaunches: 1
      });

      const response = await request(app)
      .delete(`/api/agencies/${newAgency._id}`)
      .set('x-auth-token', token);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('test-New Agency');

      const deletedAgency = await Agency.findById(newAgency._id);
      expect(deletedAgency).toBeNull();
    });

    it('should return 404 if agency is not found', async () => {
      const response = await request(app)
      .delete('/api/agencies/60b15c2698a9d117e89b00c8')
      .set('x-auth-token', token);

      expect(response.status).toBe(404);
      expect(response.text).toBe('Agency not found.');
    });

    it('should return 400 if id is invalid', async () => {
      const response = await request(app)
      .delete('/api/agencies/invalidid')
      .set('x-auth-token', token);

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid agency ID');
    });
  });
});
