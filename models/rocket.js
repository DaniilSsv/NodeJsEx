const Joi = require('joi');
const joiObjectid = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const Rocket = mongoose.model('rockets', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  agencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agency',
    required: true
  },
  payloadCapacity: {
    type: Number,
    required: true,
    min: 0
  },
  fuelType: {
    type: String,
    required: true,
    enum: ['liquid', 'solid', 'hybrid']
  },
  launchDate: {
    type: Date,
    required: true
  }
}));

function validateRocket(rocket) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    agencyId: joiObjectid(Joi).required(),
    payloadCapacity: Joi.number().min(0).required(),
    fuelType: Joi.string().valid('liquid', 'solid', 'hybrid').required(),
    launchDate: Joi.date().required()
  });

  return schema.validate(rocket);
}

exports.Rocket = Rocket;
exports.validate = validateRocket;
