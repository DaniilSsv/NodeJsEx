const express = require('express');
const router = express.Router();
const { Rocket, validate } = require('../models/rocket');
const { authorizeAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  /*
  #swagger.tags = ['Rockets']
  #swagger.description = 'Routes for managing rockets'
  #swagger.path = '/api/rockets/'
  #swagger.method = 'get'
  #swagger.summary = 'Get all rockets'
  #swagger.parameters['x-auth-token'] = { description: 'Authorization token', required: true, type: 'string', in: 'header' }
  #swagger.responses[200] = {
    description: 'Successfully retrieved rockets',
    schema: { $ref: '#/definitions/Rocket' }
 }
  #swagger.responses[400] = {
    description: 'Error fetching rockets',
    schema: { $ref: '#/definitions/Error' }
  }
 */
  try {
    const rockets = await Rocket.find().sort('name');
    res.send(rockets);
  } catch (err) {
    res.status(400).send(err.message);
  }
});


router.post('/', authorizeAdmin, async (req, res) => {
  /*
  #swagger.tags = ['Rockets']
  #swagger.description = 'Routes for managing rockets'
  #swagger.path = '/api/rockets/'
  #swagger.method = 'post'
  #swagger.summary = 'Create a new rocket'
  #swagger.parameters['x-auth-token'] = { description: 'Authorization token', required: true, type: 'string', in: 'header' }
  #swagger.responses[200] = {
    description: 'Successfully created rocket',
   schema: { $ref: '#/definitions/Rocket' }
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
      $name: 'Falcon 9',
      $agencyId: '5e79dfb4a61a9c001722e492',
      $payloadCapacity: 22800,
      $fuelType: 'liquid',
      $launchDate: '2024-05-01'
   }
  }
 */
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const rocket = new Rocket({
    name: req.body.name,
    agencyId: req.body.agencyId,
    payloadCapacity: req.body.payloadCapacity,
    fuelType: req.body.fuelType,
    launchDate: req.body.launchDate
  });

  try {
    await rocket.save();
    res.status(200).send(rocket);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


router.get('/:id', authorizeAdmin, async (req, res) => {
  /*
  #swagger.tags = ['Rockets']
  #swagger.description = 'Routes for managing rockets'
  #swagger.path = '/api/rockets/{id}'
  #swagger.method = 'get'
  #swagger.summary = 'Get a rocket by ID'
  #swagger.parameters['x-auth-token'] = { description: 'Authorization token', required: true, type: 'string', in: 'header' }
  #swagger.parameters['id'] = { description: 'Rocket ID', required: true }
 #swagger.responses[200] = {
    description: 'Successfully retrieved rocket',
    schema: { $ref: '#/definitions/Rocket' }
  }
  #swagger.responses[400] = {
    description: 'Invalid rocket ID',
    schema: { $ref: '#/definitions/Error' }
  }
  #swagger.responses[404] = {
   description: 'Rocket not found',
    schema: { $ref: '#/definitions/Error' }
  }
 */
  try {
    const rocket = await Rocket.findById(req.params.id);
    if (!rocket) {
      return res.status(404).send('Rocket not found.');
    }
    res.status(200).send(rocket);
  } catch (err) {
    res.status(400).send('Invalid rocket ID');
  }
});

router.put('/:id', authorizeAdmin, async (req, res) => {
  /*
  #swagger.tags = ['Rockets']
  #swagger.description = 'Routes for managing rockets'
  #swagger.path = '/api/rockets/{id}'
  #swagger.method = 'put'
  #swagger.summary = 'Update a rocket by ID'
  #swagger.parameters['x-auth-token'] = { description: 'Authorization token', required: true, type: 'string', in: 'header' }
  #swagger.parameters['id'] = { description: 'Rocket ID', required: true }
  #swagger.responses[200] = {
    description: 'Successfully updated rocket',
   schema: { $ref: '#/definitions/Rocket' }
  }
  #swagger.responses[400] = {
    description: 'Invalid rocket ID or request body',
    schema: { $ref: '#/definitions/Error' }
  }
  #swagger.responses[404] = {
   description: 'Rocket not found',
    schema: { $ref: '#/definitions/Error' }
  }
 */
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const rocket = await Rocket.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        agencyId: req.body.agencyId,
        payloadCapacity: req.body.payloadCapacity,
        fuelType: req.body.fuelType,
        launchDate: req.body.launchDate
      },
      { new: true }
    );

    if (!rocket) {
      return res.status(404).send('Rocket not found');
    }

    res.status(200).send(rocket);
  } catch (err) {
    res.status(400).send(err.message);
  }
});


router.delete('/:id', authorizeAdmin, async (req, res) => {
  /*
  #swagger.tags = ['Rockets']
  #swagger.description = 'Routes for managing rockets'
  #swagger.path = '/api/rockets/{id}'
  #swagger.method = 'delete'
  #swagger.summary = 'Delete a rocket by ID'
  #swagger.parameters['x-auth-token'] = { description: 'Authorization token', required: true, type: 'string', in: 'header' }
  #swagger.parameters['id'] = { description: 'Rocket ID', required: true }
  #swagger.responses[200] = {
    description: 'Successfully deleted rocket',
    schema: { $ref: '#/definitions/Rocket' }
  }
  #swagger.responses[400] = {
    description: 'Invalid rocket ID',
    schema: { $ref: '#/definitions/Error' }
  }
  #swagger.responses[404] = {
    description: 'Rocket not found',
    schema: { $ref: '#/definitions/Error' }
  }
 */
  try {
    const rocket = await Rocket.findByIdAndDelete(req.params.id);
    if (!rocket) {
      return res.status(404).send('Rocket not found.');
    }
    res.status(200).send(rocket);
  } catch (err) {
    res.status(400).send('Invalid rocket ID');
  }
});

module.exports = router;
