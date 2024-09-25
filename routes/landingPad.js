const express = require('express');
const router = express.Router();
const { LandingPad, validate } = require('../models/landingPad');
const { authorizeAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
/*
  #swagger.tags = ['Landing Pads']
  #swagger.description = 'Routes for managing landing pads'
  #swagger.path = '/api/landingPads/'
  #swagger.method = 'get'
  #swagger.summary = 'Get all landing pads'
  #swagger.parameters['x-auth-token'] = { description: 'Authorization token', required: true, type: 'string', in: 'header' }
  #swagger.responses[200] = {
    description: 'Successfully retrieved landing pads',
    schema: { $ref: '#/definitions/LandingPad' }
  }
  #swagger.responses[400] = {
    description: 'Error fetching landing pads',
    schema: { $ref: '#/definitions/Error' }
  }
 */
  try {
    const landingPads = await LandingPad.find().sort('name');
    res.send(landingPads);
  } catch (err) {
    res.status(400).send(err.message);
  }
});


router.post('/', authorizeAdmin, async (req, res) => {
  /*
  #swagger.tags = ['Landing Pads']
  #swagger.description = 'Routes for managing landing pads'
  #swagger.path = '/api/landingPads/'
  #swagger.method = 'post'
  #swagger.summary = 'Create a new landing pad'
  #swagger.parameters['x-auth-token'] = { description: 'Authorization token', required: true, type: 'string', in: 'header' }
  #swagger.responses[200] = {
    description: 'Successfully created landing pad',
   schema: { $ref: '#/definitions/LandingPad' }
  }
  #swagger.responses[400] = {
    description: 'Invalid request body',
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
     $name: 'LC-39A',
      $status: 'active',
      $location: 'Cape Canaveral, FL, USA'
   }
  }
 */
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const landingPad = new LandingPad({
    name: req.body.name,
    rocketId: req.body.rocketId,
    location: req.body.location,
    surfaceType: req.body.surfaceType
  });

  try {
    await landingPad.save();
    res.status(200).send(landingPad);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


router.get('/:id', async (req, res) => {
  /*
  #swagger.tags = ['Landing Pads']
  #swagger.description = 'Routes for managing landing pads'
  #swagger.path = '/api/landingPads/{id}'
  #swagger.method = 'get'
  #swagger.summary = 'Get a landing pad by ID'
  #swagger.parameters['x-auth-token'] = { description: 'Authorization token', required: true, type: 'string', in: 'header' }
  #swagger.parameters['id'] = { description: 'Landing pad ID', required: true }
  #swagger.responses[200] = {
    description: 'Successfully retrieved landing pad',
   schema: { $ref: '#/definitions/LandingPad' }
  }
  #swagger.responses[400] = {
    description: 'Invalid landing pad ID',
    schema: { $ref: '#/definitions/Error' }
  }
  #swagger.responses[404] = {
   description: 'Landing pad not found',
    schema: { $ref: '#/definitions/Error' }
  }
 */
  try {
    const landingPad = await LandingPad.findById(req.params.id);
    if (!landingPad) {
      return res.status(404).send('Landing pad not found.');
    }
    res.status(200).send(landingPad);
  } catch (err) {
    res.status(400).send('Invalid landing pad ID');
  }
});


router.put('/:id', authorizeAdmin, async (req, res) => {
/*
  #swagger.tags = ['Landing Pads']
  #swagger.description = 'Routes for managing landing pads'
  #swagger.path = '/api/landingPads/{id}'
  #swagger.method = 'put'
  #swagger.summary = 'Update a landing pad by ID'
  #swagger.parameters['x-auth-token'] = { description: 'Authorization token', required: true, type: 'string', in: 'header' }
  #swagger.parameters['id'] = { description: 'Landing pad ID', required: true }
  #swagger.responses[200] = {
    description: 'Successfully updated landing pad',
    schema: { $ref: '#/definitions/LandingPad' }
  }
  #swagger.responses[400] = {
   description: 'Invalid landing pad ID or request body',
    schema: { $ref: '#/definitions/Error' }
  }
  #swagger.responses[404] = {
    description: 'Landing pad not found',
    schema: { $ref: '#/definitions/Error' }
  }
 */
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const landingPad = await LandingPad.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        rocketId: req.body.rocketId,
        location: req.body.location,
        surfaceType: req.body.surfaceType
      },
      { new: true }
    );

    if (!landingPad) {
      return res.status(404).send('Landing pad not found');
    }

    res.status(200).send(landingPad);
  } catch (err) {
    res.status(400).send(err.message);
  }
});


router.delete('/:id', authorizeAdmin, async (req, res) => {
  /*
  #swagger.tags = ['Landing Pads']
  #swagger.description = 'Routes for managing landing pads'
  #swagger.path = '/api/landingPads/{id}'
  #swagger.method = 'delete'
  #swagger.summary = 'Delete a landing pad by ID'
  #swagger.parameters['x-auth-token'] = { description: 'Authorization token', required: true, type: 'string', in: 'header' }
  #swagger.parameters['id'] = { description: 'Landing pad ID', required: true }
  #swagger.responses[200] = {
    description: 'Successfully deleted landing pad',
    schema: { $ref: '#/definitions/LandingPad' }
  }
  #swagger.responses[400] = {
    description: 'Invalid landing pad ID',
    schema: { $ref: '#/definitions/Error' }
  }
  #swagger.responses[404] = {
   description: 'Landing pad not found',
    schema: { $ref: '#/definitions/Error' }
  }
 */
  try {
    const landingPad = await LandingPad.findByIdAndDelete(req.params.id);
    if (!landingPad) {
      return res.status(404).send('Landing pad not found.');
    }
    res.status(200).send(landingPad);
  } catch (err) {
    res.status(400).send('Invalid landing pad ID');
  }
});

module.exports = router;
