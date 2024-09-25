const express = require('express');
const router = express.Router();
const { Agency, validate } = require('../models/agency');
const { authorizeAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const agencies = await Agency.find().sort('name');
    /*
     #swagger.tags = ['Agencies']
     #swagger.description = 'Get all agencies'
     #swagger.summary = 'Get all Agencies'
     #swagger.parameters['x-auth-token'] = { description: 'Authorization token', required: true, type: 'string', in: 'header' }
     #swagger.responses[200] = {
      description: 'A JSON array of all agencies',
        schema: {
          $ref: '#/definitions/Agency'
        }
      }
     #swagger.responses[400] = {
        description: 'Error fetching agencies',
        schema: {
          $ref: '#/definitions/Error'
        }
      }
     */
    res.status(200).send(agencies);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post('/', authorizeAdmin , async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  /*
    #swagger.tags = ['Agencies']
    #swagger.description = 'Create a new agency'
    #swagger.summary = 'Create a new Agency'
    #swagger.parameters['x-auth-token'] = { description: 'Authorization token', required: true, type: 'string', in: 'header' }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Agency information',
      required: true,
      schema: {
        name: 'NASA',
        location: 'USA',
        contactEmail: 'info@nasa.gov',
        establishedYear: 1958,
        completedLaunches: 100,
        failedLaunches: 10
      }
    }
    #swagger.responses[200] = {
      description: 'Successfully created agency',
     schema: {
        $ref: '#/definitions/Agency'
      }
    }
   #swagger.responses[400] = {
      description: 'Invalid request body',
      schema: {
        $ref: '#/definitions/Error'
      }
    }
   */
  const agency = new Agency({
    name: req.body.name,
    location: req.body.location,
    contactEmail: req.body.contactEmail,
    establishedYear: req.body.establishedYear,
    completedLaunches: req.body.completedLaunches,
    failedLaunches: req.body.failedLaunches
  });

  try {
    await agency.save();
    res.status(200).send(agency);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get('/:id', async (req, res) => {
  /*
    #swagger.tags = ['Agencies']
    #swagger.description = 'Get an agency by ID'
    #swagger.summary = 'Get an Agency by ID'
    #swagger.parameters['x-auth-token'] = { description: 'Authorization token', required: true, type: 'string', in: 'header' }
    #swagger.parameters['id'] = {
      description: 'Agency ID',
      required: true,
      type: 'string',
      format: 'ObjectId'
    }
    #swagger.responses[200] = {
      description: 'Successfully retrieved agency',
      schema: {
        $ref: '#/definitions/Agency'
      }
    }
    #swagger.responses[400] = {
      description: 'Invalid agency ID',
      schema: {
        $ref: '#/definitions/Error'
     }
    }
    #swagger.responses[404] = {
      description: 'Agency not found',
      schema: {
       $ref: '#/definitions/Error'
      }
    }
   */
  try {
    const agency = await Agency.findById(req.params.id);
    if (!agency) {
      return res.status(404).send('Agency not found.');
    }
    res.status(200).send(agency);
  } catch (err) {
    res.status(400).send('Invalid agency ID');
  }
});

router.put('/:id', authorizeAdmin, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  /*
    #swagger.tags = ['Agencies']
    #swagger.description = 'Update an agency by ID'
    #swagger.summary = 'Update an Agency by ID'
    #swagger.parameters['x-auth-token'] = { description: 'Authorization token', required: true, type: 'string', in: 'header' }
    #swagger.parameters['id'] = {
      description: 'Agency ID',
      required: true,
      type: 'string',
      format: 'ObjectId'
   }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Agency data',
      required: true,
      schema: {
        name: 'Updated Agency Name',
        location: 'Updated Location',
        contactEmail: 'updated@agency.com',
        establishedYear: 2020,
        completedLaunches: 50,
        failedLaunches: 5
      }
    }
    #swagger.responses[200] = {
     description: 'Successfully updated agency',
     schema: {
        $ref: '#/definitions/Agency'
     }
    }
    #swagger.responses[400] = {
      description: 'Invalid agency ID or request body',
      schema: {
        $ref: '#/definitions/Error'
      }
    }
    #swagger.responses[404] = {
      description: 'Agency not found',
      schema: {
        $ref: '#/definitions/Error'
      }
    }
   */
  try {
    const agency = await Agency.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        location: req.body.location,
        contactEmail: req.body.contactEmail,
        establishedYear: req.body.establishedYear,
        completedLaunches: req.body.completedLaunches,
        failedLaunches: req.body.failedLaunches
      },
      { new: true }
    );

    if (!agency) {
      return res.status(404).send('Agency not found');
    }

    res.status(200).send(agency);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.delete('/:id', authorizeAdmin, async (req, res) => {
  /*
    #swagger.tags = ['Agencies']
    #swagger.description = 'Delete an agency by ID'
    #swagger.summary = 'Delete an Agency by ID'
    #swagger.parameters['x-auth-token'] = { description: 'Authorization token', required: true, type: 'string', in: 'header' }
    #swagger.parameters['id'] = {
      description: 'Agency ID',
      required: true,
      type: 'string',
     format: 'ObjectId'
    }
    #swagger.responses[200] = {
      description: 'Successfully deleted agency',
      schema: {
       $ref: '#/definitions/Agency'
      }
    }
    #swagger.responses[400] = {
      description: 'Invalid agency ID',
      schema: {
        $ref: '#/definitions/Error'
      }
    }
    #swagger.responses[404] = {
      description: 'Agency not found',
      schema: {
        $ref: '#/definitions/Error'
      }
    }
   */
  try {
    const agency = await Agency.findByIdAndDelete(req.params.id);
    if (!agency) {
      return res.status(404).send('Agency not found.');
    }
    res.status(200).send(agency);
  } catch (err) {
    res.status(400).send('Invalid agency ID');
  }
});

module.exports = router;
