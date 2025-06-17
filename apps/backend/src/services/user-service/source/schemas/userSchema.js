const Joi = require('joi');

// For creating a user (POST /users)
const createUserSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required(),
  name: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required()
});

// For updating a user (PUT /users/:id)
const updateUserSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required()
});

module.exports = {
  createUserSchema,
  updateUserSchema
};
