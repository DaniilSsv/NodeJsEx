const Joi = require('joi');
const mongoose = require('mongoose');

const Agency = mongoose.model('agencies', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  location: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 255
  },
  contactEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (email) => {
        // Basic email validation
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
      },
      message: 'Invalid email format'
    }
  },
  establishedYear: {
    type: Number,
    required: true,
    min: 1800,
    max: new Date().getFullYear()
  },
  completedLaunches: {
    type: Number,
    default: 0
  },
  failedLaunches: {
    type: Number,
    default: 0
  }
}));

function validateAgency(agency) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    location: Joi.string().min(3).max(255).required(),
    contactEmail: Joi.string().email().required(),
    establishedYear: Joi.number().integer().min(1800).max(new Date().getFullYear()).required(),
    completedLaunches: Joi.number().integer().min(0).default(0),
    failedLaunches: Joi.number().integer().min(0).default(0)
  });

  return schema.validate(agency);
}

exports.Agency = Agency;
exports.validate = validateAgency;
