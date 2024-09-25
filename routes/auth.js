const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');
const { User, validateUser } = require('../models/user');

router.post('/register', async (req, res) => {
/*
  #swagger.tags = ['Authentication']
  #swagger.description = 'Routes for user authentication'
  #swagger.path = '/api/auth/register'
  #swagger.method = 'post'
  #swagger.summary = 'Register a new user'
  #swagger.responses[200] = {
    description: 'Successfully registered user and returned token',
    schema: { $ref: '#/definitions/Token' }
  }
  #swagger.responses[400] = {
    description: 'Invalid request body or user already exists',
    schema: { $ref: '#/definitions/Error' }
  }
  #swagger.responses[500] = {
    description: 'Server error',
    schema: { $ref: '#/definitions/Error' }
  }
 #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      $username: 'exampleuser',
      $password: 'password123'
    }
  }
*/
const { error } = validateUser(req.body);
if (error) {
  return res.status(400).json({ error: error.details[0].message });
}

const { username, password, role } = req.body;

try {
  let user = await User.findOne({ username });
  if (user) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  //console.log('Hashed Password:', hashedPassword); // Debugging line

  user = new User({
    username,
    password: hashedPassword,
    role
  });

  await user.save();

  const token = generateToken(user);

  res.json({ token });
} catch (err) {
  console.error(err.message);
  res.status(500).send('Server error');
}
});


router.post('/login', async (req, res) => {
  /*
  #swagger.tags = ['Authentication']
  #swagger.description = 'Routes for user authentication'
  #swagger.path = '/api/auth/login'
  #swagger.method = 'post'
  #swagger.summary = 'Login a user'
  #swagger.responses[200] = {
    description: 'Successfully logged in user and returned token',
    schema: { $ref: '#/definitions/Token' }
  }
  #swagger.responses[400] = {
    description: 'Invalid credentials or request body',
    schema: { $ref: '#/definitions/Error' }
  }
  #swagger.responses[500] = {
   description: 'Server error',
    schema: { $ref: '#/definitions/Error' }
  }
  #swagger.parameters['body'] = {
    in: 'body',
   required: true,
    schema: {
      $username: 'exampleuser',
      $password: 'password123'
    }
  }
 */
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    //console.log('Plaintext Password:', password); // Debugging line
    //console.log('Hashed Password:', user.password); // Debugging line

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
