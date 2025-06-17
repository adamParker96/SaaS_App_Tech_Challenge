const express = require('express');
const router = express.Router();
const { createUserSchema, updateUserSchema } = require('../schemas/userSchema');
const validateSanitize = require('../validation-sanitation/validationSanitation');
const {
  getAllUsers,
  getUserByID,
  getUserByEmail,
  createUser,
  deleteUser,
  updateUser
} = require('../controllers/userController');

//  GET /users - Get all users (with caching)
router.get('/', getAllUsers);

//  GET /users/id/:id - Get user by ID (with caching)
router.get('/id/:id', getUserByID);

//  GET /users/name/:name - Get user by name (with caching)
router.get('/email/:email', getUserByName);

//  POST /users - Create a new user
router.post(
  '/',
  validateSanitize(createUserSchema, { sanitize: ['name', 'email'] }),
  createUser
);

//  PUT /users/:id - Update a user
router.put(
  '/:id',
  validateSanitize(updateUserSchema, { sanitize: ['name', 'email'] }),
  updateUser
);

// DELETE  /users/:id - Delete a user
router.delete('/:id', deleteUser);

module.exports = router;
