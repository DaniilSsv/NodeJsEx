// auth.test.js
const request = require('supertest');
const app = require('../server');
const { User } = require('../models/user');
const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await User.deleteMany({ username: { $regex: /^test-/ } }); // verwijderd alle test objecten uit database
  // Close the database connection after all tests
  await mongoose.connection.close();
});

describe('Authentication Routes', () => {
////////////////////////////////////////////////////////////////
// LET OP, MAAK EEN NIEUWE USER OF VERWIJDER TESTUSER IN DATABASE
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'test-user',
        password: 'test-password'
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

////////////////////////////////////////////////////////////////
it('should register a new admin', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'test-adminuser',
      password: 'test-adminpassword',
      role: 'admin'
    });

  expect(response.status).toBe(200);
  expect(response.body.token).toBeDefined();

  // Query the database to get the user details
  const user = await User.findOne({ username: 'test-adminuser' });
  expect(user).toBeDefined();
  expect(user.role).toBe('admin');
});

////////////////////////////////////////////////////////////////

  it('should log in an existing user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'test-user',
        password: 'test-password'
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

////////////////////////////////////////////////////////////////

  it('should handle invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'test-nonexistentuser',
        password: 'test-wrongpassword'
      });

    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Invalid credentials');
  });

////////////////////////////////////////////////////////////////

  it('should handle invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'test-user',
        password: 'Test-password'
      });

    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Invalid credentials');
  });
});
