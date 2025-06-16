const express = require('express');
const router = express.Router();

const { createUserSchema } = require('../schemas/userSchema');
const validateAndSanitize = require('../validationSanitation/validateSanitize');

router.post(
  '/create',
  validateSanitize(createUserSchema, { sanitize: ['name, email'] }),
  async (req, res) => {
    const { name, email, bio } = req.body;

    // Create user logic here
    res.status(201).json({ message: 'User created', data: { name, email, bio } });
  }
);

module.exports = router;
