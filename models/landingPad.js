const Joi = require('joi');
const joiObjectid = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const LandingPad = mongoose.model('landingpads', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  rocketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rocket',
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 255
  },
  surfaceType: {
    type: String,
    required: true,
    enum: ['concrete', 'asphalt', 'regolith', 'water']
  }
}));

function validateLandingPad(landingPad) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    rocketId: joiObjectid(Joi).required(),
    location: Joi.string().min(3).max(255).required(),
    surfaceType: Joi.string().valid('concrete', 'asphalt', 'regolith', 'water').required()
  });

  return schema.validate(landingPad);
}

exports.LandingPad = LandingPad;
exports.validate = validateLandingPad;
