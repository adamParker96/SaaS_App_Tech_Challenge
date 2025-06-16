// schemas/userSchema.js
const Joi = require('joi');

const createUserSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required(),
});

module.exports = {
  createUserSchema,
};
