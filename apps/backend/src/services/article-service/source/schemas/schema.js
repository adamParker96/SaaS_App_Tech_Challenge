const Joi = require('joi');

const createArticleSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  content: Joi.string().min(10).required(),
  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ).optional(), // supports both comma-separated string or array
  author_id: Joi.number().integer().positive().required(),
});

const updateArticleSchema = Joi.object({
  title: Joi.string().min(3).max(255).optional(),
  content: Joi.string().min(10).optional(),
  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ).optional(),
});

module.exports = {
  createArticleSchema,
  updateArticleSchema,
};
