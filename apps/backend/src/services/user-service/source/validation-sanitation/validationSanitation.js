const Joi = require('joi');
const sanitizeHtml = require('sanitize-html');
const Slack = require('../validation-sanitation/sendSlackMessage')

/**
 * Middleware to validate and sanitize request body using Joi schema.
 * @param {Joi.ObjectSchema} schema - Joi validation schema
 * @param {Object} options - Optional configuration
 *        options.sanitize: array of field names to sanitize (default: [])
 */
function validateSanitize(schema, options = {}) {
  return (req, res, next) => {
   const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      Slack('User has attempted to input invalid text: ${req.body}');
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map((e) => e.message),
      });
    }

    // Replace the body with validated values
    req.body = value;

    // Optionally sanitize fields
    if (options.sanitize && Array.isArray(options.sanitize)) {
      for (const field of options.sanitize) {
        if (req.body[field]) {
          req.body[field] = sanitizeHtml(req.body[field], {
            allowedTags: [],
            allowedAttributes: {},
          });
        }
      }
    }

    next();
  };
}

module.exports = validateSanitize;
